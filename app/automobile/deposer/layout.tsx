import type {ReactNode} from "react";

/** Parcours de dépôt volontairement sans publicité, y compris les sous-pages. */
export default function DepotSansPublicite({children}:{children:ReactNode}){
 return <div className="tim-deposit-no-ads">
  <style>{`
   body:has(.tim-deposit-no-ads) .tim-ad-carousel,
   body:has(.tim-deposit-no-ads) .tim-shared-banner,
   body:has(.tim-deposit-no-ads) [data-ad-slot],
   body:has(.tim-deposit-no-ads) [data-advertisement],
   body:has(.tim-deposit-no-ads) ins.adsbygoogle,
   body:has(.tim-deposit-no-ads) iframe[src*="doubleclick.net"]{
    display:none!important;
   }
  `}</style>
  {children}
 </div>;
}
