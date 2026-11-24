"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {FranceLocation, OrderedPhotos, type Commune} from "./PhotosLocalisation";

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
  const [immatriculation, setImmatriculation] = useState("");
  const [immatMessage, setImmatMessage] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [localisation, setLocalisation] = useState<Commune|null>(null);
  const [publicationEnCours,setPublicationEnCours] = useState(false);
  const [video,setVideo]=useState<File|null>(null);
  const [titre,setTitre]=useState("");
  const [etat,setEtat]=useState("Occasion");
  const [garantieMois,setGarantieMois]=useState("");
  const [tva,setTva]=useState("non");
  const [carnet,setCarnet]=useState(false);
  const [factures,setFactures]=useState(false);
  const [importe,setImporte]=useState(false);
  const [ct,setCt]=useState(false);
  const [telephone,setTelephone]=useState("");
  const [email,setEmail]=useState("");
  const [confirm,setConfirm]=useState(false);
  const [etape,setEtape]=useState(1);
  const etapes=["Véhicule","Équipements & options","Photos & vidéo","Description","Localisation & coordonnées","Récapitulatif","Publication"];
  const aller=(n:number)=>{setEtape(n);document.getElementById("etape-"+n)?.scrollIntoView({behavior:"smooth",block:"start"});};

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
    if(!form.marqueId || !form.modeleId || !form.annee || !form.kilometrage || !form.prix || !localisation){
      setMessage("Complétez la marque, le modèle, l’année, le kilométrage, le prix et choisissez une commune française.");
      return;
    }
    if(Number(form.annee)<1900 || Number(form.annee)>new Date().getFullYear()+1 || Number(form.kilometrage)<0 || Number(form.prix)<=0){
      setMessage("Vérifiez l’année, le kilométrage et le prix indiqués.");
      return;
    }
    if(!confirm){setMessage("Confirmez les informations et les conditions avant publication.");aller(7);return;}
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setMessage("Connectez-vous pour publier une annonce.");
      return;
    }

    setPublicationEnCours(true);
    const { data: draft, error: draftError } = await supabase.from("annonces_auto").insert({
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
      ville: localisation!.nom,
      departement: localisation!.departement,
      code_postal: localisation!.codePostal,
      code_insee: localisation!.code,
      latitude: localisation!.latitude,
      longitude: localisation!.longitude,
      description: form.description,
      titre: titre.trim() || [form.marque,form.modele,form.annee].filter(Boolean).join(" "),
      etat_vehicule:etat,
      garantie_duree_mois:garantieMois?Number(garantieMois):null,
      garantie:!!garantieMois,
      tva_recuperable:tva==="oui",
      carnet_entretien:carnet,
      factures_entretien:factures,
      vehicule_importe:importe,
      controle_technique_ok:ct,
      email_contact:email||null,
      telephone_contact:telephone||null,
      couleur: form.couleur || null,
      nombre_portes: form.nombre_portes ? Number(form.nombre_portes) : null,
      nombre_places: form.nombre_places ? Number(form.nombre_places) : null,
      carrosserie: form.carrosserie || null,
      options,
      statut: "brouillon",
      mia_verifie: false,
    }).select("id").single();
    if(draftError || !draft) {setMessage("Impossible de créer le brouillon : "+(draftError?.message||"erreur inconnue"));setPublicationEnCours(false);return;}
    const uploaded:string[]=[];
    for(let i=0;i<photos.length;i++){
      const file=photos[i];
      const ext=file.name.split(".").pop()?.toLowerCase()||"jpg";
      const key=userData.user.id+"/"+draft.id+"/"+String(i+1).padStart(2,"0")+"-"+crypto.randomUUID()+"."+ext;
      const {error:uploadError}=await supabase.storage.from("annonces-auto").upload(key,file,{contentType:file.type,upsert:false});
      if(uploadError){setMessage("Brouillon enregistré, mais l’envoi des photos a échoué : "+uploadError.message);setPublicationEnCours(false);return;}
      uploaded.push(supabase.storage.from("annonces-auto").getPublicUrl(key).data.publicUrl);
    }
    let videoUrl:string|null=null;
    if(video){
      const ext=video.name.split(".").pop()?.toLowerCase()||"mp4";
      const key=userData.user.id+"/"+draft.id+"/video-"+crypto.randomUUID()+"."+ext;
      const {error:videoError}=await supabase.storage.from("annonces-auto-videos").upload(key,video,{contentType:video.type,upsert:false});
      if(videoError){setMessage("Annonce en brouillon : échec de la vidéo : "+videoError.message);setPublicationEnCours(false);return;}
      videoUrl=supabase.storage.from("annonces-auto-videos").getPublicUrl(key).data.publicUrl;
    }
    const {error:publishError}=await supabase.from("annonces_auto").update({photos:uploaded,video_url:videoUrl,statut:"publiee"}).eq("id",draft.id).eq("user_id",userData.user.id);
    setPublicationEnCours(false);
    setMessage(publishError?"Brouillon enregistré, mais publication non terminée : "+publishError.message:"Annonce publiée avec succès ✅");
  }

  return (
    <main className="depot-auto">
      <style>{`
        .depot-auto{color:#0a2452;background:#f1f6fd;font-family:Arial,Helvetica,sans-serif;min-height:100vh;padding-bottom:50px}
        .depot-auto *{box-sizing:border-box}
        .depot-auto .banner{width:100%;min-height:210px;background:linear-gradient(90deg,rgba(0,25,65,.9),rgba(0,41,98,.14)),url("/bandeau-depot-bmw.svg") center/cover;display:flex;align-items:center;padding:30px clamp(16px,3vw,48px);border-radius:15px;overflow:hidden}
        .depot-auto .banner{display:block!important;min-height:0!important;height:auto!important;padding:0!important;background:none!important;border-radius:13px}
        .depot-auto .banner img{display:block;width:100%;height:auto;aspect-ratio:1066 / 164;object-fit:fill}
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
        .depot-auto .immat-lookup{border:2px solid #d4e5fb;background:#f3f8ff;border-radius:15px;padding:19px;margin:0 0 24px}
        .depot-auto .immat-lookup h3{font-size:19px;margin:0 0 8px}
        .depot-auto .immat-lookup p{margin:0 0 14px;color:#435675;line-height:1.45}
        .depot-auto .immat-controls{display:flex;gap:12px;align-items:stretch}
        .depot-auto .immat-controls input{min-width:0;flex:1;border:1px solid #aabfdd;border-radius:10px;padding:14px;font-size:18px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#0a2452}
        .depot-auto .immat-controls button{background:#084bd8;color:#fff;border:0;border-radius:10px;padding:0 24px;font-size:16px;font-weight:800;cursor:pointer}
        .depot-auto .immat-status{margin:12px 0 0!important;color:#184a83!important;font-weight:700}
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
        .depot-auto .step-navigation{display:flex;flex-wrap:wrap;gap:8px;margin:15px 0 22px}
        .depot-auto .step-navigation button{border:1px solid #bfd2ef;border-radius:20px;background:#eaf2ff;color:#0b3275;padding:9px 14px;cursor:pointer;font-weight:800}
        .depot-auto .step-navigation .active{background:#ffcf06;color:#061c44}
        .depot-auto .form-section{scroll-margin-top:18px}
        .depot-auto .step-actions{display:flex;justify-content:space-between;gap:10px;margin-top:22px;flex-wrap:wrap}
        .depot-auto .step-actions button{background:#064bd1;color:white;border:0;border-radius:24px;padding:11px 19px;cursor:pointer;font-weight:800}
        .depot-auto .step-actions .previous{background:#e4eefc;color:#06346f}
        .depot-auto .checkbox-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin-top:15px}
        .depot-auto .checkbox-row label{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700}
        .depot-auto .video-input{margin-top:20px;padding:16px;border:1px dashed #8cafe1;border-radius:12px;background:#f7fbff}
        .depot-auto .video-input input{width:100%;margin-top:10px}
        .depot-auto .page-grid{display:grid;grid-template-columns:235px minmax(0,1fr);gap:12px;align-items:start}
        .depot-auto .depot-progress{background:#fff;border:1px solid #dce6f5;border-radius:12px;padding:14px;position:sticky;top:14px}
        .depot-auto .depot-progress h3{font-size:16px;color:#003dcc;margin:0 0 12px}
        .depot-auto .progress-link{display:flex;align-items:center;width:100%;text-align:left;gap:10px;background:transparent;border:0;border-bottom:1px solid #eff2f9;padding:12px 4px;font-weight:800;font-size:13px;color:#0b2452;cursor:pointer}
        .depot-auto .progress-link.active{background:#e8f1ff;color:#003bd2;border-radius:10px}
        .depot-auto .step-dot{display:inline-flex;justify-content:center;align-items:center;border:1px solid #9fb6d6;width:28px;height:28px;border-radius:50%;font-size:14px;flex-shrink:0}
        .depot-auto .progress-link.active .step-dot{background:#0644e8;color:white;border-color:#0644e8}
        .depot-auto .form-section{padding:16px 18px;margin-bottom:11px;border-radius:13px}
        .depot-auto .section-title{color:#0036c6;margin-bottom:12px;font-size:19px}
        .depot-auto .section-number{background:#e7efff;color:#0445e8}
        .depot-auto .fields{grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
        .depot-auto .field{font-size:12px;gap:5px}
        .depot-auto select,.depot-auto .field input,.depot-auto textarea{min-height:36px;padding:9px;font-size:13px;border-radius:7px}
        .depot-auto .immat-lookup{margin-bottom:12px;padding:13px;border-radius:9px}
        .depot-auto .immat-lookup h3{font-size:15px}
        .depot-auto .banner{min-height:205px;margin-bottom:10px;background-image:linear-gradient(90deg,rgba(0,16,48,.91),rgba(0,21,62,.12)),url("/bandeau-depot-bmw.svg");background-position:center;background-size:cover}
        .depot-auto .banner-copy{max-width:570px}
        .depot-auto .banner h1{font-size:clamp(24px,2.9vw,39px)}
        .depot-auto .depot-main{min-width:0}
        .depot-auto .step-navigation{display:none}
        .depot-auto .intro{padding:16px 20px;margin-bottom:11px}
        .depot-auto .intro h2{font-size:20px}
        .depot-auto .equip-list{grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}
        .depot-auto .equip-list label{padding:8px;font-size:12px}
        .depot-auto .checkbox-row{gap:7px}
        .depot-auto .step-actions{margin-top:12px}
        @media(max-width:1250px){.depot-auto .page-grid{grid-template-columns:190px minmax(0,1fr)}.depot-auto .fields{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:800px){.depot-auto .page-grid{grid-template-columns:1fr}.depot-auto .depot-progress{position:static}.depot-auto .fields{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:480px){.depot-auto .fields,.depot-auto .equip-list{grid-template-columns:1fr}}
        .depot-auto .feedback{background:#e9f5ff;padding:15px;border-radius:10px;font-weight:800}
        @media(max-width:800px){.depot-auto .fields{grid-template-columns:1fr}.depot-auto .equip-list{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:500px){.depot-auto .immat-controls{flex-direction:column}.depot-auto .immat-controls button{padding:13px}
        .depot-auto .form-section,.depot-auto .intro{padding:18px}.depot-auto .equip-list{grid-template-columns:1fr}.depot-auto .banner{min-height:180px}.depot-auto .banner p{font-size:15px}}
      `}</style>
      <section className="banner" aria-label="Déposez votre annonce automobile en quelques minutes — BMW et encart MIA">
        <img src="/bandeau-depot-bmw.svg" alt="Déposez votre annonce automobile en quelques minutes, visuel BMW et informations MIA" />
      </section>
      <div className="page-grid">
       <aside className="depot-progress" aria-label="Étapes du dépôt automobile">
         <h3>Déposer une annonce auto</h3>
         {etapes.map((nom,i)=><button key={nom} type="button" className={"progress-link "+(etape===i+1?"active":"")} onClick={()=>aller(i+1)}>
           <span className="step-dot">{i+1}</span><span>{nom}</span>
         </button>)}
         <div style={{marginTop:20,padding:13,background:"#edf8f0",borderRadius:10,fontSize:12}}>
           <strong style={{color:"#0f6c31"}}>✓ Conseils de sécurité</strong>
           <p>Ne payez jamais sans avoir vu le véhicule. Privilégiez les échanges sécurisés.</p>
         </div>
       </aside>
       <div className="depot-main">
       <div className="intro">
        <h2>Présentez votre véhicule</h2>
        <p>Renseignez la marque, le modèle et la finition, puis les caractéristiques de votre voiture. Les listes utilisent notre base automobile.</p>
        <div className="step-navigation" aria-label="Navigation entre les sept étapes">{etapes.map((nom,i)=><button type="button" className={etape===i+1?"active":""} key={nom} onClick={()=>aller(i+1)}>{i+1}. {nom}</button>)}</div>
      </div>
      <section className="form-section" id="etape-1">
        <h2 className="section-title"><span className="section-number">1</span> Informations de votre véhicule</h2>
        <div className="immat-lookup">
          <h3>1. Rechercher votre véhicule par immatriculation</h3>
          <p>Commencez par saisir votre plaque. Vous pourrez ensuite renseigner les informations du véhicule manuellement.</p>
          <div className="immat-controls">
            <input aria-label="Immatriculation" placeholder="AA-123-BB" maxLength={12}
              value={immatriculation} onChange={e=>{setImmatriculation(e.target.value.toUpperCase());setImmatMessage("");}}/>
            <button type="button" onClick={()=>setImmatMessage(immatriculation.trim()
              ? "Recherche automatique indisponible pour le moment : aucun service de consultation des immatriculations n'est connecté. Complétez les champs ci-dessous."
              : "Saisissez d'abord une immatriculation.")}>Rechercher</button>
          </div>
          {immatMessage&&<p className="immat-status" role="status">{immatMessage}</p>}
        </div>
        <h3 style={{color:"#0b2c69",margin:"0 0 16px"}}>2. Marque, modèle et caractéristiques</h3>
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

        </div>

        <h3 style={{margin:"25px 0 16px"}}>Caractéristiques du véhicule</h3>
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

        </div>
        <div className="fields" style={{marginTop:18}}>
          <label className="field">État du véhicule
            <select value={etat} onChange={e=>setEtat(e.target.value)}>{["0 km","À réparer","Neuf","Non roulant","Pour pièces","Occasion","Reconditionné"].map(v=><option key={v}>{v}</option>)}</select>
          </label>
          <label className="field">Garantie (mois)
            <input type="number" min="0" max="120" placeholder="Ex. 12" value={garantieMois} onChange={e=>setGarantieMois(e.target.value)}/>
          </label>
          <label className="field">TVA récupérable
            <select value={tva} onChange={e=>setTva(e.target.value)}><option value="non">Non</option><option value="oui">Oui</option></select>
          </label>
        </div>
        <div className="checkbox-row">
          <label><input type="checkbox" checked={carnet} onChange={e=>setCarnet(e.target.checked)}/> Carnet d’entretien</label>
          <label><input type="checkbox" checked={factures} onChange={e=>setFactures(e.target.checked)}/> Factures d’entretien</label>
          <label><input type="checkbox" checked={importe} onChange={e=>setImporte(e.target.checked)}/> Véhicule importé</label>
          <label><input type="checkbox" checked={ct} onChange={e=>setCt(e.target.checked)}/> Contrôle technique OK</label>
        </div>
        <div className="step-actions"><span/><button type="button" onClick={()=>aller(2)}>Suivant : équipements →</button></div>
            </section>
      <section className="form-section" id="etape-2">
        <h2 className="section-title"><span className="section-number">2</span> Équipements et options</h2>
        <div className="equip-list">{optionsAuto.map(option=><label key={option}><input type="checkbox" checked={options.includes(option)} onChange={()=>toggleOption(option)}/>{option}</label>)}</div>
        <div className="step-actions"><button className="previous" type="button" onClick={()=>aller(1)}>← Précédent</button><button type="button" onClick={()=>aller(3)}>Suivant : photos →</button></div>
      </section>
      <section className="form-section" id="etape-3">
        <h2 className="section-title"><span className="section-number">3</span> Photos et vidéo du véhicule</h2>
        <OrderedPhotos files={photos} onChange={setPhotos}/>
        <div className="video-input"><strong>Ajouter une vidéo (facultatif, 1 maximum)</strong>
          <input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={e=>{
            const f=e.target.files?.[0]??null;
            if(f&&f.size>200*1024*1024){setMessage("La vidéo ne doit pas dépasser 200 Mo.");setVideo(null);return;}
            setVideo(f);
          }}/>
          {video&&<p>Vidéo sélectionnée : {video.name} <button type="button" onClick={()=>setVideo(null)}>Retirer</button></p>}
          <p>MP4, MOV ou WebM — 200 Mo maximum.</p>
        </div>
        <div className="step-actions"><button className="previous" type="button" onClick={()=>aller(2)}>← Précédent</button><button type="button" onClick={()=>aller(4)}>Suivant : description →</button></div>
      </section>
      <section className="form-section" id="etape-4">
        <h2 className="section-title"><span className="section-number">4</span> Description et prix</h2>
        <div className="fields">
          <label className="field">Titre de l'annonce
            <input value={titre} maxLength={120} placeholder="Ex. BMW X5 xDrive 30d — 2022" onChange={e=>setTitre(e.target.value)}/>
          </label>
          <label className="field">Prix demandé (€) *
            <input type="number" value={form.prix} min="1" placeholder="Ex. 16900" onChange={e=>setForm({...form,prix:e.target.value})}/>
          </label>
          <label className="field full">Description de votre voiture
            <textarea rows={7} maxLength={2000} value={form.description} placeholder="État général, historique, entretien, informations utiles…" onChange={e=>setForm({...form,description:e.target.value})}/>
            <span>{form.description.length} / 2000 caractères</span>
          </label>
        </div>
        <div className="step-actions"><button className="previous" type="button" onClick={()=>aller(3)}>← Précédent</button><button type="button" onClick={()=>aller(5)}>Suivant : localisation →</button></div>
      </section>
      <section className="form-section" id="etape-5">
        <h2 className="section-title"><span className="section-number">5</span> Coordonnées et localisation en France</h2>
        <p>Choisissez une commune française : le code postal et la carte se remplissent automatiquement. La localisation publique est celle du centre de la commune.</p>
        <FranceLocation selected={localisation} onChange={setLocalisation}/>
        <div className="fields" style={{marginTop:18}}>
          <label className="field">Téléphone (facultatif)<input type="tel" value={telephone} placeholder="Votre téléphone" onChange={e=>setTelephone(e.target.value)}/></label>
          <label className="field">E-mail de contact (facultatif)<input type="email" value={email} placeholder="Votre e-mail" onChange={e=>setEmail(e.target.value)}/></label>
        </div>
        <div className="step-actions"><button className="previous" type="button" onClick={()=>aller(4)}>← Précédent</button><button type="button" onClick={()=>aller(6)}>Suivant : récapitulatif →</button></div>
      </section>
      <section className="form-section" id="etape-6">
        <h2 className="section-title"><span className="section-number">6</span> Récapitulatif avant publication</h2>
        <div style={{background:"#f2f7ff",padding:20,borderRadius:14,lineHeight:1.9}}>
          <strong>{titre||[form.marque,form.modele,form.finition].filter(Boolean).join(" ")||"Votre annonce automobile"}</strong>
          <div>Marque / modèle : {form.marque||"À compléter"} — {form.modele||"À compléter"}</div>
          <div>Année : {form.annee||"—"} · Kilométrage : {form.kilometrage||"—"} km · Énergie : {form.carburant||"—"}</div>
          <div>État : {etat} · Garantie : {garantieMois?garantieMois+" mois":"Non renseignée"} · TVA récupérable : {tva==="oui"?"Oui":"Non"}</div>
          <div>Équipements : {options.length} sélectionnés · Photos : {photos.length}/10 · Vidéo : {video?"Oui":"Non"}</div>
          <div>Prix : {form.prix?Number(form.prix).toLocaleString("fr-FR")+" €":"À compléter"}</div>
          <div>Localisation : {localisation?localisation.nom+" ("+localisation.codePostal+")":"À sélectionner — France uniquement"}</div>
        </div>
        <p>Vous pouvez revenir à chaque étape pour modifier les informations avant publication.</p>
        <div className="step-actions"><button className="previous" type="button" onClick={()=>aller(5)}>← Précédent</button><button type="button" onClick={()=>aller(7)}>Suivant : publication →</button></div>
      </section>
      <section className="form-section" id="etape-7">
        <h2 className="section-title"><span className="section-number">7</span> Publication de votre annonce</h2>
        <label style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:20,fontWeight:700}}>
          <input type="checkbox" checked={confirm} onChange={e=>setConfirm(e.target.checked)}/>
          Je confirme l'exactitude des informations fournies et j'accepte les conditions de publication.
        </label>
        <p>La publication nécessite un compte connecté. Les photos sont enregistrées dans l'ordre choisi.</p>
        <button className="publish" type="button" disabled={publicationEnCours} onClick={publier}>{publicationEnCours?"Enregistrement en cours…":"＋ Publier mon annonce"}</button>
        {message&&<p className="feedback" role="status">{message}</p>}
        <div className="step-actions"><button className="previous" type="button" onClick={()=>aller(6)}>← Modifier le récapitulatif</button></div>
      </section>
      </div></div>
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
