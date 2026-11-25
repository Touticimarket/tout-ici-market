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
 {email&&<SellerStats/>}
 {email&&<button type="button" onClick={async()=>{await supabase.auth.signOut();setEmail("");}} style={{marginTop:24,border:"1px solid #bdcbe0",padding:12,borderRadius:10,background:"white",cursor:"pointer"}}>Se déconnecter</button>}
 </main>;
}
type DailyStats={annonce_id:string;jour:string;vues:number;clics:number};
type OwnAd={id:string;titre:string|null;marque:string|null;modele:string|null;created_at:string};
function SellerStats(){
 const [ads,setAds]=useState<OwnAd[]>([]);
 const [stats,setStats]=useState<DailyStats[]>([]);
 const [message,setMessage]=useState("Chargement des statistiques…");
 useEffect(()=>{let active=true;void(async()=>{
 const {data:{user}}=await supabase.auth.getUser();if(!user){if(active)setMessage("");return;}
 const [adResult,statsResult]=await Promise.all([
  supabase.from("annonces_auto").select("id,titre,marque,modele,created_at").eq("user_id",user.id).order("created_at",{ascending:false}).limit(100),
  supabase.rpc("mes_statistiques_annonces_auto")]);
 if(!active)return;
 if(adResult.error||statsResult.error){setMessage("Statistiques momentanément indisponibles.");return;}
 setAds((adResult.data??[]) as OwnAd[]);setStats((statsResult.data??[]) as DailyStats[]);setMessage("");
 })();return()=>{active=false}},[]);
 const dates=Array.from({length:7},(_,i)=>{const d=new Date();d.setUTCHours(12,0,0,0);d.setUTCDate(d.getUTCDate()-6+i);return d.toISOString().slice(0,10)});
 return <section style={{marginTop:32,background:"white",borderRadius:16,border:"1px solid #dae5f5",padding:22}}>
 <h2>📊 Statistiques de mes annonces automobiles</h2>
 <p style={{color:"#586980"}}>Visites des fiches et clics depuis les résultats, comptés par visiteur et par jour. Les chiffres commencent à la mise en service du suivi.</p>
 {message&&<p role="status">{message}</p>}
 {!message&&ads.length===0&&<p>Vous n'avez pas encore déposé d'annonce automobile.</p>}
 {ads.map(ad=>{
 const list=stats.filter(s=>s.annonce_id===ad.id);
 const totalVues=list.reduce((n,s)=>n+Number(s.vues||0),0);
 const totalClics=list.reduce((n,s)=>n+Number(s.clics||0),0);
 const daily=dates.map(jour=>({jour,vues:Number(list.find(s=>s.jour===jour)?.vues||0),clics:Number(list.find(s=>s.jour===jour)?.clics||0)}));
 const max=Math.max(1,...daily.map(d=>Math.max(d.vues,d.clics)));
 return <article key={ad.id} style={{borderTop:"1px solid #e2e9f4",paddingTop:20,marginTop:16}}>
 <h3>{ad.titre||[ad.marque,ad.modele].filter(Boolean).join(" ")||"Mon annonce automobile"}</h3>
 <div style={{display:"flex",gap:15,flexWrap:"wrap",marginBottom:16}}>
 <strong style={{color:"#073a81"}}>👁 {totalVues.toLocaleString("fr-FR")} vues</strong>
 <strong style={{color:"#935500"}}>☝ {totalClics.toLocaleString("fr-FR")} clics</strong>
 <a href={"/annonce/"+ad.id} style={{marginLeft:"auto"}}>Voir l'annonce →</a>
 </div>
 <div style={{display:"flex",gap:4,alignItems:"end",height:135,padding:"12px 3px",borderBottom:"1px solid #dce6f2"}}>
 {daily.map(d=><div key={d.jour} style={{flex:1,minWidth:0,display:"flex",alignItems:"end",justifyContent:"center",height:"100%",gap:3}}>
 <span title={d.vues+" vues le "+d.jour} style={{width:14,maxWidth:"40%",minHeight:d.vues?3:0,height:(d.vues/max*100)+"%",background:"#2466d3",borderRadius:"4px 4px 0 0"}}/>
 <span title={d.clics+" clics le "+d.jour} style={{width:14,maxWidth:"40%",minHeight:d.clics?3:0,height:(d.clics/max*100)+"%",background:"#ffcb13",borderRadius:"4px 4px 0 0"}}/>
 </div>)}
 </div>
 <div style={{display:"flex",gap:4,marginTop:5}}>{daily.map(d=><span key={d.jour} style={{flex:1,textAlign:"center",fontSize:11,color:"#51647d"}}>{new Date(d.jour+"T12:00:00").toLocaleDateString("fr-FR",{weekday:"short"})}</span>)}</div>
 <p style={{fontSize:12,color:"#51647d"}}>■ Bleu : vues · ■ Jaune : clics · 7 derniers jours (UTC)</p>
 </article>})}
 </section>;
}
