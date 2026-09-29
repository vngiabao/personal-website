/**
 * The intro's WebGL scene. Loaded on demand (first home visit only), so the
 * site's own bundle never carries three.js.
 *
 * One die, lit by one signal, filmed low:
 *   - the camera trails the signal at a grazing angle, damped so it drifts
 *     round the route's corners rather than snapping;
 *   - each chapter's macro block wakes as the signal reaches it;
 *   - the camera rises to the whole die, then settles low in frame while the
 *     die sinks into shadow and only the A Story core keeps its light.
 *
 * State is written from outside (ChipIntro's GSAP timeline):
 *   progress 0–1 signal along the Path    crane  0–1 chase → whole die
 *   settle   0–1 whole die → resting low  sweep  0–1 a glint crossing the wafer
 *   fade     0–1 exposure from black      dim/core 0–1 the ending
 */
import * as THREE from 'three';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/examples/jsm/postprocessing/OutputPass.js';
import {drawDie,routeAt,BLOCK_T} from './dieArt';

const SIZE=16; // die edge, world units
const toWorld=(u:number,v:number)=>new THREE.Vector3((u-.5)*SIZE,0,(v-.5)*SIZE);

export type ChipState={progress:number;crane:number;settle:number;sweep:number;fade:number;dim:number;core:number};

export function createChipScene(canvas:HTMLCanvasElement,state:ChipState,opts:{small:boolean}){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:!opts.small,powerPreference:'high-performance',alpha:false});
 renderer.setPixelRatio(Math.min(devicePixelRatio,opts.small?1.5:1.75));
 renderer.outputColorSpace=THREE.SRGBColorSpace;

 const scene=new THREE.Scene();
 scene.background=new THREE.Color(0x061327);
 const camera=new THREE.PerspectiveCamera(opts.small?50:38,1,.1,400);

 // ── The die ─────────────────────────────────────────────────────────
 const {art,mask}=drawDie(opts.small?1536:2048);
 const artTex=new THREE.CanvasTexture(art);artTex.colorSpace=THREE.SRGBColorSpace;artTex.anisotropy=renderer.capabilities.getMaxAnisotropy();
 const maskTex=new THREE.CanvasTexture(mask);maskTex.colorSpace=THREE.NoColorSpace;maskTex.generateMipmaps=false;maskTex.minFilter=THREE.LinearFilter;
 const act=new Float32Array(7);
 const dieMat=new THREE.ShaderMaterial({
  uniforms:{uArt:{value:artTex},uMask:{value:maskTex},uProgress:{value:0},uTime:{value:0},uSweep:{value:0},uAct:{value:act},uCam:{value:new THREE.Vector3()},uFade:{value:0},uDim:{value:0},uCore:{value:0}},
  vertexShader:`varying vec2 vUv;varying vec3 vWorld;void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.);vWorld=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
  fragmentShader:`
   uniform sampler2D uArt,uMask;uniform float uProgress,uTime,uSweep,uFade,uDim,uCore;uniform float uAct[7];uniform vec3 uCam;
   varying vec2 vUv;varying vec3 vWorld;
   void main(){
    vec3 base=texture2D(uArt,vUv).rgb;
    // Thin-film sheen: silicon's interference colour, shifting with the view angle, kept in the navy–brass range.
    vec3 V=normalize(uCam-vWorld);float c=clamp(V.y,0.,1.);
    vec3 film=.5+.5*cos(6.2831*(c*1.35+vUv.x*.35+vec3(.0,.18,.36)));
    base+=mix(film,vec3(.9,.72,.4),.45)*.07;
    // A glint travels across the wafer.
    float band=exp(-pow((vUv.x*.8+(1.-vUv.y)*.6-uSweep*2.2+.3)*9.,2.));
    base+=band*vec3(1.,.9,.72)*.16;
    vec3 m=texture2D(uMask,vUv).rgb;
    // The Path signal: everything behind the head glows brass; the head burns white.
    float lit=step(m.g,uProgress)*step(.003,m.g)*m.r;
    float head=exp(-pow((uProgress-m.g)*70.,2.))*m.r*step(uProgress,.999);
    vec3 col=base+vec3(1.,.72,.28)*lit*.95+vec3(1.,.93,.8)*head*2.6;
    // A block's own circuitry wakes when the signal reaches it.
    float owner=floor(m.b*255./30.+.5)-1.;
    float a=0.;for(int i=0;i<7;i++){if(abs(owner-float(i))<.5)a=uAct[i];}
    float shimmer=.8+.2*sin(uTime*5.+vUv.x*120.+vUv.y*60.);
    col+=vec3(1.,.8,.45)*a*step(.05,m.b)*shimmer*.62;
    // The ending: the die sinks into shadow; A Story's core keeps its light.
    float isCore=step(5.5,owner)*step(.05,m.b);
    col*=mix(1.,.18,uDim*(1.-isCore*.75));
    col+=vec3(1.,.8,.48)*isCore*uCore*(.9+.15*sin(uTime*1.6));
    gl_FragColor=vec4(col*uFade,1.);
    #include <colorspace_fragment>
   }`,
 });
 const die=new THREE.Mesh(new THREE.PlaneGeometry(SIZE,SIZE),dieMat);die.rotation.x=-Math.PI/2;scene.add(die);
 // Package: the die sits in a slightly larger, darker substrate, edge catching the light.
 const pkg=new THREE.Mesh(new THREE.BoxGeometry(SIZE*1.1,.5,SIZE*1.1),new THREE.MeshBasicMaterial({color:0x040c1a}));pkg.position.y=-.26;scene.add(pkg);
 const rimMat=new THREE.LineBasicMaterial({color:0x8a6a2a,transparent:true,opacity:0});
 const rim=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(SIZE*1.1,.5,SIZE*1.1)),rimMat);rim.position.y=-.26;scene.add(rim);

 // ── Post: bloom so the signal genuinely glows ───────────────────────
 const composer=new EffectComposer(renderer);
 composer.addPass(new RenderPass(scene,camera));
 const bloom=new UnrealBloomPass(new THREE.Vector2(1,1),.72,.5,.7);composer.addPass(bloom);
 composer.addPass(new OutputPass());

 const resize=()=>{
  const w=canvas.clientWidth,h=canvas.clientHeight;
  renderer.setSize(w,h,false);composer.setSize(w,h);
  bloom.resolution.set(w*(opts.small?.5:.75),h*(opts.small?.5:.75));
  camera.aspect=w/h;camera.updateProjectionMatrix();
 };
 resize();window.addEventListener('resize',resize);

 // ── Camera: trail the signal low, rise to the die, settle ───────────
 const camPos=new THREE.Vector3(),camLook=new THREE.Vector3(),tmpP=new THREE.Vector3(),tmpL=new THREE.Vector3();
 const chase=(p:number,outPos:THREE.Vector3,outLook:THREE.Vector3)=>{
  const h=routeAt(p),ahead=routeAt(Math.min(1,p+.06));
  const head=toWorld(h.x,h.y),dir=new THREE.Vector3(ahead.x-h.x,0,ahead.y-h.y);
  if(dir.lengthSq()<1e-6)dir.set(h.dx,0,h.dy);dir.normalize();
  outPos.copy(head).addScaledVector(dir,-4.2).add(new THREE.Vector3(0,opts.small?3.4:2.4,0)).addScaledVector(new THREE.Vector3(-dir.z,0,dir.x),1.2);
  outLook.copy(head).addScaledVector(dir,2.6);
 };
 const far=opts.small?1.55:1;
 const overview={pos:new THREE.Vector3(0,SIZE*(opts.small?1.55:1.08),SIZE*.62),look:new THREE.Vector3(0,0,.4)};
 const rest={pos:new THREE.Vector3(0,20*far,24*far),look:new THREE.Vector3(0,4.4,-3.4)};
 chase(0,camPos,camLook);

 const clock=new THREE.Timer();let raf=0,running=true;
 const ease=(x:number)=>x*x*(3-2*x);
 const frame=()=>{
  if(!running)return;
  clock.update();const dt=Math.min(clock.getDelta(),.05),t=clock.getElapsed();
  BLOCK_T.forEach((bt,i)=>{const target=state.progress>=bt-.004?1:0;act[i]+=(target-act[i])*(1-Math.exp(-dt*5))});
  chase(state.progress,tmpP,tmpL);
  const k=ease(state.crane),s=ease(state.settle);
  tmpP.lerp(overview.pos,k).lerp(rest.pos,s);tmpL.lerp(overview.look,k).lerp(rest.look,s);
  const damp=1-Math.exp(-dt*(state.crane>0?5:3.2));
  camPos.lerp(tmpP,damp);camLook.lerp(tmpL,damp);
  camera.position.copy(camPos);camera.lookAt(camLook);
  dieMat.uniforms.uProgress.value=state.progress;dieMat.uniforms.uTime.value=t;dieMat.uniforms.uSweep.value=state.sweep;
  dieMat.uniforms.uCam.value.copy(camPos);dieMat.uniforms.uFade.value=state.fade;dieMat.uniforms.uDim.value=state.dim;dieMat.uniforms.uCore.value=state.core;
  rimMat.opacity=.5*state.fade*(1-state.dim*.6);
  composer.render();
  raf=requestAnimationFrame(frame);
 };
 raf=requestAnimationFrame(frame);

 return {
  dispose(){
   running=false;cancelAnimationFrame(raf);window.removeEventListener('resize',resize);
   scene.traverse(o=>{const mesh=o as THREE.Mesh;mesh.geometry?.dispose();const mat=mesh.material as THREE.Material|THREE.Material[]|undefined;(Array.isArray(mat)?mat:mat?[mat]:[]).forEach(x=>x.dispose())});
   artTex.dispose();maskTex.dispose();composer.dispose();renderer.dispose();
  },
 };
}
