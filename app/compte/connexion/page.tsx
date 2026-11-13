"use client";

import {useEffect,useState} from "react";
import {supabase} from "../../lib/supabaseClient";
import {useRouter} from "next/navigation";
import {ArrowLeft,Eye,EyeOff,LockKeyhole} from "lucide-react";

export default function PageConnexion(){
  const router=useRouter();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [afficher,setAfficher]=useState(false);
  const [enCours,setEnCours]=useState(false);
  const [message,setMessage]=useState("");
  const [connecte,setConnecte]=useState(false);

  useEffect(()=>{
    let ok=true;
    supabase.auth.getUser().then(({data})=>{if(ok)setConnecte(!!data.user)});
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{
      if(ok)setConnecte(!!session?.user);
    });
    return ()=>{ok=false;subscription.unsubscribe()};
  },[]);

  async function connecter(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    if(enCours)return;
    setEnCours(true);setMessage("");
    try{
      const {error}=await supabase.auth.signInWithPassword({email:email.trim().toLowerCase(),password});
      if(error){setMessage("Connexion impossible : "+error.message);return;}
      setPassword("");
      router.push("/compte");
      router.refresh();
    }catch{setMessage("Le service est momentanément indisponible.");}
    finally{setEnCours(false);}
  }

  return <main className="ti-login">
    <style>{`
      .ti-login{font-family:Arial,sans-serif;min-height:100vh;background:linear-gradient(135deg,#f2f7ff,#fffdf5);padding:112px 16px 70px;color:#092857}
      .ti-login *{box-sizing:border-box}
      .ti-login-card{max-width:470px;margin:auto;border:1px solid #e0e8f4;background:white;border-radius:22px;box-shadow:0 18px 60px #1e417515;padding:37px}
      .ti-login h1{font-size:30px;margin:12px 0 8px}
      .ti-login p{font-size:14px;line-height:1.55;color:#61728b}
      .ti-login label{display:block;font-size:13px;font-weight:800;margin-top:18px}
      .ti-login input{width:100%;font:inherit;font-size:15px;border:1px solid #cbd8ea;background:white;border-radius:11px;padding:13px;color:#17385e;margin-top:8px}
      .ti-login-submit{display:block;width:100%;background:#ffce23;border:0;border-radius:12px;padding:15px;cursor:pointer;font-size:15px;font-weight:800;color:#08275b;margin-top:22px}
      .ti-login-submit:disabled{opacity:.65;cursor:wait}
      .ti-login a{color:#074ab5;text-decoration:none;font-weight:750}
      .ti-login a:hover{text-decoration:underline}
      .ti-login-status{background:#fff3d9;border-radius:11px;padding:12px;font-size:13px!important;color:#7d4d00!important}
      @media(max-width:530px){.ti-login-card{padding:25px 20px}}
    `}</style>
    <div className="ti-login-card">
      <span style={{fontSize:12,color:"#0a4cbb",letterSpacing:1,fontWeight:850}}>TOUT ICI MARKET · MON ESPACE</span>
      <h1>Se connecter</h1>
      <p>Retrouvez votre espace personnel et préparez vos annonces.</p>
      {connecte?<div style={{padding:16,background:"#eff9f1",borderRadius:12}}>
        <strong>Vous êtes connecté.</strong>
        <p><a href="/compte">Accéder à mon compte</a></p>
      </div>:<form onSubmit={connecter}>
        <label>Adresse e-mail
          <input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="vous@exemple.fr"/>
        </label>
        <label>Mot de passe
          <span style={{position:"relative",display:"block"}}>
            <input type={afficher?"text":"password"} required autoComplete="current-password" value={password}
              onChange={e=>setPassword(e.target.value)} placeholder="Votre mot de passe" style={{paddingRight:50}}/>
            <button type="button" aria-label={afficher?"Masquer le mot de passe":"Afficher le mot de passe"}
              onClick={()=>setAfficher(v=>!v)} style={{position:"absolute",right:8,top:18,border:0,background:"none",cursor:"pointer",color:"#627894"}}>
              {afficher?<EyeOff size={19}/>:<Eye size={19}/>}
            </button>
          </span>
        </label>
        <button type="submit" disabled={enCours} className="ti-login-submit">
          {enCours?"Connexion en cours…":"Se connecter"}
        </button>
        {message&&<p role="alert" className="ti-login-status">{message}</p>}
      </form>}
      <div style={{borderTop:"1px solid #e3e9f3",paddingTop:22,marginTop:24,textAlign:"center",fontSize:14}}>
        Nouveau sur TOUT ICI MARKET ? <a href="/compte/inscription">Créer un compte</a>
      </div>
      <p style={{textAlign:"center",marginTop:20}}><a href="/"><ArrowLeft size={14} style={{verticalAlign:"middle",marginRight:5}}/>Retour à l'accueil</a></p>
    </div>
  </main>;
}
