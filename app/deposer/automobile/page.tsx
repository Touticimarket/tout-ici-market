"use client";

import {useMemo,useState} from "react";
import {groupesAutomobile,typesVehicules} from "./types";

type GrandeRubrique = {
  titre:string; description:string; photo:string; icone:string; href:string;
};
type EquipementRubrique = {titre:string;icone:string;href:string};

const grandesRubriques:GrandeRubrique[]=[
  {titre:"Automobiles",description:"Voitures, berlines, SUV, citadines…",icone:"🚗",
   photo:"https://images.unsplash.com/photo-1607853202242-f76e8b299cce?auto=format&fit=crop&w=500&q=85",href:"/automobile/deposer?type=voiture"},
  {titre:"Utilitaires",description:"Fourgons, fourgonnettes, pick-up…",icone:"🚐",
   photo:"https://images.unsplash.com/photo-1641199788912-9a7385a35c82?auto=format&fit=crop&w=500&q=85",href:"/deposer/automobile/utilitaire"},
  {titre:"Camions",description:"Poids lourds, tracteurs, porteurs…",icone:"🚚",
   photo:"https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=500&q=85",href:"/deposer/automobile/camion"},
  {titre:"Caravaning",description:"Camping-cars, caravanes, cellules, vans…",icone:"🚎",
   photo:"https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=500&q=85",href:"#caravaning"},
  {titre:"Remorques",description:"Bagagères, porte-voitures, plateaux…",icone:"🛻",
   photo:"https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=500&q=85",href:"/deposer/automobile/remorque"},
  {titre:"Motos & scooters",description:"Motos, scooters, trois-roues, quads…",icone:"🏍️",
   photo:"https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=500&q=85",href:"#deux-roues"},
  {titre:"Vélos",description:"Vélo, VAE, VTT, route, enfant…",icone:"🚲",
   photo:"https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=500&q=85",href:"#velos"},
  {titre:"Nautisme",description:"Bateaux, jet-skis, voiliers…",icone:"⛵",
   photo:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=500&q=85",href:"/deposer/nautisme"},
  {titre:"Vans & aménagés",description:"Vans, fourgons aménagés, minibus…",icone:"🏕️",
   photo:"https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=500&q=85",href:"/deposer/automobile/van-amenage"},
  {titre:"Autres véhicules",description:"Collection, modèles spécifiques, engins…",icone:"🚙",
   photo:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=500&q=85",href:"#toutes-rubriques"},
];

const rubriquesEquipement:EquipementRubrique[]=[
  {titre:"Équipement auto",icone:"🛞",href:"/deposer/automobile/accessoires-auto"},
  {titre:"Équipement caravaning",icone:"🚎",href:"/deposer/automobile/equipement-caravaning"},
  {titre:"Équipement nautisme",icone:"⛵",href:"/deposer/automobile/equipement-nautisme"},
  {titre:"Équipements vélos",icone:"🚲",href:"/deposer/automobile/equipement-velo"},
  {titre:"Réparation mécanique",icone:"🔧",href:"/deposer/automobile/reparation-mecanique"},
  {titre:"Pneus & jantes",icone:"🛞",href:"/deposer/automobile/pneus-jantes"},
  {titre:"Pièces & accessoires",icone:"⚙️",href:"/deposer/automobile/pieces-auto"},
  {titre:"Équipement moto",icone:"🪖",href:"/deposer/automobile/equipement-moto"},
];

const rubriquesSite=[
  {titre:"Automobile & Véhicules",icone:"🚘",href:"/deposer/automobile",active:true},
  {titre:"Immobilier",icone:"🏠",href:"/deposer/immobilier"},
  {titre:"Emploi & Services",icone:"💼",href:"/deposer/emploi"},
  {titre:"Maison & Jardin",icone:"🛋️",href:"/deposer/maison-jardin"},
  {titre:"Téléphonie & Informatique",icone:"📱",href:"/deposer/telephones"},
  {titre:"Mode & Accessoires",icone:"👗",href:"/deposer/mode"},
  {titre:"Jeux & Loisirs",icone:"🎮",href:"/deposer/jeux-consoles"},
  {titre:"Vacances & Nautisme",icone:"⛵",href:"/deposer/nautisme"},
  {titre:"Autres catégories",icone:"📦",href:"/deposer/autres"},
];

function hrefPourType(slug:string,catalogueAuto:boolean):string {
  return catalogueAuto ? "/automobile/deposer?type="+encodeURIComponent(slug)
    : "/deposer/automobile/"+encodeURIComponent(slug);
}

export default function ChoisirTypeAutomobile(){
  const [recherche,setRecherche]=useState("");
  const filtre=recherche.trim().toLocaleLowerCase("fr");
  const visibles=useMemo(()=>typesVehicules.filter(t=>
    [t.nom,t.description,t.groupe].join(" ").toLocaleLowerCase("fr").includes(filtre)
  ),[filtre]);
  const vignettes=useMemo(()=>grandesRubriques.filter(r=>
    [r.titre,r.description].join(" ").toLocaleLowerCase("fr").includes(filtre)
  ),[filtre]);
  const equipements=useMemo(()=>rubriquesEquipement.filter(r=>
    r.titre.toLocaleLowerCase("fr").includes(filtre)
  ),[filtre]);

  return <main className="vh-root">
    <style>{`
      .vh-root{font-family:Arial,Helvetica,sans-serif;background:#f4f7fc;color:#071f4b;min-height:100vh}
      .vh-root *{box-sizing:border-box}
      .vh-root a:focus-visible,.vh-root input:focus-visible{outline:3px solid #ffcb23;outline-offset:3px}
      .vh-header{background:#fff;min-height:94px;display:flex;align-items:center;gap:20px;padding:12px 24px 12px 300px;border-bottom:1px solid #e0e8f4}
      .vh-header-search{display:flex;align-items:center;border:1px solid #d3dfef;border-radius:30px;overflow:hidden;flex:1;max-width:650px;background:#f5f8fe}
      .vh-header-search input{flex:1;min-width:0;border:0;background:transparent;padding:15px 18px;font-size:14px;color:#06265b}
      .vh-header-search button{border:0;background:#ffcf1f;border-radius:30px;padding:13px 17px;color:#072456;font-size:18px;cursor:pointer}
      .vh-header-links{display:flex;gap:17px;align-items:center;margin-left:auto;font-size:13px;font-weight:800;flex-wrap:wrap}
      .vh-header-links a{text-decoration:none;color:#14366e}
      .vh-header-links .vh-signup-btn{color:#0849b7;border:1px solid #b7cef0;background:#eef5ff;border-radius:10px;padding:11px 13px}
      .vh-yellow-btn{display:inline-flex;align-items:center;gap:8px;background:#ffd321;border-radius:13px;padding:13px 16px;color:#102354!important}
      .vh-nav{background:#07418f;min-height:58px;display:flex;gap:0;align-items:stretch;overflow-x:auto;scrollbar-width:thin}
      .vh-nav a{display:flex;align-items:center;gap:8px;white-space:nowrap;color:white;text-decoration:none;padding:17px 23px;font-weight:800;font-size:14px;border-right:1px solid #ffffff1b}
      .vh-nav a:hover{background:#0a55b4}
      .vh-nav a.active{background:#064da5;border-bottom:4px solid #ffd127}
      .vh-hero{background:linear-gradient(90deg,rgba(1,20,52,.82),rgba(3,36,82,.25)),url("https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=85") center/cover;min-height:235px;padding:25px 30px;color:white}
      .vh-hero-inner{max-width:1536px;margin:0 auto;display:grid;grid-template-columns:minmax(310px,.9fr) minmax(0,1.9fr);gap:24px;align-items:center;min-height:185px}
      .vh-hero-copy h1{display:inline-block;color:#042a66;background:#ffcb25;padding:10px 19px;font-size:clamp(26px,3vw,42px);margin:0 0 16px;transform:skew(-5deg);border-radius:4px}
      .vh-hero-copy p{font-size:18px;line-height:1.4;font-weight:700;max-width:400px;margin:0}
      .vh-hero-vehicles{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:9px;align-items:stretch;height:175px}
      .vh-hero-vehicles a{display:block;position:relative;border-radius:12px;overflow:hidden;border:2px solid #ffffff55;background:#d6e6f3;color:#fff;text-decoration:none;box-shadow:0 12px 23px #001c3c55}
      .vh-hero-vehicles img{width:100%;height:100%;object-fit:cover}
      .vh-hero-vehicles span{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(transparent,#001b4dde);padding:22px 8px 8px;font-size:12px;font-weight:800;text-align:center}
      .vh-content{max-width:1536px;margin:-1px auto 0;padding:14px 10px 70px;display:grid;grid-template-columns:325px minmax(0,1fr);gap:17px;align-items:start}
      .vh-side,.vh-main{background:#fff;border:1px solid #e2ebf6;border-radius:20px;box-shadow:0 5px 18px #1738690a}
      .vh-side{overflow:hidden;padding:10px}
      .vh-side-head{background:linear-gradient(130deg,#08469f,#06317b);border-radius:13px;color:#fff;padding:19px 16px;font-weight:800;font-size:18px}
      .vh-side a{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:13px 12px;text-decoration:none;font-size:14px;font-weight:750;color:#0e2a5a;border-radius:11px;border-bottom:1px solid #eaf0f7}
      .vh-side a:hover{background:#f1f6ff}
      .vh-side a.active{background:#ffdb37;color:#092856}
      .vh-side a .vh-side-text{display:flex;align-items:center;gap:12px}
      .vh-side a .vh-side-ico{font-size:21px}
      .vh-main{padding:20px 18px}
      .vh-main h2{font-size:clamp(22px,2.1vw,29px);margin:0 0 5px}
      .vh-subheading{font-size:15px;color:#5b687c;margin:0 0 18px}
      .vh-cards{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:11px}
      .vh-card{display:block;border-radius:16px;overflow:hidden;border:1px solid #d9e5f3;background:#f9fcff;color:#0c2350;min-width:0;text-decoration:none;transition:transform .15s,border-color .15s,box-shadow .15s}
      .vh-card:hover{transform:translateY(-2px);border-color:#1b68d9;box-shadow:0 8px 20px #17397616}
      .vh-card-image{height:104px;position:relative;display:grid;place-items:center;font-size:56px;background:linear-gradient(135deg,#eaf4ff,#ffffff)}
      .vh-card-image img{width:100%;height:100%;object-fit:cover;position:absolute;inset:0}
      .vh-card-body{padding:10px 11px 12px}
      .vh-card-title{display:flex;align-items:center;justify-content:space-between;gap:4px;font-size:15px;font-weight:800;margin-bottom:5px}
      .vh-card-title span{color:#064bbe;font-size:20px}
      .vh-card-desc{font-size:12px;line-height:1.45;color:#5b6c83;margin:0}
      .vh-divider{border:0;border-top:1px solid #dce6f2;margin:24px 0 15px}
      .vh-equipments{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
      .vh-equipment{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;text-decoration:none;color:#0c275c;font-size:13px;font-weight:800;line-height:1.2;background:#e9f3ff;border:1px solid #d6e9ff;border-radius:14px;min-height:118px;padding:14px 8px}
      .vh-equipment:hover{background:#d9eaff;border-color:#5e9bfa}
      .vh-equipment span{font-size:28px}
      .vh-detailed{margin-top:26px;scroll-margin-top:25px}
      .vh-detailed h2{font-size:22px;color:#073e9d;margin-bottom:14px}
      .vh-detailed-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
      .vh-detailed-link{border:1px solid #e2e9f5;background:#f8fbff;padding:13px 12px;border-radius:12px;text-decoration:none;color:#132d5d;display:flex;align-items:center;gap:10px;min-width:0}
      .vh-detailed-link:hover{background:#edf4ff;border-color:#78a7ed}
      .vh-detailed-link .ico{font-size:24px;flex:0 0 auto}
      .vh-detailed-link strong{font-size:14px;display:block}
      .vh-detailed-link small{font-size:11px;display:block;color:#68798f;line-height:1.4;margin-top:3px}
      .vh-detailed-link .chevron{margin-left:auto;color:#1155bd;font-weight:800}
      .vh-empty{padding:24px;background:#fff8df;border-radius:13px}
      .vh-footer-help{font-size:13px;color:#5c6f88;line-height:1.6;margin-top:24px;background:#f5f8fc;border-radius:14px;padding:14px}
      @media(min-width:1200px){.vh-equipments{grid-template-columns:repeat(8,minmax(0,1fr))}}
      @media(max-width:1200px){.vh-content{grid-template-columns:255px minmax(0,1fr)}.vh-cards{grid-template-columns:repeat(3,minmax(0,1fr))}.vh-detailed-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:800px){.vh-content{grid-template-columns:1fr}.vh-side{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.vh-side-head{grid-column:1/-1}.vh-hero-inner{grid-template-columns:1fr}.vh-hero-vehicles{height:135px}}
      @media(max-width:650px){.vh-header{padding:85px 12px 12px;flex-wrap:wrap}.vh-header-links{width:100%;justify-content:space-between}.vh-hero{padding:22px 13px}.vh-hero-vehicles{grid-template-columns:repeat(3,minmax(0,1fr));height:auto}.vh-hero-vehicles a{height:100px}.vh-cards{grid-template-columns:repeat(2,minmax(0,1fr))}.vh-equipments{grid-template-columns:repeat(2,minmax(0,1fr))}.vh-detailed-grid{grid-template-columns:1fr}.vh-main{padding:17px 12px}.vh-side{grid-template-columns:1fr}.vh-hero-copy p{font-size:15px}}
      @media(max-width:360px){.vh-cards{grid-template-columns:1fr}}
    
      /* Accueil Véhicules : logo, barre de recherche et toutes les actions sans rognage. */
      .vh-header{padding:11px 20px 11px 215px;min-height:78px;flex-wrap:wrap;gap:11px}
      .vh-header-search{min-width:220px;flex:1 1 310px;max-width:none}
      .vh-header-links{flex:0 1 auto;justify-content:flex-end;gap:10px}
      .vh-header-links a{white-space:nowrap;line-height:1.35}
      .vh-nav{flex-wrap:wrap;overflow-x:visible}
      .vh-nav a{white-space:normal;line-height:1.35;padding:12px 16px}
      @media(max-width:1100px){
        .vh-header{padding:78px 14px 14px;gap:10px}
        .vh-header-links{justify-content:center;margin-left:0;flex:1 1 100%}
        .vh-header-search{flex:1 1 100%;max-width:none}
        .vh-nav{justify-content:center}
      }
      @media(max-width:650px){
        .vh-header{padding:76px 12px 13px;min-height:0;gap:9px}
        .vh-header-links{gap:8px;justify-content:center}
        .vh-header-links a{font-size:12px;padding:9px 11px!important}
        .vh-nav{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0}
        .vh-nav a{font-size:12px;padding:11px 10px;white-space:normal}
      }
`}</style>
    <div className="vh-header">
      <form className="vh-header-search" onSubmit={e=>{e.preventDefault();document.getElementById("vehicules-categories")?.scrollIntoView({behavior:"smooth"});}}>
        <input value={recherche} onChange={e=>setRecherche(e.target.value)}
          aria-label="Rechercher un véhicule ou une sous-catégorie"
          placeholder="Rechercher une annonce, un véhicule, un bien…"/>
        <button type="submit" aria-label="Afficher les catégories correspondant à la recherche">⌕</button>
      </form>
      <div className="vh-header-links">
        <a href="/automobile">Voir les annonces</a>
        <a href="/compte/inscription" className="vh-signup-btn">Créer un compte</a>
        <a className="vh-yellow-btn" href="/deposer">＋ Déposer une annonce</a>
      </div>
    </div>
    <nav className="vh-nav" aria-label="Menu du site">
      <a href="/">⌂ Accueil</a>
      <a href="/deposer/automobile" className="active" aria-current="page">🚘 Automobile & Véhicules</a>
      <a href="/immobilier">⌂ Immobilier</a>
      <a href="/emploi">▣ Emploi & Services</a>
      <a href="/deposer">▦ Toutes les catégories</a>
      <a href="/automobile">⌕ Annonces à vendre</a>
    </nav>
    <section className="vh-hero">
      <div className="vh-hero-inner">
        <div className="vh-hero-copy">
          <h1>Automobile & Véhicules</h1>
          <p>Vendez ou achetez tous types de véhicules et d'équipements, au même endroit.</p>
        </div>
        <div className="vh-hero-vehicles" aria-label="Parcourir les principales catégories de véhicules">
          {grandesRubriques.filter(v=>["Automobiles","Utilitaires","Caravaning","Motos & scooters","Nautisme"].includes(v.titre)).map(v=>
            <a key={v.titre} href={v.href} aria-label={"Choisir "+v.titre}>
              <img src={v.photo} alt="" loading="lazy" onError={e=>{e.currentTarget.style.display="none"}}/>
              <span>{v.titre}</span>
            </a>
          )}
        </div>
      </div>
    </section>
    <div className="vh-content">
      <aside className="vh-side" aria-label="Rubriques de dépôt d'annonces">
        <div className="vh-side-head">➤ Déposer une annonce</div>
        {rubriquesSite.map(r=>
          <a key={r.href} href={r.href} className={r.active?"active":""}>
            <span className="vh-side-text"><span className="vh-side-ico" aria-hidden="true">{r.icone}</span>{r.titre}</span>
            <span aria-hidden="true">›</span>
          </a>
        )}
      </aside>
      <div className="vh-main">
        <section id="vehicules-categories">
          <h2>Choisissez une sous-catégorie</h2>
          <p className="vh-subheading">Dans la rubrique Automobile & Véhicules, chaque vignette est cliquable.</p>
          {vignettes.length>0&&<div className="vh-cards">
            {vignettes.map(v=><a className="vh-card" href={v.href} key={v.titre}>
              <div className="vh-card-image">
                <span aria-hidden="true">{v.icone}</span>
                <img src={v.photo} alt="" loading="lazy" onError={e=>{e.currentTarget.style.display="none"}}/>
              </div>
              <div className="vh-card-body">
                <div className="vh-card-title">{v.titre}<span aria-hidden="true">›</span></div>
                <p className="vh-card-desc">{v.description}</p>
              </div>
            </a>)}
          </div>}
        </section>
        {equipements.length>0&&<section aria-label="Équipements et services">
          <hr className="vh-divider"/>
          <h2>Équipements & Services</h2>
          <div className="vh-equipments">
            {equipements.map(r=><a key={r.titre} href={r.href} className="vh-equipment">
              <span aria-hidden="true">{r.icone}</span>
              {r.titre}
            </a>)}
          </div>
        </section>}
        <div id="toutes-rubriques" style={{scrollMarginTop:20}}/>
        {groupesAutomobile.map(groupe=>{
          const liste=visibles.filter(t=>t.groupe===groupe);
          if(!liste.length)return null;
          const id=groupe==="Voitures particulières"?"voitures":
            groupe==="Utilitaires, camions & transport"?"utilitaires":
            groupe==="Motos, scooters & quads"?"deux-roues":
            groupe==="Caravaning, vans & loisirs"?"caravaning":
            groupe==="Remorques & transport"?"remorques":
            groupe==="Vélos & mobilité douce"?"velos":"equipements";
          return <section key={groupe} id={id} className="vh-detailed">
            <h2>{groupe}</h2>
            <div className="vh-detailed-grid">
              {liste.map(type=><a key={type.slug} className="vh-detailed-link"
                href={hrefPourType(type.slug,type.catalogueAuto)}>
                <span className="ico" aria-hidden="true">{type.icone}</span>
                <span><strong>{type.nom}</strong><small>{type.description}</small></span>
                <span className="chevron" aria-hidden="true">›</span>
              </a>)}
            </div>
          </section>;
        })}
        {!visibles.length&&!vignettes.length&&!equipements.length&&
          <p className="vh-empty">Aucune catégorie trouvée. Essayez « voiture », « moto », « camion » ou « caravane ».</p>}
        <p className="vh-footer-help">
          Pour revenir à la catégorie précédente, utilisez le bouton jaune « Retour » en bas de l'écran.
          Les voitures disposent d'un dépôt connecté à Supabase ; les autres rubriques
          proposent pour l'instant un formulaire de préparation en attendant l'activation de leur publication.
        </p>
      </div>
    </div>
  </main>;
}
