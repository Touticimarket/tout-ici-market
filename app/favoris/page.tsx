"use client";
import {useEffect,useState} from "react";
import {supabase} from "../lib/supabaseClient";
type Favorite={id:string;annonce_id:string;created_at:string};
type Vehicle={id:string;marque:string|null;modele:string|null;prix:number|null;ville:string|null;photos:string[]|null};
export default function MesFavoris(){
 const [items,setItems]=useState<{favori:Favorite;annonce:Vehicle|null}[]>([]);const [status,setStatus]=useState("Chargement…");
 async function refresh(){
  const {data:{user}}=await supabase.auth.getUser();
  if(!user){setStatus("Connectez-vous pour consulter vos annonces favorites.");return;}
  const {data:f,error}=await supabase.from("favoris").select("id,annonce_id,created_at").eq("user_id",user.id).order("created_at",{ascending:false});
  if(error){setStatus("Impossible de charger vos favoris.");return;}
  const favs=(f??[]) as Favorite[];if(!favs.length){setItems([]);setStatus("");return;}
  const {data:autos}=await supabase.from("annonces_auto").select("id,marque,modele,prix,ville,photos").eq("statut","publiee").in("id",favs.map(x=>x.annonce_id));
  const map=new Map(((autos??[]) as Vehicle[]).map(a=>[a.id,a]));
  setItems(favs.map(favori=>({favori,annonce:map.get(favori.annonce_id)??null})));setStatus("");
 }
 useEffect(()=>{void refresh();},[]);
 async function remove(id:string){const {error}=await supabase.from("favoris").delete().eq("id",id);if(error){setStatus("Impossible de supprimer ce favori.");return;}setItems(current=>current.filter(x=>x.favori.id!==id));}
 return <main style={{maxWidth:1050,margin:"auto",padding:"34px 20px",fontFamily:"Arial,sans-serif",color:"#092451"}}>
 <a href="/compte" style={{color:"#0a4f9b"}}>← Mon compte</a><h1>Mes annonces favorites</h1>
 <p>Retrouvez les annonces que vous avez enregistrées. Les annonces retirées ne sont plus consultables.</p>
 {status&&<p role="status">{status}</p>}
 {!status&&items.length===0&&<p>Vous n’avez pas encore ajouté d’annonce à vos favoris.</p>}
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:16}}>
 {items.map(({favori,annonce})=><article key={favori.id} style={{border:"1px solid #dce5f0",background:"white",borderRadius:15,overflow:"hidden"}}>
 {annonce?.photos?.[0]&&<img alt="Photo de l'annonce" src={annonce.photos[0]} style={{width:"100%",height:140,objectFit:"cover"}}/>}
 <div style={{padding:16}}><strong>{annonce?[annonce.marque,annonce.modele].filter(Boolean).join(" "):"Annonce indisponible"}</strong>
 {annonce&&<><p>{annonce.prix?.toLocaleString("fr-FR")??"Prix non renseigné"} € · {annonce.ville}</p><a href={"/annonce/"+annonce.id}>Voir l'annonce →</a></>}
 <div style={{marginTop:15}}><button type="button" onClick={()=>remove(favori.id)} style={{border:"1px solid #cbd7e5",padding:"9px 12px",borderRadius:9,background:"white",cursor:"pointer"}}>Retirer des favoris</button></div></div>
 </article>)}</div></main>;
}