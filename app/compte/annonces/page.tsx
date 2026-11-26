"use client";
import {useEffect,useMemo,useState} from "react";
import {supabase} from "../../lib/supabaseClient";
type Ad={id:string;titre:string;prix:number|null;statut:string;photos:string[];created_at:string;origine:"auto"|"marketplace"|"annonces"};
type Daily={annonce_id:string;jour:string;vues:number;clics:number};
const active=["publiee","publiée","en_ligne","en ligne","active","actif"];
const archive=["archivee","archivée","archive","archivé"];
export default function MesAnnonces(){
 const [ads,setAds]=useState<Ad[]>([]);const [stats,setStats]=useState<Daily[]>([]);
 const [tab,setTab]=useState("en_ligne");const [selected,setSelected]=useState("");
 const [msg,setMsg]=useState("Chargement…");const [authenticated,setAuthenticated]=useState(false);
 useEffect(()=>{let ok=true;void(async()=>{
 const {data:{user}}=await supabase.auth.getUser();if(!user){if(ok)setMsg("Connectez-vous pour consulter vos annonces.");return;}
 if(ok)setAuthenticated(true);
 const [a,m,g,st]=await Promise.all([
 supabase.from("annonces_auto").select("id,titre,marque,modele,prix,statut,photos,created_at").eq("user_id",user.id).order("created_at",{ascending:false}).limit(300),
 supabase.from("annonces_marketplace").select("id,titre,prix,statut,photos,created_at").eq("user_id",user.id).order("created_at",{ascending:false}).limit(300),
 supabase.from("annonces").select("id,titre,prix,statut,created_at").eq("user_id",user.id).order("created_at",{ascending:false}).limit(300),
 supabase.rpc("mes_statistiques_annonces_auto")
 ]);
 if(!ok)return;
 const auto=((a.data??[]) as Array<{id:string;titre:string|null;marque:string|null;modele:string|null;prix:number|null;statut:string|null;photos:string[]|null;created_at:string}>).map(x=>({id:x.id,titre:x.titre||[x.marque,x.modele].filter(Boolean).join(" ")||"Annonce automobile",prix:x.prix,statut:x.statut??"brouillon",photos:x.photos??[],created_at:x.created_at,origine:"auto" as const}));
 const market=((m.data??[]) as Array<{id:string;titre:string|null;prix:number|null;statut:string|null;photos:string[]|null;created_at:string}>).map(x=>({id:x.id,titre:x.titre||"Annonce",prix:x.prix,statut:x.statut??"brouillon",photos:x.photos??[],created_at:x.created_at,origine:"marketplace" as const}));
 const general=((g.data??[]) as Array<{id:string;titre:string|null;prix:number|null;statut:string|null;created_at:string}>).map(x=>({id:x.id,titre:x.titre||"Annonce",prix:x.prix,statut:x.statut??"brouillon",photos:[],created_at:x.created_at,origine:"annonces" as const}));
 setAds([...auto,...market,...general].sort((x,y)=>y.created_at.localeCompare(x.created_at)));
 setStats((st.data??[]) as Daily[]);
 setMsg(a.error||m.error||g.error?"Certaines annonces ne sont pas encore accessibles.":"");
 })();return()=>{ok=false}},[]);
 const statusTab=(s:string)=>{const v=s.toLowerCase();if(active.includes(v))return "en_ligne";if(archive.includes(v))return "archivees";if(["vendue","vendu","terminee","terminée","expiree","expirée","desactivee","désactivée"].includes(v))return "terminees";return "brouillons"};
 const visible=useMemo(()=>ads.filter(x=>statusTab(x.statut)===tab),[ads,tab]);
 const selectedAd=ads.find(x=>x.id===selected);
 const daily=stats.filter(x=>x.annonce_id===selected);
 const days=Array.from({length:7},(_,i)=>{const d=new Date();d.setUTCHours(12,0,0,0);d.setUTCDate(d.getUTCDate()-6+i);return d.toISOString().slice(0,10)});
 const totalVues=daily.reduce((n,x)=>n+Number(x.vues),0),totalClics=daily.reduce((n,x)=>n+Number(x.clics),0);
 const graph=days.map(jour=>({jour,vues:Number(daily.find(x=>x.jour===jour)?.vues??0),clics:Number(daily.find(x=>x.jour===jour)?.clics??0)})),max=Math.max(1,...graph.map(x=>Math.max(x.vues,x.clics)));
 return <main className="ads-account">
 <style>{`
 body:has(.ads-account) .tim-sidebar-image{display:block;width:51px;height:40px;object-fit:cover;border-radius:8px}
 body:has(.ads-account) .tim-sidebar-icon{display:none}
 .ads-account{font-family:Arial,Helvetica,sans-serif;color:#0a2057}
 .ads-account *{box-sizing:border-box}
 .ads-account .top{background:linear-gradient(90deg,#fff 0%,#fffffff2 42%,#ffffff00 76%),url('/auto-visuels/bandeau-auto-final.svg') center/cover;padding:20px;border-radius:15px;min-height:130px}
 .ads-account h1{font-size:36px;margin:6px 0}
 .ads-account .tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:13px 0}
 .ads-account .tabs button{background:#edf2fb;border:1px solid #cbd9ef;padding:13px 8px;border-radius:10px;font-weight:800;color:#092452;cursor:pointer}
 .ads-account .tabs .chosen{background:#ffcf06}
 .ads-account .panel{border:1px solid #d9e3f0;border-radius:15px;background:white;padding:15px;margin-bottom:14px}
 .ads-account .adrow{display:flex;align-items:center;gap:15px;padding:12px 4px;border-bottom:1px solid #e1e7ef}
 .ads-account .adrow:last-child{border:0}
 .ads-account .adrow img{width:120px;height:75px;object-fit:cover;border-radius:9px}
 .ads-account .adrow button{border:1px solid #bccbe4;background:white;padding:9px 12px;border-radius:9px;font-weight:700;color:#093677;cursor:pointer}
 .ads-account .status{border-radius:20px;background:#e4f7e8;padding:6px 10px;font-size:12px;font-weight:800}
 .ads-account .charts{display:flex;gap:16px;flex-wrap:wrap}
 .ads-account .charts strong{font-size:22px}
 @media(max-width:650px){.ads-account .tabs{grid-template-columns:repeat(2,1fr)}.ads-account .adrow{flex-wrap:wrap}}
 `}</style>
 <div className="top"><a href="/compte">← Mon compte</a><h1>◈ Mes annonces</h1><p>Gérez vos annonces, retrouvez leur historique et suivez leur audience.</p></div>
 {!authenticated?<div className="panel" role="status">{msg} <a href="/compte">Mon compte</a></div>:<>
 <div className="tabs">{[{key:"en_ligne",label:"✓ En ligne"},{key:"terminees",label:"◉ Terminées"},{key:"archivees",label:"▣ Archivées"},{key:"brouillons",label:"▤ Brouillons"}].map(x=><button key={x.key} className={tab===x.key?"chosen":""} onClick={()=>{setTab(x.key);setSelected("")}}>{x.label} ({ads.filter(a=>statusTab(a.statut)===x.key).length})</button>)}</div>
 <div className="panel">{msg&&<p role="status">{msg}</p>}
 {!visible.length?<p>Aucune annonce dans cette rubrique.</p>:visible.map(ad=><div className="adrow" key={ad.origine+ad.id}>
 {ad.photos?.[0]?<img src={ad.photos[0]} alt="Photo de l'annonce"/>:<span style={{width:120,height:75,display:"grid",placeItems:"center",background:"#edf4fc",borderRadius:8}}>📷</span>}
 <div style={{flex:1,minWidth:170}}><strong>{ad.titre}</strong><p style={{margin:"5px 0",fontSize:13}}>{ad.prix==null?"Prix non renseigné":ad.prix.toLocaleString("fr-FR")+" €"} · {new Date(ad.created_at).toLocaleDateString("fr-FR")}</p></div>
 <span className="status">{ad.statut}</span>
 {ad.origine==="auto"&&<button type="button" onClick={()=>setSelected(ad.id)}>▥ Statistiques</button>}
 {ad.origine==="auto"&&statusTab(ad.statut)==="en_ligne"&&<a href={"/annonce/"+ad.id}>Voir →</a>}
 {ad.origine==="marketplace"&&statusTab(ad.statut)==="en_ligne"&&<a href={"/annonces/"+ad.id}>Voir →</a>}
 </div>)}</div>
 {selectedAd&&<section className="panel"><h2>Statistiques : {selectedAd.titre}</h2><p>Les visites et clics sont comptabilisés depuis l’activation du suivi.</p>
 <div className="charts"><strong>👁 {totalVues.toLocaleString("fr-FR")} vues</strong><strong>☝ {totalClics.toLocaleString("fr-FR")} clics</strong></div>
 <div style={{display:"flex",alignItems:"end",height:160,gap:5,borderBottom:"1px solid #d9e4ef",marginTop:18}}>
 {graph.map(x=><div key={x.jour} style={{flex:1,height:"100%",display:"flex",alignItems:"end",justifyContent:"center",gap:3}}>
 <div title={x.vues+" vues"} style={{width:20,height:(x.vues/max*100)+"%",background:"#2567d0",borderRadius:"4px 4px 0 0"}}/>
 <div title={x.clics+" clics"} style={{width:20,height:(x.clics/max*100)+"%",background:"#ffcb12",borderRadius:"4px 4px 0 0"}}/>
 </div>)}
 </div><div style={{display:"flex"}}>{graph.map(x=><span key={x.jour} style={{flex:1,fontSize:11,textAlign:"center"}}>{new Date(x.jour+"T12:00:00").toLocaleDateString("fr-FR",{weekday:"short"})}</span>)}</div><p style={{fontSize:12}}>■ Bleu : vues · ■ Jaune : clics · 7 derniers jours</p></section>}
 </>}
 </main>;
}