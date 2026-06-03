import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import Categories from "@/components/Categories";
import PopularListings from "@/components/PopularListings";
export default function Home() {
  return <main>
    <Header />
    <section className="hero-bg">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-20 grid lg:grid-cols-[1fr_1.25fr] gap-8 items-center">
        <div className="hidden lg:block"><div className="rounded-[2rem] bg-white/70 shadow-soft p-8 grid grid-cols-2 gap-5 text-6xl"><div className="rounded-3xl bg-white p-8">🚗</div><div className="rounded-3xl bg-white p-8">🏠</div><div className="rounded-3xl bg-white p-8">📱</div><div className="rounded-3xl bg-white p-8">🛠️</div></div></div>
        <div className="text-center lg:text-left"><h1 className="text-4xl md:text-6xl font-black leading-tight text-touticiBlue">Tout acheter, tout vendre,<br/>tout trouver <span className="text-touticiYellow">tout ici</span></h1><p className="mt-5 text-lg text-slate-700 font-semibold">La marketplace locale et premium pour l’automobile, l’immobilier, l’emploi, les loisirs et le quotidien.</p></div>
      </div>
    </section>
    <SearchBar /><Categories /><PopularListings />
  </main>;
}
