const sharp=require('sharp'),fs=require('fs'),path=require('path');
const base='C:/Users/vngia/Documents/Codex/2026-09-11/https-contests-startgarden-com-5x5night-https';
const out=path.resolve('public/media/story');fs.mkdirSync(out,{recursive:true});
const sources=[
 ['wordmark',`${base}/outputs/namecard-brand-final/ASTORY_WORDMARK_TRANSPARENT.png`,800],
 ['product-world',`${base}/outputs/product-4x3-final/01_ASTORY_5X5_4X3_PRODUCT_HERO_MASTER.png`,1600],
 ['timeline',`${base}/work/app-reference/A-Story-Compressed-v4_Static-MotionReady/02_COMPRESSED_PRIMARY_SCREENS/CM06.png`,786],
 ['conversation',`${base}/work/app-reference/A-Story-Compressed-v4_Static-MotionReady/02_COMPRESSED_PRIMARY_SCREENS/CP01.png`,786],
 ['perspectives',`${base}/work/app-reference/A-Story-Compressed-v4_Static-MotionReady/02_COMPRESSED_PRIMARY_SCREENS/CM08.png`,786],
 ['book',`${base}/work/locked-library/AStory_Master_Visual_Library_UIUX_LOCKED/03_BOOK_OBJECT_FULL_PACKAGE/02_UI_OBJECTS/ASTORY_BOOK_OBJECT_CLOSED_BOOK_THREE_QUARTER_TRANSPARENT_XL_LOCKED.png`,700],
 ['home','C:/Users/vngia/AppData/Local/Temp/codex-clipboard-0e6a43b5-8d36-4226-a924-6bfaa59e9c5d.png',530,{left:381,top:69,width:265,height:621}]
];
(async()=>{for(const [id,source,width,crop] of sources){let p=sharp(path.toNamespacedPath(source));if(crop)p=p.extract(crop);await p.resize({width,withoutEnlargement:true}).webp({quality:92}).toFile(path.join(out,id+'.webp'));}fs.writeFileSync('content/current-story-sources.json',JSON.stringify(sources.map(([id,source,width,crop])=>({id,source,width,crop,classification:id==='wordmark'?'Original brand artwork':id==='home'?'Supplied Figma design':id==='book'?'Approved concept object':id==='product-world'?'Approved editorial concept with product designs':'Approved product orientation design'})),null,2));console.log('Imported 7 approved design assets.');})();

