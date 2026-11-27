import {CarFront, Bike, Caravan, Truck, Sailboat, Wrench, ChevronRight} from "lucide-react";
const groups=[
 {slug:"voitures",name:"Automobiles & voitures de collection",details:"Voitures, SUV, berlines, citadines, collection",photo:0},
 {slug:"motos",name:"Motos, scooters & quads",details:"Motos, scooters, trois-roues et quads",photo:5},
 {slug:"caravaning",name:"Camping-cars & caravanes",details:"Camping-cars, caravanes, cellules",photo:3},
 {slug:"vans-amenages",name:"Vans aménagés",details:"Fourgons et vans aménagés",photo:8},
 {slug:"utilitaires",name:"Utilitaires",details:"Fourgons, camionnettes et pick-up",photo:1},
 {slug:"camions",name:"Camions",details:"Poids lourds et véhicules professionnels",photo:2},
 {slug:"remorques",name:"Remorques",details:"Plateaux, bagagères et porte-véhicules",photo:4},
 {slug:"velos",name:"Vélos",details:"Vélos, VAE, VTT et cycles",photo:6},
 {slug:"nautisme",name:"Nautisme",details:"Bateaux, voiliers et jet-skis",photo:7},
 {slug:"autres-vehicules",name:"Autres véhicules",details:"Tracteurs et engins spécifiques",photo:9}
];
const accessories=[
 ["pieces-accessoires","Pièces & accessoires auto"],["equipement-caravaning","Équipement caravaning"],
 ["equipement-nautisme","Équipement nautisme"],["equipement-velos","Équipements vélos"],
 ["pneus-jantes","Pneus & Jantes"],["entretien-consommables","Entretien & consommables"],["services-mecaniques","Services de réparation"]
];
export default function DeposerVehiculeAccueil(){
 return <main className="vehicle-depot-chooser">
 <style>{`
  .vehicle-depot-chooser{padding:10px 15px 35px;font-family:Arial,sans-serif;color:#09295e;background:#f6f9ff}
  .vehicle-depot-chooser *{box-sizing:border-box}
  .vehicle-depot-chooser .intro{background:linear-gradient(110deg,#092d70,#084f9f);border-radius:18px;color:white;padding:25px clamp(18px,3vw,40px);margin-bottom:18px}
  .vehicle-depot-chooser .intro h1{font-size:clamp(25px,2.7vw,39px);margin:0 0 10px}
  .vehicle-depot-chooser .intro p{font-size:16px;margin:0;line-height:1.5}
  .vehicle-depot-chooser .intro a{color:#ffda00;font-weight:800;display:inline-block;margin-bottom:10px}
  .vehicle-depot-chooser h2{font-size:clamp(21px,2vw,29px);margin:23px 0 14px}
  .vehicle-depot-chooser .cards{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:13px}
  .vehicle-depot-chooser .card{min-width:0;display:flex;flex-direction:column;background:white;border:1px solid #d9e4f3;border-radius:14px;overflow:hidden;text-decoration:none;color:#09265e;box-shadow:0 3px 10px #0a2a5910;transition:border-color .15s,background .15s}
  .vehicle-depot-chooser .card:hover,.vehicle-depot-chooser .card:focus-visible{border-color:#e6b200;background:#fff8df;outline:2px solid #ffdf71}
  .vehicle-depot-chooser .card-picture{width:100%;height:auto;aspect-ratio:1.72;background-image:url('/auto-reel/photos-maquette-exactes.svg');background-size:500% 200%;background-repeat:no-repeat}
  .vehicle-depot-chooser .card-body{padding:12px;flex:1}
  .vehicle-depot-chooser .card h3{font-size:clamp(16px,1.15vw,20px);line-height:1.23;margin:0 0 8px}
  .vehicle-depot-chooser .card p{font-size:13px;color:#435a7f;line-height:1.4;margin:0}
  .vehicle-depot-chooser .accessories{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
  .vehicle-depot-chooser .accessories a{background:#eaf3ff;text-decoration:none;border:1px solid #d6e4f4;border-radius:12px;padding:16px;color:#082e72;font-size:15px;font-weight:800}
  .vehicle-depot-chooser .accessories a:hover,.vehicle-depot-chooser .accessories a:focus-visible{background:#ffcc00;color:#071e45}
  @media(max-width:1200px){.vehicle-depot-chooser .cards{grid-template-columns:repeat(3,minmax(0,1fr))}}
  @media(max-width:760px){.vehicle-depot-chooser .cards{grid-template-columns:repeat(2,minmax(0,1fr))}.vehicle-depot-chooser .accessories{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:440px){.vehicle-depot-chooser .cards{grid-template-columns:1fr}}

  /* Les petites photos conservent leur cadrage dans leur vignette. */
  .vehicle-depot-chooser .card-picture{display:block;width:100%;aspect-ratio:1.72/1;min-height:110px;background-color:#eff5fb;background-repeat:no-repeat;background-size:500% 200%}
  .vehicle-depot-chooser .card-body{min-height:105px}
 `}</style>
 <header className="intro"><a href="/deposer">← Retour au choix des catégories</a><h1>Déposer une annonce — Automobile & véhicules</h1><p>Choisissez d'abord votre type de véhicule. Chaque rubrique ouvre son propre formulaire, avec des informations adaptées à votre annonce. Aucune publicité sur ces pages.</p></header>
 <h2>Quel véhicule souhaitez-vous vendre ?</h2>
 <div className="cards">{groups.map(g=><a key={g.slug} className="card" href={"/automobile/deposer/"+g.slug}><div className="card-picture" style={{backgroundPosition:(g.photo%5)*25+"% "+(g.photo<5?"0%":"100%")}} aria-hidden="true"/><div className="card-body"><h3>{g.name} <ChevronRight size={17}/></h3><p>{g.details}</p></div></a>)}</div>
 <h2>Équipements, pièces & services</h2><div className="accessories">{accessories.map(([slug,label])=><a href={"/automobile/deposer/"+slug} key={slug}>{label} ›</a>)}</div>
 </main>
}
