---
trigger: always_on
description: Diretriz obrigatória do catálogo canônico dos 15 maiores supermercados das 27 capitais brasileiras e suas logos
---

### DIRETRIZ DE MERCADOS E LOGOS (CATÁLOGO OBRIGATÓRIO)

1. **FONTE DA VERDADE (`Single Source of Truth`):**
   - Todo e qualquer supermercado, capital ou logo DEVE ser consultado em `web/data/supermarkets.json` (espelhado em `src/data/supermarkets.json`).
   - NUNCA invente nomes de redes, slugs ou caminhos de imagens arbitrários.

2. **PADRÃO DE IDENTIFICADORES (SLUGS):**
   - Os IDs devem ser em `kebab-case` minúsculo (ex: `"pao-de-acucar"`, `"supermercados-bh"`, `"db-supermercados"`).
   - A mesma rede presente em múltiplas capitais deve compartilhar exatamente o mesmo `id` e a mesma imagem de logo (ex: `"assai"` em SP, RJ e AM usa o mesmo `web/assets/logos/assai.svg`).

3. **RENDERIZAÇÃO E FALLBACK (`marketService.js`):**
   - Sempre que gerar código que exiba a lista de mercados ou a logo de um supermercado, utilize o serviço `MarketService` (`web/services/marketService.js`):
     - `getMarketsByCapital(capitalKey)`
     - `getMarketLogoUrl(marketId)`
     - `getAvailableCapitals()`
   - Se o arquivo de logo não existir ou falhar, SEMPRE forneça o fallback seguro `web/assets/logos/default-market.svg` ou as iniciais da rede.

4. **ORGANIZAÇÃO POR CAPITAL (`{UF}-{CidadeSemEspacos}`):**
   - Toda listagem, scraping, comparativo ou filtro por localidade aceita a chave composta `{UF}-{CidadeSemEspacos}` (ex: `"SP-SaoPaulo"`, `"RJ-RioDeJaneiro"`, `"AM-Manaus"`, `"RR-BoaVista"`, `"MG-BeloHorizonte"`) ou o alias legado da capital.
