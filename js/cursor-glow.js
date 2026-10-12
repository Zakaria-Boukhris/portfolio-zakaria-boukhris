/* A quiet amber spotlight follows the mouse; the native cursor stays visible. */
(()=>{'use strict';
const glow=document.querySelector('#cursor-glow');
const fine=matchMedia('(hover: hover) and (pointer: fine)');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let x=0,y=0,targetX=0,targetY=0,active=false,raf=0,last=0;
function paint(){glow.style.setProperty('--mouse-x',x.toFixed(2)+'px');glow.style.setProperty('--mouse-y',y.toFixed(2)+'px');}
function stop(){active=false;glow.classList.remove('is-visible');cancelAnimationFrame(raf);raf=0;last=0;}
function frame(t){raf=0;if(!active)return;const dt=last?Math.min((t-last)/1000,.1):1/60;last=t;const blend=reduced.matches?1:1-Math.exp(-dt*22);x+=(targetX-x)*blend;y+=(targetY-y)*blend;paint();if(Math.abs(targetX-x)+Math.abs(targetY-y)>.15)raf=requestAnimationFrame(frame);else last=0;}
addEventListener('pointermove',e=>{if(!fine.matches||e.pointerType==='touch'){stop();return;}targetX=e.clientX;targetY=e.clientY;if(!active){x=targetX;y=targetY;active=true;paint();glow.classList.add('is-visible');}if(!raf)raf=requestAnimationFrame(frame);},{passive:true});
document.documentElement.addEventListener('pointerleave',stop);
addEventListener('blur',stop);addEventListener('pagehide',stop);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
document.addEventListener('keydown',e=>{if(e.key==='Tab')stop();});
fine.addEventListener('change',()=>{if(!fine.matches)stop();});
})();
