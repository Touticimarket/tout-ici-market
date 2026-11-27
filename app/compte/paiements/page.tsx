import Link from "next/link";
import type {Metadata} from "next";
export const metadata:Metadata={title:"Mes paiements | TOUT ICI ANNONCES",description:"Suivi des achats et ventes avec Paiement Confiance — service en préparation."};
const steps=["Paiement reçu par le partenaire agréé","Fonds sécurisés","Remise et vérification du bien","Confirmation des deux parties","Versement effectué ou litige résolu"];
export default function MesPaiements(){
 return <main className="payments-account">
 <style>{`
 .payments-account{font-family:Arial,Helvetica,sans-serif;max-width:1050px;margin:0 auto;padding:20px 14px 54px;color:#102952}
 .payments-account *{box-sizing:border-box}.payments-account a{color:#1156a1}
 .payments-account .hero{background:linear-gradient(110deg,#082454,#164780);color:#fff;padding:27px;border-radius:19px;margin:15px 0 20px}
 .payments-account h1{font-size:clamp(26px,3vw,36px);margin:10px 0}.payments-account h2{font-size:21px}
 .payments-account .pill{display:inline-block;padding:7px 11px;border-radius:25px;background:#ffe28d;color:#132b52;font-weight:850;font-size:12px}
 .payments-account .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px}
 .payments-account .card{background:#fff;border:1px solid #d9e5f2;border-radius:16px;padding:20px}
 .payments-account .empty{background:#f3f7fc;border-radius:12px;padding:16px;font-size:15px;color:#506783}
 .payments-account ol{padding-left:23px;line-height:2}.payments-account .notice{padding:17px;background:#fff9e8;border:1px solid #ecd99b;border-radius:13px;line-height:1.6;margin-top:18px}
 .payments-account .button{display:inline-block;padding:12px 17px;background:#ffcf12;color:#082451;text-decoration:none;font-weight:850;border-radius:11px}
 @media(max-width:720px){.payments-account .grid{grid-template-columns:1fr}}
 `}</style>
 <Link href="/compte">← Retour à Mon compte</Link>
 <section className="hero"><span className="pill">🔒 Fonctionnalité en préparation</span><h1>Mes paiements Confiance</h1><p>Un futur espace sécurisé pour suivre vos achats et vos ventes, avec la même information de transaction côté acheteur et vendeur.</p></section>
 <div className="grid">
  <section className="card"><h2>🛒 Mes achats</h2><p className="empty">Aucun paiement disponible : le service n'accepte pas encore de transactions.</p><p>Lorsque le paiement sera activé, vous pourrez consulter les étapes de chaque achat et confirmer la réception du bien.</p></section>
  <section className="card"><h2>🤝 Mes ventes</h2><p className="empty">Aucun versement disponible : le service n'accepte pas encore de transactions.</p><p>Vous suivrez la réception des fonds par le partenaire de paiement, la validation de la remise et le versement final.</p></section>
 </div>
 <section className="card" style={{marginTop:16}}><h2>Les étapes de suivi prévues</h2><ol>{steps.map((step,i)=><li key={i}>{step}</li>)}</ol></section>
 <div className="notice"><strong>Aucun paiement n'est activé à ce jour.</strong> TOUT ICI ANNONCES ne reçoit ni ne séquestre votre argent. La disponibilité et le suivi des opérations réelles dépendront d'un prestataire agréé, de règles de validation, des vérifications d'identité et d'une procédure de litige.</div>
 <p><Link className="button" href="/paiement-confiance">Découvrir Paiement Confiance →</Link></p>
 </main>;
}