/**
 * The die, drawn procedurally: the Path laid out as silicon.
 *
 * Two canvases share one layout:
 *   art   what the eye sees — standard-cell rows, copper and aluminium
 *         routing, a seal ring and bond pads, and seven macro blocks placed
 *         the way the Path snakes across Home (four across the top, then back
 *         along the bottom to a double-width A Story core). Each block is drawn
 *         as the circuit its chapter was about.
 *   mask  data for the shader, opaque RGB so nothing is premultiplied:
 *         R  the Path route (core + halo),
 *         G  distance along the route, 0 → 1 (the signal lights everything
 *            with G below its progress),
 *         B  which block a feature belongs to ((index + 1) × 30), so a
 *            block's own circuitry lights when the signal reaches it.
 * Canvas is drawn with 'lighten' on the mask so overlaps keep the maximum.
 */
export const STOPS=[
 {label:'Michigan',year:'2019',tag:'Education'},
 {label:'Peterson Lab',year:'2022',tag:'Research'},
 {label:'Circuit design',year:'2023',tag:'Engineering'},
 {label:'Faraday',year:'2024',tag:'Tape-out'},
 {label:'WICS',year:'2024',tag:'Implantable'},
 {label:'miLEAD',year:'2024',tag:'Strategy'},
 {label:'A Story',year:'2026',tag:'Founder'},
] as const;

type Rect={x:number;y:number;w:number;h:number};
/** Block rectangles in UV (0–1, canvas orientation: y down). */
export const BLOCKS:Rect[]=[
 {x:.08,y:.15,w:.18,h:.24},{x:.30,y:.15,w:.18,h:.24},{x:.52,y:.15,w:.18,h:.24},{x:.74,y:.15,w:.18,h:.24},
 {x:.74,y:.58,w:.18,h:.26},{x:.52,y:.58,w:.18,h:.26},{x:.08,y:.58,w:.40,h:.26},
];
const centre=(b:Rect)=>({x:b.x+b.w/2,y:b.y+b.h/2});

/** The route through every block, Manhattan, as UV points. */
export const ROUTE=(()=>{
 const c=BLOCKS.map(centre);
 const y1=c[0].y,y2=c[4].y;
 return [{x:.03,y:y1},c[0],c[1],c[2],c[3],{x:.955,y:y1},{x:.955,y:y2},c[4],c[5],c[6]];
})();
/** Cumulative arc length of ROUTE, normalised; and where each block is reached. */
export const ROUTE_T=(()=>{
 const d=[0];for(let i=1;i<ROUTE.length;i++)d.push(d[i-1]+Math.hypot(ROUTE[i].x-ROUTE[i-1].x,ROUTE[i].y-ROUTE[i-1].y));
 const total=d.at(-1)!;return d.map(v=>v/total);
})();
export const BLOCK_T=[1,2,3,4,7,8,9].map(i=>ROUTE_T[i]);

/** Point on the route at progress t (0–1), in UV, with its travel direction. */
export function routeAt(t:number){
 t=Math.min(1,Math.max(0,t));
 let i=1;while(i<ROUTE_T.length-1&&ROUTE_T[i]<t)i++;
 const a=ROUTE[i-1],b=ROUTE[i],span=ROUTE_T[i]-ROUTE_T[i-1]||1,f=(t-ROUTE_T[i-1])/span;
 const len=Math.hypot(b.x-a.x,b.y-a.y)||1;
 return {x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f,dx:(b.x-a.x)/len,dy:(b.y-a.y)/len};
}

function rng(seed:number){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

export function drawDie(size=2048){
 const art=document.createElement('canvas'),mask=document.createElement('canvas');
 art.width=art.height=mask.width=mask.height=size;
 const g=art.getContext('2d')!,m=mask.getContext('2d')!;
 const R=rng(26),S=size,px=(v:number)=>v*S;
 const inBlock=(x:number,y:number,pad=0)=>BLOCKS.some(b=>x>b.x-pad&&x<b.x+b.w+pad&&y>b.y-pad&&y<b.y+b.h+pad);
 const sans=`'Mona Sans','Helvetica Neue',Arial,sans-serif`,serif=`'Brygada 1918',Georgia,serif`;

 // Silicon ground.
 const ground=g.createRadialGradient(S*.5,S*.45,S*.1,S*.5,S*.5,S*.75);
 ground.addColorStop(0,'#10213f');ground.addColorStop(1,'#081427');
 g.fillStyle=ground;g.fillRect(0,0,S,S);
 m.fillStyle='#000';m.fillRect(0,0,S,S);m.globalCompositeOperation='lighten';

 // Standard-cell rows everywhere outside the macros.
 const cells=['#142a50','#172f59','#112444','#1b355f','#0f2140'];
 for(let y=.06;y<.94;y+=.0052){
  let x=.06;
  while(x<.94){const w=.002+R()*.009;if(!inBlock(x+w/2,y+.002,.006)){g.fillStyle=cells[(R()*cells.length)|0];g.fillRect(px(x),px(y),px(w)-1,px(.0044))}x+=w+.0006}
 }
 // Routing: short Manhattan wires in two metals, with vias at their bends.
 for(let n=0;n<1400;n++){
  let x=.06+R()*.88,y=.06+R()*.88;if(inBlock(x,y,.01))continue;
  const copper=R()<.55;g.strokeStyle=copper?'rgba(196,146,78,.32)':'rgba(150,172,204,.22)';g.lineWidth=copper?2.2:1.4;
  g.beginPath();g.moveTo(px(x),px(y));
  for(let k=0;k<2+((R()*3)|0);k++){
   if((k+n)%2)x+=(R()-.5)*.12;else y+=(R()-.5)*.08;
   x=Math.min(.94,Math.max(.06,x));y=Math.min(.94,Math.max(.06,y));
   g.lineTo(px(x),px(y));
  }
  g.stroke();g.fillStyle='rgba(222,190,120,.5)';g.fillRect(px(x)-2.5,px(y)-2.5,5,5);
 }
 // Seal ring and bond pads.
 g.strokeStyle='rgba(199,154,43,.55)';g.lineWidth=3;g.strokeRect(px(.02),px(.02),px(.96),px(.96));
 g.lineWidth=1.2;g.strokeRect(px(.028),px(.028),px(.944),px(.944));
 for(let i=0;i<28;i++){const t=.07+i*(.86/27);
  for(const [x,y] of [[t,.036],[t,.944],[.036,t],[.944,t]]){g.fillStyle='rgba(205,168,92,.62)';g.fillRect(px(x)-11,px(y)-11,22,22);g.fillStyle='#0b1a33';g.fillRect(px(x)-6,px(y)-6,12,12)}}

 // The Path route in the mask (and a faint bus in the art).
 const path=(ctx:CanvasRenderingContext2D)=>{ctx.beginPath();ROUTE.forEach((p,i)=>i?ctx.lineTo(px(p.x),px(p.y)):ctx.moveTo(px(p.x),px(p.y)))};
 g.strokeStyle='rgba(199,154,43,.35)';g.lineWidth=7;path(g);g.stroke();
 m.shadowColor='rgb(150,0,0)';m.shadowBlur=26;m.strokeStyle='rgb(255,0,0)';m.lineWidth=6;path(m);m.stroke();m.shadowBlur=0;
 for(let i=1;i<ROUTE.length;i++){
  const a=ROUTE[i-1],b=ROUTE[i],len=Math.hypot(b.x-a.x,b.y-a.y),steps=Math.ceil(len*S/3);
  for(let s=0;s<=steps;s++){const f=s/steps,t=ROUTE_T[i-1]+(ROUTE_T[i]-ROUTE_T[i-1])*f;m.fillStyle=`rgb(0,${Math.round(t*255)},0)`;m.fillRect(px(a.x+(b.x-a.x)*f)-24,px(a.y+(b.y-a.y)*f)-24,48,48)}
 }

 // Macro blocks: each chapter drawn as its circuit, dim in the art and owned in the mask.
 BLOCKS.forEach((b,i)=>{
  const own=`rgb(0,0,${(i+1)*30})`,X=px(b.x),Y=px(b.y),W=px(b.w),H=px(b.h),r=rng(100+i);
  g.fillStyle='#0c1c38';g.fillRect(X,Y,W,H);
  g.strokeStyle='rgba(199,154,43,.55)';g.lineWidth=2;g.strokeRect(X,Y,W,H);
  m.strokeStyle=own;m.lineWidth=4;m.strokeRect(X,Y,W,H);
  const both=(draw:(c:CanvasRenderingContext2D,ink:string)=>void)=>{draw(g,'rgba(170,190,220,.34)');draw(m,own)};
  const ix=X+W*.08,iy=Y+H*.2,iw=W*.84,ih=H*.7;
  if(i===0)both((c,ink)=>{c.fillStyle=ink;for(let yy=iy;yy<iy+ih;yy+=11)for(let xx=ix;xx<ix+iw;xx+=11)if(r()>.28)c.fillRect(xx,yy,5,5)}); // ROM: the foundation, bit by bit
  if(i===1)both((c,ink)=>{c.strokeStyle=ink;c.lineWidth=1.6;const s=18;for(let row=0,yy=iy;yy<iy+ih;yy+=s*.87,row++)for(let xx=ix+(row%2?s/2:0);xx<ix+iw;xx+=s){c.beginPath();c.arc(xx,yy,5,0,7);c.stroke()}}); // crystal lattice: materials
  if(i===2)both((c,ink)=>{c.fillStyle=ink;for(let k=0;k<3;k++){const gx=ix+k*iw/3+8,gy=iy+10;c.globalAlpha=.55;c.fillRect(gx,gy+ih*.3,iw/3-24,ih*.18);c.globalAlpha=1;for(let f=0;f<9;f++)c.fillRect(gx+4+f*((iw/3-32)/9),gy+ih*.18,3,ih*.42)}for(let k=0;k<4;k++){c.strokeStyle=ink;c.lineWidth=2;c.strokeRect(ix+10+k*(iw/4),iy+ih*.72,iw/4-24,ih*.22)}}); // transistors and MIM caps
  if(i===3)both((c,ink)=>{c.strokeStyle=ink;c.lineWidth=2;c.beginPath();const rows=9;for(let k=0;k<rows;k++){const yy=iy+k*ih/rows;c.lineTo(k%2?ix:ix+iw,yy);c.lineTo(k%2?ix+iw:ix,yy);c.lineTo(k%2?ix+iw:ix,yy+ih/rows)}c.stroke();c.fillStyle=ink;for(let k=0;k<40;k++)c.fillRect(ix+r()*iw,iy+r()*ih,8,6)}); // scan chains
  if(i===4)both((c,ink)=>{c.strokeStyle=ink;c.lineWidth=5;const cx=X+W/2,cy=Y+H*.56;c.beginPath();for(let a=0;a<=Math.PI*2*4.2;a+=Math.PI/4){const rr=H*.36-a*H*.0115;c.lineTo(cx+Math.cos(a+Math.PI/8)*rr,cy+Math.sin(a+Math.PI/8)*rr)}c.stroke()}); // octagonal spiral inductor
  if(i===5)both((c,ink)=>{c.fillStyle=ink;for(let yy=iy;yy<iy+ih;yy+=7)for(let xx=ix;xx<ix+iw;xx+=9)c.fillRect(xx,yy,6,4)}); // SRAM array
  if(i===6)both((c,ink)=>{c.strokeStyle=ink;const cx=X+W*.72,cy=Y+H*.56;for(let k=1;k<7;k++){c.lineWidth=k===6?3:1.6;const s=k*H*.06;c.strokeRect(cx-s,cy-s,s*2,s*2)}c.fillStyle=ink;for(let k=0;k<60;k++){c.fillRect(X+W*.06+r()*W*.38,Y+H*.3+r()*H*.6,10+r()*26,5)}}); // the core
  g.fillStyle='rgba(222,196,140,.86)';g.font=`600 ${S*.0105}px ${sans}`;g.letterSpacing='3px';
  // Die markings, as a layout engineer would label a macro.
  g.fillText(`${String(i+1).padStart(2,'0')}  ${STOPS[i].label.toUpperCase()}  ${STOPS[i].year}`,X+W*.06,Y+H*.11);
  if(i===6){g.font=`italic 400 ${S*.036}px ${serif}`;g.letterSpacing='0px';g.fillStyle='rgba(236,214,160,.5)';g.fillText('A',X+W*.72-S*.012,Y+H*.56+S*.013)}
 });

 // Chip art: designers sign their dies. Bottom right, beneath the last row.
 g.fillStyle='rgba(222,196,140,.7)';g.letterSpacing='4px';g.font=`600 ${S*.0095}px ${sans}`;
 g.fillText('BV · MMXXVI · REV A',px(.60),px(.905));
 g.font=`italic 400 ${S*.016}px ${serif}`;g.letterSpacing='0px';g.fillText('From silicon to strategy.',px(.60),px(.935));
 // A tiny arch, the portrait's frame, etched beside the signature.
 g.strokeStyle='rgba(222,196,140,.7)';g.lineWidth=2;g.beginPath();const ax=px(.905),ay=px(.94),aw=px(.028),ah=px(.05);
 g.moveTo(ax-aw/2,ay);g.lineTo(ax-aw/2,ay-ah+aw/2);g.arc(ax,ay-ah+aw/2,aw/2,Math.PI,0);g.lineTo(ax+aw/2,ay);g.stroke();
 return {art,mask};
}
