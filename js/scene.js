/* Original persistent space scene: scroll choreography and projected star field. */
(()=>{'use strict';
const art=document.querySelector('.hero-art'),hero=document.querySelector('.hero');
const canvas=document.querySelector('#stars'),ctx=canvas.getContext('2d');
let enabled=window.portfolioMotionEnabled?.()??true,w=innerWidth,h=innerHeight,focal=1,points=[];
let mouseX=0,mouseY=0,aimX=0,aimY=0,last=0,time=0,lastScroll=scrollY,scrollSpeed=0;
let sceneScroll=scrollY,dirty=true,drawnAt=0;
const sections=[...document.querySelectorAll('main>.section')];
let waypoints=[];
function measureRoute(){
 const small=innerWidth<=800;
 const poses=small?[[.475,.25,1,1,0],[1.01,.70,.48,1,-22],[1.02,.65,.43,1,24],[1.04,.65,.42,1,-17],[1.06,.72,.42,1,20],[1.02,.76,.43,1,-24],[1.03,.76,.44,1,18],[1.02,.76,.43,1,-18]]:[[.70,.52,1,1,0],[.23,.80,.68,1,-24],[.89,.62,.60,1,24],[.12,.69,.51,1,-22],[.89,.78,.55,1,25],[.20,.80,.6,1,-20],[.91,.82,.55,1,22],[.85,.55,.58,1,-18]];
 waypoints=sections.map((el,i)=>({at:i?Math.max(1,el.offsetTop-innerHeight*.18):0,p:poses[i]}));
 // Complete the hero-to-background transition before the profile fills the viewport.
 waypoints[1].at=Math.min(waypoints[1].at,hero.offsetHeight*.68);
 dirty=true;
}
new ResizeObserver(measureRoute).observe(document.querySelector('main'));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const smooth=n=>n*n*(3-2*n);
function size(){
 w=innerWidth;h=innerHeight;focal=Math.min(w,h)*.9;
 const dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0);
 let seed=527;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 points=Array.from({length:w<600?230:Math.min(650,Math.round(w*.45))},()=>{
  const z=250+rnd()*2100;
  return{x:(rnd()-.5)*(w+240)*z/focal,y:(rnd()-.5)*(h+240)*z/focal,z,r:.65+rnd()*.95,a:.45+rnd()*.45,phase:rnd()*Math.PI*2};
 });measureRoute();dirty=true;drawStars(0);positionScene();
}
function positionScene(){
 if(!waypoints.length)return;
 let i=0;while(i<waypoints.length-2&&sceneScroll>waypoints[i+1].at)i++;
 const from=waypoints[i],to=waypoints[Math.min(i+1,waypoints.length-1)];
 const t=smooth(clamp((sceneScroll-from.at)/Math.max(1,to.at-from.at),0,1));
 const pose=from.p.map((v,j)=>v+(to.p[j]-v)*t);
 const small=w<=800;
 const baseX=small?w*.475:w*.70;
 const baseY=small?(w<=380?192:212):h*.52;
 const retreat=smooth(clamp(sceneScroll/Math.max(1,waypoints[1].at),0,1));
 const bob=enabled?Math.sin(time*.5)*7*retreat:0;
 art.style.setProperty('--scene-x',(pose[0]*w-baseX).toFixed(2)+'px');
 art.style.setProperty('--scene-y',(pose[1]*h-baseY+bob).toFixed(2)+'px');
 // Preserve the approved hero composition at the top on mobile.
 if(small&&sceneScroll<waypoints[1].at){art.style.setProperty('--scene-y',((pose[1]*h-baseY)*retreat+bob).toFixed(2)+'px');}
 art.style.setProperty('--scene-scale',pose[2].toFixed(4));
 art.style.setProperty('--scene-turn',(pose[4]+(enabled?Math.sin(time*.22)*2*retreat:0)).toFixed(2)+'deg');
 art.style.setProperty('--art-x',(mouseX*16).toFixed(2)+'px');
 art.style.setProperty('--art-y',(mouseY*10).toFixed(2)+'px');
 art.style.setProperty('--art-rx',(-mouseY*2).toFixed(2)+'deg');
 art.style.setProperty('--art-ry',(mouseX*3).toFixed(2)+'deg');
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
addEventListener('portfolio:motion',e=>{enabled=e.detail.enabled;dirty=true;scrollSpeed=0;if(!enabled){mouseX=mouseY=0;sceneScroll=scrollY;positionScene();drawStars(0);}});
document.addEventListener('visibilitychange',()=>{last=0;lastScroll=scrollY;scrollSpeed=0;dirty=true;});
function tick(t){
 requestAnimationFrame(tick);if(document.hidden){last=0;return;}
 const dt=last?Math.min((t-last)/1000,.2):0;last=t;
 if(enabled){
  const lerp=1-Math.exp(-dt*7);mouseX+=(aimX-mouseX)*lerp;mouseY+=(aimY-mouseY)*lerp;
  sceneScroll+=(scrollY-sceneScroll)*(1-Math.exp(-dt*9));
  scrollSpeed+=(Math.abs(scrollY-lastScroll)/Math.max(dt,.016)-scrollSpeed)*.12;
  time+=dt;positionScene();
  if(t-drawnAt>=32){drawStars(Math.min((t-drawnAt)/1000,.05));drawnAt=t;}
 }else if(dirty){sceneScroll=scrollY;positionScene();drawStars(0);dirty=false;}
 lastScroll=scrollY;
}
size();requestAnimationFrame(tick);
})();
