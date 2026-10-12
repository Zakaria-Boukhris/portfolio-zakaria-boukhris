import * as THREE from 'three';
import textureSource from '../assets/black-hole.png';
// The supplied artwork is animated as a textured WebGL surface, not a physical
// black-hole simulation. The HTML image is the fallback when WebGL is unavailable.
const canvas=document.querySelector('#blackhole'),frame=canvas.parentElement;
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:false,powerPreference:'low-power'});}catch{/* The accessible page and artwork remain fully available. */}
if(renderer){
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
 renderer.setClearColor(0x000000,0);
 const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-1,1,1,-1,.1,10);camera.position.z=2;
 const uniforms={map:{value:null},time:{value:0},scale:{value:new THREE.Vector2(1,1)}};
 const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms,vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,fragmentShader:`precision highp float;
 uniform sampler2D map;uniform float time;uniform vec2 scale;varying vec2 vUv;
 void main(){
  vec2 uv=(vUv-.5)*scale+.5;
  vec2 d=uv-vec2(.50,.50);float r=length(d);float a=atan(d.y,d.x);
  float ring=smoothstep(.12,.23,r)*(1.-smoothstep(.43,.63,r));
  float turn=.032*sin(time*.58-r*10.)*ring;
  float c=cos(turn),s=sin(turn);uv=vec2(c*d.x-s*d.y,s*d.x+c*d.y)+.5;
  uv+=normalize(d+vec2(.00001))*.0025*sin(a*8.-time*1.2+r*25.)*ring;
  if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.)discard;
  vec4 col=texture2D(map,uv);float luminance=max(max(col.r,col.g),col.b);
  float core=1.-smoothstep(.13,.215,r);
  float alpha=max(smoothstep(.022,.13,luminance),core);
  float edges=smoothstep(0.,.10,uv.x)*smoothstep(0.,.10,1.-uv.x)*smoothstep(0.,.10,uv.y)*smoothstep(0.,.10,1.-uv.y);
  // Amber palette is constant through navigation; only the ring itself shimmers.
  float energy=pow(dot(col.rgb,vec3(.25,.55,.20)),.7);
  vec3 ember=mix(vec3(.12,.035,.004),vec3(1.,.36,.015),smoothstep(.025,.52,energy));
  vec3 cream=mix(ember,vec3(1.,.965,.82),smoothstep(.45,.96,energy));
  col.rgb=cream*smoothstep(0.,.09,energy);
  col.rgb*=1.+.025*sin(time*.65-a*2.)*ring;
  gl_FragColor=vec4(col.rgb,col.a*alpha*edges);
 }`});
 const plane=new THREE.Mesh(new THREE.PlaneGeometry(2,2),material);scene.add(plane);
 let ready=false,visible=true,enabled=window.portfolioMotionEnabled?.()??!matchMedia('(prefers-reduced-motion: reduce)').matches,last=0,elapsed=0,raf;
 function resize(){const w=frame.clientWidth,h=frame.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);const canvasRatio=w/h,imageRatio=1.5;
 // Equivalent to object-fit: contain; avoids distortion at all screen sizes.
 uniforms.scale.value.set(Math.max(1,canvasRatio/imageRatio),Math.max(1,imageRatio/canvasRatio));if(ready)renderer.render(scene,camera);}
 new ResizeObserver(resize).observe(frame);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{rootMargin:'100px'}).observe(document.querySelector('.space-scene'));
 const loader=new THREE.TextureLoader();loader.load(textureSource,texture=>{texture.colorSpace=THREE.NoColorSpace;texture.minFilter=THREE.LinearFilter;uniforms.map.value=texture;ready=true;resize();renderer.render(scene,camera);frame.classList.add('ready');},undefined,()=>{});
 addEventListener('portfolio:motion',e=>{enabled=e.detail.enabled;if(!enabled&&ready)renderer.render(scene,camera)});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();ready=false;frame.classList.remove('ready')});
 function render(t){raf=requestAnimationFrame(render);if(t-last<32)return;let delta=Math.min((t-last)/1000,.05);last=t;if(ready&&visible&&!document.hidden&&enabled){elapsed+=delta;uniforms.time.value=elapsed;renderer.render(scene,camera);}}
 raf=requestAnimationFrame(render);
 addEventListener('pagehide',()=>{cancelAnimationFrame(raf);renderer.dispose();material.dispose();uniforms.map.value?.dispose();plane.geometry.dispose()},{once:true});
}
