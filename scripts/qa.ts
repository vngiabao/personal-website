import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const revision=process.env.QA_REVISION||'r1';
const output=`qa/${revision}`;
async function main(){
 await fs.mkdir(output,{recursive:true});const browser=await chromium.launch({channel:'chrome',headless:true});const context=await browser.newContext();const page=await context.newPage();const checks:any[]=[];const errors:string[]=[];
 page.on('pageerror',error=>errors.push(error.message));
 for(const width of [375,390,768,1440,1728]){
  const height=width<768?844:width===768?1024:900;await page.setViewportSize({width,height});await page.goto('http://127.0.0.1:3000/?composition=a');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1050);
  await page.screenshot({path:`${output}/home-first-viewport-${width}.png`,animations:'disabled'});
  for(const [id,name] of [['top','hero'],['silicon','silicon'],['signal-handoff','signal'],['a-story','astory-composition-a']]){
   await page.locator(`#${id}`).scrollIntoViewIfNeeded();await page.waitForTimeout(1000);await page.locator(`#${id}`).screenshot({path:`${output}/home-${name}-${width}.png`,animations:'disabled',style:'header,.skip{visibility:hidden!important}'});
  }
  for(const [id,name] of [['silicon','hero-silicon'],['signal-handoff','silicon-story']]){
   await page.locator(`#${id}`).evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-innerHeight*.45));await page.waitForTimeout(1000);await page.screenshot({path:`${output}/home-boundary-${name}-${width}.png`,animations:'disabled'});
  }
  const violations=(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations;
  checks.push({width,composition:'a',overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),violations:violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
  await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`${output}/home-full-a-${width}.png`,fullPage:true,animations:'disabled'});
  await page.goto('http://127.0.0.1:3000/?composition=b');await page.evaluate(()=>document.fonts.ready);await page.locator('#a-story').scrollIntoViewIfNeeded();await page.waitForTimeout(1000);await page.locator('#a-story').screenshot({path:`${output}/home-astory-composition-b-${width}.png`,animations:'disabled',style:'header,.skip{visibility:hidden!important}'});
  checks.push({width,composition:'b',overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});
  if(width===390||width===1440){await page.goto('http://127.0.0.1:3000/?hero=candidate');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1000);await page.locator('#top').screenshot({path:`${output}/home-hero-candidate-${width}.png`,animations:'disabled'})}
 }
 await fs.writeFile(`${output}/checks.json`,JSON.stringify({revision,checks,errors},null,2));console.log(JSON.stringify({revision,checks,errors},null,2));await browser.close();if(errors.length||checks.some(c=>c.overflow||c.violations?.length))process.exitCode=1;
}
main().catch(e=>{console.error(e);process.exitCode=1});
