import type { ReactNode } from "react";
import type { Metadata } from "next";
import HomeBannerCarousel from "./components/HomeBannerCarousel";
export const metadata:Metadata={
 title:"TOUT ICI ANNONCES — Annonces gratuites pour les particuliers",
 description:"Tout acheter, tout vendre, tout trouver. Site d’annonces gratuites pour les particuliers : automobile, immobilier, maison, loisirs et plus encore.",
 metadataBase:new URL("https://tout-ici-market.vercel.app"),
 openGraph:{title:"TOUT ICI ANNONCES — Annonces gratuites",description:"Tout acheter, tout vendre, tout trouver. Découvrez les annonces gratuites pour les particuliers.",url:"https://tout-ici-market.vercel.app",siteName:"TOUT ICI ANNONCES",type:"website"},
 twitter:{card:"summary",title:"TOUT ICI ANNONCES — Annonces gratuites",description:"Tout acheter, tout vendre, tout trouver."}
};
const rubriques = [
  {nom:"Véhicules",href:"/automobile",icone:"🚘"},
  {nom:"Immobilier",href:"/immobilier",icone:"⌂"},
  {nom:"Emploi",href:"/emploi",icone:"▣"},
  {nom:"Matériel pro",href:"/materiel-pro",icone:"🛠"},
  {nom:"Maison, Bricolage & Jardin",href:"/maison-jardin",icone:"▤"},
  {nom:"TV, Téléphonie & Informatique",href:"/telephones",icone:"▥"},
  {nom:"Loisirs & Voyages",href:"/vacances-loisirs",icone:"✈"},
  {nom:"Famille",href:"/famille",icone:"♡"},
  {nom:"Bon plan",href:"/bon-plan",icone:"★"},
  {nom:"Autres",href:"/autres",icone:"▦"}
];
export default function RootLayout({children}:{children:ReactNode}){
  return <html lang="fr"><body style={{margin:0,background:"#f2f6fb",fontFamily:"Arial,Helvetica,sans-serif"}}>
    <style>{`
      .tim-header{background:#041837;color:white;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:16px clamp(15px,3vw,45px)}
      .tim-logo{display:block;width:clamp(250px,27vw,395px);flex-shrink:0}
      .tim-logo img{display:block;width:100%;height:auto;max-height:155px;object-fit:contain}
      .tim-logo-caption{display:block;color:#fff;font-size:clamp(10px,1.05vw,13px);font-weight:700;text-align:center;line-height:1.35;margin-top:3px}
      .tim-search{display:flex;flex:1;max-width:420px;height:42px;border-radius:32px;background:#fff;overflow:hidden}
      .tim-search input{flex:1;width:0;min-width:0;border:0;outline:0;padding:0 20px;font-size:15px}
      .tim-search button{border:0;background:#ffcf06;padding:0 20px;font-size:21px;cursor:pointer}
      .tim-home-search{display:flex;align-items:center;flex:1;max-width:500px;min-width:200px;height:48px;border-radius:25px;background:#fff;padding:5px;gap:8px}.tim-home-search .search-symbol{font-size:23px;color:#09234e;padding-left:12px}.tim-home-search input{flex:1;width:0;min-width:0;border:0;outline:0;padding:9px;font-size:15px}.tim-home-search button{background:#ffcf06;color:#09234e;border:0;border-radius:22px;padding:11px 17px;font-weight:800;cursor:pointer}
      .tim-sidebar-image{display:none}
      .tim-header-links{display:flex;align-items:center;gap:10px;white-space:nowrap}
      .tim-header-links a{color:#fff;text-decoration:none;font-weight:700;font-size:14px}
      .tim-header-links .tim-post{background:#ffcf06;color:#001942;padding:15px 20px;border-radius:19px}
      .tim-navbar{display:flex;background:#052453;overflow-x:auto;padding:0 12px;gap:4px;scrollbar-width:thin;justify-content:space-between}
      .tim-navbar a{white-space:nowrap;color:#fff;text-decoration:none;padding:14px 10px;font-weight:700;font-size:13px}
      .tim-navbar a:hover{background:#0a4b9e}
      .tim-shell{display:grid;grid-template-columns:205px minmax(0,1fr);gap:12px;max-width:1800px;margin:auto;padding:12px 12px}
      .tim-sidebar{background:#f8fbff;border:1px solid #e0e9f5;border-radius:14px;padding:6px;position:sticky;top:16px;align-self:start}
      .tim-sidebar a{display:flex;align-items:center;gap:12px;color:#091d45;text-decoration:none;padding:12px 7px;border-bottom:1px solid #dfebf7;font-size:12px;font-weight:800;border-radius:9px}
      .tim-sidebar a:last-child{border-bottom:0}
      .tim-sidebar-title{background:#ffd10d;color:#081a40;font-size:13px;font-weight:900;border-radius:9px;padding:11px 7px;margin-bottom:7px}
      .tim-sidebar a:first-of-type{background:#fff;color:#091d45}
      .tim-sidebar a:hover,.tim-sidebar a:focus-visible,.tim-sidebar a:first-of-type:hover,.tim-sidebar a:first-of-type:focus-visible{background:#ffe04e;color:#091d45}
      .tim-sidebar .tim-sidebar-icon{font-size:17px;width:20px;flex-shrink:0;text-align:center}
      .tim-sidebar .tim-sidebar-chevron{margin-left:auto}
      .tim-content{min-width:0}
      @media(min-width:761px) and (max-width:980px){.tim-shell{grid-template-columns:180px minmax(0,1fr)}.tim-navbar{justify-content:flex-start}}
      @media(max-width:1050px){.tim-search{display:none}.tim-header{flex-wrap:wrap}.tim-home-search{order:3;max-width:none;flex-basis:100%}.tim-header-links{gap:10px}}
      .tim-auto-sidebar-post{display:none}
      .tim-shell:has(.auto-home) .tim-auto-sidebar-post{display:flex;align-items:center;justify-content:center;gap:7px;background:linear-gradient(#073e9c,#052b79);color:#fff;font-size:16px;font-weight:900;border-radius:13px;padding:15px 8px;margin:1px 2px 10px;text-decoration:none}
      .tim-shell:has(.auto-home) .tim-sidebar{background:linear-gradient(#fff,#f3f8ff);border:1px solid #d8e5f6;border-radius:15px;padding:8px}
      .tim-shell:has(.auto-home) .tim-sidebar-title{background:transparent;padding:12px 8px;color:#0a235d}
      .tim-shell:has(.auto-home) .tim-sidebar a:not(.tim-auto-sidebar-post){background:transparent;font-size:13px;min-height:43px}
      .tim-shell:has(.auto-home) .tim-sidebar a[href="/automobile"]{background:#ffcf0a;font-weight:900;border-radius:13px}
      .tim-shell:has(.auto-home) .tim-sidebar-image{display:none}
      /* Automobile : bandeau sur toute la largeur, rubriques à gauche seulement sous l’image. */
      .tim-shell:has(.auto-home){grid-template-areas:"auto-hero auto-hero" "auto-side auto-main";align-items:start}
      .tim-shell:has(.auto-home)>.tim-sidebar{grid-area:auto-side}
      .tim-shell:has(.auto-home)>.tim-content{display:contents}
      .tim-shell:has(.auto-home) .auto-home{display:contents}
      .tim-shell:has(.auto-home) .auto-home .hero{grid-area:auto-hero;margin:0;width:100%;border-radius:12px;overflow:hidden}
      .tim-shell:has(.auto-home) .auto-home .main-panel{grid-area:auto-main;margin:0}
      @media(max-width:760px){.tim-shell:has(.auto-home){grid-template-columns:minmax(0,1fr);grid-template-areas:"auto-hero" "auto-side" "auto-main"}}
      @media(max-width:760px){.tim-sidebar-title{flex-shrink:0;white-space:nowrap}.tim-shell{grid-template-columns:1fr}.tim-sidebar{position:static;display:flex;overflow-x:auto;white-space:nowrap;padding:5px}.tim-sidebar a{border:0;flex-shrink:0;font-size:13px}.tim-sidebar .tim-sidebar-chevron{display:none}.tim-header{gap:10px;flex-wrap:wrap}.tim-header-links{margin-left:auto}.tim-header-links a:not(.tim-post){display:none}.tim-header-links .tim-post{padding:12px;font-size:12px}}

      /* En-tête plus compact : logo préservé, navigation principale plus lisible. */
      .tim-header{min-height:91px;padding:8px clamp(14px,2vw,32px);gap:18px}
      .tim-logo{width:clamp(175px,17vw,250px)}
      .tim-logo img{max-height:74px}
      .tim-logo-caption{font-size:10px}
      .tim-navbar{min-height:64px;align-items:stretch;gap:4px;background:#06275d;border-bottom:3px solid #ffd20b}
      .tim-navbar a{display:flex;align-items:center;justify-content:center;font-size:clamp(14px,1.02vw,18px);font-weight:850;padding:14px clamp(9px,1vw,18px)}
      .tim-navbar a:hover,.tim-navbar a:focus-visible{background:#164a91}
      @media(max-width:760px){.tim-header{min-height:75px}.tim-logo{width:180px}.tim-logo img{max-height:65px}.tim-navbar{min-height:56px;justify-content:flex-start}.tim-navbar a{font-size:15px}}
      /* En-tête blanc sur toutes les rubriques : le nouveau logo conserve son ratio naturel. */
      .tim-header{background:#ffffff!important;color:#0a2555!important;min-height:150px!important;border-bottom:1px solid #e4ebf4;box-shadow:0 3px 14px rgba(13,39,82,.06)}
      .tim-logo{width:clamp(260px,23vw,330px)!important;flex-shrink:0!important;text-decoration:none!important}
      .tim-logo img{display:block!important;width:100%!important;height:auto!important;max-height:140px!important;object-fit:contain!important;aspect-ratio:auto!important}
      .tim-logo-caption{color:#163b78!important;font-size:11px;line-height:1.3;font-weight:750}
      .tim-header-links a{color:#102c60!important}
      .tim-header-links .tim-post{background:#ffcf06!important;color:#071e4a!important}
      .tim-home-search{border:1px solid #ccd8eb;box-shadow:0 2px 11px rgba(6,40,91,.08)}
      .tim-navbar{background:#ffffff!important;border-bottom:3px solid #ffd20b!important;box-shadow:0 3px 10px rgba(8,33,75,.05)}
      .tim-navbar a{color:#0b2d68!important}
      .tim-navbar a:hover,.tim-navbar a:focus-visible{background:#fff0a4!important;color:#092452!important}
      @media(max-width:1100px){.tim-logo{width:clamp(240px,31vw,315px)!important}}
      @media(max-width:760px){.tim-header{min-height:115px!important}.tim-logo{width:clamp(210px,65vw,310px)!important}.tim-logo img{max-height:110px!important}.tim-navbar{min-height:56px}}


      /* Lisibilité accrue de la navigation sur toutes les pages. */
      .tim-shell{grid-template-columns:240px minmax(0,1fr);gap:14px}
      .tim-navbar{min-height:70px;justify-content:flex-start;gap:3px}
      .tim-navbar a{font-size:clamp(15px,1.1vw,17px);padding:17px clamp(12px,1.12vw,19px);line-height:1.35}
      .tim-sidebar{padding:9px}
      .tim-sidebar-title{font-size:16px;padding:13px 9px}
      .tim-sidebar a{font-size:14px;line-height:1.35;min-height:49px;padding:12px 9px;gap:10px}
      .tim-sidebar .tim-sidebar-icon{font-size:20px;width:24px}
      .tim-shell:has(.auto-home) .tim-sidebar a:not(.tim-auto-sidebar-post){font-size:14px;min-height:50px}
      @media(min-width:761px) and (max-width:1050px){.tim-shell{grid-template-columns:220px minmax(0,1fr)}.tim-navbar{justify-content:flex-start}}
      @media(max-width:760px){.tim-shell{display:block}.tim-navbar{min-height:60px;justify-content:flex-start}.tim-navbar a{font-size:15px;padding:14px 13px}.tim-sidebar{display:flex;overflow-x:auto;white-space:nowrap}.tim-sidebar a{font-size:14px;min-height:48px;flex-shrink:0}.tim-sidebar-title{font-size:14px}}


      /* Colonne des rubriques : charte de la page Véhicules sur tout le site. */
      .tim-sidebar,body:has(.tim-home) .tim-sidebar{
        background:linear-gradient(180deg,#ffffff 0%,#f3f8ff 100%)!important;
        border:1px solid #d8e5f6!important;border-radius:15px!important;
        padding:9px!important;box-shadow:0 2px 10px #153b6a12!important;
      }
      .tim-sidebar-title,body:has(.tim-home) .tim-sidebar-title{
        background:#ffffff!important;color:#09265f!important;
        border-left:5px solid #ffcd0b!important;border-radius:9px!important;
        padding:14px 10px!important;margin:0 0 9px!important;
        font-size:17px!important;font-weight:900!important;line-height:1.25!important;
      }
      .tim-sidebar .tim-auto-sidebar-post,body:has(.tim-home) .tim-sidebar .tim-auto-sidebar-post{
        display:flex!important;align-items:center!important;justify-content:center!important;
        gap:7px!important;background:linear-gradient(180deg,#073e9c,#052b79)!important;
        color:#ffffff!important;border:0!important;border-radius:13px!important;
        font-size:15px!important;font-weight:900!important;line-height:1.2!important;
        min-height:51px!important;padding:12px 9px!important;
        margin:2px 1px 11px!important;text-align:center!important;
      }
      .tim-sidebar a:not(.tim-auto-sidebar-post),body:has(.tim-home) .tim-sidebar a:not(.tim-auto-sidebar-post){
        background:transparent!important;color:#09265f!important;
        border-bottom:1px solid #e0eaf6!important;border-radius:9px!important;
        padding:11px 9px!important;min-height:51px!important;
        font-size:14px!important;font-weight:800!important;line-height:1.32!important;
        gap:10px!important;
      }
      .tim-sidebar a:not(.tim-auto-sidebar-post):hover,
      .tim-sidebar a:not(.tim-auto-sidebar-post):focus-visible,
      body:has(.tim-home) .tim-sidebar a:not(.tim-auto-sidebar-post):hover,
      body:has(.tim-home) .tim-sidebar a:not(.tim-auto-sidebar-post):focus-visible{
        background:#ffdf4d!important;color:#082453!important;
        border-bottom-color:#eac83b!important;
      }
      .tim-sidebar .tim-sidebar-image,body:has(.tim-home) .tim-sidebar .tim-sidebar-image{display:none!important}
      .tim-sidebar .tim-sidebar-icon,body:has(.tim-home) .tim-sidebar .tim-sidebar-icon{
        display:inline-block!important;font-size:20px!important;width:26px!important;
        flex-shrink:0!important;text-align:center!important;color:#0b3f8d!important;
      }
      .tim-shell:has(.auto-home) .tim-sidebar a[href="/automobile"]{
        background:#ffcf0a!important;color:#082453!important;
        border-radius:11px!important;font-weight:900!important;
      }
      @media(max-width:760px){
        .tim-sidebar,body:has(.tim-home) .tim-sidebar{display:flex!important;align-items:center!important;overflow-x:auto!important}
        .tim-sidebar-title,body:has(.tim-home) .tim-sidebar-title{display:none!important}
        .tim-sidebar .tim-auto-sidebar-post,body:has(.tim-home) .tim-sidebar .tim-auto-sidebar-post{
          flex-shrink:0!important;min-height:47px!important;margin:0 7px 0 0!important;
        }
        .tim-sidebar a:not(.tim-auto-sidebar-post),body:has(.tim-home) .tim-sidebar a:not(.tim-auto-sidebar-post){
          min-height:47px!important;flex-shrink:0!important;border-bottom:0!important;
        }
      }


      /* Harmonisation de la charte : même bandeau et rubriques sur toutes les pages. */
      .tim-shared-banner{width:calc(100% - 24px);max-width:1776px;margin:14px auto 0}
      .tim-shared-banner .tim-ad-carousel{border:1px solid #dce6f3;border-radius:16px}
      html body .tim-header{background:#fff!important;color:#0b285e!important;min-height:150px!important;border-bottom:1px solid #e4ebf4!important}
      html body .tim-header .tim-logo{display:block!important;width:clamp(260px,23vw,330px)!important}
      html body .tim-header .tim-logo img{max-height:140px!important;height:auto!important;width:100%!important;object-fit:contain!important}
      html body .tim-header .tim-header-links a:not(.tim-post){color:#102c60!important}
      html body .tim-header .tim-header-links .tim-post{background:#ffcf06!important;color:#071e4a!important}
      html body .tim-navbar{display:flex!important;background:#fff!important;min-height:70px!important;border-bottom:3px solid #ffd20b!important;justify-content:flex-start!important;align-items:stretch!important;gap:3px!important}
      html body .tim-navbar a{color:#0b2d68!important;font-size:clamp(15px,1.1vw,17px)!important;font-weight:850!important;padding:16px clamp(11px,1.08vw,18px)!important;line-height:1.3!important}
      html body .tim-navbar a:hover,html body .tim-navbar a:focus-visible{background:#ffe04e!important;color:#082453!important}
      html body .tim-sidebar{display:block!important;background:linear-gradient(#fff,#f3f8ff)!important}
      html body .tim-sidebar .tim-auto-sidebar-post{display:flex!important}
      html body .tim-sidebar .tim-sidebar-title{display:block!important}
      html body .tim-sidebar .tim-sidebar-image{display:none!important}
      html body .tim-sidebar .tim-sidebar-icon{display:inline-block!important}
      /* Automobile : la bannière commune remplace l'ancien bandeau de catégorie. */
      html body .tim-shell:has(.auto-home){display:grid!important;grid-template-columns:240px minmax(0,1fr)!important;grid-template-areas:none!important;align-items:start!important}
      html body .tim-shell:has(.auto-home)>.tim-sidebar{grid-area:auto!important}
      html body .tim-shell:has(.auto-home)>.tim-content{display:block!important}
      html body .tim-shell:has(.auto-home) .auto-home{display:block!important;margin:0!important}
      html body .tim-shell:has(.auto-home) .auto-home .main-panel{display:block!important;margin:0!important}
      @media(max-width:1050px) and (min-width:761px){html body .tim-shell:has(.auto-home){grid-template-columns:220px minmax(0,1fr)!important}}
      @media(max-width:760px){
        .tim-shared-banner{width:calc(100% - 16px);margin-top:8px}
        html body .tim-navbar{min-height:58px!important;justify-content:flex-start!important}
        html body .tim-navbar a{font-size:15px!important;padding:13px 12px!important}
        html body .tim-shell:has(.auto-home){display:flex!important;flex-direction:column!important}
        html body .tim-sidebar{display:flex!important;overflow-x:auto!important}
        html body .tim-sidebar .tim-sidebar-title{display:none!important}
        html body .tim-header{min-height:115px!important}
      }


      /* Priorité aux styles communs, y compris sur l'accueil et dans Mon compte. */
      html body:has(.tim-home) .tim-header,
      html body:has(.tim-account-dashboard) .tim-header{display:flex!important;background:#fff!important;color:#0b285e!important;min-height:150px!important;border-bottom:1px solid #e4ebf4!important;padding:8px clamp(14px,2vw,32px)!important;gap:18px!important}
      html body:has(.tim-home) .tim-header .tim-logo,
      html body:has(.tim-account-dashboard) .tim-header .tim-logo{display:block!important;width:clamp(260px,23vw,330px)!important}
      html body:has(.tim-home) .tim-header .tim-logo img,
      html body:has(.tim-account-dashboard) .tim-header .tim-logo img{max-height:140px!important;width:100%!important;height:auto!important}
      html body:has(.tim-home) .tim-header .tim-header-links a:not(.tim-post),
      html body:has(.tim-account-dashboard) .tim-header .tim-header-links a:not(.tim-post){color:#102c60!important}
      html body:has(.tim-home) .tim-header .tim-header-links .tim-post,
      html body:has(.tim-account-dashboard) .tim-header .tim-header-links .tim-post{background:#ffcf06!important;color:#071e4a!important}
      html body:has(.tim-home) .tim-navbar,
      html body:has(.tim-account-dashboard) .tim-navbar{display:flex!important;background:#fff!important;min-height:70px!important;border-bottom:3px solid #ffd20b!important;justify-content:flex-start!important;gap:3px!important;padding:0 12px!important}
      html body:has(.tim-home) .tim-navbar a,
      html body:has(.tim-account-dashboard) .tim-navbar a{color:#0b2d68!important;font-size:clamp(15px,1.1vw,17px)!important;padding:16px clamp(11px,1.08vw,18px)!important}
      html body:has(.tim-home) .tim-navbar a:first-child{font-size:clamp(15px,1.1vw,17px)!important}
      html body:has(.tim-home) .tim-navbar a:first-child::before{content:none!important;display:none!important}
      html body:has(.tim-account-dashboard) .tim-sidebar{display:block!important}
      html body:has(.tim-home) .tim-shell{grid-template-columns:240px minmax(0,1fr)!important;gap:14px!important}
      html body:has(.tim-account-dashboard) .tim-shell{grid-template-columns:240px minmax(0,1fr)!important}
      @media(max-width:1050px) and (min-width:761px){
        html body:has(.tim-home) .tim-shell,
        html body:has(.tim-account-dashboard) .tim-shell{grid-template-columns:220px minmax(0,1fr)!important}
      }
      @media(max-width:760px){
        html body:has(.tim-home) .tim-header,
        html body:has(.tim-account-dashboard) .tim-header{min-height:115px!important;flex-wrap:wrap!important}
        html body:has(.tim-home) .tim-shell,
        html body:has(.tim-account-dashboard) .tim-shell{display:flex!important;flex-direction:column!important}
        html body:has(.tim-account-dashboard) .tim-sidebar{display:flex!important}
        html body:has(.tim-home) .tim-navbar,
        html body:has(.tim-account-dashboard) .tim-navbar{min-height:60px!important;overflow-x:auto!important}
        html body:has(.tim-home) .tim-navbar a,
        html body:has(.tim-account-dashboard) .tim-navbar a{font-size:15px!important;padding:13px 12px!important}
      }


      /* Navigation unifiée : centrage, lisibilité et survol jaune doré. */
      html body .tim-navbar,
      html body:has(.tim-home) .tim-navbar,
      html body:has(.tim-account-dashboard) .tim-navbar{
        justify-content:safe center!important;
        min-height:76px!important;
        gap:3px!important;
        padding:0 12px!important;
        overflow-x:auto!important;
        scrollbar-width:thin;
      }
      html body .tim-navbar a,
      html body:has(.tim-home) .tim-navbar a,
      html body:has(.tim-account-dashboard) .tim-navbar a{
        font-size:clamp(16px,1.16vw,19px)!important;
        font-weight:850!important;
        line-height:1.35!important;
        padding:17px clamp(10px,1.05vw,19px)!important;
        border-radius:9px!important;
        transition:background-color .15s ease,color .15s ease!important;
      }
      html body .tim-navbar a:is(:hover,:focus-visible),
      html body:has(.tim-home) .tim-navbar a:is(:hover,:focus-visible),
      html body:has(.tim-account-dashboard) .tim-navbar a:is(:hover,:focus-visible){
        background:#ffcc00!important;
        color:#082452!important;
        box-shadow:inset 0 -3px 0 #d6a300!important;
      }
      html body .tim-sidebar a:not(.tim-auto-sidebar-post):is(:hover,:focus-visible),
      html body:has(.tim-home) .tim-sidebar a:not(.tim-auto-sidebar-post):is(:hover,:focus-visible),
      html body:has(.tim-account-dashboard) .tim-sidebar a:not(.tim-auto-sidebar-post):is(:hover,:focus-visible){
        background:#ffcc00!important;
        color:#082452!important;
        border-bottom-color:#dcb000!important;
        box-shadow:inset 4px 0 0 #e4a900!important;
      }
      html body .tim-sidebar a:not(.tim-auto-sidebar-post):is(:hover,:focus-visible) .tim-sidebar-icon{
        color:#082452!important;
      }
      @media(max-width:900px){
        html body .tim-navbar,
        html body:has(.tim-home) .tim-navbar,
        html body:has(.tim-account-dashboard) .tim-navbar{
          justify-content:flex-start!important;
          min-height:62px!important;
        }
        html body .tim-navbar a,
        html body:has(.tim-home) .tim-navbar a,
        html body:has(.tim-account-dashboard) .tim-navbar a{
          font-size:15px!important;
          padding:13px 12px!important;
          flex-shrink:0!important;
        }
      }

    `}</style>
    <header className="tim-header">
      <a className="tim-logo" href="/" aria-label="Accueil TOUT ICI ANNONCES"><img src="/tout-ici-annonces-officiel.svg" alt="TOUT ICI ANNONCES"/><span className="tim-logo-caption">Site d’annonces gratuites pour les particuliers</span></a>
      <form className="tim-home-search" action="/automobile/voitures" role="search"><span className="search-symbol" aria-hidden="true">⌕</span><input type="search" name="q" aria-label="Que recherchez-vous ?" placeholder="Que recherchez-vous ?" /><button type="submit">Rechercher</button></form>
      
      <nav className="tim-header-links" aria-label="Espace utilisateur">
        <a href="/compte">♙ Mon compte</a>
        <a href="/favoris">♡ Mes favoris</a>
        <a className="tim-post" href="/deposer">＋ Déposer une annonce</a>
      </nav>
    </header>
    <nav className="tim-navbar" aria-label="Navigation principale">
      <a href="/">Accueil</a>
      <a href="/automobile">Véhicules</a>
      <a href="/immobilier">Immobilier</a>
      <a href="/emploi">Emploi</a>
      <a href="/materiel-pro">Matériel pro</a>
      <a href="/maison-jardin">Maison, Bricolage &amp; Jardin</a>
      <a href="/telephones">TV, Téléphonie &amp; Informatique</a>
      <a href="/vacances-loisirs">Loisirs &amp; Voyages</a>
      <a href="/famille">Famille</a>
      <a href="/bon-plan">Bon plan</a>
      <a href="/autres">Autres</a>
    </nav>
    <div className="tim-shared-banner"><HomeBannerCarousel /></div>
    <div className="tim-shell">
      <aside className="tim-sidebar" aria-label="Toutes les rubriques"><div className="tim-sidebar-title">▦ Rubriques / Catégories</div>
        <a className="tim-auto-sidebar-post" href="/automobile/deposer">➤ Déposer une annonce</a>
        {rubriques.map(r=><a key={r.href} href={r.href}><span className="tim-sidebar-icon" aria-hidden="true">{r.icone}</span><img className="tim-sidebar-image" src={"/accueil-reel/"+({"automobile":"automobile","immobilier":"immobilier","emploi":"emploi","materiel-pro":"materiel-pro","maison-jardin":"maison-jardin","telephones":"telephones","vacances-loisirs":"vacances-loisirs","famille":"famille","bon-plan":"bon-plan","autres":"autres"} as Record<string,string>)[r.href.slice(1)]+".svg"} alt="" aria-hidden="true"/><span>{r.nom}</span><span className="tim-sidebar-chevron" aria-hidden="true">›</span></a>)}
      </aside>
      <div className="tim-content">{children}</div>
    </div>
  </body></html>
}
