const fs = require('fs');
const https = require('https');

const files = [
  'src/data/initialProducts.ts',
  'src/components/HeroBanner.tsx',
  'src/components/AboutView.tsx',
  'src/components/ShopView.tsx'
];

let allUrls = [];
for (const file of files) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const matches = [...content.matchAll(/https:\/\/[^\s'"`,)]+/g)].map(m => m[0]);
    allUrls.push(...matches);
  }
}

const uniqueUrls = [...new Set(allUrls)];
console.log('Total unique URLs found:', uniqueUrls.length);

async function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const req = https.request({
        method: 'HEAD',
        hostname: u.hostname,
        path: u.pathname + u.search,
        timeout: 6000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      }, (res) => {
        resolve({ url, status: res.statusCode });
      });
      req.on('error', (e) => resolve({ url, error: e.message }));
      req.on('timeout', () => { req.destroy(); resolve({ url, error: 'TIMEOUT' }); });
      req.end();
    } catch (e) {
      resolve({ url, error: e.message });
    }
  });
}

(async () => {
  const results = await Promise.all(uniqueUrls.map(checkUrl));
  const bad = results.filter(r => r.status !== 200);
  console.log('Bad URLs (' + bad.length + '):');
  bad.forEach(b => console.log(b.status || b.error, b.url));
  const good = results.filter(r => r.status === 200);
  console.log('Good 200 URLs (' + good.length + ')');
})();
