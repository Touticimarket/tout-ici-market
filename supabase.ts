export default function Logo() {
  return <div className="leading-none">
    <div className="text-4xl md:text-5xl font-black tracking-tight">
      <span className="text-touticiBlue">TOUT</span> <span className="text-touticiYellow">ICI</span>
    </div>
    <div className="mt-1 flex items-center gap-3 text-touticiGold">
      <span className="h-px w-16 bg-touticiGold" />
      <span className="text-sm tracking-[0.55em] font-semibold">MARKET</span>
      <span className="h-px w-16 bg-touticiGold" />
    </div>
  </div>;
}
