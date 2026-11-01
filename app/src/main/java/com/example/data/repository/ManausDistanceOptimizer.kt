package com.example.data.repository

import android.content.Context
import android.content.Intent
import android.net.Uri
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.pow
import kotlin.math.roundToInt
import kotlin.math.sin
import kotlin.math.sqrt

data class ManausNeighborhood(
    val key: String,
    val name: String,
    val zone: String,
    val lat: Double,
    val lng: Double
)

data class StoreCoordinates(
    val key: String,
    val name: String,
    val lat: Double,
    val lng: Double
)

object ManausDistanceOptimizer {

    val neighborhoods = listOf(
        ManausNeighborhood("adrianopolis", "Adrianópolis", "Centro-Sul", -3.1095, -60.0163),
        ManausNeighborhood("flores", "Flores / Pq 10", "Centro-Sul", -3.0765, -60.0182),
        ManausNeighborhood("cidade_nova", "Cidade Nova", "Norte", -3.0389, -59.9794),
        ManausNeighborhood("nova_cidade", "Nova Cidade", "Norte", -3.0030, -59.9920),
        ManausNeighborhood("autaz_mirim", "São José / Z. Leste", "Leste", -3.0754, -59.9392),
        ManausNeighborhood("coroado", "Coroado", "Leste", -3.0950, -59.9850),
        ManausNeighborhood("betania", "Betânia / Distrito", "Sul", -3.1415, -60.0028),
        ManausNeighborhood("centro", "Centro Histórico", "Sul", -3.1317, -60.0242),
        ManausNeighborhood("ponta_negra", "Ponta Negra", "Oeste", -3.0560, -60.1030),
        ManausNeighborhood("compensa", "Compensa", "Oeste", -3.1070, -60.0570),
        ManausNeighborhood("alvorada", "Alvorada", "Centro-Oeste", -3.0850, -60.0450)
    )

    private val storeCoords = mapOf(
        "db" to StoreCoordinates("db", "Hiper DB Paraíba", -3.1110, -60.0150),
        "nova_era" to StoreCoordinates("nova_era", "Nova Era Torquato", -3.0620, -60.0270),
        "atacadao" to StoreCoordinates("atacadao", "Atacadão Camapuã", -3.0350, -59.9720),
        "assai" to StoreCoordinates("assai", "Assaí Autaz Mirim", -3.0730, -59.9410),
        "baratao" to StoreCoordinates("baratao", "Baratão Betânia", -3.1400, -60.0050),
        "carrefour" to StoreCoordinates("carrefour", "Carrefour Adrianópolis", -3.1070, -60.0190)
    )

    fun haversineKm(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Double {
        val r = 6371.0
        val dLat = Math.toRadians(lat2 - lat1)
        val dLon = Math.toRadians(lon2 - lon1)
        val a = sin(dLat / 2).pow(2.0) +
            cos(Math.toRadians(lat1)) * cos(Math.toRadians(lat2)) * sin(dLon / 2).pow(2.0)
        val c = 2 * atan2(sqrt(a), sqrt(1 - a))
        return r * c
    }

    fun getNeighborhoodToStoreKm(neighborhoodKey: String, storeKey: String): Double {
        val n = neighborhoods.find { it.key == neighborhoodKey } ?: neighborhoods.first()
        val s = storeCoords[storeKey] ?: return 5.0
        val driving = haversineKm(n.lat, n.lng, s.lat, s.lng) * 1.35
        return (driving * 10.0).roundToInt() / 10.0
    }

    fun calculateFuelCostRoundtrip(oneWayKm: Double, ratePerKm: Double = 1.50): Double {
        val total = oneWayKm * 2.0 * ratePerKm
        return (total * 100.0).roundToInt() / 100.0
    }

    fun shareBasketOnWhatsApp(
        context: Context,
        neighborhoodName: String,
        bestStoreName: String,
        productTotal: Double,
        fuelCost: Double,
        roundtripKm: Double,
        mixedRoute: MixedBasketSaving?,
        itemsSummary: List<String>
    ) {
        val finalSingle = productTotal + fuelCost
        val msg = buildString {
            appendLine("🛒 *Lista Inteligente PreçoManaus* 📍 Bairro: $neighborhoodName")
            appendLine()
            if (mixedRoute != null && mixedRoute.extraSavings >= 15.0) {
                appendLine("🚀 *Estratégia Otimizada (Rota Mista em Manaus):*")
                appendLine("Economia Extra: *R$ ${"%.2f".format(mixedRoute.extraSavings)}*")
                appendLine("Total Combinado: *R$ ${"%.2f".format(mixedRoute.totalCost)}*")
                appendLine()
                mixedRoute.storeDistribution.forEach { (store, plans) ->
                    appendLine("🏪 *$store*:")
                    plans.forEach { p ->
                        appendLine("  • ${p.quantity}x ${p.productName} - R$ ${"%.2f".format(p.unitPrice * p.quantity)}")
                    }
                }
            } else {
                appendLine("🏆 *Estratégia: Compre tudo no $bestStoreName*")
                appendLine("Total Produtos: R$ ${"%.2f".format(productTotal)}")
                appendLine("⛽ Deslocamento (${"%.1f".format(roundtripKm)}km): R$ ${"%.2f".format(fuelCost)}")
                appendLine("💰 *Custo Final: R$ ${"%.2f".format(finalSingle)}*")
                appendLine()
                appendLine("*Itens da Lista:*")
                itemsSummary.forEach { line -> appendLine("  • $line") }
            }
            appendLine()
            append("_Gerado pelo App PreçoManaus • Monitor de Preços_")
        }

        val url = "https://api.whatsapp.com/send?text=${Uri.encode(msg)}"
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        try {
            context.startActivity(intent)
        } catch (_: Exception) {
            val shareIntent = Intent(Intent.ACTION_SEND).apply {
                type = "text/plain"
                putExtra(Intent.EXTRA_TEXT, msg)
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(Intent.createChooser(shareIntent, "Compartilhar Lista PreçoManaus"))
        }
    }
}
