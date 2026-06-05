export default function AutomobilePage() {
  const voitures = [
    ["Audi A3 Sportback", "14 500 €", "2020 · Diesel · 78 000 km", "Lyon (69000)", "https://images.unsplash.com/photo-1544636331-e26879cd4d9c?q=80&w=900&auto=format&fit=crop"],
    ["BMW Série 3 M Sport", "24 900 €", "2019 · Essence · 92 000 km", "Strasbourg (67000)", "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=900&auto=format&fit=crop"],
    ["Peugeot 3008 GT", "21 500 €", "2021 · Hybride · 64 000 km", "Mulhouse (68100)", "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=900&auto=format&fit=crop"],
  ];

  return (
    <main style={{ fontFamily: "Arial, sans-serif", background: "#f8f9fb", minHeight: "100vh" }}>
      <header style={{ background: "#fff", padding: "18px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee" }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ color: "#0047BB", fontSize: 34, fontWeight: 900 }}>
            TOUT <span style={{ color: "#F6B900" }}>ICI</span>
          </div>
          <div style={{ color: "#F6B900", letterSpacing: 6, fontSize: 12, fontWeight: 700 }}>MARKET</div>
        </a>
        <a href="/" style={{ color: "#0047BB", fontWeight: "bold", textDecoration: "none" }}>← Retour accueil</a>
      </header>

      <section style={{ padding: "45px 5%" }}>
        <h1 style={{ color: "#0047BB", fontSize: 56, margin: 0 }}>🚗 Automobile</h1>
        <p style={{ fontSize: 22, color: "#555" }}>Voitures, utilitaires, véhicules électriques, garages et professionnels auto.</p>

        <div style={{ marginTop: 28, background: "#FFF6DD", padding: 22, borderRadius: 24, display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto", gap: 12 }}>
          <input placeholder="Marque, modèle..." style={inputStyle} />
          <input placeholder="Ville" style={inputStyle} />
          <select style={inputStyle}><option>Carburant</option><option>Essence</option><option>Diesel</option><option>Hybride</option><option>Électrique</option></select>
          <select style={inputStyle}><option>Boîte</option><option>Automatique</option><option>Manuelle</option></select>
          <input placeholder="Prix max" style={inputStyle} />
          <button style={buttonStyle}>Rechercher</button>
        </div>
      </section>

      <section style={{ width: "92%", margin: "0 auto 40px" }}>
        <div style={{ background: "#0047BB", color: "white", borderRadius: 26, padding: 34, marginBottom: 34 }}>
          <h2 style={{ fontSize: 34, margin: 0 }}>Espace professionnels automobile</h2>
          <p style={{ fontSize: 18 }}>Garagistes, marchands VO, concessions : publiez vos véhicules et créez votre vitrine garage.</p>
          <button style={{ ...buttonStyle, background: "#F6B900", color: "#111" }}>Découvrir les offres pro</button>
        </div>

        <h2 style={{ fontSize: 34 }}>Annonces automobiles populaires</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
          {voitures.map(([titre, prix, infos, ville, image]) => (
            <article key={titre} style={{ background: "#fff", borderRadius: 22, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
              <img src={image} alt={titre} style={{ width: "100%", height: 190, objectFit: "cover" }} />
              <div style={{ padding: 20 }}>
                <div style={{ color: "#0047BB", fontSize: 28, fontWeight: 900 }}>{prix}</div>
                <h3 style={{ margin: "8px 0" }}>{titre}</h3>
                <p style={{ color: "#555" }}>{infos}</p>
                <p style={{ fontWeight: 700 }}>📍 {ville}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

const inputStyle = {
  padding: "15px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  fontSize: "15px",
  background: "white",
};

const buttonStyle = {
  background: "#0047BB",
  color: "white",
  border: "none",
  borderRadius: "14px",
  padding: "15px 24px",
  fontWeight: "bold",
  cursor: "pointer",
};
