package com.example.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "shopping_list")
data class ShoppingListItemEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val productKey: String,
    val name: String,
    val category: String,
    val quantity: Int = 1,
    val unitMeasure: String = "un",
    val isChecked: Boolean = false,
    val preferredSupermarketId: String? = null
)
