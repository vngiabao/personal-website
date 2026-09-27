const fs = require('fs');
const dir = 'qa/refinement';
const read = name => JSON.parse(fs.readFileSync(`${dir}/${name}.json`, 'utf8'));
const original = read('browser-review');
const updates = [read('book-recheck'), read('path-recheck')];
const results = new Map(original.results.map(r => [`${r.width}:${r.route}`, r]));
for (const report of updates) for (const row of report.results) results.set(`${row.width}:${row.route}`, row);
const issues = [];
for (const r of results.values()) {
  if (r.violations.length) issues.push({width:r.width,route:r.route,violations:r.violations});
  for (const s of [r.base,...r.states]) if (!s.hydrated || s.overflow || s.broken.length || s.counterOverlap || s.clipped?.length || s.accessibility?.length || s.heightDelta || s.scrollDelta) issues.push({width:r.width,route:r.route,state:s});
  for (const prefix of ['path-','work-','story-']) {
    const heights = [...new Set(r.states.filter(s=>s.label.startsWith(prefix)).map(s=>s.height))];
    if (heights.length>1) issues.push({width:r.width,route:r.route,prefix,heights});
  }
}
const navigation = read('navigation-fallbacks'), links = read('links'), media = read('media-audit');
const summary = {buildId:fs.readFileSync('.next/BUILD_ID','utf8').trim(),generatedAt:new Date().toISOString(),sources:['browser-review.json','book-recheck.json','path-recheck.json'],merge:'Later focused rechecks replace matching width and route rows; original reports are retained.',widths:[390,430,768,1024,1280,1440,1728],routeWidthChecks:results.size,stateChecks:[...results.values()].reduce((n,r)=>n+r.states.length,0),issues,navigation:{checks:navigation.checks,failures:navigation.failures},links:{routes:links.pages.length,assets:links.assetsChecked,destinations:links.internalDestinationsChecked,failures:links.failures},media,limitations:'Local browser and automated checks. Reduced-motion and no-JavaScript checks use browser fixtures. No physical-device touch or full assistive-technology certification is claimed.'};
fs.writeFileSync(`${dir}/final-summary.json`,JSON.stringify(summary,null,2));
console.log(JSON.stringify(summary,null,2));
if(issues.length||navigation.failures.length||links.failures.length||media.errors.length)process.exitCode=1;
