// Usage: node scripts/missing-keys.mjs
// Compares en.json keys to hi.json and gu.json and prints missing keys.
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const localesDir = path.resolve(__dirname, '../src/locales');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

const en = readJson(path.join(localesDir, 'en.json'));
const hi = readJson(path.join(localesDir, 'hi.json'));
const gu = readJson(path.join(localesDir, 'gu.json'));

function flatten(obj, prefix = '') {
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(out, flatten(v, key));
    } else {
      out[key] = true;
    }
  }
  return out;
}

function diffKeys(base, target) {
  const baseFlat = flatten(base);
  const targetFlat = flatten(target);
  return Object.keys(baseFlat).filter((k) => !(k in targetFlat));
}

const missingHi = diffKeys(en, hi);
const missingGu = diffKeys(en, gu);

if (missingHi.length === 0 && missingGu.length === 0) {
  console.log('All keys present in hi and gu.');
  process.exit(0);
}

if (missingHi.length) {
  console.log('\nMissing in hi.json:');
  missingHi.forEach((k) => console.log(' -', k));
}
if (missingGu.length) {
  console.log('\nMissing in gu.json:');
  missingGu.forEach((k) => console.log(' -', k));
}

process.exit(1);
