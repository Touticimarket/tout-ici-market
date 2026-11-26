"use client";
import {useEffect,useState} from "react";
import {supabase} from "../lib/supabaseClient";
import FavoriteAnnonceButton from "./FavoriteAnnonceButton";
import ShareLinks from "./ShareLinks";
import ContacterVendeur from "./ContacterVendeur";

type Props={
 id:string;ownerId:string;title:string;price:number|null;location:string;
 photos:string[];description:string|null;details:[string,string][];
 options:string[];videoUrl:string|null;
};
export default function PremiumAutoAnnonce(p:Props){
 const [photos,setPhotos]=useState(p.photos);
 const [selected,setSelected]=useState(0);
 const [zoom,setZoom]=useState(false);
 const [isOwner,setIsOwner]=useState(false);
 const [editor,setEditor]=useState(false);
 const [busy,setBusy]=useState(false);
 const [notice,setNotice]=useState("");
 useEffect(()=>{let active=true;void supabase.auth.getUser().then(({data})=>{if(active)setIsOwner(Boolean(data.user&&data.user.id===p.ownerId))});return()=>{active=false}},[p.ownerId]);
 const cover=photos[Math.min(selected,Math.max(0,photos.length-1))];
 const print=()=>window.print();
 async function copy(){
  try{await navigator.clipboard.writeText(window.location.href);setNotice("Lien de l'annonce copié.")}
  catch{setNotice("Copiez l’adresse de cette page dans votre navigateur.")}
 }
 function move(from:number,to:number){if(to<0||to>=photos.length)return;setPhotos(old=>{const arr=[...old];const [a]=arr.splice(from,1);arr.splice(to,0,a);return arr});setSelected(to)}
 async function addImages(files:FileList|null){
  if(!files||!files.length)return;
  const valid=Array.from(files).filter(f=>["image/jpeg","image/png","image/webp"].includes(f.type)&&f.size<=10*1024*1024);
  if(valid.length!==files.length){setNotice("Certaines images ont été refusées : JPG, PNG ou WebP, 10 Mo maximum.");}
  if(!valid.length||photos.length>=10){setNotice("Maximum 10 photos par annonce.");return;}
  setBusy(true);
  const {data:{user}}=await supabase.auth.getUser();
  if(!user||user.id!==p.ownerId){setNotice("Vous devez être propriétaire de l'annonce.");setBusy(false);return}
  const uploaded:string[]=[];
  for(const file of valid.slice(0,10-photos.length)){
   const ext=file.name.split(".").pop()?.toLowerCase()||"jpg";
   const key=user.id+"/"+p.id+"/photo-"+crypto.randomUUID()+"."+ext;
   const {error}=await supabase.storage.from("annonces-auto").upload(key,file,{contentType:file.type,upsert:false});
   if(error){setNotice("Impossible d'envoyer une photo : "+error.message);break;}
   uploaded.push(supabase.storage.from("annonces-auto").getPublicUrl(key).data.publicUrl);
  }
  if(uploaded.length){setPhotos(old=>[...old,...uploaded]);setNotice(uploaded.length+" photo(s) ajoutée(s). Cliquez sur Enregistrer pour publier les changements.")}
  setBusy(false);
 }
 async function savePhotos(){
  setBusy(true);setNotice("");
  const {data:{user}}=await supabase.auth.getUser();
  if(!user||user.id!==p.ownerId){setNotice("Connexion du propriétaire requise.");setBusy(false);return;}
  const {data,error}=await supabase.from("annonces_auto").update({photos}).eq("id",p.id).eq("user_id",user.id).select("id").maybeSingle();
  setBusy(false);
  if(error||!data){setNotice("Enregistrement non confirmé. Vérifiez vos droits : "+(error?.message||"aucune ligne modifiée"));return}
  setSelected(0);setEditor(false);setNotice("Photos enregistrées sur votre annonce.");
 }
 return <main className="premium-auto-ad">
 <style>{`
 .premium-auto-ad{font-family:Arial,Helvetica,sans-serif;background:#f3f7fd;color:#0b2147;padding:22px clamp(12px,2.6vw,38px) 42px;min-height:70vh}
 .premium-auto-ad *{box-sizing:border-box}
 .premium-auto-ad .breadcrumb{display:inline-flex;margin-bottom:17px;font-size:15px;color:#164785;font-weight:750;text-decoration:none}
 .premium-auto-ad .top-card,.premium-auto-ad .gallery-card,.premium-auto-ad .panel,.premium-auto-ad .seller{background:#fff;border:1px solid #dfe8f5;border-radius:20px;box-shadow:0 5px 22px #0b27550d}
 .premium-auto-ad .top-card{padding:23px 27px;margin-bottom:17px}
 .premium-auto-ad .kicker{text-transform:uppercase;color:#1765b8;font-size:12px;font-weight:900;letter-spacing:.1em;margin:0 0 8px}
 .premium-auto-ad h1{font-size:clamp(25px,2.55vw,39px);line-height:1.15;margin:0 0 13px;letter-spacing:-.025em;color:#091c43}
 .premium-auto-ad .heading-row{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
 .premium-auto-ad .price{font-size:clamp(28px,2.6vw,39px);font-weight:900;color:#0951a9}
 .premium-auto-ad .location{color:#5a6d87;font-size:16px;font-weight:700}
 .premium-auto-ad .actions{display:flex;gap:9px;flex-wrap:wrap;align-items:center;margin-top:17px}
 .premium-auto-ad button,.premium-auto-ad .owner-link{cursor:pointer;font-family:inherit}
 .premium-auto-ad .action{border:1px solid #c8d9f0;background:#f5f9ff;border-radius:13px;padding:11px 14px;color:#0c3a7c;font-weight:800;font-size:15px;text-decoration:none}
 .premium-auto-ad .action:hover{background:#eaf2ff}
 .premium-auto-ad .layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(260px,310px);align-items:start;gap:18px}
 .premium-auto-ad .gallery-card{padding:14px;min-width:0}
 .premium-auto-ad .hero-frame{position:relative;aspect-ratio:16/10;background:#e9f0f9;border-radius:15px;display:flex;align-items:center;justify-content:center;overflow:hidden}
 .premium-auto-ad .hero-frame img{width:100%;height:100%;object-fit:contain}
 .premium-auto-ad .zoom-button{position:absolute;right:15px;bottom:14px;padding:10px 15px;border:0;background:#fff;border-radius:11px;font-weight:900;color:#0a2a5a;box-shadow:0 2px 10px #0002}
 .premium-auto-ad .photo-count{position:absolute;left:14px;bottom:14px;border-radius:9px;padding:8px 11px;background:#071c43c9;color:white;font-size:13px;font-weight:800}
 .premium-auto-ad .thumbs{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:9px;margin-top:10px}
 .premium-auto-ad .thumb{padding:0;border:3px solid transparent;background:#e9eff8;border-radius:10px;overflow:hidden;aspect-ratio:1.45}
 .premium-auto-ad .thumb.active{border-color:#ffd017}
 .premium-auto-ad .thumb img{display:block;width:100%;height:100%;object-fit:cover}
 .premium-auto-ad .content{min-width:0}
 .premium-auto-ad .panel{padding:24px;margin-top:18px}
 .premium-auto-ad .panel h2,.premium-auto-ad .seller h2{margin:0 0 18px;font-size:22px;color:#071f4b}
 .premium-auto-ad .details{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
 .premium-auto-ad .detail{background:#f4f8fe;border:1px solid #e7effa;border-radius:12px;padding:14px;min-width:0}
 .premium-auto-ad .detail small{display:block;font-size:12px;color:#667894;font-weight:750}
 .premium-auto-ad .detail strong{display:block;margin-top:6px;font-size:17px;overflow-wrap:anywhere}
 .premium-auto-ad .option-list{display:flex;flex-wrap:wrap;gap:8px}
 .premium-auto-ad .option{background:#ecf5ff;color:#16467a;border:1px solid #d4e7ff;border-radius:25px;padding:8px 12px;font-size:14px;font-weight:700}
 .premium-auto-ad .seller{padding:23px;position:sticky;top:16px}
 .premium-auto-ad .seller .seller-price{font-size:30px;font-weight:900;color:#0754aa}
 .premium-auto-ad .seller .seller-hint{font-size:14px;color:#61728b;margin:13px 0}
 .premium-auto-ad .seller button{font-size:15px}
 .premium-auto-ad .notice{margin-top:13px;color:#125b3c;font-weight:700;font-size:14px}
 .premium-auto-ad .edit-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:18px}
 .premium-auto-ad .edit-photo{background:#f5f9ff;border:1px solid #cfdef3;border-radius:12px;padding:8px;min-width:0}
 .premium-auto-ad .edit-photo img{width:100%;height:100px;object-fit:cover;border-radius:8px}
 .premium-auto-ad .edit-controls{display:flex;justify-content:center;gap:5px;margin-top:7px;flex-wrap:wrap}
 .premium-auto-ad .edit-controls button{border:1px solid #cbdbf0;background:white;border-radius:7px;padding:6px 9px}
 .premium-auto-ad .editor-cta{display:flex;gap:9px;flex-wrap:wrap;align-items:center;margin-top:14px}
 .premium-auto-ad .save-btn{background:#ffd008;border:0;color:#061b44;border-radius:11px;font-size:15px;font-weight:900;padding:13px 18px}
 .premium-auto-ad .lightbox{position:fixed;inset:0;z-index:1000;background:#030d1eee;display:flex;align-items:center;justify-content:center;padding:55px}
 .premium-auto-ad .lightbox img{max-width:100%;max-height:100%;object-fit:contain}
 .premium-auto-ad .lightbox-close{position:absolute;right:22px;top:17px;color:white;background:#ffffff30;border:1px solid #fff6;border-radius:10px;padding:12px 16px;font-weight:900}
 .premium-auto-ad .lightbox-count{position:absolute;left:24px;bottom:17px;color:#fff;font-size:15px;font-weight:750}
 .premium-auto-ad .video{width:100%;max-height:450px;border-radius:12px;background:#071a42}
 @media(max-width:1100px){.premium-auto-ad .layout{grid-template-columns:1fr}.premium-auto-ad .seller{position:static}.premium-auto-ad .details{grid-template-columns:repeat(2,minmax(0,1fr))}}
 @media(max-width:600px){.premium-auto-ad .top-card{padding:18px}.premium-auto-ad .panel,.premium-auto-ad .seller{padding:17px}.premium-auto-ad .details{grid-template-columns:1fr 1fr}.premium-auto-ad .thumbs{grid-template-columns:repeat(4,minmax(0,1fr))}.premium-auto-ad .edit-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.premium-auto-ad .lightbox{padding:45px 8px}}
 @media print{
 body{background:white!important}
 header,.tim-header,.tim-navbar,.tim-sidebar,.tim-header-links,footer,.tim-footer{display:none!important}
 .premium-auto-ad{padding:0;background:white;color:#000}
 .premium-auto-ad .breadcrumb,.premium-auto-ad .actions,.premium-auto-ad .seller,.premium-auto-ad .zoom-button,.premium-auto-ad .thumbs,.premium-auto-ad .editor-cta,.premium-auto-ad .photo-count,.premium-auto-ad .notice{display:none!important}
 .premium-auto-ad .layout{display:block}
 .premium-auto-ad .top-card,.premium-auto-ad .gallery-card,.premium-auto-ad .panel{box-shadow:none;border:1px solid #ddd;break-inside:avoid;margin:8px 0;padding:12px}
 .premium-auto-ad .hero-frame{aspect-ratio:16/9;max-height:105mm}
 .premium-auto-ad .details{grid-template-columns:repeat(3,1fr)}
 .premium-auto-ad .panel h2{font-size:18px}
 .premium-auto-ad h1{font-size:25px}
 .premium-auto-ad .lightbox,.premium-auto-ad .edit-panel{display:none!important}
 @page{size:A4;margin:12mm}
 }
 `}</style>
 <a className="breadcrumb" href="/automobile/voitures">← Retour aux annonces automobiles</a>
 <div className="top-card">
   <p className="kicker">TOUT ICI ANNONCES • Véhicules</p>
   <h1>{p.title}</h1>
   <div className="heading-row"><span className="price">{p.price==null?"Prix sur demande":p.price.toLocaleString("fr-FR")+" €"}</span><span className="location">📍 {p.location||"Localisation non renseignée"}</span></div>
   <div className="actions">
    <button type="button" className="action" onClick={print}>🖨 Imprimer / PDF</button>
    <button type="button" className="action" onClick={()=>void copy()}>🔗 Copier</button>
    <ShareLinks title={p.title+" — TOUT ICI ANNONCES"} label="Partager"/>
    <FavoriteAnnonceButton annonceId={p.id}/>
    {isOwner&&<button type="button" className="action" onClick={()=>setEditor(v=>!v)}>✎ Modifier mes photos</button>}
   </div>
   {notice&&<p className="notice" role="status">{notice}</p>}
 </div>
 <div className="layout">
 <div className="content">
 <section className="gallery-card" aria-label="Photographies de l'annonce">
  <div className="hero-frame">{cover?<><img src={cover} alt={p.title+" — photo "+(selected+1)}/><button type="button" className="zoom-button" onClick={()=>setZoom(true)}>⛶ Agrandir</button><span className="photo-count">{selected+1} / {photos.length} photos</span></>:<div>📷 Aucune photo ajoutée</div>}</div>
  {photos.length>1&&<div className="thumbs">{photos.map((url,i)=><button key={url+i} type="button" aria-label={"Afficher la photo "+(i+1)} className={"thumb "+(selected===i?"active":"")} onClick={()=>setSelected(i)}><img src={url} alt={"Miniature "+(i+1)}/></button>)}</div>}
 </section>
 {isOwner&&editor&&<section className="panel edit-panel"><h2>Gérer les photos de cette annonce</h2><p>Déplacez les photos pour changer leur ordre. La première devient la couverture. Vous pouvez en ajouter ou en retirer, puis enregistrer.</p>
  <div className="edit-grid">{photos.map((url,i)=><div key={url+i} className="edit-photo"><img src={url} alt={"Photo "+(i+1)}/><div><strong>{i===0?"★ Photo principale":"Photo "+(i+1)}</strong></div><div className="edit-controls"><button type="button" disabled={busy||i===0} onClick={()=>move(i,i-1)}>←</button><button type="button" disabled={busy||i===photos.length-1} onClick={()=>move(i,i+1)}>→</button><button type="button" disabled={busy} onClick={()=>{setPhotos(old=>old.filter((_,j)=>j!==i));setSelected(0)}}>Retirer</button></div></div>)}</div>
  <div className="editor-cta"><label className="action">＋ Ajouter des photos<input hidden type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy||photos.length>=10} onChange={e=>{void addImages(e.target.files);e.currentTarget.value=""}}/></label><button type="button" className="save-btn" disabled={busy} onClick={()=>void savePhotos()}>{busy?"Enregistrement…":"Enregistrer les photos"}</button><button type="button" className="action" onClick={()=>{setPhotos(p.photos);setEditor(false)}} disabled={busy}>Annuler</button></div>
  <p style={{fontSize:13,color:"#64748b"}}>Jusqu'à 10 photos JPG, PNG ou WebP (10 Mo par image). Les photos retirées ne sont plus affichées après l'enregistrement.</p>
 </section>}
 <section className="panel"><h2>Caractéristiques du véhicule</h2><div className="details">{p.details.length?p.details.map(([label,value])=><div key={label} className="detail"><small>{label}</small><strong>{value}</strong></div>):<p>Caractéristiques non renseignées.</p>}</div></section>
 {p.options.length>0&&<section className="panel"><h2>Équipements & options</h2><div className="option-list">{p.options.map((x,i)=><span key={x+i} className="option">✓ {x}</span>)}</div></section>}
 {p.description&&<section className="panel"><h2>Description du vendeur</h2><p style={{whiteSpace:"pre-wrap",lineHeight:1.8,fontSize:16}}>{p.description}</p></section>}
 {p.videoUrl&&<section className="panel"><h2>Vidéo du véhicule</h2><video className="video" controls preload="metadata" playsInline src={p.videoUrl}>Vidéo non disponible dans ce navigateur.</video></section>}
 </div>
 <aside className="seller"><h2>Cette annonce vous intéresse ?</h2><div className="seller-price">{p.price==null?"Prix sur demande":p.price.toLocaleString("fr-FR")+" €"}</div><p className="seller-hint">Échangez directement avec le vendeur via la messagerie sécurisée du site.</p><ContacterVendeur annonceId={p.id}/><p className="seller-hint">Conservez cette annonce dans vos favoris ou partagez-la avec vos proches.</p><FavoriteAnnonceButton annonceId={p.id}/></aside>
 </div>
 {zoom&&cover&&<div className="lightbox" role="dialog" aria-modal="true" aria-label="Photographie agrandie" onClick={()=>setZoom(false)}><button type="button" className="lightbox-close" onClick={()=>setZoom(false)}>✕ Fermer</button><img src={cover} alt={p.title} onClick={e=>e.stopPropagation()}/><span className="lightbox-count">{selected+1} / {photos.length}</span></div>}
 </main>
}
