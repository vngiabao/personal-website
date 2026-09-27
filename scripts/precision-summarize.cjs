const fs = require('fs');
const read = name => JSON.parse(fs.readFileSync(`qa/precision/${name}.json`, 'utf8'));
const sources = ['browser-review', 'story-recheck', 'focused-review'];
const latest = new Map();
const runs = sources.map(source => {
  const report = read(source);
  for (const row of report.results) latest.set(`${row.route}|${row.width}`, {...row, source});
  return {source, pages: report.tested, states: report.stateChecks};
});
const results = [...latest.values()];
const failures = results.flatMap(row => {
  const issues = [];
  if (!row.base.hydrated || row.base.overflow || row.base.broken.length || row.violations.length) issues.push('base/accessibility');
  for (const state of row.states) {
    if (state.overflow || state.broken.length || state.clipped?.length || state.accessibility?.length || state.heightDelta || state.scrollDelta) issues.push(state.label);
  }
  return issues.length ? [{route: row.route, width: row.width, source: row.source, issues}] : [];
});
const navigation = read('navigation-fallbacks'), interactions = read('interactions');
const links = read('links'), media = read('media-audit');
const summary = {
  date: '2026-09-14', build: fs.readFileSync('.next/BUILD_ID', 'utf8').trim(),
  routes: 15, widths: [390,430,768,1024,1280,1440,1728], runs,
  method: 'Latest complete route/width result supersedes the earlier result. Intermediate reports are retained; focused and story-only runs verify visual corrections.',
  consolidated: {pages: results.length, states: results.reduce((n,r) => n + r.states.length, 0), failures},
  navigation: {checks: navigation.checks, failures: navigation.failures},
  interactions: {checks: interactions.checks, failures: interactions.failures},
  links, media
};
fs.writeFileSync('qa/precision/consolidated-review.json', JSON.stringify({results}, null, 2));
fs.writeFileSync('qa/precision/summary.json', JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
if (failures.length || navigation.failures.length || interactions.failures.length || links.failures.length || media.errors.length) process.exitCode = 1;
