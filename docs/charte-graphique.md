# Charte Graphique - L'Os d'Ishango

## 🎨 Philosophie

La charte graphique de L'Os d'Ishango se veut **sérieuse, élégante et mathématique**, adaptée à une plateforme éducative destinée aux élèves et étudiants français. Le design doit inspirer confiance et rigueur intellectuelle tout en restant accessible et moderne.

## 🎯 Principes directeurs

- **Clarté avant tout** : Lisibilité optimale pour les formules mathématiques
- **Élégance discrète** : Design sobre qui ne détourne pas l'attention du contenu
- **Accessibilité** : Contrast respecté, typographie adaptée aux dyslexiques
- **Professionnalisme** : Image sérieuse pour attirer les établissements scolaires

## 🌈 Palette de couleurs

### Couleurs principales

```css
/* Bleu nuit - couleur principale */
--bleu-nuit-50: #eff6ff;
--bleu-nuit-100: #dbeafe;
--bleu-nuit-200: #bfdbfe;
--bleu-nuit-300: #93c5fd;
--bleu-nuit-400: #60a5fa;
--bleu-nuit-500: #3b82f6;  /* Primaire */
--bleu-nuit-600: #2563eb;
--bleu-nuit-700: #1d4ed8;
--bleu-nuit-800: #1e40af;
--bleu-nuit-900: #1e3a8a;

/* Or - accent et succès */
--or-50: #fffbeb;
--or-100: #fef3c7;
--or-200: #fde68a;
--or-300: #fcd34d;
--or-400: #fbbf24;
--or-500: #f59e0b;     /* Accent */
--or-600: #d97706;
--or-700: #b45309;
--or-800: #92400e;
--or-900: #78350f;

/* Neutres */
--gris-50: #f9fafb;
--gris-100: #f3f4f6;
--gris-200: #e5e7eb;
--gris-300: #d1d5db;
--gris-400: #9ca3af;
--gris-500: #6b7280;
--gris-600: #4b5563;
--gris-700: #374151;
--gris-800: #1f2937;
--gris-900: #111827;

/* Sémantiques */
--succes: #10b981;
--avertissement: #f59e0b;
--erreur: #ef4444;
--info: #3b82f6;
```

### Utilisation

- **Bleu nuit** : Fond principal, headers, navigation
- **Or** : Boutons principaux, accents, badges succès
- **Blanc/Gris clair** : Texte, cartes, zones de contenu
- **Gris foncé** : Texte secondaire, bordures

## 🔤 Typographie

### Polices

```css
/* Police principale */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Police pour les mathématiques */
--font-math: 'Latin Modern Math', 'STIX Two Math', 'Cambria Math', serif;

/* Police monospace (code) */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

### Hiérarchie typographique

```css
/* Titres */
.text-h1 { font-size: 2.5rem; font-weight: 700; line-height: 1.2; }
.text-h2 { font-size: 2rem; font-weight: 600; line-height: 1.3; }
.text-h3 { font-size: 1.5rem; font-weight: 600; line-height: 1.4; }
.text-h4 { font-size: 1.25rem; font-weight: 600; line-height: 1.4; }

/* Corps de texte */
.text-body { font-size: 1rem; font-weight: 400; line-height: 1.6; }
.text-small { font-size: 0.875rem; font-weight: 400; line-height: 1.5; }

/* Formules mathématiques */
.math-display { font-size: 1.1rem; line-height: 1.8; }
.math-inline { font-size: 1em; }
```

## 🧩 Composants UI

### Boutons

```css
/* Primaire (bleu nuit) */
.btn-primary {
  background: var(--bleu-nuit-600);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: var(--bleu-nuit-700);
  transform: translateY(-1px);
}

/* Secondaire (or) */
.btn-secondary {
  background: var(--or-500);
  color: var(--gris-900);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
}
```

### Cartes

```css
.card {
  background: white;
  border: 1px solid var(--gris-200);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
```

## 📐 Rendu mathématique

### KaTeX Configuration

```javascript
// Configuration KaTeX pour un rendu optimal
katexConfig = {
  displayMode: true,
  throwOnError: false,
  errorColor: var(--erreur),
  macros: {
    "\\RR": "\\mathbb{R}",
    "\\NN": "\\mathbb{N}",
    "\\ZZ": "\\mathbb{Z}",
    "\\QQ": "\\mathbb{Q}"
  }
}
```

### Styles pour les formules

```css
/* Formules en display */
.katex-display {
  margin: 1.5rem 0;
  text-align: center;
  font-size: 1.1rem;
}

/* Formules en ligne */
.katex {
  font-size: 1em;
  color: var(--gris-800);
}
```

## 🖼️ Logo

### Concept

Le logo combine :
- **Un os stylisé** (référence à l'os d'Ishango)
- **Symboles mathématiques** (intégrale, sigma, racine)
- **Typographie élégante** du nom "L'Os d'Ishango"

### Versions

```
[LOGO] - Version complète (horizontal)
[LOGO] - Version compacte (icône)
[LOGO] - Version monochrome
```

### Placeholder temporaire

En attendant le logo final, utiliser :
- Texte "L'Os d'Ishango" en **Inter Bold**
- Couleur : `var(--bleu-nuit-800)`
- Avec une petite icône d'os stylisée

## 📱 Responsive

### Breakpoints

```css
/* Mobile */
@media (max-width: 640px) {
  .text-h1 { font-size: 2rem; }
  .text-h2 { font-size: 1.5rem; }
  .container { padding: 1rem; }
}

/* Tablette */
@media (min-width: 641px) and (max-width: 1024px) {
  .container { padding: 1.5rem; }
}

/* Desktop */
@media (min-width: 1025px) {
  .container { max-width: 1200px; margin: 0 auto; }
}
```

## 🎭 Animations

### Principes

- **Subtiles** : Pas d'animations qui distraient
- **Significatives** : Chaque animation a un but
- **Performantes** : Utiliser `transform` et `opacity`

### Exemples

```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Pulse pour notifications */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

## ✅ Checklist d'implémentation

- [ ] Configurer Tailwind CSS avec les couleurs personnalisées
- [ ] Importer les polices Inter et Latin Modern Math
- [ ] Configurer KaTeX avec les macros personnalisées
- [ ] Créer les composants UI de base
- [ ] Implémenter le logo placeholder
- [ ] Tester l'accessibilité (contrast, lecteur d'écran)
- [ ] Valider le responsive design

---

Cette charte graphique garantit une expérience utilisateur cohérente, professionnelle et adaptée aux besoins spécifiques de l'enseignement des mathématiques en ligne.
