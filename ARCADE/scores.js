(()=>{
const WORKER='https://slave01.hack3rzboyzo.workers.dev/',E=s=>String(s).replace(/[&<>"]/g,m=>'&#'+m.charCodeAt()+';');
document.head.insertAdjacentHTML('beforeend','<style>.sc-ov{position:fixed;inset:0;background:rgba(6,0,24,.9);display:none;align-items:center;justify-content:center;z-index:100;padding:12px}.sc-p{border:3px solid #00f0ff;border-radius:10px;box-shadow:0 0 22px #00f0ff,0 0 56px rgba(255,43,214,.5);padding:20px;text-align:center;line-height:2;max-width:92vw;background:rgba(10,2,33,.96);color:#f3e8ff;font:10px "Press Start 2P",monospace}.sc-p h2{color:#ff2bd6;font-size:16px;text-shadow:0 0 14px #ff2bd6;margin:0 0 6px}.sc-i{font:inherit;font-size:16px;background:#000;color:#ffe066;border:2px solid #00f0ff;border-radius:6px;padding:8px;width:200px;max-width:100%;text-align:center;margin:8px 0;text-transform:uppercase;-webkit-user-select:text;user-select:text}.sc-k{font:inherit;font-size:10px;background:rgba(0,240,255,.08);color:#00f0ff;border:2px solid #00f0ff;border-radius:6px;padding:10px 12px;margin:4px;cursor:pointer;touch-action:manipulation;box-shadow:0 0 10px rgba(0,240,255,.4)}.sc-k:hover{background:#00f0ff;color:#0a0221}.sc-k:disabled{opacity:.4}.sc-w{border:2px dashed #ff2bd6;color:#ff2bd6;margin-top:14px;padding:10px}.sc-w .sc-k{color:#ff2bd6;border-color:#ff2bd6}</style>');
const post=(p,b)=>fetch(WORKER+p,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}).then(r=>r.json());
function wipe(tk,el){
  const w=document.createElement('div');w.className='sc-w';
  w.innerHTML='<b>★ 50K CLUB ★</b><div>YOU MAY PURGE ALL HIGH SCORES</div><button class=sc-k id=wy>PURGE ALL</button><button class=sc-k id=wn>KEEP</button>';
  el.append(w);w.querySelector('#wn').onclick=()=>w.remove();
  w.querySelector('#wy').onclick=()=>{
    w.innerHTML='<b>!! WARNING !!</b><div>ERASE EVERY SCORE ON EVERY GAME?<br>NO UNDO</div><button class=sc-k id=y2>YES ERASE</button><button class=sc-k id=n2>ABORT</button>';
    w.querySelector('#n2').onclick=()=>w.remove();
    w.querySelector('#y2').onclick=async()=>{w.textContent='ERASING...';try{const j=await post('wipe',{token:tk});w.textContent=j.ok?'> ALL SCORES ERASED_':'> DENIED'}catch{w.textContent='> ERROR'}}}}
window.Scores={
  async list(game,ol,n=10){
    try{const r=await(await fetch(WORKER+'scores?game='+game)).json();
      ol.innerHTML=r.scores.slice(0,n).map((e,i)=>`<li><span>${i+1}. ${E(e.n)}</span><b>${e.s}</b></li>`).join('')||'<li>NO SCORES YET</li>'}
    catch{ol.innerHTML='<li>SCORES OFFLINE</li>'}},
  entry({game,score,el,done}){
    if(!(score>0))return;
    el.innerHTML=`<div>SCORE ${score}</div><div>ENTER YOUR NAME</div><input class=sc-i maxlength=12 autocomplete=off value="${E(localStorage.arcName||'')}"><br><button class=sc-k id=sc-sb>SUBMIT SCORE</button><div id=sc-ms></div>`;
    const sb=el.querySelector('#sc-sb'),ms=el.querySelector('#sc-ms'),inp=el.querySelector('input');
    inp.onkeydown=e=>{e.stopPropagation();if(e.key=='Enter')sb.click()};
    sb.onclick=async()=>{sb.disabled=true;localStorage.arcName=inp.value;
      try{const j=await post('scores',{game,name:inp.value,score});if(!j.ok)throw j.error;
        ms.textContent=j.rank?'RANK #'+j.rank+'!':'SAVED';done&&done();if(j.wipe)wipe(j.wipe,el)}
      catch(e){ms.textContent='ERROR: '+(e||'OFFLINE');sb.disabled=false}}}
};
})();
