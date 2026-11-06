/**
 * Fallback image helper for Jyoti Hardware & Construction
 * Provides branded SVGs for products and categories when external URLs fail or are loading.
 */

export const HARDWARE_FALLBACK_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8faf9"/>
      <stop offset="100%" stop-color="#edf2ef"/>
    </linearGradient>
    <linearGradient id="brandGreen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0c432d"/>
      <stop offset="100%" stop-color="#062e1e"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#bg)"/>
  
  <!-- Subtle Grid Pattern -->
  <g stroke="#d1ded7" stroke-width="1" opacity="0.4">
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

  <!-- Central House Outline & Tool Icon -->
  <g transform="translate(210, 180)">
    <rect width="180" height="180" rx="36" fill="url(#brandGreen)" filter="drop-shadow(0 12px 20px rgba(12, 67, 45, 0.2))"/>
    <!-- House Roof Line -->
    <path d="M40 90 L90 45 L140 90" stroke="#f59e0b" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <rect x="75" y="85" width="30" height="45" rx="4" fill="#f59e0b"/>
    <path d="M60 135 L120 135" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
  </g>

  <!-- Brand Typography -->
  <text x="300" y="410" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="900" fill="#0c432d" text-anchor="middle" letter-spacing="1">
    JYOTI HARDWARE
  </text>
  <text x="300" y="435" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#d97706" text-anchor="middle" letter-spacing="2">
    &amp; CONSTRUCTION • BANGALORE
  </text>
</svg>
`)}`;

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'Cement & Construction': '/assets/reference/cat_cement.png',
  'Cement & Construction Materials': '/assets/reference/cat_cement.png',
  'Building Materials': '/assets/reference/cat_cement.png',
  'Power Tools': '/assets/reference/cat_powertools.png',
  'Paints': '/assets/reference/cat_paints.png',
  'Paints & Accessories': '/assets/reference/cat_paints.png',
  'Electrical': '/assets/reference/cat_electrical.png',
  'Electrical Supplies': '/assets/reference/cat_electrical.png',
  'Plumbing': '/assets/reference/cat_plumbing.png',
  'Plumbing Supplies': '/assets/reference/cat_plumbing.png',
  'Hardware': '/assets/reference/cat_hardware.png',
  'Building Hardware': '/assets/reference/cat_hardware.png',
  'Safety Equipment': '/assets/reference/cat_hardware.png',
  'Adhesives & Waterproofing': '/assets/reference/cat_cement.png',
  'Adhesives & Fasteners': '/assets/reference/cat_hardware.png',
};

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>, fallback = HARDWARE_FALLBACK_IMAGE) {
  const target = e.currentTarget;
  if (target.src !== fallback) {
    target.src = fallback;
  }
}
