# L'Os d'Ishango — TODO.md
**Plateforme de concours de mathématiques en ligne**
**Stack : Next.js 14 · NestJS · Prisma · PostgreSQL · Redis · Vercel + Railway**
**Dernière mise à jour : Février 2026**

---

> **Mode d'emploi IA** : Pour chaque tâche, colle le `PROMPT_SYSTEME_ISHANGO.md` en contexte, puis formule la demande ainsi :
> *"Implémente [numéro de tâche] : [titre]"*
> Exemple : *"Implémente 1.1.a : Modèle User Prisma + migration initiale"*

---

## Phase 0 — Préparation & fondations

- [x] **0.a** — Créer organisation GitHub + dépôt privé `los-d-ishango` 
- [x] **0.b** — Initialiser monorepo (Turborepo ou npm workspaces) avec structure `apps/frontend`, `apps/backend`, `packages/shared` 
- [x] **0.c** — Configurer `docker-compose.yml` (PostgreSQL 16 + Redis 7) pour le développement local
- [x] **0.d** — Configurer `.env.example` avec toutes les variables requises (DATABASE_URL, REDIS_URL, JWT_SECRET, SMTP_*, etc.)
- [x] **0.e** — Initialiser Prisma + schéma complet (voir modèles dans PROMPT_SYSTEME)
- [x] **0.f** — Configurer GitHub Actions : lint + typecheck + tests à chaque push
- [x] **0.g** — Créer maquette wireframe (Excalidraw ou Figma) : home, liste exercices, page compétition, timer question
- [x] **0.h** — Définir charte graphique : palette couleurs + typographie + logo placeholder
- [x] **0.i** — Rédiger `README.md` + `CONTRIBUTING.md` + `LICENSE` (AGPL choisi)
- [x] **0.j** — Configurer domaine gratuit GitHub Pages + email

---

## Phase 1 — MVP minimal viable

### 1.1 Authentification & utilisateurs

- [ ] **1.1.a** — Modèle `User` Prisma + migration initiale
- [ ] **1.1.b** — Module NestJS `AuthModule` : inscription email/password (hash bcrypt)
- [ ] **1.1.c** — Endpoint `POST /auth/register` + validation (Zod côté front, class-validator côté back)
- [ ] **1.1.d** — Envoi email de vérification (Nodemailer + template HTML simple)
- [ ] **1.1.e** — Endpoint `GET /auth/verify-email?token=...`
- [ ] **1.1.f** — Endpoint `POST /auth/login` → retourne JWT + refresh token (cookie httpOnly)
- [ ] **1.1.g** — Endpoint `POST /auth/logout` + `POST /auth/refresh`
- [ ] **1.1.h** — Endpoint `POST /auth/forgot-password` + `POST /auth/reset-password`
- [ ] **1.1.i** — Guard NestJS `JwtAuthGuard` + décorateur `@CurrentUser()`
- [ ] **1.1.j** — Page Next.js `/inscription` + formulaire (pseudo, email, password, catégorie)
- [ ] **1.1.k** — Page Next.js `/connexion` + gestion erreurs
- [ ] **1.1.l** — Hook `useAuth()` côté frontend + contexte global
- [ ] **1.1.m** — Page `/profil` : pseudo, catégorie, date inscription, stats globales (exercices tentés, score moyen)
- [ ] **1.1.n** — Middleware Next.js : redirection si non connecté sur routes privées

### 1.2 Page d'accueil publique

- [ ] **1.2.a** — Hero section : nom du projet, slogan, description courte
- [ ] **1.2.b** — Section "Prochaines compétitions" (données réelles depuis API ou statique au début)
- [ ] **1.2.c** — Section "Comment ça marche" (3 étapes illustrées)
- [ ] **1.2.d** — CTA : bouton Inscription + bouton Connexion + lien Exercices
- [ ] **1.2.e** — Responsive mobile first (Tailwind breakpoints)
- [ ] **1.2.f** — Métadonnées SEO (title, description, og:image) via Next.js Metadata API

### 1.3 Module Entraînement (exercices libres)

- [ ] **1.3.a** — Modèle `Question` Prisma + seed initial (20 questions minimum)
- [ ] **1.3.b** — Endpoint `GET /questions` avec filtres : `niveau`, `theme`, `difficulte`, pagination
- [ ] **1.3.c** — Endpoint `GET /questions/:id`
- [ ] **1.3.d** — Page `/exercices` : liste avec filtres (dropdowns niveau/thème/difficulté) + pagination
- [ ] **1.3.e** — Page `/exercices/:id` : énoncé rendu en KaTeX + bouton "Voir la solution" (cachée par défaut)
- [ ] **1.3.f** — Composant `KatexRenderer` réutilisable (rendu sécurisé, support display/inline)
- [ ] **1.3.g** — Bouton "Marquer comme favori" (persisté en base)
- [ ] **1.3.h** — Page `/mes-exercices` : historique tentatives + favoris
- [ ] **1.3.i** — Endpoint `POST /exercices/:id/tentative` (log de consultation)

### 1.4 Administration (backoffice)

- [ ] **1.4.a** — Guard `RolesGuard` + décorateur `@Roles('ADMIN')`
- [ ] **1.4.b** — Layout `/admin` protégé (vérifie rôle ADMIN)
- [ ] **1.4.c** — Page `/admin/questions` : liste + recherche + pagination
- [ ] **1.4.d** — Page `/admin/questions/nouvelle` : formulaire avec preview KaTeX en temps réel
- [ ] **1.4.e** — Page `/admin/questions/:id/edit` : édition + prévisualisation
- [ ] **1.4.f** — Suppression question (soft delete)
- [ ] **1.4.g** — Page `/admin/utilisateurs` : liste + recherche par email/pseudo + changement de rôle

---

## Phase 2 — Compétition chronométrée (cœur du projet)

### 2.1 Modèles de données

- [ ] **2.1.a** — Modèles `Competition`, `Phase`, `PhaseQuestion` Prisma + migration
- [ ] **2.1.b** — Modèles `CompetitionSession`, `Submission` Prisma + migration
- [ ] **2.1.c** — Seed : 2 compétitions fictives complètes (éliminatoire + finale) avec questions existantes

### 2.2 Gestion compétitions (admin)

- [ ] **2.2.a** — Page `/admin/competitions` : liste avec statut
- [ ] **2.2.b** — Page `/admin/competitions/nouvelle` : formulaire (titre, catégorie, phases, dates)
- [ ] **2.2.c** — Interface d'ajout de questions à chaque phase (drag & drop ou liste ordonnée)
- [ ] **2.2.d** — Actions admin : publier / démarrer / clore une compétition
- [ ] **2.2.e** — Endpoint `PATCH /competitions/:id/statut`

### 2.3 Mécanique de compétition (participant)

- [ ] **2.3.a** — Page `/competitions` : liste compétitions ouvertes/à venir/terminées (filtrées par catégorie)
- [ ] **2.3.b** — Page `/competitions/:id` : présentation + règles + bouton "S'inscrire" / "Commencer"
- [ ] **2.3.c** — Endpoint `POST /competitions/:id/sessions` : création session unique (upsert protégé)
- [ ] **2.3.d** — Page `/competitions/:id/session` : page principale de la compétition
- [ ] **2.3.e** — Composant `TimerQuestion` : affichage décompte + barre de progression (interpolation client, vérité serveur)
- [ ] **2.3.f** — WebSocket Gateway NestJS : canal `competition-session` + heartbeat toutes les 5s
- [ ] **2.3.g** — Affichage question courante : énoncé KaTeX + champ de réponse adapté au type
- [ ] **2.3.h** — Composant `ReponseNumerique` : input + validation format
- [ ] **2.3.i** — Composant `ReponseLatex` : input LaTeX + preview KaTeX en temps réel
- [ ] **2.3.j** — Composant `ReponseQCM` : boutons radio stylisés
- [ ] **2.3.k** — Endpoint `POST /sessions/:id/soumettre` : validation réponse + calcul correct + points
- [ ] **2.3.l** — Sauvegarde automatique réponse en cours toutes les 10s (`PUT /sessions/:id/brouillon`)
- [ ] **2.3.m** — Transition automatique vers question suivante après soumission ou expiration timer
- [ ] **2.3.n** — Transition de phase (éliminatoire → quarts → demis → finale) avec écran intermédiaire
- [ ] **2.3.o** — Écran de fin de session : score + résumé des réponses

### 2.4 Anti-triche

- [ ] **2.4.a** — Session unique par `(userId, competitionId)` — contrainte DB + vérification serveur
- [ ] **2.4.b** — Détection multi-onglets : broadcast `localStorage` event → alerte + verrouillage
- [ ] **2.4.c** — Rate limiting strict routes compétition : 10 req/s par user (Redis + `@nestjs/throttler`)
- [ ] **2.4.d** — Log de session : chaque action horodatée + IP stockée en base
- [ ] **2.4.e** — Validation côté serveur de chaque réponse (jamais de logique de scoring côté client)

### 2.5 Classement & résultats

- [ ] **2.5.a** — Service `ScoringService` : calcul score final (points + temps cumulé pour départage)
- [ ] **2.5.b** — Endpoint `GET /competitions/:id/classement` : top 50 avec score + temps
- [ ] **2.5.c** — Endpoint `GET /competitions/:id/mes-resultats` : détail personnel par question
- [ ] **2.5.d** — Page `/competitions/:id/resultats` : tableau classement + carte résultat personnel
- [ ] **2.5.e** — Classement global annuel `GET /classement/annuel?annee=2026`
- [ ] **2.5.f** — Page `/classement` : classement global avec filtre par catégorie

---

## Phase 3 — Qualité & fiabilité

- [ ] **3.a** — HTTPS : configuration Vercel (automatique) + Railway (certificat Let's Encrypt)
- [ ] **3.b** — Page 404 personnalisée + page 500
- [ ] **3.c** — Page de maintenance (`/maintenance`) + variable d'env pour activer
- [ ] **3.d** — Rate limiting global API (100 req/min par IP)
- [ ] **3.e** — Logging structuré backend (Winston) : erreurs + événements compétition
- [ ] **3.f** — Monitoring : intégration Sentry (frontend + backend)
- [ ] **3.g** — Tests unitaires : `AuthService`, `ScoringService`, `TimerService` (Jest)
- [ ] **3.h** — Tests d'intégration : endpoints auth + soumission réponse (Supertest)
- [ ] **3.i** — Seed complet : 10 users + 50 questions + 2 compétitions fictives
- [ ] **3.j** — Script backup PostgreSQL automatisé (Railway cron ou GitHub Actions)

---

## Phase 4 — Polish & fonctionnalités très attendues

- [ ] **4.a** — Éditeur LaTeX amélioré pour participants : intégration **MathLive** dans `ReponseLatex`
- [ ] **4.b** — Dashboard entraînement : graphique progression (questions par thème, taux de réussite)
- [ ] **4.c** — Tags personnels sur exercices favoris
- [ ] **4.d** — Export résultat individuel PDF (titre compétition + énoncés + réponses + score)
- [ ] **4.e** — Classement séparé par catégorie (Lycée / Prépa / Université) sur page `/classement`
- [ ] **4.f** — Notifications email automatiques :
  - Inscription confirmée à une compétition
  - Rappel 24h avant le début
  - Résultats disponibles
- [ ] **4.g** — PWA : `manifest.json` + Service Worker + icônes
- [ ] **4.h** — Mode sombre (Tailwind `dark:`)

---

## Phase 5 — Évolutions post-lancement

- [ ] **5.a** — Badges virtuels (premier podium, 10 compétitions, score parfait…)
- [ ] **5.b** — Certificats de participation PDF signés (avec QR code de vérification)
- [ ] **5.c** — Statistiques détaillées par question : taux de réussite global, temps moyen, distribution des réponses
- [ ] **5.d** — Upload PDF pour démonstrations longues (phase finale uniquement)
- [ ] **5.e** — Comparaison symbolique des réponses LaTeX via **SymPy** (microservice Python)
- [ ] **5.f** — WebSocket classement live : top 10 mis à jour en temps réel pendant la compétition
- [ ] **5.g** — Version anglaise complète (i18n avec `next-intl`)
- [ ] **5.h** — Système de suggestion de questions par les participants (avec validation admin)

---

## Suivi infra & DevOps

- [ ] Configurer projet Vercel (connecté au repo GitHub, branche `main` → prod, `develop` → preview)
- [ ] Configurer projet Railway (PostgreSQL + Redis + service NestJS)
- [ ] Variables d'environnement configurées sur Vercel ET Railway
- [ ] GitHub Actions : pipeline CI (lint + tests) + CD (deploy auto sur merge `main`)
- [ ] Documentation API : Swagger UI accessible sur `/api/docs` (NestJS `@nestjs/swagger`)
- [ ] Documentation admin : guide "Comment créer une compétition" (Markdown dans le repo)

---

## Ordre de priorité recommandé

```
Phase 0 → 1.1 → 1.3 → 1.2 → 1.4 → 2.1 → 2.2 → 2.3 → 2.4 → 2.5 → Phase 3 → Phase 4
```

Ne pas commencer la Phase 2 avant que l'auth (1.1) et les exercices (1.3) soient fonctionnels et testés.

---

Dernière mise à jour du TODO : **Février 2026**
Prochain jalon : **Phase 0 complète + authentification fonctionnelle**

## ✅ Phase 0 — Terminée (10/10)

- [x] **0.a** — Dépôt GitHub créé : https://github.com/germain65/L-os-d-ishango
- [x] **0.b** — Monorepo Turborepo initialisé avec structure complète
- [x] **0.c** — Docker Compose configuré (PostgreSQL 16 + Redis 7)
- [x] **0.d** — Variables d'environnement définies dans `.env.example`
- [x] **0.e** — Schéma Prisma complet avec tous les modèles
- [x] **0.f** — GitHub Actions CI/CD fonctionnel
- [x] **0.g** — Wireframes détaillés créés dans `docs/wireframes.md`
- [x] **0.h** — Charte graphique complète dans `docs/charte-graphique.md`
- [x] **0.i** — Documentation complète (README, CONTRIBUTING, LICENSE AGPL)
- [x] **0.j** — Domaine gratuit GitHub Pages configuré

**Prochaine étape : Phase 1.1 - Authentification**
