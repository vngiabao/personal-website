import type {Metadata} from 'next';
import {Header} from '@/components/editorial/Header';
import {Footer} from '@/components/Ledger';
import './globals.css';
import './pages.css';
import './redesign.css';
import './refinement.css';
import './master.css';
import './final.css';
import './quality.css';
import './precision.css';
import './navigation-path.css';
import './story.css';
import './story-sections.css';
import './book.css';
import './motion.css';
import 'lenis/dist/lenis.css';
import './atelier.css';
import {ScrollMotion} from '@/components/ScrollMotion';
import {Intro} from '@/components/motion/Intro';
import {SmoothScroll} from '@/components/motion/SmoothScroll';
import {PageTransition} from '@/components/motion/PageTransition';
import {Interactions} from '@/components/motion/Interactions';
// Runs before first paint. On a first home visit per session (motion allowed)
// it asks for the intro cover; on any home visit it holds the hero for its
// entrance. Both classes have a timeout in case the app bundle never arrives.
// A plain <script>, not next/script: beforeInteractive queues inline code for
// the Next runtime, which runs after first paint. React logs a dev-only notice.
const boot=`(function(){try{var d=document.documentElement;if(location.pathname!=='/'||!matchMedia('(prefers-reduced-motion: no-preference)').matches)return;var seen=false;try{seen=sessionStorage.getItem('bao-intro-seen')==='1'}catch(e){}d.classList.add('hero-hold');if(!seen)d.classList.add('intro');setTimeout(function(){d.classList.remove('intro','hero-hold')},seen?3000:14000)}catch(e){}})();`;
const origin=process.env.NEXT_PUBLIC_SITE_URL;
export const metadata:Metadata={metadataBase:origin?new URL(origin):undefined,title:{default:'Bao Vo — Product, Strategy & Founder',template:'%s — Bao Vo'},description:'Bao Vo is A Story’s Co-founder and COO with a background in engineering, medical technology and commercial strategy. Explore the work, the archive, and the path so far.',icons:{icon:{url:'/icon.svg?v=turn-2',type:'image/svg+xml'},apple:'/apple-icon.png'},robots:{index:!!origin,follow:!!origin},openGraph:{title:'Bao Vo — Product, Strategy & Founder',description:'From silicon to strategy. Currently co-founding A Story.',type:'website',locale:'en_US',...(origin?{url:origin,images:[`${origin}/social-card.png`]}:{})}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:boot}}/><link rel="preload" href="/fonts/mona-sans-latin-wdth-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/><link rel="preload" href="/fonts/brygada-1918-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/><link rel="preload" href="/fonts/brygada-1918-italic.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/></head><body><a className="skip" href="#main">Skip to content</a><Header/><PageTransition>{children}</PageTransition><Footer/><Intro/><ScrollMotion/><SmoothScroll/><Interactions/></body></html>}

