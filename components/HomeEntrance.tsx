'use client';
import {useLayoutEffect} from 'react';
// The hero entrance is now authored in ScrollMotion (after the intro lifts).
// 'motion' matches none of master.css's keyframe rules, so the old CSS entrance
// stands down; without motion the hero is simply static.
export function HomeEntrance(){useLayoutEffect(()=>{const home=document.querySelector<HTMLElement>('.new-home');if(home)home.dataset.entrance='motion'},[]);return null}
