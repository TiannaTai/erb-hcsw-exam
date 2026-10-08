(async function(){
  const entries = await fetch('../data/encyclopedia.json').then(r => r.json());
  const listEl = document.getElementById('list');

  entries.forEach(entry => {
    const div = document.createElement('div');
    div.className = 'entry';

    const qLinks = (entry.linked_questions || []).map(q => `<a href="./quiz.html?focus=${q}">${q}</a>`).join(', ') || '無';

    div.innerHTML = `
      <h3>${entry.title_cn} / <small>${entry.title_en}</small></h3>
      <div><strong>摘要：</strong>${entry.summary_cn}</div>
      <div style="color:#555; margin-top: 6px;">${entry.summary_en}</div>
      <div class="tags" style="margin-top: 8px;"><strong>標籤：</strong>${(entry.related_tags || []).join(', ')}</div>
      <div style="margin-top: 8px;"><strong>關聯題目：</strong>${qLinks}</div>
    `;
    listEl.appendChild(div);
  });
})();
