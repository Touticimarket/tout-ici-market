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
            position: "relative",
            zIndex: 20,
            height: 0,
          }}
        >
          <a
            href="/"
            aria-label="Accueil TOUT ICI MARKET"
            style={{
              position: "absolute",
              top: "0px",
              left: "16px",
              width: "375px",
              height: "76px",
              display: "flex",
              alignItems: "center",
              overflow: "visible",
            }}
          >
            <img
              src="/toutici market.png"
              alt="TOUT ICI MARKET"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "contain",
              }}
            />
          </a>
        </header>
        {children}
      </body>
    </html>
  );
}
