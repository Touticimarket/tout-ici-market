"use client";
import {useEffect,useState} from "react";
import {supabase} from "../lib/supabaseClient";
type Profile={nom:string;prenom:string;telephone:string;adresse:string;code_postal:string;ville:string};
const empty:Profile={nom:"",prenom:"",telephone:"",adresse:"",code_postal:"",ville:""};
export default function MonProfil(){
 const [email,setEmail]=useState("");const [userId,setUserId]=useState("");const [provider,setProvider]=useState("");
 const [profile,setProfile]=useState<Profile>(empty);const [status,setStatus]=useState("");const [saving,setSaving]=useState(false);const [password,setPassword]=useState("");
 useEffect(()=>{let mounted=true;async function load(){const {data:{user}}=await supabase.auth.getUser();if(!mounted)return;if(!user)return;setUserId(user.id);setEmail(user.email??"");setProvider(user.app_metadata?.provider??"");const {data}=await supabase.from("profiles").select("nom,prenom,telephone,adresse,code_postal,ville").eq("id",user.id).maybeSingle();if(mounted&&data)setProfile({nom:data.nom??"",prenom:data.prenom??"",telephone:data.telephone??"",adresse:data.adresse??"",code_postal:data.code_postal??"",ville:data.ville??""});}void load();const {data:sub}=supabase.auth.onAuthStateChange((_e,s)=>{if(!s?.user){setUserId("");setEmail("")}});return()=>{mounted=false;sub.subscription.unsubscribe()}},[]);
 async function connect(){const {error}=await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin+"/compte"}});if(error)setStatus(error.message)}
 async function save(){if(!userId)return;setSaving(true);setStatus("");const {error}=await supabase.from("profiles").upsert({id:userId,...profile,email},{onConflict:"id"});setStatus(error?"Enregistrement impossible : "+error.message:"Vos coordonnées ont été enregistrées.");setSaving(false)}
 async function changePassword(){if(password.length<8){setStatus("Choisissez un mot de passe d’au moins 8 caractères.");return;}const {error}=await supabase.auth.updateUser({password});setStatus(error?"Modification impossible : "+error.message:"Mot de passe modifié.");setPassword("")}
 const change=(key:keyof Profile,value:string)=>setProfile(x=>({...x,[key]:value}));
 const field=(label:string,key:keyof Profile)=><label className="account-field">{label}<input value={profile[key]} onChange={e=>change(key,e.target.value)} autoComplete={key==="prenom"?"given-name":key==="nom"?"family-name":key==="telephone"?"tel":key==="adresse"?"street-address":key==="code_postal"?"postal-code":"address-level2"} /></label>;
 return <main className="account-home">
 <style>{`
 body:has(.account-home) .tim-sidebar{background:#f8fbff}
 body:has(.account-home) .tim-sidebar-image{display:block;width:56px;height:43px;object-fit:cover;border-radius:8px;flex-shrink:0}
 body:has(.account-home) .tim-sidebar-icon{display:none}
 body:has(.account-home) .tim-sidebar-title{background:#edf3fc;color:#071c49;font-size:17px;padding:15px 10px}
 .account-home{color:#071c49;font-family:Arial,Helvetica,sans-serif}
 .account-home *{box-sizing:border-box}
 .account-hero{min-height:134px;display:flex;align-items:center;background:linear-gradient(90deg,#fff 0%,#ffffffed 38%,#ffffff00 68%),url('/auto-visuels/bandeau-auto-final.svg') center/cover;border-radius:14px;padding:20px 28px;margin-bottom:14px}
 .account-hero h1{font-size:clamp(30px,3.2vw,46px);margin:0;color:#06154b}
 .account-hero p{margin:8px 0;font-size:15px}
 .account-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr);gap:14px}
 .account-col{display:flex;flex-direction:column;gap:14px;min-width:0}
 .account-box{border:1px solid #d3def0;border-radius:17px;background:#fff;overflow:hidden;box-shadow:0 2px 7px #071d3710}
 .account-box h2{background:#f0f5ff;margin:0;padding:14px 19px;font-size:23px;color:#071b60}
 .account-box .inside{padding:18px 20px}
 .account-fields{display:grid;grid-template-columns:1fr 1fr;gap:13px}
 .account-field{display:flex;flex-direction:column;gap:6px;font-weight:700;font-size:14px}
 .account-field input{width:100%;min-width:0;padding:12px;border:1px solid #abbad0;border-radius:8px;font-size:15px}
 .account-field.wide{grid-column:1/-1}
 .account-action{background:#ffcc07;color:#071a44;border:0;border-radius:10px;padding:12px 19px;font-weight:900;cursor:pointer;text-decoration:none;display:inline-block}
 .account-subaction{display:inline-block;text-decoration:none;color:#09265d;font-weight:800;padding:12px 16px;background:#f0f5fe;border-radius:10px}
 .account-quicklinks{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px}
 .account-quicklinks a{border:1px solid #cad8e9;border-radius:15px;padding:18px;background:#fff;text-decoration:none;color:#091b51;font-weight:800;font-size:20px}
 .account-quicklinks small{display:block;font-size:13px;font-weight:400;color:#405471;margin-top:7px}
 .account-ad-links{display:flex;flex-wrap:wrap;gap:9px;margin:12px 0}
 @media(max-width:950px){.account-grid{grid-template-columns:1fr}}
 @media(max-width:500px){.account-fields,.account-quicklinks{grid-template-columns:1fr}.account-hero{background-position:center right}}
 `}</style>
 <div className="account-hero"><div><a href="/compte" style={{color:"#11409b",fontWeight:800}}>← Tableau de bord</a><h1>◉ Mon profil</h1><p>Gérez vos coordonnées et la sécurité de votre compte</p></div></div>
 {!userId?<section className="account-box"><h2>Connexion à votre espace</h2><div className="inside"><p>Connectez-vous pour gérer vos coordonnées, vos annonces et vos favoris.</p><button className="account-action" onClick={connect}>Se connecter avec Google</button></div></section>:<>
 <div className="account-grid">
  <section className="account-box"><h2>♙ Mes coordonnées</h2><div className="inside"><div className="account-fields">
  {field("Nom", "nom")}{field("Prénom","prenom")}
  <div style={{gridColumn:"1/-1"}}>{field("Téléphone","telephone")}</div>
  <div style={{gridColumn:"1/-1"}}>{field("Adresse","adresse")}</div>
  {field("Code postal","code_postal")}{field("Ville","ville")}
  <label className="account-field wide">Adresse e-mail<input type="email" value={email} readOnly aria-describedby="email-help"/></label>
  </div><p id="email-help" style={{fontSize:12,color:"#59677f"}}>L’adresse e-mail dépend de votre mode de connexion et ne se modifie pas depuis ce formulaire.</p>
  <button className="account-action" disabled={saving} onClick={save}>{saving?"Enregistrement…":"▣ Enregistrer mes coordonnées"}</button></div></section>
  <div className="account-col">
   <section className="account-box"><h2>♙ Sécurité du compte</h2><div className="inside"><p>{provider==="google"?"Votre connexion est gérée par Google. Le mot de passe Google se modifie dans votre compte Google.":"Vous pouvez modifier le mot de passe de ce compte."}</p>
    {provider!=="google"&&<div style={{display:"flex",gap:9,flexWrap:"wrap"}}><input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="new-password" aria-label="Nouveau mot de passe" placeholder="Nouveau mot de passe" style={{padding:12,borderRadius:9,border:"1px solid #aab9d0",minWidth:200}}/><button className="account-subaction" onClick={changePassword}>Modifier mon mot de passe</button></div>}</div></section>
   <section className="account-box"><h2>◈ Mes annonces</h2><div className="inside"><p>Retrouvez vos annonces en ligne, terminées ou archivées, avec leur historique et leurs statistiques.</p>
    <div className="account-ad-links"><a className="account-action" href="/compte/annonces">Voir mes annonces →</a><a className="account-subaction" href="/automobile/deposer">＋ Déposer une annonce</a></div>
   </div></section>
  </div>
 </div>
 <div className="account-quicklinks">
  <a href="/compte/recherches">⌕ Mes recherches enregistrées<small>Retrouvez vos recherches sauvegardées.</small></a>
  <a href="/favoris">♡ Mes annonces favorites<small>Consultez les annonces mises de côté.</small></a>
  <a href="/compte/messages">✉ Mes messages<small>Conversations privées avec acheteurs et vendeurs.</small></a>
 </div>
 <div style={{marginTop:18}}><button onClick={async()=>{await supabase.auth.signOut();setUserId("");setEmail("")}} className="account-subaction">Se déconnecter</button></div>
 </>}
 {status&&<p role="status" style={{padding:12,color:"#17427e"}}>{status}</p>}
 </main>
}