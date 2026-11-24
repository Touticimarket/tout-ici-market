"use client";
import {useState} from "react";
type Social={name:string;symbol:string;color:string;href?:string;copy?:boolean};
export default function SocialNetworkIcons(){
 const [message,setMessage]=useState("");
 const url="https://tout-ici-market.vercel.app/";
 const text="TOUT ICI MARKET — Site d’annonces gratuites pour les particuliers";
 const u=encodeURIComponent(url),t=encodeURIComponent(text),both=encodeURIComponent(text+" — "+url);
 const socials:Social[]=[
  {name:"Facebook",symbol:"f",color:"#1877F2",href:"https://www.facebook.com/sharer/sharer.php?u="+u},
  {name:"WhatsApp",symbol:"✆",color:"#168847",href:"https://api.whatsapp.com/send?text="+both},
  {name:"Instagram",symbol:"◎",color:"#C13584",copy:true},
  {name:"TikTok",symbol:"♪",color:"#141414",copy:true},
  {name:"X",symbol:"𝕏",color:"#101820",href:"https://twitter.com/intent/tweet?text="+t+"&url="+u},
  {name:"LinkedIn",symbol:"in",color:"#0A66C2",href:"https://www.linkedin.com/sharing/share-offsite/?url="+u},
  {name:"Telegram",symbol:"➤",color:"#229ED9",href:"https://t.me/share/url?url="+u+"&text="+t},
  {name:"Pinterest",symbol:"P",color:"#BD081C",href:"https://pinterest.com/pin/create/button/?url="+u+"&description="+t},
  {name:"Snapchat",symbol:"👻",color:"#E6C900",copy:true},
  {name:"Reddit",symbol:"●",color:"#FF4500",href:"https://www.reddit.com/submit?url="+u+"&title="+t},
  {name:"Bluesky",symbol:"🦋",color:"#1686E8",href:"https://bsky.app/intent/compose?text="+both},
  {name:"E-mail",symbol:"✉",color:"#4E647E",href:"mailto:?subject="+t+"&body="+both}
 ];
 async function copyLink(name:string){try{await navigator.clipboard.writeText(url);setMessage("Lien copié pour "+name)}catch{setMessage("Copier : "+url)}}
 async function shareOther(){if(navigator.share){try{await navigator.share({title:text,url});setMessage("")}catch(e){if((e as Error).name!=="AbortError")await copyLink("partager")}}else await copyLink("partager")}
 return <div className="tim-social-wrap" aria-label="Partager TOUT ICI MARKET sur les réseaux sociaux">
 <style>{`
 .tim-social-wrap{display:flex;flex-direction:column;align-items:center;gap:3px;flex:0 0 auto;position:relative}
 .tim-social-icons{display:grid;grid-template-columns:repeat(7,25px);gap:3px;align-items:center;justify-content:center}
 .tim-social-icons a,.tim-social-icons button{display:flex!important;justify-content:center;align-items:center;box-sizing:border-box;border:0;border-radius:50%;width:25px;height:25px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:900;color:white!important;text-decoration:none;cursor:pointer;padding:0;line-height:1}
 .tim-social-icons a:hover,.tim-social-icons button:hover,.tim-social-icons a:focus-visible,.tim-social-icons button:focus-visible{outline:2px solid #ffcf06;outline-offset:2px;filter:brightness(1.15)}
 .tim-social-icons .social-more{background:#ffcf06!important;color:#081b40!important}
 .tim-social-message{position:absolute;z-index:20;top:100%;background:#fff;color:#09254f;font-size:11px;border:1px solid #cbd9ef;border-radius:8px;padding:7px;width:220px;box-shadow:0 6px 18px #0003;text-align:center}
 @media(max-width:760px){.tim-social-icons{grid-template-columns:repeat(7,23px);gap:2px}.tim-social-icons a,.tim-social-icons button{width:23px;height:23px;font-size:11px}}
 `}</style>
 <div className="tim-social-icons">
 {socials.map(s=>s.copy?<button key={s.name} type="button" title={"Copier le lien pour "+s.name} aria-label={"Copier le lien pour "+s.name} onClick={()=>void copyLink(s.name)} style={{background:s.color}}>{s.symbol}</button>:<a key={s.name} href={s.href} target={s.name==="E-mail"?"_self":"_blank"} rel="noopener noreferrer" title={"Partager sur "+s.name} aria-label={"Partager sur "+s.name} style={{background:s.color}}>{s.symbol}</a>)}
 <button type="button" title="Autres réseaux sociaux et applications" aria-label="Autres réseaux sociaux et applications" className="social-more" onClick={()=>void shareOther()}>＋</button>
 <button type="button" title="Copier le lien du site" aria-label="Copier le lien du site" className="social-more" onClick={()=>void copyLink("le site")}>🔗</button>
 </div>
 {message&&<div className="tim-social-message" role="status">{message}</div>}
 </div>
}
