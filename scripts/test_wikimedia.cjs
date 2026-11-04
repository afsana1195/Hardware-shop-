const https = require('https');

async function searchWiki(query, limit = 5) {
  const endpoint = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=${limit}&prop=imageinfo&iiprop=url|mime|extmetadata&iiurlwidth=800`;
  return new Promise((resolve) => {
    https.get(endpoint, { headers: { 'User-Agent': 'HardwareStoreApp/1.0 (wazid@hardware.com)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query?.pages || {};
          const results = Object.values(pages).map(p => {
            const info = p.imageinfo?.[0];
            return {
              title: p.title,
              url: info?.thumburl || info?.url,
              original: info?.url,
              mime: info?.mime
            };
          }).filter(x => x.mime && (x.mime.includes('jpeg') || x.mime.includes('png') || x.mime.includes('jpg')));
          resolve(results);
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

async function run() {
  const topics = [
    { key: 'hero_indian_workers', q: 'construction workers in India building site' },
    { key: 'indian_hardware_store', q: 'hardware store India shop' },
    { key: 'cement_bags', q: 'cement bags building materials' },
    { key: 'tmt_rebar', q: 'steel reinforcing rebar construction' },
    { key: 'angle_grinder', q: 'angle grinder cutting metal sparks' },
    { key: 'bosch_drill', q: 'power drill machine tool' },
    { key: 'paint_bucket', q: 'paint bucket paint can' },
    { key: 'paint_roller', q: 'painting with roller wall' },
    { key: 'electrical_cable', q: 'copper wire roll electrical' },
    { key: 'electrical_switch', q: 'light switch wall electrical socket' },
    { key: 'circuit_breaker_mcb', q: 'circuit breaker electrical distribution board' },
    { key: 'plumbing_pipes', q: 'PVC pipes plumbing plastic' },
    { key: 'water_tap', q: 'brass water tap faucet' },
    { key: 'door_lock', q: 'door lock mortise cylinder' },
    { key: 'butt_hinges', q: 'door hinges stainless steel' },
    { key: 'claw_hammer', q: 'claw hammer metal tool' },
    { key: 'safety_helmet', q: 'hard hat safety helmet construction yellow' },
    { key: 'safety_boots', q: 'work safety boots steel toe' },
    { key: 'n95_mask', q: 'dust mask respirator safety construction' },
    { key: 'wood_glue', q: 'wood glue container adhesive' }
  ];

  for (const t of topics) {
    const list = await searchWiki(t.q, 3);
    console.log(`\n=== ${t.key} (${t.q}) ===`);
    list.forEach(item => {
      console.log(`[${item.title}]\nURL: ${item.url}\n`);
    });
  }
}

run();
