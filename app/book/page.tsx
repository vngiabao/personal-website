import {pageMetadata} from '@/content/metadata';
import {BookReader} from '@/components/BookReader';import '../pages.css';
export const metadata=pageMetadata("The Path, So Far — Interactive Book","A personal record in twelve chapters: Vietnam to Michigan, engineering, strategy, community, and co-founding A Story.","/book");
export default async function Page({searchParams}:{searchParams:Promise<{chapter?:string;mode?:string}>}){const q=await searchParams;return <main id="main" className="book-page"><h1 className="sr-only">The Path, So Far.</h1><BookReader initialChapter={q.chapter} initialMode={q.mode==='scroll'?'scroll':'pages'}/></main>}
