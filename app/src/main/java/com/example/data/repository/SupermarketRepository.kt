package com.example.data.repository

import com.example.data.local.AppDatabase
import com.example.data.local.entity.PriceAlertEntity
import com.example.data.local.entity.ProductPriceEntity
import com.example.data.local.entity.ShoppingListItemEntity
import com.example.data.local.entity.SupermarketEntity
import com.example.data.local.entity.WeeklyEncarteEntity
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.map

data class ProductComparisonGroup(
    val productKey: String,
    val productName: String,
    val brand: String,
    val category: String,
    val unitMeasure: String,
    val prices: List<ProductPriceEntity>,
    val lowestPrice: Double,
    val lowestSupermarket: String,
    val lowestStoreUnit: String,
    val highestPrice: Double,
    val maxSavingsPercent: Int,
    val hasDeal: Boolean
)

data class BasketStoreEstimate(
    val supermarketId: String,
    val supermarketName: String,
    val storeColorHex: String,
    val totalPrice: Double,
    val itemsAvailableCount: Int,
    val totalItemsCount: Int,
    val missingItems: List<String>,
    val isLowestSingleStore: Boolean = false,
    val differenceFromBest: Double = 0.0
)

data class BasketItemPlan(
    val productName: String,
    val quantity: Int,
    val unitPrice: Double,
    val storeName: String
)

data class MixedBasketSaving(
    val totalCost: Double,
    val singleBestCost: Double,
    val extraSavings: Double,
    val storeDistribution: Map<String, List<BasketItemPlan>>
)

class SupermarketRepository(private val db: AppDatabase) {

    val supermarkets: Flow<List<SupermarketEntity>> = db.supermarketDao().getAllSupermarkets()

    val allPrices: Flow<List<ProductPriceEntity>> = db.productPriceDao().getAllPrices()

    val weeklyDeals: Flow<List<ProductPriceEntity>> = db.productPriceDao().getWeeklyDeals()

    val shoppingList: Flow<List<ShoppingListItemEntity>> = db.shoppingListDao().getAllItems()

    val priceAlerts: Flow<List<PriceAlertEntity>> = db.priceAlertDao().getAllAlerts()

    val weeklyEncartes: Flow<List<WeeklyEncarteEntity>> = db.weeklyEncarteDao().getAllEncartes()

    val intelligenceService = MarketIntelligenceService()
    val liveApiClient = com.example.data.remote.LiveMarketApiClient()

    // Group all individual store prices by canonical product key to display comparison cards
    val productComparisonGroups: Flow<List<ProductComparisonGroup>> = allPrices.mapPricesToGroups()

    suspend fun syncLiveMarketPrices(context: android.content.Context, query: String = ""): Int {
        val remoteDeals = liveApiClient.fetchLivePricesForQuery(query)
        if (remoteDeals.isEmpty()) return 0

        val entities = remoteDeals.map { deal ->
            ProductPriceEntity(
                productKey = deal.productKey,
                productName = deal.productName,
                brand = deal.brand,
                category = deal.category,
                unitMeasure = deal.unitMeasure,
                supermarketId = deal.supermarketId,
                supermarketName = deal.supermarketName,
                storeUnit = deal.storeUnit,
                price = deal.price,
                previousPrice = deal.previousPrice,
                isWeeklyDeal = deal.isWeeklyDeal,
                lastUpdated = deal.lastUpdated,
                reportedBy = deal.sourceApi,
                confirmationCount = 10
            )
        }

        db.productPriceDao().insertAll(entities)

        // Evaluate all alerts with the newly synced live prices from Manaus websites & APIs
        for (deal in remoteDeals) {
            checkAndTriggerAlerts(
                context = context,
                productKey = deal.productKey,
                newPrice = deal.price,
                supermarketName = deal.supermarketName,
                storeUnit = deal.storeUnit
            )
        }

        return entities.size
    }

    suspend fun checkApiHealth(): List<com.example.data.remote.ApiHealthStatus> {
        return liveApiClient.checkApiHealth()
    }

    suspend fun reportNewPrice(
        context: android.content.Context,
        productKey: String,
        productName: String,
        brand: String,
        category: String,
        unitMeasure: String,
        supermarketId: String,
        supermarketName: String,
        storeUnit: String,
        price: Double,
        isWeeklyDeal: Boolean,
        reportedBy: String = "Colaborador Manaus"
    ): Long {
        val entity = ProductPriceEntity(
            productKey = productKey,
            productName = productName,
            brand = brand,
            category = category,
            unitMeasure = unitMeasure,
            supermarketId = supermarketId,
            supermarketName = supermarketName,
            storeUnit = storeUnit,
            price = price,
            previousPrice = price * 1.15,
            isWeeklyDeal = isWeeklyDeal,
            lastUpdated = "Hoje, Recente",
            reportedBy = reportedBy,
            confirmationCount = 1
        )
        val id = db.productPriceDao().insertPrice(entity)

        // Check if any active price alert triggered by this price in any supermarket
        checkAndTriggerAlerts(context, productKey, price, supermarketName, storeUnit)

        return id
    }

    suspend fun confirmPrice(id: Long) {
        db.productPriceDao().incrementConfirmation(id)
    }

    suspend fun addToShoppingList(
        productKey: String,
        name: String,
        category: String,
        quantity: Int = 1,
        unitMeasure: String = "un"
    ) {
        val item = ShoppingListItemEntity(
            productKey = productKey,
            name = name,
            category = category,
            quantity = quantity,
            unitMeasure = unitMeasure,
            isChecked = false
        )
        db.shoppingListDao().insertItem(item)
    }

    suspend fun toggleShoppingItemChecked(id: Long, isChecked: Boolean) {
        db.shoppingListDao().updateCheckedStatus(id, isChecked)
    }

    suspend fun updateShoppingItemQuantity(id: Long, quantity: Int) {
        if (quantity <= 0) {
            db.shoppingListDao().deleteById(id)
        } else {
            db.shoppingListDao().updateQuantity(id, quantity)
        }
    }

    suspend fun removeShoppingItem(id: Long) {
        db.shoppingListDao().deleteById(id)
    }

    suspend fun clearCompletedShoppingItems() {
        db.shoppingListDao().clearCompleted()
    }

    suspend fun addPriceAlert(
        context: android.content.Context,
        productKey: String,
        productName: String,
        targetPrice: Double,
        currentBestPrice: Double,
        bestSupermarketName: String
    ): Long {
        val isTriggered = currentBestPrice > 0 && currentBestPrice <= targetPrice
        val alert = PriceAlertEntity(
            productKey = productKey,
            productName = productName,
            targetMaxPrice = targetPrice,
            bestCurrentPrice = currentBestPrice,
            bestSupermarketName = bestSupermarketName,
            isTriggered = isTriggered
        )
        val newId = db.priceAlertDao().insertAlert(alert)

        // If current price already satisfies target price, notify immediately
        if (isTriggered) {
            com.example.ui.notifications.PriceAlertNotificationHelper.notifyPriceDrop(
                context = context,
                alertId = newId,
                productName = productName,
                targetPrice = targetPrice,
                foundPrice = currentBestPrice,
                supermarketName = bestSupermarketName,
                storeUnit = "Unidade Manaus"
            )
        }

        return newId
    }

    suspend fun simulatePriceDropForAlert(context: android.content.Context, alertId: Long) {
        val alert = db.priceAlertDao().getAllAlertsList().find { it.id == alertId } ?: return
        val discountedPrice = String.format(java.util.Locale.US, "%.2f", alert.targetMaxPrice * 0.88).toDouble()
        val supermarket = "Nova Era Superatacado"
        val storeUnit = "Unidade Torquato Tapajós"

        db.priceAlertDao().updateAlertStatus(
            id = alert.id,
            isTriggered = true,
            bestPrice = discountedPrice,
            supermarket = supermarket
        )

        com.example.ui.notifications.PriceAlertNotificationHelper.notifyPriceDrop(
            context = context,
            alertId = alert.id,
            productName = alert.productName,
            targetPrice = alert.targetMaxPrice,
            foundPrice = discountedPrice,
            supermarketName = supermarket,
            storeUnit = storeUnit
        )
    }

    suspend fun removePriceAlert(id: Long) {
        db.priceAlertDao().deleteById(id)
    }

    private suspend fun checkAndTriggerAlerts(
        context: android.content.Context,
        productKey: String,
        newPrice: Double,
        supermarketName: String,
        storeUnit: String
    ) {
        val matchingAlerts = db.priceAlertDao().getAlertsForProduct(productKey)
        for (alert in matchingAlerts) {
            if (newPrice <= alert.targetMaxPrice) {
                db.priceAlertDao().updateAlertStatus(
                    id = alert.id,
                    isTriggered = true,
                    bestPrice = newPrice,
                    supermarket = supermarketName
                )
                com.example.ui.notifications.PriceAlertNotificationHelper.notifyPriceDrop(
                    context = context,
                    alertId = alert.id,
                    productName = alert.productName,
                    targetPrice = alert.targetMaxPrice,
                    foundPrice = newPrice,
                    supermarketName = supermarketName,
                    storeUnit = storeUnit
                )
            }
        }
    }
}

private fun Flow<List<ProductPriceEntity>>.mapPricesToGroups(): Flow<List<ProductComparisonGroup>> {
    return this.map { prices ->
        prices.groupBy { it.productKey }.map { entry ->
            val key = entry.key
            val list = entry.value
            val sorted = list.sortedBy { it.price }
            val lowest = sorted.first()
            val highest = sorted.last()
            val diff = highest.price - lowest.price
            val pct = if (highest.price > 0) ((diff / highest.price) * 100).toInt() else 0
            val hasDeal = list.any { it.isWeeklyDeal }

            ProductComparisonGroup(
                productKey = key,
                productName = lowest.productName,
                brand = lowest.brand,
                category = lowest.category,
                unitMeasure = lowest.unitMeasure,
                prices = sorted,
                lowestPrice = lowest.price,
                lowestSupermarket = lowest.supermarketName,
                lowestStoreUnit = lowest.storeUnit,
                highestPrice = highest.price,
                maxSavingsPercent = pct,
                hasDeal = hasDeal
            )
        }.sortedByDescending { it.maxSavingsPercent }
    }
}
