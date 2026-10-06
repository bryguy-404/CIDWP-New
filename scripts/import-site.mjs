// Rebuild content from the dated, browser-captured source snapshots.
// Run explicitly after reviewing a capture; builds never fetch the old website.
import fs from 'node:fs';
import { parseHTML } from 'linkedom';

const sourceDir = 'docs/migration/source';
const images = JSON.parse(fs.readFileSync('docs/migration/images.json', 'utf8'));
const snapshots = fs.readdirSync(sourceDir).filter(f => f.endsWith('.json')).map(f => ({ file: f, ...JSON.parse(fs.readFileSync(`${sourceDir}/${f}`, 'utf8')) }));
const origin = 'https://cosmeticimplantdentistrywp.com';
const paths = new Set(snapshots.flatMap(p => [new URL(p.url).pathname, new URL(p.requestedUrl).pathname]));
const aliases = { '/contact-us/': '/contact/', '/services/emergency-dentistry/': '/services/emergency-dentist/', '/services/clear-braces/': '/services/braces/', '/services/emergency-dentistry-2/': '/services/emergency-dentistry-ppc/' };
const escape = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const normalize = s => s.replace(/\s+/g, ' ').trim();
const warnings = [];
const pages = [];
const mapping = [];

function destination(href, source) {
  if (!href || href.startsWith('#') || /^(tel:|mailto:)/i.test(href)) return href;
  const url = new URL(href, source);
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error(`Unsupported URL: ${href}`);
  if (url.origin === origin && (paths.has(url.pathname) || aliases[url.pathname])) return url.pathname + url.search + url.hash;
  return url.href;
}

for (const source of snapshots) {
  const path = new URL(source.url).pathname;
  if (path === '/') { mapping.push({ path, status: 'Approved Homepage Retained', sourceFile: source.file }); continue; }
  const { document } = parseHTML(`<html><body>${source.html}</body></html>`);
  const root = document.body;
  // Meaningful portraits previously supplied as CSS backgrounds become real images.
  const backgroundImages = {
    '.sedation-doctor-image': ['https://cosmeticimplantdentistrywp.com/wp-content/uploads/2026/01/unnamed.png', 'Dr. Shaley Baker'],
    '.sedation-candidates-image': ['https://cosmeticimplantdentistrywp.com/wp-content/uploads/2026/02/IMG_0569-scaled.jpg', 'Care At Our Westport Office'],
    '.fmr-what-image': ['https://cosmeticimplantdentistrywp.com/wp-content/uploads/2026/02/IMG_2176.jpeg', 'Our Westport Dental Team'],
  };
  for (const [selector, [src, alt]] of Object.entries(backgroundImages)) {
    const target = root.querySelector(selector);
    if (target) target.innerHTML = `<img src="${escape(src)}" alt="${escape(alt)}" />`;
  }
  // Executable theme code, icon controls, and form implementations are not page copy.
  root.querySelectorAll('script,style,noscript,.x-bg,.fmr-slider-controls,.swiper-slide-duplicate,.elementor-swiper-button,.swiper-pagination').forEach(n => n.remove());
  // These profiles live outside the original content root in theme modals.
  for (const trigger of root.querySelectorAll('[aria-controls$="-modal"]')) {
    const modal = source.modals?.find(m => m.id === trigger.getAttribute('aria-controls'));
    if (!modal) throw new Error(`Missing profile biography in ${path}`);
    const article = document.createElement('article');
    article.className = 'migration-profile';
    const name = trigger.querySelector('.x-anchor-text-primary')?.textContent || '';
    const role = trigger.querySelector('.x-anchor-text-secondary')?.textContent || '';
    const img = trigger.querySelector('img');
    if (img) { img.setAttribute('alt', name); article.append(img); }
    const body = document.createElement('div');
    body.innerHTML = `<h2>${escape(name)}</h2><p class="profile-role">${escape(role)}</p>`;
    const bioDoc = parseHTML(`<html><body>${modal.html}</body></html>`).document;
    // The modal headline repeats the profile name/role; retain its biography once.
    for (const content of bioDoc.querySelectorAll('.x-content')) body.insertAdjacentHTML('beforeend', content.innerHTML);
    article.append(body);
    trigger.replaceWith(article);
  }
  // Campaign pages use H2 for their opening title and H1 for later sections.
  let firstHeading = root.querySelector('h1,h2');
  // Some legacy utility pages lack a page heading. Use their existing page label.
  const title = firstHeading ? normalize(firstHeading.innerHTML.replace(/<br\s*\/?\s*>/gi, ' ').replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&')) : source.label;
  const headingHtml = firstHeading ? [...firstHeading.childNodes].map(clean).join('') : escape(source.label);
  firstHeading?.remove();
  const omittedForms = [...root.querySelectorAll('form')].map(f => ({ id: f.id, text: normalize(f.textContent), action: f.getAttribute('action') }));
  let hasFinancing = path === '/payment-plans/';
  let hasForms = omittedForms.length > 0;
  if (hasFinancing) {
    const widget = root.querySelector('#all');
    if (widget) widget.replaceWith(document.createComment('FINANCING_WIDGET'));
  }

  function clean(node) {
    if (node.nodeType === 3) return escape(node.textContent);
    if (node.nodeType === 8) return node.textContent === 'FINANCING_WIDGET' ? '<!--FINANCING_WIDGET-->' : '';
    if (node.nodeType !== 1) return '';
    const tag = node.tagName.toLowerCase();
    const cls = node.getAttribute('class') || '';
    const contents = () => [...node.childNodes].map(clean).join('');
    if (['script','style','noscript','input','select','textarea','button','svg','path','i'].includes(tag)) return '';
    if (tag === 'form') return '<!--APPOINTMENT_FORM-->';
    if (node.id?.startsWith('gform_wrapper') || /gform_wrapper/.test(cls)) return '<!--APPOINTMENT_FORM-->';
    if (tag === 'iframe') {
      const src = node.getAttribute('src') || '';
      if (!/^https:\/\/(www\.)?(youtube\.com\/embed\/|google\.com\/maps)/.test(src)) return '';
      return `<iframe src="${escape(src)}" title="${escape(node.getAttribute('title') || 'Map To Our Office')}" loading="lazy" allowfullscreen></iframe>`;
    }
    if (tag === 'img') {
      const src = node.getAttribute('src') || '';
      if (src.startsWith('data:')) return '';
      const local = images[src];
      if (!local) warnings.push({path, type:'Remote Image', value:src});
      const emoji = /emoji/.test(cls) || /2b50\.svg/.test(src);
      return `<img src="${escape(local || src)}" alt="${escape(node.getAttribute('alt') || '')}"${emoji ? ' class="source-emoji"' : ''} loading="lazy" decoding="async" />`;
    }
    if (tag === 'video') return `<video controls preload="metadata" playsinline>${contents()}</video>`;
    if (tag === 'source') {
      const src = node.getAttribute('src') || '';
      if (!src.startsWith('https://')) return '';
      return `<source src="${escape(images[src] || src)}" type="${escape(node.getAttribute('type') || 'video/mp4')}" />`;
    }
    if (tag === 'br') return '<br />';
    if (tag === 'a') {
      const href = node.getAttribute('href');
      if (!href) return contents();
      const dest = destination(href, source.url);
      const label = node.getAttribute('aria-label') || (path === '/review/' && /facebook/.test(dest) ? 'Leave A Facebook Review' : path === '/review/' && /g.page/.test(dest) ? 'Leave A Google Review' : '');
      let inner = contents();
      // Keep an accessible visible label when the original link was an icon alone.
      if (!normalize(node.textContent) && !node.querySelector('img') && label) inner = escape(label);
      const button = /x-anchor-button|btn|elementor-button/.test(cls);
      const card = path === '/services/' && !!node.querySelector('h2,h3') && !!node.querySelector('img');
      return `<a href="${escape(dest)}"${button ? ' class="button button-outline"' : card ? ' class="source-service-card"' : ''}${label ? ` aria-label="${escape(label)}"` : ''}${node.getAttribute('target') === '_blank' ? ' target="_blank" rel="noopener noreferrer"' : ''}>${inner}</a>`;
    }
    const allowed = new Set(['p','h1','h2','h3','h4','h5','h6','ul','ol','li','strong','em','b','u','small','sup','sub','blockquote','address','dl','dt','dd','table','thead','tbody','tr','th','td','figure','figcaption','hr','details','summary']);
    let outTag = allowed.has(tag) ? (tag === 'h1' ? 'h2' : tag) : (tag === 'span' ? 'span' : 'div');
    const classes = [];
    if (/^h[1-6]$/.test(tag) && normalize(node.textContent).length > 180) classes.push('source-prose-heading');
    if (/elementor-container\b/.test(cls) && node.children.length > 1) classes.push(node.children.length === 3 ? 'source-card-grid' : 'source-row');
    if (/elementor-column\b/.test(cls)) classes.push('source-column');
    if (/elementor-col-33\b/.test(cls)) classes.push('source-card');
    if (/\be-grid\b/.test(cls) || (/\be-con-inner\b/.test(cls) && node.children.length === 2 && [...node.children].every(n=>n.classList.contains('e-con')))) classes.push('source-row');
    if (/\be-con-inner\b/.test(cls) && node.children.length > 2 && [...node.children].every(n=>n.classList.contains('elementor-widget-icon-box'))) classes.push('source-card-grid');
    if (/elementor-widget-icon-box/.test(cls) && node.parentElement?.children.length > 2) classes.push('source-card');
    if (/elementor-image-box-wrapper/.test(cls)) classes.push('source-image-box');
    if (/elementor-toggle-item/.test(cls)) classes.push('source-faq');
    if (/elementor-tab-title/.test(cls)) { outTag = 'h3'; classes.push('source-faq-title'); }
    if (/swiper-wrapper/.test(cls)) classes.push('source-testimonials');
    if (/swiper-slide\b/.test(cls)) classes.push('source-testimonial');
    if (/elementor-testimonial__image/.test(cls)) classes.push('source-avatar');
    if (/sedation-doctor-section|sedation-candidates-section|fmr-what-section/.test(cls)) classes.push('source-split');
    if (path === '/smileclub/' && node.parentElement === root && (node === root.firstElementChild || /footer-section/.test(cls))) classes.push('source-membership-bar');
    if (/migration-profile/.test(cls)) { outTag='article'; classes.push('source-profile'); }
    if (/profile-role|doctor-credentials|script-text|cidwp-script/.test(cls)) classes.push('source-eyebrow');
    if (/x-row-inner/.test(cls)) classes.push(node.querySelector('.migration-profile') ? 'source-profiles' : node.querySelector('a img') && path === '/services/' ? 'source-service-grid' : 'source-row');
    if (/x-col\b/.test(cls)) classes.push('source-column');
    if (/x-content/.test(cls)) classes.push('source-copy');
    if (/benefits-grid|process-steps|cidwp-svc-grid|cidwp-why-grid|cidwp-intro-grid/.test(cls)) classes.push('source-card-grid');
    if (/benefit-item|process-step|cidwp-svc$|cidwp-why-card/.test(cls)) classes.push('source-card');
    if (/type-item|procedure-item/.test(cls)) classes.push('source-numbered');
    if (/type-number|procedure-number|step-number/.test(cls)) classes.push('source-number');
    if (/faq-item/.test(cls)) classes.push('source-faq');
    if (/slider-track/.test(cls)) classes.push('source-gallery');
    if (/elementor-testimonial__text/.test(cls)) classes.push('source-quote');
    if (/elementor-testimonial__name/.test(cls)) classes.push('source-author');
    if (/elementor-widget-(text-editor|heading|image)/.test(cls)) classes.push('source-widget');
    const inner = contents();
    if (!inner.trim()) return node.id ? `<div id="${escape(node.id)}"></div>` : '';
    let attrs = classes.length ? ` class="${classes.join(' ')}"` : '';
    if (node.id && !/^(gform|gfield|field_|input_|e\d)/.test(node.id)) attrs += ` id="${escape(node.id)}"`;
    if (tag === 'td' || tag === 'th') for (const key of ['colspan','rowspan','scope']) if (node.hasAttribute(key)) attrs += ` ${key}="${escape(node.getAttribute(key))}"`;
    return `<${outTag}${attrs}>${inner}</${outTag}>`;
  }

  let sectionNodes;
  const custom = root.querySelector('.sedation-landing,.fmr-landing,.cidwp-landing');
  if (custom) sectionNodes = [...custom.children].filter(n => n.tagName === 'SECTION');
  else if ([...root.children].some(n => n.classList.contains('x-section'))) sectionNodes = [...root.children].filter(n=>n.classList.contains('x-section'));
  else sectionNodes = [...root.children];
  const sections = sectionNodes.map((node,index)=> {
    const html = clean(node);
    const test = parseHTML(`<html><body>${html}</body></html>`).document.body;
    const text = normalize(test.textContent);
    const kind = /cta|final/.test(node.className) || !!node.querySelector('.x-global-block-1208') ? 'cta' : node.querySelector('.migration-profile') ? 'profiles' : path === '/services/' && node.querySelector('a img') ? 'directory' : /source-membership-bar/.test(html) ? 'membership-bar' : 'content';
    return {html, text, kind, sourceIndex:index};
  }).filter(s=>s.text || /<(img|iframe)|<!--(APPOINTMENT_FORM|FINANCING_WIDGET)/.test(s.html));
  if (!sections.length) throw new Error(`Empty page: ${path}`);
  const page = {path,sourceUrl:source.url,sourceFile:source.file,capturedAt:source.capturedAt,title,headingHtml,titleTag:source.title,description:source.description,robots:source.robots,category:path.startsWith('/services/') || ['/sedation/','/full-mouth-restoration/'].includes(path) ? 'Services' : path.startsWith('/about/') || path==='/about/' ? 'About' : 'Practice',hasForms,hasFinancing,sections};
  pages.push(page);
  mapping.push({path,requestedPath:new URL(source.requestedUrl).pathname,status:hasForms?'Built; Jotform Pending':'Built',sourceFile:source.file,title,sectionCount:sections.length,omittedForms});
}
fs.mkdirSync('src/data',{recursive:true});
fs.writeFileSync('src/data/pages.json', JSON.stringify(pages,null,2)+'\n');
fs.writeFileSync('docs/migration/page-map.json',JSON.stringify({capturedOn:'2026-10-06',pages:mapping,aliases,warnings},null,2)+'\n');
fs.writeFileSync('public/_redirects',Object.entries(aliases).map(([from,to])=>`${from} ${to} 301`).join('\n')+'\n');
console.log(`Imported ${pages.length} pages; ${pages.filter(p=>p.hasForms).length} pages await Jotform. ${warnings.length} remote image references.`);
