const fs = require('fs');
const path = require('path');

const RAW_CAPITALS = [
  // NORTE (7)
  {
    id: "manaus", name: "Manaus - AM", shortName: "Manaus", region: "Norte", uf: "AM", ibge: "13", mult: 1.00,
    lat: -3.1190, lng: -60.0217,
    stores: [
      ["db", "DB Supermercados", "Hiper DB Adrianópolis", "grande", "db.svg", "#D32F2F"],
      ["nova_era", "Nova Era Superatacado", "Nova Era Torquato", "grande", "nova_era.svg", "#F57C00"],
      ["atacadao", "Atacadão Manaus", "Atacadão Cidade Nova", "grande", "atacadao.svg", "#2E7D32"],
      ["assai", "Assaí Atacadista AM", "Assaí Zona Leste", "grande", "assai.svg", "#1976D2"],
      ["baratao", "Baratão da Carne", "Baratão Betânia", "medio", "baratao.svg", "#C2185B"],
      ["carrefour", "Supermercados Rodrigues", "Rede Média Local", "medio", "carrefour.svg", "#0D47A1"],
      ["mercadinho_bairro", "Mercadinho São Jorge (Bairro)", "A 400m da sua rua", "pequeno", "mercadinho.svg", "#00695C"],
      ["sacolao_feira", "Feira & Sacolão Manaus Moderna", "Feira / Hortifruti Local", "pequeno", "feira.svg", "#33691E"]
    ],
    neighborhoods: ["Adrianópolis", "Flores / Parque 10", "Cidade Nova", "Zona Leste (Autaz Mirim)", "Betânia / Zona Sul", "Centro Histórico", "Ponta Negra", "Alvorada / Dom Pedro", "Coroado / Aleixo"]
  },
  {
    id: "boa_vista", name: "Boa Vista - RR", shortName: "Boa Vista", region: "Norte", uf: "RR", ibge: "14", mult: 1.04,
    lat: 2.8235, lng: -60.6758,
    stores: [
      ["db", "Hiper DB Boa Vista", "DB Av. Venezuela", "grande", "db.svg", "#D32F2F"],
      ["nova_era", "Supermercado Gavião", "Gavião Ataíde Teive", "medio", "gaviao.svg", "#00695C"],
      ["atacadao", "Atacadão Boa Vista", "Atacadão BR-174", "grande", "atacadao.svg", "#2E7D32"],
      ["assai", "Assaí Boa Vista", "Assaí Glaycon de Paiva", "grande", "assai.svg", "#1976D2"],
      ["baratao", "Supermercado Goiana", "Goiana São Vicente", "medio", "goiana.svg", "#2E7D32"],
      ["carrefour", "Supermercado Novo Tempo", "Novo Tempo Buritis", "medio", "novo_tempo.svg", "#283593"],
      ["mercadinho_bairro", "Mercadinho Boa Compra (Bairro)", "A 400m da sua rua", "pequeno", "mercadinho.svg", "#00695C"],
      ["sacolao_feira", "Feira do Produtor RR", "Hortifruti São Vicente", "pequeno", "feira.svg", "#33691E"]
    ],
    neighborhoods: ["Paraviana / Caçari", "Centro Cívico BV", "Cidade Satélite", "Pricumã / São Vicente", "Mecejana / Aparecida", "São Francisco", "Buritis / Cinturão Verde", "Asa Branca / Caimbé", "Senador Hélio Campos"]
  },
  {
    id: "belem", name: "Belém - PA", shortName: "Belém", region: "Norte", uf: "PA", ibge: "15", mult: 0.98,
    lat: -1.4558, lng: -48.4902,
    stores: [
      ["db", "Supermercados Líder", "Líder Doca / Batista Campos", "grande", "db.svg", "#D32F2F"],
      ["nova_era", "Mix Mateus Belém", "Mateus Augusto Montenegro", "grande", "mateus.svg", "#0D47A1"],
      ["atacadao", "Atacadão Belém", "Atacadão BR-316", "grande", "atacadao.svg", "#2E7D32"],
      ["assai", "Assaí Belém", "Assaí Entroncamento", "grande", "assai.svg", "#1976D2"],
      ["baratao", "Supermercado Formosa", "Formosa Umarizal / Duque", "medio", "baratao.svg", "#C2185B"],
      ["carrefour", "Supermercado Preço Baixo", "Rede Média Belém", "medio", "novo_tempo.svg", "#283593"],
      ["mercadinho_bairro", "Mercadinho Nazaré (Bairro)", "A 400m da sua rua", "pequeno", "mercadinho.svg", "#00695C"],
      ["sacolao_feira", "Feira do Ver-o-Peso & Pedreira", "Feira Tradicional PA", "pequeno", "feira.svg", "#33691E"]
    ],
    neighborhoods: ["Nazaré / Umarizal", "Marco / Pedreira", "Cidade Nova / Ananindeua", "Marambaia / Castanheira", "Batista Campos / Jurunas", "Campina / Cidade Velha", "Parque Verde", "Guamá / Terra Firme", "São Brás"]
  },
  {
    id: "porto_velho", name: "Porto Velho - RO", shortName: "Porto Velho", region: "Norte", uf: "RO", ibge: "11", mult: 1.01,
    lat: -8.7619, lng: -63.9039,
    stores: [
      ["db", "Irmãos Gonçalves (IG)", "IG Jatuarana / Calama", "grande", "db.svg", "#D32F2F"],
      ["nova_era", "Nova Era Porto Velho", "Nova Era Tiradentes", "grande", "nova_era.svg", "#F57C00"],
      ["atacadao", "Atacadão Porto Velho", "Atacadão BR-364", "grande", "atacadao.svg", "#2E7D32"],
      ["assai", "Assaí Porto Velho", "Assaí Rio Madeira", "grande", "assai.svg", "#1976D2"],
      ["baratao", "Supermercado Araújo RO", "Araújo Zona Sul", "medio", "baratao.svg", "#C2185B"],
      ["carrefour", "Supermercado Coimbra", "Coimbra Centro", "medio", "novo_tempo.svg", "#283593"],
      ["mercadinho_bairro", "Mercadinho Embratel (Bairro)", "A 400m da sua rua", "pequeno", "mercadinho.svg", "#00695C"],
      ["sacolao_feira", "Feira do Produtor PVH", "Hortifruti Local RO", "pequeno", "feira.svg", "#33691E"]
    ],
    neighborhoods: ["Embratel / Flodoaldo", "Centro / Caiari", "Nova Porto Velho", "Jatuarana / Zona Sul", "Caladinho / Cohab", "São João Bosco", "Tancredo Neves", "Areal / Olaria", "Cuniã / Marcos Freire"]
  },
  {
    id: "rio_branco", name: "Rio Branco - AC", shortName: "Rio Branco", region: "Norte", uf: "AC", ibge: "12", mult: 1.03,
    lat: -9.9754, lng: -67.8249,
    stores: [
      ["db", "Supermercados Araújo AC", "Araújo Aviário / Tangará", "grande", "db.svg", "#D32F2F"],
      ["nova_era", "Atacale / Mercale", "Mercale Via Chico Mendes", "medio", "nova_era.svg", "#F57C00"],
      ["atacadao", "Atacadão Rio Branco", "Atacadão Via Verde", "grande", "atacadao.svg", "#2E7D32"],
      ["assai", "Assaí Rio Branco", "Assaí Floresta", "grande", "assai.svg", "#1976D2"],
      ["baratao", "Supermercado Pague Pouco", "Pague Pouco Sobral", "medio", "baratao.svg", "#C2185B"],
      ["carrefour", "Supermercado Gonçalves AC", "Rede Média Acre", "medio", "novo_tempo.svg", "#283593"],
      ["mercadinho_bairro", "Mercadinho do Bosque (Bairro)", "A 400m da sua rua", "pequeno", "mercadinho.svg", "#00695C"],
      ["sacolao_feira", "Mercado Elias Mansour & Feira", "Feira Central Rio Branco", "pequeno", "feira.svg", "#33691E"]
    ],
    neighborhoods: ["Bosque / Vila Ivonete", "Centro / Base", "Estação Experimental", "Sobral / Bahia", "Floresta / Calafate", "Segundo Distrito", "Isaura Parente", "Conjunto Tucumã", "Plácido de Castro"]
  },
  {
    id: "macapa", name: "Macapá - AP", shortName: "Macapá", region: "Norte", uf: "AP", ibge: "16", mult: 1.02,
    lat: 0.0356, lng: -51.0705,
    stores: [
      ["db", "Fortaleza Supermercados", "Fortaleza Jovino Dinoá", "grande", "db.svg", "#D32F2F"],
      ["nova_era", "Santa Lúcia Supermercados", "Santa Lúcia Buritizal", "medio", "nova_era.svg", "#F57C00"],
      ["atacadao", "Atacadão Macapá", "Atacadão Duca Serra", "grande", "atacadao.svg", "#2E7D32"],
      ["assai", "Assaí Macapá", "Assaí Rodovia JK", "grande", "assai.svg", "#1976D2"],
      ["baratao", "Supermercado Favorito AP", "Favorito Centro", "medio", "baratao.svg", "#C2185B"],
      ["carrefour", "Rede Mini Box Macapá", "Rede Média Local", "medio", "novo_tempo.svg", "#283593"],
      ["mercadinho_bairro", "Mercadinho do Trem (Bairro)", "A 400m da sua rua", "pequeno", "mercadinho.svg", "#00695C"],
      ["sacolao_feira", "Feira do Agricultor Macapá", "Hortifruti & Pescado AP", "pequeno", "feira.svg", "#33691E"]
    ],
    neighborhoods: ["Central / Santa Rita", "Trem / Laguinho", "Buritizal / Novo Buritizal", "Jardim Marco Zero", "São Lázaro / Infraero", "Pacoval / Julião Ramos", "Alvorada / Cabralzinho", "Fazendinha", "Jesus de Nazaré"]
  },
  {
    id: "palmas", name: "Palmas - TO", shortName: "Palmas", region: "Norte", uf: "TO", ibge: "17", mult: 0.99,
    lat: -10.1840, lng: -48.3336,
    stores: [
      ["db", "Quartetto Supermercados", "Quartetto Teotônio Segurado", "medio", "db.svg", "#D32F2F"],
      ["nova_era", "Mix Mateus Palmas", "Mateus Plano Diretor Sul", "grande", "mateus.svg", "#0D47A1"],
      ["atacadao", "Atacadão Palmas", "Atacadão 103 Sul", "grande", "atacadao.svg", "#2E7D32"],
      ["assai", "Assaí Palmas", "Assaí JK / NS-02", "grande", "assai.svg", "#1976D2"],
      ["baratao", "Supermercado Big Norte", "Big Norte Taquaralto", "medio", "baratao.svg", "#C2185B"],
      ["carrefour", "Supermercado Super Vale", "Rede Média Palmas", "medio", "novo_tempo.svg", "#283593"],
      ["mercadinho_bairro", "Mercadinho da Quadra (Bairro)", "A 300m na sua quadra", "pequeno", "mercadinho.svg", "#00695C"],
      ["sacolao_feira", "Feira Coberta da 304 Sul", "Feira & Hortifruti TO", "pequeno", "feira.svg", "#33691E"]
    ],
    neighborhoods: ["Plano Diretor Sul (104/204 Sul)", "Plano Diretor Norte (106 Norte)", "Taquaralto / Aureny III", "Jardim Aureny I e II", "Orla 14 / Graciosa", "Quadra 403 / 504 Sul", "Arse 112 / 122", "Santo Amaro", "Taquaruçu"]
  },

  // NORDESTE (9)
  {
    id: "fortaleza", name: "Fortaleza - CE", shortName: "Fortaleza", region: "Nordeste", uf: "CE", ibge: "23", mult: 0.96,
    lat: -3.7319, lng: -38.5267,
    stores: [
      ["db", "Mercadinhos São Luiz", "São Luiz Aldeota", "medio", "db.svg", "#D32F2F"],
      ["nova_era", "Mix Mateus Fortaleza", "Mateus Parangaba", "grande", "mateus.svg", "#0D47A1"],
      ["atacadao", "Atacadão Fortaleza", "Atacadão Messejana", "grande", "atacadao.svg", "#2E7D32"],
      ["assai", "Assaí Fortaleza", "Assaí Bezerra de Menezes", "grande", "assai.svg", "#1976D2"],
      ["baratao", "Cometa Supermercados", "Cometa Papicu / Fátima", "medio", "baratao.svg", "#C2185B"],
      ["carrefour", "Pinheiro Supermercados", "Pinheiro Maraponga", "medio", "goiana.svg", "#2E7D32"],
      ["mercadinho_bairro", "Mercadinho Popular (Bairro)", "A 400m da sua rua", "pequeno", "mercadinho.svg", "#00695C"],
      ["sacolao_feira", "Mercado São Sebastião & Feira", "Feira & Hortifruti CE", "pequeno", "feira.svg", "#33691E"]
    ],
    neighborhoods: ["Aldeota / Meireles", "Fátima / Benfica", "Messejana / Lagoa Redonda", "Parangaba / Maraponga", "Papicu / Cocó", "Centro / Praia de Iracema", "Bezerra de Menezes", "Montese / Vila União", "Barra do Ceará"]
  },
  {
    id: "recife", name: "Recife - PE", shortName: "Recife", region: "Nordeste", uf: "PE", ibge: "26", mult: 0.96,
    lat: -8.0476, lng: -34.8770,
    stores: [
      ["db", "Novo Atacarejo", "Novo Atacarejo Caxangá", "grande", "db.svg", "#D32F2F"],
      ["nova_era", "Mix Mateus Recife", "Mateus Boa Viagem / Bongi", "grande", "mateus.svg", "#0D47A1"],
      ["atacadao", "Atacadão Recife", "Atacadão Avenida Recife", "grande", "atacadao.svg", "#2E7D32"],
      ["assai", "Assaí Recife", "Assaí Imbiribeira / Benfica", "grande", "assai.svg", "#1976D2"],
      ["baratao", "Extrabom Supermercados", "Extrabom Espinheiro / Graças", "medio", "baratao.svg", "#C2185B"],
      ["carrefour", "Carrefour / Deskontão PE", "Carrefour Torre", "grande", "carrefour.svg", "#0D47A1"],
      ["mercadinho_bairro", "Mercadinho Boa Viagem (Bairro)", "A 400m da sua rua", "pequeno", "mercadinho.svg", "#00695C"],
      ["sacolao_feira", "Mercado de São José & Feira", "Hortifruti & Feira PE", "pequeno", "feira.svg", "#33691E"]
    ],
    neighborhoods: ["Boa Viagem / Pina", "Casa Forte / Parnamirim", "Graças / Espinheiro", "Imbiribeira / Ipsep", "Madalena / Torre", "Santo Amaro / Boa Vista", "Várzea / Caxangá", "Casa Amarela", "Afogados / Jardim São Paulo"]
  },
  {
    id: "salvador", name: "Salvador - BA", shortName: "Salvador", region: "Nordeste", uf: "BA", ibge: "29", mult: 0.97,
    lat: -12.9777, lng: -38.5016,
    stores: [
      ["db", "Atakarejo Bahia", "Atakarejo Iguatemi / Paralela", "grande", "db.svg", "#D32F2F"],
      ["nova_era", "Hiperideal Supermercados", "Hiperideal Pituba / Graça", "medio", "nova_era.svg", "#F57C00"],
      ["atacadao", "Atacadão Salvador", "Atacadão Barros Reis", "grande", "atacadao.svg", "#2E7D32"],
      ["assai", "Assaí Salvador", "Assaí Calçada / Paripe", "grande", "assai.svg", "#1976D2"],
      ["baratao", "RedeMix Supermercados", "RedeMix Imbuí / Stella Maris", "medio", "baratao.svg", "#C2185B"],
      ["carrefour", "GBarbosa Salvador", "GBarbosa Costa Azul", "medio", "novo_tempo.svg", "#283593"],
      ["mercadinho_bairro", "Mercadinho do Bairro BA", "A 400m da sua rua", "pequeno", "mercadinho.svg", "#00695C"],
      ["sacolao_feira", "Feira de São Joaquim & Sete Portas", "Feira Tradicional Salvador", "pequeno", "feira.svg", "#33691E"]
    ],
    neighborhoods: ["Pituba / Itaigara", "Barra / Graça", "Rio Vermelho / Ondina", "Imbuí / Boca do Rio", "Brotas / Cabula", "Itapuã / Stella Maris", "Caminho das Árvores", "Liberdade / Calçada", "Cajazeiras / Pau da Lima"]
  },
  {
    id: "sao_luis", name: "São Luís - MA", shortName: "São Luís", region: "Nordeste", uf: "MA", ibge: "21", mult: 0.96,
    lat: -2.5307, lng: -44.3068,
    stores: [
      ["db", "Supermercado Mateus", "Mateus Cohama / Renascença", "grande", "mateus.svg", "#0D47A1"],
      ["nova_era", "Mix Mateus Atacarejo", "Mix Mateus Guajajaras", "grande", "mateus.svg", "#0D47A1"],
      ["atacadao", "Atacadão São Luís", "Atacadão BR-135", "grande", "atacadao.svg", "#2E7D32"],
      ["assai", "Assaí São Luís", "Assaí Angelim / Turu", "grande", "assai.svg", "#1976D2"],
      ["baratao", "Supermercados Maciel", "Maciel Calhau / Vinhais", "medio", "baratao.svg", "#C2185B"],
      ["carrefour", "Empório & Açougue Fribal", "Fribal Ponta d'Areia", "medio", "db.svg", "#D32F2F"],
      ["mercadinho_bairro", "Camino / Mercadinho de Bairro", "A 350m da sua rua", "pequeno", "mercadinho.svg", "#00695C"],
      ["sacolao_feira", "Feira da Cohab & Praia Grande", "Hortifruti & Pescado MA", "pequeno", "feira.svg", "#33691E"]
    ],
    neighborhoods: ["Cohama / Vinhais", "Renascença / Ponta d'Areia", "Turu / Olho d'Água", "Calhau / Altos do Calhau", "Cidade Operária / Maiobão", "Cohatrac / Cohab", "Centro Histórico SLZ", "Angelim / Bequimão", "Anil / João Paulo"]
  },
  {
    id: "teresina", name: "Teresina - PI", shortName: "Teresina", region: "Nordeste", uf: "PI", ibge: "22", mult: 0.95,
    lat: -5.0892, lng: -42.8019,
    stores: [
      ["db", "Carvalho Super / Mercadão", "Carvalho Homero Castelo Branco", "medio", "db.svg", "#D32F2F"],
      ["nova_era", "Mix Mateus Teresina", "Mateus João XXIII / Kennedy", "grande", "mateus.svg", "#0D47A1"],
      ["atacadao", "Atacadão Teresina", "Atacadão Primavera / Sul", "grande", "atacadao.svg", "#2E7D32"],
      ["assai", "Assaí Teresina", "Assaí Raul Lopes / Dirceu", "grande", "assai.svg", "#1976D2"],
      ["baratao", "Ferreira Supermercados", "Ferreira Zona Norte", "medio", "baratao.svg", "#C2185B"],
      ["carrefour", "Supermercado Toureiro / R. Carvalho", "Rede Média Piauí", "medio", "novo_tempo.svg", "#283593"],
      ["mercadinho_bairro", "Mercadinho Fátima (Bairro)", "A 400m da sua rua", "pequeno", "mercadinho.svg", "#00695C"],
      ["sacolao_feira", "Mercado Central de Teresina", "Feira & Hortifruti PI", "pequeno", "feira.svg", "#33691E"]
    ],
    neighborhoods: ["Fátima / Jóquei", "Ininga / Horto", "Centro / Cabral", "Dirceu Arcoverde (Itararé)", "Mocambinho / Primavera", "São Cristóvão / Noivos", "Parque Piauí / Promorar", "Pirajá / Matinha", "Saci / Bela Vista"]
  },
  {
    id: "natal", name: "Natal - RN", shortName: "Natal", region: "Nordeste", uf: "RN", ibge: "24", mult: 0.96,
    lat: -5.7945, lng: -35.2110,
    stores: [
      ["db", "Supermercados Nordestão", "Nordestão Lagoa Nova / Tirol", "grande", "db.svg", "#D32F2F"],
      ["nova_era", "Favorito Supermercados", "Favorito Ayrton Senna", "medio", "nova_era.svg", "#F57C00"],
      ["atacadao", "Atacadão Natal", "Atacadão BR-101 / Prudente", "grande", "atacadao.svg", "#2E7D32"],
      ["assai", "Assaí Natal", "Assaí Ponta Negra / Zona Norte", "grande", "assai.svg", "#1976D2"],
      ["baratao", "RedeMais Supermercados", "RedeMais Candelária", "medio", "baratao.svg", "#C2185B"],
      ["carrefour", "Carrefour Natal", "Carrefour Zona Sul", "grande", "carrefour.svg", "#0D47A1"],
      ["mercadinho_bairro", "Mercadinho Ponta Negra (Bairro)", "A 400m da sua rua", "pequeno", "mercadinho.svg", "#00695C"],
      ["sacolao_feira", "Feira do Alecrim & Carrasco", "Hortifruti & Feira RN", "pequeno", "feira.svg", "#33691E"]
    ],
    neighborhoods: ["Ponta Negra / Capim Macio", "Tirol / Petrópolis", "Lagoa Nova / Candelária", "Alecrim / Barro Vermelho", "Nova Parnamirim / Neópolis", "Cidade da Esperança", "Lagoa Azul / Pajuçara (Z. Norte)", "Potengi / Igapó", "Planalto / Pitimbu"]
  },
  {
    id: "joao_pessoa", name: "João Pessoa - PB", shortName: "João Pessoa", region: "Nordeste", uf: "PB", ibge: "25", mult: 0.95,
    lat: -7.1195, lng: -34.8450,
    stores: [
      ["db", "Supermercado Manaíra / Santiago", "Santiago Miramar / Manaíra", "medio", "db.svg", "#D32F2F"],
      ["nova_era", "Mix Mateus João Pessoa", "Mateus Altiplano / Mangabeira", "grande", "mateus.svg", "#0D47A1"],
      ["atacadao", "Atacadão João Pessoa", "Atacadão Bessa / Geisel", "grande", "atacadao.svg", "#2E7D32"],
      ["assai", "Assaí João Pessoa", "Assaí Epitácio Pessoa", "grande", "assai.svg", "#1976D2"],
      ["baratao", "Supermercado Menor Preço", "Menor Preço Bancários", "medio", "baratao.svg", "#C2185B"],
      ["carrefour", "Rede Bemais Supermercados", "Bemais Cabo Branco", "medio", "novo_tempo.svg", "#283593"],
      ["mercadinho_bairro", "Mercadinho Tambaú (Bairro)", "A 400m da sua rua", "pequeno", "mercadinho.svg", "#00695C"],
      ["sacolao_feira", "Mercado Central & Torre JP", "Feira & Hortifruti PB", "pequeno", "feira.svg", "#33691E"]
    ],
    neighborhoods: ["Manaíra / Tambaú", "Cabo Branco / Altiplano", "Bessa / Jardim Oceania", "Bancários / Jardim Cidade Universitária", "Mangabeira / Valentina", "Torre / Expedicionários", "Cristo Redentor / Geisel", "Estados / Pedro Gondim", "Centro JP"]
  },
  {
    id: "maceio", name: "Maceió - AL", shortName: "Maceió", region: "Nordeste", uf: "AL", ibge: "27", mult: 0.96,
    lat: -9.6658, lng: -35.7353,
    stores: [
      ["db", "Palato Supermercados", "Palato Ponta Verde / Farol", "medio", "db.svg", "#D32F2F"],
      ["nova_era", "Mix Mateus Maceió", "Mateus Serraria / Tabuleiro", "grande", "mateus.svg", "#0D47A1"],
      ["atacadao", "Atacadão Maceió", "Atacadão Fernandes Lima", "grande", "atacadao.svg", "#2E7D32"],
      ["assai", "Assaí Maceió", "Assaí Mangabeiras / Via Expressa", "grande", "assai.svg", "#1976D2"],
      ["baratao", "Unicompra Supermercados", "Unicompra Jatiúca / Pinheiro", "medio", "baratao.svg", "#C2185B"],
      ["carrefour", "GBarbosa / Cesta de Alimentos", "GBarbosa Stella Maris", "medio", "novo_tempo.svg", "#283593"],
      ["mercadinho_bairro", "Mercadinho Jatiúca (Bairro)", "A 400m da sua rua", "pequeno", "mercadinho.svg", "#00695C"],
      ["sacolao_feira", "Mercado da Produção (Levada)", "Feira & Hortifruti AL", "pequeno", "feira.svg", "#33691E"]
    ],
    neighborhoods: ["Ponta Verde / Pajuçara", "Jatiúca / Mangabeiras", "Farol / Pinheiro", "Serraria / Antares", "Tabuleiro do Martins", "Benedito Bentes", "Poço / Jaraguá", "Cruz das Almas / Jacintinho", "Gruta de Lourdes"]
  },
  {
    id: "aracaju", name: "Aracaju - SE", shortName: "Aracaju", region: "Nordeste", uf: "SE", ibge: "28", mult: 0.96,
    lat: -10.9472, lng: -37.0731,
    stores: [
      ["db", "GBarbosa Supermercados", "GBarbosa Jardins / Riomar", "grande", "db.svg", "#D32F2F"],
      ["nova_era", "Mix Mateus Aracaju", "Mateus Santa Maria / Tancredo", "grande", "mateus.svg", "#0D47A1"],
      ["atacadao", "Atacadão Aracaju", "Atacadão Tancredo Neves", "grande", "atacadao.svg", "#2E7D32"],
      ["assai", "Assaí Aracaju", "Assaí Adélia Franco", "grande", "assai.svg", "#1976D2"],
      ["baratao", "Supermercado Massimo / Bombom", "Massimo Farolândia / 13 de Julho", "medio", "baratao.svg", "#C2185B"],
      ["carrefour", "Rede Menor Preço SE", "Rede Média Aracaju", "medio", "novo_tempo.svg", "#283593"],
      ["mercadinho_bairro", "Mercadinho Atalaia (Bairro)", "A 400m da sua rua", "pequeno", "mercadinho.svg", "#00695C"],
      ["sacolao_feira", "Mercado Central Albano Franco", "Feira & Hortifruti SE", "pequeno", "feira.svg", "#33691E"]
    ],
    neighborhoods: ["Jardins / 13 de Julho", "Atalaia / Coroa do Meio", "Farolândia / Inácio Barbosa", "Luzia / Grageru", "Centro / São José", "Siqueira Campos / Pereira Lobo", "Jabotiana / Ponto Novo", "Santos Dumont / Bugio", "Aruana / Mosqueiro"]
  },

  // CENTRO-OESTE (4)
  {
    id: "brasilia", name: "Brasília - DF", shortName: "Brasília", region: "Centro-Oeste", uf: "DF", ibge: "53", mult: 0.99,
    lat: -15.7938, lng: -47.8827,
    stores: [
      ["db", "Big Box Supermercados", "Big Box Asa Sul / Águas Claras", "medio", "db.svg", "#D32F2F"],
      ["nova_era", "Super Adega Atacadista", "Super Adega SIA / Taguatinga", "grande", "nova_era.svg", "#F57C00"],
      ["atacadao", "Atacadão Dia a Dia / SIA", "Atacadão SIA / Ceilândia", "grande", "atacadao.svg", "#2E7D32"],
      ["assai", "Assaí Brasília", "Assaí Ceilândia / SIA", "grande", "assai.svg", "#1976D2"],
      ["baratao", "Dona de Casa / Veneza", "Supermercado de Quadra DF", "medio", "baratao.svg", "#C2185B"],
      ["carrefour", "Carrefour Brasília", "Carrefour Asa Norte / Sul", "grande", "carrefour.svg", "#0D47A1"],
      ["mercadinho_bairro", "Mercadinho da Comercial (Quadra)", "A 300m na sua quadra", "pequeno", "mercadinho.svg", "#00695C"],
      ["sacolao_feira", "Verdurão & Feira do Guará / Ceasa", "Hortifruti da Quadra", "pequeno", "feira.svg", "#33691E"]
    ],
    neighborhoods: ["Asa Sul / Sudoeste", "Asa Norte / Noroeste", "Águas Claras / Vicente Pires", "Taguatinga / Ceilândia", "Guará I e II", "Plano Piloto / Esplanada", "Lago Sul / Jardim Botânico", "Samambaia / Recanto", "Sobradinho / Planaltina"]
  },
  {
    id: "goiania", name: "Goiânia - GO", shortName: "Goiânia", region: "Centro-Oeste", uf: "GO", ibge: "52", mult: 0.96,
    lat: -16.6869, lng: -49.2648,
    stores: [
      ["db", "Bretas Supermercados", "Bretas Setor Bueno / Marista", "grande", "db.svg", "#D32F2F"],
      ["nova_era", "Barão Supermercados", "Barão Jardim América / Sul", "medio", "nova_era.svg", "#F57C00"],
      ["atacadao", "Atacadão Goiânia", "Atacadão Perimetral Norte", "grande", "atacadao.svg", "#2E7D32"],
      ["assai", "Assaí Goiânia", "Assaí Avenida Independência", "grande", "assai.svg", "#1976D2"],
      ["baratao", "Tatico / Pró Brazilian", "Tatico Campinas / Cidade Jardim", "medio", "baratao.svg", "#C2185B"],
      ["carrefour", "Carrefour / Empório Prime GO", "Carrefour Sul / Lozandes", "grande", "carrefour.svg", "#0D47A1"],
      ["mercadinho_bairro", "Mercadinho Setor Bueno (Bairro)", "A 400m da sua rua", "pequeno", "mercadinho.svg", "#00695C"],
      ["sacolao_feira", "Feira do Cepal & Mercado Central GO", "Hortifruti & Feira GO", "pequeno", "feira.svg", "#33691E"]
    ],
    neighborhoods: ["Setor Bueno / Oeste", "Setor Marista / Sul", "Jardim Goiás / Flamboyant", "Jardim América / Nova Suíça", "Setor Campinas / Central", "Setor Pedro Ludovico", "Parque Amazônia", "Jardim Guanabara / Norte", "Setor Universitário"]
  },
  {
    id: "cuiaba", name: "Cuiabá - MT", shortName: "Cuiabá", region: "Centro-Oeste", uf: "MT", ibge: "51", mult: 0.98,
    lat: -15.6014, lng: -56.0979,
    stores: [
      ["db", "Comper Supermercados", "Comper Miguel Sutil / CPA", "grande", "db.svg", "#D32F2F"],
      ["nova_era", "BigLar Supermercados", "BigLar Jardim das Américas", "medio", "nova_era.svg", "#F57C00"],
      ["atacadao", "Atacadão Cuiabá", "Atacadão Porto / Tijucal", "grande", "atacadao.svg", "#2E7D32"],
      ["assai", "Assaí / Fort Atacadista MT", "Assaí Fernando Corrêa", "grande", "assai.svg", "#1976D2"],
      ["baratao", "Supermercados Machado", "Machado Coxipó", "medio", "baratao.svg", "#C2185B"],
      ["carrefour", "Rede América Supermercados", "Rede Média Cuiabá", "medio", "novo_tempo.svg", "#283593"],
      ["mercadinho_bairro", "Mercadinho Coxipó (Bairro)", "A 400m da sua rua", "pequeno", "mercadinho.svg", "#00695C"],
      ["sacolao_feira", "Mercado do Porto Cuiabá", "Peixes, Queijos & Feira MT", "pequeno", "feira.svg", "#33691E"]
    ],
    neighborhoods: ["Goiabeiras / Duque de Caxias", "Jardim das Américas / Boa Esperança", "CPA I, II, III e IV", "Bosque da Saúde / Alvorada", "Coxipó / Tijucal", "Centro Norte / Araés", "Porto / Dom Aquino", "Pedra 90", "Santa Rosa / Quilombo"]
  },
  {
    id: "campo_grande", name: "Campo Grande - MS", shortName: "Campo Grande", region: "Centro-Oeste", uf: "MS", ibge: "50", mult: 0.96,
    lat: -20.4697, lng: -54.6201,
    stores: [
      ["db", "Comper Campo Grande", "Comper Jardim dos Estados", "grande", "db.svg", "#D32F2F"],
      ["nova_era", "Fort Atacadista MS", "Fort Coronel Antonino / Tiradentes", "grande", "nova_era.svg", "#F57C00"],
      ["atacadao", "Atacadão Campo Grande", "Atacadão Costa e Silva", "grande", "atacadao.svg", "#2E7D32"],
      ["assai", "Assaí Campo Grande", "Assaí Joaquim Murtinho", "grande", "assai.svg", "#1976D2"],
      ["baratao", "Mister Júnior / Pires", "Supermercado Médio Local", "medio", "baratao.svg", "#C2185B"],
      ["carrefour", "Carrefour Campo Grande", "Carrefour Afonso Pena", "grande", "carrefour.svg", "#0D47A1"],
      ["mercadinho_bairro", "Mercadinho Tiradentes (Bairro)", "A 400m da sua rua", "pequeno", "mercadinho.svg", "#00695C"],
      ["sacolao_feira", "Mercadão Municipal de Campo Grande", "Feira & Hortifruti MS", "pequeno", "feira.svg", "#33691E"]
    ],
    neighborhoods: ["Jardim dos Estados / Santa Fé", "Centro / Amambaí", "Tiradentes / Rita Vieira", "Aero Rancho / Parati", "Moreninhas / Universitário", "Coronel Antonino / Monte Castelo", "Carandá Bosque", "Vila Planalto", "Nova Lima"]
  },

  // SUDESTE (4)
  {
    id: "sao_paulo", name: "São Paulo - SP", shortName: "São Paulo", region: "Sudeste", uf: "SP", ibge: "35", mult: 0.95,
    lat: -23.5505, lng: -46.6333,
    stores: [
      ["db", "Pão de Açúcar", "Pão de Açúcar Paulista / Moema", "grande", "pao_acucar.svg", "#1B5E20"],
      ["nova_era", "Sonda Supermercados", "Sonda Água Branca / Tatuapé", "medio", "nova_era.svg", "#F57C00"],
      ["atacadao", "Atacadão São Paulo", "Atacadão Marginal / Vila Maria", "grande", "atacadao.svg", "#2E7D32"],
      ["assai", "Assaí Atacadista SP", "Assaí Aricanduva / Radial", "grande", "assai.svg", "#1976D2"],
      ["baratao", "Hirota / Mambo Supermercados", "Rede Média de Vizinhança", "medio", "baratao.svg", "#C2185B"],
      ["carrefour", "Carrefour Hiper & Market", "Carrefour Pinheiros / Pamplona", "grande", "carrefour.svg", "#0D47A1"],
      ["mercadinho_bairro", "Mercadinho de Bairro / OXXO", "A 300m da sua rua", "pequeno", "mercadinho.svg", "#00695C"],
      ["sacolao_feira", "Sacolão Municipal & Feira Livre SP", "Hortifruti de Bairro", "pequeno", "feira.svg", "#33691E"]
    ],
    neighborhoods: ["Vila Mariana / Moema", "Pinheiros / Perdizes", "Santana / Zona Norte", "Tatuapé / Itaquera (Z. Leste)", "Santo Amaro / Jabaquara", "Centro / Bela Vista", "Butantã / Morumbi", "Lapa / Barra Funda", "Ipiranga / Mooca"]
  },
  {
    id: "rio_de_janeiro", name: "Rio de Janeiro - RJ", shortName: "Rio de Janeiro", region: "Sudeste", uf: "RJ", ibge: "33", mult: 0.96,
    lat: -22.9068, lng: -43.1729,
    stores: [
      ["db", "Supermercados Guanabara", "Guanabara Tijuca / Niterói", "grande", "db.svg", "#D32F2F"],
      ["nova_era", "Supermercados Mundial", "Mundial Botafogo / Barra", "grande", "nova_era.svg", "#F57C00"],
      ["atacadao", "Atacadão Rio", "Atacadão Vicente de Carvalho", "grande", "atacadao.svg", "#2E7D32"],
      ["assai", "Assaí Rio de Janeiro", "Assaí Maracanã / Jacarepaguá", "grande", "assai.svg", "#1976D2"],
      ["baratao", "Prezunic / Super Market RJ", "Prezunic Recreio / Méier", "medio", "baratao.svg", "#C2185B"],
      ["carrefour", "Zona Sul Supermercados", "Zona Sul Copacabana / Ipanema", "medio", "pao_acucar.svg", "#D32F2F"],
      ["mercadinho_bairro", "Mercadinho de Bairro RJ", "A 350m da sua rua", "pequeno", "mercadinho.svg", "#00695C"],
      ["sacolao_feira", "Hortifruti & CADEG Benfica", "Feira & Hortifruti RJ", "pequeno", "feira.svg", "#33691E"]
    ],
    neighborhoods: ["Copacabana / Ipanema (Z. Sul)", "Botafogo / Flamengo", "Tijuca / Vila Isabel", "Barra da Tijuca / Recreio", "Jacarepaguá / Freguesia", "Méier / Engenho de Dentro", "Madureira / Irajá", "Campo Grande / Bangu (Z. Oeste)", "Centro / Lapa"]
  },
  {
    id: "belo_horizonte", name: "Belo Horizonte - MG", shortName: "Belo Horizonte", region: "Sudeste", uf: "MG", ibge: "31", mult: 0.94,
    lat: -19.9167, lng: -43.9345,
    stores: [
      ["db", "Supermercados BH", "Supermercados BH Pampulha / Centro", "grande", "db.svg", "#D32F2F"],
      ["nova_era", "Mart Minas / Apoio Mineiro", "Apoio Mineiro Cristiano Machado", "grande", "nova_era.svg", "#F57C00"],
      ["atacadao", "Atacadão BH / Contagem", "Atacadão Via Expressa", "grande", "atacadao.svg", "#2E7D32"],
      ["assai", "Assaí Belo Horizonte", "Assaí Belvedere / Minas Shopping", "grande", "assai.svg", "#1976D2"],
      ["baratao", "EPA Plus Supermercados", "EPA Savassi / Padre Eustáquio", "medio", "baratao.svg", "#C2185B"],
      ["carrefour", "Super Nosso / Verdemar", "Verdemar Lourdes / Sion", "medio", "pao_acucar.svg", "#1B5E20"],
      ["mercadinho_bairro", "Mercearia & Mercadinho BH", "A 350m da sua rua", "pequeno", "mercadinho.svg", "#00695C"],
      ["sacolao_feira", "Mercado Central BH & Sacolão ABC", "Queijos, Hortifruti & Feira MG", "pequeno", "feira.svg", "#33691E"]
    ],
    neighborhoods: ["Savassi / Lourdes", "Centro / Santa Efigênia", "Pampulha / Ouro Preto", "Buritis / Estoril", "Padre Eustáquio / Carlos Prates", "Venda Nova", "Barreiro", "Cidade Nova / União", "Sion / Anchieta"]
  },
  {
    id: "vitoria", name: "Vitória - ES", shortName: "Vitória", region: "Sudeste", uf: "ES", ibge: "32", mult: 0.96,
    lat: -20.3155, lng: -40.3128,
    stores: [
      ["db", "Supermercados Perim", "Perim Mata da Praia / Vila Velha", "grande", "db.svg", "#D32F2F"],
      ["nova_era", "Extrabom Supermercados ES", "Extrabom Jardim Camburi", "grande", "nova_era.svg", "#F57C00"],
      ["atacadao", "Atacadão Grande Vitória", "Atacadão Serra / Vila Velha", "grande", "atacadao.svg", "#2E7D32"],
      ["assai", "Assaí Grande Vitória", "Assaí Cariacica / Serra", "grande", "assai.svg", "#1976D2"],
      ["baratao", "Supermercados Carone", "Carone Praia do Canto", "medio", "baratao.svg", "#C2185B"],
      ["carrefour", "Supermercado São José ES", "São José Enseada do Suá", "medio", "novo_tempo.svg", "#283593"],
      ["mercadinho_bairro", "Mercadinho Jardim Camburi (Bairro)", "A 400m da sua rua", "pequeno", "mercadinho.svg", "#00695C"],
      ["sacolao_feira", "Feira Livre da Praia do Canto", "Hortifruti & Pescado ES", "pequeno", "feira.svg", "#33691E"]
    ],
    neighborhoods: ["Jardim Camburi", "Praia do Canto / Enseada do Suá", "Jardim da Penha / Mata da Praia", "Bento Ferreira / Jucutuquara", "Centro de Vitória", "Santo Antônio / São Pedro", "Maruípe / Goiabeiras", "Praia da Costa (Vila Velha)", "Laranjeiras (Serra)"]
  },

  // SUL (3)
  {
    id: "curitiba", name: "Curitiba - PR", shortName: "Curitiba", region: "Sul", uf: "PR", ibge: "41", mult: 0.94,
    lat: -25.4284, lng: -49.2733,
    stores: [
      ["db", "Super Muffato", "Muffato Portão / Tarumã", "grande", "muffato.svg", "#B71C1C"],
      ["nova_era", "Supermercados Condor", "Condor Água Verde / Pinheirinho", "grande", "assai.svg", "#1976D2"],
      ["atacadao", "Atacadão Curitiba", "Atacadão Linha Verde", "grande", "atacadao.svg", "#2E7D32"],
      ["assai", "Assaí Curitiba", "Assaí Av. Kennedy", "grande", "assai.svg", "#1976D2"],
      ["baratao", "Festval / Angeloni PR", "Festval Batel / Mercês", "medio", "baratao.svg", "#C2185B"],
      ["carrefour", "Supermercados Jacomar", "Jacomar Boqueirão", "medio", "novo_tempo.svg", "#283593"],
      ["mercadinho_bairro", "Mercadinho de Bairro Curitiba", "A 400m da sua rua", "pequeno", "mercadinho.svg", "#00695C"],
      ["sacolao_feira", "Armazém da Família & Mercado Municipal", "Hortifruti & Feira PR", "pequeno", "feira.svg", "#33691E"]
    ],
    neighborhoods: ["Água Verde / Batel", "Centro / Rebouças", "Santa Felicidade / Mercês", "Cajuru / Uberaba", "Portão / Novo Mundo", "Centro Cívico / Cabral", "Ecoville / Campo Comprido", "Boa Vista / Bacacheri", "Boqueirão / Xaxim"]
  },
  {
    id: "porto_alegre", name: "Porto Alegre - RS", shortName: "Porto Alegre", region: "Sul", uf: "RS", ibge: "43", mult: 0.95,
    lat: -30.0346, lng: -51.2177,
    stores: [
      ["db", "Zaffari & Bourbon", "Zaffari Higienópolis / Ipiranga", "grande", "db.svg", "#D32F2F"],
      ["nova_era", "Stok Center / Comercial Zaffari", "Stok Center Zona Norte", "grande", "nova_era.svg", "#F57C00"],
      ["atacadao", "Atacadão Porto Alegre", "Atacadão Sertório", "grande", "atacadao.svg", "#2E7D32"],
      ["assai", "Assaí Porto Alegre", "Assaí Cavalhada", "grande", "assai.svg", "#1976D2"],
      ["baratao", "Asun Supermercados", "Asun Cidade Baixa / Plínio", "medio", "baratao.svg", "#C2185B"],
      ["carrefour", "Carrefour / Rissul POA", "Carrefour Passo d'Areia", "grande", "carrefour.svg", "#0D47A1"],
      ["mercadinho_bairro", "Minimercado de Bairro POA", "A 350m da sua rua", "pequeno", "mercadinho.svg", "#00695C"],
      ["sacolao_feira", "Mercado Público de Porto Alegre", "Feira & Hortifruti RS", "pequeno", "feira.svg", "#33691E"]
    ],
    neighborhoods: ["Moinhos de Vento / Bela Vista", "Cidade Baixa / Bom Fim", "Menino Deus / Praia de Belas", "Passo d'Areia / Higienópolis", "Petrópolis / Jardim Botânico", "Tristeza / Ipanema (Z. Sul)", "Sarandi / Assis Brasil (Z. Norte)", "Centro Histórico POA", "Restinga / Lomba do Pinheiro"]
  },
  {
    id: "florianopolis", name: "Florianópolis - SC", shortName: "Florianópolis", region: "Sul", uf: "SC", ibge: "42", mult: 0.96,
    lat: -27.5954, lng: -48.5480,
    stores: [
      ["db", "Supermercados Angeloni", "Angeloni Beira-Mar / Capoeiras", "grande", "db.svg", "#D32F2F"],
      ["nova_era", "Fort Atacadista SC", "Fort Campeche / Canasvieiras", "grande", "nova_era.svg", "#F57C00"],
      ["atacadao", "Atacadão Grande Floripa", "Atacadão São José / BR-101", "grande", "atacadao.svg", "#2E7D32"],
      ["assai", "Assaí Grande Florianópolis", "Assaí Via Expressa", "grande", "assai.svg", "#1976D2"],
      ["baratao", "Supermercados Imperatriz", "Imperatriz Trindade / Coqueiros", "medio", "baratao.svg", "#C2185B"],
      ["carrefour", "Hippo Supermercados / Bistek", "Bistek Costeira / Centro", "medio", "pao_acucar.svg", "#1B5E20"],
      ["mercadinho_bairro", "Mercadinho da Ilha (Bairro)", "A 400m da sua rua", "pequeno", "mercadinho.svg", "#00695C"],
      ["sacolao_feira", "Mercado Público & Direto do Campo", "Hortifruti & Pescado SC", "pequeno", "feira.svg", "#33691E"]
    ],
    neighborhoods: ["Centro / Beira-Mar Norte", "Trindade / Itacorubi", "Campeche / Rio Tavares (Sul da Ilha)", "Ingleses / Canasvieiras (Norte da Ilha)", "Lagoa da Conceição", "Estreito / Coqueiros (Continente)", "Córrego Grande / Santa Mônica", "Capoeiras / Abraão", "Jurerê / Santo Antônio de Lisboa"]
  }
];

const NEIGH_KEYS = ["adrianopolis", "flores", "cidade_nova", "autaz_mirim", "betania", "centro", "ponta_negra", "alvorada", "coroado"];
const OFFSETS = [
  [0.012, 0.008], [-0.018, 0.005], [0.045, 0.030], [0.025, 0.048],
  [-0.022, 0.012], [0.000, 0.000], [-0.032, -0.045], [0.015, -0.022], [-0.010, 0.028]
];

const citiesConfigObj = {};
for (const c of RAW_CAPITALS) {
  const supermarkets = {};
  c.stores.forEach((st, idx) => {
    const [key, name, unit, tier, logoFile, color] = st;
    const off = OFFSETS[idx % OFFSETS.length];
    const tierLabels = { grande: "Grande Porte", medio: "Médio Porte", pequeno: "Pequeno Porte" };
    supermarkets[key] = {
      name,
      color,
      unit,
      lat: +(c.lat + off[0]).toFixed(4),
      lng: +(c.lng + off[1]).toFixed(4),
      tier,
      tierLabel: tierLabels[tier] || "Médio Porte",
      logo: `web/assets/logos/${logoFile}`
    };
  });

  const neighborhoods = c.neighborhoods.map((nName, idx) => {
    const off = OFFSETS[idx % OFFSETS.length];
    return {
      key: NEIGH_KEYS[idx],
      name: nName,
      lat: +(c.lat + off[0] * 0.9).toFixed(4),
      lng: +(c.lng + off[1] * 0.9).toFixed(4)
    };
  });

  const storeNamesPreview = c.stores.slice(0, 5).map(s => s[1]).join(", ");

  citiesConfigObj[c.id] = {
    id: c.id,
    name: c.name,
    shortName: c.shortName,
    region: c.region,
    uf: c.uf,
    ibgePrefix: c.ibge,
    sefazName: `SEFAZ-${c.uf}`,
    sefazDomain: `sefaz.${c.uf.toLowerCase()}.gov.br`,
    heroBadge: `🇧🇷 Monitor Nacional • ${c.name} (Pequeno, Médio e Grande Porte)`,
    heroTitle: `Economize nos Mercados de ${c.name}`,
    heroSubtitle: `Cotações em ${c.shortName}: ${storeNamesPreview}, Mercadinhos de Bairro e Feiras.`,
    priceMultiplier: c.mult,
    supermarkets,
    neighborhoods
  };
}

// 1. Update web/data/manausCatalog.js
const catalogPath = path.join(__dirname, '..', 'web', 'data', 'manausCatalog.js');
let catalogCode = fs.readFileSync(catalogPath, 'utf8');
const startMarker = '  const CITIES_CONFIG = {';
const endMarker = '  // ============================================================================\n  // EXPANSÃO DO BANCO DE DADOS';
const startIdx = catalogCode.indexOf(startMarker);
const endIdx = catalogCode.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  throw new Error('Markers not found in manausCatalog.js');
}

const newCitiesCode = `  const CITIES_CONFIG = ${JSON.stringify(citiesConfigObj, null, 4).replace(/\n/g, '\n  ')};\n\n`;
catalogCode = catalogCode.slice(0, startIdx) + newCitiesCode + catalogCode.slice(endIdx);
fs.writeFileSync(catalogPath, catalogCode, 'utf8');
console.log(`✅ Updated manausCatalog.js with ${Object.keys(citiesConfigObj).length} Brazilian state capitals!`);

// 2. Update index.html #city-switcher-select with all 27 capitals grouped by region
const indexPath = path.join(__dirname, '..', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

const regionsMap = {
  "🌿 Região Norte (7 Capitais)": RAW_CAPITALS.filter(c => c.region === "Norte"),
  "☀️ Região Nordeste (9 Capitais)": RAW_CAPITALS.filter(c => c.region === "Nordeste"),
  "🌾 Região Centro-Oeste (4 Capitais)": RAW_CAPITALS.filter(c => c.region === "Centro-Oeste"),
  "🏙️ Região Sudeste (4 Capitais)": RAW_CAPITALS.filter(c => c.region === "Sudeste"),
  "🌲 Região Sul (3 Capitais)": RAW_CAPITALS.filter(c => c.region === "Sul")
};

let selectOptionsHtml = `<select id="city-switcher-select" class="city-switcher-select" onchange="switchCity(this.value)" title="Escolher Capital (27 Capitais do Brasil)">\n`;
for (const [groupLabel, list] of Object.entries(regionsMap)) {
  selectOptionsHtml += `        <optgroup label="${groupLabel}">\n`;
  for (const cap of list) {
    selectOptionsHtml += `          <option value="${cap.id}">${cap.name}</option>\n`;
  }
  selectOptionsHtml += `        </optgroup>\n`;
}
selectOptionsHtml += `      </select>`;

indexHtml = indexHtml.replace(/<select id="city-switcher-select"[\s\S]*?<\/select>/, selectOptionsHtml);
indexHtml = indexHtml.replace(
  /<strong>5 Regiões<\/strong>\s*<span>Cobertura Brasil<\/span>/,
  `<strong>27 Capitais</strong>\n            <span>Todos os Estados</span>`
);
fs.writeFileSync(indexPath, indexHtml, 'utf8');
console.log(`✅ Updated index.html selector with all 27 Brazilian capitals!`);
