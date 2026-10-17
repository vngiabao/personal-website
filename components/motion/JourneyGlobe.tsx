'use client';
/**
 * The route so far, on a night globe (after United Carriers, by Bearplus):
 * land as brass-lit dots on navy, a glowing arc from Vietnam to Ann Arbor
 * that draws itself when the globe comes into view, and a light that keeps
 * travelling it. Drag to spin (with inertia); let go and it eases back to
 * frame the journey. Click a place to turn the globe to it.
 *
 * Three.js and the land data load only when the globe is near the viewport.
 * Without WebGL it is the caption and the list of places.
 */
import {useEffect,useRef,useState} from 'react';
import type * as T from 'three';
import {whenNear} from '@/lib/motion';

type Place={id:string;name:string;note:string;lat:number;lon:number;main?:boolean};
const PLACES:Place[]=[
 {id:'vn',name:'Vietnam',note:'Where it started · Faraday, 2024',lat:10.8,lon:106.7,main:true},
 {id:'aa',name:'Ann Arbor',note:'Michigan, 2019 – now · A Story',lat:42.28,lon:-83.74,main:true},
 {id:'sf',name:'San Francisco',note:'ISSCC, 2025',lat:37.77,lon:-122.42},
];
const ROUTES:[string,string,number][]=[['vn','aa',.16],['aa','sf',.07]];

export function JourneyGlobe(){
 const host=useRef<HTMLDivElement>(null);
 const labels=useRef<Record<string,HTMLButtonElement|null>>({});
 const [live,setLive]=useState(false);
 const [focus,setFocus]=useState<string|null>(null);
 const goTo=useRef<(id:string)=>void>(()=>{});

 useEffect(()=>{
  const el=host.current;if(!el)return;
  const test=document.createElement('canvas');if(!(test.getContext('webgl2')||test.getContext('webgl')))return;
  let stop=()=>{},alive=true;
  const cancelNear=whenNear(el,()=>{(async()=>{
   const THREE=await import('three');
   const dots:number[]=(await import('@/content/globe-dots.json')).default as number[];
   if(!alive)return;
   const calm=matchMedia('(prefers-reduced-motion: no-preference)').matches;
   const W=()=>el.clientWidth,H=()=>el.clientHeight;
   const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
   renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(W(),H());
   el.appendChild(renderer.domElement);
   const scene=new THREE.Scene();
   const camera=new THREE.PerspectiveCamera(32,W()/H(),.1,50);camera.position.set(0,0,4.6);
   const globe=new THREE.Group();scene.add(globe);

   const toVec=(lat:number,lon:number,r=1)=>{const p=(90-lat)*Math.PI/180,t=(lon+180)*Math.PI/180;return new THREE.Vector3(-r*Math.sin(p)*Math.cos(t),r*Math.cos(p),r*Math.sin(p)*Math.sin(t))};

   // The ocean: deep navy, a little lighter toward the lit side.
   const sphere=new THREE.Mesh(new THREE.SphereGeometry(.995,96,96),new THREE.ShaderMaterial({
    uniforms:{},vertexShader:`varying vec3 vN;varying vec3 vV;void main(){vN=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}`,
    fragmentShader:`varying vec3 vN;varying vec3 vV;void main(){float l=clamp(dot(vN,normalize(vec3(-.4,.5,.8))),0.,1.);vec3 c=mix(vec3(.008,.04,.085),vec3(.02,.085,.16),l);float rim=pow(1.-max(dot(vN,vV),0.),3.);c+=vec3(.91,.75,.39)*rim*.22;gl_FragColor=vec4(c,1.);}`}));
   globe.add(sphere);
   // The atmosphere: a soft halo outside the limb.
   const halo=new THREE.Mesh(new THREE.SphereGeometry(1.16,64,64),new THREE.ShaderMaterial({transparent:true,side:THREE.BackSide,depthWrite:false,blending:THREE.AdditiveBlending,
    vertexShader:`varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`varying vec3 vN;void main(){float i=pow(clamp(.62-dot(vN,vec3(0.,0.,1.)),0.,1.),3.);gl_FragColor=vec4(vec3(.24,.38,.66)*i*.9+vec3(.9,.72,.35)*i*.25,i*.7);}`}));
   scene.add(halo);

   // Land: round dots, cream-brass.
   const pos=new Float32Array(dots.length/2*3);
   for(let i=0;i<dots.length;i+=2){const v=toVec(dots[i]/10,dots[i+1]/10,1.001);pos.set([v.x,v.y,v.z],i/2*3)}
   const dotGeo=new THREE.BufferGeometry();dotGeo.setAttribute('position',new THREE.BufferAttribute(pos,3));
   const sprite=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d')!;const gr=g.createRadialGradient(32,32,0,32,32,30);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.55,'rgba(255,255,255,.95)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.beginPath();g.arc(32,32,30,0,7);g.fill();return new THREE.CanvasTexture(c)})();
   const dotMat=new THREE.PointsMaterial({size:.024,sizeAttenuation:true,map:sprite,transparent:true,depthWrite:false,color:0xf1dfb0,opacity:.92});
   globe.add(new THREE.Points(dotGeo,dotMat));

   // Places: a glowing pin and a slow pulse ring.
   const pinMat=new THREE.MeshBasicMaterial({color:0xf3d58e});
   const pins=PLACES.map(p=>{
    const v=toVec(p.lat,p.lon,1.004);
    const pin=new THREE.Mesh(new THREE.CircleGeometry(p.main?.018:.012,24),pinMat);pin.position.copy(v);pin.lookAt(v.clone().multiplyScalar(2));
    const ring=new THREE.Mesh(new THREE.RingGeometry(.026,.031,40),new THREE.MeshBasicMaterial({color:0xe8c064,transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false}));
    ring.position.copy(v);ring.lookAt(v.clone().multiplyScalar(2));
    globe.add(pin,ring);return {p,v,ring};
   });

   // Routes: great-circle arcs lifted off the surface, revealed by progress, with a travelling light.
   const arcs=ROUTES.map(([a,b,lift],k)=>{
    const A=pins.find(x=>x.p.id===a)!.v.clone().normalize(),B=pins.find(x=>x.p.id===b)!.v.clone().normalize();
    const pts:T.Vector3[]=[];const angle=A.angleTo(B);
    for(let i=0;i<=96;i++){const t=i/96;const v=new THREE.Vector3().addVectors(A.clone().multiplyScalar(Math.sin((1-t)*angle)),B.clone().multiplyScalar(Math.sin(t*angle))).divideScalar(Math.sin(angle));pts.push(v.multiplyScalar(1+lift*Math.sin(Math.PI*t)))}
    const curve=new THREE.CatmullRomCurve3(pts);
    const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uDraw:{value:0},uHead:{value:-1},uMain:{value:k===0?1:.55}},
     vertexShader:`varying float vT;void main(){vT=uv.x;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
     fragmentShader:`uniform float uDraw,uHead,uMain;varying float vT;void main(){if(vT>uDraw)discard;float head=exp(-pow((vT-uHead)*28.,2.));vec3 c=mix(vec3(.85,.62,.22),vec3(1.,.93,.7),head);float a=(.55+head*1.4)*uMain;gl_FragColor=vec4(c*a,a);}`});
    const tube=new THREE.Mesh(new THREE.TubeGeometry(curve,160,k===0?.0055:.0035,8,false),mat);globe.add(tube);
    return {mat,curve};
   });

   // Framing: the journey's midpoint faces the camera.
   const mid=new THREE.Vector3().addVectors(pins[0].v,pins[1].v).normalize();
   const homeYaw=Math.atan2(mid.x,mid.z),homePitch=Math.asin(mid.y);
   let yaw=-homeYaw,pitch=homePitch,vy=0,vp=0,dragging=false,idle=0,lx=0,ly=0;
   let target:{yaw:number;pitch:number}|null=null;
   const ease=(v:number,t:number,k:number)=>v+(t-v)*k;
   const wrap=(a:number)=>{while(a>Math.PI)a-=2*Math.PI;while(a<-Math.PI)a+=2*Math.PI;return a};
   goTo.current=(id:string)=>{const p=pins.find(x=>x.p.id===id);if(!p)return;const v=p.v.clone().normalize();target={yaw:-Math.atan2(v.x,v.z),pitch:Math.asin(v.y)*.8};idle=0};

   const canvas=renderer.domElement;canvas.style.touchAction='pan-y';
   const down=(e:PointerEvent)=>{dragging=true;target=null;lx=e.clientX;ly=e.clientY;vy=vp=0;canvas.setPointerCapture(e.pointerId);el.classList.add('grabbing')};
   const move=(e:PointerEvent)=>{if(!dragging)return;const dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;vy=dx*.0065;vp=dy*.0045;yaw+=vy;pitch=Math.max(-.9,Math.min(.9,pitch+vp));idle=0};
   const up=(e:PointerEvent)=>{dragging=false;el.classList.remove('grabbing');if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId)};
   canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);

   // Draw the routes when the globe is first seen; render only while visible.
   let visible=false,drawn=false,started=0;
   const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible&&!drawn){drawn=true;started=performance.now()}},{threshold:.35});io.observe(el);
   const resize=()=>{renderer.setSize(W(),H());camera.aspect=W()/H();camera.position.z=camera.aspect<.9?6.2:4.6;camera.updateProjectionMatrix()};
   const ro=new ResizeObserver(resize);ro.observe(el);
   const v3=new THREE.Vector3(),camDir=new THREE.Vector3();
   let frame=0,last=performance.now();
   const tick=(now:number)=>{
    frame=requestAnimationFrame(tick);
    const dt=Math.min(.05,(now-last)/1000);last=now;
    if(!visible||document.hidden)return;
    idle+=dt;
    if(!dragging){
     yaw+=vy;pitch=Math.max(-.9,Math.min(.9,pitch+vp));vy*=.94;vp*=.9;
     if(target){yaw=yaw+wrap(target.yaw-yaw)*.07;pitch=ease(pitch,target.pitch,.07);if(Math.abs(wrap(target.yaw-yaw))<.002)target=null}
     else if(idle>4&&calm){yaw=yaw+wrap(-homeYaw-yaw)*.02;pitch=ease(pitch,homePitch,.02)}
    }
    globe.rotation.set(pitch,yaw,0);
    // Routes draw over 2.2s, then a light travels the main one.
    const t=drawn?(now-started)/1000:0;
    arcs.forEach((a,k)=>{const d=calm?Math.min(1,Math.max(0,(t-.3-k*1.6)/2.2)):1;a.mat.uniforms.uDraw.value=d;a.mat.uniforms.uHead.value=d<1?d:((t*.22+k*.5)%1.3)});
    pins.forEach(({ring},k)=>{const s=1+((t*.6+k*.33)%1)*1.6;ring.scale.setScalar(calm?s:1);(ring.material as T.MeshBasicMaterial).opacity=calm?.8*(1-((t*.6+k*.33)%1)):.6});
    renderer.render(scene,camera);
    // Labels follow their pins and fade on the far side.
    camera.getWorldDirection(camDir);
    pins.forEach(({p,v})=>{const lab=labels.current[p.id];if(!lab)return;v3.copy(v).applyMatrix4(globe.matrixWorld);const facing=v3.clone().normalize().dot(camDir.clone().negate());const sp=v3.clone().project(camera);
     const lx=(sp.x*.5+.5)*W();lab.classList.toggle('flip',lx>W()*.6);lab.style.transform=`translate(${lx}px,${(-sp.y*.5+.5)*H()}px)`;lab.style.opacity=String(Math.max(0,Math.min(1,(facing-.08)*5)));lab.style.pointerEvents=facing>.2?'auto':'none'});
   };
   frame=requestAnimationFrame(tick);setLive(true);
   stop=()=>{cancelAnimationFrame(frame);io.disconnect();ro.disconnect();canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);renderer.dispose();scene.traverse(o=>{const m=o as T.Mesh;m.geometry?.dispose?.();const mat=m.material as T.Material|undefined;mat?.dispose?.()});canvas.remove()};
  })().catch(()=>{})},'400px');
  return()=>{alive=false;cancelNear();stop()};
 },[]);

 return <figure className={`journey-globe ${live?'live':''}`}>
  <div ref={host} className="journey-globe-stage" aria-hidden={!live}>
   {PLACES.map(p=><button key={p.id} type="button" ref={n=>{labels.current[p.id]=n}} className={`globe-label ${p.main?'main':''} ${focus===p.id?'on':''}`} onClick={()=>{setFocus(p.id);goTo.current(p.id)}} tabIndex={live?0:-1}><b>{p.name}</b><small>{p.note}</small></button>)}
  </div>
  <figcaption><span className="eyebrow">The route so far</span><span>Vietnam → Ann Arbor, 2019. Drag to turn the globe; choose a place to visit it.</span></figcaption>
 </figure>;
}
