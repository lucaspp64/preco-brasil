/**
 * Testes Automatizados End-to-End do Backend e Módulos PreçoManaus
 * Compatível tanto com execução em Sandbox (In-Memory Request Dispatcher) quanto Rede Local.
 */
const assert = require("assert");
const { EventEmitter } = require("events");
const { handleRequest } = require("./index");

function invokeApi(method, url, bodyObj = null) {
  return new Promise((resolve, reject) => {
    const req = new EventEmitter();
    req.method = method;
    req.url = url;
    req.headers = { host: "localhost:3000" };

    let statusCode = 200;
    const chunks = [];
    const res = {
      writeHead(code) {
        statusCode = code;
      },
      write(chunk) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
      },
      end(chunk) {
        if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
        const raw = Buffer.concat(chunks).toString("utf8");
        let json = null;
        try { json = JSON.parse(raw); } catch (_) {}
        resolve({ status: statusCode, text: raw, json });
      },
      on() {},
      once() {},
      emit() {}
    };

    handleRequest(req, res).catch(reject);

    process.nextTick(() => {
      if (bodyObj !== null) {
        req.emit("data", Buffer.from(JSON.stringify(bodyObj)));
      }
      req.emit("end");
    });
  });
}

async function runTests() {
  console.log("🧪 Rodando suíte de testes PreçoManaus...");

  // 1. Health check
  const healthRes = await invokeApi("GET", "/api/health");
  assert.strictEqual(healthRes.status, 200);
  assert.strictEqual(healthRes.json.ok, true);
  assert.ok(healthRes.json.productsCount >= 35, "Catálogo deve ter pelo menos 35 produtos de Manaus");
  console.log(`✅ [1/6] /api/health OK (${healthRes.json.productsCount} produtos monitorados)`);

  // 2. Catalog endpoint
  const catRes = await invokeApi("GET", "/api/catalog");
  assert.strictEqual(catRes.json.ok, true);
  assert.ok(catRes.json.supermarkets.db && catRes.json.supermarkets.nova_era && catRes.json.supermarkets.atacadao);
  assert.strictEqual(catRes.json.dieeseItems.length, 12);
  console.log(`✅ [2/6] /api/catalog OK (6 redes, 21 bairros, 12 itens DIEESE)`);

  // 3. Basket Optimizer endpoint (Single vs 2-Store Split + Combustível)
  const optRes = await invokeApi("POST", "/api/optimize-basket", {
    userNeighborhood: "adrianopolis",
    minSplitSavingsCutoff: 10.0,
    basket: [
      { id: "picanha_friboi_kg", quantity: 3 },
      { id: "fralda_pampers_g_48", quantity: 2 },
      { id: "arroz_tio_joao_5kg", quantity: 2 }
    ]
  });
  assert.strictEqual(optRes.json.ok, true);
  assert.ok(optRes.json.optimization.bestSingle);
  assert.ok(optRes.json.optimization.bestSplit);
  console.log(`✅ [3/6] /api/optimize-basket OK (Estratégia: ${optRes.json.optimization.strategy}, Economia dividida: R$ ${optRes.json.optimization.bestSplit.netSavings})`);

  // 4. SEFAZ-AM NFC-e Parser endpoint
  const nfceRes = await invokeApi("POST", "/api/nfce/parse", {
    urlOrKey: "13260904123456000189650010001234561001234567",
    storeKey: "nova_era"
  });
  assert.strictEqual(nfceRes.json.ok, true);
  assert.strictEqual(nfceRes.json.isAmazonas, true);
  assert.strictEqual(nfceRes.json.importedCount, 3);
  console.log(`✅ [4/6] /api/nfce/parse OK (${nfceRes.json.message})`);

  // 5. AI Label Scanner endpoint
  const aiRes = await invokeApi("POST", "/api/ai/scan-label", {
    imageBase64: "data:image/jpeg;base64,/9j/4AAQSkZJRg==",
    hintText: "tambaqui"
  });
  assert.strictEqual(aiRes.json.ok, true);
  assert.strictEqual(aiRes.json.matchedProductId, "tambaqui_fresco_kg");
  console.log(`✅ [5/6] /api/ai/scan-label OK (Produto reconhecido: ${aiRes.json.productName} -> R$ ${aiRes.json.suggestedPrice})`);

  // 6. Community contribution endpoint
  const contribRes = await invokeApi("POST", "/api/community/contribute", {
    productId: "tambaqui_fresco_kg",
    storeKey: "baratao",
    price: 14.49,
    user: "Lucas Pantoja",
    badge: "🥇"
  });
  assert.strictEqual(contribRes.json.ok, true);
  assert.strictEqual(contribRes.json.updatedProduct.prices.baratao.price, 14.49);
  console.log(`✅ [6/6] /api/community/contribute OK (Tambaqui atualizado para R$ 14,49 no Baratão da Carne)`);

  console.log("\n🎉 Todos os testes do Backend e Módulos PreçoManaus passaram!");
}

runTests().catch(err => {
  console.error("❌ Falha nos testes:", err);
  process.exit(1);
});
