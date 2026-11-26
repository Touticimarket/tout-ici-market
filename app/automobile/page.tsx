import {CarFront, Caravan, Sailboat, Bike, Wrench, CircleDot, Armchair, Droplet, ChevronRight} from "lucide-react";
const categories=[
 {name:"Automobiles",description:"Voitures, berlines, SUV, citadines, etc.",slug:"voitures",image:"https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85"},
 {name:"Utilitaires",description:"Fourgons, fourgonnettes, camionnettes, pick-up...",slug:"utilitaires",image:"https://images.unsplash.com/photo-1768400554801-2002b63e0591?auto=format&fit=crop&w=1200&q=85"},
 {name:"Camions",description:"Poids lourds, tracteurs, porteurs, remorques...",slug:"camions",image:"https://images.unsplash.com/photo-1725889283394-bc0b15c5f15d?auto=format&fit=crop&w=1200&q=85"},
 {name:"Caravaning",description:"Camping-cars, caravanes, cellules, vans aménagés...",slug:"caravaning",image:"https://images.unsplash.com/photo-1782046820445-d2798c847f8f?auto=format&fit=crop&w=1200&q=85"},
 {name:"Remorques",description:"Bagagères, porte-voitures, plateaux, spéciales...",slug:"remorques",image:"https://images.unsplash.com/photo-1682980799090-c4c6342be01a?auto=format&fit=crop&w=1200&q=85"},
 {name:"Motos & Scooters",description:"Motos, scooters, 3 roues, quads...",slug:"motos",image:"https://images.unsplash.com/photo-1662788019557-443ef532cccd?auto=format&fit=crop&w=1200&q=85"},
 {name:"Vélos",description:"Vélos, VAE, VTT, route, enfants, accessoires...",slug:"velos",image:"https://images.unsplash.com/photo-1760892471867-d50bb945c13d?auto=format&fit=crop&w=1200&q=85"},
 {name:"Nautisme",description:"Bateaux, jet-skis, voiliers, remorques bateau...",slug:"nautisme",image:"https://images.unsplash.com/photo-1768740615503-52872b6707b1?auto=format&fit=crop&w=1200&q=85"},
 {name:"Vans aménagés",description:"Vans, fourgons aménagés, minibus, loisirs...",slug:"vans-amenages",image:"https://images.unsplash.com/photo-1792525233093-229dd8252f2b?auto=format&fit=crop&w=1200&q=85"},
 {name:"Autres véhicules",description:"Tracteurs, engins, véhicules spécifiques, collection...",slug:"autres-vehicules",image:"https://images.unsplash.com/photo-1689791649990-03f270b73ce3?auto=format&fit=crop&w=1200&q=85"},
];
const equipements=[
 {name:"Équipement auto",icon:<CircleDot size={40}/>,slug:"equipement-auto"},
 {name:"Équipement caravaning",icon:<Caravan size={40}/>,slug:"equipement-caravaning"},
 {name:"Équipement nautisme",icon:<Sailboat size={40}/>,slug:"equipement-nautisme"},
 {name:"Équipements vélos",icon:<Bike size={40}/>,slug:"equipement-velos"},
 {name:"Services de réparation mécanique",icon:<Wrench size={40}/>,slug:"services-mecaniques"},
 {name:"Pneus & Jantes",icon:<CircleDot size={40}/>,slug:"pneus-jantes"},
 {name:"Pièces & Accessoires",icon:<Armchair size={40}/>,slug:"pieces-accessoires"},
 {name:"Entretien & Consommables",icon:<Droplet size={40}/>,slug:"entretien-consommables"},
];
export default function AutomobilePage(){
 return <main className="auto-home">
 <style>{`
 .auto-home{font-family:Arial,Helvetica,sans-serif;background:#f7fafe;color:#081d49;min-height:100vh;margin:-12px -12px 0 -12px;padding-bottom:35px}
 .auto-home *{box-sizing:border-box}
 .auto-home .hero{margin:0 0 0 calc(-205px - 12px);width:calc(100% + 205px + 12px);overflow:hidden;background:#0b3268}
 .auto-home .hero{position:relative}
 .auto-home .hero-title{position:absolute;z-index:1;top:19%;left:2.2%;padding:12px 18px;background:linear-gradient(90deg,#071b44dc,#071b4480);border-radius:12px;max-width:39%;color:white}
 .auto-home .hero-title strong{display:block;font-size:clamp(19px,2.5vw,38px);color:#ffda11;font-weight:900;line-height:1.1}
 .auto-home .hero-title span{display:block;font-size:clamp(11px,1.1vw,17px);font-weight:700;margin-top:8px;line-height:1.3}
 .auto-home .hero img{display:block;width:100%;height:auto;aspect-ratio:1448/296;object-fit:cover}
 .auto-home .main-panel{background:#fff;margin:0 12px 0 0;border:1px solid #deebfb;border-radius:20px;padding:16px 18px 22px;box-shadow:0 3px 14px #17365f0d}
 .auto-home h1{font-size:clamp(22px,2.2vw,29px);margin:0 0 4px;color:#091c47}
 .auto-home .subtitle{color:#51617d;font-size:15px;font-weight:700;margin:0 0 15px}
 .auto-home .cards{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}
 .auto-home .category{display:block;min-width:0;border:1px solid #d6e5f8;border-radius:16px;overflow:hidden;background:linear-gradient(#fff,#f3f8ff);text-decoration:none;color:#071c44;transition:box-shadow .15s,transform .15s}
 .auto-home .category:hover,.auto-home .category:focus-visible{box-shadow:0 6px 18px #0a36862d;transform:translateY(-2px);outline:2px solid #ffcf06}
 .auto-home .category img{display:block;width:100%;height:118px;max-height:118px;object-fit:cover;object-position:center center;background:#edf5fe;border-radius:12px 12px 0 0;margin:0 auto}
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
 @media(max-width:760px){.auto-home .hero{margin-left:0;width:100%}.auto-home .cards{grid-template-columns:repeat(2,minmax(0,1fr))}.auto-home .main-panel{margin:0 8px;padding:13px}.auto-home .hero img{height:180px;object-position:center}.auto-home .hero-title{top:10%;left:2%;max-width:58%;padding:7px}.auto-home .hero-title span{font-size:10px}}
 @media(max-width:480px){.auto-home .cards{grid-template-columns:1fr}.auto-home .equip-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.auto-home .hero img{height:155px;object-position:center}}

/* Catégories véhicule : cadrage uniforme, image entière et cartes propres. */
.auto-home .cards{gap:16px}
.auto-home .category{border-radius:17px;box-shadow:0 3px 12px #0b397f12;background:#fff}
.auto-home .category img{width:100%!important;height:auto!important;max-height:none!important;aspect-ratio:480/221!important;object-fit:contain!important;object-position:center center!important;display:block!important;margin:0 auto!important;background:#f3f8ff!important;border-radius:15px 15px 0 0!important;image-rendering:auto}
.auto-home .tile-copy{padding:13px 13px 16px}
.auto-home .tile-title{font-size:clamp(15px,1.15vw,19px)}
.auto-home .tile-description{font-size:clamp(12px,.9vw,14px);line-height:1.5}
.auto-home .hero img{object-position:center center}
@media(max-width:760px){.auto-home .cards{gap:12px}.auto-home .category img{aspect-ratio:480/221!important}}

/* Correction définitive des 10 miniatures véhicules : cadre fixe et recadrage ciblé. */
.auto-home .tile-photo{width:100%;aspect-ratio:480/221;overflow:hidden;position:relative;background:#eaf2fa;border-radius:15px 15px 0 0;isolation:isolate}
.auto-home .tile-photo img{display:block!important;width:100%!important;height:100%!important;max-height:none!important;aspect-ratio:auto!important;object-fit:cover!important;object-position:center!important;border-radius:0!important;margin:0!important;background:transparent!important;transform:scale(1.075);transform-origin:center center;transition:transform .25s ease;image-rendering:auto}
.auto-home .category:hover .tile-photo img,.auto-home .category:focus-visible .tile-photo img{transform:scale(1.115)}
.auto-home .tile-photo-voitures img{object-position:48% 54%!important;transform:scale(1.085)}
.auto-home .tile-photo-utilitaires img{object-position:50% 51%!important;transform:scale(1.09)}
.auto-home .tile-photo-camions img{object-position:53% 52%!important;transform:scale(1.09)}
.auto-home .tile-photo-caravaning img{object-position:50% 53%!important;transform:scale(1.09)}
.auto-home .tile-photo-remorques img{object-position:51% 56%!important;transform:scale(1.105)}
.auto-home .tile-photo-motos img{object-position:50% 54%!important;transform:scale(1.09)}
.auto-home .tile-photo-velos img{object-position:50% 56%!important;transform:scale(1.09)}
.auto-home .tile-photo-nautisme img{object-position:50% 53%!important;transform:scale(1.095)}
.auto-home .tile-photo-vans-amenages img{object-position:51% 52%!important;transform:scale(1.09)}
.auto-home .tile-photo-autres-vehicules img{object-position:50% 55%!important;transform:scale(1.085)}
.auto-home .category:hover .tile-photo img,.auto-home .category:focus-visible .tile-photo img{transform:scale(1.13)!important}
.auto-home .category{border:1px solid #d7e4f4!important;box-shadow:0 3px 10px #0c377b12!important;overflow:hidden}
.auto-home .tile-copy{background:#fff}
@media(prefers-reduced-motion:reduce){.auto-home .tile-photo img{transition:none!important}}

/* Rectification après contrôle des 10 sources : images panoramiques 480x221.
   Cartes plus hautes, proportions conservées (aucun étirement). */
.auto-home .tile-photo{aspect-ratio:16/10!important;overflow:hidden!important;background:#e9f1f9!important}
.auto-home .tile-photo img{width:100%!important;height:100%!important;max-height:none!important;aspect-ratio:auto!important;object-fit:cover!important;object-position:center center!important;transform:none!important;transition:none!important}
.auto-home .category:hover .tile-photo img,.auto-home .category:focus-visible .tile-photo img{transform:none!important}
.auto-home .tile-photo-voitures img{object-position:48% 50%!important}
.auto-home .tile-photo-utilitaires img{object-position:50% 50%!important}
.auto-home .tile-photo-camions img{object-position:53% 50%!important}
.auto-home .tile-photo-caravaning img{object-position:50% 50%!important}
.auto-home .tile-photo-remorques img{object-position:52% 50%!important}
.auto-home .tile-photo-motos img{object-position:50% 50%!important}
.auto-home .tile-photo-velos img{object-position:50% 50%!important}
.auto-home .tile-photo-nautisme img{object-position:50% 50%!important}
.auto-home .tile-photo-vans-amenages img{object-position:51% 50%!important}
.auto-home .tile-photo-autres-vehicules img{object-position:50% 50%!important}

/* Nouvelle photothèque : 10 photos distinctes haute définition sous licence Unsplash.
   Ratio visuel identique et objet jamais étiré. */
.auto-home .tile-photo{aspect-ratio:16/10!important;overflow:hidden!important;background:#e6eef8!important}
.auto-home .tile-photo img,.auto-home .tile-photo-voitures img,.auto-home .tile-photo-utilitaires img,.auto-home .tile-photo-camions img,.auto-home .tile-photo-caravaning img,.auto-home .tile-photo-remorques img,.auto-home .tile-photo-motos img,.auto-home .tile-photo-velos img,.auto-home .tile-photo-nautisme img,.auto-home .tile-photo-vans-amenages img,.auto-home .tile-photo-autres-vehicules img{display:block!important;width:100%!important;height:100%!important;max-height:none!important;aspect-ratio:auto!important;object-fit:cover!important;object-position:center center!important;transform:none!important;transition:none!important}
.auto-home .category:hover .tile-photo img,.auto-home .category:focus-visible .tile-photo img{transform:none!important}

/* Mise en page de référence du 26/11 : deux rangées de cinq, flèches jaunes, huit équipements. */
.auto-home .main-panel{background:#f9fbff!important;border:0!important;box-shadow:none!important;padding:8px 9px 25px!important;margin:0 8px 0 0!important}
.auto-home .main-panel h1{font-size:clamp(24px,2.25vw,36px)!important;font-weight:900!important;letter-spacing:-.045em!important;display:flex;align-items:center;gap:12px;color:#08133f!important;margin:0 0 1px!important}
.auto-home .main-panel h1:before,.auto-home .equip-section h2:before{content:"";display:inline-block;width:32px;height:5px;border-radius:6px;background:#ffd008;flex-shrink:0}
.auto-home .subtitle{font-size:clamp(14px,1.1vw,17px)!important;color:#607088!important;font-weight:800!important;padding-left:44px;margin-bottom:13px!important}
.auto-home .cards{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:12px!important}
.auto-home .category{display:flex!important;flex-direction:column!important;border-radius:15px!important;border:1px solid #dce5f1!important;box-shadow:0 4px 10px #18315215!important;background:#f6f9ff!important}
.auto-home .tile-photo{aspect-ratio:1.92!important;overflow:hidden!important;border-radius:13px 13px 0 0!important}
.auto-home .tile-photo img{width:100%!important;height:100%!important;object-fit:cover!important;object-position:center center!important;transform:none!important;filter:none!important}
.auto-home .tile-copy{padding:7px 12px 11px!important;background:linear-gradient(#fff,#f5f9ff)!important;flex:1}
.auto-home .tile-title{font-size:clamp(14px,1.05vw,20px)!important;line-height:1.2!important;letter-spacing:-.025em!important;gap:8px!important}
.auto-home .arrow{width:23px;height:23px;min-width:23px;border-radius:50%;background:#ffe08a;color:#082457;display:grid;place-items:center!important;font-size:0!important}
.auto-home .tile-description{font-size:clamp(10px,.75vw,13px)!important;line-height:1.3!important;margin:5px 0 0!important;min-height:30px!important}
.auto-home .equip-section{border:0!important;margin-top:14px!important;padding:0!important}
.auto-home .equip-section h2{display:flex;align-items:center;gap:12px;font-size:clamp(23px,2vw,32px)!important;font-weight:900!important;margin:0 0 10px!important}
.auto-home .equip-grid{display:grid!important;grid-template-columns:repeat(8,minmax(0,1fr))!important;gap:9px!important}
.auto-home .equip-tile{min-height:108px!important;padding:13px 6px 10px!important;border-radius:19px!important;background:linear-gradient(150deg,#e6f1ff,#f2f6fd)!important;box-shadow:0 3px 8px #193f7615!important;gap:7px!important;font-size:clamp(10px,.76vw,14px)!important;line-height:1.2!important;justify-content:center!important}
.auto-home .equip-icon{color:#05388c!important;line-height:1!important}
.auto-home .equip-icon svg{width:40px;height:40px;stroke-width:2.2}
@media(max-width:1150px){.auto-home .cards{grid-template-columns:repeat(3,minmax(0,1fr))!important}.auto-home .equip-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important}}
@media(max-width:760px){.auto-home .cards{grid-template-columns:repeat(2,minmax(0,1fr))!important}.auto-home .main-panel{padding:12px!important}.auto-home .equip-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
@media(max-width:420px){.auto-home .cards{grid-template-columns:1fr!important}}

/* Dix photographies EXACTES de la capture approuvée par le propriétaire.
   Sprite local hébergé sur le site : aucune photo externe, aucun recadrage destructif. */
.auto-home .tile-photo{aspect-ratio:15 / 8!important;position:relative!important;background:#eaf2fb!important;overflow:hidden!important}
.auto-home .tile-photo .exact-photo{width:100%;height:100%;display:block;background-image:url('/auto-reel/photos-maquette-exactes.svg');background-repeat:no-repeat;background-size:500% 200%}
.auto-home .category:nth-child(1) .exact-photo{background-position:0% 0%}
.auto-home .category:nth-child(2) .exact-photo{background-position:25% 0%}
.auto-home .category:nth-child(3) .exact-photo{background-position:50% 0%}
.auto-home .category:nth-child(4) .exact-photo{background-position:75% 0%}
.auto-home .category:nth-child(5) .exact-photo{background-position:100% 0%}
.auto-home .category:nth-child(6) .exact-photo{background-position:0% 100%}
.auto-home .category:nth-child(7) .exact-photo{background-position:25% 100%}
.auto-home .category:nth-child(8) .exact-photo{background-position:50% 100%}
.auto-home .category:nth-child(9) .exact-photo{background-position:75% 100%}
.auto-home .category:nth-child(10) .exact-photo{background-position:100% 100%}

/* Agrandissement modéré de la page Automobile, sans remplacer les photos validées. */
.auto-home .main-panel{padding:16px 16px 32px!important}
.auto-home .main-panel h1{font-size:clamp(28px,2.5vw,39px)!important}
.auto-home .subtitle{font-size:clamp(16px,1.2vw,19px)!important;margin-bottom:18px!important}
.auto-home .cards{gap:16px!important}
.auto-home .tile-photo{aspect-ratio:1.72!important}
.auto-home .tile-copy{padding:12px 14px 16px!important}
.auto-home .tile-title{font-size:clamp(17px,1.25vw,22px)!important;line-height:1.3!important}
.auto-home .tile-description{font-size:clamp(13px,.9vw,16px)!important;line-height:1.4!important;min-height:39px!important}
.auto-home .arrow{width:28px!important;height:28px!important;min-width:28px!important}
.auto-home .equip-section{margin-top:23px!important}
.auto-home .equip-section h2{font-size:clamp(26px,2.25vw,36px)!important}
.auto-home .equip-tile{min-height:132px!important;font-size:clamp(13px,.91vw,17px)!important;padding:16px 9px!important}
.auto-home .equip-icon svg{width:46px!important;height:46px!important}
@media(max-width:760px){.auto-home .main-panel{padding:12px!important}.auto-home .cards{gap:12px!important}.auto-home .tile-title{font-size:17px!important}.auto-home .tile-description{font-size:13px!important}}
 `}</style>
 <div className="hero"><img src="/auto-reel/bandeau.svg" alt="Photographie panoramique : berline bleue, utilitaire, moto, camping-car, bateau et vélo au bord d’un lac de montagne" /><div className="hero-title"><strong>Véhicules</strong><span>Vendez ou achetez tous types de véhicules et équipements</span></div></div>
 <section className="main-panel"><h1>Choisissez une sous-catégorie</h1>
 <p className="subtitle">dans la rubrique Automobile &amp; Véhicules</p>
 <div className="cards">{categories.map(c=><a className="category" key={c.slug} href={"/automobile/"+c.slug}>
 <div className="tile-photo"><div className="exact-photo" role="img" aria-label={"Photo de la maquette : "+c.name}/></div>
 <div className="tile-copy"><div className="tile-title"><span>{c.name}</span><span className="arrow"><ChevronRight size={17}/></span></div><p className="tile-description">{c.description}</p></div>
 </a>)}</div>
 <div className="equip-section"><h2>Équipements &amp; Services</h2>
 <div className="equip-grid">{equipements.map(e=><a href={"/automobile/"+e.slug} key={e.slug} className="equip-tile"><span className="equip-icon" aria-hidden="true">{e.icon}</span><span>{e.name}</span></a>)}</div></div>
 </section></main>
}
