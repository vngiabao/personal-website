import {Home} from '@/components/Home';
import {StructuredData} from '@/components/StructuredData';
import {pageMetadata} from '@/content/metadata';
export const metadata=pageMetadata('G. Bao Vo — From silicon to strategy','G. Bao Vo is co-founder, COO and CTO of A Story, an AI biographer for family stories. Technology, fundraising, partnerships and go-to-market, built on an engineering foundation.','/');
export default async function Page({searchParams}:{searchParams:Promise<{composition?:string}>}){const q=await searchParams;return <><StructuredData/><Home variant={q.composition==='a'?'a':'b'}/></>}

