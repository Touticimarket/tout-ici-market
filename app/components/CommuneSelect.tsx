"use client";
import {useEffect,useState} from "react";
export type CommuneOption={nom:string;codePostal:string;latitude:number;longitude:number;departement:string};
export default function CommuneSelect({value,onChange}:{value:CommuneOption|null;onChange:(c:CommuneOption|null)=>void}){
 const [query,setQuery]=useState("");const [options,setOptions]=useState<CommuneOption[]>([]);const [open,setOpen]=useState(false);const [error,setError]=useState("");
 useEffect(()=>{if(query.trim().length<2||!open){setOptions([]);return;}const controller=new AbortController();
 const timer=setTimeout(async()=>{try{const response=await fetch("/api/communes?q="+encodeURIComponent(query.trim()),{signal:controller.signal});
 if(!response.ok)throw Error();const data=await response.json();setOptions((data.communes??[]).slice(0,10));setError("");
 }catch{if(!controller.signal.aborted)setError("Recherche de communes indisponible.");}},250);
 return()=>{clearTimeout(timer);controller.abort()}},[query,open]);
 return <div style={{position:"relative"}}><input role="combobox" aria-label="Ville ou code postal du centre de recherche" aria-expanded={open&&options.length>0} placeholder="Ville ou code postal (ex. Colmar)" value={open?query:value?value.nom+" ("+value.codePostal+")":query}
 onFocus={()=>{setOpen(true);if(value)setQuery(value.nom)}} onChange={e=>{setQuery(e.target.value);onChange(null);setOpen(true)}}/>
 {open&&options.length>0&&<div role="listbox" style={{position:"absolute",top:"100%",zIndex:30,left:0,right:0,maxHeight:230,overflowY:"auto",background:"#fff",boxShadow:"0 10px 28px #0a224533",border:"1px solid #b5c7df",borderRadius:10}}>
 {options.map((x,i)=><button type="button" role="option" aria-selected={false} key={x.nom+x.codePostal+i} style={{width:"100%",display:"block",padding:11,background:"white",border:0,borderBottom:"1px solid #e5edf7",textAlign:"left",cursor:"pointer"}} onClick={()=>{onChange(x);setQuery(x.nom+" ("+x.codePostal+")");setOpen(false);setOptions([])}}>{x.nom} ({x.codePostal}) — {x.departement}</button>)}
 </div>}
 {value&&<button type="button" onClick={()=>{onChange(null);setQuery("");setOpen(false)}} style={{background:"none",border:0,color:"#134c90",fontSize:12,cursor:"pointer",padding:4}}>Effacer cette commune</button>}
 {error&&<small role="status">{error}</small>}
 </div>;
}
