### DIRETRIZ DE MERCADOS E LOGOS (CATÁLOGO OBRIGATÓRIO)

1. **FONTE DA VERDADE:**
   - Todo e qualquer supermercado, capital ou logo DEVE ser consultado em `src/data/supermarkets.json` e `web/data/supermarkets.json`.
   - NUNCA invente nomes de redes, slugs ou caminhos de imagens arbitrários.

2. **PADRÃO DE IDENTIFICADORES (SLUGS):**
   - Os IDs devem ser em kebab-case minúsculo (ex: "pao-de-acucar", "supermercados-bh").
   - A mesma rede presente em múltiplas capitais deve compartilhar exatamente o mesmo `id` e a mesma imagem de logo (ex: "assai" em SP e RJ usa o mesmo `web/assets/logos/assai.svg`).

3. **RENDERIZAÇÃO E FALLBACK:**
   - Sempre que gerar código que exiba a logo de um supermercado, utilize o helper `getMarketLogoUrl(marketId)` em `web/services/marketService.js`.
   - Se o arquivo de logo não existir ou falhar, SEMPRE forneça o fallback genérico com `web/assets/logos/default-market.svg`.

4. **ORGANIZAÇÃO POR CAPITAL:**
   - Toda listagem, scraping, comparativo ou filtro por localidade deve aceitar a chave composta `{UF}-{CidadeSemEspacos}` (ex: "SP-SaoPaulo", "MG-BeloHorizonte", "AM-Manaus").
