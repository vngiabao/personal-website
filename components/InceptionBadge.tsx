import {inception} from '@/content/inception';

/**
 * NVIDIA's member badge, exactly as supplied: never recoloured, cropped or redrawn. The file
 * includes its own clear space; CSS keeps the visible badge above NVIDIA's 30px digital minimum.
 */
export function InceptionBadge({className=''}:{className?:string}){
 return <img className={`inception-badge ${className}`} src={inception.badge} alt="NVIDIA Inception Program" width={500} height={216} decoding="async"/>;
}
