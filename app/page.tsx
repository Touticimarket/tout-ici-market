const categories=[
 {name:"Automobile & Véhicules",href:"/automobile",image:"automobile",alt:"Voiture bleue devant un paysage de montagne"},
 {name:"Immobilier",href:"/immobilier",image:"immobilier",alt:"Maison contemporaine avec jardin"},
 {name:"Emploi",href:"/emploi",image:"emploi",alt:"Professionnel souriant à son bureau"},
 {name:"Matériel pro",href:"/materiel-pro",image:"materiel-pro",alt:"Mini-pelle et outillage professionnel"},
 {name:"Maison, Bricolage & Jardin",href:"/maison-jardin",image:"maison-jardin",alt:"Jardin aménagé, terrasse et matériel de jardinage"},
 {name:"TV, Téléphonie & Informatique",href:"/telephones",image:"telephones",alt:"Télévision, ordinateur, smartphone et équipement numérique"},
 {name:"Loisirs & Voyages",href:"/vacances-loisirs",image:"vacances-loisirs",alt:"Valise de voyage et appareil photo devant la mer"},
 {name:"Famille",href:"/famille",image:"famille",alt:"Famille avec enfants et matériel de puériculture"},
 {name:"Bon plan",href:"/bon-plan",image:"bon-plan",alt:"Sacs shopping, cadeau et tirelire représentant les bonnes affaires"},
 {name:"Autres",href:"/autres",image:"autres",alt:"Objets variés, instrument de musique, livres et appareil photo"}
];
export default function Home(){
 return <main className="tim-home">
 <style>{`
 .tim-home{font-family:Arial,Helvetica,sans-serif;color:#061e49;background:#f7faff;padding:15px 15px 34px;border:1px solid #e0e9f6;border-radius:18px;min-height:72vh}
 .tim-home *{box-sizing:border-box}
 .tim-home .intro{background:#c9e5fb;border-radius:15px;margin-bottom:22px;overflow:hidden;min-height:250px}\n .tim-home .intro img{display:block;width:100%;height:auto;object-fit:contain;object-position:center}
 .tim-home .intro h1{font-size:clamp(26px,3vw,39px);margin:0 0 7px;font-weight:900}
 .tim-home .intro p{font-size:clamp(14px,1.5vw,18px);margin:0;line-height:1.5}
 .tim-home .intro strong{color:#ffdc26}
 .tim-home h2{font-size:clamp(23px,2.2vw,29px);margin:0 0 15px}
 .tim-home .category-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:13px}
 .tim-home .category-card{display:flex;flex-direction:column;background:white;color:#091e45;text-decoration:none;border:1px solid #d5e5f7;border-radius:15px;overflow:hidden;transition:box-shadow .16s,transform .16s}
 .tim-home .category-card:hover,.tim-home .category-card:focus-visible{transform:translateY(-2px);box-shadow:0 9px 21px #0a2d6428;outline:2px solid #ffcf06}
 .tim-home .category-card img{display:block;width:100%;height:174px;object-fit:cover;object-position:center center;background:#e9f3fd}
 .tim-home .category-card .caption{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 11px;min-height:66px;background:linear-gradient(180deg,#fff,#f4f8fe)}
 .tim-home .category-card .caption strong{font-size:14px;line-height:1.28}
 .tim-home .category-card .caption span{color:#064da4;font-size:21px;font-weight:900}
 @media(max-width:1170px){.tim-home .category-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
 @media(max-width:650px){.tim-home .category-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.tim-home .category-card img{height:150px}}
 @media(max-width:410px){.tim-home .category-grid{grid-template-columns:1fr}.tim-home .category-card img{height:185px}}
 `}</style>
 <section className="intro" aria-label="Tout acheter, tout vendre, tout trouver tout ici"><img src="/banniere-accueil-tout-trouver.svg" alt="Tout acheter, tout vendre, tout trouver tout ici — annonces entre particuliers" /></section>
 <section aria-label="Catégories d’annonces"><h2>Choisissez une catégorie</h2><div className="category-grid">
 {categories.map(c=><a href={c.href} key={c.href} className="category-card">
 <img src={"/categories-accueil/"+c.image+".svg"} alt={c.alt} loading="lazy"/>
 <div className="caption"><strong>{c.name}</strong><span aria-hidden="true">›</span></div>
 </a>)}
 </div></section>
 </main>
}
