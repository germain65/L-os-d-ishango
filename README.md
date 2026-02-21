# L'Os d'Ishango

Plateforme de concours de mathématiques en ligne destinée aux élèves et étudiants français.

## Stack technique

- **Frontend** : Next.js 14 + TypeScript + Tailwind CSS
- **Backend** : NestJS + TypeScript + Prisma
- **Base de données** : PostgreSQL
- **Cache** : Redis
- **Hébergement** : Vercel (frontend) + Railway (backend + DB)

## Démarrage rapide

### Prérequis

- Node.js 18+
- Docker & Docker Compose
- npm 10+

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/los-d-ishango/los-d-ishango.git
cd los-d-ishango

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

### Structure du projet

```
los-d-ishango/
├── apps/
│   ├── frontend/        → Next.js
│   └── backend/         → NestJS
├── packages/
│   └── shared/          → Types partagés
├── prisma/
│   └── schema.prisma    → Schéma de la base
├── docker-compose.yml   → PostgreSQL + Redis
└── README.md
```

## Documentation

- [Prompt système](./PROMPT_SYSTEME_ISHANGO.md) - Contexte complet du projet
- [TODO](./TODO_ISHANGO.md) - Feuille de route de développement
- [API docs](http://localhost:3001/api/docs) - Documentation Swagger (backend démarré)

## Licence

À définir
