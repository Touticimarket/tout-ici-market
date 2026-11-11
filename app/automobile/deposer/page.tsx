"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Item = { id: string; nom: string };

const optionsAuto = [
  "ABS", "ESP", "Airbags", "Isofix", "Régulateur", "Régulateur adaptatif",
  "Limiteur", "Maintien dans la voie", "Détecteur angle mort", "Freinage d’urgence",
  "Lecture panneaux", "Caméra recul", "Caméra 360", "Radar avant", "Radar arrière",
  "Park Assist", "Alerte fatigue", "Appel SOS",

  "Climatisation", "Clim auto", "Clim bizone", "Sièges chauffants",
  "Sièges ventilés", "Sièges électriques", "Mémoire conducteur",
  "Volant chauffant", "Accès mains libres", "Démarrage sans clé",
  "Hayon électrique", "Vitres électriques", "Rétros rabattables",

  "GPS", "Écran tactile", "Bluetooth", "Apple CarPlay", "Android Auto",
  "USB", "USB-C", "Charge induction", "Audio premium", "Commande vocale",
  "Affichage tête haute", "Cockpit digital", "Wi-Fi",

  "Cuir", "Semi-cuir", "Alcantara", "Sièges sport", "Palettes au volant",
  "Éclairage ambiance", "Banquette rabattable", "Accoudoir",

  "Jantes alu", "Feux LED", "Matrix LED", "Xénon", "Antibrouillards",
  "Toit ouvrant", "Toit panoramique", "Vitres teintées", "Barres de toit",
  "Attelage", "Peinture métallisée", "Pack sport",

  "Câble recharge", "Charge rapide", "Pompe à chaleur",
  "Préconditionnement batterie", "Modes conduite", "Récupération énergie"
];

export default function DeposerAutoPage() {
  const [marques, setMarques] = useState<Item[]>([]);
  const [modeles, setModeles] = useState<Item[]>([]);
  const [finitions, setFinitions] = useState<Item[]>([]);
  const [motorisations, setMotorisations] = useState<any[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [plaque, setPlaque] = useState("");

  const [form, setForm] = useState({
    marqueId: "",
    marque: "",
    modeleId: "",
    modele: "",
    finitionId: "",
    finition: "",
    motorisation: "",
    annee: "",
    kilometrage: "",
    carburant: "",
    boite: "",
    puissance_ch: "",
    prix: "",
    ville: "",
    departement: "",
    description: "",
  });

  useEffect(() => {
    supabase.from("marques_auto").select("id, nom").order("ordre_affichage").then(({ data }) => {
      setMarques(data || []);
    });
  }, []);

  async function choisirMarque(id: string) {
    const marque = marques.find((m) => m.id === id);
    setForm({ ...form, marqueId: id, marque: marque?.nom || "", modeleId: "", modele: "", finitionId: "", finition: "" });
    const { data } = await supabase.from("modeles_auto").select("id, nom").eq("marque_id", id).order("nom");
    setModeles(data || []);
    setFinitions([]);
    setMotorisations([]);
  }

  async function choisirModele(id: string) {
    const modele = modeles.find((m) => m.id === id);
    setForm({ ...form, modeleId: id, modele: modele?.nom || "", finitionId: "", finition: "" });
    const { data } = await supabase.from("finitions_auto").select("id, nom").eq("modele_id", id).order("nom");
    setFinitions(data || []);
    setMotorisations([]);
  }

  async function choisirFinition(id: string) {
    const finition = finitions.find((f) => f.id === id);
    setForm({ ...form, finitionId: id, finition: finition?.nom || "" });
    const { data } = await supabase.from("motorisations_auto").select("*").eq("finition_id", id).order("nom");
    setMotorisations(data || []);
  }

  function toggleOption(option: string) {
    setOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  }

  function choisirPhotos(files: FileList | null) {
    if (!files) return;
    const images = [...photos, ...Array.from(files)].filter((file) => file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024).slice(0, 20);
    photoUrls.forEach((url) => URL.revokeObjectURL(url));
    setPhotos(images);
    setPhotoUrls(images.map((file) => URL.createObjectURL(file)));
  }

  async function publier() {
    setMessage("");
    if (!form.marqueId || !form.modeleId || !form.annee || !form.prix || !form.ville || !form.kilometrage) {
      setMessage("Complétez la marque, le modèle, l’année, le kilométrage, le prix et la ville.");
      return;
    }
    if (Number(form.annee) < 1900 || Number(form.annee) > new Date().getFullYear() + 1 || Number(form.kilometrage) < 0 || Number(form.prix) <= 0) {
      setMessage("Vérifiez l’année, le kilométrage et le prix.");
      return;
    }
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setMessage("Connectez-vous pour publier une annonce.");
      return;
    }

    if (photos.length) {
      setMessage("Les photos sont sélectionnées mais leur stockage n’est pas encore configuré. Publication désactivée pour éviter de perdre vos photos.");
      return;
    }

    const { error } = await supabase.from("annonces_auto").insert({
      user_id: userData.user.id,
      marque: form.marque,
      modele: form.modele,
      finition: form.finition,
      version_text: form.motorisation,
      annee: Number(form.annee),
      kilometrage: Number(form.kilometrage),
      carburant: form.carburant,
      boite: form.boite,
      puissance_ch: Number(form.puissance_ch || 0),
      prix: Number(form.prix),
      ville: form.ville,
      departement: form.departement,
      description: form.description,
      options,
      statut: "publiee",
      mia_verifie: false,
    });

    setMessage(error ? "Erreur : " + error.message : "Annonce publiée avec succès ✅");
  }

  return (
    <main style={{fontFamily:"Arial, sans-serif",background:"#f6f8fc",minHeight:"100vh",color:"#10214a"}}>
      <style>{`
        .auto-wrap{max-width:1450px;margin:auto;padding:22px 22px 70px}
        .auto-hero{border-radius:24px;padding:36px 40px;background:linear-gradient(105deg,rgba(4,22,54,.97),rgba(5,44,104,.85) 55%,rgba(5,60,128,.18)),linear-gradient(135deg,#103c7a,#5f8aa9);color:white;min-height:235px;display:flex;align-items:center}
        .auto-hero h1{font-size:clamp(28px,3.4vw,49px);line-height:1.1;max-width:710px;margin:12px 0}
        .auto-layout{display:grid;grid-template-columns:250px minmax(0,1fr);gap:18px;margin-top:20px}
        .auto-panel{background:white;border:1px solid #e2e8f3;border-radius:18px;padding:24px;box-shadow:0 4px 22px #122c5910}
        .auto-form-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:15px}
        .auto-photo-form{display:grid;grid-template-columns:minmax(260px,1fr) minmax(0,1.6fr);gap:22px}
        .auto-step{padding:14px 12px;border-radius:12px;margin:4px 0;display:flex;align-items:center;gap:12px}
        .auto-step span{border:1px solid #c8d6ef;border-radius:50%;height:30px;width:30px;display:grid;place-items:center;font-weight:bold}
        .auto-step.active{background:#eef4ff;color:#0341c3;font-weight:bold}
        .auto-step.active span{background:#0647d5;color:white}
        .auto-label{font-size:13px;font-weight:700;margin-bottom:6px;display:block}
        .auto-upload{display:block;text-align:center;border:2px dashed #b9cbe9;border-radius:14px;padding:30px 14px;cursor:pointer;background:#f8faff}
        .auto-photo-thumbs{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin-top:12px}
        .auto-photo-thumbs img{width:100%;height:70px;object-fit:cover;border-radius:8px}
        .auto-options{display:flex;flex-wrap:wrap;gap:9px}
        .auto-options label{border:1px solid #dbe3f1;border-radius:8px;padding:10px;background:#fff;font-size:13px}
        @media(max-width:950px){.auto-layout{grid-template-columns:1fr}.auto-form-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.auto-photo-form{grid-template-columns:1fr}}
        @media(max-width:540px){.auto-wrap{padding:12px}.auto-hero{padding:22px;min-height:190px}.auto-form-grid{grid-template-columns:1fr}.auto-panel{padding:17px}}
      `}</style>
      <div className="auto-wrap">
        <section className="auto-hero">
          <div>
            <span style={{background:"#f8c522",color:"#092d69",borderRadius:9,padding:"8px 13px",fontWeight:800,fontSize:12}}>🚘 AUTOMOBILE</span>
            <h1>Déposez votre annonce automobile <span style={{color:"#ffd12e"}}>en quelques minutes</span></h1>
            <p style={{fontSize:18,maxWidth:600}}>Vendez votre véhicule simplement sur TOUT ICI MARKET, entre particuliers ou auprès de professionnels.</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:18,fontSize:13,marginTop:24}}><span>✓ Dépôt gratuit pour les particuliers</span><span>✓ Jusqu’à 20 photos</span><span>✓ Conseils de sécurité MIA</span></div>
          </div>
        </section>
        <div className="auto-layout">
          <aside>
            <div className="auto-panel">
              <h3 style={{color:"#0344c8",marginTop:0}}>Déposer une annonce auto</h3>
              {["Informations véhicule","Photos","Caractéristiques","Prix et description","Publication"].map((step,i)=><div className={"auto-step"+(i===0?" active":"")} key={step}><span>{i+1}</span>{step}</div>)}
            </div>
            <div className="auto-panel" style={{marginTop:14,background:"#f1fbf4"}}>
              <h3 style={{color:"#087638",marginTop:0}}>🛡 Conseils sécurité MIA</h3>
              <p style={{fontSize:13,lineHeight:1.7}}>Ne payez jamais avant d’avoir vu le véhicule. Rencontrez-vous dans un lieu public et méfiez-vous des offres trop belles pour être vraies.</p>
            </div>
          </aside>
          <div>
            <section className="auto-panel">
              <h2 style={{marginTop:0,fontSize:23}}><span style={{color:"#0345c9"}}>1.</span> Informations de votre véhicule</h2>
              <div className="auto-photo-form">
                <div>
                  <strong>Photos de votre véhicule ({photos.length}/20)</strong>
                  <label className="auto-upload" style={{marginTop:12}}>
                    <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e=>choisirPhotos(e.target.files)} style={{display:"none"}}/>
                    <div style={{fontSize:32,color:"#0750d5"}}>☁</div>
                    <strong>Ajoutez vos photos ici</strong><p style={{fontSize:12}}>JPG, PNG, WEBP — 10 Mo maximum par image</p>
                  </label>
                  <div className="auto-photo-thumbs">{photoUrls.map((url,i)=><img src={url} alt={"Photo du véhicule "+(i+1)} key={url}/>)}</div>
                  <p style={{background:"#effaf0",padding:12,borderRadius:10,fontSize:12}}>💡 MIA conseille de photographier l’extérieur, l’intérieur, le tableau de bord et les éventuels défauts.</p>
                </div>
                <div>
                  <strong>Recherche par immatriculation</strong>
                  <div style={{display:"flex",gap:8,margin:"12px 0"}}>
                    <input style={{...inputStyle,flex:1}} value={plaque} onChange={e=>setPlaque(e.target.value.toUpperCase())} placeholder="AA-123-BB" aria-label="Immatriculation"/>
                    <button type="button" style={{...buttonStyle,marginTop:0,opacity:.55}} disabled title="Service à connecter">Rechercher</button>
                  </div>
                  <p style={{fontSize:12,color:"#53627c"}}>Recherche automatique bientôt disponible. En attendant, renseignez les caractéristiques ci-dessous.</p>
                  <div className="auto-form-grid" style={{marginTop:16}}>
                    <div><label className="auto-label">Marque *</label><select style={inputStyle} value={form.marqueId} onChange={e=>choisirMarque(e.target.value)}><option value="">Choisir</option>{marques.map(m=><option key={m.id} value={m.id}>{m.nom}</option>)}</select></div>
                    <div><label className="auto-label">Modèle *</label><select style={inputStyle} value={form.modeleId} onChange={e=>choisirModele(e.target.value)}><option value="">Choisir</option>{modeles.map(m=><option key={m.id} value={m.id}>{m.nom}</option>)}</select></div>
                    <div><label className="auto-label">Finition</label><select style={inputStyle} value={form.finitionId} onChange={e=>choisirFinition(e.target.value)}><option value="">Choisir</option>{finitions.map(f=><option key={f.id} value={f.id}>{f.nom}</option>)}</select></div>
                    <div><label className="auto-label">Année *</label><input style={inputStyle} type="number" min="1900" max={new Date().getFullYear()+1} value={form.annee} onChange={e=>setForm({...form,annee:e.target.value})}/></div>
                    <div><label className="auto-label">Motorisation</label><select style={inputStyle} value={form.motorisation} onChange={e=>{const mot=motorisations.find(m=>m.nom===e.target.value);setForm({...form,motorisation:mot?.nom||"",carburant:mot?.carburant||"",boite:mot?.boite||"",puissance_ch:String(mot?.puissance_ch||"")})}}><option value="">Choisir</option>{motorisations.map(m=><option key={m.id} value={m.nom}>{m.nom}</option>)}</select></div>
                    <div><label className="auto-label">Carburant</label><select style={inputStyle} value={form.carburant} onChange={e=>setForm({...form,carburant:e.target.value})}>{["","Essence","Diesel","Hybride","Hybride rechargeable","Électrique","GPL"].map(v=><option key={v} value={v}>{v||"Choisir"}</option>)}</select></div>
                    <div><label className="auto-label">Boîte</label><select style={inputStyle} value={form.boite} onChange={e=>setForm({...form,boite:e.target.value})}>{["","Manuelle","Automatique"].map(v=><option key={v} value={v}>{v||"Choisir"}</option>)}</select></div>
                    <div><label className="auto-label">Kilométrage *</label><input style={inputStyle} type="number" min="0" value={form.kilometrage} onChange={e=>setForm({...form,kilometrage:e.target.value})}/></div>
                    <div><label className="auto-label">Puissance (ch)</label><input style={inputStyle} type="number" min="0" value={form.puissance_ch} onChange={e=>setForm({...form,puissance_ch:e.target.value})}/></div>
                    <div><label className="auto-label">Prix (€) *</label><input style={inputStyle} type="number" min="1" value={form.prix} onChange={e=>setForm({...form,prix:e.target.value})}/></div>
                    <div><label className="auto-label">Ville *</label><input style={inputStyle} value={form.ville} onChange={e=>setForm({...form,ville:e.target.value})}/></div>
                    <div><label className="auto-label">Département</label><input style={inputStyle} value={form.departement} onChange={e=>setForm({...form,departement:e.target.value})}/></div>
                  </div>
                </div>
              </div>
            </section>
            <section className="auto-panel" style={{marginTop:16}}>
              <h2 style={{marginTop:0,fontSize:22}}><span style={{color:"#0345c9"}}>2.</span> Caractéristiques et équipements</h2>
              <div className="auto-options">{optionsAuto.map(option=><label key={option}><input type="checkbox" checked={options.includes(option)} onChange={()=>toggleOption(option)}/> {option}</label>)}</div>
            </section>
            <section className="auto-panel" style={{marginTop:16}}>
              <h2 style={{marginTop:0,fontSize:22}}><span style={{color:"#0345c9"}}>3.</span> Description et publication</h2>
              <textarea style={{...inputStyle,minHeight:125}} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Décrivez votre véhicule, son entretien, son état général..."/>
              <p style={{fontSize:13,color:"#56627a"}}>La vérification automatique MIA et l’estimation du prix ne sont pas encore actives.</p>
              <button type="button" onClick={publier} style={buttonStyle}>Publier mon annonce</button>
              {message&&<p role="status" style={{fontWeight:700,marginTop:15}}>{message}</p>}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  fontSize: "15px",
  boxSizing: "border-box" as const,
};

const buttonStyle = {
  marginTop: 24,
  background: "#0047BB",
  color: "white",
  border: "none",
  borderRadius: 14,
  padding: "16px 30px",
  fontWeight: "bold",
  cursor: "pointer",
};
