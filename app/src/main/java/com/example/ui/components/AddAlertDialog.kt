package com.example.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.NotificationsActive
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
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

@Composable
fun AddAlertDialog(
    initialProductName: String = "",
    currentBestPrice: Double = 0.0,
    currentBestStore: String = "",
    productKey: String = "",
    onDismiss: () -> Unit,
    onSaveAlert: (productKey: String, productName: String, targetPrice: Double) -> Unit
) {
    var productName by remember { mutableStateOf(initialProductName) }
    var targetPriceText by remember {
        mutableStateOf(if (currentBestPrice > 0) "%.2f".format(currentBestPrice * 0.9) else "")
    }

    AlertDialog(
        onDismissRequest = onDismiss,
        icon = {
            Icon(
                Icons.Default.NotificationsActive,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary
            )
        },
        title = {
            Text(
                text = "Criar Alerta de Preço",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
        },
        text = {
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "Avisaremos você assim que este item estiver abaixo do preço desejado nos supermercados de Manaus.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                Spacer(modifier = Modifier.height(16.dp))

                OutlinedTextField(
                    value = productName,
                    onValueChange = { productName = it },
                    label = { Text("Produto") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )

                if (currentBestPrice > 0) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Melhor preço atual: R$ ${"%.2f".format(currentBestPrice)} ($currentBestStore)",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.Medium
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                OutlinedTextField(
                    value = targetPriceText,
                    onValueChange = { targetPriceText = it },
                    label = { Text("Preço Alvo Desejado (R$)") },
                    placeholder = { Text("Ex: 14.00") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                    singleLine = true,
                    leadingIcon = {
                        Text(
                            "R$",
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(start = 12.dp)
                        )
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("input_alert_price")
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val price = targetPriceText.replace(",", ".").toDoubleOrNull() ?: 0.0
                    if (productName.isNotBlank() && price > 0) {
                        val key = productKey.ifBlank {
                            productName.lowercase().replace(Regex("[^a-z0-9]"), "_").take(24)
                        }
                        onSaveAlert(key, productName.trim(), price)
                    }
                },
                enabled = productName.isNotBlank() && (targetPriceText.replace(",", ".").toDoubleOrNull() ?: 0.0) > 0,
                modifier = Modifier.testTag("save_alert_button")
            ) {
                Text("Salvar Alerta")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancelar")
            }
        }
    )
}
