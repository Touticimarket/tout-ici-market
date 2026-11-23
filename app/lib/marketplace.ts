import {supabase} from "./supabaseClient";

export const ANNONCES_TABLE="annonces_marketplace" as const;
export const PHOTOS_BUCKET="annonces-marketplace" as const;

export type StatutAnnonce="brouillon"|"publiee"|"reservee"|"vendue"|"archivee";
export type AnnonceMarketplace={
  id:string;user_id:string;categorie:string;sous_categorie:string;
  titre:string;description:string;prix:number|null;ville:string;code_postal:string|null;
  caracteristiques:Record<string,unknown>;photos:string[];
  statut:StatutAnnonce;created_at:string;updated_at:string;
};
export type PublicationEntree={
  categorie:string;sousCategorie:string;titre:string;description:string;prix:number|null;
  ville:string;codePostal?:string;caracteristiques:Record<string,unknown>;photos:File[];
};

const mimeTypes=["image/jpeg","image/png","image/webp"];

export async function publierAnnonce(entree:PublicationEntree):Promise<string>{
  const {data:{user},error:identiteError}=await supabase.auth.getUser();
  if(identiteError||!user)throw new Error("Connectez-vous ou créez un compte avant de publier.");
  if(entree.titre.trim().length<4||entree.description.trim().length<10||entree.ville.trim().length<2)
    throw new Error("Précisez le titre, la description (10 caractères minimum) et la ville.");
  if(entree.photos.length>10||entree.photos.some(f=>!mimeTypes.includes(f.type)||f.size>10*1024*1024))
    throw new Error("Ajoutez au maximum 10 photos JPG, PNG ou WEBP de 10 Mo chacune.");
  if(entree.prix!==null && (!Number.isFinite(entree.prix)||entree.prix<0))
    throw new Error("Le prix doit être un nombre valide supérieur ou égal à zéro.");

  const {data:annonce,error:createError}=await supabase.from(ANNONCES_TABLE).insert({
    user_id:user.id,categorie:entree.categorie,sous_categorie:entree.sousCategorie,
    titre:entree.titre.trim(),description:entree.description.trim(),
    prix:entree.prix,ville:entree.ville.trim(),code_postal:entree.codePostal?.trim()||null,
    caracteristiques:entree.caracteristiques,photos:[],statut:"brouillon"
  }).select("id").single();
  if(createError||!annonce)throw new Error(createError?.message||"Impossible de créer l'annonce.");

  const liens:string[]=[];
  try {
    for(let i=0;i<entree.photos.length;i++){
      const fichier=entree.photos[i];
      const ext=fichier.type==="image/png"?"png":fichier.type==="image/webp"?"webp":"jpg";
      const chemin=user.id+"/"+annonce.id+"/"+crypto.randomUUID()+"."+ext;
      const {error:uploadError}=await supabase.storage.from(PHOTOS_BUCKET).upload(chemin,fichier,{
        contentType:fichier.type,cacheControl:"3600",upsert:false
      });
      if(uploadError)throw new Error("Échec du transfert de la photo "+(i+1)+" : "+uploadError.message);
      liens.push(supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(chemin).data.publicUrl);
    }
    const {error:publishError}=await supabase.from(ANNONCES_TABLE)
      .update({photos:liens,statut:"publiee",updated_at:new Date().toISOString()})
      .eq("id",annonce.id).eq("user_id",user.id);
    if(publishError)throw new Error("Publication impossible : "+publishError.message);
    return annonce.id;
  }catch(e){
    // Garder un brouillon sur le compte avec les photos déjà envoyées.
    if(liens.length)await supabase.from(ANNONCES_TABLE)
      .update({photos:liens,updated_at:new Date().toISOString()})
      .eq("id",annonce.id).eq("user_id",user.id);
    throw new Error((e instanceof Error?e.message:"Erreur de publication")+
      " Un brouillon a été conservé dans votre compte.");
  }
}
