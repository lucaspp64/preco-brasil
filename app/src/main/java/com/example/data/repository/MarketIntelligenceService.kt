package com.example.data.repository

import android.util.Log
import com.example.BuildConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.TimeUnit

data class CategoryPriceSummary(
    val category: String,
    val averagePrice: Double,
    val lowestStoreName: String,
    val lowestStorePrice: Double,
    val highestStoreName: String,
    val highestStorePrice: Double,
    val savingsPercent: Int,
    val productsSampleCount: Int,
    val tip: String
)

data class SupermarketScorecard(
    val id: String,
    val name: String,
    val brandColorHex: String,
    val rank: Int,
    val overallIndexScore: Double, // calculated score (lower is cheaper)
    val averageBasketDifferenceFromLeader: Double,
    val bestCategories: List<String>,
    val badgeLabel: String,
    val recommendationSummary: String,
    val isOverallBestValue: Boolean = false
)

data class SeasonalShoppingAdvice(
    val title: String,
    val period: String,
    val recommendedSupermarkets: List<String>,
    val categoriesInFocus: String,
    val description: String,
    val savingPotential: String
)

class MarketIntelligenceService {

    private val httpClient = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(20, TimeUnit.SECONDS)
        .build()

    fun calculateCategorySummaries(prices: List<com.example.data.local.entity.ProductPriceEntity>): List<CategoryPriceSummary> {
        val categories = listOf(
            "Cesta Básica",
            "Carnes & Peixes Regionais",
            "Hortifruti & Manaus",
            "Matinais & Laticínios",
            "Limpeza & Higiene"
        )

        return categories.map { cat ->
            val catPrices = prices.filter { it.category.equals(cat, ignoreCase = true) }
            if (catPrices.isEmpty()) {
                CategoryPriceSummary(
                    category = cat,
                    averagePrice = 0.0,
                    lowestStoreName = "Supermercados Manaus",
                    lowestStorePrice = 0.0,
                    highestStoreName = "",
                    highestStorePrice = 0.0,
                    savingsPercent = 0,
                    productsSampleCount = 0,
                    tip = "Monitore novos itens nesta categoria."
                )
            } else {
                val avg = catPrices.map { it.price }.average()

                // Group by store to find which store has lowest average for this category
                val storeAvgs = catPrices.groupBy { it.supermarketName }
                    .mapValues { entry -> entry.value.map { it.price }.average() }
                    .toList()
                    .sortedBy { it.second }

                val lowestStore = storeAvgs.first()
                val highestStore = storeAvgs.last()
                val diffPct = if (highestStore.second > 0) {
                    (((highestStore.second - lowestStore.second) / highestStore.second) * 100).toInt()
                } else 0

                val tip = when (cat) {
                    "Cesta Básica" -> "Atacadão e Nova Era oferecem os menores preços em fardos de arroz, óleo e feijão."
                    "Carnes & Peixes Regionais" -> "Baratão da Carne tem o melhor preço em Tambaqui e cortes para churrasco em Manaus."
                    "Hortifruti & Manaus" -> "DB Supermercados e Vitória lideram descontos na Quarta Verde com pacovã e verduras."
                    "Matinais & Laticínios" -> "Hiper DB e Carrefour competem com ofertas de leite em pó e cafés regionais."
                    "Limpeza & Higiene" -> "Assaí Atacadista e Atacadão têm a maior economia comprando sabão e amaciante em atacado."
                    else -> "Compare os preços antes de comprar."
                }

                CategoryPriceSummary(
                    category = cat,
                    averagePrice = avg,
                    lowestStoreName = lowestStore.first,
                    lowestStorePrice = lowestStore.second,
                    highestStoreName = highestStore.first,
                    highestStorePrice = highestStore.second,
                    savingsPercent = diffPct,
                    productsSampleCount = catPrices.groupBy { it.productKey }.size,
                    tip = tip
                )
            }
        }
    }

    fun calculateSupermarketScorecards(
        markets: List<com.example.data.local.entity.SupermarketEntity>,
        prices: List<com.example.data.local.entity.ProductPriceEntity>
    ): List<SupermarketScorecard> {
        if (markets.isEmpty() || prices.isEmpty()) return emptyList()

        val productKeys = prices.map { it.productKey }.distinct()

        // Calculate store basket total
        val storeTotals = markets.map { market ->
            var sum = 0.0
            var count = 0
            for (key in productKeys) {
                val storePrice = prices.find { it.supermarketId == market.id && it.productKey == key }
                    ?: prices.filter { it.productKey == key }.minByOrNull { it.price }

                if (storePrice != null) {
                    sum += storePrice.price
                    count++
                }
            }
            market to sum
        }.sortedBy { it.second }

        val lowestCost = storeTotals.firstOrNull()?.second ?: 1.0

        return storeTotals.mapIndexed { index, (market, total) ->
            val diff = (total - lowestCost).coerceAtLeast(0.0)

            val (badge, bestCats, summary) = when (market.id) {
                "atacadao" -> Triple(
                    "🏆 Campeão em Cesta Básica & Despensa",
                    listOf("Cesta Básica", "Limpeza & Higiene"),
                    "Mais econômico para compras de mês da família, mercearia seca e fardos no atacado em Manaus."
                )
                "nova_era" -> Triple(
                    "⭐ Melhor Custo-Benefício Integrado",
                    listOf("Cesta Básica", "Farinhas Regionais", "Carnes"),
                    "Excelente equilíbrio de preço em atacado e varejo, com ótimas ofertas em Farinha do Uarini e Arroz."
                )
                "baratao" -> Triple(
                    "🥩 Líder Absoluto em Carnes & Tambaqui",
                    listOf("Carnes & Peixes Regionais"),
                    "Imbatível nos preços de Tambaqui fresco tratado, alcatra e frango congelado na Grande Manaus."
                )
                "assai" -> Triple(
                    "📦 Rei do Atacado & Limpeza Pesada",
                    listOf("Limpeza & Higiene", "Matinais"),
                    "Perfeito para grandes compras de sabão em pó, amaciantes e bebidas com descontos escalonados."
                )
                "db" -> Triple(
                    "🥬 Campeão da Quarta Verde & Variedade",
                    listOf("Hortifruti & Manaus", "Matinais & Laticínios"),
                    "Maior rede de hipermercados de Manaus, com melhor logística de hortifruti fresco e marcas premium."
                )
                "vitoria" -> Triple(
                    "🌴 Destaque Regional & Hortifruti",
                    listOf("Hortifruti & Manaus", "Açaí Regional"),
                    "Preços competitivos na Zona Leste e Coroado, com açaí regional e produtos da terra."
                )
                "carrefour" -> Triple(
                    "🛒 Conforto & Marcas Próprias",
                    listOf("Matinais", "Mercearia"),
                    "Boas promoções no cartão próprio e variedade de importados no Adrianópolis."
                )
                "patio_gourmet" -> Triple(
                    "💎 Seleção Premium & Cortes Especiais",
                    listOf("Peixes Nobres", "Orgânicos"),
                    "Foco em Pirarucu selvagem manejado, queijos artesanais e vinhos, com atendimento de alta gastronomia."
                )
                else -> Triple(
                    "Economia Manaus",
                    listOf("Geral"),
                    "Preços monitorados para o consumidor manauara."
                )
            }

            SupermarketScorecard(
                id = market.id,
                name = market.name,
                brandColorHex = market.colorHex,
                rank = index + 1,
                overallIndexScore = total,
                averageBasketDifferenceFromLeader = diff,
                bestCategories = bestCats,
                badgeLabel = badge,
                recommendationSummary = summary,
                isOverallBestValue = index == 0
            )
        }
    }

    fun getManausSeasonalAdvice(): List<SeasonalShoppingAdvice> {
        return listOf(
            SeasonalShoppingAdvice(
                title = "Quarta e Quinta Verde nos Hipermercados",
                period = "Toda Quarta e Quinta-Feira",
                recommendedSupermarkets = listOf("DB Supermercados", "Pátio Gourmet", "Supermercado Vitória"),
                categoriesInFocus = "Banana Pacovã, Frutas Regionais, Macaxeira, Verduras",
                description = "Os grandes hipermercados recebem remessas frescas dos produtores de Iranduba, Manacapuru e Rio Preto da Eva, cortando a margem de hortifruti em até 40%.",
                savingPotential = "Economia de até 40%"
            ),
            SeasonalShoppingAdvice(
                title = "Finais de Semana da Carne & Pescado",
                period = "Sexta a Domingo",
                recommendedSupermarkets = listOf("Baratão da Carne", "Nova Era Superatacado"),
                categoriesInFocus = "Tambaqui Tratado, Alcatra, Picanha, Coxa de Frango",
                description = "Disputa ferrenha entre os açougues de Manaus. O Baratão da Carne lança o Festival de Carnes com Tambaqui a partir de R$ 14,99/kg e alcatra resfriada com super desconto.",
                savingPotential = "Economia de 25% a 35%"
            ),
            SeasonalShoppingAdvice(
                title = "Ciclo Financeiro do Polo Industrial de Manaus (PIM)",
                period = "Dias 09 a 14 e 24 a 28 de cada mês",
                recommendedSupermarkets = listOf("Atacadão Manaus", "Assaí Atacadista", "Nova Era"),
                categoriesInFocus = "Cesta Básica (Arroz 5kg, Feijão, Óleo de Soja), Produtos de Limpeza",
                description = "Nos dias que antecedem e sucedem as quinzenas do PIM (dias 5 e 20), os atacarejos manauaras lançam folhetos agressivos de fechamento com compras de fardos mais baratas.",
                savingPotential = "Economia de 15% a 22%"
            ),
            SeasonalShoppingAdvice(
                title = "Safra Amazônica dos Rios (Vazante e Piracema)",
                period = "Agosto a Dezembro (Período Seco dos Rios)",
                recommendedSupermarkets = listOf("Baratão da Carne", "DB Hiper", "Feira da Panair"),
                categoriesInFocus = "Tambaqui de Cativeiro, Pirarucu, Matrinxã, Farinha do Uarini",
                description = "A maior oferta de pescados amazônicos nos rios Negro e Solimões e represas do Amazonas ocorre na vazante, garantindo peixes mais gordos e preços mais baixos na capital.",
                savingPotential = "Economia de até 30% em Peixes"
            )
        )
    }

    suspend fun queryGeminiShoppingInsights(
        currentPricesSnapshot: String
    ): String = withContext(Dispatchers.IO) {
        val apiKey = BuildConfig.GEMINI_API_KEY
        if (apiKey.isNullOrBlank() || apiKey == "MY_GEMINI_API_KEY") {
            return@withContext getLocalFallbackInsight()
        }

        try {
            val endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$apiKey"

            val prompt = """
                Você é um consultor especialista em economia doméstica e compras de supermercado em Manaus, Amazonas.
                Analise os dados atuais do mercado de Manaus:
                $currentPricesSnapshot

                Forneça uma análise prática e direta para a dona de casa e trabalhador de Manaus:
                1. Qual supermercado está valendo mais a pena hoje em Manaus e por quê.
                2. Quais os melhores dias da semana e épocas do mês para economizar na cesta básica, carnes e hortifruti em Manaus.
                3. Uma dica de ouro com produtos amazônicos (Tambaqui, Farinha do Uarini, Banana Pacovã, etc.).
                Seja objetivo, entusiasta e use o contexto regional de Manaus (Zonas da cidade, PIM, Quarta Verde).
            """.trimIndent()

            val requestBodyJson = JSONObject().apply {
                put("contents", JSONArray().apply {
                    put(JSONObject().apply {
                        put("parts", JSONArray().apply {
                            put(JSONObject().apply {
                                put("text", prompt)
                            })
                        })
                    })
                })
            }

            val request = Request.Builder()
                .url(endpoint)
                .post(requestBodyJson.toString().toRequestBody("application/json".toMediaType()))
                .build()

            val response = httpClient.newCall(request).execute()
            if (response.isSuccessful) {
                val responseStr = response.body?.string() ?: ""
                val root = JSONObject(responseStr)
                val text = root.getJSONArray("candidates")
                    .getJSONObject(0)
                    .getJSONObject("content")
                    .getJSONArray("parts")
                    .getJSONObject(0)
                    .getString("text")
                return@withContext text
            } else {
                Log.w("GeminiShopping", "Response error: ${response.code}")
                return@withContext getLocalFallbackInsight()
            }
        } catch (e: Exception) {
            Log.e("GeminiShopping", "Error querying Gemini", e)
            return@withContext getLocalFallbackInsight()
        }
    }

    private fun getLocalFallbackInsight(): String {
        return """
            💡 **Diagnóstico de Inteligência de Compras em Manaus**
            
            • **Supermercado Mais Vantajoso no Geral:** Para a compra do mês completa (arroz, feijão, óleo, laticínios e limpeza), o **Atacadão** (Camapuã) e o **Nova Era** (Torquato) lideram o ranking de economia com preços de fardos e embalagens econômicas até 18% abaixo da média de Manaus.
            
            • **O Campeão do Açougue e Pescados:** Para carnes bovinas e **Tambaqui fresco**, o **Baratão da Carne** (Betânia e Cidade Nova) continua imbatível, praticando o menor preço da capital (R$ 14,99/kg no Tambaqui e R$ 33,90/kg na Alcatra).
            
            • **Melhores Dias da Semana:**
              - **Quarta e Quinta-Feira:** Vá ao **DB Supermercados** para aproveitar a *Quarta Verde*, melhor dia para banana pacovã, frutas e verduras.
              - **Sexta a Domingo:** Aproveite as ofertas de fim de semana do Nova Era e Baratão.
              
            • **Dica de Ouro de Manaus:** O ciclo de pagamentos das fábricas do Polo Industrial de Manaus (dias 5 e 20) costuma inflacionar e lotar os mercados. O melhor período para garimpar promoções e queima de estoques nos atacarejos é nos dias intermediários (entre o dia 9 e 13, e entre 24 e 27).
        """.trimIndent()
    }
}
