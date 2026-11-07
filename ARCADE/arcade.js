const WORKER='https://slave01.hack3rzboyzo.workers.dev/';
addEventListener('error',e=>arcErr(e.error||e.message));
function arcErr(e){const d=document;let b=d.getElementById('er');if(!b){b=d.createElement('pre');b.id='er';b.style.cssText='position:fixed;left:0;right:0;bottom:0;z-index:300;margin:0;padding:10px;background:#a00;color:#fff;font:11px monospace;white-space:pre-wrap;user-select:text;-webkit-user-select:text';d.body.append(b)}b.textContent='GAME ERROR - send this to Claude:\n'+(e&&e.stack||e&&e.message||e)+'\n'+navigator.userAgent}
const Arcade={mount(cfg){
const d=document,$=s=>d.getElementById(s),E=s=>String(s).replace(/[&<>"]/g,m=>'&#'+m.charCodeAt()+';'),A={W:cfg.w,H:cfg.h};let id=cfg.id;
d.head.insertAdjacentHTML('beforeend','<link rel="stylesheet" href="retro.css"><link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet"><style>*{box-sizing:border-box;margin:0}body{color:#f3e8ff;font:10px "Press Start 2P",monospace;min-height:100vh;padding:10px;-webkit-user-select:none;user-select:none;overscroll-behavior:none;-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none}#app{display:flex;flex-direction:column;align-items:center;gap:14px}a{color:#ff2bd6;text-decoration:none;text-shadow:0 0 8px #ff2bd6}h1{font:900 clamp(18px,4.5vw,32px) Orbitron,"Press Start 2P",sans-serif;letter-spacing:.14em;text-align:center;background:linear-gradient(#fff 0,#9ff 38%,#ff2bd6 54%,#ffe066 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 10px rgba(255,43,214,.8))}.hp{font-size:8px;color:#b9a3e8;text-align:center;line-height:1.6}#m{display:flex;flex-wrap:wrap;gap:16px;justify-content:center;align-items:flex-start}canvas{border:3px solid #00f0ff;border-radius:6px;box-shadow:0 0 14px #00f0ff,0 0 44px rgba(255,43,214,.45),inset 0 0 20px rgba(0,240,255,.25);background:#05010f;max-width:100%;max-height:calc(100vh - 140px);max-height:calc(100dvh - 140px);touch-action:none}#lb{width:230px;border:2px solid #ff2bd6;border-radius:10px;padding:12px;background:rgba(18,4,50,.74);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);box-shadow:0 0 16px #ff2bd6,inset 0 0 20px rgba(255,255,255,.04)}#lb h2{font-size:10px;color:#ffe066;text-shadow:0 0 8px #ff7a18;margin-bottom:10px;text-align:center}#lb li{list-style:none;display:flex;justify-content:space-between;gap:6px;margin:6px 0;color:#fff;font-size:8px}#pad{display:none;width:100%;max-width:440px;justify-content:space-between;align-items:center}#pad:empty{display:none!important}@media(pointer:coarse){#pad{display:flex}canvas{max-height:calc(100vh - 270px);max-height:calc(100dvh - 270px)}}.dp{display:grid;grid-template:repeat(3,54px)/repeat(3,54px);gap:3px}.ab{display:flex;gap:10px}.b{width:54px;height:54px;border:2px solid #00f0ff;border-radius:12px;background:rgba(0,240,255,.12);color:#00f0ff;font:inherit;font-size:14px;touch-action:none;box-shadow:0 0 10px rgba(0,240,255,.5)}.b:active{background:#00f0ff;color:#0a0221}.U{grid-area:1/2}.L{grid-area:2/1}.R{grid-area:2/3}.D{grid-area:3/2}#ov{position:fixed;inset:0;background:rgba(6,0,24,.9);display:none;align-items:center;justify-content:center;z-index:100}.p{border:3px solid #00f0ff;border-radius:10px;box-shadow:0 0 22px #00f0ff,0 0 56px rgba(255,43,214,.5);padding:22px;text-align:center;line-height:2;max-width:92vw;background:rgba(10,2,33,.96)}.p h2{color:#ff2bd6;font-size:18px;text-shadow:0 0 14px #ff2bd6}.p input{font:inherit;font-size:16px;background:#000;color:#ffe066;border:2px solid #00f0ff;border-radius:6px;padding:8px;width:210px;text-align:center;margin:8px 0;text-transform:uppercase;-webkit-user-select:text;user-select:text}.k{font:inherit;font-size:10px;background:rgba(0,240,255,.08);color:#00f0ff;border:2px solid #00f0ff;border-radius:6px;padding:10px 12px;margin:4px;cursor:pointer;box-shadow:0 0 10px rgba(0,240,255,.4)}.k:hover{background:#00f0ff;color:#0a0221}.k:disabled{opacity:.4}.w{border:2px dashed #ff2bd6;color:#ff2bd6;margin-top:14px;padding:10px;text-shadow:0 0 8px #ff2bd6}.w .k{color:#ff2bd6;border-color:#ff2bd6;box-shadow:0 0 10px rgba(255,43,214,.4)}.w .k:hover{background:#ff2bd6;color:#0a0221}.bl{animation:bl 1s steps(2) infinite}@keyframes bl{50%{opacity:0}}</style>');
d.body.classList.add('retro');const app=d.createElement('div');app.id='app';d.body.prepend(app);
app.innerHTML=`<h1>${cfg.title}</h1><div id=m><canvas id=cv width=${cfg.w} height=${cfg.h}></canvas><div id=lb><h2>★ TOP 10 ★</h2><ol id=ls></ol></div></div><div id=pad></div><p class=hp>${cfg.help}</p><a href=index.html>◀ BACK TO ARCADE</a><div id=ov></div>`;
const snd=(n,a)=>{try{window.SFX&&SFX.play(n,a)}catch(e){}};
const cv=$('cv'),ov=$('ov'),ls=$('ls');ov.addEventListener('click',e=>{if(e.target.closest('.k'))snd('click')});A.c=cv;A.ctx=cv.getContext('2d');
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
A.mode=(i,t)=>{id=i;ls.parentNode.firstChild.textContent='★ '+t+' ★';board()};
// ---- global leaderboard (Cloudflare Worker) ----
const board=async()=>{try{const r=await(await fetch(WORKER+'scores?game='+id)).json();ls.innerHTML=r.scores.slice(0,10).map((e,i)=>`<li><span>${i+1}.${E(e.n)}</span><span>${e.s}</span></li>`).join('')||'<li>NO SCORES YET</li>'}catch{ls.innerHTML='<li>SCORES OFFLINE</li>'}};
const again=()=>{ov.style.display='none';cfg.init()};
const wipe=tk=>{snd('alarm');const w=d.createElement('div');w.className='w';
w.innerHTML='<h2 class=bl>★ 50K CLUB ★</h2><div>YOU MAY PURGE ALL HIGH SCORES</div><button class=k id=wy>PURGE ALL</button><button class=k id=wn>KEEP</button>';
ov.firstChild.append(w);
$('wn').onclick=()=>w.remove();
$('wy').onclick=()=>{w.innerHTML='<h2 class=bl>!! WARNING !!</h2><div>ERASE EVERY SCORE ON EVERY GAME?<br>NO UNDO</div><button class=k id=y2>YES ERASE</button><button class=k id=n2>ABORT</button>';
$('n2').onclick=()=>w.remove();
$('y2').onclick=async()=>{w.textContent='ERASING...';try{const j=await(await fetch(WORKER+'wipe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:tk})})).json();if(j.ok)snd('purge');w.textContent=j.ok?'> ALL SCORES ERASED_':'> DENIED';board()}catch{w.textContent='> ERROR'}}}};
A.over=s=>{A.stop();snd('over');ov.style.display='flex';
if(!(s>0)){ov.innerHTML='<div class=p><h2>GAME OVER</h2><button class=k id=ag>PLAY AGAIN</button></div>';$('ag').onclick=again;return}
ov.innerHTML=`<div class=p><h2>GAME OVER</h2><div>SCORE ${s}</div><div>ENTER YOUR NAME</div><input id=nm maxlength=12 autocomplete=off value="${E(localStorage.arcName||'')}"><br><button class=k id=sb>SUBMIT</button><button class=k id=ag>PLAY AGAIN</button><div id=ms></div></div>`;
$('ag').onclick=again;
$('nm').onkeydown=e=>{if(e.key=='Enter')$('sb').click()};
$('sb').onclick=async()=>{const sb=$('sb'),n=$('nm').value;sb.disabled=true;localStorage.arcName=n;
try{const j=await(await fetch(WORKER+'scores',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({game:id,name:n,score:s})})).json();if(!j.ok)throw j.error;snd('submit');$('ms').textContent=j.rank?'RANK #'+j.rank+'!':'SAVED';board();if(j.wipe)wipe(j.wipe)}
catch(e){$('ms').textContent='ERROR: '+(e||'OFFLINE');sb.disabled=false}}};
return A}};
