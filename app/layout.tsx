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
            height: "72px",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            background: "#ffffff",
            boxSizing: "border-box",
          }}
        >
          <a
            href="/"
            aria-label="Accueil TOUT ICI MARKET"
            style={{
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <img
              src="/toutici market.png"
              alt="TOUT ICI MARKET"
              style={{
                width: "150px",
                maxHeight: "58px",
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
