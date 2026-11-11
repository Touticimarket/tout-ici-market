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
            background: "#ffffff",
            padding: "10px 24px",
            display: "flex",
            alignItems: "center",
            minHeight: "76px",
          }}
        >
          <a href="/" aria-label="Accueil TOUT ICI MARKET">
            <img
              src="/public/573d5360-613f-4829-a940-affaa4dcfd7e.png"
              alt="TOUT ICI MARKET"
              style={{
                width: "145px",
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
