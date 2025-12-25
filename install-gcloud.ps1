# Script d'installation Google Cloud SDK pour Windows
# Ce script télécharge et installe automatiquement gcloud

Write-Host "📦 Installation de Google Cloud SDK..." -ForegroundColor Cyan
Write-Host ""

# URL de l'installateur
$installerUrl = "https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe"
$installerPath = "$env:TEMP\GoogleCloudSDKInstaller.exe"

# Télécharger l'installateur
Write-Host "⬇️  Téléchargement de l'installateur..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri $installerUrl -OutFile $installerPath
    Write-Host "✅ Téléchargement terminé" -ForegroundColor Green
}
catch {
    Write-Host "❌ Erreur lors du téléchargement" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

Write-Host ""
Write-Host "🚀 Lancement de l'installateur..." -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  IMPORTANT:" -ForegroundColor Yellow
Write-Host "   1. Suivez l'assistant d'installation" -ForegroundColor White
Write-Host "   2. Cochez 'Run gcloud init' à la fin" -ForegroundColor White
Write-Host "   3. Redémarrez PowerShell après l'installation" -ForegroundColor White
Write-Host ""

# Lancer l'installateur
Start-Process -FilePath $installerPath -Wait

Write-Host ""
Write-Host "✅ Installation terminée!" -ForegroundColor Green
Write-Host ""
Write-Host "🔄 Veuillez redémarrer PowerShell, puis exécutez:" -ForegroundColor Yellow
Write-Host "   gcloud auth login" -ForegroundColor White
Write-Host "   gcloud config set project VOTRE_PROJECT_ID" -ForegroundColor White
Write-Host ""
