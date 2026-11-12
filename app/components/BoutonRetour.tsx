"use client";

import {usePathname, useRouter} from "next/navigation";

function destinationDeRepli(pathname: string): string {
  if (pathname.startsWith("/automobile/deposer")) return "/deposer/automobile";
  if (pathname.startsWith("/deposer/automobile/")) return "/deposer/automobile";
  if (pathname === "/deposer/automobile") return "/deposer";
  if (pathname.startsWith("/deposer/")) return "/deposer";
  if (pathname === "/deposer") return "/";
  if (pathname.startsWith("/automobile") || pathname.startsWith("/moto")) return "/";
  return "/";
}

export default function BoutonRetour() {
  const pathname = usePathname();
  const router = useRouter();

  if (!pathname || pathname === "/") return null;

  function retourner() {
    const repli = destinationDeRepli(pathname);
    // Ne jamais repartir vers un site extérieur en utilisant l'historique.
    try {
      const pagePrecedente = document.referrer ? new URL(document.referrer) : null;
      if (pagePrecedente && pagePrecedente.origin === window.location.origin &&
          pagePrecedente.pathname !== pathname && window.history.length > 1) {
        router.back();
        return;
      }
    } catch {
      // Un referrer absent ou non valide utilise le parcours interne connu.
    }
    router.push(repli);
  }

  return (
    <button
      type="button"
      onClick={retourner}
      aria-label="Revenir à la page précédente"
      title="Retour à la page précédente"
      style={{
        position:"fixed",
        bottom:"max(18px, env(safe-area-inset-bottom))",
        left:"max(16px, env(safe-area-inset-left))",
        zIndex:80,
        display:"flex",
        alignItems:"center",
        gap:9,
        border:"1px solid #123d91",
        background:"#ffcf24",
        color:"#08295f",
        borderRadius:100,
        padding:"12px 18px",
        boxShadow:"0 8px 24px rgba(0,30,85,.24)",
        cursor:"pointer",
        fontFamily:"Arial, sans-serif",
        fontSize:14,
        fontWeight:800,
      }}
    >
      <span aria-hidden="true" style={{fontSize:20,lineHeight:1}}>←</span>
      Retour
    </button>
  );
}
