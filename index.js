const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { execSync } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

// Charger les variables d'environnement depuis .env
require('dotenv').config();

// Configuration
const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0'; // Écoute sur toutes les interfaces (important pour cPanel)
const port = parseInt(process.env.PORT || '3000', 10);

console.log(`[server] Starting in ${dev ? 'development' : 'production'} mode`);
console.log(`[server] Node.js version: ${process.version}`);

// Fonction pour vérifier et builder si nécessaire
function checkAndBuild() {
    const buildDir = path.join(__dirname, '.next');
    const buildIdFile = path.join(buildDir, 'BUILD_ID');

    // Vérifier si un build de production existe vraiment
    if (!dev && !existsSync(buildIdFile)) {
        if (existsSync(buildDir)) {
            console.log('[server] ⚠️  .next directory exists but no valid production build found.');
        } else {
            console.log('[server] ⚠️  Build directory not found.');
        }

        console.log('[server] Building Next.js for production...');
        console.log('[server] This may take a few minutes...');

        try {
            execSync('npm run build', {
                stdio: 'inherit',
                cwd: __dirname
            });
            console.log('[server] ✅ Build completed successfully!');
        } catch (error) {
            console.error('[server] ❌ Build failed:', error.message);
            process.exit(1);
        }
    } else if (!dev) {
        console.log('[server] ✅ Valid production build found, skipping build.');
    }
}

// Vérifier et builder si nécessaire en mode production
if (!dev) {
    checkAndBuild();
}

// Initialiser Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare()
    .then(() => {
        const server = createServer(async (req, res) => {
            try {
                const parsedUrl = parse(req.url, true);
                await handle(req, res, parsedUrl);
            } catch (err) {
                console.error('[server:error] Error occurred handling', req.url, err);
                res.statusCode = 500;
                res.end('Internal server error');
            }
        });

        server.listen(port, hostname, () => {
            console.log(`[server] ✅ Listening on http://${hostname}:${port}`);
            console.log(`[server] Ready to accept connections`);
        });

        server.on('error', (err) => {
            console.error('[server:error]', err);
            process.exit(1);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('[server] SIGTERM signal received: closing HTTP server');
            server.close(() => {
                console.log('[server] HTTP server closed');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            console.log('[server] SIGINT signal received: closing HTTP server');
            server.close(() => {
                console.log('[server] HTTP server closed');
                process.exit(0);
            });
        });
    })
    .catch((err) => {
        console.error('[server:error] Failed to start server:', err);
        process.exit(1);
    });
