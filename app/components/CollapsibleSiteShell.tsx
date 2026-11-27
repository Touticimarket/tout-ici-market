"use client";
import {useEffect,useState,type ReactNode} from "react";
import {usePathname} from "next/navigation";

export default function CollapsibleSiteShell({sidebar,children}:{sidebar:ReactNode;children:ReactNode}){
 const pathname=usePathname()||"/";
 // Keep the approved left categories visible on the home and deposit pages;
 // begin with more room for filters and results on vehicle-search pages.
 const preferCollapsed=/^\/automobile\/[^/]+\/?$/.test(pathname)&&!pathname.startsWith("/automobile/deposer");
 const [expanded,setExpanded]=useState(!preferCollapsed);
 useEffect(()=>{setExpanded(!(/^\/automobile\/[^/]+\/?$/.test(pathname)&&!pathname.startsWith("/automobile/deposer")));},[pathname]);
 // The global left navigation always browses listings. Posting uses only the dedicated button.
 return <div className={"tim-shell "+(expanded?"tim-sidebar-expanded":"tim-sidebar-collapsed")}>
  <style>{`
    .tim-shell.tim-sidebar-expanded,.tim-shell.tim-sidebar-collapsed{position:relative!important;align-items:start!important}
    html body .tim-shell.tim-sidebar-expanded{grid-template-columns:255px minmax(0,1fr)!important}
    html body .tim-shell.tim-sidebar-collapsed{display:grid!important;grid-template-columns:48px minmax(0,1fr)!important;gap:9px!important;max-width:1950px!important;padding-left:4px!important;padding-right:9px!important}
    html body .tim-shell.tim-sidebar-expanded>.tim-sidebar{grid-column:1!important;grid-row:1!important}
    html body .tim-shell.tim-sidebar-expanded>.tim-content{grid-column:2!important;grid-row:1!important;min-width:0!important}
    html body .tim-shell.tim-sidebar-collapsed>.tim-sidebar{display:none!important}
    html body .tim-shell.tim-sidebar-collapsed>.tim-content{display:block!important;grid-column:2!important;grid-row:1!important;min-width:0!important;width:100%!important}
    html body .tim-shell>.tim-side-toggle{position:absolute;left:214px;top:15px;z-index:12;display:flex;align-items:center;justify-content:center;width:34px;height:34px;min-width:34px;border:1px solid #c3d4eb;border-radius:9px;background:#fff;color:#103a76;font-size:20px;cursor:pointer;box-shadow:0 2px 6px #08234b1b}
    html body .tim-shell>.tim-side-toggle:hover,html body .tim-shell>.tim-side-toggle:focus-visible{background:#ffcd00;color:#08244b;border-color:#d4a900;outline:2px solid #ffdb5a}
    html body .tim-shell.tim-sidebar-collapsed>.tim-side-toggle{position:sticky!important;top:16px!important;left:auto!important;grid-column:1!important;grid-row:1!important;margin:4px auto!important;width:42px!important;height:46px!important;border-radius:10px!important}
    html body:has(.depot-entry) .tim-shell.tim-sidebar-expanded{display:grid!important;grid-template-columns:255px minmax(0,1fr)!important}
    html body:has(.depot-entry) .tim-shell.tim-sidebar-collapsed{display:grid!important;grid-template-columns:48px minmax(0,1fr)!important}
    html body:has(.depot-entry) .tim-shell.tim-sidebar-collapsed>.tim-sidebar{display:none!important}
    html body:has(.depot-entry) .tim-shell.tim-sidebar-collapsed>.tim-content{grid-column:2!important}
    @media(max-width:760px){
      html body .tim-shell.tim-sidebar-expanded{display:flex!important;flex-direction:column!important}
      html body .tim-shell.tim-sidebar-expanded>.tim-sidebar{margin-top:40px!important;width:100%!important}
      html body .tim-shell.tim-sidebar-expanded>.tim-content{width:100%!important}
      html body .tim-shell.tim-sidebar-expanded>.tim-side-toggle{left:10px!important;top:8px!important}
      html body .tim-shell.tim-sidebar-collapsed{display:grid!important;grid-template-columns:42px minmax(0,1fr)!important}
    }
  `}</style>
  <button type="button" className="tim-side-toggle" aria-expanded={expanded} aria-label={expanded?"Masquer les rubriques et agrandir la page":"Afficher les rubriques"} title={expanded?"Masquer les rubriques":"Afficher les rubriques"} onClick={()=>setExpanded(v=>!v)}>{expanded?"‹":"☰"}</button>
  {sidebar}
  <div className="tim-content">{children}</div>
 </div>;
}
