import media from './ledger-media.json';

/** A mid-size web image of a ledger photo, for hover peeks (data-peek). */
export function peek(id:string){
 const m=(media as {id:string;derivatives:{src:string;width:number;format:string}[]}[]).find(x=>x.id===id);
 const d=m?.derivatives.filter(x=>x.format==='webp').sort((a,b)=>Math.abs(a.width-640)-Math.abs(b.width-640))[0];
 return d?.src??'';
}
