"use client";

import {useMemo,useState} from "react";
import {groupesAutomobile,typesVehicules} from "./types";

export default function ChoisirTypeAutomobile(){
  const [recherche,setRecherche]=useState("");
  const types=useMemo(()=>typesVehicules.filter(t=>
    [t.nom,t.description,t.groupe].join(" ").toLocaleLowerCase("fr").includes(recherche.trim().toLocaleLowerCase("fr"))
  ),[recherche]);

  return <main className="auto-choose">
    <style>{`
      .auto-choose{font-family:Arial,sans-serif;min-height:100vh;background:#f5f8fd;color:#10244c}
      .auto-choose *{box-sizing:border-box}
      .auto-choose-container{max-width:1370px;margin:auto;padding:0 22px 60px}
      .auto-choose-nav{min-height:91px;display:flex;justify-content:flex-end;align-items:center;gap:24px;font-size:14px;font-weight:bold;flex-wrap:wrap}
      .auto-choose-nav a{color:#0a3d9c;text-decoration:none}
      .auto-choose-hero{background:linear-gradient(115deg,#0538ae,#0866cb);padding:32px 36px;border-radius:22px;color:white;display:grid;grid-template-columns:minmax(0,1fr) minmax(300px,1fr);align-items:center;gap:22px}
      .auto-choose-gallery{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;height:205px}
      .auto-choose-gallery figure{margin:0;position:relative;overflow:hidden;border-radius:12px;border:2px solid #ffffff55;box-shadow:0 12px 23px #031d4b33;background:#4f78aa}
      .auto-choose-gallery img{width:100%;height:100%;object-fit:cover;display:block}
      .auto-choose-gallery figcaption{position:absolute;bottom:0;left:0;right:0;padding:9px 7px;font-size:12px;font-weight:800;color:white;background:linear-gradient(transparent,#051e4add)}
      @media(max-width:950px){.auto-choose-hero{grid-template-columns:1fr}.auto-choose-gallery{height:170px}}
      .auto-choose-hero h1{margin:10px 0;font-size:clamp(28px,3.6vw,44px)}
      .auto-choose-hero p{line-height:1.5;font-size:17px}
      .auto-choose-search{border:0;border-radius:10px;padding:15px 17px;width:min(550px,100%);font-size:15px;margin-top:8px}
      .auto-choose-group{margin-top:26px}
      .auto-choose-group h2{font-size:22px;color:#0644b2;margin:0 0 14px}
      .auto-choose-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:13px}
      .auto-choose-card{display:flex;gap:12px;background:#fff;border:1px solid #e0e7f3;border-radius:15px;text-decoration:none;color:#152747;padding:17px;min-height:118px;transition:border-color .15s,transform .15s}
      .auto-choose-card:hover,.auto-choose-card:focus-visible{border-color:#064bc1;transform:translateY(-2px)}
      .auto-choose-icon{width:46px;height:46px;border-radius:11px;display:grid;place-items:center;background:#fff5d0;font-size:23px;flex-shrink:0}
      .auto-choose-card strong{font-size:16px;display:block;margin:3px 0 6px}
      .auto-choose-card p{font-size:12px;line-height:1.4;color:#62728a;margin:0}
      @media(max-width:1090px){.auto-choose-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
      @media(max-width:800px){.auto-choose-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:540px){.auto-choose-container{padding:0 13px 40px}.auto-choose-nav{padding-top:82px;justify-content:center;min-height:150px}.auto-choose-hero{padding:25px 22px}.auto-choose-gallery{height:132px}.auto-choose-grid{grid-template-columns:1fr}}
    `}</style>
    <div className="auto-choose-container">
      <nav className="auto-choose-nav" aria-label="Navigation">
        <a href="/">Accueil</a><a href="/deposer">Toutes les catégories</a>
        <a href="/automobile">Annonces automobiles</a>
      </nav>
      <header className="auto-choose-hero">
        <div>
          <span style={{fontWeight:800,color:"#ffe488",fontSize:12}}>🚘 TOUT ICI MARKET · AUTOMOBILE & VÉHICULES</span>
          <h1>Quel véhicule ou équipement souhaitez-vous proposer ?</h1>
          <p>Voitures, utilitaires, camions, caravaning, remorques, vélos, équipements et services mécaniques : choisissez votre rubrique.</p>
          <input type="search" className="auto-choose-search" value={recherche} onChange={e=>setRecherche(e.target.value)}
            placeholder="Rechercher : remorque, camping-car, utilitaire…" aria-label="Rechercher un type de véhicule"/>
        </div>
        <div className="auto-choose-gallery" aria-label="Photos d'illustration des véhicules">
          <figure><img src="https://images.unsplash.com/photo-1607853202242-f76e8b299cce?auto=format&fit=crop&w=640&q=80" alt="SUV récent en rue urbaine"/><figcaption>Voitures & SUV</figcaption></figure>
          <figure><img src="https://images.unsplash.com/photo-1641199788912-9a7385a35c82?auto=format&fit=crop&w=640&q=80" alt="Fourgon utilitaire stationné en ville"/><figcaption>Utilitaires & fourgons</figcaption></figure>
          <figure><img src="https://images.unsplash.com/photo-1780296269675-169390638617?auto=format&fit=crop&w=640&q=80" alt="Berline moderne en milieu urbain"/><figcaption>Berlines premium</figcaption></figure>
        </div>
      </header>
      {groupesAutomobile.map(groupe=>{
        const liste=types.filter(t=>t.groupe===groupe);
        if(!liste.length)return null;
        return <section className="auto-choose-group" key={groupe}>
          <h2>{groupe}</h2>
          <div className="auto-choose-grid">{liste.map(type=>
            <a key={type.slug} href={type.catalogueAuto?"/automobile/deposer?type="+encodeURIComponent(type.slug):"/deposer/automobile/"+type.slug} className="auto-choose-card">
              <span className="auto-choose-icon" aria-hidden="true">{type.icone}</span>
              <span><strong>{type.nom} <span aria-hidden="true" style={{color:"#0d4ccc"}}>›</span></strong><p>{type.description}</p></span>
            </a>
          )}</div>
        </section>;
      })}
      {!types.length&&<p style={{padding:25,background:"white",borderRadius:14}}>Aucune sous-catégorie ne correspond à la recherche.</p>}
      <p style={{marginTop:30,color:"#667791",fontSize:13,lineHeight:1.7}}>Vous pourrez modifier votre choix dans le formulaire. Le dépôt est réservé aux annonces réelles, avec photos et informations exactes.</p>
    </div>
  </main>;
}
