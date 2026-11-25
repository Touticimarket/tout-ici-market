"use client";
import {useState} from "react";
import {supabase} from "../lib/supabaseClient";
type Props={categorie:string;criteres:Record<string,unknown>;titre:string};
export default function SaveSearchButton({categorie,criteres,titre}:Props){
 const [busy,setBusy]=useState(false);const [message,setMessage]=useState("");
 async function save(){
  setBusy(true);setMessage("");
  try{
   const {data:{user},error:authError}=await supabase.auth.getUser();
   if(authError||!user){setMessage("Connectez-vous pour enregistrer cette recherche.");setBusy(false);return;}
   const nom=window.prompt("Nom de votre recherche enregistrée :",titre);
   if(nom===null){setBusy(false);return;}
   const clean=nom.trim().slice(0,120);
   if(!clean){setMessage("Saisissez un nom pour cette recherche.");setBusy(false);return;}
   const {error}=await supabase.from("recherches_sauvegardees").insert({user_id:user.id,nom:clean,categorie,criteres_json:criteres,alerte_email:false,alerte_push:false});
   setMessage(error?"Enregistrement impossible : "+error.message:"Recherche enregistrée dans Mon compte → Mes recherches.");
  }catch{setMessage("Impossible d'enregistrer cette recherche pour le moment.");}
  setBusy(false);
 }
 return <div style={{display:"flex",flexDirection:"column",gap:6}}>
 <button type="button" onClick={save} disabled={busy} style={{padding:"12px 15px",border:0,borderRadius:12,color:"#082657",background:"#ffcf06",fontWeight:800,cursor:"pointer"}}>{busy?"Enregistrement…":"☆ Sauvegarder ma recherche"}</button>
 <a href="/compte/recherches" style={{fontSize:13,color:"#0a4f9b",fontWeight:700}}>Mes recherches enregistrées →</a>
 {message&&<p role="status" style={{fontSize:12,margin:0,color:"#204677"}}>{message} {message.startsWith("Connectez")&&<a href="/compte" style={{marginLeft:5}}>Mon compte</a>}</p>}
 </div>;
}