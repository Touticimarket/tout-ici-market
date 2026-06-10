export default function AutomobilePage() {
  const voitures = [
    ["Audi A3 Sportback", "14 500 €", "2020 · Diesel · 78 000 km · Automatique", "Lyon", "Audi"],
    ["BMW Série 3 M Sport", "24 900 €", "2019 · Essence · 92 000 km · Automatique", "Strasbourg", "BMW"],
    ["Peugeot 3008 GT", "21 500 €", "2021 · Hybride · 64 000 km · Automatique", "Mulhouse", "Peugeot"],
    ["Renault Captur Intens", "16 900 €", "2020 · Essence · 51 000 km · Manuelle", "Colmar", "Renault"],
  ];

  return (
    <main style={{ fontFamily: "Arial, sans-serif", background: "#f8f9fb", minHeight: "100vh" }}>
      <header style={{ background: "white", padding: "18px 5%", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ color: "#0047BB", fontSize: 34, fontWeight: 900 }}>
            TOUT <span style={{ color: "#F6B900" }}>ICI</span>
          </div>
          <div style={{ color: "#F6B900", letterSpacing: 6, fontSize: 12, fontWeight: 700 }}>MARKET</div>
        </a>
        <a href="/" style={{ color: "#0047BB", fontWeight: "bold", textDecoration: "none" }}>
          ← Retour accueil
        </a>
      </header>

      <section style={{ width: "92%", margin: "30px auto", borderRadius: 30, overflow: "hidden", background: "linear-gradient(135deg,#003D99,#0b5be0)", color: "white", padding: "55px 5%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 30, alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 58, margin: 0 }}>🚗 Automobile</h1>
            <p style={{ fontSize: 22, lineHeight: 1.5 }}>
              Trouvez votre voiture neuve, d’occasion, électrique, hybride ou utilitaire.
            </p>
            <button style={{ ...buttonStyle, background: "#F6B900", color: "#111" }}>
              Déposer une annonce auto
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, fontSize: 46 }}>
            {["🚗", "🚙", "🚘", "🚐", "🏎️", "⚡"].map((icon) => (
              <div key={icon} style={{ background: "rgba(255,255,255,0.16)", borderRadius: 22, padding: 22, textAlign: "center" }}>
                {icon}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ width: "92%", margin: "30px auto", display: "grid", gridTemplateColumns: "310px 1fr", gap: 28 }}>
        <aside style={{ background: "white", borderRadius: 24, padding: 24, boxShadow: "0 10px 30px rgba(0,0,0,0.08)", height: "fit-content" }}>
          <h2 style={{ marginTop: 0, color: "#0047BB" }}>Filtres</h2>

          <label style={labelStyle}>Marque</label>
          <select style={inputStyle}>
            <option>Toutes</option>
            <option>Audi</option>
            <option>BMW</option>
            <option>Mercedes</option>
            <option>Peugeot</option>
            <option>Renault</option>
            <option>Tesla</option>
            <option>Cupra</option>
            <option>Toyota</option>
            <option>MG</option>
          </select>

          <label style={labelStyle}>Modèle</label>
          <input placeholder="Ex : 3008, Série 3..." style={inputStyle} />

          <label style={labelStyle}>Année</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input placeholder="Min" style={inputStyle} />
            <input placeholder="Max" style={inputStyle} />
          </div>

          <label style={labelStyle}>Kilométrage</label>
          <input placeholder="Km maximum" style={inputStyle} />

          <label style={labelStyle}>Prix</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input placeholder="Min" style={inputStyle} />
            <input placeholder="Max" style={inputStyle} />
          </div>

          <label style={labelStyle}>Carburant</label>
          <select style={inputStyle}>
            <option>Tous</option>
            <option>Essence</option>
            <option>Diesel</option>
            <option>Hybride</option>
            <option>Hybride rechargeable</option>
            <option>Électrique</option>
          </select>

          <label style={labelStyle}>Boîte</label>
          <select style={inputStyle}>
            <option>Toutes</option>
            <option>Automatique</option>
            <option>Manuelle</option>
          </select>

          <label style={labelStyle}>Finition</label>
          <input placeholder="GT, M Sport, AMG..." style={inputStyle} />

          <label style={labelStyle}>Lieu</label>
          <input placeholder="Ville ou code postal" style={inputStyle} />

          <button style={{ ...buttonStyle, width: "100%", marginTop: 18 }}>
            Rechercher
          </button>
        </aside>

        <section>
          <div style={{ background: "#FFF6DD", border: "1px solid #F6E4A7", borderRadius: 24, padding: 24, marginBottom: 24 }}>
            <h2 style={{ marginTop: 0 }}>Professionnels automobile</h2>
            <p>Garagistes, marchands VO et concessions : créez votre vitrine garage et publiez votre stock.</p>
            <strong>Vitrine dès 9,90 € HT/mois · Packs véhicules dès 3,50 € HT/annonce</strong>
          </div>

          <h2 style={{ fontSize: 32 }}>Annonces automobiles</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 22 }}>
            {voitures.map(([titre, prix, infos, ville, marque]) => (
              <article key={titre} style={{ background: "white", borderRadius: 22, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
                <div style={{ height: 170, background: "#eef2f8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 58 }}>
                  🚗
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ color: "#0047BB", fontSize: 28, fontWeight: 900 }}>{prix}</div>
                  <h3 style={{ margin: "8px 0" }}>{titre}</h3>
                  <p style={{ color: "#555" }}>{infos}</p>
                  <p style={{ fontWeight: 700 }}>📍 {ville}</p>
                  <span style={{ background: "#FFF6DD", padding: "6px 10px", borderRadius: 20, fontWeight: 700 }}>
                    {marque}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "13px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  fontSize: "14px",
  background: "white",
};

const labelStyle = {
  display: "block",
  marginTop: "16px",
  marginBottom: "6px",
  fontWeight: 700,
  color: "#333",
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
