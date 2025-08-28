import fs from 'fs';
import path from 'path';

const directory = 'dist/axe-os';

// Function to recursively delete non-gz files
function deleteNonGzFiles(dir) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error(`Failed to read directory ${dir}: ${err.message}`);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(dir, file);

      fs.lstat(filePath, (err, stats) => {
        if (err) {
          console.error(`Failed to get stats for ${filePath}: ${err.message}`);
          return;
        }

        if (stats.isDirectory()) {
          // Recursively process directories
          deleteNonGzFiles(filePath);
        } else if (!file.endsWith('.gz')) {
          // Delete non-gz files
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Failed to delete file ${filePath}: ${err.message}`);
              return;
            }
            console.log(`Deleted file: ${filePath}`);
          });
        }
      });
    });
  });
}

// Start the deletion process from the main directory
deleteNonGzFiles(directory);
