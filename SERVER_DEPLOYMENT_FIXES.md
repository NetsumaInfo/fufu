# 🚨 Erreurs de déploiement - Corrections requises

## Problèmes détectés

### ✅ Solution pour script de startup verrouillé

Si votre hébergeur ne vous permet pas de modifier le script de startup, **pas de problème !** 

Le fichier `server.js` a été modifié pour :
- ✅ Détecter automatiquement si le build `.next/` existe
- ✅ Exécuter `npm run build` automatiquement s'il n'existe pas
- ✅ Démarrer normalement si le build existe déjà

**Vous n'avez RIEN à faire !** Le serveur se configurera automatiquement.

---

### 🔴 Problème 1 : Version Node.js incompatible (CRITIQUE)

**Erreur** :
```
Error: Cannot find module 'node:crypto'
npm WARN EBADENGINE package: 'next@15.5.9',
npm WARN EBADENGINE required: { node: '^18.18.0 || ^19.8.0 || >= 20.0.0' },
npm WARN EBADENGINE current: { node: 'v15.14.0', npm: '7.7.6' }
```

**Cause** : Votre serveur utilise Node.js **v15.14.0**, mais Next.js 15 requiert **Node.js ≥ 18.18.0**

**Solution** : Mettre à jour Node.js sur votre serveur

#### Sur SparkedHost/Pterodactyl Panel

1. **Connectez-vous à votre panel de contrôle** : https://sparkedhost.us/server/...
2. **Allez dans "Startup"** (menu de gauche)
3. **Changez "Docker Image"** vers une image avec Node.js 18 ou supérieur :
   - Recherchez une option comme `ghcr.io/parkervcp/yolks:nodejs_18`
   - Ou `ghcr.io/parkervcp/yolks:nodejs_20`
   - Ou `ghcr.io/parkervcp/yolks:nodejs_21`

4. **Redémarrez le serveur**

#### Alternative : Contacter le support

Si vous ne trouvez pas l'option pour changer la version Node.js :
- Contactez le support SparkedHost
- Demandez-leur de mettre à jour votre serveur vers **Node.js 18.18.0 ou supérieur**

---

### 🟡 Problème 2 : Conflit Git avec server.js

**Erreur** :
```
error: The following untracked working tree files would be overwritten by merge:
        server.js
Please move or remove them before you merge.
```

**Cause** : Le serveur a créé un fichier `server.js` local qui entre en conflit avec celui du repository Git

**Solution** : Forcer le pull depuis Git

Sur votre serveur, exécutez :
```bash
cd /home/container
rm server.js  # Supprimer le fichier local
git fetch origin
git reset --hard origin/main  # Force le reset vers la version Git
```

Ou ajoutez cette commande dans votre script de startup (avant `git pull`) :
```bash
git reset --hard origin/main
```

---

## ✅ Configuration recommandée pour le serveur

### Variables à configurer dans votre panel

| Variable | Valeur recommandée |
|----------|-------------------|
| **Docker Image** | `ghcr.io/parkervcp/yolks:nodejs_20` |
| **STARTUP_FILE** | `server.js` |
| **NODE_ENV** | `production` |

### ✅ Script de startup CORRIGÉ (UTILISEZ CELUI-CI)

**Copiez-collez ce script exact dans votre panel** :

```bash
if [[ -d .git ]]; then git reset --hard origin/main; git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then npm install ${NODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then npm install --omit=dev; fi; npm run build; node /home/container/${STARTUP_FILE}
```

**Ou en version lisible** :

```bash
# Résoudre conflit Git et pull
if [[ -d .git ]]; then 
    git reset --hard origin/main
    git pull
fi

# Installer packages personnalisés
if [[ ! -z ${NODE_PACKAGES} ]]; then 
    npm install ${NODE_PACKAGES}
fi

# Installer dépendances
if [ -f /home/container/package.json ]; then 
    npm install --omit=dev
fi

# Build Next.js (OBLIGATOIRE!)
npm run build

# Démarrer
node /home/container/${STARTUP_FILE}
```

**Changements clés** :
- ✅ `git reset --hard origin/main` : Résout le conflit avec `server.js`
- ✅ `npm run build` : Build Next.js avant démarrage
- ✅ `--omit=dev` : Remplace le deprecated `--production`

---

## 🔧 Étapes de résolution complètes

### Étape 1 : Mettre à jour Node.js (OBLIGATOIRE)

1. Panel → Startup → Docker Image → Sélectionnez Node.js 18/20/21
2. Redémarrez le serveur

### Étape 2 : Configurer les variables d'environnement

Dans le panel, ajoutez ces variables :

```bash
NODE_ENV=production
YOUTUBE_API_KEY=votre_nouvelle_cle_api
YOUTUBE_CHANNEL_ID=votre_channel_id
```

### Étape 3 : Fixer le script de startup

Mettez à jour le script de startup pour inclure `npm run build`

### Étape 4 : Redémarrer

Redémarrez le serveur et vérifiez les logs

---

## 📊 Versions requises

| Package | Version actuelle | Version requise |
|---------|------------------|----------------|
| **Node.js** | ❌ v15.14.0 | ✅ ≥ 18.18.0 |
| **npm** | ✅ 7.7.6 | ✅ ≥ 7.x |
| **Next.js** | ✅ 15.5.9 | ✅ 15.x |

---

## 🆘 Si les problèmes persistent

1. **Vérifiez les logs** dans le panel Pterodactyl
2. **Assurez-vous que** :
   - Node.js ≥ 18.18.0 est installé
   - `npm run build` a été exécuté
   - Les variables d'environnement sont définies
3. **Contactez le support** de SparkedHost si vous ne pouvez pas changer la version Node.js

---

## 📝 Checklist de déploiement

- [ ] Node.js mis à jour vers ≥ 18.18.0
- [ ] Variables d'environnement configurées
- [ ] Script de startup mis à jour avec `npm run build`
- [ ] Conflit Git résolu
- [ ] Serveur redémarré
- [ ] Site accessible

---

## 🔗 Ressources

- [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying)
- [Node.js Releases](https://nodejs.org/en/about/previous-releases)
- [SparkedHost Support](https://sparkedhost.us/support)
