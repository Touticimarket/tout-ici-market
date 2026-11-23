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

          /* Identité globale validée : bleu nuit et logo original, sans retoucher les visuels des pages. */
          .ti-brand-bar{position:absolute;inset:0 0 auto;height:92px;background:#02044b;pointer-events:none}
          .ti-brand-link{top:4px;left:10px;width:238px;height:80px;z-index:35;pointer-events:auto;background:transparent}
          .ti-brand-link img{width:100%;height:100%;object-fit:contain;object-position:left center}
          /* Les trois pages avec une barre d'actions existante gardent leur barre,
             désormais bleu nuit, afin de ne masquer aucun bouton ou champ de recherche. */
          body:has(.ti-home) .ti-brand-bar,
          body:has(.market-vehicles) .ti-brand-bar,
          body:has(.vh-root) .ti-brand-bar{display:none}
          body:has(.ti-home) .ti-home-toolbar,
          body:has(.market-vehicles) .mv-header,
          body:has(.vh-root) .vh-top{background:#02044b!important;color:white!important;border-bottom-color:#243e78!important}
          body:has(.ti-home) .ti-home-account a:not(.ti-home-sell){color:#fff!important}
          body:has(.ti-home) .ti-home-account .ti-home-signup{background:#18265c!important;border-color:#42548d!important}
          body:has(.market-vehicles) .mv-header{padding-left:254px!important}
          body:has(.market-vehicles) .mv-actions a:not(.mv-primary),
          body:has(.vh-root) .vh-top-actions a:not(.vh-top-cta){color:#fff!important}
          body:has(.vh-root) .ti-brand-link{top:4px!important;left:10px!important;width:238px!important;height:80px!important;padding:0!important;background:transparent!important;border-radius:0!important;box-shadow:none!important}
          /* Les navigations du dépôt restent utilisables devant le bandeau bleu. */
          body:has(.depot-hub) .depot-nav,
          body:has(.rubrique-root) .rubrique-nav{position:relative;z-index:40;background:#02044b;color:white}
          body:has(.depot-hub) .depot-nav a,
          body:has(.rubrique-root) .rubrique-nav a{color:#fff!important}
          /* Les pages catégories très simples commençaient à 40px du haut. */
          body main:has(>h1){padding-top:112px!important}
          @media(max-width:940px){
            body:has(.market-vehicles) .mv-header{padding-left:14px!important}
          }
          @media(max-width:650px){
            .ti-brand-bar{height:76px}
            .ti-brand-link{top:6px!important;left:9px!important;width:182px!important;height:66px!important}
            body:has(.vh-root) .ti-brand-link{top:6px!important;left:9px!important;width:182px!important;height:66px!important}
          }
        `}</style>
        <header style={{height:0,position:"relative",zIndex:20}}>
          <div className="ti-brand-bar" aria-hidden="true"/>
          <a href="/" className="ti-brand-link" aria-label="Accueil TOUT ICI MARKET">
            <img src="/logo-tout-ici-market-premium.webp" alt="TOUT ICI MARKET" width={238} height={89}/>
          </a>
        </header>
        {children}
        <BoutonRetour />
        <SuiviNavigation />
      </body>
    </html>
  );
}
