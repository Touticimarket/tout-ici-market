import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0 }}>
        <header style={{
          width: "100%",
          minHeight: 100,
          boxSizing: "border-box",
          background: "#030c46",
          display: "flex",
          alignItems: "center",
          padding: "12px clamp(16px, 3vw, 42px)",
          position: "relative",
          zIndex: 20,
        }}>
          <a href="/" aria-label="Accueil TOUT ICI MARKET" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "clamp(195px, 23vw, 265px)",
            maxWidth: "100%",
            minHeight: 72,
            flexShrink: 0,
            overflow: "hidden",
            textDecoration: "none",
          }}>
            <img
              src="/tout-ici-market-officiel.svg"
              alt="TOUT ICI MARKET"
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                maxHeight: 110,
                objectFit: "contain",
                objectPosition: "center",
              }}
            />
          </a>
        </header>
        {children}
      </body>
    </html>
  );
}
