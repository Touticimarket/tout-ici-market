"use client";

import {useEffect,useState} from "react";
import {supabase} from "../lib/supabaseClient";
import {UserRound,UserPlus} from "lucide-react";

export default function LiensCompte(){
  const [connecte,setConnecte]=useState(false);

  useEffect(()=>{
    let actif=true;
    supabase.auth.getUser().then(({data})=>{if(actif)setConnecte(!!data.user)});
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{
      if(actif)setConnecte(!!session?.user);
    });
    return ()=>{actif=false;subscription.unsubscribe()};
  },[]);

  return connecte
    ? <a href="/compte"><UserRound size={17}/> Mon compte</a>
    : <>
        <a href="/compte/connexion"><UserRound size={17}/> Connexion</a>
        <a href="/compte/inscription" className="ti-home-signup"><UserPlus size={16}/> Créer un compte</a>
      </>;
}
