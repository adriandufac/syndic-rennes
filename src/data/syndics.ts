export interface Syndic {
  id: string;
  nom: string;
  type: "independant" | "reseau_national" | "cabinet_regional";
  specialite: string[];
  tailleAdaptee: {
    min: number;
    max: number | null;
  };
  zoneIntervention: string[];
  fourchettePrix: {
    min: number;
    max: number;
  };
  pointsForts: string[];
  convientPour: string[];
}

export const syndics: Syndic[] = [
  {
    id: "foncia-rennes",
    nom: "Foncia Rennes",
    type: "reseau_national",
    specialite: ["résidentiel", "mixte", "grands ensembles"],
    tailleAdaptee: { min: 20, max: null },
    zoneIntervention: ["Rennes métropole"],
    fourchettePrix: { min: 150, max: 220 },
    pointsForts: [
      "Espace copropriétaire en ligne",
      "Réseau national avec ressources locales",
      "Gestion comptable intégrée",
    ],
    convientPour: [
      "Copros 20+ lots",
      "Copropriétaires souhaitant un suivi digital",
    ],
  },
  {
    id: "citya-rennes",
    nom: "Citya Immobilier Rennes",
    type: "reseau_national",
    specialite: ["résidentiel", "grands ensembles", "immeubles neufs"],
    tailleAdaptee: { min: 30, max: null },
    zoneIntervention: ["Rennes métropole", "Ille-et-Vilaine"],
    fourchettePrix: { min: 140, max: 210 },
    pointsForts: [
      "Plateforme digitale propriétaire MyCitya",
      "Présence nationale avec ancrage local",
      "Gestion technique dédiée",
    ],
    convientPour: [
      "Grandes copropriétés",
      "Immeubles neufs en première mise en copropriété",
    ],
  },
  {
    id: "cabinet-martin-rennes",
    nom: "Cabinet Martin Immobilier",
    type: "independant",
    specialite: ["résidentiel", "petites copropriétés"],
    tailleAdaptee: { min: 5, max: 30 },
    zoneIntervention: ["Rennes centre", "Rennes sud"],
    fourchettePrix: { min: 180, max: 300 },
    pointsForts: [
      "Interlocuteur unique dédié",
      "Connaissance fine du marché rennais",
      "Réactivité et proximité",
    ],
    convientPour: [
      "Petites copropriétés < 30 lots",
      "Copropriétaires recherchant un suivi personnalisé",
    ],
  },
  {
    id: "armor-gestion",
    nom: "Armor Gestion",
    type: "cabinet_regional",
    specialite: ["résidentiel", "mixte", "copropriétés moyennes"],
    tailleAdaptee: { min: 10, max: 80 },
    zoneIntervention: ["Rennes métropole", "Bretagne"],
    fourchettePrix: { min: 130, max: 240 },
    pointsForts: [
      "Implantation régionale forte en Bretagne",
      "Équipe pluridisciplinaire (technique, juridique, comptable)",
      "Suivi personnalisé des travaux",
    ],
    convientPour: [
      "Copropriétés de 10 à 80 lots",
      "Immeubles nécessitant un suivi technique régulier",
    ],
  },
  {
    id: "bretagne-syndic",
    nom: "Bretagne Syndic",
    type: "cabinet_regional",
    specialite: ["résidentiel", "immeubles anciens", "rénovation"],
    tailleAdaptee: { min: 10, max: 60 },
    zoneIntervention: ["Rennes centre", "Rennes métropole"],
    fourchettePrix: { min: 160, max: 260 },
    pointsForts: [
      "Spécialiste de la rénovation énergétique",
      "Accompagnement MaPrimeRénov' copropriétés",
      "Réseau d'artisans locaux qualifiés",
    ],
    convientPour: [
      "Immeubles anciens à rénover",
      "Copropriétés engageant des travaux d'amélioration",
    ],
  },
  {
    id: "nexity-rennes",
    nom: "Nexity Rennes",
    type: "reseau_national",
    specialite: ["résidentiel", "immeubles neufs", "grands ensembles"],
    tailleAdaptee: { min: 30, max: null },
    zoneIntervention: ["Rennes métropole"],
    fourchettePrix: { min: 140, max: 200 },
    pointsForts: [
      "Application mobile de suivi copropriété",
      "Expertise en immeubles neufs",
      "Service client dédié grandes copropriétés",
    ],
    convientPour: [
      "Grandes copropriétés 30+ lots",
      "Programmes neufs livrés récemment",
    ],
  },
];

export const typeLabels: Record<Syndic["type"], string> = {
  independant: "Cabinet indépendant",
  reseau_national: "Réseau national",
  cabinet_regional: "Cabinet régional",
};
