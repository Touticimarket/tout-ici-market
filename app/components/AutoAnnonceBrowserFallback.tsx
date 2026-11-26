"use client";
import {useEffect,useState} from "react";
import {supabase} from "../lib/supabaseClient";
import PremiumAutoAnnonce from "./PremiumAutoAnnonce";
import {TrackAutoView} from "./FavoriteAnnonceButton";

type AutoAd={
 id:string;user_id:string|null;titre:string|null;marque:string|null;modele:string|null;finition:string|null;
 prix:number|null;annee:number|null;kilometrage:number|null;carburant:string|null;boite:string|null;
 ville:string|null;departement:string|null;description:string|null;photos:string[]|null;
 code_postal:string|null;puissance_ch:number|null;type_vehicule:string|null;couleur:string|null;
 carrosserie:string|null;options:string[]|null;video_url:string|null
};
function titleOf(a:AutoAd){return a.titre?.trim()||[a.marque,a.modele,a.finition].filter(Boolean).join(" ")||"Annonce véhicule";}
export default function AutoAnnonceBrowserFallback({id}:{id:string}){
 const [ad,setAd]=useState<AutoAd|null>(null);
 const [message,setMessage]=useState("Chargement de votre annonce…");
 useEffect(()=>{
  let active=true;
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)){setMessage("Identifiant d'annonce incorrect.");return}
  void supabase.from("annonces_auto")
   .select("id,user_id,titre,marque,modele,finition,prix,annee,kilometrage,carburant,boite,ville,departement,description,photos,code_postal,puissance_ch,type_vehicule,couleur,carrosserie,options,video_url")
   .eq("id",id).eq("statut","publiee").maybeSingle()
   .then(({data,error})=>{
    if(!active)return;
    if(error){setMessage("Impossible de charger cette annonce : "+error.message);return}
    if(!data){setMessage("Cette annonce n'est pas disponible publiquement. Vérifiez sa publication.");return}
    setAd(data as AutoAd);
   });
  return()=>{active=false};
 },[id]);
 if(!ad)return <main style={{background:"#f3f7fd",padding:"65px 22px",minHeight:"55vh",fontFamily:"Arial,sans-serif",color:"#0b2147",textAlign:"center"}}>
  <h1>Annonce automobile</h1><p role="status">{message}</p>
  <a href="/automobile" style={{color:"#0d55ad",fontWeight:800}}>← Retour aux véhicules</a>
 </main>;
 const raw:[string,string|null][]=[
  ["Marque",ad.marque],["Modèle",ad.modele],["Finition",ad.finition],
  ["Année",ad.annee==null?null:String(ad.annee)],
  ["Kilométrage",ad.kilometrage==null?null:ad.kilometrage.toLocaleString("fr-FR")+" km"],
  ["Énergie",ad.carburant],["Boîte de vitesses",ad.boite],
  ["Puissance",ad.puissance_ch==null?null:ad.puissance_ch+" ch"],
  ["Couleur",ad.couleur],["Carrosserie",ad.carrosserie],["Catégorie",ad.type_vehicule]
 ];
 const details=raw.filter((x):x is [string,string]=>typeof x[1]==="string"&&x[1].trim().length>0);
 return <><TrackAutoView annonceId={ad.id}/><PremiumAutoAnnonce
  id={ad.id} ownerId={ad.user_id||""} title={titleOf(ad)}
  price={ad.prix} location={[ad.ville,ad.code_postal,ad.departement].filter(Boolean).join(" · ")}
  photos={Array.isArray(ad.photos)?ad.photos:[]} description={ad.description}
  details={details} options={Array.isArray(ad.options)?ad.options:[]}
  videoUrl={ad.video_url||null}
 /></>;
}
