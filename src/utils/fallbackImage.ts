/**
 * Fallback image helper for Jyoti Hardware & Construction
 * Provides branded SVGs for products and categories when external URLs fail or are loading.
 */

export const HARDWARE_FALLBACK_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f5f5f4"/>
      <stop offset="100%" stop-color="#e7e5e4"/>
    </linearGradient>
    <linearGradient id="brandRed" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e31b23"/>
      <stop offset="100%" stop-color="#b91c1c"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#bg)"/>
  
  <!-- Subtle Grid Pattern -->
  <g stroke="#d6d3d1" stroke-width="1" opacity="0.4">
    <line x1="100" y1="0" x2="100" y2="600"/>
    <line x1="200" y1="0" x2="200" y2="600"/>
    <line x1="300" y1="0" x2="300" y2="600"/>
    <line x1="400" y1="0" x2="400" y2="600"/>
    <line x1="500" y1="0" x2="500" y2="600"/>
    <line x1="0" y1="100" x2="600" y2="100"/>
    <line x1="0" y1="200" x2="600" y2="200"/>
    <line x1="0" y1="300" x2="600" y2="300"/>
    <line x1="0" y1="400" x2="600" y2="400"/>
    <line x1="0" y1="500" x2="600" y2="500"/>
  </g>

  <!-- Central Hardware Badge Icon -->
  <g transform="translate(230, 200)">
    <rect width="140" height="140" rx="28" fill="url(#brandRed)" filter="drop-shadow(0 10px 15px rgba(227, 27, 35, 0.25))"/>
    <!-- Hammer & Wrench Icon -->
    <path d="M45 95 L65 75 L75 85 L55 105 Z" fill="#ffffff" opacity="0.9"/>
    <path d="M62 72 L85 49 C90 44 98 44 103 49 C108 54 108 62 103 67 L80 90 Z" fill="#ffffff"/>
    <circle cx="95" cy="57" r="5" fill="url(#brandRed)"/>
  </g>

  <!-- Brand Typography -->
  <text x="300" y="385" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="900" fill="#1c1917" text-anchor="middle" letter-spacing="1">
    JYOTI HARDWARE
  </text>
  <text x="300" y="410" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#e31b23" text-anchor="middle" letter-spacing="2">
    GENUINE SITE MATERIALS • BANGALORE
  </text>
</svg>
`)}`;

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'Cement & Construction Materials': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
  'Building Materials': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
  'Power Tools': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
  'Paints & Accessories': 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
  'Electrical Supplies': 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
  'Plumbing': 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
  'Plumbing Supplies': 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
  'Building Hardware': 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
  'Safety Equipment': 'https://images.unsplash.com/photo-1578873375969-d6023ea9be59?auto=format&fit=crop&w=800&q=80',
  'Adhesives & Waterproofing': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
  'Adhesives & Fasteners': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
};

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>, fallback = HARDWARE_FALLBACK_IMAGE) {
  const target = e.currentTarget;
  if (target.src !== fallback) {
    target.src = fallback;
  }
}
