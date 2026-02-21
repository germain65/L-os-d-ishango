# Domaine Gratuit - GitHub Pages

## 🌐 Solution recommandée

Pour L'Os d'Ishango, nous utiliserons **GitHub Pages** qui offre un domaine gratuit automatiquement :

### Domaine principal
```
https://germain65.github.io/L-os-d-ishango/
```

### Domaine personnalisé (optionnel)
```
los-d-ishango.org → redirige vers le GitHub Pages
```

## ⚙️ Configuration GitHub Pages

### 1. Activer GitHub Pages

1. Aller dans le dépôt : https://github.com/germain65/L-os-d-ishango
2. Cliquer sur **Settings** → **Pages**
3. **Source** : Sélectionner **Deploy from a branch**
4. **Branch** : `main`
5. **Folder** : `/root`
6. Cliquer sur **Save**

### 2. Configuration du build

Dans `.github/workflows/deploy.yml` :

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build frontend
        run: npm run build --workspace=frontend
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./apps/frontend/out
```

### 3. Mettre à jour next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

## 📧 Configuration email gratuite

Pour `contact@los-d-ishango.org`, utiliser **GitHub Email** :

### Option 1 : GitHub Email (gratuit)
```
germain65@users.noreply.github.com
```

### Option 2 : Forwarding gratuit
Utiliser un service comme **ForwardEmail.net** :
1. Créer un compte sur forwardemail.net
2. Configurer `los-d-ishango.org` (si acheté plus tard)
3. Rediriger vers votre email personnel

### Option 3 : Gmail avec alias
1. Utiliser votre Gmail principal
2. Créer un alias `contact.los.d.ishango@gmail.com`
3. Configurer dans les variables d'environnement

## 🚀 Avantages de cette solution

### ✅ Avantages
- **Gratuit** : Aucun coût d'hébergement
- **Automatique** : Déploiement automatique à chaque push
- **HTTPS** : SSL inclus automatiquement
- **Statique** : Performance optimale pour le frontend
- **Intégré** : Natif à l'écosystème GitHub

### ⚠️ Limitations
- **Frontend uniquement** : Le backend nécessitera Railway
- **URL longue** : `github.io/...` au début
- **Statique** : Pas de SSR côté client

## 🔄 Architecture finale

```
Frontend (statique) : https://germain65.github.io/L-os-d-ishango/
Backend (API)      : https://los-d-ishango-production.up.railway.app
Base de données     : PostgreSQL sur Railway
Redis              : Redis sur Railway
```

## 📋 Checklist de déploiement

- [ ] Configurer GitHub Pages dans les settings du dépôt
- [ ] Ajouter le workflow de déploiement
- [ ] Mettre à jour next.config.js pour export statique
- [ ] Configurer les variables d'environnement pour le backend
- [ ] Tester le déploiement automatique
- [ ] Configurer l'email de contact

## 💡 Alternative future

Quand le projet prendra de l'ampleur :
1. Acheter `los-d-ishango.org` (~12€/an)
2. Configurer Vercel pour le frontend
3. Garder Railway pour le backend
4. Bénéficier d'un domaine professionnel

---

Cette solution gratuite permet de lancer L'Os d'Ishango sans aucun coût initial tout en gardant la possibilité d'évoluer vers une solution professionnelle plus tard.
