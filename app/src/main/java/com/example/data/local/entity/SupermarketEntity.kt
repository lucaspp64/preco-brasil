package com.example.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "supermarkets")
data class SupermarketEntity(
    @PrimaryKey
    val id: String,
    val name: String,
    val brand: String,
    val flagshipUnit: String,
    val address: String,
    val neighborhood: String,
    val zone: String, // e.g. "Zona Centro-Sul", "Zona Norte", "Zona Leste", "Zona Oeste"
    val colorHex: String,
    val rating: Double,
    val activeDealsCount: Int,
    val openingHours: String,
    val phone: String
)
