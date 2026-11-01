package com.example.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import com.example.data.local.dao.PriceAlertDao
import com.example.data.local.dao.ProductPriceDao
import com.example.data.local.dao.ShoppingListDao
import com.example.data.local.dao.SupermarketDao
import com.example.data.local.dao.WeeklyEncarteDao
import com.example.data.local.entity.PriceAlertEntity
import com.example.data.local.entity.ProductPriceEntity
import com.example.data.local.entity.ShoppingListItemEntity
import com.example.data.local.entity.SupermarketEntity
import com.example.data.local.entity.WeeklyEncarteEntity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [
        SupermarketEntity::class,
        ProductPriceEntity::class,
        ShoppingListItemEntity::class,
        PriceAlertEntity::class,
        WeeklyEncarteEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {

    abstract fun supermarketDao(): SupermarketDao
    abstract fun productPriceDao(): ProductPriceDao
    abstract fun shoppingListDao(): ShoppingListDao
    abstract fun priceAlertDao(): PriceAlertDao
    abstract fun weeklyEncarteDao(): WeeklyEncarteDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "precomanaus_database"
                )
                    .addCallback(object : Callback() {
                        override fun onCreate(db: SupportSQLiteDatabase) {
                            super.onCreate(db)
                            // Populate DB on first creation
                            INSTANCE?.let { database ->
                                CoroutineScope(Dispatchers.IO).launch {
                                    populateInitialData(database)
                                }
                            }
                        }
                    })
                    .build()
                INSTANCE = instance
                // Also check if data is populated in case of upgrade or fresh start
                CoroutineScope(Dispatchers.IO).launch {
                    if (instance.supermarketDao().getCount() == 0) {
                        populateInitialData(instance)
                    }
                }
                instance
            }
        }

        private suspend fun populateInitialData(db: AppDatabase) {
            db.supermarketDao().insertAll(PrepopulateData.supermarkets)
            db.productPriceDao().insertAll(PrepopulateData.productPrices)
            db.weeklyEncarteDao().insertAll(PrepopulateData.encartes)
            if (db.shoppingListDao().getCount() == 0) {
                db.shoppingListDao().insertAll(PrepopulateData.initialShoppingList)
            }
            if (db.priceAlertDao().getCount() == 0) {
                PrepopulateData.initialAlerts.forEach {
                    db.priceAlertDao().insertAlert(it)
                }
            }
        }
    }
}
