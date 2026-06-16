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

  async function publier() {
    setMessage("");
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
      options,
      statut: "publiee",
      mia_verifie: true,
    });

    setMessage(error ? "Erreur : " + error.message : "Annonce publiée avec succès ✅");
  }

  return (
    <main style={{ fontFamily: "Arial", background: "#f8f9fb", minHeight: "100vh", padding: "40px 5%" }}>
      <section style={{ maxWidth: 1150, margin: "0 auto", background: "white", borderRadius: 28, padding: 36, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
        <h1 style={{ color: "#0047BB", fontSize: 44 }}>🚗 Déposer une annonce automobile</h1>
        <p style={{ fontSize: 18, color: "#555" }}>Formulaire intelligent avec marques, modèles, finitions, motorisations et options.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
          <select style={inputStyle} onChange={(e) => choisirMarque(e.target.value)}>
            <option>Marque</option>
            {marques.map((m) => <option key={m.id} value={m.id}>{m.nom}</option>)}
          </select>

          <select style={inputStyle} onChange={(e) => choisirModele(e.target.value)}>
            <option>Modèle</option>
            {modeles.map((m) => <option key={m.id} value={m.id}>{m.nom}</option>)}
          </select>

          <select style={inputStyle} onChange={(e) => choisirFinition(e.target.value)}>
            <option>Finition</option>
            {finitions.map((f) => <option key={f.id} value={f.id}>{f.nom}</option>)}
          </select>

          <select style={inputStyle} onChange={(e) => {
            const mot = motorisations.find((m) => m.nom === e.target.value);
            setForm({ ...form, motorisation: mot?.nom || "", carburant: mot?.carburant || "", boite: mot?.boite || "", puissance_ch: String(mot?.puissance_ch || "") });
          }}>
            <option>Motorisation</option>
            {motorisations.map((m) => <option key={m.id}>{m.nom}</option>)}
          </select>

          <input style={inputStyle} placeholder="Année" onChange={(e) => setForm({ ...form, annee: e.target.value })} />
          <input style={inputStyle} placeholder="Kilométrage" onChange={(e) => setForm({ ...form, kilometrage: e.target.value })} />
          <input style={inputStyle} placeholder="Prix" onChange={(e) => setForm({ ...form, prix: e.target.value })} />
          <input style={inputStyle} placeholder="Ville" onChange={(e) => setForm({ ...form, ville: e.target.value })} />
          <input style={inputStyle} placeholder="Département" onChange={(e) => setForm({ ...form, departement: e.target.value })} />
        </div>

        <h2 style={{ color: "#0047BB", marginTop: 30 }}>Options & équipements</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10 }}>
          {optionsAuto.map((option) => (
            <label key={option} style={{ background: "#f5f7fb", borderRadius: 12, padding: 10 }}>
              <input type="checkbox" onChange={() => toggleOption(option)} /> {option}
            </label>
          ))}
        </div>

        <textarea style={{ ...inputStyle, marginTop: 24, minHeight: 140 }} placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <div style={{ background: "#eaf8ef", color: "#087a3d", padding: 18, borderRadius: 18, marginTop: 20, fontWeight: "bold" }}>
          🟢 MIA vérifiera la cohérence de votre annonce.
        </div>

        <button onClick={publier} style={buttonStyle}>Publier mon annonce</button>

        {message && <p style={{ fontWeight: "bold", marginTop: 20 }}>{message}</p>}
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
