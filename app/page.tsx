export default function Home() {
  const categories = [
    "🚗 Automobile",
    "🏍️ Moto",
    "🏠 Immobilier",
    "💼 Emploi",
    "👕 Mode",
    "📱 Téléphones",
    "🛋️ Maison & Jardin",
    "🌴 Vacances & Loisirs",
    "🛠️ Bricolage",
    "🎮 Jeux & Consoles",
    "➕ Autres catégories",
  ];

  const annonces = [
    {
      titre: "Audi A3 Sportback",
      prix: "14 500 €",
      image:
        "https://images.unsplash.com/photo-1544636331-e26879cd4d9c?q=80&w=1200&auto=format&fit=crop",
    },
    {
      titre: "Appartement T3",
      prix: "235 000 €",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
    },
    {
      titre: "iPhone 13",
      prix: "650 €",
      image:
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1200&auto=format&fit=crop",
    },
    {
      titre: "Canapé design",
      prix: "450 €",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  return (
    <main
      style={{
        fontFamily: "Arial, sans-serif",
        background: "#f8f9fb",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          background: "#fff",
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #eee",
        }}
      >
        <div>
          <h1
            style={{
              color: "#0047BB",
              fontSize: "46px",
              margin: 0,
              fontWeight: "bold",
            }}
          >
            TOUT <span style={{ color: "#F6B900" }}>ICI</span>
          </h1>

          <div
            style={{
              color: "#F6B900",
              letterSpacing: "6px",
              fontWeight: "bold",
            }}
          >
            MARKET
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <button
            style={{
              background: "#F6B900",
              border: "none",
              padding: "14px 22px",
              borderRadius: "12px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            + Déposer une annonce
          </button>

          <button
            style={{
              background: "transparent",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Connexion
          </button>

          <button
            style={{
              background: "transparent",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Espace pro
          </button>
        </div>
      </header>

      {/* BANNIÈRE */}
      <section
        style={{
          margin: "30px auto",
          width: "92%",
          borderRadius: "30px",
          overflow: "hidden",
          position: "relative",
          height: "500px",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(255,255,255,0.75), rgba(255,255,255,0.35))",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "80px",
            maxWidth: "900px",
          }}
        >
          <h2
            style={{
              fontSize: "64px",
              color: "#003D99",
              lineHeight: 1.1,
              marginBottom: "20px",
            }}
          >
            Tout acheter, tout vendre,
            <br />
            tout trouver{" "}
            <span style={{ color: "#F6B900" }}>tout ici</span>
          </h2>

          <p style={{ fontSize: "22px", color: "#333" }}>
            La plateforme simple, rapide et sécurisée pour tous.
          </p>

          {/* BARRE RECHERCHE */}
          <div
            style={{
              marginTop: "40px",
              background: "#fff",
              padding: "18px",
              borderRadius: "22px",
              display: "flex",
              gap: "14px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            }}
          >
            <input
              placeholder="Que recherchez-vous ?"
              style={{
                flex: 1,
                padding: "18px",
                borderRadius: "14px",
                border: "1px solid #ddd",
              }}
            />

            <input
              placeholder="Ville, code postal..."
              style={{
                flex: 1,
                padding: "18px",
                borderRadius: "14px",
                border: "1px solid #ddd",
              }}
            />

            <button
              style={{
                background: "#0047BB",
                color: "#fff",
                border: "none",
                padding: "18px 40px",
                borderRadius: "14px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Rechercher
            </button>
          </div>
        </div>
      </section>

      {/* CATÉGORIES */}
      <section style={{ width: "92%", margin: "auto" }}>
        <h2 style={{ fontSize: "34px" }}>Toutes les catégories</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: "18px",
            marginTop: "25px",
          }}
        >
          {categories.map((cat) => (
            <div
              key={cat}
              style={{
                background: "#FFF6DD",
                borderRadius: "20px",
                padding: "26px",
                textAlign: "center",
                border: "1px solid #F6E4A7",
                fontWeight: "bold",
              }}
            >
              {cat}
            </div>
          ))}
        </div>
      </section>

      {/* ANNONCES */}
      <section style={{ width: "92%", margin: "60px auto" }}>
        <h2 style={{ fontSize: "34px" }}>Annonces populaires</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: "24px",
            marginTop: "30px",
          }}
        >
          {annonces.map((annonce) => (
            <div
              key={annonce.titre}
              style={{
                background: "#fff",
                borderRadius: "22px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
            >
              <img
                src={annonce.image}
                alt={annonce.titre}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: "20px" }}>
                <div
                  style={{
                    fontSize: "28px",
                    color: "#0047BB",
                    fontWeight: "bold",
                  }}
                >
                  {annonce.prix}
                </div>

                <div style={{ marginTop: "8px", fontSize: "18px" }}>
                  {annonce.titre}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
