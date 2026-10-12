/* Animated star field with gentle pointer and scroll movement. */
(()=>{'use strict';
const canvas=document.querySelector('#stars'),ctx=canvas.getContext('2d');
let enabled=window.portfolioMotionEnabled?.()??true,w=innerWidth,h=innerHeight,focal=1,points=[];
let mouseX=0,mouseY=0,aimX=0,aimY=0,last=0,time=0,lastScroll=scrollY,scrollSpeed=0;
let sceneScroll=scrollY,dirty=true,drawnAt=0;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const smooth=n=>n*n*(3-2*n);
function size(){
 w=innerWidth;h=innerHeight;focal=Math.min(w,h)*.9;
 const dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0);
 let seed=527;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 points=Array.from({length:w<600?230:Math.min(650,Math.round(w*.45))},()=>{
  const z=250+rnd()*2100;
  return{x:(rnd()-.5)*(w+240)*z/focal,y:(rnd()-.5)*(h+240)*z/focal,z,r:.65+rnd()*.95,a:.45+rnd()*.45,phase:rnd()*Math.PI*2};
 });dirty=true;drawStars(0);
}
function drawStars(dt){
 if(!ctx)return;ctx.clearRect(0,0,w,h);
 const boost=Math.min(scrollSpeed*.085,420);
 for(const s of points){
  if(dt){s.z-=dt*(90+boost);if(s.z<160)s.z+=2200;}
  const depth=focal/s.z;
  const angle=time*.012,cs=Math.cos(angle),sn=Math.sin(angle);
  const px=s.x*cs-s.y*sn,py=s.x*sn+s.y*cs;
  const x=w*.5+(px-mouseX*95)*depth;
  const y=h*.5+(py-mouseY*70)*depth;
  if(x< -15||x>w+15||y< -15||y>h+15)continue;
  const r=clamp(s.r*depth,.55,2.2);
  const alpha=s.a*(.72+.28*Math.sin(time*1.2+s.phase));
  ctx.fillStyle=`rgba(255,225,164,${alpha.toFixed(3)})`;
  ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
  if(r>1.1){ctx.fillStyle=`rgba(255,169,62,${(alpha*.09).toFixed(3)})`;ctx.beginPath();ctx.arc(x,y,r*3,0,Math.PI*2);ctx.fill();}
  // Short, restrained trails give scrolling an acceleration effect.
  if(boost>8&&dt){const streak=Math.min(.038,boost*.00014);ctx.strokeStyle=`rgba(255,204,118,${(alpha*.3).toFixed(3)})`;ctx.lineWidth=Math.min(r,1);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(x-w*.5)*streak,y+(y-h*.5)*streak);ctx.stroke();}
 }
}
if(matchMedia('(pointer:fine)').matches){
 addEventListener('pointermove',e=>{aimX=(e.clientX/w-.5)*2;aimY=(e.clientY/h-.5)*2;},{passive:true});
 document.documentElement.addEventListener('pointerleave',()=>{aimX=aimY=0;});
}
addEventListener('resize',size);
addEventListener('scroll',()=>dirty=true,{passive:true});
addEventListener('portfolio:motion',e=>{enabled=e.detail.enabled;dirty=true;scrollSpeed=0;if(!enabled){mouseX=mouseY=0;sceneScroll=scrollY;drawStars(0);}});
document.addEventListener('visibilitychange',()=>{last=0;lastScroll=scrollY;scrollSpeed=0;dirty=true;});
function tick(t){
 requestAnimationFrame(tick);if(document.hidden){last=0;return;}
 const dt=last?Math.min((t-last)/1000,.2):0;last=t;
 if(enabled){
  const lerp=1-Math.exp(-dt*7);mouseX+=(aimX-mouseX)*lerp;mouseY+=(aimY-mouseY)*lerp;
  sceneScroll+=(scrollY-sceneScroll)*(1-Math.exp(-dt*9));
  scrollSpeed+=(Math.abs(scrollY-lastScroll)/Math.max(dt,.016)-scrollSpeed)*.12;
  time+=dt;
  if(t-drawnAt>=32){drawStars(Math.min((t-drawnAt)/1000,.05));drawnAt=t;}
 }else if(dirty){sceneScroll=scrollY;drawStars(0);dirty=false;}
 lastScroll=scrollY;
}
size();requestAnimationFrame(tick);
})();
