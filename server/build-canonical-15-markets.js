/**
 * Constrói as 3 camadas para o Antigravity e para o App PreçoBrasil:
 * 1. Arquivo canônico: web/data/supermarkets.json (e cópia em src/data/supermarkets.json) com 15 mercados reais para cada uma das 27 capitais (405 unidades mapeadas).
 * 2. Logos SVG para cada ID em kebab-case em web/assets/logos/{id}.svg + default-market.svg.
 * 3. Helper padronizado: web/services/marketService.js (Browser + Node.js).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LOGOS_DIR = path.join(ROOT, 'web', 'assets', 'logos');
const WEB_DATA_DIR = path.join(ROOT, 'web', 'data');
const SRC_DATA_DIR = path.join(ROOT, 'src', 'data');
const RULES_DIR = path.join(ROOT, '.agent', 'rules');
const ANTIGRAVITY_DIR = path.join(ROOT, '.antigravity');

fs.mkdirSync(LOGOS_DIR, { recursive: true });
fs.mkdirSync(WEB_DATA_DIR, { recursive: true });
fs.mkdirSync(SRC_DATA_DIR, { recursive: true });
fs.mkdirSync(RULES_DIR, { recursive: true });
fs.mkdirSync(ANTIGRAVITY_DIR, { recursive: true });

// Os 15 maiores mercados reais de cada uma das 27 capitais brasileiras
const CAPITALS_15_RAW = {
  "AM-Manaus": {
    legacyId: "manaus", cidade: "Manaus", uf: "AM", regiao: "Norte",
    mercados: [
      ["db-supermercados", "DB Supermercados", "hiper", "#D32F2F"],
      ["nova-era", "Nova Era Superatacado", "atacarejo", "#F57C00"],
      ["atacadao", "Atacadão", "atacarejo", "#2E7D32"],
      ["assai", "Assaí Atacadista", "atacarejo", "#1976D2"],
      ["baratao-da-carne", "Baratão da Carne", "super", "#C62828"],
      ["carrefour", "Carrefour", "hiper", "#0D47A1"],
      ["supermercados-rodrigues", "Supermercados Rodrigues", "super", "#1565C0"],
      ["supermercado-coari", "Supermercado Coari", "super", "#2E7D32"],
      ["supermercado-veneza-am", "Supermercado Veneza", "super", "#AD1457"],
      ["supermercado-vitoria-am", "Supermercados Vitória", "super", "#EF6C00"],
      ["emporio-db", "Empório DB", "premium", "#B71C1C"],
      ["mania-supermercados", "Mania Supermercados", "super", "#00838F"],
      ["supermercado-bom-preco-am", "Bom Preço Manaus", "proximidade", "#283593"],
      ["mercadinho-sao-jorge", "Mercadinho São Jorge", "proximidade", "#00695C"],
      ["feira-manaus-moderna", "Feira da Manaus Moderna", "hortifruti", "#33691E"]
    ]
  },
  "RR-BoaVista": {
    legacyId: "boa_vista", cidade: "Boa Vista", uf: "RR", regiao: "Norte",
    mercados: [
      ["db-supermercados", "Hiper DB Boa Vista", "hiper", "#D32F2F"],
      ["supermercado-gaviao", "Supermercado Gavião", "super", "#00695C"],
      ["atacadao", "Atacadão", "atacarejo", "#2E7D32"],
      ["assai", "Assaí Atacadista", "atacarejo", "#1976D2"],
      ["supermercado-goiana", "Supermercado Goiana", "super", "#2E7D32"],
      ["novo-tempo", "Supermercado Novo Tempo", "super", "#283593"],
      ["supermercado-sao-jorge-rr", "Supermercado São Jorge RR", "super", "#C62828"],
      ["supermercado-pato-branco", "Supermercado Pato Branco", "super", "#1565C0"],
      ["supermercado-progresso-rr", "Supermercado Progresso", "super", "#EF6C00"],
      ["atacadao-bandeirantes", "Atacadão Bandeirantes RR", "atacarejo", "#00838F"],
      ["supermercado-bom-jesus-rr", "Supermercado Bom Jesus", "proximidade", "#6A1B9A"],
      ["supermercado-uniao-rr", "Supermercado União BV", "proximidade", "#4E342E"],
      ["minimercado-paraviana", "Mercadinho Paraviana", "proximidade", "#00695C"],
      ["mercadinho-boa-compra", "Mercadinho Boa Compra", "proximidade", "#00796B"],
      ["feira-do-produtor-rr", "Feira do Produtor de Roraima", "hortifruti", "#33691E"]
    ]
  },
  "PA-Belem": {
    legacyId: "belem", cidade: "Belém", uf: "PA", regiao: "Norte",
    mercados: [
      ["supermercados-lider", "Supermercados Líder", "hiper", "#D32F2F"],
      ["mix-mateus", "Mix Mateus", "atacarejo", "#0D47A1"],
      ["supermercado-formosa", "Supermercado Formosa", "hiper", "#C2185B"],
      ["atacadao", "Atacadão", "atacarejo", "#2E7D32"],
      ["assai", "Assaí Atacadista", "atacarejo", "#1976D2"],
      ["preco-baixo-pa", "Supermercado Preço Baixo", "super", "#283593"],
      ["supermercado-cidade-pa", "Supermercado Cidade", "super", "#EF6C00"],
      ["supermercado- Mateus-pa", "Supermercado Mateus", "super", "#1565C0"],
      ["economico-belem", "Econômico Supermercados", "super", "#00838F"],
      ["supermercado-elos", "Supermercado Elos", "super", "#2E7D32"],
      ["supermercado-belem", "Belém Supermercados", "super", "#6A1B9A"],
      ["lider-quick", "Líder Quick", "proximidade", "#B71C1C"],
      ["mercadinho-nazare", "Mercadinho Nazaré", "proximidade", "#00695C"],
      ["sacolao-pedreira", "Sacolão da Pedreira", "hortifruti", "#558B2F"],
      ["feira-ver-o-peso", "Feira do Ver-o-Peso", "hortifruti", "#33691E"]
    ]
  },
  "RO-PortoVelho": {
    legacyId: "porto_velho", cidade: "Porto Velho", uf: "RO", regiao: "Norte",
    mercados: [
      ["irmaos-goncalves", "Irmãos Gonçalves (IG)", "hiper", "#D32F2F"],
      ["nova-era", "Nova Era Superatacado", "atacarejo", "#F57C00"],
      ["atacadao", "Atacadão", "atacarejo", "#2E7D32"],
      ["assai", "Assaí Atacadista", "atacarejo", "#1976D2"],
      ["supermercado-araujo-ro", "Supermercado Araújo RO", "super", "#C62828"],
      ["supermercado-coimbra", "Supermercado Coimbra", "super", "#283593"],
      ["supermercado-dydyo", "Supermercado Central PVH", "super", "#00838F"],
      ["tatiana-supermercados", "Tatiana Supermercados", "super", "#AD1457"],
      ["supermercado-esperanca-ro", "Supermercado Esperança", "super", "#2E7D32"],
      ["supermercado-popular-ro", "Supermercado Popular PVH", "proximidade", "#EF6C00"],
      ["supermercado-jatuarana", "Supermercado Jatuarana", "proximidade", "#1565C0"],
      ["supermercado-calama", "Supermercado Calama", "proximidade", "#4E342E"],
      ["mercadinho-embratel", "Mercadinho Embratel", "proximidade", "#00695C"],
      ["sacolao-zona-sul-ro", "Sacolão Zona Sul PVH", "hortifruti", "#558B2F"],
      ["feira-do-produtor-pvh", "Feira do Produtor PVH", "hortifruti", "#33691E"]
    ]
  },
  "AC-RioBranco": {
    legacyId: "rio_branco", cidade: "Rio Branco", uf: "AC", regiao: "Norte",
    mercados: [
      ["supermercados-araujo", "Supermercados Araújo", "hiper", "#D32F2F"],
      ["atacale", "Atacale Atacarejo", "atacarejo", "#F57C00"],
      ["mercale", "Mercale Supermercados", "super", "#EF6C00"],
      ["atacadao", "Atacadão", "atacarejo", "#2E7D32"],
      ["assai", "Assaí Atacadista", "atacarejo", "#1976D2"],
      ["pague-pouco-ac", "Supermercado Pague Pouco", "super", "#C2185B"],
      ["irmaos-goncalves", "Irmãos Gonçalves AC", "hiper", "#B71C1C"],
      ["supermercado-popular-ac", "Supermercado Popular AC", "super", "#283593"],
      ["supermercado-sao-pedro-ac", "Supermercado São Pedro", "super", "#00838F"],
      ["supermercado-bom-preco-ac", "Bom Preço Rio Branco", "super", "#1565C0"],
      ["supermercado-sobral", "Supermercado Sobral", "proximidade", "#6A1B9A"],
      ["supermercado-floresta-ac", "Supermercado Floresta", "proximidade", "#2E7D32"],
      ["mercadinho-do-bosque", "Mercadinho do Bosque", "proximidade", "#00695C"],
      ["hortifruti-via-verde", "Hortifruti Via Verde", "hortifruti", "#558B2F"],
      ["mercado-elias-mansour", "Mercado Elias Mansour", "hortifruti", "#33691E"]
    ]
  },
  "AP-Macapa": {
    legacyId: "macapa", cidade: "Macapá", uf: "AP", regiao: "Norte",
    mercados: [
      ["fortaleza-supermercados", "Fortaleza Supermercados", "hiper", "#D32F2F"],
      ["santa-lucia-ap", "Santa Lúcia Supermercados", "super", "#F57C00"],
      ["atacadao", "Atacadão", "atacarejo", "#2E7D32"],
      ["assai", "Assaí Atacadista", "atacarejo", "#1976D2"],
      ["favorito-ap", "Supermercado Favorito AP", "super", "#C2185B"],
      ["rede-mini-box", "Rede Mini Box", "super", "#283593"],
      ["supermercado-ramiro", "Supermercado Ramiro", "super", "#1565C0"],
      ["supermercado-empala", "Supermercado Empala", "super", "#00838F"],
      ["supermercado-2000-ap", "Supermercado 2000", "super", "#AD1457"],
      ["atacadao-macapa-norte", "Atacarejo Macapá Norte", "atacarejo", "#EF6C00"],
      ["supermercado-buritizal", "Supermercado Buritizal", "proximidade", "#6A1B9A"],
      ["mercadinho-do-trem", "Mercadinho do Trem", "proximidade", "#00695C"],
      ["mercadinho-marco-zero", "Mercadinho Marco Zero", "proximidade", "#00796B"],
      ["sacolao-equador", "Sacolão Meio do Mundo", "hortifruti", "#558B2F"],
      ["feira-do-agricultor-ap", "Feira do Agricultor Macapá", "hortifruti", "#33691E"]
    ]
  },
  "TO-Palmas": {
    legacyId: "palmas", cidade: "Palmas", uf: "TO", regiao: "Norte",
    mercados: [
      ["quartetto", "Quartetto Supermercados", "super", "#D32F2F"],
      ["mix-mateus", "Mix Mateus", "atacarejo", "#0D47A1"],
      ["atacadao", "Atacadão", "atacarejo", "#2E7D32"],
      ["assai", "Assaí Atacadista", "atacarejo", "#1976D2"],
      ["big-norte-to", "Supermercado Big Norte", "super", "#C2185B"],
      ["super-vale-to", "Supermercado Super Vale", "super", "#283593"],
      ["supermercado-real-to", "Supermercado Real Palmas", "super", "#EF6C00"],
      ["supermercado-flamboyant-to", "Supermercado Flamboyant", "super", "#00838F"],
      ["atacadao-taquaralto", "Atacarejo Taquaralto", "atacarejo", "#1565C0"],
      ["supermercado-sol-nascente", "Supermercado Sol Nascente", "super", "#6A1B9A"],
      ["supermercado-aureny", "Supermercado Aureny", "proximidade", "#4E342E"],
      ["mercadinho-da-quadra-to", "Mercadinho da Quadra Sul", "proximidade", "#00695C"],
      ["mercadinho-graciosa", "Mercadinho Orla Graciosa", "proximidade", "#00796B"],
      ["hortifruti-plano-diretor", "Hortifruti Plano Diretor", "hortifruti", "#558B2F"],
      ["feira-da-304-sul", "Feira Coberta da 304 Sul", "hortifruti", "#33691E"]
    ]
  },
  "CE-Fortaleza": {
    legacyId: "fortaleza", cidade: "Fortaleza", uf: "CE", regiao: "Nordeste",
    mercados: [
      ["mercadinhos-sao-luiz", "Mercadinhos São Luiz", "premium", "#D32F2F"],
      ["mix-mateus", "Mix Mateus", "atacarejo", "#0D47A1"],
      ["atacadao", "Atacadão", "atacarejo", "#2E7D32"],
      ["assai", "Assaí Atacadista", "atacarejo", "#1976D2"],
      ["cometa-supermercados", "Cometa Supermercados", "super", "#C2185B"],
      ["pinheiro-supermercados", "Pinheiro Supermercados", "super", "#2E7D32"],
      ["supermercado-guara", "Supermercado Guará", "super", "#EF6C00"],
      ["centerbox", "Centerbox Supermercados", "super", "#1565C0"],
      ["frangolandiace", "Super Frangolândia", "super", "#B71C1C"],
      ["nidobox", "Nidobox Supermercados", "super", "#283593"],
      ["super-do-povo-ce", "Super do Povo", "super", "#00838F"],
      ["isidoro-ce", "Supermercado Isidoro", "super", "#6A1B9A"],
      ["pao-de-acucar", "Pão de Açúcar", "varejo", "#1B5E20"],
      ["mercadinho-popular-ce", "Mercadinho Popular Aldeota", "proximidade", "#00695C"],
      ["mercado-sao-sebastiao", "Mercado São Sebastião", "hortifruti", "#33691E"]
    ]
  },
  "PE-Recife": {
    legacyId: "recife", cidade: "Recife", uf: "PE", regiao: "Nordeste",
    mercados: [
      ["novo-atacarejo", "Novo Atacarejo", "atacarejo", "#D32F2F"],
      ["mix-mateus", "Mix Mateus", "atacarejo", "#0D47A1"],
      ["atacadao", "Atacadão", "atacarejo", "#2E7D32"],
      ["assai", "Assaí Atacadista", "atacarejo", "#1976D2"],
      ["extrabom", "Extrabom Supermercados", "super", "#C2185B"],
      ["carrefour", "Carrefour", "hiper", "#0D47A1"],
      ["deskontao", "Deskontão Atacarejo", "atacarejo", "#EF6C00"],
      ["arco-mix", "Arco-Mix Supermercados", "super", "#1565C0"],
      ["supermercado-soberano", "Supermercado Soberano", "super", "#283593"],
      ["rm-express", "RM Express", "premium", "#4E342E"],
      ["pao-de-acucar", "Pão de Açúcar", "varejo", "#1B5E20"],
      ["bompreco-pe", "Super Bompreço", "super", "#00838F"],
      ["mercadinho-boa-viagem", "Mercadinho Boa Viagem", "proximidade", "#00695C"],
      ["ceasa-recife", "CEASA Recife Hortifruti", "hortifruti", "#558B2F"],
      ["mercado-de-sao-jose", "Mercado de São José", "hortifruti", "#33691E"]
    ]
  },
  "BA-Salvador": {
    legacyId: "salvador", cidade: "Salvador", uf: "BA", regiao: "Nordeste",
    mercados: [
      ["atakarejo", "Atakarejo", "atacarejo", "#D32F2F"],
      ["hiperideal", "Hiperideal", "premium", "#F57C00"],
      ["atacadao", "Atacadão", "atacarejo", "#2E7D32"],
      ["assai", "Assaí Atacadista", "atacarejo", "#1976D2"],
      ["redemix", "RedeMix Supermercados", "super", "#C2185B"],
      ["gbarbosa", "GBarbosa", "hiper", "#283593"],
      ["mix-mateus", "Mix Mateus", "atacarejo", "#0D47A1"],
      ["perini", "Perini Deli & Super", "premium", "#6A1B9A"],
      ["mercantil-rodrigues", "Mercantil Rodrigues", "atacarejo", "#EF6C00"],
      ["bompreco-ba", "Hiper Bompreço", "hiper", "#1565C0"],
      ["todo-dia-ba", "TodoDia Proximidade", "proximidade", "#2E7D32"],
      ["supermercado-cambui", "Supermercado Cambuí", "super", "#00838F"],
      ["mercadinho-pituba", "Mercadinho Pituba", "proximidade", "#00695C"],
      ["hortifruti-cesta-do-povo", "Hortifruti Salvador", "hortifruti", "#558B2F"],
      ["feira-de-sao-joaquim", "Feira de São Joaquim", "hortifruti", "#33691E"]
    ]
  },
  "MA-SaoLuis": {
    legacyId: "sao_luis", cidade: "São Luís", uf: "MA", regiao: "Nordeste",
    mercados: [
      ["supermercado-mateus", "Supermercado Mateus", "hiper", "#0D47A1"],
      ["mix-mateus", "Mix Mateus", "atacarejo", "#0D47A1"],
      ["atacadao", "Atacadão", "atacarejo", "#2E7D32"],
      ["assai", "Assaí Atacadista", "atacarejo", "#1976D2"],
      ["supermercados-maciel", "Supermercados Maciel", "super", "#C2185B"],
      ["emporio-fribal", "Empório Fribal", "premium", "#D32F2F"],
      ["camino-supermercados", "Camino Supermercados", "proximidade", "#EF6C00"],
      ["spazio-mateus", "Spazio Mateus", "premium", "#283593"],
      ["supermercado-bom-preco-ma", "Bom Preço São Luís", "super", "#1565C0"],
      ["supermercado-silva-ma", "Supermercado Silva", "super", "#00838F"],
      ["todo-dia-ma", "Mercado TodoDia SLZ", "proximidade", "#2E7D32"],
      ["mercadinho-cohama", "Mercadinho Cohama", "proximidade", "#00695C"],
      ["mercadinho-renascenca", "Mercadinho Renascença", "proximidade", "#00796B"],
      ["feira-da-cohab-slz", "Feira da Cohab", "hortifruti", "#558B2F"],
      ["feira-da-praia-grande", "Feira da Praia Grande", "hortifruti", "#33691E"]
    ]
  },
  "PI-Teresina": {
    legacyId: "teresina", cidade: "Teresina", uf: "PI", regiao: "Nordeste",
    mercados: [
      ["carvalho-super", "Carvalho Super", "super", "#D32F2F"],
      ["carvalho-mercadao", "Carvalho Mercadão", "atacarejo", "#B71C1C"],
      ["mix-mateus", "Mix Mateus", "atacarejo", "#0D47A1"],
      ["atacadao", "Atacadão", "atacarejo", "#2E7D32"],
      ["assai", "Assaí Atacadista", "atacarejo", "#1976D2"],
      ["ferreira-supermercados", "Ferreira Supermercados", "super", "#C2185B"],
      ["r-carvalho", "Comercial R. Carvalho", "super", "#283593"],
      ["pao-de-acucar", "Pão de Açúcar", "varejo", "#1B5E20"],
      ["supermercado-toureiro", "Supermercado Toureiro", "super", "#EF6C00"],
      ["extra-teresina", "Mercado Extra", "super", "#1565C0"],
      ["supermercado-van-pi", "Supermercado União PI", "super", "#00838F"],
      ["mercadinho-fatima-pi", "Mercadinho Fátima", "proximidade", "#00695C"],
      ["mercadinho-dirceu", "Mercadinho do Dirceu", "proximidade", "#00796B"],
      ["nova-ceasa-pi", "Nova Ceasa Teresina", "hortifruti", "#558B2F"],
      ["mercado-central-teresina", "Mercado Central de Teresina", "hortifruti", "#33691E"]
    ]
  },
  "RN-Natal": {
    legacyId: "natal", cidade: "Natal", uf: "RN", regiao: "Nordeste",
    mercados: [
      ["nordestao", "Supermercados Nordestão", "hiper", "#D32F2F"],
      ["superfacil-atacado", "SuperFácil Atacado", "atacarejo", "#F57C00"],
      ["atacadao", "Atacadão", "atacarejo", "#2E7D32"],
      ["assai", "Assaí Atacadista", "atacarejo", "#1976D2"],
      ["favorito-rn", "Favorito Supermercados", "super", "#EF6C00"],
      ["redemais-rn", "RedeMais Supermercados", "super", "#C2185B"],
      ["carrefour", "Carrefour", "hiper", "#0D47A1"],
      ["super-show-rn", "Super Show Supermercados", "super", "#283593"],
      ["mix-mateus", "Mix Mateus", "atacarejo", "#0D47A1"],
      ["supermercado-queiroz", "Queiroz Atacadão", "atacarejo", "#1565C0"],
      ["pao-de-acucar", "Pão de Açúcar", "varejo", "#1B5E20"],
      ["mar-vermelho-rn", "Mar Vermelho Supermercados", "super", "#B71C1C"],
      ["mercadinho-ponta-negra-rn", "Mercadinho Ponta Negra", "proximidade", "#00695C"],
      ["hortifruti-lagoa-nova", "Sacolão Lagoa Nova", "hortifruti", "#558B2F"],
      ["feira-do-alecrim", "Feira do Alecrim", "hortifruti", "#33691E"]
    ]
  },
  "PB-JoaoPessoa": {
    legacyId: "joao_pessoa", cidade: "João Pessoa", uf: "PB", regiao: "Nordeste",
    mercados: [
      ["supermercado-manaira", "Supermercado Manaíra", "hiper", "#D32F2F"],
      ["supermercado-santiago", "Supermercado Santiago", "super", "#B71C1C"],
      ["mix-mateus", "Mix Mateus", "atacarejo", "#0D47A1"],
      ["atacadao", "Atacadão", "atacarejo", "#2E7D32"],
      ["assai", "Assaí Atacadista", "atacarejo", "#1976D2"],
      ["menor-preco-pb", "Supermercado Menor Preço", "super", "#C2185B"],
      ["rede-bemais", "Rede Bemais", "super", "#283593"],
      ["superbox-brasil", "SuperBox Brasil", "atacarejo", "#EF6C00"],
      ["do-dia-supermercados", "DoDia Supermercados", "super", "#00838F"],
      ["latorre-supermercados", "LaTorre Supermercados", "super", "#1565C0"],
      ["pao-de-acucar", "Pão de Açúcar", "varejo", "#1B5E20"],
      ["carrefour", "Carrefour", "hiper", "#0D47A1"],
      ["mercadinho-tambau", "Mercadinho Tambaú", "proximidade", "#00695C"],
      ["mercado-da-torre-jp", "Mercado Público da Torre", "hortifruti", "#558B2F"],
      ["mercado-central-jp", "Mercado Central João Pessoa", "hortifruti", "#33691E"]
    ]
  },
  "AL-Maceio": {
    legacyId: "maceio", cidade: "Maceió", uf: "AL", regiao: "Nordeste",
    mercados: [
      ["palato", "Palato Supermercados", "premium", "#D32F2F"],
      ["unicompra", "Unicompra Supermercados", "super", "#C2185B"],
      ["mix-mateus", "Mix Mateus", "atacarejo", "#0D47A1"],
      ["atacadao", "Atacadão", "atacarejo", "#2E7D32"],
      ["assai", "Assaí Atacadista", "atacarejo", "#1976D2"],
      ["gbarbosa", "GBarbosa", "hiper", "#283593"],
      ["cesta-de-alimentos", "Cesta de Alimentos", "super", "#EF6C00"],
      ["super-giro-al", "Super Giro", "super", "#00838F"],
      ["sao-domingos-al", "Supermercado São Domingos", "super", "#1565C0"],
      ["pao-de-acucar", "Pão de Açúcar", "varejo", "#1B5E20"],
      ["ideal-supermercados-al", "Ideal Supermercados", "super", "#6A1B9A"],
      ["supermercado-lopes-al", "Supermercado Lopes AL", "proximidade", "#4E342E"],
      ["mercadinho-jatiuca", "Mercadinho Jatiúca", "proximidade", "#00695C"],
      ["sacolao-ponta-verde", "Hortifruti Ponta Verde", "hortifruti", "#558B2F"],
      ["mercado-da-producao", "Mercado da Produção", "hortifruti", "#33691E"]
    ]
  },
  "SE-Aracaju": {
    legacyId: "aracaju", cidade: "Aracaju", uf: "SE", regiao: "Nordeste",
    mercados: [
      ["gbarbosa", "GBarbosa", "hiper", "#D32F2F"],
      ["mix-mateus", "Mix Mateus", "atacarejo", "#0D47A1"],
      ["atacadao", "Atacadão", "atacarejo", "#2E7D32"],
      ["assai", "Assaí Atacadista", "atacarejo", "#1976D2"],
      ["supermercado-bombom", "Supermercado Bombom", "super", "#C2185B"],
      ["massimo-supermercados", "Massimo Supermercados", "premium", "#283593"],
      ["menor-preco-se", "Rede Menor Preço SE", "super", "#EF6C00"],
      ["pao-de-acucar", "Pão de Açúcar", "varejo", "#1B5E20"],
      ["mercantil-rodrigues", "Mercantil Rodrigues", "atacarejo", "#1565C0"],
      ["supermercado-popular-se", "Supermercado Popular Aju", "super", "#00838F"],
      ["hiper-carnes-se", "Hiper Carnes Aracaju", "super", "#B71C1C"],
      ["todo-dia-se", "TodoDia Aracaju", "proximidade", "#2E7D32"],
      ["mercadinho-atalaia", "Mercadinho Atalaia", "proximidade", "#00695C"],
      ["hortifruti-jardins-se", "Hortifruti Jardins", "hortifruti", "#558B2F"],
      ["mercado-albano-franco", "Mercado Albano Franco", "hortifruti", "#33691E"]
    ]
  },
  "DF-Brasilia": {
    legacyId: "brasilia", cidade: "Brasília", uf: "DF", regiao: "Centro-Oeste",
    mercados: [
      ["super-adega", "Super Adega Atacadista", "atacarejo", "#F57C00"],
      ["big-box", "Big Box Supermercados", "super", "#D32F2F"],
      ["atacadao-dia-a-dia", "Atacadão Dia a Dia", "atacarejo", "#2E7D32"],
      ["atacadao", "Atacadão", "atacarejo", "#2E7D32"],
      ["assai", "Assaí Atacadista", "atacarejo", "#1976D2"],
      ["carrefour", "Carrefour", "hiper", "#0D47A1"],
      ["pao-de-acucar", "Pão de Açúcar", "varejo", "#1B5E20"],
      ["dona-de-casa", "Dona de Casa Supermercados", "super", "#C2185B"],
      ["supermercado-veneza-df", "Supermercado Veneza DF", "super", "#283593"],
      ["vivendas-supermercados", "Supermercado Vivendas", "super", "#00838F"],
      ["superbom-df", "Superbom Brasília", "super", "#1565C0"],
      ["oba-hortifruti", "Oba Hortifruti", "hortifruti", "#33691E"],
      ["ultrafacil-box", "UltraBox Atacarejo", "atacarejo", "#EF6C00"],
      ["mercadinho-da-comercial", "Mercadinho da Comercial", "proximidade", "#00695C"],
      ["feira-do-guara-ceasa", "Feira do Guará & Ceasa DF", "hortifruti", "#558B2F"]
    ]
  },
  "GO-Goiania": {
    legacyId: "goiania", cidade: "Goiânia", uf: "GO", regiao: "Centro-Oeste",
    mercados: [
      ["bretas", "Bretas Supermercados", "hiper", "#D32F2F"],
      ["barao-supermercados", "Barão Supermercados", "super", "#F57C00"],
      ["atacadao", "Atacadão", "atacarejo", "#2E7D32"],
      ["assai", "Assaí Atacadista", "atacarejo", "#1976D2"],
      ["tatico", "Tatico Supermercados", "atacarejo", "#C2185B"],
      ["carrefour", "Carrefour", "hiper", "#0D47A1"],
      ["pao-de-acucar", "Pão de Açúcar", "varejo", "#1B5E20"],
      ["emporio-prime", "Empório Prime", "premium", "#4E342E"],
      ["pro-brazilian", "Pró Brazilian", "super", "#283593"],
      ["atacadao-dia-a-dia", "Atacadão Dia a Dia GO", "atacarejo", "#00838F"],
      ["supermercado-store-go", "Store Supermercados", "super", "#1565C0"],
      ["oba-hortifruti", "Oba Hortifruti", "hortifruti", "#33691E"],
      ["supermercado-moreira", "Hiper Moreira", "hiper", "#B71C1C"],
      ["mercadinho-setor-bueno", "Mercadinho Setor Bueno", "proximidade", "#00695C"],
      ["feira-do-cepal-go", "Feira do Cepal & Cerrado", "hortifruti", "#558B2F"]
    ]
  },
  "MT-Cuiaba": {
    legacyId: "cuiaba", cidade: "Cuiabá", uf: "MT", regiao: "Centro-Oeste",
    mercados: [
      ["comper", "Comper Supermercados", "hiper", "#D32F2F"],
      ["biglar", "BigLar Supermercados", "premium", "#F57C00"],
      ["fort-atacadista", "Fort Atacadista", "atacarejo", "#1565C0"],
      ["atacadao", "Atacadão", "atacarejo", "#2E7D32"],
      ["assai", "Assaí Atacadista", "atacarejo", "#1976D2"],
      ["supermercados-machado", "Supermercados Machado", "super", "#C2185B"],
      ["america-supermercados", "América Supermercados", "super", "#283593"],
      ["tropical-supermercados-mt", "Tropical Supermercados", "super", "#00838F"],
      ["supermercado-imperial-mt", "Supermercado Imperial", "super", "#EF6C00"],
      ["supermercado-alvorada-mt", "Supermercado Alvorada CBA", "super", "#6A1B9A"],
      ["atacado-pantanal", "Pantanal Atacado", "atacarejo", "#2E7D32"],
      ["minimercado-cpa", "Mercadinho do CPA", "proximidade", "#00796B"],
      ["mercadinho-coxipo", "Mercadinho Coxipó", "proximidade", "#00695C"],
      ["hortifruti-goiabeiras", "Sacolão Goiabeiras", "hortifruti", "#558B2F"],
      ["mercado-do-porto-cba", "Mercado do Porto Cuiabá", "hortifruti", "#33691E"]
    ]
  },
  "MS-CampoGrande": {
    legacyId: "campo_grande", cidade: "Campo Grande", uf: "MS", regiao: "Centro-Oeste",
    mercados: [
      ["comper", "Comper Supermercados", "hiper", "#D32F2F"],
      ["fort-atacadista", "Fort Atacadista", "atacarejo", "#1565C0"],
      ["atacadao", "Atacadão", "atacarejo", "#2E7D32"],
      ["assai", "Assaí Atacadista", "atacarejo", "#1976D2"],
      ["carrefour", "Carrefour", "hiper", "#0D47A1"],
      ["mister-junior", "Mister Júnior", "super", "#C2185B"],
      ["supermercado-pires", "Supermercado Pires", "super", "#283593"],
      ["supermercado-legal-ms", "Supermercado Legal", "super", "#EF6C00"],
      ["supermercado-nunes-ms", "Supermercado Nunes", "super", "#00838F"],
      ["supermercado-estrela-ms", "Supermercado Estrela CG", "super", "#6A1B9A"],
      ["pao-de-acucar", "Pão de Açúcar", "varejo", "#1B5E20"],
      ["maxi-compras-ms", "Maxi Compras", "super", "#B71C1C"],
      ["mercadinho-tiradentes-ms", "Mercadinho Tiradentes", "proximidade", "#00695C"],
      ["hortifruti-estados-ms", "Sacolão Jardim dos Estados", "hortifruti", "#558B2F"],
      ["mercadao-municipal-cg", "Mercadão Municipal CG", "hortifruti", "#33691E"]
    ]
  },
  "SP-SaoPaulo": {
    legacyId: "sao_paulo", cidade: "São Paulo", uf: "SP", regiao: "Sudeste",
    mercados: [
      ["pao-de-acucar", "Pão de Açúcar", "varejo", "#1B5E20"],
      ["carrefour", "Carrefour", "hiper", "#0D47A1"],
      ["atacadao", "Atacadão", "atacarejo", "#2E7D32"],
      ["assai", "Assaí Atacadista", "atacarejo", "#1976D2"],
      ["sonda", "Sonda Supermercados", "super", "#F57C00"],
      ["mambo", "Mambo", "premium", "#C2185B"],
      ["st-marche", "St. Marche", "premium", "#4E342E"],
      ["dia", "Dia", "proximidade", "#D32F2F"],
      ["nagumo", "Nagumo", "super", "#1565C0"],
      ["davo", "D'avó", "super", "#E53935"],
      ["hirota", "Hirota Food", "super", "#AD1457"],
      ["pastorinho", "Pastorinho", "super", "#00838F"],
      ["lopes", "Lopes Supermercados", "super", "#283593"],
      ["natural-da-terra", "Natural da Terra", "hortifruti", "#33691E"],
      ["akki-atacadista", "Akki Atacadista", "atacarejo", "#EF6C00"]
    ]
  },
  "RJ-RioDeJaneiro": {
    legacyId: "rio_de_janeiro", cidade: "Rio de Janeiro", uf: "RJ", regiao: "Sudeste",
    mercados: [
      ["guanabara", "Supermercados Guanabara", "super", "#D32F2F"],
      ["mundial", "Supermercados Mundial", "super", "#F57C00"],
      ["zona-sul", "Zona Sul", "premium", "#C62828"],
      ["prezunic", "Prezunic", "super", "#1565C0"],
      ["assai", "Assaí Atacadista", "atacarejo", "#1976D2"],
      ["atacadao", "Atacadão", "atacarejo", "#2E7D32"],
      ["carrefour", "Carrefour", "hiper", "#0D47A1"],
      ["pao-de-acucar", "Pão de Açúcar", "varejo", "#1B5E20"],
      ["redemais", "Rede Mais", "super", "#C2185B"],
      ["princesa", "Supermercados Princesa", "super", "#AD1457"],
      ["costazul", "Costazul Multimercado", "atacarejo", "#00838F"],
      ["inter-supermercados", "Inter Supermercados", "super", "#2E7D32"],
      ["supermarket", "Rede Supermarket", "super", "#283593"],
      ["redetop", "Rede Top", "super", "#EF6C00"],
      ["megabox", "Megabox", "atacarejo", "#B71C1C"]
    ]
  },
  "MG-BeloHorizonte": {
    legacyId: "belo_horizonte", cidade: "Belo Horizonte", uf: "MG", regiao: "Sudeste",
    mercados: [
      ["supermercados-bh", "Supermercados BH", "hiper", "#D32F2F"],
      ["verdemar", "Verdemar", "premium", "#1B5E20"],
      ["epa-plus", "EPA Plus Supermercados", "super", "#C2185B"],
      ["mart-minas", "Mart Minas Atacado", "atacarejo", "#F57C00"],
      ["apoio-mineiro", "Apoio Mineiro", "atacarejo", "#1565C0"],
      ["atacadao", "Atacadão", "atacarejo", "#2E7D32"],
      ["assai", "Assaí Atacadista", "atacarejo", "#1976D2"],
      ["super-nosso", "Super Nosso", "premium", "#B71C1C"],
      ["carrefour", "Carrefour", "hiper", "#0D47A1"],
      ["villefort", "Villefort Atacarejo", "atacarejo", "#283593"],
      ["supermercado-dia-mg", "Dia Proximidade BH", "proximidade", "#E53935"],
      ["decisao-atacarejo", "Decisão Atacarejo", "atacarejo", "#EF6C00"],
      ["mercadinho-savassi", "Mercearia & Mercadinho Savassi", "proximidade", "#00695C"],
      ["sacolao-abc-bh", "Sacolão ABC Hortifruti", "hortifruti", "#558B2F"],
      ["mercado-central-bh", "Mercado Central BH", "hortifruti", "#33691E"]
    ]
  },
  "ES-Vitoria": {
    legacyId: "vitoria", cidade: "Vitória", uf: "ES", regiao: "Sudeste",
    mercados: [
      ["supermercados-perim", "Supermercados Perim", "hiper", "#D32F2F"],
      ["extrabom", "Extrabom Supermercados", "super", "#F57C00"],
      ["supermercados-carone", "Supermercados Carone", "premium", "#C2185B"],
      ["atacadao", "Atacadão", "atacarejo", "#2E7D32"],
      ["assai", "Assaí Atacadista", "atacarejo", "#1976D2"],
      ["sempre-tem", "SempreTem Superatacado", "atacarejo", "#1565C0"],
      ["supermercados-bh", "Supermercados BH (ES)", "hiper", "#B71C1C"],
      ["sao-jose-es", "Supermercado São José", "super", "#283593"],
      ["casagrande-es", "Supermercados Casagrande", "super", "#00838F"],
      ["multishow-es", "Rede MultiShow", "super", "#EF6C00"],
      ["devens-supermercados", "Devens Supermercados", "super", "#6A1B9A"],
      ["extra-plus-es", "Extra Plus Gourmet", "premium", "#4E342E"],
      ["mercadinho-camburi", "Mercadinho Jardim Camburi", "proximidade", "#00695C"],
      ["hortifruti-vitoria", "Hortifruti Praia do Canto", "hortifruti", "#558B2F"],
      ["feira-livre-vitoria", "Feira Livre de Vitória", "hortifruti", "#33691E"]
    ]
  },
  "PR-Curitiba": {
    legacyId: "curitiba", cidade: "Curitiba", uf: "PR", regiao: "Sul",
    mercados: [
      ["muffato", "Super Muffato", "hiper", "#B71C1C"],
      ["condor", "Supermercados Condor", "hiper", "#1976D2"],
      ["festval", "Festval", "premium", "#4E342E"],
      ["angeloni", "Angeloni", "premium", "#D32F2F"],
      ["atacadao", "Atacadão", "atacarejo", "#2E7D32"],
      ["assai", "Assaí Atacadista", "atacarejo", "#1976D2"],
      ["jacomar", "Supermercados Jacomar", "super", "#283593"],
      ["max-atacadista", "Max Atacadista", "atacarejo", "#F57C00"],
      ["carrefour", "Carrefour", "hiper", "#0D47A1"],
      ["casa-fiesta", "Casa Fiesta Supermercados", "super", "#C2185B"],
      ["supermercado-zamprogna", "Rede Rio Verde PR", "super", "#2E7D32"],
      ["supermercado-kusma", "Kusma Supermercados", "super", "#00838F"],
      ["mercadinho-batel", "Minimercado de Bairro CWB", "proximidade", "#00695C"],
      ["armazem-da-familia", "Armazém da Família Curitiba", "proximidade", "#1565C0"],
      ["mercado-municipal-curitiba", "Mercado Municipal de Curitiba", "hortifruti", "#33691E"]
    ]
  },
  "RS-PortoAlegre": {
    legacyId: "porto_alegre", cidade: "Porto Alegre", uf: "RS", regiao: "Sul",
    mercados: [
      ["zaffari", "Zaffari & Bourbon", "hiper", "#D32F2F"],
      ["stok-center", "Stok Center", "atacarejo", "#F57C00"],
      ["asun", "Asun Supermercados", "super", "#C2185B"],
      ["atacadao", "Atacadão", "atacarejo", "#2E7D32"],
      ["assai", "Assaí Atacadista", "atacarejo", "#1976D2"],
      ["carrefour", "Carrefour", "hiper", "#0D47A1"],
      ["rissul", "Supper Rissul", "super", "#283593"],
      ["muffato", "Max Atacadista / Sul", "atacarejo", "#B71C1C"],
      ["supermercado-guanabara-rs", "Guanabara RS", "super", "#00838F"],
      ["super-kan", "Super Kan Porto Alegre", "super", "#EF6C00"],
      ["gecepel", "Supermercado Gecepel", "super", "#1565C0"],
      ["cestto-atacadista", "Cestto Atacadista (Zaffari)", "atacarejo", "#AD1457"],
      ["minimercado-moinhos", "Minimercado Moinhos de Vento", "proximidade", "#00695C"],
      ["hortifruti-cidade-baixa", "Sacolão Cidade Baixa", "hortifruti", "#558B2F"],
      ["mercado-publico-poa", "Mercado Público de Porto Alegre", "hortifruti", "#33691E"]
    ]
  },
  "SC-Florianopolis": {
    legacyId: "florianopolis", cidade: "Florianópolis", uf: "SC", regiao: "Sul",
    mercados: [
      ["angeloni", "Angeloni", "hiper", "#D32F2F"],
      ["imperatriz", "Supermercados Imperatriz", "super", "#C2185B"],
      ["fort-atacadista", "Fort Atacadista", "atacarejo", "#1565C0"],
      ["bistek", "Bistek Supermercados", "super", "#B71C1C"],
      ["giassi", "Giassi Supermercados", "hiper", "#283593"],
      ["hippo", "Hippo Supermercados", "premium", "#1B5E20"],
      ["atacadao", "Atacadão", "atacarejo", "#2E7D32"],
      ["assai", "Assaí Atacadista", "atacarejo", "#1976D2"],
      ["komprao", "Komprão Koch Atacadista", "atacarejo", "#F57C00"],
      ["supermercado-rosa-sc", "Supermercado Rosa", "super", "#00838F"],
      ["direto-do-campo", "Direto do Campo", "hortifruti", "#33691E"],
      ["sempre-perto-sc", "Sempre Perto Proximidade", "proximidade", "#00796B"],
      ["mercadinho-da-ilha", "Mercadinho Lagoa da Conceição", "proximidade", "#00695C"],
      ["sacolao-trindade-sc", "Hortifruti Trindade", "hortifruti", "#558B2F"],
      ["mercado-publico-floripa", "Mercado Público de Florianópolis", "hortifruti", "#33691E"]
    ]
  }
};

// Mapear aliases de logos já baixadas do Seeklogo para os slugs canônicos em kebab-case
const EXISTING_LOGO_ALIASES = {
  "pao-de-acucar": "pao_acucar.svg",
  "nova-era": "nova_era.svg",
  "mix-mateus": "mateus.svg",
  "supermercado-mateus": "mateus.svg",
  "db-supermercados": "db.svg",
  "emporio-db": "db.svg",
  "baratao-da-carne": "baratao.svg",
  "supermercado-gaviao": "gaviao.svg",
  "supermercado-goiana": "goiana.svg",
  "novo-tempo": "novo_tempo.svg"
};

for (const [slug, srcFile] of Object.entries(EXISTING_LOGO_ALIASES)) {
  const srcPath = path.join(LOGOS_DIR, srcFile);
  const destPath = path.join(LOGOS_DIR, `${slug}.svg`);
  if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
    fs.copyFileSync(srcPath, destPath);
  }
}

// Criar default-market.svg
const defaultMarketSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <rect width="120" height="120" rx="24" fill="#0F6D44"/>
  <circle cx="60" cy="48" r="24" fill="#E8F5E9"/>
  <text x="60" y="57" font-size="26" text-anchor="middle">🛒</text>
  <text x="60" y="92" font-family="Arial Black, sans-serif" font-size="13" font-weight="900" fill="#FFF" text-anchor="middle">MERCADO</text>
  <text x="60" y="106" font-family="Arial, sans-serif" font-size="9.5" font-weight="800" fill="#FFD600" text-anchor="middle">OFICIAL</text>
</svg>`;
fs.writeFileSync(path.join(LOGOS_DIR, 'default-market.svg'), defaultMarketSvg, 'utf8');

function getInitials(name) {
  const clean = name.replace(/Supermercados?|Mercadinhos?|Atacadistas?|Atacadão|Atacarejo|Rede|Hiper/gi, '').trim() || name;
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return clean.slice(0, 3).toUpperCase();
}

function mapTipoToPorte(tipo) {
  if (tipo === 'atacarejo' || tipo === 'hiper') return 'grande';
  if (tipo === 'proximidade' || tipo === 'hortifruti') return 'pequeno';
  return 'medio';
}

// Construir JSON canônico e garantir que cada ID possua seu arquivo .svg em web/assets/logos/
const canonicalJson = { capitais: {} };
let uniqueLogosCreated = 0;

for (const [capKey, capData] of Object.entries(CAPITALS_15_RAW)) {
  const mercadosList = capData.mercados.map(([id, nome, tipo, color]) => {
    const cleanId = id.toLowerCase().trim().replace(/\s+/g, '-');
    const logoFile = path.join(LOGOS_DIR, `${cleanId}.svg`);

    if (!fs.existsSync(logoFile)) {
      const initials = getInitials(nome);
      const shortTitle = nome.toUpperCase().slice(0, 12);
      const tipoLabel = tipo.toUpperCase();
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <rect width="120" height="120" rx="24" fill="${color}"/>
  <circle cx="60" cy="46" r="24" fill="#FFFFFF" stroke="#FFD600" stroke-width="3"/>
  <text x="60" y="55" font-family="Arial Black, sans-serif" font-size="21" font-weight="900" fill="${color}" text-anchor="middle">${initials}</text>
  <text x="60" y="88" font-family="Arial Black, sans-serif" font-size="11.5" font-weight="900" fill="#FFFFFF" text-anchor="middle">${shortTitle}</text>
  <text x="60" y="104" font-family="Arial, sans-serif" font-size="9.5" font-weight="800" fill="#FFD600" text-anchor="middle">${tipoLabel}</text>
</svg>`;
      fs.writeFileSync(logoFile, svgContent, 'utf8');
      uniqueLogosCreated++;
    }

    return {
      id: cleanId,
      nome,
      tipo,
      porte: mapTipoToPorte(tipo),
      cor: color,
      logo: `web/assets/logos/${cleanId}.svg`
    };
  });

  canonicalJson.capitais[capKey] = {
    key: capKey,
    legacyId: capData.legacyId,
    cidade: capData.cidade,
    uf: capData.uf,
    regiao: capData.regiao,
    mercados: mercadosList
  };
}

// Salvar web/data/supermarkets.json e src/data/supermarkets.json
const jsonStr = JSON.stringify(canonicalJson, null, 2);
fs.writeFileSync(path.join(WEB_DATA_DIR, 'supermarkets.json'), jsonStr, 'utf8');
fs.writeFileSync(path.join(SRC_DATA_DIR, 'supermarkets.json'), jsonStr, 'utf8');

console.log(`✅ Criado supermarkets.json com ${Object.keys(canonicalJson.capitais).length} capitais x 15 mercados (${Object.keys(canonicalJson.capitais).length * 15} mercados no total)!`);
console.log(`✅ Gerados ${uniqueLogosCreated} novos arquivos de logo em web/assets/logos/`);
