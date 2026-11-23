// Copies the web app files into www/, which Capacitor bundles into the APK.
import {cpSync, mkdirSync, rmSync} from 'node:fs';
const files = ['index.html', 'manifest.webmanifest', 'icon.svg', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
rmSync('www', {recursive: true, force: true});
mkdirSync('www');
for (const f of files) cpSync(f, `www/${f}`);
console.log(`Copied ${files.length} files to www/`);
