"use client";
import {useState} from "react";
import {supabase} from "../../../lib/supabaseClient";
import {FranceLocation,OrderedPhotos,type Commune} from "../PhotosLocalisation";

type MotoType={title:string;dbType:string;icon:string};
const types:MotoType[]=[
 {title:"Roadster",dbType:"moto",icon:"🏍️"},
 {title:"Sportive",dbType:"moto",icon:"🏍️"},
 {title:"Trail / Adventure",dbType:"moto",icon:"🏍️"},
 {title:"Custom",dbType:"moto",icon:"🏍️"},
 {title:"GT / Routière",dbType:"moto",icon:"🏍️"},
 {title:"Enduro",dbType:"moto",icon:"🏍️"},
 {title:"Cross",dbType:"moto",icon:"🏍️"},
 {title:"Scooter",dbType:"scooter",icon:"🛵"},
 {title:"Quad",dbType:"quad",icon:"🛞"},
 {title:"Autre",dbType:"moto",icon:"🏍️"}
];
const labels=["Véhicule","Photos & vidéo","Description","Localisation","Récapitulatif","Publication"];
const checks=["Renseignez toutes les informations","Ajoutez des photos de qualité","Décrivez l’état et l’historique de la moto","Indiquez les renseignements importants","Une annonce complète se vend plus vite !"];
export default function DeposerAnnonceMoto(){
 const [step,setStep]=useState(0);
 const [type,setType]=useState("");
 const [f,setF]=useState<Record<string,string>>({});
 const [photos,setPhotos]=useState<File[]>([]);
 const [video,setVideo]=useState<File|null>(null);
 const [location,setLocation]=useState<Commune|null>(null);
 const [confirmed,setConfirmed]=useState(false);
 const [sending,setSending]=useState(false);
 const [message,setMessage]=useState("");
 const field=(key:string,val:string)=>setF(o=>({...o,[key]:val}));
 const selected=types.find(t=>t.title===type);
 const validate=(level:number)=>{
  if(level>=0&&(!type||!f.marque?.trim()||!f.modele?.trim()||!f.annee||!f.kilometrage||!f.cylindree||!f.puissance||!f.couleur||!f.boite||!f.carburant||!f.etat)){
    setMessage("Complétez les informations obligatoires de votre moto et choisissez son type.");return false;
  }
  if(Number(f.annee)<1900||Number(f.annee)>new Date().getFullYear()+1||Number(f.kilometrage)<0||Number(f.cylindree)<0||Number(f.puissance)<0){
    setMessage("Vérifiez les valeurs de l'année, du kilométrage, de la cylindrée et de la puissance.");return false;
  }
  if(level>=2&&(!f.prix||Number(f.prix)<=0||!f.description?.trim())){setMessage("Indiquez le prix et une description de la moto.");return false;}
  if(level>=3&&!location){setMessage("Choisissez une commune française.");return false;}
  return true;
 };
 const move=(next:number)=>{
  setMessage("");
  if(next>step&&!validate(step))return;
  if(next>2&&!validate(2))return;
  if(next>3&&!validate(3))return;
  setStep(Math.max(0,Math.min(next,5)));
  document.getElementById("moto-form-top")?.scrollIntoView({behavior:"smooth",block:"start"});
 };
 async function publish(){
  setMessage("");
  if(!validate(3))return;
  if(!confirmed){setMessage("Cochez la confirmation avant publication.");return;}
  const {data:{user}}=await supabase.auth.getUser();
  if(!user){setMessage("Connectez-vous à votre compte pour publier l’annonce.");return;}
  if(sending)return;
  setSending(true);
  try{
    const specific=[["Type de moto",type],["Cylindrée",f.cylindree+" cm³"],["Permis",f.permis],["Version",f.version]]
      .filter(([,v])=>Boolean(v)).map(([k,v])=>k+" : "+v).join("\n");
    const {data:draft,error}=await supabase.from("annonces_auto").insert({
      user_id:user.id,statut:"brouillon",type_vehicule:selected?.dbType||"moto",
      marque:f.marque.trim(),modele:f.modele.trim(),finition:f.version||null,
      titre:f.titre?.trim()||[f.marque,f.modele,f.annee].filter(Boolean).join(" "),
      annee:Number(f.annee),kilometrage:Number(f.kilometrage),
      puissance_ch:Number(f.puissance),carburant:f.carburant,boite:f.boite,
      couleur:f.couleur,prix:Number(f.prix),
      description:[f.description,specific].filter(Boolean).join("\n\n"),
      etat_vehicule:f.etat,ville:location!.nom,departement:location!.departement,
      code_postal:location!.codePostal,code_insee:location!.code,
      latitude:location!.latitude,longitude:location!.longitude,
      telephone_contact:f.telephone||null,email_contact:f.email||null,
      mia_verifie:false
    }).select("id").single();
    if(error||!draft)throw Error(error?.message||"Impossible d’enregistrer le brouillon.");
    const uploaded:string[]=[];
    for(let i=0;i<photos.length;i++){
      const file=photos[i];
      const ext=file.name.split(".").pop()?.toLowerCase()||"jpg";
      const key=user.id+"/"+draft.id+"/"+String(i+1).padStart(2,"0")+"-"+crypto.randomUUID()+"."+ext;
      const {error:upError}=await supabase.storage.from("annonces-auto").upload(key,file,{contentType:file.type,upsert:false});
      if(upError)throw Error("Brouillon enregistré mais envoi des photos interrompu : "+upError.message);
      uploaded.push(supabase.storage.from("annonces-auto").getPublicUrl(key).data.publicUrl);
    }
    let videoUrl:string|null=null;
    if(video){
      const ext=video.name.split(".").pop()?.toLowerCase()||"mp4";
      const key=user.id+"/"+draft.id+"/video-"+crypto.randomUUID()+"."+ext;
      const {error:ve}=await supabase.storage.from("annonces-auto-videos").upload(key,video,{contentType:video.type,upsert:false});
      if(ve)throw Error("Brouillon enregistré mais vidéo non envoyée : "+ve.message);
      videoUrl=supabase.storage.from("annonces-auto-videos").getPublicUrl(key).data.publicUrl;
    }
    const {error:publishError}=await supabase.from("annonces_auto").update({photos:uploaded,video_url:videoUrl,statut:"publiee"}).eq("id",draft.id).eq("user_id",user.id);
    if(publishError)throw Error("Brouillon enregistré mais publication impossible : "+publishError.message);
    setMessage("Votre annonce moto est publiée. Vous pouvez la retrouver dans votre compte.");
  }catch(e){setMessage(e instanceof Error?e.message:"Erreur lors de la publication.");}
  finally{setSending(false);}
 }
 const input=(name:string,label:string,placeholder="",type="text")=><label key={name}>{label}<input type={type} placeholder={placeholder} value={f[name]||""} onChange={e=>field(name,e.target.value)}/></label>;
 const select=(name:string,label:string,opts:string[],placeholder="Sélectionner")=><label key={name}>{label}<select value={f[name]||""} onChange={e=>field(name,e.target.value)}><option value="">{placeholder}</option>{opts.map(x=><option key={x} value={x}>{x}</option>)}</select></label>;
 return <main className="moto-deposit" id="moto-form-top">
 <style>{`
 .moto-deposit{font-family:Arial,Helvetica,sans-serif;background:#f4f7fc;color:#092653;padding:0 0 35px;max-width:100%;overflow:hidden}
 .moto-deposit *{box-sizing:border-box}
 .moto-deposit .moto-hero{width:100%;height:clamp(240px,25vw,410px);border-radius:15px;position:relative;overflow:hidden;background:linear-gradient(90deg,#041e43 0%,#052c54 45%,#0c5ba1 100%);margin:0 0 11px}
 .moto-deposit .moto-hero .moto-landscape{position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=85') center/cover no-repeat;filter:saturate(1.15)}
 .moto-deposit .moto-hero .moto-veil{position:absolute;inset:0;background:linear-gradient(90deg,#031c3df5 0%,#06244fd8 29%,#10386763 55%,#00173522 100%)}
 .moto-deposit .moto-showcase{position:absolute;left:47%;right:1%;bottom:3%;top:32%;display:flex;align-items:end;gap:5px}
 .moto-deposit .moto-showcase img{width:33.333%;height:95%;object-fit:contain;object-position:bottom;mix-blend-mode:multiply;filter:contrast(1.1)}
 .moto-deposit .moto-hero-copy{position:absolute;left:clamp(14px,3%,40px);top:12%;width:61%;z-index:1;color:white;text-shadow:0 2px 4px #05173599}
 .moto-deposit .moto-hero-copy h1{font-size:clamp(23px,2.85vw,43px);line-height:1.17;margin:8px 0 9px;font-weight:900}
 .moto-deposit .moto-hero-copy h1 strong{color:#ffcc00}
 .moto-deposit .moto-hero-copy p{font-size:clamp(13px,1.35vw,20px);line-height:1.4;margin:0;max-width:490px}
 .moto-deposit .moto-hero-label{display:inline-block;background:white;color:#0a3982;border-radius:22px;padding:7px 14px;font-weight:850}
 .moto-deposit .moto-steps{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:7px;margin:12px 8px 16px}
 .moto-deposit .moto-steps button{border:0;border-bottom:2px solid #c2d0e4;background:transparent;color:#142c53;min-height:64px;cursor:pointer;font-weight:850;display:flex;align-items:center;justify-content:center;gap:7px;flex-direction:column;font-size:clamp(11px,.85vw,14px);line-height:1.2}
 .moto-deposit .moto-steps button b{display:grid;place-items:center;border-radius:50%;background:#dae2ec;color:#143a77;width:30px;height:30px;font-size:16px}
 .moto-deposit .moto-steps button.current{color:#062f82;border-color:#ffcb00}
 .moto-deposit .moto-steps button.current b{background:#ffcc00}
 .moto-deposit .moto-step-layout{display:grid;grid-template-columns:minmax(0,1fr) 225px;gap:15px;padding:0 8px}
 .moto-deposit .moto-panel{background:#fff;border:1px solid #cbd9eb;border-radius:13px;padding:16px;min-width:0;box-shadow:0 2px 8px #0a356812}
 .moto-deposit .moto-panel h2{font-size:clamp(19px,1.5vw,25px);margin:0 0 17px}
 .moto-deposit .moto-fields{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
 .moto-deposit label{display:flex;flex-direction:column;gap:6px;font-size:13px;color:#12315c;font-weight:750}
 .moto-deposit input,.moto-deposit select,.moto-deposit textarea{width:100%;border:1px solid #c0cee0;background:#fff;color:#0b2c62;border-radius:8px;padding:10px 8px;font:inherit;font-size:14px}
 .moto-deposit textarea{min-height:155px;resize:vertical}
 .moto-deposit .type-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px;margin-top:15px}
 .moto-deposit .moto-type{display:flex;align-items:center;justify-content:center;flex-direction:column;gap:5px;min-height:74px;padding:7px 5px;text-align:center;border:1px solid #c9d8ee;border-radius:9px;background:#fff;color:#13315e;cursor:pointer;font-size:12px;font-weight:850}
 .moto-deposit .moto-type .type-icon{font-size:27px}
 .moto-deposit .moto-type.active,.moto-deposit .moto-type:hover{border-color:#f0b400;background:#fff2c4}
 .moto-deposit .moto-help{background:#fff7d4;border-radius:12px;overflow:hidden;align-self:start}
 .moto-deposit .moto-help h3{font-size:15px;margin:0;padding:13px 12px}
 .moto-deposit .moto-help ul{list-style:none;margin:0;padding:0 11px 14px}
 .moto-deposit .moto-help li{font-size:12px;line-height:1.4;margin:7px 0;color:#16452e}
 .moto-deposit .moto-help li:before{content:"✓";margin-right:5px;color:#008c36;font-weight:900}
 .moto-deposit .moto-help img{width:100%;aspect-ratio:1.6;object-fit:cover}
 .moto-deposit .moto-nav{display:flex;justify-content:space-between;gap:12px;margin-top:17px}
 .moto-deposit .moto-nav button{background:#ffcc00;color:#08265a;border:0;border-radius:11px;font-weight:900;font-size:16px;padding:13px 22px;cursor:pointer}
 .moto-deposit .moto-nav button.back{background:#e8f0fb}
 .moto-deposit .moto-message{margin:12px 8px;padding:12px 15px;background:#fff1ca;border:1px solid #ebd59c;border-radius:9px;font-weight:800}
 .moto-deposit .moto-recap{display:grid;grid-template-columns:160px 1fr;gap:10px}
 .moto-deposit .moto-recap dt{font-weight:850}
 .moto-deposit .moto-recap dd{margin:0}
 @media(max-width:850px){.moto-deposit .moto-step-layout{grid-template-columns:1fr}.moto-deposit .moto-help{display:none}.moto-deposit .moto-fields{grid-template-columns:repeat(2,1fr)}.moto-deposit .type-grid{grid-template-columns:repeat(3,1fr)}}
 @media(max-width:580px){.moto-deposit .moto-fields{grid-template-columns:1fr}.moto-deposit .type-grid{grid-template-columns:repeat(2,1fr)}.moto-deposit .moto-steps{overflow-x:auto;display:flex}.moto-deposit .moto-steps button{flex:0 0 88px}.moto-deposit .moto-hero{height:245px}.moto-deposit .moto-hero-copy{width:92%}.moto-deposit .moto-showcase{opacity:.3}}


 /* Image stable, visible and not repeated three times or partially cropped. */
 .moto-deposit .moto-hero{height:clamp(270px,25vw,420px)!important;background:#e8f0fb!important}
 .moto-deposit .moto-hero .moto-landscape{background-image:url('/auto-reel/motos.svg')!important;background-position:center 53%!important;background-size:cover!important;filter:none!important}
 .moto-deposit .moto-hero .moto-veil{background:linear-gradient(90deg,#021e44 0%,#04244ded 34%,#07366ca8 53%,#0b3c5410 79%)!important}
 .moto-deposit .moto-showcase{display:none!important}
 .moto-deposit .moto-hero-copy{top:50%!important;transform:translateY(-50%)!important;width:min(58%,600px)!important}
 .moto-deposit .moto-hero-copy h1{font-size:clamp(25px,2.65vw,44px)!important}
 .moto-deposit .moto-help img{display:block;width:100%!important;height:auto!important;aspect-ratio:16/10!important;object-fit:contain!important;object-position:center!important;background:#eaf1fa!important}
 .moto-deposit .moto-type{height:106px!important;min-height:106px!important;gap:8px!important;border-radius:11px!important;overflow:hidden!important}
 .moto-deposit .moto-type .type-icon{width:100%!important;height:59px!important;display:flex!important;align-items:center!important;justify-content:center!important;font-size:31px!important;line-height:1!important;border-radius:7px!important;background:#eef5ff!important}
 .moto-deposit .moto-type span:last-child{font-size:13px!important;line-height:1.25!important}
 @media(max-width:580px){.moto-deposit .moto-hero-copy{width:91%!important}.moto-deposit .moto-hero .moto-veil{background:linear-gradient(90deg,#021e44f5 0%,#04244de6 63%,#07366a70 100%)!important}}
 `}</style>
 <header className="moto-hero">
  <div className="moto-landscape"/><div className="moto-veil"/>
  <div className="moto-showcase" aria-hidden="true"><img src="/auto-reel/motos.svg" alt=""/></div>
  <div className="moto-hero-copy"><span className="moto-hero-label">🏍️ Moto</span><h1>Déposez votre annonce moto <strong>en quelques minutes</strong></h1><p>Vendez votre moto simplement et gratuitement sur <b>TOUT ICI ANNONCES</b>.</p></div>
 </header>
 <nav className="moto-steps" aria-label="Étapes du dépôt de moto">{labels.map((label,i)=><button key={label} type="button" className={i===step?"current":""} onClick={()=>move(i)}><b>{i+1}</b>{label}</button>)}</nav>
 <div className="moto-step-layout"><section className="moto-panel">
 {step===0&&<><h2>Étape 1/6 – Informations sur la moto</h2><div className="moto-fields">
 {input("marque","Marque *","Ex. Honda, BMW, Yamaha")}
 {input("kilometrage","Kilométrage *","Ex. 25 000 km","number")}
 {select("boite","Boîte de vitesses *",["Manuelle","Automatique","Semi-automatique"])}
 {input("modele","Modèle *","Ex. MT-07, GS 1250")}
 {input("puissance","Puissance (ch) *","Ex. 73","number")}
 {select("couleur","Couleur *",["Noir","Blanc","Gris","Bleu","Rouge","Vert","Orange","Jaune","Autre"])}
 {input("version","Version / Finition","Ex. GT, Sport, Rallye")}
 {input("cylindree","Cylindrée (cm³) *","Ex. 689","number")}
 {select("etat","État du véhicule *",["Neuf","Occasion","Reconditionné","À réparer","Non roulant","Pour pièces"])}
 {input("annee","Année de mise en circulation *","Ex. 2021","number")}
 {select("carburant","Carburant *",["Essence","Électrique","Hybride","Autre"])}
 {select("permis","Permis",["AM","A1","A2","A","Sans permis","Non précisé"])}
 </div><h3>Type de moto (catégorie)</h3><div className="type-grid">{types.map(t=><button key={t.title} className={"moto-type"+(type===t.title?" active":"")} type="button" onClick={()=>setType(t.title)}><span className="type-icon">{t.icon}</span><span>{t.title}</span></button>)}</div></>}
 {step===1&&<><h2>Étape 2/6 – Photos et vidéo</h2><p>Ajoutez jusqu’à 10 photos de votre moto. Vous pouvez modifier leur ordre.</p><OrderedPhotos files={photos} onChange={setPhotos}/><label style={{marginTop:18}}>Vidéo (facultative)<input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={e=>setVideo(e.target.files?.[0]||null)}/></label></>}
 {step===2&&<><h2>Étape 3/6 – Description et prix</h2><div className="moto-fields">{input("titre","Titre de l’annonce","Ex. BMW R 1250 GS 2021")}{input("prix","Prix demandé (€) *","Ex. 9 900","number")}</div><label style={{marginTop:16}}>Description détaillée *<textarea value={f.description||""} onChange={e=>field("description",e.target.value)} placeholder="État de la moto, historique, entretien, factures, raisons de la vente..."/></label></>}
 {step===3&&<><h2>Étape 4/6 – Localisation et coordonnées</h2><FranceLocation selected={location} onChange={setLocation}/><div className="moto-fields" style={{marginTop:16}}>{input("email","E-mail de contact","","email")}{input("telephone","Téléphone de contact","","tel")}</div></>}
 {step===4&&<><h2>Étape 5/6 – Récapitulatif</h2><dl className="moto-recap"><dt>Catégorie</dt><dd>{type}</dd><dt>Marque et modèle</dt><dd>{f.marque} {f.modele}</dd><dt>Année / kilomètres</dt><dd>{f.annee} / {f.kilometrage} km</dd><dt>Puissance / cylindrée</dt><dd>{f.puissance} ch / {f.cylindree} cm³</dd><dt>Prix</dt><dd>{f.prix} €</dd><dt>Commune</dt><dd>{location?.nom||"Non renseignée"}</dd><dt>Photos</dt><dd>{photos.length}</dd><dt>Description</dt><dd>{f.description||"—"}</dd></dl></>}
 {step===5&&<><h2>Étape 6/6 – Publication</h2><p>Vérifiez les informations avant de publier votre moto.</p><label style={{flexDirection:"row",alignItems:"center",gap:10}}><input type="checkbox" style={{width:20,height:20}} checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/> Je confirme que les informations sont exactes.</label></>}
 <div className="moto-nav"><button type="button" className="back" disabled={step===0} onClick={()=>move(step-1)}>← Précédent</button>{step<5?<button type="button" onClick={()=>move(step+1)}>Suivant →</button>:<button type="button" onClick={publish} disabled={sending}>{sending?"Publication en cours…":"Publier mon annonce →"}</button>}</div>
 </section><aside className="moto-help"><h3>💡 Conseils pour votre annonce</h3><ul>{checks.map(t=><li key={t}>{t}</li>)}</ul><img src="/auto-reel/motos.svg" alt="Moto pour illustrer l'annonce"/></aside></div>
 {message&&<div className="moto-message" role="status">{message}</div>}
 </main>;
}
