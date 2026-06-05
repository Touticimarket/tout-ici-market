export default function Home() {
  const links = [
    { href: "/automobile", left: "6%", top: "51%" },
    { href: "/moto", left: "21%", top: "51%" },
    { href: "/immobilier", left: "36%", top: "51%" },
    { href: "/emploi", left: "51%", top: "51%" },
    { href: "/telephones", left: "66%", top: "51%" },

    { href: "/maison-jardin", left: "6%", top: "61%" },
    { href: "/vacances-loisirs", left: "21%", top: "61%" },
    { href: "/bricolage", left: "36%", top: "61%" },
    { href: "/jeux-consoles", left: "51%", top: "61%" },
    { href: "/autres", left: "66%", top: "61%" },
  ];

  return (
    <main style={{ position: "relative", width: "100%" }}>
      <img
        src="/public/banner-home.png"
        alt="TOUT ICI Market"
        style={{
          width: "100%",
          display: "block",
        }}
      />

      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          style={{
            position: "absolute",
            left: link.left,
            top: link.top,
            width: "14%",
            height: "9%",
            zIndex: 10,
            cursor: "pointer",
          }}
        />
      ))}
    </main>
  );
}
