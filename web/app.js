/**
 * PreçoManaus — Controlador Principal da Interface Web/PWA
 * Utiliza os módulos: ManausCatalog, DistanceService, ShoppingOptimizer e PrecoManausApi.
 */

// 1. ESTADO PERSISTENTE (LocalStorage + Sincronização com Servidor)
let basket = JSON.parse(localStorage.getItem("precomanaus_basket") || "[]");
let alerts = JSON.parse(localStorage.getItem("precomanaus_alerts") || JSON.stringify([
  { id: 101, productId: "cafe_pilao_500g", productName: "Café Torrado e Moído Pilão Tradicional 500g", targetPrice: 19.00 },
  { id: 102, productId: "tambaqui_fresco_kg", productName: "Tambaqui Fresco Inteiro Tratado kg", targetPrice: 15.50 }
]));
let currentCategory = "Todos";
let currentMarket = "all";
let currentTier = "all";
let currentSort = "price_asc";
let currentCity = localStorage.getItem("precomanaus_city") || "manaus";
let visibleProductsLimit = 40;

let userNeighborhood = localStorage.getItem("precomanaus_neighborhood") || "adrianopolis";
let minSplitCutoff = parseFloat(localStorage.getItem("precomanaus_cutoff") || "15.00");
let checklistState = JSON.parse(localStorage.getItem("precomanaus_checklist") || "{}");

let userReputation = JSON.parse(localStorage.getItem("precomanaus_reputation") || JSON.stringify({
  name: "Lucas Pantoja",
  points: 280,
  level: "Fiscal do Povo Prata",
  verifiedCount: 14,
  badge: "🥈"
}));

let communityContributions = JSON.parse(
  localStorage.getItem("precomanaus_contributions") ||
  JSON.stringify(ManausCatalog.DEFAULT_CONTRIBUTIONS)
);

function saveBasket() {
  localStorage.setItem("precomanaus_basket", JSON.stringify(basket));
  updateBasketBadge();
  renderBasket();
}

function saveAlerts() {
  localStorage.setItem("precomanaus_alerts", JSON.stringify(alerts));
  renderAlerts();
  renderCommunityFeed();
}

function saveCommunityState() {
  localStorage.setItem("precomanaus_reputation", JSON.stringify(userReputation));
  localStorage.setItem("precomanaus_contributions", JSON.stringify(communityContributions));
}

function updateBasketBadge() {
  const badge = document.getElementById("cesta-badge");
  if (!badge) return;
  const count = basket.reduce((acc, item) => acc + item.quantity, 0);
  if (count > 0) {
    badge.textContent = count;
    badge.style.display = "inline-block";
  } else {
    badge.style.display = "none";
  }
}

// 2. HELPERS DE PREÇO, IMAGENS 3D E RENDERIZAÇÃO DO MONITOR
function getBestPrice(product) {
  return ShoppingOptimizer.getBestPrice(product, SUPERMARKETS);
}

function getProductImageUrl(prod) {
  if (!prod) return "web/assets/products/arroz.svg";
  if (prod.imgType) return `web/assets/products/${prod.imgType}.svg`;

  const cat = (prod.category || "").toLowerCase();
  const name = (prod.name || "").toLowerCase();

  if (name.includes("arroz")) return "web/assets/products/arroz.svg";
  if (name.includes("feijão") || name.includes("feijao")) return "web/assets/products/feijao.svg";
  if (name.includes("farinha") || name.includes("flocão") || name.includes("aveia") || name.includes("trigo") || name.includes("goma")) return "web/assets/products/farinha.svg";
  if (name.includes("café") || name.includes("cafe") || name.includes("achocolatado")) return "web/assets/products/cafe.svg";
  if (name.includes("açúcar") || name.includes("acucar")) return "web/assets/products/acucar.svg";
  if (name.includes("óleo") || name.includes("oleo") || name.includes("azeite")) return "web/assets/products/oleo.svg";
  if (name.includes("leite") || name.includes("iogurte")) return "web/assets/products/leite.svg";
  if (name.includes("manteiga") || name.includes("margarina") || name.includes("queijo") || name.includes("requeijão")) return "web/assets/products/manteiga.svg";
  if (name.includes("macarrão") || name.includes("massa")) return "web/assets/products/macarrao.svg";
  if (name.includes("biscoito") || name.includes("bolacha") || name.includes("rosquinha")) return "web/assets/products/biscoito.svg";
  if (name.includes("tambaqui") || name.includes("pirarucu") || name.includes("jaraqui") || name.includes("matrinxã") || name.includes("pacu") || name.includes("sardinha") || name.includes("atum") || name.includes("peixe")) return "web/assets/products/peixe.svg";
  if (name.includes("frango") || name.includes("coxa") || name.includes("peito")) return "web/assets/products/frango.svg";
  if (name.includes("ovo")) return "web/assets/products/ovos.svg";
  if (cat.includes("carnes") || name.includes("picanha") || name.includes("alcatra") || name.includes("carne") || name.includes("charque") || name.includes("calabresa") || name.includes("linguiça")) return "web/assets/products/carne.svg";
  if (name.includes("pão") || name.includes("pao") || name.includes("torrada")) return "web/assets/products/pao.svg";
  if (name.includes("guaraná") || name.includes("refrigerante") || name.includes("suco") || name.includes("baré") || name.includes("tuchaua")) return "web/assets/products/bebida.svg";
  if (name.includes("sabão em pó") || name.includes("lava-roupas") || name.includes("omo")) return "web/assets/products/sabao_po.svg";
  if (cat.includes("limpeza") || name.includes("detergente") || name.includes("água sanitária") || name.includes("amaciante") || name.includes("desinfetante")) return "web/assets/products/limpeza.svg";
  if (cat.includes("bebê") || name.includes("fralda") || name.includes("mucilon") || name.includes("lenço")) return "web/assets/products/bebe.svg";
  if (cat.includes("higiene") || cat.includes("drogaria") || name.includes("papel higiênico") || name.includes("sabonete") || name.includes("shampoo") || name.includes("creme dental") || name.includes("desodorante")) return "web/assets/products/higiene.svg";
  if (cat.includes("pets") || name.includes("ração") || name.includes("areia") || name.includes("pet")) return "web/assets/products/pet.svg";
  if (cat.includes("especiarias") || cat.includes("temperos") || name.includes("pimenta") || name.includes("tucupi") || name.includes("sal")) return "web/assets/products/tempero.svg";
  if (cat.includes("hortifruti") || name.includes("banana") || name.includes("tomate") || name.includes("batata") || name.includes("cebola") || name.includes("açaí") || name.includes("cupuaçu")) return "web/assets/products/hortifruti.svg";
  if (cat.includes("papelaria") || cat.includes("bazar")) return "web/assets/products/bazar.svg";

  return "web/assets/products/arroz.svg";
}

function getStoreAvatarHtml(storeKey) {
  const cityCfg = (window.CITIES_CONFIG && window.CITIES_CONFIG[currentCity]) || (window.CITIES_CONFIG && window.CITIES_CONFIG.manaus);
  const storeCfg = (cityCfg && cityCfg.supermarkets && cityCfg.supermarkets[storeKey]) || SUPERMARKETS[storeKey];
  const canonicalId = storeCfg && storeCfg.id;
  const logoUrl = (storeCfg && storeCfg.logo)
    || (window.getMarketLogoUrl && canonicalId ? window.getMarketLogoUrl(canonicalId) : null)
    || "web/assets/logos/default-market.svg";
  const storeName = (storeCfg && storeCfg.name) || "Mercado";
  return `<img src="${logoUrl}" alt="${storeName}" class="store-logo-img" loading="lazy" onerror="this.onerror=null;this.src='web/assets/logos/default-market.svg'">`;
}

function getStoreTierBadgeHtml(storeKey) {
  const s = SUPERMARKETS[storeKey];
  if (!s || !s.tier) return "";
  const labels = {
    pequeno: "🏘️ Pequeno Porte",
    medio: "🛒 Médio Porte",
    grande: "🏢 Grande Porte"
  };
  return `<span class="tier-badge tier-${s.tier}">${labels[s.tier] || s.tier}</span>`;
}

function selectTier(tierKey) {
  currentTier = tierKey;
  currentMarket = "all";
  visibleProductsLimit = 40;
  document.querySelectorAll("#tier-chips .chip").forEach(btn => {
    const onclickAttr = btn.getAttribute("onclick") || "";
    btn.classList.toggle("active", onclickAttr.includes(`'${tierKey}'`));
  });
  renderMarketChipsForCurrentCity();
  renderProducts();
}

function renderMarketChipsForCurrentCity() {
  const cityCfg = (window.CITIES_CONFIG && window.CITIES_CONFIG[currentCity]) || (window.CITIES_CONFIG && window.CITIES_CONFIG.manaus);
  const marketChipsEl = document.getElementById("market-chips");
  if (!marketChipsEl || !cityCfg) return;

  const entries = Object.entries(cityCfg.supermarkets).filter(([, sObj]) => {
    return currentTier === "all" || sObj.tier === currentTier;
  });

  marketChipsEl.innerHTML = `
    <button class="chip ${currentMarket === 'all' ? 'active' : ''}" onclick="selectMarket('all')">🏪 Todas (${entries.length})</button>
    ${entries.map(([sKey, sObj]) => `
      <button class="chip ${currentMarket === sKey ? 'active' : ''}" onclick="selectMarket('${sKey}')">
        <img src="${sObj.logo}" alt="${sObj.name}" class="store-logo-img">
        ${sObj.name}
      </button>
    `).join("")}
  `;
}

function switchCity(cityId) {
  if (!window.CITIES_CONFIG || !window.CITIES_CONFIG[cityId]) return;
  currentCity = cityId;
  localStorage.setItem("precomanaus_city", cityId);

  const cityCfg = window.CITIES_CONFIG[cityId];

  // Atualizar objeto global SUPERMARKETS com as redes da cidade selecionada
  Object.keys(cityCfg.supermarkets).forEach(k => {
    SUPERMARKETS[k] = { ...cityCfg.supermarkets[k] };
    if (window.DistanceService && window.DistanceService.supermarkets) {
      window.DistanceService.supermarkets[k] = {
        name: cityCfg.supermarkets[k].name,
        lat: cityCfg.supermarkets[k].lat,
        lng: cityCfg.supermarkets[k].lng
      };
    }
  });
  PRODUCTS.forEach(p => { p._bestCache = null; });

  // Atualizar bairros da cidade no DistanceService
  if (window.DistanceService && Array.isArray(cityCfg.neighborhoods)) {
    cityCfg.neighborhoods.forEach(n => {
      if (window.DistanceService.neighborhoods[n.key]) {
        window.DistanceService.neighborhoods[n.key].name = n.name;
        window.DistanceService.neighborhoods[n.key].lat = n.lat;
        window.DistanceService.neighborhoods[n.key].lng = n.lng;
      }
    });
  }

  // Atualizar textos do Hero Banner e Header
  const totalFormatted = PRODUCTS.length.toLocaleString("pt-BR");
  const subtitleEl = document.querySelector(".brand-subtitle");
  if (subtitleEl) subtitleEl.textContent = `Monitor Nacional • ${cityCfg.name} (${totalFormatted} itens)`;

  const heroBadgeEl = document.querySelector(".hero-badge");
  if (heroBadgeEl) heroBadgeEl.textContent = cityCfg.heroBadge;

  const heroTitleEl = document.querySelector(".hero-title");
  if (heroTitleEl) heroTitleEl.textContent = cityCfg.heroTitle;

  const heroSubEl = document.querySelector(".hero-subtitle");
  if (heroSubEl) heroSubEl.textContent = cityCfg.heroSubtitle;

  const statItemsEl = document.getElementById("hero-stat-items-count");
  if (statItemsEl) statItemsEl.textContent = `${totalFormatted} Itens`;

  // Atualizar texto do botão de Produtos Regionais conforme a UF ativa
  const regBtn = document.querySelector("#category-chips button[onclick*=\"'Produtos Regionais'\"]");
  if (regBtn) {
    regBtn.innerHTML = `<img src="web/assets/cat_fruits.jpg" class="chip-thumb" alt="">Regional ${cityCfg.uf} (${cityCfg.region})`;
  }

  renderMarketChipsForCurrentCity();

  const citySelectEl = document.getElementById("city-switcher-select");
  if (citySelectEl && citySelectEl.value !== cityId) {
    citySelectEl.value = cityId;
  }

  populateNeighborhoodSelects();
  updateLocationUI();
  renderProducts();
  renderBasket();
  renderFlyers();
  renderDieeseIndex();

  showToast(`🇧🇷 Cidade alterada para <b>${cityCfg.name}</b> (${cityCfg.region})! Mercadinhos, redes médias e atacarejos atualizados.`);
}

function loadMoreProducts() {
  visibleProductsLimit += 60;
  renderProducts();
}

function onSortChange(val) {
  currentSort = val;
  renderProducts();
}

function onGlobalNeighborhoodChange(val) {
  userNeighborhood = val;
  localStorage.setItem("precomanaus_neighborhood", val);
  updateLocationUI();
  renderProducts();
  const cestaScreen = document.getElementById("screen-cesta");
  if (cestaScreen && cestaScreen.classList.contains("active")) {
    renderBasket();
  }
}

function renderProducts() {
  const container = document.getElementById("products-container");
  if (!container) return;
  const searchInput = document.getElementById("search-input");
  const query = (searchInput ? searchInput.value : "").toLowerCase();
  const cityCfg = (window.CITIES_CONFIG && window.CITIES_CONFIG[currentCity]) || { shortName: "Manaus", name: "Manaus - AM", region: "Norte", uf: "AM", priceMultiplier: 1.0 };

  const filtered = PRODUCTS.filter(prod => {
    // Se o produto é exclusivo de outra região e não estamos buscando especificamente por nome, priorizar os da região atual
    if (!query && prod.regionTag && prod.regionTag !== cityCfg.region) {
      return false;
    }

    let matchCat = false;
    if (currentCategory === "Todos") matchCat = true;
    else if (currentCategory === "Produtos Regionais") {
      matchCat = Boolean(prod.isRegional || prod.category.includes("Regional") || prod.category.includes("Peixes Regionais"));
      if (prod.regionTag && prod.regionTag !== cityCfg.region) matchCat = false;
    }
    else if (currentCategory === "Perto do Vencimento") matchCat = Boolean(prod.isNearExpiry);
    else matchCat = (prod.category === currentCategory);

    const matchMarket = (currentMarket === "all" || Boolean(prod.prices[currentMarket]));
    const matchQuery = !query || (
      prod.name.toLowerCase().includes(query) ||
      prod.brand.toLowerCase().includes(query) ||
      (prod.ean && prod.ean.includes(query))
    );
    return matchCat && matchMarket && matchQuery;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 40px 20px; color: var(--text-secondary);">
        <div style="font-size: 32px; margin-bottom: 8px;">🔍</div>
        <p style="font-weight:600;">Nenhum produto encontrado</p>
        <p style="font-size:12px;">Tente pesquisar por outros termos ou troque a categoria.</p>
      </div>
    `;
    return;
  }

  // Pré-calcular distâncias das 8 lojas uma única vez para ordenar 5.000+ itens em < 3ms
  const storeFuelCache = {};
  Object.keys(SUPERMARKETS).forEach(sKey => {
    const d = DistanceService.getNeighborhoodToStoreKm(userNeighborhood, sKey);
    storeFuelCache[sKey] = DistanceService.calculateFuelCost(d * 2);
  });

  filtered.forEach(p => {
    if (!p._bestCache) {
      p._bestCache = getBestPrice(p);
    }
  });

  filtered.sort((a, b) => {
    const bestA = a._bestCache;
    const bestB = b._bestCache;
    if (currentSort === "price_asc") return bestA.price - bestB.price;
    if (currentSort === "price_travel") {
      const fuelA = storeFuelCache[bestA.storeKey] || 0;
      const fuelB = storeFuelCache[bestB.storeKey] || 0;
      return (bestA.price + fuelA) - (bestB.price + fuelB);
    }
    if (currentSort === "savings_desc") return bestB.savingsPercent - bestA.savingsPercent;
    if (currentSort === "name_asc") return a.name.localeCompare(b.name);
    return 0;
  });

  const mult = cityCfg.priceMultiplier || 1.0;
  const visibleItems = filtered.slice(0, visibleProductsLimit);
  const remainingCount = Math.max(0, filtered.length - visibleItems.length);

  const countHeaderHtml = `
    <div style="display:flex; justify-content:space-between; align-items:center; background:#E8F5E9; border:1px solid #C8E6C9; border-radius:10px; padding:8px 12px; margin-bottom:10px; font-size:12px; color:#1B5E20;">
      <span>📦 <b>${filtered.length.toLocaleString('pt-BR')} itens ativos em ${cityCfg.name}</b> <small>(Catálogo Nacional: ${PRODUCTS.length.toLocaleString('pt-BR')})</small></span>
      <span style="font-size:11px; font-weight:700;">Exibindo ${visibleItems.length}</span>
    </div>
  `;

  const cardsHtml = visibleItems.map(prod => {
    const best = getBestPrice(prod);

    // Se o usuário filtrou por Porte (ex: Pequeno Porte) ou Rede específica, destacar o melhor dentro desse filtro
    let targetStore = best;
    if (currentMarket !== "all" && prod.prices[currentMarket]) {
      targetStore = { storeKey: currentMarket, storeName: SUPERMARKETS[currentMarket].name, price: prod.prices[currentMarket].price, neighborhood: prod.prices[currentMarket].neighborhood };
    } else if (currentTier !== "all") {
      const tierEntries = Object.entries(prod.prices).filter(([mKey]) => SUPERMARKETS[mKey] && SUPERMARKETS[mKey].tier === currentTier);
      if (tierEntries.length > 0) {
        tierEntries.sort((a, b) => a[1].price - b[1].price);
        const [winKey, winData] = tierEntries[0];
        targetStore = { storeKey: winKey, storeName: SUPERMARKETS[winKey].name, price: winData.price, neighborhood: winData.neighborhood };
      }
    }

    const distKm = DistanceService.getNeighborhoodToStoreKm(userNeighborhood, targetStore.storeKey);
    const travelCost = DistanceService.calculateFuelCost(distKm * 2);
    const finalTargetPrice = +(targetStore.price * mult).toFixed(2);
    const finalWorstPrice = +(best.worstPrice * mult).toFixed(2);

    const storeRowsHtml = Object.entries(prod.prices)
      .filter(([mKey]) => currentTier === "all" || (SUPERMARKETS[mKey] && SUPERMARKETS[mKey].tier === currentTier))
      .map(([mKey, mData]) => {
        const isBest = mKey === targetStore.storeKey;
        const rowDist = DistanceService.getNeighborhoodToStoreKm(userNeighborhood, mKey);
        const rowPrice = +(mData.price * mult).toFixed(2);
        const storeUnit = (SUPERMARKETS[mKey] && SUPERMARKETS[mKey].unit) ? SUPERMARKETS[mKey].unit.split(" - ")[0] : mData.neighborhood;
        return `
          <div class="store-row" style="${isBest ? 'font-weight:bold; color:var(--green-best);' : ''}">
            <div class="store-name-dot">
              ${getStoreAvatarHtml(mKey)}
              <span>${SUPERMARKETS[mKey].name} ${getStoreTierBadgeHtml(mKey)} <small style="color:var(--text-secondary)">(${storeUnit} • ${rowDist}km)</small></span>
            </div>
            <span>R$ ${rowPrice.toFixed(2).replace('.', ',')}</span>
          </div>
        `;
      }).join("");

    const imgUrl = getProductImageUrl(prod);

    return `
      <div class="product-card">
        <div class="card-top">
          <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
            <span class="cat-badge">${prod.category}</span>
            ${prod.isRegional ? `<span class="regional-tag">🌿 Regional ${cityCfg.uf || 'AM'}</span>` : ""}
            ${prod.isNearExpiry ? `<span class="expiry-tag">⚡ -${prod.expiryDiscount || 40}% • Vence em ${prod.expiryDays || 2}d</span>` : ""}
          </div>
          ${best.savingsPercent > 0 ? `
            <span class="saving-badge">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
              Economize até ${best.savingsPercent}%
            </span>
          ` : ""}
        </div>

        <div class="prod-body">
          <div class="prod-thumb-box">
            <img src="${imgUrl}" alt="${prod.name}" class="prod-thumb-img" loading="lazy">
            <span class="prod-mini-emoji">${prod.icon}</span>
          </div>
          <div class="prod-info">
            <h3 class="prod-name">${prod.name}</h3>
            <p class="prod-meta">🏷️ <b>${prod.brand}</b> • ${prod.unit} ${prod.ean ? `• EAN ${prod.ean}` : ""}</p>
            <div class="distance-pill">
              📍 ${distKm} km do seu bairro ${travelCost === 0 ? "<b>(Ir a pé • R$ 0,00 gasolina!)</b>" : `(~R$ ${travelCost.toFixed(2).replace('.', ',')} gasolina ida/volta)`}
            </div>
          </div>
        </div>

        <div class="best-price-box">
          <div style="display:flex; align-items:center; gap:10px;">
            ${getStoreAvatarHtml(targetStore.storeKey)}
            <div>
              <div class="best-label">★ Menor Preço em ${cityCfg.shortName} ${getStoreTierBadgeHtml(targetStore.storeKey)}</div>
              <div class="best-store">${targetStore.storeName}</div>
              <div class="best-neighborhood">${SUPERMARKETS[targetStore.storeKey].unit || targetStore.neighborhood}</div>
            </div>
          </div>
          <div class="best-amount">
            <div class="best-price-value">R$ ${finalTargetPrice.toFixed(2).replace('.', ',')}</div>
            <div class="worst-comp">vs R$ ${finalWorstPrice.toFixed(2).replace('.', ',')}</div>
          </div>
        </div>

        <div class="store-prices-table" id="table-${prod.id}">
          ${storeRowsHtml}
        </div>

        <div class="card-actions">
          <button class="btn-text" onclick="toggleStoreTable('${prod.id}')">
            <span>Comparar 15 mercados da capital</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>
          </button>
          <div style="display:flex; gap:6px;">
            <button class="btn-text" onclick="openHistoryModal('${prod.id}')" title="Ver Histórico & Promoção Real" style="font-weight:700; color:#1976D2;">📊 Histórico</button>
            <button class="btn-text" onclick="openProductAlertModal('${prod.id}')" title="Criar alerta">🔔</button>
            <button class="btn-add" onclick="addToBasket('${prod.id}')">+ Cesta</button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  const loadMoreHtml = remainingCount > 0 ? `
    <div style="text-align:center; padding: 14px 0 24px;">
      <button onclick="loadMoreProducts()" class="btn-add" style="width:100%; justify-content:center; padding:13px; font-size:13px; border-radius:12px;">
        ➕ Carregar mais produtos (+60 de ${remainingCount.toLocaleString('pt-BR')} restantes)
      </button>
    </div>
  ` : "";

  container.innerHTML = countHeaderHtml + cardsHtml + loadMoreHtml;
}

function toggleStoreTable(prodId) {
  const table = document.getElementById("table-" + prodId);
  if (table) table.classList.toggle("open");
}

function selectCategory(cat) {
  currentCategory = cat;
  visibleProductsLimit = 40;
  document.querySelectorAll("#category-chips .chip").forEach(btn => {
    const onclickAttr = btn.getAttribute("onclick") || "";
    btn.classList.toggle("active", onclickAttr.includes(`'${cat}'`));
  });
  renderProducts();
}

function selectMarket(marketKey) {
  currentMarket = marketKey;
  visibleProductsLimit = 40;
  document.querySelectorAll("#market-chips .chip").forEach(btn => {
    const onclickAttr = btn.getAttribute("onclick") || "";
    btn.classList.toggle("active", onclickAttr.includes(`'${marketKey}'`));
  });
  renderProducts();
}

function filterProducts() {
  visibleProductsLimit = 40;
  renderProducts();
}

// 3. CESTA & OTIMIZADOR COMBINATÓRIO (1 LOJA vs 2 LOJAS + COMBUSTÍVEL)
function addToBasket(prodId) {
  const prod = PRODUCTS.find(p => p.id === prodId);
  if (!prod) return;

  const existing = basket.find(item => item.id === prodId);
  if (existing) {
    existing.quantity += 1;
  } else {
    basket.push({
      id: prod.id,
      name: prod.name,
      brand: prod.brand,
      unit: prod.unit,
      category: prod.category,
      quantity: 1
    });
  }
  saveBasket();
  showToast(`🛒 "${prod.name}" adicionado à cesta!`);
}

function updateItemQty(prodId, delta) {
  const idx = basket.findIndex(item => item.id === prodId);
  if (idx !== -1) {
    basket[idx].quantity += delta;
    if (basket[idx].quantity <= 0) {
      basket.splice(idx, 1);
    }
    saveBasket();
  }
}

function onNeighborhoodChange(val) {
  userNeighborhood = val;
  localStorage.setItem("precomanaus_neighborhood", val);
  localStorage.setItem("precomanaus_loc_source", "manual");
  updateLocationUI({ key: val, neighborhood: DistanceService.neighborhoods[val], source: "manual" });
  renderBasket();
  renderProducts();
}

function populateNeighborhoodSelects() {
  const globalSel = document.getElementById("global-neighborhood-select");
  const manualSel = document.getElementById("cesta-manual-neighborhood-select");

  const zones = {
    "Centro-Sul": [],
    "Norte": [],
    "Leste": [],
    "Sul": [],
    "Oeste": [],
    "Centro-Oeste": []
  };

  Object.entries(DistanceService.neighborhoods).forEach(([key, neigh]) => {
    const z = neigh.zone.includes("Centro-Sul") ? "Centro-Sul"
      : neigh.zone.includes("Norte") ? "Norte"
      : neigh.zone.includes("Leste") ? "Leste"
      : neigh.zone.includes("Sul") ? "Sul"
      : neigh.zone.includes("Oeste") ? "Oeste"
      : neigh.zone.includes("Centro-Oeste") ? "Centro-Oeste"
      : "Centro-Sul";
    if (zones[z]) zones[z].push({ key, ...neigh });
  });

  let optionsHtml = "";
  Object.entries(zones).forEach(([zoneName, list]) => {
    if (list.length > 0) {
      optionsHtml += `<optgroup label="Zona ${zoneName}">`;
      list.forEach(item => {
        optionsHtml += `<option value="${item.key}">${item.name}</option>`;
      });
      optionsHtml += `</optgroup>`;
    }
  });

  if (globalSel) {
    globalSel.innerHTML = optionsHtml;
    globalSel.value = userNeighborhood;
  }
  if (manualSel) {
    manualSel.innerHTML = optionsHtml;
    manualSel.value = userNeighborhood;
  }
}

function toggleManualNeighborhoodSelector(forcedState, reasonText) {
  const container = document.getElementById("cesta-manual-selector-container");
  const reasonEl = document.getElementById("manual-selector-reason");
  const selectEl = document.getElementById("cesta-manual-neighborhood-select");
  if (!container) return;

  const willShow = (typeof forcedState === "boolean")
    ? forcedState
    : (container.style.display === "none" || !container.style.display);

  container.style.display = willShow ? "block" : "none";

  if (willShow) {
    if (reasonEl) {
      reasonEl.textContent = reasonText || "Alterar bairro de referência:";
    }
    if (selectEl) {
      selectEl.value = userNeighborhood;
      selectEl.focus();
    }
  }
}

function onManualNeighborhoodChosen(key) {
  if (!DistanceService.neighborhoods[key]) return;
  userNeighborhood = key;
  localStorage.setItem("precomanaus_neighborhood", key);
  localStorage.setItem("precomanaus_loc_source", "manual");

  updateLocationUI({ key, neighborhood: DistanceService.neighborhoods[key], source: "manual" });
  renderBasket();
  renderProducts();
  toggleManualNeighborhoodSelector(false);

  showToast(`📍 Bairro alterado para: ${DistanceService.neighborhoods[key].name}!`, 3000);
}

function updateLocationUI(closestInfo) {
  const nameEl = document.getElementById("cesta-detected-name");
  const subEl = document.getElementById("cesta-detected-sub");
  const globalSel = document.getElementById("global-neighborhood-select");
  const manualSel = document.getElementById("cesta-manual-neighborhood-select");

  const neigh = closestInfo && closestInfo.neighborhood
    ? closestInfo.neighborhood
    : (DistanceService.neighborhoods[userNeighborhood] || DistanceService.neighborhoods.adrianopolis);

  if (nameEl) nameEl.textContent = neigh.name;

  if (subEl) {
    if (closestInfo && typeof closestInfo.distanceKm === "number") {
      subEl.innerHTML = `📍 Sugerido via GPS (~${closestInfo.distanceKm.toFixed(1)} km) • Zona ${neigh.zone} • Cálculo 100% local`;
    } else if (closestInfo && closestInfo.source === "manual") {
      subEl.innerHTML = `📍 Selecionado manualmente • Zona ${neigh.zone} • Salvo no aparelho`;
    } else {
      const source = localStorage.getItem("precomanaus_loc_source");
      if (source === "gps") {
        subEl.innerHTML = `📍 Sugerido via GPS • Zona ${neigh.zone} • Cálculo 100% local`;
      } else {
        subEl.innerHTML = `📍 Bairro salvo no aparelho • Zona ${neigh.zone} • Funciona offline`;
      }
    }
  }

  if (globalSel) globalSel.value = userNeighborhood;
  if (manualSel) manualSel.value = userNeighborhood;
}

function showLocationPermissionBanner() {
  const banner = document.getElementById("location-permission-banner");
  if (banner) banner.style.display = "block";
}

function hideLocationPermissionBanner() {
  const banner = document.getElementById("location-permission-banner");
  if (banner) banner.style.display = "none";
}

function handleLocationPromptDecision(action) {
  hideLocationPermissionBanner();
  if (action === "allow") {
    detectUserLocation(true);
  } else if (action === "manual") {
    switchTab("screen-cesta", document.querySelectorAll(".nav-btn")[1]);
    toggleManualNeighborhoodSelector(true, "Selecione seu bairro de referência em Manaus:");
  } else if (action === "dismiss") {
    localStorage.setItem("precomanaus_geo_dismissed", "true");
    const currentNeigh = DistanceService.neighborhoods[userNeighborhood] || DistanceService.neighborhoods.adrianopolis;
    showToast(`📍 Mantendo o bairro salvo: ${currentNeigh.name}. Você pode alterar a qualquer momento.`, 2800);
  }
}

function initLocationFlow() {
  const isDismissed = localStorage.getItem("precomanaus_geo_dismissed") === "true";

  if (navigator.permissions && navigator.permissions.query) {
    navigator.permissions.query({ name: "geolocation" }).then(result => {
      if (result.state === "granted") {
        detectUserLocation(false);
      } else if (result.state === "prompt" && !isDismissed) {
        showLocationPermissionBanner();
      } else if (result.state === "denied") {
        const subEl = document.getElementById("cesta-detected-sub");
        const currentNeigh = DistanceService.neighborhoods[userNeighborhood] || DistanceService.neighborhoods.adrianopolis;
        if (subEl) subEl.textContent = `📍 Modo manual • ${currentNeigh.name} (Zona ${currentNeigh.zone})`;
      }
    }).catch(() => {
      if (!isDismissed) showLocationPermissionBanner();
    });
  } else if (!isDismissed) {
    showLocationPermissionBanner();
  }
}

function detectUserLocation(isUserInitiated = false) {
  if (!navigator.geolocation) {
    toggleManualNeighborhoodSelector(true, "Geolocalização não é suportada neste dispositivo. Escolha seu bairro manualmente:");
    if (isUserInitiated) showToast("⚠️ Geolocalização não é suportada por este dispositivo.", 3500);
    return;
  }

  const subEl = document.getElementById("cesta-detected-sub");
  if (subEl) subEl.textContent = "🛰️ Buscando sinal de GPS em Manaus (máx 8s)...";
  if (isUserInitiated) showToast("🛰️ Obtendo sua localização via satélite GPS em Manaus...", 2500);

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const closest = DistanceService.findClosestNeighborhood(lat, lng);

      if (closest.isOutOfManaus) {
        if (subEl) {
          subEl.innerHTML = `⚠️ Fora de Manaus (~${closest.distFromManausCenter} km do centro) • Modo manual ativo`;
        }
        toggleManualNeighborhoodSelector(true, `Você está a mais de 40 km de Manaus (~${closest.distFromManausCenter} km). Selecione o bairro desejado para comparar preços:`);
        showToast(`⚠️ Você está a mais de 40 km de Manaus (~${closest.distFromManausCenter} km). Selecione seu bairro manualmente.`, 4000);
        return;
      }

      userNeighborhood = closest.key;
      localStorage.setItem("precomanaus_neighborhood", closest.key);
      localStorage.setItem("precomanaus_loc_source", "gps");
      localStorage.setItem("precomanaus_last_coords", JSON.stringify({ lat, lng, time: Date.now() }));

      updateLocationUI(closest);
      renderBasket();
      renderProducts();

      toggleManualNeighborhoodSelector(false);
      hideLocationPermissionBanner();
      showToast(`📍 Você está perto de: ${closest.neighborhood.name}!`, 3500);
    },
    (error) => {
      const currentNeigh = DistanceService.neighborhoods[userNeighborhood] || DistanceService.neighborhoods.adrianopolis;
      const subEl = document.getElementById("cesta-detected-sub");

      let errorReason = "Sinal de GPS indisponível. Selecione seu bairro manualmente:";
      if (error.code === 1) {
        errorReason = "Permissão de localização não concedida. Selecione seu bairro manualmente:";
        if (subEl) subEl.textContent = `📍 Permissão não concedida • Mantendo ${currentNeigh.name}`;
        if (isUserInitiated) showToast("⚠️ Permissão de GPS negada. Selecione seu bairro na lista manual.", 3500);
      } else if (error.code === 3) {
        errorReason = "Tempo de GPS esgotado (~8s). Selecione seu bairro manualmente:";
        if (subEl) subEl.textContent = `📍 Tempo esgotado (~8s) • Mantendo ${currentNeigh.name}`;
        if (isUserInitiated) showToast("⚠️ Tempo de GPS esgotado (~8s). Mantendo bairro salvo.", 3000);
      } else if (subEl) {
        subEl.textContent = `📍 GPS indisponível • Mantendo ${currentNeigh.name}`;
      }
      toggleManualNeighborhoodSelector(true, errorReason);
    },
    { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
  );
}

function onCutoffChange(val) {
  const num = parseFloat(val);
  if (!isNaN(num) && num >= 0) {
    minSplitCutoff = num;
    localStorage.setItem("precomanaus_cutoff", num.toString());
    renderBasket();
  }
}

function toggleCheckItem(itemId) {
  checklistState[itemId] = !checklistState[itemId];
  localStorage.setItem("precomanaus_checklist", JSON.stringify(checklistState));
  renderBasket();
}

function clearBasket() {
  if (confirm("Deseja esvaziar sua cesta de compras?")) {
    basket = [];
    checklistState = {};
    localStorage.removeItem("precomanaus_checklist");
    saveBasket();
  }
}

function renderBasket() {
  const strategyContainer = document.getElementById("smart-strategy-container");
  const rankingsContainer = document.getElementById("basket-rankings");
  const itemsContainer = document.getElementById("basket-items-container");
  const cutoffInput = document.getElementById("cutoff-input");

  updateLocationUI();
  if (cutoffInput) cutoffInput.value = minSplitCutoff.toFixed(2);
  if (!rankingsContainer || !itemsContainer) return;

  if (basket.length === 0) {
    if (strategyContainer) strategyContainer.innerHTML = "";
    rankingsContainer.innerHTML = `<p style="font-size:13px; color:var(--text-secondary); padding: 0 16px;">Adicione itens na aba "Preços" para rodar o otimizador inteligente de compras em Manaus.</p>`;
    itemsContainer.innerHTML = `<p style="font-size:13px; color:var(--text-secondary); text-align:center; padding:20px;">Sua cesta está vazia.</p>`;
    return;
  }

  const opt = ShoppingOptimizer.optimize({
    basket,
    products: PRODUCTS,
    supermarkets: SUPERMARKETS,
    userNeighborhood,
    minSplitSavingsCutoff: minSplitCutoff,
    costPerKm: 1.50
  });

  if (!opt) return;

  if (opt.strategy === "SPLIT_STORES" && opt.bestSplit) {
    const split = opt.bestSplit;
    strategyContainer.innerHTML = `
      <div class="smart-strategy-card" style="border-color: #2E7D32;">
        <div class="strategy-badge" style="background:#E8F5E9; color:#2E7D32;">
          🚀 Dividir em 2 Mercados Compensou!
        </div>
        <h3 class="strategy-title">
          Compre no ${split.store1Name} + ${split.store2Name}
        </h3>
        <p class="strategy-desc">
          Mesmo gastando combustível extra (+R$ ${split.extraTravelCost.toFixed(2).replace('.', ',')} para rodar ${split.routeKm} km), sua <b>economia líquida é de R$ ${split.netSavings.toFixed(2).replace('.', ',')}</b>, superando seu corte mínimo de R$ ${opt.cutoff.toFixed(2).replace('.', ',')}.
        </p>

        <div class="metrics-grid">
          <div class="metric-box">
            <div class="metric-label">Total Produtos</div>
            <div class="metric-val">R$ ${split.productTotal.toFixed(2).replace('.', ',')}</div>
          </div>
          <div class="metric-box">
            <div class="metric-label">Deslocamento</div>
            <div class="metric-val">R$ ${split.travelCost.toFixed(2).replace('.', ',')}</div>
          </div>
          <div class="metric-box" style="background:#E8F5E9;">
            <div class="metric-label" style="color:#2E7D32;">Economia Líquida</div>
            <div class="metric-val highlight">+ R$ ${split.netSavings.toFixed(2).replace('.', ',')}</div>
          </div>
        </div>

        <div style="font-size:13px; font-weight:800; margin-top:10px; color:var(--text);">
          📝 Roteiro de Compras Dividido:
        </div>

        <div class="split-stores-container">
          <div class="split-store-block">
            <div class="split-store-header">
              <div class="split-store-name">
                <span class="dot" style="background:${split.store1Color}"></span>
                <span>1º Parada: ${split.store1Name}</span>
              </div>
              <span style="font-weight:800; font-size:13px; color:#0F6D44;">R$ ${split.store1Subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="split-items-list">
              ${split.store1Items.map(it => {
                const isChecked = Boolean(checklistState[it.id]);
                return `
                  <div class="checklist-row ${isChecked ? 'checked' : ''}">
                    <label style="display:flex; align-items:center; cursor:pointer; flex:1;">
                      <input type="checkbox" class="check-box-input" ${isChecked ? 'checked' : ''} onchange="toggleCheckItem('${it.id}')">
                      <span class="item-text">${it.quantity}x ${it.name}</span>
                    </label>
                    <span style="font-weight:700; font-size:12px;">R$ ${it.totalPrice.toFixed(2).replace('.', ',')}</span>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <div class="split-store-block">
            <div class="split-store-header">
              <div class="split-store-name">
                <span class="dot" style="background:${split.store2Color}"></span>
                <span>2º Parada: ${split.store2Name}</span>
              </div>
              <span style="font-weight:800; font-size:13px; color:#0F6D44;">R$ ${split.store2Subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="split-items-list">
              ${split.store2Items.map(it => {
                const isChecked = Boolean(checklistState[it.id]);
                return `
                  <div class="checklist-row ${isChecked ? 'checked' : ''}">
                    <label style="display:flex; align-items:center; cursor:pointer; flex:1;">
                      <input type="checkbox" class="check-box-input" ${isChecked ? 'checked' : ''} onchange="toggleCheckItem('${it.id}')">
                      <span class="item-text">${it.quantity}x ${it.name}</span>
                    </label>
                    <span style="font-weight:700; font-size:12px;">R$ ${it.totalPrice.toFixed(2).replace('.', ',')}</span>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    const single = opt.bestSingle;
    const splitInfo = opt.bestSplit;
    const splitWhy = splitInfo
      ? `Dividir entre 2 mercados traria economia de apenas R$ ${splitInfo.grossSavings.toFixed(2).replace('.', ',')} em produtos, mas você gastaria R$ ${splitInfo.extraTravelCost.toFixed(2).replace('.', ',')} a mais em deslocamento (abaixo da sua meta de R$ ${opt.cutoff.toFixed(2).replace('.', ',')}).`
      : `Nenhuma combinação de dois mercados supera a conveniência e preço de loja única.`;

    strategyContainer.innerHTML = `
      <div class="smart-strategy-card" style="border-color: #0F6D44;">
        <div class="strategy-badge">
          🏆 Fazer Tudo em 1 Loja Vale Mais a Pena
        </div>
        <h3 class="strategy-title">
          Compre tudo no ${single.storeName}
        </h3>
        <p class="strategy-desc">
          ${splitWhy} É mais rápido, menos cansativo e financeiramente mais vantajoso!
        </p>

        <div class="metrics-grid">
          <div class="metric-box">
            <div class="metric-label">Total Produtos</div>
            <div class="metric-val">R$ ${single.productTotal.toFixed(2).replace('.', ',')}</div>
          </div>
          <div class="metric-box">
            <div class="metric-label">Deslocamento (${single.roundtripKm}km)</div>
            <div class="metric-val">R$ ${single.travelCost.toFixed(2).replace('.', ',')}</div>
          </div>
          <div class="metric-box" style="background:#E8F5E9;">
            <div class="metric-label" style="color:#0F6D44;">Custo Final Total</div>
            <div class="metric-val highlight">R$ ${single.finalCost.toFixed(2).replace('.', ',')}</div>
          </div>
        </div>

        <div style="background:#F0F4F1; border-radius:10px; padding:10px 12px; margin-top:8px;">
          <div style="font-size:12px; font-weight:700; margin-bottom:6px;">Checklist rápido para as compras:</div>
          ${single.items.map(it => {
            const isChecked = Boolean(checklistState[it.id]);
            return `
              <div class="checklist-row ${isChecked ? 'checked' : ''}">
                <label style="display:flex; align-items:center; cursor:pointer; flex:1;">
                  <input type="checkbox" class="check-box-input" ${isChecked ? 'checked' : ''} onchange="toggleCheckItem('${it.id}')">
                  <span class="item-text">${it.quantity}x ${it.name}</span>
                </label>
                <span style="font-weight:700; font-size:12px;">R$ ${it.totalPrice.toFixed(2).replace('.', ',')}</span>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  const bestSingleCost = opt.bestSingle.finalCost;
  rankingsContainer.innerHTML = opt.allSingleRankings.map((st, idx) => {
    const isWinner = idx === 0;
    const diff = st.finalCost - bestSingleCost;
    return `
      <div class="store-card ${isWinner ? 'winner' : ''}">
        <div style="display:flex; align-items:center; gap:10px;">
          ${getStoreAvatarHtml(st.storeKey)}
          <div>
            <div style="font-size:14px; font-weight:700;">${st.storeName}</div>
            <div style="font-size:11px; color:${isWinner ? 'var(--green-best)' : 'var(--text-secondary)'};">
              Produtos: R$ ${st.productTotal.toFixed(2).replace('.', ',')} • Ida/volta: ${st.roundtripKm}km (~R$ ${st.travelCost.toFixed(2).replace('.', ',')})
            </div>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:15px; font-weight:800; color:${isWinner ? 'var(--green-best)' : 'var(--text)'};">
            R$ ${st.finalCost.toFixed(2).replace('.', ',')}
          </div>
          <div style="font-size:11px; color:${isWinner ? 'var(--green-best)' : '#D32F2F'}; font-weight:700;">
            ${isWinner ? '★ 1º Lugar' : `+ R$ ${diff.toFixed(2).replace('.', ',')}`}
          </div>
        </div>
      </div>
    `;
  }).join("");

  itemsContainer.innerHTML = basket.map(item => `
    <div class="basket-item-row">
      <div style="display:flex; align-items:center; gap:10px;">
        <img src="${getProductImageUrl(item)}" alt="${item.name}" style="width:38px; height:38px; border-radius:10px; object-fit:cover; border:1px solid rgba(0,0,0,0.06);">
        <div>
          <div style="font-size:14px; font-weight:700;">${item.name}</div>
          <div style="font-size:11px; color:var(--text-secondary);">${item.brand} • ${item.unit}</div>
        </div>
      </div>
      <div class="item-controls">
        <button class="qty-btn" onclick="updateItemQty('${item.id}', -1)">-</button>
        <span style="font-size:14px; font-weight:700; width:18px; text-align:center;">${item.quantity}</span>
        <button class="qty-btn" onclick="updateItemQty('${item.id}', 1)">+</button>
      </div>
    </div>
  `).join("");
}

// 4. ALERTAS DE PREÇO E ENCARTES (IMPLEMENTAÇÃO COMPLETA)
function renderAlerts() {
  const container = document.getElementById("alerts-container");
  const innerContainer = document.getElementById("community-alerts-container");

  const html = alerts.length === 0
    ? `<div style="text-align:center; padding:24px; color:var(--text-secondary); font-size:13px;">Nenhum alerta configurado. Clique em "+ Novo Alerta" para monitorar quedas de preço em Manaus.</div>`
    : alerts.map((al, idx) => {
        const prod = PRODUCTS.find(p => p.id === al.productId);
        const best = prod ? getBestPrice(prod) : null;
        const isReached = best && best.price <= al.targetPrice;

        return `
          <div class="product-card" style="margin-bottom:10px; border-left: 4px solid ${isReached ? 'var(--green-best)' : 'var(--accent)'};">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div>
                <span class="cat-badge" style="background:${isReached ? '#E8F5E9' : '#FFF3E0'}; color:${isReached ? '#2E7D32' : '#E65100'};">
                  ${isReached ? '🔥 Meta Atingida!' : '⏳ Monitorando em Manaus'}
                </span>
                <h4 style="font-size:14px; font-weight:800; margin-top:6px;">${al.productName}</h4>
                <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">
                  Meta desejada: <b>R$ ${Number(al.targetPrice).toFixed(2).replace('.', ',')}</b>
                  ${best ? ` • Menor hoje: <b style="color:var(--green-best);">R$ ${best.price.toFixed(2).replace('.', ',')} (${best.storeName})</b>` : ""}
                </div>
              </div>
              <button class="btn-text" style="color:#D32F2F; font-size:12px;" onclick="deleteAlert(${idx})">Excluir</button>
            </div>
          </div>
        `;
      }).join("");

  if (container) container.innerHTML = html;
  if (innerContainer) innerContainer.innerHTML = html;
}

function deleteAlert(idx) {
  alerts.splice(idx, 1);
  saveAlerts();
  showToast("🗑️ Alerta removido.");
}

function openAlertModal(preselectedProductId = "") {
  const modal = document.getElementById("generic-modal");
  const title = document.getElementById("modal-title");
  const content = document.getElementById("modal-content");
  if (!modal || !content) return;

  const targetProd = PRODUCTS.find(p => p.id === preselectedProductId) || PRODUCTS[0];
  const best = getBestPrice(targetProd);
  const suggestedTarget = best ? (best.price * 0.92).toFixed(2) : "15.00";

  title.textContent = "🔔 Criar Alerta de Preço em Manaus";
  content.innerHTML = `
    <form onsubmit="handleCreateAlertSubmit(event)">
      <div class="form-group">
        <label>Produto para Monitorar:</label>
        <select id="alert-product-select" class="form-control" required>
          ${PRODUCTS.map(p => `<option value="${p.id}" ${p.id === targetProd.id ? "selected" : ""}>${p.name} (${p.brand})</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label>Avise-me quando custar menos de (R$):</label>
        <input type="number" id="alert-target-price" class="form-control" step="0.01" min="0.50" value="${suggestedTarget}" required>
      </div>
      <button type="submit" class="btn-submit">Ativar Alerta de Oferta</button>
    </form>
  `;
  modal.classList.add("open");
}

function openProductAlertModal(prodId) {
  openAlertModal(prodId);
}

function closeModal() {
  const modal = document.getElementById("generic-modal");
  if (modal) modal.classList.remove("open");
}

function handleCreateAlertSubmit(event) {
  event.preventDefault();
  const prodId = document.getElementById("alert-product-select").value;
  const targetVal = parseFloat(document.getElementById("alert-target-price").value);
  const prod = PRODUCTS.find(p => p.id === prodId);
  if (!prod || isNaN(targetVal)) return;

  alerts.unshift({
    id: Date.now(),
    productId: prod.id,
    productName: prod.name,
    targetPrice: targetVal
  });
  saveAlerts();
  closeModal();
  showToast(`🔔 Alerta criado para ${prod.name} (<= R$ ${targetVal.toFixed(2).replace('.', ',')})!`);
}

function renderFlyers() {
  const container = document.getElementById("flyers-container");
  const subContainer = document.getElementById("flyers-container-sub");
  const flyerBanners = [
    "web/assets/cat_fruits.jpg",
    "web/assets/cat_staples.jpg",
    "web/assets/cat_meats.jpg",
    "web/assets/cat_dairy.jpg",
    "web/assets/cat_cleaning.jpg"
  ];

  const html = FLYERS.map((f, idx) => {
    const bannerImg = flyerBanners[idx % flyerBanners.length];
    return `
    <div class="product-card" style="margin-bottom:12px; border-top: 4px solid ${f.color || 'var(--primary)'};">
      <div class="flyer-visual-banner" style="background-image: url('${bannerImg}');">
        <span style="background:rgba(15,109,68,0.92); color:#fff; font-size:10px; font-weight:800; padding:3px 9px; border-radius:20px; backdrop-filter:blur(4px);">● ${f.validity}</span>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span class="cat-badge" style="display:inline-flex; align-items:center; gap:5px;">
          ${f.storeKey ? getStoreAvatarHtml(f.storeKey) : ""}
          ${f.store}
        </span>
      </div>
      <h3 style="font-size:15px; font-weight:800; margin:6px 0;">${f.title}</h3>
      <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:6px;">
        ${f.tags.map(t => `<span class="ean-chip" style="font-size:11px;">🏷️ ${t}</span>`).join("")}
      </div>
      ${f.storeKey ? `
        <div style="margin-top:10px;">
          <button class="btn-text" style="color:var(--primary); font-weight:700; font-size:12px;" onclick="selectMarket('${f.storeKey}'); switchTab('screen-monitor', document.querySelectorAll('.nav-btn')[0]);">
            Ver todas as ofertas do ${f.store} →
          </button>
        </div>
      ` : ""}
    </div>
  `;
  }).join("");

  if (container) container.innerHTML = html;
  if (subContainer) subContainer.innerHTML = html;
}

const AlertService = {
  init() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js")
        .then(reg => console.log("Service Worker ativo:", reg.scope))
        .catch(err => console.warn("SW:", err));
    }
    this.checkPriceDropsOnStartup();
  },

  checkPriceDropsOnStartup() {
    if (!alerts || alerts.length === 0) return;
    const drops = [];

    alerts.forEach(al => {
      const prod = PRODUCTS.find(p => p.id === al.productId);
      if (prod) {
        const best = getBestPrice(prod);
        if (best && best.price <= al.targetPrice) {
          drops.push({
            name: prod.name,
            target: al.targetPrice,
            current: best.price,
            store: best.storeName
          });
        }
      }
    });

    if (drops.length > 0 && navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "PRICE_ALERT_NOTIFICATION",
        title: `🔥 Oferta em Manaus! (${drops.length} produto${drops.length > 1 ? "s" : ""})`,
        body: `${drops[0].name} atingiu R$ ${drops[0].current.toFixed(2).replace('.', ',')} no ${drops[0].store}!`
      });
    }
  }
};

// 5. TOAST, REDE E ÁUDIO
function showToast(msg, duration = 3000) {
  const toast = document.getElementById("app-toast");
  if (!toast) return;
  toast.innerHTML = msg;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

let isOfflineSimulated = false;

function updateNetworkStatus() {
  const isOnline = navigator.onLine && !isOfflineSimulated;
  const dot = document.getElementById("status-dot");
  const text = document.getElementById("status-text");
  const banner = document.getElementById("offline-banner");

  if (dot) dot.className = isOnline ? "status-dot" : "status-dot offline";
  if (text) text.textContent = isOnline ? "Online" : "Offline (Local)";
  if (banner) banner.style.display = isOnline ? "none" : "flex";
}

function toggleOfflineSimulation() {
  isOfflineSimulated = !isOfflineSimulated;
  updateNetworkStatus();
  showToast(isOfflineSimulated ? "📴 Modo Offline ativado! Consultando cotações locais salvas no celular." : "📶 Conexão online restabelecida.");
}

window.addEventListener("online", updateNetworkStatus);
window.addEventListener("offline", updateNetworkStatus);

function playBeep() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1760, ctx.currentTime);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (_) {}
}

// 6. SCANNER DE CÓDIGO DE BARRAS (EAN-13)
let activeCameraStream = null;

function openScannerModal() {
  document.getElementById("scanner-modal").classList.add("open");
  startScannerCamera("scanner-video");
}

function closeScannerModal() {
  document.getElementById("scanner-modal").classList.remove("open");
  stopCameraStream();
}

function startScannerCamera(videoId = "scanner-video") {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      .then(stream => {
        activeCameraStream = stream;
        const vid = document.getElementById(videoId);
        if (vid) {
          vid.srcObject = stream;
          vid.play().catch(() => {});
        }
      })
      .catch(() => {
        showToast("📷 Câmera indisponível neste navegador. Use a busca por EAN ou os atalhos abaixo.");
      });
  }
}

function stopCameraStream() {
  if (activeCameraStream) {
    activeCameraStream.getTracks().forEach(track => track.stop());
    activeCameraStream = null;
  }
}

function toggleCameraStream(videoId = "screen-scanner-video") {
  if (activeCameraStream) {
    stopCameraStream();
    showToast("Câmera pausada.");
  } else {
    startScannerCamera(videoId);
    showToast("Câmera ativada. Aponte para o código.");
  }
}

function lookupBarcode(codeOrQuery, targetContainerId = "scanner-result") {
  if (!codeOrQuery || !codeOrQuery.trim()) return;
  const clean = String(codeOrQuery).trim().toLowerCase();

  const prod = PRODUCTS.find(p =>
    p.ean === clean ||
    p.id === clean ||
    p.name.toLowerCase().includes(clean) ||
    p.brand.toLowerCase().includes(clean)
  );

  const container = document.getElementById(targetContainerId);
  if (!container) return;

  if (!prod) {
    container.innerHTML = `
      <div style="background:#FFF3E0; border:1px solid #FFE0B2; border-radius:12px; padding:12px; text-align:center;">
        <div style="font-size:24px; margin-bottom:4px;">🔍</div>
        <div style="font-size:13px; font-weight:700; color:#E65100;">Código "${codeOrQuery}" não localizado</div>
        <p style="font-size:11px; color:var(--text-secondary); margin-top:4px;">
          Deseja cadastrar e fiscalizar este produto na aba <b>Colaborar</b>?
        </p>
        <button class="btn-add" style="margin-top:8px; width:100%; justify-content:center;" onclick="openContributionModal()">
          + Cadastrar Preço com Foto
        </button>
      </div>
    `;
    return;
  }

  playBeep();

  const best = getBestPrice(prod);
  const dist = DistanceService.getNeighborhoodToStoreKm(userNeighborhood, best.storeKey);
  const fuel = DistanceService.calculateFuelCost(dist * 2);

  const storeRows = Object.entries(prod.prices).map(([mKey, mData]) => {
    const isBest = mKey === best.storeKey;
    const sDist = DistanceService.getNeighborhoodToStoreKm(userNeighborhood, mKey);
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid var(--border); font-size:12px; ${isBest ? 'font-weight:bold; color:var(--green-best);' : ''}">
        <div style="display:flex; align-items:center; gap:6px;">
          <span class="dot" style="background:${SUPERMARKETS[mKey].color}"></span>
          <span>${SUPERMARKETS[mKey].name} (${sDist}km)</span>
        </div>
        <span>R$ ${mData.price.toFixed(2).replace('.', ',')}</span>
      </div>
    `;
  }).join("");

  container.innerHTML = `
    <div class="product-card" style="border:2px solid var(--green-best); background:#FAFDFB; margin-top:10px;">
      <div class="card-top">
        <span class="cat-badge">${prod.category}</span>
        <span style="font-size:11px; font-weight:700; color:var(--green-best);">✅ EAN: ${prod.ean}</span>
      </div>
      <div class="prod-body">
        <div class="prod-thumb-box">
          <img src="${getProductImageUrl(prod)}" alt="${prod.name}" class="prod-thumb-img">
          <span class="prod-mini-emoji">${prod.icon}</span>
        </div>
        <div class="prod-info">
          <h3 class="prod-name">${prod.name}</h3>
          <p class="prod-meta">${prod.brand} • ${prod.unit}</p>
        </div>
      </div>

      <div class="best-price-box" style="margin-top:8px;">
        <div>
          <div class="best-label">★ Menor Preço em Manaus</div>
          <div class="best-store">${best.storeName}</div>
          <div class="best-neighborhood">📍 ${dist} km do seu bairro (~R$ ${fuel.toFixed(2).replace('.', ',')} gasolina)</div>
        </div>
        <div class="best-amount">
          <div class="best-price-value">R$ ${best.price.toFixed(2).replace('.', ',')}</div>
          <div class="worst-comp">vs R$ ${best.worstPrice.toFixed(2).replace('.', ',')}</div>
        </div>
      </div>

      <div style="margin:10px 0; background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:8px 10px;">
        <div style="font-size:11px; font-weight:800; color:var(--text-secondary); text-transform:uppercase; margin-bottom:4px;">
          Comparativo nas 6 Redes de Manaus:
        </div>
        ${storeRows}
      </div>

      <div style="display:flex; gap:8px;">
        <button class="btn-text" style="flex:1; border:1px solid var(--border); border-radius:8px; font-weight:700; color:#1976D2;" onclick="openHistoryModal('${prod.id}')">
          📊 Histórico
        </button>
        <button class="btn-text" style="border:1px solid var(--border); border-radius:8px;" onclick="openProductAlertModal('${prod.id}')">
          🔔 Alerta
        </button>
        <button class="btn-add" style="flex:1; justify-content:center;" onclick="addToBasket('${prod.id}')">
          + Cesta
        </button>
      </div>
    </div>
  `;
}

// 7. HISTÓRICO DE PREÇOS & VERIFICADOR DE PROMOÇÃO REAL
function getProductPriceHistory(product) {
  return ShoppingOptimizer.analyzePriceHistory(product, SUPERMARKETS);
}

function renderHistorySvgChart(history) {
  const min = Math.min(...history) * 0.88;
  const max = Math.max(...history) * 1.12;
  const range = max - min || 1;
  const width = 320;
  const height = 120;
  const padding = 20;

  const points = history.map((val, idx) => {
    const x = padding + (idx / (history.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((val - min) / range) * (height - 2 * padding);
    return { x, y, val };
  });

  const pathD = points.map((p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  const pointsSvg = points.map((p, idx) => `
    <circle cx="${p.x}" cy="${p.y}" r="4" fill="${idx === points.length - 1 ? '#2E7D32' : '#0F6D44'}" stroke="#FFFFFF" stroke-width="2"/>
    <text x="${p.x}" y="${p.y - 7}" font-size="9" font-weight="bold" fill="#1C1B1F" text-anchor="middle">R$${p.val.toFixed(2).replace('.', ',')}</text>
  `).join("");

  return `
    <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:130px; overflow:visible;">
      <defs>
        <linearGradient id="gradHistory" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0F6D44" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#0F6D44" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#E0E0E0" stroke-width="1"/>
      <path d="${areaD}" fill="url(#gradHistory)"/>
      <path d="${pathD}" fill="none" stroke="#0F6D44" stroke-width="3" stroke-linecap="round"/>
      ${pointsSvg}
    </svg>
  `;
}

function openHistoryModal(productId) {
  const prod = PRODUCTS.find(p => p.id === productId);
  if (!prod) return;

  const data = getProductPriceHistory(prod);

  document.getElementById("history-modal-title").textContent = `Histórico: ${prod.name}`;
  document.getElementById("history-modal-content").innerHTML = `
    <div style="font-size:12px; color:var(--text-secondary); margin-bottom:8px;">
      ${prod.brand} • ${prod.unit} • EAN ${prod.ean}
    </div>

    <div style="margin-bottom:12px;">
      ${data.statusBadgeHtml}
      <p style="font-size:12px; line-height:1.4; color:var(--text); margin-top:6px; background:#F4F6F8; padding:8px 10px; border-radius:8px;">
        ${data.verdictText}
      </p>
    </div>

    <div style="background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:12px; margin-bottom:12px;">
      <div style="font-size:11px; font-weight:800; color:var(--text-secondary); text-transform:uppercase; margin-bottom:8px;">
        Evolução do Preço nas Últimas 6 Semanas (Manaus):
      </div>
      ${renderHistorySvgChart(data.history)}
      <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-secondary); margin-top:6px;">
        <span>6 sem. atrás</span>
        <span>Hoje (Atual)</span>
      </div>
    </div>

    <div class="metrics-grid" style="margin-bottom:12px;">
      <div class="metric-box">
        <div class="metric-label">Média 60 Dias</div>
        <div class="metric-val">R$ ${data.avgPrice.toFixed(2).replace('.', ',')}</div>
      </div>
      <div class="metric-box">
        <div class="metric-label">Mínimo Histórico</div>
        <div class="metric-val" style="color:var(--green-best);">R$ ${data.minPrice.toFixed(2).replace('.', ',')}</div>
      </div>
      <div class="metric-box">
        <div class="metric-label">Máximo</div>
        <div class="metric-val" style="color:#D32F2F;">R$ ${data.maxPrice.toFixed(2).replace('.', ',')}</div>
      </div>
    </div>

    <div style="display:flex; gap:8px;">
      <button class="btn-add" style="flex:1; justify-content:center;" onclick="addToBasket('${prod.id}'); closeHistoryModal();">
        + Adicionar à Cesta
      </button>
      <button class="btn-text" style="border:1px solid var(--border); padding:8px 12px; border-radius:8px; font-weight:700;" onclick="openProductAlertModal('${prod.id}'); closeHistoryModal();">
        🔔 Monitorar
      </button>
    </div>
  `;

  document.getElementById("history-modal").classList.add("open");
}

function closeHistoryModal() {
  document.getElementById("history-modal").classList.remove("open");
}

// 8. COMUNIDADE, REPUTAÇÃO, GEMINI VISION IA & LEITOR NFC-E SEFAZ-AM
function openContributionModal() {
  const sel = document.getElementById("contrib-product");
  if (sel) {
    sel.innerHTML = PRODUCTS.map(p => `<option value="${p.id}">${p.name} (${p.brand})</option>`).join("");
  }
  document.getElementById("contrib-modal").classList.add("open");
}

function closeContributionModal() {
  document.getElementById("contrib-modal").classList.remove("open");
}

async function previewContribPhoto(input, previewId = "contrib-photo-preview") {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = async function (e) {
      const base64Data = e.target.result;
      const preview = document.getElementById(previewId);
      const img = preview ? preview.querySelector("img") : null;
      if (img) img.src = base64Data;
      if (preview) preview.style.display = "block";

      // Aciona leitura inteligente da etiqueta via Backend / Gemini Vision
      showToast("🤖 Lendo etiqueta com IA PreçoManaus...", 2500);
      const scanRes = await PrecoManausApi.scanLabelWithAi(base64Data, file.name);
      if (scanRes && scanRes.ok) {
        const isScreen = previewId.includes("screen");
        const prodSel = document.getElementById(isScreen ? "contrib-product-screen" : "contrib-product");
        const priceInp = document.getElementById(isScreen ? "contrib-price-screen" : "contrib-price");
        if (prodSel && scanRes.matchedProductId) prodSel.value = scanRes.matchedProductId;
        if (priceInp && scanRes.suggestedPrice) priceInp.value = scanRes.suggestedPrice.toFixed(2);
        showToast(`✨ IA identificou: ${scanRes.productName} (R$ ${scanRes.suggestedPrice.toFixed(2).replace('.', ',')})`, 3500);
      }
    };
    reader.readAsDataURL(file);
  }
}

async function handleContributionSubmit(event, source = "modal") {
  event.preventDefault();

  const isScreen = source === "screen";
  const prodId = document.getElementById(isScreen ? "contrib-product-screen" : "contrib-product").value;
  const storeKey = document.getElementById(isScreen ? "contrib-supermarket-screen" : "contrib-supermarket").value;
  const priceVal = parseFloat(document.getElementById(isScreen ? "contrib-price-screen" : "contrib-price").value);

  if (isNaN(priceVal) || priceVal <= 0) {
    alert("Informe um preço válido.");
    return;
  }

  const prod = PRODUCTS.find(p => p.id === prodId);
  if (!prod) return;

  const oldPrice = prod.prices[storeKey] ? prod.prices[storeKey].price : 20.00;
  if (priceVal < oldPrice * 0.25 || priceVal > oldPrice * 3.0) {
    alert(`⚠️ Atenção: O valor informado (R$ ${priceVal.toFixed(2)}) destoa muito do preço padrão deste item. Por favor revise a digitação.`);
    return;
  }

  if (!prod.prices[storeKey]) {
    prod.prices[storeKey] = { price: priceVal, neighborhood: SUPERMARKETS[storeKey].unit };
  } else {
    prod.prices[storeKey].price = priceVal;
  }

  userReputation.points += 25;
  userReputation.verifiedCount += 1;
  if (userReputation.points >= 500) {
    userReputation.level = "Mestre da Economia Manaus Ouro";
    userReputation.badge = "🥇";
  } else if (userReputation.points >= 250) {
    userReputation.level = "Fiscal do Povo Prata";
    userReputation.badge = "🥈";
  }

  const newEntry = {
    id: Date.now(),
    user: userReputation.name,
    badge: userReputation.badge,
    productName: prod.name,
    storeName: SUPERMARKETS[storeKey].name,
    oldPrice,
    newPrice: priceVal,
    photoUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=60",
    time: "agora mesmo",
    verified: true
  };

  communityContributions.unshift(newEntry);
  saveCommunityState();

  // Sincroniza também com o Backend Node.js
  PrecoManausApi.submitContribution({
    productId: prod.id,
    storeKey,
    price: priceVal,
    user: userReputation.name,
    badge: userReputation.badge
  });

  if (source === "modal") {
    closeContributionModal();
  }

  showToast(`🎉 Preço atualizado no ${SUPERMARKETS[storeKey].name}! Você ganhou +25 pontos de reputação.`);
  playBeep();

  renderProducts();
  renderBasket();
  renderCommunityFeed();
}

// Importador de NFC-e SEFAZ-AM
async function openNfceImportModal() {
  const modal = document.getElementById("generic-modal");
  const title = document.getElementById("modal-title");
  const content = document.getElementById("modal-content");
  if (!modal || !content) return;

  title.textContent = "🧾 Importar Nota Fiscal NFC-e (SEFAZ-AM)";
  content.innerHTML = `
    <p style="font-size:12px; color:var(--text-secondary); margin-bottom:12px;">
      Cole a Chave de Acesso (44 dígitos) ou link do QR Code da sua Nota Fiscal de Consumidor Eletrônica de Manaus para atualizar os preços automaticamente e ganhar <b>+45 pontos</b>!
    </p>
    <form onsubmit="handleNfceImportSubmit(event)">
      <div class="form-group">
        <label>Chave de Acesso (44 dígitos) ou Link SEFAZ-AM:</label>
        <input type="text" id="nfce-key-input" class="form-control" value="13260904123456000189650010001234561001234567" placeholder="Ex: 1326 0904..." required>
      </div>
      <div class="form-group">
        <label>Supermercado Emissor em Manaus:</label>
        <select id="nfce-store-select" class="form-control">
          <option value="nova_era">Nova Era Superatacado</option>
          <option value="atacadao">Atacadão Manaus</option>
          <option value="db">DB Supermercados</option>
          <option value="assai">Assaí Atacadista</option>
          <option value="baratao">Baratão da Carne</option>
          <option value="carrefour">Carrefour Manaus</option>
        </select>
      </div>
      <button type="submit" class="btn-submit">Importar Preços da NFC-e (+45 pts)</button>
    </form>
  `;
  modal.classList.add("open");
}

async function handleNfceImportSubmit(event) {
  event.preventDefault();
  const keyVal = document.getElementById("nfce-key-input").value;
  const storeKey = document.getElementById("nfce-store-select").value;

  showToast("🛰️ Consultando NFC-e SEFAZ-AM...", 2000);
  const res = await PrecoManausApi.parseNfce(keyVal, storeKey);

  if (res && res.ok) {
    // Atualiza catálogo local com os preços vindos da NFC-e
    (res.items || []).forEach(it => {
      const p = PRODUCTS.find(prod => prod.id === it.productId);
      if (p && p.prices[res.storeKey]) {
        p.prices[res.storeKey].price = it.nfcePrice;
      }
      communityContributions.unshift({
        id: Date.now() + Math.random(),
        user: `${userReputation.name} (NFC-e SEFAZ-AM)`,
        badge: "🧾",
        productName: it.productName,
        storeName: res.storeName,
        oldPrice: it.oldPrice,
        newPrice: it.nfcePrice,
        photoUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=120&auto=format&fit=crop&q=60",
        time: "importado via NFC-e",
        verified: true
      });
    });

    userReputation.points += (res.pointsEarned || 45);
    userReputation.verifiedCount += (res.importedCount || 3);
    saveCommunityState();
    closeModal();
    playBeep();
    renderProducts();
    renderBasket();
    renderCommunityFeed();
    showToast(`🧾 ${res.message}`, 4500);
  } else {
    showToast("⚠️ Servidor offline. Importando nota fiscal em modo local...", 3000);
    closeModal();
  }
}

function renderCommunityFeed() {
  const scrSelect = document.getElementById("contrib-product-screen");
  if (scrSelect && scrSelect.children.length === 0) {
    scrSelect.innerHTML = PRODUCTS.map(p => `<option value="${p.id}">${p.name} (${p.brand})</option>`).join("");
  }

  const repBar = document.getElementById("comunidade-rep-bar");
  if (repBar) {
    repBar.innerHTML = `
      <div class="reputation-icon">${userReputation.badge}</div>
      <div class="reputation-info" style="flex:1;">
        <div class="reputation-title">${userReputation.level} (${userReputation.name})</div>
        <div class="reputation-sub">${userReputation.points} pontos acumulados • ${userReputation.verifiedCount} preços validados em Manaus</div>
      </div>
      <button type="button" class="btn-add" style="font-size:11px; padding:6px 10px;" onclick="openNfceImportModal()">
        🧾 Ler NFC-e
      </button>
    `;
  }

  const feedCont = document.getElementById("community-feed-container");
  if (feedCont) {
    feedCont.innerHTML = communityContributions.map(c => `
      <div class="contrib-card">
        <img src="${c.photoUrl}" class="contrib-thumb" alt="Etiqueta">
        <div style="flex:1;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:12px; font-weight:800; color:var(--primary);">${c.badge} ${c.user}</span>
            <span style="font-size:10px; color:var(--text-secondary);">${c.time}</span>
          </div>
          <div style="font-size:13px; font-weight:700; margin-top:2px;">${c.productName}</div>
          <div style="font-size:11px; color:var(--text-secondary);">${c.storeName}</div>
          <div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
            <span style="font-size:11px; text-decoration:line-through; color:var(--text-secondary);">R$ ${Number(c.oldPrice).toFixed(2).replace('.', ',')}</span>
            <span style="font-size:14px; font-weight:800; color:var(--green-best);">R$ ${Number(c.newPrice).toFixed(2).replace('.', ',')}</span>
            <span class="regional-tag" style="margin-left:auto;">✅ Auditado</span>
          </div>
        </div>
      </div>
    `).join("");
  }

  renderAlerts();
  renderFlyers();
}

function switchCommunitySubtab(tabId, btn) {
  document.querySelectorAll(".comunidade-tab").forEach(t => t.style.display = "none");
  document.querySelectorAll(".subtab-btn").forEach(b => b.classList.remove("active"));

  const target = document.getElementById(tabId);
  if (target) target.style.display = "block";
  if (btn) btn.classList.add("active");

  if (tabId === "tab-feed" || tabId === "tab-enviar") renderCommunityFeed();
  if (tabId === "tab-alertas-inner") renderAlerts();
  if (tabId === "tab-encartes-inner") renderFlyers();
}

// 9. CESTA BÁSICA MANAUS DIEESE
function renderDieeseIndex() {
  const storeKeys = Object.keys(SUPERMARKETS);
  const storeTotals = {};

  storeKeys.forEach(sKey => {
    let tot = 0;
    DIEESE_12_ITEMS.forEach(it => {
      const prod = PRODUCTS.find(p => p.id === it.id);
      const price = prod && prod.prices[sKey] ? prod.prices[sKey].price : 10.0;
      tot += price * it.qty;
    });
    storeTotals[sKey] = parseFloat(tot.toFixed(2));
  });

  const sortedStores = storeKeys.map(k => ({
    key: k,
    name: SUPERMARKETS[k].name,
    color: SUPERMARKETS[k].color,
    total: storeTotals[k]
  })).sort((a, b) => a.total - b.total);

  const avgTotal = parseFloat((Object.values(storeTotals).reduce((a, b) => a + b, 0) / storeKeys.length).toFixed(2));
  const totalEl = document.getElementById("dieese-total-val");
  if (totalEl) totalEl.textContent = `R$ ${avgTotal.toFixed(2).replace('.', ',')}`;

  const rankContainer = document.getElementById("dieese-store-ranking");
  if (rankContainer) {
    const bestTot = sortedStores[0].total;
    rankContainer.innerHTML = sortedStores.map((st, idx) => {
      const isBest = idx === 0;
      const diff = st.total - bestTot;
      return `
        <div class="store-card ${isBest ? 'winner' : ''}">
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="dot" style="background:${st.color}"></span>
            <div>
              <div style="font-size:14px; font-weight:700;">${st.name}</div>
              <div style="font-size:11px; color:${isBest ? 'var(--green-best)' : 'var(--text-secondary)'};">
                ${isBest ? '★ Supermercado mais barato para a Cesta Básica' : `+ R$ ${diff.toFixed(2).replace('.', ',')} mais caro que o 1º`}
              </div>
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:15px; font-weight:800; color:${isBest ? 'var(--green-best)' : 'var(--text)'};">
              R$ ${st.total.toFixed(2).replace('.', ',')}
            </div>
            <div style="font-size:11px; font-weight:700; color:${isBest ? 'var(--green-best)' : '#D32F2F'};">
              ${idx + 1}º Lugar
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  const itemsBody = document.getElementById("dieese-items-body");
  if (itemsBody) {
    itemsBody.innerHTML = DIEESE_12_ITEMS.map(it => {
      const prod = PRODUCTS.find(p => p.id === it.id);
      const best = prod ? getBestPrice(prod) : { price: 0, storeName: "-" };
      const prices = prod ? Object.values(prod.prices).map(p => p.price) : [0];
      const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
      return `
        <tr>
          <td><b>${it.name}</b></td>
          <td>${it.qty} ${it.unit}</td>
          <td>R$ ${avg.toFixed(2).replace('.', ',')}</td>
          <td style="color:var(--green-best); font-weight:700;">
            R$ ${best.price.toFixed(2).replace('.', ',')} (${best.storeName.split(" ")[0]})
          </td>
        </tr>
      `;
    }).join("");
  }
}

function addAllDieeseToBasket() {
  DIEESE_12_ITEMS.forEach(it => {
    const prod = PRODUCTS.find(p => p.id === it.id);
    if (prod) {
      const existing = basket.find(b => b.id === prod.id);
      if (existing) {
        existing.quantity = Math.max(existing.quantity, Math.ceil(it.qty));
      } else {
        basket.push({
          id: prod.id,
          name: prod.name,
          brand: prod.brand,
          unit: prod.unit,
          category: prod.category,
          quantity: Math.max(1, Math.ceil(it.qty))
        });
      }
    }
  });
  saveBasket();
  showToast("🌾 Todos os 12 itens da Cesta Básica de Manaus foram adicionados!");
  switchTab("screen-cesta", document.querySelectorAll(".nav-btn")[1]);
}

// 10. EXPORTAÇÃO WHATSAPP & SIMULADOR DE ALERTA
function shareBasketOnWhatsApp() {
  if (basket.length === 0) {
    alert("Sua lista de compras está vazia.");
    return;
  }

  const opt = ShoppingOptimizer.optimize({
    basket,
    products: PRODUCTS,
    supermarkets: SUPERMARKETS,
    userNeighborhood,
    minSplitSavingsCutoff: minSplitCutoff,
    costPerKm: 1.50
  });

  if (!opt) return;

  let msg = `🛒 *Lista Inteligente PreçoManaus* 📍 Bairro: ${DistanceService.neighborhoods[userNeighborhood]?.name || userNeighborhood}\n\n`;

  if (opt.strategy === "SPLIT_STORES" && opt.bestSplit) {
    const s = opt.bestSplit;
    msg += `🚀 *Estratégia Otimizada (Dividir em 2 Lojas):*\n`;
    msg += `Economia Líquida: *R$ ${s.netSavings.toFixed(2).replace('.', ',')}*\n\n`;
    msg += `🏪 *1ª Parada: ${s.store1Name}* (R$ ${s.store1Subtotal.toFixed(2).replace('.', ',')}):\n`;
    s.store1Items.forEach(it => { msg += `  • ${it.quantity}x ${it.name} - R$ ${it.totalPrice.toFixed(2).replace('.', ',')}\n`; });
    msg += `\n🏪 *2ª Parada: ${s.store2Name}* (R$ ${s.store2Subtotal.toFixed(2).replace('.', ',')}):\n`;
    s.store2Items.forEach(it => { msg += `  • ${it.quantity}x ${it.name} - R$ ${it.totalPrice.toFixed(2).replace('.', ',')}\n`; });
    msg += `\n⛽ Rota: ${s.routeKm}km (~R$ ${s.travelCost.toFixed(2).replace('.', ',')} combustível)\n`;
    msg += `💰 *Custo Final Total: R$ ${s.finalCost.toFixed(2).replace('.', ',')}*`;
  } else {
    const s = opt.bestSingle;
    msg += `🏆 *Estratégia: Compre tudo no ${s.storeName}*\n`;
    msg += `Total Produtos: R$ ${s.productTotal.toFixed(2).replace('.', ',')}\n`;
    msg += `⛽ Deslocamento (${s.roundtripKm}km): R$ ${s.travelCost.toFixed(2).replace('.', ',')}\n`;
    msg += `💰 *Custo Final: R$ ${s.finalCost.toFixed(2).replace('.', ',')}*\n\n`;
    msg += `*Itens da sua Lista:*\n`;
    s.items.forEach(it => { msg += `  • ${it.quantity}x ${it.name} - R$ ${it.totalPrice.toFixed(2).replace('.', ',')}\n`; });
  }

  msg += `\n\n_Gerado pelo PreçoManaus • Monitor de Preços_`;
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, "_blank");
}

function simulatePriceDrop() {
  let targetAlert = alerts[0];
  if (!targetAlert) {
    targetAlert = {
      id: Date.now(),
      productId: "cafe_pilao_500g",
      productName: "Café Pilão Tradicional 500g",
      targetPrice: 17.50
    };
    alerts.push(targetAlert);
    saveAlerts();
  }

  const prod = PRODUCTS.find(p => p.id === targetAlert.productId);
  if (prod) {
    prod.prices.atacadao.price = parseFloat((targetAlert.targetPrice - 0.60).toFixed(2));
    renderProducts();
    renderAlerts();
    playBeep();

    const notifMsg = `🔥 Oferta Baixou! ${prod.name} caiu para R$ ${prod.prices.atacadao.price.toFixed(2).replace('.', ',')} no Atacadão!`;
    showToast(notifMsg, 5000);

    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "PRICE_ALERT_NOTIFICATION",
        title: `🔥 Oferta Confirmada em Manaus!`,
        body: notifMsg
      });
    }
  }
}

// 11. NAVEGAÇÃO PRINCIPAL E SINCRONIZAÇÃO COM BACKEND
function switchTab(screenId, btnElement) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));

  const target = document.getElementById(screenId);
  if (target) target.classList.add("active");
  if (btnElement) btnElement.classList.add("active");

  window.scrollTo({ top: 0, behavior: "smooth" });

  if (screenId === "screen-monitor") renderProducts();
  if (screenId === "screen-cesta") renderBasket();
  if (screenId === "screen-scanner") lookupBarcode("7891149103112", "screen-scanner-result");
  if (screenId === "screen-indice") renderDieeseIndex();
  if (screenId === "screen-comunidade") renderCommunityFeed();
  if (screenId === "screen-encartes") renderFlyers();
  if (screenId === "screen-alertas") renderAlerts();
}

async function syncWithBackendServer() {
  if (!window.PrecoManausApi) return;
  const data = await PrecoManausApi.fetchCatalog();
  if (data && data.ok && Array.isArray(data.products)) {
    data.products.forEach(serverProd => {
      const localProd = PRODUCTS.find(p => p.id === serverProd.id);
      if (localProd) {
        localProd.prices = serverProd.prices;
        localProd.history = serverProd.history || localProd.history;
      }
    });
    if (Array.isArray(data.contributions) && data.contributions.length > 0) {
      communityContributions = data.contributions;
    }
    renderProducts();
    renderDieeseIndex();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initThemeAndIcons();
  if (window.MarketService && typeof window.MarketService.initBrowserDatabase === "function") {
    window.MarketService.initBrowserDatabase();
  }
  updateNetworkStatus();
  if (window.CITIES_CONFIG && window.CITIES_CONFIG[currentCity]) {
    switchCity(currentCity);
  } else {
    populateNeighborhoodSelects();
    updateLocationUI();
    renderProducts();
    renderDieeseIndex();
    renderFlyers();
  }
  updateBasketBadge();
  renderCommunityFeed();
  renderAlerts();
  AlertService.init();
  syncWithBackendServer();

  setTimeout(() => {
    initLocationFlow();
  }, 1200);
});

// =========================================================================
// ESTÚDIO DE TEMAS (DARK OLED / AMAZÔNIA / CONTRASTE) & PACOTES DE ÍCONES
// =========================================================================
const ICON_PACK_SVGS = {
  duotone: {
    monitor: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5" fill="currentColor" fill-opacity="0.22"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5" fill="currentColor" fill-opacity="0.22"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>`,
    cesta: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1.5"/><circle cx="19" cy="21" r="1.5"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" fill="currentColor" fill-opacity="0.2"/></svg>`,
    scanner: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect x="6" y="7" width="12" height="10" rx="1" fill="currentColor" fill-opacity="0.18"/><path d="M8 10v4"/><path d="M12 10v4"/><path d="M16 10v4"/></svg>`,
    indice: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" fill-opacity="0.18"/><path d="M8 16v-5"/><path d="M12 16V8"/><path d="M16 16v-3"/></svg>`,
    comunidade: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" fill="currentColor" fill-opacity="0.2"/><circle cx="9" cy="7" r="4" fill="currentColor" fill-opacity="0.2"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
  },
  outline: {
    monitor: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>`,
    cesta: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
    scanner: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>`,
    indice: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
    comunidade: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
  },
  "3d": {
    monitor: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>`,
    cesta: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1.5"/><circle cx="19" cy="21" r="1.5"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`,
    scanner: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 8v8"/><path d="M12 8v8"/><path d="M16 8v8"/></svg>`,
    indice: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>`,
    comunidade: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
  }
};

function openThemeModal() {
  const modal = document.getElementById("theme-studio-modal");
  if (modal) modal.classList.add("active");
}

function closeThemeModal() {
  const modal = document.getElementById("theme-studio-modal");
  if (modal) modal.classList.remove("active");
}

function setAppTheme(themeName, silent = false) {
  const valid = ["light", "dark", "midnight", "contrast"].includes(themeName) ? themeName : "light";
  document.documentElement.setAttribute("data-theme", valid);
  localStorage.setItem("precobrasil_theme", valid);

  const iconEl = document.getElementById("header-theme-icon");
  if (iconEl) {
    iconEl.textContent = valid === "light" ? "🌙" : valid === "dark" ? "☀️" : valid === "midnight" ? "🌌" : "⚡";
  }

  document.querySelectorAll(".theme-option-card").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-theme-choice") === valid);
  });

  if (!silent && typeof showToast === "function") {
    const labels = { light: "☀️ Tema Claro Esmeralda", dark: "🌙 Tema Escuro OLED", midnight: "🌌 Tema Amazônia Noturno", contrast: "⚡ Tema Alto Contraste" };
    showToast(`${labels[valid]} ativado!`);
  }
}

function setIconPack(packName, silent = false) {
  const valid = ["duotone", "outline", "3d"].includes(packName) ? packName : "duotone";
  document.documentElement.setAttribute("data-icon-pack", valid);
  localStorage.setItem("precobrasil_icon_pack", valid);

  const pack = ICON_PACK_SVGS[valid] || ICON_PACK_SVGS.duotone;
  const mapIds = {
    "nav-icon-monitor": pack.monitor,
    "nav-icon-cesta": pack.cesta,
    "nav-icon-scanner": pack.scanner,
    "nav-icon-indice": pack.indice,
    "nav-icon-comunidade": pack.comunidade
  };
  Object.entries(mapIds).forEach(([id, svg]) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = svg;
  });

  document.querySelectorAll(".icon-pack-card").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-icon-choice") === valid);
  });

  if (!silent && typeof showToast === "function") {
    const labels = { duotone: "✨ Ícones Lucide Duotone", outline: "🎯 Ícones Minimal Outline", "3d": "🎨 Ícones 3D Vibrante" };
    showToast(`${labels[valid]} aplicado!`);
  }
}

function initThemeAndIcons() {
  const savedTheme = localStorage.getItem("precobrasil_theme") || "light";
  const savedPack = localStorage.getItem("precobrasil_icon_pack") || "duotone";
  setAppTheme(savedTheme, true);
  setIconPack(savedPack, true);
}

// =========================================================================
// AGENTE IA PREÇOBRASIL (Vercel AI SDK ToolLoopAgent + MarketService)
// =========================================================================
function openAiAgentModal() {
  const modal = document.getElementById("ai-agent-modal");
  if (modal) modal.classList.add("active");
}

function closeAiAgentModal() {
  const modal = document.getElementById("ai-agent-modal");
  if (modal) modal.classList.remove("active");
}

function askAiAgentChip(text) {
  const input = document.getElementById("ai-agent-input");
  if (input) {
    input.value = text;
    submitAiAgentPrompt({ preventDefault: () => {} });
  }
}

function formatAgentMarkdown(text) {
  return String(text || "")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\_(.*?)\_/g, "<em>$1</em>")
    .replace(/\`(.*?)\`/g, "<code style='background:rgba(0,0,0,0.06);padding:1px 4px;border-radius:4px;'>$1</code>")
    .replace(/\n/g, "<br>");
}

async function submitAiAgentPrompt(event) {
  if (event && event.preventDefault) event.preventDefault();
  const input = document.getElementById("ai-agent-input");
  const container = document.getElementById("ai-agent-messages");
  const btn = document.getElementById("ai-agent-send-btn");
  if (!input || !container) return;

  const prompt = input.value.trim();
  if (!prompt) return;
  input.value = "";

  // Mensagem do usuário
  const userBubble = document.createElement("div");
  userBubble.style.cssText = "align-self:flex-end; background:var(--primary); color:#fff; border-radius:12px 12px 2px 12px; padding:10px 12px; font-size:13px; max-width:85%; font-weight:600;";
  userBubble.textContent = prompt;
  container.appendChild(userBubble);

  // Indicador de carregamento
  const loadingBubble = document.createElement("div");
  loadingBubble.style.cssText = "align-self:flex-start; background:var(--surface-variant); border:1px solid var(--border); border-radius:12px; padding:10px 12px; font-size:12px; color:var(--text-secondary);";
  loadingBubble.innerHTML = "⏳ <strong>ToolLoopAgent</strong> consultando <code>MarketService</code> e catálogo...";
  container.appendChild(loadingBubble);
  container.scrollTop = container.scrollHeight;

  if (btn) btn.disabled = true;

  try {
    const cityObj = window.CITIES_CONFIG && window.CITIES_CONFIG[currentCity];
    const capitalKey = (cityObj && cityObj.canonicalKey) || currentCity || "AM-Manaus";

    const res = await fetch("/api/agent/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, capitalKey })
    });

    const data = await res.json();
    loadingBubble.remove();

    const botBubble = document.createElement("div");
    botBubble.style.cssText = "align-self:flex-start; background:var(--surface-variant); border:1px solid var(--border); border-radius:12px 12px 12px 2px; padding:12px; font-size:13px; color:var(--text); max-width:95%; line-height:1.48;";

    let marketsHtml = "";
    if (Array.isArray(data.markets) && data.markets.length > 0) {
      marketsHtml = `
        <div style="display:flex; gap:6px; overflow-x:auto; margin-top:10px; padding-bottom:4px;">
          ${data.markets.slice(0, 8).map(m => `
            <div style="display:flex; align-items:center; gap:5px; background:var(--surface); color:var(--text); border:1px solid var(--border); border-radius:999px; padding:3px 9px 3px 4px; white-space:nowrap; font-size:11px; font-weight:700;">
              <img src="${m.logo}" alt="${m.nome}" onerror="this.src='web/assets/logos/default-market.svg'" style="width:18px; height:18px; border-radius:50%; object-fit:contain; background:#fff;">
              <span>${m.nome}</span>
            </div>
          `).join("")}
        </div>
      `;
    }

    let productsHtml = "";
    if (Array.isArray(data.recommendedProducts) && data.recommendedProducts.length > 0) {
      productsHtml = `
        <div style="display:flex; flex-direction:column; gap:6px; margin-top:10px;">
          ${data.recommendedProducts.map(p => `
            <div style="display:flex; justify-content:space-between; align-items:center; background:var(--surface); color:var(--text); border:1px solid var(--border); border-radius:10px; padding:8px 10px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <img src="${p.marketLogo}" alt="${p.marketName}" onerror="this.src='web/assets/logos/default-market.svg'" style="width:24px; height:24px; border-radius:6px; object-fit:contain; background:#fff;">
                <div>
                  <div style="font-size:12px; font-weight:800;">${p.name}</div>
                  <div style="font-size:11px; color:var(--text-secondary);">${p.marketName} • <strong style="color:var(--green-best);">R$ ${Number(p.bestPrice).toFixed(2).replace(".", ",")}</strong></div>
                </div>
              </div>
              <button type="button" class="btn-add" style="padding:5px 10px; font-size:11px;" onclick="addToBasket('${p.id}')">+ Cesta</button>
            </div>
          `).join("")}
        </div>
      `;
    }

    botBubble.innerHTML = `
      <div>${formatAgentMarkdown(data.reply || "Consulta concluída!")}</div>
      ${marketsHtml}
      ${productsHtml}
    `;
    container.appendChild(botBubble);
  } catch (err) {
    loadingBubble.innerHTML = "⚠️ Erro ao consultar o Agente IA: " + err.message;
  } finally {
    if (btn) btn.disabled = false;
    container.scrollTop = container.scrollHeight;
  }
}
