# 🚀 Déploiement sur cPanel - Guide complet

## Configuration de l'application Node.js sur cPanel

### Étape 1 : Accéder à Setup Node.js App

1. Connectez-vous à votre **cPanel**
2. Sous l'onglet **"Software"**, cliquez sur **"Setup Node.js App"**
3. Cliquez sur le bouton **"Create Application"**

---

## 📝 Configuration de l'application

Remplissez le formulaire avec ces valeurs :

| Champ | Valeur |
|-------|--------|
| **Node.js Version** | `18` ou supérieur (18, 19, 20, ou 21) |
| **Application mode** | `Production` |
| **Application root** | `/home/yourusername/fufu` (ou le chemin de votre choix) |
| **Application URL** | Votre domaine ou sous-domaine (ex: `fufu.votredomaine.com`) |
| **Application startup file** | `server.js` |
| **Passenger log file** | `/home/yourusername/logs/fufu.log` |

> [!IMPORTANT]
> **Node.js Version** : Choisissez **18** ou supérieur. Next.js 15 ne fonctionne PAS avec Node.js < 18.18.0

### Variables d'environnement à ajouter

Cliquez sur **"Add Variable"** et ajoutez :

| Nom de la variable | Valeur |
|-------------------|--------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` (ou le port assigné par cPanel) |
| `YOUTUBE_API_KEY` | Votre clé API YouTube |
| `YOUTUBE_CHANNEL_ID` | ID de votre chaîne YouTube |

Cliquez sur **"Create"** pour créer l'application.

---

## 📂 Upload des fichiers

### Option 1 : Via Git (RECOMMANDÉ)

Une fois l'application créée, cPanel affiche une section pour exécuter des commandes. Utilisez celle-ci :

```bash
cd /home/yourusername/fufu
git clone https://github.com/NetsumaInfo/fufu.git .
npm install --omit=dev
npm run build
```

### Option 2 : Via SFTP

1. Connectez-vous via **SFTP** (voir documentation cPanel)
2. Allez dans le dossier `/home/yourusername/fufu`
3. Uploadez TOUS les fichiers du projet SAUF :
   - `node_modules/`
   - `.next/`
   - `.env`
   - `.git/`
4. Créez un fichier `.env` dans ce dossier avec vos variables

### Option 3 : Via File Manager cPanel

1. Allez dans **File Manager** de cPanel
2. Naviguez vers `/home/yourusername/fufu`
3. Uploadez les fichiers (vous pouvez créer un ZIP et l'extraire)

---

## 🔨 Build de l'application

**IMPORTANT** : Next.js doit être buildé avant de démarrer. Dans la section de commandes de cPanel :

```bash
cd /home/yourusername/fufu
npm install --omit=dev
npm run build
```

Le `server.js` intelligent détectera automatiquement si le build manque et le créera au premier démarrage.

---

## ▶️ Démarrer l'application

Cliquez sur le bouton **"Restart"** dans l'interface "Setup Node.js App".

cPanel démarrera automatiquement votre application avec `node server.js`.

---

## ✅ Vérification

1. Visitez l'URL que vous avez configurée (ex: `fufu.votredomaine.com`)
2. Vous devriez voir votre site Fufu !

**Si vous voyez une page par défaut Node.js**, c'est que l'application n'a pas encore démarré correctement. Vérifiez les logs.

---

## 📋 Checklist de déploiement

- [ ] Node.js version ≥ 18 sélectionnée dans cPanel
- [ ] Application mode = `Production`
- [ ] Application startup file = `server.js`
- [ ] Variables d'environnement configurées (`NODE_ENV`, `YOUTUBE_API_KEY`, etc.)
- [ ] Fichiers uploadés (via Git, SFTP ou File Manager)
- [ ] `npm install --omit=dev` exécuté
- [ ] `npm run build` exécuté
- [ ] Application redémarrée
- [ ] Site accessible sur l'URL configurée

---

## 🐛 Dépannage

### L'application ne démarre pas

1. **Vérifiez les logs** :
   - Allez dans le fichier `Passenger log file` que vous avez configuré
   - Ou dans **"Setup Node.js App"** → Cliquez sur votre application → Consultez les logs

2. **Vérifications courantes** :
   - ✅ Node.js version ≥ 18 ?
   - ✅ `npm run build` a été exécuté ?
   - ✅ Fichier `server.js` existe dans Application root ?
   - ✅ Variables d'environnement définies ?

### Erreur "Cannot find module 'next'"

```bash
cd /home/yourusername/fufu
npm install --omit=dev
```

Puis redémarrez l'application.

### Erreur "Cannot find module 'node:crypto'"

Votre version Node.js est trop ancienne. Changez-la dans cPanel pour version 18, 19, 20 ou 21.

### Le site affiche une page blanche

1. Vérifiez que `npm run build` a créé le dossier `.next/`
2. Vérifiez les logs d'erreur
3. Assurez-vous que `NODE_ENV=production` est défini

---

## 🔄 Mise à jour de l'application

Pour déployer des nouvelles modifications :

### Si vous utilisez Git :

```bash
cd /home/yourusername/fufu
git pull
npm install --omit=dev
npm run build
```

Puis **Restart** depuis cPanel.

### Si vous utilisez SFTP :

1. Uploadez les fichiers modifiés
2. Exécutez `npm run build` si nécessaire
3. **Restart** depuis cPanel

---

## 📚 Ressources

- [Documentation cPanel Node.js](https://docs.cpanel.net/cpanel/software/application-manager/)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
- [Documentation Fufu - DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🆘 Support

Si vous avez besoin d'aide :
1. Consultez les logs Passenger
2. Vérifiez la configuration dans "Setup Node.js App"
3. Contactez le support de votre hébergeur cPanel

---

**Bon déploiement ! 🚀**
