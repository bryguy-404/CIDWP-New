// Compare the built site with the independent, dated source capture.
// Run after `npm run build`. Never reads the importer or generated content data.
import fs from 'node:fs';
import path from 'node:path';
import { parseHTML } from 'linkedom';

const origin = 'https://cosmeticimplantdentistrywp.com';
const normalize = value => value.replace(/\s+/g, ' ').trim();
const parse = html => parseHTML(`<html><body>${html}</body></html>`).document;
const inventory = JSON.parse(fs.readFileSync('docs/migration/inventory.json', 'utf8'));
const assets = JSON.parse(fs.readFileSync('docs/migration/images.json', 'utf8'));
const redirects = Object.fromEntries(fs.readFileSync('public/_redirects', 'utf8').trim().split('\n').map(line => line.split(/\s+/).slice(0, 2)));
const issues = [];
let copyChecks = 0, linkChecks = 0, assetChecks = 0, pageChecks = 0;
const fail = (route, kind, value) => issues.push({route, kind, value});
const assetOwners = new Map();
for (const [url, file] of Object.entries(assets)) {
  if (assetOwners.has(file)) fail(file, 'Colliding Asset Filenames', [assetOwners.get(file), url]);
  assetOwners.set(file, url);
}
const absolute = (href, base) => new URL(href, base).href;
function textNodes(node) {
  if (node.nodeType === 3) return normalize(node.textContent) ? [normalize(node.textContent)] : [];
  return [...node.childNodes].flatMap(textNodes);
}

const snapshots = fs.readdirSync('docs/migration/source').filter(file => file.endsWith('.json')).map(file => JSON.parse(fs.readFileSync(`docs/migration/source/${file}`, 'utf8')));
for (const entry of inventory) {
  if (!snapshots.some(source => source.requestedUrl === entry.url)) fail(entry.url, 'Missing Source Capture', entry.label);
}
for (const source of snapshots) {
  const route = new URL(source.url).pathname;
  if (route === '/') continue; // The previously approved homepage is intentionally retained.
  const output = `dist${route}index.html`;
  if (!fs.existsSync(output)) { fail(route, 'Missing Page', output); continue; }
  pageChecks++;
  const built = parseHTML(fs.readFileSync(output, 'utf8')).document;
  const imported = built.querySelector('[data-original-content]');
  const heading = built.querySelector('[data-original-heading]');
  const sourceDoc = parse(source.html);
  // These are replaced integrations, executable theme assets, or repeated carousel controls.
  sourceDoc.querySelectorAll('script,style,noscript,form,.gform_wrapper,.swiper-slide-duplicate,.fmr-slider-controls,.elementor-swiper-button,.swiper-pagination').forEach(node => node.remove());
  const actual = normalize(`${heading.textContent} ${imported.textContent}`);
  const expectedRoots = [sourceDoc.body];
  for (const modal of source.modals || []) {
    const doc = parse(modal.html);
    expectedRoots.push(...doc.querySelectorAll('.x-content'));
  }
  for (const root of expectedRoots) {
    for (const text of textNodes(root)) {
      copyChecks++;
      if (!actual.includes(text)) fail(route, 'Missing Or Altered Copy', text);
    }
    const actualLinks = [...imported.querySelectorAll('a[href]')].map(node => ({href:absolute(node.getAttribute('href'), source.url), text:normalize(node.textContent)}));
    for (const link of root.querySelectorAll('a[href]')) {
      const href = absolute(link.getAttribute('href'), source.url);
      const text = normalize(link.textContent);
      linkChecks++;
      if (!actualLinks.some(node => node.href === href && (!text || node.text === text))) fail(route, 'Missing Or Altered Hyperlink', {text, href});
    }
    for (const node of root.querySelectorAll('img[src],video source[src],iframe[src]')) {
      const src = node.getAttribute('src');
      if (src.startsWith('data:') || src === 'about:blank' || node.closest('.x-bg')) continue;
      assetChecks++;
      const expected = assets[src] || src;
      if (![...imported.querySelectorAll('[src]')].some(el => el.getAttribute('src') === expected)) fail(route, 'Missing Source Media', src);
    }
  }
  if (built.title !== source.title) fail(route, 'Changed Page Title', {expected:source.title, actual:built.title});
  if (built.querySelector('meta[name="description"]')?.getAttribute('content') !== source.description) fail(route, 'Changed Description', source.description);
  if (built.querySelectorAll('main h1').length !== 1) fail(route, 'Heading Structure', 'Expected one H1');
}

function files(dir) { return fs.readdirSync(dir, {withFileTypes:true}).flatMap(item => item.isDirectory() ? files(path.join(dir,item.name)) : [path.join(dir,item.name)]); }
const documents = new Map(files('dist').filter(file => file.endsWith('.html')).map(file => [file, parseHTML(fs.readFileSync(file,'utf8')).document]));
for (const [file, doc] of documents) {
  const route = file.slice(4).replace(/index\.html$/, '');
  for (const link of doc.querySelectorAll('a[href]')) {
    const href = link.getAttribute('href');
    if (!href.startsWith('/') && !href.startsWith('#')) continue;
    const url = new URL(href, origin + route);
    const dest = redirects[url.pathname] || url.pathname;
    const target = `dist${dest}${dest.endsWith('/') ? 'index.html' : ''}`;
    if (!fs.existsSync(target)) fail(route, 'Broken Local Link', href);
    else if (url.hash && documents.has(target) && !documents.get(target).getElementById(decodeURIComponent(url.hash.slice(1)))) fail(route, 'Missing Anchor', href);
  }
  for (const node of doc.querySelectorAll('img[src],source[src],script[src],link[href]')) {
    const src = node.getAttribute('src') || node.getAttribute('href');
    if (src?.startsWith('/') && !fs.existsSync(`dist${src.split('?')[0]}`)) fail(route, 'Missing Local Asset', src);
  }
}
const report = {date:'2026-10-06',pageChecks,copyChecks,linkChecks,assetChecks,issues};
fs.writeFileSync('docs/migration/verification.json', JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if (issues.length) process.exitCode = 1;
