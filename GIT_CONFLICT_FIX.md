# 🚨 Conflit Git Persistant - Solution

## Le problème

Votre serveur affiche :
```
error: The following untracked working tree files would be overwritten by merge:
        STARTUP_SCRIPT.sh
        server.js
Please move or remove them before you merge.
```

## ✅ Solution : Commande à exécuter depuis le panel

Vous devez **une seule fois** exécuter une commande pour forcer la synchronisation avec GitHub.

### Option 1 : Via la console du panel (RECOMMANDÉ)

1. **Ouvrez la console** dans votre panel SparkedHost
2. **Arrêtez le serveur**
3. **Exécutez cette commande** :

```bash
cd /home/container && rm -f server.js STARTUP_SCRIPT.sh && git fetch origin && git reset --hard origin/main && git pull
```

4. **Redémarrez le serveur**

### Option 2 : Via un ticket support

Si vous n'avez pas accès à la console :

1. Ouvrez un ticket chez SparkedHost
2. Demandez-leur d'exécuter cette commande sur votre serveur :

```bash
cd /home/container
git fetch origin
git reset --hard origin/main
git pull
```

3. Une fois fait, redémarrez le serveur

---

## Pourquoi ce problème ?

Le serveur a créé des fichiers locaux (`server.js`, `STARTUP_SCRIPT.sh`) qui entrent en conflit avec les versions GitHub. Un simple `git pull` ne peut pas résoudre cela.

## Après avoir exécuté la commande

Une fois la commande exécutée **UNE SEULE FOIS**, le serveur devrait :
1. ✅ Télécharger les fichiers depuis GitHub
2. ✅ Installer les dépendances
3. ✅ Builder automatiquement (grâce au `server.js` intelligent)
4. ✅ Démarrer normalement

---

## Si vous continuez à avoir des problèmes

**Assurez-vous que** :
- Node.js ≥ 18.18.0 ✅ (vous avez v18.20.4, c'est bon)
- Variables d'environnement configurées :
  - `NODE_ENV=production`
  - `YOUTUBE_API_KEY=votre_cle`
  - `YOUTUBE_CHANNEL_ID=votre_channel_id`

**Puis redémarrez le serveur.**
