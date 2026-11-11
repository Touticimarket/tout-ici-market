"use client";

import {useMemo,useState} from "react";
import {depotCategories,depotGroupes} from "./categories";

export default function ChoixDepotPage(){
  const [recherche,setRecherche]=useState("");
  const categories=useMemo(()=>depotCategories.filter(c=>
    [c.nom,c.description,...c.sousCategories].join(" ").toLocaleLowerCase("fr").includes(recherche.trim().toLocaleLowerCase("fr"))
  ),[recherche]);
  return (
    <main className="depot-hub">
      <style>{`
        .depot-hub{min-height:100vh;background:#f6f8fc;font-family:Arial,sans-serif;color:#102451}
        .depot-hub *, .depot-hub *::before, .depot-hub *::after{box-sizing:border-box}
        .depot-shell{max-width:1390px;margin:auto;padding:0 22px 65px}
        .depot-nav{min-height:88px;display:flex;align-items:center;justify-content:flex-end;gap:23px;flex-wrap:wrap;font-size:14px;font-weight:700}
        .depot-nav a{color:#0d2b5e;text-decoration:none}
        .depot-intro{border-radius:22px;background:linear-gradient(120deg,#063dba,#0b64cb);padding:43px 48px 42px;color:white;position:relative;overflow:hidden}
        .depot-intro::after{content:"";position:absolute;width:340px;height:340px;right:-120px;top:-180px;border:65px solid #ffd22a;border-radius:50%;opacity:.25;pointer-events:none}
        .depot-intro h1{font-size:clamp(29px,3.8vw,48px);margin:10px 0}
        .depot-intro p{font-size:17px;opacity:.95;line-height:1.55;margin-bottom:22px}
        .depot-search{width:min(600px,100%);padding:16px 18px;border:0;border-radius:12px;font-size:16px;box-shadow:0 5px 25px #051e441e}
        .depot-section{margin-top:28px}
        .depot-section h2{font-size:23px;margin:0 0 14px;color:#073b99}
        .depot-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
        .depot-card{display:flex;gap:16px;align-items:flex-start;background:#fff;border:1px solid #e1e9f6;border-radius:18px;padding:20px;text-decoration:none;color:#122751;min-height:155px;box-shadow:0 5px 20px #20376a0b;transition:transform .15s,border-color .15s}
        .depot-card:hover,.depot-card:focus-visible{transform:translateY(-2px);border-color:#0b56c8;outline-offset:3px}
        .depot-ico{flex:0 0 auto;width:48px;height:48px;display:grid;place-items:center;background:#fff6d5;border-radius:12px;font-size:26px}
        .depot-card h3{font-size:18px;margin:0 0 8px}
        .depot-card p{font-size:14px;color:#68748a;line-height:1.4;margin:0 0 12px}
        .depot-subs{font-size:12px;color:#1748a5;line-height:1.6}
        .depot-foot{margin-top:30px;background:#fff8e5;border:1px solid #f3e3b1;border-radius:14px;padding:20px 24px;line-height:1.6}
        @media(max-width:980px){.depot-cards{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:620px){.depot-shell{padding:0 13px 40px}.depot-nav{padding-top:85px;justify-content:center;min-height:140px}.depot-intro{padding:27px 22px}.depot-cards{grid-template-columns:1fr}.depot-card{min-height:0}}
      `}</style>
      <div className="depot-shell">
        <nav className="depot-nav" aria-label="Navigation de dépôt">
          <a href="/">Accueil</a><a href="/automobile">Automobile</a><a href="/immobilier">Immobilier</a><a href="/emploi">Emploi</a>
          <span style={{background:"#ffd12e",color:"#0e2b62",padding:"12px 17px",borderRadius:12}}>Déposer une annonce</span>
        </nav>
        <header className="depot-intro">
          <span style={{fontSize:13,fontWeight:800,letterSpacing:1,color:"#ffe28a"}}>TOUT ICI MARKET · ESPACE ANNONCES</span>
          <h1>Que souhaitez-vous vendre ou proposer ?</h1>
          <p>Choisissez une catégorie pour préparer votre annonce. Particuliers d'abord, professionnels bienvenus.</p>
          <input className="depot-search" type="search" value={recherche} onChange={e=>setRecherche(e.target.value)}
            aria-label="Rechercher une catégorie" placeholder="🔎  Rechercher une rubrique : voiture, maison, emploi…"/>
        </header>
        {depotGroupes.map(groupe=>{
          const selection=categories.filter(c=>c.groupe===groupe);
          if(!selection.length)return null;
          return <section key={groupe} className="depot-section" aria-label={groupe}>
            <h2>{groupe}</h2>
            <div className="depot-cards">
              {selection.map(c=><a key={c.slug} href={c.slug==="automobile"?"/automobile/deposer":"/deposer/"+c.slug} className="depot-card">
                <span className="depot-ico" aria-hidden="true">{c.icone}</span>
                <div>
                  <h3>{c.nom} <span style={{color:"#0b55c5"}} aria-hidden="true">›</span></h3>
                  <p>{c.description}</p>
                  <div className="depot-subs">{c.sousCategories.slice(0,4).join(" · ")}</div>
                  {c.slug!=="automobile"&&<div style={{color:"#79869c",fontSize:11,marginTop:8}}>Formulaire en préparation</div>}
                </div>
              </a>)}
            </div>
          </section>
        })}
        {!categories.length&&<p style={{padding:25,background:"white",borderRadius:14}}>Aucune rubrique trouvée. Essayez un autre mot.</p>}
        <aside className="depot-foot"><strong>🛡 Un espace sécurisé pour toutes vos annonces.</strong> Les informations demandées sont adaptées à chaque catégorie. Les nouvelles rubriques seront activées progressivement après leurs tests.</aside>
      </div>
    </main>
  );
}
