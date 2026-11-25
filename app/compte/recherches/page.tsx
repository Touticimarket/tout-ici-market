"use client";
import {useEffect,useState} from "react";
import {supabase} from "../../lib/supabaseClient";
type Recherche={id:string;nom:string;categorie:string;criteres_json:Record<string,unknown>;created_at:string};
export default function MesRecherches(){
 const [items,setItems]=useState<Recherche[]>([]);const [state,setState]=useState("Chargement…");
 async function refresh(){
  const {data:{user}}=await supabase.auth.getUser();
  if(!user){setState("Connectez-vous pour retrouver vos recherches enregistrées.");return;}
  const {data,error}=await supabase.from("recherches_sauvegardees").select("id,nom,categorie,criteres_json,created_at").eq("user_id",user.id).order("created_at",{ascending:false});
  if(error){setState("Impossible de charger vos recherches.");return;}
  setItems((data??[]) as Recherche[]);setState("");
 }
 useEffect(()=>{void refresh();},[]);
 async function remove(id:string){if(!window.confirm("Supprimer cette recherche enregistrée ?"))return;const {error}=await supabase.from("recherches_sauvegardees").delete().eq("id",id);if(error){setState("La suppression a échoué.");return;}setItems(current=>current.filter(x=>x.id!==id));}
 return <main style={{maxWidth:900,margin:"0 auto",padding:"30px 20px",color:"#092451",fontFamily:"Arial,sans-serif"}}>
 <a href="/compte" style={{color:"#0a4f9b"}}>← Mon compte</a><h1>Mes recherches enregistrées</h1>
 <p>Retrouvez vos critères de recherche et relancez-les à tout moment. Les résultats reflètent les annonces encore disponibles.</p>
 {state&&<p role="status">{state}</p>}
 {!state&&items.length===0&&<p>Vous n'avez pas encore sauvegardé de recherche. <a href="/automobile">Explorer les véhicules</a></p>}
 <div style={{display:"grid",gap:13}}>{items.map(x=><article key={x.id} style={{border:"1px solid #d9e5f3",borderRadius:14,background:"white",padding:18,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
 <div><strong style={{fontSize:19}}>{x.nom}</strong><div style={{fontSize:13,color:"#56677f",marginTop:6}}>Automobile / {x.categorie} · {new Date(x.created_at).toLocaleDateString("fr-FR")}</div></div>
 <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}><a href={"/automobile/"+encodeURIComponent(x.categorie)+"?f="+encodeURIComponent(JSON.stringify(x.criteres_json??{}))} style={{background:"#ffcf06",borderRadius:10,textDecoration:"none",fontWeight:800,color:"#092451",padding:"10px 13px"}}>Relancer la recherche →</a>
 <button type="button" onClick={()=>remove(x.id)} style={{background:"white",border:"1px solid #b9c7d9",borderRadius:10,padding:"10px 12px",cursor:"pointer"}}>Supprimer</button></div>
 </article>)}</div></main>;
}