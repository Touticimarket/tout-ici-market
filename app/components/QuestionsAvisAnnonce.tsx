"use client";

import {useEffect,useState} from "react";
import {Flag,MessageCircle,Send,ShieldCheck,Star} from "lucide-react";
import {supabase} from "../lib/supabaseClient";

type Question={id:string;auteur_id:string;vendeur_id:string;question:string;reponse:string|null;created_at:string};
type Avis={id:string;note:number;commentaire:string;created_at:string};
type Props={type:"auto"|"market";annonceId:string;vendeurId:string|null};

export default function QuestionsAvisAnnonce({type,annonceId,vendeurId}:Props){
  const [questions,setQuestions]=useState<Question[]>([]);
  const [avis,setAvis]=useState<Avis[]>([]);
  const [userId,setUserId]=useState("");
  const [question,setQuestion]=useState("");
  const [reponses,setReponses]=useState<Record<string,string>>({});
  const [info,setInfo]=useState("");
  const [busy,setBusy]=useState(false);

  async function charger(){
    if(!vendeurId)return;
    const [q,a]=await Promise.all([
      supabase.from("market_questions").select("id,auteur_id,vendeur_id,question,reponse,created_at")
        .eq("listing_type",type).eq("listing_id",annonceId).order("created_at",{ascending:false}).limit(40),
      supabase.from("market_avis").select("id,note,commentaire,created_at")
        .eq("cible_id",vendeurId).order("created_at",{ascending:false}).limit(10)
    ]);
    if(!q.error)setQuestions((q.data||[]) as Question[]);
    if(!a.error)setAvis((a.data||[]) as Avis[]);
  }

  useEffect(()=>{
    let alive=true;
    supabase.auth.getUser().then(({data})=>{if(alive)setUserId(data.user?.id||"");});
    void charger();
    return ()=>{alive=false};
  },[annonceId,vendeurId,type]);

  async function poser(){
    if(busy||!userId||!vendeurId||userId===vendeurId)return;
    if(question.trim().length<5)return;
    setBusy(true);setInfo("");
    const {error}=await supabase.from("market_questions").insert({
      listing_type:type,listing_id:annonceId,auteur_id:userId,
      vendeur_id:vendeurId,question:question.trim()
    });
    if(error)setInfo("Impossible de publier votre question : "+error.message);
    else{setQuestion("");setInfo("Votre question est publiée.");await charger();}
    setBusy(false);
  }

  async function repondre(id:string){
    if(busy||!userId||userId!==vendeurId)return;
    const texte=(reponses[id]||"").trim();
    if(!texte)return;
    setBusy(true);setInfo("");
    const {error}=await supabase.from("market_questions").update({reponse:texte})
      .eq("id",id).eq("vendeur_id",userId);
    if(error)setInfo("Réponse non enregistrée : "+error.message);
    else{setReponses(old=>({...old,[id]:""}));setInfo("Votre réponse est publiée.");await charger();}
    setBusy(false);
  }

  async function signaler(questionId:string){
    if(!userId){setInfo("Connectez-vous pour signaler une question.");return;}
    const motif=window.prompt("Pourquoi signalez-vous cette question ? (5 caractères minimum)");
    if(!motif)return;
    const {error}=await supabase.from("market_signalements").insert({
      auteur_id:userId,cible_type:"question",cible_id:questionId,motif:motif.trim()
    });
    setInfo(error?"Signalement impossible : "+error.message:"Signalement enregistré.");
  }

  async function signalerAvis(avisId:string){
    if(!userId){setInfo("Connectez-vous pour signaler un avis.");return;}
    const motif=window.prompt("Pourquoi signalez-vous cet avis ? (5 caractères minimum)");
    if(!motif)return;
    const {error}=await supabase.from("market_signalements").insert({
      auteur_id:userId,cible_type:"avis",cible_id:avisId,motif:motif.trim()
    });
    setInfo(error?"Signalement impossible : "+error.message:"Signalement enregistré.");
  }

  const moyenne=avis.length?(avis.reduce((s,a)=>s+a.note,0)/avis.length).toFixed(1):null;

  return <section className="ti-qa">
    <style>{`
      .ti-qa{background:white;border:1px solid #e1e9f5;border-radius:18px;padding:23px;margin-bottom:16px;color:#0c2b59;box-shadow:0 6px 20px #0b39600b}
      .ti-qa *{box-sizing:border-box}
      .ti-qa h2{font-size:20px;margin:0 0 10px}
      .ti-qa h3{font-size:15px;margin:0 0 8px}
      .ti-qa-intro{color:#66788f;font-size:13px;line-height:1.5}
      .ti-qa-block{border:1px solid #e3ecf7;background:#fbfdff;border-radius:13px;padding:15px;margin:10px 0}
      .ti-qa-block p{margin:0;color:#2a4267;font-size:14px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}
      .ti-qa-reply{background:#eaf2ff;padding:12px;border-radius:10px;margin-top:10px}
      .ti-qa-reply strong{font-size:12px;color:#1645a0}
      .ti-qa-meta{font-size:11px;color:#71839d;display:flex;align-items:center;justify-content:space-between;margin-bottom:9px}
      .ti-qa textarea{width:100%;border:1px solid #cbd9ec;border-radius:11px;padding:12px;min-height:65px;background:white;color:#102b5b;resize:vertical;font-family:inherit;font-size:14px}
      .ti-qa-send{display:inline-flex;gap:7px;align-items:center;background:#ffd029;border:0;border-radius:10px;padding:12px 16px;color:#102e60;font-weight:800;cursor:pointer;margin-top:8px}
      .ti-qa-send:disabled{opacity:.5;cursor:not-allowed}
      .ti-qa-reviews{border-top:1px solid #e2eaf5;padding-top:20px;margin-top:26px}
      .ti-qa-notice{background:#fff6df;padding:10px;border-radius:9px;color:#7a5c22;font-size:12px}
      .ti-qa-badge{display:inline-flex;align-items:center;gap:5px;background:#fff4c9;border-radius:40px;padding:7px 10px;color:#765111;font-weight:850;font-size:13px}
    `}</style>
    <h2><MessageCircle size={20} style={{verticalAlign:"middle",marginRight:7}}/> Questions et réponses sur l'annonce</h2>
    <p className="ti-qa-intro">Posez une question publique sur le produit ou le véhicule. Pour négocier, échanger vos coordonnées ou parler d'une visite, utilisez la messagerie privée.</p>
    {vendeurId&&userId!==vendeurId&&<div style={{margin:"16px 0"}}>
      <textarea placeholder="Votre question publique au vendeur…" aria-label="Question publique au vendeur"
        maxLength={1000} value={question} onChange={e=>setQuestion(e.target.value)}/>
      {userId?<button type="button" className="ti-qa-send" disabled={busy||question.trim().length<5}
        onClick={poser}><Send size={15}/> Publier la question</button>:
        <p className="ti-qa-intro"><a href="/compte/connexion">Connectez-vous</a> pour poser une question.</p>}
    </div>}
    {info&&<p role="status" className="ti-qa-notice">{info}</p>}
    {questions.length===0?<p className="ti-qa-intro">Aucune question pour le moment.</p>:
      questions.map(q=><div className="ti-qa-block" key={q.id}>
        <div className="ti-qa-meta"><span>Question d'un membre · {new Date(q.created_at).toLocaleDateString("fr-FR")}</span>
          {userId&&<button type="button" onClick={()=>signaler(q.id)} style={{background:"none",border:0,color:"#63748b",fontSize:11,cursor:"pointer"}}>
            <Flag size={12} style={{verticalAlign:"middle"}}/> Signaler
          </button>}</div>
        <p>{q.question}</p>
        {q.reponse?<div className="ti-qa-reply"><strong>Réponse du vendeur</strong><p>{q.reponse}</p></div>:
          userId===vendeurId&&<div className="ti-qa-reply">
            <textarea placeholder="Répondre à cette question…" maxLength={1500} value={reponses[q.id]||""}
              onChange={e=>setReponses(old=>({...old,[q.id]:e.target.value}))}/>
            <button type="button" className="ti-qa-send" disabled={busy||!(reponses[q.id]||"").trim()} onClick={()=>repondre(q.id)}>Répondre</button>
          </div>}
      </div>)}
    <div className="ti-qa-reviews">
      <h2><Star size={20} style={{verticalAlign:"middle",marginRight:7}}/> Avis sur le vendeur</h2>
      {moyenne&&<div className="ti-qa-badge"><Star size={15}/> {moyenne} / 5 · {avis.length} avis affiché{avis.length>1?"s":""}</div>}
      <p className="ti-qa-intro">Les avis sont publiés après un échange clôturé entre deux utilisateurs. Ils ne constituent pas une certification indépendante de la vente.</p>
      {avis.length?avis.map(a=><div key={a.id} className="ti-qa-block">
        <div className="ti-qa-meta"><span>Publié le {new Date(a.created_at).toLocaleDateString("fr-FR")}</span>
          {userId&&<button type="button" onClick={()=>signalerAvis(a.id)} style={{background:"none",border:0,color:"#63748b",fontSize:11,cursor:"pointer"}}>
            <Flag size={12} style={{verticalAlign:"middle"}}/> Signaler
          </button>}</div>
        <strong style={{color:"#a87000",fontSize:15}}>{"★".repeat(a.note)}{"☆".repeat(5-a.note)}</strong>
        <p>{a.commentaire}</p>
      </div>):<p className="ti-qa-intro">Ce vendeur n'a pas encore reçu d'avis.</p>}
    </div>
  </section>;
}
