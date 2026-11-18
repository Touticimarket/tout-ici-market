"use client";

import {useMemo,useState} from "react";
import {
  ArrowRight, Bike, BriefcaseBusiness, CarFront, ChevronDown, ChevronRight,
  CircleUserRound, Disc3, Hammer, Heart, Home, House, Laptop, MapPin,
  Package, Plus, Sailboat, Search, Send, Shirt, Sofa, Wrench
} from "lucide-react";
import {groupesAutomobile,typesVehicules} from "./types";

type Rubrique = {titre:string;description:string;photo:string;icone:string;href:string;motCle?:string};
type Service = {titre:string;href:string;icone:typeof Disc3};

const grandesRubriques:Rubrique[]=[
  {titre:"Automobiles",description:"Voitures, berlines, SUV, citadines, etc.",photo:"https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1000",icone:"🚗",href:"/automobile/deposer?type=voiture",motCle:"automobile voiture citadine"},
  {titre:"Utilitaires",description:"Fourgons, fourgonnettes, camionnettes, pick-up…",photo:"https://images.pexels.com/photos/32976307/pexels-photo-32976307.jpeg?auto=compress&cs=tinysrgb&w=1000",icone:"🚐",href:"/deposer/automobile/utilitaire",motCle:"utilitaire fourgon camionnette"},
  {titre:"Camions",description:"Poids lourds, tracteurs, porteurs, remorques…",photo:"https://images.pexels.com/photos/37848366/pexels-photo-37848366.jpeg?auto=compress&cs=tinysrgb&w=1000",icone:"🚚",href:"/deposer/automobile/camion"},
  {titre:"Caravaning",description:"Camping-cars, caravanes, cellules, vans aménagés…",photo:"https://images.pexels.com/photos/27173835/pexels-photo-27173835.jpeg?auto=compress&cs=tinysrgb&w=1000",icone:"🚎",href:"#caravaning"},
  {titre:"Remorques",description:"Bagagères, porte-voitures, plateaux, spéciales…",photo:"https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=750&q=85",icone:"🛻",href:"/deposer/automobile/remorque"},
  {titre:"Motos & Scooters",description:"Motos, scooters, 3 roues, quads…",photo:"https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=85",icone:"🏍️",href:"#deux-roues"},
  {titre:"Vélos",description:"Vélos, VAE, VTT, route, enfants, accessoires…",photo:"https://images.pexels.com/photos/5274201/pexels-photo-5274201.jpeg?auto=compress&cs=tinysrgb&w=1000",icone:"🚲",href:"#velos"},
  {titre:"Nautisme",description:"Bateaux, jet-skis, voiliers, remorques bateau…",photo:"https://images.pexels.com/photos/5973217/pexels-photo-5973217.jpeg?auto=compress&cs=tinysrgb&w=1000",icone:"⛵",href:"/deposer/nautisme"},
  {titre:"Vans & aménagés",description:"Vans, fourgons aménagés, minibus, loisirs…",photo:"https://images.pexels.com/photos/37443372/pexels-photo-37443372.jpeg?auto=compress&cs=tinysrgb&w=1000",icone:"🏕️",href:"/deposer/automobile/van-amenage"},
  {titre:"Autres véhicules",description:"Tracteurs, engins, véhicules spécifiques, collection…",photo:"https://images.pexels.com/photos/19172257/pexels-photo-19172257.jpeg?auto=compress&cs=tinysrgb&w=1000",icone:"🚙",href:"#toutes-rubriques"}
];

const services:Service[]=[
  {titre:"Équipement auto",href:"/deposer/automobile/accessoires-auto",icone:Disc3},
  {titre:"Équipement caravaning",href:"/deposer/automobile/equipement-caravaning",icone:Package},
  {titre:"Équipement nautisme",href:"/deposer/automobile/equipement-nautisme",icone:Sailboat},
  {titre:"Équipements vélos",href:"/deposer/automobile/equipement-velo",icone:Bike},
  {titre:"Services de réparation mécanique",href:"/deposer/automobile/reparation-mecanique",icone:Wrench},
  {titre:"Pneus & jantes",href:"/deposer/automobile/pneus-jantes",icone:Disc3},
  {titre:"Pièces & accessoires",href:"/deposer/automobile/pieces-auto",icone:Hammer},
  {titre:"Équipement moto",href:"/deposer/automobile/equipement-moto",icone:CarFront}
];

const menuLateral=[
  {titre:"Automobile & Véhicules",href:"/deposer/automobile",icone:CarFront,actif:true},
  {titre:"Immobilier",href:"/deposer/immobilier",icone:House},
  {titre:"Emploi & Services",href:"/deposer/emploi",icone:BriefcaseBusiness},
  {titre:"Maison & Jardin",href:"/deposer/maison-jardin",icone:Sofa},
  {titre:"Téléphonie & Informatique",href:"/deposer/telephones",icone:Laptop},
  {titre:"Mode & Accessoires",href:"/deposer/mode",icone:Shirt},
  {titre:"Jeux & Loisirs",href:"/deposer/jeux-consoles",icone:Bike},
  {titre:"Vacances & Nautisme",href:"/deposer/vacances-loisirs",icone:Sailboat},
  {titre:"Autres catégories",href:"/deposer/autres",icone:Package}
];

function lienType(slug:string,catalogueAuto:boolean){
  return catalogueAuto?"/automobile/deposer?type="+encodeURIComponent(slug)
    :"/deposer/automobile/"+encodeURIComponent(slug);
}

export default function PageAutomobileVehicules(){
  const [recherche,setRecherche]=useState("");
  const texte=recherche.trim().toLocaleLowerCase("fr");
  const cartes=useMemo(()=>grandesRubriques.filter(v=>
    [v.titre,v.description,v.motCle||""].join(" ").toLocaleLowerCase("fr").includes(texte)
  ),[texte]);
  const equipements=useMemo(()=>services.filter(v=>v.titre.toLocaleLowerCase("fr").includes(texte)),[texte]);
  const sousCategories=useMemo(()=>typesVehicules.filter(v=>
    [v.nom,v.description,v.groupe].join(" ").toLocaleLowerCase("fr").includes(texte)
  ),[texte]);

  return <main className="vh-root">
    <style>{`
      .vh-root{font-family:Arial,Helvetica,sans-serif;color:#071a45;background:#f2f5fa;min-height:100vh}
      .vh-root *{box-sizing:border-box}
      .vh-root a:focus-visible,.vh-root button:focus-visible,.vh-root input:focus-visible{outline:3px solid #ffcf28;outline-offset:3px}
      body:has(.vh-root) .ti-brand-link{top:8px;left:13px;width:229px;height:72px;background:#fff;border-radius:14px;padding:5px 10px;box-shadow:0 4px 17px #041a4350}
      body:has(.vh-root) .ti-brand-link img{width:100%;height:100%;object-fit:contain;object-position:center}
      .vh-top{min-height:92px;padding:10px 22px 10px 270px;background:#fff;border-bottom:1px solid #e1e8f2;display:flex;align-items:center;gap:20px;color:#092b61}
      .vh-top-search{background:#fff;color:#0d3262;border-radius:32px;display:flex;align-items:center;flex:1 1 auto;max-width:600px;min-width:210px;overflow:hidden;box-shadow:0 5px 16px #00000016}
      .vh-top-search input{min-width:0;flex:1;border:0;background:transparent;padding:16px 22px;color:#0d2b5e;font-size:14px;outline:0}
      .vh-top-search button{width:49px;height:49px;flex:none;display:grid;place-items:center;color:#02296d;border:0;border-radius:50%;background:#ffcf20;cursor:pointer}
      .vh-top-actions{display:flex;align-items:center;gap:15px;margin-left:auto;flex-wrap:wrap;justify-content:flex-end}
      .vh-top-actions a{display:inline-flex;align-items:center;gap:7px;color:#0a2e66;text-decoration:none;font-size:13px;font-weight:800;white-space:nowrap}
      .vh-top-actions a:hover{text-decoration:underline}
      .vh-top-actions .vh-top-cta{padding:13px 17px;background:#ffcb1d;color:#072753;border-radius:13px;box-shadow:0 4px 11px #001b4670}
      .vh-top-actions .vh-top-cta:hover{background:#ffda42;text-decoration:none}
      .vh-nav{display:flex;align-items:stretch;justify-content:space-between;background:#0a408e;min-height:58px;padding:0 14px}
      .vh-nav a,.vh-nav .vh-location{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-width:0;text-align:center;padding:12px 16px;color:#fff;font-weight:800;font-size:14px;line-height:1.3;text-decoration:none;border-bottom:4px solid transparent}
      .vh-nav a:hover{background:#1653a4}
      .vh-nav a.actif{background:#064390;border-bottom-color:#ffd020}
      .vh-location{white-space:nowrap}
      .vh-hero{position:relative;min-height:228px;background:
        linear-gradient(90deg,#051a46 0%,rgba(4,28,70,.86) 23%,rgba(2,31,72,.22) 54%,rgba(3,22,57,.12) 100%),
        url("https://images.pexels.com/photos/38095094/pexels-photo-38095094.jpeg?auto=compress&cs=tinysrgb&w=1000") center 53%/cover;
        color:#fff;overflow:hidden}
      .vh-hero-inner{width:min(100%,1540px);min-height:228px;margin:0 auto;padding:25px 24px;display:grid;grid-template-columns:minmax(280px,.85fr) minmax(0,1.4fr);align-items:center;gap:24px}
      .vh-hero h1{display:inline-block;transform:skew(-5deg);background:#ffcf21;color:#09285c;border-radius:4px;margin:0 0 14px;padding:12px 20px;font-weight:900;font-size:clamp(25px,2.9vw,40px);line-height:1.08;box-shadow:0 5px 15px #041a4b27}
      .vh-hero h1 span{display:inline-block;transform:skew(5deg)}
      .vh-hero p{font-size:clamp(15px,1.5vw,20px);line-height:1.4;font-weight:700;margin:0;max-width:450px;text-shadow:0 2px 7px #061e42}
      .vh-hero-gallery{display:grid;grid-template-columns:1.1fr .95fr 1.05fr .9fr;gap:9px;height:179px;align-items:stretch}
      .vh-hero-gallery a{min-width:0;border:2px solid #ffffff65;border-radius:12px;overflow:hidden;position:relative;display:block;background:#a0b9d5;box-shadow:0 12px 23px #02173555}
      .vh-hero-gallery img{width:100%;height:100%;object-fit:cover;object-position:center 55%;display:block}
      .vh-hero-gallery span{position:absolute;bottom:0;left:0;right:0;color:#fff;background:linear-gradient(transparent,#03183ecf);padding:22px 8px 9px;text-align:center;font-size:12px;font-weight:800}
      .vh-shell{width:min(100%,1540px);margin:0 auto;padding:12px 10px 65px;display:grid;grid-template-columns:325px minmax(0,1fr);gap:17px;align-items:start}
      .vh-side{background:linear-gradient(160deg,#fff,#f4f7fd);border:1px solid #e7edf6;border-radius:21px;padding:8px 7px 15px;box-shadow:0 6px 28px #123a7311}
      .vh-side-head{display:flex;align-items:center;gap:11px;background:linear-gradient(120deg,#0644a4,#052e78);color:#fff;font-size:20px;font-weight:900;border-radius:16px;padding:17px 18px;min-height:67px}
      .vh-side-head svg{color:#ffcf26;flex:none}
      .vh-side-list{margin-top:5px}
      .vh-side-link{display:flex;gap:12px;align-items:center;min-height:52px;padding:10px 13px;border-radius:12px;text-decoration:none;color:#102855;font-size:14px;font-weight:800;transition:background .15s}
      .vh-side-link>svg:first-child{width:25px;height:25px;flex:none}
      .vh-side-link>span{flex:1}
      .vh-side-link>svg:last-child{width:17px;height:17px;flex:none}
      .vh-side-link:hover{background:#e9f2ff}
      .vh-side-link.active{background:linear-gradient(125deg,#ffe96b,#ffcf24);color:#091e47}
      .vh-side-link+.vh-side-link{border-top:1px solid #eaf0f6}
      .vh-main{background:linear-gradient(135deg,#fff,#fbfcff);border:1px solid #e7edf6;border-radius:22px;padding:20px 20px 29px;box-shadow:0 6px 28px #123a730d;min-width:0}
      .vh-title-line{display:flex;align-items:center;gap:10px}
      .vh-title-line:before{content:"";height:5px;width:34px;flex:none;background:#ffcb1b;border-radius:5px}
      .vh-main h2{font-size:clamp(21px,2.3vw,29px);line-height:1.17;letter-spacing:-.45px;margin:0;color:#081e50;font-weight:900}
      .vh-subtitle{color:#586680;font-size:15px;font-weight:700;line-height:1.4;margin:4px 0 15px 44px}
      .vh-cards{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}
      .vh-card{display:block;overflow:hidden;min-width:0;border:1px solid #e2e8f1;border-radius:15px;text-decoration:none;color:#0a204c;background:linear-gradient(180deg,#fff,#f7f9fd);box-shadow:0 4px 10px #162d5516;transition:transform .17s,box-shadow .17s,border-color .17s}
      .vh-card:hover{transform:translateY(-3px);box-shadow:0 12px 24px #122d6128;border-color:#8cadde}
      .vh-card-image{height:117px;background:linear-gradient(135deg,#dceeff,#eaf3f9);position:relative;display:grid;place-items:center}
      .vh-card-image img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 55%}
      .vh-card-image .vh-image-fallback{font-size:46px}
      .vh-card-content{padding:11px 12px 13px}
      .vh-card-heading{display:flex;align-items:center;justify-content:space-between;gap:5px;margin-bottom:4px}
      .vh-card-heading strong{font-size:15px;line-height:1.17;letter-spacing:-.18px;font-weight:900}
      .vh-card-arrow{display:grid;place-items:center;width:25px;height:25px;flex:none;color:#07295c;border-radius:50%;background:#ffe07b}
      .vh-card-content p{color:#53627c;font-size:11.5px;line-height:1.3;margin:0;min-height:31px}
      .vh-divider{margin:21px 0 15px;border:0;border-top:1px solid #dee7f4}
      .vh-equipment-title{margin-bottom:13px}
      .vh-services{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:9px}
      .vh-service{min-width:0;min-height:120px;padding:13px 7px 12px;border-radius:16px;border:1px solid #dbe9fa;background:linear-gradient(145deg,#eaf4ff,#f7faff);text-decoration:none;color:#092554;text-align:center;display:flex;flex-direction:column;gap:10px;align-items:center;justify-content:center;font-size:12.5px;line-height:1.25;font-weight:850;box-shadow:0 3px 7px #1639690e}
      .vh-service svg{color:#063582;flex:none}
      .vh-service:hover{background:#dcecff;border-color:#89b7ed;transform:translateY(-2px)}
      .vh-detail-heading{display:flex;align-items:center;gap:8px;margin-top:25px;margin-bottom:11px}
      .vh-detail-heading:before{content:"";height:4px;width:25px;background:#ffca1e;border-radius:4px;flex:none}
      .vh-detail-heading h3{font-size:19px;color:#073985;margin:0;font-weight:900}
      .vh-detail-section{scroll-margin-top:20px;margin-top:23px}
      .vh-detail-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
      .vh-detail-card{min-width:0;border:1px solid #e0e9f5;border-radius:12px;background:#f8fbff;padding:11px 12px;display:flex;align-items:center;gap:10px;text-decoration:none;color:#18335f}
      .vh-detail-card:hover{background:#edf5ff;border-color:#83ace7}
      .vh-detail-card .vh-detail-emoji{font-size:23px}
      .vh-detail-card strong{font-size:13px;font-weight:800;display:block}
      .vh-detail-card small{display:block;font-size:11px;line-height:1.4;margin-top:3px;color:#66778c}
      .vh-detail-card svg{flex:none;margin-left:auto;color:#0e50b4}
      .vh-bottom-note{margin-top:23px;padding:13px 16px;background:#f5f8fd;border:1px solid #e3ebf7;border-radius:12px;color:#63718b;font-size:12px;line-height:1.6}
      .vh-empty{background:#fff8e6;border-radius:12px;padding:18px;color:#634b10;font-size:13px}
      @media(max-width:1300px){
        .vh-shell{grid-template-columns:255px minmax(0,1fr)}
        .vh-side-head{font-size:17px}
        .vh-side-link{font-size:12px}
        .vh-cards{grid-template-columns:repeat(3,minmax(0,1fr))}
        .vh-services{grid-template-columns:repeat(4,minmax(0,1fr))}
        .vh-top{flex-wrap:wrap}
        .vh-top-search{max-width:none}
      }
      @media(max-width:940px){
        body:has(.vh-root) .ti-brand-link{width:187px;height:63px;left:12px;top:8px}
        .vh-top{padding:83px 14px 13px;gap:11px}
        .vh-top-actions{justify-content:center;margin-left:0;flex:1 1 100%}
        .vh-nav{flex-wrap:wrap;justify-content:center;padding:0 5px}
        .vh-nav a,.vh-location{font-size:12px;padding:10px 12px}
        .vh-shell{grid-template-columns:1fr}
        .vh-side-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}
        .vh-side-link{font-size:12px}
        .vh-hero-inner{grid-template-columns:1fr;gap:18px}
        .vh-hero-gallery{height:135px}
      }
      @media(max-width:620px){
        .vh-top{padding:78px 11px 11px}
        .vh-top-search{min-width:0;flex:1 1 100%}
        .vh-top-search input{padding:13px 15px}
        .vh-top-actions{gap:9px}
        .vh-top-actions a{font-size:11px}
        .vh-top-actions .vh-top-cta{padding:10px 12px}
        .vh-nav{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}
        .vh-nav a,.vh-location{font-size:11px;min-height:43px}
        .vh-hero-inner{padding:25px 13px}
        .vh-hero h1{font-size:29px}
        .vh-hero p{font-size:15px}
        .vh-hero-gallery{height:109px;gap:5px}
        .vh-hero-gallery a{border-radius:7px}
        .vh-hero-gallery span{font-size:9px}
        .vh-shell{padding:10px 8px 50px;gap:11px}
        .vh-side{padding:7px}
        .vh-side-list{grid-template-columns:repeat(2,minmax(0,1fr))}
        .vh-side-link{gap:6px;min-height:45px;padding:9px 8px}
        .vh-side-link>svg:first-child{width:19px;height:19px}
        .vh-side-link>svg:last-child{display:none}
        .vh-main{padding:17px 11px}
        .vh-cards{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
        .vh-card-image{height:110px}
        .vh-card-heading strong{font-size:13px}
        .vh-card-content{padding:10px 9px 11px}
        .vh-card-content p{font-size:10.5px}
        .vh-service{min-height:100px;font-size:11px}
        .vh-detail-grid{grid-template-columns:1fr}
        .vh-subtitle{font-size:13px;margin-left:0}
        .vh-title-line:before{display:none}
      }
      @media(max-width:370px){
        .vh-card-image{height:94px}
        .vh-services{grid-template-columns:repeat(2,minmax(0,1fr))}
        .vh-top-actions a{font-size:10px}
      }
    `}</style>

    <header className="vh-top">
      <form className="vh-top-search" role="search" onSubmit={e=>{
        e.preventDefault();document.getElementById("categories-vehicules")?.scrollIntoView({behavior:"smooth"});
      }}>
        <input type="search" value={recherche} onChange={e=>setRecherche(e.target.value)}
          aria-label="Rechercher une catégorie de véhicule"
          placeholder="Rechercher une voiture, un van, une moto…"/>
        <button type="submit" aria-label="Voir les catégories correspondant à la recherche"><Search size={22}/></button>
      </form>
      <div className="vh-top-actions">
        <a href="/automobile"><ArrowRight size={19}/> Voir les annonces</a>
        <a href="/compte"><CircleUserRound size={21}/> Mon compte</a>
        <a href="/compte/inscription">Créer un compte</a>
        <a href="/automobile"><Heart size={20}/> Voir les annonces</a>
        <a href="/deposer" className="vh-top-cta"><Plus size={22}/> Déposer une annonce</a>
      </div>
    </header>

    <nav className="vh-nav" aria-label="Navigation principale">
      <a href="/"><Home size={20}/> Accueil</a>
      <a className="actif" aria-current="page" href="/deposer/automobile"><CarFront size={20}/> Automobile & Véhicules</a>
      <a href="/deposer/immobilier"><House size={20}/> Immobilier</a>
      <a href="/deposer/emploi"><BriefcaseBusiness size={20}/> Emploi & Services</a>
      <a href="/deposer"><Package size={20}/> Toutes les catégories <ChevronDown size={14}/></a>
      <span className="vh-location"><MapPin size={21}/> Partout en France</span>
    </nav>

    <section className="vh-hero" aria-label="Automobile et véhicules">
      <div className="vh-hero-inner">
        <div>
          <h1><span>Automobile & Véhicules</span></h1>
          <p>Vendez ou achetez tous types<br/>de véhicules et équipements</p>
        </div>
        <div className="vh-hero-gallery" aria-label="Nos principales familles de véhicules">
          {grandesRubriques.filter(v=>["Automobiles","Utilitaires","Caravaning","Motos & Scooters"].includes(v.titre)).map(v=>
            <a href={v.href} key={v.titre} aria-label={"Choisir "+v.titre}>
              <img src={v.photo} alt="" loading="lazy" onError={e=>e.currentTarget.style.display="none"}/>
              <span>{v.titre}</span>
            </a>
          )}
        </div>
      </div>
    </section>

    <div className="vh-shell">
      <aside className="vh-side" aria-label="Autres catégories d'annonces">
        <div className="vh-side-head"><Send size={25}/> Déposer une annonce</div>
        <div className="vh-side-list">
          {menuLateral.map(r=><a key={r.href} href={r.href}
            className={"vh-side-link"+(r.actif?" active":"")}>
            <r.icone aria-hidden="true"/>
            <span>{r.titre}</span>
            <ChevronRight aria-hidden="true"/>
          </a>)}
        </div>
      </aside>

      <div className="vh-main">
        <section id="categories-vehicules" style={{scrollMarginTop:20}}>
          <div className="vh-title-line"><h2>Choisissez une sous-catégorie</h2></div>
          <p className="vh-subtitle">Dans la rubrique Automobile & Véhicules</p>
          {cartes.length>0&&<div className="vh-cards">
            {cartes.map(r=><a key={r.titre} className="vh-card" href={r.href}>
              <div className="vh-card-image">
                <span className="vh-image-fallback" aria-hidden="true">{r.icone}</span>
                <img src={r.photo} alt="" loading="lazy" onError={e=>e.currentTarget.style.display="none"}/>
              </div>
              <div className="vh-card-content">
                <div className="vh-card-heading">
                  <strong>{r.titre}</strong>
                  <span className="vh-card-arrow"><ChevronRight size={16} strokeWidth={3} aria-hidden="true"/></span>
                </div>
                <p>{r.description}</p>
              </div>
            </a>)}
          </div>}
        </section>

        {equipements.length>0&&<section aria-label="Équipements et services">
          <hr className="vh-divider"/>
          <div className="vh-title-line vh-equipment-title"><h2>Équipements & Services</h2></div>
          <div className="vh-services">
            {equipements.map(s=><a href={s.href} className="vh-service" key={s.titre}>
              <s.icone size={33} strokeWidth={2.2} aria-hidden="true"/>
              <span>{s.titre}</span>
            </a>)}
          </div>
        </section>}

        <div id="toutes-rubriques" style={{scrollMarginTop:20}}/>
        {groupesAutomobile.map(groupe=>{
          const liste=sousCategories.filter(v=>v.groupe===groupe);
          if(!liste.length)return null;
          const id=groupe==="Voitures particulières"?"voitures":
            groupe==="Motos, scooters & quads"?"deux-roues":
            groupe==="Utilitaires, camions & transport"?"utilitaires":
            groupe==="Caravaning, vans & loisirs"?"caravaning":
            groupe==="Remorques & transport"?"remorques":
            groupe==="Vélos & mobilité douce"?"velos":"equipements";
          return <section id={id} className="vh-detail-section" key={groupe}>
            <div className="vh-detail-heading"><h3>{groupe}</h3></div>
            <div className="vh-detail-grid">
              {liste.map(v=><a href={lienType(v.slug,v.catalogueAuto)}
                className="vh-detail-card" key={v.slug}>
                <span className="vh-detail-emoji" aria-hidden="true">{v.icone}</span>
                <span style={{minWidth:0,flex:1}}><strong>{v.nom}</strong><small>{v.description}</small></span>
                <ChevronRight size={17} aria-hidden="true"/>
              </a>)}
            </div>
          </section>;
        })}
        {!cartes.length&&!equipements.length&&!sousCategories.length&&
          <p className="vh-empty">Aucune catégorie trouvée. Essayez « voiture », « moto », « camion » ou « van ».</p>}
        <p className="vh-bottom-note">
          Toutes les catégories sont cliquables. La publication automobile est connectée à Supabase ;
          les autres familles de véhicules disposent pour l'instant d'un formulaire de préparation
          en attendant l'activation de leur publication.
        </p>
      </div>
    </div>
  </main>;
}
