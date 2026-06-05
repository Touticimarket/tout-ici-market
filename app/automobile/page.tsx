export default function AutomobilePage() {
  const voitures = [
    {
      titre: "Audi A3 Sportback",
      prix: "14 500 €",
      infos: "2020 · Diesel · 78 000 km",
      ville: "Colmar",
    },
    {
      titre: "BMW Série 3 M Sport",
      prix: "24 900 €",
      infos: "2019 · Essence · 92 000 km",
      ville: "Strasbourg",
    },
    {
      titre: "Peugeot 3008 GT",
      prix: "21 500 €",
      infos: "2021 · Hybride · 64 000 km",
      ville: "Mulhouse",
    },
  ];

  return (
    <main style={{ fontFamily: "Arial, sans-serif", background: "#f8f9fb", minHeight: "100vh" }}>
      <section style={{ background: "#fff", padding: "40px", borderBottom: "1px solid #eee" }}>
        <a href="/" style={{ color: "#0047BB", fontWeight: "bold", textDecoration: "none" }}>
          ← Retour accueil
        </a>

        <h1 style={{ color: "#0047BB", fontSize: "52px", marginBottom: "10px" }}>
          🚗 Automobile
        </h1>

        <p style={{ fontSize: "22px", color: "#555" }}>
          Voitures, utilitaires, véhicules électriques, garages et professionnels auto.
        </p>

        <div
          style={{
            marginTop: "30px",
            background: "#FFF6DD",
            padding: "20px",
            borderRadius: "20px",
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
            gap: "12px",
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
      </section>

      <section style={{ width: "92%", margin: "40px auto" }}>
        <div
          style={{
            background: "#0047BB",
            color: "white",
            borderRadius: "24px",
            padding: "30px",
            marginBottom: "35px",
          }}
        >
          <h2 style={{ fontSize: "32px", margin: 0 }}>Espace professionnels automobile</h2>
          <p style={{ fontSize: "18px" }}>
            Garagistes, marchands VO, concessions : publiez vos véhicules et créez votre vitrine garage.
          </p>
          <button style={{ ...buttonStyle, background: "#F6B900", color: "#111" }}>
            Découvrir les offres pro
          </button>
        </div>

        <h2 style={{ fontSize: "34px" }}>Annonces automobiles populaires</h2>

        <div
          style={{
            marginTop: "25px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: "24px",
          }}
        >
          {voitures.map((v) => (
            <div
              key={v.titre}
              style={{
                background: "white",
                borderRadius: "22px",
                padding: "24px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  height: "160px",
                  borderRadius: "18px",
                  background: "#eef2f8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "56px",
                }}
              >
                🚗
              </div>

              <h3 style={{ fontSize: "22px", marginBottom: "8px" }}>{v.titre}</h3>
              <div style={{ color: "#0047BB", fontSize: "28px", fontWeight: "bold" }}>
                {v.prix}
              </div>
              <p style={{ color: "#555" }}>{v.infos}</p>
              <p style={{ fontWeight: "bold" }}>📍 {v.ville}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

const inputStyle = {
  padding: "15px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  fontSize: "15px",
};

const buttonStyle = {
  background: "#0047BB",
  color: "white",
  border: "none",
  borderRadius: "12px",
  padding: "15px 22px",
  fontWeight: "bold",
  cursor: "pointer",
};
