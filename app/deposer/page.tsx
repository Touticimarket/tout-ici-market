import Link from "next/link";
import {depotCategories} from "./categories";
export const metadata={title:"Déposer une annonce gratuite | TOUT ICI MARKET",description:"Découvrez les cinq étapes du dépôt gratuit et choisissez une catégorie pour publier votre annonce."};

const depotOrder=["automobile","immobilier","nautisme","emploi-services","maison-bricolage-jardin","tv-telephonie-informatique","famille","mode-accessoires","animaux","materiel-pro","loisirs-voyages","bons-plans"];
const principal=depotOrder.map(slug=>depotCategories.find(c=>c.slug===slug)).filter((c):c is (typeof depotCategories)[number]=>Boolean(c));
const etapes=[
 {titre:"Choisissez votre catégorie",description:"Véhicules, immobilier, nautisme, bricolage…",icone:"▦"},
 {titre:"Ajoutez vos photos et/ou vidéo",description:"Présentez votre bien sous plusieurs angles.",icone:"▣"},
 {titre:"Renseignez les informations",description:"Description, caractéristiques, prix et lieu.",icone:"✎"},
 {titre:"Vérifiez et prévisualisez",description:"Relisez votre annonce avant publication.",icone:"◉"},
 {titre:"Publiez votre annonce",description:"Confirmez votre dépôt gratuitement.",icone:"✓"}
];
export default function ChoisirCategorie(){
return <main className="depot-entry">
<style>{`
body:has(.depot-entry){background:#f8fafe!important}
body:has(.depot-entry) .tim-shell{display:block;max-width:1800px;padding:0;margin:0 auto}
body:has(.depot-entry) .tim-sidebar{display:none}
body:has(.depot-entry) .tim-content{width:100%}
.depot-entry .reference-top{width:100%;margin:0;padding:0;overflow:hidden;background:#f9fbfe}
.depot-entry .reference-top img{display:block;width:100%;height:auto;object-fit:contain}
.depot-entry .reference-top img:first-child{border-radius:0}
.depot-entry .hero,.depot-entry .intro-heading,.depot-entry .steps{display:none}
.depot-entry{color:#071c4c;font-family:Arial,Helvetica,sans-serif;padding:0 14px 28px}
.depot-entry *{box-sizing:border-box}
.depot-entry .hero{display:grid;grid-template-columns:35% minmax(0,65%);align-items:stretch;position:relative;overflow:hidden;background:#071d4a;box-shadow:0 5px 15px #13234f1b;border-radius:0 0 17px 17px;min-height:330px}
.depot-entry .hero-visual{position:relative;display:flex;align-items:center;justify-content:center;min-width:0;background:#bdd5de}
.depot-entry .hero-visual img{display:block;width:100%;height:auto;object-fit:contain}
.depot-entry .hero-stamp{position:absolute;top:13px;right:14px;background:#fff;border-radius:12px;color:#09502f;box-shadow:0 3px 12px #0002;padding:11px 13px;font-size:13px;font-weight:800;max-width:185px;line-height:1.35}
.depot-entry .hero-copy{padding:33px clamp(15px,2.2vw,35px);color:#fff;align-self:center;min-width:0;max-width:none}
.depot-entry .eyebrow{font-size:13px;color:#11743e;background:#daf5e5;border-radius:30px;font-weight:900;padding:9px 14px;display:inline-block}
.depot-entry .hero h1{font-size:clamp(33px,3.35vw,56px);font-weight:900;line-height:1.05;color:white;letter-spacing:-.04em;margin:15px 0}
.depot-entry .hero h1 em{font-style:normal;color:#ffce08}
.depot-entry .hero p{font-size:17px;line-height:1.45;margin:12px 0 16px}
.depot-entry .benefits{display:flex;flex-wrap:wrap;gap:0;background:#fffffff0;box-shadow:0 2px 5px #0002;border-radius:14px;max-width:490px;padding:8px 6px;color:#08255a}
.depot-entry .benefits span{flex:1;min-width:100px;text-align:center;padding:7px;border-right:1px solid #dce5ef;font-weight:800;font-size:11px}
.depot-entry .benefits span:last-child{border:0}
.depot-entry .benefits b{display:block;color:#1041ba;font-size:21px;margin-bottom:3px}
.depot-entry .section-title{text-align:center;margin:20px 0 14px}
.depot-entry .section-title h2{font-size:clamp(23px,2.45vw,34px);line-height:1.2;color:#081b53;margin:0 0 8px;font-weight:900}
.depot-entry .section-title h2::after{content:"";display:block;width:125px;height:4px;background:#ffcf08;border-radius:10px;margin:10px auto}
.depot-entry .section-title p{font-size:15px;color:#375074;margin:0}
.depot-entry .steps{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:0;border:1px solid #ccd9f0;border-radius:17px;padding:15px 8px;background:#f5f9ff}
.depot-entry .step{min-width:0;text-align:center;padding:6px 12px;position:relative}
.depot-entry .step:not(:last-child)::after{content:"›";font-size:26px;color:#10409b;position:absolute;right:-6px;top:30%}
.depot-entry .number{display:inline-grid;place-items:center;background:#1041a9;color:#fff;font-size:18px;font-weight:900;width:36px;height:36px;border-radius:50%;margin-right:6px}
.depot-entry .step-icon{font-size:28px;color:#163db0;vertical-align:middle}
.depot-entry .step strong{display:block;max-width:180px;margin:7px auto 5px;font-size:16px;line-height:1.18}
.depot-entry .step small{display:block;font-size:12px;color:#466181;line-height:1.4}
.depot-entry .start-wrap{text-align:center;padding:19px 0 4px}
.depot-entry .start-button{display:inline-flex;align-items:center;justify-content:center;gap:11px;background:#ffd006;color:#071a46;padding:17px 26px;border-radius:40px;font-weight:900;text-decoration:none;font-size:clamp(15px,1.6vw,21px);box-shadow:0 3px 5px #071d481e}
.depot-entry .start-button:hover,.depot-entry .start-button:focus-visible{background:#ffe05a}
.depot-entry .categories-wrap{background:#f3f7fe;border-radius:22px;padding:14px 15px 18px;margin-top:15px}
.depot-entry .cards{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:13px}
.depot-entry .card{display:flex;flex-direction:column;text-decoration:none;color:#092254;border:1px solid #d1dced;background:#fff;border-radius:14px;overflow:hidden;min-width:0;box-shadow:0 3px 6px #10264d15;transition:border-color .15s,transform .15s}
.depot-entry .card:hover,.depot-entry .card:focus-visible{border-color:#ffcb0b;transform:translateY(-2px)}
.depot-entry .card img{display:block;width:100%;height:auto;aspect-ratio:2.65/1;object-fit:fill;object-position:center;background:#e7f1fb}
.depot-entry .card .fallback{aspect-ratio:261/119;display:grid;place-items:center;background:linear-gradient(125deg,#f5eddc,#edf5ff);font-size:45px}
.depot-entry .card-text{display:flex;flex-direction:column;flex:1;padding:10px}
.depot-entry .card strong{font-size:14px;line-height:1.2;min-height:32px}
.depot-entry .card small{font-size:12px;color:#425679;line-height:1.35;margin-top:4px;flex:1}
.depot-entry .card .go{font-size:12px;color:#0b49aa;font-weight:800;margin-top:7px}
.depot-entry .other{text-align:center;padding-top:13px;font-size:13px}
.depot-entry .other a{color:#1247a2;font-weight:800}
.depot-entry .approved-lower{display:flex;flex-direction:column;gap:13px;margin:17px 0 0}
.depot-entry .approved-lower img{display:block;width:100%;height:auto;object-fit:contain}
.depot-entry .mobile-lower{display:none}
.depot-entry .mia{display:grid;grid-template-columns:auto 1.6fr 1fr;gap:20px;align-items:center;background:linear-gradient(100deg,#e2f8e9,#effff5);border:1px solid #d3ecdd;border-radius:17px;margin:15px 0;padding:21px}
.depot-entry .mia-icon{width:75px;height:75px;border:3px solid #87dcaa;display:grid;place-items:center;font-size:36px;border-radius:50%;background:#fff}
.depot-entry .mia h2{margin:0 0 7px;font-size:22px;color:#08713b}
.depot-entry .mia p{font-size:13px;line-height:1.5;margin:0}
.depot-entry .mia ul{padding-left:18px;margin:0;font-size:13px;line-height:1.75}
.depot-entry .trust{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;background:#eff5fe;border:1px solid #dfebf7;border-radius:14px;padding:16px 10px}
.depot-entry .trust div{text-align:center;font-size:12px;color:#10264a;border-right:1px solid #cfdaec;padding:5px}
.depot-entry .trust div:last-child{border-right:0}
.depot-entry .trust b{color:#0a35a0;display:block;font-size:12px;margin-bottom:6px}
@media(max-width:1200px){.depot-entry .cards{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media(max-width:820px){.depot-entry .cards{grid-template-columns:repeat(3,minmax(0,1fr))}.depot-entry .hero{min-height:270px;grid-template-columns:39% minmax(0,61%)}.depot-entry .hero-copy{max-width:none}.depot-entry .steps{grid-template-columns:repeat(5,minmax(0,1fr))}.depot-entry .step{padding:5px}.depot-entry .step strong{font-size:12px}.depot-entry .step small{font-size:11px}}
@media(max-width:600px){
.depot-entry .reference-top{display:block}
.depot-entry{padding:0 8px 24px}
.depot-entry .hero{min-height:0;border-radius:0 0 13px 13px;grid-template-columns:1fr}.depot-entry .hero-visual{order:2}.depot-entry .hero-visual img{width:100%;height:auto}.depot-entry .hero-stamp{font-size:10px;top:6px;right:6px;padding:7px;max-width:125px}
.depot-entry .hero-copy{padding:20px 16px;max-width:100%;width:100%;order:1}
.depot-entry .hero h1{font-size:31px;max-width:335px}
.depot-entry .hero p{font-size:13px;max-width:330px}
.depot-entry .benefits{padding:6px;max-width:none;margin-top:14px}.depot-entry .benefits span{min-width:0;font-size:9px}.depot-entry .benefits b{font-size:17px}
.depot-entry .section-title h2{font-size:22px}.depot-entry .section-title p{font-size:12px}
.depot-entry .steps{display:flex;overflow-x:auto;padding:9px 6px;gap:0;scroll-snap-type:x proximity}
.depot-entry .step{flex:0 0 33%;scroll-snap-align:start;padding:7px 11px}.depot-entry .step strong{font-size:11px}.depot-entry .step small{font-size:10px}.depot-entry .step:not(:last-child)::after{top:22%}
.depot-entry .number{height:28px;width:28px;font-size:14px}.depot-entry .step-icon{font-size:17px}
.depot-entry .start-button{width:100%;font-size:15px;padding:15px 7px}
.depot-entry .categories-wrap{padding:9px;border-radius:15px}
.depot-entry .cards{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.depot-entry .card img,.depot-entry .card .fallback{height:auto;aspect-ratio:2.65/1}
.depot-entry .card-text{padding:9px}.depot-entry .card strong{font-size:12px}.depot-entry .card small{font-size:10px}
.depot-entry .approved-lower{display:none}.depot-entry .mobile-lower{display:block}
.depot-entry .mia{grid-template-columns:auto 1fr;gap:10px;padding:12px}.depot-entry .mia-icon{width:51px;height:51px;font-size:25px}.depot-entry .mia h2{font-size:17px}.depot-entry .mia ul{grid-column:1/-1;font-size:12px}
.depot-entry .trust{grid-template-columns:repeat(2,1fr);row-gap:12px}
}
`}</style>
<div className="reference-top" aria-label="Présentation du dépôt d’annonce et ses cinq étapes"><img src="/depot/reference-haut.svg" alt="Publiez votre annonce en quelques minutes : voiture, maison, bateau, vélo et mobilier ; dépôt gratuit pour les particuliers" /><img src="/depot/reference-etapes.svg" alt="Comment déposer une annonce : choisir sa catégorie, ajouter photos et vidéo, remplir les informations, vérifier et publier" /></div>
<div className="start-wrap"><a href="#categories-depot" className="start-button">📣 Commencer à déposer votre annonce <span aria-hidden="true">›</span></a></div>
<section className="categories-wrap" id="categories-depot">
<div className="section-title"><h2>Choisissez votre catégorie</h2><p>Cliquez sur une rubrique pour ouvrir sa page de dépôt spécialisée.</p></div>
<div className="cards">{principal.map(c=><Link className="card" href={c.slug==="automobile"?"/automobile/deposer":"/deposer/"+c.slug} key={c.slug}>
<img src={"/depot/photos-valides/"+c.slug+".svg"} alt={""} />
<div className="card-text"><strong>{c.icone} {c.nom}</strong><small>{c.resume}</small><span className="go">Déposer dans cette rubrique ›</span></div></Link>)}</div>
<div className="other"><Link href="/deposer/autres">Autres catégories →</Link></div>
</section>
<div className="approved-lower">
<img src="/depot/mia-reference.svg" alt="MIA vous accompagne : conseils pour rédiger votre annonce, plus de visibilité et plus de contacts" />
<img src="/depot/garanties-reference.svg" alt="Paiement sécurisé, support 7 jours sur 7, annonces vérifiées, zéro commission et communauté fiable" />
</div>
<div className="mobile-lower">
<section className="mia"><div className="mia-icon" aria-hidden="true">🤖</div><div><h2>MIA vous accompagne !</h2><p>Pour réussir votre annonce, choisissez des photos claires, un titre précis et une description complète. Les conseils s'adaptent à votre catégorie.</p></div><ul><li>Une annonce claire et complète</li><li>Des photos et une vidéo si besoin</li><li>Une publication simple et gratuite</li></ul></section>
<div className="trust"><div><b>🔒 CONFIDENTIALITÉ</b>Gardez la maîtrise de vos informations</div><div><b>📷 PHOTOS & VIDÉO</b>Présentez votre bien simplement</div><div><b>✓ INFORMATIONS EXACTES</b>Relisez vos informations avant publication</div><div><b>♡ GRATUIT POUR LES PARTICULIERS</b>Déposez gratuitement votre annonce</div></div></div>
</main>;
}