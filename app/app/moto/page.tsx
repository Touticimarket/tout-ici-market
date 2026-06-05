export default function ImmobilierPage() {
  return (
    <main
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        background: "#f8f9fb",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "#0047BB", fontSize: "48px" }}>
        🏠 Immobilier
      </h1>

      <p style={{ fontSize: "22px", color: "#555" }}>
        Maisons, appartements, terrains, locations, locaux professionnels et biens à vendre.
      </p>

      <div
        style={{
          marginTop: "40px",
          background: "#FFF6DD",
          padding: "30px",
          borderRadius: "20px",
          border: "1px solid #F6E4A7",
        }}
      >
        <h2>À venir 🚀</h2>
        <p>
          Estimation DVF, prix bas/moyen/haut, biens vendus à proximité,
          agences immobilières et dépôt d’annonce immobilier.
        </p>
      </div>
    </main>
  );
}
