/**
 * The cursor companion's football, drawn on a small canvas so it can roll for
 * real. It is a truncated icosahedron (12 black pentagons, 20 white hexagons,
 * the classic ball); each step turns it about the axis across its path by
 * distance over radius, so the patches travel over the surface as it goes.
 */
type V=[number,number,number];
const PHI=(1+Math.sqrt(5))/2;
const signs=([a,b,c]:V):V[]=>{const out:V[]=[];for(const x of a?[a,-a]:[0])for(const y of b?[b,-b]:[0])for(const z of c?[c,-c]:[0])out.push([x,y,z]);return out};
const cyclic=(vs:V[])=>vs.flatMap(([a,b,c])=>[[a,b,c],[b,c,a],[c,a,b]] as V[]).flatMap(signs);
const dot=(a:V,b:V)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const unit=(v:V):V=>{const l=Math.hypot(...v);return [v[0]/l,v[1]/l,v[2]/l]};

const VERTS=cyclic([[0,1,3*PHI],[1,2+PHI,2*PHI],[PHI,2,2*PHI+1]]);
const RADIUS=Math.hypot(...VERTS[0]);
// A face is every vertex furthest along its axis, in order round that axis.
const face=(axis:V,black:boolean)=>{
 const n=unit(axis),far=Math.max(...VERTS.map(v=>dot(v,n)));
 const ring=VERTS.filter(v=>dot(v,n)>far-1e-6);
 const u=unit(ring[0].map((c,i)=>c-n[i]*dot(ring[0],n)) as V),w:V=[n[1]*u[2]-n[2]*u[1],n[2]*u[0]-n[0]*u[2],n[0]*u[1]-n[1]*u[0]];
 return {n,black,ring:ring.sort((a,b)=>Math.atan2(dot(a,w),dot(a,u))-Math.atan2(dot(b,w),dot(b,u)))};
};
const FACES=[
 ...[...signs([1,1,1]),...cyclic([[0,1/PHI,PHI]])].map(a=>face(a,false)),
 ...cyclic([[0,1,PHI]]).map(a=>face(a,true)),
];

export function football(canvas:HTMLCanvasElement){
 const g=canvas.getContext('2d');
 const S=canvas.width,C=S/2,k=(C-1)/RADIUS;
 // Orientation as a quaternion [w,x,y,z]; it starts with a pentagon facing us.
 const tilt=Math.atan(1/PHI)/2;
 let q=[Math.cos(tilt),Math.sin(tilt),0,0];
 const turn=(ax:number,ay:number,angle:number)=>{
  const s=Math.sin(angle/2),[dw,dx,dy]=[Math.cos(angle/2),ax*s,ay*s],[w,x,y,z]=q;
  q=[dw*w-dx*x-dy*y,dw*x+dx*w+dy*z,dw*y-dx*z+dy*w,dw*z+dx*y-dy*x];
  const l=Math.hypot(...q);q=q.map(c=>c/l);
 };
 const draw=()=>{
  if(!g)return;
  const [w,x,y,z]=q;
  const m=[1-2*(y*y+z*z),2*(x*y-w*z),2*(x*z+w*y),2*(x*y+w*z),1-2*(x*x+z*z),2*(y*z-w*x),2*(x*z-w*y),2*(y*z+w*x),1-2*(x*x+y*y)];
  g.clearRect(0,0,S,S);g.save();
  g.beginPath();g.arc(C,C,C-1,0,Math.PI*2);g.fillStyle='#fbfaf6';g.fill();g.clip();
  g.lineJoin='round';g.lineWidth=S/36;g.strokeStyle='#9ea5ac';
  for(const f of FACES){
   if(m[6]*f.n[0]+m[7]*f.n[1]+m[8]*f.n[2]<=0)continue;
   g.beginPath();
   f.ring.forEach(([a,b,c],i)=>{const px=C+(m[0]*a+m[1]*b+m[2]*c)*k,py=C+(m[3]*a+m[4]*b+m[5]*c)*k;if(i)g.lineTo(px,py);else g.moveTo(px,py)});
   g.closePath();
   if(f.black){g.fillStyle='#151a21';g.fill()}else g.stroke();
  }
  g.restore();
  g.beginPath();g.arc(C,C,C-1,0,Math.PI*2);g.lineWidth=S/30;g.strokeStyle='rgb(13 34 56/.3)';g.stroke();
 };
 return {turn,draw};
}
