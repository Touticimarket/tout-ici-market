export default function DeposerPage() {
  return (
    <main
      style={{
        padding: "40px",
        background: "#f7f8fb",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "white",
          borderRadius: "25px",
          padding: "40px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            color: "#0047BB",
            fontSize: "42px",
            marginBottom: "10px",
          }}
        >
          🚗 Déposer une annonce automobile
        </h1>

        <p
          style={{
            color: "#666",
            fontSize: "18px",
            marginBottom: "30px",
          }}
        >
          Déposez votre véhicule facilement sur TOUT ICI Market.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "18px",
          }}
        >
          <input placeholder="Marque" style={inputStyle} />
          <input placeholder="Modèle" style={inputStyle} />
          <input placeholder="Version / finition" style={inputStyle} />
          <input placeholder="Année" style={inputStyle} />
          <input placeholder="Kilométrage" style={inputStyle} />
          <input placeholder="Prix" style={inputStyle} />
          <input placeholder="Ville" style={inputStyle} />
          <select style={inputStyle}>
            <option>Carburant</option>
            <option>Essence</option>
            <option>Diesel</option>
            <option>Hybride</option>
            <option>Électrique</option>
          </select>
        </div>

        <textarea
          placeholder="Description du véhicule"
          style={{
            ...inputStyle,
            marginTop: "20px",
            minHeight: "150px",
          }}
        />

        <button
          style={{
            marginTop: "25px",
            background: "#0047BB",
            color: "white",
            border: "none",
            padding: "16px 28px",
            borderRadius: "14px",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Publier mon annonce
        </button>
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  fontSize: "15px",
  boxSizing: "border-box" as const,
};
