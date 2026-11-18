"use client";

import {useEffect,useState} from "react";
import {Archive,ArrowRight,Edit3,Eye,Plus,RefreshCw,Tag} from "lucide-react";
import {supabase} from "../../lib/supabaseClient";
import {depotCategories} from "../../deposer/categories";

type Item={
  id:string;source:"market"|"auto";categorie:string;titre:string;prix:number|null;
  ville:string;statut:string;created_at:string;photo:string|null;
};
const labelStatut:Record<string,string>={
  brouillon:"Brouillon",publiee:"En ligne",vendue:"Vendue",reservee:"Réservée",archivee:"Archivée"
};
const euros=(n:number|null)=>n==null?"Prix à contacter":new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n);

export default function MesAnnonces(){
  const [userId,setUserId]=useState("");
  const [liste,setListe]=useState<Item[]>([]);
  const [chargement,setChargement]=useState(true);
  const [action,setAction]=useState("");
  const [erreur,setErreur]=useState("");

  async function charger(){
    setChargement(true);
    setErreur("");
    const {data:{user}}=await supabase.auth.getUser();
    if(!user){setUserId("");setListe([]);setChargement(false);return;}
    setUserId(user.id);
    const [general,auto]=await Promise.all([
      supabase.from("annonces_marketplace").select("id,categorie,titre,prix,ville,photos,statut,created_at")
        .eq("user_id",user.id).order("created_at",{ascending:false}).limit(150),
      supabase.from("annonces_auto").select("id,marque,modele,finition,prix,ville,statut,created_at")
        .eq("user_id",user.id).order("created_at",{ascending:false}).limit(100)
    ]);
    const all:Item[]=[];
    if(general.data)for(const a of general.data)all.push({
      id:String(a.id),source:"market",categorie:String(a.categorie),titre:String(a.titre),
      prix:a.prix==null?null:Number(a.prix),ville:String(a.ville||""),statut:String(a.statut),
      photo:Array.isArray(a.photos)&&a.photos.length?String(a.photos[0]):null,
      created_at:String(a.created_at)
    });
    if(auto.data?.length){
      const ids=auto.data.map(a=>String(a.id));
      const medias=await supabase.from("annonces_auto_photos")
        .select("annonce_id,url,ordre").in("annonce_id",ids).order("ordre");
      const photos:Record<string,string>={};
      for(const m of medias.data||[])if(!photos[String(m.annonce_id)])photos[String(m.annonce_id)]=String(m.url);
      for(const a of auto.data)all.push({
        id:String(a.id),source:"auto",categorie:"automobile",
        titre:[a.marque,a.modele,a.finition].filter(Boolean).join(" ")||"Automobile",
        prix:a.prix==null?null:Number(a.prix),ville:String(a.ville||""),
        statut:String(a.statut),photo:photos[String(a.id)]||null,created_at:String(a.created_at)
      });
    }
    all.sort((a,b)=>new Date(b.created_at).getTime()-new Date(a.created_at).getTime());
    setListe(all);
    if(general.error||auto.error)setErreur("Certaines annonces n'ont pas pu être chargées.");
    setChargement(false);
  }

  useEffect(()=>{charger()},[]);

  async function changerStatut(item:Item,statut:"publiee"|"vendue"|"archivee"){
    if(!userId)return;
    const cle=item.source+item.id;
    setAction(cle);
    setErreur("");
    const table=item.source==="auto"?"annonces_auto":"annonces_marketplace";
    const valeurs=table==="annonces_auto"?{statut}:{statut,updated_at:new Date().toISOString()};
    const {error}=await supabase.from(table).update(valeurs)
      .eq("id",item.id).eq("user_id",userId);
    if(error)setErreur("Impossible de modifier l'annonce : "+error.message);
    else setListe(old=>old.map(v=>v.id===item.id&&v.source===item.source?{...v,statut}:v));
    setAction("");
  }

  return <main className="mes-annonces">
    <style>{`
      .mes-annonces{font-family:Arial,sans-serif;min-height:100vh;background:#f4f7fc;color:#102b59}
      .mes-annonces *{box-sizing:border-box}
      .mes-annonces-shell{max-width:1180px;margin:auto;padding:108px 18px 70px}
      .mes-annonces-head{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:22px}
      .mes-annonces h1{font-size:clamp(27px,3vw,38px);margin:0 0 8px}
      .mes-annonces-head p{font-size:14px;color:#667792;margin:0}
      .mes-annonces-primary{background:#ffcf2b;padding:14px 18px;border-radius:12px;color:#0e2f62;text-decoration:none;font-weight:800;display:flex;align-items:center;gap:8px}
      .mes-annonces-card{display:grid;grid-template-columns:142px minmax(0,1fr);gap:17px;background:#fff;border:1px solid #e0e9f5;border-radius:15px;padding:13px;margin:12px 0;box-shadow:0 7px 25px #1639690c}
      .mes-annonces-image{border-radius:11px;height:115px;background:#ecf4ff;overflow:hidden;display:grid;place-items:center;font-size:36px}
      .mes-annonces-image img{width:100%;height:100%;object-fit:cover}
      .mes-annonces-info h2{font-size:19px;margin:4px 0 8px}
      .mes-annonces-meta{font-size:12px;color:#60718c;display:flex;gap:11px;flex-wrap:wrap}
      .mes-annonces-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:12px}
      .mes-annonces-actions a,.mes-annonces-actions button{border:1px solid #d0dfef;border-radius:9px;padding:8px 11px;background:#f7faff;color:#0c4ba9;text-decoration:none;cursor:pointer;font-size:12px;font-weight:800;display:flex;align-items:center;gap:5px}
      .mes-annonces-actions button:disabled{opacity:.55}
      .mes-annonces-tag{display:inline-block;background:#eaf5ff;color:#0746a4;font-size:11px;border-radius:8px;padding:5px 8px;font-weight:800}
      .mes-annonces-empty{background:#fff;border:1px dashed #bfcee4;border-radius:17px;text-align:center;padding:50px 23px}
      @media(max-width:650px){.mes-annonces-card{grid-template-columns:100px minmax(0,1fr);gap:12px}.mes-annonces-image{height:110px}.mes-annonces-info h2{font-size:16px}.mes-annonces-shell{padding:105px 12px 55px}}
    `}</style>
    <div className="mes-annonces-shell">
      <header className="mes-annonces-head">
        <div><h1>Mes annonces</h1><p>Retrouvez et gérez vos annonces depuis n'importe quel appareil, après connexion.</p></div>
        <a href="/deposer" className="mes-annonces-primary"><Plus size={18}/> Déposer une annonce</a>
      </header>
      {erreur&&<p role="alert" style={{background:"#fff1e0",padding:14,borderRadius:10}}>{erreur}</p>}
      {chargement?<p>Chargement de vos annonces…</p>:!userId?
      <div className="mes-annonces-empty"><h2>Connectez-vous pour retrouver vos annonces</h2><p>Votre liste personnelle est protégée et accessible uniquement à votre compte.</p>
        <a href="/compte/connexion" className="mes-annonces-primary" style={{display:"inline-flex"}}>Se connecter</a>
      </div>:liste.length===0?
      <div className="mes-annonces-empty"><div style={{fontSize:48}}>📋</div><h2>Vous n'avez pas encore déposé d'annonce</h2>
        <p>Votre première annonce apparaîtra ici après publication.</p>
        <a href="/deposer" className="mes-annonces-primary" style={{display:"inline-flex"}}>Déposer ma première annonce</a>
      </div>:<>
        <p style={{fontSize:13,color:"#718198"}}>{liste.length} annonce{liste.length>1?"s":""} dans votre compte.</p>
        {liste.map(item=>{
          const href="/annonces/"+(item.source==="auto"?"auto-":"")+item.id;
          const edition="/compte/mes-annonces/"+(item.source==="auto"?"auto-":"")+item.id+"/modifier";
          const cat=depotCategories.find(c=>c.slug===item.categorie);
          return <article className="mes-annonces-card" key={item.source+item.id}>
            <div className="mes-annonces-image">{item.photo?<img src={item.photo} alt={item.titre}/>:<span>📷</span>}</div>
            <div className="mes-annonces-info">
              <span className="mes-annonces-tag">{cat?.nom||"Automobile & Véhicules"} · {labelStatut[item.statut]||item.statut}</span>
              <h2>{item.titre}</h2>
              <div className="mes-annonces-meta"><strong>{euros(item.prix)}</strong><span>{item.ville}</span><span>{new Date(item.created_at).toLocaleDateString("fr-FR")}</span></div>
              <div className="mes-annonces-actions">
                {item.statut==="publiee"&&<a href={href}><Eye size={14}/> Voir</a>}
                <a href={edition}><Edit3 size={14}/> Modifier</a>
                {item.statut!=="publiee"&&<button type="button" disabled={action===item.source+item.id} onClick={()=>changerStatut(item,"publiee")}><RefreshCw size={14}/> Remettre en ligne</button>}
                {item.statut==="publiee"&&<button type="button" disabled={action===item.source+item.id} onClick={()=>changerStatut(item,"vendue")}><Tag size={14}/> Vendue</button>}
                {item.statut!=="archivee"&&<button type="button" disabled={action===item.source+item.id} onClick={()=>changerStatut(item,"archivee")}><Archive size={14}/> Archiver</button>}
              </div>
            </div>
          </article>;
        })}
      </>}
      <p style={{marginTop:24,color:"#667b94",fontSize:12}}>Les annonces archivées ne sont plus proposées aux visiteurs mais restent disponibles dans votre espace.</p>
    </div>
  </main>;
}
