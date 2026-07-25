const fs = require('fs');
const path = require('path');

const directoryPaths = [
  path.join(__dirname, 'frontend/src/pages'),
  path.join(__dirname, 'frontend/src/components/layout'),
  path.join(__dirname, 'frontend/src/components/ui')
];

const replaceMap = [
  { search: /bg-slate-950\/?[0-9]*/g, replace: 'bg-[var(--bg-primary)]' },
  { search: /bg-slate-900\/?[0-9]*/g, replace: 'bg-[var(--bg-card)]' },
  { search: /bg-slate-800\/?[0-9]*/g, replace: 'bg-[var(--bg-secondary)]' },
  { search: /bg-\[\#111827\]\/?[0-9]*/g, replace: 'bg-[var(--bg-card)]' },
  { search: /bg-\[\#0F172A\]/g, replace: 'bg-[var(--bg-primary)]' },
  { search: /border-slate-800\/?[0-9]*/g, replace: 'border-[var(--border)]' },
  { search: /border-slate-700\/?[0-9]*/g, replace: 'border-[var(--border)]' },
  { search: /border-slate-600\/?[0-9]*/g, replace: 'border-[var(--border)]' },
  { search: /text-slate-100/g, replace: 'text-[var(--text-primary)]' },
  { search: /text-\[\#F8FAFC\]/g, replace: 'text-[var(--text-primary)]' },
  { search: /text-slate-200/g, replace: 'text-[var(--text-primary)]' },
  { search: /text-slate-300/g, replace: 'text-[var(--text-secondary)]' },
  { search: /text-slate-400/g, replace: 'text-[var(--text-muted)]' },
  { search: /text-slate-500/g, replace: 'text-[var(--text-muted)]' },
  { search: /hover:bg-slate-800\/?[0-9]*/g, replace: 'hover:bg-[var(--bg-secondary)]' },
  { search: /hover:text-slate-100/g, replace: 'hover:text-[var(--text-primary)]' },
  { search: /hover:text-slate-200/g, replace: 'hover:text-[var(--text-primary)]' },
  { search: /hover:border-slate-700\/?[0-9]*/g, replace: 'hover:border-[var(--info)]' }
];

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let original = content;

      replaceMap.forEach(({ search, replace }) => {
         content = content.replace(search, replace);
      });

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  });
}

directoryPaths.forEach(dir => processDirectory(dir));
console.log('Theme refactor complete.');
