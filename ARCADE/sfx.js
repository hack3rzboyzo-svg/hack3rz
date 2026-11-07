/* Synthesized 80s-style sound effects + optional synthwave music. No audio files needed. */
const SFX=(()=>{
let ac,out,mg,nb,muted=localStorage.sfxOff=='1',music=localStorage.sfxMusic=='1',timer,step=0,nxt=0,wk=0;
const m=n=>440*Math.pow(2,(n-69)/12);
function init(){
  if(!ac){
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    ac=new C();out=ac.createGain();out.gain.value=muted?0:.55;
    const cp=ac.createDynamicsCompressor();out.connect(cp);cp.connect(ac.destination);
    mg=ac.createGain();mg.gain.value=.45;mg.connect(out);
    nb=ac.createBuffer(1,ac.sampleRate,ac.sampleRate);const d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
    if(music)startMusic();
  }
  if(ac.state=='suspended')ac.resume();
}
function tone(type,f0,f1,dur,vol,at,dest){
  if(!ac||muted)return;
  const t=ac.currentTime+(at||0),o=ac.createOscillator(),g=ac.createGain();
  o.type=type;o.frequency.setValueAtTime(f0,t);
  if(f1!=f0)o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);
  o.connect(g);g.connect(dest||out);o.start(t);o.stop(t+dur+.03);
}
function noise(dur,vol,freq,at,type,dest){
  if(!ac||muted)return;
  const t=ac.currentTime+(at||0),s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();
  s.buffer=nb;f.type=type||'lowpass';f.frequency.value=freq;
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);
  s.connect(f);f.connect(g);g.connect(dest||out);s.start(t,0,dur);
}
const arp=(notes,gap,type,vol,dur)=>notes.forEach((f,i)=>tone(type,f,f,dur||.12,vol||.12,i*gap));
const S={
  click:()=>tone('square',880,1320,.06,.1),
  hover:()=>tone('triangle',660,760,.04,.05),
  move:()=>tone('square',220,200,.03,.05),
  rotate:()=>tone('square',440,660,.05,.07),
  land:()=>{tone('sine',140,50,.12,.3);noise(.05,.1,800)},
  drop:()=>{tone('sawtooth',400,60,.18,.15);noise(.08,.15,1500)},
  pick:()=>tone('triangle',520,780,.07,.12),
  place:()=>{tone('square',300,150,.08,.12);tone('triangle',600,600,.05,.06,.02)},
  bad:()=>tone('sawtooth',160,90,.15,.12),
  clear:n=>arp([523,659,784,1047,1319,1568].slice(0,2+Math.min(n||1,4)),.06,'square',.11),
  combo:k=>arp([659,784,988,1319].map(f=>f*(1+Math.min(k||1,8)*.06)),.05,'triangle',.12),
  levelup:()=>arp([392,523,659,784,1047],.07,'square',.12,.14),
  over:()=>arp([523,440,370,262],.16,'sawtooth',.14,.3),
  waka:()=>{wk^=1;tone('triangle',wk?300:450,wk?450:300,.07,.14)},
  power:()=>{tone('sawtooth',200,900,.35,.15);tone('square',100,600,.35,.08)},
  eatghost:()=>{tone('square',300,1200,.18,.15);tone('square',1200,300,.12,.1,.12)},
  die:()=>{for(let i=0;i<8;i++)tone('triangle',700-i*60,200-i*10,.12,.14,i*.11)},
  start:()=>arp([262,330,392,523,392,523],.1,'square',.12,.12),
  shotgun:()=>{noise(.28,.5,3500);tone('sawtooth',140,35,.25,.3)},
  hit:()=>{tone('square',200,80,.07,.12);noise(.05,.12,1200)},
  kill:()=>{noise(.35,.4,1800);tone('sawtooth',260,40,.35,.22)},
  hurt:()=>{tone('sawtooth',110,55,.22,.25);noise(.12,.18,500)},
  spawn:()=>tone('sawtooth',70,45,.4,.08),
  eat:()=>tone('square',500,900,.07,.12),
  gold:()=>arp([988,1319,1568,1976],.05,'triangle',.13,.12),
  snakedie:()=>{tone('sawtooth',300,40,.5,.2);noise(.25,.2,900)},
  shoot:()=>{tone('square',900,150,.1,.1);noise(.06,.1,4000)},
  submit:()=>arp([659,784,1047],.07,'square',.12),
  alarm:()=>{for(let i=0;i<4;i++)tone('square',i%2?500:700,i%2?500:700,.18,.15,i*.2)},
  purge:()=>{noise(1.2,.4,600);tone('sawtooth',400,30,1.2,.25)}
};
/* synthwave loop: Am - F - C - G */
const P=[[57,60,64,69],[53,57,60,65],[48,52,55,60],[55,59,62,67]];
function sched(){
  if(!ac)return;
  while(nxt<ac.currentTime+.25){
    const at=Math.max(0,nxt-ac.currentTime),ch=P[(step>>4)%4],s=step&15;
    if(s%4==0)tone('sine',130,45,.18,.5,at,mg);
    if(s%4==2)noise(.04,.12,7000,at,'highpass',mg);
    if(s%2==0)tone('sawtooth',m(ch[0]-12),m(ch[0]-12),.2,.22,at,mg);
    tone('square',m(ch[s&3]+12),m(ch[s&3]+12),.1,.05,at,mg);
    step++;nxt+=60/108/4;
  }
}
function startMusic(){stopMusic();if(!ac)return;nxt=ac.currentTime+.1;step=0;timer=setInterval(sched,100)}
function stopMusic(){clearInterval(timer)}
function ui(){
  const b=document.createElement('div');
  b.style.cssText='position:fixed;top:8px;right:8px;z-index:10000;display:flex;gap:6px';
  const mk=f=>{const x=document.createElement('button');
    x.style.cssText='font:700 11px Orbitron,monospace;color:#00f0ff;background:rgba(10,2,33,.85);border:1px solid #00f0ff;border-radius:6px;padding:6px 9px;cursor:pointer;box-shadow:0 0 8px rgba(0,240,255,.5)';
    x.onclick=e=>{e.stopPropagation();init();f();x.blur()};b.append(x);return x};
  const sb=mk(()=>{muted=!muted;localStorage.sfxOff=muted?1:0;if(out)out.gain.value=muted?0:.55;paint()});
  const mb=mk(()=>{music=!music;localStorage.sfxMusic=music?1:0;music?startMusic():stopMusic();paint()});
  function paint(){sb.textContent=muted?'🔇 SFX OFF':'🔊 SFX';mb.textContent=music?'♪ MUSIC ON':'♪ MUSIC OFF';mb.style.opacity=music?1:.6}
  paint();document.body.append(b);
}
['pointerdown','keydown','touchend'].forEach(e=>addEventListener(e,init,{passive:true}));
document.body?ui():addEventListener('DOMContentLoaded',ui);
return{play:(n,a)=>{try{S[n]&&S[n](a)}catch(e){}},init,S};
})();
