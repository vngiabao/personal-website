export const navigation = [
  {label:'A Story',href:'/a-story'}, {label:'Work',href:'/work'},
  {label:'About',href:'/about'}, {label:'Archive',href:'/archive'}, {label:'Contact',href:'/contact'},
] as const;
export const site = {name:'G. Bao Vo',email:'gbao.n.vo@gmail.com',linkedin:'https://www.linkedin.com/in/gbaovo'};

/** A prepared email asking for the résumé (or details); the résumé is sent personally, never posted. */
export function request(kind:'business'|'engineering'|'any'='any',about?:string){
 const subject=about?`Details on ${about}`:kind==='any'?'Résumé request':`Résumé request (${kind})`;
 const body=about?`Hi Bao,\n\nI came across ${about} on gbaonvo.com and would like to know more.\n\n`:`Hi Bao,\n\nI found your site and would like a copy of your${kind==='any'?'':' '+kind} résumé. A little about me and why I'm asking:\n\n`;
 return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
