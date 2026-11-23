"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
type Choice = { id: string; nom: string };

const sections = [
  { name: "Voitures", icon: "🚘", key: "voitures", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=85" },
  { name: "Motos & Scooters", icon: "🏍️", key: "motos", image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=85" },
  { name: "Utilitaires", icon: "🚐", key: "utilitaires", image: "https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?auto=format&fit=crop&w=800&q=85" },
  { name: "Camping-cars & Caravaning", icon: "🚍", key: "camping", image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=85" },
  { name: "Autres véhicules", icon: "🚜", key: "autres", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=85" },
];

const annonces = [
  { title: "Audi A3 Sportback", price: "14 500 €", details: "2020 · Diesel · 78 000 km · Automatique", location: "Lyon", category: "voitures", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=85" },
  { title: "BMW Série 3 M Sport", price: "24 900 €", details: "2019 · Essence · 92 000 km · Automatique", location: "Strasbourg", category: "voitures", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=85" },
  { title: "Peugeot 3008 GT", price: "21 500 €", details: "2021 · Hybride · 64 000 km · Automatique", location: "Mulhouse", category: "voitures", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85" },
  { title: "Renault Captur Intens", price: "16 900 €", details: "2020 · Essence · 51 000 km · Manuelle", location: "Colmar", category: "voitures", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=85" },
];

const navigation = [
  ["⌂", "Accueil", "/"],
  ["🚘", "Automobile & Véhicules", "/automobile"],
  ["⌂", "Immobilier", "/immobilier"],
  ["🤝", "Emploi & Services", "/emploi"],
  ["▣", "Maison & Jardin", "/maison-jardin"],
  ["♧", "Mode", "/mode"],
  ["▤", "High-Tech", "/telephones"],
  ["♧", "Loisirs", "/vacances-loisirs"],
  ["•••", "Autres", "/autres"],
];

export default function AutomobilePage() {
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [category, setCategory] = useState("tous");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [marques, setMarques] = useState<Choice[]>([]);
  const [modeles, setModeles] = useState<Choice[]>([]);
  const [marqueId, setMarqueId] = useState("");
  const [modeleId, setModeleId] = useState("");
  const [marqueNom, setMarqueNom] = useState("");
  const [modeleNom, setModeleNom] = useState("");
  const [loadingMarques, setLoadingMarques] = useState(true);
  const [loadingModeles, setLoadingModeles] = useState(false);
  const [catalogError, setCatalogError] = useState("");

  useEffect(() => {
    let active = true;
    async function chargerMarques() {
      const { data, error } = await supabase.from("marques_auto").select("id, nom").order("nom").limit(1000);
      if (!active) return;
      if (error) setCatalogError("Les marques sont momentanément indisponibles.");
      else setMarques(data ?? []);
      setLoadingMarques(false);
    }
    void chargerMarques();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    setModeles([]);
    setModeleId("");
    setModeleNom("");
    if (!marqueId) { setLoadingModeles(false); return; }
    setLoadingModeles(true);
    async function chargerModeles() {
      const { data, error } = await supabase.from("modeles_auto")
        .select("id, nom").eq("marque_id", marqueId).order("nom").limit(1000);
      if (!active) return;
      if (error) setCatalogError("Les modèles ne sont pas disponibles pour le moment.");
      else { setModeles(data ?? []); setCatalogError(""); }
      setLoadingModeles(false);
    }
    void chargerModeles();
    return () => { active = false; };
  }, [marqueId]);

  const resetFilters = () => {
    setCategory("tous"); setSearch(""); setSubmittedSearch("");
    setMarqueId(""); setModeleId(""); setMarqueNom(""); setModeleNom("");
  };

  const filtered = useMemo(() => annonces.filter(a => {
    const matchCategory = category === "tous" || category === a.category;
    const matchText = !submittedSearch || (a.title + " " + a.details + " " + a.location).toLocaleLowerCase("fr").includes(submittedSearch.toLocaleLowerCase("fr"));
    const matchMarque = !marqueNom || a.title.toLowerCase().includes(marqueNom.toLowerCase());
    const matchModele = !modeleNom || a.title.toLowerCase().includes(modeleNom.toLowerCase());
    return matchCategory && matchText && matchMarque && matchModele;
  }), [category, submittedSearch, marqueNom, modeleNom]);

  const doSearch = () => setSubmittedSearch(search.trim());

  return (
    <main className="vehicle-page">
      <style>{`
        .vehicle-page { font-family: Arial, Helvetica, sans-serif; color:#fff; background:#031942; min-height:100vh; }
        .vehicle-page * { box-sizing:border-box; }
        .vehicle-page .vehicle-nav { display:flex; gap:0; justify-content:space-around; align-items:center; overflow-x:auto; background:linear-gradient(180deg,#07295d,#021439); border-top:1px solid #1764af; border-bottom:2px solid #2086cf; padding:5px 12px; }
        .vehicle-page .vehicle-nav a { flex-shrink:0; text-decoration:none; color:white; font-weight:700; font-size:14px; padding:15px 14px; white-space:nowrap; border-radius:32px; }
        .vehicle-page .vehicle-nav a.active { background:#ffcf06; color:#07183d; }
        .vehicle-page .vehicle-hero { background:linear-gradient(90deg,rgba(0,17,53,.96) 0%,rgba(0,27,70,.88) 38%,rgba(0,33,83,.35) 100%),url("https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2000&q=85") center/cover; padding:28px clamp(20px,3%,55px) 32px; min-height:350px; position:relative; }
        .vehicle-page .hero-heading { font-size:clamp(34px,4.2vw,62px); font-weight:900; line-height:1.05; margin:0; letter-spacing:-1.5px; text-shadow:0 2px 5px #001235; }
        .vehicle-page .yellow-mark { height:7px; width:min(355px,63vw); margin:10px 0 14px; background:#ffcf06; clip-path:polygon(0 35%,100% 0,70% 45%,0 100%); }
        .vehicle-page .hero-copy { font-size:clamp(17px,1.55vw,25px); line-height:1.32; margin:0 0 28px; }
        .vehicle-page .trust-list { display:flex; gap:20px; align-items:center; flex-wrap:wrap; font-weight:700; }
        .vehicle-page .trust-list span { display:inline-flex; align-items:center; gap:10px; padding-right:20px; border-right:1px solid #fff9; }
        .vehicle-page .trust-list span:last-child {border:0;}
        .vehicle-page .trust-list b {color:#ffcf06; font-size:28px;}
        .vehicle-page .vehicle-body {padding:0 clamp(20px,2%,38px) 55px; margin-top:-18px; position:relative; z-index:2;}
        .vehicle-page .searchbar {display:grid; grid-template-columns:minmax(180px,1.4fr) minmax(130px,1fr) minmax(130px,1fr) 180px 160px; gap:12px; max-width:1320px; margin:0 auto 24px;}
        .vehicle-page .searchbar input,.vehicle-page .searchbar select {width:100%;height:56px;border:1px solid #d1d8e8;border-radius:34px; background:#fff;color:#111e38;font-size:16px;padding:0 24px;outline:0;}
        .vehicle-page .searchbar button,.vehicle-page .gold-button {background:#ffcf06;color:#06183b;border:0;border-radius:34px;font-weight:900;font-size:18px;cursor:pointer;padding:12px 24px;text-decoration:none;text-align:center;}
        .vehicle-page .categories {display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:16px;margin-bottom:30px;}
        .vehicle-page .category-card {display:block; border:2px solid #75c2ff;border-radius:18px;overflow:hidden;background:linear-gradient(#135cad,#021943);padding:0;color:#fff;text-align:left;cursor:pointer;box-shadow:0 8px 15px #0003;}
        .vehicle-page .category-card.selected {border-color:#ffcf06;}
        .vehicle-page .category-card img {width:100%;height:130px;object-fit:cover;display:block;background:#23476c;}
        .vehicle-page .category-card span {min-height:56px;display:flex;align-items:center;justify-content:space-between;gap:6px;padding:12px;font-size:17px;font-weight:800;}
        .vehicle-page .section-heading {display:flex;justify-content:space-between;gap:16px;align-items:center;margin:28px 0 20px;}
        .vehicle-page .section-heading h2 {font-size:clamp(23px,2.4vw,36px);line-height:1.2;margin:0;border-left:8px solid #ffcf06;padding-left:16px;}
        .vehicle-page .outline-button {text-decoration:none;white-space:nowrap;color:white;border:2px solid white;border-radius:32px;padding:12px 22px;font-weight:700;}
        .vehicle-page .listing-grid {display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;}
        .vehicle-page .listing-card {background:#fff;color:#101e37;border-radius:17px;overflow:hidden;box-shadow:0 10px 24px #0005;}
        .vehicle-page .listing-image {height:170px;position:relative;}
        .vehicle-page .listing-image img {width:100%;height:100%;object-fit:cover;display:block;}
        .vehicle-page .favorite {position:absolute;right:12px;top:8px;border:0;background:#001e5090;color:white;border-radius:30px;font-size:28px;cursor:pointer;padding:3px 10px;}
        .vehicle-page .listing-details {padding:16px;}
        .vehicle-page .listing-details strong {font-size:24px;color:#0646a2;}
        .vehicle-page .listing-details h3 {margin:8px 0;font-size:19px;}
        .vehicle-page .listing-details p {margin:8px 0;color:#4a5364;}
        .vehicle-page .empty {padding:25px;background:#fff2;border-radius:16px;}
        @media(max-width:1100px) { .vehicle-page .categories{grid-template-columns:repeat(3,minmax(0,1fr))} .vehicle-page .listing-grid{grid-template-columns:repeat(2,minmax(0,1fr))} }
        @media(max-width:650px) { .vehicle-page .vehicle-hero{min-height:305px;padding-top:24px} .vehicle-page .vehicle-body{margin-top:0;padding-top:20px} .vehicle-page .searchbar{grid-template-columns:1fr} .vehicle-page .categories{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px} .vehicle-page .category-card img{height:100px} .vehicle-page .category-card span{font-size:14px} .vehicle-page .listing-grid{grid-template-columns:1fr} .vehicle-page .section-heading{align-items:flex-start;flex-direction:column} .vehicle-page .trust-list{gap:10px;font-size:12px} .vehicle-page .trust-list span{padding-right:10px} }
      `}</style>

      <nav className="vehicle-nav" aria-label="Navigation principale">
        {navigation.map(([icon, name, href]) => (
          <a key={name} href={href} className={href === "/automobile" ? "active" : ""}>
            <span aria-hidden="true">{icon} </span>{name}
          </a>
        ))}
      </nav>

      <section className="vehicle-hero">
        <h1 className="hero-heading">Automobile &amp; Véhicules</h1>
        <div className="yellow-mark" aria-hidden="true" />
        <p className="hero-copy">Voitures, motos, utilitaires, camping-cars<br />et tous types de véhicules</p>
        <div className="trust-list">
          <span><b>◆</b> Annonces gratuites</span>
          <span><b>⬡</b> Simple et sécurisé</span>
          <span><b>♟</b> Entre particuliers et professionnels</span>
        </div>
      </section>

      <div className="vehicle-body">
        <form className="searchbar" onSubmit={e => { e.preventDefault(); doSearch(); }}>
          <input aria-label="Rechercher un véhicule" placeholder="⌕  Rechercher un véhicule (marque, modèle, mot-clé…)" value={search} onChange={e => setSearch(e.target.value)} />
          <select aria-label="Marque" value={marqueId} disabled={loadingMarques}
            onChange={e => {
              const id = e.target.value;
              setMarqueId(id);
              setMarqueNom(marques.find(m => m.id === id)?.nom ?? "");
              setCatalogError("");
            }}>
            <option value="">{loadingMarques ? "Chargement des marques…" : "Toutes les marques"}</option>
            {marques.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
          </select>
          <select aria-label="Modèle" value={modeleId} disabled={!marqueId || loadingModeles}
            onChange={e => {
              const id = e.target.value;
              setModeleId(id);
              setModeleNom(modeles.find(m => m.id === id)?.nom ?? "");
            }}>
            <option value="">{loadingModeles ? "Chargement…" : marqueId ? "Tous les modèles" : "Choisir la marque d’abord"}</option>
            {modeles.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
          </select>
          <select aria-label="Zone géographique" defaultValue="france"><option value="france">📍 Toute la France</option></select>
          <button type="submit">⌕ Rechercher</button>
        </form>

        {catalogError && <p role="alert" style={{color:"#ffdc4d",fontWeight:700}}>{catalogError}</p>}
        <div className="categories" aria-label="Types de véhicules">
          {sections.map(s => (
            <button key={s.key} type="button" onClick={() => { setCategory(category === s.key ? "tous" : s.key); setSubmittedSearch(""); setSearch(""); }} className={`category-card ${category === s.key ? "selected" : ""}`} aria-pressed={category === s.key}>
              <img src={s.image} alt="" loading="lazy" />
              <span><span style={{padding:0,minHeight:0}}>{s.icon} {s.name}</span><span style={{padding:0,minHeight:0}}>❯</span></span>
            </button>
          ))}
        </div>

        <div className="section-heading">
          <h2>Annonces récentes – Automobile &amp; Véhicules</h2>
          <a className="outline-button" href="/automobile" onClick={resetFilters}>Voir toutes les annonces ❯</a>
        </div>

        {filtered.length ? (
          <div className="listing-grid">
            {filtered.map(a => (
              <article className="listing-card" key={a.title}>
                <div className="listing-image">
                  <img src={a.image} alt={a.title} loading="lazy" />
                  <button type="button" className="favorite" aria-label={favorites.includes(a.title) ? "Retirer des favoris" : "Ajouter aux favoris"} onClick={() => setFavorites(prev => prev.includes(a.title) ? prev.filter(t => t !== a.title) : [...prev, a.title])}>{favorites.includes(a.title) ? "♥" : "♡"}</button>
                </div>
                <div className="listing-details">
                  <strong>{a.price}</strong>
                  <h3>{a.title}</h3>
                  <p>{a.details}</p>
                  <p>📍 {a.location}</p>
                </div>
              </article>
            ))}
          </div>
        ) : <p className="empty">Aucune annonce correspondante dans les exemples affichés pour le moment. <button style={{background:"none",border:0,color:"#ffcf06",cursor:"pointer",fontWeight:700}} onClick={resetFilters}>Voir toutes les annonces</button></p>}
        <div style={{textAlign:"center",marginTop:36}}>
          <a href="/automobile/deposer" className="gold-button">＋ Déposer une annonce automobile</a>
        </div>
      </div>
    </main>
  );
}
