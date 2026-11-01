package com.example.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.example.data.local.entity.WeeklyEncarteEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface WeeklyEncarteDao {
    @Query("SELECT * FROM weekly_encartes")
    fun getAllEncartes(): Flow<List<WeeklyEncarteEntity>>

    @Query("SELECT * FROM weekly_encartes WHERE supermarketId = :supermarketId")
    fun getEncartesBySupermarket(supermarketId: String): Flow<List<WeeklyEncarteEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(encartes: List<WeeklyEncarteEntity>)

    @Query("SELECT COUNT(*) FROM weekly_encartes")
    suspend fun getCount(): Int
}
