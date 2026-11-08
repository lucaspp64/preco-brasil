/**
 * MarketService — Camada padronizada de acesso ao catálogo canônico (supermarkets.json)
 * Garante que o Agente Antigravity e o App PreçoBrasil consultem sempre os 15 maiores
 * supermercados de cada uma das 27 capitais brasileiras com domínio oficial e logo dinâmica (Clearbit + Fallback).
 */
(function (root) {
  let database = { capitais: {} };

  const KNOWN_DOMAINS = {
    "carrefour": "carrefour.com.br",
    "pao-de-acucar": "paodeacucar.com.br",
    "atacadao": "atacadao.com.br",
    "assai": "assai.com.br",
    "sonda": "sonda.com.br",
    "mambo": "mambo.com.br",
    "st-marche": "marche.com.br",
    "dia": "dia.com.br",
    "nagumo": "nagumo.com.br",
    "davo": "davo.com.br",
    "hirota": "hirota.com.br",
    "pastorinho": "pastorinho.com.br",
    "lopes": "supermercadoslopes.com.br",
    "natural-da-terra": "naturaldaterra.com.br",
    "akki-atacadista": "akkiatacadista.com.br",
    "guanabara": "supermercadosguanabara.com.br",
    "mundial": "supermercadosmundial.com.br",
    "zona-sul": "zonasul.com.br",
    "prezunic": "prezunic.com.br",
    "supermarket": "redesupermarket.com.br",
    "princesa": "supermercadosprincesa.com.br",
    "supermercados-bh": "supermercadosbh.com.br",
    "epa": "epa.com.br",
    "verdemar": "verdemar.com.br",
    "super-nosso": "supernosso.com.br",
    "mart-minas": "martminas.com.br",
    "apoio-mineiro": "apoiomineiro.com.br",
    "condor": "condor.com.br",
    "super-muffato": "muffato.com.br",
    "muffato": "muffato.com.br",
    "festval": "festval.com.br",
    "jacomar": "jacomar.com.br",
    "angeloni": "angeloni.com.br",
    "bistek": "bistek.com.br",
    "giassi": "giassi.com.br",
    "imperatriz": "superimperatriz.com.br",
    "koch-supermercados": "superkoch.com.br",
    "zaffari": "zaffari.com.br",
    "bourbon": "bourbon.com.br",
    "asun": "asun.com.br",
    "stok-center": "stokcenter.com.br",
    "nacional": "nacional.com.br",
    "mix-mateus": "grupomateus.com.br",
    "mateus": "grupomateus.com.br",
    "hiper-mateus": "grupomateus.com.br",
    "camino-supermercados": "grupomateus.com.br",
    "comper": "comper.com.br",
    "fort-atacadista": "fortatacadista.com.br",
    "big-box": "bigbox.com.br",
    "oba-hortifruti": "obahortifruti.com.br",
    "super-adega": "superadega.com.br",
    "tatico": "tatico.com.br",
    "bretas": "bretas.com.br",
    "db-supermercados": "dbsupermercados.com.br",
    "db": "dbsupermercados.com.br",
    "emporio-db": "dbsupermercados.com.br",
    "nova-era": "supernovaera.com.br",
    "nova_era": "supernovaera.com.br",
    "baratao-da-carne": "barataodacarne.com.br",
    "baratao": "barataodacarne.com.br",
    "atack": "atack.com.br",
    "rodrigues": "supermercadosrodrigues.com.br",
    "coema": "coema.com.br",
    "veneza": "supermercadosveneza.com.br",
    "lider": "lidernet.com.br",
    "formosa": "formosa.com.br",
    "precomais": "mateusmais.com.br",
    "sao-luiz": "mercadinhossaoluiz.com.br",
    "frangolandia": "frangolandia.com.br",
    "pinheiro": "supermercadopinheiro.com.br",
    "cometa": "cometasupermercados.com.br",
    "nordestao": "nordestao.com.br",
    "favorito": "supermercadofavorito.com.br",
    "extrabom": "extrabom.com.br",
    "perim": "perim.com.br",
    "carone": "carone.com.br",
    "sempre-tem": "sempretem.com.br",
    "gbarbosa": "gbarbosa.com.br",
    "g-barbosa": "gbarbosa.com.br",
    "hiperideal": "hiperideal.com.br",
    "redemix": "redemix.com.br",
    "atack-salvador": "atack.com.br",
    "rede-compras": "redecompras.com.br",
    "palato": "palato.com.br",
    "unicompra": "unicompra.com.br",
    "atakarejo": "atakarejo.com.br"
  };

  function deduceMarketDomain(id, nome) {
    if (KNOWN_DOMAINS[id]) return KNOWN_DOMAINS[id];
    for (const [k, dom] of Object.entries(KNOWN_DOMAINS)) {
      if (String(id || "").includes(k)) return dom;
    }
    const clean = String(id || nome || "mercado")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/-(am|rr|pa|ap|to|ro|ac|ma|pi|ce|rn|pb|pe|al|se|ba|mg|es|rj|sp|pr|sc|rs|ms|mt|go|df)$/i, "")
      .replace(/[^a-z0-9]/g, "");
    return `${clean || "supermercado"}.com.br`;
  }

  function getMarketInitials(nome) {
    const stop = new Set(["de", "da", "do", "das", "dos", "e", "supermercado", "supermercados", "rede", "grupo", "hiper", "super"]);
    const words = String(nome || "SM")
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .trim()
      .split(/\s+/)
      .filter(w => w.length > 0);
    const meaningful = words.filter(w => !stop.has(w.toLowerCase()));
    const pool = meaningful.length > 0 ? meaningful : words;
    if (pool.length >= 2) {
      return (pool[0][0] + pool[1][0]).toUpperCase();
    }
    return pool[0].slice(0, 2).toUpperCase();
  }

  // No Node.js, carrega diretamente o JSON do disco (ou do catálogo unificado em memória)
  if (typeof require !== "undefined" && typeof window === "undefined") {
    try {
      database = require("../data/supermarkets.json");
    } catch (e) {
      try {
        const cat = require("../data/manausCatalog");
        if (cat && cat.SUPERMARKETS_CANONICAL_DB) {
          database = cat.SUPERMARKETS_CANONICAL_DB;
        }
      } catch (_) {}
    }
  }

  // Mapa rápido de alias (ex: "sao_paulo" -> "SP-SaoPaulo", "SP-SaoPaulo" -> "SP-SaoPaulo")
  function resolveCapitalKey(keyOrAlias) {
    if (!keyOrAlias) return "AM-Manaus";
    if (database.capitais && database.capitais[keyOrAlias]) return keyOrAlias;
    for (const [capKey, capObj] of Object.entries(database.capitais || {})) {
      if (
        capObj.legacyId === keyOrAlias ||
        capObj.uf.toLowerCase() === String(keyOrAlias).toLowerCase() ||
        capKey.toLowerCase() === String(keyOrAlias).toLowerCase()
      ) {
        return capKey;
      }
    }
    return keyOrAlias;
  }

  // Retorna todos os 15 mercados de uma capital específica (ex: "SP-SaoPaulo" ou "sao_paulo")
  function getMarketsByCapital(capitalKey) {
    const resolved = resolveCapitalKey(capitalKey);
    const capital = database.capitais && database.capitais[resolved];
    return capital ? capital.mercados : [];
  }

  // Retorna os metadados completos da capital
  function getCapitalInfo(capitalKey) {
    const resolved = resolveCapitalKey(capitalKey);
    return (database.capitais && database.capitais[resolved]) || null;
  }

  // Retorna o domínio oficial ou deduzido de um supermercado pelo ID
  function getMarketDomain(marketId) {
    if (!marketId) return "supermercado.com.br";
    for (const capital of Object.values(database.capitais || {})) {
      const market = capital.mercados.find(m => m.id === marketId);
      if (market && market.domain) {
        return market.domain;
      }
    }
    return deduceMarketDomain(marketId, marketId);
  }

  // Retorna a URL dinâmica da logo via API Clearbit (https://logo.clearbit.com/{dominio})
  const OFFICIAL_LOCAL_LOGOS = {"atacadao":"web/assets/logos/atacadao.svg","assai":"web/assets/logos/assai.svg","carrefour":"web/assets/logos/carrefour.svg","nova-era":"web/assets/logos/nova-era.svg","nova_era":"web/assets/logos/nova_era.svg","pao-de-acucar":"web/assets/logos/pao-de-acucar.svg","pao_acucar":"web/assets/logos/pao_acucar.svg","mateus":"web/assets/logos/mateus.svg","mix-mateus":"web/assets/logos/mix-mateus.svg","supermercado-mateus":"web/assets/logos/supermercado-mateus.svg","muffato":"web/assets/logos/muffato.svg","super-muffato":"web/assets/logos/muffato.svg"};

  function getMarketLogoUrl(marketId) {
    if (!marketId) return "web/assets/logos/default-market.svg";
    if (OFFICIAL_LOCAL_LOGOS[marketId]) return OFFICIAL_LOCAL_LOGOS[marketId];
    for (const capital of Object.values(database.capitais || {})) {
      const market = capital.mercados.find(m => m.id === marketId);
      if (market && market.logo) {
        return market.logo;
      }
    }
    const dom = deduceMarketDomain(marketId, marketId);
    return `https://www.google.com/s2/favicons?domain=${dom}&sz=128`;
  }

  // Retorna todas as 27 capitais disponíveis
  function getAvailableCapitals() {
    return Object.entries(database.capitais || {}).map(([key, data]) => ({
      key,
      legacyId: data.legacyId,
      cidade: data.cidade,
      uf: data.uf,
      regiao: data.regiao,
      totalMercados: data.mercados.length
    }));
  }

  // Inicializa o banco no navegador via fetch ou objeto injetado
  async function initBrowserDatabase() {
    if (typeof window === "undefined") return database;
    try {
      const res = await fetch("web/data/supermarkets.json");
      if (res.ok) {
        database = await res.json();
        window.SUPERMARKETS_CANONICAL_DB = database;
      }
    } catch (e) {
      console.warn("Usando catálogo em memória:", e.message);
    }
    return database;
  }

  function setDatabase(dbObj) {
    if (dbObj && dbObj.capitais) {
      database = dbObj;
    }
  }

  const MarketService = {
    resolveCapitalKey,
    getMarketsByCapital,
    getCapitalInfo,
    deduceMarketDomain,
    getMarketDomain,
    getMarketInitials,
    getMarketLogoUrl,
    getAvailableCapitals,
    initBrowserDatabase,
    setDatabase
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = MarketService;
  }
  if (root) {
    root.MarketService = MarketService;
    root.getMarketsByCapital = getMarketsByCapital;
    root.getMarketDomain = getMarketDomain;
    root.getMarketInitials = getMarketInitials;
    root.getMarketLogoUrl = getMarketLogoUrl;
    root.getAvailableCapitals = getAvailableCapitals;
  }
})(typeof window !== "undefined" ? window : globalThis);
