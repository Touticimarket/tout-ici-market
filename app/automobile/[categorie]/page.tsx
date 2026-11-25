"use client";
import {useEffect,useMemo,useRef,useState} from "react";
import SaveSearchButton from "../../components/SaveSearchButton";
import FavoriteAnnonceButton,{recordAutoEvent} from "../../components/FavoriteAnnonceButton";
import BrandAutocomplete from "../../components/BrandAutocomplete";
import {useParams} from "next/navigation";
import {supabase} from "../../lib/supabaseClient";
import ShareLinks from "../../components/ShareLinks";
type Option={id:string;nom:string};
type Annonce={id:string;marque:string|null;modele:string|null;finition:string|null;prix:number|null;annee:number|null;kilometrage:number|null;ville:string|null;carburant:string|null;boite:string|null;puissance_ch:number|null;departement:string|null;options:string[]|null;description:string|null;photos?:string[]|null;code_postal?:string|null;couleur?:string|null;nombre_portes?:number|null;nombre_places?:number|null;carrosserie?:string|null};
const categories:Record<string,{title:string;icon:string;dbTypes:string[]}>={
"voitures":{title:"Automobiles",icon:"🚘",dbTypes:["voiture","voitures","automobile"]},
"utilitaires":{title:"Utilitaires",icon:"🚐",dbTypes:["utilitaire","utilitaires"]},
"camions":{title:"Camions",icon:"🚚",dbTypes:["camion","camions","poids-lourd"]},
"caravaning":{title:"Caravaning",icon:"🚍",dbTypes:["caravaning","camping-car","camping-cars","caravane"]},
"camping-cars":{title:"Caravaning",icon:"🚍",dbTypes:["caravaning","camping-car","camping-cars","caravane"]},
"remorques":{title:"Remorques",icon:"🛻",dbTypes:["remorque","remorques"]},
"motos":{title:"Motos & Scooters",icon:"🏍️",dbTypes:["moto","motos","scooter","scooters","quad"]},
"velos":{title:"Vélos",icon:"🚲",dbTypes:["velo","velos","vélo","vélos","vae"]},
"nautisme":{title:"Nautisme",icon:"⛵",dbTypes:["nautisme","bateau","bateaux","jet-ski","voilier"]},
"vans-amenages":{title:"Vans & Aménagés",icon:"🚐",dbTypes:["van","van-amenage","vans-amenages","fourgon-amenage"]},
"autres-vehicules":{title:"Autres véhicules",icon:"🚜",dbTypes:["autres-vehicules","tracteur","tracteurs","engin"]},
"equipement-auto":{title:"Équipement auto",icon:"⚙️",dbTypes:["equipement-auto"]},
"equipement-caravaning":{title:"Équipement caravaning",icon:"🚍",dbTypes:["equipement-caravaning"]},
"equipement-nautisme":{title:"Équipement nautisme",icon:"⛵",dbTypes:["equipement-nautisme"]},
"equipement-velos":{title:"Équipements vélos",icon:"🚲",dbTypes:["equipement-velos"]},
"services-mecaniques":{title:"Services de réparation mécanique",icon:"🛠️",dbTypes:["services-mecaniques"]},
"pneus-jantes":{title:"Pneus & Jantes",icon:"⚙️",dbTypes:["pneus-jantes"]},
"pieces-accessoires":{title:"Pièces & Accessoires",icon:"🔧",dbTypes:["pieces-accessoires"]},
"entretien-consommables":{title:"Entretien & Consommables",icon:"🧰",dbTypes:["entretien-consommables"]},
"autres-equipements":{title:"Autres équipements & services",icon:"⚙️",dbTypes:["autres-equipements"]}
};
export default function CategorieVehicules(){
const params=useParams();const slug=typeof params.categorie==="string"?params.categorie:"";
const category=categories[slug];
const [marques,setMarques]=useState<Option[]>([]);
const [modeles,setModeles]=useState<Option[]>([]);
const [finitions,setFinitions]=useState<Option[]>([]);
const [annonces,setAnnonces]=useState<Annonce[]>([]);
const [marqueId,setMarqueId]=useState("");const [modeleId,setModeleId]=useState("");
const [finitionId,setFinitionId]=useState("");
const [prixMin,setPrixMin]=useState("");const [prixMax,setPrixMax]=useState("");
const [anneeMin,setAnneeMin]=useState("");const [anneeMax,setAnneeMax]=useState("");
const [kmMin,setKmMin]=useState("");const [kmMax,setKmMax]=useState("");const [carburant,setCarburant]=useState("");
const [puissanceMin,setPuissanceMin]=useState("");const [puissanceMax,setPuissanceMax]=useState("");
const [departement,setDepartement]=useState("");const [motCle,setMotCle]=useState("");
const [equipements,setEquipements]=useState<string[]>([]);
const [couleur,setCouleur]=useState("");const [portes,setPortes]=useState("");const [places,setPlaces]=useState("");const [carrosserie,setCarrosserie]=useState("");
const carrosseries=["Citadine","Berline","Break","SUV","Crossover","Coupé","Cabriolet","Monospace","4x4","Pick-up","Autre"];
const couleurs=["Blanc","Noir","Gris","Argent","Bleu","Rouge","Vert","Jaune","Orange","Marron","Beige","Autre"];
const listeEquipements=["GPS","Apple CarPlay","Android Auto","Caméra recul","Caméra 360","Radar arrière","Sièges chauffants","Toit panoramique","Régulateur adaptatif","Attelage","Feux LED","Jantes alu"];
const toggleEquipement=(item:string)=>setEquipements(old=>old.includes(item)?old.filter(x=>x!==item):[...old,item]);
const [boite,setBoite]=useState("");const [ville,setVille]=useState("");const [tri,setTri]=useState("recent");
const reset=()=>{setMarqueId("");setModeleId("");setFinitionId("");setPrixMin("");setPrixMax("");setAnneeMin("");setAnneeMax("");setKmMin("");setKmMax("");setCarburant("");setBoite("");setVille("");setTri("recent");setPuissanceMin("");setPuissanceMax("");setDepartement("");setMotCle("");setEquipements([]);setCouleur("");setPortes("");setPlaces("");setCarrosserie("")};
const [loading,setLoading]=useState(true);const [error,setError]=useState("");
const restoreModelId=useRef("");const restoreFinitionId=useRef("");
const [exactCount,setExactCount]=useState<number|null>(null);
const [countLoading,setCountLoading]=useState(true);
useEffect(()=>{
 const search=new URLSearchParams(window.location.search).get("f");if(!search)return;
 try{
 const x=JSON.parse(search) as Record<string,unknown>;
 const read=(key:string)=>typeof x[key]==="string"?String(x[key]):"";
 restoreModelId.current=read("modeleId");restoreFinitionId.current=read("finitionId");
 setMarqueId(read("marqueId"));setPrixMin(read("prixMin"));setPrixMax(read("prixMax"));
 setAnneeMin(read("anneeMin"));setAnneeMax(read("anneeMax"));setKmMin(read("kmMin"));setKmMax(read("kmMax"));
 setCarburant(read("carburant"));setBoite(read("boite"));setVille(read("ville"));setDepartement(read("departement"));
 setPuissanceMin(read("puissanceMin"));setPuissanceMax(read("puissanceMax"));setMotCle(read("motCle"));
 setCouleur(read("couleur"));setPortes(read("portes"));setPlaces(read("places"));setCarrosserie(read("carrosserie"));
 if(Array.isArray(x.equipements))setEquipements(x.equipements.filter((e):e is string=>typeof e==="string"));
 }catch{setError("Les critères de la recherche enregistrée sont invalides.");}
},[]);

useEffect(()=>{if(!category){setLoading(false);return;}let mounted=true;
async function load(){setLoading(true);const [m,a]=await Promise.all([
supabase.from("marques_auto").select("id,nom").order("nom").limit(1000),
supabase.from("annonces_auto").select("id,marque,modele,finition,prix,annee,kilometrage,ville,carburant,boite,puissance_ch,departement,options,description,couleur,nombre_portes,nombre_places,carrosserie,photos,code_postal").eq("statut","publiee").in("type_vehicule",category.dbTypes).order("created_at",{ascending:false}).limit(200)
]);if(!mounted)return;
if(m.error||a.error)setError("Impossible de récupérer toutes les données. Vérifiez la connexion et les autorisations de lecture Supabase.");
setMarques(m.data??[]);setAnnonces(a.data??[]);setLoading(false);}
void load();return()=>{mounted=false;};},[slug]);
useEffect(()=>{let mounted=true;setModeles([]);setModeleId("");setFinitions([]);setFinitionId("");if(!marqueId)return;
async function loadModels(){const {data,error}=await supabase.from("modeles_auto").select("id,nom").eq("marque_id",marqueId).order("nom").limit(1000);
if(!mounted)return;if(error)setError("Impossible de charger les modèles.");else {setModeles(data??[]);if(restoreModelId.current){setModeleId(restoreModelId.current);restoreModelId.current="";}}}
void loadModels();return()=>{mounted=false;};},[marqueId]);
useEffect(()=>{let mounted=true;setFinitions([]);setFinitionId("");if(!modeleId)return;
async function loadFinitions(){const {data,error}=await supabase.from("finitions_auto").select("id,nom").eq("modele_id",modeleId).order("nom").limit(1000);if(!mounted)return;if(error)setError("Impossible de charger les finitions.");else {setFinitions(data??[]);if(restoreFinitionId.current){setFinitionId(restoreFinitionId.current);restoreFinitionId.current="";}}}
void loadFinitions();return()=>{mounted=false;};},[modeleId]);
const finition=finitions.find(x=>x.id===finitionId)?.nom.toLocaleLowerCase("fr")??"";
const marque=marques.find(x=>x.id===marqueId)?.nom.toLocaleLowerCase("fr")??"";
const modele=modeles.find(x=>x.id===modeleId)?.nom.toLocaleLowerCase("fr")??"";
const criteres=useMemo(()=>({marqueId,modeleId,finitionId,prixMin,prixMax,anneeMin,anneeMax,kmMin,kmMax,puissanceMin,puissanceMax,carburant,boite,ville,departement,motCle,equipements,couleur,portes,places,carrosserie}),[marqueId,modeleId,finitionId,prixMin,prixMax,anneeMin,anneeMax,kmMin,kmMax,puissanceMin,puissanceMax,carburant,boite,ville,departement,motCle,equipements,couleur,portes,places,carrosserie]);
const filtered=useMemo(()=>annonces.filter(a=>
(!marque||a.marque?.toLocaleLowerCase("fr")===marque)&&
(!modele||a.modele?.toLocaleLowerCase("fr")===modele)&&
(!finition||a.finition?.toLocaleLowerCase("fr")===finition)&&
(!prixMin||(a.prix!==null&&a.prix>=Number(prixMin)))&&
(!prixMax||(a.prix!==null&&a.prix<=Number(prixMax)))&&
(!anneeMin||(a.annee!==null&&a.annee>=Number(anneeMin)))&&
(!anneeMax||(a.annee!==null&&a.annee<=Number(anneeMax)))&&
(!kmMin||(a.kilometrage!==null&&a.kilometrage>=Number(kmMin)))&&
(!kmMax||(a.kilometrage!==null&&a.kilometrage<=Number(kmMax)))&&
(!puissanceMin||(a.puissance_ch!==null&&a.puissance_ch>=Number(puissanceMin)))&&
(!puissanceMax||(a.puissance_ch!==null&&a.puissance_ch<=Number(puissanceMax)))&&
(!departement||a.departement?.toLocaleLowerCase("fr").includes(departement.toLocaleLowerCase("fr")))&&
(!motCle||[a.marque,a.modele,a.finition,a.description].filter(Boolean).join(" ").toLocaleLowerCase("fr").includes(motCle.toLocaleLowerCase("fr")))&&
equipements.every(e=>a.options?.some(o=>o.toLocaleLowerCase("fr")===e.toLocaleLowerCase("fr")))&&
(!couleur||a.couleur?.toLocaleLowerCase("fr")===couleur.toLocaleLowerCase("fr"))&&
(!portes||a.nombre_portes===Number(portes))&&
(!places||a.nombre_places===Number(places))&&
(!carrosserie||a.carrosserie?.toLocaleLowerCase("fr")===carrosserie.toLocaleLowerCase("fr"))&&
(!carburant||a.carburant===carburant)&&
(!boite||a.boite===boite)&&
(!ville||a.ville?.toLocaleLowerCase("fr").includes(ville.toLocaleLowerCase("fr")))
).sort((a,b)=>tri==="prix-asc"?(a.prix??Infinity)-(b.prix??Infinity):tri==="prix-desc"?(b.prix??0)-(a.prix??0):tri==="annee-desc"?(b.annee??0)-(a.annee??0):0),
[annonces,marque,modele,finition,prixMin,prixMax,anneeMin,anneeMax,kmMin,kmMax,carburant,boite,ville,tri,puissanceMin,puissanceMax,departement,motCle,equipements,couleur,portes,places,carrosserie]);
useEffect(()=>{if(!category)return;let cancelled=false;setCountLoading(true);
 const timeout=setTimeout(async()=>{
  let q=supabase.from("annonces_auto").select("id",{head:true,count:"exact"}).eq("statut","publiee").in("type_vehicule",category.dbTypes);
  if(marque)q=q.ilike("marque",marque);
  if(modele)q=q.ilike("modele",modele);
  if(finition)q=q.ilike("finition",finition);
  if(carburant)q=q.eq("carburant",carburant);
  if(boite)q=q.eq("boite",boite);
  if(ville)q=q.ilike("ville","%"+ville+"%");
  if(departement)q=q.ilike("departement","%"+departement+"%");
  if(prixMin)q=q.gte("prix",Number(prixMin));if(prixMax)q=q.lte("prix",Number(prixMax));
  if(anneeMin)q=q.gte("annee",Number(anneeMin));if(anneeMax)q=q.lte("annee",Number(anneeMax));
  if(kmMin)q=q.gte("kilometrage",Number(kmMin));if(kmMax)q=q.lte("kilometrage",Number(kmMax));
  if(puissanceMin)q=q.gte("puissance_ch",Number(puissanceMin));if(puissanceMax)q=q.lte("puissance_ch",Number(puissanceMax));
  if(couleur)q=q.ilike("couleur",couleur);if(carrosserie)q=q.ilike("carrosserie",carrosserie);
  if(portes)q=q.eq("nombre_portes",Number(portes));if(places)q=q.eq("nombre_places",Number(places));
  if(equipements.length)q=q.contains("options",equipements);
  if(motCle)q=q.or("marque.ilike.%"+motCle+"%,modele.ilike.%"+motCle+"%,finition.ilike.%"+motCle+"%,description.ilike.%"+motCle+"%");
  const {count,error:countError}=await q;
  if(!cancelled){setExactCount(countError?null:count);setCountLoading(false);}
 },260);
 return()=>{cancelled=true;clearTimeout(timeout)};
},[slug,marque,modele,finition,prixMin,prixMax,anneeMin,anneeMax,kmMin,kmMax,carburant,boite,ville,departement,motCle,equipements,couleur,portes,places,carrosserie,puissanceMin,puissanceMax]);
if(!category)return <main style={{padding:40}}><h1>Catégorie introuvable</h1><a href="/automobile">Retour aux catégories</a></main>;
return <main className="vehicles-sub">
<style>{`
.vehicles-sub{min-height:100vh;background:#f1f5fa;color:#061c40;font-family:Arial,sans-serif}
.vehicles-sub *{box-sizing:border-box}
.vehicles-sub .hero{background:linear-gradient(110deg,#051335,#0757a7);padding:32px clamp(20px,4vw,60px);color:white}
.vehicles-sub .hero a{color:#ffdb20;text-decoration:none;font-weight:700}
.vehicles-sub h1{font-size:clamp(34px,4vw,54px);margin:18px 0}
.vehicles-sub .inner{max-width:1350px;margin:auto;padding:30px 20px}
.vehicles-sub .search-layout{display:grid;grid-template-columns:minmax(260px,310px) minmax(0,1fr);gap:26px;align-items:start}
.vehicles-sub .search-sidebar{background:white;border-radius:18px;padding:22px;box-shadow:0 5px 20px #122b4d14;position:sticky;top:16px}
.vehicles-sub .filters{display:grid;grid-template-columns:1fr;gap:17px}
.vehicles-sub .search-results{min-width:0}
.vehicles-sub .filter-group{border:1px solid #dbe5f1;border-radius:13px;overflow:hidden;background:#fff;margin-bottom:12px}
.vehicles-sub .filter-group summary{cursor:pointer;list-style:none;padding:15px 14px;font-weight:900;color:#073777;display:flex;justify-content:space-between;align-items:center;background:#f5f8fe}
.vehicles-sub .filter-group summary::-webkit-details-marker{display:none}
.vehicles-sub .filter-group summary::after{content:"⌄";font-size:21px}
.vehicles-sub .filter-group[open] summary::after{content:"⌃"}
.vehicles-sub .filter-group .filters{padding:14px;gap:13px}
.vehicles-sub .equip-list{padding:14px;display:grid;gap:10px}
.vehicles-sub .equip-list label{display:flex;flex-direction:row;gap:10px;align-items:center;font-size:13px;font-weight:600}
.vehicles-sub .equip-list input{width:16px;height:16px;flex-shrink:0}
.vehicles-sub label{font-weight:700;display:flex;flex-direction:column;gap:8px}
.vehicles-sub select,.vehicles-sub input{border:1px solid #becde1;border-radius:10px;padding:14px;width:100%;font-size:15px;background:white;color:#071d42}
.vehicles-sub .ads{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:18px}
.vehicles-sub article,.vehicles-sub .notice{background:white;padding:24px;border-radius:17px;box-shadow:0 4px 16px #122b4d13}
.vehicles-sub .price{color:#0756b7;font-size:26px;font-weight:900}
.vehicles-sub .filter-heading{display:flex;flex-direction:column;align-items:stretch;gap:12px;margin:0 0 20px}
.vehicles-sub .filter-heading h2{font-size:24px;margin:0}
.vehicles-sub .reset{padding:12px 18px;background:#e4eeff;border:1px solid #adc7ee;border-radius:25px;font-weight:800;color:#082454;cursor:pointer}
.vehicles-sub .results-bar{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin:28px 0 18px}
.vehicles-sub .results-bar h2{margin:0}
.vehicles-sub .results-bar select{width:auto;min-width:200px}
.vehicles-sub article{border:1px solid #d9e5f1}
.vehicles-sub article h3{font-size:21px}
.vehicles-sub .placeholder-photo{height:145px;background:linear-gradient(125deg,#e7f0fd,#d4e0f2);border-radius:12px;display:flex;align-items:center;justify-content:center;color:#496b9b;font-size:52px}
.vehicles-sub .gold{display:inline-block;background:#ffcf06;color:#061636!important;padding:14px 22px;border-radius:40px;text-decoration:none;font-weight:900}
@media(max-width:900px){.vehicles-sub .search-layout{grid-template-columns:1fr}.vehicles-sub .search-sidebar{position:static}.vehicles-sub .filters{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:540px){.vehicles-sub .filters{grid-template-columns:1fr}.vehicles-sub .results-bar select{min-width:0;width:100%}}
`}</style>
<section className="hero"><a href="/automobile">← Automobile &amp; Véhicules / Toutes les catégories</a>
<h1>{category.icon} {category.title}</h1>
<p>Consultez les annonces et affinez votre recherche.</p>
<a className="gold" href="/automobile/deposer">＋ Déposer une annonce</a></section>
<div className="inner">
{<div className="search-layout">
<aside className="search-sidebar" aria-label="Filtres de recherche automobile">
<div className="filter-heading"><h2>Affiner votre recherche</h2>
 <div style={{border:"1px solid #d5e5f7",borderRadius:12,padding:14,background:"#f6faff"}}>
 <div style={{fontSize:12,color:"#435878",fontWeight:700}}>Véhicules correspondant à vos critères</div>
 <strong aria-live="polite" style={{display:"block",fontSize:30,color:"#073b81",marginTop:4}}>{countLoading?"…":exactCount===null?"Indisponible":exactCount.toLocaleString("fr-FR")}</strong></div>
 <SaveSearchButton categorie={slug} criteres={criteres} titre={[category.title,marques.find(x=>x.id===marqueId)?.nom,modeles.find(x=>x.id===modeleId)?.nom,carburant,boite,ville||departement].filter(Boolean).join(" · ")}/>
 <button type="button" className="reset" onClick={reset}>↺ Réinitialiser les filtres</button></div>
<details className="filter-group" open><summary>Marque, modèle et finition</summary><div className="filters">
<label>Marque<BrandAutocomplete brands={marques} value={marqueId} onChange={setMarqueId}/></label>
<label>Modèle<select aria-label="Modèle" value={modeleId} onChange={e=>setModeleId(e.target.value)} disabled={!marqueId}><option value="">{marqueId?"Tous les modèles":"Choisir une marque"}</option>{modeles.map(x=><option key={x.id} value={x.id}>{x.nom}</option>)}</select></label>
<label>Finition<select aria-label="Finition" value={finitionId} onChange={e=>setFinitionId(e.target.value)} disabled={!modeleId}><option value="">{modeleId?"Toutes les finitions":"Choisir un modèle"}</option>{finitions.map(x=><option key={x.id} value={x.id}>{x.nom}</option>)}</select></label>
</div></details>
<details className="filter-group" open><summary>Prix, année et kilomètres</summary><div className="filters">
<label>Prix minimum (€)<input type="number" min="0" placeholder="Prix minimum" value={prixMin} onChange={e=>setPrixMin(e.target.value)}/></label>
<label>Prix maximum (€)<input type="number" min="0" placeholder="Prix maximum" value={prixMax} onChange={e=>setPrixMax(e.target.value)}/></label>
<label>Année minimum<input type="number" min="1900" max="2100" placeholder="Année min." value={anneeMin} onChange={e=>setAnneeMin(e.target.value)}/></label>
<label>Année maximum<input type="number" min="1900" max="2100" placeholder="Année max." value={anneeMax} onChange={e=>setAnneeMax(e.target.value)}/></label>
<label>Kilométrage minimum<input type="number" min="0" placeholder="Km minimum" value={kmMin} onChange={e=>setKmMin(e.target.value)}/></label>
<label>Kilométrage maximum<input type="number" min="0" placeholder="Km maximum" value={kmMax} onChange={e=>setKmMax(e.target.value)}/></label>
</div></details>
<details className="filter-group"><summary>Carrosserie et caractéristiques</summary><div className="filters">
<label>Type de carrosserie<select value={carrosserie} onChange={e=>setCarrosserie(e.target.value)}><option value="">Toutes les carrosseries</option>{carrosseries.map(x=><option key={x}>{x}</option>)}</select></label>
<label>Couleur<select value={couleur} onChange={e=>setCouleur(e.target.value)}><option value="">Toutes les couleurs</option>{couleurs.map(x=><option key={x}>{x}</option>)}</select></label>
<label>Nombre de portes<select value={portes} onChange={e=>setPortes(e.target.value)}><option value="">Toutes</option>{[2,3,4,5,6].map(x=><option key={x} value={x}>{x}</option>)}</select></label>
<label>Nombre de places<select value={places} onChange={e=>setPlaces(e.target.value)}><option value="">Toutes</option>{[2,3,4,5,6,7,8,9].map(x=><option key={x} value={x}>{x}</option>)}</select></label>
</div></details>
<details className="filter-group"><summary>Motorisation</summary><div className="filters">
<label>Énergie<select value={carburant} onChange={e=>setCarburant(e.target.value)}><option value="">Toutes les énergies</option>{["Essence","Diesel","Hybride","Hybride rechargeable","Électrique","GPL"].map(x=><option key={x}>{x}</option>)}</select></label>
<label>Boîte de vitesses<select value={boite} onChange={e=>setBoite(e.target.value)}><option value="">Toutes</option><option>Automatique</option><option>Manuelle</option></select></label>
<label>Puissance minimum (ch)<input type="number" min="0" placeholder="Puissance min." value={puissanceMin} onChange={e=>setPuissanceMin(e.target.value)}/></label>
<label>Puissance maximum (ch)<input type="number" min="0" placeholder="Puissance max." value={puissanceMax} onChange={e=>setPuissanceMax(e.target.value)}/></label>
</div></details>
<details className="filter-group"><summary>Localisation</summary><div className="filters">
<label>Ville<input value={ville} onChange={e=>setVille(e.target.value)} placeholder="Ville recherchée"/></label>
<label>Département<input value={departement} onChange={e=>setDepartement(e.target.value)} placeholder="Nom ou numéro de département"/></label>
</div></details>
<details className="filter-group"><summary>Options et équipements</summary><div className="equip-list">
{listeEquipements.map(e=><label key={e}><input type="checkbox" checked={equipements.includes(e)} onChange={()=>toggleEquipement(e)}/>{e}</label>)}
</div></details>
<details className="filter-group"><summary>Recherche par mot-clé</summary><div className="filters">
<label>Mot-clé<input value={motCle} onChange={e=>setMotCle(e.target.value)} placeholder="Ex. GT, sport, première main"/></label>
</div></details>
</aside>
<section className="search-results" aria-label={"Annonces "+category.title}>
{error&&<p role="alert">{error}</p>}
<div className="results-bar"><h2>Annonces — {category.title} ({countLoading?"…":exactCount===null?filtered.length:exactCount})</h2><label>Trier par <select value={tri} onChange={e=>setTri(e.target.value)}><option value="recent">Ordre d'affichage</option><option value="prix-asc">Prix croissant</option><option value="prix-desc">Prix décroissant</option><option value="annee-desc">Année récente</option></select></label></div>
{loading?<p>Chargement des annonces…</p>:filtered.length? <div className="ads">{filtered.map(a=><article key={a.id}>{a.photos?.[0]?<img src={a.photos[0]} alt={"Photo du véhicule "+(a.marque??"")+" "+(a.modele??"")} style={{width:"100%",height:145,objectFit:"cover",borderRadius:12}}/>:<div className="placeholder-photo" aria-label="Photo non disponible">🚘</div>}<h3>{a.marque} {a.modele}</h3><div className="price">{a.prix==null?"Prix non renseigné":a.prix.toLocaleString("fr-FR")+" €"}</div><p>{[a.finition,a.annee,a.carburant,a.kilometrage==null?null:a.kilometrage.toLocaleString("fr-FR")+" km"].filter(Boolean).join(" · ")}</p><p>📍 {a.ville??"Lieu non renseigné"} {a.code_postal??""}</p><div style={{display:"flex",flexWrap:"wrap",gap:8,alignItems:"center",justifyContent:"space-between",marginTop:14}}><a href={"/annonce/"+a.id} onClick={()=>{try{sessionStorage.setItem("tim_pending_click",a.id)}catch{}void recordAutoEvent(a.id,"clic")}} style={{display:"inline-block",borderRadius:10,background:"#e1ecfd",color:"#07417b",padding:"9px 12px",fontWeight:800,textDecoration:"none",fontSize:13}}>Voir l’annonce →</a><FavoriteAnnonceButton annonceId={a.id}/><ShareLinks compact url={"/annonce/"+a.id} title={[a.marque,a.modele,a.finition].filter(Boolean).join(" ")+" — TOUT ICI MARKET"} label="Partager"/></div></article>)}</div>:<div className="notice">Aucune annonce publiée dans cette catégorie pour le moment. Modifiez vos filtres ou revenez plus tard.</div>}
</section></div>}
</div></main>;
}
