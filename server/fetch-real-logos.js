const https = require('https');
const fs = require('fs');
const path = require('path');

const logosDir = path.join(__dirname, '..', 'web', 'assets', 'logos');
fs.mkdirSync(logosDir, { recursive: true });

function wrapPngInSvg(key, buffer, contentType = 'image/png') {
  const mime = contentType.includes('webp') ? 'image/webp' : contentType.includes('jpeg') ? 'image/jpeg' : 'image/png';
  const b64 = buffer.toString('base64');
  const svgWrapper = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <rect width="120" height="120" rx="22" fill="#FFFFFF" stroke="#E0E6E2" stroke-width="3"/>
  <image href="data:${mime};base64,${b64}" x="8" y="8" width="104" height="104" preserveAspectRatio="xMidYMid contain"/>
</svg>`;
  fs.writeFileSync(path.join(logosDir, `${key}.svg`), svgWrapper, 'utf8');
}

// 1. Wrap already downloaded authentic Seeklogo PNGs (atacadao, assai, carrefour)
for (const validKey of ['atacadao', 'assai', 'carrefour']) {
  const pngFile = path.join(logosDir, `${validKey}.png`);
  if (fs.existsSync(pngFile)) {
    const buf = fs.readFileSync(pngFile);
    if (buf.length > 500) {
      wrapPngInSvg(validKey, buf, 'image/png');
      console.log(`✅ Embedded authentic Seeklogo PNG for: ${validKey} (${(buf.length / 1024).toFixed(1)} KB)`);
    }
  }
}

function fetchBuffer(url, redirects = 5) {
  return new Promise((resolve, reject) => {
    if (redirects <= 0) return reject(new Error('Too many redirects'));
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const nextUrl = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).href;
        res.resume();
        return resolve(fetchBuffer(nextUrl, redirects - 1));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ buffer: Buffer.concat(chunks), contentType: res.headers['content-type'] || '' }));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => req.destroy(new Error('Timeout')));
  });
}

async function searchSeekLogoStrict(query, requiredSlugTokens) {
  const searchUrl = `https://seeklogo.com/search?q=${encodeURIComponent(query)}`;
  const { buffer } = await fetchBuffer(searchUrl);
  const html = buffer.toString('utf8');
  const matches = html.match(/https:\/\/images\.seeklogo\.com\/logo-png\/[^"'\s>]+?\.(?:png|webp|jpg)/gi) || [];
  for (const url of matches) {
    const lower = url.toLowerCase();
    if (requiredSlugTokens.some(tok => lower.includes(tok))) {
      return url;
    }
  }
  return null;
}

const EXTRA_BRANDS = [
  { key: 'pao_acucar', query: 'pao de acucar', tokens: ['pao-de-acucar', 'acucar'], fallbackUrl: 'https://www.google.com/s2/favicons?domain=paodeacucar.com&sz=128' },
  { key: 'mateus', query: 'mateus supermercados', tokens: ['mateus'], fallbackUrl: 'https://www.google.com/s2/favicons?domain=grupomateus.com.br&sz=128' },
  { key: 'muffato', query: 'muffato', tokens: ['muffato'], fallbackUrl: 'https://www.google.com/s2/favicons?domain=muffato.com.br&sz=128' },
  { key: 'db', query: 'hiper db', tokens: ['hiper-db', 'supermercados-db'], fallbackUrl: 'https://www.google.com/s2/favicons?domain=supermercadosdb.com.br&sz=128' },
  { key: 'nova_era', query: 'super nova era', tokens: ['nova-era'], fallbackUrl: 'https://www.google.com/s2/favicons?domain=supernovaera.com.br&sz=128' }
];

(async () => {
  if (process.argv.includes('--offline-only')) return;
  for (const b of EXTRA_BRANDS) {
    try {
      let url = await searchSeekLogoStrict(b.query, b.tokens);
      if (url) {
        console.log(`🔍 Strict Seeklogo match for ${b.key}: ${url}`);
        const { buffer, contentType } = await fetchBuffer(url);
        if (buffer.length > 800) {
          fs.writeFileSync(path.join(logosDir, `${b.key}.png`), buffer);
          wrapPngInSvg(b.key, buffer, contentType);
          console.log(`✅ Saved strict Seeklogo for ${b.key} (${(buffer.length / 1024).toFixed(1)} KB)`);
        }
      } else {
        console.log(`ℹ️ Keeping custom HD vector emblem for ${b.key}`);
      }
    } catch (e) {
      console.log(`ℹ️ Keeping custom HD vector emblem for ${b.key} (${e.message})`);
    }
  }
})();
