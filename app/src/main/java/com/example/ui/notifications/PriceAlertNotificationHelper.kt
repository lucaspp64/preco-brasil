package com.example.ui.notifications

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import com.example.MainActivity
import com.example.R
import com.example.data.local.entity.PriceAlertEntity

object PriceAlertNotificationHelper {

    const val CHANNEL_ID = "price_alerts_channel_manaus"
    private const val CHANNEL_NAME = "Alertas de Preço Manaus"
    private const val CHANNEL_DESC = "Avisos quando os preços de produtos monitorados em Manaus caem abaixo do seu alvo"

    fun createNotificationChannel(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val importance = NotificationManager.IMPORTANCE_HIGH
            val channel = NotificationChannel(CHANNEL_ID, CHANNEL_NAME, importance).apply {
                description = CHANNEL_DESC
                enableVibration(true)
                enableLights(true)
            }
            val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }

    fun hasNotificationPermission(context: Context): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            ContextCompat.checkSelfPermission(
                context,
                android.Manifest.permission.POST_NOTIFICATIONS
            ) == PackageManager.PERMISSION_GRANTED
        } else {
            true
        }
    }

    fun notifyPriceDrop(
        context: Context,
        alertId: Long,
        productName: String,
        targetPrice: Double,
        foundPrice: Double,
        supermarketName: String,
        storeUnit: String
    ) {
        createNotificationChannel(context)

        if (!hasNotificationPermission(context)) {
            return
        }

        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            putExtra("navigate_to", "alerts")
        }

        val pendingIntent = PendingIntent.getActivity(
            context,
            alertId.toInt(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or (if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0)
        )

        val savings = (targetPrice - foundPrice).coerceAtLeast(0.0)
        val formattedFound = "%.2f".format(foundPrice)
        val formattedTarget = "%.2f".format(targetPrice)

        val title = "🚨 ALERTA: $productName baixou em Manaus!"
        val content = "Por apenas R$ $formattedFound no $supermarketName ($storeUnit) — Menor que sua meta de R$ $formattedTarget!"

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setContentTitle(title)
            .setContentText(content)
            .setStyle(
                NotificationCompat.BigTextStyle()
                    .bigText("$content\n\nAproveite a oferta antes que acabe o estoque no $supermarketName!")
            )
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .setDefaults(NotificationCompat.DEFAULT_ALL)
            .build()

        try {
            val notificationManager = NotificationManagerCompat.from(context)
            notificationManager.notify(alertId.toInt() + 1000, notification)
        } catch (_: SecurityException) {
            // Permission check caught above
        }
    }

    fun sendTestNotification(context: Context) {
        notifyPriceDrop(
            context = context,
            alertId = 9999L,
            productName = "Tambaqui Fresco Tratado (kg)",
            targetPrice = 16.00,
            foundPrice = 14.99,
            supermarketName = "Baratão da Carne",
            storeUnit = "Unidade Betânia"
        )
    }
}
