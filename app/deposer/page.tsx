import Link from "next/link";
import {depotCategories} from "./categories";
export const metadata={title:"Déposer une annonce gratuite | TOUT ICI MARKET",description:"Choisissez la catégorie de votre annonce gratuite entre particuliers."};
export default function ChoisirCategorie(){
return <main className="depot-entry">
<style>{`
.depot-entry{font-family:Arial,Helvetica,sans-serif;color:#081e4d;padding:0 0 32px}
.depot-entry *{box-sizing:border-box}
.depot-entry .banner{border-radius:15px;min-height:255px;overflow:hidden;display:flex;align-items:center;background:linear-gradient(90deg,#071c48ef 0%,#082452de 32%,#08245220 72%),url('/accueil-reel/bandeau.svg') center/cover}
.depot-entry .banner-copy{max-width:525px;padding:30px;color:#fff}
.depot-entry .banner h1{font-size:clamp(29px,3.2vw,46px);line-height:1.12;margin:0 0 15px;color:#fff}
.depot-entry .banner h1 span{color:#ffce0a}
.depot-entry .banner p{font-size:16px;line-height:1.5;margin:0}
.depot-entry .start-button{display:inline-block;margin-top:18px;padding:13px 22px;background:#ffcf06;color:#071e47;border-radius:14px;text-decoration:none;font-weight:900;box-shadow:0 3px 10px #001b4e25}
.depot-entry .start-button:hover,.depot-entry .start-button:focus-visible{background:#ffe05b}
.depot-entry .heading{text-align:center;padding:25px 8px 11px}
.depot-entry .heading h2{margin:0;font-size:clamp(23px,2.5vw,31px)}
.depot-entry .heading p{color:#486079;margin:8px 0}
.depot-entry .steps-info{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin:15px 0 22px}
.depot-entry .step-info{border:1px solid #d8e5f3;border-radius:13px;padding:15px 10px;background:#fff;text-align:center}
.depot-entry .step-info .step-number{display:flex;align-items:center;justify-content:center;background:#0b398f;color:#fff;border-radius:50%;width:36px;height:36px;margin:0 auto 9px;font-weight:900}
.depot-entry .step-info strong{display:block;font-size:13px;margin:5px 0}
.depot-entry .step-info small{display:block;color:#587086;font-size:12px;line-height:1.4}
.depot-entry .cards{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.depot-entry .card{display:flex;flex-direction:column;min-width:0;text-decoration:none;color:#082353;background:#fff;border:1px solid #d7e2ee;border-radius:14px;overflow:hidden;box-shadow:0 3px 10px #15335b10;transition:transform .15s,border-color .15s}
.depot-entry .card:hover,.depot-entry .card:focus-visible{transform:translateY(-3px);border-color:#ffbf00}
.depot-entry .card img{display:block;width:100%;height:122px;object-fit:cover;background:#f1f6fc}
.depot-entry .card .copy{padding:12px;display:flex;flex-direction:column;gap:7px;flex:1}
.depot-entry .card strong{font-size:16px}
.depot-entry .card small{font-size:12px;line-height:1.35;color:#52667b}
.depot-entry .card .arrow{color:#0b50a0;font-weight:800;margin-top:auto;padding-top:4px}
@media(max-width:1080px){.depot-entry .cards{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:650px){.depot-entry .steps-info{grid-template-columns:repeat(2,minmax(0,1fr))}.depot-entry .cards{grid-template-columns:repeat(2,minmax(0,1fr))}.depot-entry .card img{height:100px}.depot-entry .banner{min-height:200px}}
`}</style>
<section className="banner"><div className="banner-copy"><div style={{color:"#c3ffda",fontWeight:800,fontSize:13,marginBottom:12}}>100 % GRATUIT POUR LES PARTICULIERS</div><h1>Déposez votre annonce en <span>quelques minutes</span></h1><p>Vendez, louez ou proposez vos services simplement sur <strong>TOUT ICI MARKET</strong>.</p><a className="start-button" href="#categories-depot">Commencer à déposer votre annonce ↓</a></div></section>
<div className="heading"><h2>Comment déposer une annonce ?</h2><p>Un parcours gratuit en 5 étapes simples. Commencez en choisissant votre catégorie ci-dessous.</p></div>
<div className="steps-info" aria-label="Les cinq étapes du dépôt">
{[
["Choisissez la catégorie","Sélectionnez le domaine de votre annonce pour ouvrir son formulaire dédié."],
["Ajoutez vos photos et vidéo","Présentez votre bien avec des photos et, si vous le souhaitez, une vidéo."],
["Décrivez votre annonce","Renseignez les informations utiles, le prix et la localisation."],
["Vérifiez votre annonce","Relisez les détails et prévisualisez la présentation."],
["Publiez gratuitement","Confirmez la publication depuis votre page de dépôt spécialisée."]
].map(([name,description],i)=><div className="step-info" key={name}><span className="step-number">{i+1}</span><strong>{name}</strong><small>{description}</small></div>)}
</div>
<div className="heading" id="categories-depot"><h2>Choisissez une catégorie pour commencer</h2><p>Cliquez sur une des 12 catégories pour accéder à sa page de dépôt d'annonce.</p></div>
<div className="cards">{depotCategories.map(c=><Link className="card" href={c.slug==="automobile"?"/automobile/deposer":"/deposer/"+c.slug} key={c.slug}>
<img src={"/accueil-reel/"+c.image+".svg"} alt="" /><div className="copy"><strong>{c.icone} {c.nom}</strong><small>{c.resume}</small><span className="arrow">Ouvrir la page de dépôt →</span></div>
</Link>)}</div>
<p style={{fontSize:13,color:"#4c6080",marginTop:20}}>Les annonces sont liées à votre compte. Les informations demandées diffèrent selon la catégorie. Les badges de vérification sont attribués uniquement après contrôle réel.</p>
</main>;
}