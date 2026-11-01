package com.example.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "product_prices")
data class ProductPriceEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val productKey: String, // canonical ID e.g. "arroz_5kg", "tambaqui_kg"
    val productName: String,
    val brand: String,
    val category: String, // "Cesta Básica", "Carnes & Peixes Regionais", "Hortifruti & Manaus", "Matinais & Laticínios", "Limpeza"
    val unitMeasure: String, // "5kg", "1kg", "unidade", "litro"
    val supermarketId: String,
    val supermarketName: String,
    val storeUnit: String, // e.g. "DB Hiper Paraíba", "Nova Era Torquato"
    val price: Double,
    val previousPrice: Double,
    val isWeeklyDeal: Boolean,
    val lastUpdated: String,
    val reportedBy: String,
    val confirmationCount: Int = 1
)
