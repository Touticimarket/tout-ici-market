import { NextRequest, NextResponse } from "next/server";
type CommuneAPI = { nom: string; code: string; codesPostaux?: string[]; codeDepartement?: string; centre?: { coordinates?: [number,number] }; mairie?: { coordinates?: [number,number] }; };
export async function GET(req: NextRequest) {
  const q=(req.nextUrl.searchParams.get("q")||"").trim();
  if(q.length<2||q.length>70) return NextResponse.json({communes:[]});
  const url=new URL("https://geo.api.gouv.fr/communes");
  url.searchParams.set(/^[0-9]{2,5}$/.test(q)?"codePostal":"nom",q);
  url.searchParams.set("fields","nom,code,codesPostaux,codeDepartement,centre,mairie");
  url.searchParams.set("format","json");
  url.searchParams.set("geometry","centre");
  url.searchParams.set("limit","25");
  try {
    const resp=await fetch(url.toString(),{next:{revalidate:86400}});
    if(!resp.ok) return NextResponse.json({communes:[],error:"Annuaire temporairement indisponible"},{status:502});
    const data=(await resp.json()) as CommuneAPI[];
    const communes=data.flatMap(c=>(c.codesPostaux||[]).map(cp=>({
      nom:c.nom,code:c.code,codePostal:cp,departement:c.codeDepartement||"",
      longitude:c.mairie?.coordinates?.[0]??c.centre?.coordinates?.[0]??null,latitude:c.mairie?.coordinates?.[1]??c.centre?.coordinates?.[1]??null
    }))).filter(c=>Number.isFinite(c.latitude)&&Number.isFinite(c.longitude)).slice(0,35);
    return NextResponse.json({communes});
  }catch {return NextResponse.json({communes:[],error:"Recherche momentanément indisponible"},{status:502});}
}
