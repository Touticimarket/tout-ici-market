"use client";

import {useEffect, useMemo, useState} from "react";
import {supabase} from "../lib/supabaseClient";

type Annonce = {
  id: string | number;
  type_vehicule?: string;
  marque: string | null;
  modele: string | null;
  finition: string | null;
  annee: number | null;
  kilometrage: number | null;
  carburant: string | null;
  boite: string | null;
  prix: number | null;
  ville: string | null;
  description: string | null;
};
type Photo = {annonce_id:string;url:string;ordre:number};
const euro=(value:number|null)=>new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(value||0);

export default function AutomobilePage() {
  const [annonces,setAnnonces]=useState<Annonce[]>([]);
  const [images,setImages]=useState<Record<string,string>>({});
  const [recherche,setRecherche]=useState("");
  const [marque,setMarque]=useState("");
  const [prixMax,setPrixMax]=useState("");
  const [carburant,setCarburant]=useState("");
  const [loading,setLoading]=useState(true);
  const [erreur,setErreur]=useState("");

  useEffect(()=>{
    let actif=true;
    async function charger() {
      const {data,error}=await supabase.from("annonces_auto")
        .select("id,type_vehicule,marque,modele,finition,annee,kilometrage,carburant,boite,prix,ville,description")
        .eq("statut","publiee").order("id",{ascending:false}).limit(100);
      if (!actif) return;
      if(error){setErreur("Impossible de charger les annonces : "+error.message);setLoading(false);return;}
      const voitures=(data||[]) as Annonce[];
      setAnnonces(voitures);
      if(voitures.length) {
        const ids=voitures.map(a=>String(a.id));
        const {data:medias}=await supabase.from("annonces_auto_photos")
          .select("annonce_id,url,ordre").in("annonce_id",ids).order("ordre",{ascending:true});
        if(actif&&medias) {
          const photos:Record<string,string>={};
          for(const media of medias as Photo[]) {
            if(!photos[media.annonce_id]) photos[media.annonce_id]=media.url;
          }
          setImages(photos);
        }
      }
      setLoading(false);
    }
    charger();
    return ()=>{actif=false};
  },[]);

  const marques=useMemo(()=>[...new Set(annonces.map(a=>a.marque).filter((v):v is string=>!!v))].sort((a,b)=>a.localeCompare(b,"fr")),[annonces]);
  const visibles=useMemo(()=>annonces.filter(a=>{
    const texte=[a.marque,a.modele,a.finition,a.ville].filter(Boolean).join(" ").toLocaleLowerCase("fr");
    if(recherche&& !texte.includes(recherche.toLocaleLowerCase("fr")))return false;
    if(marque&&a.marque!==marque)return false;
    if(prixMax&&Number(a.prix||0)>Number(prixMax))return false;
    if(carburant&&a.carburant!==carburant)return false;
    return true;
  }),[annonces,recherche,marque,prixMax,carburant]);

  return (
    <main style={{fontFamily:"Arial, sans-serif",background:"#f6f8fc",color:"#10214a",minHeight:"100vh"}}>
      <style>{`
        .cars-wrap{max-width:1430px;margin:auto;padding:20px 20px 70px}
        .cars-nav{display:flex;justify-content:flex-end;align-items:center;gap:22px;min-height:65px;flex-wrap:wrap;font-size:14px;font-weight:700}
        .cars-nav a{color:#05275c;text-decoration:none}
        .cars-hero{background:linear-gradient(90deg,rgba(3,21,49,.97),rgba(4,29,64,.84) 43%,rgba(4,36,74,.18)),url("https://images.unsplash.com/photo-1702139146899-df34319ede56?auto=format&fit=crop&w=1600&q=85") center 53%/cover,linear-gradient(135deg,#103c7a,#5f8aa9);border-radius:22px;padding:54px 42px;min-height:260px;display:flex;align-items:center;color:white}
        .cars-main{display:grid;grid-template-columns:255px minmax(0,1fr);gap:22px;margin-top:23px}
        .cars-panel,.cars-card{background:white;border:1px solid #e1e8f2;border-radius:17px;padding:21px;box-shadow:0 6px 25px #1c34540b}
        .cars-input{width:100%;padding:13px;border-radius:10px;border:1px solid #cdd8e9;box-sizing:border-box;background:white;margin-top:7px;margin-bottom:14px;font-size:14px}
        .cars-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(245px,1fr));gap:18px}
        .cars-card{overflow:hidden;padding:0}
        .cars-photo{height:180px;width:100%;object-fit:cover;background:linear-gradient(135deg,#dde7f8,#f7f9fc)}
        .cars-price{font-size:25px;color:#0644c1;font-weight:800}
        .cars-btn{display:inline-block;background:#ffcf1f;color:#10214a;text-decoration:none;padding:15px 22px;border-radius:13px;font-weight:800}
        @media(max-width:800px){.cars-main{grid-template-columns:1fr}.cars-hero{padding:26px 23px;min-height:220px}.cars-nav{gap:14px}.cars-wrap{padding:12px}}
      `}</style>
      <div className="cars-wrap">
        <nav className="cars-nav" aria-label="Navigation principale">
          <a href="/">Accueil</a><a href="/deposer/automobile" style={{color:"#0048cd"}}>Automobile & Véhicules</a><a href="/immobilier">Immobilier</a>
          <a href="/compte/inscription" style={{color:"#0647bf",textDecoration:"none",fontWeight:800}}>Créer un compte</a>
          <a href="/deposer" className="cars-btn">Déposer une annonce</a>
        </nav>
        <section className="cars-hero">
          <div>
            <span style={{background:"#ffcf1f",color:"#06275c",padding:"8px 11px",borderRadius:9,fontSize:12,fontWeight:800}}>AUTOMOBILE & VÉHICULES</span>
            <h1 style={{fontSize:"clamp(36px,4.2vw,61px)",margin:"14px 0 10px"}}>Trouvez votre prochain véhicule</h1>
            <p style={{fontSize:19,maxWidth:540,lineHeight:1.5}}>Voitures, motos, scooters, utilitaires, camions et caravaning : retrouvez tous vos véhicules au même endroit.</p>
            <a href="/deposer/automobile" className="cars-btn">Choisir le type de véhicule</a>
          </div>
        </section>
        <div className="cars-main">
          <aside className="cars-panel" style={{alignSelf:"start"}}>
            <h2 style={{color:"#0644c1",marginTop:0}}>Rechercher</h2>
            <label>Marque<select className="cars-input" value={marque} onChange={e=>setMarque(e.target.value)}><option value="">Toutes les marques</option>{marques.map(m=><option key={m}>{m}</option>)}</select></label>
            <label>Modèle, finition ou ville<input className="cars-input" value={recherche} onChange={e=>setRecherche(e.target.value)} placeholder="Ex : BMW X5, Lyon..."/></label>
            <label>Prix maximum (€)<input className="cars-input" type="number" min="0" value={prixMax} onChange={e=>setPrixMax(e.target.value)} placeholder="Ex : 25000"/></label>
            <label>Carburant<select className="cars-input" value={carburant} onChange={e=>setCarburant(e.target.value)}><option value="">Tous les carburants</option>{["Essence","Diesel","Hybride","Hybride rechargeable","Électrique","GPL"].map(v=><option key={v}>{v}</option>)}</select></label>
            <button type="button" onClick={()=>{setMarque("");setRecherche("");setPrixMax("");setCarburant("")}} style={{background:"#eef4ff",border:0,borderRadius:10,padding:"12px 15px",color:"#0042b5",fontWeight:700,cursor:"pointer",width:"100%"}}>Réinitialiser les filtres</button>
          </aside>
          <section>
            <h2 style={{margin:"4px 0 18px"}}>Annonces automobiles {loading?"":<span style={{color:"#68768f",fontSize:17,fontWeight:400}}>({visibles.length})</span>}</h2>
            {erreur&&<p role="alert" className="cars-panel">{erreur}</p>}
            {loading ? <p className="cars-panel">Chargement des annonces…</p> : !visibles.length ?
              <div className="cars-panel" style={{padding:30}}>
                <h3>{annonces.length?"Aucun véhicule ne correspond à votre recherche.":"Les premières annonces arrivent !"}</h3>
                <p>Vous souhaitez vendre un véhicule ? Choisissez son type pour préparer votre annonce.</p>
                <a href="/deposer/automobile" className="cars-btn">Déposer une annonce</a>
              </div> :
              <div className="cars-cards">
                {visibles.map(a=><article className="cars-card" key={String(a.id)}>
                  {images[String(a.id)] ? <img className="cars-photo" src={images[String(a.id)]} alt={[a.marque,a.modele].filter(Boolean).join(" ")}/> : <div className="cars-photo" style={{display:"grid",placeItems:"center",fontSize:60}}>🚗</div>}
                  <div style={{padding:20}}>
                    <span style={{background:"#fff3c2",color:"#5c4800",fontSize:11,padding:"5px 9px",borderRadius:14,fontWeight:700}}>{a.type_vehicule==="suv-4x4"?"SUV & 4x4":a.type_vehicule==="monospace"?"Monospace":"Voiture"}</span>
                    <div className="cars-price" style={{marginTop:10}}>{euro(a.prix)}</div>
                    <h3 style={{fontSize:19,margin:"10px 0 8px"}}>{[a.marque,a.modele,a.finition].filter(Boolean).join(" ")}</h3>
                    <p style={{color:"#56647b",lineHeight:1.55}}>{[a.annee,a.carburant,a.kilometrage!=null?new Intl.NumberFormat("fr-FR").format(a.kilometrage)+" km":null,a.boite].filter(Boolean).join(" · ")}</p>
                    <strong>📍 {a.ville||"France"}</strong>
                    {a.description&&<p style={{fontSize:13,color:"#697790",marginTop:12}}>{a.description.slice(0,125)}{a.description.length>125?"…":""}</p>}
                  </div>
                </article>)}
              </div>
            }
          </section>
        </div>
      </div>
    </main>
  );
}
