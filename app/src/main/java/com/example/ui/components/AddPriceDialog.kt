package com.example.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.LocalOffer
import androidx.compose.material.icons.filled.Store
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.example.data.local.entity.SupermarketEntity

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddPriceDialog(
    supermarkets: List<SupermarketEntity>,
    initialProductName: String = "",
    onDismiss: () -> Unit,
    onSave: (
        productName: String,
        category: String,
        unitMeasure: String,
        supermarketId: String,
        supermarketName: String,
        storeUnit: String,
        price: Double,
        isWeeklyDeal: Boolean
    ) -> Unit
) {
    var productName by remember { mutableStateOf(initialProductName) }
    var priceText by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("Cesta Básica") }
    var unitMeasure by remember { mutableStateOf("1kg") }
    var isWeeklyDeal by remember { mutableStateOf(false) }

    val categories = listOf(
        "Cesta Básica",
        "Carnes & Peixes Regionais",
        "Hortifruti & Manaus",
        "Matinais & Laticínios",
        "Limpeza & Higiene"
    )

    var expandedMarketDropdown by remember { mutableStateOf(false) }
    var selectedMarket by remember {
        mutableStateOf(supermarkets.firstOrNull() ?: SupermarketEntity(
            id = "db",
            name = "DB Supermercados",
            brand = "Grupo DB",
            flagshipUnit = "Hiper DB Paraíba",
            address = "Manaus",
            neighborhood = "Adrianópolis",
            zone = "Zona Centro-Sul",
            colorHex = "#D32F2F",
            rating = 4.6,
            activeDealsCount = 10,
            openingHours = "07:00 às 22:00",
            phone = ""
        ))
    }

    var storeUnit by remember { mutableStateOf(selectedMarket.flagshipUnit) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = "Reportar Preço em Manaus",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
                IconButton(onClick = onDismiss) {
                    Icon(Icons.Default.Close, contentDescription = "Fechar")
                }
            }
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState())
            ) {
                Text(
                    text = "Ajude os consumidores de Manaus colaborando com preços atualizados.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                Spacer(modifier = Modifier.height(16.dp))

                OutlinedTextField(
                    value = productName,
                    onValueChange = { productName = it },
                    label = { Text("Nome do Produto / Marca") },
                    placeholder = { Text("Ex: Farinha do Uarini 1kg") },
                    singleLine = true,
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("input_product_name")
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Price Input
                OutlinedTextField(
                    value = priceText,
                    onValueChange = { priceText = it },
                    label = { Text("Preço Encontrado (R$)") },
                    placeholder = { Text("Ex: 14.99") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                    singleLine = true,
                    leadingIcon = {
                        Text(
                            text = "R$",
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(start = 12.dp)
                        )
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("input_product_price")
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Supermarket selector
                ExposedDropdownMenuBox(
                    expanded = expandedMarketDropdown,
                    onExpandedChange = { expandedMarketDropdown = !expandedMarketDropdown }
                ) {
                    OutlinedTextField(
                        value = selectedMarket.name,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Supermercado") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expandedMarketDropdown) },
                        leadingIcon = { Icon(Icons.Default.Store, contentDescription = null) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .menuAnchor()
                    )
                    ExposedDropdownMenu(
                        expanded = expandedMarketDropdown,
                        onDismissRequest = { expandedMarketDropdown = false }
                    ) {
                        supermarkets.forEach { market ->
                            DropdownMenuItem(
                                text = { Text(market.name) },
                                onClick = {
                                    selectedMarket = market
                                    storeUnit = market.flagshipUnit
                                    expandedMarketDropdown = false
                                }
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                OutlinedTextField(
                    value = storeUnit,
                    onValueChange = { storeUnit = it },
                    label = { Text("Unidade / Bairro em Manaus") },
                    placeholder = { Text("Ex: Torquato Tapajós, Betânia, Ponta Negra") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(12.dp))

                Text("Categoria:", style = MaterialTheme.typography.labelLarge)
                Spacer(modifier = Modifier.height(4.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Column {
                        categories.chunked(2).forEach { rowCats ->
                            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                rowCats.forEach { cat ->
                                    FilterChip(
                                        selected = selectedCategory == cat,
                                        onClick = { selectedCategory = cat },
                                        label = { Text(cat, style = MaterialTheme.typography.bodySmall) }
                                    )
                                }
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                OutlinedTextField(
                    value = unitMeasure,
                    onValueChange = { unitMeasure = it },
                    label = { Text("Embalagem / Medida (Ex: 5kg, 1kg, 1L, un)") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(12.dp))

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "É oferta de encarte / promoção?",
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.SemiBold
                        )
                        Text(
                            text = "Aparece com destaque de oferta na loja",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    Switch(
                        checked = isWeeklyDeal,
                        onCheckedChange = { isWeeklyDeal = it },
                        modifier = Modifier.testTag("switch_deal")
                    )
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val parsedPrice = priceText.replace(",", ".").toDoubleOrNull() ?: 0.0
                    if (productName.isNotBlank() && parsedPrice > 0) {
                        onSave(
                            productName.trim(),
                            selectedCategory,
                            unitMeasure.trim(),
                            selectedMarket.id,
                            selectedMarket.name,
                            storeUnit.ifBlank { selectedMarket.flagshipUnit },
                            parsedPrice,
                            isWeeklyDeal
                        )
                    }
                },
                enabled = productName.isNotBlank() && (priceText.replace(",", ".").toDoubleOrNull() ?: 0.0) > 0,
                modifier = Modifier.testTag("confirm_save_price")
            ) {
                Text("Publicar Preço")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancelar")
            }
        }
    )
}
