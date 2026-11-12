import {
  CarFront, House, BriefcaseBusiness, Shirt, Sofa, Smartphone,
  Palmtree, Wrench, Gamepad2, LayoutGrid, Plus,
  UserRound, Building2, ChevronDown, ArrowUpRight
} from "lucide-react";

const categories = [
  {name:"Automobile & Véhicules",description:"Auto, moto, utilitaire…",href:"/deposer/automobile",Icon:CarFront},
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
      .ti-home-header{height:72px;padding:0 25px 0 265px;display:flex;align-items:center;justify-content:space-between;gap:18px;border-bottom:1px solid #e6ebf3;background:#fff}
      .ti-home-menu{display:flex;align-items:center;gap:clamp(10px,1.7vw,27px);min-width:0}
      .ti-home-menu a,.ti-home-account a,.ti-home-account span{color:#142344;font-size:13px;font-weight:750;text-decoration:none;white-space:nowrap}
      .ti-home-menu a:hover,.ti-home-account a:hover{color:#0052c7}
      .ti-home-menu .ti-home-more{display:inline-flex;align-items:center;gap:3px}
      .ti-home-account{display:flex;gap:12px;align-items:center}
      .ti-home-account a,.ti-home-account span{display:inline-flex;align-items:center;gap:6px}
      .ti-home-account .ti-home-sell{background:linear-gradient(#ffda3f,#ffb800);color:#061e4c;border-radius:12px;padding:13px 16px;box-shadow:0 3px 8px #b87e0015}
      .ti-home-sell:hover{filter:brightness(.98)}
      .ti-home-hero-crop{position:relative;overflow:hidden;aspect-ratio:1536/349;background:#eef6ff}
      .ti-home-hero-crop>img{position:absolute;display:block;width:100%;height:auto;top:-19.484%;left:0}
      .ti-home-categories{max-width:1460px;margin:0 auto;padding:13px 34px 20px}
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
      @media(max-width:1250px){
        .ti-home-header{padding-left:235px;gap:9px}
        .ti-home-menu{gap:11px}
        .ti-home-menu a,.ti-home-account a{font-size:11px}
        .ti-home-account{gap:8px}
        .ti-home-account .ti-home-sell{padding:10px 11px}
      }
      @media(max-width:980px){
        .ti-home-header{padding-left:230px;overflow-x:auto;scrollbar-width:none}
        .ti-home-menu{flex-shrink:0}
        .ti-home-account{flex-shrink:0}
        .ti-home-categories{padding:12px 18px 20px}
        .ti-home-category-grid{grid-template-columns:repeat(4,minmax(0,1fr))}
      }
      @media(max-width:640px){
        .ti-home-header{padding:80px 12px 10px;height:auto;min-height:128px;flex-wrap:wrap;overflow:visible}
        .ti-home-menu{width:100%;overflow-x:auto;padding-bottom:5px}
        .ti-home-account{margin-left:auto}
        .ti-home-hero-crop{aspect-ratio:1536/349}
        .ti-home-categories{padding:13px 12px 18px}
        .ti-home-category-header h2{font-size:17px}
        .ti-home-category-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
        .ti-home-category-card{min-height:61px;padding:9px 10px}
        .ti-home-category-card strong{font-size:12px}
        .ti-home-category-card small{font-size:10px}
      }
    `}</style>
    <header className="ti-home-header">
      <nav className="ti-home-menu" aria-label="Menu principal">
        <a href="/deposer/automobile">Automobile & Véhicules</a>
        <a href="/immobilier">Immobilier</a>
        <a href="/emploi">Emploi & Services</a>
        <a href="/mode">Mode</a>
        <a href="/maison-jardin">Maison & Jardin</a>
        <a href="/deposer" className="ti-home-more">Plus <ChevronDown size={14}/></a>
      </nav>
      <div className="ti-home-account">
        <a className="ti-home-sell" href="/deposer"><Plus size={17}/> Déposer une annonce</a>
        <span title="Connexion en préparation"><UserRound size={17}/> Connexion</span>
        <span title="Espace professionnel en préparation"><Building2 size={17}/> Espace pro</span>
      </div>
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

    <div className="ti-home-rest-crop">
      <img src="/public/banner-home.png" alt="Aperçu des annonces populaires et des services de TOUT ICI MARKET."/>
    </div>
  </main>;
}
