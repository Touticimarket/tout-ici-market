"use client";
import {useEffect,useState} from "react";
import {supabase} from "../lib/supabaseClient";
export default function FavoriteAnnonceButton({annonceId}:{annonceId:string}){
 const [fav,setFav]=useState(false);const [busy,setBusy]=useState(false);const [message,setMessage]=useState("");
 useEffect(()=>{let live=true;void (async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user)return;const {data}=await supabase.from("favoris").select("id").eq("user_id",user.id).eq("annonce_id",annonceId).maybeSingle();if(live)setFav(Boolean(data));})();return()=>{live=false};},[annonceId]);
 async function toggle(){
  setBusy(true);setMessage("");
  const {data:{user}}=await supabase.auth.getUser();
  if(!user){setMessage("Connectez-vous pour ajouter cette annonce aux favoris.");setBusy(false);return;}
  const {error}=fav?await supabase.from("favoris").delete().eq("user_id",user.id).eq("annonce_id",annonceId):await supabase.from("favoris").insert({user_id:user.id,annonce_id:annonceId});
  if(error)setMessage("Impossible de modifier vos favoris.");else setFav(!fav);
  setBusy(false);
 }
 return <span style={{display:"inline-flex",flexDirection:"column",gap:4}}>
 <button type="button" disabled={busy} onClick={toggle} aria-pressed={fav} style={{borderRadius:10,padding:"9px 11px",border:"1px solid #d5deea",background:"white",color:"#073b81",cursor:"pointer",fontWeight:800}}>{fav?"♥ Dans mes favoris":"♡ Ajouter aux favoris"}</button>
 {message&&<small role="status" style={{color:"#4c5672",fontSize:11}}>{message}</small>}
 </span>;
}