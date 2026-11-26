import {createClient} from "@supabase/supabase-js";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import PremiumAutoAnnonce from "../../components/PremiumAutoAnnonce";
import {TrackAutoView} from "../../components/FavoriteAnnonceButton";


type Props={params:Promise<{id:string}>};
type AutoAd={
 id:string;user_id:string;titre:string|null;marque:string|null;modele:string|null;finition:string|null;
 prix:number|null;annee:number|null;kilometrage:number|null;carburant:string|null;
 boite:string|null;ville:string|null;departement:string|null;description:string|null;
 photos:string[]|null;code_postal:string|null;puissance_ch:number|null;
 type_vehicule:string|null;couleur:string|null;carrosserie:string|null;options:string[]|null;video_url:string|null
};
function titleOf(a:AutoAd){return a.titre?.trim()||[a.marque,a.modele,a.finition].filter(Boolean).join(" ")||"Annonce véhicule"}
async function getAd(id:string):Promise<AutoAd|null>{
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))return null;
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)return null;
 const client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data,error}=await client.from("annonces_auto").select("id,user_id,titre,marque,modele,finition,prix,annee,kilometrage,carburant,boite,ville,departement,description,photos,code_postal,puissance_ch,type_vehicule,couleur,carrosserie,options,video_url").eq("id",id).eq("statut","publiee").maybeSingle();
 if(error||!data)return null;
 return data as AutoAd;
}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {id}=await params;const a=await getAd(id);
 if(!a)return {title:"Annonce indisponible | TOUT ICI ANNONCES",robots:{index:false,follow:false}};
 const title=titleOf(a)+" | TOUT ICI ANNONCES";
 const description=[a.prix!=null?a.prix.toLocaleString("fr-FR")+" €":null,a.ville,a.description].filter(Boolean).join(" · ").slice(0,190);
 const url="https://tout-ici-market.vercel.app/annonce/"+a.id;
 return {title,description,alternates:{canonical:url},openGraph:{title,description,url,type:"article",images:a.photos?.[0]?[{url:a.photos[0]}]:undefined},twitter:{card:a.photos?.[0]?"summary_large_image":"summary",title,description,images:a.photos?.[0]?[a.photos[0]]:undefined}};
}
export default async function AnnoncePage({params}:Props){
 const {id}=await params;
 const a=await getAd(id);
 if(!a)notFound();
 const details:[string,string][]=[
  ["Marque",a.marque],["Modèle",a.modele],["Finition",a.finition],
  ["Année",a.annee!=null?String(a.annee):null],
  ["Kilométrage",a.kilometrage!=null?a.kilometrage.toLocaleString("fr-FR")+" km":null],
  ["Énergie",a.carburant],["Boîte de vitesses",a.boite],
  ["Puissance",a.puissance_ch!=null?a.puissance_ch+" ch":null],
  ["Couleur",a.couleur],["Carrosserie",a.carrosserie],["Catégorie",a.type_vehicule]
 ].filter((x):x is [string,string]=>typeof x[1]==="string"&&x[1].trim().length>0);
 return <>
  <TrackAutoView annonceId={a.id}/>
  <PremiumAutoAnnonce
   id={a.id} ownerId={a.user_id} title={titleOf(a)} price={a.prix}
   location={[a.ville,a.code_postal,a.departement].filter(Boolean).join(" · ")}
   photos={Array.isArray(a.photos)?a.photos:[]}
   description={a.description} details={details}
   options={Array.isArray(a.options)?a.options:[]}
   videoUrl={a.video_url||null}
  />
 </>;
}
