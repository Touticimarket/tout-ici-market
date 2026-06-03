@tailwind base;
@tailwind components;
@tailwind utilities;
body { background:#fff; color:#0f172a; }
.hero-bg {
  background:
    linear-gradient(90deg, rgba(255,255,255,.96), rgba(255,255,255,.7), rgba(255,255,255,.96)),
    radial-gradient(circle at 15% 75%, rgba(3,71,184,.2), transparent 28%),
    radial-gradient(circle at 55% 20%, rgba(246,185,0,.25), transparent 26%);
}
.category-card { @apply rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-soft; }
