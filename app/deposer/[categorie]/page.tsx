"use client";
import {useEffect,useMemo,useState} from "react";
import {useParams,useRouter} from "next/navigation";
import {supabase} from "../../lib/supabaseClient";
import {depotCategories,getDepotCategory} from "../categories";
import {OrderedPhotos,FranceLocation,type Commune} from "../../automobile/deposer/PhotosLocalisation";

export default function DeposerCategorie(){
 const params=useParams();const router=useRouter();
 const slug=typeof params.categorie==="string"?params.categorie:"";
 const category=getDepotCategory(slug);
 const [photos,setPhotos]=useState<File[]>([]);
 const [video,setVideo]=useState<File|null>(null);
 const [titre,setTitre]=useState("");const [description,setDescription]=useState("");
 const [prix,setPrix]=useState("");const [sousCategorie,setSousCategorie]=useState("");
 const [etat,setEtat]=useState("Occasion");
 const [localisation,setLocalisation]=useState<Commune|null>(null);
 const [fields,setFields]=useState<Record<string,string>>({});
 const [busy,setBusy]=useState(false);const [message,setMessage]=useState("");
 const [confirmed,setConfirmed]=useState(false);const [publishedId,setPublishedId]=useState("");
 const [email,setEmail]=useState("");
 const [auth,setAuth]=useState(false);
 useEffect(()=>{void supabase.auth.getUser().then(({data})=>{setAuth(Boolean(data.user));setEmail(data.user?.email??"")});const {data}=supabase.auth.onAuthStateChange((_event,session)=>{setAuth(Boolean(session?.user));setEmail(session?.user?.email??"")});return()=>data.subscription.unsubscribe()},[]);
 const fileSummary=useMemo(()=>photos.map(p=>p.name).join(", "),[photos]);
 async function publish(){
  setMessage("");if(!category||busy)return;
  if(!sousCategorie||titre.trim().length<8||description.trim().length<20||!localisation){setMessage("Choisissez une sous-catégorie, renseignez un titre (8 caractères minimum), une description (20 caractères minimum) et la localisation.");return}
  if(prix!==""&&(!Number.isFinite(Number(prix))||Number(prix)<0)){setMessage("Le prix doit être un montant valide.");return}
  if(!confirmed){setMessage("Veuillez confirmer les informations avant de publier.");return}
  const {data:{user}}=await supabase.auth.getUser();
  if(!user){setMessage("Connectez-vous pour déposer une annonce.");return}
  if(photos.some(f=>!["image/jpeg","image/png","image/webp"].includes(f.type)||f.size>10*1024*1024)){setMessage("Les photos doivent être au format JPG, PNG ou WEBP et ne pas dépasser 10 Mo chacune.");return}
  if(video&&(!["video/mp4","video/webm","video/quicktime"].includes(video.type)||video.size>100*1024*1024)){setMessage("La vidéo doit être au format MP4, WEBM ou MOV, et ne pas dépasser 100 Mo.");return}
  setBusy(true);
  const {data:ad,error:insertError}=await supabase.from("annonces_marketplace").insert({
   user_id:user.id,categorie:category.slug,sous_categorie:sousCategorie,
   titre:titre.trim(),description:description.trim(),prix:prix===""?null:Number(prix),
   ville:localisation.nom,code_postal:localisation.codePostal,
   caracteristiques:{etat,...fields,localisation:{code:localisation.code,departement:localisation.departement}},
   photos:[],statut:"brouillon"
  }).select("id").single();
  if(insertError||!ad){setMessage("Création impossible : "+(insertError?.message||"Erreur inconnue"));setBusy(false);return}
  const links:string[]=[];
  for(let i=0;i<photos.length;i++){
   const file=photos[i];const ext=file.name.split(".").pop()?.toLowerCase()||"jpg";
   const key=user.id+"/"+ad.id+"/"+String(i+1).padStart(2,"0")+"-"+crypto.randomUUID()+"."+ext;
   const {error}=await supabase.storage.from("annonces-marketplace").upload(key,file,{contentType:file.type,upsert:false});
   if(error){setMessage("Brouillon sauvegardé ; impossible d'envoyer une photo : "+error.message);setBusy(false);return}
   links.push(supabase.storage.from("annonces-marketplace").getPublicUrl(key).data.publicUrl);
  }
  let videoUrl="";
  if(video){
   const ext=video.name.split(".").pop()?.toLowerCase()||"mp4";
   const key=user.id+"/"+ad.id+"/video-"+crypto.randomUUID()+"."+ext;
   const {error}=await supabase.storage.from("annonces-marketplace-videos").upload(key,video,{contentType:video.type,upsert:false});
   if(error){setMessage("Brouillon sauvegardé ; impossible d'envoyer la vidéo : "+error.message);setBusy(false);return}
   videoUrl=supabase.storage.from("annonces-marketplace-videos").getPublicUrl(key).data.publicUrl;
  }
  const {error}=await supabase.from("annonces_marketplace").update({photos:links,caracteristiques:{etat,...fields,video_url:videoUrl,localisation:{code:localisation.code,departement:localisation.departement}},statut:"publiee"}).eq("id",ad.id).eq("user_id",user.id);
  if(error){setMessage("Brouillon sauvegardé, publication non finalisée : "+error.message);setBusy(false);return}
  setPublishedId(ad.id);setMessage("Annonce publiée ! Retrouvez-la dans Mon compte → Mes annonces.");setBusy(false);
 }
 if(!category)return <main style={{padding:28}}><h1>Catégorie non trouvée</h1><a href="/deposer">Voir toutes les catégories</a></main>;
 if(slug==="automobile"){router.replace("/automobile/deposer");return <p>Redirection vers le dépôt automobile…</p>}
 return <main className="depot-special">
 <style>{`
 .depot-special{font-family:Arial,Helvetica,sans-serif;color:#082455;padding:8px 4px 32px}
 .depot-special *{box-sizing:border-box}
 .depot-special .head{border-radius:15px;padding:25px;min-height:170px;background:linear-gradient(90deg,#071c48ed,#071c48ba 51%,#071c4812),url('/accueil-reel/bandeau.svg') center/cover;color:white}
 .depot-special .head h1{font-size:clamp(25px,3vw,38px);margin:8px 0;color:#fff}
 .depot-special .head a{color:#ffdf35}
 .depot-special .steps{display:flex;flex-wrap:wrap;gap:9px;margin:16px 0}
 .depot-special .steps span{padding:10px 13px;border-radius:24px;background:#eaf2ff;font-size:13px;font-weight:800;color:#0a366e}
 .depot-special .box{background:#fff;border:1px solid #d7e3f2;border-radius:16px;padding:20px 22px;margin:16px 0;box-shadow:0 2px 10px #1c365110}
 .depot-special .box h2{font-size:22px;margin:0 0 15px}
 .depot-special .row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
 .depot-special label{display:flex;flex-direction:column;gap:8px;font-weight:700;font-size:14px;margin:9px 0}
 .depot-special input:not([type="checkbox"]):not([type="file"]),.depot-special select,.depot-special textarea{width:100%;padding:12px;border:1px solid #b6c9df;border-radius:9px;background:white;font:inherit;color:#092451}
 .depot-special textarea{min-height:115px}
 .depot-special button.main{background:#ffcf09;color:#082455;border:0;border-radius:11px;padding:14px 21px;font-weight:900;font-size:16px;cursor:pointer}
 .depot-special .video-drop{background:#f8fbff;border:2px dashed #adc6e6;padding:20px;border-radius:13px}
 .depot-special .caption{font-size:13px;color:#4f6280}
 @media(max-width:700px){.depot-special .row{grid-template-columns:1fr}}
 `}</style>
 <header className="head"><a href="/deposer">← Choisir une autre catégorie</a><h1>{category.icone} Déposer une annonce : {category.nom}</h1><p>{category.resume} · 100 % gratuit pour les particuliers</p></header>
 <div className="steps">{["1. Sous-catégorie","2. Photos & vidéo","3. Informations","4. Vérification","5. Publication"].map(x=><span key={x}>{x}</span>)}</div>
 <section className="box"><h2>1. Choisissez une sous-catégorie</h2>
 <label>Type d'annonce<select required value={sousCategorie} onChange={e=>setSousCategorie(e.target.value)}><option value="">Choisir une sous-catégorie</option>{category.sousCategories.map(s=><option key={s}>{s}</option>)}</select></label>
 {category.slug==="maison-bricolage-jardin"&&<p className="caption">Bricolage, matériaux de construction, outillage et jardinage disposent de sous-catégories distinctes.</p>}
 </section>
 <section className="box"><h2>2. Ajoutez vos photos et/ou une vidéo</h2>
 <p className="caption">Jusqu'à 10 photos JPG, PNG ou WEBP (10 Mo maximum chacune). Vous pouvez réorganiser vos photos.</p>
 <OrderedPhotos files={photos} onChange={setPhotos}/>
 <div className="video-drop"><label>🎥 Ajouter une vidéo (facultatif)<input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={e=>{const f=e.target.files?.[0]||null;setVideo(f);if(f&&f.size>100*1024*1024)setMessage("Vidéo trop volumineuse : maximum 100 Mo.")}}/></label>
 <p className="caption">Une vidéo MP4, WEBM ou MOV, jusqu'à 100 Mo. {video?"Sélectionnée : "+video.name:"Aucune vidéo sélectionnée."}</p></div>
 </section>
 <section className="box"><h2>3. Renseignez les informations</h2>
 <div className="row"><label>Titre de l'annonce *<input maxLength={140} required placeholder="Décrivez précisément votre bien" value={titre} onChange={e=>setTitre(e.target.value)}/></label>
 <label>Prix en euros (laisser vide si non applicable)<input type="number" min="0" step="0.01" placeholder="Ex. 150" value={prix} onChange={e=>setPrix(e.target.value)}/></label></div>
 <label>Description *<textarea maxLength={4000} required placeholder="État, dimensions, informations utiles, conditions…" value={description} onChange={e=>setDescription(e.target.value)}/></label>
 <div className="row"><label>État<select value={etat} onChange={e=>setEtat(e.target.value)}><option>Occasion</option><option>Neuf</option><option>Reconditionné</option><option>Non applicable</option></select></label>
 {category.champs.map(ch=><label key={ch.key}>{ch.label}{ch.type==="select"?<select value={fields[ch.key]??""} onChange={e=>setFields(x=>({...x,[ch.key]:e.target.value}))}><option value="">Non renseigné</option>{ch.options?.map(o=><option key={o}>{o}</option>)}</select>:<input type={ch.type==="number"?"number":"text"} min={ch.type==="number"?"0":undefined} value={fields[ch.key]??""} onChange={e=>setFields(x=>({...x,[ch.key]:e.target.value}))}/>}</label>)}
 </div>
 <FranceLocation selected={localisation} onChange={setLocalisation}/>
 </section>
 <section className="box"><h2>4. Vérifiez et prévisualisez</h2>
 <div style={{background:"#f5f8ff",padding:17,borderRadius:12}}><strong style={{fontSize:20}}>{titre||"Titre de votre annonce"}</strong><p>{sousCategorie||"Sous-catégorie"} · {prix?Number(prix).toLocaleString("fr-FR")+" €":"Prix non indiqué"} · {localisation?.nom||"Localisation à compléter"}</p>
 <p style={{whiteSpace:"pre-wrap"}}>{description||"Votre description apparaîtra ici."}</p>
 <p className="caption">{photos.length} photo(s){video?" · 1 vidéo":""}</p></div>
 <label style={{flexDirection:"row",alignItems:"start",fontWeight:500}}><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/> Je confirme l'exactitude de mon annonce et le respect des conditions de publication.</label>
 </section>
 <section className="box"><h2>5. Publiez votre annonce</h2>
 <p>Publication gratuite pour les particuliers. Votre annonce apparaîtra dans votre espace « Mes annonces ».</p>
 {auth?<p className="caption">Connecté : {email}</p>:<p>Connectez-vous dans <a href="/compte">Mon compte</a> avant publication.</p>}
 <button type="button" className="main" disabled={busy||Boolean(publishedId)} onClick={()=>void publish()}>{busy?"Publication en cours…":publishedId?"✓ Annonce publiée":"Publier gratuitement"}</button>
 {message&&<p role="status" style={{fontWeight:700,marginTop:13}}>{message}</p>}
 {publishedId&&<p><a href={"/annonces/"+publishedId}>Voir mon annonce publiée →</a> · <a href="/compte/annonces">Mes annonces</a></p>}
 </section></main>;
}
