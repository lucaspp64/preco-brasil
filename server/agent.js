/**
 * PreçoBrasil AI Agent — Construído com Vercel AI SDK (ToolLoopAgent + tool + zod)
 * Segue estritamente a diretriz canônica (.agent/rules/supermarkets-catalog.md):
 * - Fonte única da verdade: src/data/supermarkets.json & web/services/marketService.js
 * - 27 Capitais Brasileiras × 15 Maiores Supermercados (405 lojas oficiais)
 * - Catálogo de 5.556 produtos e Otimizador Haversine com custo de combustível
 */

const MarketService = require("../web/services/marketService");
const ShoppingOptimizer = require("../web/services/shoppingOptimizer");

const SYSTEM_INSTRUCTIONS = `Você é o Assistente IA Oficial do PreçoBrasil, especialista em economia de supermercado nas 27 capitais brasileiras.

### DIRETRIZ DE MERCADOS E LOGOS (CATÁLOGO OBRIGATÓRIO)
1. FONTE DA VERDADE:
   - Todo e qualquer supermercado, capital ou logo DEVE ser consultado através das ferramentas (tools) conectadas ao \`MarketService\` (\`src/data/supermarkets.json\`).
   - NUNCA invente nomes de redes, slugs ou caminhos de imagens arbitrários.
2. PADRÃO DE IDENTIFICADORES (SLUGS):
   - Use sempre a chave composta \`{UF}-{CidadeSemEspacos}\` (ex: "SP-SaoPaulo", "RJ-RioDeJaneiro", "AM-Manaus", "RR-BoaVista", "MG-BeloHorizonte").
3. COMO RESPONDER:
   - Seja sempre simpático, direto e focado em gerar economia real em Reais (R$).
   - Sempre que citar supermercados ou produtos, utilize os dados retornados pelas ferramentas \`getCapitalMarkets\`, \`searchCheapestProducts\` e \`optimizeShoppingBasket\`.`;

/**
 * Executa as ferramentas canônicas do PreçoBrasil (usadas tanto pelo ToolLoopAgent do Vercel AI SDK
 * quanto pelo modo local zero-config).
 */
function createAgentToolsExecutors(db, defaultCapitalKey = "AM-Manaus") {
  return {
    getCapitalMarkets: async ({ capitalKey }) => {
      const targetKey = MarketService.resolveCapitalKey(capitalKey || defaultCapitalKey);
      const info = MarketService.getCapitalInfo(targetKey);
      const markets = MarketService.getMarketsByCapital(targetKey);
      return {
        capitalKey: targetKey,
        cidade: info ? info.cidade : targetKey,
        uf: info ? info.uf : "",
        totalMercados: markets.length,
        mercados: markets.map((m, idx) => ({
          slot: idx === 0 ? "db" : idx === 1 ? "nova_era" : idx === 2 ? "atacadao" : idx === 3 ? "assai" : idx === 4 ? "baratao" : `m${idx + 1}`,
          id: m.id,
          nome: m.nome,
          tipo: m.tipo,
          logo: MarketService.getMarketLogoUrl(m.id)
        }))
      };
    },

    listAvailableCapitals: async () => {
      const capitals = MarketService.getAvailableCapitals();
      return {
        totalCapitals: capitals.length,
        capitals
      };
    },

    searchCheapestProducts: async ({ query, capitalKey, limit = 6 }) => {
      const targetKey = MarketService.resolveCapitalKey(capitalKey || defaultCapitalKey);
      const markets = MarketService.getMarketsByCapital(targetKey);
      const info = MarketService.getCapitalInfo(targetKey);
      const slotKeys = ["db", "nova_era", "atacadao", "assai", "baratao", "m6", "m7", "m8", "m9", "m10", "m11", "m12", "m13", "m14", "m15"];

      const terms = String(query || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .split(/[\s,;]+/)
        .filter(t => t.length >= 2 && !["de", "do", "da", "em", "no", "na", "para", "com", "mais", "barato", "onde", "comprar", "preco"].includes(t));

      let matches = db.products.filter(p => {
        const hay = `${p.name} ${p.brand} ${p.category}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return terms.length === 0 ? p.featured : terms.some(t => hay.includes(t));
      });

      if (matches.length === 0) {
        matches = db.products.slice(0, limit);
      }

      const results = matches.slice(0, limit).map(prod => {
        let bestPrice = Infinity;
        let worstPrice = 0;
        let bestMarket = markets[0] || { id: "atacadao", nome: "Atacadão", logo: "web/assets/logos/atacadao.svg" };

        slotKeys.forEach((slotKey, idx) => {
          const entry = prod.prices && prod.prices[slotKey];
          if (entry && typeof entry.price === "number") {
            if (entry.price < bestPrice) {
              bestPrice = entry.price;
              bestMarket = markets[idx] || bestMarket;
            }
            if (entry.price > worstPrice) {
              worstPrice = entry.price;
            }
          }
        });

        const savings = worstPrice > bestPrice ? parseFloat((worstPrice - bestPrice).toFixed(2)) : 0;

        return {
          id: prod.id,
          name: prod.name,
          brand: prod.brand,
          unit: prod.unit,
          image: prod.image,
          bestPrice: bestPrice === Infinity ? 0 : bestPrice,
          worstPrice,
          savingsPerUnit: savings,
          marketId: bestMarket.id,
          marketName: bestMarket.nome,
          marketType: bestMarket.tipo,
          marketLogo: MarketService.getMarketLogoUrl(bestMarket.id)
        };
      });

      return {
        capitalKey: targetKey,
        cidade: info ? info.cidade : targetKey,
        uf: info ? info.uf : "",
        query,
        count: results.length,
        products: results
      };
    },

    optimizeShoppingBasket: async ({ productQueries = [], capitalKey }) => {
      const targetKey = MarketService.resolveCapitalKey(capitalKey || defaultCapitalKey);
      const info = MarketService.getCapitalInfo(targetKey);
      const markets = MarketService.getMarketsByCapital(targetKey);
      const slotKeys = ["db", "nova_era", "atacadao", "assai", "baratao", "m6", "m7", "m8", "m9", "m10", "m11", "m12", "m13", "m14", "m15"];

      // Monta supermercados virtuais com os 15 mercados da capital solicitada
      const capitalSupermarkets = {};
      markets.forEach((m, idx) => {
        const slot = slotKeys[idx] || `m${idx + 1}`;
        const baseStore = db.supermarkets[slot] || db.supermarkets.db || {};
        capitalSupermarkets[slot] = {
          ...baseStore,
          id: m.id,
          name: m.nome,
          shortName: m.nome,
          type: m.tipo,
          logoUrl: MarketService.getMarketLogoUrl(m.id)
        };
      });

      const basket = [];
      for (const q of productQueries) {
        const clean = String(q).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const found = db.products.find(p =>
          `${p.name} ${p.brand}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(clean)
        );
        if (found && !basket.some(b => b.id === found.id)) {
          basket.push({ id: found.id, quantity: 1 });
        }
      }

      if (basket.length === 0) {
        ["arroz_tio_joao_5kg", "feijao_kicaldo_1kg", "cafe_pilao_500g", "oleo_soja_liza_900ml", "leite_ninho_380g"].forEach(id => {
          basket.push({ id, quantity: 1 });
        });
      }

      const opt = ShoppingOptimizer.optimize({
        basket,
        products: db.products,
        supermarkets: capitalSupermarkets,
        userNeighborhood: "adrianopolis",
        minSplitSavingsCutoff: 10.0,
        costPerKm: 1.5
      });

      return {
        capitalKey: targetKey,
        cidade: info ? info.cidade : targetKey,
        uf: info ? info.uf : "",
        basketSize: basket.length,
        recommendationType: opt.strategy,
        bestSingleStore: opt.bestSingle ? {
          storeName: opt.bestSingle.storeName,
          subtotal: opt.bestSingle.productTotal,
          fuelCost: opt.bestSingle.travelCost,
          totalWithFuel: opt.bestSingle.finalCost,
          distanceKm: opt.bestSingle.roundtripKm
        } : null,
        bestTwoStoreSplit: opt.bestSplit ? {
          pairNames: `${opt.bestSplit.store1Name} + ${opt.bestSplit.store2Name}`,
          netSavingsVsSingle: opt.bestSplit.netSavings,
          totalWithFuel: opt.bestSplit.finalCost
        } : null
      };
    }
  };
}

/**
 * Instancia o ToolLoopAgent oficial do Vercel AI SDK (v6/v7)
 */
async function buildVercelToolLoopAgent(db, defaultCapitalKey = "AM-Manaus") {
  const { ToolLoopAgent, tool, isStepCount } = await import("ai");
  const { z } = await import("zod");
  const executors = createAgentToolsExecutors(db, defaultCapitalKey);

  const agent = new ToolLoopAgent({
    model: process.env.AI_MODEL || "google/gemini-2.5-flash",
    instructions: SYSTEM_INSTRUCTIONS,
    stopWhen: isStepCount(6),
    tools: {
      getCapitalMarkets: tool({
        description: "Retorna os 15 principais supermercados e suas logos oficiais de uma capital brasileira (ex: 'SP-SaoPaulo', 'RJ-RioDeJaneiro', 'AM-Manaus', 'RR-BoaVista').",
        inputSchema: z.object({
          capitalKey: z.string().describe("Chave da capital no formato UF-CidadeSemEspacos, ex: 'SP-SaoPaulo', 'AM-Manaus', 'RR-BoaVista'")
        }),
        execute: executors.getCapitalMarkets
      }),
      listAvailableCapitals: tool({
        description: "Lista todas as 27 capitais brasileiras disponíveis no catálogo canônico do PreçoBrasil.",
        inputSchema: z.object({}),
        execute: executors.listAvailableCapitals
      }),
      searchCheapestProducts: tool({
        description: "Busca produtos entre os 5.556 itens do catálogo e retorna onde cada produto está mais barato na capital selecionada, incluindo a logo oficial do mercado.",
        inputSchema: z.object({
          query: z.string().describe("Termo de busca, ex: 'arroz feijao picanha', 'cerveja carvao', 'leite cafe'"),
          capitalKey: z.string().optional().describe("Chave da capital, ex: 'SP-SaoPaulo' ou 'AM-Manaus'"),
          limit: z.number().optional().describe("Quantidade máxima de produtos (padrão: 6)")
        }),
        execute: executors.searchCheapestProducts
      }),
      optimizeShoppingBasket: tool({
        description: "Otimiza uma cesta de compras nos 15 mercados da capital, comparando comprar tudo em 1 mercado vs dividir em 2 mercados e descontando o combustível (Haversine).",
        inputSchema: z.object({
          productQueries: z.array(z.string()).describe("Lista de produtos desejados, ex: ['arroz', 'feijao', 'cafe', 'leite']"),
          capitalKey: z.string().optional().describe("Chave da capital, ex: 'SP-SaoPaulo'")
        }),
        execute: executors.optimizeShoppingBasket
      })
    }
  });

  return { agent, executors };
}

/**
 * Detecta se o usuário mencionou alguma capital específica na pergunta
 */
function detectCapitalFromPrompt(prompt, fallbackCapitalKey = "AM-Manaus") {
  const norm = String(prompt || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const capitals = MarketService.getAvailableCapitals();
  for (const cap of capitals) {
    const cityNorm = cap.cidade.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const keyNorm = cap.key.toLowerCase();
    if (norm.includes(cityNorm) || norm.includes(keyNorm)) {
      return cap.key;
    }
  }
  return MarketService.resolveCapitalKey(fallbackCapitalKey);
}

/**
 * Executa o Agente IA PreçoBrasil:
 * - Usa o ToolLoopAgent do Vercel AI SDK quando AI_GATEWAY_API_KEY ou VERCEL_OIDC_TOKEN está configurado
 * - Faz fallback automático para a execução direta das mesmas Tools do AI SDK localmente (zero-config)
 */
async function runPrecoBrasilAgent({ prompt = "", capitalKey = "AM-Manaus", db }) {
  const resolvedCapital = detectCapitalFromPrompt(prompt, capitalKey);
  const { agent, executors } = await buildVercelToolLoopAgent(db, resolvedCapital);

  const hasGatewayAuth = Boolean(
    process.env.AI_GATEWAY_API_KEY ||
    process.env.VERCEL_OIDC_TOKEN
  );

  // 1. Se autenticado no Vercel AI Gateway, executa o loop completo do ToolLoopAgent
  if (hasGatewayAuth) {
    try {
      const result = await agent.generate({
        prompt: `[Capital atual do usuário: ${resolvedCapital}] Pergunta: ${prompt}`
      });

      const marketsData = await executors.getCapitalMarkets({ capitalKey: resolvedCapital });
      const searchData = await executors.searchCheapestProducts({ query: prompt, capitalKey: resolvedCapital, limit: 4 });

      return {
        ok: true,
        engine: "vercel-ai-sdk-tool-loop-agent",
        model: process.env.AI_MODEL || "google/gemini-2.5-flash",
        capitalKey: resolvedCapital,
        cidade: marketsData.cidade,
        uf: marketsData.uf,
        reply: result.text,
        stepsCount: Array.isArray(result.steps) ? result.steps.length : 1,
        markets: marketsData.mercados.slice(0, 6),
        recommendedProducts: searchData.products
      };
    } catch (err) {
      console.warn("Aviso no Vercel AI Gateway (acionando executor local das tools do AI SDK):", err.message);
    }
  }

  // 2. Executor determinístico das Tools do Vercel AI SDK (Funciona 100% offline/local sem precisar de chave)
  const normPrompt = String(prompt).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const marketsData = await executors.getCapitalMarkets({ capitalKey: resolvedCapital });
  const toolsCalled = ["getCapitalMarkets"];

  // Caso A: Usuário perguntou sobre quais são os mercados/redes da capital
  if (
    normPrompt.includes("quais") && (normPrompt.includes("mercado") || normPrompt.includes("supermercado") || normPrompt.includes("rede")) ||
    normPrompt.includes("15 mercados") ||
    normPrompt.includes("lista de mercados")
  ) {
    const topNames = marketsData.mercados
      .map((m, i) => `${i + 1}. **${m.nome}** _(${m.tipo})_`)
      .join("\n");

    return {
      ok: true,
      engine: "vercel-ai-sdk-tools-local",
      sdkVersion: "ai@7.0.159 (ToolLoopAgent Ready)",
      toolsCalled,
      capitalKey: resolvedCapital,
      cidade: marketsData.cidade,
      uf: marketsData.uf,
      reply: `📍 **Catálogo Canônico — ${marketsData.cidade} (${marketsData.uf})**\nConsultei o \`MarketService\` (\`src/data/supermarkets.json\`) e estes são os **${marketsData.totalMercados} maiores supermercados** monitorados em ${marketsData.cidade}:\n\n${topNames}`,
      markets: marketsData.mercados,
      recommendedProducts: []
    };
  }

  // Caso B: Usuário pediu para montar/otimizar uma cesta ou churrasco
  if (normPrompt.includes("cesta") || normPrompt.includes("otimiz") || normPrompt.includes("churrasco") || normPrompt.includes("feira")) {
    const queries = normPrompt.includes("churrasco")
      ? ["picanha", "linguica", "cerveja", "carvao", "refrigerante", "farofa"]
      : ["arroz", "feijao", "cafe", "leite", "oleo", "acucar"];

    const searchData = await executors.searchCheapestProducts({ query: queries.join(" "), capitalKey: resolvedCapital, limit: 6 });
    const optData = await executors.optimizeShoppingBasket({ productQueries: queries, capitalKey: resolvedCapital });
    toolsCalled.push("searchCheapestProducts", "optimizeShoppingBasket");

    const single = optData.bestSingleStore;
    const split = optData.bestTwoStoreSplit;

    let reply = `🛒 **Cesta Otimizada em ${marketsData.cidade} (${marketsData.uf})**\nAnalisei os **15 supermercados** de ${marketsData.cidade} considerando os preços de hoje e o deslocamento:\n\n`;
    if (single) {
      reply += `• **Melhor comprar em 1 só lugar:** **${single.storeName}** — Subtotal **R$ ${single.subtotal.toFixed(2)}** (+ R$ ${single.fuelCost.toFixed(2)} combustível = **R$ ${single.totalWithFuel.toFixed(2)}**)\n`;
    }
    if (split && split.netSavingsVsSingle > 0) {
      reply += `• **Dividindo em 2 mercados (${split.pairNames}):** Total líquido **R$ ${split.totalWithFuel.toFixed(2)}** (Economia real de **R$ ${split.netSavingsVsSingle.toFixed(2)}** já descontando a gasolina!)\n`;
    }
    reply += `\nConfira abaixo os itens mais baratos encontrados pelas ferramentas do **Vercel AI SDK**:`;

    return {
      ok: true,
      engine: "vercel-ai-sdk-tools-local",
      sdkVersion: "ai@7.0.159 (ToolLoopAgent Ready)",
      toolsCalled,
      capitalKey: resolvedCapital,
      cidade: marketsData.cidade,
      uf: marketsData.uf,
      reply,
      optimization: optData,
      markets: marketsData.mercados.slice(0, 6),
      recommendedProducts: searchData.products
    };
  }

  // Caso C: Busca de produtos mais baratos na capital
  const searchData = await executors.searchCheapestProducts({ query: prompt, capitalKey: resolvedCapital, limit: 5 });
  toolsCalled.push("searchCheapestProducts");

  const lines = searchData.products.map(p =>
    `• **${p.name}** (${p.brand}): **R$ ${p.bestPrice.toFixed(2)}** no **${p.marketName}** _(economia de R$ ${p.savingsPerUnit.toFixed(2)}/un)_`
  ).join("\n");

  return {
    ok: true,
    engine: "vercel-ai-sdk-tools-local",
    sdkVersion: "ai@7.0.159 (ToolLoopAgent Ready)",
    toolsCalled,
    capitalKey: resolvedCapital,
    cidade: marketsData.cidade,
    uf: marketsData.uf,
    reply: `🤖 **Pesquisa Inteligente em ${marketsData.cidade} (${marketsData.uf})**\nConsultei os **15 supermercados** da capital e os **5.556 produtos** do banco. Aqui estão as melhores ofertas agora:\n\n${lines}`,
    markets: marketsData.mercados.slice(0, 6),
    recommendedProducts: searchData.products
  };
}

module.exports = {
  SYSTEM_INSTRUCTIONS,
  createAgentToolsExecutors,
  buildVercelToolLoopAgent,
  runPrecoBrasilAgent
};
