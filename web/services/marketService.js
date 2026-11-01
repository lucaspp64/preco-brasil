/**
 * MarketService — Camada padronizada de acesso ao catálogo canônico (supermarkets.json)
 * Garante que o Agente Antigravity e o App PreçoBrasil consultem sempre os 15 maiores
 * supermercados de cada uma das 27 capitais brasileiras sem alucinar IDs ou logos.
 */
(function (root) {
  let database = { capitais: {} };

  // No Node.js, carrega diretamente o JSON do disco
  if (typeof require !== "undefined" && typeof window === "undefined") {
    try {
      database = require("../data/supermarkets.json");
    } catch (e) {
      console.warn("Aviso ao carregar supermarkets.json no Node:", e.message);
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

  // Retorna a URL da logo de um mercado pelo ID com fallback seguro
  function getMarketLogoUrl(marketId) {
    if (!marketId) return "web/assets/logos/default-market.svg";
    for (const capital of Object.values(database.capitais || {})) {
      const market = capital.mercados.find(m => m.id === marketId);
      if (market && market.logo) {
        return market.logo;
      }
    }
    return `web/assets/logos/${marketId}.svg`;
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
    root.getMarketLogoUrl = getMarketLogoUrl;
    root.getAvailableCapitals = getAvailableCapitals;
  }
})(typeof window !== "undefined" ? window : globalThis);
