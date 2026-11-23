"use client";
import {useEffect,useMemo,useState} from "react";
import {useParams} from "next/navigation";
import {supabase} from "../../lib/supabaseClient";
type Option={id:string;nom:string};
type Annonce={id:string;marque:string|null;modele:string|null;finition:string|null;prix:number|null;annee:number|null;kilometrage:number|null;ville:string|null;carburant:string|null;boite:string|null};
const categories:Record<string,{title:string;icon:string}>={
"voitures":{title:"Voitures",icon:"🚘"},"motos":{title:"Motos & Scooters",icon:"🏍️"},
"utilitaires":{title:"Utilitaires",icon:"🚐"},"camping-cars":{title:"Camping-cars & Caravaning",icon:"🚍"},
"autres-vehicules":{title:"Autres véhicules",icon:"🚜"}
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
const [kmMax,setKmMax]=useState("");const [carburant,setCarburant]=useState("");
const [boite,setBoite]=useState("");const [ville,setVille]=useState("");const [tri,setTri]=useState("recent");
const reset=()=>{setMarqueId("");setModeleId("");setFinitionId("");setPrixMin("");setPrixMax("");setAnneeMin("");setAnneeMax("");setKmMax("");setCarburant("");setBoite("");setVille("");setTri("recent")};
const [loading,setLoading]=useState(true);const [error,setError]=useState("");
useEffect(()=>{if(slug!=="voitures"){setLoading(false);return;}let mounted=true;
async function load(){setLoading(true);const [m,a]=await Promise.all([
supabase.from("marques_auto").select("id,nom").order("nom").limit(1000),
supabase.from("annonces_auto").select("id,marque,modele,finition,prix,annee,kilometrage,ville,carburant,boite").eq("statut","publiee").limit(200)
]);if(!mounted)return;
if(m.error||a.error)setError("Impossible de récupérer toutes les données. Vérifiez la connexion et les autorisations de lecture Supabase.");
setMarques(m.data??[]);setAnnonces(a.data??[]);setLoading(false);}
void load();return()=>{mounted=false;};},[slug]);
useEffect(()=>{let mounted=true;setModeles([]);setModeleId("");setFinitions([]);setFinitionId("");if(!marqueId)return;
async function loadModels(){const {data,error}=await supabase.from("modeles_auto").select("id,nom").eq("marque_id",marqueId).order("nom").limit(1000);
if(!mounted)return;if(error)setError("Impossible de charger les modèles.");else setModeles(data??[]);}
void loadModels();return()=>{mounted=false;};},[marqueId]);
useEffect(()=>{let mounted=true;setFinitions([]);setFinitionId("");if(!modeleId)return;
async function loadFinitions(){const {data,error}=await supabase.from("finitions_auto").select("id,nom").eq("modele_id",modeleId).order("nom").limit(1000);if(!mounted)return;if(error)setError("Impossible de charger les finitions.");else setFinitions(data??[]);}
void loadFinitions();return()=>{mounted=false;};},[modeleId]);
const finition=finitions.find(x=>x.id===finitionId)?.nom.toLocaleLowerCase("fr")??"";
const marque=marques.find(x=>x.id===marqueId)?.nom.toLocaleLowerCase("fr")??"";
const modele=modeles.find(x=>x.id===modeleId)?.nom.toLocaleLowerCase("fr")??"";
const filtered=useMemo(()=>annonces.filter(a=>
(!marque||a.marque?.toLocaleLowerCase("fr")===marque)&&
(!modele||a.modele?.toLocaleLowerCase("fr")===modele)&&
(!finition||a.finition?.toLocaleLowerCase("fr")===finition)&&
(!prixMin||(a.prix!==null&&a.prix>=Number(prixMin)))&&
(!prixMax||(a.prix!==null&&a.prix<=Number(prixMax)))&&
(!anneeMin||(a.annee!==null&&a.annee>=Number(anneeMin)))&&
(!anneeMax||(a.annee!==null&&a.annee<=Number(anneeMax)))&&
(!kmMax||(a.kilometrage!==null&&a.kilometrage<=Number(kmMax)))&&
(!carburant||a.carburant===carburant)&&
(!boite||a.boite===boite)&&
(!ville||a.ville?.toLocaleLowerCase("fr").includes(ville.toLocaleLowerCase("fr")))
).sort((a,b)=>tri==="prix-asc"?(a.prix??Infinity)-(b.prix??Infinity):tri==="prix-desc"?(b.prix??0)-(a.prix??0):tri==="annee-desc"?(b.annee??0)-(a.annee??0):0),
[annonces,marque,modele,finition,prixMin,prixMax,anneeMin,anneeMax,kmMax,carburant,boite,ville,tri]);
if(!category)return <main style={{padding:40}}><h1>Catégorie introuvable</h1><a href="/automobile">Retour aux catégories</a></main>;
return <main className="vehicles-sub">
<style>{`
.vehicles-sub{min-height:100vh;background:#f1f5fa;color:#061c40;font-family:Arial,sans-serif}
.vehicles-sub *{box-sizing:border-box}
.vehicles-sub .hero{background:linear-gradient(110deg,#051335,#0757a7);padding:32px clamp(20px,4vw,60px);color:white}
.vehicles-sub .hero a{color:#ffdb20;text-decoration:none;font-weight:700}
.vehicles-sub h1{font-size:clamp(34px,4vw,54px);margin:18px 0}
.vehicles-sub .inner{max-width:1350px;margin:auto;padding:30px 20px}
.vehicles-sub .filters{background:white;padding:24px;border-radius:18px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;box-shadow:0 5px 20px #122b4d14}
.vehicles-sub label{font-weight:700;display:flex;flex-direction:column;gap:8px}
.vehicles-sub select,.vehicles-sub input{border:1px solid #becde1;border-radius:10px;padding:14px;width:100%;font-size:15px;background:white;color:#071d42}
.vehicles-sub .ads{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:18px}
.vehicles-sub article,.vehicles-sub .notice{background:white;padding:24px;border-radius:17px;box-shadow:0 4px 16px #122b4d13}
.vehicles-sub .price{color:#0756b7;font-size:26px;font-weight:900}
.vehicles-sub .filter-heading{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin:22px 0 12px}
.vehicles-sub .reset{padding:12px 18px;background:#e4eeff;border:1px solid #adc7ee;border-radius:25px;font-weight:800;color:#082454;cursor:pointer}
.vehicles-sub .results-bar{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin:28px 0 18px}
.vehicles-sub .results-bar h2{margin:0}
.vehicles-sub .results-bar select{width:auto;min-width:200px}
.vehicles-sub article{border:1px solid #d9e5f1}
.vehicles-sub article h3{font-size:21px}
.vehicles-sub .placeholder-photo{height:145px;background:linear-gradient(125deg,#e7f0fd,#d4e0f2);border-radius:12px;display:flex;align-items:center;justify-content:center;color:#496b9b;font-size:52px}
.vehicles-sub .gold{display:inline-block;background:#ffcf06;color:#061636!important;padding:14px 22px;border-radius:40px;text-decoration:none;font-weight:900}
@media(max-width:700px){.vehicles-sub .filters{grid-template-columns:1fr 1fr}}
@media(max-width:460px){.vehicles-sub .filters{grid-template-columns:1fr}}
`}</style>
<section className="hero"><a href="/automobile">← Automobile &amp; Véhicules / Toutes les catégories</a>
<h1>{category.icon} {category.title}</h1>
<p>Consultez les annonces et affinez votre recherche.</p>
<a className="gold" href="/automobile/deposer">＋ Déposer une annonce</a></section>
<div className="inner">
{slug==="voitures"?<>
<div className="filter-heading"><h2>Affiner votre recherche</h2><button type="button" className="reset" onClick={reset}>↺ Réinitialiser les filtres</button></div>
<div className="filters">
<label>Marque<select aria-label="Marque" value={marqueId} onChange={e=>setMarqueId(e.target.value)}><option value="">Toutes les marques</option>{marques.map(x=><option key={x.id} value={x.id}>{x.nom}</option>)}</select></label>
<label>Modèle<select aria-label="Modèle" value={modeleId} onChange={e=>setModeleId(e.target.value)} disabled={!marqueId}><option value="">{marqueId?"Tous les modèles":"Choisir une marque"}</option>{modeles.map(x=><option key={x.id} value={x.id}>{x.nom}</option>)}</select></label>
<label>Finition<select aria-label="Finition" value={finitionId} onChange={e=>setFinitionId(e.target.value)} disabled={!modeleId}><option value="">{modeleId?"Toutes les finitions":"Choisir un modèle"}</option>{finitions.map(x=><option key={x.id} value={x.id}>{x.nom}</option>)}</select></label>
<label>Prix minimum (€)<input type="number" min="0" placeholder="Prix minimum" value={prixMin} onChange={e=>setPrixMin(e.target.value)}/></label>
<label>Prix maximum (€)<input type="number" min="0" placeholder="Tous les prix" value={prixMax} onChange={e=>setPrixMax(e.target.value)}/></label>
<label>Année maximum<input type="number" min="1900" max="2100" placeholder="Toutes années" value={anneeMax} onChange={e=>setAnneeMax(e.target.value)}/></label>
<label>Année minimum<input type="number" min="1900" max="2100" placeholder="Toutes années" value={anneeMin} onChange={e=>setAnneeMin(e.target.value)}/></label>
<label>Kilométrage maximum<input type="number" min="0" placeholder="Kilométrage maximum" value={kmMax} onChange={e=>setKmMax(e.target.value)}/></label>
<label>Énergie<select value={carburant} onChange={e=>setCarburant(e.target.value)}><option value="">Toutes énergies</option>{["Essence","Diesel","Hybride","Hybride rechargeable","Électrique","GPL"].map(x=><option key={x}>{x}</option>)}</select></label>
<label>Boîte de vitesses<select value={boite} onChange={e=>setBoite(e.target.value)}><option value="">Toutes</option><option>Automatique</option><option>Manuelle</option></select></label>
<label>Ville<input value={ville} onChange={e=>setVille(e.target.value)} placeholder="Ville recherchée"/></label>
</div>
{error&&<p role="alert">{error}</p>}
<div className="results-bar"><h2>Annonces de voitures ({filtered.length})</h2><label>Trier par <select value={tri} onChange={e=>setTri(e.target.value)}><option value="recent">Ordre d'affichage</option><option value="prix-asc">Prix croissant</option><option value="prix-desc">Prix décroissant</option><option value="annee-desc">Année récente</option></select></label></div>
{loading?<p>Chargement des annonces…</p>:filtered.length? <div className="ads">{filtered.map(a=><article key={a.id}><div className="placeholder-photo" aria-label="Photo non disponible">🚘</div><h3>{a.marque} {a.modele}</h3><div className="price">{a.prix==null?"Prix non renseigné":a.prix.toLocaleString("fr-FR")+" €"}</div><p>{[a.finition,a.annee,a.carburant,a.kilometrage==null?null:a.kilometrage.toLocaleString("fr-FR")+" km"].filter(Boolean).join(" · ")}</p><p>📍 {a.ville??"Lieu non renseigné"}</p></article>)}</div>:<div className="notice">Aucune annonce de voiture pour ces critères actuellement.</div>}
</>:<div className="notice"><h2>{category.title}</h2><p>Cette rubrique possède maintenant sa propre page. Les annonces de cette catégorie seront connectées dès que les données correspondantes seront disponibles dans la base.</p><a href="/automobile">Voir les autres catégories</a></div>}
</div></main>;
}
