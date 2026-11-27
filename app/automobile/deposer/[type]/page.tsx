"use client";
import {useParams} from "next/navigation";
import {useState} from "react";
import {supabase} from "../../../lib/supabaseClient";
import {FranceLocation,OrderedPhotos,type Commune} from "../PhotosLocalisation";

type Choice={name:string;dbType:string};
type Field={name:string;label:string;placeholder?:string};
type Config={title:string;description:string;choices:Choice[];extras:Field[];image:string};
const configs:Record<string,Config>={
 motos:{title:"Motos, scooters & quads",description:"Déposez votre moto, scooter, trois-roues ou quad.",image:"/auto-reel/motos.svg",
  choices:[{name:"Moto",dbType:"moto"},{name:"Scooter",dbType:"scooter"},{name:"Trois-roues",dbType:"moto"},{name:"Quad",dbType:"quad"}],
  extras:[{name:"cylindree",label:"Cylindrée (cm³)"},{name:"permis",label:"Permis nécessaire"},{name:"transmission",label:"Transmission"}]},
 caravaning:{title:"Camping-cars & caravanes",description:"Pour camping-cars, caravanes, cellules et véhicules de loisirs.",image:"/auto-reel/caravaning.svg",
  choices:[{name:"Camping-car",dbType:"camping-car"},{name:"Caravane",dbType:"caravane"},{name:"Cellule",dbType:"caravaning"}],
  extras:[{name:"longueur",label:"Longueur (m)"},{name:"couchages",label:"Nombre de couchages"},{name:"ptac",label:"PTAC (kg)"},{name:"etancheite",label:"Contrôle d’étanchéité"}]},
 "vans-amenages":{title:"Vans aménagés",description:"Vans, fourgons aménagés et minibus de loisirs.",image:"/auto-reel/vans-amenages.svg",
  choices:[{name:"Van aménagé",dbType:"van"},{name:"Fourgon aménagé",dbType:"fourgon-amenage"},{name:"Minibus aménagé",dbType:"vans-amenages"}],
  extras:[{name:"couchages",label:"Nombre de couchages"},{name:"longueur",label:"Longueur (m)"},{name:"homologation",label:"Homologation VASP"}]},
 utilitaires:{title:"Utilitaires",description:"Fourgonnettes, fourgons, pick-up et utilitaires.",image:"/auto-reel/utilitaires.svg",
  choices:[{name:"Fourgon",dbType:"utilitaire"},{name:"Fourgonnette",dbType:"utilitaire"},{name:"Pick-up",dbType:"utilitaire"},{name:"Autre utilitaire",dbType:"utilitaires"}],
  extras:[{name:"charge",label:"Charge utile (kg)"},{name:"volume",label:"Volume utile (m³)"},{name:"tva",label:"TVA récupérable"}]},
 camions:{title:"Camions",description:"Poids lourds, porteurs et tracteurs routiers.",image:"/auto-reel/camions.svg",
  choices:[{name:"Porteur",dbType:"camion"},{name:"Tracteur routier",dbType:"poids-lourd"},{name:"Camion benne",dbType:"camion"}],
  extras:[{name:"ptac",label:"PTAC (kg)"},{name:"essieux",label:"Nombre d’essieux"},{name:"charge",label:"Charge utile (kg)"}]},
 remorques:{title:"Remorques",description:"Remorques bagagères, plateaux et porte-véhicules.",image:"/auto-reel/remorques.svg",
  choices:[{name:"Bagagère",dbType:"remorque"},{name:"Plateau",dbType:"remorque"},{name:"Porte-voiture",dbType:"remorque"},{name:"Autre remorque",dbType:"remorques"}],
  extras:[{name:"ptac",label:"PTAC (kg)"},{name:"charge",label:"Charge utile (kg)"},{name:"dimensions",label:"Dimensions utiles"}]},
 velos:{title:"Vélos",description:"Vélo de route, VTT, vélo électrique, urbain ou enfant.",image:"/auto-reel/velos.svg",
  choices:[{name:"Vélo de route",dbType:"velo"},{name:"VTT",dbType:"velo"},{name:"Vélo électrique",dbType:"vae"},{name:"Vélo enfant",dbType:"velo"},{name:"Autre vélo",dbType:"velos"}],
  extras:[{name:"taille",label:"Taille du cadre"},{name:"roues",label:"Taille des roues"},{name:"batterie",label:"Batterie et autonomie (si électrique)"}]},
 nautisme:{title:"Nautisme",description:"Bateaux à moteur, voiliers, semi-rigides et jet-skis.",image:"/auto-reel/nautisme.svg",
  choices:[{name:"Bateau à moteur",dbType:"bateau"},{name:"Voilier",dbType:"voilier"},{name:"Jet-ski",dbType:"jet-ski"},{name:"Semi-rigide",dbType:"nautisme"}],
  extras:[{name:"longueur",label:"Longueur (m)"},{name:"largeur",label:"Largeur (m)"},{name:"moteur",label:"Type de moteur"},{name:"heures",label:"Heures moteur"}]},
 "autres-vehicules":{title:"Autres véhicules",description:"Tracteurs, machines et véhicules spécifiques.",image:"/auto-reel/autres-vehicules.svg",
  choices:[{name:"Tracteur agricole",dbType:"tracteur"},{name:"Engin spécialisé",dbType:"engin"},{name:"Autre véhicule",dbType:"autres-vehicules"}],
  extras:[{name:"heures",label:"Heures d’utilisation"},{name:"usage",label:"Usage principal"}]},
 "pieces-accessoires":{title:"Pièces & accessoires auto",description:"Pièces détachées, accessoires automobiles et équipements.",image:"/auto-reel/equipement-auto-icone.svg",
  choices:[{name:"Pièce détachée",dbType:"pieces-accessoires"},{name:"Équipement auto",dbType:"equipement-auto"},{name:"Accessoire",dbType:"pieces-accessoires"}],
  extras:[{name:"compatibilite",label:"Véhicules compatibles"},{name:"reference",label:"Référence de la pièce"}]},
 "equipement-caravaning":{title:"Équipement caravaning",description:"Auvents, mobilier, panneaux solaires et équipement de camping.",image:"/auto-reel/caravaning.svg",
  choices:[{name:"Équipement caravaning",dbType:"equipement-caravaning"}],
  extras:[{name:"compatibilite",label:"Modèle compatible"}]},
 "equipement-nautisme":{title:"Équipement nautisme",description:"Accessoires bateau, accastillage et équipements nautiques.",image:"/auto-reel/nautisme.svg",
  choices:[{name:"Équipement nautique",dbType:"equipement-nautisme"}],
  extras:[{name:"compatibilite",label:"Compatibilité"}]},
 "equipement-velos":{title:"Équipements vélos",description:"Casques, pièces et accessoires pour vélos.",image:"/auto-reel/velos.svg",
  choices:[{name:"Équipement vélo",dbType:"equipement-velos"}],
  extras:[{name:"compatibilite",label:"Compatibilité et taille"}]},
 "pneus-jantes":{title:"Pneus & Jantes",description:"Pneus auto, pneus moto, jantes et roues complètes.",image:"/auto-reel/equipement-auto-icone.svg",
  choices:[{name:"Pneu",dbType:"pneus-jantes"},{name:"Jante",dbType:"pneus-jantes"},{name:"Roue complète",dbType:"pneus-jantes"}],
  extras:[{name:"dimensions",label:"Dimensions des pneus ou jantes"},{name:"entraxe",label:"Entraxe et déport"}]},
 "entretien-consommables":{title:"Entretien & consommables",description:"Huiles, filtres et produits d’entretien.",image:"/auto-reel/equipement-auto-icone.svg",
  choices:[{name:"Produit d’entretien",dbType:"entretien-consommables"},{name:"Consommable",dbType:"entretien-consommables"}],
  extras:[{name:"reference",label:"Référence du produit"}]},
 "services-mecaniques":{title:"Services de réparation mécanique",description:"Prestations et services d'entretien ou réparation de véhicules.",image:"/auto-reel/services-mecaniques-icone.svg",
  choices:[{name:"Réparation",dbType:"services-mecaniques"},{name:"Entretien",dbType:"services-mecaniques"},{name:"Diagnostic",dbType:"services-mecaniques"}],
  extras:[{name:"service",label:"Prestation détaillée"},{name:"zone",label:"Zone d’intervention"}]}
};
const stepLabels=["Type et caractéristiques","Équipements & détails","Photos et vidéo","Description et prix","Localisation","Récapitulatif","Publication"];
export default function DeposerVehiculeSpecialise(){
 const params=useParams();const slug=typeof params.type==="string"?params.type:"";
 const config=configs[slug];
 const [stage,setStage]=useState(0);
 const [subtype,setSubtype]=useState("");
 const [f,setF]=useState<Record<string,string>>({});
 const [location,setLocation]=useState<Commune|null>(null);
 const [photos,setPhotos]=useState<File[]>([]);
 const [video,setVideo]=useState<File|null>(null);
 const [extras,setExtras]=useState<Record<string,string>>({});
 const [confirm,setConfirm]=useState(false);
 const [sending,setSending]=useState(false);
 const [notice,setNotice]=useState("");
 const field=(key:string,value:string)=>setF(o=>({...o,[key]:value}));
 if(!config)return <main style={{padding:30}}><h1>Catégorie de dépôt indisponible</h1><a href="/automobile/deposer">Choisir une catégorie</a></main>;
 const selected=config.choices.find(c=>c.name===subtype)||config.choices[0];
 const isEquipment=["pieces-accessoires","equipement-caravaning","equipement-nautisme","equipement-velos","pneus-jantes","entretien-consommables","services-mecaniques"].includes(slug);
 const next=()=>{setNotice("");if(stage===0&&(!subtype||!f.marque?.trim()||!f.modele?.trim())){setNotice("Renseignez le type, la marque et le modèle ou la référence.");return;}if(stage===3&&(!f.prix||Number(f.prix)<0||!f.description?.trim())){setNotice("Indiquez un prix et une description.");return;}if(stage===4&&!location){setNotice("Sélectionnez une commune française.");return;}setStage(o=>Math.min(o+1,6));window.scrollTo({top:0,behavior:"smooth"});};
 const previous=()=>{setNotice("");setStage(o=>Math.max(o-1,0));window.scrollTo({top:0,behavior:"smooth"});};
 async function publish(){
  if(!confirm){setNotice("Confirmez l’exactitude des informations avant publication.");return;}
  if(!location){setNotice("La localisation est obligatoire.");return;}
  const {data:{user}}=await supabase.auth.getUser();
  if(!user){setNotice("Connectez-vous à votre compte pour publier cette annonce.");return;}
  if(sending)return;setSending(true);setNotice("");
  try{
   const extraDescription=Object.entries(extras).filter(([,v])=>v.trim()).map(([key,value])=>key+" : "+value).join("\n");
   const {data:draft,error}=await supabase.from("annonces_auto").insert({
    user_id:user.id,statut:"brouillon",type_vehicule:selected.dbType,
    marque:f.marque.trim(),modele:f.modele.trim(),finition:f.finition||null,
    titre:f.titre?.trim()||[f.marque,f.modele,f.annee].filter(Boolean).join(" "),
    annee:f.annee?Number(f.annee):null,kilometrage:f.km?Number(f.km):null,
    puissance_ch:f.puissance?Number(f.puissance):null,carburant:f.energie||null,
    boite:f.boite||null,prix:Number(f.prix),
    ville:location.nom,code_postal:location.codePostal,code_insee:location.code,
    departement:location.departement,latitude:location.latitude,longitude:location.longitude,
    description:[f.description,extraDescription].filter(Boolean).join("\n\n"),
    options:(f.options||"").split(",").map(v=>v.trim()).filter(Boolean),
    etat_vehicule:f.etat||"Occasion",couleur:f.couleur||null,
    email_contact:f.email||null,telephone_contact:f.telephone||null,
    mia_verifie:false
   }).select("id").single();
   if(error||!draft)throw new Error(error?.message||"Création du brouillon impossible");
   const uploaded:string[]=[];
   for(let i=0;i<photos.length;i++){
    const file=photos[i];
    const ext=file.name.split(".").pop()?.toLowerCase()||"jpg";
    const key=user.id+"/"+draft.id+"/"+String(i+1).padStart(2,"0")+"-"+crypto.randomUUID()+"."+ext;
    const {error:upErr}=await supabase.storage.from("annonces-auto").upload(key,file,{contentType:file.type,upsert:false});
    if(upErr)throw new Error("Annonce enregistrée en brouillon, mais photo non envoyée : "+upErr.message);
    uploaded.push(supabase.storage.from("annonces-auto").getPublicUrl(key).data.publicUrl);
   }
   let videoUrl:string|null=null;
   if(video){
    const ext=video.name.split(".").pop()?.toLowerCase()||"mp4";
    const key=user.id+"/"+draft.id+"/video-"+crypto.randomUUID()+"."+ext;
    const {error:upErr}=await supabase.storage.from("annonces-auto-videos").upload(key,video,{contentType:video.type,upsert:false});
    if(upErr)throw new Error("Annonce enregistrée en brouillon, mais vidéo non envoyée : "+upErr.message);
    videoUrl=supabase.storage.from("annonces-auto-videos").getPublicUrl(key).data.publicUrl;
   }
   const {error:pubErr}=await supabase.from("annonces_auto").update({photos:uploaded,video_url:videoUrl,statut:"publiee"}).eq("id",draft.id).eq("user_id",user.id);
   if(pubErr)throw new Error("Annonce en brouillon : "+pubErr.message);
   setNotice("Annonce publiée avec succès ! Consultez-la dans votre compte.");
  }catch(e){setNotice(e instanceof Error?e.message:"La publication a échoué.");}
  finally{setSending(false);}
 }
 const renderField=(id:string,label:string,placeholder="",type="text")=><label key={id}>{label}<input type={type} value={f[id]||""} placeholder={placeholder} onChange={e=>field(id,e.target.value)}/></label>;
 return <main className="depot-vehicule-type">
 <style>{`
  .depot-vehicule-type{font-family:Arial,sans-serif;color:#08275e;background:#f5f8fe;padding:10px clamp(12px,2vw,30px) 45px;min-height:90vh}
  .depot-vehicule-type *{box-sizing:border-box}
  .depot-vehicule-type .back{color:#0b4c99;font-weight:850;text-decoration:none;font-size:14px}
  .depot-vehicule-type .top{margin:12px 0 15px;background:linear-gradient(112deg,#073d89,#061e59);padding:19px 23px;border-radius:17px;color:#fff;display:flex;align-items:center;gap:18px}
  .depot-vehicule-type .top img{width:146px;height:91px;object-fit:cover;border-radius:12px;background:#e6f1ff}
  .depot-vehicule-type .top h1{font-size:clamp(24px,2.2vw,36px);margin:0 0 6px}
  .depot-vehicule-type .top p{font-size:15px;margin:0;line-height:1.4}
  .depot-vehicule-type .steps{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px;margin:13px 0 17px}
  .depot-vehicule-type .steps button{padding:12px 5px;background:white;color:#0b306b;border:1px solid #d7e4f5;border-radius:9px;font-size:12px;line-height:1.3;font-weight:800;cursor:pointer}
  .depot-vehicule-type .steps button.active{background:#ffce08;border-color:#efb900;color:#081e4a}
  .depot-vehicule-type .panel{background:#fff;border:1px solid #dce5f2;border-radius:17px;padding:clamp(18px,2.4vw,30px);max-width:1060px;margin:0 auto;box-shadow:0 3px 17px #0e326515}
  .depot-vehicule-type .panel h2{font-size:clamp(21px,1.75vw,28px);margin:0 0 19px}
  .depot-vehicule-type .fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px}
  .depot-vehicule-type label{display:flex;flex-direction:column;gap:7px;color:#0b2d66;font-weight:800;font-size:14px}
  .depot-vehicule-type input,.depot-vehicule-type select,.depot-vehicule-type textarea{width:100%;border:1px solid #bacde5;border-radius:10px;padding:13px;font-family:inherit;font-size:15px;background:#fff;color:#0a2456}
  .depot-vehicule-type textarea{min-height:155px;resize:vertical}
  .depot-vehicule-type .row{display:flex;justify-content:space-between;gap:12px;margin-top:22px}
  .depot-vehicule-type button.navigation,.depot-vehicule-type button.publish{border:0;border-radius:11px;background:#ffcc00;color:#061e48;padding:13px 23px;font-size:16px;font-weight:900;cursor:pointer}
  .depot-vehicule-type button.navigation.secondary{background:#e7eef9}
  .depot-vehicule-type button:disabled{opacity:.48;cursor:not-allowed}
  .depot-vehicule-type .notice{padding:12px;border-radius:9px;margin-top:14px;background:#fff2c6;font-weight:750}
  .depot-vehicule-type .recap{display:grid;grid-template-columns:160px 1fr;gap:9px;font-size:15px}
  .depot-vehicule-type .recap b{color:#0a3975}
  @media(max-width:780px){.depot-vehicule-type .steps{display:flex;overflow-x:auto}.depot-vehicule-type .steps button{flex:0 0 112px}.depot-vehicule-type .fields{grid-template-columns:1fr}.depot-vehicule-type .top img{width:100px;height:75px}.depot-vehicule-type .recap{grid-template-columns:1fr}}
 `}</style>
 <a className="back" href="/automobile/deposer">← Choisir un autre type de véhicule</a>
 <header className="top"><img src={config.image} alt=""/><div><h1>Déposer une annonce — {config.title}</h1><p>{config.description} • Dépôt guidé en 7 étapes, sans publicité.</p></div></header>
 <nav className="steps" aria-label="Étapes du dépôt">{stepLabels.map((name,i)=><button key={name} type="button" className={i===stage?"active":""} onClick={()=>{setStage(i);setNotice("");}}>{i+1}. {name}</button>)}</nav>
 <section className="panel">
 {stage===0&&<><h2>1. Quel véhicule ou équipement proposez-vous ?</h2><div className="fields">
 <label>Type de {isEquipment?"produit ou service":"véhicule"}<select value={subtype} onChange={e=>setSubtype(e.target.value)}><option value="">Choisir une sous-catégorie</option>{config.choices.map(c=><option key={c.name}>{c.name}</option>)}</select></label>
 {renderField("marque",isEquipment?"Marque ou fabricant":"Marque","Saisir la marque")}
 {renderField("modele",isEquipment?"Modèle ou référence":"Modèle","Saisir le modèle")}
 {renderField("finition","Version / finition (facultatif)")}
 {renderField("annee","Année","","number")}
 {renderField("km",isEquipment?"Utilisation (si applicable)":"Kilométrage (km)","","number")}
 </div></>}
 {stage===1&&<><h2>2. Caractéristiques spécifiques</h2><div className="fields">
 {config.extras.map(e=><label key={e.name}>{e.label}<input value={extras[e.label]||""} onChange={ev=>setExtras(o=>({...o,[e.label]:ev.target.value}))} placeholder={e.placeholder||e.label}/></label>)}
 <label>Énergie / carburant<select value={f.energie||""} onChange={e=>field("energie",e.target.value)}><option value="">Non renseigné</option>{["Essence","Diesel","Hybride","Électrique","GPL","Autre","Sans objet"].map(x=><option key={x}>{x}</option>)}</select></label>
 <label>Boîte / transmission<select value={f.boite||""} onChange={e=>field("boite",e.target.value)}><option value="">Non renseignée</option>{["Manuelle","Automatique","Autre","Sans objet"].map(x=><option key={x}>{x}</option>)}</select></label>
 {renderField("puissance","Puissance (ch, si applicable)","","number")}
 {renderField("couleur","Couleur")}
 <label>État<select value={f.etat||"Occasion"} onChange={e=>field("etat",e.target.value)}>{["0 km","Neuf","Occasion","Reconditionné","À réparer","Non roulant","Pour pièces"].map(x=><option key={x}>{x}</option>)}</select></label>
 {renderField("options","Équipements ou options (séparés par des virgules)","Ex. ABS, attelage, GPS")}
 </div></>}
 {stage===2&&<><h2>3. Photos et vidéo</h2><p>Jusqu'à 10 photos : vous pouvez les réorganiser avant la publication.</p><OrderedPhotos files={photos} onChange={setPhotos}/><label>Vidéo facultative<input type="file" accept="video/mp4,video/quicktime,video/webm" onChange={e=>setVideo(e.target.files?.[0]||null)}/></label></>}
 {stage===3&&<><h2>4. Décrivez votre annonce</h2><div className="fields">{renderField("titre","Titre de l’annonce",config.title+" — marque et modèle")}{renderField("prix","Prix demandé (€)","","number")}</div><label style={{marginTop:16}}>Description<textarea value={f.description||""} placeholder="État, historique, équipements, précisions sur la vente..." onChange={e=>field("description",e.target.value)}/></label></>}
 {stage===4&&<><h2>5. Localisation et coordonnées</h2><p>Choisissez une commune française dans la liste.</p><FranceLocation selected={location} onChange={setLocation}/><div className="fields" style={{marginTop:18}}>{renderField("email","E-mail de contact","","email")}{renderField("telephone","Téléphone de contact","","tel")}</div></>}
 {stage===5&&<><h2>6. Récapitulatif</h2><div className="recap"><b>Catégorie</b><span>{config.title}</span><b>Type</b><span>{subtype||"À préciser"}</span><b>Marque / modèle</b><span>{f.marque} {f.modele}</span><b>Année / km</b><span>{f.annee||"—"} / {f.km||"—"}</span><b>Prix</b><span>{f.prix||"—"} €</span><b>Commune</b><span>{location?.nom||"—"}</span><b>Photos</b><span>{photos.length}</span><b>Description</b><span>{f.description||"—"}</span></div><p>Vous pouvez revenir aux étapes précédentes pour apporter des corrections.</p></>}
 {stage===6&&<><h2>7. Publier votre annonce</h2><p>Dernière vérification avant de rendre votre annonce visible sur TOUT ICI ANNONCES.</p><label style={{display:"flex",flexDirection:"row",alignItems:"center",gap:9}}><input type="checkbox" style={{width:18,height:18}} checked={confirm} onChange={e=>setConfirm(e.target.checked)}/> Je confirme que les informations sont exactes et que je suis autorisé à publier cette annonce.</label><button type="button" className="publish" style={{marginTop:20}} disabled={sending} onClick={publish}>{sending?"Publication en cours…":"Publier mon annonce"}</button></>}
 {notice&&<div className="notice" role="status">{notice}</div>}
 <div className="row"><button className="navigation secondary" type="button" disabled={stage===0} onClick={previous}>← Précédent</button>{stage<6&&<button className="navigation" type="button" onClick={next}>Continuer →</button>}</div>
 </section>
 </main>;
}
