import type {Metadata} from 'next';

/** Each page shares its own card (scripts/og-cards.ts → public/og/); home keeps the portrait card. */
const card=(route:string)=>route==='/'?'/social-card.png':`/og/${route.slice(1).replace(/\//g,'--')}.png`;

export function pageMetadata(title:string,description:string,route:string):Metadata{const origin=process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/,'');const display=route==='/'?title:`${title} — G. Bao Vo`;const image=origin?[{url:origin+card(route),width:1200,height:630,alt:display}]:undefined;return{title:route==='/'?{absolute:title}:title,description,...(origin?{alternates:{canonical:origin+route}}:{}),openGraph:{title:display,description,type:'website',...(origin?{url:origin+route,images:image}:{})},twitter:{card:'summary_large_image',title:display,description,...(origin?{images:image}:{})}}}
