'use client';
import {useEffect,useRef,useState} from 'react';
import {navigation,site} from '@/content/site';
import styles from './Header.module.css';
import {usePathname} from 'next/navigation';

export function Header(){
  const pathname=usePathname();
  useEffect(()=>{document.documentElement.dataset.hydrated='true'},[]);
  const dialog=useRef<HTMLDialogElement>(null);
  const menu=useRef<HTMLButtonElement>(null);
  const closeButton=useRef<HTMLButtonElement>(null);
  const savedScroll=useRef(0);
  const [open,setOpen]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{
    let frame=0;
    const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
      setScrolled(window.scrollY>24);
    })};
    window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);update();
    return()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update);cancelAnimationFrame(frame)};
  },[]);
  useEffect(()=>{
    const query=window.matchMedia('(min-width:1024px)');
    const resize=()=>{if(query.matches)dialog.current?.close()};query.addEventListener('change',resize);
    return()=>query.removeEventListener('change',resize);
  },[]);
  function show(){savedScroll.current=window.scrollY;dialog.current?.showModal();setOpen(true);closeButton.current?.focus({preventScroll:true})}
  function closed(){setOpen(false);menu.current?.focus({preventScroll:true});requestAnimationFrame(()=>window.scrollTo(0,savedScroll.current))}
  function trap(event:React.KeyboardEvent<HTMLDialogElement>){
    if(event.key!=='Tab')return;
    const items=[...event.currentTarget.querySelectorAll<HTMLElement>('a[href],button:not([disabled])')].filter(e=>e.getClientRects().length);
    const first=items[0],last=items.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
  }
  return <>
    <div className={styles.reserve} aria-hidden="true"/>
    <header className={styles.header} data-scrolled={scrolled} data-site-header>
      <div className={`container ${styles.row}`}>
        <a href="/" className={styles.wordmark} aria-label="Bao Vo, home">BAO VO<span aria-hidden="true">.</span></a>
        <nav className={styles.desktop} aria-label="Main navigation">{navigation.map(item=><a key={item.href} href={item.href} aria-current={pathname===item.href||pathname.startsWith(item.href+'/')?'page':undefined}>{item.label}</a>)}</nav>
        <button ref={menu} className={styles.menu} onClick={show} aria-haspopup="dialog" aria-expanded={open} aria-controls="navigation-sheet">Menu <span aria-hidden="true"><i/><i/></span></button>
      </div>
    </header>
    <noscript><nav className={`container ${styles.noScript}`} aria-label="Navigation without JavaScript">{navigation.map(item=><a href={item.href} key={item.href}>{item.label}</a>)}</nav><style>{`.${styles.menu}{display:none}`}</style></noscript>
    <dialog id="navigation-sheet" ref={dialog} className={styles.sheet} aria-label="Site navigation" onClose={closed} onKeyDown={trap}>
      <div className={`container ${styles.sheetInner}`}>
        <div className={styles.sheetTop}><a className={styles.wordmark} href="/">BAO VO<span aria-hidden="true">.</span></a><button ref={closeButton} onClick={()=>dialog.current?.close()}>Close <span aria-hidden="true">×</span></button></div>
        <nav aria-label="Mobile navigation" className={styles.sheetLinks}>{navigation.map(item=><a href={item.href} key={item.href} aria-current={pathname===item.href||pathname.startsWith(item.href+'/')?'page':undefined} onClick={()=>dialog.current?.close()}><span>{item.label}</span></a>)}</nav>
        <div className={styles.sheetFoot}><a href={`mailto:${site.email}`}>{site.email}</a><a href="/archive">Archive</a><p>Bao Vo · Ann Arbor, Michigan</p></div>
      </div>
    </dialog>
  </>
}
