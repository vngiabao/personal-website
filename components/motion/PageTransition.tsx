'use client';
/**
 * Route changes as one continuous surface.
 *
 * Keyed by pathname, so moving between pages plays an exit and an entrance
 * (app/atelier.css: .page-out leaves fast, .page-in settles slower) while
 * query changes inside a page, such as the Work filters, do not. The header
 * sits outside this boundary and never moves. Browsers without the View
 * Transitions API simply swap the page.
 */
import {ViewTransition} from 'react';
import {usePathname} from 'next/navigation';

export function PageTransition({children}:{children:React.ReactNode}){
 const pathname=usePathname();
 return <ViewTransition key={pathname} enter="page-in" exit="page-out" default="none">{children}</ViewTransition>;
}
