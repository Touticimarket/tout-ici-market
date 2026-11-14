"use client";

import {useEffect,useState} from "react";
import {useParams} from "next/navigation";
import {ArrowLeft,Save} from "lucide-react";
import {supabase} from "../../../../lib/supabaseClient";

type Infos=Record<string,string>;

export default function ModifierAnnonce(){
  const params=useParams<{id:string}>();
  const identifiant=typeof params.id==="string"?params.id:"";
  const ancienneAuto=identifiant.startsWith("auto-");
  const annonceId=ancienneAuto?identifiant.slice(5):identifiant;
  const [userId,setUserId]=useState("");
  const [infos,setInfos]=useState<Infos>({});
  const [charge,setCharge]=useState(false);
  const [enregistre,setEnregistre]=useState(false);
  const [message,setMessage]=useState("");

  useEffect(()=>{
    let actif=true;
    async function charger(){
      if(!/^[0-9a-f-]{36}$/i.test(annonceId)){
        if(actif){setCharge(true);setMessage("Identifiant d'annonce invalide.");}return;
      }
      const {data:{user}}=await supabase.auth.getUser();
      if(!actif)return;
      if(!user){setMessage("Connectez-vous pour modifier votre annonce.");setCharge(true);return;}
      setUserId(user.id);
      const table=ancienneAuto?"annonces_auto":"annonces_marketplace";
      const {data,error}=await supabase.from(table).select("*").eq("id",annonceId).eq("user_id",user.id).maybeSingle();
      if(!actif)return;
      if(error||!data){setMessage("Impossible de retrouver cette annonce dans votre compte.");setCharge(true);return;}
      const champs:Infos={};
      for(const cle of ["titre","description","ville","code_postal","prix","marque","modele","finition"]){
        if(data[cle]!==undefined && data[cle]!==null)champs[cle]=String(data[cle]);
      }
      setInfos(champs);
      setCharge(true);
    }
    charger();
    return ()=>{actif=false};
  },[annonceId,ancienneAuto]);

  async function sauver(){
    if(enregistre||!userId)return;
    if(infos.titre!==undefined&&infos.titre.trim().length<4){
      setMessage("Le titre doit contenir au moins 4 caractères.");return;
    }
    if((infos.description||"").trim().length<10||(infos.ville||"").trim().length<2){
      setMessage("Complétez la description (10 caractères minimum) et la ville.");return;
    }
    if(ancienneAuto&&(!(infos.marque||"").trim()||!(infos.modele||"").trim())){
      setMessage("La marque et le modèle sont obligatoires.");return;
    }
    setEnregistre(true);setMessage("");
    const price=infos.prix?.trim()?Number(infos.prix):null;
    if(price!==null&&(!Number.isFinite(price)||price<0)){setMessage("Prix invalide.");setEnregistre(false);return;}
    const modifications=ancienneAuto?{
      marque:(infos.marque||"").trim(),modele:(infos.modele||"").trim(),
      finition:infos.finition||null,description:(infos.description||"").trim(),
      ville:(infos.ville||"").trim(),prix:price==null?null:Math.round(price)
    }:{
      titre:(infos.titre||"").trim(),description:(infos.description||"").trim(),
      ville:(infos.ville||"").trim(),prix:price,code_postal:infos.code_postal||null,
      updated_at:new Date().toISOString()
    };
    const table=ancienneAuto?"annonces_auto":"annonces_marketplace";
    const {error}=await supabase.from(table).update(modifications)
      .eq("id",annonceId).eq("user_id",userId).select("id").single();
    if(error){setMessage("Impossible d'enregistrer : "+error.message);setEnregistre(false);return;}
    window.location.assign("/compte/mes-annonces");
  }

  const champ=(cle:string,libelle:string,type:"text"|"number"="text")=><label key={cle} className="edit-field">{libelle}
    <input type={type} min={type==="number"?0:undefined} value={infos[cle]||""}
      onChange={e=>setInfos(old=>({...old,[cle]:e.target.value}))}/>
  </label>;

  return <main className="edit-annonce">
    <style>{`
      .edit-annonce{min-height:100vh;background:#f6f8fc;font-family:Arial,sans-serif;color:#0d2c60}
      .edit-annonce *{box-sizing:border-box}
      .edit-annonce-wrap{max-width:820px;margin:auto;padding:108px 16px 75px}
      .edit-annonce-panel{background:#fff;border:1px solid #dee9f5;border-radius:19px;padding:30px;box-shadow:0 8px 34px #14447a14}
      .edit-annonce-panel h1{font-size:29px;margin:0 0 10px}
      .edit-annonce-panel p{font-size:13px;color:#708096;line-height:1.55}
      .edit-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:21px 0}
      .edit-field{display:block;font-size:13px;font-weight:800}
      .edit-field input,.edit-field textarea{display:block;margin-top:8px;width:100%;background:#fff;color:#112e57;border-radius:11px;border:1px solid #cbd9ec;padding:14px;font:inherit;font-size:14px}
      .edit-field textarea{min-height:150px;resize:vertical}
      .edit-field.full{grid-column:1/-1}
      .edit-save{display:flex;align-items:center;gap:8px;background:#ffcf28;color:#0b2c61;border:0;border-radius:12px;padding:14px 20px;font-weight:800;font-size:14px;cursor:pointer}
      .edit-save:disabled{opacity:.6}
      @media(max-width:580px){.edit-fields{grid-template-columns:1fr}.edit-annonce-panel{padding:22px 17px}}
    `}</style>
    <div className="edit-annonce-wrap">
      <a href="/compte/mes-annonces" style={{textDecoration:"none",color:"#0950b8",fontWeight:800,display:"inline-flex",gap:7,alignItems:"center",marginBottom:16}}><ArrowLeft size={18}/> Retour à mes annonces</a>
      <div className="edit-annonce-panel">
        <h1>Modifier mon annonce</h1>
        <p>Corrigez le titre, le prix, la description et la ville. Pour remplacer les photos ou modifier les caractéristiques techniques détaillées, nous préparerons un éditeur plus complet.</p>
        {!charge?<p>Chargement de l'annonce…</p>:!userId?
        <p><a href="/compte/connexion">Connectez-vous pour modifier cette annonce.</a></p>:!Object.keys(infos).length?
        <p>Annonce introuvable.</p>:<>
          <div className="edit-fields">
            {ancienneAuto?<>
              {champ("marque","Marque")}{champ("modele","Modèle")}
              {champ("finition","Finition")}{champ("prix","Prix (€)","number")}
            </>:<>
              <div className="edit-field full">{champ("titre","Titre de l'annonce")}</div>
              {champ("prix","Prix (€)","number")}{champ("code_postal","Code postal")}
            </>}
            {champ("ville","Ville")}
            <label className="edit-field full">Description
              <textarea value={infos.description||""} onChange={e=>setInfos(o=>({...o,description:e.target.value}))}/>
            </label>
          </div>
          <button type="button" className="edit-save" onClick={sauver} disabled={enregistre}>
            <Save size={18}/>{enregistre?"Enregistrement…":"Enregistrer les modifications"}
          </button>
        </>}
        {message&&<p role="status" style={{background:"#fff4d8",padding:12,borderRadius:10,color:"#76551a"}}>{message}</p>}
      </div>
    </div>
  </main>;
}
