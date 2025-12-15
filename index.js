const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { execSync } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

// Configuration
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Fonction pour vérifier si le build existe
function checkAndBuild() {
    const buildDir = path.join(__dirname, '.next');

    if (!dev && !existsSync(buildDir)) {
        console.log('⚠️  Build directory not found. Building Next.js...');
        console.log('This may take a few minutes...');

        try {
            execSync('npm run build', {
                stdio: 'inherit',
                cwd: __dirname
            });
            console.log('✅ Build completed successfully!');
        } catch (error) {
            console.error('❌ Build failed:', error.message);
            process.exit(1);
        }
    } else if (!dev) {
        console.log('✅ Build directory found, skipping build.');
    }
}

// Vérifier et builder si nécessaire en mode production
if (!dev) {
    checkAndBuild();
}

// Initialiser Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('internal server error');
        }
    })
        .once('error', (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(
                `> Server started on http://${hostname}:${port} in ${dev ? 'development' : 'production'} mode`
            );
        });
});
