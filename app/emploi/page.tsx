export default function EmploiPage() {
  return (
    <main
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        background: "#f8f9fb",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          color: "#0047BB",
          fontSize: "48px",
          marginBottom: "10px",
        }}
      >
        💼 Emploi
      </h1>

      <p style={{ fontSize: "22px", color: "#555" }}>
        Retrouvez toutes les offres d’emploi sur TOUT ICI Market.
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
          Offres d’emploi, recrutement, intérim, CDI, CDD,
          vitrine entreprise et dépôt d’annonce emploi.
        </p>
      </div>
    </main>
  );
}
