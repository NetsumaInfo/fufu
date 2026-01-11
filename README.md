# Fulguria Team - Site Web Showcase

Site vitrine moderne et premium pour le collectif AMV Fulguria Team.

## 🚀 Démarrage rapide

### Développement local

```bash
# Installation des dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

### Production

```bash
npm run build
npm start
```

## 🎨 Stack technologique

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19
- **Styling**: TailwindCSS v3
- **Animations**: Framer Motion
- **Base de données**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Auth**: JWT + bcrypt
- **Email**: Resend
- **Storage**: Supabase Storage
- **Language**: TypeScript

## 📄 Pages

| Route | Description |
|-------|-------------|
| `/` | Accueil avec hero, équipe, vidéos |
| `/team` | Profils détaillés par rôle |
| `/videos` | Galerie des vidéos |
| `/recruitment` | Recrutement + FAQ |
| `/contact` | Liens sociaux |
| `/login` | Connexion / Inscription |
| `/profile` | Gestion du profil |
| `/reset-password` | Réinitialisation mot de passe |

## 🔐 Fonctionnalités Auth

- ✅ Inscription avec email de bienvenue
- ✅ Connexion avec "Rester connecté" (30 jours)
- ✅ Mot de passe oublié par email
- ✅ Changement de mot de passe
- ✅ Suppression de compte

## ⚙️ Variables d'environnement

Copier `.env.example` vers `.env` et remplir :

```env
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
NEXT_PUBLIC_APP_URL=
YOUTUBE_API_KEY=
YOUTUBE_CHANNEL_ID=
DISCORD_WEBHOOK_URL=
```

## 📁 Structure

```
/app          - Pages Next.js (App Router)
/components   - Composants React
/lib          - Utils, auth, prisma, supabase
/messages     - Traductions (fr, en, es, ja, ru, zh)
/prisma       - Schema base de données
/public       - Assets statiques
```

## 🌐 Internationalisation

6 langues supportées : 🇫🇷 🇬🇧 🇪🇸 🇯🇵 🇷🇺 🇨🇳

## 📱 Responsive

Mobile-first avec breakpoints : Mobile < 768px, Tablet 768-1024px, Desktop > 1024px
