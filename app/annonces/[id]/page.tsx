import {createClient} from "@supabase/supabase-js";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import {depotCategories} from "../../deposer/categories";
type Props={params:Promise<{id:string}>};
type MarketplaceAd={id:string;user_id:string;categorie:string;sous_categorie:string;titre:string;description:string;prix:number|null;ville:string;code_postal:string|null;caracteristiques:Record<string,unknown>|null;photos:string[]|null;statut:string;created_at:string};
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
async function getAnnonce(id:string):Promise<MarketplaceAd|null>{
 if(!uuid.test(id))return null;
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)return null;
 const client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data,error}=await client.from("annonces_marketplace").select("id,user_id,categorie,sous_categorie,titre,description,prix,ville,code_postal,caracteristiques,photos,statut,created_at").eq("id",id).eq("statut","publiee").maybeSingle();
 return error?null:(data as MarketplaceAd|null);
}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {id}=await params;const a=await getAnnonce(id);
 if(!a)return {title:"Annonce indisponible | TOUT ICI MARKET",robots:{index:false,follow:false}};
 const description=(a.description||"Annonce gratuite entre particuliers").slice(0,170);
 const url="https://tout-ici-market.vercel.app/annonces/"+a.id;
 return {title:a.titre+" | TOUT ICI MARKET",description,alternates:{canonical:url},openGraph:{title:a.titre,description,url,type:"article",images:a.photos?.[0]?[{url:a.photos[0]}]:undefined}};
}
function displayDetail(value:unknown){
 if(typeof value==="string"||typeof value==="number")return String(value);
 return "";
}
export default async function MarketplaceAnnoncePage({params}:Props){
 const {id}=await params;const a=await getAnnonce(id);if(!a)notFound();
 const category=depotCategories.find(c=>c.slug===a.categorie);
 const special=a.caracteristiques??{};
 const video=typeof special.video_url==="string"&&special.video_url.startsWith((process.env.NEXT_PUBLIC_SUPABASE_URL??"")+"/storage/v1/object/public/annonces-marketplace-videos/")?special.video_url:null;
 const details=Object.entries(special).filter(([k,v])=>!["video_url","localisation"].includes(k)&&displayDetail(v)!=="");
 return <main className="market-ad">
 <style>{`
 .market-ad{font-family:Arial,Helvetica,sans-serif;color:#092451;padding:14px 0 35px}
 .market-ad *{box-sizing:border-box}
 .market-ad h1{font-size:clamp(25px,3vw,37px);line-height:1.15;margin:15px 0}
 .market-ad .columns{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(240px,.65fr);gap:17px}
 .market-ad .panel{border:1px solid #d5e0ec;background:#fff;border-radius:17px;padding:17px;margin-bottom:15px}
 .market-ad .price{font-size:28px;font-weight:900;color:#083eaa}
 .market-ad .gallery{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
 .market-ad .gallery img{width:100%;height:auto;aspect-ratio:4/3;object-fit:cover;border-radius:11px}
 .market-ad .gallery img:first-child{grid-column:1/-1;aspect-ratio:16/9}
 .market-ad dl{display:grid;grid-template-columns:1fr 1fr;gap:12px}
 .market-ad dl div{border-bottom:1px solid #e3eaf3;padding:6px}
 .market-ad dt{font-size:12px;color:#526781}
 .market-ad dd{margin:4px 0 0;font-weight:700}
 .market-ad video{display:block;width:100%;max-height:420px;border-radius:12px;background:#082451}
 .market-ad .actions{display:flex;flex-direction:column;gap:9px}
 .market-ad .actions a{padding:12px 15px;border-radius:9px;background:#ffcf06;color:#0a1f4d;font-weight:800;text-decoration:none;text-align:center}
 @media(max-width:750px){.market-ad .columns{grid-template-columns:1fr}}
 `}</style>
 <a href="/deposer" style={{color:"#164caa"}}>← Toutes les catégories</a>
 <h1>{a.titre}</h1>
 <div className="columns"><div>
 <section className="panel">{a.photos?.length?<div className="gallery">{a.photos.map((src,i)=><img key={i} src={src} alt={"Photo "+(i+1)+" de l’annonce"}/>)}</div>:<p>Cette annonce ne comporte pas de photographies.</p>}</section>
 {video&&<section className="panel"><h2>Vidéo de l’annonce</h2><video controls preload="metadata" playsInline src={video}>Votre navigateur ne prend pas en charge les vidéos.</video></section>}
 <section className="panel"><h2>Description</h2><p style={{whiteSpace:"pre-wrap",lineHeight:1.65}}>{a.description}</p></section>
 {details.length>0&&<section className="panel"><h2>Caractéristiques</h2><dl>{details.map(([k,v])=><div key={k}><dt>{k.replace(/_/g," ")}</dt><dd>{displayDetail(v)}</dd></div>)}</dl></section>}
 </div><aside>
 <section className="panel"><div className="price">{a.prix==null?"Prix non renseigné":a.prix.toLocaleString("fr-FR")+" €"}</div>
 <p style={{fontWeight:800}}>{category?.nom??a.categorie} · {a.sous_categorie}</p>
 <p>📍 {a.ville}{a.code_postal?" ("+a.code_postal+")":""}</p>
 <p style={{fontSize:12,color:"#586981"}}>Annonce publiée le {new Date(a.created_at).toLocaleDateString("fr-FR")}</p></section>
 <section className="panel actions"><h2 style={{margin:"0 0 4px"}}>Cette annonce vous intéresse ?</h2>
 <a href="/compte/messages">Accéder à mes messages</a>
 <small style={{lineHeight:1.5,color:"#506886"}}>La messagerie pour les annonces hors automobile sera raccordée progressivement. Ne transmettez jamais de données bancaires par messagerie.</small>
 </section></aside></div>
 </main>;
}
