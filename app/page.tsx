export default function Home() {
  return (
    <main style={{ position: "relative" }}>
      <img
        src="/public/banner-home.png"
        alt="TOUT ICI Market"
        style={{
          width: "100%",
          display: "block",
        }}
      />

      <a
        href="/automobile"
        title="Automobile"
        style={{
          position: "absolute",
          left: "4%",
          top: "41%",
          width: "17%",
          height: "8%",
          display: "block",
        }}
      />

      <a
        href="/moto"
        title="Moto"
        style={{
          position: "absolute",
          left: "22%",
          top: "41%",
          width: "17%",
          height: "8%",
          display: "block",
        }}
      />

      <a
        href="/immobilier"
        title="Immobilier"
        style={{
          position: "absolute",
          left: "40%",
          top: "41%",
          width: "17%",
          height: "8%",
          display: "block",
        }}
      />
    </main>
  );
}
