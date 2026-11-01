const fs = require('fs');
const path = require('path');

const logosDir = path.join(__dirname, '..', 'web', 'assets', 'logos');
const productsDir = path.join(__dirname, '..', 'web', 'assets', 'products');

fs.mkdirSync(logosDir, { recursive: true });
fs.mkdirSync(productsDir, { recursive: true });

// 1. SUPERMARKET BRAND LOGOS (Authentic-styled vector emblems)
const storeLogos = {
  db: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <defs>
      <linearGradient id="dbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#E53935"/>
        <stop offset="100%" stop-color="#B71C1C"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#dbGrad)"/>
    <ellipse cx="60" cy="56" rx="46" ry="34" fill="#FFD600" stroke="#FFF" stroke-width="3"/>
    <ellipse cx="60" cy="56" rx="41" ry="29" fill="#D32F2F"/>
    <text x="60" y="68" font-family="Arial Black, Impact, sans-serif" font-size="38" font-weight="900" fill="#FFF" text-anchor="middle" letter-spacing="-1">DB</text>
    <text x="60" y="106" font-family="Arial, sans-serif" font-size="11" font-weight="800" fill="#FFEB3B" text-anchor="middle" letter-spacing="0.5">HIPER DB</text>
  </svg>`,

  nova_era: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <defs>
      <linearGradient id="neGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FF8F00"/>
        <stop offset="100%" stop-color="#E65100"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#neGrad)"/>
    <circle cx="60" cy="42" r="24" fill="#FFD600" opacity="0.9"/>
    <path d="M20 62 Q60 40 100 62 L100 95 Q60 85 20 95 Z" fill="#0D47A1"/>
    <text x="60" y="66" font-family="Arial Black, sans-serif" font-size="18" font-weight="900" fill="#FFF" text-anchor="middle">NOVA</text>
    <text x="60" y="86" font-family="Arial Black, sans-serif" font-size="22" font-weight="900" fill="#FFD600" text-anchor="middle">ERA</text>
    <text x="60" y="108" font-family="Arial, sans-serif" font-size="9.5" font-weight="800" fill="#FFF" text-anchor="middle">SUPERATACADO</text>
  </svg>`,

  atacadao: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <rect width="120" height="120" rx="26" fill="#1B5E20"/>
    <path d="M12 32 H108 L98 54 H22 Z" fill="#F57C00"/>
    <path d="M20 58 H100 L92 76 H28 Z" fill="#2E7D32" stroke="#FFF" stroke-width="2"/>
    <circle cx="60" cy="43" r="14" fill="#FFD600"/>
    <text x="60" y="49" font-family="Arial Black, sans-serif" font-size="18" font-weight="900" fill="#1B5E20" text-anchor="middle">A</text>
    <text x="60" y="96" font-family="Arial Black, sans-serif" font-size="15" font-weight="900" fill="#FFF" text-anchor="middle">ATACADÃO</text>
    <rect x="25" y="103" width="70" height="5" rx="2.5" fill="#F57C00"/>
  </svg>`,

  assai: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <defs>
      <linearGradient id="asGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1976D2"/>
        <stop offset="100%" stop-color="#0D47A1"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#asGrad)"/>
    <path d="M32 58 A28 28 0 0 1 88 58 Z" fill="#FF6D00"/>
    <circle cx="60" cy="36" r="7" fill="#FFD600"/>
    <text x="60" y="82" font-family="Arial Black, sans-serif" font-size="25" font-weight="900" fill="#FFF" text-anchor="middle">ASSAÍ</text>
    <text x="60" y="102" font-family="Arial, sans-serif" font-size="10.5" font-weight="800" fill="#FFD600" text-anchor="middle">ATACADISTA</text>
  </svg>`,

  baratao: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <defs>
      <linearGradient id="bcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#C62828"/>
        <stop offset="100%" stop-color="#7F0000"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#bcGrad)"/>
    <circle cx="60" cy="46" r="24" fill="#FFF" stroke="#FFD600" stroke-width="3"/>
    <path d="M44 40 Q38 28 48 34 Q60 30 72 34 Q82 28 76 40 Q78 54 60 58 Q42 54 44 40 Z" fill="#C62828"/>
    <circle cx="53" cy="44" r="2.5" fill="#FFF"/>
    <circle cx="67" cy="44" r="2.5" fill="#FFF"/>
    <text x="60" y="88" font-family="Arial Black, sans-serif" font-size="16" font-weight="900" fill="#FFD600" text-anchor="middle">BARATÃO</text>
    <text x="60" y="104" font-family="Arial, sans-serif" font-size="11" font-weight="800" fill="#FFF" text-anchor="middle">DA CARNE</text>
  </svg>`,

  carrefour: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <rect width="120" height="120" rx="26" fill="#FFF" stroke="#E0E0E0" stroke-width="4"/>
    <polygon points="60,18 96,54 60,90 24,54" fill="#1565C0"/>
    <polygon points="60,18 24,54 60,90 48,54" fill="#D32F2F"/>
    <path d="M68 38 C52 38 46 46 46 54 C46 62 52 70 68 70 L68 62 C58 62 55 59 55 54 C55 49 58 46 68 46 Z" fill="#FFF"/>
    <text x="60" y="108" font-family="Arial Black, sans-serif" font-size="14" font-weight="900" fill="#0D47A1" text-anchor="middle">Carrefour</text>
  </svg>`,

  gaviao: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <rect width="120" height="120" rx="26" fill="#004D40"/>
    <circle cx="60" cy="46" r="24" fill="#FFD600"/>
    <path d="M42 50 Q60 26 78 44 Q66 46 60 58 Q52 48 42 50 Z" fill="#004D40"/>
    <text x="60" y="88" font-family="Arial Black, sans-serif" font-size="18" font-weight="900" fill="#FFF" text-anchor="middle">GAVIÃO</text>
    <text x="60" y="104" font-family="Arial, sans-serif" font-size="10" font-weight="800" fill="#FFD600" text-anchor="middle">BOA VISTA • RR</text>
  </svg>`,

  goiana: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <rect width="120" height="120" rx="26" fill="#2E7D32"/>
    <rect x="18" y="24" width="84" height="46" rx="14" fill="#FFF"/>
    <text x="60" y="56" font-family="Arial Black, sans-serif" font-size="24" font-weight="900" fill="#2E7D32" text-anchor="middle">GOIANA</text>
    <text x="60" y="94" font-family="Arial, sans-serif" font-size="11" font-weight="800" fill="#FFD600" text-anchor="middle">SUPERMERCADOS</text>
  </svg>`,

  novo_tempo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <rect width="120" height="120" rx="26" fill="#283593"/>
    <circle cx="60" cy="45" r="22" fill="#FF8F00"/>
    <text x="60" y="53" font-family="Arial Black, sans-serif" font-size="20" font-weight="900" fill="#FFF" text-anchor="middle">NT</text>
    <text x="60" y="86" font-family="Arial Black, sans-serif" font-size="14" font-weight="900" fill="#FFF" text-anchor="middle">NOVO TEMPO</text>
    <text x="60" y="103" font-family="Arial, sans-serif" font-size="10" font-weight="800" fill="#FFD600" text-anchor="middle">REGIONAL</text>
  </svg>`,

  mercadinho: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <rect width="120" height="120" rx="26" fill="#00695C"/>
    <path d="M22 44 L32 24 H88 L98 44 Z" fill="#FF7043"/>
    <rect x="28" y="44" width="64" height="36" rx="4" fill="#FFF"/>
    <rect x="48" y="54" width="24" height="26" rx="3" fill="#00695C"/>
    <text x="60" y="96" font-family="Arial Black, sans-serif" font-size="12" font-weight="900" fill="#FFD600" text-anchor="middle">MERCADINHO</text>
    <text x="60" y="109" font-family="Arial, sans-serif" font-size="9.5" font-weight="800" fill="#FFF" text-anchor="middle">DO BAIRRO</text>
  </svg>`,

  feira: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <rect width="120" height="120" rx="26" fill="#33691E"/>
    <circle cx="60" cy="46" r="24" fill="#FFF8E1"/>
    <text x="60" y="55" font-size="26" text-anchor="middle">🥬</text>
    <text x="60" y="88" font-family="Arial Black, sans-serif" font-size="13.5" font-weight="900" fill="#FFD600" text-anchor="middle">SACOLÃO</text>
    <text x="60" y="104" font-family="Arial, sans-serif" font-size="10" font-weight="800" fill="#FFF" text-anchor="middle">FEIRA &amp; BAIRRO</text>
  </svg>`,

  mateus: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <rect width="120" height="120" rx="26" fill="#0D47A1"/>
    <circle cx="60" cy="46" r="24" fill="#D32F2F" stroke="#FFF" stroke-width="3"/>
    <text x="60" y="55" font-family="Arial Black, sans-serif" font-size="24" font-weight="900" fill="#FFF" text-anchor="middle">M</text>
    <text x="60" y="90" font-family="Arial Black, sans-serif" font-size="15" font-weight="900" fill="#FFF" text-anchor="middle">MATEUS</text>
    <text x="60" y="105" font-family="Arial, sans-serif" font-size="9.5" font-weight="800" fill="#FFD600" text-anchor="middle">MIX &amp; SUPER</text>
  </svg>`,

  pao_acucar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <rect width="120" height="120" rx="26" fill="#1B5E20"/>
    <path d="M36 62 Q48 26 60 48 Q72 20 84 62 Z" fill="#8BC34A"/>
    <text x="60" y="86" font-family="Arial Black, sans-serif" font-size="13" font-weight="900" fill="#FFF" text-anchor="middle">PÃO DE</text>
    <text x="60" y="102" font-family="Arial Black, sans-serif" font-size="14" font-weight="900" fill="#FFD600" text-anchor="middle">AÇÚCAR</text>
  </svg>`,

  muffato: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <rect width="120" height="120" rx="26" fill="#B71C1C"/>
    <rect x="20" y="24" width="80" height="44" rx="12" fill="#FFF"/>
    <text x="60" y="54" font-family="Arial Black, sans-serif" font-size="22" font-weight="900" fill="#B71C1C" text-anchor="middle">MUFFATO</text>
    <text x="60" y="92" font-family="Arial, sans-serif" font-size="11" font-weight="800" fill="#FFD600" text-anchor="middle">SUPERMERCADOS</text>
  </svg>`
};

for (const [key, svg] of Object.entries(storeLogos)) {
  fs.writeFileSync(path.join(logosDir, `${key}.svg`), svg.trim(), 'utf8');
}

// 2. PRODUCT PACKAGING ILLUSTRATIONS (24 distinct illustrated product types with packaging & labels)
function makeProductSvg({ bg1, bg2, packColor, accent, title, subtitle, emoji, shape = 'bag' }) {
  let packShape = '';
  if (shape === 'bottle') {
    packShape = `
      <rect x="48" y="14" width="24" height="12" rx="4" fill="${accent}"/>
      <path d="M44 26 H76 L86 46 V98 C86 103 82 106 77 106 H43 C38 106 34 103 34 98 V46 Z" fill="${packColor}" stroke="#FFF" stroke-width="2"/>
      <rect x="38" y="52" width="44" height="36" rx="6" fill="#FFF" opacity="0.95"/>
    `;
  } else if (shape === 'box') {
    packShape = `
      <rect x="26" y="22" width="68" height="82" rx="8" fill="${packColor}" stroke="#FFF" stroke-width="2.5"/>
      <path d="M26 36 H94" stroke="${accent}" stroke-width="6"/>
      <rect x="34" y="46" width="52" height="42" rx="6" fill="#FFF" opacity="0.95"/>
    `;
  } else if (shape === 'tray') {
    packShape = `
      <rect x="16" y="34" width="88" height="64" rx="14" fill="${packColor}" stroke="#FFF" stroke-width="3"/>
      <rect x="24" y="42" width="72" height="48" rx="10" fill="#FFF" opacity="0.92"/>
    `;
  } else if (shape === 'can') {
    packShape = `
      <ellipse cx="60" cy="26" rx="28" ry="8" fill="#E0E0E0" stroke="#FFF" stroke-width="2"/>
      <rect x="32" y="26" width="56" height="72" rx="6" fill="${packColor}" stroke="#FFF" stroke-width="2"/>
      <rect x="36" y="44" width="48" height="38" rx="5" fill="#FFF" opacity="0.95"/>
    `;
  } else {
    // bag / pouch
    packShape = `
      <path d="M28 20 Q60 25 92 20 L96 98 Q60 105 24 98 Z" fill="${packColor}" stroke="#FFF" stroke-width="2.5"/>
      <rect x="34" y="40" width="52" height="44" rx="8" fill="#FFF" opacity="0.95"/>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg1}"/>
        <stop offset="100%" stop-color="${bg2}"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="24" fill="url(#bg)"/>
    ${packShape}
    <text x="60" y="65" font-size="24" text-anchor="middle">${emoji}</text>
    <text x="60" y="80" font-family="Arial Black, sans-serif" font-size="9.5" font-weight="900" fill="#1A241E" text-anchor="middle">${title}</text>
    <rect x="28" y="92" width="64" height="15" rx="7.5" fill="${accent}"/>
    <text x="60" y="103" font-family="Arial, sans-serif" font-size="8.5" font-weight="800" fill="#FFF" text-anchor="middle">${subtitle}</text>
  </svg>`;
}

const productTypes = {
  arroz: { bg1: '#E3F2FD', bg2: '#BBDEFB', packColor: '#1565C0', accent: '#D32F2F', title: 'ARROZ T1', subtitle: 'TIPO 1 • 5KG', emoji: '🍚', shape: 'bag' },
  feijao: { bg1: '#EFEBE9', bg2: '#D7CCC8', packColor: '#6D4C41', accent: '#2E7D32', title: 'FEIJÃO', subtitle: 'CARIOCA 1KG', emoji: '🫘', shape: 'bag' },
  farinha: { bg1: '#FFF8E1', bg2: '#FFECB3', packColor: '#F57F17', accent: '#1B5E20', title: 'FARINHA AM', subtitle: 'UARINI 1KG', emoji: '🌾', shape: 'bag' },
  cafe: { bg1: '#FBE9E7', bg2: '#FFCCBC', packColor: '#4E342E', accent: '#D84315', title: 'CAFÉ', subtitle: 'TORRADO 500G', emoji: '☕', shape: 'box' },
  acucar: { bg1: '#E8F5E9', bg2: '#C8E6C9', packColor: '#2E7D32', accent: '#1565C0', title: 'AÇÚCAR', subtitle: 'REFINADO 1KG', emoji: '🍬', shape: 'bag' },
  oleo: { bg1: '#FFFDE7', bg2: '#FFF59D', packColor: '#FBC02D', accent: '#2E7D32', title: 'ÓLEO SOJA', subtitle: '900ML PURO', emoji: '🫗', shape: 'bottle' },
  leite: { bg1: '#FFF8E1', bg2: '#FFE082', packColor: '#FFA000', accent: '#0D47A1', title: 'LEITE', subtitle: 'INTEGRAL', emoji: '🥛', shape: 'can' },
  manteiga: { bg1: '#FFF3E0', bg2: '#FFE0B2', packColor: '#EF6C00', accent: '#1A237E', title: 'MANTEIGA', subtitle: 'COM SAL', emoji: '🧈', shape: 'tray' },
  macarrao: { bg1: '#FFEBEE', bg2: '#FFCDD2', packColor: '#C62828', accent: '#FBC02D', title: 'MASSA', subtitle: 'SEMOLINA', emoji: '🍝', shape: 'bag' },
  biscoito: { bg1: '#FFF3E0', bg2: '#FFCC80', packColor: '#E65100', accent: '#283593', title: 'BISCOITO', subtitle: 'CROCANTE', emoji: '🍪', shape: 'box' },
  peixe: { bg1: '#E0F7FA', bg2: '#B2EBF2', packColor: '#00838F', accent: '#0F6D44', title: 'PESCADO AM', subtitle: 'FRESCO KG', emoji: '🐟', shape: 'tray' },
  carne: { bg1: '#FFEBEE', bg2: '#FFCDD2', packColor: '#B71C1C', accent: '#212121', title: 'AÇOUGUE', subtitle: 'CORTE BOVINO', emoji: '🥩', shape: 'tray' },
  frango: { bg1: '#FFF8E1', bg2: '#FFE082', packColor: '#F57C00', accent: '#C62828', title: 'FRANGO', subtitle: 'CONGELADO', emoji: '🍗', shape: 'tray' },
  ovos: { bg1: '#FFFDE7', bg2: '#FFF9C4', packColor: '#FBC02D', accent: '#5D4037', title: 'OVOS', subtitle: 'GRANJA AM', emoji: '🥚', shape: 'tray' },
  hortifruti: { bg1: '#E8F5E9', bg2: '#A5D6A7', packColor: '#2E7D32', accent: '#F57F17', title: 'FEIRA AM', subtitle: 'SELECIONADO', emoji: '🍌', shape: 'tray' },
  pao: { bg1: '#EFEBE9', bg2: '#D7CCC8', packColor: '#8D6E63', accent: '#E65100', title: 'PADARIA', subtitle: 'FORNADA DIA', emoji: '🥖', shape: 'bag' },
  bebida: { bg1: '#E8F5E9', bg2: '#C8E6C9', packColor: '#1B5E20', accent: '#D32F2F', title: 'BEBIDA', subtitle: 'GELADA', emoji: '🥤', shape: 'bottle' },
  limpeza: { bg1: '#E3F2FD', bg2: '#90CAF9', packColor: '#0277BD', accent: '#FF6F00', title: 'LIMPEZA', subtitle: 'CASA ATIVA', emoji: '🧼', shape: 'bottle' },
  sabao_po: { bg1: '#E8EAF6', bg2: '#9FA8DA', packColor: '#1565C0', accent: '#D32F2F', title: 'LAVA ROUPAS', subtitle: 'AÇÃO TOTAL', emoji: '🧺', shape: 'box' },
  higiene: { bg1: '#F3E5F5', bg2: '#CE93D8', packColor: '#6A1B9A', accent: '#00897B', title: 'HIGIENE', subtitle: 'CUIDADO', emoji: '🧴', shape: 'bottle' },
  bebe: { bg1: '#E1F5FE', bg2: '#81D4FA', packColor: '#0288D1', accent: '#EC407A', title: 'BEBÊ', subtitle: 'INFANTIL', emoji: '👶', shape: 'bag' },
  pet: { bg1: '#FFF3E0', bg2: '#FFCC80', packColor: '#EF6C00', accent: '#4E342E', title: 'PET SHOP', subtitle: 'NUTRIÇÃO', emoji: '🐾', shape: 'bag' },
  tempero: { bg1: '#FFEBEE', bg2: '#EF9A9A', packColor: '#C62828', accent: '#2E7D32', title: 'TEMPERO', subtitle: 'SABOR AM', emoji: '🌶️', shape: 'bottle' },
  bazar: { bg1: '#ECEFF1', bg2: '#B0BEC5', packColor: '#37474F', accent: '#0277BD', title: 'UTILIDADES', subtitle: 'CASA & BAZAR', emoji: '📚', shape: 'box' }
};

for (const [key, cfg] of Object.entries(productTypes)) {
  fs.writeFileSync(path.join(productsDir, `${key}.svg`), makeProductSvg(cfg), 'utf8');
}

console.log(`Generated ${Object.keys(storeLogos).length} store logos and ${Object.keys(productTypes).length} product packaging SVGs!`);
