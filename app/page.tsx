const categories = [
  { name:"Automobile & Véhicules", href:"/automobile", image:"automobile" },
  { name:"Immobilier", href:"/immobilier", image:"immobilier" },
  { name:"Emploi", href:"/emploi", image:"emploi" },
  { name:"Matériel pro", href:"/materiel-pro", image:"materiel-pro" },
  { name:"Maison, Bricolage & Jardin", href:"/maison-jardin", image:"maison-jardin" },
  { name:"TV, Téléphonie & Informatique", href:"/telephones", image:"telephones" },
  { name:"Loisirs & Voyages", href:"/vacances-loisirs", image:"vacances-loisirs" },
  { name:"Famille", href:"/famille", image:"famille" },
  { name:"Bon plan", href:"/bon-plan", image:"bon-plan" },
  { name:"Autres", href:"/autres", image:"autres" }
];

export default function Home(){
  return <main className="tim-home">
    <style>{`
      body:has(.tim-home){background:#f6f9fd!important}
      body:has(.tim-home) .tim-header{min-height:122px;box-sizing:border-box;padding:13px clamp(15px,2.7vw,46px);gap:clamp(12px,2vw,32px);background:linear-gradient(105deg,#031b54 0%,#00296c 50%,#061444 100%);border-bottom:1px solid #7c9fd2}
      body:has(.tim-home) .tim-logo{width:clamp(220px,23vw,355px)}
      body:has(.tim-home) .tim-logo img{max-height:110px}
      body:has(.tim-home) .tim-logo-caption{display:none}
      body:has(.tim-home) .tim-home-search{display:flex;align-items:center;flex:1;max-width:580px;min-width:160px;height:48px;border:2px solid #dce6ff;border-radius:15px;background:white;box-shadow:0 1px 3px #00143444;overflow:hidden}
      body:has(.tim-home) .tim-home-search .search-symbol{color:#051c45;font-size:24px;margin:0 12px 0 17px}
      body:has(.tim-home) .tim-home-search input{font-size:17px;font-weight:700;color:#09215e;min-width:0;flex:1;width:0;outline:none;border:0;background:transparent}
      body:has(.tim-home) .tim-home-search input::placeholder{color:#09215e;opacity:1}
      body:has(.tim-home) .tim-home-search button{background:#ffdb05;color:#071c40;font-weight:800;border:0;border-radius:11px;padding:12px 23px;margin-right:4px;cursor:pointer;font-size:15px}
      body:has(.tim-home) .tim-header-links{gap:17px}
      body:has(.tim-home) .tim-header-links a{font-size:14px}
      body:has(.tim-home) .tim-header-links .tim-post{border-radius:12px;padding:15px 17px}
      body:has(.tim-home) .tim-navbar{min-height:62px;align-items:stretch;gap:0;background:linear-gradient(180deg,#062a70,#041b4c);border-bottom:4px solid #ffd20b;padding:0 clamp(12px,2.4vw,42px)}
      body:has(.tim-home) .tim-navbar a{display:flex;align-items:center;justify-content:center;font-size:13px;padding:12px 10px}
      body:has(.tim-home) .tim-navbar a:first-child{font-size:0}
      body:has(.tim-home) .tim-navbar a:first-child::before{content:'⌂';font-size:32px;line-height:1}
      body:has(.tim-home) .tim-shell{grid-template-columns:minmax(220px,260px) minmax(0,1fr);max-width:1800px;gap:12px;padding:13px 6px 32px}
      body:has(.tim-home) .tim-sidebar{border-radius:16px;border:1px solid #d6e0ee;background:linear-gradient(180deg,#fff,#f5f8fe);padding:7px 9px;box-shadow:0 2px 5px #153b6a12}
      body:has(.tim-home) .tim-sidebar-title{background:transparent;font-size:17px;font-weight:900;padding:12px 5px 16px;margin:0;color:#0a1946}
      body:has(.tim-home) .tim-sidebar a,body:has(.tim-home) .tim-sidebar a:first-of-type{background:transparent;color:#111c35;border-radius:0;border-bottom:1px solid #dde4f0;padding:7px 3px;gap:9px;font-size:12px;min-height:46px}
      body:has(.tim-home) .tim-sidebar a:last-child{border-bottom:0}
      body:has(.tim-home) .tim-sidebar-icon{display:none}
      body:has(.tim-home) .tim-sidebar-image{display:block;width:49px;height:37px;object-fit:cover;object-position:top center;border-radius:8px;flex-shrink:0}
      body:has(.tim-home) .tim-sidebar-chevron{font-size:20px;color:#05183e}
      .tim-home{background:#fff;color:#051b55;font-family:Arial,Helvetica,sans-serif;min-width:0;padding:0 0 28px}
      .tim-home *{box-sizing:border-box}
      .tim-home .hero{border-radius:15px;overflow:hidden;background:#b4e5fb}
      .tim-home .hero img{display:block;width:100%;height:auto}
      .tim-home .heading{display:flex;justify-content:center;align-items:center;gap:14px;margin:11px 0 11px;color:#09155b;font-size:clamp(22px,2.2vw,29px);font-weight:900;line-height:1.15}
      .tim-home .heading::before,.tim-home .heading::after{content:'';display:block;background:#ffca08;width:50px;height:5px;border-radius:5px}
      .tim-home .category-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;padding:0 7px}
      .tim-home .category-card{display:block;overflow:hidden;border:1px solid #d9e2ee;border-radius:14px;background:#fff;text-decoration:none;box-shadow:0 1px 2px #0b346b13;transition:transform .15s,box-shadow .15s}
      .tim-home .category-card:hover,.tim-home .category-card:focus-visible{transform:translateY(-2px);box-shadow:0 6px 17px #0b346b24;outline:2px solid #ffd007}
      .tim-home .category-card img{width:100%;height:auto;display:block;aspect-ratio:261 / 119;object-fit:fill}
      .tim-home .popular{padding:0 8px}
      .tim-home .popular-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:14px 0 10px}
      .tim-home .popular h2{font-size:clamp(19px,1.8vw,25px);color:#08185a;margin:0;font-weight:900}
      .tim-home .popular h2::after{content:'';display:inline-block;width:48px;height:5px;border-radius:4px;background:#ffc800;margin:0 0 5px 11px}
      .tim-home .popular-head a{font-size:14px;color:#0030be;text-decoration:none;font-weight:800}
      .tim-home .empty-popular{border:1px solid #e1e8f1;border-radius:12px;padding:22px 16px;color:#425477;background:#fafcff;font-size:14px}
      @media(max-width:1230px){body:has(.tim-home) .tim-header{flex-wrap:wrap}body:has(.tim-home) .tim-header-links{margin-left:auto}.tim-home .category-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
      @media(max-width:760px){body:has(.tim-home) .tim-shell{display:flex;flex-direction:column;padding:8px}body:has(.tim-home) .tim-sidebar{position:static;max-width:100%;white-space:nowrap;overflow:auto}body:has(.tim-home) .tim-sidebar-title{display:none}body:has(.tim-home) .tim-sidebar-image{width:34px;height:28px}body:has(.tim-home) .tim-sidebar a{min-height:35px;border-bottom:0}body:has(.tim-home) .tim-home-search{order:3;flex-basis:100%;max-width:none}body:has(.tim-home) .tim-header{min-height:auto}body:has(.tim-home) .tim-header-links{margin-left:auto}body:has(.tim-home) .tim-navbar{min-height:52px;justify-content:flex-start}.tim-home .category-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.tim-home .popular-head{flex-wrap:wrap}}
      @media(max-width:390px){.tim-home .category-grid{grid-template-columns:1fr}}
    `}</style>
    <section className="hero" aria-label="Tout vendre, tout trouver, tout ici">
      <img src="/accueil-reel/bandeau.svg" alt="Tout acheter, tout vendre, tout trouver tout ici — voiture, moto, maison, bateau, salon, télévision et vélo" />
    </section>
    <section aria-labelledby="tim-categories-title">
      <h1 className="heading" id="tim-categories-title">Toutes les catégories</h1>
      <div className="category-grid">
        {categories.map(c=><a className="category-card" key={c.href} href={c.href} aria-label={c.name}>
          <img src={'/accueil-reel/'+c.image+'.svg'} alt={c.name} loading="lazy" />
        </a>)}
      </div>
    </section>
    <section className="popular" aria-labelledby="tim-popular-title">
      <div className="popular-head"><h2 id="tim-popular-title">Annonces populaires</h2><a href="/automobile/voitures">Voir toutes les annonces →</a></div>
      <p className="empty-popular">Les premières annonces publiées apparaîtront ici.</p>
    </section>
  </main>
}
