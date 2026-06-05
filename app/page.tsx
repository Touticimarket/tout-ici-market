export default function Home() {
 const links = [
  { href: "/automobile", left: "4.5%", top: "42.8%", width: "16%" },
  { href: "/moto", left: "21.2%", top: "42.8%", width: "16%" },
  { href: "/immobilier", left: "38%", top: "42.8%", width: "16%" },
  { href: "/emploi", left: "54.7%", top: "42.8%", width: "16%" },
  { href: "/mode", left: "71.5%", top: "42.8%", width: "20%" },

  { href: "/telephones", left: "4.5%", top: "48.7%", width: "15%" },
  { href: "/maison-jardin", left: "20.7%", top: "48.7%", width: "15%" },
  { href: "/vacances-loisirs", left: "36.7%", top: "48.7%", width: "16%" },
  { href: "/bricolage", left: "53.2%", top: "48.7%", width: "13%" },
  { href: "/jeux-consoles", left: "66.8%", top: "48.7%", width: "14%" },
  { href: "/autres", left: "81.2%", top: "48.7%", width: "14%" },
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
