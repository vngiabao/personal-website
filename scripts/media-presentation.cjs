const fs=require('fs');
const file='content/ledger-media.json';
const source=JSON.parse(fs.readFileSync(file,'utf8'));
for(const m of source){
 m.presentationMode=m.id.includes('cover')||m.id.includes('detail')?'document':m.kind==='concept'||m.kind==='brand'?'artwork':['portrait','smile','grad'].includes(m.id)?'portrait':m.width>=m.height?'landscape':'full';
 m.focalPoint={x:50,y:50};
 m.safeCrop={desktop:false,mobile:false};
 m.presentationNote=m.presentationMode==='document'?'Contain the entire source page; never crop meaningful text or figures.':m.kind==='real'?'Preserve the complete photograph, including people and event context.':'Contain within a designed stage; retain concept labeling.';
}
fs.writeFileSync(file,JSON.stringify(source,null,2));
const story='content/current-story-sources.json';
const current=JSON.parse(fs.readFileSync(story,'utf8')).map(m=>({...m,presentationMode:'artwork',focalPoint:{x:50,y:50},safeCrop:{desktop:false,mobile:false}}));
fs.writeFileSync(story,JSON.stringify(current,null,2));
