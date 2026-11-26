"use client";
import {useEffect,useMemo,useState} from "react";
import {supabase} from "../lib/supabaseClient";
import {Search,Heart,MessageSquare,UserRound,Plus,House,CarFront,Ship,BriefcaseBusiness,Sofa,Tag,Home,Eye,CalendarDays,Lightbulb,ChevronDown,ChartNoAxesCombined} from "lucide-react";

type Ad={id:string;titre:string;prix:number|null;statut:string;photos:string[];created_at:string;source:"auto"|"marketplace";ville:string};
type Favorite={id:string;annonce_id:string};
type FavAd={id:string;marque?:string|null;modele?:string|null;titre?:string|null;prix:number|null;photos:string[]|null;ville:string|null};
type Daily={annonce_id:string;jour:string;vues:number;clics:number};
type Profile={nom:string|null;prenom:string|null;type_compte:string|null;created_at:string|null};
const isLive=(s:string)=>["publiee","publiée","en_ligne","en ligne","active","actif"].includes(s.toLowerCase());
const price=(v:number|null)=>v==null?"Prix non renseigné":Number(v).toLocaleString("fr-FR")+" €";
export default function MonCompte(){
 const [userId,setUserId]=useState("");const [email,setEmail]=useState("");const [person,setPerson]=useState<Profile|null>(null);const [avatarUrl,setAvatarUrl]=useState("");
 const [ads,setAds]=useState<Ad[]>([]);const [favCount,setFavCount]=useState(0);const [favorites,setFavorites]=useState<FavAd[]>([]);const [conversationCount,setConversationCount]=useState(0);const [savedCount,setSavedCount]=useState(0);const [stats,setStats]=useState<Daily[]>([]);
 const [busy,setBusy]=useState(true);const [issue,setIssue]=useState("");const [signingOut,setSigningOut]=useState(false);
 useEffect(()=>{let mounted=true;async function load(){
   try{
    const {data:{user}}=await supabase.auth.getUser();if(!mounted)return;
    if(!user){setBusy(false);return}
    setUserId(user.id);setEmail(user.email??"");const avatar=user.user_metadata?.avatar_url;setAvatarUrl(typeof avatar==="string"&&avatar.startsWith("https://")?avatar:"");
    const [profile,auto,market,favs,convos,saved,statistics]=await Promise.all([
      supabase.from("profiles").select("nom,prenom,type_compte,created_at").eq("id",user.id).maybeSingle(),
      supabase.from("annonces_auto").select("id,titre,marque,modele,prix,statut,photos,created_at,ville").eq("user_id",user.id).order("created_at",{ascending:false}).limit(150),
      supabase.from("annonces_marketplace").select("id,titre,prix,statut,photos,created_at,ville").eq("user_id",user.id).order("created_at",{ascending:false}).limit(150),
      supabase.from("favoris").select("id,annonce_id").eq("user_id",user.id).order("created_at",{ascending:false}).limit(100),
      supabase.from("conversations_auto").select("id",{count:"exact",head:true}).or("acheteur_id.eq."+user.id+",vendeur_id.eq."+user.id),
      supabase.from("recherches_sauvegardees").select("id",{count:"exact",head:true}).eq("user_id",user.id),
      supabase.rpc("mes_statistiques_annonces_auto")
    ]);
    if(!mounted)return;
    setPerson((profile.data??null) as Profile|null);
    const vehicles=(auto.data??[]).map((a:{id:string;titre:string|null;marque:string|null;modele:string|null;prix:number|null;statut:string;photos:string[]|null;created_at:string;ville:string|null})=>({id:a.id,titre:a.titre||[a.marque,a.modele].filter(Boolean).join(" ")||"Annonce véhicule",prix:a.prix,statut:a.statut,photos:a.photos??[],created_at:a.created_at,ville:a.ville??"",source:"auto" as const}));
    const others=(market.data??[]).map((a:{id:string;titre:string;prix:number|null;statut:string;photos:string[]|null;created_at:string;ville:string|null})=>({id:a.id,titre:a.titre,prix:a.prix,statut:a.statut,photos:a.photos??[],created_at:a.created_at,ville:a.ville??"",source:"marketplace" as const}));
    setAds([...vehicles,...others].sort((a,b)=>b.created_at.localeCompare(a.created_at)));
    setFavCount((favs.data??[]).length);setConversationCount(convos.count??0);setSavedCount(saved.count??0);
    setStats((statistics.data??[]) as Daily[]);
    const ids=(favs.data??[] as Favorite[]).map(x=>x.annonce_id).slice(0,8);
    if(ids.length){
      const {data}=await supabase.from("annonces_auto").select("id,marque,modele,titre,prix,photos,ville").eq("statut","publiee").in("id",ids);
      if(mounted)setFavorites((data??[]) as FavAd[]);
    } else setFavorites([]);
    if(auto.error||market.error||favs.error)setIssue("Certaines informations sont momentanément indisponibles.");
   }catch{if(mounted)setIssue("Impossible de charger toutes les données du compte.")}
   finally{if(mounted)setBusy(false)}
  }void load();return()=>{mounted=false}},[]);
 const online=useMemo(()=>ads.filter(a=>isLive(a.statut)),[ads]);
 const totalViews=stats.reduce((v,s)=>v+Number(s.vues??0),0);
 const adViews=(id:string)=>stats.filter(s=>s.annonce_id===id).reduce((n,s)=>n+Number(s.vues??0),0);
 const avgAge=ads.length?Math.round(ads.reduce((v,a)=>v+Math.max(0,Date.now()-new Date(a.created_at).getTime())/86400000,0)/ads.length):0;
 const displayName=[person?.prenom,person?.nom].filter(Boolean).join(" ")||email.split("@")[0]||"Mon compte";
 const initials=[person?.prenom?.[0],person?.nom?.[0]].filter(Boolean).join("").toUpperCase()||"👤";
 const isPro=["pro","professionnel","entreprise"].includes((person?.type_compte??"").toLowerCase());
 const menu=[
  {name:"Tableau de bord",href:"/compte",icon:"⌂",current:true},
  {name:"Mes favoris",href:"/favoris",icon:"♡"},
  {name:"Mes annonces",href:"/compte/annonces",icon:"▣"},
  {name:"Mes messages",href:"/compte/messages",icon:"▤",number:conversationCount},
  {name:"Mes alertes",href:"/compte/recherches",icon:"♧",number:savedCount},
  {name:"Mes avis",href:"",icon:"☆",disabled:true},
  {name:"Paiements / abonnements",href:"",icon:"▤",disabled:true},
  {name:"Paramètres",href:"/compte/profil",icon:"⚙"},
  {name:"Aide & support",href:"",icon:"ⓘ",disabled:true}
 ];
 async function logout(){setSigningOut(true);await supabase.auth.signOut();setUserId("");setSigningOut(false);window.location.href="/compte";}
 return <main className="tim-account-dashboard">
 <style>{`
 /* Only this account page: use the approved clean header without a duplicate brand logo. */
 body:has(.tim-account-dashboard) .tim-header .tim-logo{display:none!important}
 body:has(.tim-account-dashboard) .tim-header{background:#fff!important;color:#0a1e4f!important;border-bottom:1px solid #e8edf5;padding:11px 24px!important;gap:18px}
 body:has(.tim-account-dashboard) .tim-header .tim-home-search{background:#f7faff;border:1px solid #e1e9f5;max-width:570px;box-shadow:none}
 body:has(.tim-account-dashboard) .tim-header .tim-header-links a:not(.tim-post){color:#062d98}
 body:has(.tim-account-dashboard) .tim-header .tim-header-links .tim-post{background:#0d36bb!important;color:white!important;border-radius:9px}
 body:has(.tim-account-dashboard) .tim-navbar{background:#fff!important;border-bottom:1px solid #dfe8f3;padding:0 20px;justify-content:center;gap:10px}
 body:has(.tim-account-dashboard) .tim-navbar a{color:#092455!important;font-weight:800}
 body:has(.tim-account-dashboard) .tim-navbar a:hover{background:#eff4ff!important}
 body:has(.tim-account-dashboard) .tim-sidebar{display:none!important}
 body:has(.tim-account-dashboard) .tim-shell{display:block!important;max-width:1700px!important;width:100%!important;padding:0 12px!important;margin:0 auto!important}
 body:has(.tim-account-dashboard) .tim-content{width:100%!important;min-width:0!important}
 .tim-account-dashboard{color:#0a1c49;font-family:Arial,Helvetica,sans-serif;padding:14px 0 30px}
body:has(.tim-account-dashboard)>.tim-header,body:has(.tim-account-dashboard)>.tim-navbar{display:none!important}
.tim-account-dashboard .account-site-header{position:relative;left:50%;transform:translateX(-50%);width:100vw;margin-top:-14px;background:#061d4c;color:white;z-index:5}
.tim-account-dashboard .account-topbar{height:76px;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:0 clamp(16px,3.2vw,55px);max-width:1920px;margin:auto}
.tim-account-dashboard .account-brand{display:flex;align-items:center;gap:9px;flex:none;text-decoration:none;color:white;white-space:nowrap}
.tim-account-dashboard .account-brand-logo{display:block;width:clamp(165px,18vw,245px);max-height:54px;height:auto;object-fit:contain;object-position:left center}
.tim-account-dashboard .account-brand-main{font-weight:900;letter-spacing:-.045em;font-size:clamp(23px,2.3vw,32px);line-height:1}
.tim-account-dashboard .account-brand-main em{font-size:.8em;color:#ffcc00;font-style:italic;font-weight:700;letter-spacing:-.05em}
.tim-account-dashboard .account-search{flex:1;max-width:490px;min-width:130px;height:37px;border-radius:10px;background:white;display:flex;align-items:center;gap:10px;color:#122654;padding:0 12px}
.tim-account-dashboard .account-search input{min-width:0;width:100%;border:0;background:transparent;outline:0;color:#213d6a;font-size:13px}
.tim-account-dashboard .account-top-actions{display:flex;align-items:center;gap:24px;white-space:nowrap}
.tim-account-dashboard .account-top-actions a{display:inline-flex;align-items:center;gap:6px;color:white;font-size:13px;font-weight:750}
.tim-account-dashboard .account-top-actions .account-post{background:#ffd005;color:#061e4c;border-radius:7px;padding:11px 16px;font-weight:900}
.tim-account-dashboard .account-top-actions .account-post:hover{background:#ffe16a}
.tim-account-dashboard .account-catnav{height:44px;background:#fff;border-bottom:1px solid #dde6f2;display:flex;align-items:center;justify-content:space-around;gap:6px;padding:0 24px;overflow-x:auto}
.tim-account-dashboard .account-catnav a{color:#0c2354;font-size:13px;font-weight:800;display:inline-flex;align-items:center;gap:10px;white-space:nowrap;padding:9px}
.tim-account-dashboard .account-catnav .separator{width:1px;height:24px;background:#dbe4f2;flex-shrink:0}
.tim-account-dashboard .account-catnav svg{color:#0b2759}
@media(max-width:1100px){.tim-account-dashboard .account-top-actions{gap:10px}.tim-account-dashboard .account-top-actions a{font-size:11px}.tim-account-dashboard .account-brand-main{font-size:23px}}
@media(max-width:760px){.tim-account-dashboard .account-topbar{height:auto;min-height:76px;flex-wrap:wrap;padding:10px}.tim-account-dashboard .account-brand-logo{width:175px;max-height:64px}.tim-account-dashboard .account-brand-main{font-size:22px}.tim-account-dashboard .account-search{order:3;max-width:none;flex-basis:100%;height:40px}.tim-account-dashboard .account-catnav{justify-content:flex-start;padding:0 6px}.tim-account-dashboard .account-top-actions span.action-label{display:none}.tim-account-dashboard .account-top-actions{margin-left:auto}.tim-account-dashboard .account-top-actions .account-post{padding:9px}}

 .tim-account-dashboard *{box-sizing:border-box}
 .tim-account-dashboard a{text-decoration:none;color:inherit}
 .tim-account-dashboard .dash-hero{position:relative;background:linear-gradient(90deg,#f8fbfffa 0%,#f8fbfff4 25%,#f8fbffb0 42%,#f8fbff10 75%),url('/compte/paysage-reference.svg') center/cover;border-radius:20px;min-height:234px;padding:22px 40px;display:grid;grid-template-columns:1fr minmax(360px,550px);gap:25px;align-items:center;margin-bottom:16px;overflow:hidden}
 .tim-account-dashboard .dash-hero h1{font-size:clamp(34px,4vw,47px);margin:0 0 12px;font-weight:900;color:#061a49}
 .tim-account-dashboard .dash-hero p{max-width:390px;font-size:17px;line-height:1.55;margin:0}
 .tim-account-dashboard .identity{display:flex;align-items:center;gap:18px;border:1px solid #e0e6f0;border-radius:16px;background:#fffffff4;box-shadow:0 4px 14px #11284c20;padding:26px}
 .tim-account-dashboard .avatar{width:96px;height:96px;border-radius:50%;background:#0b358f;color:white;display:grid;place-items:center;font-size:30px;font-weight:900;flex-shrink:0;object-fit:cover}
 .tim-account-dashboard .dash-nav .disabled{display:flex;align-items:center;gap:12px;padding:13px 12px;color:#51627f;font-size:14px;font-weight:750}
 .tim-account-dashboard .dash-nav .soon{font-size:10px;margin-left:auto;color:#7a8aa0}
 .tim-account-dashboard .identity .id-small .verified{color:#087b44;font-weight:700}
 .tim-account-dashboard .sign-in-notice{margin:0 0 15px;border:1px solid #d5e0f6;border-radius:14px;background:#fff;padding:19px 24px;display:flex;align-items:center;justify-content:space-between;gap:14px}
 .tim-account-dashboard .sign-in-notice a{background:#ffcf06;border-radius:10px;padding:12px 18px;font-weight:850;font-size:13px;white-space:nowrap}
 .tim-account-dashboard .identity h2{margin:0 0 6px;font-size:23px}
 .tim-account-dashboard .identity .id-small{font-size:12px;color:#4f6281;line-height:1.6}
 .tim-account-dashboard .profile-controls{display:flex;flex-direction:column;gap:10px;margin-left:auto;align-items:stretch}
 .tim-account-dashboard .profile-link{display:block;border:1px solid #abc0e4;padding:11px 12px;border-radius:8px;font-weight:800;color:#1643a0;font-size:12px;white-space:nowrap;text-align:center;background:#fff}
 .tim-account-dashboard .profile-link:hover{background:#edf4ff}
 .tim-account-dashboard .workarea{display:grid;grid-template-columns:270px minmax(0,1fr);gap:20px}
 .tim-account-dashboard .dash-nav{border:1px solid #dfe7f3;background:#fff;border-radius:16px;padding:14px;align-self:start;display:flex;flex-direction:column;gap:7px;min-height:550px}
 .tim-account-dashboard .dash-nav a{display:flex;align-items:center;gap:12px;padding:13px 12px;border-radius:10px;font-size:14px;font-weight:750}
.tim-account-dashboard .dash-nav .disabled{padding:13px 12px;color:#092455;font-weight:750;cursor:default}
.tim-account-dashboard .dash-nav .disabled .soon{display:none}
 .tim-account-dashboard .dash-nav a.active{background:#e8efff;color:#0744bb}
 .tim-account-dashboard .dash-nav a:hover,.tim-account-dashboard .dash-nav a:focus-visible{background:#f0f5ff}
 .tim-account-dashboard .dash-nav .symbol{font-size:22px;display:block;width:26px;text-align:center;color:#0b42b5}
 .tim-account-dashboard .dash-nav .count{margin-left:auto;background:#0b3cc5;color:white;border-radius:14px;font-size:11px;padding:3px 7px}
 .tim-account-dashboard .work-content{min-width:0}
 .tim-account-dashboard .overview{font-size:14px;font-weight:900;margin:6px 0 13px}
 .tim-account-dashboard .stats-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px;margin-bottom:21px}
 .tim-account-dashboard .stat{display:flex;align-items:center;gap:12px;border:1px solid #e1e8f4;border-radius:12px;padding:16px 13px;background:#f7fbff;min-height:91px;min-width:0}
 .tim-account-dashboard .stat:nth-child(2){background:#f1fcf5}.tim-account-dashboard .stat:nth-child(3){background:#f8f6ff}.tim-account-dashboard .stat:nth-child(4){background:#fffaf0}.tim-account-dashboard .stat:nth-child(5){background:#f7faff}
 .tim-account-dashboard .stat-icon{display:grid;place-items:center;width:39px;height:39px;background:#ffffffcc;border-radius:50%;font-size:22px;flex-shrink:0}
 .tim-account-dashboard .stat b{font-size:24px;display:block;font-weight:900;line-height:1.15}
 .tim-account-dashboard .stat small{color:#4d607c;font-size:11px;line-height:1.45;display:block}
 .tim-account-dashboard .dash-columns{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(300px,1fr);gap:17px}
 .tim-account-dashboard .panel{border:1px solid #e1e8f1;background:white;border-radius:13px;padding:17px;margin-bottom:15px;min-width:0}
 .tim-account-dashboard .panel h2{font-size:17px;margin:0}
 .tim-account-dashboard .panel-header{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}
 .tim-account-dashboard .panel-header a{font-size:12px;color:#0d47ac;font-weight:850}
 .tim-account-dashboard .adrow{display:flex;align-items:center;gap:11px;padding:12px 0;border-bottom:1px solid #e7edf5}
 .tim-account-dashboard .adrow .adtext{max-width:260px}
 .tim-account-dashboard .account-admetrics{min-width:105px;display:grid;gap:6px;font-size:11px}
 .tim-account-dashboard .account-admetrics span{display:flex;align-items:center;gap:6px}
 .tim-account-dashboard .ad-actions{margin-left:auto}
 @media(max-width:1040px){.tim-account-dashboard .account-admetrics{display:none}}

 .tim-account-dashboard .adrow:last-child{border:0}
 .tim-account-dashboard .adrow img{width:124px;height:78px;object-fit:cover;border-radius:9px}
 .tim-account-dashboard .picture-empty{width:105px;height:69px;flex-shrink:0;display:grid;place-items:center;background:#eaf1fa;border-radius:9px}
 .tim-account-dashboard .adtext{flex:1;min-width:0}
 .tim-account-dashboard .adtext strong{font-size:14px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
 .tim-account-dashboard .adtext b{display:block;font-size:14px;color:#0a3fbc;margin:5px 0}
 .tim-account-dashboard .adtext small{font-size:11px;color:#526682}
 .tim-account-dashboard .ad-actions{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
 .tim-account-dashboard .ad-actions a{border:1px solid #c8d6ed;border-radius:8px;padding:9px 10px;font-size:12px;color:#08439f;font-weight:850}
 .tim-account-dashboard .ad-actions a:hover{background:#f1f6ff}
 .tim-account-dashboard .favgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}
 .tim-account-dashboard .fav-card{border:1px solid #e0e8f3;border-radius:10px;overflow:hidden;min-width:0}
 .tim-account-dashboard .fav-card img{height:112px;object-fit:cover;width:100%;display:block}
.tim-account-dashboard .fav-card{box-shadow:0 1px 5px #071d3710}
.tim-account-dashboard .fav-card strong{font-weight:850}
 .tim-account-dashboard .fav-card div{padding:9px}
 .tim-account-dashboard .fav-card strong{display:block;font-size:11px;line-height:1.4;min-height:30px}
 .tim-account-dashboard .fav-card b{font-size:12px;color:#0b44ae}
 .tim-account-dashboard .mia{background:linear-gradient(125deg,#ecfff1,#f8fffb);border:1px solid #d3ebd8;border-radius:13px;padding:18px;display:flex;gap:12px;align-items:center}
 .tim-account-dashboard .mia-symbol{font-size:36px;flex-shrink:0}
.tim-account-dashboard .mia-robot{height:123px;width:129px;object-fit:contain;align-self:flex-end;margin:-10px -8px -18px auto;mix-blend-mode:multiply}
.tim-account-dashboard .stat:nth-child(1) .stat-icon{color:#1042da;background:#eaf1ff}
.tim-account-dashboard .stat:nth-child(2) .stat-icon{color:#07904e;background:#eaf9ef}
.tim-account-dashboard .stat:nth-child(3) .stat-icon{color:#5d22c4;background:#f3edff}
.tim-account-dashboard .stat:nth-child(4) .stat-icon{color:#f0a000;background:#fff3e1}
.tim-account-dashboard .stat:nth-child(5) .stat-icon{color:#112c60;background:#eef4fb}
.tim-account-dashboard .stat:nth-child(2) b{color:#048847}
.tim-account-dashboard .stat:nth-child(3) b{color:#5022a4}
.tim-account-dashboard .stat:nth-child(4) b{color:#9f541c}
.tim-account-dashboard .dash-nav .symbol{display:grid!important;place-items:center}
.tim-account-dashboard .account-admetrics{min-width:95px;display:grid;gap:6px;font-size:11px;color:#0a2255}
.tim-account-dashboard .account-admetrics span{display:flex;align-items:center;gap:6px}

 .tim-account-dashboard .mia strong{font-size:17px;color:#057339}
 .tim-account-dashboard .mia p{font-size:12px;line-height:1.55}
 .tim-account-dashboard .empty{color:#50627b;font-size:13px;line-height:1.55}
 .tim-account-dashboard .trust{background:white;border:1px solid #e0e9f5;border-radius:12px;padding:15px 12px;margin-top:15px;color:#16419a;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px}
 .tim-account-dashboard .trust span{padding:5px 10px;border-right:1px solid #dfe7ef;font-size:19px;text-align:center}
 .tim-account-dashboard .trust span:last-child{border-right:0}
 .tim-account-dashboard .trust strong{display:block;font-size:11px;margin:5px 0}
 .tim-account-dashboard .trust small{display:block;font-size:10px;color:#445976}
 @media(max-width:1250px){.tim-account-dashboard .stats-grid{grid-template-columns:repeat(3,1fr)}.tim-account-dashboard .dash-columns{grid-template-columns:1fr}.tim-account-dashboard .fav-card img{height:135px}}
 @media(max-width:820px){body:has(.tim-account-dashboard) .tim-navbar{justify-content:flex-start}body:has(.tim-account-dashboard) .tim-header{flex-wrap:wrap}
 .tim-account-dashboard .dash-hero{grid-template-columns:1fr;padding:22px}.tim-account-dashboard .workarea{grid-template-columns:1fr}.tim-account-dashboard .dash-nav{flex-direction:row;overflow-x:auto;padding:7px;position:static}.tim-account-dashboard .dash-nav a{flex-shrink:0;font-size:12px;padding:10px}.tim-account-dashboard .dash-nav .symbol{font-size:17px;width:18px}.tim-account-dashboard .stats-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.tim-account-dashboard .trust{grid-template-columns:repeat(2,minmax(0,1fr))}.tim-account-dashboard .trust span{border-right:0}}
 @media(max-width:520px){.tim-account-dashboard .dash-hero{padding:17px;gap:15px}.tim-account-dashboard .identity{flex-wrap:wrap;padding:13px}.tim-account-dashboard .avatar{width:57px;height:57px}.tim-account-dashboard .profile-controls{margin-left:0;width:100%;flex-direction:row}.tim-account-dashboard .profile-link{flex:1;white-space:normal}.tim-account-dashboard .identity h2{font-size:17px}.tim-account-dashboard .stats-grid{gap:7px}.tim-account-dashboard .stat{padding:9px 7px;gap:6px}.tim-account-dashboard .stat b{font-size:19px}.tim-account-dashboard .stat-icon{height:30px;width:30px;font-size:17px}.tim-account-dashboard .adrow{flex-wrap:wrap}.tim-account-dashboard .ad-actions{margin-left:0;width:100%}.tim-account-dashboard .fav-card img{height:75px}}
 `}</style>
 <header className="account-site-header">
 <div className="account-topbar">
 <a className="account-brand" href="/" aria-label="Accueil TOUT ICI MARKET"><img className="account-brand-logo" src="/tout-ici-market-officiel.svg" alt="TOUT ICI MARKET — logo officiel" /></a>
 <form className="account-search" action="/automobile/voitures" role="search"><Search size={21}/><input name="q" type="search" aria-label="Rechercher une annonce" placeholder="Rechercher une annonce (voiture, appartement, bateau, …)" /></form>
 <nav className="account-top-actions" aria-label="Actions du compte"><a href="/favoris"><Heart size={21}/><span className="action-label">Favoris</span></a><a href="/compte/messages"><MessageSquare size={20}/><span className="action-label">Messages</span></a><a href="/compte"><UserRound size={20}/><span className="action-label">Mon compte</span></a><a href="/deposer" className="account-post"><Plus size={20}/><span className="action-label">Déposer une annonce</span></a></nav>
 </div>
 <nav className="account-catnav" aria-label="Rubriques"><a href="/" title="Accueil"><Home size={24}/></a><span className="separator"/><a href="/immobilier"><House size={22}/> Immobilier <ChevronDown size={14}/></a><span className="separator"/><a href="/automobile"><CarFront size={24}/> Automobile <ChevronDown size={14}/></a><span className="separator"/><a href="/deposer/nautisme"><Ship size={23}/> Nautisme &amp; Loisirs <ChevronDown size={14}/></a><span className="separator"/><a href="/emploi"><BriefcaseBusiness size={22}/> Emploi &amp; Services <ChevronDown size={14}/></a><span className="separator"/><a href="/maison-jardin"><Sofa size={23}/> Maison &amp; Loisirs <ChevronDown size={14}/></a><span className="separator"/><a href="/bon-plan"><Tag size={22}/> Bons plans <ChevronDown size={14}/></a></nav>
 </header>
 <section className="dash-hero"><div><h1>Mon compte</h1><p>Gérez facilement vos annonces, messages, recherches et favoris au même endroit.</p></div>
 <div className="identity">{avatarUrl&&userId?<img className="avatar" src={avatarUrl} alt="Photo du compte" referrerPolicy="no-referrer" />:<div className="avatar">{userId?initials:"♙"}</div>}<div style={{minWidth:0,flex:1}}><h2>{userId?displayName:"Votre espace personnel"}</h2><div className="id-small">{userId?(isPro?"Compte professionnel":"Compte particulier"):"Connectez-vous pour retrouver votre profil"}{userId&&<div>{email}</div>}{userId&&person?.created_at&&<div>Membre depuis {new Date(person.created_at).toLocaleDateString("fr-FR",{month:"long",year:"numeric"})}</div>}</div></div><div className="profile-controls"><a className="profile-link" href="/compte/profil">{userId?"✎ Modifier le profil":"Se connecter"}</a><a className="profile-link" href="/compte/profil">♧ Sécurité du compte</a></div></div>
 </section>
 {!userId&&!busy&&<section className="sign-in-notice"><div><strong>Connectez-vous à votre compte</strong><p style={{margin:"6px 0 0",fontSize:13}}>Le tableau de bord est prêt. Vos annonces, favoris et statistiques apparaîtront après connexion.</p></div><a href="/compte/profil">Se connecter →</a></section>}
 <div className="workarea"><nav className="dash-nav" aria-label="Menu de mon compte">
 {menu.map(x=>x.disabled?<div className="disabled" key={x.name}><span className="symbol">{x.icon}</span>{x.name}</div>:<a href={x.href} key={x.name} className={x.current?"active":""}><span className="symbol">{x.icon}</span>{x.name}{x.number? <span className="count">{x.number}</span>:null}</a>)}
 {userId&&<button type="button" disabled={signingOut} onClick={logout} style={{textAlign:"left",border:0,background:"transparent",color:"#c52222",padding:"13px 12px",cursor:"pointer",fontWeight:850}}>↪ Déconnexion</button>}
 </nav><div className="work-content"><div className="overview">Vue d’ensemble {isPro?"— Espace professionnel":""}</div>
 {issue&&<p role="status" style={{color:"#a34113"}}>{issue}</p>}
 <div className="stats-grid">
 <div className="stat"><span className="stat-icon"><Eye size={25}/></span><div><b>{userId?totalViews.toLocaleString("fr-FR"):"—"}</b><small>Vues de vos annonces</small></div></div>
 <div className="stat"><span className="stat-icon"><Heart size={25}/></span><div><b>{userId?favCount:"—"}</b><small>Mes favoris sauvegardés</small></div></div>
 <div className="stat"><span className="stat-icon"><MessageSquare size={24}/></span><div><b>{userId?conversationCount:"—"}</b><small>Conversations reçues</small></div></div>
 <div className="stat"><span className="stat-icon"><ChartNoAxesCombined size={24}/></span><div><b>—</b><small>Taux de réponse</small><small style={{color:"#4b9460",marginTop:5}}>À calculer</small></div></div>
 <div className="stat"><span className="stat-icon"><CalendarDays size={24}/></span><div><b>{userId?avgAge:"—"}</b><small>Jours d’ancienneté moyenne</small></div></div>
 </div>
 <div className="dash-columns">
 <section className="panel"><div className="panel-header"><h2>Mes annonces</h2><a href="/compte/annonces">Voir toutes mes annonces →</a></div>
 {ads.length===0?<p className="empty">{busy?"Chargement des annonces…":userId?"Vous n’avez pas encore déposé d’annonce.":"Connectez-vous pour retrouver les annonces que vous avez publiées."} <a href={userId?"/deposer":"/compte/profil"} style={{color:"#114bb9",fontWeight:900}}>{userId?"Déposer ma première annonce →":"Se connecter →"}</a></p>:ads.slice(0,5).map(a=><div className="adrow" key={a.source+a.id}>
 {a.photos?.[0]?<img src={a.photos[0]} alt="Photographie de l'annonce" />:<span className="picture-empty">📷</span>}
 <div className="adtext"><strong title={a.titre}>{a.titre}</strong><b>{price(a.prix)}</b><small>{isLive(a.statut)?"🟢 En ligne":a.statut} · {a.ville}</small>{a.source==="auto"&&<small style={{display:"block",marginTop:4}}>◉ {adViews(a.id).toLocaleString("fr-FR")} vues suivies</small>}</div>
 <div className="account-admetrics">{a.source==="auto"&&<span><Eye size={13}/> {adViews(a.id)} vues</span>}{a.source==="auto"&&<span><Heart size={13}/> Favoris : —</span>}<span><MessageSquare size={13}/> Contacts : —</span></div>
 <div className="ad-actions">{isLive(a.statut)&&<a href={a.source==="auto"?"/annonce/"+a.id:"/annonces/"+a.id}>Voir</a>}<a href="/compte/annonces">{a.source==="auto"?"Statistiques":"Gérer"}</a></div>
 </div>)}
 <div style={{textAlign:"center",paddingTop:13}}><a href="/compte/annonces" style={{color:"#1248b7",fontWeight:850,fontSize:13}}>Voir toutes mes annonces →</a></div>
 </section>
 <div style={{minWidth:0}}><section className="panel"><div className="panel-header"><h2>Mes favoris</h2><a href="/favoris">Voir tous mes favoris →</a></div>
 {favorites.length===0?<p className="empty">{busy?"Chargement des favoris…":userId?"Aucune annonce favorite disponible pour le moment.":"Connectez-vous pour retrouver vos favoris."}</p>:<div className="favgrid">{favorites.slice(0,3).map(a=><a className="fav-card" href={"/annonce/"+a.id} key={a.id}>{a.photos?.[0]?<img src={a.photos[0]} alt="Annonce favorite" />:<div style={{height:94,background:"#e8eff9",display:"grid",placeItems:"center"}}>📷</div>}<div><strong>{a.titre||[a.marque,a.modele].filter(Boolean).join(" ")||"Véhicule"}</strong><b>{price(a.prix)}</b></div></a>)}</div>}
 </section>
 <section className="mia"><div style={{flex:1}}><strong><Lightbulb size={18} style={{verticalAlign:"middle",marginRight:8}}/> Conseil MIA</strong><p>Votre annonce peut attirer davantage de contacts avec trois photos supplémentaires et une description plus précise.</p><a href="/compte/annonces" style={{display:"inline-block",background:"#008b44",padding:"10px 16px",borderRadius:7,color:"white",fontSize:12,fontWeight:850}}>Améliorer mon annonce ✦</a></div><img className="mia-robot" src="/compte/mia-robot-reference.svg" alt="Mascotte MIA" /></section>
 </div></div>
 <p style={{fontSize:11,color:"#68788f",margin:"8px 0"}}>* Statistiques disponibles pour les annonces automobiles depuis l’activation du suivi. Aucune statistique n’est inventée.</p>
 </div></div>
 <div className="trust"><span>♙ <strong>100 % GRATUIT</strong><small>pour les particuliers</small></span><span>♢ <strong>ANNONCES & FAVORIS</strong><small>Gérez vos publications</small></span><span>♧ <strong>ESPACE SÉCURISÉ</strong><small>Informations privées</small></span><span>♙ <strong>COMPTE PERSONNEL</strong><small>Vos recherches au même endroit</small></span><span>♧ <strong>MESSAGERIE</strong><small>Conversations privées</small></span></div>
 </main>;
}
