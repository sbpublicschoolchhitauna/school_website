(function(){
  if(window.__SBPS_AI_HELPER_INJECTED) { return; }
  window.__SBPS_AI_HELPER_INJECTED = true;
  const SHEET_ID = "1nlnyj4NhLD3KGKiuc9qERSoaBl8ml_TC_B8Z2V3V7OY";
  const css = `
  .sbps-ai-fab{position:fixed;right:18px;bottom:18px;background:#0b5fa8;color:#fff;padding:10px 14px;border-radius:12px;z-index:2147483646;box-shadow:0 10px 30px rgba(2,6,23,0.2);cursor:pointer;font-weight:700}
  .sbps-ai-panel{position:fixed;right:18px;bottom:78px;width:350px;max-width:calc(100% - 36px);background:#fff;border-radius:12px;box-shadow:0 18px 40px rgba(2,6,23,0.18);z-index:2147483646;padding:12px;display:none}
  .sbps-ai-panel .tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}
  .sbps-ai-panel .tab{padding:6px 8px;border-radius:8px;background:#f7fbff;border:1px solid #eef6ff;color:#0b5fa8;cursor:pointer;font-weight:600}
  .sbps-ai-panel .tab.active{background:linear-gradient(90deg,#0b5fa8,#1167b1);color:#fff;border:0}
  .sbps-ai-panel .content{max-height:340px;overflow:auto}
  .sbps-ai-panel .resp{margin-top:8px;padding:8px;border-radius:8px;background:#f8fbff;border:1px solid #eef6ff}
  .sbps-ai-list-item{padding:8px;border-radius:8px;margin-bottom:8px;background:#fff;border:1px solid #f1f7ff}
  `;
  const style = document.createElement('style'); style.id='sbps-ai-style'; style.innerText = css; document.head.appendChild(style);
  const fab = document.createElement('div'); fab.className='sbps-ai-fab'; fab.innerText = 'Ask Helper';
  const panel = document.createElement('div'); panel.className='sbps-ai-panel'; panel.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between">
      <strong>Student Helper</strong>
      <button id="sbpsClose" style="background:none;border:0;font-weight:700;cursor:pointer">✕</button>
    </div>
    <div class="tabs" id="sbpsTabs">
      <div class="tab active" data-tab="ask">Ask</div>
      <div class="tab" data-tab="faq">FAQ</div>
      <div class="tab" data-tab="materials">Materials</div>
      <div class="tab" data-tab="topper">Topper</div>
      <div class="tab" data-tab="students">Students</div>
    </div>
    <div class="content" id="sbpsContent">
      <div data-panel="ask">
        <div style="display:flex;gap:8px">
          <input id="sbpsQuery" placeholder="e.g. area of circle" style="flex:1;padding:8px;border-radius:8px;border:1px solid #eef6ff">
          <button id="sbpsAskBtn" style="background:linear-gradient(90deg,#0b5fa8,#1167b1);color:#fff;padding:8px;border-radius:8px;border:0">Ask</button>
        </div>
        <div id="sbpsAnswer" class="resp">Ask small questions or search FAQs (client-side).</div>
      </div>
      <div data-panel="faq" style="display:none"><div id="sbpsFaqList">Loading FAQs...</div></div>
      <div data-panel="materials" style="display:none"><div id="sbpsMaterials">Loading materials...</div></div>
      <div data-panel="topper" style="display:none"><div id="sbpsToppers">Loading toppers...</div></div>
      <div data-panel="students" style="display:none">
        <input id="sbpsStudentSearch" placeholder="Admission no. or name" style="width:100%;padding:8px;border-radius:8px;border:1px solid #eef6ff;margin-bottom:8px">
        <div id="sbpsStudentRes">Loading students...</div>
      </div>
    </div>
  `;
  document.body.appendChild(fab);
  document.body.appendChild(panel);
  fab.addEventListener('click', ()=>{ panel.style.display = panel.style.display==='block' ? 'none' : 'block'; });
  document.getElementById('sbpsClose').addEventListener('click', ()=> panel.style.display='none');
  document.getElementById('sbpsTabs').addEventListener('click', (e)=>{
    const b = e.target.closest('.tab'); if(!b) return;
    document.querySelectorAll('#sbpsTabs .tab').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    const tab = b.dataset.tab;
    document.querySelectorAll('#sbpsContent [data-panel]').forEach(p=> p.style.display = 'none');
    const panelEl = document.querySelector('#sbpsContent [data-panel="'+tab+'"]');
    if(panelEl) panelEl.style.display = 'block';
  });
  async function gviz(sheet){
    try{
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${encodeURIComponent(sheet)}&tqx=out:json`;
      const r = await fetch(url);
      const txt = await r.text();
      const jsonText = txt.replace(/^[^{]*/,'').replace(/\);?$/,'');
      return JSON.parse(jsonText);
    }catch(e){ console.warn('gviz error', sheet,e); return null; }
  }
  async function loadAll(){
    const db = await gviz('Doubts');
    const faqEl = document.getElementById('sbpsFaqList');
    if(db && db.table && db.table.rows.length){
      const rows = db.table.rows.map(r=> r.c || []);
      faqEl.innerHTML = rows.map(r=> `<div class="sbps-ai-list-item"><strong>Q: ${r[0] && r[0].v || ''}</strong><div>A: ${r[1] && r[1].v || ''}</div></div>`).join('') || 'No FAQs';
    } else faqEl.innerHTML = 'No FAQs found (check sheet sharing).';
    const sm = await gviz('Study Materials');
    const mEl = document.getElementById('sbpsMaterials');
    if(sm && sm.table && sm.table.rows.length){
      const rows = sm.table.rows.map(r=> r.c || []);
      mEl.innerHTML = rows.map(r=> `<div class="sbps-ai-list-item"><strong>${r[0]&&r[0].v||''}</strong><div class="small">Class: ${r[1]&&r[1].v||''}</div>${r[2]&&r[2].v?`<div style="margin-top:6px"><a target="_blank" href="${r[2].v}">Open</a></div>`:''}</div>`).join('') || 'No materials';
    } else mEl.innerHTML = 'No Study Materials found.';
    const sd = await gviz("Student's Details");
    window.__SBPS_STUDENTS = [];
    const sEl = document.getElementById('sbpsStudentRes');
    if(sd && sd.table && sd.table.rows.length){
      const cols = sd.table.cols.map(c=> c.label || c.id || '');
      const rows = sd.table.rows.map(r=> r.c || []);
      window.__SBPS_STUDENTS = rows.map(cells=>{
        const obj = {};
        for(let i=0;i<cols.length;i++){ obj[cols[i]||('col'+i)] = (cells[i] && cells[i].v) || ''; }
        return obj;
      });
      sEl.innerHTML = '<div class="sbps-ai-list-item">Students loaded. Search using the field above.</div>';
    } else sEl.innerHTML = 'Student details not found.';
    const md = await gviz('Marksheet Details');
    const tEl = document.getElementById('sbpsToppers');
    if(md && md.table && md.table.rows.length){
      const cols = md.table.cols.map(c=> c.label || c.id || '');
      const rows = md.table.rows.map(r=> r.c || []);
      const map = {};
      rows.forEach(r=>{
        const adm = (r[0] && r[0].v) || '';
        const name = (r[1] && r[1].v) || '';
        const cls = (r[2] && r[2].v) || '';
        const marks = Number((r[3] && r[3].v) || 0);
        const key = cls + '||' + adm + '||' + name;
        if(!map[key]) map[key] = {admission:adm,name:name,class:cls,total:0};
        map[key].total += marks;
      });
      const byClass = {};
      Object.values(map).forEach(it=> { if(!byClass[it.class]) byClass[it.class]=[]; byClass[it.class].push(it); });
      const cards = [];
      for(const cls in byClass){
        const arr = byClass[cls].sort((a,b)=> b.total - a.total);
        const top = arr[0];
        if(top) cards.push(`<div class="sbps-ai-list-item"><strong>Class ${cls}</strong><div>${top.name} — ${top.total} marks</div></div>`);
      }
      tEl.innerHTML = cards.join('') || 'No toppers';
    } else tEl.innerHTML = 'Marksheet not found.';
  }
  document.getElementById('sbpsAskBtn').addEventListener('click', async ()=>{
    const q = document.getElementById('sbpsQuery').value.trim();
    const out = document.getElementById('sbpsAnswer');
    if(!q){ out.innerText = 'कृपया सवाल टाइप करें।'; return; }
    out.innerText = 'Searching...';
    const db = await gviz('Doubts');
    if(db && db.table && db.table.rows.length){
      const rows = db.table.rows.map(r=> r.c || []);
      const found = rows.filter(r=> ((r[0]&&String(r[0].v)).toLowerCase().includes(q.toLowerCase())) || ((r[1]&&String(r[1].v)).toLowerCase().includes(q.toLowerCase())));
      if(found.length){ out.innerHTML = found.slice(0,5).map(r=> `<div><strong>Q:${r[0]&&r[0].v||''}</strong><div>A:${r[1]&&r[1].v||''}</div></div>`).join(''); return; }
    }
    const canned = {'area of circle':'Area = π × r × r (π≈3.14)','perimeter of rectangle':'Perimeter = 2×(length + breadth)','past simple':'Regular verbs add -ed (e.g., walked). Irregular change (e.g., went)'};
    for(const k in canned) if(q.toLowerCase().includes(k)){ out.innerText = canned[k]; return; }
    out.innerText = 'माफ़ करें — FAQ में नहीं मिला। Teacher से पूछें या Doubts sheet में नया प्रश्न डालें।';
  });
  document.getElementById('sbpsStudentSearch').addEventListener('input', (e)=>{
    const v = e.target.value.trim().toLowerCase();
    const out = document.getElementById('sbpsStudentRes');
    if(!window.__SBPS_STUDENTS || window.__SBPS_STUDENTS.length===0){ out.innerHTML = '<div class="sbps-ai-list-item">Students not loaded yet.</div>'; return; }
    if(!v){ out.innerHTML = '<div class="sbps-ai-list-item">Type admission no. or name.</div>'; return; }
    const list = window.__SBPS_STUDENTS.filter(s=> (s['Admission No.']||'').toString().toLowerCase().includes(v) || (s['Student Name']||'').toString().toLowerCase().includes(v));
    out.innerHTML = list.slice(0,12).map(s=> `<div class="sbps-ai-list-item"><strong>${s['Student Name']||s['Name']||''}</strong><div class="small">Adm: ${s['Admission No.']||''} • Class: ${s['Class']||''}</div></div>`).join('') || '<div class="sbps-ai-list-item">No matches</div>';
  });
  loadAll();
  window.__SBPS_REMOVE_HELPER = () => {
    try{ document.getElementById('sbps-ai-style').remove(); }catch(e){}
    try{ document.body.removeChild(fab); document.body.removeChild(panel); }catch(e){}
    window.__SBPS_AI_HELPER_INJECTED = false;
    alert('Helper removed.');
  };
})();