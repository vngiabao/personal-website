import {chromium} from 'playwright';
import fs from 'node:fs/promises';
async function main(){
 await fs.mkdir('qa/gate2',{recursive:true});
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage();const checks=[];
 for(const width of [375,768,1440,1728]){
  await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:3000');await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:`qa/gate2/shell-${width}.png`,fullPage:true,animations:'disabled'});
  checks.push({width,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),fonts:await page.evaluate(()=>({inter:document.fonts.check('18px Inter'),fraunces:document.fonts.check('36px Fraunces')}))});
  if(width<1024){await page.getByRole('button',{name:'Menu',exact:true}).click();await page.screenshot({path:`qa/gate2/menu-${width}.png`,animations:'disabled'});checks.push({width,closeFocus:await page.getByRole('button',{name:'Close menu'}).evaluate(e=>e===document.activeElement)});await page.keyboard.press('Escape');checks.push({width,returnedFocus:await page.getByRole('button',{name:'Menu',exact:true}).evaluate(e=>e===document.activeElement)})}
 }
 await fs.writeFile('qa/gate2/checks.json',JSON.stringify(checks,null,2));console.log(checks);await browser.close();
}
main().catch(e=>{console.error(e);process.exitCode=1});
