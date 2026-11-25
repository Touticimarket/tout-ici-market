"use client";
import {useEffect,useState} from "react";
import {supabase} from "../lib/supabaseClient";
export default function Compte(){
 const [email,setEmail]=useState("");const [status,setStatus]=useState("");
 useEffect(()=>{void supabase.auth.getUser().then(({data})=>setEmail(data.user?.email??""));const {data}=supabase.auth.onAuthStateChange((_event,session)=>setEmail(session?.user?.email??""));return()=>data.subscription.unsubscribe();},[]);
 async function connect(){const {error}=await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin+"/compte"}});if(error)setStatus("Connexion impossible : "+error.message);}
 return <main style={{maxWidth:900,margin:"auto",padding:"34px 20px",fontFamily:"Arial,sans-serif",color:"#092451"}}>
 <h1>Mon compte</h1><p>{email?"Connecté : "+email:"Connectez-vous pour retrouver vos recherches et annonces favorites."}</p>
 {!email&&<button type="button" onClick={connect} style={{background:"#ffcf06",border:0,borderRadius:12,padding:"13px 18px",fontWeight:800,cursor:"pointer"}}>Se connecter avec Google</button>}
 {status&&<p role="status">{status}</p>}
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:15,marginTop:24}}>
 <a href="/compte/recherches" style={{background:"white",border:"1px solid #dbe6f2",borderRadius:15,padding:22,textDecoration:"none",color:"#092451"}}><h2>☆ Mes recherches</h2><p>Retrouver et relancer mes recherches sauvegardées.</p></a>
 <a href="/favoris" style={{background:"white",border:"1px solid #dbe6f2",borderRadius:15,padding:22,textDecoration:"none",color:"#092451"}}><h2>♡ Mes favoris</h2><p>Retrouver les annonces que j'ai mises de côté.</p></a></div>
 {email&&<button type="button" onClick={async()=>{await supabase.auth.signOut();setEmail("");}} style={{marginTop:24,border:"1px solid #bdcbe0",padding:12,borderRadius:10,background:"white",cursor:"pointer"}}>Se déconnecter</button>}
 </main>;
}