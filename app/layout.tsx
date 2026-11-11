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
            height: "76px",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            background: "#ffffff",
            boxSizing: "border-box",
          }}
        >
          <a href="/" aria-label="Accueil TOUT ICI MARKET">
            <img
            src="/573d5360-613f-4829-a940-affaa4dcfd7e.png"
              alt="TOUT ICI MARKET"
              style={{
                width: "105px",
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
