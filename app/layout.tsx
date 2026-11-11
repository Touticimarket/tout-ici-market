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
            height: "0px",
            position: "relative",
            zIndex: 20,
          }}
        >
          <a
            href="/"
            aria-label="Accueil TOUT ICI MARKET"
            style={{
              position: "absolute",
              top: "56px",
              left: "16px",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              zIndex: 20,
            }}
          >
            <img
              src="/toutici market.png"
              alt="TOUT ICI MARKET"
              style={{
                width: "230px",
                maxHeight: "85px",
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
