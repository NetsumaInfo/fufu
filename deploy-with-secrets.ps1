# Script pour mettre à jour le service Cloud Run avec les secrets YouTube API
# Ce script configure les variables d'environnement et les secrets

Write-Host "Mise à jour du service Cloud Run avec les secrets YouTube API..." -ForegroundColor Cyan

# Vérifier que les secrets existent
Write-Host "`n1. Vérification des secrets..." -ForegroundColor Yellow
gcloud secrets describe youtube-api-key --quiet
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erreur: Le secret youtube-api-key n'existe pas!" -ForegroundColor Red
    exit 1
}

gcloud secrets describe youtube-channel-id --quiet
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erreur: Le secret youtube-channel-id n'existe pas!" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Secrets trouvés" -ForegroundColor Green

# Mettre à jour le service
Write-Host "`n2. Mise à jour du service Cloud Run..." -ForegroundColor Yellow

gcloud run deploy fulguria-team `
    --image gcr.io/fufu-482308/fulguria-team `
    --region europe-west1 `
    --platform managed `
    --allow-unauthenticated `
    --set-env-vars "NEXT_PUBLIC_CDN_URL=https://storage.googleapis.com/fulguria-assets" `
    --set-secrets "YOUTUBE_API_KEY=youtube-api-key:latest" `
    --set-secrets "YOUTUBE_CHANNEL_ID=youtube-channel-id:latest" `
    --memory 512Mi `
    --cpu 1 `
    --min-instances 0 `
    --max-instances 10 `
    --timeout 300

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Déploiement réussi!" -ForegroundColor Green
    Write-Host "`nService URL: https://fulguria-team-250401468026.europe-west1.run.app" -ForegroundColor Cyan
} else {
    Write-Host "`n✗ Échec du déploiement" -ForegroundColor Red
    exit 1
}
