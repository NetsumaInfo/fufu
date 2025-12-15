# Fulguria Team - Site Web Showcase

Site vitrine moderne et premium pour le collectif AMV Fulguria Team.

## 🚀 Démarrage rapide

```bash
# Installation des dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build de production
npm run build

# Lancer le serveur de production
npm start
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du projet

- `/app` - Pages Next.js (App Router)
- `/components` - Composants React réutilisables
- `/lib` - Utilitaires, types TypeScript et données mock
- `/public` - Assets statiques (images, etc.)

## 🎨 Stack technologique

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19
- **Styling**: TailwindCSS v3
- **Animations**: Framer Motion
- **Language**: TypeScript
- **Icons**: Lucide React

## 📄 Pages

- `/` - Page d'accueil avec hero, preview équipe, vidéos récentes
- `/team` - Page équipe avec profils détaillés par rôle
- `/videos` - Galerie de toutes les vidéos
- `/recruitment` - Page recrutement avec formulaire et FAQ
- `/contact` - Page contact avec liens sociaux

## 🔧 Données mocké es

Actuellement, le site utilise des données mockées dans `/lib/data/`:

- `members.ts` - 8 membres de l'équipe
- `videos.ts` - 15 vidéos AMV
- `recruitment.ts` - Données de recrutement et FAQ

### Intégration API YouTube (Future)

Le fichier `/lib/providers/VideoProvider.ts` est préparé pour intégrer l'API YouTube Data v3. Instructions détaillées dans les commentaires du fichier.

## ♿ Accessibilité

- Navigation clavier complète
- Support `prefers-reduced-motion`
- Labels ARIA
- Focus trap dans les modales
- Indicateurs de focus visibles

## 🎨 Design System

Le design system est défini dans `/app/globals.css`:

- **Thème sombre** avec effets glassmorphism
- **Gradients** purple/pink pour l'identité visuelle
- **Typographie** Inter (Google Fonts)
- **Animations** subtiles et respectueuses

## 📱 Responsive

Design mobile-first avec breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔮 Améliorations futures

- Intégration API YouTube pour charger les vraies vidéos
- Backend pour le formulaire de recrutement
- CMS pour la gestion du contenu
- Authentification membres (optionnel)
- Page projets collaboratifs
- Section blog/actualités

## 📄 License

© 2024 Fulguria Team - Tous droits réservés
