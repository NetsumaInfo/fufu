# Configuration Google Cloud Storage pour Assets

## 🎯 Objectif

Déplacer les fichiers volumineux (vidéos, images) vers Google Cloud Storage pour :
- ✅ Chargement ultra-rapide avec CDN
- ✅ Image Docker 10x plus légère
- ✅ Déploiement Cloud Run plus rapide
- ✅ Bande passante moins chère

## 📦 Étape 1 : Créer le Bucket

```powershell
# Se connecter à Google Cloud (si pas déjà fait)
gcloud auth login

# Créer un bucket dans la région Europe
gsutil mb -l europe-west1 gs://fulguria-assets

# Configurer le bucket pour un accès public
gsutil iam ch allUsers:objectViewer gs://fulguria-assets

# Activer le CORS pour Next.js
echo '[{"origin": ["*"], "method": ["GET"], "responseHeader": ["Content-Type"], "maxAgeSeconds": 3600}]' > cors-config.json
gsutil cors set cors-config.json gs://fulguria-assets
del cors-config.json
```

## 📤 Étape 2 : Uploader les Vidéos

```powershell
# Se placer dans le dossier du projet
cd "s:\projet_app\site web fufu V2"

# Uploader toutes les vidéos hero avec cache optimal
gsutil -m cp -r public/video gs://fulguria-assets/

# Configurer le cache-control (1 an)
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" gs://fulguria-assets/video/**

# Vérifier l'upload
gsutil ls gs://fulguria-assets/video/
```

## 🖼️ Étape 3 : Uploader les Images (Optionnel)

```powershell
# Uploader les images volumineuses
gsutil -m cp -r public/images gs://fulguria-assets/

# Configurer le cache
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" gs://fulguria-assets/images/**
```

## 🔗 Étape 4 : URLs des Assets

Après l'upload, vos fichiers seront accessibles via :

**Format standard :**
```
https://storage.googleapis.com/fulguria-assets/video/Aether.webm
https://storage.googleapis.com/fulguria-assets/video/KiRr_-_Shizuku_II.webm
```

**Format CDN (plus rapide) :**
```
https://fulguria-assets.storage.googleapis.com/video/Aether.webm
```

## ⚡ Étape 5 : Activer Cloud CDN (Optionnel - Performance Max)

Pour activer le CDN Google (distribution mondiale ultra-rapide) :

```powershell
# Créer un backend bucket
gcloud compute backend-buckets create fulguria-cdn-backend \
    --gcs-bucket-name=fulguria-assets \
    --enable-cdn

# Créer un Load Balancer avec CDN
gcloud compute url-maps create fulguria-cdn-lb \
    --default-backend-bucket=fulguria-cdn-backend

# Créer un proxy HTTP
gcloud compute target-http-proxies create fulguria-cdn-proxy \
    --url-map=fulguria-cdn-lb

# Réserver une IP
gcloud compute addresses create fulguria-cdn-ip --global

# Créer la forwarding rule
gcloud compute forwarding-rules create fulguria-cdn-rule \
    --global \
    --target-http-proxy=fulguria-cdn-proxy \
    --address=fulguria-cdn-ip \
    --ports=80

# Obtenir l'IP du CDN
gcloud compute addresses describe fulguria-cdn-ip --global --format="get(address)"
```

Ensuite, configurez un domaine personnalisé ou utilisez l'IP fournie.

## 🧹 Étape 6 : Nettoyer le Projet Local

Après avoir vérifié que tout fonctionne :

```powershell
# NE PAS supprimer immédiatement, garder un backup !
# Créer un backup
mkdir backup_videos
xcopy "public\video" "backup_videos\video" /E /I

# Supprimer les vidéos du projet (après vérification)
# rmdir /S /Q "public\video"
```

## 💰 Estimation des Coûts

**Cloud Storage (europe-west1) :**
- Stockage : ~0,020 $ / GB / mois
- Pour 5 vidéos (~2 GB total) : ~0,04 $ / mois

**Bande passante :**
- Premier 1 GB gratuit / mois
- Puis ~0,12 $ / GB pour l'Europe
- Avec CDN : beaucoup moins cher car cache mondial

**Total estimé :** Moins de 5 $ / mois pour un site avec trafic modéré.

## 🔍 Vérification

Testez vos URLs dans un navigateur :
```
https://storage.googleapis.com/fulguria-assets/video/Aether.webm
```

Si ça fonctionne, vous pouvez mettre à jour le code !

## 📝 Notes Importantes

> [!WARNING]
> Ne supprimez pas les vidéos locales avant d'avoir vérifié que :
> 1. Les uploads sont complets
> 2. Les URLs fonctionnent
> 3. Le code est mis à jour
> 4. L'application déployée fonctionne

> [!TIP]
> **Cache Control**
> Le header `Cache-Control: public, max-age=31536000` indique aux navigateurs et au CDN de garder les vidéos en cache pendant 1 an. Changez le nom du fichier si vous modifiez la vidéo.
