const https = require('https');

async function searchDDG(query) {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query + ' site:unsplash.com/photos')}`;
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const matches = [...data.matchAll(/unsplash\.com\/photos\/([a-zA-Z0-9_-]+)/g)].map(m => m[1]);
        const unique = [...new Set(matches)];
        resolve(unique);
      });
    });
    req.on('error', () => resolve([]));
  });
}

async function run() {
  const queries = [
    'construction workers building site india',
    'cement bag construction site',
    'steel rebar construction',
    'angle grinder metal sparks',
    'power drill tool workshop',
    'cordless drill dewalt bosch',
    'asian paints bucket wall painting',
    'paint roller wall renovation',
    'electrical copper wire coil roll',
    'modular electrical switch socket',
    'circuit breaker electrical panel',
    'pvc pipes plumbing fittings',
    'brass water tap faucet bib cock',
    'stainless steel mortise door lock',
    'door hinges butt brass stainless',
    'steel claw hammer carpentry',
    'yellow safety helmet hard hat construction',
    'leather work safety boots steel toe',
    'respirator mask dust safety n95',
    'wood glue adhesive bottle bucket'
  ];

  for (const q of queries) {
    const ids = await searchDDG(q);
    console.log(`\n=== QUERY: ${q} ===`);
    console.log(ids.slice(0, 5));
  }
}

run();
