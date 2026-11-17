"use client";

import {useEffect,useState} from "react";
import {useParams} from "next/navigation";
import {ArrowLeft,CalendarDays,MapPin,ShieldCheck,Tag,Plus} from "lucide-react";
import {supabase} from "../../lib/supabaseClient";
import {depotCategories} from "../../deposer/categories";
import LiensHistoriqueVehicule from "../../components/LiensHistoriqueVehicule";

type AnnonceDetail={
  id:string;categorie:string;sous_categorie:string;titre:string;description:string;
  prix:number|null;ville:string;code_postal:string|null;caracteristiques:Record<string,unknown>;
  photos:string[];created_at:string;
};
const prixFmt=(p:number|null)=>p==null?"Prix à contacter":new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(p);
const noms:Record<string,string>={
  marque:"Marque",modele:"Modèle",version:"Version",annee:"Année",kilometrage:"Kilométrage",
  energie:"Énergie",carburant:"Carburant",boite:"Boîte de vitesses",cylindree:"Cylindrée",
  puissance:"Puissance (ch)",couchages:"Couchages",surface:"Surface (m²)",pieces:"Pièces",
  chambres:"Chambres",etat:"État",couleur:"Couleur",contrat:"Contrat",poste:"Poste",
  experience:"Expérience",permis:"Permis",ptac:"PTAC",charge:"Charge utile",volume:"Volume",
  equipements:"Équipements",capacite:"Capacité",taille:"Taille",specialite:"Spécialité"
};

export default function FicheAnnonce(){
  const params=useParams<{id:string}>();
  const id=typeof params.id==="string"?params.id:"";
  const [annonce,setAnnonce]=useState<AnnonceDetail|null>(null);
  const [chargement,setChargement]=useState(true);
  const [erreur,setErreur]=useState("");
  const [principale,setPrincipale]=useState(0);

  useEffect(()=>{
    let actif=true;
    async function charger(){
      if(!id || !/^(auto-)?[0-9a-f-]{36}$/i.test(id)){
        setErreur("Cette annonce n'existe pas.");setChargement(false);return;
      }
      if(id.startsWith("auto-")){
        const annonceId=id.slice(5);
        const {data,error}=await supabase.from("annonces_auto")
          .select("id,marque,modele,finition,annee,kilometrage,carburant,boite,prix,ville,description,created_at,type_vehicule")
          .eq("id",annonceId).eq("statut","publiee").maybeSingle();
        if(!actif)return;
        if(error||!data){setErreur("Cette annonce n'est plus disponible.");setChargement(false);return;}
        const {data:medias}=await supabase.from("annonces_auto_photos")
          .select("url,ordre").eq("annonce_id",annonceId).order("ordre");
        if(!actif)return;
        setAnnonce({
          id:annonceId,categorie:"automobile",sous_categorie:String(data.type_vehicule||"voiture"),
          titre:[data.marque,data.modele,data.finition].filter(Boolean).join(" ")||"Automobile",
          description:String(data.description||""),prix:data.prix==null?null:Number(data.prix),
          ville:String(data.ville||""),code_postal:null,
          caracteristiques:{marque:data.marque,modele:data.modele,version:data.finition,annee:data.annee,kilometrage:data.kilometrage,energie:data.carburant,boite:data.boite},
          photos:(medias||[]).map(p=>String(p.url)),created_at:String(data.created_at)
        });
      }else{
        const {data,error}=await supabase.from("annonces_marketplace")
          .select("id,categorie,sous_categorie,titre,description,prix,ville,code_postal,caracteristiques,photos,created_at")
          .eq("id",id).eq("statut","publiee").maybeSingle();
        if(!actif)return;
        if(error||!data){setErreur("Cette annonce n'est plus disponible.");setChargement(false);return;}
        setAnnonce({
          id:String(data.id),categorie:String(data.categorie),sous_categorie:String(data.sous_categorie),
          titre:String(data.titre),description:String(data.description),prix:data.prix==null?null:Number(data.prix),
          ville:String(data.ville),code_postal:data.code_postal?String(data.code_postal):null,
          caracteristiques:(data.caracteristiques||{}) as Record<string,unknown>,
          photos:Array.isArray(data.photos)?data.photos.map(String):[],
          created_at:String(data.created_at)
        });
      }
      setChargement(false);
    }
    setAnnonce(null);setErreur("");setChargement(true);setPrincipale(0);
    charger();
    return ()=>{actif=false};
  },[id]);

  const rubrique=depotCategories.find(c=>c.slug===annonce?.categorie);
  const details=annonce?Object.entries(annonce.caracteristiques||{}).filter(([k,v])=>{
    return !k.startsWith("ref_") && v!==null&&v!==""&&v!==undefined&&
      (typeof v==="string"||typeof v==="number"||typeof v==="boolean"||Array.isArray(v));
  }):[];

  return <main className="annonce-fiche">
    <style>{`
      .annonce-fiche{font-family:Arial,sans-serif;min-height:100vh;background:#f5f8fd;color:#092654}
      .annonce-fiche *{box-sizing:border-box}
      .fiche-wrap{max-width:1210px;margin:auto;padding:107px 19px 70px}
      .fiche-back{color:#0649b9;text-decoration:none;display:inline-flex;align-items:center;gap:8px;font-weight:800;font-size:13px;margin-bottom:19px}
      .fiche-layout{display:grid;grid-template-columns:minmax(0,1.8fr) minmax(260px,.82fr);gap:18px;align-items:start}
      .fiche-panel{background:#fff;border:1px solid #e2e9f5;border-radius:18px;padding:22px;margin-bottom:16px;box-shadow:0 7px 25px #14335c0a}
      .fiche-panel h1{font-size:clamp(25px,3.2vw,39px);margin:12px 0;color:#0b2555}
      .fiche-sub{color:#697890;font-size:13px;margin-top:8px;display:flex;gap:15px;align-items:center;flex-wrap:wrap}
      .fiche-main-photo{height:380px;background:#eef4fc;border-radius:14px;display:grid;place-items:center;font-size:74px;overflow:hidden}
      .fiche-main-photo img{width:100%;height:100%;object-fit:contain;background:#f0f5fd}
      .fiche-gallery{display:flex;gap:9px;margin-top:10px;overflow-x:auto}
      .fiche-gallery button{flex:0 0 90px;height:68px;border-radius:9px;border:2px solid transparent;overflow:hidden;padding:0;cursor:pointer}
      .fiche-gallery button.selected{border-color:#ffcf26}
      .fiche-gallery img{width:100%;height:100%;object-fit:cover}
      .fiche-price{font-size:32px;color:#0644b4;font-weight:900;margin-bottom:14px}
      .fiche-cta{background:#ffcf29;color:#0b2859;text-align:center;display:block;border-radius:12px;padding:14px;text-decoration:none;font-weight:800}
      .fiche-label{color:#597393;font-weight:800;font-size:12px}
      .fiche-specs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
      .fiche-spec{background:#f6f9fe;border-radius:11px;padding:12px}
      .fiche-spec span{display:block;font-size:12px;color:#63758b}
      .fiche-spec strong{display:block;font-size:14px;margin-top:6px;word-break:break-word}
      .fiche-description{white-space:pre-wrap;line-height:1.7;color:#344b70;font-size:14px}
      @media(max-width:820px){.fiche-layout{grid-template-columns:1fr}.fiche-wrap{padding:105px 12px 55px}.fiche-main-photo{height:290px}}
    `}</style>
    <div className="fiche-wrap">
      <a href={"/annonces"+(annonce?"?categorie="+encodeURIComponent(annonce.categorie):"")} className="fiche-back"><ArrowLeft size={17}/> Retour aux annonces</a>
      {chargement?<div className="fiche-panel">Chargement de l'annonce…</div>:
      erreur||!annonce?<section className="fiche-panel"><h1>Annonce introuvable</h1><p>{erreur||"Cette annonce n'existe pas."}</p><a href="/annonces">Rechercher d'autres annonces</a></section>:
      <div className="fiche-layout">
        <div>
          <article className="fiche-panel">
            <span className="fiche-label">{rubrique?.icone||"📦"} {rubrique?.nom||"Automobile & Véhicules"} · {annonce.sous_categorie}</span>
            <h1>{annonce.titre}</h1>
            <div className="fiche-sub">
              <span><MapPin size={14} style={{verticalAlign:"middle"}}/> {annonce.ville}{annonce.code_postal?" · "+annonce.code_postal:""}</span>
              <span><CalendarDays size={14} style={{verticalAlign:"middle"}}/> Publié le {new Date(annonce.created_at).toLocaleDateString("fr-FR")}</span>
            </div>
            <div style={{marginTop:20}} className="fiche-main-photo">
              {annonce.photos.length?<img src={annonce.photos[principale]||annonce.photos[0]} alt={annonce.titre}/>:<span>📷</span>}
            </div>
            {annonce.photos.length>1&&<div className="fiche-gallery">{annonce.photos.map((url,i)=>
              <button type="button" key={url} onClick={()=>setPrincipale(i)} className={principale===i?"selected":""} aria-label={"Voir photo "+(i+1)}>
                <img src={url} alt={"Vue "+(i+1)}/>
              </button>)}</div>}
          </article>
          <section className="fiche-panel"><h2>Description</h2><div className="fiche-description">{annonce.description||"Aucune description."}</div></section>
          {details.length>0&&<section className="fiche-panel"><h2>Caractéristiques</h2>
            <div className="fiche-specs">{details.map(([cle,valeur])=><div className="fiche-spec" key={cle}>
              <span>{noms[cle]||cle.replaceAll("_"," ")}</span>
              <strong>{Array.isArray(valeur)?valeur.join(" · "):typeof valeur==="boolean"?(valeur?"Oui":"Non"):String(valeur)}</strong>
            </div>)}</div>
          </section>}
          {annonce.categorie==="automobile"&&<LiensHistoriqueVehicule />}
        </div>
        <aside>
          <div className="fiche-panel">
            <div className="fiche-price">{prixFmt(annonce.prix)}</div>
            <p style={{fontSize:14,color:"#68798e"}}><ShieldCheck size={18} style={{verticalAlign:"middle",marginRight:5}}/> Annonce publiée sur TOUT ICI MARKET.</p>
            <p style={{fontSize:13,color:"#62738b",lineHeight:1.6}}>Pour votre sécurité, évitez de communiquer des codes bancaires ou de payer en dehors d'un moyen sécurisé.</p>
            <a href="/compte/inscription" className="fiche-cta">Créer un compte sur TOUT ICI MARKET</a>
            <p style={{fontSize:12,color:"#74859a",lineHeight:1.5}}>La messagerie entre acheteurs et vendeurs sera ajoutée prochainement.</p>
          </div>
          <div className="fiche-panel"><strong>Vous souhaitez vendre ?</strong>
            <p style={{color:"#60728a",fontSize:13}}>Déposez gratuitement votre propre petite annonce.</p>
            <a href="/deposer" className="fiche-cta"><Plus size={17} style={{verticalAlign:"middle"}}/> Déposer une annonce</a>
          </div>
        </aside>
      </div>}
    </div>
  </main>;
}
