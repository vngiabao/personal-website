import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {createHash} from 'node:crypto';
const root=path.resolve('..');
const photos=[
 ['portrait','hero-portrait.jpg','Bao Vo at the University of Michigan Law Quad.','Michigan · Ann Arbor'],
 ['smile','portrait-2025.jpg','Bao Vo smiling outdoors.','Bao Vo · Michigan'],
 ['grad','about-grad.jpg','Bao Vo in graduation attire at the University of Michigan, 2023.','Undergraduate graduation · University of Michigan, 2023'],
 ['faraday','exp-faraday.jpg','Bao Vo with colleagues at Faraday Technology Vietnam.','With the Faraday team · Vietnam, 2024'],
 ['isscc','exp-isscc.jpg','Bao Vo with a colleague at ISSCC.','At ISSCC · 2025'],
 ['milead','exp-milead.jpg','Bao Vo with the miLEAD group over dinner.','With the miLEAD community'],
 ['visa','heritage-visa.jpg','Vietnamese international students gathered at Michigan.','VISA · A community in Michigan'],
 ['aodai','heritage-aodai.jpg','A group in Vietnamese traditional dress.','Community and culture at Michigan'],
 ['mackinac','lab-mackinac.jpg','Bao Vo and lab colleagues on a trip to Mackinac Island.','With the lab on Mackinac Island'],
 ['trail','lab-trail.jpg','Friends gathered by a trail sign on an outing.','A day away from the desk'],
 ['lake','break-lake.jpg','View over Devil’s Lake State Park, Wisconsin.','Above Devil’s Lake · Wisconsin'],
 ['poker','personal-poker.jpg','Bao Vo at a poker table.','Poker · Las Vegas'],
 ['soccer','personal-soccer.jpg','Bao Vo playing soccer.','Off the clock · On the field'],
 ['baseball','personal-baseball.jpg','Bao Vo at a batting cage.','At the batting cage'],
 ['articulate','work-articulate.jpg','The ARTiculate team at the Ross +Tech Innovation Jam.','ARTiculate · The team, 2025'],
 ['award','recog-check.jpg','The ARTiculate team holding its Audience Choice award check.','Audience Choice · $1,000 · +Tech Innovation Jam'],
 ['articulate-cover','covers/01.png','Cover of the ARTiculate product concept deck.','ARTiculate · Product concept, 2025'],
 ['aurora-cover','covers/02.png','Cover of the Aurora competition recommendation.','Aurora · SECC competition submission, 2026'],
 ['cagrisema-cover','covers/03.png','Title slide of the MHCC quarterfinal submission.','CagriSema · Quarter Finals Submission, 2025'],
 ['puf-cover','covers/04.png','Title of the team PUF course report.','PUF · Team course project, 2023'],
 ['bandgap-cover','covers/05.png','Title of the low-voltage bandgap reference report.','Bandgap reference · Team course project, 2023'],
 ['articulate-detail','keys/01.png','A selected ARTiculate concept interface exhibit.','Selected exhibit · Product concept, not clinical evidence'],
 ['cagrisema-detail','keys/03.png','A selected strategy exhibit from the 2025 competition.','Selected exhibit · Historical competition analysis, 2025'],
 ['puf-detail','keys/04.png','Original course-project layout figure from the PUF material.','Course-project layout · No fabricated-device claim'],
 ['bandgap-detail','keys/05.png','Original simulation results from the bandgap project.','Course-project results · Simulation, not measurement'],
];
async function main(){
 await fs.mkdir('public/media/ledger',{recursive:true});
 const inputs=photos.map(([id,file,alt,caption])=>({id,source:`images/${file}`,alt,caption,kind:'real'}));
 inputs.push(...[
 ['keepsake','new/astory_hardcover_book_table.png','An open photo album on a wooden table.','Future keepsake · Editorial concept'],
 ['flatlay','new/astory_product_flatlay.png','An illustrative archive of albums, photographs and a tablet.','Archive experience · Editorial concept, not a product screenshot'],
 ['astory-icon','app-icon.png','A Story heart-shaped A brand mark.','A Story · Brand asset'],
 ].map(([id,file,alt,caption])=>({id,source:`v2-planning/recovered/a-story-deck/deck/assets/${file}`,alt,caption,kind:id==='astory-icon'?'brand':'concept'})));
 const previous:Record<string,unknown>[] = JSON.parse(await fs.readFile("content/ledger-media.json","utf8").catch(()=>"[]")); const entries=[];
 for(const item of inputs){
  // Some legacy figures use JPEG rather than PNG. Resolve the existing extension only.
  let source=path.join(root,item.source);
  try{await fs.access(source)}catch{const folder=path.dirname(source);const name=path.parse(source).name;const f=(await fs.readdir(folder)).find(f=>path.parse(f).name===name||path.parse(f).name.startsWith(name+'-'));if(!f)throw Error(source);source=path.join(folder,f);item.source=path.relative(root,source).replaceAll('\\','/')}
  const bytes=await fs.readFile(source);const meta=await sharp(bytes).metadata();const derivatives=[];
  for(const width of [...new Set([420,840,Math.min(1500,meta.width!)])].filter(w=>w<=meta.width!)){
   for(const format of ['avif','webp'] as const){const target=`/media/ledger/${item.id}-${width}.${format}`;const result=await sharp(bytes).rotate().resize({width}).toColourspace('srgb').toFormat(format,{quality:format==='avif'?53:82}).toFile(`public${target}`);derivatives.push({src:target,width:result.width,bytes:result.size,format});}
  }
  entries.push({...previous.find(m=>m.id===item.id),...item,generationAllowed:false,presentationMode:item.id.includes('cover')||item.id.includes('detail')?'document':item.kind==='concept'||item.kind==='brand'?'artwork':['portrait','smile','grad'].includes(item.id)?'portrait':meta.width!>=meta.height!?'landscape':'full',focalPoint:{x:50,y:50},safeCrop:{desktop:false,mobile:false},width:meta.width,height:meta.height,sha256:createHash('sha256').update(bytes).digest('hex'),derivatives});
 }
 await fs.writeFile('content/ledger-media.json',JSON.stringify(entries,null,2));
 for(const style of ['normal','italic'])await fs.copyFile(`node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-${style}.woff2`,`public/fonts/newsreader-${style}.woff2`);
 await fs.copyFile('node_modules/@fontsource-variable/newsreader/LICENSE','public/fonts/newsreader-LICENSE.txt');
 await fs.mkdir('public/documents',{recursive:true});
 for(const file of ['bao-vo-business-resume.pdf','bao-vo-engineering-resume.pdf','faraday-testimonial-bao-vo.pdf','puf-final-report.pdf','puf-final-presentation.pdf','low-voltage-bandgap-reference-report.pdf'])await fs.copyFile(path.join(root,'documents',file),`public/documents/${file}`);
 // Preserve the detailed résumé that is the sole source for several early projects.
 await fs.copyFile(path.join(root,'uploads/Bao N Vo - Engineer Resume.pdf'),'public/documents/engineering-project-history.pdf');
 const copy=await fs.readFile(path.join(root,'CONTENT_V2.md'),'utf8');
 const cases=[...copy.matchAll(/### `\/work\/([^`]+)`\r?\n([\s\S]*?)(?=\n### `\/work\/|\n## `\/book`)/g)].map(m=>{
 const text=m[2];const title=text.match(/^# (.+)$/m)![1];const meta=text.match(/^\*\*(.+)\*\*$/m)![1];const intro=text.split(meta+'**')[1].split('#### Context')[0].trim();
 const sections=[...text.matchAll(/#### (Context|Problem|Work|Result|Reflection)\r?\n([\s\S]*?)(?=\n#### |\n\*\*Evidence|\n\*\*Artifact|$)/g)].map(s=>({label:s[1],paragraphs:s[2].trim().split(/\r?\n\r?\n/).filter(p=>!p.startsWith('Internal')&&!p.startsWith('**'))}));return{slug:m[1],title,meta,intro,sections};
 });
 // Never overwrite the final authored copy when regenerating image derivatives.
 try{await fs.access('content/case-copy.json')}catch{await fs.writeFile('content/case-copy.json',JSON.stringify(cases,null,2))}
 console.log(`Prepared ${entries.length} media assets, ${cases.length} case studies, seven public documents and licensed fonts.`);
}
main().catch(e=>{console.error(e);process.exitCode=1});



