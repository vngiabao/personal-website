'use client';
/**
 * The GB as an object: the monogram extruded in polished brass, lit by a
 * studio environment, turning toward the pointer and swaying when left alone
 * (the idea behind Bearplus's chrome bear, made ours). Three.js loads only
 * where this is used; without WebGL or with reduced motion it is the flat mark.
 */
import {useEffect,useRef,useState} from 'react';
import {BrandMark} from '@/components/brand/Brand';
import {GB_VIEWBOX,GB_LETTERS,GB_DOT} from '@/components/brand/gbPaths';

export function BrassMark({className=''}:{className?:string}){
 const host=useRef<HTMLDivElement>(null);
 const [live,setLive]=useState(false);
 useEffect(()=>{
  const el=host.current;if(!el)return;
  if(!matchMedia('(prefers-reduced-motion: no-preference)').matches)return;
  const test=document.createElement('canvas');if(!(test.getContext('webgl2')||test.getContext('webgl')))return;
  let stop=()=>{},alive=true;
  (async()=>{
   const THREE=await import('three');
   const {SVGLoader}=await import('three/examples/jsm/loaders/SVGLoader.js');
   const {RoomEnvironment}=await import('three/examples/jsm/environments/RoomEnvironment.js');
   if(!alive)return;
   const w=el.clientWidth,h=el.clientHeight;
   const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
   renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(w,h);
   renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
   el.appendChild(renderer.domElement);
   const scene=new THREE.Scene();
   const pmrem=new THREE.PMREMGenerator(renderer);
   scene.environment=pmrem.fromScene(new RoomEnvironment(),.04).texture;
   const camera=new THREE.PerspectiveCamera(30,w/h,1,4000);camera.position.set(0,0,1500);
   // The mark, extruded with a soft bevel so edges catch the light.
   const [,,vw,vh]=GB_VIEWBOX.split(' ').map(Number);
   const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${GB_VIEWBOX}"><path d="${GB_LETTERS}" fill="#000" fill-rule="evenodd"/></svg>`;
   const data=new SVGLoader().parse(svg);
   const shapes=data.paths.flatMap(p=>SVGLoader.createShapes(p));
   const brass=new THREE.MeshPhysicalMaterial({color:0xc79a3f,metalness:1,roughness:.24,clearcoat:.35,clearcoatRoughness:.3});
   const geo=new THREE.ExtrudeGeometry(shapes,{depth:26,bevelEnabled:true,bevelThickness:5,bevelSize:2.6,bevelSegments:4,curveSegments:24});
   // Centre on the whole mark (letters and period), in SVG space (y down).
   geo.computeBoundingBox();const bb=geo.boundingBox!;
   const cx=(Math.min(bb.min.x,GB_DOT.cx-GB_DOT.r)+Math.max(bb.max.x,GB_DOT.cx+GB_DOT.r))/2,cy=(bb.min.y+Math.max(bb.max.y,GB_DOT.cy+GB_DOT.r))/2,cz=(bb.min.z+bb.max.z)/2;
   geo.translate(-cx,-cy,-cz);
   const mark=new THREE.Mesh(geo,brass);mark.scale.y=-1;
   const dot=new THREE.Mesh(new THREE.CylinderGeometry(GB_DOT.r,GB_DOT.r,30,48),new THREE.MeshPhysicalMaterial({color:0xd9aa48,metalness:1,roughness:.18}));
   dot.rotation.x=Math.PI/2;dot.position.set(GB_DOT.cx-cx,-(GB_DOT.cy-cy),0);
   const group=new THREE.Group();group.add(mark,dot);scene.add(group);
   const fit=()=>{const s=Math.min(el.clientWidth/vw,el.clientHeight/vh)*.9;group.scale.setScalar(s*1500*Math.tan(THREE.MathUtils.degToRad(15))*2/el.clientHeight)};fit();
   let tx=0,ty=0,rx=0,ry=0,idle=0,frame=0;
   const pointer=(e:PointerEvent)=>{const r=el.getBoundingClientRect();tx=((e.clientX-(r.left+r.width/2))/innerWidth)*1.1;ty=((e.clientY-(r.top+r.height/2))/innerHeight)*.7;idle=0};
   const resize=()=>{renderer.setSize(el.clientWidth,el.clientHeight);camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();fit()};
   const clock=new THREE.Timer();
   const tick=()=>{
    clock.update();const dt=Math.min(.05,clock.getDelta()),t=clock.getElapsed();idle+=dt;
    const sway=idle>2.5?Math.sin(t*.6)*.35:0;
    ry+=((tx+sway)-ry)*Math.min(1,dt*4);rx+=(ty-rx)*Math.min(1,dt*4);
    group.rotation.y=ry;group.rotation.x=rx;
    renderer.render(scene,camera);frame=requestAnimationFrame(tick);
   };
   window.addEventListener('pointermove',pointer,{passive:true});window.addEventListener('resize',resize);
   tick();setLive(true);
   stop=()=>{cancelAnimationFrame(frame);window.removeEventListener('pointermove',pointer);window.removeEventListener('resize',resize);geo.dispose();brass.dispose();pmrem.dispose();renderer.dispose();renderer.domElement.remove()};
  })().catch(()=>{});
  return()=>{alive=false;stop()};
 },[]);
 return <div ref={host} className={`brass-mark ${live?'live':''} ${className}`} aria-hidden="true"><BrandMark className="brass-mark-flat"/></div>;
}
