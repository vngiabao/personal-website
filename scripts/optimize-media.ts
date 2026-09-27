import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const root=path.resolve('..');
const selected=[
 {id:'portrait',slot:'P01',source:'images/hero-portrait.jpg',widths:[360,600,900,1126],sourceType:'real-portrait',alt:'Bao Vo standing in the University of Michigan Law Quad.',caption:'At the University of Michigan Law Quad.',focalPoint:{x:.51,y:.55}},
 {id:'faraday',slot:'P02',source:'images/exp-faraday.jpg',widths:[360,600,900,1300],sourceType:'real-event',alt:'Bao Vo with colleagues at Faraday Technology Vietnam.',caption:'With colleagues at Faraday Technology, Vietnam.',focalPoint:{x:.5,y:.5}},
 {id:'keepsake',slot:'P04',source:'v2-planning/recovered/a-story-deck/deck/assets/new/astory_hardcover_book_table.png',widths:[360,600,900,1376],sourceType:'astory-existing-concept',alt:'An open photo album on a wooden table, illustrating a possible keepsake.',caption:'A possible future keepsake · editorial concept',focalPoint:{x:.5,y:.58}},
 {id:'flatlay',slot:'P04-alternative',source:'v2-planning/recovered/a-story-deck/deck/assets/new/astory_product_flatlay.png',widths:[],sourceType:'astory-existing-concept',alt:'An illustrative album, photographs and tablet.',caption:'Archive concept',focalPoint:{x:.5,y:.5}},
];
async function main(){
 await fs.mkdir('public/fonts',{recursive:true});await fs.mkdir('media/original',{recursive:true});await fs.mkdir('public/media/optimized',{recursive:true});
 for(const [family,file] of [['inter','inter-latin-wght-normal.woff2'],['fraunces','fraunces-latin-full-normal.woff2']]){
   await fs.copyFile(`node_modules/@fontsource-variable/${family}/files/${file}`,`public/fonts/${file}`);
   await fs.copyFile(`node_modules/@fontsource-variable/${family}/LICENSE`,`public/fonts/${family}-LICENSE.txt`);
 }
 const inventory=[...JSON.parse(await fs.readFile(path.join(root,'v2-planning/asset-inventory.json'),'utf8')),...JSON.parse(await fs.readFile(path.join(root,'v2-planning/recovered-inventory.json'),'utf8'))];
 const manifest=[];
 for(const item of selected){
   const source=await fs.readFile(path.join(root,item.source));const hash=createHash('sha256').update(source).digest('hex');
   const reference=inventory.find((i:{path:string})=>i.path===item.source);
   if(!reference||reference.sha256!==hash)throw new Error(`Source hash changed: ${item.source}`);
   const originalPath=`media/original/${item.id}${path.extname(item.source)}`;await fs.writeFile(originalPath,source);
   const info=await sharp(source).metadata();const derivatives=[];
   for(const width of item.widths){for(const format of ['avif','webp','jpg'] as const){
     const target=`public/media/optimized/${item.id}-${width}.${format}`;
     const pipeline=sharp(source).rotate().resize({width,withoutEnlargement:true}).toColourspace('srgb');
     const output=await (format==='avif'?pipeline.avif({quality:52,effort:5}):format==='webp'?pipeline.webp({quality:80}):pipeline.jpeg({quality:84,mozjpeg:true})).toFile(target);
     derivatives.push({path:target.slice(6),width:output.width,height:output.height,format,bytes:output.size});
   }}
   manifest.push({...item,page:['/'],section:[item.slot==='P01'?'H01':item.slot==='P02'?'H04':'H07'],intent:item.caption,existingCandidates:[item.source],chosenAsset:item.widths.length?originalPath:null,aspectRatio:{desktop:item.id==='portrait'?'3:4':item.id==='faraday'?'4:3':'16:9',mobile:item.id==='portrait'?'3:4':item.id==='faraday'?'4:3':'16:9'},generationAllowed:false,generationPrompt:null,promptVersion:null,status:item.sourceType==='astory-existing-concept'?'selected-concept':'selected-existing',publication:item.widths.length?'public':'internal',provenance:{sourcePath:item.source,sourceArchive:reference.archive,archiveMember:reference.member,sha256:hash,classificationBasis:'MEDIA_GENERATION_PLAN.md v1.1 selected existing asset',permissionNote:item.sourceType==='astory-existing-concept'?'Reuse permitted as editorial concept; mandatory visible caption.':'Supplied personal website image, selected for reuse in Media Plan v1.1.'},width:info.width,height:info.height,derivatives});
 }
 await fs.mkdir('content',{recursive:true});await fs.writeFile('content/media-data.json',JSON.stringify(manifest,null,2)+'\n');
 console.log('Imported four protected originals; optimized three published images. No generated imagery.');
}
main().catch(e=>{console.error(e);process.exitCode=1});
