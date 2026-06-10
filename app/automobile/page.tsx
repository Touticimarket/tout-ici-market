export default function AutomobilePage() {
  const voitures = [
    ["Audi A3 Sportback", "14 500 €", "2020 · Diesel · 78 000 km", "Lyon", "🚗"],
    ["BMW Série 3 M Sport", "24 900 €", "2019 · Essence · 92 000 km", "Strasbourg", "🚘"],
    ["Peugeot 3008 GT", "21 500 €", "2021 · Hybride · 64 000 km", "Mulhouse", "🚙"],
  ];

  return (
    <main style={{ fontFamily: "Arial, sans-serif", background: "#f8f9fb" }}>
      <section style={{ position: "relative" }}>
        <img
          src="/public/banner-home.png"
          alt="Automobile TOUT ICI Market"
          style={{ width: "100%", display: "block" }}
        />
      </section>

      <section style={{ width: "92%", margin: "40px auto" }}>
        <h1 style={{ color: "#0047BB", fontSize: 48 }}>🚗 Automobile</h1>

        <div
          style={{
            background: "#FFF6DD",
            padding: 24,
            borderRadius: 24,
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
            gap: 12,
          }}
        >
          <input placeholder="Marque, modèle..." style={inputStyle} />
          <input placeholder="Ville" style={inputStyle} />
          <select style={inputStyle}>
            <option>Carburant</option>
            <option>Essence</option>
            <option>Diesel</option>
            <option>Hybride</option>
            <option>Électrique</option>
          </select>
          <input placeholder="Prix max" style={inputStyle} />
          <button style={buttonStyle}>Rechercher</button>
        </div>

        <div
          style={{
            marginTop: 34,
            background: "#0047BB",
            color: "white",
            borderRadius: 26,
            padding: 34,
          }}
        >
          <h2 style={{ fontSize: 32, margin: 0 }}>Professionnels automobile</h2>
          <p>
            Garagistes, marchands VO et concessions : publiez vos véhicules et créez
            votre vitrine garage.
          </p>
          <button style={{ ...buttonStyle, background: "#F6B900", color: "#111" }}>
            Voir les offres garages
          </button>
        </div>

        <h2 style={{ fontSize: 34, marginTop: 40 }}>Annonces automobiles populaires</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 24,
          }}
        >
          {voitures.map(([titre, prix, infos, ville, emoji]) => (
            <article
              key={titre}
              style={{
                background: "white",
                borderRadius: 22,
                padding: 22,
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  height: 150,
                  background: "#eef2f8",
                  borderRadius: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 60,
                }}
              >
                {emoji}
              </div>
              <h3>{titre}</h3>
              <div style={{ color: "#0047BB", fontSize: 28, fontWeight: "bold" }}>
                {prix}
              </div>
              <p>{infos}</p>
              <strong>📍 {ville}</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

const inputStyle = {
  padding: 15,
  borderRadius: 14,
  border: "1px solid #ddd",
  fontSize: 15,
  background: "white",
};

const buttonStyle = {
  background: "#0047BB",
  color: "white",
  border: "none",
  borderRadius: 14,
  padding: "15px 24px",
  fontWeight: "bold",
  cursor: "pointer",
};
