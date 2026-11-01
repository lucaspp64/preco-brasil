package com.example.data.local.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.data.local.entity.ShoppingListItemEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface ShoppingListDao {
    @Query("SELECT * FROM shopping_list ORDER BY isChecked ASC, id DESC")
    fun getAllItems(): Flow<List<ShoppingListItemEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertItem(item: ShoppingListItemEntity): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(items: List<ShoppingListItemEntity>)

    @Update
    suspend fun updateItem(item: ShoppingListItemEntity)

    @Delete
    suspend fun deleteItem(item: ShoppingListItemEntity)

    @Query("DELETE FROM shopping_list WHERE id = :id")
    suspend fun deleteById(id: Long)

    @Query("UPDATE shopping_list SET isChecked = :isChecked WHERE id = :id")
    suspend fun updateCheckedStatus(id: Long, isChecked: Boolean)

    @Query("UPDATE shopping_list SET quantity = :quantity WHERE id = :id")
    suspend fun updateQuantity(id: Long, quantity: Int)

    @Query("DELETE FROM shopping_list WHERE isChecked = 1")
    suspend fun clearCompleted()

    @Query("DELETE FROM shopping_list")
    suspend fun clearAll()

    @Query("SELECT COUNT(*) FROM shopping_list")
    suspend fun getCount(): Int
}
