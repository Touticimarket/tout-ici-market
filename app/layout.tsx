import type { ReactNode } from "react";
import type { Metadata } from "next";
export const metadata:Metadata={
 title:"TOUT ICI MARKET — Annonces gratuites pour les particuliers",
 description:"Tout acheter, tout vendre, tout trouver. Site d’annonces gratuites pour les particuliers : automobile, immobilier, maison, loisirs et plus encore.",
 metadataBase:new URL("https://tout-ici-market.vercel.app"),
 openGraph:{title:"TOUT ICI MARKET — Annonces gratuites",description:"Tout acheter, tout vendre, tout trouver. Découvrez les annonces gratuites pour les particuliers.",url:"https://tout-ici-market.vercel.app",siteName:"TOUT ICI MARKET",type:"website"},
 twitter:{card:"summary",title:"TOUT ICI MARKET — Annonces gratuites",description:"Tout acheter, tout vendre, tout trouver."}
};
const rubriques = [
  {nom:"Automobile & Véhicules",href:"/automobile",icone:"🚘"},
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
      /* Automobile : bandeau sur toute la largeur, rubriques à gauche seulement sous l’image. */
      .tim-shell:has(.auto-home){grid-template-areas:"auto-hero auto-hero" "auto-side auto-main";align-items:start}
      .tim-shell:has(.auto-home)>.tim-sidebar{grid-area:auto-side}
      .tim-shell:has(.auto-home)>.tim-content{display:contents}
      .tim-shell:has(.auto-home) .auto-home{display:contents}
      .tim-shell:has(.auto-home) .auto-home .hero{grid-area:auto-hero;margin:0;width:100%;border-radius:12px;overflow:hidden}
      .tim-shell:has(.auto-home) .auto-home .main-panel{grid-area:auto-main;margin:0}
      @media(max-width:760px){.tim-shell:has(.auto-home){grid-template-columns:minmax(0,1fr);grid-template-areas:"auto-hero" "auto-side" "auto-main"}}
      @media(max-width:760px){.tim-sidebar-title{flex-shrink:0;white-space:nowrap}.tim-shell{grid-template-columns:1fr}.tim-sidebar{position:static;display:flex;overflow-x:auto;white-space:nowrap;padding:5px}.tim-sidebar a{border:0;flex-shrink:0;font-size:13px}.tim-sidebar .tim-sidebar-chevron{display:none}.tim-header{gap:10px;flex-wrap:wrap}.tim-header-links{margin-left:auto}.tim-header-links a:not(.tim-post){display:none}.tim-header-links .tim-post{padding:12px;font-size:12px}}
    `}</style>
    <header className="tim-header">
      <a className="tim-logo" href="/" aria-label="Accueil TOUT ICI MARKET"><img src="/tout-ici-market-officiel.svg" alt="TOUT ICI MARKET"/><span className="tim-logo-caption">Site d’annonces gratuites pour les particuliers</span></a>
      <form className="tim-home-search" action="/automobile/voitures" role="search"><span className="search-symbol" aria-hidden="true">⌕</span><input type="search" name="q" aria-label="Que recherchez-vous ?" placeholder="Que recherchez-vous ?" /><button type="submit">Rechercher</button></form>
      
      <nav className="tim-header-links" aria-label="Espace utilisateur">
        <a href="/compte">♙ Mon compte</a>
        <a href="/favoris">♡ Mes favoris</a>
        <a className="tim-post" href="/automobile/deposer">＋ Déposer une annonce</a>
      </nav>
    </header>
    <nav className="tim-navbar" aria-label="Navigation principale">
      <a href="/">Accueil</a>
      <a href="/automobile">Automobile &amp; Véhicules</a>
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
    <div className="tim-shell">
      <aside className="tim-sidebar" aria-label="Toutes les rubriques"><div className="tim-sidebar-title">▦ Rubriques / Catégories</div>
        {rubriques.map(r=><a key={r.href} href={r.href}><span className="tim-sidebar-icon" aria-hidden="true">{r.icone}</span><img className="tim-sidebar-image" src={"/accueil-reel/"+({"automobile":"automobile","immobilier":"immobilier","emploi":"emploi","materiel-pro":"materiel-pro","maison-jardin":"maison-jardin","telephones":"telephones","vacances-loisirs":"vacances-loisirs","famille":"famille","bon-plan":"bon-plan","autres":"autres"} as Record<string,string>)[r.href.slice(1)]+".svg"} alt="" aria-hidden="true"/><span>{r.nom}</span><span className="tim-sidebar-chevron" aria-hidden="true">›</span></a>)}
      </aside>
      <div className="tim-content">{children}</div>
    </div>
  </body></html>
}
