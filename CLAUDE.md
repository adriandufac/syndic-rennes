# CLAUDE.md — Service de Mise en Relation Syndic Rennes

## 🎯 Contexte du projet

Site de mise en relation entre copropriétaires et syndics à Rennes.
Modèle économique : SEO local → formulaire qualifié → scoring du lead → routing vers syndics partenaires adaptés → revendu 50–150€/lead.

**Positionnement clair** : PAS un comparateur (on ne peut pas comparer sans données réelles).
C'est un **service de sélection et mise en relation** — on analyse le profil de la copropriété et on oriente vers les syndics les mieux adaptés. C'est la vraie valeur ajoutée.

**Promesse utilisateur** : "Décrivez votre copropriété, les syndics adaptés à votre profil vous contactent."

Stack : **Astro 4** (SSG) + **Tailwind CSS** + **TypeScript**
Hébergement cible : **Netlify** (forms + deploy)
Tracking : **Plausible Analytics** (privacy-first)

---

## 🏗️ Architecture du projet

```
syndic-rennes/
├── CLAUDE.md
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
├── src/
│   ├── data/
│   │   └── syndics.ts           # données factuelles des cabinets rennais
│   ├── layouts/
│   │   └── BaseLayout.astro     # Head SEO + Analytics + Nav + Footer
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── LeadForm.astro       # formulaire principal (Netlify Forms)
│   │   ├── SyndicCard.astro     # fiche factuelle d'un cabinet (PAS de note subjective)
│   │   ├── PriceTable.astro     # tableau des prix par taille de copro
│   │   ├── HowItWorks.astro     # section "comment ça marche" (3 étapes)
│   │   ├── FAQ.astro            # FAQ avec schema FAQPage
│   │   └── CTABanner.astro      # bande CTA répétée sur les pages
│   └── pages/
│       ├── index.astro                    # home
│       ├── syndic-rennes.astro            # [MOT-CLÉ PRINCIPAL]
│       ├── syndics-rennes.astro           # [NOUVELLE] fiches factuelles des cabinets
│       ├── comparatif-syndic-rennes.astro
│       ├── prix-syndic-rennes.astro
│       ├── changer-syndic-rennes.astro
│       ├── syndic-benevole-rennes.astro
│       ├── merci.astro                    # page post-formulaire
│       └── mentions-legales.astro
└── public/
    ├── favicon.ico
    ├── robots.txt
    └── sitemap.xml              # généré par @astrojs/sitemap
```

---

## 📋 Tâches à réaliser (dans l'ordre)

### PHASE 1 — Setup

- [ ] `npm create astro@latest syndic-rennes -- --template minimal --typescript strict`
- [ ] Installer les dépendances :
  ```bash
  npx astro add tailwind
  npx astro add sitemap
  npm install @astrojs/netlify
  ```
- [ ] Configurer `astro.config.mjs` :

  ```js
  import { defineConfig } from "astro/config";
  import tailwind from "@astrojs/tailwind";
  import sitemap from "@astrojs/sitemap";
  import netlify from "@astrojs/netlify";

  export default defineConfig({
    site: "https://syndic-rennes.fr",
    integrations: [tailwind(), sitemap()],
    adapter: netlify(),
    output: "static",
  });
  ```

- [ ] Créer `netlify.toml` :

  ```toml
  [build]
    command = "npm run build"
    publish = "dist"

  [[redirects]]
    from = "/merci"
    to = "/merci"
    status = 200
  ```

---

### PHASE 2 — BaseLayout & composants globaux

**`src/layouts/BaseLayout.astro`**

Props requis : `title`, `description`, `canonical`, `schemaType` (optionnel)

Doit inclure :

- `<meta charset="UTF-8">`
- `<meta name="viewport" content="width=device-width">`
- `<meta name="description" content={description}>`
- `<link rel="canonical" href={canonical}>`
- Open Graph (og:title, og:description, og:url, og:type)
- JSON-LD LocalBusiness (voir section SEO)
- Script Plausible : `<script defer data-domain="syndic-rennes.fr" src="https://plausible.io/js/script.js"></script>`
- `<slot />` pour le contenu

**`src/components/Header.astro`**

- Logo texte "SyndicRennes.fr"
- Nav : Les syndics | Prix | Changer de syndic | Comment ça marche
- CTA bouton "Être mis en relation" → `#formulaire`
- Responsive mobile (hamburger simple)

**`src/components/HowItWorks.astro`**

Section 3 étapes, à afficher sur la home et `/syndic-rennes` :

1. **Décrivez votre copropriété** — Nombre de lots, type d'immeuble, situation actuelle (2 minutes)
2. **Nous sélectionnons les syndics adaptés** — On analyse votre profil et on contacte uniquement les cabinets correspondant à votre taille et secteur
3. **Les syndics vous contactent** — Vous recevez des propositions ciblées, pas un démarchage en masse

**`src/components/Footer.astro`**

- Liens : Mentions légales | RGPD | pages du site
- Texte légal RGPD obligatoire : "En soumettant vos coordonnées, vous acceptez d'être recontacté par des syndics partenaires sélectionnés selon votre profil. Vos données ne sont pas vendues à des tiers."

---

### PHASE 3 — Données syndics (`src/data/syndics.ts`)

Les fiches sont **100% factuelles et neutres**. Pas de notation subjective, pas d'avis inventés.
Objectif : informer, pas juger. Le CTA final transforme la confusion en conversion formulaire.

```typescript
export interface Syndic {
  id: string;
  nom: string;
  type: "independant" | "reseau_national" | "cabinet_regional";
  specialite: string[]; // ex: ['résidentiel', 'petites copros']
  tailleAdaptee: {
    min: number; // nb lots minimum
    max: number | null; // null = pas de maximum
  };
  zoneIntervention: string[]; // ex: ['Rennes centre', 'Rennes métropole']
  fourchettePrix: {
    min: number; // €/lot/an
    max: number;
  };
  pointsForts: string[]; // 3 max, factuels ("Gestion en ligne 24h/24")
  convientPour: string[]; // ex: ['Copros < 20 lots', 'Immeubles neufs']
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
  // Ajouter 4–6 cabinets rennais réels (indépendants prioritaires car acheteurs de leads potentiels)
];
```

**`src/components/SyndicCard.astro`**

Props : `syndic: Syndic`

Affichage :

- Nom + badge type (Réseau national / Cabinet indépendant / Régional)
- Zone d'intervention
- Taille adaptée : "10 à 50 lots"
- Fourchette tarifaire : "150–220€ / lot / an"
- Points forts (liste factuelle, 3 max)
- Convient pour (tags)
- **Pas de note en étoiles** (trop subjectif sans données réelles vérifiées)
- CTA : "Ce cabinet correspond à mon profil →" → ancre `#formulaire`

---

### PHASE 4 — Composant LeadForm + Scoring

**`src/components/LeadForm.astro`**

C'est le cœur business du site. Soigner l'UX au maximum.

**Wording du CTA principal (partout sur le site) :**

> "Des syndics adaptés à votre copropriété vous contactent →"

**Sous le CTA :** "Gratuit · Sans engagement · Réponse sous 48h"

```html
<form
  name="lead-syndic"
  method="POST"
  data-netlify="true"
  netlify-honeypot="bot-field"
  action="/merci"
>
  <!-- Honeypot anti-spam (caché) -->
  <input type="hidden" name="form-name" value="lead-syndic" />
  <p hidden><input name="bot-field" /></p>

  <!-- Étape 1 : Profil de la copropriété (qualification + routing) -->
  <select name="nb_lots" required>
    <option value="">Nombre de lots dans votre copropriété *</option>
    <option value="moins_10">Moins de 10 lots</option>
    <option value="10_30">10 à 30 lots</option>
    <option value="30_100">30 à 100 lots</option>
    <option value="plus_100">Plus de 100 lots</option>
  </select>

  <select name="type_immeuble" required>
    <option value="">Type de bien *</option>
    <option value="residentiel">Résidentiel</option>
    <option value="mixte">Mixte (hab. + commerce)</option>
    <option value="neuf">Immeuble neuf</option>
  </select>

  <select name="fin_contrat">
    <option value="">Fin de contrat actuel (optionnel)</option>
    <option value="moins_3mois">Dans moins de 3 mois</option>
    <option value="3_6mois">Dans 3 à 6 mois</option>
    <option value="plus_6mois">Dans plus de 6 mois</option>
    <option value="pas_de_syndic">Pas encore de syndic</option>
  </select>

  <select name="qualite" required>
    <option value="">Votre rôle *</option>
    <option value="conseil_syndical">Membre du conseil syndical</option>
    <option value="coproprietaire">Copropriétaire</option>
    <option value="autre">Autre</option>
  </select>

  <!-- Étape 2 : Contact -->
  <input type="text" name="ville" value="Rennes" readonly />
  <input type="email" name="email" placeholder="Votre email *" required />
  <input type="tel" name="telephone" placeholder="Votre téléphone *" required />
  <input type="text" name="nom" placeholder="Votre nom (optionnel)" />

  <!-- Consentement RGPD obligatoire -->
  <label>
    <input type="checkbox" name="rgpd" required />
    J'accepte d'être contacté par des syndics partenaires sélectionnés selon mon
    profil.
    <a href="/mentions-legales">Politique de confidentialité</a>
  </label>

  <button type="submit">Des syndics adaptés vous contactent →</button>
  <p>Gratuit · Sans engagement · Réponse sous 48h</p>
</form>
```

---

### Logique de scoring et routing des leads

Ce scoring est fait **manuellement au début**, puis automatisé via n8n quand le volume le justifie.

**Score d'un lead (à calculer à réception) :**

| Critère                 | Points |
| ----------------------- | ------ |
| Rôle = conseil syndical | +3     |
| Nb lots ≥ 30            | +3     |
| Nb lots 10–30           | +2     |
| Nb lots < 10            | -1     |
| Fin contrat < 3 mois    | +3     |
| Fin contrat 3–6 mois    | +2     |
| Téléphone renseigné     | +1     |

**Interprétation :**

- Score ≥ 7 → **Lead chaud** → distribuer immédiatement à 2 syndics partenaires adaptés
- Score 4–6 → **Lead tiède** → distribuer à 1 syndic, relance email J+3
- Score < 4 → **Lead froid** → nurturing email uniquement, pas de distribution payante

**Routing par profil :**

| Profil copropriété | Syndic type à contacter              |
| ------------------ | ------------------------------------ |
| < 10 lots          | Cabinet indépendant local uniquement |
| 10–30 lots         | Cabinet indépendant ou régional      |
| 30–100 lots        | Régional ou réseau national          |
| > 100 lots         | Réseau national prioritaire          |
| Immeuble neuf      | Spécialiste neuf en priorité         |
| Mixte              | Cabinet expérimenté copros mixtes    |

**Page `/merci.astro`** :

- Message : "Votre demande a bien été reçue. Nous analysons le profil de votre copropriété et vous mettrez en relation avec les syndics les plus adaptés sous 48h ouvrées."
- Rappel : "Vous serez contacté directement par les syndics sélectionnés — pas de démarchage en masse."
- Lien retour accueil

---

### PHASE 5 — Pages SEO

Chaque page suit cette structure :

1. **Hero** — H1 avec mot-clé exact + accroche locale Rennes
2. **Intro locale** — contexte Rennes, chiffres si possible
3. **Contenu utile** — prix, conseils, processus
4. **Section HowItWorks** `<HowItWorks />` (sur home et page principale)
5. **Contenu principal** — tableau, guide, fiches selon la page
6. **CTA intermédiaire** `<CTABanner />`
7. **FAQ** `<FAQ />` avec 5–8 questions (schema FAQPage)
8. **Formulaire** `<LeadForm />` avec ancre `#formulaire`

---

#### Page `/syndic-rennes` — Page principale

```
title: "Syndic Rennes : Trouvez le Syndic Adapté à Votre Copropriété"
description: "Service gratuit de mise en relation avec des syndics qualifiés à Rennes. On sélectionne les cabinets adaptés à votre copropriété. Réponse sous 48h."
```

Contenu H2 à couvrir :

- "Comment trouver le bon syndic à Rennes ?"
- "Pourquoi le choix du syndic est crucial pour votre copropriété"
- "Comment fonctionne notre service de mise en relation"
- "Les critères pour bien choisir son syndic"
- FAQ

---

#### Page `/syndics-rennes` — Fiches des cabinets [NOUVELLE]

```
title: "Les Syndics de Copropriété à Rennes : Fiches et Informations"
description: "Découvrez les syndics professionnels présents à Rennes : spécialités, zones d'intervention, fourchettes tarifaires. Informations factuelles pour vous aider à choisir."
```

Structure de la page :

1. Intro : "Rennes compte de nombreux cabinets syndics. Voici les informations objectives pour comprendre leurs différences."
2. Filtre simple (optionnel JS) : par taille de copro / type
3. Liste des `<SyndicCard />` — une par cabinet
4. Section éditoriale : "Les critères à regarder dans un contrat de syndic"
5. CTA fort : "Vous ne savez pas lequel correspond à votre copropriété ? Décrivez votre situation, on vous oriente."
6. `<LeadForm />`

**Règle importante** : les fiches sont factuelles et neutres. Pas de classement, pas de "meilleur syndic". Le CTA final capte la confusion naturelle créée par la liste.

---

#### Page `/comparatif-syndic-rennes`

```
title: "Comparatif Syndics Rennes : Indépendants vs Réseaux Nationaux"
description: "Quelles différences entre un syndic indépendant et un réseau national à Rennes ? Tableau comparatif objectif pour choisir selon votre copropriété."
```

**Angle** : comparer les **types** de syndics (pas les cabinets entre eux — trop risqué juridiquement).

Tableau comparatif :

| Critère         | Syndic indépendant                 | Réseau national         |
| --------------- | ---------------------------------- | ----------------------- |
| Réactivité      | Souvent meilleure (taille humaine) | Variable selon agence   |
| Prix            | Généralement plus compétitif       | Tarifs standardisés     |
| Outils digitaux | Variable                           | Plateforme propriétaire |
| Spécialisation  | Souvent niche locale               | Généraliste             |
| Adapté pour     | Petites/moyennes copros            | Grandes copros          |

---

#### Page `/prix-syndic-rennes`

```
title: "Prix d'un Syndic à Rennes en 2025 : Tarifs par Taille de Copropriété"
description: "Combien coûte un syndic à Rennes ? Tarifs détaillés selon la taille de votre copropriété. Comprenez votre facture et comparez."
```

Composant `<PriceTable />` :

| Taille copropriété | Prix moyen / lot / an | Ce qui est inclus                |
| ------------------ | --------------------- | -------------------------------- |
| Moins de 10 lots   | 280–420€              | Gestion courante basique         |
| 10 à 30 lots       | 180–280€              | Gestion + assemblée générale     |
| 30 à 100 lots      | 120–200€              | Gestion complète                 |
| Plus de 100 lots   | 80–150€               | Gestion complète + outils dédiés |

Section : "Les prestations hors forfait à surveiller" (clé pour la crédibilité éditoriale)

---

#### Page `/changer-syndic-rennes`

```
title: "Changer de Syndic à Rennes : Guide Complet Étape par Étape"
description: "Vous voulez changer de syndic à Rennes ? Notre guide explique la procédure légale, les délais et les pièges à éviter. Plus simple que vous ne le pensez."
```

Guide numéroté :

1. Vérifier la date de fin de contrat (article 18 loi Hoguet)
2. Constituer un dossier de mise en concurrence
3. Obtenir des propositions de nouveaux syndics
4. Mettre le changement à l'ordre du jour de l'AG
5. Vote à la majorité absolue (article 25)
6. Notification à l'ancien syndic

CTA contextuel après l'étape 3 : "On s'occupe de l'étape 3 pour vous →"

---

#### Page `/syndic-benevole-rennes`

```
title: "Syndic Bénévole à Rennes : Avantages, Risques et Obligations Légales"
description: "Le syndic bénévole à Rennes : est-ce adapté à votre copropriété ? Obligations légales, avantages réels et limites pratiques expliqués clairement."
```

---

### PHASE 6 — SEO technique

**JSON-LD BaseLayout :**

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "SyndicRennes.fr",
  "description": "Service de mise en relation avec des syndics de copropriété à Rennes",
  "url": "https://syndic-rennes.fr",
  "areaServed": {
    "@type": "City",
    "name": "Rennes",
    "sameAs": "https://www.wikidata.org/wiki/Q647"
  },
  "serviceType": "Mise en relation syndic copropriété"
}
```

**JSON-LD FAQPage (pages avec FAQ) :**

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "...",
      "acceptedAnswer": { "@type": "Answer", "text": "..." }
    }
  ]
}
```

**`public/robots.txt` :**

```
User-agent: *
Allow: /
Sitemap: https://syndic-rennes.fr/sitemap-index.xml
```

---

### PHASE 7 — Tracking et conversion

**Events Plausible à déclencher :**

```js
// Clic sur n'importe quel CTA vers le formulaire
document.querySelectorAll('a[href="#formulaire"], [data-cta]').forEach((el) => {
  el.addEventListener("click", () => {
    plausible("CTA Click", {
      props: { source: el.dataset.source || "unknown" },
    });
  });
});

// Soumission formulaire
document
  .querySelector('form[name="lead-syndic"]')
  ?.addEventListener("submit", () => {
    plausible("Lead Submitted");
  });

// Scroll jusqu'au formulaire (engagement)
const observer = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    plausible("Form Viewed");
    observer.disconnect();
  }
});
const form = document.querySelector("#formulaire");
if (form) observer.observe(form);
```

---

## 🎨 Design & UI

**Palette :**

- Primaire : `#1B4F72` (bleu marine — confiance, institutionnel)
- Accent : `#F39C12` (orange — CTA, urgence douce)
- Fond : `#F8F9FA`
- Texte : `#2C3E50`
- Succès : `#27AE60` (badges, confirmations)

**Typographie :**

- Titres : `Syne` (Google Fonts) — caractère fort et moderne
- Corps : `Source Serif 4` — lisibilité, confiance

**Composants Tailwind clés :**

```
bg-[#1B4F72] text-white           → sections hero, header
bg-[#F39C12] hover:bg-orange-500  → boutons CTA principaux
rounded-2xl shadow-lg p-6         → SyndicCard, formulaire
max-w-4xl mx-auto px-4            → conteneur standard
border-l-4 border-[#F39C12]       → encadrés mise en valeur
```

**Règles UX obligatoires :**

- CTA "Être mis en relation" visible sans scroll sur mobile
- Formulaire accessible via ancre `#formulaire` depuis toutes les pages
- Page `/merci` distincte (tracking conversion Plausible)
- Score Lighthouse cible : Performance > 90, SEO > 95
- Sous chaque CTA : "Gratuit · Sans engagement · Réponse sous 48h" (rassurance)

---

## ⚖️ Mentions légales obligatoires

Créer `/mentions-legales.astro` avec :

- Éditeur du site (à remplir)
- Finalité : mise en relation avec des syndics partenaires
- Base légale : consentement explicite (RGPD art. 6.1.a)
- Durée de conservation : 12 mois
- Destinataires : syndics partenaires sélectionnés selon le profil
- Droits : accès, rectification, suppression → email de contact
- Autorité de contrôle : CNIL (cnil.fr)
- Mention explicite : "Nous ne vendons pas vos données à des tiers non partenaires"

---

## 🚀 Déploiement

```bash
# Développement local
npm run dev

# Build de production
npm run build
npm run preview

# Deploy Netlify
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

**Variables d'environnement Netlify :**

```
LEAD_WEBHOOK_URL=https://your-n8n.cloud/webhook/syndic-lead
```

Si webhook n8n activé : le formulaire poste vers l'URL n8n qui calcule le score, route vers les bons partenaires, et redirige vers `/merci`.

---

## ✅ Checklist de lancement

- [ ] Toutes les pages créées avec contenu réel (pas Lorem Ipsum)
- [ ] Wording "mise en relation" cohérent sur toutes les pages (pas "comparateur" ni "devis")
- [ ] Formulaire testé end-to-end (Netlify Forms reçoit bien le lead)
- [ ] Page `/syndics-rennes` avec fiches factuelles (min 4 cabinets)
- [ ] JSON-LD valide sur chaque page (tester schema.org/validator)
- [ ] Sitemap accessible sur `/sitemap-index.xml`
- [ ] robots.txt en place
- [ ] Mentions légales / RGPD en ligne avec bon wording
- [ ] Score Lighthouse > 90 performance, > 95 SEO
- [ ] Google Search Console configuré + sitemap soumis
- [ ] Plausible configuré et trackant les 3 events
- [ ] Test mobile complet (formulaire utilisable sur iPhone/Android)
- [ ] Redirection www → non-www configurée sur Netlify
- [ ] Grille de scoring des leads documentée pour usage manuel (phase 1)
