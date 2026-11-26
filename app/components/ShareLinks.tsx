"use client";
import {useEffect,useState} from "react";

type Props={url?:string;title?:string;label?:string;compact?:boolean};

export default function ShareLinks({url,title="TOUT ICI ANNONCES — Site d’annonces gratuites pour les particuliers",label="Partager",compact=false}:Props){
 const [open,setOpen]=useState(false);
 const [notice,setNotice]=useState("");
 const [resolvedUrl,setResolvedUrl]=useState(url||"https://tout-ici-market.vercel.app/");
 useEffect(()=>{setResolvedUrl(url?new URL(url,window.location.origin).href:window.location.href)},[url]);
 const address=resolvedUrl||"https://tout-ici-market.vercel.app/";
 const encoded=encodeURIComponent(address),message=encodeURIComponent(title),combined=encodeURIComponent(title+" — "+address);
 const providers=[
  {name:"WhatsApp",href:"https://api.whatsapp.com/send?text="+combined},
  {name:"Facebook",href:"https://www.facebook.com/sharer/sharer.php?u="+encoded},
  {name:"Messenger",href:"https://www.facebook.com/dialog/send?link="+encoded+"&app_id=0&redirect_uri="+encoded,requiresApp:true},
  {name:"X (Twitter)",href:"https://twitter.com/intent/tweet?text="+message+"&url="+encoded},
  {name:"LinkedIn",href:"https://www.linkedin.com/sharing/share-offsite/?url="+encoded},
  {name:"Telegram",href:"https://t.me/share/url?url="+encoded+"&text="+message},
  {name:"Pinterest",href:"https://pinterest.com/pin/create/button/?url="+encoded+"&description="+message},
  {name:"Reddit",href:"https://www.reddit.com/submit?url="+encoded+"&title="+message},
  {name:"Bluesky",href:"https://bsky.app/intent/compose?text="+combined},
  {name:"E-mail",href:"mailto:?subject="+message+"&body="+combined},
  {name:"SMS",href:"sms:?body="+combined}
 ].filter(p=>!p.requiresApp);
 async function copyLink(){try{await navigator.clipboard.writeText(address);setNotice("Lien copié !")}catch{setNotice("Copiez le lien : "+address)}}
 async function nativeShare(){if(navigator.share){try{await navigator.share({title,text:title,url:address});setNotice("")}catch(e){if((e as Error).name!=="AbortError")setNotice("Utilisez un réseau ci-dessous ou copiez le lien.")}}else{await copyLink()}}
 return <div className={"tim-share "+(compact?"tim-share-compact":"")}>
 <style>{`
 .tim-share{position:relative;display:inline-flex;flex-direction:column;align-items:flex-start;font-family:Arial,Helvetica,sans-serif}
 .tim-share-btn{background:#ffcf06;color:#071b40;border:0;border-radius:20px;padding:11px 16px;font-size:14px;font-weight:800;cursor:pointer}
 .tim-share-btn:hover,.tim-share-btn:focus-visible{background:#ffe274}
 .tim-share-panel{position:absolute;z-index:100;right:0;top:calc(100% + 8px);width:min(315px,calc(100vw - 32px));background:white;color:#0a1c3d;border:1px solid #cbd9ee;border-radius:15px;box-shadow:0 16px 38px #00162c3d;padding:14px}
 .tim-share-panel strong{font-size:15px}
 .tim-share-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-top:12px}
 .tim-share-actions a,.tim-share-actions button{display:flex;align-items:center;justify-content:center;min-height:39px;border:1px solid #cbd9ee;border-radius:9px;background:#f2f7ff;color:#0a2a5a;text-decoration:none;font-weight:700;font-size:12px;cursor:pointer;padding:6px}
 .tim-share-actions a:hover,.tim-share-actions button:hover{background:#fff0ae}
 .tim-share-tip{margin:9px 0 0;color:#52647e;font-size:11px;line-height:1.4}
 .tim-share .tim-share-notice{font-size:12px;margin:6px 0 0;color:#176237;overflow-wrap:anywhere}
 .tim-share-compact .tim-share-btn{padding:8px 12px;border-radius:10px}
 @media(max-width:560px){.tim-share-panel{right:auto;left:0}}
 `}</style>
 <button type="button" className="tim-share-btn" onClick={()=>{setOpen(!open);setNotice("")}} aria-expanded={open} aria-label={label}>↗ {label}</button>
 {open&&<div className="tim-share-panel"><strong>Partager ce {url?"lien":"site"}</strong><div className="tim-share-actions">
 <button type="button" onClick={()=>void nativeShare()}>📱 Partager…</button>
 <button type="button" onClick={()=>void copyLink()}>🔗 Copier le lien</button>
 {providers.map(p=><a key={p.name} href={p.href} target={p.name==="SMS"||p.name==="E-mail"?"_self":"_blank"} rel="noopener noreferrer">{p.name}</a>)}
 </div><p className="tim-share-tip">Pour Instagram, TikTok, Snapchat et les autres applications, utilisez « Partager… » sur mobile ou copiez le lien.</p>{notice&&<p role="status" className="tim-share-notice">{notice}</p>}<button type="button" style={{marginTop:8,border:0,background:"transparent",textDecoration:"underline",cursor:"pointer",color:"#08244d"}} onClick={()=>setOpen(false)}>Fermer</button></div>}
 </div>;
}
