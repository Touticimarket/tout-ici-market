import type {Metadata} from "next";
import Link from "next/link";
export const metadata:Metadata={
 title:"Paiement Confiance | TOUT ICI ANNONCES",
 description:"Découvrez le futur paiement sécurisé avec suivi partagé acheteur-vendeur de TOUT ICI ANNONCES."
};
const steps=[
 ["01","Paiement reçu par le prestataire","L’acheteur verse le montant auprès du partenaire de paiement agréé."],
 ["02","Fonds sécurisés","Le prestataire conserve les fonds selon les conditions contractuelles convenues."],
 ["03","Remise et vérification","L’acheteur vérifie le bien ; le vendeur confirme sa remise."],
 ["04","Accord des deux parties","Les validations sont enregistrées. En cas de désaccord, une procédure de litige s’applique."],
 ["05","Versement au vendeur","Le partenaire déclenche le transfert selon les règles et délais de la transaction."]
];
export default function PaiementConfiancePage(){
 return <main className="tim-trust">
 <style>{`
 .tim-trust{font-family:Arial,Helvetica,sans-serif;color:#0a224d;max-width:1240px;margin:0 auto;padding:20px 15px 60px}
 .tim-trust *{box-sizing:border-box}
 .tim-trust .hero{background:linear-gradient(120deg,#08224e,#0b4385);color:white;border-radius:20px;padding:clamp(24px,4vw,45px);box-shadow:0 12px 25px #09245018}
 .tim-trust .pill{display:inline-block;border-radius:30px;background:#ffdc53;color:#09224d;font-size:13px;font-weight:900;padding:8px 12px}
 .tim-trust h1{font-size:clamp(27px,3vw,43px);margin:16px 0 12px;letter-spacing:-.02em}
 .tim-trust .hero p{font-size:clamp(16px,1.5vw,20px);line-height:1.6;max-width:850px;color:#f1f6ff}
 .tim-trust .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:20px}
 .tim-trust .card{background:white;border:1px solid #d8e3f3;border-radius:17px;padding:24px;box-shadow:0 5px 15px #0c30520d}
 .tim-trust h2{font-size:24px;color:#0b2c61;margin:0 0 16px}
 .tim-trust .steps{display:grid;gap:12px;margin-top:20px}
 .tim-trust .step{display:flex;gap:13px;align-items:flex-start;padding:15px;border-radius:12px;background:#f1f7ff}
 .tim-trust .num{display:grid;place-items:center;flex-shrink:0;width:44px;height:44px;border-radius:12px;background:#092c62;color:#ffd634;font-weight:900}
 .tim-trust .step strong{display:block;font-size:17px;margin-bottom:5px}
 .tim-trust .step p{margin:0;font-size:14px;line-height:1.5;color:#405a79}
 .tim-trust .role-head{font-size:13px;color:#566c89;font-weight:800;letter-spacing:.04em;text-transform:uppercase}
 .tim-trust .status{border:1px solid #dde7f5;background:#f5f8fe;border-radius:12px;padding:13px;margin-top:11px}
 .tim-trust .status strong{display:block;margin:3px 0}
 .tim-trust .status small{font-size:13px;color:#5a6c86}
 .tim-trust .warning{background:#fff8e4;border:1px solid #ead79c;border-radius:13px;padding:17px;font-size:14px;line-height:1.6;margin-top:18px}
 .tim-trust .link{display:inline-block;background:#ffd008;color:#09214a;text-decoration:none;font-weight:900;padding:13px 18px;border-radius:12px;margin-top:15px}
 @media(max-width:780px){.tim-trust .grid{grid-template-columns:1fr}}
 `}</style>
 <section className="hero">
  <span className="pill">🔒 Service en préparation — aucun paiement actif</span>
  <h1>TOUT ICI PAIEMENT CONFIANCE</h1>
  <p>Un paiement sécurisé et un suivi transparent : acheteur et vendeur consulteront tous les deux l’état de la transaction, jusqu’à la validation et au versement des fonds.</p>
 </section>
 <section className="card" style={{marginTop:20}}>
  <h2>Comment fonctionnera le paiement ?</h2>
  <div className="steps">{steps.map(([number,title,desc])=><div className="step" key={number}><div className="num">{number}</div><div><strong>{title}</strong><p>{desc}</p></div></div>)}</div>
 </section>
 <section className="grid" aria-label="Prévisualisation du suivi partagé">
  <article className="card">
   <div className="role-head">Vue acheteur — exemple fictif</div>
   <h2 style={{marginTop:9}}>Mon achat sécurisé</h2>
   <div className="status">💳 <strong>Montant confié au prestataire</strong><small>Le suivi confirmera uniquement les fonds réellement reçus.</small></div>
   <div className="status">📦 <strong>Remise à confirmer</strong><small>Vous vérifiez le produit avant d’accepter.</small></div>
   <div className="status">✅ <strong>Ma validation</strong><small>Confirmation explicite ou signalement d’un problème.</small></div>
  </article>
  <article className="card">
   <div className="role-head">Vue vendeur — même transaction fictive</div>
   <h2 style={{marginTop:9}}>Ma vente sécurisée</h2>
   <div className="status">🔐 <strong>Fonds reçus par le prestataire</strong><small>Le vendeur ne se fie jamais à une simple capture d’écran de paiement.</small></div>
   <div className="status">🤝 <strong>Remise du produit</strong><small>Le vendeur confirme la remise ; l’acheteur contrôle la conformité.</small></div>
   <div className="status">🏦 <strong>Versement à suivre</strong><small>Le délai et le statut réel seront communiqués par le partenaire de paiement.</small></div>
  </article>
 </section>
 <section className="card" style={{marginTop:20}}>
  <h2>Et si les deux personnes ne sont pas d’accord ?</h2>
  <p>La transaction ne doit pas être bloquée indéfiniment. Le parcours prévoira des délais de validation, des demandes d’annulation, des justificatifs et une procédure de résolution des litiges définie avec notre prestataire.</p>
  <div className="warning"><strong>Important :</strong> cette page présente le fonctionnement envisagé. Aucun argent n’est collecté, conservé ou transféré par TOUT ICI ANNONCES à ce stade. Le suivi en temps réel ne sera activé qu’une fois un prestataire agréé connecté, les règles de paiement validées et l’accès aux transactions réservé aux parties concernées.</div>
  <Link className="link" href="/automobile">Découvrir les annonces →</Link>
 </section>
 </main>;
}