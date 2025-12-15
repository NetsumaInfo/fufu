#!/bin/bash
# Script de startup corrigé pour Next.js sur SparkedHost/Pterodactyl

# Résoudre les conflits Git potentiels
if [[ -d .git ]]; then
    echo "Nettoyage des fichiers conflictuels..."
    git reset --hard origin/main
    
    echo "Pull depuis GitHub..."
    git pull
fi

# Installer les packages NPM personnalisés (si définis)
if [[ ! -z ${NODE_PACKAGES} ]]; then
    echo "Installation des packages personnalisés: ${NODE_PACKAGES}"
    npm install ${NODE_PACKAGES}
fi

# Installer les dépendances
if [ -f /home/container/package.json ]; then
    echo "Installation des dépendances..."
    npm install --omit=dev
fi

# Build Next.js (CRITIQUE!)
echo "Build de l'application Next.js..."
npm run build

# Démarrer le serveur
echo "Démarrage du serveur..."
node /home/container/${STARTUP_FILE}
