export type TypeVehicule = {
  slug: string;
  nom: string;
  icone: string;
  description: string;
  groupe: string;
  motorise: boolean;
  catalogueAuto: boolean;
  nature: "vehicule" | "equipement" | "service";
};

export const groupesAutomobile = [
  "Voitures particulières",
  "Utilitaires, camions & transport",
  "Caravaning, vans & loisirs",
  "Remorques & transport",
  "Vélos & mobilité douce",
  "Équipements & réparations",
];

export const typesVehicules: TypeVehicule[] = [
  {slug:"voiture",nom:"Voiture",icone:"🚗",description:"Citadine, berline, coupé, cabriolet",groupe:"Voitures particulières",motorise:true,catalogueAuto:true,nature:"vehicule"},
  {slug:"suv-4x4",nom:"SUV & 4x4",icone:"🚙",description:"SUV, crossover et tout-terrain",groupe:"Voitures particulières",motorise:true,catalogueAuto:true,nature:"vehicule"},
  {slug:"monospace",nom:"Monospace",icone:"🚘",description:"Familiale, monospace et 7 places",groupe:"Voitures particulières",motorise:true,catalogueAuto:true,nature:"vehicule"},
  {slug:"voiture-sans-permis",nom:"Voiture sans permis",icone:"🚗",description:"Voiturette et quadricycle",groupe:"Voitures particulières",motorise:true,catalogueAuto:false,nature:"vehicule"},
  {slug:"vehicule-collection",nom:"Voiture de collection",icone:"🏎️",description:"Anciennes et véhicules d'exception",groupe:"Voitures particulières",motorise:true,catalogueAuto:false,nature:"vehicule"},

  {slug:"utilitaire",nom:"Utilitaire",icone:"🚐",description:"Véhicule de travail ou de livraison",groupe:"Utilitaires, camions & transport",motorise:true,catalogueAuto:false,nature:"vehicule"},
  {slug:"fourgon",nom:"Fourgon",icone:"🚐",description:"Fourgon tôlé et fourgonnette",groupe:"Utilitaires, camions & transport",motorise:true,catalogueAuto:false,nature:"vehicule"},
  {slug:"camionnette",nom:"Camionnette & pick-up",icone:"🛻",description:"Camionnette, pick-up et petit plateau",groupe:"Utilitaires, camions & transport",motorise:true,catalogueAuto:false,nature:"vehicule"},
  {slug:"camion",nom:"Camion",icone:"🚚",description:"Porteur, distribution et transport",groupe:"Utilitaires, camions & transport",motorise:true,catalogueAuto:false,nature:"vehicule"},
  {slug:"poids-lourd",nom:"Poids lourd",icone:"🚛",description:"Tracteur routier et véhicules industriels",groupe:"Utilitaires, camions & transport",motorise:true,catalogueAuto:false,nature:"vehicule"},
  {slug:"benne",nom:"Camion benne",icone:"🚚",description:"Benne, plateau et camion de chantier",groupe:"Utilitaires, camions & transport",motorise:true,catalogueAuto:false,nature:"vehicule"},

  {slug:"van",nom:"Van",icone:"🚐",description:"Van de tourisme et transport de personnes",groupe:"Caravaning, vans & loisirs",motorise:true,catalogueAuto:false,nature:"vehicule"},
  {slug:"van-amenage",nom:"Van aménagé",icone:"🏕️",description:"Van équipé pour voyager et dormir",groupe:"Caravaning, vans & loisirs",motorise:true,catalogueAuto:false,nature:"vehicule"},
  {slug:"fourgon-amenage",nom:"Fourgon aménagé",icone:"🚐",description:"Fourgon de loisirs transformé",groupe:"Caravaning, vans & loisirs",motorise:true,catalogueAuto:false,nature:"vehicule"},
  {slug:"camping-car",nom:"Camping-car",icone:"🚎",description:"Intégral, profilé et capucine",groupe:"Caravaning, vans & loisirs",motorise:true,catalogueAuto:false,nature:"vehicule"},
  {slug:"caravane",nom:"Caravane",icone:"🏕️",description:"Caravane rigide, pliante et résidentielle",groupe:"Caravaning, vans & loisirs",motorise:false,catalogueAuto:false,nature:"vehicule"},
  {slug:"mobil-home",nom:"Mobil-home",icone:"🏡",description:"Résidence mobile pour les loisirs",groupe:"Caravaning, vans & loisirs",motorise:false,catalogueAuto:false,nature:"vehicule"},
  {slug:"cellule-camping",nom:"Cellule amovible",icone:"🛻",description:"Cellule habitable pour pick-up",groupe:"Caravaning, vans & loisirs",motorise:false,catalogueAuto:false,nature:"equipement"},

  {slug:"remorque",nom:"Remorque",icone:"🛻",description:"Bagagère, utilitaire, fermée ou plateau",groupe:"Remorques & transport",motorise:false,catalogueAuto:false,nature:"vehicule"},
  {slug:"porte-voiture",nom:"Porte-voiture",icone:"🚗",description:"Remorque pour transport automobile",groupe:"Remorques & transport",motorise:false,catalogueAuto:false,nature:"vehicule"},
  {slug:"remorque-moto",nom:"Remorque moto",icone:"🏍️",description:"Transport de motos et quads",groupe:"Remorques & transport",motorise:false,catalogueAuto:false,nature:"vehicule"},
  {slug:"remorque-bateau",nom:"Remorque bateau",icone:"⛵",description:"Remorque nautique",groupe:"Remorques & transport",motorise:false,catalogueAuto:false,nature:"vehicule"},
  {slug:"semi-remorque",nom:"Semi-remorque",icone:"🚛",description:"Frigorifique, plateau et bâchée",groupe:"Remorques & transport",motorise:false,catalogueAuto:false,nature:"vehicule"},

  {slug:"velo",nom:"Vélo",icone:"🚲",description:"Vélo de ville, promenade et enfant",groupe:"Vélos & mobilité douce",motorise:false,catalogueAuto:false,nature:"vehicule"},
  {slug:"vtt",nom:"VTT",icone:"🚵",description:"VTT rigide, tout-suspendu et descente",groupe:"Vélos & mobilité douce",motorise:false,catalogueAuto:false,nature:"vehicule"},
  {slug:"velo-route",nom:"Vélo de route",icone:"🚴",description:"Route, gravel et cyclocross",groupe:"Vélos & mobilité douce",motorise:false,catalogueAuto:false,nature:"vehicule"},
  {slug:"vae",nom:"Vélo électrique",icone:"🚲",description:"VAE urbain, VTT électrique et cargo",groupe:"Vélos & mobilité douce",motorise:false,catalogueAuto:false,nature:"vehicule"},
  {slug:"trottinette",nom:"Trottinette",icone:"🛴",description:"Trottinette manuelle et électrique",groupe:"Vélos & mobilité douce",motorise:false,catalogueAuto:false,nature:"vehicule"},

  {slug:"pieces-auto",nom:"Pièces automobiles",icone:"⚙️",description:"Moteurs, carrosserie et pièces détachées",groupe:"Équipements & réparations",motorise:false,catalogueAuto:false,nature:"equipement"},
  {slug:"accessoires-auto",nom:"Équipement auto",icone:"🧰",description:"Accessoires, autoradios et équipements",groupe:"Équipements & réparations",motorise:false,catalogueAuto:false,nature:"equipement"},
  {slug:"pneus-jantes",nom:"Pneus & jantes",icone:"🛞",description:"Pneumatiques, roues et jantes",groupe:"Équipements & réparations",motorise:false,catalogueAuto:false,nature:"equipement"},
  {slug:"equipement-caravaning",nom:"Équipement caravaning",icone:"🏕️",description:"Auvents, accessoires et pièces de camping-car",groupe:"Équipements & réparations",motorise:false,catalogueAuto:false,nature:"equipement"},
  {slug:"equipement-nautisme",nom:"Équipement nautisme",icone:"⚓",description:"Pièces, gilets, accastillage et accessoires",groupe:"Équipements & réparations",motorise:false,catalogueAuto:false,nature:"equipement"},
  {slug:"equipement-velo",nom:"Équipement vélo",icone:"🚲",description:"Casques, pièces et accessoires cyclistes",groupe:"Équipements & réparations",motorise:false,catalogueAuto:false,nature:"equipement"},
  {slug:"reparation-mecanique",nom:"Réparation mécanique",icone:"🔧",description:"Entretien, dépannage et réparations",groupe:"Équipements & réparations",motorise:false,catalogueAuto:false,nature:"service"},
];

export function trouverTypeVehicule(slug:string){
  return typesVehicules.find(t=>t.slug===slug);
}
