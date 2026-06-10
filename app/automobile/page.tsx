export default function AutomobilePage() {
  const marques = [
    "Peugeot", "Renault", "Citroën", "Volkswagen",
    "Audi", "BMW", "Mercedes", "Cupra",
    "Tesla", "Toyota", "Hyundai", "MG"
  ];

  return (
    <main style={{ fontFamily: "Arial, sans-serif", background: "#f8f9fb", minHeight: "100vh" }}>
      <header style={{ background: "white", padding: "22px 5%", borderBottom: "1px solid #eee" }}>
        <a href="/" style={{ textDecoration: "none", color: "#0047BB", fontWeight: "bold" }}>
          ← Retour accueil
        </a>
      </header>

      <section style={{ background: "linear-gradient(135deg,#0047BB,#082b66)", color: "white", padding: "60px 5%" }}>
        <h1 style={{ fontSize: "58px", margin: 0 }}>🚗 Automobile</h1>
        <p style={{ fontSize: "22px", maxWidth: "800px" }}>
          Trouvez votre voiture neuve, d’occasion, électrique, hybride ou utilitaire sur TOUT ICI Market.
        </p>

        <div style={{ marginTop: "30px", background: "white", padding: "18px", borderRadius: "22px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: "12px" }}>
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
        <h2 style={{ fontSize: "34px" }}>Marques populaires</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "16px" }}>
          {marques.map((marque) => (
            <div key={marque} style={{
              background: "#FFF6DD",
              border: "1px solid #F6E4A7",
              borderRadius: "18px",
              padding: "22px",
              textAlign: "center",
              fontWeight: "bold"
            }}>
              🚘 {marque}
            </div>
          ))}
        </div>

        <div style={{ marginTop: "45px", background: "white", borderRadius: "26px", padding: "34px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
          <h2 style={{ color: "#0047BB", fontSize: "34px", marginTop: 0 }}>
            Professionnels automobile
          </h2>
          <p style={{ fontSize: "18px", color: "#555" }}>
            Garagistes, marchands VO et concessions : publiez vos véhicules et créez votre vitrine garage.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "20px", marginTop: "25px" }}>
            <div style={packStyle}><h3>Vitrine Standard</h3><strong>9,90 € HT/mois</strong></div>
            <div style={packStyle}><h3>Vitrine Premium</h3><strong>19,90 € HT/mois</strong></div>
            <div style={packStyle}><h3>Vitrine Elite</h3><strong>29,90 € HT/mois</strong></div>
          </div>
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
  background: "#F6B900",
  color: "#111",
  border: "none",
  borderRadius: "14px",
  padding: "15px 24px",
  fontWeight: "bold",
  cursor: "pointer",
};

const packStyle = {
  background: "#FFF6DD",
  borderRadius: "20px",
  padding: "24px",
  border: "1px solid #F6E4A7",
};
