package com.example.ui.components

import androidx.compose.ui.graphics.Color

object SupermarketUtils {
    fun parseColor(hex: String, fallback: Color = Color(0xFF0F6D44)): Color {
        return try {
            Color(android.graphics.Color.parseColor(hex))
        } catch (_: Exception) {
            fallback
        }
    }

    fun getSupermarketShortName(name: String): String {
        return when {
            name.contains("DB", ignoreCase = true) -> "DB"
            name.contains("Nova Era", ignoreCase = true) -> "Nova Era"
            name.contains("Atacadão", ignoreCase = true) -> "Atacadão"
            name.contains("Assaí", ignoreCase = true) -> "Assaí"
            name.contains("Baratão", ignoreCase = true) -> "Baratão"
            name.contains("Carrefour", ignoreCase = true) -> "Carrefour"
            name.contains("Pátio", ignoreCase = true) -> "Pátio Gourmet"
            name.contains("Vitória", ignoreCase = true) -> "Vitória"
            else -> name
        }
    }

    fun getCategoryDrawable(category: String, productName: String = ""): Int {
        val text = "$category $productName".lowercase()
        return when {
            text.contains("pet") || text.contains("ração") || text.contains("gato") ||
            text.contains("cão") || text.contains("cachorro") || text.contains("whiskas") ||
            text.contains("pedigree") || text.contains("sachê") || text.contains("pipicat") -> com.example.R.drawable.cat_pets

            text.contains("limpeza") || text.contains("sabão") || text.contains("detergente") ||
            text.contains("omo") || text.contains("pinho") || text.contains("ypê") ||
            text.contains("sanitária") || text.contains("amaciante") || text.contains("downy") ||
            text.contains("veja") || text.contains("bombril") || text.contains("lixo") ||
            text.contains("higiene") || text.contains("drogaria") || text.contains("colgate") ||
            text.contains("dental") || text.contains("sabonete") || text.contains("shampoo") ||
            text.contains("desodorante") || text.contains("papel higiênico") || text.contains("paracetamol") ||
            text.contains("dipirona") || text.contains("solar") || text.contains("bebê") ||
            text.contains("fralda") || text.contains("pampers") || text.contains("huggies") ||
            text.contains("lenço") || text.contains("hipoglós") || text.contains("nan") ||
            text.contains("papelaria") || text.contains("caderno") || text.contains("caneta") ||
            text.contains("sulfite") || text.contains("lápis") || text.contains("fita") -> com.example.R.drawable.cat_cleaning

            text.contains("hortifruti") || text.contains("fruta") || text.contains("banana") ||
            text.contains("tomate") || text.contains("cebola") || text.contains("legume") ||
            text.contains("verdura") || text.contains("maçã") || text.contains("limão") ||
            text.contains("pimenta") -> com.example.R.drawable.cat_fruits

            text.contains("carne") || text.contains("peixe") || text.contains("tambaqui") ||
            text.contains("picanha") || text.contains("alcatra") || text.contains("frango") ||
            text.contains("costela") || text.contains("boi") || text.contains("pescado") -> com.example.R.drawable.cat_meats

            text.contains("latic") || text.contains("matin") || text.contains("leite") ||
            text.contains("café") || text.contains("queijo") || text.contains("iogurte") ||
            text.contains("manteiga") || text.contains("ninho") || text.contains("requeijão") -> com.example.R.drawable.cat_dairy

            text.contains("cesta") || text.contains("especiaria") || text.contains("tempero") ||
            text.contains("colorau") || text.contains("cominho") || text.contains("canela") ||
            text.contains("açafrão") || text.contains("cravo") || text.contains("louro") ||
            text.contains("arroz") || text.contains("feijão") || text.contains("farinha") ||
            text.contains("óleo") || text.contains("açúcar") || text.contains("macarrão") ||
            text.contains("uarini") -> com.example.R.drawable.cat_staples

            else -> com.example.R.drawable.cat_staples
        }
    }
}
