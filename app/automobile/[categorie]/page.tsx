"use client";
import {useEffect,useMemo,useState} from "react";
import {useParams} from "next/navigation";
import {supabase} from "../../lib/supabaseClient";
type Option={id:string;nom:string};
type Annonce={id:string;marque:string|null;modele:string|null;finition:string|null;prix:number|null;annee:number|null;kilometrage:number|null;ville:string|null;carburant:string|null};
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
const [annonces,setAnnonces]=useState<Annonce[]>([]);
const [marqueId,setMarqueId]=useState("");const [modeleId,setModeleId]=useState("");
const [prixMax,setPrixMax]=useState("");const [anneeMin,setAnneeMin]=useState("");
const [loading,setLoading]=useState(true);const [error,setError]=useState("");
useEffect(()=>{if(slug!=="voitures"){setLoading(false);return;}let mounted=true;
async function load(){setLoading(true);const [m,a]=await Promise.all([
supabase.from("marques_auto").select("id,nom").order("nom").limit(1000),
supabase.from("annonces_auto").select("id,marque,modele,finition,prix,annee,kilometrage,ville,carburant").eq("statut","publiee").limit(200)
]);if(!mounted)return;
if(m.error||a.error)setError("Impossible de récupérer toutes les données. Vérifiez la connexion et les autorisations de lecture Supabase.");
setMarques(m.data??[]);setAnnonces(a.data??[]);setLoading(false);}
void load();return()=>{mounted=false;};},[slug]);
useEffect(()=>{let mounted=true;setModeles([]);setModeleId("");if(!marqueId)return;
async function loadModels(){const {data,error}=await supabase.from("modeles_auto").select("id,nom").eq("marque_id",marqueId).order("nom").limit(1000);
if(!mounted)return;if(error)setError("Impossible de charger les modèles.");else setModeles(data??[]);}
void loadModels();return()=>{mounted=false;};},[marqueId]);
const marque=marques.find(x=>x.id===marqueId)?.nom.toLocaleLowerCase("fr")??"";
const modele=modeles.find(x=>x.id===modeleId)?.nom.toLocaleLowerCase("fr")??"";
const filtered=useMemo(()=>annonces.filter(a=>
(!marque||a.marque?.toLocaleLowerCase("fr")===marque)&&(!modele||a.modele?.toLocaleLowerCase("fr")===modele)&&
(!prixMax||(a.prix!==null&&a.prix<=Number(prixMax)))&&
(!anneeMin||(a.annee!==null&&a.annee>=Number(anneeMin)))
),[annonces,marque,modele,prixMax,anneeMin]);
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
<div className="filters">
<label>Marque<select aria-label="Marque" value={marqueId} onChange={e=>setMarqueId(e.target.value)}><option value="">Toutes les marques</option>{marques.map(x=><option key={x.id} value={x.id}>{x.nom}</option>)}</select></label>
<label>Modèle<select aria-label="Modèle" value={modeleId} onChange={e=>setModeleId(e.target.value)} disabled={!marqueId}><option value="">{marqueId?"Tous les modèles":"Choisir une marque"}</option>{modeles.map(x=><option key={x.id} value={x.id}>{x.nom}</option>)}</select></label>
<label>Prix maximum (€)<input type="number" min="0" placeholder="Tous les prix" value={prixMax} onChange={e=>setPrixMax(e.target.value)}/></label>
<label>Année minimum<input type="number" min="1900" max="2100" placeholder="Toutes années" value={anneeMin} onChange={e=>setAnneeMin(e.target.value)}/></label>
</div>
{error&&<p role="alert">{error}</p>}
<h2>Annonces de voitures ({filtered.length})</h2>
{loading?<p>Chargement des annonces…</p>:filtered.length? <div className="ads">{filtered.map(a=><article key={a.id}><h3>🚘 {a.marque} {a.modele}</h3><div className="price">{a.prix==null?"Prix non renseigné":a.prix.toLocaleString("fr-FR")+" €"}</div><p>{[a.finition,a.annee,a.carburant,a.kilometrage==null?null:a.kilometrage.toLocaleString("fr-FR")+" km"].filter(Boolean).join(" · ")}</p><p>📍 {a.ville??"Lieu non renseigné"}</p></article>)}</div>:<div className="notice">Aucune annonce de voiture pour ces critères actuellement.</div>}
</>:<div className="notice"><h2>{category.title}</h2><p>Cette rubrique possède maintenant sa propre page. Les annonces de cette catégorie seront connectées dès que les données correspondantes seront disponibles dans la base.</p><a href="/automobile">Voir les autres catégories</a></div>}
</div></main>;
}
