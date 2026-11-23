"use client";

import {useEffect,useMemo,useRef,useState} from "react";
import {ArrowLeft,ArrowRight,Clock3,ShieldCheck,Trash2} from "lucide-react";
import {
  activerHistorique,effacerHistorique,historiqueActif,lireHistorique,
  HISTORIQUE_EVENT,VisiteRecente,RubriqueHistorique
} from "./SuiviNavigation";

const rubriques:RubriqueHistorique[]=[
  "Automobile & Véhicules","Immobilier","Emploi & Services","Autres catégories"
];
const icones:Record<RubriqueHistorique,string>={
  "Automobile & Véhicules":"🚘",
  "Immobilier":"🏡",
  "Emploi & Services":"💼",
  "Autres catégories":"📦"
};

function BandeauCategorie({nom,visites}:{nom:RubriqueHistorique;visites:VisiteRecente[]}){
  const track=useRef<HTMLDivElement>(null);
  function bouger(direction:-1|1){
    track.current?.scrollBy({left:direction*Math.max(220,track.current.clientWidth*.8),behavior:"smooth"});
  }
  return <section className="recents-group" aria-label={"Dernières visites : "+nom}>
    <div className="recents-group-head">
      <h3>{icones[nom]} {nom}</h3>
      <div className="recents-arrows">
        <button type="button" aria-label={"Défiler "+nom+" vers la gauche"} onClick={()=>bouger(-1)}><ArrowLeft size={18}/></button>
        <button type="button" aria-label={"Défiler "+nom+" vers la droite"} onClick={()=>bouger(1)}><ArrowRight size={18}/></button>
      </div>
    </div>
    <div className="recents-track" ref={track}>
      {visites.map(v=><a key={v.href} className="recents-item" href={v.href}>
        <span className="recents-item-icon" aria-hidden="true">{icones[nom]}</span>
        <span className="recents-item-label">
          <strong>{v.titre}</strong>
          <small>Consulté {new Intl.DateTimeFormat("fr-FR",{day:"numeric",month:"short"}).format(new Date(v.date))}</small>
        </span>
        <ArrowRight size={17} aria-hidden="true"/>
      </a>)}
    </div>
  </section>;
}

export default function DernieresVisites(){
  const [actif,setActif]=useState(false);
  const [visites,setVisites]=useState<VisiteRecente[]>([]);
  const [charge,setCharge]=useState(false);
  useEffect(()=>{
    const synchroniser=()=>{setActif(historiqueActif());setVisites(lireHistorique());setCharge(true)};
    synchroniser();
    window.addEventListener(HISTORIQUE_EVENT,synchroniser);
    window.addEventListener("storage",synchroniser);
    return ()=>{
      window.removeEventListener(HISTORIQUE_EVENT,synchroniser);
      window.removeEventListener("storage",synchroniser);
    };
  },[]);
  const groupes=useMemo(()=>rubriques.map(nom=>({
    nom,visites:visites.filter(v=>v.rubrique===nom).slice(0,12)
  })).filter(g=>g.visites.length>0).slice(0,4),[visites]);

  return <section className="recents-root" aria-label="Récemment consultés">
    <style>{`
      .recents-root{max-width:1460px;margin:8px auto 28px;padding:0 34px;font-family:Arial,Helvetica,sans-serif;color:#0b2554}
      .recents-root *{box-sizing:border-box}
      .recents-header{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:14px}
      .recents-header h2{display:flex;align-items:center;gap:9px;font-size:20px;margin:0}
      .recents-header p{color:#64738b;font-size:12px;margin:5px 0 0}
      .recents-control{color:#0646b6;background:#f3f7ff;border:1px solid #d9e5f5;border-radius:10px;padding:9px 12px;font-size:12px;font-weight:750;cursor:pointer;display:inline-flex;gap:7px;align-items:center}
      .recents-control:hover{background:#eaf2ff}
      .recents-consent{border:1px solid #dce7f5;border-radius:16px;background:#f8fbff;padding:18px 20px;display:flex;gap:14px;justify-content:space-between;align-items:center;flex-wrap:wrap}
      .recents-consent p{margin:0;max-width:680px;font-size:13px;line-height:1.6;color:#556982}
      .recents-activate{border:0;background:#ffd22a;color:#072c6a;font-size:13px;font-weight:800;border-radius:11px;padding:12px 18px;cursor:pointer}
      .recents-group{margin:14px 0 18px;border:1px solid #e3ebf5;border-radius:15px;background:#fff;padding:15px 16px 17px}
      .recents-group-head{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:12px}
      .recents-group h3{margin:0;color:#082e72;font-size:16px}
      .recents-arrows{display:flex;gap:7px}
      .recents-arrows button{display:grid;place-items:center;width:30px;height:30px;border:1px solid #dae5f3;border-radius:9px;background:#f7faff;color:#0750c4;cursor:pointer}
      .recents-arrows button:hover{background:#e6f0ff}
      .recents-track{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:thin;scroll-padding-inline:2px;padding-bottom:4px}
      .recents-item{display:flex;align-items:center;gap:11px;flex:0 0 245px;min-height:78px;scroll-snap-align:start;border:1px solid #e3eaf4;border-radius:12px;padding:12px;text-decoration:none;color:#14305e;background:linear-gradient(115deg,#fffdf7,#f7fbff)}
      .recents-item:hover{border-color:#ffcd34;background:#fff8e9}
      .recents-item-icon{font-size:27px}
      .recents-item-label{display:flex;flex-direction:column;gap:7px;min-width:0;flex:1}
      .recents-item-label strong{font-size:13px;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .recents-item-label small{font-size:11px;color:#748197}
      .recents-empty{font-size:13px;border:1px dashed #d5e0ef;border-radius:14px;color:#66758b;padding:21px;background:#f9fbfe}
      @media(max-width:640px){.recents-root{padding:0 12px}.recents-item{flex-basis:82%}.recents-consent{padding:15px}}
    `}</style>
    <div className="recents-header">
      <div><h2><Clock3 size={22} color="#0752be"/> Vos dernières consultations</h2>
        <p>Jusqu'à quatre bandeaux par rubrique, uniquement sur cet appareil.</p>
      </div>
      {actif&&<button className="recents-control" type="button" onClick={effacerHistorique}>
        <Trash2 size={15}/> Effacer et désactiver l'historique
      </button>}
    </div>
    {!charge?null:!actif?
      <div className="recents-consent">
        <p><ShieldCheck size={17} style={{verticalAlign:"middle",marginRight:5}}/>
          Retrouvez vos rubriques récemment visitées en activant un historique local facultatif.
          Il reste sur ce navigateur, n'est pas transmis au serveur et peut être effacé à tout moment.
        </p>
        <button type="button" className="recents-activate" onClick={activerHistorique}>Activer mes dernières visites</button>
      </div>
      :groupes.length?groupes.map(g=><BandeauCategorie key={g.nom} nom={g.nom} visites={g.visites}/>):
      <div className="recents-empty">Votre historique est vide. Visitez Automobile & Véhicules, Immobilier ou une autre catégorie, puis revenez ici : elles apparaîtront dans vos bandeaux.</div>}
  </section>;
}
