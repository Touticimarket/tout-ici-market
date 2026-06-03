import { CalendarDays, Heart, MapPin } from "lucide-react";
const listings = [
  {title:"Audi A3 Sportback",price:"14 500 €",city:"Lyon (69000)",info:"2020 · Diesel · 78 000 km",img:"🚗"},
  {title:"Appartement T3",price:"235 000 €",city:"Bordeaux (33000)",info:"68 m² · 2 ch. · 1 sdb",img:"🏠"},
  {title:"iPhone 13 128 Go",price:"650 €",city:"Marseille (13000)",info:"Très bon état",img:"📱"},
  {title:"Canapé 3 places",price:"450 €",city:"Toulouse (31000)",info:"Très bon état",img:"🛋️"},
  {title:"Vélo tout chemin",price:"180 €",city:"Nantes (44000)",info:"21 vitesses · Taille M",img:"🚲"}
];
export default function PopularListings() {
  return <section id="annonces" className="mx-auto max-w-7xl px-4 md:px-8 pb-16">
    <div className="flex items-center justify-between mb-5"><h2 className="text-3xl font-black">Annonces populaires</h2><a className="font-bold text-touticiBlue" href="/annonces">Voir toutes les annonces →</a></div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
      {listings.map(item => <article key={item.title} className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm">
        <div className="relative h-36 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-6xl">{item.img}<button className="absolute top-3 right-3 rounded-full bg-white p-2 shadow"><Heart size={22}/></button></div>
        <div className="p-4"><div className="text-2xl font-black">{item.price}</div><h3 className="font-bold mt-1">{item.title}</h3><p className="text-sm text-slate-700 mt-2 flex gap-1 items-center"><CalendarDays size={15}/> {item.info}</p><p className="text-sm text-slate-700 mt-2 flex gap-1 items-center"><MapPin size={15}/> {item.city}</p></div>
      </article>)}
    </div>
  </section>;
}
