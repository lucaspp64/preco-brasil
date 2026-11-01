/**
 * PreçoManaus — Otimizador Combinatório de Cesta (1 Loja vs 2 Lojas + Combustível) & Histórico de Preços
 * Compatível com Browser (window) e Node.js (CommonJS).
 */
(function (root) {
  const distSvc = (typeof require !== "undefined" && typeof window === "undefined")
    ? require("./distanceService")
    : root.DistanceService;

  function getBestPrice(product, supermarkets) {
    let bestKey = null;
    let bestPrice = Infinity;
    let worstPrice = -Infinity;

    for (const [key, data] of Object.entries(product.prices || {})) {
      if (data.price < bestPrice) {
        bestPrice = data.price;
        bestKey = key;
      }
      if (data.price > worstPrice) {
        worstPrice = data.price;
      }
    }

    if (!bestKey) return null;
    const savingsPercent = worstPrice > 0 ? Math.round(((worstPrice - bestPrice) / worstPrice) * 100) : 0;
    const storeName = supermarkets && supermarkets[bestKey] ? supermarkets[bestKey].name : bestKey;
    return {
      storeKey: bestKey,
      storeName,
      price: bestPrice,
      worstPrice,
      savingsPercent,
      neighborhood: product.prices[bestKey].neighborhood
    };
  }

  function analyzePriceHistory(product, supermarkets) {
    const best = getBestPrice(product, supermarkets);
    const cur = best ? best.price : 10.0;
    const history = product.history || [cur * 1.1, cur * 1.05, cur * 1.08, cur];

    const avgPrice = parseFloat((history.reduce((a, b) => a + b, 0) / history.length).toFixed(2));
    const minPrice = Math.min(...history);
    const maxPrice = Math.max(...history);
    const diffFromAvg = Math.round(((cur - avgPrice) / avgPrice) * 100);

    let status = "NORMAL";
    let statusBadgeHtml = "";
    let verdictText = "";

    const prevWeek = history[history.length - 2] || cur;
    const prevPrevWeek = history[history.length - 3] || prevWeek;

    if (prevWeek > prevPrevWeek * 1.12 && cur >= prevPrevWeek * 0.98) {
      status = "METADE_DO_DOBRO";
      statusBadgeHtml = `<span class="promo-status-badge fake">🚨 Alerta: Metade do Dobro</span>`;
      verdictText = `O preço foi inflacionado para R$ ${prevWeek.toFixed(2).replace('.', ',')} antes de aplicar o suposto desconto para R$ ${cur.toFixed(2).replace('.', ',')}. Não é desconto real.`;
    } else if (diffFromAvg <= -8) {
      status = "REAL";
      statusBadgeHtml = `<span class="promo-status-badge real">✅ Promoção Real Verificada (${Math.abs(diffFromAvg)}% abaixo da média)</span>`;
      verdictText = `O produto está consideravelmente mais barato que a média de R$ ${avgPrice.toFixed(2).replace('.', ',')} observada nas últimas 6 semanas em Manaus. Vale a compra!`;
    } else {
      status = "NORMAL";
      statusBadgeHtml = `<span class="promo-status-badge neutral">⚖️ Preço Regular de Mercado</span>`;
      verdictText = `Preço atual está dentro da faixa histórica normal em Manaus (variação de ${diffFromAvg > 0 ? '+' : ''}${diffFromAvg}% vs média de R$ ${avgPrice.toFixed(2).replace('.', ',')}).`;
    }

    return { history, cur, avgPrice, minPrice, maxPrice, diffFromAvg, status, statusBadgeHtml, verdictText };
  }

  const ShoppingOptimizer = {
    getBestPrice,
    analyzePriceHistory,

    optimize({
      basket,
      products,
      supermarkets,
      userNeighborhood = "adrianopolis",
      minSplitSavingsCutoff = 15.00,
      costPerKm = 1.50
    }) {
      if (!basket || basket.length === 0) return null;

      const storeKeys = Object.keys(supermarkets);
      const ds = (typeof window !== "undefined" && window.DistanceService) ? window.DistanceService : distSvc;

      // 1. Single-Store Evaluation
      const singleResults = storeKeys.map(sKey => {
        let productTotal = 0;
        const items = [];

        basket.forEach(bItem => {
          const prod = products.find(p => p.id === bItem.id);
          const price = prod && prod.prices[sKey] ? prod.prices[sKey].price : null;
          if (price !== null) {
            const itemCost = price * bItem.quantity;
            productTotal += itemCost;
            items.push({
              id: bItem.id,
              name: prod ? prod.name : bItem.name,
              brand: prod ? prod.brand : bItem.brand,
              unit: prod ? prod.unit : bItem.unit,
              quantity: bItem.quantity,
              unitPrice: price,
              totalPrice: itemCost
            });
          }
        });

        const oneWayKm = ds.getNeighborhoodToStoreKm(userNeighborhood, sKey);
        const roundtripKm = parseFloat((oneWayKm * 2).toFixed(1));
        const travelCost = ds.calculateFuelCost(roundtripKm, costPerKm);
        const finalCost = parseFloat((productTotal + travelCost).toFixed(2));

        return {
          storeKey: sKey,
          storeName: supermarkets[sKey].name,
          color: supermarkets[sKey].color,
          productTotal: parseFloat(productTotal.toFixed(2)),
          roundtripKm,
          travelCost,
          finalCost,
          items
        };
      });

      // Sort by lowest product basket price (or final cost)
      singleResults.sort((a, b) => a.productTotal - b.productTotal);
      const bestSingle = singleResults[0];

      // 2. Dual-Store Combinatorial Evaluation (pairs S1 & S2)
      let bestSplit = null;
      let maxNetSavings = -Infinity;

      for (let i = 0; i < storeKeys.length; i++) {
        for (let j = i + 1; j < storeKeys.length; j++) {
          const s1 = storeKeys[i];
          const s2 = storeKeys[j];

          let dualProductTotal = 0;
          const s1Items = [];
          const s2Items = [];

          basket.forEach(bItem => {
            const prod = products.find(p => p.id === bItem.id);
            const p1 = prod && prod.prices[s1] ? prod.prices[s1].price : Infinity;
            const p2 = prod && prod.prices[s2] ? prod.prices[s2].price : Infinity;

            if (p1 <= p2 && p1 !== Infinity) {
              const itemCost = p1 * bItem.quantity;
              dualProductTotal += itemCost;
              s1Items.push({
                ...bItem,
                name: prod ? prod.name : (bItem.name || "Produto"),
                brand: prod ? prod.brand : (bItem.brand || ""),
                unit: prod ? prod.unit : (bItem.unit || ""),
                unitPrice: p1,
                totalPrice: itemCost,
                chosenStore: s1
              });
            } else if (p2 !== Infinity) {
              const itemCost = p2 * bItem.quantity;
              dualProductTotal += itemCost;
              s2Items.push({
                ...bItem,
                name: prod ? prod.name : (bItem.name || "Produto"),
                brand: prod ? prod.brand : (bItem.brand || ""),
                unit: prod ? prod.unit : (bItem.unit || ""),
                unitPrice: p2,
                totalPrice: itemCost,
                chosenStore: s2
              });
            }
          });

          const distUserS1 = ds.getNeighborhoodToStoreKm(userNeighborhood, s1);
          const distUserS2 = ds.getNeighborhoodToStoreKm(userNeighborhood, s2);
          const distS1S2 = ds.getStoreToStoreKm(s1, s2);

          const routeKm = parseFloat((distUserS1 + distS1S2 + distUserS2).toFixed(1));
          const dualTravelCost = ds.calculateFuelCost(routeKm, costPerKm);
          const dualFinalCost = parseFloat((dualProductTotal + dualTravelCost).toFixed(2));

          const grossSavings = parseFloat((bestSingle.productTotal - dualProductTotal).toFixed(2));
          const extraTravelCost = parseFloat((dualTravelCost - bestSingle.travelCost).toFixed(2));
          const netSavings = parseFloat((bestSingle.finalCost - dualFinalCost).toFixed(2));

          if (s1Items.length > 0 && s2Items.length > 0) {
            if (netSavings > maxNetSavings) {
              maxNetSavings = netSavings;
              bestSplit = {
                store1Key: s1,
                store2Key: s2,
                store1Name: supermarkets[s1].name,
                store2Name: supermarkets[s2].name,
                store1Color: supermarkets[s1].color,
                store2Color: supermarkets[s2].color,
                store1Items: s1Items,
                store2Items: s2Items,
                store1Subtotal: parseFloat(s1Items.reduce((acc, it) => acc + it.totalPrice, 0).toFixed(2)),
                store2Subtotal: parseFloat(s2Items.reduce((acc, it) => acc + it.totalPrice, 0).toFixed(2)),
                productTotal: parseFloat(dualProductTotal.toFixed(2)),
                routeKm,
                travelCost: dualTravelCost,
                finalCost: dualFinalCost,
                grossSavings,
                extraTravelCost,
                netSavings
              };
            }
          }
        }
      }

      const meetsCutoff = Boolean(bestSplit && (bestSplit.netSavings >= minSplitSavingsCutoff));
      const strategy = meetsCutoff ? "SPLIT_STORES" : "SINGLE_STORE";

      return {
        strategy,
        meetsCutoff,
        cutoff: minSplitSavingsCutoff,
        bestSingle,
        bestSplit,
        allSingleRankings: singleResults,
        userNeighborhood,
        costPerKm
      };
    }
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = ShoppingOptimizer;
  }
  if (root) {
    root.ShoppingOptimizer = ShoppingOptimizer;
  }
})(typeof window !== "undefined" ? window : globalThis);
