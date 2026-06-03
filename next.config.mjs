import { MapPin, Search } from "lucide-react";
export default function SearchBar() {
  return <div className="mx-auto max-w-5xl -mt-10 relative z-20 rounded-2xl bg-white shadow-soft border border-slate-100 p-3 grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_auto] gap-2">
    <div className="flex items-center gap-3 px-4"><Search size={26}/><input className="w-full outline-none" placeholder="Que recherchez-vous ?" /></div>
    <div className="flex items-center gap-3 px-4 border-t md:border-t-0 md:border-l border-slate-200"><MapPin size={24}/><input className="w-full outline-none" placeholder="Ville, code postal..." /></div>
    <select className="px-4 outline-none font-bold border-t md:border-t-0 md:border-l border-slate-200">
      <option>Toutes les catégories</option><option>Automobile</option><option>Immobilier</option><option>Emploi & Services</option>
    </select>
    <button className="rounded-xl bg-touticiBlue px-8 py-4 text-white font-black">Rechercher</button>
  </div>;
}
