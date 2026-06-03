export default function Home() {
  const categories = [
    "🚗 Automobile",
    "🏠 Immobilier",
    "💼 Emploi",
    "🛠️ Services",
    "📱 Téléphones",
    "🏡 Maison & Jardin",
    "🎮 Jeux & Consoles",
    "✈️ Vacances & Loisirs",
  ];

  return (
    <main style={{ fontFamily: "Arial, sans-serif", background: "#f8f9fb" }}>
      {/* HEADER */}
      <header
        style={{
          background: "white",
          padding: "20px 40px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ color: "#0347B8", margin: 0 }}>
          TOUT ICI <span style={{ color: "#F6B900" }}>Market</span>
        </h1>

        <button
          style={{
            background: "#0347B8",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "12px 20px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Déposer une annonce
        </button>
      </header>

      {/* HERO */}
      <section
        style={{
          textAlign: "center",
          padding: "60px 20px",
          background: "white",
        }}
      >
        <h2 style={{ fontSize: "42px", marginBottom: "10px" }}>
          Tout acheter, tout vendre, tout trouver ici.
        </h2>

        <p style={{ color: "#666", fontSize: "20px" }}>
          Automobile, immobilier, emploi, services et loisirs.
        </p>

        <div style={{ marginTop: "30px" }}>
          <input
            type="text"
            placeholder="Que recherchez-vous ?"
            style={{
              width: "60%",
              maxWidth: "700px",
              padding: "18px",
              borderRadius: "12px",
              border: "1px solid #ccc",
              fontSize: "18px",
            }}
          />
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: "50px 40px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
          Catégories populaires
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {categories.map((cat) => (
            <div
              key={cat}
              style={{
                background: "white",
                padding: "30px",
                borderRadius: "15px",
                textAlign: "center",
                fontSize: "20px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                cursor: "pointer",
              }}
            >
              {cat}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
