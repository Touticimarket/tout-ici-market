import DernieresVisites from "./components/DernieresVisites";
import LiensCompte from "./components/LiensCompte";
import {
  CarFront, House, BriefcaseBusiness, Shirt, Sofa, Smartphone,
  Palmtree, Wrench, Gamepad2, LayoutGrid, Plus,
  ChevronDown, ArrowUpRight
} from "lucide-react";

const categories = [
  {name:"Automobile & Véhicules",description:"Auto, moto, utilitaire…",href:"/automobile",Icon:CarFront},
  {name:"Immobilier",description:"Vente & location",href:"/immobilier",Icon:House},
  {name:"Emploi & Services",description:"Offres & services",href:"/emploi",Icon:BriefcaseBusiness},
  {name:"Mode & Accessoires",description:"Vêtements & accessoires",href:"/mode",Icon:Shirt},
  {name:"Maison & Jardin",description:"Meubles & décoration",href:"/maison-jardin",Icon:Sofa},
  {name:"Téléphones",description:"Mobiles & informatique",href:"/telephones",Icon:Smartphone},
  {name:"Vacances & Loisirs",description:"Séjours & loisirs",href:"/vacances-loisirs",Icon:Palmtree},
  {name:"Bricolage",description:"Travaux & outillage",href:"/bricolage",Icon:Wrench},
  {name:"Jeux & Consoles",description:"Gaming & jeux",href:"/jeux-consoles",Icon:Gamepad2},
  {name:"Autres catégories",description:"Tout le reste",href:"/deposer",Icon:LayoutGrid},
];

export default function Home() {
  return <main className="ti-home">
    <style>{`
      .ti-home{font-family:Arial,Helvetica,sans-serif;background:#fff;color:#0b214b;min-height:100vh}
      .ti-home *{box-sizing:border-box}
      /* Deux lignes distinctes : logo et actions en haut, catégories sur 100 % de la largeur. */
      .ti-home-header{background:#fff;border-bottom:1px solid #dce6f4}
      .ti-home-toolbar{min-height:77px;padding:10px 22px 10px 223px;display:flex;justify-content:flex-end;align-items:center}
      .ti-home-account{display:flex;align-items:center;justify-content:flex-end;gap:12px;flex-wrap:wrap;min-width:0}
      .ti-home-account a{display:inline-flex;align-items:center;justify-content:center;gap:7px;font-size:13px;line-height:1.35;font-weight:780;text-decoration:none;color:#153466;white-space:nowrap}
      .ti-home-account a:hover{color:#0052c7}
      .ti-home-account .ti-home-signup{color:#0750be;border:1px solid #bdd4f8;border-radius:11px;padding:11px 14px;background:#f0f6ff}
      .ti-home-account .ti-home-signup:hover{background:#e4efff}
      .ti-home-account .ti-home-sell{background:linear-gradient(#ffda3f,#ffbd12);color:#061e4c;border-radius:12px;padding:12px 17px;box-shadow:0 3px 8px #b87e0015;font-weight:850}
      .ti-home-account .ti-home-sell:hover{filter:brightness(.98)}
      .ti-home-menu{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));align-items:stretch;width:100%;padding:0 13px;background:#f7faff;border-top:1px solid #e6eef8;gap:0}
      .ti-home-menu a{display:flex;align-items:center;justify-content:center;gap:6px;text-align:center;padding:13px 9px;min-height:51px;border-right:1px solid #e1eaf6;color:#143466;font-size:clamp(12px,1vw,15px);line-height:1.3;font-weight:800;text-decoration:none;white-space:normal;overflow-wrap:normal}
      .ti-home-menu a:first-child{border-left:1px solid #e1eaf6;color:#063f9f}
      .ti-home-menu a:hover,.ti-home-menu a:focus-visible{background:#eaf3ff;color:#004cbd}
      .ti-home-menu .ti-home-more{display:flex;align-items:center}
      .ti-home-hero-crop{position:relative;overflow:hidden;aspect-ratio:1536/349;background:#eef6ff}
      .ti-home-hero-crop>img{position:absolute;display:block;width:100%;height:auto;top:-19.484%;left:0}
      .ti-home-categories{width:100%;margin:0 auto;padding:14px 22px 22px}
      .ti-home-category-header{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-bottom:10px}
      .ti-home-category-header h2{font-size:18px;color:#0d2149;font-weight:800;letter-spacing:-.35px;margin:0}
      .ti-home-category-header a{font-size:12px;font-weight:750;text-decoration:none;color:#0053c6;white-space:nowrap;display:inline-flex;gap:5px;align-items:center}
      .ti-home-category-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:9px}
      .ti-home-category-card{display:flex;align-items:center;gap:11px;min-width:0;min-height:58px;padding:10px 12px;border-radius:13px;background:linear-gradient(115deg,#fff7e8,#fffdf8);border:1px solid #f6e6c5;text-decoration:none;color:#122b5a;transition:transform .16s,border-color .16s,box-shadow .16s}
      .ti-home-category-card:first-child{background:linear-gradient(115deg,#fff1b5,#fffae7);border-color:#f4d772}
      .ti-home-category-card:hover,.ti-home-category-card:focus-visible{border-color:#ffc32c;transform:translateY(-2px);box-shadow:0 7px 18px #0d357010}
      .ti-home-category-card .ti-icon{display:grid;place-items:center;flex:0 0 36px;width:36px;height:36px;background:#fff9ed;border:1px solid #f4e5c9;border-radius:10px;color:#14366a}
      .ti-home-category-card .ti-cat-text{min-width:0;flex:1}
      .ti-home-category-card strong{font-size:12.5px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:800}
      .ti-home-category-card small{display:block;color:#697890;font-size:10px;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .ti-home-category-card .ti-cat-arrow{color:#0d53bb;flex-shrink:0}
      .ti-home-rest-crop{position:relative;overflow:hidden;aspect-ratio:1536/451;background:#fff}
      .ti-home-rest-crop>img{position:absolute;display:block;width:100%;height:auto;top:-127.05%;left:0}
      @media(max-width:1000px){
        .ti-home-menu{grid-template-columns:repeat(3,minmax(0,1fr));padding:0 9px}
        .ti-home-menu a{min-height:45px;border-bottom:1px solid #e1eaf6;font-size:13px}
        .ti-home-categories{padding:13px 16px 20px}
        .ti-home-category-grid{grid-template-columns:repeat(4,minmax(0,1fr))}
      }
      @media(max-width:680px){
        .ti-home-toolbar{min-height:142px;padding:77px 12px 11px;justify-content:center}
        .ti-home-account{gap:8px;justify-content:center}
        .ti-home-account a{font-size:12px}
        .ti-home-account .ti-home-sell{padding:11px 13px}
        .ti-home-account .ti-home-signup{padding:10px 12px}
        .ti-home-menu{grid-template-columns:repeat(2,minmax(0,1fr));padding:0 7px}
        .ti-home-menu a{padding:11px 9px;min-height:47px;font-size:12px}
        .ti-home-hero-crop{aspect-ratio:1536/349}
        .ti-home-categories{padding:13px 12px 18px}
        .ti-home-category-header h2{font-size:17px}
        .ti-home-category-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
        .ti-home-category-card{min-height:61px;padding:9px 10px}
        .ti-home-category-card strong{font-size:12px}
        .ti-home-category-card small{font-size:10px}
      }
      @media(max-width:390px){
        .ti-home-account .ti-home-sell{width:100%}
      }
      .ti-home-category-card strong,.ti-home-category-card small{white-space:normal;overflow:visible;text-overflow:clip;line-height:1.35}
    `}</style>
    <header className="ti-home-header">
      <div className="ti-home-toolbar">
        <div className="ti-home-account">
          <a className="ti-home-sell" href="/deposer"><Plus size={17}/> Déposer une annonce</a>
          <LiensCompte />
        </div>
      </div>
      <nav className="ti-home-menu" aria-label="Menu principal">
        <a href="/automobile">Automobile & Véhicules</a>
        <a href="/immobilier">Immobilier</a>
        <a href="/emploi">Emploi & Services</a>
        <a href="/mode">Mode</a>
        <a href="/maison-jardin">Maison & Jardin</a>
        <a href="/deposer" className="ti-home-more">Plus <ChevronDown size={14}/></a>
      </nav>
    </header>

    <div className="ti-home-hero-crop">
      <img src="/public/banner-home.png" alt="TOUT ICI MARKET : tout acheter, tout vendre, tout trouver tout ici. Voiture, moto, maison, voyage et équipements."/>
    </div>

    <section className="ti-home-categories" aria-label="Toutes les catégories">
      <div className="ti-home-category-header">
        <h2>Toutes les catégories</h2>
        <a href="/deposer">Voir toutes les catégories <ArrowUpRight size={15}/></a>
      </div>
      <div className="ti-home-category-grid">
        {categories.map(({name,description,href,Icon})=><a href={href} key={name} className="ti-home-category-card">
          <span className="ti-icon"><Icon size={23} strokeWidth={1.8}/></span>
          <span className="ti-cat-text"><strong>{name}</strong><small>{description}</small></span>
          <ArrowUpRight className="ti-cat-arrow" size={14} aria-hidden="true"/>
        </a>)}
      </div>
    </section>

    <DernieresVisites />

    <div className="ti-home-rest-crop">
      <img src="/public/banner-home.png" alt="Aperçu des annonces populaires et des services de TOUT ICI MARKET."/>
    </div>
  </main>;
}
