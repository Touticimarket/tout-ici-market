"use client";
import {useEffect,useState} from "react";
type Slide={kind:"image"|"ad";image?:string;title:string;subtitle?:string;url?:string;cta?:string};
const mainSlide:Slide={kind:"image",image:"/accueil-reel/bandeau-principal.png",title:"Vendre, trouver, acheter — Tout ici"};
const slides:Slide[]=[
 mainSlide,
 {kind:"ad",title:"Votre publicité automobile ici",subtitle:"Garages et professionnels : présentez vos offres aux visiteurs de TOUT ICI ANNONCES.",cta:"Découvrir les annonces",url:"/automobile",image:"/auto-reel/bandeau.svg"},
 mainSlide,
 {kind:"ad",title:"Votre publicité immobilière ici",subtitle:"Un espace premium pour les agences et les acteurs de l'immobilier.",cta:"Voir l'immobilier",url:"/immobilier",image:"/accueil-reel/bandeau.svg"},
 mainSlide,
 {kind:"ad",title:"Votre publicité professionnelle ici",subtitle:"Professionnels : mettez en avant votre activité et vos offres.",cta:"Découvrir les rubriques",url:"/materiel-pro",image:"/accueil-reel/materiel-pro.svg"},
 mainSlide
];
export default function HomeBannerCarousel(){
 const [active,setActive]=useState(0);
 const [paused,setPaused]=useState(false);
 useEffect(()=>{
  if(paused||typeof window==="undefined")return;
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const timer=window.setInterval(()=>setActive(i=>(i+1)%slides.length),10000);
  return()=>window.clearInterval(timer);
 },[paused]);
 const go=(n:number)=>setActive((n+slides.length)%slides.length);
 return <section className="tim-ad-carousel" aria-label="Bannière d’accueil et publicités partenaires" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocusCapture={()=>setPaused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setPaused(false)}}>
 <style>{`
 .tim-ad-carousel{position:relative;isolation:isolate;overflow:hidden;border-radius:15px;background:white;box-shadow:0 5px 22px #16345b18;width:100%}
 .tim-ad-carousel .frame{position:relative;min-height:0;aspect-ratio:1362/294;background:#f5f9ff}
 .tim-ad-carousel .slide{position:absolute;inset:0;opacity:0;visibility:hidden;transition:opacity .55s ease;overflow:hidden}
 .tim-ad-carousel .slide.current{opacity:1;visibility:visible;z-index:1}
 .tim-ad-carousel .slide:has(.main-photo){background:linear-gradient(112deg,#072b63,#1687c8 48%,#d4edff);}\n .tim-ad-carousel .main-photo{display:block;width:100%;height:100%;object-fit:cover;image-rendering:auto}
 .tim-ad-carousel .advert{height:100%;display:flex;align-items:center;justify-content:flex-start;padding:clamp(18px,3.3vw,48px);background:linear-gradient(105deg,#071c43 0%,#0a306b 52%,#071c43 100%);color:white;position:relative}
 .tim-ad-carousel .advert::before{content:"";position:absolute;inset:0 0 0 46%;background-image:var(--ad-image);background-size:cover;background-position:center;filter:contrast(1.08) saturate(1.1);z-index:0}
 .tim-ad-carousel .advert::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#071c43 0%,#071c43 38%,rgba(7,28,67,.94) 49%,rgba(7,28,67,.12) 73%,transparent 100%);z-index:1;pointer-events:none}
 .tim-ad-carousel .slide:nth-child(3) .advert::before{background-position:79% center}
 .tim-ad-carousel .slide:nth-child(2) .advert::before{background-position:55% center}
 .tim-ad-carousel .advert .photo-caption{position:absolute;z-index:2;right:15px;bottom:12px;background:#071c43d9;color:#fff;font-size:12px;font-weight:800;letter-spacing:.04em;padding:7px 12px;border-radius:9px;box-shadow:0 1px 7px #0005}
 .tim-ad-carousel .advert-copy{max-width:52%;position:relative;z-index:2;text-shadow:0 1px 3px #021327}
 .tim-ad-carousel .ad-label{display:inline-flex;padding:5px 10px;border-radius:6px;background:#ffcd0b;color:#071d45;font-weight:900;font-size:clamp(10px,1.1vw,13px);margin-bottom:8px}
 .tim-ad-carousel .advert h2{font-size:clamp(22px,2.4vw,38px);line-height:1.12;margin:0 0 12px;font-weight:900;letter-spacing:-.02em}
 .tim-ad-carousel .advert p{font-size:clamp(14px,1.35vw,18px);margin:0 0 16px;line-height:1.45;font-weight:650}
 .tim-ad-carousel .advert a{display:inline-block;background:#ffd10b;color:#07224d;text-decoration:none;font-size:clamp(13px,1.2vw,16px);font-weight:900;border-radius:13px;padding:10px 17px}
 .tim-ad-carousel .nav{position:absolute;z-index:3;top:50%;transform:translateY(-50%);display:grid;place-items:center;width:36px;height:36px;background:#072b5fcc;color:white;border:1px solid #fff7;border-radius:50%;cursor:pointer;font-size:25px}
 .tim-ad-carousel .nav.previous{left:9px}.tim-ad-carousel .nav.next{right:9px}
 .tim-ad-carousel .dots{position:absolute;bottom:10px;left:50%;transform:translateX(-50%);display:flex;gap:8px;z-index:3}
 .tim-ad-carousel .dot{height:10px;width:10px;padding:0;border:1px solid #fff;border-radius:50%;background:#102b579c;cursor:pointer;box-shadow:0 1px 3px #0005}
 .tim-ad-carousel .dot.active{background:#ffcb05;width:27px;border-radius:12px}
 @media(max-width:650px){.tim-ad-carousel .frame{aspect-ratio:2/1}.tim-ad-carousel .main-photo{object-fit:cover}.tim-ad-carousel .advert{padding:14px 33px}.tim-ad-carousel .advert-copy{max-width:76%}.tim-ad-carousel .advert::before{inset:0 0 0 36%;background-position:center}.tim-ad-carousel .advert::after{background:linear-gradient(90deg,#071c43 0%,#071c43ed 35%,#071c43a0 63%,transparent 100%)}.tim-ad-carousel .advert .photo-caption{display:none}.tim-ad-carousel .nav{width:28px;height:28px;font-size:19px}.tim-ad-carousel .advert h2{font-size:clamp(19px,5vw,25px)}.tim-ad-carousel .advert p{font-size:13px}.tim-ad-carousel .ad-label{font-size:10px}}
 @media(prefers-reduced-motion:reduce){.tim-ad-carousel .slide{transition:none}}
 `}</style>
 <div className="frame">{slides.map((s,i)=><div key={i} className={"slide "+(active===i?"current":"")} aria-hidden={active!==i}>
 {s.kind==="image"?<img className="main-photo" src={s.image} alt={s.title} onError={e=>{e.currentTarget.style.display="none"}} />:<div className="advert" style={{"--ad-image":`url("${s.image}")`} as React.CSSProperties}><div className="advert-copy"><span className="ad-label">PUBLICITÉ — ESPACE DE DÉMONSTRATION</span><h2>{s.title}</h2><p>{s.subtitle}</p><a href={s.url} tabIndex={active===i?0:-1}>{s.cta} →</a></div><span className="photo-caption">{i===1?"AUTOMOBILE":i===3?"IMMOBILIER":"MATÉRIEL PRO"}</span></div>}
 </div>)}</div>
 <button type="button" className="nav previous" onClick={()=>go(active-1)} aria-label="Bannière précédente">‹</button>
 <button type="button" className="nav next" onClick={()=>go(active+1)} aria-label="Bannière suivante">›</button>
 <div className="dots">{slides.map((_,i)=><button type="button" key={i} className={"dot "+(active===i?"active":"")} aria-label={"Afficher la bannière "+(i+1)} aria-current={active===i?"true":undefined} onClick={()=>go(i)}/>)}</div>
 </section>;
}
