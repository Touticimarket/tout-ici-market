"use client";
import {useEffect,useRef,useState} from "react";
type Brand={id:string;nom:string};
export default function BrandAutocomplete({brands,value,onChange,placeholder="Peugeot, Renault, BMW, BYD…",label="Saisir une marque",disabled=false}:{brands:Brand[];value:string;onChange:(s:string)=>void;placeholder?:string;label?:string;disabled?:boolean}){
 const [query,setQuery]=useState("");const [open,setOpen]=useState(false);const editing=useRef(false);
 useEffect(()=>{if(editing.current&&value===""){editing.current=false;return;}setQuery(brands.find(b=>b.id===value)?.nom||"")},[brands,value]);
 const items=brands.filter(b=>b.nom.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().startsWith(query.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase())).slice(0,20);
 return <div style={{position:"relative"}}><input aria-label={label} disabled={disabled} role="combobox" aria-expanded={open} aria-autocomplete="list" placeholder={placeholder} value={query} onFocus={()=>setOpen(true)} onBlur={()=>setTimeout(()=>setOpen(false),160)} onChange={e=>{setQuery(e.target.value);if(value){editing.current=true;onChange("");}setOpen(true)}} onKeyDown={e=>{if(e.key==="Escape")setOpen(false);if(e.key==="Enter"&&items[0]&&open){e.preventDefault();onChange(items[0].id);setQuery(items[0].nom);setOpen(false)}}}/>
 {open&&<div role="listbox" style={{position:"absolute",top:"100%",left:0,right:0,zIndex:20,maxHeight:250,overflowY:"auto",background:"white",border:"1px solid #bdcfe8",borderRadius:9,boxShadow:"0 8px 20px #1234"}}>
 <button type="button" onMouseDown={e=>e.preventDefault()} onClick={()=>{onChange("");setQuery("");setOpen(false)}} style={{display:"block",width:"100%",padding:10,textAlign:"left"}}>Toutes les marques</button>
 {items.map(b=><button type="button" role="option" aria-selected={b.id===value} key={b.id} onMouseDown={e=>e.preventDefault()} onClick={()=>{onChange(b.id);setQuery(b.nom);setOpen(false)}} style={{display:"block",width:"100%",padding:10,textAlign:"left",border:0,borderTop:"1px solid #eee",background:"white",cursor:"pointer"}}>{b.nom}</button>)}
 {!items.length&&<p style={{padding:10}}>Aucune marque trouvée</p>}</div>}</div>
}