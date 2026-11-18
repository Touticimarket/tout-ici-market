"use client";

import {useEffect,useMemo,useState} from "react";
import {useParams} from "next/navigation";
import {ArrowLeft,Printer} from "lucide-react";
import {supabase} from "../../../lib/supabaseClient";
import {depotCategories} from "../../../deposer/categories";

type PrintableAnnonce={
  id:string;categorie:string;sousCategorie:string;titre:string;description:string;
  prix:number|null;ville:string;codePostal:string|null;date:string;
  photos:string[];caracteristiques:Record<string,unknown>;
};

const libelles:Record<string,string>={
  marque:"Marque",modele:"Modèle",version:"Version / finition",finition:"Finition",
  annee:"Année",kilometrage:"Kilométrage",energie:"Énergie",carburant:"Carburant",
  boite:"Boîte de vitesses",cylindree:"Cylindrée",puissance:"Puissance (ch)",
  couleur:"Couleur",equipements:"Équipements et options",etat:"État",ptac:"PTAC",
  capacite:"Capacité",volume:"Volume",charge:"Charge utile",surface:"Surface",
  pieces:"Pièces",chambres:"Chambres",couchages:"Couchages",contrat:"Contrat",
  experience:"Expérience",poste:"Poste",taille:"Taille",permis:"Permis"
};

const isUuid=(s:string)=>/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);
const euros=(n:number|null)=>n===null?"Prix à contacter":new Intl.NumberFormat("fr-FR",{
  style:"currency",currency:"EUR",maximumFractionDigits:0
}).format(n);
const formatValeur=(v:unknown):string=>{
  if(typeof v==="boolean")return v?"Oui":"Non";
  if(Array.isArray(v))return v.map(formatValeur).join(" · ");
  if(v&&typeof v==="object")return Object.entries(v as Record<string,unknown>)
    .map(([k,x])=>k+": "+formatValeur(x)).join(" · ");
  return String(v??"");
};
const dateFR=(s:string)=>{
  const d=new Date(s);
  return Number.isNaN(d.getTime())?"":d.toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"});
};

export default function ImprimerAnnonce(){
  const params=useParams<{id:string}>();
  const id=typeof params.id==="string"?params.id:"";
  const [annonce,setAnnonce]=useState<PrintableAnnonce|null>(null);
  const [chargement,setChargement]=useState(true);
  const [erreur,setErreur]=useState("");
  const [adresse,setAdresse]=useState("");

  useEffect(()=>{
    let actif=true;
    if(typeof window!=="undefined")setAdresse(window.location.origin+"/annonces/"+id);
    async function charger(){
      const legacy=id.startsWith("auto-");
      const identifiant=legacy?id.slice(5):id;
      if(!isUuid(identifiant)){setErreur("Cette annonce est introuvable.");setChargement(false);return;}
      try{
        if(legacy){
          const {data,error}=await supabase.from("annonces_auto")
            .select("id,marque,modele,finition,annee,kilometrage,carburant,boite,prix,ville,description,created_at,type_vehicule")
            .eq("id",identifiant).eq("statut","publiee").maybeSingle();
          if(!actif)return;
          if(error||!data)throw new Error("Cette annonce n'est plus disponible.");
          const {data:medias}=await supabase.from("annonces_auto_photos")
            .select("url,ordre").eq("annonce_id",identifiant).order("ordre");
          if(!actif)return;
          setAnnonce({
            id:identifiant,categorie:"automobile",sousCategorie:String(data.type_vehicule||"voiture"),
            titre:[data.marque,data.modele,data.finition].filter(Boolean).join(" ")||"Véhicule",
            description:String(data.description||""),prix:data.prix===null?null:Number(data.prix),
            ville:String(data.ville||""),codePostal:null,date:String(data.created_at),
            photos:(medias||[]).map(p=>String(p.url)),
            caracteristiques:{
              marque:data.marque,modele:data.modele,finition:data.finition,annee:data.annee,
              kilometrage:data.kilometrage,carburant:data.carburant,boite:data.boite
            }
          });
        }else{
          const {data,error}=await supabase.from("annonces_marketplace")
            .select("id,categorie,sous_categorie,titre,description,prix,ville,code_postal,caracteristiques,photos,created_at")
            .eq("id",identifiant).eq("statut","publiee").maybeSingle();
          if(!actif)return;
          if(error||!data)throw new Error("Cette annonce n'est plus disponible.");
          setAnnonce({
            id:String(data.id),categorie:String(data.categorie),sousCategorie:String(data.sous_categorie||""),
            titre:String(data.titre),description:String(data.description||""),
            prix:data.prix===null?null:Number(data.prix),ville:String(data.ville),
            codePostal:data.code_postal?String(data.code_postal):null,date:String(data.created_at),
            photos:Array.isArray(data.photos)?data.photos.map(String):[],
            caracteristiques:(data.caracteristiques||{}) as Record<string,unknown>
          });
        }
      }catch(e){if(actif)setErreur(e instanceof Error?e.message:"Cette annonce n'est plus disponible.");}
      finally{if(actif)setChargement(false);}
    }
    setChargement(true);setErreur("");setAnnonce(null);
    void charger();
    return ()=>{actif=false;};
  },[id]);

  const categorie=depotCategories.find(c=>c.slug===annonce?.categorie)?.nom||annonce?.categorie||"Annonce";
  const details=useMemo(()=>annonce?Object.entries(annonce.caracteristiques).filter(([k,v])=>
    !k.startsWith("ref_")&&v!==null&&v!==undefined&&v!==""&&
    (!Array.isArray(v)||v.length>0)
  ):[],[annonce]);

  return <main className="ti-print-root">
    <style>{`
      .ti-print-root{min-height:100vh;background:#edf2f8;color:#142c50;font-family:Arial,Helvetica,sans-serif;padding:105px 15px 45px}
      .ti-print-root *{box-sizing:border-box}
      .ti-print-actions{max-width:870px;margin:0 auto 15px;display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap}
      .ti-print-actions a{display:inline-flex;align-items:center;gap:7px;color:#0648b6;text-decoration:none;font-weight:800;font-size:13px}
      .ti-print-actions button{display:inline-flex;align-items:center;gap:9px;background:#ffcf29;color:#103060;border:0;border-radius:11px;padding:12px 16px;font-size:14px;font-weight:850;cursor:pointer}
      .ti-print-actions button:disabled{opacity:.6;cursor:not-allowed}
      .ti-print-paper{max-width:870px;margin:auto;background:white;padding:34px 39px 28px;border:1px solid #dce5f1;box-shadow:0 15px 50px #0c295b12}
      .ti-print-head{display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:3px solid #ffcf29;padding-bottom:15px}
      .ti-print-head img{width:177px;max-height:66px;object-fit:contain;object-position:left}
      .ti-print-head small{color:#5b718f;font-weight:750;font-size:11px}
      .ti-print-tag{margin:23px 0 4px;color:#20539e;font-size:12px;font-weight:800}
      .ti-print-title{font-size:30px;line-height:1.22;margin:7px 0 11px;color:#0d2b5a}
      .ti-print-meta{display:flex;justify-content:space-between;gap:12px;align-items:end;flex-wrap:wrap}
      .ti-print-meta p{margin:2px 0;color:#566c87;font-size:12px;line-height:1.7}
      .ti-print-price{font-size:28px;font-weight:900;color:#0747af;white-space:nowrap}
      .ti-print-cover{margin:23px 0 10px;height:290px;background:#f3f6fa;border-radius:10px;overflow:hidden;display:flex;align-items:center;justify-content:center;color:#8294ab}
      .ti-print-cover img{width:100%;height:100%;object-fit:contain}
      .ti-print-photos{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin:10px 0 25px}
      .ti-print-photos img{width:100%;height:115px;object-fit:cover;border-radius:7px}
      .ti-print-section{margin:25px 0 0}
      .ti-print-section h2{font-size:17px;color:#0c316c;border-bottom:1px solid #dce6f3;padding-bottom:8px;margin:0 0 13px}
      .ti-print-text{font-size:13px;line-height:1.65;white-space:pre-wrap;overflow-wrap:anywhere}
      .ti-print-specs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:25px}
      .ti-print-spec{padding:9px 0;border-bottom:1px solid #e7edf5;display:flex;justify-content:space-between;align-items:start;gap:10px;font-size:12px;break-inside:avoid}
      .ti-print-spec span{color:#67788f}
      .ti-print-spec strong{color:#1b3558;text-align:right;overflow-wrap:anywhere}
      .ti-print-footer{border-top:1px solid #dce6f3;padding-top:15px;margin-top:28px;color:#677a93;font-size:11px;line-height:1.5;overflow-wrap:anywhere}
      .ti-print-message{max-width:870px;margin:0 auto;background:#fff;padding:35px;border-radius:12px;text-align:center}
      @page{size:A4;margin:13mm}
      @media print{
        html,body{background:#fff!important;margin:0!important;padding:0!important}
        body > header,.ti-brand-link,.ti-print-actions{display:none!important}
        .ti-print-root{background:#fff!important;min-height:0;padding:0;margin:0;color:#000;-webkit-print-color-adjust:exact;print-color-adjust:exact}
        .ti-print-paper{max-width:none;border:0;box-shadow:none;padding:0;margin:0}
        .ti-print-title{font-size:24px}
        .ti-print-price{font-size:23px}
        .ti-print-head img{max-width:150px;max-height:52px}
        .ti-print-cover{height:190px;margin:15px 0 7px}
        .ti-print-photos{margin:7px 0 13px}
        .ti-print-photos img{height:80px}
        .ti-print-section{margin-top:17px}
        .ti-print-section h2{font-size:15px;margin-bottom:8px}
        .ti-print-text{font-size:11px;line-height:1.5}
        .ti-print-spec{font-size:10px;padding:6px 0}
        .ti-print-footer{margin-top:20px}
        .ti-print-head,.ti-print-meta,.ti-print-cover,.ti-print-spec{break-inside:avoid}
        a[href]:after{content:none!important}
      }
      @media(max-width:600px){
        .ti-print-root{padding:100px 8px 35px}
        .ti-print-paper{padding:20px 15px}
        .ti-print-title{font-size:23px}
        .ti-print-cover{height:215px}
        .ti-print-specs{grid-template-columns:1fr}
        .ti-print-photos{grid-template-columns:repeat(2,minmax(0,1fr))}
        .ti-print-head img{width:140px}
      }
    `}</style>
    <div className="ti-print-actions">
      <a href={"/annonces/"+id}><ArrowLeft size={16}/> Revenir à l'annonce</a>
      <button type="button" onClick={()=>window.print()} disabled={chargement||!annonce}>
        <Printer size={18}/> Imprimer / Enregistrer en PDF
      </button>
    </div>
    {chargement?<div className="ti-print-message">Chargement de la fiche imprimable…</div>:
      !annonce?<div className="ti-print-message" role="alert">{erreur||"Annonce indisponible."}</div>:
      <article className="ti-print-paper">
        <header className="ti-print-head">
          <img src="/toutici market.png" alt="TOUT ICI MARKET"/>
          <small>Fiche de petite annonce</small>
        </header>
        <p className="ti-print-tag">{categorie}{annonce.sousCategorie?" · "+annonce.sousCategorie:""}</p>
        <h1 className="ti-print-title">{annonce.titre}</h1>
        <div className="ti-print-meta">
          <div><p>{annonce.ville}{annonce.codePostal?" · "+annonce.codePostal:""}</p>
            <p>Publiée le {dateFR(annonce.date)}</p></div>
          <div className="ti-print-price">{euros(annonce.prix)}</div>
        </div>
        <div className="ti-print-cover">
          {annonce.photos[0]?<img src={annonce.photos[0]} alt={"Photo principale : "+annonce.titre}/>:<span>Annonce sans photo</span>}
        </div>
        {annonce.photos.length>1&&<div className="ti-print-photos">
          {annonce.photos.slice(1,7).map((url,index)=><img key={index} src={url} alt={"Photo complémentaire "+(index+2)}/>)}
        </div>}
        <section className="ti-print-section">
          <h2>Description</h2>
          <div className="ti-print-text">{annonce.description||"Description non renseignée."}</div>
        </section>
        {details.length>0&&<section className="ti-print-section">
          <h2>Caractéristiques et équipements</h2>
          <div className="ti-print-specs">
            {details.map(([cle,valeur])=><div className="ti-print-spec" key={cle}>
              <span>{libelles[cle]||cle.replaceAll("_"," ")}</span>
              <strong>{formatValeur(valeur)}</strong>
            </div>)}
          </div>
        </section>}
        <footer className="ti-print-footer">
          <div>Annonce n° {annonce.id} · TOUT ICI MARKET</div>
          <div>{adresse}</div>
          <p>Les informations et photographies sont communiquées par le vendeur. Cette impression ne constitue pas une garantie de disponibilité ni un certificat d'historique.</p>
        </footer>
      </article>}
  </main>;
}
