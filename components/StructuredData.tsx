import {site} from '@/content/site';

/**
 * Who this site is about, for search engines and AI (schema.org JSON-LD).
 * Links to A Story's own organization record, which already lists Bao.
 */
export function StructuredData(){
 const origin=process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/,'')||'https://gbaonvo.com';
 const data={
  '@context':'https://schema.org',
  '@graph':[
   {'@type':'Person','@id':origin+'/#person',name:site.name,alternateName:['Bao Vo','GB'],url:origin,
    image:origin+'/media/ledger/portrait-840.webp',jobTitle:'Co-founder & COO',
    worksFor:{'@type':'Organization','@id':'https://astoryapp.com/#organization',name:'A Story',url:'https://astoryapp.com'},
    alumniOf:{'@type':'CollegeOrUniversity',name:'University of Michigan',url:'https://umich.edu'},
    address:{'@type':'PostalAddress',addressLocality:'Ann Arbor',addressRegion:'MI',addressCountry:'US'},
    knowsAbout:['Operations','Product strategy','Go-to-market strategy','Healthcare commercialization','Consumer AI products','Integrated circuits'],
    sameAs:[site.linkedin,'https://astoryapp.com/our-story']},
   {'@type':'WebSite','@id':origin+'/#website',url:origin,name:site.name,inLanguage:'en-US',publisher:{'@id':origin+'/#person'}},
  ],
 };
 return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,'\u003c')}}/>;
}
