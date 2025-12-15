# 🚨 URGENT - Clé API Exposée

## ⚠️ ACTIONS IMMÉDIATES REQUISES

Votre clé API Google a été détectée dans l'historique Git de votre repository public. **Vous devez IMMÉDIATEMENT révoquer cette clé et en générer une nouvelle.**

### 🔴 Étape 1 : Révoquer la clé API compromise

1. **Allez sur Google Cloud Console** : [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)

2. **Trouvez la clé API exposée** :
   - Clé détectée : `AT7a9GyC7a4TtX4MkIFiJMxT56pc1YWWa4tEFTf4U` (partiellement masquée)
   - Type : `google_api_key`

3. **Supprimez immédiatement cette clé** :
   - Cliquez sur la clé dans la liste
   - Cliquez sur "Supprimer" ou "Delete"
   - Confirmez la suppression

### ✅ Étape 2 : Créer une nouvelle clé API

1. Dans Google Cloud Console, cliquez sur **"+ CREATE CREDENTIALS"**
2. Sélectionnez **"API key"**
3. **IMPORTANT** : Configurez les restrictions :
   - **Application restrictions** : Sélectionnez "HTTP referrers" et ajoutez vos domaines autorisés
   - **API restrictions** : Limitez à "YouTube Data API v3" uniquement
   - **Ne jamais** laisser une clé API sans restrictions

4. Copiez la nouvelle clé générée

### 🔒 Étape 3 : Configurer la nouvelle clé dans .env

1. Ouvrez le fichier `.env` dans votre projet (créez-le s'il n'existe pas)

2. Ajoutez votre nouvelle clé :

```bash
YOUTUBE_API_KEY=VOTRE_NOUVELLE_CLE_API_ICI
YOUTUBE_CHANNEL_ID=VOTRE_CHANNEL_ID
```

3. **Ne jamais commiter ce fichier** dans Git (il est déjà dans `.gitignore`)

### 🛡️ Étape 4 : Vérifier la sécurité

✅ `.gitignore` a été mis à jour pour exclure :
- `.env` et toutes ses variantes
- `.next/` (qui contenait la clé dans le cache)
- `node_modules/`

✅ Les fichiers `.next` ont été supprimés du repository Git

### 📊 Ce qui s'est passé

1. **Problème** : Le dossier `.next/` (build cache de Next.js) a été commité dans Git
2. **Contenu** : Ce dossier contenait votre clé API dans les fichiers de cache
3. **Détection** : GitHub Secret Scanning a détecté la clé exposée
4. **Localisation** : Commit `595cbcc` - "Initial commit - Fufu website V2"

### 🔧 Corrections appliquées

1. ✅ Mis à jour `.gitignore` avec des exclusions complètes
2. ✅ Supprimé `.next/` du repository Git
3. ✅ Le code source utilise déjà correctement `process.env.YOUTUBE_API_KEY`

### ⚠️ Prochaines étapes

**AVANT de pousser ces changements sur GitHub** :

1. ✅ Révoquez l'ancienne clé API (FAIT ?)
2. ✅ Créez une nouvelle clé API avec restrictions
3. ✅ Mettez à jour votre fichier `.env` local
4. ✅ Testez que l'application fonctionne avec la nouvelle clé

**PUIS commitez et poussez** :

```bash
git add .gitignore
git commit -m "security: remove exposed .next files and update .gitignore"
git push origin main --force
```

> **Note** : `--force` est nécessaire pour récrire l'historique Git et supprimer complètement la clé exposée.

### 📚 Ressources

- [Google Cloud API Security Best Practices](https://cloud.google.com/docs/security/api-security)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

### ❓ Questions fréquentes

**Q: Pourquoi la clé était-elle exposée si j'utilise `.env` ?**  
R: Le dossier `.next/` (cache de build) contenait la clé. Il n'était pas dans `.gitignore` initialement.

**Q: Dois-je vraiment révoquer la clé ?**  
R: **OUI, ABSOLUMENT.** Une clé exposée publiquement peut être utilisée par n'importe qui pour accéder à vos quotas YouTube API.

**Q: Comment éviter cela à l'avenir ?**  
R: Toujours vérifier que `.gitignore` exclut `.next/`, `node_modules/`, et tous les fichiers `.env*` AVANT le premier commit.

---

## 🆘 Support

Si vous avez besoin d'aide, consultez :
- [Documentation Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- [Documentation GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning)
