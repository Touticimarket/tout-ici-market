"use client";

import {useEffect,useMemo,useState} from "react";
import {useParams} from "next/navigation";
import {trouverCategorie} from "../categories";

type Infos = Record<string,string>;
const limitImages = 8;

export default function DepotRubriquePage(){
  const params=useParams<{categorie:string}>();
  const slug=typeof params.categorie==="string"?params.categorie:"";
  const categorie=useMemo(()=>trouverCategorie(slug),[slug]);
  const cle="toutici-brouillon-"+slug;
  const [infos,setInfos]=useState<Infos>({});
  const [photos,setPhotos]=useState<File[]>([]);
  const [apercus,setApercus]=useState<string[]>([]);
  const [message,setMessage]=useState("");
  const [charge,setCharge]=useState(false);

  useEffect(()=>{
    if(!categorie)return;
    try{
      const sauvegarde=window.localStorage.getItem(cle);
      if(sauvegarde){
        const recupere=JSON.parse(sauvegarde);
        if(recupere && typeof recupere==="object" && !Array.isArray(recupere))setInfos(recupere as Infos);
      }
    }catch{
      setMessage("Le brouillon local n'a pas pu être chargé.");
    }
    setCharge(true);
  },[categorie,cle]);

  if(!categorie)return <main style={{fontFamily:"Arial,sans-serif",padding:"120px 24px 60px",textAlign:"center"}}>
    <h1>Rubrique introuvable</h1><p>Cette rubrique n'existe pas dans le dépôt d'annonces.</p>
    <a href="/deposer" style={{color:"#0047bb"}}>Retour aux catégories</a>
  </main>;

  function changer(nom:string,valeur:string){
    setInfos(ancien=>({...ancien,[nom]:valeur}));
    setMessage("");
  }
  function choisirPhotos(files:FileList|null){
    if(!files)return;
    const selection=[...photos,...Array.from(files)]
      .filter(f=>["image/jpeg","image/png","image/webp"].includes(f.type) && f.size<=10*1024*1024)
      .slice(0,limitImages);
    apercus.forEach(url=>URL.revokeObjectURL(url));
    setPhotos(selection);
    setApercus(selection.map(f=>URL.createObjectURL(f)));
  }
  function enregistrer(){
    if(!infos.sousCategorie || !infos.titre?.trim() || !infos.description?.trim() || !infos.ville?.trim()){
      setMessage("Complétez la sous-catégorie, le titre, la description et la ville.");
      return;
    }
    try{
      window.localStorage.setItem(cle,JSON.stringify(infos));
      setMessage("Brouillon enregistré dans ce navigateur. Il n'est pas encore publié et les photos ne sont pas conservées après fermeture de la page.");
    }catch{
      setMessage("Enregistrement local impossible. Vérifiez les paramètres de votre navigateur.");
    }
  }

  return <main className="rubrique-root">
    <style>{`
      .rubrique-root{font-family:Arial,sans-serif;background:#f6f8fc;color:#102451;min-height:100vh}
      .rubrique-root *{box-sizing:border-box}
      .rubrique-shell{max-width:1300px;margin:auto;padding:0 22px 65px}
      .rubrique-nav{display:flex;align-items:center;justify-content:flex-end;gap:22px;min-height:86px;font-size:14px;font-weight:bold}
      .rubrique-nav a{color:#063eaa;text-decoration:none}
      .rubrique-hero{background:linear-gradient(120deg,#0642b7,#0867ca);padding:34px 42px;color:white;border-radius:21px}
      .rubrique-hero h1{margin:8px 0;font-size:clamp(28px,3vw,42px)}
      .rubrique-hero p{margin:8px 0;color:#f1f6ff;line-height:1.5}
      .rubrique-cols{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(240px,.7fr);gap:18px;margin-top:18px}
      .rubrique-card{background:white;border:1px solid #e1e9f4;border-radius:18px;padding:24px;margin-bottom:18px;box-shadow:0 7px 26px #1d37670b}
      .rubrique-card h2{font-size:20px;color:#073da4;margin-top:0}
      .rubrique-fieldgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px}
      .rubrique-field{display:block;font-size:13px;font-weight:700}
      .rubrique-field input,.rubrique-field select,.rubrique-field textarea{display:block;width:100%;margin-top:8px;border:1px solid #cbd6e8;border-radius:10px;padding:13px;font:inherit;font-size:14px;background:white;color:#102451}
      .rubrique-field textarea{min-height:135px;resize:vertical;line-height:1.5}
      .rubrique-full{grid-column:1/-1}
      .rubrique-photos{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin-top:13px}
      .rubrique-photos img{width:100%;height:93px;border-radius:9px;object-fit:cover}
      .rubrique-btn{border:0;background:#0649ca;color:white;padding:15px 24px;font-size:15px;font-weight:800;border-radius:12px;cursor:pointer}
      .rubrique-alert{background:#fff6d8;border:1px solid #efdf9d;border-radius:13px;padding:16px;color:#554216;line-height:1.55;font-size:13px}
      @media(max-width:850px){.rubrique-cols{grid-template-columns:1fr}}
      @media(max-width:600px){.rubrique-shell{padding:0 12px 40px}.rubrique-nav{padding-top:80px;min-height:140px;justify-content:center}.rubrique-fieldgrid{grid-template-columns:1fr}.rubrique-card{padding:17px}.rubrique-hero{padding:27px 22px}.rubrique-photos{grid-template-columns:repeat(3,minmax(0,1fr))}}
    `}</style>
    <div className="rubrique-shell">
      <nav className="rubrique-nav" aria-label="Navigation"><a href="/">Accueil</a><a href="/deposer">Toutes les catégories</a></nav>
      <header className="rubrique-hero">
        <span style={{fontSize:13,fontWeight:800,color:"#ffe282"}}>{categorie.icone} TOUT ICI MARKET · {categorie.nom.toUpperCase()}</span>
        <h1>Préparez votre annonce {categorie.nom.toLocaleLowerCase("fr")}</h1>
        <p>Un formulaire adapté à votre catégorie. Vous pouvez déjà préparer votre texte et enregistrer un brouillon local.</p>
      </header>
      <div className="rubrique-cols">
        <div>
          <section className="rubrique-card">
            <h2>1. Rubrique et description</h2>
            <div className="rubrique-fieldgrid">
              <label className="rubrique-field">Sous-catégorie *
                <select value={infos.sousCategorie||""} onChange={e=>changer("sousCategorie",e.target.value)}>
                  <option value="">Choisir une sous-catégorie</option>
                  {categorie.sousCategories.map(n=><option key={n}>{n}</option>)}
                </select>
              </label>
              <label className="rubrique-field">Ville *
                <input value={infos.ville||""} onChange={e=>changer("ville",e.target.value)} placeholder="Ville de votre annonce"/>
              </label>
              <label className="rubrique-field rubrique-full">Titre de l'annonce *
                <input value={infos.titre||""} onChange={e=>changer("titre",e.target.value)} maxLength={120} placeholder="Un titre court et précis"/>
              </label>
              <label className="rubrique-field rubrique-full">Description *
                <textarea value={infos.description||""} onChange={e=>changer("description",e.target.value)} placeholder="Décrivez ce que vous vendez ou proposez, son état et les informations utiles…"/>
              </label>
            </div>
          </section>
          <section className="rubrique-card">
            <h2>2. Caractéristiques {categorie.nom.toLocaleLowerCase("fr")}</h2>
            <div className="rubrique-fieldgrid">
              {categorie.champs.map(champ=><label key={champ.nom} className="rubrique-field">{champ.libelle}
                <input type={champ.type||"text"} value={infos[champ.nom]||""} onChange={e=>changer(champ.nom,e.target.value)} placeholder={champ.placeholder||""}/>
              </label>)}
              <label className="rubrique-field">Prix demandé (€)
                <input type="number" min="0" value={infos.prix||""} onChange={e=>changer("prix",e.target.value)} placeholder="Facultatif pour les dons et certaines offres"/>
              </label>
              <label className="rubrique-field">Code postal
                <input value={infos.codePostal||""} onChange={e=>changer("codePostal",e.target.value)} placeholder="Ex : 67000"/>
              </label>
            </div>
          </section>
          <section className="rubrique-card">
            <h2>3. Photos (aperçu local)</h2>
            <label className="rubrique-field" style={{border:"2px dashed #aebfdf",background:"#f9fbff",padding:25,borderRadius:12,textAlign:"center",cursor:"pointer"}}>
              <span style={{fontSize:30,display:"block",marginBottom:8}}>📷</span>
              Sélectionner jusqu'à 8 photos ({photos.length}/{limitImages})
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e=>choisirPhotos(e.target.files)} style={{margin:"12px auto 0",maxWidth:290}}/>
              <span style={{fontWeight:400,fontSize:12,display:"block",marginTop:8}}>Aperçu uniquement, sans transfert vers le site à ce stade.</span>
            </label>
            <div className="rubrique-photos">{apercus.map((url,i)=><img key={url} src={url} alt={"Aperçu photo "+(i+1)}/>)}</div>
          </section>
          <section className="rubrique-card">
            <h2>4. Enregistrer mon brouillon</h2>
            <p style={{fontSize:14,lineHeight:1.6,color:"#67748a"}}>Cette rubrique est en cours de développement : l'enregistrement est local à cet appareil, pas dans la base de données. Vous ne publiez aucune annonce en cliquant ici.</p>
            <button type="button" className="rubrique-btn" onClick={enregistrer} disabled={!charge}>Enregistrer mon brouillon</button>
            {message&&<p role="status" style={{background:"#fff6d8",padding:13,borderRadius:9,lineHeight:1.5,fontSize:13}}>{message}</p>}
          </section>
        </div>
        <aside>
          <div className="rubrique-card" style={{background:"#fffdf5"}}>
            <h2>Votre rubrique</h2>
            <div style={{fontSize:40}}>{categorie.icone}</div>
            <strong style={{display:"block",margin:"10px 0"}}>{categorie.nom}</strong>
            <p style={{fontSize:14,color:"#64748b",lineHeight:1.5}}>{categorie.description}</p>
            <a href="/deposer" style={{fontSize:13,fontWeight:700,color:"#0344ba"}}>Changer de catégorie</a>
          </div>
          <div className="rubrique-alert"><strong>🛡 Conseil de sécurité</strong><p>Ne communiquez jamais vos codes bancaires. Méfiez-vous des demandes de paiement en dehors des services de confiance.</p></div>
        </aside>
      </div>
    </div>
  </main>;
}
