# Guide de Déploiement sur Google Cloud Run

Ce guide vous accompagne pas à pas pour déployer l'application Fulguria Team Showcase sur Google Cloud Run.

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir :

- [ ] Un compte Google Cloud Platform actif
- [ ] Un projet Google Cloud créé
- [ ] Google Cloud SDK (`gcloud`) installé sur votre machine
- [ ] Docker Desktop installé (optionnel, pour tests locaux)
- [ ] Vos clés API YouTube :
  - `YOUTUBE_API_KEY`
  - `YOUTUBE_CHANNEL_ID`

## 🛠️ Étape 1 : Installation et Configuration de Google Cloud SDK

### Installation de gcloud CLI

**Windows :**
1. Téléchargez l'installateur : https://cloud.google.com/sdk/docs/install
2. Exécutez l'installateur et suivez les instructions
3. Redémarrez votre terminal

### Initialisation

```bash
# Se connecter à Google Cloud
gcloud auth login

# Configurer le projet par défaut
gcloud config set project VOTRE_PROJECT_ID

# Configurer la région par défaut (Europe)
gcloud config set run/region europe-west1
```

### Activer les APIs nécessaires

```bash
# Activer Cloud Run API
gcloud services enable run.googleapis.com

# Activer Container Registry API
gcloud services enable containerregistry.googleapis.com

# Activer Cloud Build API
gcloud services enable cloudbuild.googleapis.com
```

## 🔐 Étape 2 : Configuration des Secrets

Les variables d'environnement sensibles (clés API) doivent être stockées comme secrets dans Google Cloud.

```bash
# Créer le secret pour YOUTUBE_API_KEY
echo -n "VOTRE_CLE_API_YOUTUBE" | gcloud secrets create youtube-api-key --data-file=-

# Créer le secret pour YOUTUBE_CHANNEL_ID
echo -n "VOTRE_ID_CHANNEL_YOUTUBE" | gcloud secrets create youtube-channel-id --data-file=-

# Vérifier que les secrets sont créés
gcloud secrets list
```

## 🚀 Étape 3 : Déploiement sur Cloud Run

### Option A : Déploiement Direct (Recommandé pour débuter)

Cloud Run peut construire et déployer automatiquement depuis votre code source :

```bash
# Se placer dans le dossier du projet
cd "s:\projet_app\site web fufu V2"

# Déployer sur Cloud Run
gcloud run deploy fulguria-team \
  --source . \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --set-secrets YOUTUBE_API_KEY=youtube-api-key:latest,YOUTUBE_CHANNEL_ID=youtube-channel-id:latest \
  --memory 512Mi \
  --cpu 1 \
  --timeout 300 \
  --min-instances 0 \
  --max-instances 10
```

### Option B : Déploiement avec Docker (Avancé)

Si vous préférez construire l'image Docker manuellement :

```bash
# Se placer dans le dossier du projet
cd "s:\projet_app\site web fufu V2"

# 1. Construire l'image Docker
gcloud builds submit --tag gcr.io/VOTRE_PROJECT_ID/fulguria-team

# 2. Déployer l'image sur Cloud Run
gcloud run deploy fulguria-team \
  --image gcr.io/VOTRE_PROJECT_ID/fulguria-team \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --set-secrets YOUTUBE_API_KEY=youtube-api-key:latest,YOUTUBE_CHANNEL_ID=youtube-channel-id:latest \
  --memory 512Mi \
  --cpu 1 \
  --timeout 300 \
  --min-instances 0 \
  --max-instances 10
```

### Explication des options

- `--source .` : Utilise le code source du dossier actuel
- `--region europe-west1` : Région Europe (Belgique)
- `--allow-unauthenticated` : Permet l'accès public (site web)
- `--set-secrets` : Injecte les secrets comme variables d'environnement
- `--memory 512Mi` : Allocation de 512 MB de RAM
- `--cpu 1` : 1 vCPU
- `--min-instances 0` : Scale à 0 quand pas d'utilisation (économie)
- `--max-instances 10` : Maximum 10 instances en parallèle

## ✅ Étape 4 : Vérification du Déploiement

Après le déploiement, Cloud Run vous fournira une URL du type :
```
https://fulguria-team-XXXXXXXXXX-ew.a.run.app
```

### Tests à effectuer

1. **Accéder au site** : Ouvrez l'URL dans votre navigateur
2. **Vérifier les pages** :
   - Page d'accueil avec vidéo hero
   - Page Team
   - Page Videos (vérifier que les vidéos YouTube s'affichent)
   - Page Recrutement
   - Page Contact
3. **Tester sur mobile** : Vérifier la responsivité

### Consulter les logs

```bash
# Voir les logs en temps réel
gcloud run logs tail fulguria-team --region europe-west1

# Voir les 50 dernières lignes
gcloud run logs read fulguria-team --region europe-west1 --limit 50
```

## 🔄 Étape 5 : Mise à Jour de l'Application

Pour déployer une nouvelle version après modifications :

```bash
# Se placer dans le dossier du projet
cd "s:\projet_app\site web fufu V2"

# Redéployer (même commande que le déploiement initial)
gcloud run deploy fulguria-team \
  --source . \
  --region europe-west1 \
  --platform managed
```

Les secrets et autres configurations seront conservés automatiquement.

## 📊 Gestion et Monitoring

### Voir les informations du service

```bash
# Détails du service
gcloud run services describe fulguria-team --region europe-west1

# Obtenir l'URL du service
gcloud run services describe fulguria-team --region europe-west1 --format 'value(status.url)'
```

### Gérer les secrets

```bash
# Mettre à jour un secret
echo -n "NOUVELLE_CLE" | gcloud secrets versions add youtube-api-key --data-file=-

# Lister les versions d'un secret
gcloud secrets versions list youtube-api-key
```

### Supprimer le service (si nécessaire)

```bash
gcloud run services delete fulguria-team --region europe-west1
```

## 🐛 Résolution de Problèmes

### L'application ne démarre pas

1. Vérifier les logs :
   ```bash
   gcloud run logs tail fulguria-team --region europe-west1
   ```
2. Vérifier que le port 8080 est bien configuré
3. Vérifier que les secrets sont correctement configurés

### Les vidéos YouTube ne s'affichent pas

1. Vérifier que les secrets sont bien injectés :
   ```bash
   gcloud run services describe fulguria-team --region europe-west1
   ```
2. Vérifier les logs pour des erreurs API YouTube
3. Vérifier que votre clé API YouTube est valide et a les bonnes permissions

### Erreur de build

1. Vérifier que le fichier `Dockerfile` est présent
2. Vérifier que `next.config.ts` contient `output: 'standalone'`
3. Vérifier que `package.json` contient tous les scripts nécessaires

### L'application est lente

1. Augmenter la mémoire :
   ```bash
   gcloud run services update fulguria-team --memory 1Gi --region europe-west1
   ```
2. Augmenter le nombre de CPU :
   ```bash
   gcloud run services update fulguria-team --cpu 2 --region europe-west1
   ```

## 💰 Estimation des Coûts

Google Cloud Run facture en fonction de l'utilisation :

- **Niveau gratuit mensuel** :
  - 2 millions de requêtes
  - 360 000 vCPU-secondes
  - 180 000 GiB-secondes de RAM

Pour un site de test avec trafic modéré, les coûts devraient rester dans le niveau gratuit. Surveillez votre utilisation dans la console Google Cloud.

## 🔗 Ressources Utiles

- [Documentation Cloud Run](https://cloud.google.com/run/docs)
- [Calculateur de prix](https://cloud.google.com/products/calculator)
- [Console Google Cloud](https://console.cloud.google.com)
- [Status Google Cloud](https://status.cloud.google.com)

## 🎯 Déploiement Automatisé avec GitHub Actions (Optionnel)

Si vous souhaitez automatiser le déploiement à chaque push sur GitHub, vous pouvez créer un workflow GitHub Actions. Demandez-moi si vous avez besoin d'aide pour cette configuration !
