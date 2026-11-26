"use client";
import {useCallback,useEffect,useMemo,useState} from "react";
import {supabase} from "../../lib/supabaseClient";
import {Search,SlidersHorizontal,ChevronLeft,Heart,MoreVertical,Send,Paperclip,Image as ImageIcon,MapPin,Phone,ShieldCheck,Star,CalendarDays,Share2,Ban,Flag,Lightbulb,Check,Gift,LockKeyhole,UsersRound,Headset,MessageSquare,ArrowRight} from "lucide-react";

type Conversation={id:string;annonce_id:string;acheteur_id:string;vendeur_id:string;created_at:string};
type Message={id:string;conversation_id:string;auteur_id:string;contenu:string;created_at:string};
type Ad={id:string;titre:string|null;marque:string|null;modele:string|null;photos:string[]|null;prix:number|null;ville:string|null;created_at:string|null};
const clock=(value:string)=>new Date(value).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});
const dateShort=(value:string)=>new Date(value).toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric"});
export default function Messages(){
 const [userId,setUserId]=useState("");const [threads,setThreads]=useState<Conversation[]>([]);
 const [active,setActive]=useState("");const [messages,setMessages]=useState<Message[]>([]);
 const [ads,setAds]=useState<Record<string,Ad>>({});const [draft,setDraft]=useState("");
 const [search,setSearch]=useState("");const [filterUnread,setFilterUnread]=useState(false);
 const [status,setStatus]=useState("Chargement…");const [sending,setSending]=useState(false);
 const [favorites,setFavorites]=useState<string[]>([]);const [menuOpen,setMenuOpen]=useState(false);
 const [showSecurity,setShowSecurity]=useState(true);
 const loadThreads=useCallback(async()=>{
  const {data:{user}}=await supabase.auth.getUser();
  if(!user){setStatus("Connectez-vous pour retrouver vos conversations.");return;}
  setUserId(user.id);
  const {data,error}=await supabase.from("conversations_auto").select("id,annonce_id,acheteur_id,vendeur_id,created_at").or("acheteur_id.eq."+user.id+",vendeur_id.eq."+user.id).order("created_at",{ascending:false});
  if(error){setStatus("Impossible de charger vos conversations.");return;}
  const rows=(data??[]) as Conversation[];setThreads(rows);setStatus("");
  const requested=new URLSearchParams(window.location.search).get("conversation");
  if(rows.length)setActive(current=>current&&rows.some(x=>x.id===current)?current:requested&&rows.some(x=>x.id===requested)?requested:rows[0].id);
  if(!rows.length)return;
  const ids=[...new Set(rows.map(x=>x.annonce_id))];
  const {data:adRows}=await supabase.from("annonces_auto").select("id,titre,marque,modele,photos,prix,ville,created_at").in("id",ids);
  setAds(Object.fromEntries(((adRows??[]) as Ad[]).map(a=>[a.id,a])));
  const {data:favRows}=await supabase.from("favoris").select("annonce_id").eq("user_id",user.id).in("annonce_id",ids);
  setFavorites((favRows??[]).map((f:{annonce_id:string})=>f.annonce_id));
 },[]);
 const loadMessages=useCallback(async(id:string)=>{
  const {data,error}=await supabase.from("messages_auto").select("id,conversation_id,auteur_id,contenu,created_at").eq("conversation_id",id).order("created_at",{ascending:true}).limit(300);
  if(!error)setMessages((data??[]) as Message[]);
 },[]);
 useEffect(()=>{void loadThreads()},[loadThreads]);
 useEffect(()=>{if(!active)return;setMessages([]);void loadMessages(active);const timer=setInterval(()=>void loadMessages(active),12000);return()=>clearInterval(timer)},[active,loadMessages]);
 const selected=threads.find(t=>t.id===active);
 const ad=selected?ads[selected.annonce_id]:undefined;
 const adTitle=(a?:Ad)=>a?.titre||[a?.marque,a?.modele].filter(Boolean).join(" ")||"Annonce automobile";
 const filtered=useMemo(()=>threads.filter(t=>{const title=adTitle(ads[t.annonce_id]);return title.toLowerCase().includes(search.toLowerCase())&&(!filterUnread||t.id===active)}),[threads,ads,search,filterUnread,active]);
 const lastFor=(t:Conversation)=>t.id===active?messages[messages.length-1]:null;
 async function send(e:React.FormEvent){e.preventDefault();const content=draft.trim();if(!content||content.length>2000||!active||!userId)return;
  setSending(true);const {error}=await supabase.from("messages_auto").insert({conversation_id:active,auteur_id:userId,contenu:content});
  if(error)setStatus("Envoi impossible : "+error.message);else{setDraft("");setStatus("");await loadMessages(active)}setSending(false);
 }
 function quick(message:string){setDraft(message)}
 async function favorite(){if(!selected||!userId)return;const id=selected.annonce_id;
  if(favorites.includes(id)){const {error}=await supabase.from("favoris").delete().eq("user_id",userId).eq("annonce_id",id);if(!error)setFavorites(v=>v.filter(x=>x!==id));else setStatus("Impossible de modifier vos favoris.");}
  else{const {error}=await supabase.from("favoris").insert({user_id:userId,annonce_id:id});if(!error)setFavorites(v=>[...v,id]);else setStatus("Impossible d'ajouter aux favoris.");}
 }
 return <main className="tim-messages">
 <style>{`
 body:has(.tim-messages){background:#f9fbff!important}
 body:has(.tim-messages) .tim-shell{display:block!important;max-width:1850px!important;width:100%!important;padding:8px!important}
 body:has(.tim-messages) .tim-sidebar{display:none!important}
 body:has(.tim-messages) .tim-content{width:100%!important;min-width:0!important}
 .tim-messages{color:#10204c;font-family:Arial,Helvetica,sans-serif;padding:0 0 15px}
 .tim-messages *{box-sizing:border-box}
 .tim-messages button,.tim-messages input,.tim-messages textarea{font-family:inherit}
 .tim-messages button{cursor:pointer}
 .tim-messages .columns{display:grid;grid-template-columns:minmax(270px,27%) minmax(0,1fr) minmax(215px,19%);gap:10px;align-items:stretch}
 .tim-messages .panel{background:white;border:1px solid #e1e8f4;border-radius:14px;box-shadow:0 1px 8px #09234c0a;min-width:0}
 .tim-messages .thread-panel{overflow:hidden;display:flex;flex-direction:column}
 .tim-messages .side-title{font-size:17px;font-weight:900;margin:0 0 13px}
 .tim-messages .thread-top{padding:18px 14px 8px}
 .tim-messages .searchline{display:flex;gap:8px;align-items:center}
 .tim-messages .searchbox{display:flex;align-items:center;gap:8px;border:1px solid #d7e2f4;border-radius:8px;height:40px;padding:0 10px;flex:1;color:#8192b5}
 .tim-messages .searchbox input{border:0;outline:0;min-width:0;width:100%;font-size:12px;color:#132d5d}
 .tim-messages .icon-button{border:1px solid #e0e8f5;background:#fff;color:#133fbe;border-radius:9px;display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;flex:none}
 .tim-messages .threadlist{flex:1;overflow-y:auto;max-height:660px}
 .tim-messages .thread{width:100%;border:0;border-bottom:1px solid #e5eaf3;background:#fff;display:flex;gap:11px;padding:12px;text-align:left;color:#122048;min-height:82px}
 .tim-messages .thread.selected{background:#edf4ff;box-shadow:inset 3px 0 #638bfa}
 .tim-messages .thread:hover{background:#f4f8ff}
 .tim-messages .thread img,.tim-messages .fallback-picture{width:72px;height:66px;object-fit:cover;border-radius:9px;flex:none;background:#eaf1fd}
 .tim-messages .fallback-picture{display:grid;place-items:center;font-size:26px}
 .tim-messages .thread-copy{min-width:0;flex:1;display:flex;flex-direction:column;gap:5px}
 .tim-messages .thread-title{font-size:12px;font-weight:900;line-height:1.4;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}
 .tim-messages .thread-meta{font-size:11px;font-weight:750}
 .tim-messages .thread-preview{color:#50617f;font-size:11px;line-height:1.35;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2}
 .tim-messages .thread-date{font-size:10px;color:#7d8eac}
 .tim-messages .all-threads{border:1px solid #dce5f6;margin:10px 13px 13px;border-radius:9px;color:#2146d1;text-align:center;padding:11px;font-size:12px;font-weight:800}
 .tim-messages .chat-panel{display:flex;flex-direction:column;min-height:625px;overflow:hidden}
 .tim-messages .chat-head{display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid #e2e8f2;min-height:69px}
 .tim-messages .chat-head img{width:55px;height:48px;object-fit:cover;border-radius:8px}
 .tim-messages .chat-title{font-size:16px;font-weight:900;margin:0 0 5px}
 .tim-messages .chat-subtitle{font-size:11px;color:#8a99b5}
 .tim-messages .chat-space{background:linear-gradient(180deg,#fff,#fafcff);flex:1;min-height:390px;max-height:620px;overflow:auto;padding:19px 25px 25px}
 .tim-messages .day-label{display:table;margin:0 auto 18px;padding:8px 15px;border-radius:30px;background:#f7f9fd;border:1px solid #e6ebf4;color:#657493;font-size:11px;font-weight:750}
 .tim-messages .bubble-row{display:flex;justify-content:flex-start;margin:10px 0}
 .tim-messages .bubble-row.mine{justify-content:flex-end}
 .tim-messages .bubble{max-width:70%;min-width:120px;background:#fff;border:1px solid #e2e8f3;box-shadow:0 1px 5px #102d5010;border-radius:12px;padding:13px 15px;font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}
 .tim-messages .mine .bubble{background:#e8f0ff;border-color:#dce8ff}
 .tim-messages .bubble small{display:block;text-align:right;color:#788aab;font-size:10px;margin-top:7px}
 .tim-messages .composer{padding:12px 11px 11px;border-top:1px solid #e9eef6}
 .tim-messages .compose-line{display:flex;align-items:center;gap:9px}
 .tim-messages .compose-input{flex:1;min-width:0;display:flex;align-items:center;gap:8px;border:1px solid #dbe5f4;border-radius:22px;padding:5px 12px}
 .tim-messages .compose-input input{height:33px;flex:1;min-width:0;border:0;outline:none;font-size:13px}
 .tim-messages .round{width:41px;height:41px;border-radius:50%;border:1px solid #e1e7f4;display:grid;place-items:center;background:#fff;color:#234ac7;flex:none}
 .tim-messages .send{background:#093ad3;color:#fff;border:0}
 .tim-messages .send:disabled{background:#a4b5dc;cursor:not-allowed}
 .tim-messages .quick{display:flex;align-items:center;gap:7px;overflow-x:auto;margin-top:12px}
 .tim-messages .quick button{background:#fff;border:1px solid #dce5f3;border-radius:12px;color:#243b6b;padding:9px 11px;white-space:nowrap;font-size:11px}
 .tim-messages .right{display:flex;flex-direction:column;gap:12px}
 .tim-messages .right-card{padding:16px}
 .tim-messages .right-card h3{font-size:12px;margin:0 0 17px}
 .tim-messages .seller{display:flex;gap:10px;align-items:center}
 .tim-messages .seller-avatar{width:65px;height:65px;border-radius:50%;background:#e7eefc;display:grid;place-items:center;font-size:23px;font-weight:900;color:#123a93}
 .tim-messages .seller-name{font-size:14px;font-weight:900}
 .tim-messages .online{font-size:11px;color:#008f4a;display:block;margin-top:6px}
 .tim-messages .verified{display:flex;align-items:center;gap:7px;color:#078844;font-size:11px;font-weight:800;background:#eefaf1;border-radius:6px;padding:9px;margin:13px 0}
 .tim-messages .aside-text{font-size:11px;color:#7b8aab;margin:10px 0}
 .tim-messages .profile-action{display:block;text-decoration:none;text-align:center;color:#2049ce;border:1px solid #4669ff;border-radius:8px;padding:10px;font-size:12px;font-weight:800;margin-top:13px}
 .tim-messages .security{background:#f0fbf4;border-color:#d9eee0}
 .tim-messages .security h3{display:flex;gap:7px;align-items:center;color:#008b4a}
 .tim-messages .security p{display:flex;gap:8px;align-items:flex-start;font-size:11px;line-height:1.6;margin:11px 0}
 .tim-messages .security p svg{color:#00974a;flex:none}
 .tim-messages .security button{background:none;border:0;color:#078b43;padding:0;font-weight:850;font-size:11px}
 .tim-messages .action-item{display:flex;align-items:center;gap:10px;padding:9px 0;font-size:11px;color:#253b67;text-decoration:none}
 .tim-messages .trust{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));background:#fff;border:1px solid #e1e9f5;border-radius:12px;margin-top:10px;padding:11px 4px;max-width:calc(100% - 100px)}
 .tim-messages .trust>div{display:flex;align-items:center;gap:9px;justify-content:center;border-right:1px solid #e3eaf4;padding:7px 10px}
 .tim-messages .trust>div:last-child{border:0}
 .tim-messages .trust svg{color:#193cff;flex:none}
 .tim-messages .trust strong{display:block;font-size:11px}.tim-messages .trust small{font-size:10px}
 .tim-messages .mia-float{position:fixed;right:19px;bottom:14px;display:flex;align-items:center;flex-direction:column;z-index:3;text-decoration:none}
 .tim-messages .mia-float img{width:79px;height:79px;border-radius:50%;border:2px solid #00a84a;background:white;object-fit:cover}
 .tim-messages .mia-float span{background:#079f55;color:#fff;font-weight:900;border-radius:8px;padding:6px 25px}
 @media(max-width:1100px){.tim-messages .columns{grid-template-columns:minmax(225px,32%) minmax(0,1fr)}.tim-messages .right{grid-column:1/-1;display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}.tim-messages .trust{max-width:100%}}
 @media(max-width:700px){.tim-messages .columns{grid-template-columns:1fr}.tim-messages .chat-panel{min-height:510px}.tim-messages .threadlist{max-height:245px}.tim-messages .right{grid-template-columns:1fr}.tim-messages .trust{grid-template-columns:repeat(2,minmax(0,1fr))}.tim-messages .bubble{max-width:90%}.tim-messages .chat-space{padding:12px}.tim-messages .mia-float img{width:55px;height:55px}}
 `}</style>
 <div className="columns">
 <aside className="panel thread-panel"><div className="thread-top"><h1 className="side-title">Mes conversations</h1><div className="searchline"><label className="searchbox"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher une conversation" aria-label="Rechercher une conversation"/></label><button type="button" className="icon-button" aria-label="Filtrer les conversations" title="Afficher la conversation sélectionnée" onClick={()=>setFilterUnread(v=>!v)}><SlidersHorizontal size={18}/></button></div></div>
 <div className="threadlist">{filtered.length===0?<p style={{padding:15,fontSize:13,color:"#647494"}}>{status||"Aucune conversation disponible."}</p>:filtered.map(t=>{const item=ads[t.annonce_id];const last=lastFor(t);return <button type="button" key={t.id} className={"thread "+(active===t.id?"selected":"")} onClick={()=>setActive(t.id)}>{item?.photos?.[0]?<img src={item.photos[0]} alt="Annonce"/>:<span className="fallback-picture">🚘</span>}<span className="thread-copy"><span className="thread-title">{adTitle(item)}</span><span className="thread-meta">{t.vendeur_id===userId?"Acheteur":"Vendeur"} <span style={{color:"#00a150"}}>●</span></span><span className="thread-preview">{last?.contenu||"Afficher la conversation"}</span></span><span className="thread-date">{clock(last?.created_at||t.created_at)}</span></button>})}</div>
 <div className="all-threads"> <MessageSquare size={13} style={{verticalAlign:"middle",marginRight:6}}/> Toutes mes conversations</div></aside>
 <section className="panel chat-panel" aria-label="Conversation sélectionnée">
 <header className="chat-head"><a href="/compte" aria-label="Retour au compte" style={{color:"#183e8f"}}><ChevronLeft size={21}/></a>{ad?.photos?.[0]?<img src={ad.photos[0]} alt="Annonce"/>:null}<div style={{flex:1,minWidth:0}}><h2 className="chat-title">{selected?adTitle(ad):"Sélectionnez une conversation"}</h2><div className="chat-subtitle">{selected?"Annonce n°"+selected.annonce_id.slice(0,8)+(ad?.created_at?" • Publiée le "+dateShort(ad.created_at):""):"Vos échanges restent privés"}</div></div>{selected&&<><button className="icon-button" type="button" aria-label="Ajouter ou retirer des favoris" onClick={favorite}><Heart size={19} fill={favorites.includes(selected.annonce_id)?"#184cff":"none"}/></button><button type="button" className="icon-button" onClick={()=>setMenuOpen(v=>!v)} aria-label="Plus d’actions"><MoreVertical size={19}/></button></>}</header>
 {menuOpen&&<div style={{padding:"8px 18px",textAlign:"right",borderBottom:"1px solid #e0e9f5"}}><a href={selected?"/annonce/"+selected.annonce_id:"#"} style={{color:"#1b44b3",fontSize:12}}>Consulter l’annonce <ArrowRight size={13} style={{verticalAlign:"middle"}}/></a></div>}
 <div className="chat-space"><div className="day-label">Conversation</div>{!selected?<p style={{textAlign:"center",fontSize:13,color:"#7080a2"}}>{status||"Choisissez une conversation à gauche."}</p>:messages.length===0?<p style={{textAlign:"center",fontSize:13,color:"#7080a2"}}>Envoyez votre premier message.</p>:messages.map(m=><div className={"bubble-row "+(m.auteur_id===userId?"mine":"")} key={m.id}><div className="bubble">{m.contenu}<small>{clock(m.created_at)} {m.auteur_id===userId?"✓":""}</small></div></div>)}</div>
 <form className="composer" onSubmit={send}><div className="compose-line"><span className="round" title="Les pièces jointes seront disponibles ultérieurement"><Paperclip size={19}/></span><label className="compose-input"><input aria-label="Votre message" value={draft} onChange={e=>setDraft(e.target.value)} disabled={!selected} maxLength={2000} placeholder="Écrivez votre message..."/><ImageIcon size={19} color="#2449e6"/></label><span className="round" title="Partage de localisation bientôt disponible"><MapPin size={18}/></span><span className="round" title="Appels bientôt disponibles"><Phone size={18}/></span><button type="submit" className="round send" disabled={!selected||sending||!draft.trim()} aria-label="Envoyer le message"><Send size={19}/></button></div><div className="quick">{["Message rapide","Bonjour, le bien est-il toujours disponible ?","Je suis intéressé(e)","Pouvez-vous baisser le prix ?"].map((x,i)=><button type="button" key={x} onClick={()=>quick(i===0?"Bonjour, votre annonce est-elle toujours disponible ?":x)}>{x}</button>)}</div></form>
 </section>
 <aside className="right"><section className="panel right-card"><h3>À propos de cet utilisateur</h3><div className="seller"><div className="seller-avatar">👤</div><div><span className="seller-name">{selected?"Votre interlocuteur":"Utilisateur"}</span><span className="online">● Conversation privée</span></div></div><div className="verified"><ShieldCheck size={17}/> Messagerie sécurisée du site</div><p className="aside-text">Les informations personnelles de votre interlocuteur ne sont pas publiques.</p><a className="profile-action" href={selected?"/annonce/"+selected.annonce_id:"/compte"}>Voir l'annonce</a></section>
 <section className="panel right-card security"><h3><ShieldCheck size={23}/> Conseils sécurité MIA</h3>{showSecurity&&<><p><Check size={15}/> Ne payez jamais avant d'avoir vu le bien et vérifié son état.</p><p><Check size={15}/> Privilégiez les rencontres dans des lieux publics et fréquentés.</p><p><Check size={15}/> Méfiez-vous des offres trop belles pour être vraies.</p></>}<button type="button" onClick={()=>setShowSecurity(v=>!v)}>{showSecurity?"Masquer les conseils":"Voir tous nos conseils"} →</button></section>
 <section className="panel right-card"><h3>Actions</h3><button className="action-item" type="button" style={{border:0,background:"transparent",width:"100%",textAlign:"left"}} onClick={()=>{if(selected)void navigator.clipboard.writeText(window.location.origin+"/annonce/"+selected.annonce_id)}}><Share2 size={17}/> Partager cette annonce</button><p className="action-item"><Ban size={17}/> Blocage : bientôt disponible</p><p className="action-item" style={{color:"#c52c35"}}><Flag size={17}/> Signalement : bientôt disponible</p></section></aside>
 </div>
 {status&&<p role="status" style={{fontSize:12,color:"#af412d",padding:"5px 12px"}}>{status}</p>}
 <div className="trust"><div><Gift size={27}/><span><strong>100% GRATUIT</strong><small>pour les particuliers</small></span></div><div><ShieldCheck size={27}/><span><strong>ANNONCES À VÉRIFIER</strong><small>avant toute transaction</small></span></div><div><LockKeyhole size={27}/><span><strong>MESSAGERIE PRIVÉE</strong><small>dans votre compte</small></span></div><div><UsersRound size={27}/><span><strong>COMMUNAUTÉ TOUT ICI</strong><small>acheteurs et vendeurs</small></span></div><div><Headset size={27}/><span><strong>CONSEILS SÉCURITÉ</strong><small>à votre disposition</small></span></div></div>
 <a href="/compte" className="mia-float" aria-label="MIA - Retour à mon compte"><img src="/compte/mia-robot-reference.svg" alt="MIA"/><span>MIA</span></a>
 </main>;
}
