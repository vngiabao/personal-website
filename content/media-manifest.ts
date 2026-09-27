import data from './media-data.json';
export type MediaAsset=(typeof data)[number];
export const media=data;
export function asset(id:string):MediaAsset{const found=media.find(item=>item.id===id);if(!found||found.publication!=='public')throw new Error(`Unpublished media ${id}`);return found}
