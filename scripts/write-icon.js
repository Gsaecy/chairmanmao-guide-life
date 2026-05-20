const fs = require('fs');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#c41e3a"/>
      <stop offset="100%" style="stop-color:#8b0000"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="20" fill="url(#bg)"/>
  <polygon points="64,12 75,48 114,48 82,70 94,106 64,84 34,106 46,70 14,48 53,48" 
           fill="#f5c518" stroke="#d4a017" stroke-width="1.5"/>
  <path d="M24 100 L24 78 Q24 72 30 72 L46 72 Q52 72 52 78 L52 100 Q52 106 46 106 L30 106 Q24 106 24 100Z" 
        fill="#fff" opacity="0.9"/>
  <path d="M35 80 L46 80 M35 88 L46 88 M35 96 L46 96" stroke="#8b0000" stroke-width="1.5" stroke-opacity="0.5"/>
  <text x="76" y="104" font-family="serif" font-size="20" font-weight="bold" fill="#f5c518">毛选</text>
</svg>`;
fs.writeFileSync('media/icon.svg', svg.trim());
console.log('icon.svg written');