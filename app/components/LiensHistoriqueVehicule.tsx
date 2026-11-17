import {ExternalLink, ShieldCheck} from "lucide-react";

const services=[
  {nom:"HistoVec",url:"https://histovec.interieur.gouv.fr/histovec/",description:"Service public gratuit : le vendeur peut partager son rapport."},
  {nom:"Autoviza",url:"https://autoviza.fr/",description:"Rapport d'historique proposé par un service externe."},
  {nom:"carVertical",url:"https://www.carvertical.com/fr",description:"Consulter les possibilités de vérification d'un véhicule."},
  {nom:"Autorigin",url:"https://autorigin.com/",description:"Rechercher un rapport d'historique par plaque ou VIN."}
];

export default function LiensHistoriqueVehicule({compact=false}:{compact?:boolean}){
  return <section className={"hv-block"+(compact?" hv-block-compact":"")} aria-label="Vérifier l'historique d'un véhicule">
    <style>{`
      .hv-block{margin-top:20px;background:#fff;border:1px solid #e0e9f5;border-radius:18px;padding:20px 22px;color:#0b2a5d;box-shadow:0 6px 22px #173d6c0b}
      .hv-block *{box-sizing:border-box}
      .hv-heading{display:flex;gap:9px;align-items:center;margin-bottom:6px}
      .hv-heading svg{color:#0c4cba;flex-shrink:0}
      .hv-heading h2{font-size:20px;line-height:1.3;font-weight:850;margin:0}
      .hv-intro{font-size:13px;line-height:1.55;color:#62728d;margin:6px 0 16px}
      .hv-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
      .hv-link{display:flex;align-items:center;justify-content:space-between;gap:10px;text-decoration:none;border:1px solid #dce7f6;border-radius:12px;padding:13px 12px;color:#0b3990;background:#f8fbff;min-width:0}
      .hv-link:hover,.hv-link:focus-visible{border-color:#f3c324;background:#fffbef}
      .hv-link span{min-width:0;display:flex;flex-direction:column;gap:5px}
      .hv-link strong{font-size:14px;line-height:1.2}
      .hv-link small{color:#667b96;font-size:11px;line-height:1.38}
      .hv-link svg{flex-shrink:0}
      .hv-disclaimer{font-size:11px;line-height:1.6;color:#758399;margin:13px 0 0}
      .hv-block-compact{margin:0 0 16px}
      .hv-block-compact .hv-heading h2{font-size:18px}
      .hv-block-compact .hv-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
      .hv-block-compact .hv-link{padding:10px 9px}
      .hv-block-compact .hv-link strong{font-size:12px}
      .hv-block-compact .hv-link small{font-size:10px}
      @media(max-width:1020px){.hv-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:450px){.hv-block{padding:16px 13px}.hv-grid{grid-template-columns:1fr 1fr;gap:7px}.hv-link{padding:11px 8px}.hv-link strong{font-size:12px}.hv-link small{font-size:10px}}
    `}</style>
    <div className="hv-heading"><ShieldCheck size={21} aria-hidden="true"/><h2>Vérifier l'historique d'un véhicule</h2></div>
    <p className="hv-intro">Vous le souhaitez ? Consultez librement l'un de ces sites externes avant d'acheter un véhicule d'occasion.</p>
    <div className="hv-grid">
      {services.map(service=><a key={service.nom} className="hv-link" href={service.url}
        target="_blank" rel="noopener noreferrer nofollow" aria-label={"Ouvrir "+service.nom+" sur son site officiel (nouvel onglet)"}>
        <span><strong>{service.nom}</strong><small>{service.description}</small></span>
        <ExternalLink size={16} aria-hidden="true"/>
      </a>)}
    </div>
    <p className="hv-disclaimer">Liens indépendants, sans partenariat, parrainage ni transfert automatique de vos données depuis TOUT ICI MARKET. HistoVec est gratuit ; certains autres rapports peuvent être payants. Pour HistoVec, le propriétaire doit générer et partager le rapport.</p>
  </section>;
}
