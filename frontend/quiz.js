// quiz.js — study, exam, and weak-point review modes
(async function(){
  const primaryUrl = '../questions/question-bank.ndjson';
  const fallbackUrl = '../questions/sample-questions.ndjson';

  let questions = [];
  try {
    const text = await fetch(primaryUrl).then(r => r.text());
    const lines = text.split('\n').filter(Boolean);
    questions = lines.map(l => JSON.parse(l));
  } catch (err) {
    const text = await fetch(fallbackUrl).then(r => r.text());
    const lines = text.split('\n').filter(Boolean);
    questions = lines.map(l => JSON.parse(l));
  }

  const moduleFilter = document.getElementById('moduleFilter');
  const typeFilter = document.getElementById('typeFilter');
  const modeFilter = document.getElementById('modeFilter');
  const startBtn = document.getElementById('startBtn');
  const quizArea = document.getElementById('quizArea');
  const langToggle = document.getElementById('langToggle');
  const scoreSpan = document.getElementById('score');
  const timerSpan = document.getElementById('timer');
  const statusSpan = document.getElementById('status');

  const modules = Array.from(new Set(questions.map(q => q.module))).sort();
  modules.forEach(m => {
    const o = document.createElement('option');
    o.value = m; o.textContent = m;
    moduleFilter.appendChild(o);
  });

  const params = new URLSearchParams(window.location.search);
  const urlMode = params.get('mode');
  const urlModule = params.get('module');
  if (urlMode) modeFilter.value = urlMode;
  if (urlModule) moduleFilter.value = urlModule;

  const state = {
    currentSet: [],
    index: 0,
    correctCount: 0,
    timerId: null,
    timeLimit: 300,
    startedAt: 0,
    mode: 'study',
    weakIds: JSON.parse(localStorage.getItem('erbWeakIds') || '[]')
  };

  const showEnglish = () => langToggle.checked;

  function loadWeakIds(){
    return JSON.parse(localStorage.getItem('erbWeakIds') || '[]');
  }

  function saveWeakIds(ids){
    localStorage.setItem('erbWeakIds', JSON.stringify(ids));
  }

  function setStatus(msg){
    if (statusSpan) statusSpan.textContent = msg || '';
  }

  function stopTimer(){
    clearInterval(state.timerId);
    state.timerId = null;
    if (timerSpan) timerSpan.textContent = '—';
  }

  function startTimer(limitSec){
    clearInterval(state.timerId);
    state.startedAt = Date.now();
    const deadline = state.startedAt + limitSec * 1000;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      if (timerSpan) timerSpan.textContent = `${remaining}s`;
      if (remaining <= 0) {
        clearInterval(state.timerId);
        setStatus('時間到！請查看結果。');
        finish();
      }
    };
    tick();
    state.timerId = setInterval(tick, 1000);
  }

  function ensureUnique(list){
    return [...new Set(list)];
  }

  function filteredQuestions(mode){
    const m = moduleFilter.value;
    const t = typeFilter.value;
    let list = questions.filter(q => (m === 'all' || q.module === m) && (t === 'all' || q.type === t));

    if (mode === 'weak-points') {
      const weakIds = loadWeakIds();
      list = list.filter(q => weakIds.includes(q.id));
    }

    if (mode === 'exam') {
      return list.slice().sort(() => Math.random() - 0.5).slice(0, Math.min(20, list.length));
    }

    return list.slice().sort(() => Math.random() - 0.5);
  }

  function renderQuestion(q){
    quizArea.innerHTML = '';
    const div = document.createElement('div'); div.className = 'question';
    const qText = document.createElement('div');
    qText.innerHTML = '<strong>' + (showEnglish() ? q.question_en : q.question_cn) + '</strong>';
    div.appendChild(qText);

    if (q.type === 'mcq') {
      const choicesDiv = document.createElement('div'); choicesDiv.className = 'choices';
      q.choices.forEach(c => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.innerText = (showEnglish() ? c.text_en : c.text_cn);
        btn.onclick = () => {
          const correct = c.correct === true;
          if (correct) {
            btn.classList.add('correct');
            feedback(true, q);
          } else {
            btn.classList.add('wrong');
            feedback(false, q);
          }
          Array.from(choicesDiv.children).forEach(b => b.disabled = true);
        };
        choicesDiv.appendChild(btn);
      });
      div.appendChild(choicesDiv);
    } else {
      const ta = document.createElement('textarea');
      ta.rows = 4; ta.style.width = '100%';
      div.appendChild(ta);

      const submit = document.createElement('button');
      submit.textContent = '提交';
      submit.onclick = () => {
        const user = ta.value.trim();
        const isShortAnswer = user.length > 0;
        feedback(isShortAnswer, q);
        ta.disabled = true; submit.disabled = true;
      };
      div.appendChild(submit);
    }

    const explain = document.createElement('div');
    explain.className = 'explain';
    explain.style.marginTop = '8px';
    div.appendChild(explain);
    quizArea.appendChild(div);
  }

  function feedback(isCorrect, q){
    const explain = quizArea.querySelector('.explain');
    if (isCorrect) {
      explain.innerHTML = '<div style="color:green"><strong>回答正確</strong></div>' +
        '<div>' + (showEnglish() ? q.explanation_en : q.explanation_cn) + '</div>';
      state.correctCount++;
    } else {
      explain.innerHTML = '<div style="color:red"><strong>回答錯誤</strong></div>';
      const weakIds = loadWeakIds();
      weakIds.push(q.id);
      saveWeakIds(ensureUnique(weakIds));
      if (q.hints && q.hints.length > 0) {
        const hint = document.createElement('div');
        hint.className = 'hint';
        hint.textContent = q.hints[0];
        explain.appendChild(hint);
      }
      explain.innerHTML += '<div>' + (showEnglish() ? q.explanation_en : q.explanation_cn) + '</div>';
    }

    scoreSpan.textContent = `進度: ${state.index + 1}/${state.currentSet.length}  正確: ${state.correctCount}`;
    const next = document.createElement('button');
    next.textContent = '下一題';
    next.style.marginTop = '8px';
    next.onclick = () => {
      state.index += 1;
      if (state.index < state.currentSet.length) renderQuestion(state.currentSet[state.index]);
      else finish();
    };
    explain.appendChild(next);
  }

  function finish(){
    stopTimer();
    quizArea.innerHTML = `
      <div class="question">
        <h3>測驗結束</h3>
        <p>總題數：${state.currentSet.length}</p>
        <p>答對：${state.correctCount}</p>
        <p><a href="./diagnostics.html">查看弱點診斷</a></p>
      </div>
    `;
    scoreSpan.textContent = '結果已生成';
    setStatus('建議使用「弱點重做」模式進一步精修。');
  }

  function startQuiz(){
    const mode = modeFilter.value;
    state.mode = mode;
    state.currentSet = filteredQuestions(mode);
    if (state.currentSet.length === 0) {
      quizArea.innerHTML = '<p>沒有符合條件的題目，請調整模組或題型。</p>';
      stopTimer();
      return;
    }
    state.index = 0;
    state.correctCount = 0;
    setStatus(mode === 'exam' ? '考試模式：請在時間內作答' : mode === 'weak-points' ? '弱點重做：優先補強錯題' : '學習模式：逐題練習');
    const limit = mode === 'exam' ? 300 : 0;
    if (limit > 0) startTimer(limit);
    else stopTimer();
    renderQuestion(state.currentSet[0]);
  }

  function startFromFocus(){
    const focusId = params.get('focus');
    if (!focusId) return;
    const match = questions.find(q => q.id === focusId);
    if (!match) return;
    state.currentSet = [match];
    state.index = 0;
    state.correctCount = 0;
    setStatus('定位題目：' + focusId);
    renderQuestion(match);
  }

  startBtn.onclick = startQuiz;
  langToggle.onchange = () => {
    if (state.currentSet.length > 0 && state.index < state.currentSet.length) {
      renderQuestion(state.currentSet[state.index]);
    }
  };

  if (params.get('focus')) startFromFocus();
  else startQuiz();
})();
