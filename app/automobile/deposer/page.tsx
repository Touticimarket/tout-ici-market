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
    couleur: "",
    nombre_portes: "",
    nombre_places: "",
    carrosserie: "",
  });

  useEffect(() => {
    supabase.from("marques_auto").select("id, nom").order("ordre_affichage").then(({ data }) => {
      setMarques(data || []);
    });
  }, []);

  async function choisirMarque(id: string) {
    const marque = marques.find((m) => m.id === id);
    setForm({ ...form, marqueId: id, marque: marque?.nom || "", modeleId: "", modele: "", finitionId: "", finition: "", motorisation: "" });
    const { data } = await supabase.from("modeles_auto").select("id, nom").eq("marque_id", id).order("nom");
    setModeles(data || []);
    setFinitions([]);
    setMotorisations([]);
  }

  async function choisirModele(id: string) {
    const modele = modeles.find((m) => m.id === id);
    setForm({ ...form, modeleId: id, modele: modele?.nom || "", finitionId: "", finition: "", motorisation: "" });
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

  async function publier() {
    setMessage("");
    if(!form.marqueId || !form.modeleId || !form.annee || !form.kilometrage || !form.prix || !form.ville.trim() || !form.departement.trim()){
      setMessage("Complétez les champs obligatoires : marque, modèle, année, kilométrage, prix, ville et département.");
      return;
    }
    if(Number(form.annee)<1900 || Number(form.annee)>new Date().getFullYear()+1 || Number(form.kilometrage)<0 || Number(form.prix)<=0){
      setMessage("Vérifiez l’année, le kilométrage et le prix indiqués.");
      return;
    }
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setMessage("Connectez-vous pour publier une annonce.");
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
      couleur: form.couleur || null,
      nombre_portes: form.nombre_portes ? Number(form.nombre_portes) : null,
      nombre_places: form.nombre_places ? Number(form.nombre_places) : null,
      carrosserie: form.carrosserie || null,
      options,
      statut: "publiee",
      mia_verifie: true,
    });

    setMessage(error ? "Erreur : " + error.message : "Annonce publiée avec succès ✅");
  }

  return (
    <main className="depot-auto">
      <style>{\`
        .depot-auto{color:#0a2452;background:#f1f6fd;font-family:Arial,Helvetica,sans-serif;min-height:100vh;padding-bottom:50px}
        .depot-auto *{box-sizing:border-box}
        .depot-auto .banner{width:100%;min-height:210px;background:linear-gradient(90deg,rgba(0,25,65,.9),rgba(0,41,98,.14)),url("/banniere-automobile-apercu.svg") center/cover;display:flex;align-items:center;padding:30px clamp(16px,3vw,48px);border-radius:15px;overflow:hidden}
        .depot-auto .banner-copy{max-width:520px;color:white}
        .depot-auto .banner h1{font-size:clamp(26px,3vw,42px);line-height:1.13;margin:0 0 12px}
        .depot-auto .banner p{font-size:18px;line-height:1.45;margin:0}
        .depot-auto .crumb{margin:18px 0;color:#4c6288;font-size:14px}
        .depot-auto .crumb a{color:#0754ac;text-decoration:none;font-weight:700}
        .depot-auto .intro{background:#fff;border-radius:20px;padding:24px 28px;border:1px solid #deebfa;margin-bottom:20px}
        .depot-auto .intro h2{font-size:clamp(23px,2.5vw,34px);margin:0 0 9px}
        .depot-auto .intro p{margin:0;color:#4b5d76;line-height:1.5}
        .depot-auto .steps{display:flex;flex-wrap:wrap;gap:10px;margin-top:19px}
        .depot-auto .steps span{padding:9px 13px;background:#eaf3ff;color:#04336e;font-weight:800;border-radius:24px;font-size:13px}
        .depot-auto .steps span:first-child{background:#ffd324;color:#10234a}
        .depot-auto .form-section{background:#fff;border:1px solid #dce9f8;border-radius:20px;padding:24px 26px;margin-bottom:18px;box-shadow:0 4px 15px rgba(0,36,90,.04)}
        .depot-auto .section-title{display:flex;align-items:center;gap:11px;font-size:22px;font-weight:900;margin:0 0 20px}
        .depot-auto .section-number{display:flex;align-items:center;justify-content:center;background:#ffd318;border-radius:50%;width:34px;height:34px;font-size:17px}
        .depot-auto .fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:17px}
        .depot-auto .field{font-weight:750;font-size:14px;display:flex;flex-direction:column;gap:8px}
        .depot-auto select,.depot-auto .field input,.depot-auto textarea{width:100%;padding:14px;border:1px solid #bfcfe5;background:#fff;color:#0b2454;border-radius:12px;font:inherit;min-height:49px}
        .depot-auto select:disabled{color:#76849b;background:#f2f4f8}
        .depot-auto .full{grid-column:1/-1}
        .depot-auto .equip-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
        .depot-auto .equip-list label{background:#f4f8fd;border:1px solid #e5edf6;border-radius:10px;padding:10px;display:flex;align-items:center;gap:9px;font-size:13px;font-weight:650;cursor:pointer}
        .depot-auto .equip-list input{accent-color:#044994;width:16px;height:16px;flex-shrink:0}
        .depot-auto .publish{border:0;border-radius:34px;background:#ffce09;color:#06183e;font-weight:900;font-size:18px;padding:16px 30px;cursor:pointer}
        .depot-auto .note{font-size:13px;color:#58708a;line-height:1.5;margin-top:14px}
        .depot-auto .feedback{background:#e9f5ff;padding:15px;border-radius:10px;font-weight:800}
        @media(max-width:800px){.depot-auto .fields{grid-template-columns:1fr}.depot-auto .equip-list{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:500px){.depot-auto .form-section,.depot-auto .intro{padding:18px}.depot-auto .equip-list{grid-template-columns:1fr}.depot-auto .banner{min-height:180px}.depot-auto .banner p{font-size:15px}}
      \`}</style>
      <section className="banner">
        <div className="banner-copy">
          <h1>Déposer une annonce automobile</h1>
          <p>Vendez votre voiture simplement sur TOUT ICI MARKET, avec toutes les caractéristiques utiles aux acheteurs.</p>
        </div>
      </section>
      <div className="crumb"><a href="/automobile">Automobile &amp; Véhicules</a> / Déposer une annonce</div>
      <div className="intro">
        <h2>Présentez votre véhicule</h2>
        <p>Renseignez la marque, le modèle et la finition, puis les caractéristiques de votre voiture. Les listes utilisent notre base automobile.</p>
        <div className="steps"><span>1 · Véhicule</span><span>2 · Caractéristiques</span><span>3 · Équipements</span><span>4 · Publication</span></div>
      </div>
      <section className="form-section">
        <h2 className="section-title"><span className="section-number">1</span> Votre véhicule</h2>
        <div className="fields">
          <label className="field">Marque *
            <select value={form.marqueId} onChange={e=>choisirMarque(e.target.value)} required>
              <option value="">Choisir une marque</option>
              {marques.map(m=><option key={m.id} value={m.id}>{m.nom}</option>)}
            </select>
          </label>
          <label className="field">Modèle *
            <select value={form.modeleId} onChange={e=>choisirModele(e.target.value)} disabled={!form.marqueId} required>
              <option value="">Choisir un modèle</option>
              {modeles.map(m=><option key={m.id} value={m.id}>{m.nom}</option>)}
            </select>
          </label>
          <label className="field">Finition
            <select value={form.finitionId} onChange={e=>choisirFinition(e.target.value)} disabled={!form.modeleId}>
              <option value="">Toutes les finitions / non précisée</option>
              {finitions.map(f=><option key={f.id} value={f.id}>{f.nom}</option>)}
            </select>
          </label>
          <label className="field">Motorisation
            <select value={form.motorisation} onChange={e=>{
              const m=motorisations.find(m=>m.nom===e.target.value);
              setForm({...form,motorisation:m?.nom||"",carburant:m?.carburant||form.carburant,boite:m?.boite||form.boite,puissance_ch:String(m?.puissance_ch||form.puissance_ch)});
            }} disabled={!form.finitionId}>
              <option value="">Choisir une motorisation</option>
              {motorisations.map(m=><option key={m.id} value={m.nom}>{m.nom}</option>)}
            </select>
          </label>
          <label className="field">Année *
            <input type="number" value={form.annee} min="1900" max="2100" placeholder="Ex. 2021" onChange={e=>setForm({...form,annee:e.target.value})}/>
          </label>
          <label className="field">Kilométrage *
            <input type="number" value={form.kilometrage} min="0" placeholder="Ex. 65000" onChange={e=>setForm({...form,kilometrage:e.target.value})}/>
          </label>
          <label className="field">Énergie
            <select value={form.carburant} onChange={e=>setForm({...form,carburant:e.target.value})}>
              <option value="">Choisir une énergie</option>
              {["Essence","Diesel","Hybride","Hybride rechargeable","Électrique","GPL"].map(v=><option key={v}>{v}</option>)}
            </select>
          </label>
          <label className="field">Boîte de vitesses
            <select value={form.boite} onChange={e=>setForm({...form,boite:e.target.value})}>
              <option value="">Choisir une boîte</option><option>Manuelle</option><option>Automatique</option>
            </select>
          </label>
          <label className="field">Puissance (ch)
            <input type="number" value={form.puissance_ch} min="0" placeholder="Ex. 130" onChange={e=>setForm({...form,puissance_ch:e.target.value})}/>
          </label>
          <label className="field">Prix de vente (€) *
            <input type="number" value={form.prix} min="1" placeholder="Ex. 16900" onChange={e=>setForm({...form,prix:e.target.value})}/>
          </label>
        </div>
      </section>
      <section className="form-section">
        <h2 className="section-title"><span className="section-number">2</span> Caractéristiques et localisation</h2>
        <div className="fields">
          <label className="field">Carrosserie
            <select value={form.carrosserie} onChange={e=>setForm({...form,carrosserie:e.target.value})}>
              <option value="">Choisir</option>{["Citadine","Berline","Break","SUV","Crossover","Coupé","Cabriolet","Monospace","4x4","Pick-up","Autre"].map(v=><option key={v}>{v}</option>)}
            </select>
          </label>
          <label className="field">Couleur
            <select value={form.couleur} onChange={e=>setForm({...form,couleur:e.target.value})}>
              <option value="">Choisir</option>{["Blanc","Noir","Gris","Argent","Bleu","Rouge","Vert","Jaune","Orange","Marron","Beige","Autre"].map(v=><option key={v}>{v}</option>)}
            </select>
          </label>
          <label className="field">Nombre de portes
            <select value={form.nombre_portes} onChange={e=>setForm({...form,nombre_portes:e.target.value})}>
              <option value="">Choisir</option>{[2,3,4,5,6].map(v=><option key={v} value={v}>{v}</option>)}
            </select>
          </label>
          <label className="field">Nombre de places
            <select value={form.nombre_places} onChange={e=>setForm({...form,nombre_places:e.target.value})}>
              <option value="">Choisir</option>{[2,3,4,5,6,7,8,9].map(v=><option key={v} value={v}>{v}</option>)}
            </select>
          </label>
          <label className="field">Ville *
            <input value={form.ville} placeholder="Ex. Colmar" onChange={e=>setForm({...form,ville:e.target.value})}/>
          </label>
          <label className="field">Département *
            <input value={form.departement} placeholder="Ex. 68" onChange={e=>setForm({...form,departement:e.target.value})}/>
          </label>
          <label className="field full">Description de votre annonce
            <textarea rows={5} value={form.description} placeholder="État du véhicule, entretien, travaux effectués, informations utiles…" onChange={e=>setForm({...form,description:e.target.value})}/>
          </label>
        </div>
      </section>
      <section className="form-section">
        <h2 className="section-title"><span className="section-number">3</span> Options et équipements</h2>
        <div className="equip-list">{optionsAuto.map(option=><label key={option}><input type="checkbox" checked={options.includes(option)} onChange={()=>toggleOption(option)}/>{option}</label>)}</div>
      </section>
      <section className="form-section">
        <h2 className="section-title"><span className="section-number">4</span> Publier votre annonce</h2>
        <p>Vérifiez les informations avant publication. Vous devez être connecté pour publier.</p>
        <button className="publish" type="button" onClick={publier}>＋ Publier mon annonce</button>
        <p className="note">La publication est liée à votre compte et enregistrée dans la base TOUT ICI MARKET.</p>
        {message&&<p className="feedback" role="status">{message}</p>}
      </section>
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
