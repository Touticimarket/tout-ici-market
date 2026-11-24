const categories=[
 {name:"Automobiles",description:"Voitures, berlines, SUV, citadines, etc.",slug:"voitures",image:"voitures"},
 {name:"Utilitaires",description:"Fourgons, fourgonnettes, camionnettes, pick-up...",slug:"utilitaires",image:"utilitaires"},
 {name:"Camions",description:"Poids lourds, tracteurs, porteurs, remorques...",slug:"camions",image:"camions"},
 {name:"Caravaning",description:"Camping-cars, caravanes, cellules, vans aménagés...",slug:"caravaning",image:"caravaning"},
 {name:"Remorques",description:"Bagagères, porte-voitures, plateaux, spéciales...",slug:"remorques",image:"remorques"},
 {name:"Motos & Scooters",description:"Motos, scooters, 3 roues, quads...",slug:"motos",image:"motos"},
 {name:"Vélos",description:"Vélos, VAE, VTT, route, enfants, accessoires...",slug:"velos",image:"velos"},
 {name:"Nautisme",description:"Bateaux, jet-skis, voiliers, remorques bateau...",slug:"nautisme",image:"nautisme"},
 {name:"Vans & Aménagés",description:"Vans, fourgons aménagés, minibus, loisirs...",slug:"vans-amenages",image:"vans-amenages"},
 {name:"Autres véhicules",description:"Tracteurs, engins, véhicules spécifiques, collection...",slug:"autres-vehicules",image:"autres-vehicules"},
];
const equipements=[
 {name:"Équipement auto",icon:"◉",slug:"equipement-auto"},
 {name:"Équipement caravaning",icon:"▣",slug:"equipement-caravaning"},
 {name:"Équipement nautisme",icon:"⛵",slug:"equipement-nautisme"},
 {name:"Équipements vélos",icon:"♧",slug:"equipement-velos"},
 {name:"Services de réparation mécanique",icon:"⚒",slug:"services-mecaniques"},
 {name:"Pneus & Jantes",icon:"◎",slug:"pneus-jantes"},
 {name:"Pièces & Accessoires",icon:"⚙",slug:"pieces-accessoires"},
 {name:"Entretien & Consommables",icon:"♢",slug:"entretien-consommables"},
 {name:"Autres",icon:"⋯",slug:"autres-equipements"}
];
export default function AutomobilePage(){
 return <main className="auto-home">
 <style>{`
 .auto-home{font-family:Arial,Helvetica,sans-serif;background:#f7fafe;color:#081d49;min-height:100vh;margin:-12px -12px 0 -12px;padding-bottom:35px}
 .auto-home *{box-sizing:border-box}
 .auto-home .hero{margin:0 0 0 calc(-205px - 12px);width:calc(100% + 205px + 12px);overflow:hidden;background:#0b3268}
 .auto-home .hero img{display:block;width:100%;height:auto;aspect-ratio:1448/238;object-fit:cover}
 .auto-home .main-panel{background:#fff;margin:0 12px 0 0;border:1px solid #deebfb;border-radius:20px;padding:16px 18px 22px;box-shadow:0 3px 14px #17365f0d}
 .auto-home h1{font-size:clamp(22px,2.2vw,29px);margin:0 0 4px;color:#091c47}
 .auto-home .subtitle{color:#51617d;font-size:15px;font-weight:700;margin:0 0 15px}
 .auto-home .cards{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}
 .auto-home .category{display:block;min-width:0;border:1px solid #d6e5f8;border-radius:16px;overflow:hidden;background:linear-gradient(#fff,#f3f8ff);text-decoration:none;color:#071c44;transition:box-shadow .15s,transform .15s}
 .auto-home .category:hover,.auto-home .category:focus-visible{box-shadow:0 6px 18px #0a36862d;transform:translateY(-2px);outline:2px solid #ffcf06}
 .auto-home .category img{display:block;width:88%;height:115px;max-height:115px;object-fit:contain;object-position:center center;background:#edf5fe;border-radius:12px;margin:8px auto 6px}
 .auto-home .tile-copy{padding:10px 11px 12px}
 .auto-home .tile-title{display:flex;justify-content:space-between;align-items:center;gap:4px;font-size:15px;font-weight:900}
 .auto-home .arrow{font-size:22px}
 .auto-home .tile-description{font-size:11px;line-height:1.4;margin:5px 0 0;min-height:31px}
 .auto-home .equip-section{margin-top:23px;padding-top:15px;border-top:1px solid #e5edf8}
 .auto-home .equip-section h2{font-size:25px;margin:0 0 12px;color:#091c47}
 .auto-home .equip-grid{display:grid;grid-template-columns:repeat(9,minmax(0,1fr));gap:7px}
 .auto-home .equip-tile{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;min-height:108px;padding:9px 5px;background:linear-gradient(150deg,#eaf5ff,#dceefe);border-radius:15px;color:#081b45;text-align:center;text-decoration:none;font-size:12px;font-weight:800}
 .auto-home .equip-tile:hover,.auto-home .equip-tile:focus-visible{background:#ffdc35}
 .auto-home .equip-icon{font-size:30px;line-height:1}
 @media(max-width:1100px){.auto-home .cards{grid-template-columns:repeat(3,minmax(0,1fr))}.auto-home .equip-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
 @media(max-width:980px){.auto-home .hero{margin-left:calc(-180px - 12px);width:calc(100% + 180px + 12px)}}
 @media(max-width:760px){.auto-home .hero{margin-left:0;width:100%}.auto-home .cards{grid-template-columns:repeat(2,minmax(0,1fr))}.auto-home .main-panel{margin:0 8px;padding:13px}.auto-home .hero img{height:180px;object-position:center}}
 @media(max-width:480px){.auto-home .cards{grid-template-columns:1fr}.auto-home .equip-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.auto-home .hero img{height:155px;object-position:center}}
 `}</style>
 <div className="hero"><img src="/auto-visuels/bandeau-auto-final.svg" alt="Automobile et véhicules : voiture bleue, utilitaire, moto, camping-car, bateau et vélo devant un lac de montagne" /></div>
 <section className="main-panel"><h1>Choisissez une sous-catégorie</h1>
 <p className="subtitle">dans la rubrique Automobile &amp; Véhicules</p>
 <div className="cards">{categories.map(c=><a className="category" key={c.slug} href={"/automobile/"+c.slug}>
 <img src={"/auto-visuels/"+c.image+".svg"} alt={c.name} loading="lazy"/>
 <div className="tile-copy"><div className="tile-title"><span>{c.name}</span><span className="arrow">›</span></div><p className="tile-description">{c.description}</p></div>
 </a>)}</div>
 <div className="equip-section"><h2>Équipements &amp; Services</h2>
 <div className="equip-grid">{equipements.map(e=><a href={"/automobile/"+e.slug} key={e.slug} className="equip-tile"><span className="equip-icon" aria-hidden="true">{e.icon}</span><span>{e.name}</span></a>)}</div></div>
 </section></main>
}
