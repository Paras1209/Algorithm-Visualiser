// Special build script for Vercel deployment
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Run the main build
console.log('Building frontend and backend...');
execSync('npm run build', { stdio: 'inherit' });

// Ensure the api directory exists
const apiDir = path.join(process.cwd(), 'api');
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

console.log('Build completed successfully!');