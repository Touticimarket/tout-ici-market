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
        .auto-intro{padding:42px clamp(20px,4vw,65px);background:linear-gradient(90deg,rgba(0,18,57,.97),rgba(0,28,67,.72)),url("https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2000&q=85") center/cover}
        .auto-intro h1{font-size:clamp(32px,4vw,58px);margin:0 0 12px}
        .auto-intro p{font-size:20px;max-width:670px;line-height:1.5}
        .auto-list{max-width:1480px;padding:32px 24px 70px;margin:auto}
        .auto-list h2{font-size:clamp(25px,3vw,38px);border-left:7px solid #ffd00b;padding-left:16px}
        .auto-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px}
        .auto-tile{color:#fff;text-decoration:none;border:2px solid #62b2e8;background:#061e53;border-radius:20px;overflow:hidden;transition:transform .15s,border-color .15s}
        .auto-tile:hover,.auto-tile:focus-visible{transform:translateY(-3px);border-color:#ffd00b}
        .auto-tile img{height:180px;width:100%;object-fit:cover;display:block}
        .auto-tile .details{padding:18px}
        .auto-tile h3{font-size:23px;margin:0 0 10px}
        .auto-tile p{color:#d8e4fa;line-height:1.45;min-height:42px;margin:0 0 14px}
        .auto-tile strong{color:#ffda21}
      `}</style>
      <nav className="auto-nav" aria-label="Rubriques principales">
        {navigation.map(([name,href])=><a key={href} href={href} className={href==="/automobile"?"active":""}>{name}</a>)}
      </nav>
      <section className="auto-intro">
        <h1>Automobile &amp; Véhicules</h1>
        <p>Voitures, motos, utilitaires, camping-cars et bien plus. Choisissez d’abord le type de véhicule que vous recherchez.</p>
      </section>
      <section className="auto-list">
        <h2>Choisissez une catégorie</h2>
        <div className="auto-grid">
          {sections.map(s=><a className="auto-tile" key={s.slug} href={`/automobile/${s.slug}`}>
            <img src={s.image} alt="" loading="lazy" />
            <div className="details"><h3>{s.icon} {s.name}</h3><p>{s.description}</p><strong>Voir les annonces →</strong></div>
          </a>)}
        </div>
        <p style={{marginTop:36}}>Vous souhaitez vendre un véhicule ? <a href="/automobile/deposer" style={{color:"#ffd00b",fontWeight:800}}>Déposer une annonce automobile →</a></p>
      </section>
    </main>
  );
}
