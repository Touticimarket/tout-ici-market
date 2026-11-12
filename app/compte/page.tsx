"use client";

import {useEffect,useState} from "react";
import {supabase} from "../lib/supabaseClient";
import {useRouter} from "next/navigation";
import {ArrowRight,CarFront,LogOut,ShieldCheck,UserRound} from "lucide-react";

export default function MonCompte(){
  const router=useRouter();
  const [email,setEmail]=useState("");
  const [charge,setCharge]=useState(false);
  const [erreur,setErreur]=useState("");

  useEffect(()=>{
    let actif=true;
    supabase.auth.getUser().then(({data,error})=>{
      if(actif){setEmail(data.user?.email||"");setCharge(true);if(error)setErreur("La session n'a pas pu être vérifiée.");}
    });
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{
      if(actif){setEmail(session?.user?.email||"");setCharge(true);}
    });
    return ()=>{actif=false;subscription.unsubscribe()};
  },[]);

  async function deconnexion(){
    const {error}=await supabase.auth.signOut();
    if(error){setErreur(error.message);return;}
    router.push("/");
    router.refresh();
  }
  return <main style={{fontFamily:"Arial,sans-serif",minHeight:"100vh",background:"#f5f8ff",padding:"118px 18px 75px",color:"#0b2b61"}}>
    <div style={{maxWidth:770,margin:"0 auto",background:"#fff",borderRadius:20,padding:35,border:"1px solid #dde8f7",boxShadow:"0 15px 40px #194c8210"}}>
      <h1 style={{display:"flex",alignItems:"center",gap:10}}><UserRound size={27}/> Mon compte</h1>
      {!charge?<p>Vérification de votre connexion…</p>:email?<>
        <p><ShieldCheck size={18} color="#1d8b57" style={{verticalAlign:"middle",marginRight:7}}/>Connecté avec <strong>{email}</strong>.</p>
        <p style={{fontSize:14,color:"#60738c",lineHeight:1.55}}>Bienvenue dans votre espace TOUT ICI MARKET. Les fonctions de gestion de vos annonces seront ajoutées progressivement.</p>
        <div style={{padding:"18px 20px",background:"#f1f6ff",borderRadius:14,margin:"22px 0"}}>
          <CarFront size={22} style={{verticalAlign:"middle",marginRight:8}}/>
          <a href="/deposer" style={{color:"#0648ba",fontWeight:800,textDecoration:"none"}}>Déposer une annonce <ArrowRight size={16} style={{verticalAlign:"middle"}}/></a>
        </div>
        <button onClick={deconnexion} type="button" style={{display:"inline-flex",alignItems:"center",gap:8,background:"#fff4e0",color:"#754400",padding:"13px 17px",borderRadius:10,border:"1px solid #f0d38a",cursor:"pointer",fontWeight:800}}>
          <LogOut size={17}/> Se déconnecter
        </button>
      </>:<>
        <p>Vous devez vous connecter pour accéder à votre compte.</p>
        <a href="/compte/connexion" style={{display:"inline-block",padding:"13px 19px",background:"#ffcf2c",borderRadius:10,textDecoration:"none",color:"#0c2d5e",fontWeight:800}}>Se connecter</a>
        <p style={{fontSize:13}}>Pas encore inscrit ? <a href="/compte/inscription" style={{color:"#0950bd"}}>Créer mon compte</a></p>
      </>}
      {erreur&&<p role="alert" style={{padding:13,background:"#fff1e5",borderRadius:12}}>{erreur}</p>}
    </div>
  </main>;
}
