package com.example.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "price_alerts")
data class PriceAlertEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val productKey: String,
    val productName: String,
    val targetMaxPrice: Double,
    val bestCurrentPrice: Double,
    val bestSupermarketName: String,
    val isTriggered: Boolean,
    val createdAt: Long = System.currentTimeMillis()
)
