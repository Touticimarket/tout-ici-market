const sousRubriques=["Puériculture","Jeux & jouets","Vêtements enfants","Équipement familial"];
export default function Page(){
  return <main style={{minHeight:"70vh",background:"#f7fafe",padding:"clamp(18px,4vw,44px)",fontFamily:"Arial,Helvetica,sans-serif",color:"#091d45"}}>
    <h1 style={{fontSize:"clamp(30px,4vw,45px)",margin:"0 0 12px"}}>Famille</h1>
    <p style={{fontSize:18,lineHeight:1.5,maxWidth:700}}>Tout pour les parents, les enfants et la vie de famille.</p>
    <div style={{marginTop:26,background:"#fff",border:"1px solid #dce7f6",borderRadius:18,padding:22}}>
      <h2 style={{margin:"0 0 18px",fontSize:23}}>Découvrez la rubrique</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))",gap:12}}>
        {sousRubriques.map(x=><div key={x} style={{borderRadius:14,background:"#eaf4ff",padding:18,fontWeight:700,textAlign:"center"}}>{x}</div>)}
      </div>
      <p style={{margin:"22px 0 0",color:"#455b7a"}}>La rubrique est créée. Le dépôt et la recherche d’annonces de cette catégorie seront disponibles après connexion de leurs modules.</p>
    </div>
  </main>
}
