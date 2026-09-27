const fs=require('fs');const p='components/BookReader.tsx';let s=fs.readFileSync(p,'utf8');
s=s.replace("const [pageSide,setPageSide]=useState<'photo'|'text'>('photo');","const [pageSide,setPageSide]=useState<'photo'|'text'>('photo');const [ghostSide,setGhostSide]=useState<'photo'|'text'>('photo');");
s=s.replaceAll('setGhost(current);','setGhost(current);setGhostSide(pageSide);');
s=s.replace('<div className="leaf-front">','<div className="leaf-front"><div className="leaf-mobile">{ghostSide===\'photo\'?<div className="book-left"><p className="eyebrow">{bookChapters[ghost].year} / {bookChapters[ghost].label}</p><BookVisual id={bookChapters[ghost].id} index={ghost}/></div>:<div className="book-right"><BookText index={ghost}/></div>}</div>');
fs.writeFileSync(p,s);
