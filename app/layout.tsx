import type { ReactNode } from "react";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="fr">
      <body style={{ margin: 0 }}>
        <header
          style={{
            width: "100%",
            minHeight: "94px",
            boxSizing: "border-box",
            backgroundColor: "#0047BB",
            display: "flex",
            alignItems: "center",
            padding: "8px clamp(14px, 3vw, 40px)",
            position: "relative",
            zIndex: 20,
          }}
        >
          <a
            href="/"
            aria-label="Accueil TOUT ICI MARKET"
            style={{
              display: "inline-flex",
              alignItems: "center",
              textDecoration: "none",
              maxWidth: "100%",
            }}
          >
            <img
              src="/toutici market.png"
              alt="TOUT ICI MARKET"
              style={{
                width: "230px",
                maxWidth: "min(230px, 72vw)",
                maxHeight: "80px",
                height: "auto",
                objectFit: "contain",
                display: "block",
              }}
            />
          </a>
        </header>
        {children}
      </body>
    </html>
  );
}
