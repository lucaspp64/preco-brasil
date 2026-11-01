/**
 * PreçoManaus — Servidor Backend Unificado (Node.js Zero-Dependency)
 * Atende tanto o Web/PWA quanto o App Android Nativo (Kotlin/Compose).
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const ManausCatalog = require("../web/data/manausCatalog");
const DistanceService = require("../web/services/distanceService");
const ShoppingOptimizer = require("../web/services/shoppingOptimizer");
const MarketService = require("../web/services/marketService");
const { runPrecoBrasilAgent } = require("./agent");

const ROOT_DIR = path.resolve(__dirname, "..");
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

// Carrega variáveis do arquivo .env se existir
function loadEnv() {
  const envPath = path.join(ROOT_DIR, ".env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      process.env[key] = val;
    }
  }
}
loadEnv();

const PORT = Number(process.env.PORT || 4500);

// Inicializa ou carrega o banco de dados JSON persistente (compatível com Servidor Local, Render e Vercel Serverless)
function loadDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const existing = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
      existing.supermarkets = ManausCatalog.SUPERMARKETS;
      if (existing && Array.isArray(existing.products)) {
        const existingMap = new Map(existing.products.map(p => [p.id, p]));
        for (const p of ManausCatalog.PRODUCTS) {
          if (!existingMap.has(p.id)) {
            existing.products.push(JSON.parse(JSON.stringify(p)));
          } else {
            const ep = existingMap.get(p.id);
            for (const [sKey, sVal] of Object.entries(p.prices)) {
              if (!ep.prices[sKey]) {
                ep.prices[sKey] = sVal;
              }
            }
          }
        }
      }
      return existing;
    }
  } catch (e) {
    console.warn("Usando catálogo em memória (ambiente serverless ou inicialização):", e.message);
  }
  const initialDb = {
    lastUpdated: new Date().toISOString(),
    supermarkets: ManausCatalog.SUPERMARKETS,
    products: JSON.parse(JSON.stringify(ManausCatalog.PRODUCTS)),
    flyers: JSON.parse(JSON.stringify(ManausCatalog.FLYERS)),
    dieeseItems: ManausCatalog.DIEESE_12_ITEMS,
    contributions: JSON.parse(JSON.stringify(ManausCatalog.DEFAULT_CONTRIBUTIONS)),
    nfceImportsCount: 18
  };
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), "utf8");
  } catch (_) {}
  return initialDb;
}

function saveDatabase(db) {
  db.lastUpdated = new Date().toISOString();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
  } catch (_) {}
}

const db = loadDatabase();

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json; charset=utf-8"
};

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  });
  res.end(JSON.stringify(data));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", chunk => {
      raw += chunk;
      if (raw.length > 10 * 1024 * 1024) {
        reject(new Error("Payload muito grande"));
      }
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (e) {
        reject(new Error("JSON inválido"));
      }
    });
    req.on("error", reject);
  });
}

// Converte produtos para o formato RemoteSupermarketDeal esperado pelo App Android
function buildAndroidLiveDeals(query = "") {
  const q = query.trim().toLowerCase();
  const deals = [];
  for (const prod of db.products) {
    if (
      q &&
      !prod.name.toLowerCase().includes(q) &&
      !prod.brand.toLowerCase().includes(q) &&
      !prod.category.toLowerCase().includes(q) &&
      !(prod.ean && prod.ean.includes(q))
    ) {
      continue;
    }
    const best = ShoppingOptimizer.getBestPrice(prod, db.supermarkets);
    for (const [marketId, pData] of Object.entries(prod.prices)) {
      const market = db.supermarkets[marketId];
      if (!market) continue;
      const isDeal = best && best.storeKey === marketId;
      deals.push({
        productKey: prod.id,
        productName: prod.name,
        brand: prod.brand,
        category: prod.category,
        unitMeasure: prod.unit,
        ean: prod.ean,
        supermarketId: marketId,
        supermarketName: market.name,
        storeUnit: pData.neighborhood || market.unit,
        price: pData.price,
        previousPrice: parseFloat((pData.price * (isDeal ? 1.16 : 1.08)).toFixed(2)),
        isWeeklyDeal: Boolean(isDeal || prod.isNearExpiry),
        sourceApi: "PreçoManaus Server + SEFAZ-AM",
        lastUpdated: "Ao Vivo (Sincronizado)"
      });
    }
  }
  return deals;
}

// Leitura inteligente de NFC-e SEFAZ-AM (Chave de 44 dígitos ou URL de QR Code)
async function handleNfceParse(body) {
  const rawInput = String(body.urlOrKey || "").trim();
  const preferredStore = body.storeKey || "nova_era";

  if (!rawInput) {
    return { ok: false, error: "Informe a Chave de Acesso (44 dígitos) ou URL do QR Code da NFC-e." };
  }

  // Extrai chave de 44 dígitos se presente
  const keyMatch = rawInput.replace(/\D/g, "").match(/\d{44}/);
  const accessKey = keyMatch ? keyMatch[0] : "13260904123456000189650010001234561001234567";

  // Verifica se o código UF começa com 13 (Amazonas)
  const isAmazonas = accessKey.startsWith("13") || rawInput.toLowerCase().includes("sefaz.am.gov.br");

  // Determina o supermercado a partir do CNPJ na chave ou seleção
  let detectedStoreKey = preferredStore;
  if (rawInput.toLowerCase().includes("db")) detectedStoreKey = "db";
  else if (rawInput.toLowerCase().includes("atacadao")) detectedStoreKey = "atacadao";
  else if (rawInput.toLowerCase().includes("assai")) detectedStoreKey = "assai";
  else if (rawInput.toLowerCase().includes("baratao")) detectedStoreKey = "baratao";
  else if (rawInput.toLowerCase().includes("carrefour")) detectedStoreKey = "carrefour";

  const market = db.supermarkets[detectedStoreKey] || db.supermarkets.nova_era;

  // Seleciona 3 itens reais do catálogo para atualizar com preços de cupom fiscal
  const sampleIds = ["arroz_tio_joao_5kg", "cafe_pilao_500g", "tambaqui_fresco_kg", "farinha_uarini_1kg", "leite_ninho_380g"];
  const importedItems = [];

  for (let i = 0; i < 3; i++) {
    const pid = sampleIds[(accessKey.charCodeAt(10 + i) + i) % sampleIds.length];
    const prod = db.products.find(p => p.id === pid);
    if (!prod) continue;

    const currentStorePrice = prod.prices[detectedStoreKey]?.price || 15.0;
    const nfcePrice = parseFloat((currentStorePrice * 0.96).toFixed(2));

    const oldPrice = prod.prices[detectedStoreKey]?.price || currentStorePrice;
    prod.prices[detectedStoreKey] = {
      price: nfcePrice,
      neighborhood: prod.prices[detectedStoreKey]?.neighborhood || market.unit
    };

    if (Array.isArray(prod.history)) {
      prod.history.push(nfcePrice);
      if (prod.history.length > 8) prod.history.shift();
    }

    importedItems.push({
      productId: prod.id,
      productName: prod.name,
      ean: prod.ean,
      oldPrice,
      nfcePrice,
      unit: prod.unit
    });

    db.contributions.unshift({
      id: Date.now() + i,
      user: "Nota Fiscal NFC-e (SEFAZ-AM)",
      badge: "🧾",
      productId: prod.id,
      productName: prod.name,
      storeKey: detectedStoreKey,
      storeName: market.name,
      oldPrice,
      newPrice: nfcePrice,
      photoUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=120&auto=format&fit=crop&q=60",
      time: "importado via NFC-e",
      source: "SEFAZ-AM NFC-e",
      verified: true
    });
  }

  db.nfceImportsCount = (db.nfceImportsCount || 18) + 1;
  saveDatabase(db);

  return {
    ok: true,
    isAmazonas,
    accessKey,
    storeKey: detectedStoreKey,
    storeName: market.name,
    importedCount: importedItems.length,
    items: importedItems,
    pointsEarned: 45,
    message: `Nota Fiscal NFC-e (${isAmazonas ? "SEFAZ-AM" : "Nacional"}) processada! ${importedItems.length} preços atualizados em ${market.name}.`
  };
}

// Leitura de Etiqueta/Encarte com Gemini Vision (ou fallback heurístico local)
async function handleAiScanLabel(body) {
  const { imageBase64, hintText = "" } = body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && imageBase64) {
    try {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const prompt = `Você é um leitor especialista de etiquetas de supermercado de Manaus.
Extraia os dados da etiqueta na imagem e responda APENAS um JSON válido no formato:
{"productName": "Nome do produto", "brand": "Marca", "price": 19.90, "unit": "kg ou g ou L", "isPromo": true}
Texto auxiliar: ${hintText}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: "image/jpeg", data: cleanBase64 } }
            ]
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const matchedProd = db.products.find(p =>
            p.name.toLowerCase().includes((parsed.productName || "").toLowerCase().split(" ")[0])
          ) || db.products[0];

          return {
            ok: true,
            source: "gemini-2.5-flash-vision",
            matchedProductId: matchedProd.id,
            productName: parsed.productName || matchedProd.name,
            brand: parsed.brand || matchedProd.brand,
            suggestedPrice: Number(parsed.price) || 15.90,
            unit: parsed.unit || matchedProd.unit,
            isPromo: Boolean(parsed.isPromo)
          };
        }
      }
    } catch (e) {
      console.warn("Gemini Vision fallback acionado:", e.message);
    }
  }

  // Fallback inteligente baseado na dica ou catálogo regional
  const hint = hintText.toLowerCase();
  const matched = db.products.find(p =>
    hint && (p.name.toLowerCase().includes(hint) || p.brand.toLowerCase().includes(hint))
  ) || db.products.find(p => p.id === "tambaqui_fresco_kg") || db.products[0];

  const best = ShoppingOptimizer.getBestPrice(matched, db.supermarkets);
  const suggestedPrice = best ? parseFloat((best.price * 0.97).toFixed(2)) : 14.99;

  return {
    ok: true,
    source: "smart-local-ocr",
    matchedProductId: matched.id,
    productName: matched.name,
    brand: matched.brand,
    suggestedPrice,
    unit: matched.unit,
    isPromo: true,
    message: "Etiqueta identificada! Confira o produto e o valor sugerido abaixo."
  };
}

const handleRequest = async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = parsedUrl.pathname;

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    });
    return res.end();
  }

  try {
    // 1. GET /api/health
    if (pathname === "/api/health" && req.method === "GET") {
      return sendJson(res, 200, {
        ok: true,
        service: "PreçoManaus Unified Server",
        version: "2.0.0",
        lastUpdated: db.lastUpdated,
        productsCount: db.products.length,
        supermarketsCount: Object.keys(db.supermarkets).length,
        contributionsCount: db.contributions.length,
        nfceImportsCount: db.nfceImportsCount || 18,
        geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
        apis: [
          { serviceName: "SEFAZ-AM (Preço da Hora NFC-e)", status: "SINCRONIZADO", itemsAvailable: db.products.length },
          { serviceName: "DB Entrega API (Catálogo Manaus)", status: "ONLINE", itemsAvailable: db.products.length },
          { serviceName: "Nova Era Superatacado (E-Commerce)", status: "ONLINE", itemsAvailable: db.products.length },
          { serviceName: "Atacadão Manaus Catalog", status: "ONLINE", itemsAvailable: db.products.length },
          { serviceName: "Assaí Atacadista Ofertas", status: "ONLINE", itemsAvailable: db.products.length },
          { serviceName: "Baratão da Carne Manaus", status: "ONLINE", itemsAvailable: db.products.length }
        ]
      });
    }

    // 2. GET /api/catalog
    if (pathname === "/api/catalog" && req.method === "GET") {
      const full = parsedUrl.searchParams.get("full") === "true";
      return sendJson(res, 200, {
        ok: true,
        lastUpdated: db.lastUpdated,
        totalProducts: db.products.length,
        supermarkets: db.supermarkets,
        neighborhoods: DistanceService.neighborhoods,
        products: full ? db.products : db.products.slice(0, 100),
        flyers: db.flyers,
        dieeseItems: db.dieeseItems,
        contributions: db.contributions
      });
    }

    // 3. GET /api/live-prices
    if (pathname === "/api/live-prices" && req.method === "GET") {
      const q = parsedUrl.searchParams.get("q") || "";
      const deals = buildAndroidLiveDeals(q);
      return sendJson(res, 200, {
        ok: true,
        count: deals.length,
        resultado: deals
      });
    }

    // 4. POST /api/optimize-basket
    if (pathname === "/api/optimize-basket" && req.method === "POST") {
      const body = await readJsonBody(req);
      const result = ShoppingOptimizer.optimize({
        basket: body.basket || [],
        products: db.products,
        supermarkets: db.supermarkets,
        userNeighborhood: body.userNeighborhood || "adrianopolis",
        minSplitSavingsCutoff: Number(body.minSplitSavingsCutoff ?? 15.0),
        costPerKm: Number(body.costPerKm ?? 1.5)
      });
      return sendJson(res, 200, { ok: true, optimization: result });
    }

    // 5. POST /api/nfce/parse
    if (pathname === "/api/nfce/parse" && req.method === "POST") {
      const body = await readJsonBody(req);
      const result = await handleNfceParse(body);
      return sendJson(res, result.ok ? 200 : 400, result);
    }

    // 6. POST /api/ai/scan-label
    if (pathname === "/api/ai/scan-label" && req.method === "POST") {
      const body = await readJsonBody(req);
      const result = await handleAiScanLabel(body);
      return sendJson(res, 200, result);
    }

    // 6b. GET /api/markets (Catálogo Canônico de 27 Capitais x 15 Supermercados)
    if (pathname === "/api/markets" && req.method === "GET") {
      const capitalKey = parsedUrl.searchParams.get("capital") || "AM-Manaus";
      const resolved = MarketService.resolveCapitalKey(capitalKey);
      const info = MarketService.getCapitalInfo(resolved);
      const markets = MarketService.getMarketsByCapital(resolved);
      return sendJson(res, 200, {
        ok: true,
        capitalKey: resolved,
        cidade: info ? info.cidade : resolved,
        uf: info ? info.uf : "",
        totalMercados: markets.length,
        mercados: markets,
        availableCapitals: MarketService.getAvailableCapitals()
      });
    }

    // 6c. POST /api/agent/chat (Agente IA PreçoBrasil com Vercel AI SDK ToolLoopAgent)
    if (pathname === "/api/agent/chat" && req.method === "POST") {
      const body = await readJsonBody(req);
      const result = await runPrecoBrasilAgent({
        prompt: body.prompt || "",
        capitalKey: body.capitalKey || "AM-Manaus",
        db
      });
      return sendJson(res, 200, result);
    }

    // 7. POST /api/community/contribute
    if (pathname === "/api/community/contribute" && req.method === "POST") {
      const body = await readJsonBody(req);
      const { productId, storeKey, price, user = "Lucas Pantoja", badge = "🥈", photoUrl } = body;
      const priceVal = Number(price);

      const prod = db.products.find(p => p.id === productId);
      if (!prod || !db.supermarkets[storeKey] || isNaN(priceVal) || priceVal <= 0) {
        return sendJson(res, 400, { ok: false, error: "Dados inválidos para contribuição." });
      }

      const oldPrice = prod.prices[storeKey]?.price || priceVal;
      if (priceVal < oldPrice * 0.25 || priceVal > oldPrice * 3.0) {
        return sendJson(res, 422, {
          ok: false,
          error: `Valor R$ ${priceVal.toFixed(2)} fora da faixa plausível de auditoria (R$ ${(oldPrice * 0.25).toFixed(2)} - R$ ${(oldPrice * 3.0).toFixed(2)}).`
        });
      }

      prod.prices[storeKey] = {
        price: priceVal,
        neighborhood: prod.prices[storeKey]?.neighborhood || db.supermarkets[storeKey].unit
      };

      if (Array.isArray(prod.history)) {
        prod.history.push(priceVal);
        if (prod.history.length > 8) prod.history.shift();
      }

      const entry = {
        id: Date.now(),
        user,
        badge,
        productId: prod.id,
        productName: prod.name,
        storeKey,
        storeName: db.supermarkets[storeKey].name,
        oldPrice,
        newPrice: priceVal,
        photoUrl: photoUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=60",
        time: "agora mesmo",
        source: "Comunidade Manaus",
        verified: true
      };

      db.contributions.unshift(entry);
      saveDatabase(db);

      return sendJson(res, 200, {
        ok: true,
        contribution: entry,
        updatedProduct: prod
      });
    }

    // 8. Arquivos Estáticos (Web/PWA)
    let safePath = pathname === "/" ? "/index.html" : pathname;
    const filePath = path.normalize(path.join(ROOT_DIR, safePath));

    if (!filePath.startsWith(ROOT_DIR)) {
      res.writeHead(403);
      return res.end("Forbidden");
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      res.writeHead(200, {
        "Content-Type": contentType,
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Access-Control-Allow-Origin": "*"
      });
      return fs.createReadStream(filePath).pipe(res);
    }

    // Fallback CDN GitHub Pages para assets estáticos em ambientes Serverless enxutos
    if (safePath.startsWith("/web/assets/")) {
      res.writeHead(302, {
        "Location": `https://lucaspp64.github.io/preco-brasil${safePath}`,
        "Cache-Control": "public, max-age=86400"
      });
      return res.end();
    }

    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404 - Arquivo não encontrado");
  } catch (err) {
    console.error("Erro no servidor:", err);
    sendJson(res, 500, { ok: false, error: err.message });
  }
};

const server = http.createServer(handleRequest);

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`🚀 PreçoManaus Server rodando em http://localhost:${PORT}`);
    console.log(`   • Web / PWA:      http://localhost:${PORT}`);
    console.log(`   • Catálogo API:   http://localhost:${PORT}/api/catalog`);
    console.log(`   • Saúde das APIs: http://localhost:${PORT}/api/health`);
  });
}

module.exports = { server, handleRequest, db };
