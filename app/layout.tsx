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
            padding: "0 24px",
            background: "#ffffff",
            boxSizing: "border-box",
          }}
        >
          <a href="/" aria-label="Accueil TOUT ICI MARKET">
            <img
            src="/toutici market.png"
              alt="TOUT ICI MARKET"
              style={{
                width: "375px",
                height: "auto",
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
