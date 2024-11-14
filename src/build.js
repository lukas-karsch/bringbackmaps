const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Configuration
const config = {
    source: './',
    output: './dist',
    zipName: 'bringbackmaps.zip',
    // Files and directories to include
    includes: [
        'manifest.json',
        'src/content.js',
        'src/popup.html',
        'icon16.png',
        'icon48.png',
        'icon128.png'
    ],

    exclude: [
        'node_modules',
        'dist',
        '.git',
        '.gitignore',
        'src/build.js',
        'package.json',
        'package-lock.json',
        'README.md'
    ]
};

// Create dist directory if it doesn't exist
if (!fs.existsSync(config.output)) {
    fs.mkdirSync(config.output);
}

// Create a write stream
const output = fs.createWriteStream(path.join(config.output, config.zipName));
const archive = archiver('zip', {
    zlib: { level: 9 } // Maximum compression
});

// Listen for archive events
output.on('close', () => {
    console.log(`\n✅ Archive created successfully! (${(archive.pointer() / 1024).toFixed(2)} KB)`);
    console.log(`📦 Location: ${path.join(config.output, config.zipName)}`);
});

archive.on('error', (err) => {
    throw err;
});

// Pipe archive data to the output file
archive.pipe(output);

// Add files to the archive
console.log('\n📝 Adding files to archive:');
config.includes.forEach(file => {
    if (fs.existsSync(file)) {
        archive.file(file, { name: file });
        console.log(`   ✓ ${file}`);
    } else {
        console.log(`   ⚠️  Warning: ${file} not found`);
    }
});

// Finalize the archive
archive.finalize();
