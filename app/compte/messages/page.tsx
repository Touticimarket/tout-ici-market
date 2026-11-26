"use client";
import {useEffect,useState} from "react";
import {useSearchParams} from "next/navigation";
import {supabase} from "../../lib/supabaseClient";
type Conversation={id:string;annonce_id:string;acheteur_id:string;vendeur_id:string;created_at:string};
type Message={id:string;conversation_id:string;auteur_id:string;contenu:string;created_at:string};
export default function Messages(){
 const query=useSearchParams();const requested=query.get("conversation");
 const [userId,setUserId]=useState("");const [threads,setThreads]=useState<Conversation[]>([]);
 const [active,setActive]=useState("");const [messages,setMessages]=useState<Message[]>([]);
 const [titles,setTitles]=useState<Record<string,string>>({});const [draft,setDraft]=useState("");const [status,setStatus]=useState("Chargement…");const [sending,setSending]=useState(false);
 async function loadThreads(){
  const {data:{user}}=await supabase.auth.getUser();if(!user){setStatus("Connectez-vous pour consulter vos messages.");return;}
  setUserId(user.id);
  const {data,error}=await supabase.from("conversations_auto").select("id,annonce_id,acheteur_id,vendeur_id,created_at").or("acheteur_id.eq."+user.id+",vendeur_id.eq."+user.id).order("created_at",{ascending:false});
  if(error){setStatus("Impossible de lire vos conversations.");return;}
  const rows=(data??[]) as Conversation[];setThreads(rows);setStatus("");
  if(rows.length){setActive(current=>current&&rows.some(x=>x.id===current)?current:requested&&rows.some(x=>x.id===requested)?requested:rows[0].id);
    const ids=[...new Set(rows.map(x=>x.annonce_id))];
    const {data:ads}=await supabase.from("annonces_auto").select("id,titre,marque,modele").in("id",ids);
    setTitles(Object.fromEntries((ads??[]).map((a:{id:string;titre:string|null;marque:string|null;modele:string|null})=>[a.id,a.titre||[a.marque,a.modele].filter(Boolean).join(" ")||"Annonce automobile"])));
  }
 }
 async function loadMessages(id:string){
  const {data,error}=await supabase.from("messages_auto").select("id,conversation_id,auteur_id,contenu,created_at").eq("conversation_id",id).order("created_at",{ascending:true}).limit(300);
  if(!error)setMessages((data??[]) as Message[]);
 }
 useEffect(()=>{void loadThreads()},[]);
 useEffect(()=>{if(!active)return;void loadMessages(active);const timer=setInterval(()=>void loadMessages(active),12000);return()=>clearInterval(timer)},[active]);
 async function send(e:React.FormEvent){e.preventDefault();const content=draft.trim();if(!content||content.length>2000||!active||!userId)return;
 setSending(true);const {error}=await supabase.from("messages_auto").insert({conversation_id:active,auteur_id:userId,contenu:content});
 if(error)setStatus("Envoi impossible : "+error.message);else{setDraft("");setStatus("");await loadMessages(active)}setSending(false);
 }
 const thread=threads.find(x=>x.id===active);
 return <main className="tim-messages">
 <style>{`.tim-messages{padding:18px 10px;color:#091b49;font-family:Arial,sans-serif}.tim-messages *{box-sizing:border-box}
 .tim-messages .columns{display:grid;grid-template-columns:minmax(200px,270px) minmax(0,1fr);gap:15px}
 .tim-messages .panel{border:1px solid #d5e2f2;border-radius:13px;background:white;padding:13px}
 .tim-messages .thread{width:100%;border:1px solid #e0e8f2;border-radius:9px;padding:12px;text-align:left;background:white;margin-bottom:8px;cursor:pointer;color:#09234e}
 .tim-messages .thread.chosen{border-color:#ffcc10;background:#fff9db}
 .tim-messages .bubble{max-width:80%;width:fit-content;padding:12px 15px;border-radius:14px;background:#edf3fc;margin:9px 0;overflow-wrap:anywhere}
 .tim-messages .mine{margin-left:auto;background:#e0edff}
 .tim-messages textarea{width:100%;min-height:75px;padding:12px;border:1px solid #b5c8e2;border-radius:10px}
 @media(max-width:720px){.tim-messages .columns{grid-template-columns:1fr}}
 `}</style>
 <a href="/compte">← Mon compte</a><h1>✉ Mes messages</h1><p>Discutez avec les acheteurs et vendeurs sans publier votre adresse e-mail.</p>
 {status&&<p role="status">{status}</p>}
 <div className="columns"><aside className="panel"><h2>Conversations</h2>
 {threads.length===0&&<p>Aucune conversation pour le moment.</p>}
 {threads.map(t=><button type="button" className={"thread "+(active===t.id?"chosen":"")} key={t.id} onClick={()=>setActive(t.id)}><strong>{titles[t.annonce_id]||"Annonce automobile"}</strong><br/><small>{t.vendeur_id===userId?"Acheteur":"Vendeur"} · {new Date(t.created_at).toLocaleDateString("fr-FR")}</small></button>)}
 </aside><section className="panel" aria-label="Conversation">
 {thread?<><h2>{titles[thread.annonce_id]||"Annonce automobile"}</h2>
 <div style={{maxHeight:390,minHeight:160,overflowY:"auto",padding:6}}>{messages.length===0?<p>Envoyez votre premier message.</p>:messages.map(m=><div key={m.id} className={"bubble "+(m.auteur_id===userId?"mine":"")}><div>{m.contenu}</div><small style={{display:"block",marginTop:5,color:"#526787"}}>{new Date(m.created_at).toLocaleString("fr-FR")}</small></div>)}</div>
 <form onSubmit={send}><textarea aria-label="Votre message" maxLength={2000} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Bonjour, votre véhicule est-il toujours disponible ?" required/>
 <button disabled={sending||!draft.trim()} style={{marginTop:8,background:"#ffcf06",border:0,borderRadius:10,padding:"12px 18px",fontWeight:800,cursor:"pointer"}}>{sending?"Envoi…":"Envoyer le message"}</button></form></>:<p>Choisissez une conversation pour commencer.</p>}</section></div>
 </main>;
}
