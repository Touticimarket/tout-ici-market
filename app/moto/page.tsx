export default function MotoPage() {
  return <main style={{fontFamily:"Arial,sans-serif",minHeight:"100vh",padding:"110px 24px 60px",background:"#f5f8fd",color:"#123064"}}>
    <div style={{maxWidth:980,margin:"0 auto",background:"white",borderRadius:20,padding:"36px",boxShadow:"0 8px 28px #102b5a12"}}>
      <h1 style={{fontSize:"clamp(30px,4vw,49px)",marginTop:0,color:"#0047bb"}}>🏍️ Motos, scooters & quads</h1>
      <p style={{fontSize:18,lineHeight:1.6}}>Les motos et deux-roues font désormais partie de notre grande rubrique <strong>Automobile & Véhicules</strong>, avec des sous-catégories dédiées.</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
        <a href="/deposer/automobile#deux-roues" style={{padding:"15px 23px",background:"#ffcf21",color:"#102552",fontWeight:800,borderRadius:12,textDecoration:"none"}}>Choisir une moto ou un scooter</a>
        <a href="/automobile" style={{padding:"15px 23px",background:"#eff5ff",color:"#0047bb",fontWeight:700,borderRadius:12,textDecoration:"none"}}>Voir les annonces de véhicules</a>
      </div>
    </div>
  </main>;
}
