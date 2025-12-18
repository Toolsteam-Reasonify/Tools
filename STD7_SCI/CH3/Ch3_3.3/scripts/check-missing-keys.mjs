import fs from 'fs';
import path from 'path';

const localesDir = path.join(process.cwd(), 'src', 'locales');
const baseLocale = 'en';
const base = JSON.parse(fs.readFileSync(path.join(localesDir, `${baseLocale}.json`), 'utf8'));

const flatten = (obj, prefix = '') =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    const nextKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(acc, flatten(value, nextKey));
    } else {
      acc[nextKey] = value;
    }
    return acc;
  }, {});

const baseKeys = flatten(base);

const locales = fs.readdirSync(localesDir).filter((file) => file.endsWith('.json') && !file.startsWith(baseLocale));

let hasMissing = false;

locales.forEach((localeFile) => {
  const localeName = path.basename(localeFile, '.json');
  const data = JSON.parse(fs.readFileSync(path.join(localesDir, localeFile), 'utf8'));
  const localeKeys = flatten(data);
  const missing = Object.keys(baseKeys).filter((key) => !(key in localeKeys));

  if (missing.length) {
    hasMissing = true;
    // eslint-disable-next-line no-console
    console.warn(`\nMissing keys in ${localeName}:`);
    missing.forEach((k) => console.warn(` - ${k}`));
  }
});

if (!hasMissing) {
  // eslint-disable-next-line no-console
  console.log('✅ No missing translation keys.');
}

