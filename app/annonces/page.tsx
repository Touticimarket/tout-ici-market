"use client";

import {useEffect,useMemo,useState} from "react";
import {Search,MapPin,ArrowRight,Plus,RotateCcw} from "lucide-react";
import {supabase} from "../lib/supabaseClient";
import {depotCategories} from "../deposer/categories";

type AnnonceCarte={
  id:string;source:"market"|"auto";categorie:string;sousCategorie:string;
  titre:string;description:string;prix:number|null;ville:string;photo:string|null;created_at:string;
};
const euros=(n:number|null)=>n==null?"Prix à contacter":new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n);
const valideCategorie=(v:string)=>v==="toutes"||depotCategories.some(c=>c.slug===v);

export default function ToutesAnnonces(){
  const [categorie,setCategorie]=useState("toutes");
  const [recherche,setRecherche]=useState("");
  const [ville,setVille]=useState("");
  const [annonces,setAnnonces]=useState<AnnonceCarte[]>([]);
  const [charge,setCharge]=useState(false);
  const [erreur,setErreur]=useState("");

  useEffect(()=>{
    const valeur=new URLSearchParams(window.location.search).get("categorie")||"toutes";
    if(valideCategorie(valeur))setCategorie(valeur);
    let actif=true;
    async function charger(){
      const [marche,auto]=await Promise.all([
        supabase.from("annonces_marketplace")
          .select("id,categorie,sous_categorie,titre,description,prix,ville,photos,created_at")
          .eq("statut","publiee").order("created_at",{ascending:false}).limit(200),
        supabase.from("annonces_auto")
          .select("id,marque,modele,finition,description,prix,ville,created_at")
          .eq("statut","publiee").order("created_at",{ascending:false}).limit(100)
      ]);
      if(!actif)return;
      const lignes:AnnonceCarte[]=[];
      if(marche.data){
        for(const a of marche.data)lignes.push({
          id:String(a.id),source:"market",categorie:String(a.categorie),sousCategorie:String(a.sous_categorie),
          titre:String(a.titre),description:String(a.description||""),
          prix:a.prix==null?null:Number(a.prix),ville:String(a.ville||""),
          photo:Array.isArray(a.photos)&&a.photos.length?String(a.photos[0]):null,
          created_at:String(a.created_at)
        });
      }
      if(auto.data?.length){
        const ids=auto.data.map(a=>String(a.id));
        const media=await supabase.from("annonces_auto_photos")
          .select("annonce_id,url,ordre").in("annonce_id",ids).order("ordre",{ascending:true});
        if(!actif)return;
        const photos:Record<string,string>={};
        for(const photo of media.data||[]){
          if(!photos[String(photo.annonce_id)])photos[String(photo.annonce_id)]=String(photo.url);
        }
        for(const a of auto.data)lignes.push({
          id:String(a.id),source:"auto",categorie:"automobile",sousCategorie:"voiture",
          titre:[a.marque,a.modele,a.finition].filter(Boolean).join(" ")||"Voiture",
          description:String(a.description||""),prix:a.prix==null?null:Number(a.prix),
          ville:String(a.ville||""),photo:photos[String(a.id)]||null,
          created_at:String(a.created_at)
        });
      }
      lignes.sort((a,b)=>new Date(b.created_at).getTime()-new Date(a.created_at).getTime());
      setAnnonces(lignes);
      if(marche.error||auto.error)setErreur("Certaines annonces n'ont pas pu être chargées. Essayez à nouveau.");
      setCharge(true);
    }
    charger();
    return ()=>{actif=false};
  },[]);

  const visibles=useMemo(()=>annonces.filter(a=>{
    if(categorie!=="toutes"&&a.categorie!==categorie)return false;
    if(ville.trim()&&!a.ville.toLocaleLowerCase("fr").includes(ville.trim().toLocaleLowerCase("fr")))return false;
    if(recherche.trim()&&![a.titre,a.description,a.sousCategorie].join(" ")
      .toLocaleLowerCase("fr").includes(recherche.trim().toLocaleLowerCase("fr")))return false;
    return true;
  }),[annonces,categorie,recherche,ville]);

  const categoryName=(slug:string)=>depotCategories.find(c=>c.slug===slug)?.nom||"Annonces";

  function filtreCategorie(slug:string){
    setCategorie(slug);
    const u=new URL(window.location.href);
    if(slug==="toutes")u.searchParams.delete("categorie");else u.searchParams.set("categorie",slug);
    window.history.replaceState(null,"",u.pathname+u.search);
  }

  return <main className="annonces-list">
    <style>{`
      .annonces-list{min-height:100vh;font-family:Arial,sans-serif;background:#f4f7fc;color:#092655}
      .annonces-list *{box-sizing:border-box}
      .annonces-wrap{max-width:1370px;margin:0 auto;padding:100px 22px 80px}
      .annonces-head{background:linear-gradient(110deg,#063ca6,#0a60bd);border-radius:21px;padding:36px 39px;color:white}
      .annonces-head h1{font-size:clamp(28px,4vw,44px);margin:0 0 10px}
      .annonces-head p{font-size:16px;line-height:1.5;margin:0 0 20px}
      .annonces-search{display:flex;gap:10px;flex-wrap:wrap}
      .annonces-search input{padding:14px 17px;flex:1 1 230px;min-width:0;border:1px solid #cee0f9;border-radius:11px;font:inherit;color:#092655;background:white}
      .annonces-search a{padding:14px 18px;background:#ffcb1c;border-radius:11px;text-decoration:none;color:#082956;font-weight:800;display:flex;align-items:center;gap:8px}
      .annonces-tags{display:flex;gap:8px;overflow-x:auto;padding:19px 0 12px}
      .annonces-tag{cursor:pointer;flex-shrink:0;border:1px solid #d4e0f0;border-radius:100px;background:#fff;color:#1c457f;padding:10px 15px;font-size:13px;font-weight:800}
      .annonces-tag.active{background:#ffe277;color:#09244d;border-color:#ffd02b}
      .annonces-section{padding:21px;background:#fff;border-radius:18px;border:1px solid #e1e8f4;margin-top:10px}
      .annonces-section-head{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:19px}
      .annonces-section h2{font-size:24px;margin:0}
      .annonces-resultats{font-size:13px;color:#697a90}
      .annonces-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:15px}
      .annonces-card{display:block;border:1px solid #dce6f2;border-radius:15px;overflow:hidden;color:#112b57;text-decoration:none;background:white;box-shadow:0 5px 20px #09265512}
      .annonces-card:hover{border-color:#fecb2b;transform:translateY(-2px)}
      .annonces-photo{height:160px;display:grid;place-items:center;background:linear-gradient(135deg,#e4effe,#f8fbff);font-size:46px}
      .annonces-photo img{width:100%;height:100%;object-fit:cover}
      .annonces-card-body{padding:15px}
      .annonces-card-body h3{font-size:16px;line-height:1.3;margin:11px 0 9px}
      .annonces-category{font-size:11px;color:#0647ac;font-weight:800}
      .annonces-price{font-size:21px;font-weight:900;color:#063b9a}
      .annonces-location{font-size:12px;color:#718098;display:flex;align-items:center;gap:4px}
      .annonces-empty{padding:43px 20px;background:#f9fbff;border:1px dashed #cad9ed;border-radius:16px;text-align:center}
      .annonces-empty p{color:#607189;line-height:1.6}
      .annonces-empty a{display:inline-flex;gap:8px;align-items:center;background:#ffcf28;color:#092859;padding:13px 17px;border-radius:11px;font-weight:800;text-decoration:none}
      @media(max-width:1090px){.annonces-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
      @media(max-width:780px){.annonces-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.annonces-wrap{padding:100px 12px 60px}.annonces-head{padding:28px 20px}}
      @media(max-width:490px){.annonces-grid{grid-template-columns:1fr}.annonces-card{display:grid;grid-template-columns:130px minmax(0,1fr)}.annonces-photo{height:100%}.annonces-card-body h3{font-size:14px}.annonces-price{font-size:18px}}
    `}</style>
    <div className="annonces-wrap">
      <header className="annonces-head">
        <h1>Découvrez toutes les annonces</h1>
        <p>Automobiles, motos, immobilier, emploi, maison, loisirs… Retrouvez les annonces réellement publiées sur TOUT ICI MARKET.</p>
        <div className="annonces-search">
          <input type="search" value={recherche} onChange={e=>setRecherche(e.target.value)} aria-label="Rechercher une annonce" placeholder="Que recherchez-vous ?"/>
          <input value={ville} onChange={e=>setVille(e.target.value)} aria-label="Filtrer par ville" placeholder="Ville ou commune"/>
          <a href="/deposer"><Plus size={18}/> Déposer une annonce</a>
        </div>
      </header>
      <nav className="annonces-tags" aria-label="Filtrer les annonces par catégorie">
        <button type="button" className={"annonces-tag"+(categorie==="toutes"?" active":"")} onClick={()=>filtreCategorie("toutes")}>Toutes</button>
        {depotCategories.map(c=><button type="button" key={c.slug} className={"annonces-tag"+(categorie===c.slug?" active":"")}
          onClick={()=>filtreCategorie(c.slug)}>{c.icone} {c.nom}</button>)}
      </nav>
      <section className="annonces-section">
        <div className="annonces-section-head">
          <h2>{categorie==="toutes"?"Toutes les catégories":categoryName(categorie)}</h2>
          <span className="annonces-resultats">{!charge?"Chargement…":visibles.length+" annonce"+(visibles.length!==1?"s":"")}</span>
        </div>
        {erreur&&<p role="status" style={{color:"#815a00",fontSize:13}}>{erreur}</p>}
        {!charge?<p>Recherche des annonces en cours…</p>:visibles.length?
          <div className="annonces-grid">
            {visibles.map(a=><a href={"/annonces/"+(a.source==="auto"?"auto-":"")+a.id}
              className="annonces-card" key={a.source+a.id}>
              <div className="annonces-photo">{a.photo?<img src={a.photo} alt={a.titre} loading="lazy"/>:<span>📷</span>}</div>
              <div className="annonces-card-body">
                <span className="annonces-category">{categoryName(a.categorie)} · {a.sousCategorie}</span>
                <h3>{a.titre}</h3>
                <div className="annonces-price">{euros(a.prix)}</div>
                <p className="annonces-location"><MapPin size={13}/>{a.ville||"France"}</p>
              </div>
            </a>)}
          </div>:
          <div className="annonces-empty">
            <div style={{fontSize:42}}>🔎</div>
            <h3>Aucune annonce pour cette sélection</h3>
            <p>Les annonces seront visibles dès leur publication. Vous pouvez être le premier à proposer un article ou un service.</p>
            <a href="/deposer"><Plus size={16}/> Déposer une annonce</a>
          </div>}
      </section>
    </div>
  </main>;
}
