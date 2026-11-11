export type TypeVehicule = {
  slug: string;
  nom: string;
  icone: string;
  description: string;
  groupe: string;
  motorise: boolean;
  catalogueAuto: boolean;
};

export const groupesAutomobile = [
  "Voitures particulières",
  "Utilitaires & transport",
  "Voyages & véhicules aménagés",
  "Remorques, pièces & accessoires",
];

export const typesVehicules: TypeVehicule[] = [
  {slug:"voiture",nom:"Voiture",icone:"🚗",description:"Berline, citadine, coupé ou cabriolet",groupe:"Voitures particulières",motorise:true,catalogueAuto:true},
  {slug:"suv-4x4",nom:"SUV & 4x4",icone:"🚙",description:"SUV, crossover et tout-terrain",groupe:"Voitures particulières",motorise:true,catalogueAuto:true},
  {slug:"monospace",nom:"Monospace",icone:"🚘",description:"Véhicule familial et 7 places",groupe:"Voitures particulières",motorise:true,catalogueAuto:true},
  {slug:"voiture-sans-permis",nom:"Voiture sans permis",icone:"🚗",description:"Quadricycle et voiturette",groupe:"Voitures particulières",motorise:true,catalogueAuto:false},
  {slug:"vehicule-collection",nom:"Voiture de collection",icone:"🏎️",description:"Ancienne, classique ou de prestige",groupe:"Voitures particulières",motorise:true,catalogueAuto:false},
  {slug:"utilitaire",nom:"Utilitaire",icone:"🚐",description:"Véhicule professionnel ou de travail",groupe:"Utilitaires & transport",motorise:true,catalogueAuto:false},
  {slug:"fourgon",nom:"Fourgon",icone:"🚐",description:"Fourgon tôlé et transport de marchandises",groupe:"Utilitaires & transport",motorise:true,catalogueAuto:false},
  {slug:"camionnette",nom:"Camionnette",icone:"🛻",description:"Petit utilitaire, pick-up et plateau",groupe:"Utilitaires & transport",motorise:true,catalogueAuto:false},
  {slug:"camion",nom:"Camion & poids lourd",icone:"🚚",description:"Camions, porteurs et tracteurs routiers",groupe:"Utilitaires & transport",motorise:true,catalogueAuto:false},
  {slug:"benne",nom:"Véhicule benne",icone:"🚛",description:"Benne, plateau et véhicule de chantier",groupe:"Utilitaires & transport",motorise:true,catalogueAuto:false},
  {slug:"van",nom:"Van",icone:"🚐",description:"Van de voyage ou transport de personnes",groupe:"Voyages & véhicules aménagés",motorise:true,catalogueAuto:false},
  {slug:"van-amenage",nom:"Van aménagé",icone:"🏕️",description:"Van équipé pour voyager",groupe:"Voyages & véhicules aménagés",motorise:true,catalogueAuto:false},
  {slug:"fourgon-amenage",nom:"Fourgon aménagé",icone:"🚐",description:"Fourgon de loisirs aménagé",groupe:"Voyages & véhicules aménagés",motorise:true,catalogueAuto:false},
  {slug:"camping-car",nom:"Camping-car",icone:"🚎",description:"Profilé, intégral et capucine",groupe:"Voyages & véhicules aménagés",motorise:true,catalogueAuto:false},
  {slug:"caravane",nom:"Caravane",icone:"🏕️",description:"Caravane de loisirs et résidentielle",groupe:"Voyages & véhicules aménagés",motorise:false,catalogueAuto:false},
  {slug:"remorque",nom:"Remorque",icone:"🛻",description:"Bagagère, utilitaire et remorque fermée",groupe:"Remorques, pièces & accessoires",motorise:false,catalogueAuto:false},
  {slug:"porte-voiture",nom:"Porte-voiture",icone:"🚗",description:"Remorque porte-automobile",groupe:"Remorques, pièces & accessoires",motorise:false,catalogueAuto:false},
  {slug:"remorque-bateau",nom:"Remorque bateau",icone:"⛵",description:"Remorque porte-bateau et nautique",groupe:"Remorques, pièces & accessoires",motorise:false,catalogueAuto:false},
  {slug:"pieces-auto",nom:"Pièces automobiles",icone:"⚙️",description:"Pièces détachées et mécanique",groupe:"Remorques, pièces & accessoires",motorise:false,catalogueAuto:false},
  {slug:"accessoires-auto",nom:"Accessoires auto",icone:"🧰",description:"Équipements, pneus, jantes et accessoires",groupe:"Remorques, pièces & accessoires",motorise:false,catalogueAuto:false},
];

export function trouverTypeVehicule(slug:string){
  return typesVehicules.find(t=>t.slug===slug);
}
