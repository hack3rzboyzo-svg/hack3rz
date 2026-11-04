const WORKER='https://slave01.hack3rzboyzo.workers.dev/';
addEventListener('error',e=>arcErr(e.error||e.message));
function arcErr(e){const d=document;let b=d.getElementById('er');if(!b){b=d.createElement('pre');b.id='er';b.style.cssText='position:fixed;left:0;right:0;bottom:0;z-index:300;margin:0;padding:10px;background:#a00;color:#fff;font:11px monospace;white-space:pre-wrap;user-select:text;-webkit-user-select:text';d.body.append(b)}b.textContent='GAME ERROR - send this to Claude:\n'+(e&&e.stack||e&&e.message||e)+'\n'+navigator.userAgent}
const Arcade={mount(cfg){
const d=document,$=s=>d.getElementById(s),E=s=>String(s).replace(/[&<>"]/g,m=>'&#'+m.charCodeAt()+';'),id=cfg.id,A={W:cfg.w,H:cfg.h};
d.head.insertAdjacentHTML('beforeend','<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet"><style>*{box-sizing:border-box;margin:0}body{background:#07040f;color:#0ff;font:10px "Press Start 2P",monospace;min-height:100vh;padding:10px;-webkit-user-select:none;user-select:none;overscroll-behavior:none;-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none}body:after{content:"";position:fixed;inset:0;pointer-events:none;z-index:200;background:repeating-linear-gradient(0deg,rgba(0,0,0,.2) 0 1px,transparent 1px 3px)}#app{display:flex;flex-direction:column;align-items:center;gap:12px}a{color:#f0f;text-decoration:none}h1{color:#f0f;font-size:15px;text-shadow:0 0 10px #f0f;text-align:center}.hp{font-size:8px;color:#7a7;text-align:center;line-height:1.6}#m{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;align-items:flex-start}canvas{border:3px solid #0ff;box-shadow:0 0 18px #0ff;background:#000;max-width:100%;max-height:calc(100vh - 140px);max-height:calc(100dvh - 140px);touch-action:none}#lb{width:220px;border:3px solid #f0f;padding:10px;box-shadow:0 0 14px #f0f}#lb h2{font-size:10px;color:#ff0;margin-bottom:10px;text-align:center}#lb li{list-style:none;display:flex;justify-content:space-between;gap:6px;margin:6px 0;color:#fff;font-size:8px}#pad{display:none;width:100%;max-width:440px;justify-content:space-between;align-items:center}#pad:empty{display:none!important}@media(pointer:coarse){#pad{display:flex}canvas{max-height:calc(100vh - 270px);max-height:calc(100dvh - 270px)}}.dp{display:grid;grid-template:repeat(3,54px)/repeat(3,54px);gap:3px}.ab{display:flex;gap:10px}.b{width:54px;height:54px;border:2px solid #0ff;border-radius:12px;background:rgba(0,255,255,.12);color:#0ff;font:inherit;font-size:14px;touch-action:none}.b:active{background:#0ff;color:#000}.U{grid-area:1/2}.L{grid-area:2/1}.R{grid-area:2/3}.D{grid-area:3/2}#ov{position:fixed;inset:0;background:rgba(0,0,20,.88);display:none;align-items:center;justify-content:center;z-index:100}.p{border:3px solid #f0f;box-shadow:0 0 20px #f0f;padding:22px;text-align:center;line-height:2;max-width:92vw;background:#0a0618}.p h2{color:#f33;font-size:18px;text-shadow:0 0 12px #f33}.p input{font:inherit;font-size:16px;background:#000;color:#ff0;border:2px solid #0ff;padding:8px;width:210px;text-align:center;margin:8px 0;text-transform:uppercase;-webkit-user-select:text;user-select:text}.k{font:inherit;font-size:10px;background:#000;color:#0ff;border:2px solid #0ff;padding:10px 12px;margin:4px;cursor:pointer}.k:hover{background:#0ff;color:#000}.k:disabled{opacity:.4}.w{border:2px dashed #f33;color:#f33;margin-top:14px;padding:10px;text-shadow:0 0 8px #f33}.w .k{color:#f33;border-color:#f33}.w .k:hover{background:#f33;color:#000}.bl{animation:bl 1s steps(2) infinite}@keyframes bl{50%{opacity:0}}</style>');
const app=d.createElement('div');app.id='app';d.body.prepend(app);
app.innerHTML=`<h1>${cfg.title}</h1><div id=m><canvas id=cv width=${cfg.w} height=${cfg.h}></canvas><div id=lb><h2>★ TOP 10 ★</h2><ol id=ls></ol></div></div><div id=pad></div><p class=hp>${cfg.help}</p><a href=index.html>◀ BACK TO ARCADE</a><div id=ov></div>`;
const cv=$('cv'),ov=$('ov'),ls=$('ls');A.c=cv;A.ctx=cv.getContext('2d');
if(cfg.px){cv.style.imageRendering='pixelated';cv.style.width='min(calc(100vw - 20px),calc((100vh - 170px) * '+cfg.w/cfg.h+'))';cv.style.height='auto'}
// ---- input: keyboard + on-screen pad share the same actions (L R U D A B) ----
const held=A.held={},hs={},K={arrowleft:'L',a:'L',arrowright:'R',d:'R',arrowup:'U',w:'U',arrowdown:'D',s:'D',' ':'A',enter:'A',x:'A',z:'B',shift:'B'};
const dn=a=>{if(held[a])return;held[a]=1;(hs[a]||[]).forEach(h=>{h.f();if(h.r)h.t=setTimeout(()=>h.i=setInterval(h.f,h.r),170)})},
up=a=>{held[a]=0;(hs[a]||[]).forEach(h=>{clearTimeout(h.t);clearInterval(h.i)})};
A.press=(a,f,r)=>(hs[a]=hs[a]||[]).push({f,r});
addEventListener('keydown',e=>{if(e.target.tagName=='INPUT')return;const a=K[e.key.toLowerCase()];if(a){e.preventDefault();dn(a)}});
addEventListener('keyup',e=>{const a=K[e.key.toLowerCase()];if(a)up(a)});
addEventListener('blur',()=>Object.keys(held).forEach(up));
const pc=cfg.pad||'',lab={U:'▲',L:'◀',R:'▶',D:'▼',A:'A',B:'B'},bt=k=>`<button class="b ${k}" data-k=${k}>${lab[k]}</button>`;
$('pad').innerHTML=pc?`<div class=dp>${[...'ULRD'].filter(k=>pc.includes(k)).map(bt).join('')}</div><div class=ab>${[...'BA'].filter(k=>pc.includes(k)).map(bt).join('')}</div>`:'';
d.querySelectorAll('.b').forEach(b=>{const k=b.dataset.k;b.onpointerdown=e=>{e.preventDefault();dn(k)};['onpointerup','onpointercancel','onpointerleave'].forEach(n=>b[n]=()=>up(k));b.oncontextmenu=e=>e.preventDefault()});
// ---- game loop ----
let on=0,last,fn;
const tk=n=>{if(!on)return;try{fn(Math.max(0,Math.min(n-last,50)))}catch(e){on=0;arcErr(e);return}last=n;if(on)requestAnimationFrame(tk)};
A.run=f=>{fn=f;last=performance.now();if(!on){on=1;requestAnimationFrame(tk)}};
A.stop=()=>on=0;
A.start=()=>{board();cfg.init()};
// ---- global leaderboard (Cloudflare Worker) ----
const board=async()=>{try{const r=await(await fetch(WORKER+'scores?game='+id)).json();ls.innerHTML=r.scores.slice(0,10).map((e,i)=>`<li><span>${i+1}.${E(e.n)}</span><span>${e.s}</span></li>`).join('')||'<li>NO SCORES YET</li>'}catch{ls.innerHTML='<li>SCORES OFFLINE</li>'}};
const again=()=>{ov.style.display='none';cfg.init()};
const wipe=tk=>{const w=d.createElement('div');w.className='w';
w.innerHTML='<h2 class=bl>★ 50K CLUB ★</h2><div>YOU MAY PURGE ALL HIGH SCORES</div><button class=k id=wy>PURGE ALL</button><button class=k id=wn>KEEP</button>';
ov.firstChild.append(w);
$('wn').onclick=()=>w.remove();
$('wy').onclick=()=>{w.innerHTML='<h2 class=bl>!! WARNING !!</h2><div>ERASE EVERY SCORE ON EVERY GAME?<br>NO UNDO</div><button class=k id=y2>YES ERASE</button><button class=k id=n2>ABORT</button>';
$('n2').onclick=()=>w.remove();
$('y2').onclick=async()=>{w.textContent='ERASING...';try{const j=await(await fetch(WORKER+'wipe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:tk})})).json();w.textContent=j.ok?'> ALL SCORES ERASED_':'> DENIED';board()}catch{w.textContent='> ERROR'}}}};
A.over=s=>{A.stop();ov.style.display='flex';
if(!(s>0)){ov.innerHTML='<div class=p><h2>GAME OVER</h2><button class=k id=ag>PLAY AGAIN</button></div>';$('ag').onclick=again;return}
ov.innerHTML=`<div class=p><h2>GAME OVER</h2><div>SCORE ${s}</div><div>ENTER YOUR NAME</div><input id=nm maxlength=12 autocomplete=off value="${E(localStorage.arcName||'')}"><br><button class=k id=sb>SUBMIT</button><button class=k id=ag>PLAY AGAIN</button><div id=ms></div></div>`;
$('ag').onclick=again;
$('nm').onkeydown=e=>{if(e.key=='Enter')$('sb').click()};
$('sb').onclick=async()=>{const sb=$('sb'),n=$('nm').value;sb.disabled=true;localStorage.arcName=n;
try{const j=await(await fetch(WORKER+'scores',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({game:id,name:n,score:s})})).json();if(!j.ok)throw j.error;$('ms').textContent=j.rank?'RANK #'+j.rank+'!':'SAVED';board();if(j.wipe)wipe(j.wipe)}
catch(e){$('ms').textContent='ERROR: '+(e||'OFFLINE');sb.disabled=false}}};
return A}};