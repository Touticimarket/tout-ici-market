const categories=[
 {name:"Automobile & Véhicules",href:"/automobile",image:"automobile"},
 {name:"Immobilier",href:"/immobilier",image:"immobilier"},
 {name:"Emploi",href:"/emploi",image:"emploi"},
 {name:"Matériel pro",href:"/materiel-pro",image:"materiel-pro"},
 {name:"Maison, Bricolage & Jardin",href:"/maison-jardin",image:"maison-jardin"},
 {name:"TV, Téléphonie & Informatique",href:"/telephones",image:"telephones"},
 {name:"Loisirs & Voyages",href:"/vacances-loisirs",image:"vacances-loisirs"},
 {name:"Famille",href:"/famille",image:"famille"},
 {name:"Bon plan",href:"/bon-plan",image:"bon-plan"},
 {name:"Autres",href:"/autres",image:"autres"}
];
const exemples=[
 {label:"Audi A3 Sportback",price:"14 500 €",detail:"2020 · Diesel · 78 000 km",location:"Lyon (69000)"},
 {label:"Appartement T3",price:"235 000 €",detail:"68 m² · 2 chambres",location:"Bordeaux (33000)"},
 {label:"iPhone 13 128 Go",price:"650 €",detail:"128 Go · Très bon état",location:"Marseille (13000)"},
 {label:"Canapé 3 places luxe",price:"1 250 €",detail:"Tissu bon état",location:"Toulouse (31000)"},
 {label:"Vélo tout chemin",price:"180 €",detail:"21 vitesses · Taille M",location:"Nantes (44000)"}
];
export default function Home(){
 return <main className="tim-home">
 <style>{`
 /* La présentation de cette page correspond à la référence de l'accueil uniquement. */
 body:has(.tim-home) .tim-shell{grid-template-columns:265px minmax(0,1fr);gap:10px;max-width:none;padding:10px 5px 20px}
 body:has(.tim-home) .tim-content{min-width:0}
 body:has(.tim-home) .tim-sidebar{background:linear-gradient(#fff,#f5f8ff);padding:8px 7px;border-radius:15px;border:1px solid #d9e4f5;position:static}
 body:has(.tim-home) .tim-sidebar-title{background:#fff;color:#11254a;font-size:15px;text-align:left;padding:13px 9px;margin-bottom:3px}
 body:has(.tim-home) .tim-sidebar a{font-size:12px;gap:10px;min-height:52px;padding:5px 6px;border-bottom:1px solid #e2e7ef}
 body:has(.tim-home) .tim-sidebar .tim-sidebar-icon{display:block;flex:0 0 50px;width:50px;height:42px;border-radius:8px;font-size:0;background-position:center;background-size:cover}
 ${categories.map((c,i)=>`body:has(.tim-home) .tim-sidebar a:nth-of-type(${i+1}) .tim-sidebar-icon{background-image:url("/home-reference/sidebar-${c.image}.svg")}`).join("\n")}
 body:has(.tim-home) .tim-header{min-height:89px;padding:3px 34px}
 body:has(.tim-home) .tim-logo{width:290px;max-width:290px}
 body:has(.tim-home) .tim-logo img{width:100%;max-height:85px;object-fit:contain}
 body:has(.tim-home) .tim-logo-caption{display:none}
 body:has(.tim-home) .tim-header-links{gap:18px}
 body:has(.tim-home) .tim-search{display:flex;max-width:560px;height:46px;border-radius:12px}
 body:has(.tim-home) .tim-search input{font-size:14px}
 body:has(.tim-home) .tim-search button{font-size:13px;font-weight:800;padding:0 20px;border-radius:10px}
 body:has(.tim-home) .tim-navbar{min-height:47px;align-items:center;border-bottom:3px solid #ffcf06;padding:0 12px}
 body:has(.tim-home) .tim-navbar a:first-child{font-size:0;min-width:72px;text-align:center}
 body:has(.tim-home) .tim-navbar a:first-child:before{content:"⌂";font-size:27px;line-height:20px}
 .tim-home{box-sizing:border-box;background:#fff;color:#091d45;font-family:Arial,Helvetica,sans-serif;min-height:80vh}
 .tim-home *{box-sizing:border-box}
 .tim-home .hero{border-radius:16px;overflow:hidden;background:#cde7fc}
 .tim-home .hero img{display:block;width:100%;height:auto;min-height:240px;object-fit:cover}
 .tim-home .category-title{display:flex;align-items:center;justify-content:center;gap:15px;margin:14px 0 14px;font-size:26px;color:#061b4f}
 .tim-home .category-title:before,.tim-home .category-title:after{content:"";background:#ffbc05;width:40px;height:4px;border-radius:4px}
 .tim-home .category-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;margin:0 5px}
 .tim-home .category{display:block;min-width:0;position:relative;overflow:hidden;border-radius:14px;border:1px solid #d6dfed;background:#fff;text-decoration:none;color:#091b48;box-shadow:0 2px 3px #1c3c6415;transition:transform .15s,box-shadow .15s}
 .tim-home .category:hover,.tim-home .category:focus-visible{transform:translateY(-2px);outline:2px solid #ffce09;box-shadow:0 6px 16px #17335a2a}
 .tim-home .category img{width:100%;height:85px;object-fit:cover;display:block;background:#eaf3ff}
 .tim-home .category-label{min-height:33px;display:flex;align-items:center;justify-content:center;background:#fff;border-radius:12px;margin:-1px 10px 3px;position:relative;font-size:13px;font-weight:900;text-align:center;padding:5px 3px;line-height:1.1}
 .tim-home .popular-heading{display:flex;justify-content:space-between;gap:12px;align-items:center;margin:16px 7px 10px}
 .tim-home .popular-heading h2{font-size:23px;margin:0;color:#081e50}
 .tim-home .popular-heading a{color:#144ac7;font-size:12px;font-weight:700;text-decoration:none}
 .tim-home .preview-cards{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:13px;margin:0 5px}
 .tim-home .preview{border:1px solid #dce2ec;border-radius:13px;overflow:hidden;background:#fff;box-shadow:0 2px 3px #1c3c640d}
 .tim-home .preview img{width:100%;height:66px;object-fit:cover;display:block}
 .tim-home .preview-content{padding:7px 10px 12px;font-size:11px}
 .tim-home .preview-price{color:#1145d0;font-size:14px;font-weight:900}
 .tim-home .preview-name{font-size:11px;font-weight:800;margin:4px 0}
 .tim-home .preview-detail{margin:5px 0;color:#3a4557}
 .tim-home .example-label{font-size:11px;color:#566981;margin:7px 7px 0}
 @media(max-width:1200px){.tim-home .category-grid,.tim-home .preview-cards{grid-template-columns:repeat(3,minmax(0,1fr))}body:has(.tim-home) .tim-header{padding:5px 14px}body:has(.tim-home) .tim-logo{width:235px}}
 @media(max-width:800px){body:has(.tim-home) .tim-shell{grid-template-columns:1fr}body:has(.tim-home) .tim-sidebar{display:flex;overflow-x:auto;white-space:nowrap}body:has(.tim-home) .tim-sidebar a{flex-shrink:0}body:has(.tim-home) .tim-sidebar .tim-sidebar-icon{flex:0 0 38px;width:38px;height:33px}body:has(.tim-home) .tim-search{display:none}.tim-home .category-grid,.tim-home .preview-cards{grid-template-columns:repeat(2,minmax(0,1fr))}.tim-home .hero img{min-height:180px}}
 @media(max-width:470px){.tim-home .category-grid,.tim-home .preview-cards{gap:8px}.tim-home .category-label{font-size:11px}.tim-home .category-title{font-size:21px}.tim-home .category-title:before,.tim-home .category-title:after{width:20px}.tim-home .preview-content{padding:7px}}
 `}</style>
 <div className="hero"><img src="/banniere-accueil-tout-trouver.svg" alt="Tout acheter, tout vendre, tout trouver tout ici : voiture, moto, immobilier, maison, téléviseur et vélo"/></div>
 <section aria-label="Toutes les catégories"><h1 className="category-title">Toutes les catégories</h1>
 <div className="category-grid">{categories.map(c=><a className="category" href={c.href} key={c.href}><img src={"/home-reference/"+c.image+".svg"} alt="" loading="lazy"/><span className="category-label">{c.name}</span></a>)}</div></section>
 <section aria-label="Annonces populaires"><div className="popular-heading"><h2>Annonces populaires</h2><a href="/automobile/voitures">Voir les annonces →</a></div>
 <div className="preview-cards">{exemples.map((a,i)=><div className="preview" key={a.label}><img src={"/home-reference/apercu-"+(i+1)+".svg"} alt="Illustration de "+a.label loading="lazy"/><div className="preview-content"><span className="preview-price">{a.price}</span><p className="preview-name">{a.label}</p><p className="preview-detail">{a.detail}</p><p className="preview-detail">📍 {a.location}</p></div></div>)}</div>
 <p className="example-label">Aperçu visuel de la présentation : ces exemples ne sont pas des annonces actuellement publiées.</p>
 </section>
 </main>;
}
