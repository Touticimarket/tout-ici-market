"use client";

import {useCallback,useEffect,useMemo,useState} from "react";
import {ArrowLeft,CheckCheck,Flag,Lock,MessageCircle,Send,ShieldCheck,Star,UserRound} from "lucide-react";
import {supabase} from "../../lib/supabaseClient";

type Conversation={
  id:string;listing_type:"auto"|"market";listing_id:string;
  buyer_id:string;seller_id:string;titre_annonce:string;
  statut:"ouverte"|"terminee";created_at:string;
};
type Message={id:string;conversation_id:string;expediteur_id:string;contenu:string;created_at:string};
type Notification={id:string;conversation_id:string;lu:boolean};
type Brouillon={type:"auto"|"market";id:string;titre:string;vendeurId:string};
type Avis={id:string;auteur_id:string;note:number;commentaire:string};

const formatDate=(v:string)=>new Date(v).toLocaleString("fr-FR",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"});
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function MesMessages(){
  const [userId,setUserId]=useState("");
  const [authReady,setAuthReady]=useState(false);
  const [conversations,setConversations]=useState<Conversation[]>([]);
  const [messages,setMessages]=useState<Message[]>([]);
  const [notifications,setNotifications]=useState<Notification[]>([]);
  const [selection,setSelection]=useState("");
  const [brouillon,setBrouillon]=useState<Brouillon|null>(null);
  const [contenu,setContenu]=useState("");
  const [erreur,setErreur]=useState("");
  const [info,setInfo]=useState("");
  const [occupé,setOccupe]=useState(false);
  const [blocked,setBlocked]=useState(false);
  const [avisEnvoye,setAvisEnvoye]=useState(false);
  const [note,setNote]=useState("5");
  const [commentaire,setCommentaire]=useState("");

  const discuter=useMemo(()=>conversations.find(c=>c.id===selection)||null,[conversations,selection]);
  const partenaire=discuter?(discuter.buyer_id===userId?discuter.seller_id:discuter.buyer_id):brouillon?.vendeurId||"";
  const nonLus=useMemo(()=>notifications.filter(n=>!n.lu),[notifications]);
  const titreEnCours=discuter?.titre_annonce||brouillon?.titre||"Sélectionnez une conversation";
  const echangeReciproque=Boolean(discuter&&messages.some(m=>m.expediteur_id===discuter.buyer_id)&&messages.some(m=>m.expediteur_id===discuter.seller_id));

  const chargerListe=useCallback(async(uid:string)=>{
    const [c,n]=await Promise.all([
      supabase.from("market_conversations").select("id,listing_type,listing_id,buyer_id,seller_id,titre_annonce,statut,created_at")
        .or("buyer_id.eq."+uid+",seller_id.eq."+uid).order("created_at",{ascending:false}).limit(150),
      supabase.from("market_notifications").select("id,conversation_id,lu").eq("destinataire_id",uid).limit(1000)
    ]);
    if(c.error){setErreur("Impossible de charger les discussions : "+c.error.message);return;}
    setConversations((c.data||[]) as Conversation[]);
    if(!n.error)setNotifications((n.data||[]) as Notification[]);
  },[]);

  const chargerMessages=useCallback(async(id:string,uid:string)=>{
    if(!id)return;
    const [m,avis]=await Promise.all([
      supabase.from("market_messages").select("id,conversation_id,expediteur_id,contenu,created_at")
        .eq("conversation_id",id).order("created_at",{ascending:true}).limit(500),
      supabase.from("market_avis").select("id,auteur_id,note,commentaire")
        .eq("conversation_id",id).eq("auteur_id",uid).limit(1)
    ]);
    if(m.error){setErreur(m.error.message);return;}
    setMessages((m.data||[]) as Message[]);
    setAvisEnvoye((avis.data||[]).length>0);
    await supabase.from("market_notifications").update({lu:true})
      .eq("conversation_id",id).eq("destinataire_id",uid).eq("lu",false);
    setNotifications(old=>old.map(n=>n.conversation_id===id?{...n,lu:true}:n));
  },[]);

  useEffect(()=>{
    let alive=true;
    async function init(){
      const {data:{user}}=await supabase.auth.getUser();
      if(!alive)return;
      setAuthReady(true);
      if(!user)return;
      setUserId(user.id);
      await chargerListe(user.id);
      if(!alive)return;
      const params=new URLSearchParams(window.location.search);
      const discussion=params.get("discussion")||"";
      if(uuid.test(discussion)){
        setSelection(discussion);
      }else{
        const target=params.get("annonce")||"";
        const match=/^(auto|market):([0-9a-f-]{36})$/i.exec(target);
        if(match&&uuid.test(match[2])){
          const type=match[1] as "auto"|"market";
          const {data,error}=type==="auto"
            ?await supabase.from("annonces_auto").select("id,user_id,marque,modele")
              .eq("id",match[2]).eq("statut","publiee").maybeSingle()
            :await supabase.from("annonces_marketplace").select("id,user_id,titre")
              .eq("id",match[2]).eq("statut","publiee").maybeSingle();
          if(!alive)return;
          if(!error&&data){
            const a=data as unknown as Record<string,unknown>;
            const seller=String(a.user_id||"");
            if(seller===user.id)setInfo("Il s'agit de votre annonce. Les acheteurs pourront vous contacter ici.");
            else if(seller)setBrouillon({type,id:match[2],vendeurId:seller,titre:type==="auto"?[a.marque,a.modele].filter(Boolean).join(" ")||"Véhicule":String(a.titre||"Annonce")});
          }else setErreur("Cette annonce n'est plus disponible.");
        }
      }
    }
    void init();
    return ()=>{alive=false};
  },[chargerListe]);

  useEffect(()=>{
    if(!selection||!userId)return;
    void chargerMessages(selection,userId);
    const check=()=>{void chargerMessages(selection,userId);void chargerListe(userId);};
    const timer=window.setInterval(check,10000);
    return ()=>window.clearInterval(timer);
  },[selection,userId,chargerMessages,chargerListe]);

  useEffect(()=>{
    if(!userId)return;
    const timer=window.setInterval(()=>void chargerListe(userId),12000);
    return ()=>window.clearInterval(timer);
  },[userId,chargerListe]);

  useEffect(()=>{
    async function checkBlock(){
      if(!userId||!partenaire){setBlocked(false);return;}
      const {data}=await supabase.from("market_blocages").select("bloque_id").eq("bloqueur_id",userId).eq("bloque_id",partenaire).maybeSingle();
      setBlocked(Boolean(data));
    }
    void checkBlock();
  },[userId,partenaire]);

  function selectionner(id:string){
    setSelection(id);setBrouillon(null);setMessages([]);setErreur("");setInfo("");
    window.history.replaceState(null,"","/compte/messages?discussion="+id);
  }

  async function envoyer(){
    if(occupé||!userId||!contenu.trim())return;
    if(contenu.trim().length>4000){setErreur("Votre message dépasse 4 000 caractères.");return;}
    if(blocked){setErreur("Débloquez ce contact pour reprendre la conversation.");return;}
    setOccupe(true);setErreur("");setInfo("");
    try{
      let id=selection;
      if(!id){
        if(!brouillon)throw new Error("Sélectionnez une annonce ou une conversation.");
        const {data:created,error:createError}=await supabase.from("market_conversations").insert({
          listing_type:brouillon.type,listing_id:brouillon.id,
          buyer_id:userId,seller_id:brouillon.vendeurId,titre_annonce:brouillon.titre
        }).select("id").single();
        if(createError){
          if(createError.code!=="23505")throw new Error(createError.message);
          const {data:existing,error:loadError}=await supabase.from("market_conversations")
            .select("id").eq("listing_type",brouillon.type).eq("listing_id",brouillon.id)
            .eq("buyer_id",userId).single();
          if(loadError||!existing)throw new Error(loadError?.message||"Conversation introuvable");
          id=existing.id;
        }else if(created)id=created.id;
      }
      if(!id)throw new Error("Impossible d'ouvrir cette conversation.");
      const {error}=await supabase.from("market_messages").insert({
        conversation_id:id,expediteur_id:userId,contenu:contenu.trim()
      });
      if(error)throw new Error(error.message);
      setContenu("");setBrouillon(null);setSelection(id);
      window.history.replaceState(null,"","/compte/messages?discussion="+id);
      await Promise.all([chargerListe(userId),chargerMessages(id,userId)]);
    }catch(e){setErreur(e instanceof Error?e.message:"Envoi impossible.");}
    finally{setOccupe(false);}
  }

  async function clore(){
    if(!discuter||!echangeReciproque||userId!==discuter.seller_id||discuter.statut==="terminee")return;
    if(!window.confirm("Confirmer que cet échange est terminé ? Les deux participants pourront ensuite laisser un avis si chacun a envoyé un message."))return;
    const {error}=await supabase.from("market_conversations").update({statut:"terminee"}).eq("id",discuter.id).eq("seller_id",userId);
    if(error)setErreur(error.message);else{setInfo("Échange clôturé.");await chargerListe(userId);}
  }

  async function envoyerAvis(){
    if(!discuter||!userId||!commentaire.trim())return;
    setOccupe(true);setErreur("");
    const {error}=await supabase.from("market_avis").insert({
      conversation_id:discuter.id,auteur_id:userId,cible_id:partenaire,
      note:Number(note),commentaire:commentaire.trim()
    });
    if(error)setErreur("Avis non enregistré : "+error.message);
    else{setAvisEnvoye(true);setCommentaire("");setInfo("Merci, votre avis a bien été publié.");}
    setOccupe(false);
  }

  async function bloquer(){
    if(!userId||!partenaire)return;
    setErreur("");
    if(blocked){
      const {error}=await supabase.from("market_blocages").delete()
        .eq("bloqueur_id",userId).eq("bloque_id",partenaire);
      if(error)setErreur(error.message);else{setBlocked(false);setInfo("Contact débloqué.");}
    }else{
      if(!window.confirm("Bloquer ce contact ? Aucun des deux ne pourra envoyer de nouveaux messages dans cette conversation."))return;
      const {error}=await supabase.from("market_blocages").insert({bloqueur_id:userId,bloque_id:partenaire});
      if(error)setErreur(error.message);else{setBlocked(true);setInfo("Contact bloqué.");}
    }
  }

  async function signaler(){
    if(!userId||!discuter)return;
    const motif=window.prompt("Quel problème souhaitez-vous signaler ? (5 caractères minimum)");
    if(!motif)return;
    const {error}=await supabase.from("market_signalements").insert({
      auteur_id:userId,cible_type:"conversation",cible_id:discuter.id,motif:motif.trim()
    });
    setInfo(error?"Signalement impossible : "+error.message:"Signalement enregistré.");
  }

  return <main className="ti-messagerie">
    <style>{`
      .ti-messagerie{min-height:100vh;background:#f5f8fd;color:#0d2c60;font-family:Arial,sans-serif}
      .ti-messagerie *{box-sizing:border-box}
      .ti-ms-shell{max-width:1260px;margin:auto;padding:105px 18px 65px}
      .ti-ms-back{color:#114eac;text-decoration:none;font-size:13px;font-weight:750;display:inline-flex;gap:6px;align-items:center;margin-bottom:15px}
      .ti-ms-head{display:flex;align-items:center;justify-content:space-between;gap:15px;flex-wrap:wrap;margin-bottom:20px}
      .ti-ms-head h1{margin:0 0 7px;font-size:clamp(27px,3.2vw,38px)}
      .ti-ms-head p{margin:0;font-size:13px;color:#6c7f98}
      .ti-ms-badge{background:#ffcf28;color:#102d5b;padding:8px 11px;border-radius:40px;font-size:12px;font-weight:800}
      .ti-ms-layout{display:grid;grid-template-columns:320px minmax(0,1fr);gap:15px;min-height:620px}
      .ti-ms-inbox,.ti-ms-panel{background:#fff;border:1px solid #dfe8f4;border-radius:17px;overflow:hidden;box-shadow:0 8px 25px #1b39630b}
      .ti-ms-inbox h2{font-size:17px;margin:0;padding:19px;border-bottom:1px solid #e3eaf5}
      .ti-ms-list{max-height:690px;overflow-y:auto}
      .ti-ms-item{display:block;width:100%;text-align:left;border:0;border-bottom:1px solid #eef1f6;background:#fff;padding:15px 16px;cursor:pointer;color:#102d5b}
      .ti-ms-item:hover,.ti-ms-item.active{background:#eff5ff}
      .ti-ms-item strong{font-size:14px}
      .ti-ms-item small{display:block;color:#6b7d95;font-size:11px;margin-top:7px}
      .ti-ms-count{background:#ffcf28;border-radius:20px;padding:3px 7px;font-size:11px;font-weight:800;float:right}
      .ti-ms-panel{display:flex;flex-direction:column}
      .ti-ms-title{border-bottom:1px solid #e3ebf5;padding:18px 21px;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
      .ti-ms-title strong{font-size:16px}
      .ti-ms-title p{font-size:12px;margin:7px 0 0;color:#708099}
      .ti-ms-conversation{min-height:300px;flex:1;background:#f9fbff;padding:21px;display:flex;flex-direction:column;gap:11px;overflow:auto}
      .ti-ms-bubble{max-width:80%;padding:12px 14px;border-radius:15px;background:#fff;border:1px solid #e0eaf7;align-self:flex-start;line-height:1.5;font-size:14px;overflow-wrap:anywhere;white-space:pre-wrap}
      .ti-ms-bubble.self{align-self:flex-end;background:#e5f0ff;border-color:#c9ddfa}
      .ti-ms-bubble small{display:block;margin-top:7px;font-size:10px;color:#75849a}
      .ti-ms-send{padding:16px 19px;border-top:1px solid #e0e8f4;display:flex;align-items:end;gap:10px}
      .ti-ms-send textarea,.ti-ms-review textarea{border:1px solid #cddbef;border-radius:12px;padding:12px;font:inherit;font-size:14px;background:#fff;color:#112c5c;width:100%;min-height:55px;resize:vertical}
      .ti-ms-send button,.ti-ms-btn{border:0;background:#ffd12b;color:#0d2d63;padding:13px 16px;border-radius:11px;cursor:pointer;font-weight:800}
      .ti-ms-send button:disabled,.ti-ms-btn:disabled{opacity:.5;cursor:not-allowed}
      .ti-ms-actions{display:flex;gap:7px;flex-wrap:wrap;align-items:center}
      .ti-ms-actions button{background:#f5f8fd;border:1px solid #d5e2f2;border-radius:8px;padding:8px 10px;color:#174783;font-weight:750;font-size:11px;cursor:pointer}.ti-ms-actions button:disabled{opacity:.45;cursor:not-allowed}
      .ti-ms-review{border-top:1px solid #e1e9f4;padding:17px 20px;display:grid;gap:8px}
      .ti-ms-review h3{font-size:16px;margin:0}
      .ti-ms-review select{padding:9px;border-radius:8px;border:1px solid #cbdaed;background:#fff;color:#0e2d5b}
      .ti-ms-alert{padding:11px 14px;border-radius:10px;background:#fff3d5;color:#765513;font-size:13px;margin:13px 0}
      .ti-ms-empty{padding:35px 22px;text-align:center;color:#677b93;font-size:14px}
      @media(max-width:800px){.ti-ms-layout{grid-template-columns:1fr;min-height:0}.ti-ms-inbox{max-height:260px}.ti-ms-conversation{min-height:320px}.ti-ms-shell{padding:105px 11px 50px}}
    `}</style>
    <div className="ti-ms-shell">
      <a className="ti-ms-back" href="/compte"><ArrowLeft size={15}/> Mon compte</a>
      <header className="ti-ms-head">
        <div><h1>Mes messages</h1><p>Vos conversations privées avec les acheteurs et vendeurs.</p></div>
        {nonLus.length>0&&<span className="ti-ms-badge">{nonLus.length} nouveau{nonLus.length>1?"x":""} message{nonLus.length>1?"s":""}</span>}
      </header>
      {!authReady?<p>Chargement de votre messagerie…</p>:!userId?
        <div className="ti-ms-inbox ti-ms-empty"><UserRound size={34}/><h2>Connectez-vous pour échanger</h2>
          <p>Votre messagerie est privée et accessible uniquement à votre compte.</p>
          <a href="/compte/connexion" className="ti-ms-btn" style={{display:"inline-block",textDecoration:"none"}}>Se connecter</a>
        </div>:
        <div className="ti-ms-layout">
          <aside className="ti-ms-inbox">
            <h2>Conversations ({conversations.length})</h2>
            <div className="ti-ms-list">
              {conversations.length===0?<p className="ti-ms-empty">Vous n'avez pas encore de conversation. Contactez un vendeur depuis son annonce.</p>:
                conversations.map(c=>{
                  const unread=nonLus.filter(n=>n.conversation_id===c.id).length;
                  return <button type="button" key={c.id}
                    className={"ti-ms-item"+(selection===c.id?" active":"")} onClick={()=>selectionner(c.id)}>
                    {unread>0&&<span className="ti-ms-count">{unread}</span>}
                    <strong>{c.titre_annonce}</strong>
                    <small>{c.buyer_id===userId?"Avec le vendeur":"Avec un acheteur"} · {c.statut==="terminee"?"Terminée":"En cours"} · {formatDate(c.created_at)}</small>
                  </button>;
                })}
            </div>
          </aside>
          <section className="ti-ms-panel">
            <div className="ti-ms-title">
              <div><strong>{titreEnCours}</strong><p>{discuter?(discuter.buyer_id===userId?"Discussion avec le vendeur":"Discussion avec un acheteur"):brouillon?"Nouveau message au vendeur":"Choisissez une discussion"}</p></div>
              {discuter&&<div className="ti-ms-actions">
                <a href={"/annonces/"+(discuter.listing_type==="auto"?"auto-":"")+discuter.listing_id} style={{fontSize:12,color:"#0c4bad",fontWeight:800,textDecoration:"none"}}>Voir l'annonce</a>
                <button type="button" onClick={bloquer}>{blocked?"Débloquer":"Bloquer"}</button>
                <button type="button" onClick={signaler}><Flag size={12} style={{verticalAlign:"middle"}}/> Signaler</button>
                {discuter.seller_id===userId&&discuter.statut==="ouverte"&&<button type="button" onClick={clore} disabled={!echangeReciproque} title={!echangeReciproque?"Les deux utilisateurs doivent avoir échangé au moins un message chacun.":undefined}>Terminer l’échange</button>}
              </div>}
            </div>
            {erreur&&<p role="alert" className="ti-ms-alert">{erreur}</p>}
            {info&&<p role="status" className="ti-ms-alert">{info}</p>}
            <div className="ti-ms-conversation">
              {messages.length?messages.map(m=><div key={m.id} className={"ti-ms-bubble"+(m.expediteur_id===userId?" self":"")}>
                <div>{m.contenu}</div>
                <small>{m.expediteur_id===userId?"Vous":"Votre interlocuteur"} · {formatDate(m.created_at)}</small>
              </div>):<div className="ti-ms-empty">{brouillon?"Posez votre question au vendeur. Votre message restera privé.":discuter?"Aucun message pour le moment.":"Sélectionnez une annonce ou une conversation pour écrire."}</div>}
            </div>
            {(discuter?.statut!=="terminee"&&(discuter||brouillon))&&<div className="ti-ms-send">
              <textarea value={contenu} maxLength={4000} onChange={e=>setContenu(e.target.value)}
                placeholder="Écrivez votre message privé…" aria-label="Votre message"
                onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();void envoyer();}}}/>
              <button type="button" disabled={occupé||blocked||!contenu.trim()} onClick={envoyer}><Send size={18}/></button>
            </div>}
            {discuter?.statut==="terminee"&&<div className="ti-ms-review">
              <strong><CheckCheck size={16} style={{verticalAlign:"middle"}}/> Échange clôturé</strong>
              {avisEnvoye?<p>Votre avis a déjà été publié. Merci !</p>:!echangeReciproque?<p>Les avis seront disponibles lorsque chacun des deux participants aura envoyé au moins un message.</p>:<>
                <h3>Laisser un avis sur votre interlocuteur</h3>
                <p style={{fontSize:12,color:"#60748c",margin:0}}>Les avis concernent l'expérience d'échange, sans certification indépendante de la vente.</p>
                <label style={{fontSize:13}}>Note <select value={note} onChange={e=>setNote(e.target.value)}>
                  {[5,4,3,2,1].map(n=><option key={n} value={n}>{n} / 5</option>)}
                </select></label>
                <textarea value={commentaire} onChange={e=>setCommentaire(e.target.value)}
                  maxLength={1200} placeholder="Décrivez votre expérience (10 caractères minimum)…"/>
                <div><button type="button" className="ti-ms-btn" disabled={occupé||commentaire.trim().length<10} onClick={envoyerAvis}><Star size={15} style={{verticalAlign:"middle"}}/> Publier mon avis</button></div>
              </>}
            </div>}
          </section>
        </div>}
      <p style={{fontSize:12,color:"#74869e",lineHeight:1.6,marginTop:18}}><Lock size={13} style={{verticalAlign:"middle"}}/> Vos messages sont visibles uniquement par les deux participants. N'envoyez jamais de codes bancaires ni de données sensibles.</p>
    </div>
  </main>;
}
