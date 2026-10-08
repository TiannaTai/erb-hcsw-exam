(async function(){
  const primaryUrl = '../questions/question-bank.ndjson';
  const fallbackUrl = '../questions/sample-questions.ndjson';

  async function loadQuestions() {
    try {
      const text = await fetch(primaryUrl).then(r => r.text());
      const q = text.split('\n').filter(Boolean).map(l => JSON.parse(l));
      if (q.length && q.some(item => item.media)) return q;
    } catch (e) {}
    const text = await fetch(fallbackUrl).then(r => r.text());
    return text.split('\n').filter(Boolean).map(l => JSON.parse(l));
  }

  const questions = await loadQuestions();
  const weakIds = new Set(JSON.parse(localStorage.getItem('erbWeakIds') || '[]'));
  const modules = Array.from(new Set(questions.map(q => q.module))).sort();

  const moduleStats = modules.map(module => {
    const list = questions.filter(q => q.module === module);
    const weakCount = list.filter(q => weakIds.has(q.id)).length;
    const accuracy = list.length ? ((list.length - weakCount) / list.length) * 100 : 100;
    return { module, total: list.length, weakCount, accuracy };
  }).sort((a, b) => b.weakCount - a.weakCount || a.module.localeCompare(b.module));

  const summaryEl = document.getElementById('summary');
  const listEl = document.getElementById('moduleList');
  const totalWeak = weakIds.size;
  const topThree = moduleStats.filter(m => m.weakCount > 0).slice(0, 3);

  summaryEl.innerHTML = `
    <div class="card">
      <div data-cn="錯題總數" data-en="Total mistakes">錯題總數</div>
      <h2>${totalWeak}</h2>
    </div>
    <div class="card">
      <div data-cn="待加強模組" data-en="Modules to improve">待加強模組</div>
      <h2>${topThree.length || 0}</h2>
    </div>
    <div class="card">
      <div data-cn="最弱模組" data-en="Weakest module">最弱模組</div>
      <h2>${topThree[0] ? topThree[0].module : '無'}</h2>
    </div>
    <div class="card">
      <div data-cn="建議策略" data-en="Strategy">建議策略</div>
      <h2 data-cn="優先重做" data-en="Prioritize review">優先重做</h2>
    </div>
  `;

  function applyLanguage() {
    const isEnglish = localStorage.getItem('erbLang') === 'en';
    document.querySelectorAll('[data-cn]').forEach(el => {
      el.textContent = isEnglish ? (el.dataset.en || el.textContent) : (el.dataset.cn || el.textContent);
    });
  }

  if (!topThree.length) {
    listEl.innerHTML = '<div class="card"><h3 data-cn="目前沒有錯題紀錄" data-en="No mistakes recorded yet">目前沒有錯題紀錄</h3><p data-cn="請先進入題庫作答，錯題會自動加入弱點清單。" data-en="Please answer questions in the quiz first; mistakes will be added to the weak-point list automatically.">請先進入題庫作答，錯題會自動加入弱點清單。</p></div>';
    applyLanguage();
    return;
  }

  listEl.innerHTML = moduleStats.map(mod => {
    const pct = Math.max(0, Math.min(100, mod.accuracy));
    const priorityText = mod.weakCount > 0 ? `弱點 ${mod.weakCount} 題` : '穩定';
    const priorityTextEn = mod.weakCount > 0 ? `Weak points: ${mod.weakCount}` : 'Stable';
    return `
      <div class="module-card">
        <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap;">
          <h3 style="margin:0;">${mod.module}</h3>
          <span data-cn="${priorityText}" data-en="${priorityTextEn}">${priorityText}</span>
        </div>
        <div data-cn="正確率" data-en="Accuracy">正確率</div>：${pct.toFixed(0)}% / <span data-cn="錯題" data-en="Mistakes">錯題</span>：${mod.weakCount} / <span data-cn="總題數" data-en="Total">總題數</span>：${mod.total}
        <div class="bar"><span style="width:${100 - pct}%"></span></div>
        <div class="button-row">
          <a class="button" href="./quiz.html?mode=weak-points&module=${encodeURIComponent(mod.module)}" data-cn="重做弱點" data-en="Review weak points">重做弱點</a>
          <a class="button" href="./quiz.html?module=${encodeURIComponent(mod.module)}&mode=study" data-cn="練習此模組" data-en="Practice this module">練習此模組</a>
        </div>
      </div>
    `;
  }).join('');

  applyLanguage();
})();
