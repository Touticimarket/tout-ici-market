import {createClient} from "@supabase/supabase-js";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import ShareLinks from "../../components/ShareLinks";
import {TrackAutoView} from "../../components/FavoriteAnnonceButton";

type Props={params:Promise<{id:string}>};
type AutoAd={
 id:string;titre:string|null;marque:string|null;modele:string|null;finition:string|null;
 prix:number|null;annee:number|null;kilometrage:number|null;carburant:string|null;
 boite:string|null;ville:string|null;departement:string|null;description:string|null;
 photos:string[]|null;code_postal:string|null;puissance_ch:number|null;
 type_vehicule:string|null;couleur:string|null;carrosserie:string|null
};
function titleOf(a:AutoAd){return a.titre?.trim()||[a.marque,a.modele,a.finition].filter(Boolean).join(" ")||"Annonce véhicule"}
async function getAd(id:string):Promise<AutoAd|null>{
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))return null;
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)return null;
 const client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data,error}=await client.from("annonces_auto").select("id,titre,marque,modele,finition,prix,annee,kilometrage,carburant,boite,ville,departement,description,photos,code_postal,puissance_ch,type_vehicule,couleur,carrosserie").eq("id",id).eq("statut","publiee").maybeSingle();
 if(error||!data)return null;
 return data as AutoAd;
}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {id}=await params;const a=await getAd(id);
 if(!a)return {title:"Annonce indisponible | TOUT ICI MARKET",robots:{index:false,follow:false}};
 const title=titleOf(a)+" | TOUT ICI MARKET";
 const description=[a.prix!=null?a.prix.toLocaleString("fr-FR")+" €":null,a.ville,a.description].filter(Boolean).join(" · ").slice(0,190);
 const url="https://tout-ici-market.vercel.app/annonce/"+a.id;
 return {title,description,alternates:{canonical:url},openGraph:{title,description,url,type:"article",images:a.photos?.[0]?[{url:a.photos[0]}]:undefined},twitter:{card:a.photos?.[0]?"summary_large_image":"summary",title,description,images:a.photos?.[0]?[a.photos[0]]:undefined}};
}
export default async function AnnoncePage({params}:Props){
 const {id}=await params;const a=await getAd(id);if(!a)notFound();
 const title=titleOf(a);
 const details=[["Année",a.annee],["Kilométrage",a.kilometrage!=null?a.kilometrage.toLocaleString("fr-FR")+" km":null],["Énergie",a.carburant],["Boîte de vitesses",a.boite],["Puissance",a.puissance_ch!=null?a.puissance_ch+" ch":null],["Couleur",a.couleur],["Carrosserie",a.carrosserie],["Catégorie",a.type_vehicule]];
 return <><TrackAutoView annonceId={a.id}/><main style={{background:"#f4f8fe",color:"#091c42",fontFamily:"Arial,Helvetica,sans-serif",padding:"clamp(16px,3vw,36px)",minHeight:"65vh"}}>
   <a href="/automobile" style={{color:"#0956a5",fontWeight:700,textDecoration:"none"}}>← Retour à Automobile & Véhicules</a>
   <div style={{background:"white",padding:"clamp(18px,3vw,30px)",borderRadius:18,marginTop:16,boxShadow:"0 8px 24px #122e5714"}}>
    <h1 style={{fontSize:"clamp(27px,3vw,38px)",margin:"0 0 12px"}}>{title}</h1>
    <div style={{display:"flex",flexWrap:"wrap",gap:18,alignItems:"center",justifyContent:"space-between"}}>
      <p style={{fontSize:30,color:"#0858a9",fontWeight:900,margin:"0 0 14px"}}>{a.prix==null?"Prix non renseigné":a.prix.toLocaleString("fr-FR")+" €"}</p>
      <ShareLinks url={"https://tout-ici-market.vercel.app/annonce/"+a.id} title={title+" — TOUT ICI MARKET"} label="Partager cette annonce"/>
    </div>
    <p style={{color:"#586b89",fontWeight:700}}>📍 {[a.ville,a.code_postal,a.departement].filter(Boolean).join(" · ")||"Lieu non renseigné"}</p>
    {a.photos?.length?<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,230px),1fr))",gap:10,margin:"22px 0"}}>{a.photos.map((photo,i)=><img key={i} src={photo} alt={title+" — photo "+(i+1)} style={{width:"100%",height:250,objectFit:"contain",background:"#eaf1fa",borderRadius:12}}/>)}</div>:<div style={{background:"#ecf3fa",padding:42,textAlign:"center",borderRadius:12,margin:"18px 0"}}>Photo non disponible</div>}
    <h2 style={{fontSize:22,marginTop:25}}>Caractéristiques</h2>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))",gap:10}}>{details.filter(([,value])=>value!==null&&value!==undefined&&value!=="").map(([label,value])=><div key={String(label)} style={{background:"#f1f6fd",borderRadius:10,padding:12}}><div style={{color:"#5e6c83",fontSize:12,fontWeight:700}}>{label}</div><div style={{fontWeight:800,marginTop:5}}>{value}</div></div>)}</div>
    {a.description&&<><h2 style={{fontSize:22,marginTop:27}}>Description</h2><p style={{whiteSpace:"pre-wrap",lineHeight:1.65}}>{a.description}</p></>}
   </div>
 </main></>;
}
