package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.LocalOffer
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.TrendingDown
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.data.repository.ProductComparisonGroup
import com.example.ui.components.AddAlertDialog
import com.example.ui.components.AddPriceDialog
import com.example.ui.notifications.PriceAlertNotificationHelper
import com.example.ui.screens.BasketComparisonScreen
import com.example.ui.screens.EncartesScreen
import com.example.ui.screens.MarketIntelligenceScreen
import com.example.ui.screens.PriceAlertsScreen
import com.example.ui.screens.PriceMonitorScreen
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.viewmodel.MarketMonitorViewModel

enum class MainTab(val title: String) {
    MONITOR("Monitor"),
    BASKET("Cesta"),
    INTELLIGENCE("IA & Médias"),
    ENCARTES("Encartes"),
    ALERTS("Alertas")
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        // Initialize notification channel for Manaus price alerts
        PriceAlertNotificationHelper.createNotificationChannel(this)

        setContent {
            MyApplicationTheme {
                PrecoManausApp()
            }
        }
    }
}

@Composable
fun PrecoManausApp(
    viewModel: MarketMonitorViewModel = viewModel()
) {
    var currentTab by remember { mutableStateOf(MainTab.MONITOR) }
    val snackbarHostState = remember { SnackbarHostState() }

    // Dialog state
    var showAddPriceDialog by remember { mutableStateOf(false) }
    var showAddAlertDialog by remember { mutableStateOf(false) }
    var selectedProductForAlert by remember { mutableStateOf<ProductComparisonGroup?>(null) }

    // Observed data from ViewModel
    val products by viewModel.filteredProducts.collectAsStateWithLifecycle()
    val supermarkets by viewModel.supermarkets.collectAsStateWithLifecycle()
    val shoppingList by viewModel.shoppingList.collectAsStateWithLifecycle()
    val basketComparison by viewModel.basketComparison.collectAsStateWithLifecycle()
    val encartes by viewModel.weeklyEncartes.collectAsStateWithLifecycle()
    val priceAlerts by viewModel.priceAlerts.collectAsStateWithLifecycle()

    val categorySummaries by viewModel.categorySummaries.collectAsStateWithLifecycle()
    val scorecards by viewModel.supermarketScorecards.collectAsStateWithLifecycle()
    val geminiInsights by viewModel.geminiAiInsights.collectAsStateWithLifecycle()
    val isGeneratingAi by viewModel.isGeneratingAiInsights.collectAsStateWithLifecycle()

    val isSyncingApis by viewModel.isSyncingApis.collectAsStateWithLifecycle()
    val apiStatuses by viewModel.apiHealthStatuses.collectAsStateWithLifecycle()
    val lastSyncTime by viewModel.lastSyncTime.collectAsStateWithLifecycle()

    val searchQuery by viewModel.searchQuery.collectAsStateWithLifecycle()
    val selectedCategory by viewModel.selectedCategory.collectAsStateWithLifecycle()
    val selectedMarketId by viewModel.selectedSupermarketId.collectAsStateWithLifecycle()
    val sortOption by viewModel.sortOption.collectAsStateWithLifecycle()
    val noticeMessage by viewModel.userNotice.collectAsStateWithLifecycle()

    // Handle back button when not in primary Monitor tab
    BackHandler(enabled = currentTab != MainTab.MONITOR) {
        currentTab = MainTab.MONITOR
    }

    // Show feedback messages
    LaunchedEffect(noticeMessage) {
        noticeMessage?.let {
            snackbarHostState.showSnackbar(it)
            viewModel.clearNotice()
        }
    }

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        snackbarHost = { SnackbarHost(snackbarHostState) },
        bottomBar = {
            NavigationBar(
                modifier = Modifier.testTag("bottom_navigation_bar")
            ) {
                NavigationBarItem(
                    selected = currentTab == MainTab.MONITOR,
                    onClick = { currentTab = MainTab.MONITOR },
                    icon = { Icon(Icons.Default.TrendingDown, contentDescription = "Monitor de Preços") },
                    label = { Text("Monitor") },
                    modifier = Modifier.testTag("nav_tab_monitor")
                )
                NavigationBarItem(
                    selected = currentTab == MainTab.BASKET,
                    onClick = { currentTab = MainTab.BASKET },
                    icon = { Icon(Icons.Default.ShoppingCart, contentDescription = "Comparador de Cesta") },
                    label = {
                        Text(
                            if (shoppingList.isNotEmpty()) "Cesta (${shoppingList.size})" else "Cesta"
                        )
                    },
                    modifier = Modifier.testTag("nav_tab_basket")
                )
                NavigationBarItem(
                    selected = currentTab == MainTab.INTELLIGENCE,
                    onClick = { currentTab = MainTab.INTELLIGENCE },
                    icon = { Icon(Icons.Default.AutoAwesome, contentDescription = "Inteligência IA e Médias") },
                    label = { Text("IA & Médias") },
                    modifier = Modifier.testTag("nav_tab_intelligence")
                )
                NavigationBarItem(
                    selected = currentTab == MainTab.ENCARTES,
                    onClick = { currentTab = MainTab.ENCARTES },
                    icon = { Icon(Icons.Default.LocalOffer, contentDescription = "Encartes da Semana") },
                    label = { Text("Encartes") },
                    modifier = Modifier.testTag("nav_tab_encartes")
                )
                NavigationBarItem(
                    selected = currentTab == MainTab.ALERTS,
                    onClick = { currentTab = MainTab.ALERTS },
                    icon = { Icon(Icons.Default.Notifications, contentDescription = "Alertas de Preço") },
                    label = {
                        val activeCount = priceAlerts.count { it.isTriggered }
                        Text(if (activeCount > 0) "Alertas ($activeCount)" else "Alertas")
                    },
                    modifier = Modifier.testTag("nav_tab_alerts")
                )
            }
        },
        floatingActionButton = {
            if (currentTab == MainTab.MONITOR) {
                FloatingActionButton(
                    onClick = { showAddPriceDialog = true },
                    containerColor = MaterialTheme.colorScheme.primary,
                    contentColor = MaterialTheme.colorScheme.onPrimary,
                    modifier = Modifier.testTag("fab_report_price")
                ) {
                    Icon(Icons.Default.Add, contentDescription = "Reportar Preço em Manaus")
                }
            }
        }
    ) { innerPadding ->
        when (currentTab) {
            MainTab.MONITOR -> {
                PriceMonitorScreen(
                    products = products,
                    supermarkets = supermarkets,
                    searchQuery = searchQuery,
                    selectedCategory = selectedCategory,
                    selectedSupermarketId = selectedMarketId,
                    sortOption = sortOption,
                    onSearchChange = { viewModel.updateSearchQuery(it) },
                    onCategoryChange = { viewModel.setCategory(it) },
                    onSupermarketFilterChange = { viewModel.setSupermarketFilter(it) },
                    onSortChange = { viewModel.setSort(it) },
                    onAddToList = { viewModel.addToShoppingList(it) },
                    onOpenAddPrice = { showAddPriceDialog = true },
                    onOpenCreateAlert = {
                        selectedProductForAlert = it
                        showAddAlertDialog = true
                    },
                    onConfirmPrice = { viewModel.confirmPrice(it) },
                    modifier = Modifier.padding(innerPadding)
                )
            }
            MainTab.BASKET -> {
                BasketComparisonScreen(
                    items = shoppingList,
                    comparisonState = basketComparison,
                    onToggleChecked = { id, current -> viewModel.toggleShoppingItem(id, current) },
                    onUpdateQuantity = { id, qty -> viewModel.updateQuantity(id, qty) },
                    onRemoveItem = { viewModel.removeShoppingItem(it) },
                    onClearCompleted = { viewModel.clearCompletedShoppingItems() },
                    onAddCustomItem = { name, cat, qty, unit ->
                        viewModel.addCustomShoppingItem(name, cat, qty, unit)
                    },
                    modifier = Modifier.padding(innerPadding)
                )
            }
            MainTab.INTELLIGENCE -> {
                MarketIntelligenceScreen(
                    categorySummaries = categorySummaries,
                    scorecards = scorecards,
                    seasonalAdvices = viewModel.seasonalAdvices,
                    geminiInsights = geminiInsights,
                    isGeneratingAi = isGeneratingAi,
                    onGenerateAiInsights = { viewModel.generateAiInsights() },
                    modifier = Modifier.padding(innerPadding)
                )
            }
            MainTab.ENCARTES -> {
                EncartesScreen(
                    encartes = encartes,
                    supermarkets = supermarkets,
                    onSelectSupermarket = { marketId ->
                        viewModel.setSupermarketFilter(marketId)
                        currentTab = MainTab.MONITOR
                    },
                    modifier = Modifier.padding(innerPadding)
                )
            }
            MainTab.ALERTS -> {
                PriceAlertsScreen(
                    alerts = priceAlerts,
                    onRemoveAlert = { viewModel.removeAlert(it) },
                    onOpenCreateAlert = {
                        selectedProductForAlert = null
                        showAddAlertDialog = true
                    },
                    onSimulatePriceDrop = { alertId ->
                        viewModel.simulatePriceDropForAlert(alertId)
                    },
                    onSendTestNotification = {
                        viewModel.sendTestNotification()
                    },
                    modifier = Modifier.padding(innerPadding)
                )
            }
        }
    }

    // Community Price Report Dialog
    if (showAddPriceDialog) {
        AddPriceDialog(
            supermarkets = supermarkets,
            onDismiss = { showAddPriceDialog = false },
            onSave = { name, cat, unit, marketId, marketName, storeUnit, price, isDeal ->
                viewModel.reportNewPrice(
                    productName = name,
                    category = cat,
                    unit = unit,
                    supermarketId = marketId,
                    supermarketName = marketName,
                    storeUnit = storeUnit,
                    price = price,
                    isWeeklyDeal = isDeal
                )
                showAddPriceDialog = false
            }
        )
    }

    // Price Watch Alert Dialog
    if (showAddAlertDialog) {
        val prod = selectedProductForAlert
        AddAlertDialog(
            initialProductName = prod?.productName ?: "",
            currentBestPrice = prod?.lowestPrice ?: 0.0,
            currentBestStore = prod?.lowestSupermarket ?: "",
            productKey = prod?.productKey ?: "",
            onDismiss = {
                showAddAlertDialog = false
                selectedProductForAlert = null
            },
            onSaveAlert = { key, name, targetPrice ->
                viewModel.addPriceAlert(
                    productKey = key,
                    productName = name,
                    targetPrice = targetPrice,
                    currentBestPrice = prod?.lowestPrice ?: targetPrice,
                    storeName = prod?.lowestSupermarket ?: "Supermercados Manaus"
                )
                showAddAlertDialog = false
                selectedProductForAlert = null
            }
        )
    }
}
