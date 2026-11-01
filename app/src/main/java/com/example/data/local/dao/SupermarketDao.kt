package com.example.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.example.data.local.entity.SupermarketEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface SupermarketDao {
    @Query("SELECT * FROM supermarkets ORDER BY rating DESC")
    fun getAllSupermarkets(): Flow<List<SupermarketEntity>>

    @Query("SELECT * FROM supermarkets WHERE id = :id LIMIT 1")
    suspend fun getSupermarketById(id: String): SupermarketEntity?

    @Query("SELECT * FROM supermarkets WHERE zone = :zone ORDER BY rating DESC")
    fun getSupermarketsByZone(zone: String): Flow<List<SupermarketEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(supermarkets: List<SupermarketEntity>)

    @Query("SELECT COUNT(*) FROM supermarkets")
    suspend fun getCount(): Int
}
