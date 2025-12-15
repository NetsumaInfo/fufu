# Configuration de déploiement serveur

## Configuration pour votre hébergeur

D'après votre capture d'écran, voici la configuration à utiliser :

### Variables à configurer sur votre serveur

| Variable | Valeur |
|----------|--------|
| **STARTUP FILE** | `server.js` |
| **GIT REPO ADDRESS** | `github.com/NetsumaInfo/fufu.git` |
| **GIT INSTALL BRANCH** | `main` |
| **GIT USERNAME** | `NetsumaInfo` |
| **GIT ACCESS TOKEN** | Votre token personnel GitHub |
| **NODE PACKAGES** | (laisser vide, `npm install` sera exécuté automatiquement) |

> [!IMPORTANT]
> **Node.js Version requise** : ≥ 18.18.0  
> Next.js 15 ne fonctionne **PAS** avec Node.js v15 ou inférieur. Assurez-vous que votre serveur utilise Node.js 18, 19, 20 ou 21.

### Variables d'environnement supplémentaires

Ajoutez ces variables dans la section "Variables" de votre hébergeur :

```bash
NODE_ENV=production
PORT=3000
```

> **Note** : Le `PORT` sera probablement défini automatiquement par votre hébergeur. Le fichier `server.js` utilise `process.env.PORT` pour s'adapter.

## Commandes de build

Votre serveur devra exécuter ces commandes dans cet ordre :

1. **Installation** : `npm install`
2. **Build** : `npm run build` ⚠️ **OBLIGATOIRE** avant le démarrage
3. **Démarrage** : `node server.js`

> [!WARNING]
> Ne pas oublier `npm run build` ! Sans cette étape, le serveur ne démarrera pas.

## Fichiers créés

### ✅ `index.js`

Fichier de démarrage personnalisé pour Next.js :
- Gère le port dynamiquement via `process.env.PORT`
- Démarre Next.js en mode production
- Gestion d'erreurs robuste
- Auto-build si le dossier `.next/` n'existe pas

### 📦 Script NPM ajouté

Ajouté dans `package.json` : `npm run server` qui lance `node server.js`

## Vérification du déploiement

Une fois déployé, votre site devrait :
1. ✅ Cloner le repository GitHub
2. ✅ Installer les dépendances (`npm install`)
3. ✅ Builder l'application (`npm run build`)
4. ✅ Démarrer le serveur (`node server.js`)

## Dépannage

### Si le serveur ne démarre pas :

1. **Vérifiez les logs** de votre hébergeur
2. **Assurez-vous que** :
   - Node.js version ≥ 18.17 est installée
   - Le build a réussi (`npm run build`)
   - Le port est correctement configuré

### Si vous obtenez "Cannot find module 'next'" :

Exécutez `npm install` avant `node server.js`

### Si vous obtenez "Cannot find module 'node:crypto'" :

Votre version de Node.js est trop ancienne. Next.js 15 requiert **Node.js ≥ 18.18.0**. Mettez à jour Node.js sur votre serveur.

### Si le serveur crash au démarrage :

1. Vérifiez que `npm run build` a été exécuté
2. Vérifiez la version Node.js : `node --version` (doit être ≥ 18.18.0)
3. Consultez les logs du serveur pour plus de détails

### Variables d'environnement importantes :

```bash
NODE_ENV=production  # Active le mode production
PORT=3000           # Port du serveur (votre hébergeur peut le changer)
YOUTUBE_API_KEY=... # Votre clé API YouTube
YOUTUBE_CHANNEL_ID=... # ID de votre chaîne
```

## Support

Pour plus d'informations sur le déploiement Next.js :
- [Documentation Next.js - Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
- [Documentation Next.js - Custom Server](https://nextjs.org/docs/pages/building-your-application/configuring/custom-server)
