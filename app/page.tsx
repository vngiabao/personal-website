import {Home} from '@/components/Home';
import {pageMetadata} from '@/content/metadata';
export const metadata=pageMetadata('Bao Vo — Product, Strategy & Founder','Building products, strategy, and ventures around difficult technology. Currently co-founding A Story, a family archive built through conversation.','/');
export default async function Page({searchParams}:{searchParams:Promise<{composition?:string}>}){const q=await searchParams;return <Home variant={q.composition==='a'?'a':'b'}/>}

