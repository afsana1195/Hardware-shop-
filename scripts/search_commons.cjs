const https = require('https');

async function searchWikimedia(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url|mime|dimensions&format=json`;
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'JyotiHardwareApplet/1.0 (contact@jyotihardware.in)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query?.pages ? Object.values(json.query.pages) : [];
          const results = [];
          for (const p of pages) {
            const info = p.imageinfo?.[0];
            if (info && info.mime && info.mime.startsWith('image/')) {
              let thumb = info.url;
              if (thumb.includes('/commons/')) {
                const parts = thumb.split('/commons/');
                const filename = parts[1];
                thumb = `https://upload.wikimedia.org/wikipedia/commons/thumb/${filename}/800px-${filename.split('/').pop()}`;
                if (thumb.toLowerCase().endsWith('.tif') || thumb.toLowerCase().endsWith('.tiff')) {
                  thumb += '.jpg';
                }
              }
              results.push({ title: p.title, url: info.url, thumb, width: info.width, height: info.height });
            }
          }
          resolve(results);
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

async function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const req = https.request({
        method: 'HEAD',
        hostname: u.hostname,
        path: u.pathname + u.search,
        timeout: 4000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      }, (res) => {
        resolve(res.statusCode === 200);
      });
      req.on('error', () => resolve(false));
      req.on('timeout', () => { req.destroy(); resolve(false); });
      req.end();
    } catch (e) {
      resolve(false);
    }
  });
}

(async () => {
  const queries = [
    'hardware store India',
    'construction worker India',
    'safety helmet yellow',
    'safety shoes boots',
    'circuit breaker MCB',
    'door hinge stainless steel',
    'paint roller wall',
    'paint bucket can',
    'hand brush dustpan',
    'polycarbonate awning canopy door',
    'waterproofing roof terrace construction',
    'wood glue adhesive'
  ];

  for (const q of queries) {
    console.log(`\n=== Query: "${q}" ===`);
    const results = await searchWikimedia(q);
    for (const r of results.slice(0, 4)) {
      const isThumbOk = await checkUrl(r.thumb);
      console.log(`- ${r.title}`);
      console.log(`  Thumb: ${isThumbOk ? '[200 OK]' : '[FAILED]'} ${r.thumb}`);
    }
  }
})();
