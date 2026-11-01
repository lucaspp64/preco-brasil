# PreçoManaus 2.0 — Ecossistema Completo (Web/PWA + Backend Node.js + Android Nativo)

Monitoramento inteligente de preços, rota mista com cálculo de combustível por bairro e leitura de NFC-e (SEFAZ-AM) e etiquetas nos principais supermercados de Manaus (**DB Supermercados, Nova Era, Atacadão, Assaí, Baratão da Carne e Carrefour**).

---

## 📁 Estrutura Modular do Projeto

- `index.html`, `manifest.json`, `sw.js` — Aplicação **Web / PWA** instalável.
- `web/`
  - `styles/main.css` — Design System Mobile-First e estilos da interface.
  - `data/manausCatalog.js` — Catálogo unificado de 6 redes, 37+ produtos regionais e líderes, encartes e 12 itens da Cesta Básica DIEESE Manaus.
  - `services/distanceService.js` — Coordenadas de 21 bairros nas 6 zonas de Manaus e cálculo de distância/combustível (Haversine).
  - `services/shoppingOptimizer.js` — Motor combinatório (Comprar em 1 Loja vs. Dividir em 2 Lojas descontando combustível) + Detector de Promoção Real vs. "Metade do Dobro".
  - `services/apiClient.js` — Cliente REST com fallback offline automático.
  - `app.js` — Controlador de telas, Scanner EAN-13, Importador NFC-e SEFAZ-AM, Comunidade e WhatsApp.
- `server/`
  - `index.js` — Servidor Node.js (zero dependências externas) que serve o Web/PWA e expõe a API REST (`/api/health`, `/api/catalog`, `/api/live-prices`, `/api/optimize-basket`, `/api/nfce/parse`, `/api/ai/scan-label`, `/api/community/contribute`).
  - `data/db.json` — Banco de dados persistente gerado e atualizado automaticamente.
  - `test-api.js` — Suíte de testes automatizados End-to-End.
- `app/` — Aplicativo **Android Nativo (Kotlin + Jetpack Compose + Room)** integrado ao servidor e com cálculo de distância Haversine + compartilhamento no WhatsApp.

---

## 🚀 Como Rodar no VS Code

### 1. Rodar o Servidor Backend + Web/PWA
No terminal integrado do VS Code (`Ctrl + '`), execute:
```bash
npm start
```
Depois abra no navegador: **http://localhost:3000**

Para rodar a suíte de testes automatizados:
```bash
npm test
```

### 2. Configurar a Chave do Gemini AI (Opcional)
Edite o arquivo `.env` na raiz do projeto e insira sua chave do Google AI Studio:
```env
GEMINI_API_KEY=sua_chave_aqui
PORT=3000
```

### 3. Compilar o App Android Nativo (`app/`)
Abra a pasta no Android Studio (ou use a extensão Kotlin/Gradle no VS Code com JDK 17+) para rodar no emulador ou celular físico. O `LiveMarketApiClient.kt` já sincroniza automaticamente com `http://10.0.2.2:3000/api/live-prices` e com as APIs de Manaus.
