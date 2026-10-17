/**
 * Land as a field of dots, for the About page's journey globe.
 * Samples Natural Earth's 50m land (world-atlas) on an equal-area grid and
 * writes content/globe-dots.json: a flat [lat, lon, lat, lon, ...] list in
 * tenths of a degree. Re-run only if the density changes:
 *   node scripts/globe-dots.mjs
 */
import {readFileSync,writeFileSync} from 'node:fs';
import {feature} from 'topojson-client';

const topo=JSON.parse(readFileSync('node_modules/world-atlas/land-50m.json','utf8'));
const land=feature(topo,topo.objects.land);
const polys=land.features.flatMap(f=>f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates);
const boxes=polys.map(p=>{let a=180,b=90,c=-180,d=-90;for(const [x,y] of p[0]){a=Math.min(a,x);b=Math.min(b,y);c=Math.max(c,x);d=Math.max(d,y)}return [a,b,c,d]});
const inRing=(x,y,ring)=>{let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const [xi,yi]=ring[i],[xj,yj]=ring[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)inside=!inside}return inside};
const onLand=(x,y)=>polys.some((p,k)=>{const [a,b,c,d]=boxes[k];if(x<a||x>c||y<b||y>d)return false;if(!inRing(x,y,p[0]))return false;return !p.slice(1).some(h=>inRing(x,y,h))});

const STEP=1.35,out=[];
for(let lat=-58;lat<=82;lat+=STEP){
 const n=Math.max(1,Math.round(360*Math.cos(lat*Math.PI/180)/STEP));
 for(let i=0;i<n;i++){const lon=-180+(i+.5)*360/n;if(onLand(lon,lat))out.push(Math.round(lat*10),Math.round(lon*10))}
}
writeFileSync('content/globe-dots.json',JSON.stringify(out));
console.log('dots',out.length/2);
