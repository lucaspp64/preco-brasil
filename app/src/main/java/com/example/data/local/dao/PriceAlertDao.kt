package com.example.data.local.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.example.data.local.entity.PriceAlertEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface PriceAlertDao {
    @Query("SELECT * FROM price_alerts ORDER BY isTriggered DESC, id DESC")
    fun getAllAlerts(): Flow<List<PriceAlertEntity>>

    @Query("SELECT * FROM price_alerts")
    suspend fun getAllAlertsList(): List<PriceAlertEntity>

    @Query("SELECT * FROM price_alerts WHERE productKey = :productKey")
    suspend fun getAlertsForProduct(productKey: String): List<PriceAlertEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAlert(alert: PriceAlertEntity): Long

    @Delete
    suspend fun deleteAlert(alert: PriceAlertEntity)

    @Query("DELETE FROM price_alerts WHERE id = :id")
    suspend fun deleteById(id: Long)

    @Query("UPDATE price_alerts SET isTriggered = :isTriggered, bestCurrentPrice = :bestPrice, bestSupermarketName = :supermarket WHERE id = :id")
    suspend fun updateAlertStatus(id: Long, isTriggered: Boolean, bestPrice: Double, supermarket: String)

    @Query("SELECT COUNT(*) FROM price_alerts")
    suspend fun getCount(): Int
}
