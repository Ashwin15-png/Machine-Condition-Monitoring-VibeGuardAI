const fs = require('fs');
const path = require('path');

const directoryPaths = [
  path.join(__dirname, 'frontend/src/pages'),
  path.join(__dirname, 'frontend/src/components'),
];

const replaceMap = [
  // Text Colors
  { search: /text-blue-[456]00/g, replace: 'text-[var(--info)]' },
  { search: /text-sky-[456]00/g, replace: 'text-[var(--info)]' },
  { search: /text-purple-[456]00/g, replace: 'text-[var(--info)]' },
  { search: /text-amber-[456]00/g, replace: 'text-[var(--warning)]' },
  { search: /text-yellow-[456]00/g, replace: 'text-[var(--warning)]' },
  { search: /text-red-[456]00/g, replace: 'text-[var(--danger)]' },
  { search: /text-emerald-[456]00/g, replace: 'text-[var(--success)]' },
  { search: /text-green-[456]00/g, replace: 'text-[var(--success)]' },
  
  // Background Colors
  { search: /bg-blue-[456]00/g, replace: 'bg-[var(--info)]' },
  { search: /bg-sky-[456]00/g, replace: 'bg-[var(--info)]' },
  { search: /bg-purple-[456]00/g, replace: 'bg-[var(--info)]' },
  { search: /bg-amber-[456]00/g, replace: 'bg-[var(--warning)]' },
  { search: /bg-yellow-[456]00/g, replace: 'bg-[var(--warning)]' },
  { search: /bg-red-[456]00/g, replace: 'bg-[var(--danger)]' },
  { search: /bg-emerald-[456]00/g, replace: 'bg-[var(--success)]' },
  { search: /bg-green-[456]00/g, replace: 'bg-[var(--success)]' },
  
  // Background Colors w/ Opacity
  { search: /bg-blue-[456]00\/[0-9]+/g, replace: 'bg-[var(--info)]/10' },
  { search: /bg-sky-[456]00\/[0-9]+/g, replace: 'bg-[var(--info)]/10' },
  { search: /bg-purple-[456]00\/[0-9]+/g, replace: 'bg-[var(--info)]/10' },
  { search: /bg-amber-[456]00\/[0-9]+/g, replace: 'bg-[var(--warning)]/10' },
  { search: /bg-yellow-[456]00\/[0-9]+/g, replace: 'bg-[var(--warning)]/10' },
  { search: /bg-red-[456]00\/[0-9]+/g, replace: 'bg-[var(--danger)]/10' },
  { search: /bg-emerald-[456]00\/[0-9]+/g, replace: 'bg-[var(--success)]/10' },
  { search: /bg-green-[456]00\/[0-9]+/g, replace: 'bg-[var(--success)]/10' },

  // Border Colors
  { search: /border-blue-[456]00/g, replace: 'border-[var(--info)]' },
  { search: /border-sky-[456]00/g, replace: 'border-[var(--info)]' },
  { search: /border-purple-[456]00/g, replace: 'border-[var(--info)]' },
  { search: /border-amber-[456]00/g, replace: 'border-[var(--warning)]' },
  { search: /border-yellow-[456]00/g, replace: 'border-[var(--warning)]' },
  { search: /border-red-[456]00/g, replace: 'border-[var(--danger)]' },
  { search: /border-emerald-[456]00/g, replace: 'border-[var(--success)]' },
  { search: /border-green-[456]00/g, replace: 'border-[var(--success)]' },

  // Border Colors w/ Opacity
  { search: /border-blue-[456]00\/[0-9]+/g, replace: 'border-[var(--info)]/20' },
  { search: /border-sky-[456]00\/[0-9]+/g, replace: 'border-[var(--info)]/20' },
  { search: /border-purple-[456]00\/[0-9]+/g, replace: 'border-[var(--info)]/20' },
  { search: /border-amber-[456]00\/[0-9]+/g, replace: 'border-[var(--warning)]/20' },
  { search: /border-yellow-[456]00\/[0-9]+/g, replace: 'border-[var(--warning)]/20' },
  { search: /border-red-[456]00\/[0-9]+/g, replace: 'border-[var(--danger)]/20' },
  { search: /border-emerald-[456]00\/[0-9]+/g, replace: 'border-[var(--success)]/20' },
  { search: /border-green-[456]00\/[0-9]+/g, replace: 'border-[var(--success)]/20' },
];

function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let original = content;

      replaceMap.forEach(({ search, replace }) => {
         content = content.replace(search, replace);
      });

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated semantic colors: ${fullPath}`);
      }
    }
  });
}

directoryPaths.forEach(dir => processDirectory(dir));
console.log('Semantic color sweep complete.');
