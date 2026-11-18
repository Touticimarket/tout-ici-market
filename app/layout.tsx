import SuiviNavigation from "./components/SuiviNavigation";
import BoutonRetour from "./components/BoutonRetour";
import type { ReactNode } from "react";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="fr">
      <body style={{ margin: 0 }}>
        <style>{`
          .ti-brand-link{position:absolute;top:8px;left:16px;width:195px;height:58px;display:flex;align-items:center;text-decoration:none;z-index:30}
          .ti-brand-link img{display:block;width:100%;height:100%;object-fit:contain;object-position:left center}
          @media(max-width:1100px){.ti-brand-link{width:180px;height:55px}}
          @media(max-width:650px){.ti-brand-link{top:7px;left:12px;width:165px;height:57px}}
          @media(max-width:390px){.ti-brand-link{width:148px;height:52px}}
        `}</style>
        <header style={{height:0,position:"relative",zIndex:20}}>
          <a href="/" className="ti-brand-link" aria-label="Accueil TOUT ICI MARKET">
            <img src="/toutici market.png" alt="TOUT ICI MARKET"/>
          </a>
        </header>
        {children}
        <BoutonRetour />
        <SuiviNavigation />
      </body>
    </html>
  );
}
