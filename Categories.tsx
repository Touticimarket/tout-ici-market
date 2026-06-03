import Header from "@/components/Header";
import PopularListings from "@/components/PopularListings";
export default function Annonces() {
  return <main><Header/><div className="mx-auto max-w-7xl px-4 md:px-8 py-10"><h1 className="text-4xl font-black mb-8">Toutes les annonces</h1></div><PopularListings/></main>;
}
