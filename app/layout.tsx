import type { ReactNode } from "react";
const rubriques = [
  {nom:"Automobile & Véhicules",href:"/automobile",icone:"🚘"},
  {nom:"Immobilier",href:"/immobilier",icone:"⌂"},
  {nom:"Emploi & Services",href:"/emploi",icone:"▣"},
  {nom:"Maison & Jardin",href:"/maison-jardin",icone:"▤"},
  {nom:"Téléphonie & Informatique",href:"/telephones",icone:"▥"},
  {nom:"Mode & Accessoires",href:"/mode",icone:"♧"},
  {nom:"Jeux & Loisirs",href:"/vacances-loisirs",icone:"♧"},
  {nom:"Animaux",href:"/animaux",icone:"♧"},
  {nom:"Autres catégories",href:"/autres",icone:"▦"}
];
export default function RootLayout({children}:{children:ReactNode}){
  return <html lang="fr"><body style={{margin:0,background:"#f2f6fb",fontFamily:"Arial,Helvetica,sans-serif"}}>
    <style>{`
      .tim-header{background:#031b4b;color:white;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:9px clamp(15px,3vw,45px)}
      .tim-logo{display:block;width:clamp(175px,19vw,275px);flex-shrink:0}
      .tim-logo img{display:block;width:100%;height:auto;max-height:95px;object-fit:contain}
      .tim-search{display:flex;flex:1;max-width:560px;height:48px;border-radius:32px;background:#fff;overflow:hidden}
      .tim-search input{flex:1;width:0;min-width:0;border:0;outline:0;padding:0 20px;font-size:15px}
      .tim-search button{border:0;background:#ffcf06;padding:0 20px;font-size:21px;cursor:pointer}
      .tim-header-links{display:flex;align-items:center;gap:20px;white-space:nowrap}
      .tim-header-links a{color:#fff;text-decoration:none;font-weight:700;font-size:14px}
      .tim-header-links .tim-post{background:#ffcf06;color:#001942;padding:15px 20px;border-radius:19px}
      .tim-navbar{display:flex;background:#073477;overflow-x:auto;padding:0 20px;gap:4px}
      .tim-navbar a{white-space:nowrap;color:#fff;text-decoration:none;padding:17px 20px;font-weight:700;font-size:14px}
      .tim-navbar a:hover{background:#0a4b9e}
      .tim-shell{display:grid;grid-template-columns:minmax(225px,310px) minmax(0,1fr);gap:16px;max-width:1800px;margin:auto;padding:16px 14px}
      .tim-sidebar{background:#f8fbff;border:1px solid #e0e9f5;border-radius:20px;padding:9px;position:sticky;top:16px;align-self:start}
      .tim-sidebar a{display:flex;align-items:center;gap:12px;color:#091d45;text-decoration:none;padding:15px 13px;border-bottom:1px solid #dfebf7;font-size:15px;font-weight:800;border-radius:12px}
      .tim-sidebar a:last-child{border-bottom:0}
      .tim-sidebar a:hover{background:#ffe04e}
      .tim-sidebar .tim-sidebar-icon{font-size:23px;width:27px;flex-shrink:0;text-align:center}
      .tim-sidebar .tim-sidebar-chevron{margin-left:auto}
      .tim-content{min-width:0}
      @media(max-width:1050px){.tim-search{display:none}.tim-header-links{gap:10px}}
      @media(max-width:760px){.tim-shell{grid-template-columns:1fr}.tim-sidebar{position:static;display:flex;overflow-x:auto;white-space:nowrap;padding:5px}.tim-sidebar a{border:0;flex-shrink:0;font-size:13px}.tim-sidebar .tim-sidebar-chevron{display:none}.tim-header{gap:10px;flex-wrap:wrap}.tim-header-links{margin-left:auto}.tim-header-links a:not(.tim-post){display:none}.tim-header-links .tim-post{padding:12px;font-size:12px}}
    `}</style>
    <header className="tim-header">
      <a className="tim-logo" href="/" aria-label="Accueil TOUT ICI MARKET"><img src="/tout-ici-market-officiel.svg" alt="TOUT ICI MARKET"/></a>
      <form className="tim-search" action="/automobile/voitures"><input type="search" name="q" aria-label="Rechercher une annonce" placeholder="Rechercher une annonce, un véhicule, un bien..."/><button aria-label="Rechercher" type="submit">⌕</button></form>
      <nav className="tim-header-links" aria-label="Espace utilisateur">
        <a href="/compte">♙ Mon compte</a>
        <a href="/favoris">♡ Mes favoris</a>
        <a className="tim-post" href="/automobile/deposer">＋ Déposer une annonce</a>
      </nav>
    </header>
    <nav className="tim-navbar" aria-label="Navigation principale">
      <a href="/">⌂ Accueil</a><a href="/automobile">🚘 Automobile &amp; Véhicules</a>
      <a href="/immobilier">⌂ Immobilier</a><a href="/emploi">▣ Emploi &amp; Services</a>
      <a href="/autres">▦ Toutes les catégories</a>
    </nav>
    <div className="tim-shell">
      <aside className="tim-sidebar" aria-label="Toutes les rubriques">
        {rubriques.map(r=><a key={r.href} href={r.href}><span className="tim-sidebar-icon" aria-hidden="true">{r.icone}</span><span>{r.nom}</span><span className="tim-sidebar-chevron" aria-hidden="true">›</span></a>)}
      </aside>
      <div className="tim-content">{children}</div>
    </div>
  </body></html>
}
