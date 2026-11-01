package com.example.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.example.data.local.entity.ProductPriceEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface ProductPriceDao {
    @Query("SELECT * FROM product_prices ORDER BY isWeeklyDeal DESC, price ASC")
    fun getAllPrices(): Flow<List<ProductPriceEntity>>

    @Query("SELECT * FROM product_prices")
    suspend fun getAllPricesList(): List<ProductPriceEntity>

    @Query("SELECT * FROM product_prices WHERE productKey = :productKey")
    suspend fun getPricesForProductList(productKey: String): List<ProductPriceEntity>

    @Query("UPDATE product_prices SET price = :newPrice, isWeeklyDeal = :isWeeklyDeal WHERE id = :id")
    suspend fun updatePrice(id: Long, newPrice: Double, isWeeklyDeal: Boolean)

    @Query("SELECT * FROM product_prices WHERE productKey = :productKey ORDER BY price ASC")
    fun getPricesForProduct(productKey: String): Flow<List<ProductPriceEntity>>

    @Query("SELECT * FROM product_prices WHERE supermarketId = :supermarketId ORDER BY price ASC")
    fun getPricesBySupermarket(supermarketId: String): Flow<List<ProductPriceEntity>>

    @Query("SELECT * FROM product_prices WHERE isWeeklyDeal = 1 ORDER BY price ASC")
    fun getWeeklyDeals(): Flow<List<ProductPriceEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPrice(price: ProductPriceEntity): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(prices: List<ProductPriceEntity>)

    @Query("UPDATE product_prices SET confirmationCount = confirmationCount + 1 WHERE id = :id")
    suspend fun incrementConfirmation(id: Long)

    @Query("SELECT COUNT(*) FROM product_prices")
    suspend fun getCount(): Int
}
