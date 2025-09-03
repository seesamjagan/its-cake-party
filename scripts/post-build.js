import { copyFile, access } from 'fs/promises';
import { join } from 'path';
import process from 'process';

async function postBuild() {
  try {
    const distDir = 'dist';
    const sourceFile = join(distDir, 'index.html');
    const targetFile = join(distDir, '404.html');

    // Check if dist/index.html exists
    await access(sourceFile);

    // Copy index.html to 404.html in the dist folder
    await copyFile(sourceFile, targetFile);

    console.log('✅ Successfully copied dist/index.html to dist/404.html');
  } catch (error) {
    console.error('❌ Error during post-build process:', error.message);
    process.exit(1);
  }
}

postBuild();