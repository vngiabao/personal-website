import {asset} from '@/content/media-manifest';
import {ImageReveal} from '../interactive/ImageReveal';
export function MediaFrame({id,sizes,className,priority=false}:{id:string;sizes:string;className?:string;priority?:boolean}){
 const item=asset(id);const srcset=(format:string)=>item.derivatives.filter(d=>d.format===format).map(d=>`${d.path} ${d.width}w`).join(', ');
 const picture=<picture><source type="image/avif" srcSet={srcset('avif')} sizes={sizes}/><source type="image/webp" srcSet={srcset('webp')} sizes={sizes}/><img src={item.derivatives.find(d=>d.format==='jpg'&&d.width===600)?.path} srcSet={srcset('jpg')} sizes={sizes} width={item.width} height={item.height} alt={item.alt} loading={priority?'eager':'lazy'} fetchPriority={priority?'high':'auto'} decoding="async" style={{objectPosition:`${item.focalPoint.x*100}% ${item.focalPoint.y*100}%`}}/></picture>;
 return <figure className={className}>{id==='keepsake'?<ImageReveal>{picture}</ImageReveal>:picture}<figcaption>{item.caption}</figcaption></figure>
}
