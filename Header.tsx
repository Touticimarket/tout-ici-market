import Header from "@/components/Header";
export default function Deposer() {
  return <main><Header/><section className="mx-auto max-w-4xl px-6 py-12"><h1 className="text-4xl font-black">Déposer une annonce</h1><p className="mt-3 text-slate-600">Choisis une catégorie pour démarrer le dépôt intelligent.</p><div className="grid md:grid-cols-3 gap-4 mt-8">{["Automobile","Immobilier","Moto","Emploi & Services","Univers Maison & Loisirs","Nautisme"].map(cat=><button key={cat} className="rounded-2xl border border-slate-200 bg-white p-6 text-left font-black shadow-sm hover:shadow-soft">{cat}</button>)}</div></section></main>;
}
