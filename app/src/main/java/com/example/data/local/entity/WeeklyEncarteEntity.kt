package com.example.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "weekly_encartes")
data class WeeklyEncarteEntity(
    @PrimaryKey
    val id: String,
    val supermarketId: String,
    val supermarketName: String,
    val title: String,
    val validityText: String,
    val highlightDiscount: String,
    val description: String,
    val topItemsSummary: String,
    val applicableStores: String,
    val flyerCategory: String // "Carnes", "Hortifruti", "Fim de Semana", "Geral"
)
