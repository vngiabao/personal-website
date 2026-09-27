/**
 * The moment the intro cover starts to lift. The home hero holds its entrance
 * until then; with no intro (repeat visit, reduced motion, other routes) the
 * Intro component resolves it at once.
 */
let release:()=>void=()=>{};
export const introReleased=new Promise<void>(resolve=>{release=resolve});
export const releaseIntro=()=>release();
