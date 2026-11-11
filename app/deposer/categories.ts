export type DepotCategorie = {
  slug: string;
  nom: string;
  icone: string;
  description: string;
  groupe: string;
  sousCategories: string[];
  champs: {nom: string;libelle: string;type?: "text" | "number";placeholder?: string}[];
};

export const depotCategories: DepotCategorie[] = [
  {slug:"automobile",nom:"Automobile & véhicules",icone:"🚘",description:"Voitures, utilitaires, fourgons, vans, caravanes et remorques",groupe:"Véhicules & mobilité",
    sousCategories:["Voiture","SUV & 4x4","Utilitaire","Fourgon","Van aménagé","Camping-car","Caravane","Remorque","Porte-voiture","Pièces automobiles"],
    champs:[{nom:"marque",libelle:"Marque"},{nom:"modele",libelle:"Modèle"}]},
  {slug:"moto",nom:"Moto & deux-roues",icone:"🏍️",description:"Motos, scooters, quads et équipements",groupe:"Véhicules & mobilité",
    sousCategories:["Moto","Scooter","Quad","Vélomoteur","Pièces et équipements"],
    champs:[{nom:"marque",libelle:"Marque"},{nom:"modele",libelle:"Modèle"},{nom:"annee",libelle:"Année",type:"number"},{nom:"kilometrage",libelle:"Kilométrage",type:"number"}]},
  {slug:"immobilier",nom:"Immobilier",icone:"🏡",description:"Vente, location, neuf et vacances",groupe:"Logement & emploi",
    sousCategories:["Maison à vendre","Appartement à vendre","Location","Colocation","Terrain","Immobilier neuf","Bureaux et commerces","Immobilier international"],
    champs:[{nom:"surface",libelle:"Surface (m²)",type:"number"},{nom:"pieces",libelle:"Nombre de pièces",type:"number"},{nom:"chambres",libelle:"Chambres",type:"number"},{nom:"code_postal",libelle:"Code postal"}]},
  {slug:"emploi",nom:"Emploi & services",icone:"💼",description:"Offres, candidatures et services à domicile",groupe:"Logement & emploi",
    sousCategories:["Offre d'emploi","Recherche d'emploi","Services aux particuliers","Cours et formation","Prestations professionnelles"],
    champs:[{nom:"poste",libelle:"Métier ou service"},{nom:"contrat",libelle:"Type de contrat / prestation"},{nom:"experience",libelle:"Expérience souhaitée"}]},
  {slug:"maison-jardin",nom:"Maison & jardin",icone:"🛋️",description:"Meubles, électroménager et décoration",groupe:"Maison & équipements",
    sousCategories:["Meubles","Électroménager","Décoration","Jardin","Puériculture","Linge de maison"],
    champs:[{nom:"marque",libelle:"Marque (facultatif)"},{nom:"etat",libelle:"État de l'article"}]},
  {slug:"telephones",nom:"Téléphones & informatique",icone:"📱",description:"Smartphones, ordinateurs et accessoires",groupe:"Maison & équipements",
    sousCategories:["Téléphone","Tablette","Ordinateur","Photo et vidéo","Accessoires","Autre équipement numérique"],
    champs:[{nom:"marque",libelle:"Marque"},{nom:"modele",libelle:"Modèle"},{nom:"etat",libelle:"État"}]},
  {slug:"bricolage",nom:"Bricolage",icone:"🛠️",description:"Outillage, travaux et matériaux",groupe:"Maison & équipements",
    sousCategories:["Outils","Machines","Matériaux","Rénovation","Quincaillerie","Autres"],
    champs:[{nom:"marque",libelle:"Marque (facultatif)"},{nom:"etat",libelle:"État"}]},
  {slug:"mode",nom:"Mode & accessoires",icone:"👗",description:"Vêtements, chaussures et accessoires",groupe:"Mode & divertissement",
    sousCategories:["Femme","Homme","Enfant","Chaussures","Sacs et accessoires","Bijoux et montres"],
    champs:[{nom:"marque",libelle:"Marque (facultatif)"},{nom:"taille",libelle:"Taille / pointure"},{nom:"etat",libelle:"État"}]},
  {slug:"jeux-consoles",nom:"Jeux & consoles",icone:"🎮",description:"Consoles, jeux vidéo et jouets",groupe:"Mode & divertissement",
    sousCategories:["Console","Jeu vidéo","Accessoires gaming","Jeux de société","Jouets","Collections"],
    champs:[{nom:"marque",libelle:"Marque / console"},{nom:"etat",libelle:"État"}]},
  {slug:"nautisme",nom:"Nautisme & loisirs",icone:"⛵",description:"Bateaux, jet-skis et loisirs nautiques",groupe:"Voyages & loisirs",
    sousCategories:["Bateau à moteur","Voilier","Jet-ski","Semi-rigide","Remorque","Équipement nautique","Autres loisirs"],
    champs:[{nom:"marque",libelle:"Marque"},{nom:"modele",libelle:"Modèle"},{nom:"annee",libelle:"Année",type:"number"},{nom:"longueur",libelle:"Longueur (m)"}]},
  {slug:"vacances-loisirs",nom:"Vacances & loisirs",icone:"🏖️",description:"Locations saisonnières et activités",groupe:"Voyages & loisirs",
    sousCategories:["Location de vacances","Camping et mobil-home","Chalet et bungalow","Chambre d'hôtes","Activités","Sport et vélo"],
    champs:[{nom:"capacite",libelle:"Capacité d'accueil",type:"number"},{nom:"surface",libelle:"Surface (m²)",type:"number"}]},
  {slug:"autres",nom:"Autres annonces",icone:"📦",description:"Collections, animaux et objets divers",groupe:"Autres annonces",
    sousCategories:["Animaux et accessoires","Collections","Événements","Don","Échange","Divers"],
    champs:[{nom:"etat",libelle:"État / détails"}]}
];

export const depotGroupes = ["Véhicules & mobilité","Logement & emploi","Maison & équipements","Mode & divertissement","Voyages & loisirs","Autres annonces"];
export function trouverCategorie(slug:string) {
  return depotCategories.find(c=>c.slug===slug);
}
