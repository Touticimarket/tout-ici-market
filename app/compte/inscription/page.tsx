"use client";

import {useState} from "react";
import {supabase} from "../../lib/supabaseClient";
import {ArrowLeft,CheckCircle2,Eye,EyeOff,LockKeyhole,Mail,UserRound} from "lucide-react";

export default function PageInscription(){
  const [prenom,setPrenom]=useState("");
  const [nom,setNom]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [confirmation,setConfirmation]=useState("");
  const [afficher,setAfficher]=useState(false);
  const [enCours,setEnCours]=useState(false);
  const [message,setMessage]=useState("");
  const [succes,setSucces]=useState(false);

  async function creerCompte(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    if(enCours)return;
    setMessage("");
    setSucces(false);
    if(!prenom.trim() || !nom.trim()){
      setMessage("Indiquez votre prénom et votre nom.");return;
    }
    if(password.length<8){
      setMessage("Choisissez un mot de passe d'au moins 8 caractères.");return;
    }
    if(password!==confirmation){
      setMessage("Les deux mots de passe ne correspondent pas.");return;
    }
    setEnCours(true);
    try{
      const {data,error}=await supabase.auth.signUp({
        email:email.trim().toLowerCase(),
        password,
        options:{
          emailRedirectTo:window.location.origin+"/compte/connexion",
          data:{first_name:prenom.trim(),last_name:nom.trim()}
        }
      });
      if(error){setMessage("Impossible de créer le compte : "+error.message);return;}
      setSucces(true);
      setPassword("");
      setConfirmation("");
      setMessage(data.session
        ?"Votre compte est créé et connecté. Vous pouvez commencer à préparer vos annonces."
        :"Inscription reçue. Consultez votre boîte e-mail et confirmez votre adresse avec le lien envoyé, si la confirmation est activée.");
    }catch{
      setMessage("Service momentanément indisponible. Réessayez plus tard.");
    }finally{setEnCours(false);}
  }
  return <main className="ti-auth">
    <style>{`
      .ti-auth{font-family:Arial,sans-serif;background:linear-gradient(135deg,#f3f7ff,#fffdf6);min-height:100vh;padding:108px 16px 70px;color:#0c2857}
      .ti-auth *{box-sizing:border-box}
      .ti-auth-card{max-width:530px;margin:0 auto;background:white;border:1px solid #e0e8f4;border-radius:22px;padding:36px 39px;box-shadow:0 18px 65px #123b7a16}
      .ti-auth-top{color:#0d4bb7;font-weight:800;letter-spacing:.8px;font-size:12px}
      .ti-auth h1{font-size:32px;margin:12px 0 8px;color:#09285d}
      .ti-auth-intro{color:#64738c;line-height:1.55;margin:0 0 25px;font-size:14px}
      .ti-auth-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}
      .ti-auth-label{display:block;font-size:13px;font-weight:800;color:#263957;margin-bottom:15px}
      .ti-auth-label input{width:100%;margin-top:8px;border:1px solid #cad7e9;border-radius:11px;padding:13px 14px;font:inherit;font-size:15px;color:#17345c;background:white}
      .ti-auth-label input:focus-visible{outline:2px solid #2073e5;outline-offset:2px}
      .ti-auth-password{position:relative}
      .ti-auth-password input{padding-right:50px}
      .ti-auth-password button{position:absolute;right:9px;top:15px;border:0;background:transparent;cursor:pointer;color:#49688d}
      .ti-auth-submit{width:100%;border:0;background:#ffcf25;color:#092857;border-radius:12px;padding:15px 20px;font-size:15px;font-weight:850;cursor:pointer}
      .ti-auth-submit:disabled{opacity:.65;cursor:wait}
      .ti-auth-status{font-size:13px;line-height:1.5;border-radius:11px;padding:13px 14px;margin:14px 0;color:#784a00;background:#fff5d8}
      .ti-auth-status.success{background:#e9f8ee;color:#166139}
      .ti-auth-divider{height:1px;background:#e6ecf4;margin:22px 0}
      .ti-auth-bottom{text-align:center;font-size:13px;color:#66768c}
      .ti-auth a{color:#0647b8;font-weight:750;text-decoration:none}
      .ti-auth a:hover{text-decoration:underline}
      @media(max-width:550px){.ti-auth-card{padding:26px 20px}.ti-auth-grid{grid-template-columns:1fr;gap:0}.ti-auth{padding-top:105px}}
    `}</style>
    <div className="ti-auth-card">
      <span className="ti-auth-top"><UserRound size={16} style={{verticalAlign:"middle",marginRight:6}}/> TOUT ICI MARKET · MON ESPACE</span>
      <h1>Créer un compte</h1>
      <p className="ti-auth-intro">Votre espace particulier pour préparer vos annonces, vendre et retrouver vos services TOUT ICI MARKET.</p>
      <form onSubmit={creerCompte}>
        <div className="ti-auth-grid">
          <label className="ti-auth-label">Prénom *
            <input autoComplete="given-name" value={prenom} onChange={e=>setPrenom(e.target.value)} required maxLength={80} placeholder="Votre prénom"/>
          </label>
          <label className="ti-auth-label">Nom *
            <input autoComplete="family-name" value={nom} onChange={e=>setNom(e.target.value)} required maxLength={80} placeholder="Votre nom"/>
          </label>
        </div>
        <label className="ti-auth-label">Adresse e-mail *
          <input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="vous@exemple.fr"/>
        </label>
        <label className="ti-auth-label">Mot de passe * (8 caractères minimum)
          <div className="ti-auth-password">
            <input type={afficher?"text":"password"} minLength={8} required autoComplete="new-password" value={password}
              onChange={e=>setPassword(e.target.value)} placeholder="Créer un mot de passe"/>
            <button type="button" aria-label={afficher?"Masquer le mot de passe":"Afficher le mot de passe"} onClick={()=>setAfficher(v=>!v)}>
              {afficher?<EyeOff size={19}/>:<Eye size={19}/>}
            </button>
          </div>
        </label>
        <label className="ti-auth-label">Confirmer le mot de passe *
          <input type={afficher?"text":"password"} autoComplete="new-password" required value={confirmation}
            onChange={e=>setConfirmation(e.target.value)} placeholder="Répéter le mot de passe"/>
        </label>
        <button className="ti-auth-submit" disabled={enCours} type="submit">
          {enCours?"Création en cours…":"Créer mon compte gratuitement"}
        </button>
        {message&&<p role="status" className={"ti-auth-status"+(succes?" success":"")}>
          {succes&&<CheckCircle2 size={16} style={{verticalAlign:"middle",marginRight:6}}/>}{message}
          {succes&&<> <a href="/compte/connexion">Accéder à la connexion</a></>}
        </p>}
      </form>
      <div className="ti-auth-divider"/>
      <div className="ti-auth-bottom"><LockKeyhole size={15} style={{verticalAlign:"middle",marginRight:5}}/> Vous avez déjà un compte ? <a href="/compte/connexion">Se connecter</a></div>
      <p className="ti-auth-bottom" style={{marginTop:18}}><a href="/"><ArrowLeft size={14} style={{verticalAlign:"middle",marginRight:5}}/>Retour à l'accueil</a></p>
    </div>
  </main>;
}
