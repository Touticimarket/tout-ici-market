const sections = [
  { name: "Voitures", description: "Citadines, berlines, SUV, électriques et hybrides", slug: "voitures", icon: "🚘", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=85" },
  { name: "Motos & Scooters", description: "Motos, scooters et deux-roues", slug: "motos", icon: "🏍️", image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=85" },
  { name: "Utilitaires", description: "Fourgons, camionnettes et véhicules professionnels", slug: "utilitaires", icon: "🚐", image: "https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?auto=format&fit=crop&w=900&q=85" },
  { name: "Camping-cars & Caravaning", description: "Camping-cars, vans aménagés et caravanes", slug: "camping-cars", icon: "🚍", image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=900&q=85" },
  { name: "Autres véhicules", description: "Remorques, quads et autres véhicules", slug: "autres-vehicules", icon: "🚜", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=85" },
];
const navigation = [
  ["Accueil", "/"], ["Automobile & Véhicules", "/automobile"], ["Immobilier", "/immobilier"],
  ["Emploi & Services", "/emploi"], ["Maison & Jardin", "/maison-jardin"], ["Mode", "/mode"],
  ["High-Tech", "/telephones"], ["Loisirs", "/vacances-loisirs"], ["Autres", "/autres"],
];
export default function AutomobilePage() {
  return (
    <main className="auto-categories">
      <style>{`
        .auto-categories{min-height:100vh;background:#041943;color:white;font-family:Arial,Helvetica,sans-serif}
        .auto-categories *{box-sizing:border-box}
        .auto-nav{background:#061b49;border-bottom:2px solid #2489c9;display:flex;gap:4px;overflow-x:auto;padding:8px 16px}
        .auto-nav a{white-space:nowrap;color:#fff;text-decoration:none;font-weight:700;padding:14px 16px;border-radius:30px}
        .auto-nav .active{background:#ffd00b;color:#06173b}
        .auto-intro{padding:52px clamp(20px,4vw,65px) 66px;background:linear-gradient(90deg,rgba(0,13,45,.98),rgba(0,30,72,.7)),url("https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2000&q=85") center/cover}
        .auto-hero-layout{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:30px;align-items:center;max-width:1600px;margin:auto}
        .auto-hero-visual{justify-self:end;width:100%;max-width:690px;overflow:hidden;border-radius:18px;border:1px solid rgba(255,255,255,.28);box-shadow:0 12px 30px rgba(0,0,0,.3)}
        .auto-hero-visual img{display:block;width:100%;height:auto;object-fit:contain}
        .auto-intro h1{font-size:clamp(32px,4vw,58px);margin:0 0 18px}
        .auto-intro p{font-size:20px;max-width:670px;line-height:1.5}
        .auto-list{max-width:1480px;padding:32px 24px 70px;margin:auto}
        .auto-list h2{font-size:clamp(25px,3vw,38px);border-left:7px solid #ffd00b;padding-left:16px}
        .auto-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:20px}
        .auto-tile{color:#fff;text-decoration:none;border:2px solid #62b2e8;background:#061e53;border-radius:20px;overflow:hidden;transition:transform .15s,border-color .15s}
        .auto-tile:hover,.auto-tile:focus-visible{transform:translateY(-3px);border-color:#ffd00b}
        .auto-tile img{height:185px;width:100%;object-fit:cover;display:block}
        .auto-tile .details{padding:18px}
        .auto-tile h3{font-size:23px;margin:0 0 10px}
        .auto-tile p{color:#d8e4fa;line-height:1.45;min-height:58px;margin:0 0 14px}
        .auto-tile strong{color:#ffda21}
.auto-tagline{display:inline-block;color:#ffce00;font-weight:900;letter-spacing:.08em;text-transform:uppercase;margin-bottom:10px}
        .auto-actions{display:flex;flex-wrap:wrap;align-items:center;gap:16px;margin-top:22px}
        .auto-cta{display:inline-block;background:#ffcf06;color:#081c41;font-size:18px;font-weight:900;padding:16px 24px;border-radius:45px;text-decoration:none;box-shadow:0 5px 15px #0005}
        .auto-info{color:#e7efff;font-weight:700}
        .auto-quick{margin-top:20px;display:flex;flex-wrap:wrap;gap:12px}
        .auto-quick a{padding:10px 16px;border:1px solid #92c9f8;border-radius:25px;color:#fff;text-decoration:none;font-weight:700}
        @media(max-width:850px){.auto-hero-layout{grid-template-columns:1fr}.auto-hero-visual{justify-self:center;max-width:100%}}
        @media(max-width:1200px){.auto-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
        @media(max-width:720px){.auto-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.auto-tile img{height:135px}.auto-tile h3{font-size:18px}}
        @media(max-width:440px){.auto-grid{grid-template-columns:1fr}.auto-tile img{height:175px}}
      `}</style>
      <nav className="auto-nav" aria-label="Rubriques principales">
        {navigation.map(([name,href])=><a key={href} href={href} className={href==="/automobile"?"active":""}>{name}</a>)}
      </nav>
      <section className="auto-intro">
        <div className="auto-hero-layout">
          <div className="auto-hero-copy">
            <span className="auto-tagline">TOUT ICI MARKET · Annonces gratuites</span><h1>Automobile &amp; Véhicules</h1>
            <p>Voitures, motos, utilitaires, camping-cars et bien plus. Toutes les catégories en un seul endroit, pour acheter ou vendre facilement.</p>
            <div className="auto-actions"><a className="auto-cta" href="/automobile/deposer">＋ Déposer une annonce</a><span className="auto-info">✓ Gratuit &nbsp; ✓ Simple &nbsp; ✓ Particuliers et professionnels</span></div>
          </div>
          <div className="auto-hero-visual"><img src="/banniere-automobile-apercu.svg" alt="Automobile — voitures neuves et d’occasion, vendre, acheter, échanger" /></div>
        </div>
      </section>
      <section className="auto-list">
        <h2>Que recherchez-vous ?</h2><p style={{fontSize:18,color:"#dce9ff",marginBottom:24}}>Sélectionnez une catégorie pour afficher ses annonces et ses filtres.</p>
        <div className="auto-grid">
          {sections.map(s=><a className="auto-tile" key={s.slug} href={`/automobile/${s.slug}`}>
            <img src={s.image} alt="" loading="lazy" />
            <div className="details"><h3>{s.icon} {s.name}</h3><p>{s.description}</p><strong>Voir les annonces →</strong></div>
          </a>)}
        </div>
        <div className="auto-quick"><a href="/automobile/voitures">Rechercher une voiture →</a><a href="/automobile/motos">Rechercher une moto →</a><a href="/automobile/deposer">Vendre mon véhicule →</a></div>
      </section>
    </main>
  );
}
