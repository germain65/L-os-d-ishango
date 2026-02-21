# Guide de contribution - L'Os d'Ishango

Merci de votre intérêt pour contribuer à L'Os d'Ishango ! Ce guide explique comment participer au développement de cette plateforme de concours de mathématiques.

## 🎯 Objectif du projet

L'Os d'Ishango est une plateforme de concours de mathématiques en ligne destinée aux élèves et étudiants français (Lycée, Prépa, Université). Elle permet de s'entraîner sur des exercices et de participer à des compétitions chronométrées.

## 🏗️ Stack technique

- **Frontend** : Next.js 14 + TypeScript + Tailwind CSS
- **Backend** : NestJS + TypeScript + Prisma
- **Base de données** : PostgreSQL
- **Cache** : Redis
- **Hébergement** : Vercel (frontend) + Railway (backend)

## 📋 Comment contribuer

### 1. Fork et clone

```bash
# Fork le dépôt sur GitHub, puis cloner
git clone https://github.com/VOTRE_USERNAME/L-os-d-ishango.git
cd L-os-d-ishango
```

### 2. Installation

```bash
# Installer les dépendances
npm install

# Démarrer les services de base de données
docker-compose up -d

# Initialiser la base de données
npx prisma migrate dev
npx prisma generate

# Démarrer le développement
npm run dev
```

### 3. Créer une branche

```bash
git checkout -b feature/nom-de-la-fonctionnalite
```

### 4. Développement

- Respectez les conventions de code définies dans `PROMPT_SYSTEME_ISHANGO.md`
- TypeScript strict obligatoire
- Commentaires en français
- Pas de `any` TypeScript
- Tests pour les nouvelles fonctionnalités

### 5. Soumission

```bash
# Commiter les changements
git add .
git commit -m "feat: ajoute la fonctionnalité X"

# Pousser et créer une Pull Request
git push origin feature/nom-de-la-fonctionnalite
```

## 📝 Conventions de commits

Format : `[type]: [description]`

- `feat:` nouvelle fonctionnalité
- `fix:` correction de bug
- `docs:` documentation
- `style:` formatage/style
- `refactor:` refactoring
- `test:` tests
- `chore:` maintenance

Exemples :
- `feat: ajoute page d'inscription`
- `fix: corrige validation email`
- `docs: met à jour README`

## 🧪 Tests

```bash
# Lancer tous les tests
npm test

# Tests avec coverage
npm run test:coverage

# Linter
npm run lint

# Type checking
npm run typecheck
```

## 📂 Structure du projet

```
los-d-ishango/
├── apps/
│   ├── frontend/        # Application Next.js
│   └── backend/         # API NestJS
├── packages/
│   └── shared/          # Types et utilitaires partagés
├── prisma/
│   ├── schema.prisma    # Schéma de base de données
│   └── migrations/      # Migrations Prisma
└── docs/               # Documentation supplémentaire
```

## 🎨 Charte graphique

- **Ton** : Sérieux, élégant, mathématique
- **Langue** : Français uniquement
- **Couleurs** : Bleu nuit + or + blanc
- **Typographie** : Sans-serif moderne, lisible pour les formules

## 🚨 Règles importantes

1. **Pas de calcul de score côté client** - Tous les calculs se font sur le serveur
2. **Pas de localStorage pour les sessions de compétition** - Utiliser Redis
3. **TypeScript strict** - Aucun `any` non documenté
4. **Français obligatoire** - Code, commentaires et messages
5. **Gestion d'erreurs** - Toutes les routes doivent gérer les erreurs

## 🤝 Types de contributions

- **Bug reports** : Issues GitHub avec template
- **Fonctionnalités** : Discuter avant d'implémenter
- **Documentation** : Améliorations bienvenues
- **Tests** : Toujours appréciés
- **Questions mathématiques** : Soumissions d'exercices

## 📞 Contact

- **Issues** : [GitHub Issues](https://github.com/germain65/L-os-d-ishango/issues)
- **Email** : contact@los-d-ishango.org

## 📄 Licence

Ce projet est sous licence [AGPL-3.0](LICENSE).

---

Merci de votre contribution ! 🎉
