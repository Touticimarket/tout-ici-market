"use client";

import {useEffect,useMemo,useState} from "react";
import {useParams} from "next/navigation";
import {trouverTypeVehicule} from "../types";

type Champ = {id:string;libelle:string;type?:"text"|"number";placeholder?:string};
type Donnees = Record<string,string>;

function champsDuType(slug:string,motorise:boolean,nature:string):Champ[]{
  const commun:Champ[]=[{id:"marque",libelle:"Marque / fabricant"},{id:"modele",libelle:"Modèle / référence"},{id:"etat",libelle:"État",placeholder:"Neuf, très bon état, occasion..."}];
  if(nature==="service") return [
    {id:"specialite",libelle:"Spécialité mécanique",placeholder:"Auto, moto, utilitaire, vélo..."},
    {id:"prestation",libelle:"Prestations proposées",placeholder:"Diagnostic, entretien, réparation..."},
    {id:"zone",libelle:"Zone d'intervention / déplacement"},
    {id:"experience",libelle:"Expérience / qualifications"}
  ];
  if(nature==="equipement") return [
    ...commun,
    {id:"compatibilite",libelle:"Compatibilité / dimensions"},
    {id:"reference",libelle:"Référence constructeur"},
    {id:"quantite",libelle:"Quantité",type:"number"}
  ];
  const carrosserie:Champ[] = [
    {id:"annee",libelle:"Année",type:"number"},
    ...(motorise?[{id:"kilometrage",libelle:"Kilométrage",type:"number" as const}]:[]),
    {id:"energie",libelle:"Énergie (si applicable)"},
    {id:"boite",libelle:"Boîte de vitesses (si applicable)"}
  ];
  if(["remorque","porte-voiture","remorque-moto","remorque-bateau","semi-remorque"].includes(slug)) return [
    ...commun,{id:"annee",libelle:"Année",type:"number"},{id:"ptac",libelle:"PTAC (kg)",type:"number"},
    {id:"charge",libelle:"Charge utile (kg)",type:"number"},{id:"longueur",libelle:"Longueur utile (m)"},
    {id:"freinee",libelle:"Remorque freinée ?"}
  ];
  if(["caravane","mobil-home","cellule-camping","camping-car","van-amenage","fourgon-amenage","van"].includes(slug)) return [
    ...commun,...carrosserie,{id:"couchages",libelle:"Nombre de couchages",type:"number"},
    {id:"longueur",libelle:"Longueur (m)"},{id:"ptac",libelle:"PTAC (kg)",type:"number"},
    {id:"equipement",libelle:"Équipements de vie (cuisine, douche, chauffage...)"}
  ];
  if(["velo","vtt","velo-route","vae","trottinette"].includes(slug)) return [
    ...commun,{id:"taille",libelle:"Taille de cadre / roues"},
    {id:"matiere",libelle:"Matériau du cadre"},
    {id:"autonomie",libelle:"Autonomie batterie (si électrique)"},
    {id:"kilometrage",libelle:"Kilométrage (facultatif)",type:"number"}
  ];
  if(["camion","poids-lourd","benne","utilitaire","fourgon","camionnette"].includes(slug)) return [
    ...commun,...carrosserie,{id:"ptac",libelle:"PTAC (kg)",type:"number"},
    {id:"charge",libelle:"Charge utile (kg)",type:"number"},
    {id:"volume",libelle:"Volume de chargement (m³)"},
    {id:"longueur",libelle:"Longueur utile (m)"}
  ];
  return [...commun,...carrosserie];
}

export default function DepotTypeVehicule(){
  const params=useParams<{type:string}>();
  const slug=typeof params.type==="string"?params.type:"";
  const type=useMemo(()=>trouverTypeVehicule(slug),[slug]);
  const cle="toutici-brouillon-auto-"+slug;
  const [donnees,setDonnees]=useState<Donnees>({});
  const [photos,setPhotos]=useState<File[]>([]);
  const [previews,setPreviews]=useState<string[]>([]);
  const [message,setMessage]=useState("");
  const [pret,setPret]=useState(false);

  useEffect(()=>{
    setPret(false);
    setDonnees({});
    setPhotos([]);
    setPreviews([]);
    setMessage("");
    if(!type)return;
    try{
      const memo=localStorage.getItem(cle);
      if(memo){
        const objets=JSON.parse(memo);
        if(objets&&typeof objets==="object"&&!Array.isArray(objets))setDonnees(objets as Donnees);
      }
    }catch{
      setMessage("Le brouillon local n'a pas pu être récupéré.");
    }
    setPret(true);
  },[type,cle]);

  const champs=useMemo(()=>type?champsDuType(type.slug,type.motorise,type.nature):[],[type]);

  if(!type)return <main style={{fontFamily:"Arial,sans-serif",padding:"120px 24px",textAlign:"center"}}>
    <h1>Cette catégorie est introuvable.</h1>
    <a href="/deposer/automobile">Retour aux catégories véhicules</a>
  </main>;

  const onChange=(id:string,valeur:string)=>{
    setDonnees(old=>({...old,[id]:valeur}));
    setMessage("");
  };

  const choisirPhotos=(fichiers:FileList|null)=>{
    if(!fichiers)return;
    const selections=[...photos,...Array.from(fichiers)].filter(f=>
      ["image/jpeg","image/png","image/webp"].includes(f.type) && f.size<=10*1024*1024
    ).slice(0,10);
    previews.forEach(url=>URL.revokeObjectURL(url));
    setPhotos(selections);
    setPreviews(selections.map(f=>URL.createObjectURL(f)));
  };

  const sauver=()=>{
    if(!donnees.titre?.trim()||!donnees.description?.trim()||!donnees.ville?.trim()){
      setMessage("Complétez le titre de l'annonce, la description et la ville.");
      return;
    }
    try{
      localStorage.setItem(cle,JSON.stringify({...donnees,type:slug}));
      setMessage("Brouillon enregistré dans ce navigateur. Publication en ligne bientôt disponible pour cette catégorie ; les photos ne sont pas sauvegardées.");
    }catch{
      setMessage("Impossible d'enregistrer le brouillon local.");
    }
  };

  return <main className="auto-typed">
    <style>{`
      .auto-typed{min-height:100vh;background:#f5f8fd;font-family:Arial,sans-serif;color:#10244c}
      .auto-typed *{box-sizing:border-box}
      .typed-container{max-width:1330px;margin:auto;padding:0 20px 70px}
      .typed-nav{min-height:87px;display:flex;justify-content:flex-end;align-items:center;gap:20px;font-size:14px;font-weight:700;flex-wrap:wrap}
      .typed-nav a{color:#0843b5;text-decoration:none}
      .typed-hero{padding:36px 41px;border-radius:22px;color:white;background:linear-gradient(110deg,#0439ae,#0a6cd1)}
      .typed-hero h1{font-size:clamp(28px,3.4vw,43px);margin:13px 0}
      .typed-hero p{font-size:16px;line-height:1.55}
      .typed-layout{display:grid;grid-template-columns:minmax(0,1fr) 285px;gap:19px;margin-top:20px}
      .typed-panel{background:white;border:1px solid #e1e7f2;border-radius:17px;padding:25px;margin-bottom:16px;box-shadow:0 5px 25px #1937640a}
      .typed-panel h2{color:#0642b4;margin:0 0 19px;font-size:21px}
      .typed-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
      .typed-label{font-size:13px;font-weight:700;display:block}
      .typed-label input,.typed-label textarea{font-family:inherit;font-size:14px;background:white;color:#10244c;width:100%;display:block;border:1px solid #cad6e8;border-radius:11px;padding:13px;margin-top:7px}
      .typed-label textarea{height:135px;resize:vertical;line-height:1.5}
      .typed-wide{grid-column:1/-1}
      .typed-photo-drop{border:2px dashed #b5c5e4;background:#f8faff;border-radius:14px;padding:26px;text-align:center}
      .typed-photo-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-top:14px}
      .typed-photo-grid img{width:100%;height:88px;border-radius:9px;object-fit:cover}
      .typed-button{background:#044bd0;color:white;border:0;border-radius:12px;padding:15px 23px;cursor:pointer;font-weight:800;font-size:15px}
      .typed-note{background:#fff8e4;border:1px solid #f2e0af;border-radius:13px;padding:18px;font-size:13px;line-height:1.7}
      @media(max-width:850px){.typed-layout{grid-template-columns:1fr}}
      @media(max-width:580px){.typed-container{padding:0 12px 45px}.typed-nav{min-height:150px;padding-top:83px;justify-content:center}.typed-hero{padding:27px 20px}.typed-panel{padding:18px}.typed-fields{grid-template-columns:1fr}.typed-photo-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
    `}</style>
    <div className="typed-container">
      <nav className="typed-nav" aria-label="Navigation">
        <a href="/">Accueil</a>
        <a href="/deposer">Toutes les catégories</a>
        <a href="/deposer/automobile">Tous les véhicules</a>
      </nav>
      <header className="typed-hero">
        <span style={{color:"#ffdc6e",fontSize:13,fontWeight:800}}>TOUT ICI MARKET · AUTOMOBILE & VÉHICULES</span>
        <h1>{type.icone} Déposer une annonce : {type.nom}</h1>
        <p>{type.description}. Remplissez seulement les informations adaptées à votre catégorie.</p>
      </header>
      <div className="typed-layout">
        <div>
          <section className="typed-panel">
            <h2>1. Votre annonce</h2>
            <div className="typed-fields">
              <label className="typed-label typed-wide">Titre de l'annonce *
                <input maxLength={120} value={donnees.titre||""} onChange={e=>onChange("titre",e.target.value)} placeholder={"Exemple : "+type.nom+" en très bon état"}/>
              </label>
              <label className="typed-label">Prix demandé (€)
                <input type="number" min="0" value={donnees.prix||""} onChange={e=>onChange("prix",e.target.value)} placeholder="0 pour un don"/>
              </label>
              <label className="typed-label">Ville *
                <input value={donnees.ville||""} onChange={e=>onChange("ville",e.target.value)} placeholder="Lieu de l'annonce"/>
              </label>
              <label className="typed-label typed-wide">Description *
                <textarea value={donnees.description||""} onChange={e=>onChange("description",e.target.value)} placeholder="Décrivez l'état, les caractéristiques, l'historique et ce qui est inclus…"/>
              </label>
            </div>
          </section>
          <section className="typed-panel">
            <h2>2. Caractéristiques de votre {type.nature==="service"?"service":type.nature==="equipement"?"équipement":"véhicule"}</h2>
            <div className="typed-fields">
              {champs.map(champ=><label className="typed-label" key={champ.id}>{champ.libelle}
                <input type={champ.type||"text"} min={champ.type==="number"?"0":undefined} value={donnees[champ.id]||""}
                  onChange={e=>onChange(champ.id,e.target.value)} placeholder={champ.placeholder||""}/>
              </label>)}
            </div>
          </section>
          <section className="typed-panel">
            <h2>3. Photos ({photos.length}/10)</h2>
            <div className="typed-photo-drop">
              <strong>Ajoutez les photos de votre {type.nature==="service"?"activité":type.nature==="equipement"?"article":"véhicule"}</strong>
              <p style={{fontSize:12,color:"#66748a"}}>JPG, PNG ou WEBP, 10 Mo maximum par photo.</p>
              <input type="file" multiple accept="image/jpeg,image/png,image/webp"
                onChange={e=>choisirPhotos(e.target.files)} aria-label="Ajouter des photos"/>
            </div>
            <div className="typed-photo-grid">{previews.map((url,index)=><img key={url} src={url} alt={"Photo "+(index+1)}/>)}</div>
            <p style={{color:"#66748a",fontSize:12}}>Les photos sont affichées uniquement dans ce navigateur pour le moment.</p>
          </section>
          <section className="typed-panel">
            <h2>4. Préparer la publication</h2>
            <p style={{fontSize:14,lineHeight:1.6,color:"#67748b"}}>Cette catégorie est en cours d'activation. Vous pouvez enregistrer votre brouillon local, sans publier d'annonce ni envoyer de photos.</p>
            <button type="button" className="typed-button" disabled={!pret} onClick={sauver}>Enregistrer mon brouillon</button>
            {message&&<p role="status" style={{background:"#fff5d9",padding:13,borderRadius:10,fontSize:13,lineHeight:1.6}}>{message}</p>}
          </section>
        </div>
        <aside>
          <div className="typed-panel">
            <div style={{fontSize:43}}>{type.icone}</div>
            <h2 style={{marginTop:10}}>{type.nom}</h2>
            <p style={{color:"#61708a",lineHeight:1.6,fontSize:14}}>{type.description}</p>
            <a href="/deposer/automobile" style={{color:"#0644c8",fontSize:13,fontWeight:700}}>Changer de type de véhicule</a>
          </div>
          <div className="typed-note">
            <strong>🛡 Conseils MIA</strong>
            <p>Décrivez honnêtement les défauts et l'entretien. Pour un véhicule, précisez les éventuelles réparations à prévoir. Évitez les paiements non sécurisés.</p>
          </div>
        </aside>
      </div>
    </div>
  </main>;
}
