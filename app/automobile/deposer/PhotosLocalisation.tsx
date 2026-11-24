"use client";
import {useEffect,useRef,useState} from "react";
export type Commune={nom:string;code:string;codePostal:string;departement:string;latitude:number;longitude:number};
export function FranceLocation({selected,onChange}:{selected:Commune|null;onChange:(c:Commune|null)=>void}){
const [q,setQ]=useState("");const [results,setResults]=useState<Commune[]>([]);const [status,setStatus]=useState("");const [zoom,setZoom]=useState(12);const [expanded,setExpanded]=useState(false);
useEffect(()=>{if(q.trim().length<2){setResults([]);return}const controller=new AbortController();
const t=setTimeout(async()=>{try{const r=await fetch("/api/communes?q="+encodeURIComponent(q.trim()),{signal:controller.signal});const j=await r.json();setResults(j.communes||[]);setStatus(j.error||"");}catch(e){if(!controller.signal.aborted)setStatus("Recherche des communes momentanément indisponible.");}},270);
return()=>{clearTimeout(t);controller.abort()}},[q]);
const lat=selected?.latitude??46.6,lon=selected?.longitude??2.2;
const width=8/Math.pow(2,zoom-5),height=width*.7;
const url="https://www.openstreetmap.org/export/embed.html?bbox="+[lon-width,lat-height,lon+width,lat+height].join("%2C")+"&layer=mapnik&marker="+encodeURIComponent(lat+","+lon);
return <div className="fr-location">
 <style>{`
 .fr-location{margin:18px 0 4px;border:1px solid #bed5ef;border-radius:15px;padding:17px;background:#f8fbff}
 .fr-location label{display:block;font-weight:800;margin-bottom:8px}
 .fr-location input{width:100%;padding:13px;border:1px solid #abc4e3;border-radius:9px;font:inherit}
 .fr-location .choices{max-height:235px;overflow:auto;border-radius:9px;margin-top:8px;background:white}
 .fr-location .choices button{display:block;width:100%;text-align:left;background:#fff;padding:11px 13px;border:0;border-bottom:1px solid #e5ebf5;cursor:pointer;color:#0c2c5b}
 .fr-location .choices button:hover{background:#eaf3ff}
 .fr-location .map-top{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-top:16px;flex-wrap:wrap}
 .fr-location .map-tools{display:flex;gap:7px}
 .fr-location .map-tools button{border:1px solid #abc4e3;background:white;border-radius:8px;padding:7px 13px;cursor:pointer;font-weight:800}
 .fr-location iframe{display:block;width:100%;height:270px;border:1px solid #bed3ea;border-radius:10px;margin-top:10px}
 `}</style>
 <label htmlFor="fr-commune">Localisation en France — commune ou code postal *</label>
 <input id="fr-commune" autoComplete="off" placeholder="Ex. Colmar ou 68000" value={q || (selected?selected.nom+" ("+selected.codePostal+")":"")} onChange={e=>{setQ(e.target.value);onChange(null);setExpanded(true);}} onFocus={()=>setExpanded(true)}/>
 {expanded&&results.length>0&&<div className="choices" role="listbox" aria-label="Choisir une commune française">{results.map((c,i)=><button type="button" role="option" aria-selected={false} key={c.code+"-"+c.codePostal+"-"+i} onClick={()=>{onChange(c);setQ(c.nom+" ("+c.codePostal+")");setResults([]);setExpanded(false);setZoom(12);}}>{c.nom} — {c.codePostal} · {c.departement}</button>)}</div>}
 {status&&<p role="status">{status}</p>}
 <div className="map-top"><strong>{selected?"📍 "+selected.nom+" ("+selected.codePostal+")":"Carte de France — sélectionnez une commune"}</strong>
 <div className="map-tools"><button type="button" onClick={()=>setZoom(z=>Math.max(5,z-1))} aria-label="Dézoomer">−</button><button type="button" onClick={()=>setZoom(z=>Math.min(17,z+1))} aria-label="Zoomer">＋</button></div></div>
 {selected&&<a href={"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(selected.latitude+","+selected.longitude)} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",marginTop:12,gap:7,color:"#084bd8",fontWeight:800,textDecoration:"underline"}}>↗ Ouvrir dans Google Maps</a>}
 <iframe title="Carte de localisation du véhicule" src={url} loading="lazy"/>
 <p style={{fontSize:12,color:"#536680"}}>Le repère indique le centre de la commune choisie, sans révéler l’adresse exacte du vendeur. Vous pouvez déplacer la carte et zoomer.</p>
 </div>
}
export function OrderedPhotos({files,onChange}:{files:File[];onChange:(f:File[])=>void}){
 const [previews,setPreviews]=useState<string[]>([]);const source=useRef<number|null>(null);const input=useRef<HTMLInputElement|null>(null);
 useEffect(()=>{const urls=files.map(f=>URL.createObjectURL(f));setPreviews(urls);return()=>urls.forEach(u=>URL.revokeObjectURL(u));},[files]);
 function add(incoming:FileList|null){if(!incoming)return;const valid=Array.from(incoming).filter(f=>["image/jpeg","image/png","image/webp"].includes(f.type)&&f.size<=10*1024*1024);onChange([...files,...valid].slice(0,10));if(input.current)input.current.value="";}
 function move(from:number,to:number){if(to<0||to>=files.length)return;const next=[...files];const item=next.splice(from,1)[0];next.splice(to,0,item);onChange(next)}
 return <div className="ordered-photos">
 <style>{`
 .ordered-photos .items{display:grid;grid-template-columns:repeat(auto-fill,minmax(142px,1fr));gap:12px;margin:14px 0}
 .ordered-photos .photo{border:1px solid #c1d8f3;border-radius:12px;background:#f7faff;overflow:hidden}
 .ordered-photos .photo img{width:100%;height:110px;object-fit:cover;display:block}
 .ordered-photos .photo .controls{display:flex;gap:4px;padding:7px;justify-content:center}
 .ordered-photos .photo button{padding:6px 9px;border:1px solid #b7cbed;background:white;border-radius:7px;cursor:pointer}
 .ordered-photos .add{display:inline-block;padding:15px;border:2px dashed #a1c2eb;border-radius:12px;background:#f6faff;cursor:pointer;font-weight:800;color:#064bb8}
 `}</style>
 <p><strong>{files.length} / 10 photos.</strong> Glissez une photo à la position voulue, ou utilisez les flèches. La première photo sera la couverture de l’annonce.</p>
 <label className="add">＋ Choisir des photos<input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={e=>add(e.target.files)} disabled={files.length>=10}/></label>
 <div className="items">{files.map((f,i)=><div className="photo" key={f.name+"-"+f.lastModified+"-"+i} draggable
 onDragStart={()=>{source.current=i}} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(source.current!==null)move(source.current,i);source.current=null}}>
 <img src={previews[i]||""} alt={"Photo "+(i+1)}/>
 <div style={{padding:"6px 8px",fontSize:12,fontWeight:800}}>{i===0?"★ Couverture":"Photo "+(i+1)}</div>
 <div className="controls"><button type="button" aria-label="Déplacer vers la gauche" disabled={i===0} onClick={()=>move(i,i-1)}>←</button><button type="button" aria-label="Déplacer vers la droite" disabled={i===files.length-1} onClick={()=>move(i,i+1)}>→</button><button type="button" aria-label="Supprimer la photo" onClick={()=>onChange(files.filter((_,j)=>j!==i))}>×</button></div>
 </div>)}</div>
 <p style={{fontSize:12,color:"#536680"}}>JPG, PNG ou WebP, 10 Mo maximum par image. L’ordre affiché sera conservé lors de l’enregistrement.</p>
 </div>
}
