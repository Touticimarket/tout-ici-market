"use client";

import {useEffect,useMemo,useState} from "react";
import {
  ArrowLeft,ArrowRight, Bike,CarFront,ChevronRight,Heart,Home,MapPin,Package,Plus,Search,
  Truck,UserRound
} from "lucide-react";
import {supabase} from "../lib/supabaseClient";

type Annonce={
  id:string;type_vehicule:string|null;marque:string|null;modele:string|null;finition:string|null;
  annee:number|null;kilometrage:number|null;carburant:string|null;boite:string|null;
  prix:number|null;ville:string|null;description:string|null;
};
type Photo={annonce_id:string;url:string;ordre:number};
type Categorie={slug:string;nom:string;description:string;photo:string;icone:string;types:string[]};

const categories:Categorie[]=[
  {slug:"voiture",nom:"Automobiles",description:"Berlines, SUV, citadines et sportives",icone:"🚗",types:["voiture","suv-4x4","monospace","vehicule-collection","voiture-sans-permis"],photo:"https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1000"},
  {slug:"moto",nom:"Motos & Scooters",description:"Routières, trails, scooters et quads",icone:"🏍️",types:["moto","moto-trail","moto-sportive","moto-custom","scooter","maxi-scooter","cyclomoteur","quad","trois-roues","moto-electrique"],photo:"https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=85"},
  {slug:"utilitaire",nom:"Utilitaires",description:"Fourgons, camionnettes et pick-up",icone:"🚐",types:["utilitaire","fourgon","camionnette"],photo:"https://images.pexels.com/photos/32976307/pexels-photo-32976307.jpeg?auto=compress&cs=tinysrgb&w=1000"},
  {slug:"camion",nom:"Camions",description:"Poids lourds, tracteurs et porteurs",icone:"🚚",types:["camion","poids-lourd","benne"],photo:"https://images.pexels.com/photos/37848366/pexels-photo-37848366.jpeg?auto=compress&cs=tinysrgb&w=1000"},
  {slug:"caravaning",nom:"Caravaning",description:"Camping-cars, caravanes et cellules",icone:"🚎",types:["camping-car","caravane","mobil-home","cellule-camping"],photo:"https://images.pexels.com/photos/27173835/pexels-photo-27173835.jpeg?auto=compress&cs=tinysrgb&w=1000"},
  {slug:"velo",nom:"Vélos",description:"VTT, vélos de route et électriques",icone:"🚲",types:["velo","vtt","velo-route","vae","trottinette"],photo:"https://images.pexels.com/photos/5274201/pexels-photo-5274201.jpeg?auto=compress&cs=tinysrgb&w=1000"},
  {slug:"nautisme",nom:"Nautisme",description:"Bateaux, voiliers et jet-skis",icone:"🛥️",types:["nautisme"],photo:"https://images.pexels.com/photos/5973217/pexels-photo-5973217.jpeg?auto=compress&cs=tinysrgb&w=1000"},
  {slug:"remorque",nom:"Remorques",description:"Plateaux, bagagères, porte-voitures",icone:"🛻",types:["remorque","porte-voiture","remorque-moto","remorque-bateau","semi-remorque"],photo:"https://images.pexels.com/photos/38095094/pexels-photo-38095094.jpeg?auto=compress&cs=tinysrgb&w=1000"},
  {slug:"van",nom:"Vans aménagés",description:"Vans, camping et fourgons de loisirs",icone:"🏕️",types:["van","van-amenage","fourgon-amenage"],photo:"https://images.pexels.com/photos/37443372/pexels-photo-37443372.jpeg?auto=compress&cs=tinysrgb&w=1000"},
  {slug:"autres",nom:"Autres véhicules",description:"Collection, modèles spéciaux et quads",icone:"🚙",types:["vehicule-collection","quad","voiture-sans-permis"],photo:"https://images.pexels.com/photos/19172257/pexels-photo-19172257.jpeg?auto=compress&cs=tinysrgb&w=1000"}
];
const euros=(n:number|null)=>new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n||0);

export default function AutomobilePage(){
  const [annonces,setAnnonces]=useState<Annonce[]>([]);
  const [photos,setPhotos]=useState<Record<string,string>>({});
  const [categorie,setCategorie]=useState("tous");
  const [texte,setTexte]=useState("");
  const [marque,setMarque]=useState("");
  const [prixMax,setPrixMax]=useState("");
  const [chargement,setChargement]=useState(true);
  const [erreur,setErreur]=useState("");

  useEffect(()=>{
    const initial=new URLSearchParams(window.location.search).get("categorie")||"tous";
    setCategorie(categories.some(c=>c.slug===initial)?initial:"tous");
  },[]);

  useEffect(()=>{
    let actif=true;
    async function charger(){
      const {data,error}=await supabase.from("annonces_auto")
        .select("id,type_vehicule,marque,modele,finition,annee,kilometrage,carburant,boite,prix,ville,description")
        .eq("statut","publiee").order("id",{ascending:false}).limit(150);
      if(!actif)return;
      if(error){setErreur("Les annonces ne sont pas disponibles pour le moment.");setChargement(false);return;}
      const result=(data||[]) as Annonce[];
      setAnnonces(result);
      if(result.length){
        const ids=result.map(a=>String(a.id));
        const {data:medias}=await supabase.from("annonces_auto_photos")
          .select("annonce_id,url,ordre").in("annonce_id",ids).order("ordre",{ascending:true});
        if(actif&&medias){
          const images:Record<string,string>={};
          for(const m of medias as Photo[])if(!images[m.annonce_id])images[m.annonce_id]=m.url;
          setPhotos(images);
        }
      }
      setChargement(false);
    }
    charger();
    return ()=>{actif=false};
  },[]);

  const selection=categories.find(c=>c.slug===categorie);
  const marques=useMemo(()=>[...new Set(annonces.map(a=>a.marque).filter((m):m is string=>!!m))]
    .sort((a,b)=>a.localeCompare(b,"fr")),[annonces]);
  const annoncesVisibles=useMemo(()=>annonces.filter(a=>{
    const type=a.type_vehicule||"voiture";
    if(selection&&!selection.types.includes(type))return false;
    if(marque&&a.marque!==marque)return false;
    if(prixMax&&Number(a.prix)>Number(prixMax))return false;
    if(texte&&![a.marque,a.modele,a.finition,a.ville,a.description].filter(Boolean).join(" ")
      .toLocaleLowerCase("fr").includes(texte.toLocaleLowerCase("fr")))return false;
    return true;
  }),[annonces,selection,marque,prixMax,texte]);

  function changerCategorie(slug:string){
    setCategorie(slug);
    const u=new URL(window.location.href);
    if(slug==="tous")u.searchParams.delete("categorie");
    else u.searchParams.set("categorie",slug);
    window.history.replaceState(null,"",u.pathname+u.search+u.hash);
    document.getElementById("annonces-vehicules")?.scrollIntoView({behavior:"smooth",block:"start"});
  }

  return <main className="market-vehicles">
    <style>{`
      .market-vehicles{font-family:Arial,Helvetica,sans-serif;background:#f5f8fd;min-height:100vh;color:#0a2557}
      .market-vehicles *{box-sizing:border-box}
      .market-vehicles a:focus-visible,.market-vehicles button:focus-visible,.market-vehicles input:focus-visible,.market-vehicles select:focus-visible{outline:3px solid #ffc826;outline-offset:2px}
      .mv-header{min-height:83px;display:flex;align-items:center;justify-content:flex-end;gap:15px;background:#fff;border-bottom:1px solid #e1e8f2;padding:12px 21px 12px 226px;color:#092b61;flex-wrap:wrap}
      .mv-search{display:flex;align-items:center;min-width:210px;flex:1 1 330px;max-width:610px;border-radius:30px;background:#fff;overflow:hidden}
      .mv-search input{width:100%;min-width:0;border:0;background:#fff;padding:15px 21px;font-size:14px;color:#082650}
      .mv-search button{display:grid;place-items:center;width:49px;height:49px;border-radius:50%;border:0;background:#ffce17;color:#092652;cursor:pointer;flex:none}
      .mv-actions{display:flex;align-items:center;justify-content:flex-end;gap:15px;flex-wrap:wrap}
      .mv-actions a{color:#0a2e66;text-decoration:none;font-weight:800;font-size:13px;display:flex;gap:7px;align-items:center;white-space:nowrap}
      .mv-actions a:hover{text-decoration:underline}
      .mv-actions .mv-primary{padding:13px 17px;background:#ffcd1f;color:#051f51;border-radius:11px}
      .mv-nav{display:flex;justify-content:space-around;align-items:stretch;gap:4px;background:#0b4392;padding:0 12px;flex-wrap:wrap}
      .mv-nav a{color:#fff;text-decoration:none;display:inline-flex;align-items:center;gap:9px;padding:13px 15px;font-size:14px;font-weight:800;border-bottom:4px solid transparent}
      .mv-nav a.active{background:#063780;border-bottom-color:#ffcd27}
      .mv-nav a:hover{background:#1458a3}
      .mv-hero{background:linear-gradient(90deg,rgba(4,22,56,.93),rgba(6,36,71,.52) 45%,rgba(2,25,68,.05)),url("https://images.pexels.com/photos/38095094/pexels-photo-38095094.jpeg?auto=compress&cs=tinysrgb&w=1000") center 52%/cover;min-height:265px;color:#fff}
      .mv-hero-inner{max-width:1540px;margin:auto;min-height:265px;padding:26px 24px;display:grid;grid-template-columns:minmax(410px,.95fr) minmax(0,1.45fr);gap:22px;align-items:center}
      .mv-hero h1{white-space:nowrap;display:inline-block;background:#ffcb20;color:#09265e;padding:12px 20px;border-radius:5px;font-size:clamp(25px,2.55vw,39px);margin:12px 0 11px;transform:skew(-5deg)}
      .mv-hero p{font-size:clamp(16px,1.8vw,21px);font-weight:800;line-height:1.4;margin:0;max-width:440px;text-shadow:0 2px 6px #051a38}
      .mv-hero-showcase{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;height:186px}
      .mv-hero-showcase a{position:relative;display:block;overflow:hidden;background:#c0d2e8;border:2px solid #ffffff66;border-radius:13px;box-shadow:0 8px 19px #031d49b2;text-decoration:none;color:#fff}
      .mv-hero-showcase img{height:100%;width:100%;object-fit:cover;object-position:center 56%}
      .mv-hero-showcase span{position:absolute;left:0;right:0;bottom:0;font-size:12px;font-weight:800;text-align:center;padding:20px 8px 8px;background:linear-gradient(transparent,#09244bd9)}
      .mv-wrap{width:min(100%,1540px);margin:auto;padding:19px 18px 85px}
      .mv-back{display:inline-flex;gap:8px;align-items:center;color:#0744ab;text-decoration:none;font-size:13px;font-weight:750;margin-bottom:12px}
      .mv-heading{display:flex;justify-content:space-between;align-items:center;gap:13px;flex-wrap:wrap;margin:0 0 18px}
      .mv-heading h2{font-size:clamp(23px,2.5vw,32px);margin:0 0 6px;font-weight:900;color:#08255b}
      .mv-heading h2:before{content:"";display:inline-block;width:34px;height:5px;margin-right:11px;vertical-align:middle;background:#ffce22;border-radius:4px}
      .mv-heading p{color:#65738b;font-size:14px;margin:0}
      .mv-categories{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}
      .mv-category{background:#fff;text-decoration:none;color:#0d285d;border:1px solid #dde6f3;border-radius:17px;overflow:hidden;box-shadow:0 4px 14px #14356b16;transition:transform .16s,border-color .16s}
      .mv-category:hover,.mv-category:focus-visible{transform:translateY(-3px);border-color:#ffcf30;box-shadow:0 9px 22px #1737642a}
      .mv-category-image{height:132px;position:relative;background:linear-gradient(140deg,#e0ecfb,#f8fbff);display:grid;place-items:center}
      .mv-category-image img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 56%}
      .mv-category-image span{font-size:39px}
      .mv-category-body{padding:12px 13px 14px}
      .mv-category-title{display:flex;gap:8px;justify-content:space-between;align-items:center;margin:0 0 5px;font-weight:900;font-size:15px}
      .mv-category-title .arrow{flex:none;background:#ffe389;border-radius:50%;width:25px;height:25px;display:grid;place-items:center}
      .mv-category-body p{font-size:12px;color:#5d6e87;line-height:1.4;margin:0;min-height:35px}
      .mv-listing-section{background:#fff;border:1px solid #e1e9f4;box-shadow:0 7px 30px #183b7510;border-radius:21px;padding:23px;margin-top:27px;scroll-margin-top:16px}
      .mv-filter-panel{display:flex;gap:11px;align-items:center;flex-wrap:wrap;margin-bottom:20px}
      .mv-filter-panel input,.mv-filter-panel select{min-width:135px;flex:1 1 200px;padding:13px;border:1px solid #cddbef;border-radius:10px;background:#fff;color:#122c5b;font-size:14px}
      .mv-filter-panel button{border:1px solid #bed4f0;color:#0c4cb3;background:#f1f7ff;border-radius:10px;padding:13px 16px;font-weight:800;cursor:pointer}
      .mv-listing-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:15px}
      .mv-listing{background:#fff;border:1px solid #e2eaf5;border-radius:14px;overflow:hidden;box-shadow:0 5px 12px #14366a13}
      .mv-listing img,.mv-listing-fallback{display:grid;place-items:center;width:100%;height:170px;object-fit:cover;background:#eaf3ff;font-size:50px}
      .mv-listing-content{padding:14px}
      .mv-listing-content h3{font-size:16px;margin:8px 0;line-height:1.25}
      .mv-listing-content p{color:#61718a;font-size:12px;line-height:1.5;margin:0 0 10px}
      .mv-price{font-size:21px;font-weight:900;color:#0646bd}
      .mv-empty{border:1px dashed #b9d0ee;background:linear-gradient(125deg,#f5f9ff,#fffaf0);border-radius:18px;text-align:center;padding:35px 23px}
      .mv-empty h3{font-size:22px;margin:6px 0 10px}
      .mv-empty p{font-size:14px;line-height:1.65;color:#5c6e87;max-width:670px;margin:0 auto 20px}
      .mv-empty a{display:inline-flex;align-items:center;gap:8px;padding:13px 18px;border-radius:12px;text-decoration:none;font-size:14px;font-weight:800;background:#ffce25;color:#092b66}
      .mv-pills{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:17px}
      .mv-pill{border:1px solid #d1def0;background:#f4f7fc;color:#12417b;padding:8px 12px;border-radius:20px;font-size:12px;font-weight:800;cursor:pointer}
      .mv-pill.active{background:#0947a5;color:#fff;border-color:#0947a5}
      .mv-note{margin-top:18px;color:#6a7c97;font-size:12px;line-height:1.6}
      @media(max-width:1210px){.mv-categories{grid-template-columns:repeat(4,minmax(0,1fr))}.mv-listing-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.mv-header{padding-left:205px}.mv-hero-inner{grid-template-columns:310px minmax(0,1fr)}}
      @media(max-width:940px){.mv-header{padding:80px 14px 13px}.mv-actions{justify-content:center;flex:1 1 100%}.mv-search{max-width:none}.mv-hero-inner{grid-template-columns:1fr}.mv-hero h1{white-space:normal}.mv-hero-showcase{height:145px}.mv-categories{grid-template-columns:repeat(3,minmax(0,1fr))}}
      @media(max-width:620px){.mv-header{padding:77px 11px 11px}.mv-actions{gap:10px}.mv-actions a{font-size:11px}.mv-nav{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.mv-nav a{font-size:12px;padding:11px 9px}.mv-hero-inner{padding:25px 13px}.mv-hero-showcase{height:105px;gap:5px}.mv-hero-showcase span{font-size:9px}.mv-wrap{padding:15px 11px 60px}.mv-categories{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.mv-category-image{height:111px}.mv-category-title{font-size:13px}.mv-category-body p{font-size:11px}.mv-listing-grid{grid-template-columns:1fr}.mv-listing-section{padding:17px 12px}}
    `}</style>
    <header className="mv-header">
      <form className="mv-search" role="search" onSubmit={e=>{e.preventDefault();document.getElementById("annonces-vehicules")?.scrollIntoView({behavior:"smooth"});}}>
        <input aria-label="Rechercher dans les annonces de véhicules" type="search" value={texte}
          onChange={e=>setTexte(e.target.value)} placeholder="Rechercher une annonce, un véhicule, une marque…"/>
        <button type="submit" aria-label="Rechercher"><Search size={22}/></button>
      </form>
      <div className="mv-actions">
        <a href="/compte"><UserRound size={19}/> Mon compte</a>
        <a href="/compte/inscription">Créer un compte</a>
        <a href="/automobile#annonces-vehicules"><Heart size={19}/> Annonces</a>
        <a className="mv-primary" href="/deposer"><Plus size={19}/> Déposer une annonce</a>
      </div>
    </header>
    <nav className="mv-nav" aria-label="Navigation principale">
      <a href="/"><Home size={19}/> Accueil</a>
      <a href="/automobile" className="active" aria-current="page"><CarFront size={19}/> Automobile & Véhicules</a>
      <a href="/deposer/immobilier">Immobilier</a>
      <a href="/deposer/emploi">Emploi & Services</a>
      <a href="/deposer">Toutes les catégories</a>
    </nav>
    <section className="mv-hero">
      <div className="mv-hero-inner">
        <div>
          <h1>Automobile & Véhicules</h1>
          <p>Découvrez et consultez toutes les annonces de véhicules.</p>
        </div>
        <div className="mv-hero-showcase">
          {categories.filter(c=>["voiture","moto","utilitaire","van"].includes(c.slug)).map(c=><a
            key={c.slug} href={"/automobile?categorie="+c.slug+"#annonces-vehicules"} title={"Voir les annonces "+c.nom}>
            <img src={c.photo} alt="" onError={e=>e.currentTarget.style.display="none"}/>
            <span>{c.nom}</span>
          </a>)}
        </div>
      </div>
    </section>

    <div className="mv-wrap">
      <a href="/" className="mv-back"><ArrowLeft size={16}/> Retour à l'accueil</a>
      <div className="mv-heading"><div>
        <h2>Parcourez les annonces par type de véhicule</h2>
        <p>Cliquez sur une photo pour découvrir les annonces de cette catégorie.</p>
      </div>
        <a href="/deposer/automobile" style={{color:"#0750b8",textDecoration:"none",fontSize:13,fontWeight:800}}>
          Vous souhaitez vendre ? Déposer une annonce <ArrowRight size={15} style={{verticalAlign:"middle"}}/>
        </a>
      </div>
      <div className="mv-categories" aria-label="Catégories de véhicules à consulter">
        {categories.map(c=><a key={c.slug} className="mv-category" href={"/automobile?categorie="+c.slug+"#annonces-vehicules"}>
          <div className="mv-category-image">
            <span aria-hidden="true">{c.icone}</span>
            <img src={c.photo} alt="" loading="lazy" onError={e=>e.currentTarget.style.display="none"}/>
          </div>
          <div className="mv-category-body">
            <div className="mv-category-title"><span>{c.nom}</span><span className="arrow"><ChevronRight size={15}/></span></div>
            <p>{c.description}</p>
          </div>
        </a>)}
      </div>

      <section className="mv-listing-section" id="annonces-vehicules" aria-label="Résultats des annonces de véhicules">
        <div className="mv-heading"><div>
          <h2>{selection?"Annonces — "+selection.nom:"Toutes les annonces Automobile & Véhicules"}</h2>
          <p>{chargement?"Chargement des annonces…":annoncesVisibles.length+" annonce"+(annoncesVisibles.length>1?"s":"")+" publiée"+(annoncesVisibles.length>1?"s":"")}</p>
        </div>
          <a href="/deposer/automobile" style={{color:"#064cba",fontWeight:800,textDecoration:"none",fontSize:13}}>
            Déposer une annonce <ArrowRight size={16} style={{verticalAlign:"middle"}}/>
          </a>
        </div>
        <div className="mv-pills">
          <button className={"mv-pill"+(categorie==="tous"?" active":"")} onClick={()=>changerCategorie("tous")}>Toutes</button>
          {categories.map(c=><button key={c.slug} type="button" className={"mv-pill"+(categorie===c.slug?" active":"")}
            onClick={()=>changerCategorie(c.slug)}>{c.nom}</button>)}
        </div>
        <div className="mv-filter-panel">
          <select value={marque} aria-label="Filtrer par marque" onChange={e=>setMarque(e.target.value)}>
            <option value="">Toutes les marques</option>
            {marques.map(m=><option key={m} value={m}>{m}</option>)}
          </select>
          <input type="number" min="0" value={prixMax} onChange={e=>setPrixMax(e.target.value)}
            placeholder="Prix maximum (€)" aria-label="Prix maximum"/>
          <button type="button" onClick={()=>{setTexte("");setMarque("");setPrixMax("");changerCategorie("tous")}}>Réinitialiser</button>
        </div>

        {erreur&&<p role="alert" className="mv-empty">{erreur}</p>}
        {chargement?<div className="mv-empty"><h3>Chargement des annonces…</h3></div>:
        annoncesVisibles.length?
          <div className="mv-listing-grid">
            {annoncesVisibles.map(a=><article className="mv-listing" key={String(a.id)}>
              {photos[String(a.id)]?
                <img src={photos[String(a.id)]} alt={[a.marque,a.modele].filter(Boolean).join(" ")}/>:
                <div className="mv-listing-fallback" aria-label="Annonce sans photo">🚗</div>}
              <div className="mv-listing-content">
                <strong className="mv-price">{euros(a.prix)}</strong>
                <h3>{[a.marque,a.modele,a.finition].filter(Boolean).join(" ")}</h3>
                <p>{[a.annee,a.kilometrage!=null?a.kilometrage.toLocaleString("fr-FR")+" km":null,a.carburant].filter(Boolean).join(" · ")}</p>
                <p><MapPin size={13} style={{verticalAlign:"middle"}}/> {a.ville||"France"}</p>
                {a.description&&<p>{a.description.slice(0,110)}{a.description.length>110?"…":""}</p>}
              </div>
            </article>)}
          </div>:
          <div className="mv-empty">
            <div style={{fontSize:42}} aria-hidden="true">{selection?.icone||"🚘"}</div>
            <h3>{annonces.length?"Aucune annonce ne correspond à cette sélection.":"Les premières annonces arrivent bientôt !"}</h3>
            <p>Il n'y a pas encore d'annonce publiée {selection?"dans la catégorie "+selection.nom:"dans cette rubrique"}. Les images ci-dessus illustrent les catégories et ne représentent pas des véhicules réellement à vendre sur le site.</p>
            <a href="/deposer/automobile"><Plus size={17}/> Soyez le premier à déposer une annonce</a>
          </div>}
        <p className="mv-note">Seules les annonces effectivement publiées dans notre base sont affichées ici. Les photographies des rubriques sont des illustrations, pas des offres de vente.</p>
      </section>
    </div>
  </main>;
}
