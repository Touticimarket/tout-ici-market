"use client";

import {useEffect} from "react";
import {usePathname} from "next/navigation";
import {trouverTypeVehicule} from "../deposer/automobile/types";

export const HISTORIQUE_CLE="toutici:historique-v1";
export const HISTORIQUE_CONSENTEMENT="toutici:historique-consentement-v1";
export const HISTORIQUE_EVENT="toutici:historique-modifie";

export type RubriqueHistorique =
  "Automobile & Véhicules"|"Immobilier"|"Emploi & Services"|"Autres catégories";
export type VisiteRecente = {
  href:string;
  titre:string;
  rubrique:RubriqueHistorique;
  date:number;
};

const autres:Record<string,string>={
  "/maison-jardin":"Maison & Jardin",
  "/telephones":"Téléphones & informatique",
  "/bricolage":"Bricolage",
  "/mode":"Mode & accessoires",
  "/jeux-consoles":"Jeux & consoles",
  "/vacances-loisirs":"Vacances & loisirs",
  "/autres":"Autres catégories",
};
const DUREE_MAX=30*24*60*60*1000;

export function destinationHistorique(path:string):Omit<VisiteRecente,"date">|null{
  // Pas de collecte de comptes, de recherches, de brouillons ni de données privées.
  if(path==="/automobile")return {href:path,titre:"Annonces de véhicules",rubrique:"Automobile & Véhicules"};
  if(path==="/moto")return {href:path,titre:"Motos, scooters et quads",rubrique:"Automobile & Véhicules"};
  if(path==="/deposer/automobile")return {href:path,titre:"Catégories de véhicules",rubrique:"Automobile & Véhicules"};
  if(path.startsWith("/deposer/automobile/")){
    const slug=path.split("/")[3];
    const type=trouverTypeVehicule(slug||"");
    if(!type)return null;
    return {href:path,titre:type.nom,rubrique:"Automobile & Véhicules"};
  }
  if(path==="/immobilier")return {href:path,titre:"Annonces immobilières",rubrique:"Immobilier"};
  if(path==="/emploi")return {href:path,titre:"Emploi & Services",rubrique:"Emploi & Services"};
  if(path in autres)return {href:path,titre:autres[path],rubrique:"Autres catégories"};
  return null;
}

export function lireHistorique():VisiteRecente[]{
  if(typeof window==="undefined")return [];
  try{
    const valeur=JSON.parse(window.localStorage.getItem(HISTORIQUE_CLE)||"[]");
    if(!Array.isArray(valeur))return [];
    const maintenant=Date.now();
    const autorises=new Set<RubriqueHistorique>([
      "Automobile & Véhicules","Immobilier","Emploi & Services","Autres catégories"
    ]);
    return valeur.filter((v:unknown):v is VisiteRecente=>{
      if(!v||typeof v!=="object")return false;
      const item=v as Partial<VisiteRecente>;
      return typeof item.href==="string" && typeof item.titre==="string" &&
        typeof item.date==="number" && item.date<=maintenant && maintenant-item.date<DUREE_MAX &&
        autorises.has(item.rubrique as RubriqueHistorique) &&
        !!destinationHistorique(item.href);
    }).sort((a,b)=>b.date-a.date).slice(0,40);
  }catch{return [];}
}

export function historiqueActif():boolean{
  if(typeof window==="undefined")return false;
  try{return window.localStorage.getItem(HISTORIQUE_CONSENTEMENT)==="oui";}
  catch{return false;}
}

export function enregistrerVisite(path:string):void{
  const info=destinationHistorique(path);
  if(!info || !historiqueActif())return;
  try{
    const existantes=lireHistorique().filter(v=>v.href!==info.href);
    window.localStorage.setItem(HISTORIQUE_CLE,JSON.stringify([
      {...info,date:Date.now()},...existantes
    ].slice(0,40)));
    window.dispatchEvent(new Event(HISTORIQUE_EVENT));
  }catch{/* Navigation toujours fonctionnelle même si stockage bloqué. */}
}

export function effacerHistorique():void{
  try{
    window.localStorage.removeItem(HISTORIQUE_CLE);
    window.localStorage.removeItem(HISTORIQUE_CONSENTEMENT);
    window.dispatchEvent(new Event(HISTORIQUE_EVENT));
  }catch{/* Le stockage n'est pas disponible. */}
}

export function activerHistorique():void{
  try{
    window.localStorage.setItem(HISTORIQUE_CONSENTEMENT,"oui");
    window.dispatchEvent(new Event(HISTORIQUE_EVENT));
  }catch{/* Le stockage n'est pas disponible. */}
}

export default function SuiviNavigation(){
  const pathname=usePathname();
  useEffect(()=>{
    if(pathname)enregistrerVisite(pathname);
  },[pathname]);
  return null;
}
