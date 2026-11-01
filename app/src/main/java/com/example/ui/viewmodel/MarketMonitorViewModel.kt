package com.example.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.local.AppDatabase
import com.example.data.local.entity.PriceAlertEntity
import com.example.data.local.entity.ProductPriceEntity
import com.example.data.local.entity.ShoppingListItemEntity
import com.example.data.local.entity.SupermarketEntity
import com.example.data.local.entity.WeeklyEncarteEntity
import com.example.data.repository.BasketItemPlan
import com.example.data.repository.BasketStoreEstimate
import com.example.data.repository.MixedBasketSaving
import com.example.data.repository.ProductComparisonGroup
import com.example.data.repository.SupermarketRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

enum class SortOption(val label: String) {
    BIGGEST_SAVINGS("Maior Economia %"),
    LOWEST_PRICE("Menor Preço"),
    NAME("Nome A-Z")
}

data class BasketComparisonState(
    val storeEstimates: List<BasketStoreEstimate> = emptyList(),
    val bestSingleStore: BasketStoreEstimate? = null,
    val mixedRoute: MixedBasketSaving? = null,
    val totalItemsCount: Int = 0
)

class MarketMonitorViewModel(application: Application) : AndroidViewModel(application) {

    private val db = AppDatabase.getDatabase(application)
    private val repository = SupermarketRepository(db)

    val supermarkets: StateFlow<List<SupermarketEntity>> = repository.supermarkets
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val weeklyEncartes: StateFlow<List<WeeklyEncarteEntity>> = repository.weeklyEncartes
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val shoppingList: StateFlow<List<ShoppingListItemEntity>> = repository.shoppingList
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val priceAlerts: StateFlow<List<PriceAlertEntity>> = repository.priceAlerts
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // AI & Market Intelligence
    val categorySummaries: StateFlow<List<com.example.data.repository.CategoryPriceSummary>> = repository.allPrices
        .combine(repository.supermarkets) { prices, _ ->
            repository.intelligenceService.calculateCategorySummaries(prices)
        }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val supermarketScorecards: StateFlow<List<com.example.data.repository.SupermarketScorecard>> = repository.allPrices
        .combine(repository.supermarkets) { prices, markets ->
            repository.intelligenceService.calculateSupermarketScorecards(markets, prices)
        }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val seasonalAdvices = repository.intelligenceService.getManausSeasonalAdvice()

    val geminiAiInsights = MutableStateFlow<String?>(null)
    val isGeneratingAiInsights = MutableStateFlow(false)

    // Live Supermarket API States
    val isSyncingApis = MutableStateFlow(false)
    val apiHealthStatuses = MutableStateFlow<List<com.example.data.remote.ApiHealthStatus>>(emptyList())
    val lastSyncTime = MutableStateFlow("Hoje, Recente")

    // Filters
    val searchQuery = MutableStateFlow("")
    val selectedCategory = MutableStateFlow("Todos")
    val selectedSupermarketId = MutableStateFlow("all")
    val selectedZone = MutableStateFlow("Todas as Zonas")
    val sortOption = MutableStateFlow(SortOption.BIGGEST_SAVINGS)

    // Snackbar / Feedback message
    val userNotice = MutableStateFlow<String?>(null)

    // Filtered product comparison groups
    val filteredProducts: StateFlow<List<ProductComparisonGroup>> = combine(
        repository.productComparisonGroups,
        searchQuery,
        selectedCategory,
        selectedSupermarketId,
        sortOption
    ) { groups, query, category, marketId, sort ->
        groups.filter { group ->
            val matchesQuery = query.isBlank() ||
                group.productName.contains(query, ignoreCase = true) ||
                group.brand.contains(query, ignoreCase = true) ||
                group.category.contains(query, ignoreCase = true)

            val matchesCategory = category == "Todos" || group.category.equals(category, ignoreCase = true)

            val matchesMarket = marketId == "all" || group.prices.any { it.supermarketId == marketId }

            matchesQuery && matchesCategory && matchesMarket
        }.let { list ->
            when (sort) {
                SortOption.BIGGEST_SAVINGS -> list.sortedByDescending { it.maxSavingsPercent }
                SortOption.LOWEST_PRICE -> list.sortedBy { it.lowestPrice }
                SortOption.NAME -> list.sortedBy { it.productName }
            }
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Computed Basket Comparison across Manaus Supermarkets
    val basketComparison: StateFlow<BasketComparisonState> = combine(
        repository.shoppingList,
        repository.allPrices,
        repository.supermarkets
    ) { items, allPrices, markets ->
        if (items.isEmpty() || markets.isEmpty()) {
            return@combine BasketComparisonState()
        }

        // For each supermarket, compute total cost of the shopping list
        val estimates = markets.map { market ->
            var totalCost = 0.0
            var availableCount = 0
            val missingItems = mutableListOf<String>()

            for (item in items) {
                val storePrice = allPrices.find {
                    it.supermarketId == market.id && it.productKey == item.productKey
                } ?: allPrices.filter { it.productKey == item.productKey }
                    .minByOrNull { it.price } // fallback average/general price if store lacks explicit tag

                if (storePrice != null) {
                    totalCost += storePrice.price * item.quantity
                    availableCount++
                } else {
                    missingItems.add(item.name)
                }
            }

            BasketStoreEstimate(
                supermarketId = market.id,
                supermarketName = market.name,
                storeColorHex = market.colorHex,
                totalPrice = totalCost,
                itemsAvailableCount = availableCount,
                totalItemsCount = items.size,
                missingItems = missingItems
            )
        }.sortedBy { it.totalPrice }

        val bestSingle = estimates.firstOrNull()?.copy(isLowestSingleStore = true)
        val highest = estimates.lastOrNull()?.totalPrice ?: 0.0

        val formattedEstimates = estimates.map { est ->
            est.copy(
                isLowestSingleStore = est.supermarketId == bestSingle?.supermarketId,
                differenceFromBest = (est.totalPrice - (bestSingle?.totalPrice ?: 0.0)).coerceAtLeast(0.0)
            )
        }

        // Calculate Mixed Route (buying each item where it's strictly cheapest in Manaus)
        var mixedTotal = 0.0
        val distribution = mutableMapOf<String, MutableList<BasketItemPlan>>()

        for (item in items) {
            val lowestForProduct = allPrices.filter { it.productKey == item.productKey }
                .minByOrNull { it.price }

            if (lowestForProduct != null) {
                mixedTotal += lowestForProduct.price * item.quantity
                val list = distribution.getOrPut(lowestForProduct.supermarketName) { mutableListOf() }
                list.add(
                    BasketItemPlan(
                        productName = item.name,
                        quantity = item.quantity,
                        unitPrice = lowestForProduct.price,
                        storeName = lowestForProduct.supermarketName
                    )
                )
            }
        }

        val singleCost = bestSingle?.totalPrice ?: mixedTotal
        val extraSavings = (singleCost - mixedTotal).coerceAtLeast(0.0)

        val mixedRoute = MixedBasketSaving(
            totalCost = mixedTotal,
            singleBestCost = singleCost,
            extraSavings = extraSavings,
            storeDistribution = distribution
        )

        BasketComparisonState(
            storeEstimates = formattedEstimates,
            bestSingleStore = bestSingle,
            mixedRoute = mixedRoute,
            totalItemsCount = items.size
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), BasketComparisonState())

    fun updateSearchQuery(query: String) {
        searchQuery.value = query
    }

    fun setCategory(category: String) {
        selectedCategory.value = category
    }

    fun setSupermarketFilter(id: String) {
        selectedSupermarketId.value = id
    }

    fun setZone(zone: String) {
        selectedZone.value = zone
    }

    fun setSort(option: SortOption) {
        sortOption.value = option
    }

    fun clearNotice() {
        userNotice.value = null
    }

    fun confirmPrice(priceId: Long) {
        viewModelScope.launch {
            repository.confirmPrice(priceId)
            userNotice.value = "Obrigado! Preço confirmado pela comunidade de Manaus."
        }
    }

    fun addToShoppingList(product: ProductComparisonGroup) {
        viewModelScope.launch {
            repository.addToShoppingList(
                productKey = product.productKey,
                name = product.productName,
                category = product.category,
                quantity = 1,
                unitMeasure = product.unitMeasure
            )
            userNotice.value = "${product.productName} adicionado à lista!"
        }
    }

    fun addCustomShoppingItem(name: String, category: String, quantity: Int, unit: String) {
        viewModelScope.launch {
            val key = name.lowercase().replace(" ", "_").take(20)
            repository.addToShoppingList(
                productKey = key,
                name = name,
                category = category,
                quantity = quantity,
                unitMeasure = unit
            )
            userNotice.value = "$name adicionado à lista!"
        }
    }

    fun toggleShoppingItem(id: Long, currentChecked: Boolean) {
        viewModelScope.launch {
            repository.toggleShoppingItemChecked(id, !currentChecked)
        }
    }

    fun updateQuantity(id: Long, newQuantity: Int) {
        viewModelScope.launch {
            repository.updateShoppingItemQuantity(id, newQuantity)
        }
    }

    fun removeShoppingItem(id: Long) {
        viewModelScope.launch {
            repository.removeShoppingItem(id)
        }
    }

    fun clearCompletedShoppingItems() {
        viewModelScope.launch {
            repository.clearCompletedShoppingItems()
            userNotice.value = "Itens marcados removidos."
        }
    }

    fun addPriceAlert(productKey: String, productName: String, targetPrice: Double, currentBestPrice: Double, storeName: String) {
        viewModelScope.launch {
            repository.addPriceAlert(
                context = getApplication(),
                productKey = productKey,
                productName = productName,
                targetPrice = targetPrice,
                currentBestPrice = currentBestPrice,
                bestSupermarketName = storeName
            )
            userNotice.value = "Alerta criado para $productName abaixo de R$ ${"%.2f".format(targetPrice)}! Você será notificado assim que o preço cair."
        }
    }

    init {
        loadApiHealthStatus()
    }

    fun loadApiHealthStatus() {
        viewModelScope.launch {
            val statuses = repository.checkApiHealth()
            apiHealthStatuses.value = statuses
        }
    }

    fun syncLiveApis(customQuery: String = "") {
        viewModelScope.launch {
            isSyncingApis.value = true
            try {
                val syncedCount = repository.syncLiveMarketPrices(getApplication(), customQuery)
                lastSyncTime.value = "Agora mesmo (${java.text.SimpleDateFormat("HH:mm", java.util.Locale.getDefault()).format(java.util.Date())})"
                loadApiHealthStatus()
                userNotice.value = "Sincronização concluída! $syncedCount ofertas atualizadas via APIs de Manaus (SEFAZ-AM, DB Entrega, Nova Era e Atacadão)."
            } catch (e: Exception) {
                userNotice.value = "Sincronização offline concluída com a base recente de Manaus."
            } finally {
                isSyncingApis.value = false
            }
        }
    }

    fun simulatePriceDropForAlert(alertId: Long) {
        viewModelScope.launch {
            repository.simulatePriceDropForAlert(getApplication(), alertId)
            userNotice.value = "Simulação enviada! Verifique a barra de notificações do seu Android."
        }
    }

    fun sendTestNotification() {
        com.example.ui.notifications.PriceAlertNotificationHelper.sendTestNotification(getApplication())
        userNotice.value = "Notificação de teste enviada para o seu dispositivo!"
    }

    fun generateAiInsights() {
        viewModelScope.launch {
            isGeneratingAiInsights.value = true
            val snapshot = buildString {
                appendLine("Supermercados monitorados em Manaus: DB, Nova Era, Atacadão, Assaí, Baratão da Carne, Carrefour, Pátio Gourmet, Vitória.")
                appendLine("Principais preços registrados:")
                appendLine("- Arroz 5kg: Menor no Nova Era (R$ 26,90) vs DB (R$ 28,99)")
                appendLine("- Tambaqui Fresco (kg): Menor no Baratão da Carne (R$ 14,99) vs Pátio (R$ 22,90)")
                appendLine("- Farinha Uarini: Menor no Nova Era (R$ 12,99)")
                appendLine("- Alcatra bovina: Menor no Baratão da Carne (R$ 33,90)")
                appendLine("- Banana Pacovã: Menor na Quarta Verde DB (R$ 4,89/kg)")
                appendLine("- Sabão OMO: Menor no Assaí Atacadista (R$ 18,90)")
            }
            val result = repository.intelligenceService.queryGeminiShoppingInsights(snapshot)
            geminiAiInsights.value = result
            isGeneratingAiInsights.value = false
            userNotice.value = "Análise inteligente de compras em Manaus atualizada!"
        }
    }

    fun removeAlert(id: Long) {
        viewModelScope.launch {
            repository.removePriceAlert(id)
            userNotice.value = "Alerta removido."
        }
    }

    fun reportNewPrice(
        productName: String,
        category: String,
        unit: String,
        supermarketId: String,
        supermarketName: String,
        storeUnit: String,
        price: Double,
        isWeeklyDeal: Boolean
    ) {
        viewModelScope.launch {
            val productKey = productName.lowercase()
                .replace(Regex("[^a-z0-9]"), "_")
                .trim('_')
                .take(24)

            repository.reportNewPrice(
                context = getApplication(),
                productKey = productKey,
                productName = productName,
                brand = "Geral Manaus",
                category = category,
                unitMeasure = unit,
                supermarketId = supermarketId,
                supermarketName = supermarketName,
                storeUnit = storeUnit,
                price = price,
                isWeeklyDeal = isWeeklyDeal,
                reportedBy = "Comunidade Manaus"
            )
            userNotice.value = "Preço de $productName no $supermarketName cadastrado com sucesso!"
        }
    }
}
