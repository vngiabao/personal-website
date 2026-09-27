const fs=require('fs');let p='scripts/final-review-server.cjs',s=fs.readFileSync(p,'utf8');
s=s.replace("if(route==='/work'){for",`if(route==='/a-story'){
for(const [i,b] of [...d().querySelectorAll('.memory-journey>nav button')].entries()){b.click();await sleep(250);states.push({...snapshot('memory-'+i),step:d().querySelector('.memory-journey-stage').dataset.step,expectedStep:String(i)})}
for(const [i,b] of [...d().querySelectorAll('.perspective-controls button')].entries()){b.click();await sleep(250);states.push({...snapshot('perspectives-'+i),perspective:d().querySelector('.perspective-stage').dataset.view,originalVoices:d().querySelectorAll('.perspective-card').length,keepsDisagreement:i===4?d().querySelector('.shared-memory').textContent.includes('Mai remembers 1998. Linh’s album note says 1999.'):undefined})}}
if(route==='/work'){for`);
s=s.replace("if(route==='/book'){await new Promise",`if(route==='/work'){for(const [i,b] of [...d().querySelectorAll('.work-filters button')].entries()){b.click();await sleep(250);states.push({...snapshot('filter-'+i),count:d().querySelectorAll('.project-selectors button').length,filter:b.textContent})}}
if(route==='/book'){await new Promise`);
s=s.replace("issues:results.filter(r=>r.violations.length", "issues:results.filter(r=>!r.base.hydrated||r.violations.length");
fs.writeFileSync(p,s);
let motion=fs.readFileSync('scripts/master-motion-server.cjs','utf8').replaceAll('qa/master','qa/final').replaceAll('3103','3106');fs.writeFileSync('scripts/final-motion-server.cjs',motion);
