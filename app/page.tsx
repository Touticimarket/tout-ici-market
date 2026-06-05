export default function Home() {
  const links = [
    { href: "/automobile", left: "3.3%", top: "44.1%", width: "18.7%" },
    { href: "/moto", left: "22.4%", top: "44.1%", width: "16.8%" },
    { href: "/immobilier", left: "39.6%", top: "44.1%", width: "17%" },
    { href: "/emploi", left: "56.8%", top: "44.1%", width: "18.1%" },
    { href: "/mode", left: "75.3%", top: "44.1%", width: "19.4%" },

    { href: "/telephones", left: "3.3%", top: "50.2%", width: "17.4%" },
    { href: "/maison-jardin", left: "21.1%", top: "50.2%", width: "15.4%" },
    { href: "/vacances-loisirs", left: "36.8%", top: "50.2%", width: "16.6%" },
    { href: "/bricolage", left: "53.8%", top: "50.2%", width: "12%" },
    { href: "/jeux-consoles", left: "66.1%", top: "50.2%", width: "14%" },
    { href: "/autres", left: "80.3%", top: "50.2%", width: "14.4%" },
  ];

  return (
    <main style={{ position: "relative", width: "100%" }}>
      <img
        src="/public/banner-home.png"
        alt="TOUT ICI Market"
        style={{ width: "100%", display: "block" }}
      />

      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          style={{
            position: "absolute",
            left: link.left,
            top: link.top,
            width: link.width,
            height: "5.5%",
            zIndex: 10,
            cursor: "pointer",
          }}
        />
      ))}
    </main>
  );
}
