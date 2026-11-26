"use client";
import {useEffect,useState} from "react";
import {useRouter} from "next/navigation";
import {supabase} from "../lib/supabaseClient";
export default function ContacterVendeur({annonceId}:{annonceId:string}){
 const [busy,setBusy]=useState(false);const [message,setMessage]=useState("");const router=useRouter();
 async function start(){setBusy(true);setMessage("");
  const {data:{user}}=await supabase.auth.getUser();
  if(!user){setMessage("Connectez-vous pour contacter le vendeur.");setBusy(false);return;}
  const {data,error}=await supabase.rpc("demarrer_conversation_auto",{p_annonce_id:annonceId});
  if(error||!data)setMessage(error?.message||"Impossible de créer la conversation.");
  else router.push("/compte/messages?conversation="+encodeURIComponent(data));
  setBusy(false);
 }
 return <div style={{display:"flex",flexDirection:"column",gap:6}}>
 <button type="button" onClick={start} disabled={busy} style={{background:"#ffce08",border:0,borderRadius:12,padding:"13px 20px",fontWeight:900,color:"#092151",cursor:"pointer"}}>{busy?"Ouverture…":"✉ Contacter le vendeur"}</button>
 {message&&<small role="status">{message} <a href="/compte">Mon compte</a></small>}
 </div>;
}
