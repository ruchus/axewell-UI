import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const dir = 'dist/axe-os';

function compressFile(filePath) {
  return new Promise((resolve, reject) => {
    const gzip = zlib.createGzip();
    const input = fs.createReadStream(filePath);
    const output = fs.createWriteStream(`${filePath}.gz`);
    
    input.pipe(gzip).pipe(output);
    
    output.on('finish', () => resolve());
    output.on('error', reject);
  });
}

async function compressDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isFile()) {
      // Comprimir solo archivos, no directorios
      await compressFile(filePath);
    } else if (stat.isDirectory()) {
      // Recorrer directorios de manera recursiva
      await compressDirectory(filePath);
    }
  }
}

// Ejecutar la compresión en el directorio principal
compressDirectory(dir).then(() => {
  console.log('All files have been compressed.');
}).catch(err => {
  console.error('An error occurred:', err);
});
