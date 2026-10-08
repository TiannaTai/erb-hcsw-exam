// app.js - client-side generator and UI
(() => {
  const MODULES = {
    "急救與復甦": ["心肺復甦","氣道管理","CPR","急性呼吸衰竭","除顫","緊急應變"],
    "藥物護理": ["給藥安全","藥效觀察","副作用","劑量","注射","口服藥"],
    "感染控制": ["手部衛生","標準預防","隔離","清消","滅菌","暴露處理"],
    "精神護理": ["焦慮","憂鬱","幻覺","情緒穩定","自傷風險","躁動"],
    "基礎護理": ["活動照護","沐浴","轉位","生活照護","安全","衛生"],
    "呼吸照護": ["氧療","吸痰","胸部評估","呼吸窘迫","氣道清除","氧飽和"],
    "母嬰護理": ["新生兒評估","哺乳","產後照護","黃疸","分娩","乳房護理"],
    "疼痛管理": ["疼痛評估","術後疼痛","慢性疼痛","非藥物緩解","鎮痛","疼痛教育"],
    "泌尿護理": ["排尿評估","導尿","失禁","尿路感染","尿量監測","膀胱功能"],
    "檢驗與影像": ["抽血","檢體","禁食","影像準備","檢查安全","檢驗解讀"],
    "內科護理": ["發燒","低血糖","高血糖","胸痛","腹痛","呼吸困難"],
    "骨科護理": ["骨折","固定","神經血管","復健","牽引","疼痛管理"],
    "營養照護": ["營養評估","高蛋白","吞嚥","低鹽","補充飲食","營養教育"],
    "病人安全": ["跌倒預防","壓瘡預防","交接","防護裝備","識別","環境安全"],
    "評估與紀錄": ["生命徵象","病歷","紀錄","病情變化","文書","觀察"]
  };

  function shortHash(s){
    let h=0; for(let i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i);h|=0} return (h>>>0).toString(16).slice(-8)
  }

  function makeQuestion(i){
    const modules = Object.keys(MODULES);
    const module = modules[(i-1)%modules.length];
    const topics = MODULES[module];
    const topic = topics[(i-1)%topics.length];
    const difficulty = (i%4===0)?'easy':(i%3===0)?'medium':'hard';
    const stem = `病人${topic}時，最重要的護理行動是什麼？`;
    const en = stem.replace(/病人/g,'patient').replace(/護理師/g,'nurse');
    const answer = module==='急救與復甦'? '先評估生命徵象並啟動急救流程' : '確認病人身份與醫囑';
    const choices = [answer, '等待家屬決定', '延後至下一班', '忽略評估'];
    for(let j=choices.length-1;j>0;j--){const k=Math.floor(Math.random()*(j+1));[choices[j],choices[k]]=[choices[k],choices[j]]}
    const choiceObjs = choices.map(c=>({text_cn:c,text_en:c,correct:c===answer}));
    return {
      id:`Q${String(i).padStart(4,'0')}`,
      module,module, type:'mcq', difficulty, difficulty_level: difficulty==='easy'?1: difficulty==='medium'?2:4,
      question_cn:stem, question_en:en, choices:choiceObjs,
      tags:[module,topic], dedupe_key: shortHash(module+topic+stem)
    };
  }

  function generateBank(n){
    const out=[]; const seen=new Set(); let i=101; while(out.length<n){const q=makeQuestion(i); if(!seen.has(q.dedupe_key)){out.push(q); seen.add(q.dedupe_key)} i++}
    return out;
  }

  const datasetSelect=document.getElementById('datasetSelect');
  const moduleFilter=document.getElementById('moduleFilter');
  const difficultyFilter=document.getElementById('difficultyFilter');
  const searchBox=document.getElementById('searchBox');
  const regenBtn=document.getElementById('regenBtn');
  const downloadJsonl=document.getElementById('downloadJsonl');
  const downloadCsv=document.getElementById('downloadCsv');
  const list=document.getElementById('list');
  const summary=document.getElementById('summary');

  let currentBank=[];
  let fallbackNotice = '';

  function populateModuleOptions(bank){
    const mods=[...new Set(bank.map(q=>q.module))];
    moduleFilter.innerHTML='<option value="all">全部模組</option>'+mods.map(m=>`<option value="${m}">${m}</option>`).join('');
  }

  function render(bank){
    const qcount=bank.length;
    summary.innerHTML = `<strong>題數:</strong> ${qcount} 題${fallbackNotice ? ` <span style="color:#b45309;">| ${fallbackNotice}</span>` : ''}`;
    const filtered=bank.filter(q=>{
      const modOk = moduleFilter.value==='all' || q.module===moduleFilter.value;
      const diffOk = difficultyFilter.value==='all' || q.difficulty===difficultyFilter.value;
      const qtxt = `${q.id} ${q.module} ${q.question_cn} ${q.question_en} ${q.tags.join(' ')}`.toLowerCase();
      const searchOk = !searchBox.value || qtxt.includes(searchBox.value.toLowerCase());
      return modOk && diffOk && searchOk;
    });
    list.innerHTML = filtered.slice(0,200).map(q=>`<div class="card"><div class="meta"><strong>${q.id}</strong> · ${q.module} · ${q.difficulty}</div><h3>${q.question_cn}</h3><p><em>${q.question_en}</em></p><ul>${q.choices.map(c=>`<li>${c.text_cn}${c.correct?'<strong style="color:var(--success)"> (正確)</strong>':''}</li>`).join('')}</ul></div>`).join('');
    if(filtered.length>200) list.innerHTML += `<div class="card" style="grid-column:1/-1"><em>顯示前200題，搜尋或篩選可縮小結果。</em></div>`;
  }

  function regen(){
    const n = Number(datasetSelect.value);
    currentBank = generateBank(n);
    populateModuleOptions(currentBank);
    render(currentBank);
  }

  function download(filename, text){
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'})); a.download=filename; document.body.appendChild(a); a.click(); a.remove();
  }

  function toJsonl(bank){ return bank.map(r=>JSON.stringify(r, null, 0)).join('\n') + '\n'; }
  function toCsv(bank){
    const rows = [['id','module','difficulty','question_cn','question_en','correct_answer','tags']];
    for(const r of bank){
      const ans = r.choices.find(c=>c.correct).text_cn;
      rows.push([r.id,r.module,r.difficulty,`"${r.question_cn.replace(/"/g,'""')}` ,`"${r.question_en.replace(/"/g,'""')}`,`"${ans.replace(/"/g,'""')}`,`"${r.tags.join(';')}` ]);
    }
    return rows.map(r=>r.join(',')).join('\n');
  }

  async function loadData(){
    const fallback = generateBank(60);
    const candidates = [
      '../nursing_questions_Q0101-Q1000.jsonl',
      './nursing_questions_Q0101-Q1000.jsonl',
      '../questions'
    ];

    try {
      const resp = await fetch(candidates[0], { cache: 'no-store' });
      if (!resp.ok) throw new Error('No JSONL file found');
      const text = await resp.text();
      const rows = text.trim().split('\n').filter(Boolean).map(line => JSON.parse(line));
      if (!rows.length) throw new Error('Empty dataset');
      currentBank = rows;
      fallbackNotice = '';
    } catch (err) {
      currentBank = fallback;
      fallbackNotice = '未找到 JSONL 檔，已自動生成本地示例題庫';
      console.warn('Using fallback bank because JSONL file was missing:', err);
    }

    populateModuleOptions(currentBank);
    render(currentBank);
  }

  regenBtn.addEventListener('click', () => {
    const n = Number(datasetSelect.value);
    currentBank = generateBank(n);
    fallbackNotice = '已重新生成示例題庫';
    populateModuleOptions(currentBank);
    render(currentBank);
  });

  moduleFilter.addEventListener('change', ()=>render(currentBank));
  difficultyFilter.addEventListener('change', ()=>render(currentBank));
  searchBox.addEventListener('input', ()=>render(currentBank));
  datasetSelect.addEventListener('change', () => {
    const n = Number(datasetSelect.value);
    currentBank = generateBank(n);
    fallbackNotice = '已切換題量';
    populateModuleOptions(currentBank);
    render(currentBank);
  });

  downloadJsonl.addEventListener('click', ()=>{
    download(`nursing_questions_Q0101-Q${String(currentBank.length + 100).padStart(4,'0')}.jsonl`, toJsonl(currentBank));
  });
  downloadCsv.addEventListener('click', ()=>{
    download(`nursing_questions_Q0101-Q${String(currentBank.length + 100).padStart(4,'0')}.csv`, toCsv(currentBank));
  });

  loadData();
})();
