// quiz.js — prototype logic
(async function(){
  const raw = await fetch('../questions/sample-questions.ndjson').then(r=>r.text());
  const lines = raw.split('\n').filter(Boolean);
  const questions = lines.map(l=>JSON.parse(l));

  const moduleFilter = document.getElementById('moduleFilter');
  const typeFilter = document.getElementById('typeFilter');
  const startBtn = document.getElementById('startBtn');
  const quizArea = document.getElementById('quizArea');
  const langToggle = document.getElementById('langToggle');
  const scoreSpan = document.getElementById('score');

  const modules = Array.from(new Set(questions.map(q=>q.module))).sort();
  modules.forEach(m=>{const o=document.createElement('option');o.value=m;o.textContent=m;moduleFilter.appendChild(o)});

  let currentSet = [];
  let index = 0;
  let correctCount = 0;
  const showEnglish = ()=>langToggle.checked;

  function renderQuestion(q){
    quizArea.innerHTML = '';
    const div = document.createElement('div');div.className='question';
    const qText = document.createElement('div');
    qText.innerHTML = '<strong>'+ (showEnglish()?q.question_en:q.question_cn) +'</strong>';
    div.appendChild(qText);

    if(q.type==='mcq'){
      const choicesDiv = document.createElement('div');choicesDiv.className='choices';
      q.choices.forEach(c=>{
        const btn = document.createElement('button');
        btn.type='button';
        btn.innerText = (showEnglish()?c.text_en:c.text_cn);
        btn.onclick = ()=>{
          const correct = c.correct===true;
          if(correct){
            btn.classList.add('correct');
            feedback(true,q);
          } else {
            btn.classList.add('wrong');
            feedback(false,q);
          }
          Array.from(choicesDiv.children).forEach(b=>b.disabled=true);
        };
        choicesDiv.appendChild(btn);
      });
      div.appendChild(choicesDiv);
    } else {
      const ta = document.createElement('textarea');ta.rows=4;ta.style.width='100%';
      div.appendChild(ta);
      const submit = document.createElement('button');submit.textContent='提交';
      submit.onclick = ()=>{
        const user = ta.value.trim();
        const correct = q.answer && user.length>0; // 简化判定，人工審核需改進
        feedback(Boolean(user.length>0),q);
        ta.disabled=true;submit.disabled=true;
      };
      div.appendChild(submit);
    }

    const explain = document.createElement('div');explain.className='explain';explain.style.marginTop='8px';
    div.appendChild(explain);

    quizArea.appendChild(div);
  }

  function feedback(isCorrect,q){
    const explain = quizArea.querySelector('.explain');
    if(isCorrect){
      explain.innerHTML = '<div style="color:green"><strong>回答正確</strong></div>' +
        '<div>'+(showEnglish()?q.explanation_en:q.explanation_cn) +'</div>';
      correctCount++;
    } else {
      explain.innerHTML = '<div style="color:red"><strong>回答錯誤</strong></div>';
      // show first hint if available
      if(q.hints && q.hints.length>0){
        const hint = document.createElement('div');hint.className='hint';
        hint.textContent = (showEnglish()?q.hints[0]:q.hints[0]);
        explain.appendChild(hint);
      }
      explain.innerHTML += '<div>'+(showEnglish()?q.explanation_en:q.explanation_cn) +'</div>';
    }
    scoreSpan.textContent = `Progress: ${index+1}/${currentSet.length}  Correct: ${correctCount}`;

    // next question button
    const next = document.createElement('button');next.textContent='下一題';next.style.marginTop='8px';
    next.onclick = ()=>{index++;if(index<currentSet.length) renderQuestion(currentSet[index]); else finish();};
    explain.appendChild(next);
  }

  function finish(){
    quizArea.innerHTML = `<div class="question"><h3>測驗結束</h3><p>總題數：${currentSet.length}</p><p>答對：${correctCount}</p></div>`;
    scoreSpan.textContent = '';
  }

  startBtn.onclick = ()=>{
    // build filtered set
    const m = moduleFilter.value; const t = typeFilter.value;
    currentSet = questions.filter(q=>(m==='all'||q.module===m) && (t==='all'||q.type===t));
    if(currentSet.length===0){quizArea.innerHTML='<p>沒有符合條件的題目。</p>';return}
    // simple shuffle
    currentSet.sort(()=>Math.random()-0.5);
    index=0;correctCount=0;renderQuestion(currentSet[0]);
  };

  langToggle.onchange = ()=>{ // rerender current question texts
    if(currentSet.length>0 && index<currentSet.length) renderQuestion(currentSet[index]);
  };

})();
