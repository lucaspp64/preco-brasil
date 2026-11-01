const fs = require('fs');
const path = require('path');

const canonical = require('../web/data/supermarkets.json');
const catalogPath = path.join(__dirname, '..', 'web', 'data', 'manausCatalog.js');
let code = fs.readFileSync(catalogPath, 'utf8');

//Extrair CITIES_CONFIG atual do manausCatalog.js
const startMarker = '  const CITIES_CONFIG = {';
const endMarker = '  // ============================================================================\n  // EXPANSÃO DO BANCO DE DADOS';
const startIdx = code.indexOf(startMarker);
const endIdx = code.indexOf(endMarker);

const currentCitiesJsonStr = code.slice(startIdx + '  const CITIES_CONFIG = '.length, endIdx).trim().replace(/;$/, '');
const citiesObj = JSON.parse(currentCitiesJsonStr);

const OFFSETS_15 = [
  [0.012, 0.008], [-0.018, 0.005], [0.045, 0.030], [0.025, 0.048], [-0.022, 0.012],
  [0.000, 0.000], [-0.032, -0.045], [0.015, -0.022], [-0.010, 0.028], [0.020, -0.015],
  [-0.025, 0.022], [0.031, -0.018], [-0.014, -0.019], [0.005, 0.004], [-0.006, 0.007]
];

const slotKeys = [
  "db", "nova_era", "atacadao", "assai", "baratao", "carrefour", "mercadinho_bairro", "sacolao_feira",
  "m9", "m10", "m11", "m12", "m13", "m14", "m15"
];

for (const [capKey, capData] of Object.entries(canonical.capitais)) {
  const legacyId = capData.legacyId;
  const cityEntry = citiesObj[legacyId];
  if (!cityEntry) continue;

  cityEntry.canonicalKey = capKey;
  cityEntry.heroBadge = `🇧🇷 ${capKey} • Os 15 Maiores Supermercados de ${capData.cidade}`;
  cityEntry.heroSubtitle = `Cotações em 15 redes de ${capData.cidade}: ${capData.mercados.slice(0, 6).map(m => m.nome).join(', ')} e mais 9 redes.`;

  const baseLat = cityEntry.neighborhoods[0] ? cityEntry.neighborhoods[0].lat : -3.1050;
  const baseLng = cityEntry.neighborhoods[0] ? cityEntry.neighborhoods[0].lng : -60.0120;

  const newSupermarkets = {};
  capData.mercados.forEach((m, idx) => {
    const sKey = slotKeys[idx];
    const off = OFFSETS_15[idx % OFFSETS_15.length];
    const tipoLabels = {
      atacarejo: "Atacarejo",
      hiper: "Hipermercado",
      super: "Supermercado",
      varejo: "Varejo",
      premium: "Premium",
      proximidade: "Proximidade / Bairro",
      hortifruti: "Hortifruti & Feira"
    };
    newSupermarkets[sKey] = {
      id: m.id,
      name: m.nome,
      color: m.cor,
      unit: `${m.nome} (${tipoLabels[m.tipo] || m.tipo})`,
      lat: +(baseLat + off[0]).toFixed(4),
      lng: +(baseLng + off[1]).toFixed(4),
      tier: m.porte,
      tipo: m.tipo,
      tierLabel: tipoLabels[m.tipo] || m.porte,
      logo: m.logo
    };
  });

  cityEntry.supermarkets = newSupermarkets;
  // Permitir acesso também pela chave canônica (ex: CITIES_CONFIG["SP-SaoPaulo"])
  citiesObj[capKey] = cityEntry;
}

const updatedCitiesStr = `  const CITIES_CONFIG = ${JSON.stringify(citiesObj, null, 4).replace(/\n/g, '\n  ')};\n\n`;
code = code.slice(0, startIdx) + updatedCitiesStr + code.slice(endIdx);

// Também adicionar os slots m9..m15 no SUPERMARKETS padrão e nos produtos para que os 15 mercados tenham cotações!
code = code.replace(
  /sacolao_feira: \{ name: "Sacolão & Feira Local"[^\n]+\n  \};/,
  `sacolao_feira: { name: "Feira da Manaus Moderna", color: "#33691E", unit: "Hortifruti & Feira", lat: -3.1080, lng: -60.0140, tier: "pequeno", tipo: "hortifruti", tierLabel: "Hortifruti & Feira", logo: "web/assets/logos/feira-manaus-moderna.svg" },
    m9: { name: "Supermercados Rodrigues", color: "#1565C0", unit: "Supermercado", lat: -3.0950, lng: -60.0050, tier: "medio", tipo: "super", tierLabel: "Supermercado", logo: "web/assets/logos/supermercados-rodrigues.svg" },
    m10: { name: "Supermercado Coari", color: "#2E7D32", unit: "Supermercado", lat: -3.1150, lng: -60.0250, tier: "medio", tipo: "super", tierLabel: "Supermercado", logo: "web/assets/logos/supermercado-coari.svg" },
    m11: { name: "Supermercado Veneza", color: "#AD1457", unit: "Supermercado", lat: -3.0850, lng: -60.0350, tier: "medio", tipo: "super", tierLabel: "Supermercado", logo: "web/assets/logos/supermercado-veneza-am.svg" },
    m12: { name: "Supermercados Vitória", color: "#EF6C00", unit: "Supermercado", lat: -3.0750, lng: -59.9950, tier: "medio", tipo: "super", tierLabel: "Supermercado", logo: "web/assets/logos/supermercado-vitoria-am.svg" },
    m13: { name: "Empório DB", color: "#B71C1C", unit: "Premium", lat: -3.1020, lng: -60.0110, tier: "medio", tipo: "premium", tierLabel: "Premium", logo: "web/assets/logos/emporio-db.svg" },
    m14: { name: "Mania Supermercados", color: "#00838F", unit: "Supermercado", lat: -3.0650, lng: -60.0450, tier: "medio", tipo: "super", tierLabel: "Supermercado", logo: "web/assets/logos/mania-supermercados.svg" },
    m15: { name: "Bom Preço Manaus", color: "#283593", unit: "Proximidade", lat: -3.1090, lng: -60.0160, tier: "pequeno", tipo: "proximidade", tierLabel: "Proximidade", logo: "web/assets/logos/supermercado-bom-preco-am.svg" }
  };`
);

// Garantir que os 15 mercados recebam cotações em todos os produtos
code = code.replace(
  /if \(!p\.prices\.sacolao_feira\) \{[\s\S]*?\}\n    \}\);/,
  `if (!p.prices.sacolao_feira) {
        p.prices.sacolao_feira = { price: +(minP * (isFresh ? 0.94 : (1.01 + (idx % 4) * 0.01))).toFixed(2), neighborhood: "Feira / Hortifruti" };
      }
      const extraSlots = ["m9", "m10", "m11", "m12", "m13", "m14", "m15"];
      extraSlots.forEach((slot, sIdx) => {
        if (!p.prices[slot]) {
          p.prices[slot] = {
            price: +(minP * (0.97 + ((idx + sIdx * 3) % 11) * 0.01)).toFixed(2),
            neighborhood: "Unidade Local"
          };
        }
      });
    });`
);

code = code.replace(
  /sacolao_feira: "Feira \/ Sacolão Local"\n    \};/,
  `sacolao_feira: "Feira / Sacolão Local",
      m9: "Unidade Local", m10: "Unidade Local", m11: "Unidade Local",
      m12: "Unidade Local", m13: "Unidade Premium", m14: "Unidade Local", m15: "Unidade Bairro"
    };`
);

code = code.replace(
  /sacolao_feira: isFresh \? \(0\.92 \+ \(seq % 5\) \* 0\.01\) : \(1\.01 \+ \(seq % 6\) \* 0\.01\)\n            \};/,
  `sacolao_feira: isFresh ? (0.92 + (seq % 5) * 0.01) : (1.01 + (seq % 6) * 0.01),
              m9: 0.97 + ((seq + 1) % 8) * 0.01,
              m10: 0.98 + ((seq + 2) % 8) * 0.01,
              m11: 0.99 + ((seq + 3) % 8) * 0.01,
              m12: 0.97 + ((seq + 4) % 9) * 0.01,
              m13: 1.04 + ((seq + 5) % 8) * 0.01,
              m14: 0.98 + ((seq + 6) % 7) * 0.01,
              m15: 1.01 + ((seq + 7) % 6) * 0.01
            };`
);

fs.writeFileSync(catalogPath, code, 'utf8');
console.log('✅ Sincronizados os 15 mercados por capital no manausCatalog.js!');
