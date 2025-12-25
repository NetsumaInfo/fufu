# Script PowerShell pour uploader les assets sur Google Cloud Storage
# Usage: .\upload-assets.ps1

param(
    [Parameter(Mandatory=$false)]
    [string]$BucketName = "fulguria-assets",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

Write-Host "🚀 Upload des assets vers Google Cloud Storage" -ForegroundColor Cyan
Write-Host "Bucket: gs://$BucketName" -ForegroundColor Yellow
Write-Host ""

# Vérifier que gsutil est installé
try {
    $null = Get-Command gsutil -ErrorAction Stop
} catch {
    Write-Host "❌ 'gsutil' n'est pas installé ou n'est pas dans le PATH" -ForegroundColor Red
    Write-Host "Installez Google Cloud SDK: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

# Vérifier que le bucket existe
Write-Host "📦 Vérification du bucket..." -ForegroundColor Cyan
$bucketCheck = gsutil ls "gs://$BucketName" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Le bucket 'gs://$BucketName' n'existe pas ou n'est pas accessible" -ForegroundColor Red
    Write-Host ""
    Write-Host "Créez-le avec:" -ForegroundColor Yellow
    Write-Host "  gsutil mb -l europe-west1 gs://$BucketName" -ForegroundColor White
    Write-Host "  gsutil iam ch allUsers:objectViewer gs://$BucketName" -ForegroundColor White
    exit 1
}
Write-Host "✅ Bucket trouvé" -ForegroundColor Green
Write-Host ""

# Fonction pour uploader un dossier
function Upload-Folder {
    param(
        [string]$LocalPath,
        [string]$RemotePath,
        [string]$Description
    )
    
    if (Test-Path $LocalPath) {
        Write-Host "📤 Upload: $Description" -ForegroundColor Cyan
        
        if ($DryRun) {
            Write-Host "   [DRY RUN] gsutil -m cp -r $LocalPath gs://$BucketName/$RemotePath" -ForegroundColor Yellow
        } else {
            gsutil -m cp -r $LocalPath "gs://$BucketName/$RemotePath"
            if ($LASTEXITCODE -eq 0) {
                Write-Host "   ✅ Upload réussi" -ForegroundColor Green
                
                # Configurer le cache
                Write-Host "   ⏱️  Configuration du cache (1 an)..." -ForegroundColor Cyan
                gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" "gs://$BucketName/$RemotePath/**"
                Write-Host "   ✅ Cache configuré" -ForegroundColor Green
            } else {
                Write-Host "   ❌ Erreur lors de l'upload" -ForegroundColor Red
            }
        }
        Write-Host ""
    } else {
        Write-Host "⚠️  Dossier non trouvé: $LocalPath" -ForegroundColor Yellow
        Write-Host ""
    }
}

# Upload des vidéos
Upload-Folder -LocalPath "public/video" -RemotePath "video" -Description "Vidéos hero"

# Upload des images (optionnel)
$uploadImages = Read-Host "Voulez-vous aussi uploader les images? (o/N)"
if ($uploadImages -eq "o" -or $uploadImages -eq "O") {
    Upload-Folder -LocalPath "public/images" -RemotePath "images" -Description "Images"
}

if (-not $DryRun) {
    Write-Host ""
    Write-Host "🎉 Upload terminé!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Vos assets sont maintenant disponibles sur:" -ForegroundColor Cyan
    Write-Host "   https://storage.googleapis.com/$BucketName/video/" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 Prochaines étapes:" -ForegroundColor Yellow
    Write-Host "1. Ajoutez ces variables à votre .env local:" -ForegroundColor White
    Write-Host "   NEXT_PUBLIC_STORAGE_BUCKET=$BucketName" -ForegroundColor Gray
    Write-Host "   NEXT_PUBLIC_CDN_URL=https://storage.googleapis.com/$BucketName" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Pour Cloud Run, ajoutez les variables d'environnement:" -ForegroundColor White
    Write-Host "   gcloud run services update fulguria-team \" -ForegroundColor Gray
    Write-Host "     --update-env-vars NEXT_PUBLIC_CDN_URL=https://storage.googleapis.com/$BucketName \" -ForegroundColor Gray
    Write-Host "     --region europe-west1" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Testez localement avec 'npm run dev'" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "ℹ️  Mode DRY RUN - Aucun fichier n'a été uploadé" -ForegroundColor Yellow
    Write-Host "Relancez sans -DryRun pour effectuer l'upload réel" -ForegroundColor White
}
