/**
 * PreçoManaus — Catálogo Unificado de Supermercados, Produtos, Encartes e Cesta DIEESE (Manaus-AM)
 * Compatível com Browser (window) e Node.js (CommonJS).
 */
(function (root) {
  const SUPERMARKETS = {
    db: { name: "DB Supermercados", color: "#D32F2F", unit: "Hiper DB Paraíba - Adrianópolis", lat: -3.1110, lng: -60.0150, tier: "grande", tierLabel: "Grande Porte / Hiper", logo: "web/assets/logos/db.svg" },
    nova_era: { name: "Nova Era Superatacado", color: "#F57C00", unit: "Nova Era Torquato Tapajós", lat: -3.0620, lng: -60.0270, tier: "grande", tierLabel: "Grande Porte / Atacarejo", logo: "web/assets/logos/nova_era.svg" },
    atacadao: { name: "Atacadão", color: "#2E7D32", unit: "Atacadão Camapuã - Cidade Nova", lat: -3.0350, lng: -59.9720, tier: "grande", tierLabel: "Grande Porte / Atacarejo", logo: "web/assets/logos/atacadao.svg" },
    assai: { name: "Assaí Atacadista", color: "#1976D2", unit: "Assaí Autaz Mirim - Z. Leste", lat: -3.0730, lng: -59.9410, tier: "grande", tierLabel: "Grande Porte / Atacarejo", logo: "web/assets/logos/assai.svg" },
    baratao: { name: "Baratão da Carne", color: "#C2185B", unit: "Baratão Betânia", lat: -3.1400, lng: -60.0050, tier: "medio", tierLabel: "Médio Porte / Regional", logo: "web/assets/logos/baratao.svg" },
    carrefour: { name: "Carrefour Bairro & Hiper", color: "#0D47A1", unit: "Carrefour Adrianópolis", lat: -3.1070, lng: -60.0190, tier: "medio", tierLabel: "Médio/Grande Porte", logo: "web/assets/logos/carrefour.svg" },
    mercadinho_bairro: { name: "Mercadinho do Bairro", color: "#00695C", unit: "Mercadinho de Esquina (A 400m)", lat: -3.1060, lng: -60.0130, tier: "pequeno", tierLabel: "Pequeno Porte / Bairro", logo: "web/assets/logos/mercadinho.svg" },
    sacolao_feira: { name: "Feira da Manaus Moderna", color: "#33691E", unit: "Hortifruti & Feira", lat: -3.1080, lng: -60.0140, tier: "pequeno", tipo: "hortifruti", tierLabel: "Hortifruti & Feira", logo: "web/assets/logos/feira-manaus-moderna.svg" },
    m9: { name: "Supermercados Rodrigues", color: "#1565C0", unit: "Supermercado", lat: -3.0950, lng: -60.0050, tier: "medio", tipo: "super", tierLabel: "Supermercado", logo: "web/assets/logos/supermercados-rodrigues.svg" },
    m10: { name: "Supermercado Coari", color: "#2E7D32", unit: "Supermercado", lat: -3.1150, lng: -60.0250, tier: "medio", tipo: "super", tierLabel: "Supermercado", logo: "web/assets/logos/supermercado-coari.svg" },
    m11: { name: "Supermercado Veneza", color: "#AD1457", unit: "Supermercado", lat: -3.0850, lng: -60.0350, tier: "medio", tipo: "super", tierLabel: "Supermercado", logo: "web/assets/logos/supermercado-veneza-am.svg" },
    m12: { name: "Supermercados Vitória", color: "#EF6C00", unit: "Supermercado", lat: -3.0750, lng: -59.9950, tier: "medio", tipo: "super", tierLabel: "Supermercado", logo: "web/assets/logos/supermercado-vitoria-am.svg" },
    m13: { name: "Empório DB", color: "#B71C1C", unit: "Premium", lat: -3.1020, lng: -60.0110, tier: "medio", tipo: "premium", tierLabel: "Premium", logo: "web/assets/logos/emporio-db.svg" },
    m14: { name: "Mania Supermercados", color: "#00838F", unit: "Supermercado", lat: -3.0650, lng: -60.0450, tier: "medio", tipo: "super", tierLabel: "Supermercado", logo: "web/assets/logos/mania-supermercados.svg" },
    m15: { name: "Bom Preço Manaus", color: "#283593", unit: "Proximidade", lat: -3.1090, lng: -60.0160, tier: "pequeno", tipo: "proximidade", tierLabel: "Proximidade", logo: "web/assets/logos/supermercado-bom-preco-am.svg" }
  };

  const KNOWN_EANS = {
    "arroz_tio_joao_5kg": "7891149103112",
    "cafe_pilao_500g": "7894900010015",
    "tambaqui_fresco_kg": "7890000000012",
    "leite_ninho_380g": "7891000100103",
    "farinha_uarini_1kg": "7891035123456",
    "feijao_kicaldo_1kg": "7891000200204",
    "oleo_soja_900ml": "7891000300305",
    "sabao_omo_16kg": "7891000400406",
    "detergente_ype_500ml": "7891000500507",
    "pao_frances_kg": "7891000100703",
    "acucar_uniao_1kg": "7891000100701",
    "manteiga_aviacao_200g": "7891000100702",
    "tomate_regional_kg": "7891000100704"
  };

  const PRODUCTS = [
    {
      id: "arroz_tio_joao_5kg",
      name: "Arroz Branco Tipo 1 5kg",
      brand: "Tio João",
      unit: "5kg",
      category: "Cesta Básica",
      icon: "🌾",
      prices: {
        atacadao: { price: 23.89, neighborhood: "Cidade Nova" },
        nova_era: { price: 24.49, neighborhood: "Torquato Tapajós" },
        assai: { price: 24.90, neighborhood: "Autaz Mirim" },
        db: { price: 26.90, neighborhood: "Adrianópolis" },
        baratao: { price: 25.50, neighborhood: "Betânia" },
        carrefour: { price: 28.50, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "feijao_kicaldo_1kg",
      name: "Feijão Carioca 1kg",
      brand: "Kicaldo",
      unit: "1kg",
      category: "Cesta Básica",
      icon: "🌾",
      prices: {
        nova_era: { price: 6.89, neighborhood: "Torquato Tapajós" },
        atacadao: { price: 6.99, neighborhood: "Camapuã" },
        db: { price: 7.49, neighborhood: "Paraíba" },
        assai: { price: 7.15, neighborhood: "Autaz Mirim" },
        baratao: { price: 7.20, neighborhood: "Betânia" },
        carrefour: { price: 8.19, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "farinha_uarini_1kg",
      name: "Farinha de Mandioca do Uarini Ovinha 1kg",
      brand: "Ouro do Amazonas",
      unit: "1kg",
      category: "Cesta Básica",
      icon: "🌾",
      isRegional: true,
      prices: {
        nova_era: { price: 12.90, neighborhood: "Flores" },
        db: { price: 13.90, neighborhood: "Adrianópolis" },
        baratao: { price: 14.50, neighborhood: "Betânia" },
        atacadao: { price: 13.40, neighborhood: "Cidade Nova" },
        assai: { price: 13.80, neighborhood: "Autaz Mirim" },
        carrefour: { price: 15.90, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "tambaqui_fresco_kg",
      name: "Tambaqui Fresco Inteiro Tratado kg",
      brand: "Pescados do Amazonas",
      unit: "kg",
      category: "Carnes & Peixes Regionais",
      icon: "🐟",
      isRegional: true,
      prices: {
        baratao: { price: 14.99, neighborhood: "Betânia" },
        nova_era: { price: 15.89, neighborhood: "Torquato Tapajós" },
        db: { price: 17.90, neighborhood: "Paraíba" },
        atacadao: { price: 16.50, neighborhood: "Camapuã" },
        assai: { price: 16.90, neighborhood: "Autaz Mirim" },
        carrefour: { price: 19.90, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "picanha_friboi_kg",
      name: "Picanha Bovina Fatiada Peça kg",
      brand: "Friboi",
      unit: "kg",
      category: "Carnes & Peixes Regionais",
      icon: "🥩",
      prices: {
        baratao: { price: 54.90, neighborhood: "Betânia" },
        atacadao: { price: 56.90, neighborhood: "Cidade Nova" },
        nova_era: { price: 58.90, neighborhood: "Torquato Tapajós" },
        assai: { price: 59.90, neighborhood: "Autaz Mirim" },
        db: { price: 68.90, neighborhood: "Adrianópolis" },
        carrefour: { price: 74.90, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "alcatra_bovina_kg",
      name: "Alcatra Bovina com Maminha kg",
      brand: "Cortes Selecionados",
      unit: "kg",
      category: "Carnes & Peixes Regionais",
      icon: "🥩",
      prices: {
        baratao: { price: 34.90, neighborhood: "Betânia" },
        nova_era: { price: 36.50, neighborhood: "Torquato Tapajós" },
        atacadao: { price: 37.90, neighborhood: "Camapuã" },
        db: { price: 41.90, neighborhood: "Paraíba" },
        assai: { price: 38.50, neighborhood: "Autaz Mirim" },
        carrefour: { price: 44.90, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "banana_pacova_kg",
      name: "Banana Pacovã Selecionada de Manaus kg",
      brand: "Hortifruti AM",
      unit: "kg",
      category: "Hortifruti & Manaus",
      icon: "🍌",
      isRegional: true,
      prices: {
        nova_era: { price: 4.89, neighborhood: "Flores" },
        baratao: { price: 5.29, neighborhood: "Betânia" },
        atacadao: { price: 5.49, neighborhood: "Cidade Nova" },
        db: { price: 6.49, neighborhood: "Adrianópolis" },
        assai: { price: 5.89, neighborhood: "Autaz Mirim" },
        carrefour: { price: 7.29, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "leite_ninho_380g",
      name: "Leite em Pó Integral Ninho Forti+ 380g",
      brand: "Nestlé",
      unit: "380g",
      category: "Matinais & Laticínios",
      icon: "🥛",
      prices: {
        atacadao: { price: 15.79, neighborhood: "Cidade Nova" },
        nova_era: { price: 15.99, neighborhood: "Torquato Tapajós" },
        assai: { price: 16.49, neighborhood: "Autaz Mirim" },
        db: { price: 17.89, neighborhood: "Adrianópolis" },
        baratao: { price: 16.90, neighborhood: "Betânia" },
        carrefour: { price: 18.99, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "cafe_santa_clara_500g",
      name: "Café Torrado e Moído Tradicional 500g",
      brand: "Santa Clara",
      unit: "500g",
      category: "Matinais & Laticínios",
      icon: "☕",
      prices: {
        nova_era: { price: 17.90, neighborhood: "Torquato Tapajós" },
        atacadao: { price: 18.20, neighborhood: "Camapuã" },
        assai: { price: 18.50, neighborhood: "Autaz Mirim" },
        db: { price: 19.90, neighborhood: "Paraíba" },
        baratao: { price: 19.20, neighborhood: "Betânia" },
        carrefour: { price: 21.49, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "oleo_soja_900ml",
      name: "Óleo de Soja Refinado 900ml",
      brand: "Soya",
      unit: "900ml",
      category: "Cesta Básica",
      icon: "🌻",
      prices: {
        atacadao: { price: 5.89, neighborhood: "Cidade Nova" },
        assai: { price: 5.95, neighborhood: "Autaz Mirim" },
        nova_era: { price: 6.19, neighborhood: "Flores" },
        baratao: { price: 6.39, neighborhood: "Betânia" },
        db: { price: 6.79, neighborhood: "Adrianópolis" },
        carrefour: { price: 7.19, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "sabao_omo_16kg",
      name: "Lava Roupas em Pó Omo Lavagem Perfeita 1.6kg",
      brand: "Omo",
      unit: "1.6kg",
      category: "Limpeza & Higiene",
      icon: "🧼",
      prices: {
        atacadao: { price: 21.90, neighborhood: "Cidade Nova" },
        nova_era: { price: 22.49, neighborhood: "Torquato Tapajós" },
        assai: { price: 22.89, neighborhood: "Autaz Mirim" },
        db: { price: 25.90, neighborhood: "Adrianópolis" },
        baratao: { price: 24.50, neighborhood: "Betânia" },
        carrefour: { price: 27.90, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "pimenta_cheiro_200g",
      name: "Pimenta-de-Cheiro Fresca de Manaus 200g",
      brand: "Hortifruti AM",
      unit: "200g",
      category: "Especiarias & Temperos",
      icon: "🌶️",
      isRegional: true,
      prices: {
        nova_era: { price: 3.99, neighborhood: "Flores" },
        baratao: { price: 4.29, neighborhood: "Betânia" },
        atacadao: { price: 4.49, neighborhood: "Cidade Nova" },
        db: { price: 4.89, neighborhood: "Adrianópolis" },
        assai: { price: 4.59, neighborhood: "Autaz Mirim" },
        carrefour: { price: 5.50, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "colorau_kitano_100g",
      name: "Colorau / Urucum em Pó 100g",
      brand: "Kitano",
      unit: "100g",
      category: "Especiarias & Temperos",
      icon: "🧂",
      prices: {
        atacadao: { price: 2.49, neighborhood: "Camapuã" },
        assai: { price: 2.59, neighborhood: "Autaz Mirim" },
        nova_era: { price: 2.79, neighborhood: "Torquato Tapajós" },
        baratao: { price: 2.89, neighborhood: "Betânia" },
        db: { price: 3.19, neighborhood: "Adrianópolis" },
        carrefour: { price: 3.49, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "cominho_kitano_50g",
      name: "Cominho Moído com Pimenta-do-Reino 50g",
      brand: "Kitano",
      unit: "50g",
      category: "Especiarias & Temperos",
      icon: "🌿",
      prices: {
        nova_era: { price: 2.89, neighborhood: "Torquato Tapajós" },
        atacadao: { price: 2.95, neighborhood: "Camapuã" },
        assai: { price: 3.09, neighborhood: "Autaz Mirim" },
        baratao: { price: 3.20, neighborhood: "Betânia" },
        db: { price: 3.49, neighborhood: "Adrianópolis" },
        carrefour: { price: 3.79, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "canela_po_kitano_50g",
      name: "Canela em Pó Pura 50g",
      brand: "Kitano",
      unit: "50g",
      category: "Especiarias & Temperos",
      icon: "🍂",
      prices: {
        atacadao: { price: 3.49, neighborhood: "Camapuã" },
        nova_era: { price: 3.69, neighborhood: "Flores" },
        assai: { price: 3.79, neighborhood: "Autaz Mirim" },
        db: { price: 4.19, neighborhood: "Adrianópolis" },
        baratao: { price: 3.99, neighborhood: "Betânia" },
        carrefour: { price: 4.59, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "detergente_ype_500ml",
      name: "Detergente Líquido Lava-Louças Clear 500ml",
      brand: "Ypê",
      unit: "500ml",
      category: "Limpeza & Higiene",
      icon: "🧽",
      prices: {
        assai: { price: 2.19, neighborhood: "Autaz Mirim" },
        atacadao: { price: 2.25, neighborhood: "Camapuã" },
        nova_era: { price: 2.39, neighborhood: "Torquato Tapajós" },
        baratao: { price: 2.49, neighborhood: "Betânia" },
        db: { price: 2.79, neighborhood: "Adrianópolis" },
        carrefour: { price: 2.99, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "desinfetante_pinho_sol_1l",
      name: "Desinfetante Pinho Sol Original 1L",
      brand: "Pinho Sol",
      unit: "1L",
      category: "Limpeza & Higiene",
      icon: "🌲",
      prices: {
        atacadao: { price: 8.99, neighborhood: "Camapuã" },
        nova_era: { price: 9.49, neighborhood: "Torquato Tapajós" },
        assai: { price: 9.69, neighborhood: "Autaz Mirim" },
        baratao: { price: 9.90, neighborhood: "Betânia" },
        db: { price: 10.90, neighborhood: "Adrianópolis" },
        carrefour: { price: 11.90, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "agua_sanitaria_1l",
      name: "Água Sanitária Desinfetante e Alvejante 1L",
      brand: "Dragão / Q-Boa",
      unit: "1L",
      category: "Limpeza & Higiene",
      icon: "🧴",
      prices: {
        baratao: { price: 2.99, neighborhood: "Betânia" },
        nova_era: { price: 3.19, neighborhood: "Flores" },
        atacadao: { price: 3.29, neighborhood: "Cidade Nova" },
        assai: { price: 3.39, neighborhood: "Autaz Mirim" },
        db: { price: 3.79, neighborhood: "Adrianópolis" },
        carrefour: { price: 4.19, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "amaciante_downy_500ml",
      name: "Amaciante Concentrado Brisa de Verão 500ml",
      brand: "Downy",
      unit: "500ml",
      category: "Limpeza & Higiene",
      icon: "🌸",
      prices: {
        assai: { price: 8.90, neighborhood: "Autaz Mirim" },
        atacadao: { price: 9.29, neighborhood: "Camapuã" },
        nova_era: { price: 9.69, neighborhood: "Torquato Tapajós" },
        baratao: { price: 9.99, neighborhood: "Betânia" },
        db: { price: 10.90, neighborhood: "Adrianópolis" },
        carrefour: { price: 11.99, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "veja_multiuso_500ml",
      name: "Limpador Multiuso Tradicional 500ml",
      brand: "Veja",
      unit: "500ml",
      category: "Limpeza & Higiene",
      icon: "✨",
      prices: {
        nova_era: { price: 4.49, neighborhood: "Torquato Tapajós" },
        atacadao: { price: 4.69, neighborhood: "Camapuã" },
        assai: { price: 4.79, neighborhood: "Autaz Mirim" },
        baratao: { price: 4.89, neighborhood: "Betânia" },
        db: { price: 5.29, neighborhood: "Adrianópolis" },
        carrefour: { price: 5.69, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "racao_pedigree_3kg",
      name: "Ração para Cães Adultos Carne & Vegetais 3kg",
      brand: "Pedigree",
      unit: "3kg",
      category: "Pets & Animais",
      icon: "🐶",
      prices: {
        atacadao: { price: 39.90, neighborhood: "Camapuã" },
        nova_era: { price: 41.50, neighborhood: "Torquato Tapajós" },
        assai: { price: 42.90, neighborhood: "Autaz Mirim" },
        baratao: { price: 43.90, neighborhood: "Betânia" },
        db: { price: 46.90, neighborhood: "Adrianópolis" },
        carrefour: { price: 49.90, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "racao_whiskas_1kg",
      name: "Ração para Gatos Adultos Sabor Frango 1kg",
      brand: "Whiskas",
      unit: "1kg",
      category: "Pets & Animais",
      icon: "🐱",
      prices: {
        assai: { price: 19.90, neighborhood: "Autaz Mirim" },
        atacadao: { price: 20.49, neighborhood: "Camapuã" },
        nova_era: { price: 21.20, neighborhood: "Torquato Tapajós" },
        baratao: { price: 21.90, neighborhood: "Betânia" },
        db: { price: 23.90, neighborhood: "Adrianópolis" },
        carrefour: { price: 25.50, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "sache_whiskas_85g",
      name: "Ração Úmida Sachê para Gatos Salmão 85g",
      brand: "Whiskas",
      unit: "85g",
      category: "Pets & Animais",
      icon: "🐟",
      prices: {
        nova_era: { price: 2.89, neighborhood: "Flores" },
        atacadao: { price: 2.95, neighborhood: "Camapuã" },
        assai: { price: 2.99, neighborhood: "Autaz Mirim" },
        baratao: { price: 3.19, neighborhood: "Betânia" },
        db: { price: 3.49, neighborhood: "Adrianópolis" },
        carrefour: { price: 3.79, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "areia_pipicat_4kg",
      name: "Granulado Sanitário Clássico para Gatos 4kg",
      brand: "Pipicat",
      unit: "4kg",
      category: "Pets & Animais",
      icon: "🐾",
      prices: {
        atacadao: { price: 11.90, neighborhood: "Camapuã" },
        assai: { price: 12.49, neighborhood: "Autaz Mirim" },
        nova_era: { price: 12.90, neighborhood: "Flores" },
        baratao: { price: 13.50, neighborhood: "Betânia" },
        db: { price: 14.50, neighborhood: "Adrianópolis" },
        carrefour: { price: 15.90, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "colgate_tripla_acao_90g",
      name: "Creme Dental Anticáries Tripla Ação 90g",
      brand: "Colgate",
      unit: "90g",
      category: "Higiene & Drogaria",
      icon: "🪥",
      prices: {
        assai: { price: 3.49, neighborhood: "Autaz Mirim" },
        atacadao: { price: 3.65, neighborhood: "Camapuã" },
        nova_era: { price: 3.79, neighborhood: "Torquato Tapajós" },
        baratao: { price: 3.89, neighborhood: "Betânia" },
        db: { price: 4.39, neighborhood: "Adrianópolis" },
        carrefour: { price: 4.79, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "sabonete_protex_85g",
      name: "Sabonete em Barra Antibacteriano 85g",
      brand: "Protex / Dove",
      unit: "85g",
      category: "Higiene & Drogaria",
      icon: "🧼",
      prices: {
        baratao: { price: 2.49, neighborhood: "Betânia" },
        nova_era: { price: 2.69, neighborhood: "Torquato Tapajós" },
        atacadao: { price: 2.75, neighborhood: "Camapuã" },
        assai: { price: 2.85, neighborhood: "Autaz Mirim" },
        db: { price: 3.19, neighborhood: "Adrianópolis" },
        carrefour: { price: 3.59, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "desodorante_rexona_150ml",
      name: "Desodorante Aerosol Invisible 150ml",
      brand: "Rexona",
      unit: "150ml",
      category: "Higiene & Drogaria",
      icon: "💨",
      prices: {
        atacadao: { price: 11.90, neighborhood: "Camapuã" },
        nova_era: { price: 12.49, neighborhood: "Flores" },
        assai: { price: 12.90, neighborhood: "Autaz Mirim" },
        baratao: { price: 13.20, neighborhood: "Betânia" },
        db: { price: 14.90, neighborhood: "Adrianópolis" },
        carrefour: { price: 16.50, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "papel_higienico_neve_12",
      name: "Papel Higiênico Folha Dupla c/ 12 Rolos",
      brand: "Neve",
      unit: "12 rolos",
      category: "Higiene & Drogaria",
      icon: "🧻",
      prices: {
        assai: { price: 18.90, neighborhood: "Autaz Mirim" },
        atacadao: { price: 19.49, neighborhood: "Camapuã" },
        nova_era: { price: 20.50, neighborhood: "Torquato Tapajós" },
        baratao: { price: 21.00, neighborhood: "Betânia" },
        db: { price: 22.90, neighborhood: "Adrianópolis" },
        carrefour: { price: 25.90, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "dipirona_gotas_20ml",
      name: "Dipirona Monoidratada Gotas 500mg/ml 20ml",
      brand: "Genérico EMS",
      unit: "20ml",
      category: "Higiene & Drogaria",
      icon: "💊",
      prices: {
        nova_era: { price: 3.99, neighborhood: "Torquato Tapajós" },
        atacadao: { price: 4.29, neighborhood: "Camapuã" },
        assai: { price: 4.49, neighborhood: "Autaz Mirim" },
        db: { price: 4.89, neighborhood: "Adrianópolis" },
        baratao: { price: 4.79, neighborhood: "Betânia" },
        carrefour: { price: 5.49, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "fralda_pampers_g_48",
      name: "Fralda Descartável Confort Sec Mega G 48un",
      brand: "Pampers",
      unit: "48un",
      category: "Bebê & Infantil",
      icon: "👶",
      prices: {
        atacadao: { price: 58.90, neighborhood: "Camapuã" },
        nova_era: { price: 61.49, neighborhood: "Torquato Tapajós" },
        assai: { price: 62.90, neighborhood: "Autaz Mirim" },
        baratao: { price: 64.90, neighborhood: "Betânia" },
        db: { price: 68.90, neighborhood: "Adrianópolis" },
        carrefour: { price: 74.90, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "lenco_pampers_100",
      name: "Toalhinhas Umedecidas Lenço Infantil c/ 100un",
      brand: "Pampers",
      unit: "100un",
      category: "Bebê & Infantil",
      icon: "🍼",
      prices: {
        assai: { price: 11.90, neighborhood: "Autaz Mirim" },
        atacadao: { price: 12.49, neighborhood: "Camapuã" },
        nova_era: { price: 12.99, neighborhood: "Flores" },
        baratao: { price: 13.50, neighborhood: "Betânia" },
        db: { price: 14.89, neighborhood: "Adrianópolis" },
        carrefour: { price: 16.50, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "pomada_hipoglos_45g",
      name: "Pomada para Prevenção de Assaduras 45g",
      brand: "Hipoglós Amêndoas",
      unit: "45g",
      category: "Bebê & Infantil",
      icon: "🩺",
      prices: {
        nova_era: { price: 14.90, neighborhood: "Flores" },
        atacadao: { price: 15.49, neighborhood: "Camapuã" },
        assai: { price: 15.90, neighborhood: "Autaz Mirim" },
        db: { price: 16.90, neighborhood: "Adrianópolis" },
        baratao: { price: 16.50, neighborhood: "Betânia" },
        carrefour: { price: 18.50, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "formula_nan_800g",
      name: "Fórmula Infantil para Lactentes NAN Supreme 1 800g",
      brand: "Nestlé",
      unit: "800g",
      category: "Bebê & Infantil",
      icon: "🥛",
      prices: {
        atacadao: { price: 68.90, neighborhood: "Camapuã" },
        nova_era: { price: 72.49, neighborhood: "Torquato Tapajós" },
        assai: { price: 74.90, neighborhood: "Autaz Mirim" },
        db: { price: 79.90, neighborhood: "Adrianópolis" },
        baratao: { price: 77.90, neighborhood: "Betânia" },
        carrefour: { price: 84.90, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "caderno_tilibra_96fls",
      name: "Caderno Espiral Universitário 1 Matéria 96 Fls",
      brand: "Tilibra",
      unit: "96 fls",
      category: "Papelaria & Bazar",
      icon: "📓",
      prices: {
        assai: { price: 9.90, neighborhood: "Autaz Mirim" },
        atacadao: { price: 10.49, neighborhood: "Camapuã" },
        nova_era: { price: 10.99, neighborhood: "Torquato Tapajós" },
        baratao: { price: 11.50, neighborhood: "Betânia" },
        db: { price: 12.90, neighborhood: "Adrianópolis" },
        carrefour: { price: 14.50, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "caneta_bic_3un",
      name: "Caneta Esferográfica Cristal Azul Pacote c/ 3un",
      brand: "BIC",
      unit: "3un",
      category: "Papelaria & Bazar",
      icon: "🖊️",
      prices: {
        nova_era: { price: 3.99, neighborhood: "Torquato Tapajós" },
        atacadao: { price: 4.19, neighborhood: "Camapuã" },
        assai: { price: 4.29, neighborhood: "Autaz Mirim" },
        baratao: { price: 4.49, neighborhood: "Betânia" },
        db: { price: 4.90, neighborhood: "Adrianópolis" },
        carrefour: { price: 5.49, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "papel_sulfite_a4_500",
      name: "Papel Sulfite Chamex Branco A4 75g Resma 500 Fls",
      brand: "Chamex",
      unit: "500 fls",
      category: "Papelaria & Bazar",
      icon: "📄",
      prices: {
        atacadao: { price: 24.90, neighborhood: "Camapuã" },
        nova_era: { price: 25.90, neighborhood: "Torquato Tapajós" },
        assai: { price: 26.50, neighborhood: "Autaz Mirim" },
        baratao: { price: 27.20, neighborhood: "Betânia" },
        db: { price: 28.90, neighborhood: "Adrianópolis" },
        carrefour: { price: 31.90, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "cafe_pilao_500g",
      name: "Café Torrado e Moído Pilão Tradicional 500g",
      brand: "Pilão (Líder)",
      unit: "500g",
      category: "Matinais & Laticínios",
      icon: "☕",
      prices: {
        atacadao: { price: 18.89, neighborhood: "Camapuã" },
        nova_era: { price: 19.49, neighborhood: "Torquato Tapajós" },
        assai: { price: 19.79, neighborhood: "Autaz Mirim" },
        baratao: { price: 20.20, neighborhood: "Betânia" },
        db: { price: 21.90, neighborhood: "Adrianópolis" },
        carrefour: { price: 22.90, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "cafe_tres_coracoes_500g",
      name: "Café Torrado e Moído 3 Corações Tradicional 500g",
      brand: "3 Corações (Líder)",
      unit: "500g",
      category: "Matinais & Laticínios",
      icon: "☕",
      prices: {
        nova_era: { price: 18.49, neighborhood: "Flores" },
        atacadao: { price: 18.79, neighborhood: "Camapuã" },
        assai: { price: 19.10, neighborhood: "Autaz Mirim" },
        baratao: { price: 19.50, neighborhood: "Betânia" },
        db: { price: 20.90, neighborhood: "Adrianópolis" },
        carrefour: { price: 22.40, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "cafe_melitta_500g",
      name: "Café Melitta Tradicional Vácuo 500g",
      brand: "Melitta (Líder)",
      unit: "500g",
      category: "Matinais & Laticínios",
      icon: "☕",
      prices: {
        assai: { price: 19.90, neighborhood: "Autaz Mirim" },
        atacadao: { price: 20.49, neighborhood: "Camapuã" },
        nova_era: { price: 20.89, neighborhood: "Torquato Tapajós" },
        baratao: { price: 21.30, neighborhood: "Betânia" },
        db: { price: 22.50, neighborhood: "Adrianópolis" },
        carrefour: { price: 23.90, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "cafe_marata_250g",
      name: "Café Torrado e Moído Maratá Tradicional 250g",
      brand: "Maratá (Super Acessível)",
      unit: "250g",
      category: "Matinais & Laticínios",
      icon: "☕",
      prices: {
        baratao: { price: 6.99, neighborhood: "Betânia" },
        atacadao: { price: 7.19, neighborhood: "Camapuã" },
        nova_era: { price: 7.39, neighborhood: "Torquato Tapajós" },
        assai: { price: 7.49, neighborhood: "Autaz Mirim" },
        db: { price: 8.29, neighborhood: "Adrianópolis" },
        carrefour: { price: 8.90, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "cafe_caboclo_500g",
      name: "Café Torrado e Moído Caboclo Tradicional 500g",
      brand: "Caboclo (Econômico)",
      unit: "500g",
      category: "Matinais & Laticínios",
      icon: "☕",
      prices: {
        atacadao: { price: 14.90, neighborhood: "Camapuã" },
        nova_era: { price: 15.49, neighborhood: "Flores" },
        assai: { price: 15.80, neighborhood: "Autaz Mirim" },
        baratao: { price: 15.99, neighborhood: "Betânia" },
        db: { price: 16.90, neighborhood: "Adrianópolis" },
        carrefour: { price: 17.80, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "arroz_camil_5kg",
      name: "Arroz Branco Tipo 1 Camil 5kg",
      brand: "Camil (Líder)",
      unit: "5kg",
      category: "Cesta Básica",
      icon: "🌾",
      prices: {
        assai: { price: 25.90, neighborhood: "Autaz Mirim" },
        atacadao: { price: 26.49, neighborhood: "Camapuã" },
        nova_era: { price: 26.90, neighborhood: "Flores" },
        baratao: { price: 27.20, neighborhood: "Betânia" },
        db: { price: 28.50, neighborhood: "Adrianópolis" },
        carrefour: { price: 29.90, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "arroz_emocoes_5kg",
      name: "Arroz Branco Tipo 1 Emoções 5kg",
      brand: "Emoções (Acessível)",
      unit: "5kg",
      category: "Cesta Básica",
      icon: "🌾",
      prices: {
        nova_era: { price: 22.89, neighborhood: "Torquato Tapajós" },
        atacadao: { price: 23.29, neighborhood: "Camapuã" },
        assai: { price: 23.49, neighborhood: "Autaz Mirim" },
        baratao: { price: 23.80, neighborhood: "Betânia" },
        db: { price: 24.90, neighborhood: "Adrianópolis" },
        carrefour: { price: 25.90, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "arroz_sepe_5kg",
      name: "Arroz Branco Subtipo Polido Sepé 5kg",
      brand: "Sepé (Econômico)",
      unit: "5kg",
      category: "Cesta Básica",
      icon: "🌾",
      prices: {
        baratao: { price: 20.90, neighborhood: "Betânia" },
        atacadao: { price: 21.49, neighborhood: "Camapuã" },
        nova_era: { price: 21.90, neighborhood: "Flores" },
        assai: { price: 21.99, neighborhood: "Autaz Mirim" },
        db: { price: 23.50, neighborhood: "Adrianópolis" },
        carrefour: { price: 24.50, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "feijao_tio_jorge_1kg",
      name: "Feijão Carioca Tipo 1 Tio Jorge 1kg",
      brand: "Tio Jorge (Acessível)",
      unit: "1kg",
      category: "Cesta Básica",
      icon: "🌾",
      prices: {
        atacadao: { price: 5.89, neighborhood: "Camapuã" },
        assai: { price: 5.99, neighborhood: "Autaz Mirim" },
        nova_era: { price: 6.19, neighborhood: "Torquato Tapajós" },
        baratao: { price: 6.29, neighborhood: "Betânia" },
        db: { price: 6.89, neighborhood: "Adrianópolis" },
        carrefour: { price: 7.49, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "leite_piracanjuba_400g",
      name: "Leite em Pó Integral Piracanjuba Sachê 400g",
      brand: "Piracanjuba (Acessível)",
      unit: "400g",
      category: "Matinais & Laticínios",
      icon: "🥛",
      prices: {
        atacadao: { price: 12.89, neighborhood: "Camapuã" },
        assai: { price: 13.19, neighborhood: "Autaz Mirim" },
        nova_era: { price: 13.49, neighborhood: "Torquato Tapajós" },
        baratao: { price: 13.80, neighborhood: "Betânia" },
        db: { price: 14.90, neighborhood: "Adrianópolis" },
        carrefour: { price: 15.80, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "oleo_liza_900ml",
      name: "Óleo de Soja Refinado Liza 900ml",
      brand: "Liza (Líder)",
      unit: "900ml",
      category: "Cesta Básica",
      icon: "🌻",
      prices: {
        nova_era: { price: 6.49, neighborhood: "Torquato Tapajós" },
        atacadao: { price: 6.59, neighborhood: "Camapuã" },
        assai: { price: 6.69, neighborhood: "Autaz Mirim" },
        baratao: { price: 6.79, neighborhood: "Betânia" },
        db: { price: 6.99, neighborhood: "Adrianópolis" },
        carrefour: { price: 7.49, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "sabao_tixan_16kg",
      name: "Lava Roupas em Pó Tixan Ypê Primavera 1.6kg",
      brand: "Tixan Ypê (Acessível)",
      unit: "1.6kg",
      category: "Limpeza & Higiene",
      icon: "🧼",
      prices: {
        atacadao: { price: 14.89, neighborhood: "Camapuã" },
        assai: { price: 15.29, neighborhood: "Autaz Mirim" },
        nova_era: { price: 15.69, neighborhood: "Flores" },
        baratao: { price: 15.99, neighborhood: "Betânia" },
        db: { price: 17.50, neighborhood: "Adrianópolis" },
        carrefour: { price: 18.90, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "detergente_limpol_500ml",
      name: "Detergente Lava-Louças Limpol Neutro 500ml",
      brand: "Limpol Bombril (Tradicional)",
      unit: "500ml",
      category: "Limpeza & Higiene",
      icon: "🧽",
      prices: {
        atacadao: { price: 1.99, neighborhood: "Camapuã" },
        assai: { price: 2.09, neighborhood: "Autaz Mirim" },
        nova_era: { price: 2.19, neighborhood: "Torquato Tapajós" },
        baratao: { price: 2.25, neighborhood: "Betânia" },
        db: { price: 2.59, neighborhood: "Adrianópolis" },
        carrefour: { price: 2.79, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "creme_sorriso_90g",
      name: "Creme Dental Sorriso Dentes Brancos 90g",
      brand: "Sorriso (Acessível)",
      unit: "90g",
      category: "Higiene & Drogaria",
      icon: "🪥",
      prices: {
        baratao: { price: 2.49, neighborhood: "Betânia" },
        atacadao: { price: 2.65, neighborhood: "Camapuã" },
        assai: { price: 2.75, neighborhood: "Autaz Mirim" },
        nova_era: { price: 2.89, neighborhood: "Torquato Tapajós" },
        db: { price: 3.19, neighborhood: "Adrianópolis" },
        carrefour: { price: 3.49, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "sabonete_palmolive_85g",
      name: "Sabonete em Barra Palmolive Naturais 85g",
      brand: "Palmolive (Acessível)",
      unit: "85g",
      category: "Higiene & Drogaria",
      icon: "🧼",
      prices: {
        atacadao: { price: 1.99, neighborhood: "Camapuã" },
        nova_era: { price: 2.19, neighborhood: "Flores" },
        assai: { price: 2.25, neighborhood: "Autaz Mirim" },
        baratao: { price: 2.30, neighborhood: "Betânia" },
        db: { price: 2.59, neighborhood: "Adrianópolis" },
        carrefour: { price: 2.89, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "fralda_babysec_g_38",
      name: "Fralda Descartável Babysec Galinha Pintadinha G 38un",
      brand: "Babysec (Custo-Benefício)",
      unit: "38un",
      category: "Bebê & Infantil",
      icon: "👶",
      prices: {
        atacadao: { price: 36.90, neighborhood: "Camapuã" },
        nova_era: { price: 38.50, neighborhood: "Torquato Tapajós" },
        assai: { price: 38.90, neighborhood: "Autaz Mirim" },
        baratao: { price: 39.90, neighborhood: "Betânia" },
        db: { price: 42.90, neighborhood: "Adrianópolis" },
        carrefour: { price: 45.90, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "racao_champ_3kg",
      name: "Ração Econômica para Cães Adultos Carne 3kg",
      brand: "Champ / Kanina (Econômica)",
      unit: "3kg",
      category: "Pets & Animais",
      icon: "🐶",
      prices: {
        baratao: { price: 22.90, neighborhood: "Betânia" },
        atacadao: { price: 23.49, neighborhood: "Camapuã" },
        nova_era: { price: 24.20, neighborhood: "Flores" },
        assai: { price: 24.50, neighborhood: "Autaz Mirim" },
        db: { price: 26.90, neighborhood: "Adrianópolis" },
        carrefour: { price: 28.50, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "pirarucu_fresco_kg",
      ean: "7890000000029",
      name: "Filé de Pirarucu Fresco em Postas kg",
      brand: "Pescados da Amazônia",
      unit: "kg",
      category: "Carnes & Peixes Regionais",
      icon: "🐟",
      isRegional: true,
      history: [38.90, 36.50, 34.90, 31.90],
      prices: {
        baratao: { price: 31.90, neighborhood: "Betânia" },
        nova_era: { price: 33.50, neighborhood: "Torquato Tapajós" },
        atacadao: { price: 34.90, neighborhood: "Camapuã" },
        assai: { price: 35.80, neighborhood: "Autaz Mirim" },
        db: { price: 39.90, neighborhood: "Adrianópolis" },
        carrefour: { price: 42.90, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "tucupi_temperado_1l",
      ean: "7890000000036",
      name: "Tucupi Amarelo Temperado com Chicória 1L",
      brand: "Sabor do Norte AM",
      unit: "1L",
      category: "Especiarias & Temperos",
      icon: "🍲",
      isRegional: true,
      history: [11.50, 10.90, 9.80, 8.90],
      prices: {
        baratao: { price: 8.90, neighborhood: "Betânia" },
        nova_era: { price: 9.49, neighborhood: "Flores" },
        atacadao: { price: 9.90, neighborhood: "Camapuã" },
        assai: { price: 10.20, neighborhood: "Autaz Mirim" },
        db: { price: 11.50, neighborhood: "Adrianópolis" },
        carrefour: { price: 12.90, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "acai_polpa_1l",
      ean: "7890000000043",
      name: "Polpa de Açaí Médio da Amazônia 1L",
      brand: "Norte Puro",
      unit: "1L",
      category: "Hortifruti & Manaus",
      icon: "🫐",
      isRegional: true,
      history: [18.00, 16.90, 15.50, 14.50],
      prices: {
        baratao: { price: 14.50, neighborhood: "Betânia" },
        nova_era: { price: 14.90, neighborhood: "Torquato Tapajós" },
        atacadao: { price: 15.20, neighborhood: "Camapuã" },
        assai: { price: 15.50, neighborhood: "Autaz Mirim" },
        db: { price: 16.90, neighborhood: "Adrianópolis" },
        carrefour: { price: 17.90, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "cupuacu_polpa_1kg",
      ean: "7890000000050",
      name: "Polpa de Cupuaçu Pura Congelada 1kg",
      brand: "Frutas de Manaus",
      unit: "1kg",
      category: "Hortifruti & Manaus",
      icon: "🥥",
      isRegional: true,
      history: [16.50, 15.90, 14.80, 13.90],
      prices: {
        nova_era: { price: 13.90, neighborhood: "Flores" },
        baratao: { price: 14.20, neighborhood: "Betânia" },
        atacadao: { price: 14.50, neighborhood: "Cidade Nova" },
        assai: { price: 14.80, neighborhood: "Autaz Mirim" },
        db: { price: 16.20, neighborhood: "Adrianópolis" },
        carrefour: { price: 17.50, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "queijo_mussarela_validade",
      ean: "7891234567890",
      name: "Queijo Mussarela Fatiado 200g (Validade 3 dias)",
      brand: "Laticínios Vale",
      unit: "200g",
      category: "Matinais & Laticínios",
      icon: "🧀",
      isNearExpiry: true,
      expiryDays: 3,
      expiryDiscount: 47,
      history: [12.90, 12.90, 11.90, 6.90],
      prices: {
        nova_era: { price: 6.90, neighborhood: "Torquato Tapajós" },
        atacadao: { price: 7.20, neighborhood: "Camapuã" },
        assai: { price: 7.49, neighborhood: "Autaz Mirim" },
        db: { price: 8.50, neighborhood: "Adrianópolis" },
        baratao: { price: 7.90, neighborhood: "Betânia" },
        carrefour: { price: 9.20, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "iogurte_grego_validade",
      ean: "7891234567891",
      name: "Iogurte Grego Tradicional Pote 400g (Validade 2 dias)",
      brand: "Vigor / Danone",
      unit: "400g",
      category: "Matinais & Laticínios",
      icon: "🍶",
      isNearExpiry: true,
      expiryDays: 2,
      expiryDiscount: 50,
      history: [9.50, 9.50, 8.90, 4.75],
      prices: {
        atacadao: { price: 4.75, neighborhood: "Camapuã" },
        assai: { price: 4.90, neighborhood: "Autaz Mirim" },
        nova_era: { price: 5.10, neighborhood: "Flores" },
        baratao: { price: 5.25, neighborhood: "Betânia" },
        db: { price: 5.90, neighborhood: "Adrianópolis" },
        carrefour: { price: 6.40, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "carne_moida_validade",
      ean: "7891234567892",
      name: "Carne Moída Patinho Bandeja 500g (Validade Amanhã)",
      brand: "Friboi / Seleção",
      unit: "500g",
      category: "Carnes & Peixes Regionais",
      icon: "🥩",
      isNearExpiry: true,
      expiryDays: 1,
      expiryDiscount: 42,
      history: [19.90, 19.90, 18.50, 11.50],
      prices: {
        baratao: { price: 11.50, neighborhood: "Betânia" },
        nova_era: { price: 12.20, neighborhood: "Torquato Tapajós" },
        atacadao: { price: 12.50, neighborhood: "Camapuã" },
        assai: { price: 12.90, neighborhood: "Autaz Mirim" },
        db: { price: 13.90, neighborhood: "Adrianópolis" },
        carrefour: { price: 14.50, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "acucar_uniao_1kg",
      ean: "7891000100701",
      name: "Açúcar Refinado Tradicional 1kg",
      brand: "União",
      unit: "1kg",
      category: "Cesta Básica",
      icon: "🌾",
      history: [5.20, 5.10, 4.90, 4.69],
      prices: {
        atacadao: { price: 4.69, neighborhood: "Camapuã" },
        nova_era: { price: 4.79, neighborhood: "Torquato Tapajós" },
        assai: { price: 4.85, neighborhood: "Autaz Mirim" },
        baratao: { price: 4.95, neighborhood: "Betânia" },
        db: { price: 5.29, neighborhood: "Adrianópolis" },
        carrefour: { price: 5.49, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "manteiga_aviacao_200g",
      ean: "7891000100702",
      name: "Manteiga de Primeira Qualidade com Sal 200g",
      brand: "Aviação / Itambé",
      unit: "200g",
      category: "Matinais & Laticínios",
      icon: "🧈",
      history: [13.90, 13.50, 12.90, 11.89],
      prices: {
        atacadao: { price: 11.89, neighborhood: "Cidade Nova" },
        nova_era: { price: 12.20, neighborhood: "Flores" },
        assai: { price: 12.49, neighborhood: "Autaz Mirim" },
        baratao: { price: 12.80, neighborhood: "Betânia" },
        db: { price: 13.90, neighborhood: "Adrianópolis" },
        carrefour: { price: 14.50, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "pao_frances_kg",
      ean: "7891000100703",
      name: "Pão Francês Tradicional Quentinho kg",
      brand: "Padaria da Rede",
      unit: "kg",
      category: "Cesta Básica",
      icon: "🥖",
      history: [16.90, 16.50, 15.90, 14.90],
      prices: {
        baratao: { price: 14.90, neighborhood: "Betânia" },
        nova_era: { price: 15.50, neighborhood: "Torquato Tapajós" },
        atacadao: { price: 15.80, neighborhood: "Camapuã" },
        assai: { price: 15.90, neighborhood: "Autaz Mirim" },
        db: { price: 16.90, neighborhood: "Adrianópolis" },
        carrefour: { price: 17.50, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "tomate_regional_kg",
      ean: "7891000100704",
      name: "Tomate Longa Vida / Regional Selecionado kg",
      brand: "Hortifruti AM",
      unit: "kg",
      category: "Hortifruti & Manaus",
      icon: "🍅",
      isRegional: true,
      history: [8.90, 8.50, 7.90, 6.49],
      prices: {
        nova_era: { price: 6.49, neighborhood: "Flores" },
        baratao: { price: 6.89, neighborhood: "Betânia" },
        atacadao: { price: 6.99, neighborhood: "Camapuã" },
        assai: { price: 7.20, neighborhood: "Autaz Mirim" },
        db: { price: 7.90, neighborhood: "Adrianópolis" },
        carrefour: { price: 8.50, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "jaraqui_fresco_kg",
      ean: "7890000000060",
      name: "Peixe Jaraqui Fresco Inteiro Tratado kg",
      brand: "Pescados do Amazonas",
      unit: "kg",
      category: "Carnes & Peixes Regionais",
      icon: "🐟",
      isRegional: true,
      history: [14.00, 13.50, 12.00, 9.99],
      prices: {
        baratao: { price: 9.99, neighborhood: "Betânia" },
        nova_era: { price: 10.89, neighborhood: "Torquato Tapajós" },
        atacadao: { price: 11.20, neighborhood: "Camapuã" },
        assai: { price: 11.50, neighborhood: "Autaz Mirim" },
        db: { price: 12.90, neighborhood: "Adrianópolis" },
        carrefour: { price: 13.50, neighborhood: "Adrianópolis" }
      }
    },
    {
      id: "castanha_brasil_250g",
      ean: "7890000000070",
      name: "Castanha-do-Brasil (Pará) Sem Casca 250g",
      brand: "Sabor da Amazônia",
      unit: "250g",
      category: "Hortifruti & Manaus",
      icon: "🌰",
      isRegional: true,
      history: [25.00, 24.50, 23.00, 21.90],
      prices: {
        nova_era: { price: 21.90, neighborhood: "Torquato Tapajós" },
        baratao: { price: 22.50, neighborhood: "Betânia" },
        atacadao: { price: 22.90, neighborhood: "Camapuã" },
        assai: { price: 23.20, neighborhood: "Autaz Mirim" },
        db: { price: 25.90, neighborhood: "Adrianópolis" },
        carrefour: { price: 27.50, neighborhood: "Adrianópolis" }
      }
    }
  ];

  // Garante EAN e histórico determinístico de 6 semanas para todos os produtos
  PRODUCTS.forEach((prod, i) => {
    if (!prod.ean) {
      prod.ean = KNOWN_EANS[prod.id] || ("789" + String(1000000000 + i).slice(1));
    }
    if (!prod.history) {
      const prices = Object.values(prod.prices).map(p => p.price);
      const cur = Math.min(...prices);
      const worst = Math.max(...prices);
      const savingsPercent = Math.round(((worst - cur) / worst) * 100);
      const isDiscount = prod.isNearExpiry || savingsPercent >= 15;
      const base = isDiscount ? cur * 1.25 : cur * 1.05;
      prod.history = [
        parseFloat((base * 1.02).toFixed(2)),
        parseFloat((base * 0.98).toFixed(2)),
        parseFloat((base * 1.04).toFixed(2)),
        parseFloat((base * 1.01).toFixed(2)),
        parseFloat((base * 1.08).toFixed(2)),
        cur
      ];
    }
  });

  const FLYERS = [
    {
      id: "flyer_db",
      storeKey: "db",
      store: "DB Supermercados",
      color: "#D32F2F",
      title: "Festival da Quarta & Quinta Verde",
      validity: "Ofertas da Semana Ativas",
      tags: ["Banana Pacovã R$ 4,99", "Tomate Regional", "Frutas Frescas"]
    },
    {
      id: "flyer_nova_era",
      storeKey: "nova_era",
      store: "Nova Era Superatacado",
      color: "#F57C00",
      title: "Giro de Ofertas Atacado & Varejo",
      validity: "Ofertas da Semana Ativas",
      tags: ["Arroz 5kg Barato", "Farinha Uarini R$ 12,90", "Cervejas & Bebidas"]
    },
    {
      id: "flyer_baratao",
      storeKey: "baratao",
      store: "Baratão da Carne",
      color: "#C2185B",
      title: "Quinta & Sexta do Açougue Manaus",
      validity: "Ofertas da Semana Ativas",
      tags: ["Tambaqui R$ 14,99", "Picanha Friboi R$ 54,90", "Costela Bovina"]
    },
    {
      id: "flyer_atacadao",
      storeKey: "atacadao",
      store: "Atacadão Manaus",
      color: "#FBC02D",
      title: "Semana dos Campeões de Preço",
      validity: "Ofertas da Semana Ativas",
      tags: ["Óleo de Soja R$ 5,89", "Leite Ninho R$ 15,79", "Cesta Econômica"]
    },
    {
      id: "flyer_assai",
      storeKey: "assai",
      store: "Assaí Atacadista",
      color: "#1976D2",
      title: "Festival do Comerciante & Família",
      validity: "Ofertas da Semana Ativas",
      tags: ["Detergente Ypê R$ 2,19", "Amaciante Downy R$ 8,90", "Papel Neve 12un"]
    }
  ];

  const DIEESE_12_ITEMS = [
    { id: "alcatra_bovina_kg", name: "Carne Bovina de Primeira (6kg)", qty: 6.0, unit: "kg" },
    { id: "leite_ninho_380g", name: "Leite em Pó Integral (7.5L equiv.)", qty: 7.5, unit: "L" },
    { id: "feijao_kicaldo_1kg", name: "Feijão Carioca Tipo 1 (4.5kg)", qty: 4.5, unit: "kg" },
    { id: "arroz_tio_joao_5kg", name: "Arroz Agulhinha Tipo 1 (3kg)", qty: 0.6, unit: "pct 5kg" },
    { id: "farinha_uarini_1kg", name: "Farinha de Mandioca Uarini AM (3kg)", qty: 3.0, unit: "kg" },
    { id: "tomate_regional_kg", name: "Tomate Regional Manaus (9kg)", qty: 9.0, unit: "kg" },
    { id: "pao_frances_kg", name: "Pão Francês Tradicional (6kg)", qty: 6.0, unit: "kg" },
    { id: "cafe_santa_clara_500g", name: "Café Torrado e Moído (600g)", qty: 1.2, unit: "pct 500g" },
    { id: "banana_pacova_kg", name: "Banana Pacovã Selecionada (7.5kg)", qty: 7.5, unit: "kg" },
    { id: "acucar_uniao_1kg", name: "Açúcar Refinado Tradicional (3kg)", qty: 3.0, unit: "kg" },
    { id: "oleo_soja_900ml", name: "Óleo de Soja 900ml (750ml equiv.)", qty: 0.83, unit: "garrafa" },
    { id: "manteiga_aviacao_200g", name: "Manteiga de Primeira (750g)", qty: 3.75, unit: "pote 200g" }
  ];

  const DEFAULT_CONTRIBUTIONS = [
    {
      id: 1,
      user: "Marcio Amazonas",
      badge: "🥇",
      productId: "tambaqui_fresco_kg",
      productName: "Tambaqui Fresco Inteiro kg",
      storeKey: "baratao",
      storeName: "Baratão da Carne (Betânia)",
      oldPrice: 16.90,
      newPrice: 14.99,
      photoUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=120&auto=format&fit=crop&q=60",
      time: "há 25 min",
      source: "Etiqueta Auditada",
      verified: true
    },
    {
      id: 2,
      user: "Ana Paula Silva",
      badge: "🥈",
      productId: "cafe_pilao_500g",
      productName: "Café Pilão Tradicional 500g",
      storeKey: "atacadao",
      storeName: "Atacadão (Camapuã)",
      oldPrice: 20.90,
      newPrice: 18.89,
      photoUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=120&auto=format&fit=crop&q=60",
      time: "há 1 hora",
      source: "NFC-e SEFAZ-AM",
      verified: true
    },
    {
      id: 3,
      user: "Lucas Pantoja",
      badge: "🥈",
      productId: "farinha_uarini_1kg",
      productName: "Farinha do Uarini Ovinha 1kg",
      storeKey: "nova_era",
      storeName: "Nova Era Superatacado (Flores)",
      oldPrice: 14.50,
      newPrice: 12.90,
      photoUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=120&auto=format&fit=crop&q=60",
      time: "há 3 horas",
      source: "Etiqueta Auditada",
      verified: true
    }
  ];

  // ============================================================================
  // MULTI-CIDADES BRASIL (5 REGIÕES + PEQUENO, MÉDIO E GRANDE PORTE)
  // ============================================================================
  const CITIES_CONFIG = {"manaus":{"id":"manaus","name":"Manaus - AM","shortName":"Manaus","region":"Norte","uf":"AM","ibgePrefix":"13","sefazName":"SEFAZ-AM","sefazDomain":"sefaz.am.gov.br","heroBadge":"🇧🇷 AM-Manaus • Os 15 Maiores Supermercados de Manaus","heroTitle":"Economize nos Mercados de Manaus - AM","heroSubtitle":"Cotações em 15 redes de Manaus: DB Supermercados, Nova Era Superatacado, Atacadão, Assaí Atacadista, Baratão da Carne, Carrefour e mais 9 redes.","priceMultiplier":1,"supermarkets":{"db":{"id":"db-supermercados","name":"DB Supermercados","color":"#D32F2F","unit":"DB Supermercados (Hipermercado)","lat":-3.0962,"lng":-60.0065,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/db-supermercados.svg"},"nova_era":{"id":"nova-era","name":"Nova Era Superatacado","color":"#F57C00","unit":"Nova Era Superatacado (Atacarejo)","lat":-3.1262,"lng":-60.0095,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/nova-era.svg"},"atacadao":{"id":"atacadao","name":"Atacadão","color":"#2E7D32","unit":"Atacadão (Atacarejo)","lat":-3.0632,"lng":-59.9845,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao.svg"},"assai":{"id":"assai","name":"Assaí Atacadista","color":"#1976D2","unit":"Assaí Atacadista (Atacarejo)","lat":-3.0832,"lng":-59.9665,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/assai.svg"},"baratao":{"id":"baratao-da-carne","name":"Baratão da Carne","color":"#C62828","unit":"Baratão da Carne (Supermercado)","lat":-3.1302,"lng":-60.0025,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/baratao-da-carne.svg"},"carrefour":{"id":"carrefour","name":"Carrefour","color":"#0D47A1","unit":"Carrefour (Hipermercado)","lat":-3.1082,"lng":-60.0145,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/carrefour.svg"},"mercadinho_bairro":{"id":"supermercados-rodrigues","name":"Supermercados Rodrigues","color":"#1565C0","unit":"Supermercados Rodrigues (Supermercado)","lat":-3.1402,"lng":-60.0595,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercados-rodrigues.svg"},"sacolao_feira":{"id":"supermercado-coari","name":"Supermercado Coari","color":"#2E7D32","unit":"Supermercado Coari (Supermercado)","lat":-3.0932,"lng":-60.0365,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-coari.svg"},"m9":{"id":"supermercado-veneza-am","name":"Supermercado Veneza","color":"#AD1457","unit":"Supermercado Veneza (Supermercado)","lat":-3.1182,"lng":-59.9865,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-veneza-am.svg"},"m10":{"id":"supermercado-vitoria-am","name":"Supermercados Vitória","color":"#EF6C00","unit":"Supermercados Vitória (Supermercado)","lat":-3.0882,"lng":-60.0295,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-vitoria-am.svg"},"m11":{"id":"emporio-db","name":"Empório DB","color":"#B71C1C","unit":"Empório DB (Premium)","lat":-3.1332,"lng":-59.9925,"tier":"medio","tipo":"premium","tierLabel":"Premium","logo":"web/assets/logos/emporio-db.svg"},"m12":{"id":"mania-supermercados","name":"Mania Supermercados","color":"#00838F","unit":"Mania Supermercados (Supermercado)","lat":-3.0772,"lng":-60.0325,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/mania-supermercados.svg"},"m13":{"id":"supermercado-bom-preco-am","name":"Bom Preço Manaus","color":"#283593","unit":"Bom Preço Manaus (Proximidade / Bairro)","lat":-3.1222,"lng":-60.0335,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/supermercado-bom-preco-am.svg"},"m14":{"id":"mercadinho-sao-jorge","name":"Mercadinho São Jorge","color":"#00695C","unit":"Mercadinho São Jorge (Proximidade / Bairro)","lat":-3.1032,"lng":-60.0105,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-sao-jorge.svg"},"m15":{"id":"feira-manaus-moderna","name":"Feira da Manaus Moderna","color":"#33691E","unit":"Feira da Manaus Moderna (Hortifruti & Feira)","lat":-3.1142,"lng":-60.0075,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/feira-manaus-moderna.svg"}},"neighborhoods":[{"key":"adrianopolis","name":"Adrianópolis","lat":-3.1082,"lng":-60.0145},{"key":"flores","name":"Flores / Parque 10","lat":-3.1352,"lng":-60.0172},{"key":"cidade_nova","name":"Cidade Nova","lat":-3.0785,"lng":-59.9947},{"key":"autaz_mirim","name":"Zona Leste (Autaz Mirim)","lat":-3.0965,"lng":-59.9785},{"key":"betania","name":"Betânia / Zona Sul","lat":-3.1388,"lng":-60.0109},{"key":"centro","name":"Centro Histórico","lat":-3.119,"lng":-60.0217},{"key":"ponta_negra","name":"Ponta Negra","lat":-3.1478,"lng":-60.0622},{"key":"alvorada","name":"Alvorada / Dom Pedro","lat":-3.1055,"lng":-60.0415},{"key":"coroado","name":"Coroado / Aleixo","lat":-3.128,"lng":-59.9965}],"canonicalKey":"AM-Manaus"},"boa_vista":{"id":"boa_vista","name":"Boa Vista - RR","shortName":"Boa Vista","region":"Norte","uf":"RR","ibgePrefix":"14","sefazName":"SEFAZ-RR","sefazDomain":"sefaz.rr.gov.br","heroBadge":"🇧🇷 RR-BoaVista • Os 15 Maiores Supermercados de Boa Vista","heroTitle":"Economize nos Mercados de Boa Vista - RR","heroSubtitle":"Cotações em 15 redes de Boa Vista: Hiper DB Boa Vista, Supermercado Gavião, Atacadão, Assaí Atacadista, Supermercado Goiana, Supermercado Novo Tempo e mais 9 redes.","priceMultiplier":1.04,"supermarkets":{"db":{"id":"db-supermercados","name":"Hiper DB Boa Vista","color":"#D32F2F","unit":"Hiper DB Boa Vista (Hipermercado)","lat":2.8463,"lng":-60.6606,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/db-supermercados.svg"},"nova_era":{"id":"supermercado-gaviao","name":"Supermercado Gavião","color":"#00695C","unit":"Supermercado Gavião (Supermercado)","lat":2.8163,"lng":-60.6636,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-gaviao.svg"},"atacadao":{"id":"atacadao","name":"Atacadão","color":"#2E7D32","unit":"Atacadão (Atacarejo)","lat":2.8793,"lng":-60.6386,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao.svg"},"assai":{"id":"assai","name":"Assaí Atacadista","color":"#1976D2","unit":"Assaí Atacadista (Atacarejo)","lat":2.8593,"lng":-60.6206,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/assai.svg"},"baratao":{"id":"supermercado-goiana","name":"Supermercado Goiana","color":"#2E7D32","unit":"Supermercado Goiana (Supermercado)","lat":2.8123,"lng":-60.6566,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-goiana.svg"},"carrefour":{"id":"novo-tempo","name":"Supermercado Novo Tempo","color":"#283593","unit":"Supermercado Novo Tempo (Supermercado)","lat":2.8343,"lng":-60.6686,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/novo-tempo.svg"},"mercadinho_bairro":{"id":"supermercado-sao-jorge-rr","name":"Supermercado São Jorge RR","color":"#C62828","unit":"Supermercado São Jorge RR (Supermercado)","lat":2.8023,"lng":-60.7136,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-sao-jorge-rr.svg"},"sacolao_feira":{"id":"supermercado-pato-branco","name":"Supermercado Pato Branco","color":"#1565C0","unit":"Supermercado Pato Branco (Supermercado)","lat":2.8493,"lng":-60.6906,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-pato-branco.svg"},"m9":{"id":"supermercado-progresso-rr","name":"Supermercado Progresso","color":"#EF6C00","unit":"Supermercado Progresso (Supermercado)","lat":2.8243,"lng":-60.6406,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-progresso-rr.svg"},"m10":{"id":"atacadao-bandeirantes","name":"Atacadão Bandeirantes RR","color":"#00838F","unit":"Atacadão Bandeirantes RR (Atacarejo)","lat":2.8543,"lng":-60.6836,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao-bandeirantes.svg"},"m11":{"id":"supermercado-bom-jesus-rr","name":"Supermercado Bom Jesus","color":"#6A1B9A","unit":"Supermercado Bom Jesus (Proximidade / Bairro)","lat":2.8093,"lng":-60.6466,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/supermercado-bom-jesus-rr.svg"},"m12":{"id":"supermercado-uniao-rr","name":"Supermercado União BV","color":"#4E342E","unit":"Supermercado União BV (Proximidade / Bairro)","lat":2.8653,"lng":-60.6866,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/supermercado-uniao-rr.svg"},"m13":{"id":"minimercado-paraviana","name":"Mercadinho Paraviana","color":"#00695C","unit":"Mercadinho Paraviana (Proximidade / Bairro)","lat":2.8203,"lng":-60.6876,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/minimercado-paraviana.svg"},"m14":{"id":"mercadinho-boa-compra","name":"Mercadinho Boa Compra","color":"#00796B","unit":"Mercadinho Boa Compra (Proximidade / Bairro)","lat":2.8393,"lng":-60.6646,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-boa-compra.svg"},"m15":{"id":"feira-do-produtor-rr","name":"Feira do Produtor de Roraima","color":"#33691E","unit":"Feira do Produtor de Roraima (Hortifruti & Feira)","lat":2.8283,"lng":-60.6616,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/feira-do-produtor-rr.svg"}},"neighborhoods":[{"key":"adrianopolis","name":"Paraviana / Caçari","lat":2.8343,"lng":-60.6686},{"key":"flores","name":"Centro Cívico BV","lat":2.8073,"lng":-60.6713},{"key":"cidade_nova","name":"Cidade Satélite","lat":2.864,"lng":-60.6488},{"key":"autaz_mirim","name":"Pricumã / São Vicente","lat":2.846,"lng":-60.6326},{"key":"betania","name":"Mecejana / Aparecida","lat":2.8037,"lng":-60.665},{"key":"centro","name":"São Francisco","lat":2.8235,"lng":-60.6758},{"key":"ponta_negra","name":"Buritis / Cinturão Verde","lat":2.7947,"lng":-60.7163},{"key":"alvorada","name":"Asa Branca / Caimbé","lat":2.837,"lng":-60.6956},{"key":"coroado","name":"Senador Hélio Campos","lat":2.8145,"lng":-60.6506}],"canonicalKey":"RR-BoaVista"},"belem":{"id":"belem","name":"Belém - PA","shortName":"Belém","region":"Norte","uf":"PA","ibgePrefix":"15","sefazName":"SEFAZ-PA","sefazDomain":"sefaz.pa.gov.br","heroBadge":"🇧🇷 PA-Belem • Os 15 Maiores Supermercados de Belém","heroTitle":"Economize nos Mercados de Belém - PA","heroSubtitle":"Cotações em 15 redes de Belém: Supermercados Líder, Mix Mateus, Supermercado Formosa, Atacadão, Assaí Atacadista, Supermercado Preço Baixo e mais 9 redes.","priceMultiplier":0.98,"supermarkets":{"db":{"id":"supermercados-lider","name":"Supermercados Líder","color":"#D32F2F","unit":"Supermercados Líder (Hipermercado)","lat":-1.433,"lng":-48.475,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/supermercados-lider.svg"},"nova_era":{"id":"mix-mateus","name":"Mix Mateus","color":"#0D47A1","unit":"Mix Mateus (Atacarejo)","lat":-1.463,"lng":-48.478,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/mix-mateus.svg"},"atacadao":{"id":"supermercado-formosa","name":"Supermercado Formosa","color":"#C2185B","unit":"Supermercado Formosa (Hipermercado)","lat":-1.4,"lng":-48.453,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/supermercado-formosa.svg"},"assai":{"id":"atacadao","name":"Atacadão","color":"#2E7D32","unit":"Atacadão (Atacarejo)","lat":-1.42,"lng":-48.435,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao.svg"},"baratao":{"id":"assai","name":"Assaí Atacadista","color":"#1976D2","unit":"Assaí Atacadista (Atacarejo)","lat":-1.467,"lng":-48.471,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/assai.svg"},"carrefour":{"id":"preco-baixo-pa","name":"Supermercado Preço Baixo","color":"#283593","unit":"Supermercado Preço Baixo (Supermercado)","lat":-1.445,"lng":-48.483,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/preco-baixo-pa.svg"},"mercadinho_bairro":{"id":"supermercado-cidade-pa","name":"Supermercado Cidade","color":"#EF6C00","unit":"Supermercado Cidade (Supermercado)","lat":-1.477,"lng":-48.528,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-cidade-pa.svg"},"sacolao_feira":{"id":"supermercado--mateus-pa","name":"Supermercado Mateus","color":"#1565C0","unit":"Supermercado Mateus (Supermercado)","lat":-1.43,"lng":-48.505,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado--mateus-pa.svg"},"m9":{"id":"economico-belem","name":"Econômico Supermercados","color":"#00838F","unit":"Econômico Supermercados (Supermercado)","lat":-1.455,"lng":-48.455,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/economico-belem.svg"},"m10":{"id":"supermercado-elos","name":"Supermercado Elos","color":"#2E7D32","unit":"Supermercado Elos (Supermercado)","lat":-1.425,"lng":-48.498,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-elos.svg"},"m11":{"id":"supermercado-belem","name":"Belém Supermercados","color":"#6A1B9A","unit":"Belém Supermercados (Supermercado)","lat":-1.47,"lng":-48.461,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-belem.svg"},"m12":{"id":"lider-quick","name":"Líder Quick","color":"#B71C1C","unit":"Líder Quick (Proximidade / Bairro)","lat":-1.414,"lng":-48.501,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/lider-quick.svg"},"m13":{"id":"mercadinho-nazare","name":"Mercadinho Nazaré","color":"#00695C","unit":"Mercadinho Nazaré (Proximidade / Bairro)","lat":-1.459,"lng":-48.502,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-nazare.svg"},"m14":{"id":"sacolao-pedreira","name":"Sacolão da Pedreira","color":"#558B2F","unit":"Sacolão da Pedreira (Hortifruti & Feira)","lat":-1.44,"lng":-48.479,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/sacolao-pedreira.svg"},"m15":{"id":"feira-ver-o-peso","name":"Feira do Ver-o-Peso","color":"#33691E","unit":"Feira do Ver-o-Peso (Hortifruti & Feira)","lat":-1.451,"lng":-48.476,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/feira-ver-o-peso.svg"}},"neighborhoods":[{"key":"adrianopolis","name":"Nazaré / Umarizal","lat":-1.445,"lng":-48.483},{"key":"flores","name":"Marco / Pedreira","lat":-1.472,"lng":-48.4857},{"key":"cidade_nova","name":"Cidade Nova / Ananindeua","lat":-1.4153,"lng":-48.4632},{"key":"autaz_mirim","name":"Marambaia / Castanheira","lat":-1.4333,"lng":-48.447},{"key":"betania","name":"Batista Campos / Jurunas","lat":-1.4756,"lng":-48.4794},{"key":"centro","name":"Campina / Cidade Velha","lat":-1.4558,"lng":-48.4902},{"key":"ponta_negra","name":"Parque Verde","lat":-1.4846,"lng":-48.5307},{"key":"alvorada","name":"Guamá / Terra Firme","lat":-1.4423,"lng":-48.51},{"key":"coroado","name":"São Brás","lat":-1.4648,"lng":-48.465}],"canonicalKey":"PA-Belem"},"porto_velho":{"id":"porto_velho","name":"Porto Velho - RO","shortName":"Porto Velho","region":"Norte","uf":"RO","ibgePrefix":"11","sefazName":"SEFAZ-RO","sefazDomain":"sefaz.ro.gov.br","heroBadge":"🇧🇷 RO-PortoVelho • Os 15 Maiores Supermercados de Porto Velho","heroTitle":"Economize nos Mercados de Porto Velho - RO","heroSubtitle":"Cotações em 15 redes de Porto Velho: Irmãos Gonçalves (IG), Nova Era Superatacado, Atacadão, Assaí Atacadista, Supermercado Araújo RO, Supermercado Coimbra e mais 9 redes.","priceMultiplier":1.01,"supermarkets":{"db":{"id":"irmaos-goncalves","name":"Irmãos Gonçalves (IG)","color":"#D32F2F","unit":"Irmãos Gonçalves (IG) (Hipermercado)","lat":-8.7391,"lng":-63.8887,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/irmaos-goncalves.svg"},"nova_era":{"id":"nova-era","name":"Nova Era Superatacado","color":"#F57C00","unit":"Nova Era Superatacado (Atacarejo)","lat":-8.7691,"lng":-63.8917,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/nova-era.svg"},"atacadao":{"id":"atacadao","name":"Atacadão","color":"#2E7D32","unit":"Atacadão (Atacarejo)","lat":-8.7061,"lng":-63.8667,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao.svg"},"assai":{"id":"assai","name":"Assaí Atacadista","color":"#1976D2","unit":"Assaí Atacadista (Atacarejo)","lat":-8.7261,"lng":-63.8487,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/assai.svg"},"baratao":{"id":"supermercado-araujo-ro","name":"Supermercado Araújo RO","color":"#C62828","unit":"Supermercado Araújo RO (Supermercado)","lat":-8.7731,"lng":-63.8847,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-araujo-ro.svg"},"carrefour":{"id":"supermercado-coimbra","name":"Supermercado Coimbra","color":"#283593","unit":"Supermercado Coimbra (Supermercado)","lat":-8.7511,"lng":-63.8967,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-coimbra.svg"},"mercadinho_bairro":{"id":"supermercado-dydyo","name":"Supermercado Central PVH","color":"#00838F","unit":"Supermercado Central PVH (Supermercado)","lat":-8.7831,"lng":-63.9417,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-dydyo.svg"},"sacolao_feira":{"id":"tatiana-supermercados","name":"Tatiana Supermercados","color":"#AD1457","unit":"Tatiana Supermercados (Supermercado)","lat":-8.7361,"lng":-63.9187,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/tatiana-supermercados.svg"},"m9":{"id":"supermercado-esperanca-ro","name":"Supermercado Esperança","color":"#2E7D32","unit":"Supermercado Esperança (Supermercado)","lat":-8.7611,"lng":-63.8687,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-esperanca-ro.svg"},"m10":{"id":"supermercado-popular-ro","name":"Supermercado Popular PVH","color":"#EF6C00","unit":"Supermercado Popular PVH (Proximidade / Bairro)","lat":-8.7311,"lng":-63.9117,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/supermercado-popular-ro.svg"},"m11":{"id":"supermercado-jatuarana","name":"Supermercado Jatuarana","color":"#1565C0","unit":"Supermercado Jatuarana (Proximidade / Bairro)","lat":-8.7761,"lng":-63.8747,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/supermercado-jatuarana.svg"},"m12":{"id":"supermercado-calama","name":"Supermercado Calama","color":"#4E342E","unit":"Supermercado Calama (Proximidade / Bairro)","lat":-8.7201,"lng":-63.9147,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/supermercado-calama.svg"},"m13":{"id":"mercadinho-embratel","name":"Mercadinho Embratel","color":"#00695C","unit":"Mercadinho Embratel (Proximidade / Bairro)","lat":-8.7651,"lng":-63.9157,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-embratel.svg"},"m14":{"id":"sacolao-zona-sul-ro","name":"Sacolão Zona Sul PVH","color":"#558B2F","unit":"Sacolão Zona Sul PVH (Hortifruti & Feira)","lat":-8.7461,"lng":-63.8927,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/sacolao-zona-sul-ro.svg"},"m15":{"id":"feira-do-produtor-pvh","name":"Feira do Produtor PVH","color":"#33691E","unit":"Feira do Produtor PVH (Hortifruti & Feira)","lat":-8.7571,"lng":-63.8897,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/feira-do-produtor-pvh.svg"}},"neighborhoods":[{"key":"adrianopolis","name":"Embratel / Flodoaldo","lat":-8.7511,"lng":-63.8967},{"key":"flores","name":"Centro / Caiari","lat":-8.7781,"lng":-63.8994},{"key":"cidade_nova","name":"Nova Porto Velho","lat":-8.7214,"lng":-63.8769},{"key":"autaz_mirim","name":"Jatuarana / Zona Sul","lat":-8.7394,"lng":-63.8607},{"key":"betania","name":"Caladinho / Cohab","lat":-8.7817,"lng":-63.8931},{"key":"centro","name":"São João Bosco","lat":-8.7619,"lng":-63.9039},{"key":"ponta_negra","name":"Tancredo Neves","lat":-8.7907,"lng":-63.9444},{"key":"alvorada","name":"Areal / Olaria","lat":-8.7484,"lng":-63.9237},{"key":"coroado","name":"Cuniã / Marcos Freire","lat":-8.7709,"lng":-63.8787}],"canonicalKey":"RO-PortoVelho"},"rio_branco":{"id":"rio_branco","name":"Rio Branco - AC","shortName":"Rio Branco","region":"Norte","uf":"AC","ibgePrefix":"12","sefazName":"SEFAZ-AC","sefazDomain":"sefaz.ac.gov.br","heroBadge":"🇧🇷 AC-RioBranco • Os 15 Maiores Supermercados de Rio Branco","heroTitle":"Economize nos Mercados de Rio Branco - AC","heroSubtitle":"Cotações em 15 redes de Rio Branco: Supermercados Araújo, Atacale Atacarejo, Mercale Supermercados, Atacadão, Assaí Atacadista, Supermercado Pague Pouco e mais 9 redes.","priceMultiplier":1.03,"supermarkets":{"db":{"id":"supermercados-araujo","name":"Supermercados Araújo","color":"#D32F2F","unit":"Supermercados Araújo (Hipermercado)","lat":-9.9526,"lng":-67.8097,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/supermercados-araujo.svg"},"nova_era":{"id":"atacale","name":"Atacale Atacarejo","color":"#F57C00","unit":"Atacale Atacarejo (Atacarejo)","lat":-9.9826,"lng":-67.8127,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacale.svg"},"atacadao":{"id":"mercale","name":"Mercale Supermercados","color":"#EF6C00","unit":"Mercale Supermercados (Supermercado)","lat":-9.9196,"lng":-67.7877,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/mercale.svg"},"assai":{"id":"atacadao","name":"Atacadão","color":"#2E7D32","unit":"Atacadão (Atacarejo)","lat":-9.9396,"lng":-67.7697,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao.svg"},"baratao":{"id":"assai","name":"Assaí Atacadista","color":"#1976D2","unit":"Assaí Atacadista (Atacarejo)","lat":-9.9866,"lng":-67.8057,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/assai.svg"},"carrefour":{"id":"pague-pouco-ac","name":"Supermercado Pague Pouco","color":"#C2185B","unit":"Supermercado Pague Pouco (Supermercado)","lat":-9.9646,"lng":-67.8177,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/pague-pouco-ac.svg"},"mercadinho_bairro":{"id":"irmaos-goncalves","name":"Irmãos Gonçalves AC","color":"#B71C1C","unit":"Irmãos Gonçalves AC (Hipermercado)","lat":-9.9966,"lng":-67.8627,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/irmaos-goncalves.svg"},"sacolao_feira":{"id":"supermercado-popular-ac","name":"Supermercado Popular AC","color":"#283593","unit":"Supermercado Popular AC (Supermercado)","lat":-9.9496,"lng":-67.8397,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-popular-ac.svg"},"m9":{"id":"supermercado-sao-pedro-ac","name":"Supermercado São Pedro","color":"#00838F","unit":"Supermercado São Pedro (Supermercado)","lat":-9.9746,"lng":-67.7897,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-sao-pedro-ac.svg"},"m10":{"id":"supermercado-bom-preco-ac","name":"Bom Preço Rio Branco","color":"#1565C0","unit":"Bom Preço Rio Branco (Supermercado)","lat":-9.9446,"lng":-67.8327,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-bom-preco-ac.svg"},"m11":{"id":"supermercado-sobral","name":"Supermercado Sobral","color":"#6A1B9A","unit":"Supermercado Sobral (Proximidade / Bairro)","lat":-9.9896,"lng":-67.7957,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/supermercado-sobral.svg"},"m12":{"id":"supermercado-floresta-ac","name":"Supermercado Floresta","color":"#2E7D32","unit":"Supermercado Floresta (Proximidade / Bairro)","lat":-9.9336,"lng":-67.8357,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/supermercado-floresta-ac.svg"},"m13":{"id":"mercadinho-do-bosque","name":"Mercadinho do Bosque","color":"#00695C","unit":"Mercadinho do Bosque (Proximidade / Bairro)","lat":-9.9786,"lng":-67.8367,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-do-bosque.svg"},"m14":{"id":"hortifruti-via-verde","name":"Hortifruti Via Verde","color":"#558B2F","unit":"Hortifruti Via Verde (Hortifruti & Feira)","lat":-9.9596,"lng":-67.8137,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/hortifruti-via-verde.svg"},"m15":{"id":"mercado-elias-mansour","name":"Mercado Elias Mansour","color":"#33691E","unit":"Mercado Elias Mansour (Hortifruti & Feira)","lat":-9.9706,"lng":-67.8107,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/mercado-elias-mansour.svg"}},"neighborhoods":[{"key":"adrianopolis","name":"Bosque / Vila Ivonete","lat":-9.9646,"lng":-67.8177},{"key":"flores","name":"Centro / Base","lat":-9.9916,"lng":-67.8204},{"key":"cidade_nova","name":"Estação Experimental","lat":-9.9349,"lng":-67.7979},{"key":"autaz_mirim","name":"Sobral / Bahia","lat":-9.9529,"lng":-67.7817},{"key":"betania","name":"Floresta / Calafate","lat":-9.9952,"lng":-67.8141},{"key":"centro","name":"Segundo Distrito","lat":-9.9754,"lng":-67.8249},{"key":"ponta_negra","name":"Isaura Parente","lat":-10.0042,"lng":-67.8654},{"key":"alvorada","name":"Conjunto Tucumã","lat":-9.9619,"lng":-67.8447},{"key":"coroado","name":"Plácido de Castro","lat":-9.9844,"lng":-67.7997}],"canonicalKey":"AC-RioBranco"},"macapa":{"id":"macapa","name":"Macapá - AP","shortName":"Macapá","region":"Norte","uf":"AP","ibgePrefix":"16","sefazName":"SEFAZ-AP","sefazDomain":"sefaz.ap.gov.br","heroBadge":"🇧🇷 AP-Macapa • Os 15 Maiores Supermercados de Macapá","heroTitle":"Economize nos Mercados de Macapá - AP","heroSubtitle":"Cotações em 15 redes de Macapá: Fortaleza Supermercados, Santa Lúcia Supermercados, Atacadão, Assaí Atacadista, Supermercado Favorito AP, Rede Mini Box e mais 9 redes.","priceMultiplier":1.02,"supermarkets":{"db":{"id":"fortaleza-supermercados","name":"Fortaleza Supermercados","color":"#D32F2F","unit":"Fortaleza Supermercados (Hipermercado)","lat":0.0584,"lng":-51.0553,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/fortaleza-supermercados.svg"},"nova_era":{"id":"santa-lucia-ap","name":"Santa Lúcia Supermercados","color":"#F57C00","unit":"Santa Lúcia Supermercados (Supermercado)","lat":0.0284,"lng":-51.0583,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/santa-lucia-ap.svg"},"atacadao":{"id":"atacadao","name":"Atacadão","color":"#2E7D32","unit":"Atacadão (Atacarejo)","lat":0.0914,"lng":-51.0333,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao.svg"},"assai":{"id":"assai","name":"Assaí Atacadista","color":"#1976D2","unit":"Assaí Atacadista (Atacarejo)","lat":0.0714,"lng":-51.0153,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/assai.svg"},"baratao":{"id":"favorito-ap","name":"Supermercado Favorito AP","color":"#C2185B","unit":"Supermercado Favorito AP (Supermercado)","lat":0.0244,"lng":-51.0513,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/favorito-ap.svg"},"carrefour":{"id":"rede-mini-box","name":"Rede Mini Box","color":"#283593","unit":"Rede Mini Box (Supermercado)","lat":0.0464,"lng":-51.0633,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/rede-mini-box.svg"},"mercadinho_bairro":{"id":"supermercado-ramiro","name":"Supermercado Ramiro","color":"#1565C0","unit":"Supermercado Ramiro (Supermercado)","lat":0.0144,"lng":-51.1083,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-ramiro.svg"},"sacolao_feira":{"id":"supermercado-empala","name":"Supermercado Empala","color":"#00838F","unit":"Supermercado Empala (Supermercado)","lat":0.0614,"lng":-51.0853,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-empala.svg"},"m9":{"id":"supermercado-2000-ap","name":"Supermercado 2000","color":"#AD1457","unit":"Supermercado 2000 (Supermercado)","lat":0.0364,"lng":-51.0353,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-2000-ap.svg"},"m10":{"id":"atacadao-macapa-norte","name":"Atacarejo Macapá Norte","color":"#EF6C00","unit":"Atacarejo Macapá Norte (Atacarejo)","lat":0.0664,"lng":-51.0783,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao-macapa-norte.svg"},"m11":{"id":"supermercado-buritizal","name":"Supermercado Buritizal","color":"#6A1B9A","unit":"Supermercado Buritizal (Proximidade / Bairro)","lat":0.0214,"lng":-51.0413,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/supermercado-buritizal.svg"},"m12":{"id":"mercadinho-do-trem","name":"Mercadinho do Trem","color":"#00695C","unit":"Mercadinho do Trem (Proximidade / Bairro)","lat":0.0774,"lng":-51.0813,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-do-trem.svg"},"m13":{"id":"mercadinho-marco-zero","name":"Mercadinho Marco Zero","color":"#00796B","unit":"Mercadinho Marco Zero (Proximidade / Bairro)","lat":0.0324,"lng":-51.0823,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-marco-zero.svg"},"m14":{"id":"sacolao-equador","name":"Sacolão Meio do Mundo","color":"#558B2F","unit":"Sacolão Meio do Mundo (Hortifruti & Feira)","lat":0.0514,"lng":-51.0593,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/sacolao-equador.svg"},"m15":{"id":"feira-do-agricultor-ap","name":"Feira do Agricultor Macapá","color":"#33691E","unit":"Feira do Agricultor Macapá (Hortifruti & Feira)","lat":0.0404,"lng":-51.0563,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/feira-do-agricultor-ap.svg"}},"neighborhoods":[{"key":"adrianopolis","name":"Central / Santa Rita","lat":0.0464,"lng":-51.0633},{"key":"flores","name":"Trem / Laguinho","lat":0.0194,"lng":-51.066},{"key":"cidade_nova","name":"Buritizal / Novo Buritizal","lat":0.0761,"lng":-51.0435},{"key":"autaz_mirim","name":"Jardim Marco Zero","lat":0.0581,"lng":-51.0273},{"key":"betania","name":"São Lázaro / Infraero","lat":0.0158,"lng":-51.0597},{"key":"centro","name":"Pacoval / Julião Ramos","lat":0.0356,"lng":-51.0705},{"key":"ponta_negra","name":"Alvorada / Cabralzinho","lat":0.0068,"lng":-51.111},{"key":"alvorada","name":"Fazendinha","lat":0.0491,"lng":-51.0903},{"key":"coroado","name":"Jesus de Nazaré","lat":0.0266,"lng":-51.0453}],"canonicalKey":"AP-Macapa"},"palmas":{"id":"palmas","name":"Palmas - TO","shortName":"Palmas","region":"Norte","uf":"TO","ibgePrefix":"17","sefazName":"SEFAZ-TO","sefazDomain":"sefaz.to.gov.br","heroBadge":"🇧🇷 TO-Palmas • Os 15 Maiores Supermercados de Palmas","heroTitle":"Economize nos Mercados de Palmas - TO","heroSubtitle":"Cotações em 15 redes de Palmas: Quartetto Supermercados, Mix Mateus, Atacadão, Assaí Atacadista, Supermercado Big Norte, Supermercado Super Vale e mais 9 redes.","priceMultiplier":0.99,"supermarkets":{"db":{"id":"quartetto","name":"Quartetto Supermercados","color":"#D32F2F","unit":"Quartetto Supermercados (Supermercado)","lat":-10.1612,"lng":-48.3184,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/quartetto.svg"},"nova_era":{"id":"mix-mateus","name":"Mix Mateus","color":"#0D47A1","unit":"Mix Mateus (Atacarejo)","lat":-10.1912,"lng":-48.3214,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/mix-mateus.svg"},"atacadao":{"id":"atacadao","name":"Atacadão","color":"#2E7D32","unit":"Atacadão (Atacarejo)","lat":-10.1282,"lng":-48.2964,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao.svg"},"assai":{"id":"assai","name":"Assaí Atacadista","color":"#1976D2","unit":"Assaí Atacadista (Atacarejo)","lat":-10.1482,"lng":-48.2784,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/assai.svg"},"baratao":{"id":"big-norte-to","name":"Supermercado Big Norte","color":"#C2185B","unit":"Supermercado Big Norte (Supermercado)","lat":-10.1952,"lng":-48.3144,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/big-norte-to.svg"},"carrefour":{"id":"super-vale-to","name":"Supermercado Super Vale","color":"#283593","unit":"Supermercado Super Vale (Supermercado)","lat":-10.1732,"lng":-48.3264,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/super-vale-to.svg"},"mercadinho_bairro":{"id":"supermercado-real-to","name":"Supermercado Real Palmas","color":"#EF6C00","unit":"Supermercado Real Palmas (Supermercado)","lat":-10.2052,"lng":-48.3714,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-real-to.svg"},"sacolao_feira":{"id":"supermercado-flamboyant-to","name":"Supermercado Flamboyant","color":"#00838F","unit":"Supermercado Flamboyant (Supermercado)","lat":-10.1582,"lng":-48.3484,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-flamboyant-to.svg"},"m9":{"id":"atacadao-taquaralto","name":"Atacarejo Taquaralto","color":"#1565C0","unit":"Atacarejo Taquaralto (Atacarejo)","lat":-10.1832,"lng":-48.2984,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao-taquaralto.svg"},"m10":{"id":"supermercado-sol-nascente","name":"Supermercado Sol Nascente","color":"#6A1B9A","unit":"Supermercado Sol Nascente (Supermercado)","lat":-10.1532,"lng":-48.3414,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-sol-nascente.svg"},"m11":{"id":"supermercado-aureny","name":"Supermercado Aureny","color":"#4E342E","unit":"Supermercado Aureny (Proximidade / Bairro)","lat":-10.1982,"lng":-48.3044,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/supermercado-aureny.svg"},"m12":{"id":"mercadinho-da-quadra-to","name":"Mercadinho da Quadra Sul","color":"#00695C","unit":"Mercadinho da Quadra Sul (Proximidade / Bairro)","lat":-10.1422,"lng":-48.3444,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-da-quadra-to.svg"},"m13":{"id":"mercadinho-graciosa","name":"Mercadinho Orla Graciosa","color":"#00796B","unit":"Mercadinho Orla Graciosa (Proximidade / Bairro)","lat":-10.1872,"lng":-48.3454,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-graciosa.svg"},"m14":{"id":"hortifruti-plano-diretor","name":"Hortifruti Plano Diretor","color":"#558B2F","unit":"Hortifruti Plano Diretor (Hortifruti & Feira)","lat":-10.1682,"lng":-48.3224,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/hortifruti-plano-diretor.svg"},"m15":{"id":"feira-da-304-sul","name":"Feira Coberta da 304 Sul","color":"#33691E","unit":"Feira Coberta da 304 Sul (Hortifruti & Feira)","lat":-10.1792,"lng":-48.3194,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/feira-da-304-sul.svg"}},"neighborhoods":[{"key":"adrianopolis","name":"Plano Diretor Sul (104/204 Sul)","lat":-10.1732,"lng":-48.3264},{"key":"flores","name":"Plano Diretor Norte (106 Norte)","lat":-10.2002,"lng":-48.3291},{"key":"cidade_nova","name":"Taquaralto / Aureny III","lat":-10.1435,"lng":-48.3066},{"key":"autaz_mirim","name":"Jardim Aureny I e II","lat":-10.1615,"lng":-48.2904},{"key":"betania","name":"Orla 14 / Graciosa","lat":-10.2038,"lng":-48.3228},{"key":"centro","name":"Quadra 403 / 504 Sul","lat":-10.184,"lng":-48.3336},{"key":"ponta_negra","name":"Arse 112 / 122","lat":-10.2128,"lng":-48.3741},{"key":"alvorada","name":"Santo Amaro","lat":-10.1705,"lng":-48.3534},{"key":"coroado","name":"Taquaruçu","lat":-10.193,"lng":-48.3084}],"canonicalKey":"TO-Palmas"},"fortaleza":{"id":"fortaleza","name":"Fortaleza - CE","shortName":"Fortaleza","region":"Nordeste","uf":"CE","ibgePrefix":"23","sefazName":"SEFAZ-CE","sefazDomain":"sefaz.ce.gov.br","heroBadge":"🇧🇷 CE-Fortaleza • Os 15 Maiores Supermercados de Fortaleza","heroTitle":"Economize nos Mercados de Fortaleza - CE","heroSubtitle":"Cotações em 15 redes de Fortaleza: Mercadinhos São Luiz, Mix Mateus, Atacadão, Assaí Atacadista, Cometa Supermercados, Pinheiro Supermercados e mais 9 redes.","priceMultiplier":0.96,"supermarkets":{"db":{"id":"mercadinhos-sao-luiz","name":"Mercadinhos São Luiz","color":"#D32F2F","unit":"Mercadinhos São Luiz (Premium)","lat":-3.7091,"lng":-38.5115,"tier":"medio","tipo":"premium","tierLabel":"Premium","logo":"web/assets/logos/mercadinhos-sao-luiz.svg"},"nova_era":{"id":"mix-mateus","name":"Mix Mateus","color":"#0D47A1","unit":"Mix Mateus (Atacarejo)","lat":-3.7391,"lng":-38.5145,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/mix-mateus.svg"},"atacadao":{"id":"atacadao","name":"Atacadão","color":"#2E7D32","unit":"Atacadão (Atacarejo)","lat":-3.6761,"lng":-38.4895,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao.svg"},"assai":{"id":"assai","name":"Assaí Atacadista","color":"#1976D2","unit":"Assaí Atacadista (Atacarejo)","lat":-3.6961,"lng":-38.4715,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/assai.svg"},"baratao":{"id":"cometa-supermercados","name":"Cometa Supermercados","color":"#C2185B","unit":"Cometa Supermercados (Supermercado)","lat":-3.7431,"lng":-38.5075,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/cometa-supermercados.svg"},"carrefour":{"id":"pinheiro-supermercados","name":"Pinheiro Supermercados","color":"#2E7D32","unit":"Pinheiro Supermercados (Supermercado)","lat":-3.7211,"lng":-38.5195,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/pinheiro-supermercados.svg"},"mercadinho_bairro":{"id":"supermercado-guara","name":"Supermercado Guará","color":"#EF6C00","unit":"Supermercado Guará (Supermercado)","lat":-3.7531,"lng":-38.5645,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-guara.svg"},"sacolao_feira":{"id":"centerbox","name":"Centerbox Supermercados","color":"#1565C0","unit":"Centerbox Supermercados (Supermercado)","lat":-3.7061,"lng":-38.5415,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/centerbox.svg"},"m9":{"id":"frangolandiace","name":"Super Frangolândia","color":"#B71C1C","unit":"Super Frangolândia (Supermercado)","lat":-3.7311,"lng":-38.4915,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/frangolandiace.svg"},"m10":{"id":"nidobox","name":"Nidobox Supermercados","color":"#283593","unit":"Nidobox Supermercados (Supermercado)","lat":-3.7011,"lng":-38.5345,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/nidobox.svg"},"m11":{"id":"super-do-povo-ce","name":"Super do Povo","color":"#00838F","unit":"Super do Povo (Supermercado)","lat":-3.7461,"lng":-38.4975,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/super-do-povo-ce.svg"},"m12":{"id":"isidoro-ce","name":"Supermercado Isidoro","color":"#6A1B9A","unit":"Supermercado Isidoro (Supermercado)","lat":-3.6901,"lng":-38.5375,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/isidoro-ce.svg"},"m13":{"id":"pao-de-acucar","name":"Pão de Açúcar","color":"#1B5E20","unit":"Pão de Açúcar (Varejo)","lat":-3.7351,"lng":-38.5385,"tier":"medio","tipo":"varejo","tierLabel":"Varejo","logo":"web/assets/logos/pao-de-acucar.svg"},"m14":{"id":"mercadinho-popular-ce","name":"Mercadinho Popular Aldeota","color":"#00695C","unit":"Mercadinho Popular Aldeota (Proximidade / Bairro)","lat":-3.7161,"lng":-38.5155,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-popular-ce.svg"},"m15":{"id":"mercado-sao-sebastiao","name":"Mercado São Sebastião","color":"#33691E","unit":"Mercado São Sebastião (Hortifruti & Feira)","lat":-3.7271,"lng":-38.5125,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/mercado-sao-sebastiao.svg"}},"neighborhoods":[{"key":"adrianopolis","name":"Aldeota / Meireles","lat":-3.7211,"lng":-38.5195},{"key":"flores","name":"Fátima / Benfica","lat":-3.7481,"lng":-38.5222},{"key":"cidade_nova","name":"Messejana / Lagoa Redonda","lat":-3.6914,"lng":-38.4997},{"key":"autaz_mirim","name":"Parangaba / Maraponga","lat":-3.7094,"lng":-38.4835},{"key":"betania","name":"Papicu / Cocó","lat":-3.7517,"lng":-38.5159},{"key":"centro","name":"Centro / Praia de Iracema","lat":-3.7319,"lng":-38.5267},{"key":"ponta_negra","name":"Bezerra de Menezes","lat":-3.7607,"lng":-38.5672},{"key":"alvorada","name":"Montese / Vila União","lat":-3.7184,"lng":-38.5465},{"key":"coroado","name":"Barra do Ceará","lat":-3.7409,"lng":-38.5015}],"canonicalKey":"CE-Fortaleza"},"recife":{"id":"recife","name":"Recife - PE","shortName":"Recife","region":"Nordeste","uf":"PE","ibgePrefix":"26","sefazName":"SEFAZ-PE","sefazDomain":"sefaz.pe.gov.br","heroBadge":"🇧🇷 PE-Recife • Os 15 Maiores Supermercados de Recife","heroTitle":"Economize nos Mercados de Recife - PE","heroSubtitle":"Cotações em 15 redes de Recife: Novo Atacarejo, Mix Mateus, Atacadão, Assaí Atacadista, Extrabom Supermercados, Carrefour e mais 9 redes.","priceMultiplier":0.96,"supermarkets":{"db":{"id":"novo-atacarejo","name":"Novo Atacarejo","color":"#D32F2F","unit":"Novo Atacarejo (Atacarejo)","lat":-8.0248,"lng":-34.8618,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/novo-atacarejo.svg"},"nova_era":{"id":"mix-mateus","name":"Mix Mateus","color":"#0D47A1","unit":"Mix Mateus (Atacarejo)","lat":-8.0548,"lng":-34.8648,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/mix-mateus.svg"},"atacadao":{"id":"atacadao","name":"Atacadão","color":"#2E7D32","unit":"Atacadão (Atacarejo)","lat":-7.9918,"lng":-34.8398,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao.svg"},"assai":{"id":"assai","name":"Assaí Atacadista","color":"#1976D2","unit":"Assaí Atacadista (Atacarejo)","lat":-8.0118,"lng":-34.8218,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/assai.svg"},"baratao":{"id":"extrabom","name":"Extrabom Supermercados","color":"#C2185B","unit":"Extrabom Supermercados (Supermercado)","lat":-8.0588,"lng":-34.8578,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/extrabom.svg"},"carrefour":{"id":"carrefour","name":"Carrefour","color":"#0D47A1","unit":"Carrefour (Hipermercado)","lat":-8.0368,"lng":-34.8698,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/carrefour.svg"},"mercadinho_bairro":{"id":"deskontao","name":"Deskontão Atacarejo","color":"#EF6C00","unit":"Deskontão Atacarejo (Atacarejo)","lat":-8.0688,"lng":-34.9148,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/deskontao.svg"},"sacolao_feira":{"id":"arco-mix","name":"Arco-Mix Supermercados","color":"#1565C0","unit":"Arco-Mix Supermercados (Supermercado)","lat":-8.0218,"lng":-34.8918,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/arco-mix.svg"},"m9":{"id":"supermercado-soberano","name":"Supermercado Soberano","color":"#283593","unit":"Supermercado Soberano (Supermercado)","lat":-8.0468,"lng":-34.8418,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-soberano.svg"},"m10":{"id":"rm-express","name":"RM Express","color":"#4E342E","unit":"RM Express (Premium)","lat":-8.0168,"lng":-34.8848,"tier":"medio","tipo":"premium","tierLabel":"Premium","logo":"web/assets/logos/rm-express.svg"},"m11":{"id":"pao-de-acucar","name":"Pão de Açúcar","color":"#1B5E20","unit":"Pão de Açúcar (Varejo)","lat":-8.0618,"lng":-34.8478,"tier":"medio","tipo":"varejo","tierLabel":"Varejo","logo":"web/assets/logos/pao-de-acucar.svg"},"m12":{"id":"bompreco-pe","name":"Super Bompreço","color":"#00838F","unit":"Super Bompreço (Supermercado)","lat":-8.0058,"lng":-34.8878,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/bompreco-pe.svg"},"m13":{"id":"mercadinho-boa-viagem","name":"Mercadinho Boa Viagem","color":"#00695C","unit":"Mercadinho Boa Viagem (Proximidade / Bairro)","lat":-8.0508,"lng":-34.8888,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-boa-viagem.svg"},"m14":{"id":"ceasa-recife","name":"CEASA Recife Hortifruti","color":"#558B2F","unit":"CEASA Recife Hortifruti (Hortifruti & Feira)","lat":-8.0318,"lng":-34.8658,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/ceasa-recife.svg"},"m15":{"id":"mercado-de-sao-jose","name":"Mercado de São José","color":"#33691E","unit":"Mercado de São José (Hortifruti & Feira)","lat":-8.0428,"lng":-34.8628,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/mercado-de-sao-jose.svg"}},"neighborhoods":[{"key":"adrianopolis","name":"Boa Viagem / Pina","lat":-8.0368,"lng":-34.8698},{"key":"flores","name":"Casa Forte / Parnamirim","lat":-8.0638,"lng":-34.8725},{"key":"cidade_nova","name":"Graças / Espinheiro","lat":-8.0071,"lng":-34.85},{"key":"autaz_mirim","name":"Imbiribeira / Ipsep","lat":-8.0251,"lng":-34.8338},{"key":"betania","name":"Madalena / Torre","lat":-8.0674,"lng":-34.8662},{"key":"centro","name":"Santo Amaro / Boa Vista","lat":-8.0476,"lng":-34.877},{"key":"ponta_negra","name":"Várzea / Caxangá","lat":-8.0764,"lng":-34.9175},{"key":"alvorada","name":"Casa Amarela","lat":-8.0341,"lng":-34.8968},{"key":"coroado","name":"Afogados / Jardim São Paulo","lat":-8.0566,"lng":-34.8518}],"canonicalKey":"PE-Recife"},"salvador":{"id":"salvador","name":"Salvador - BA","shortName":"Salvador","region":"Nordeste","uf":"BA","ibgePrefix":"29","sefazName":"SEFAZ-BA","sefazDomain":"sefaz.ba.gov.br","heroBadge":"🇧🇷 BA-Salvador • Os 15 Maiores Supermercados de Salvador","heroTitle":"Economize nos Mercados de Salvador - BA","heroSubtitle":"Cotações em 15 redes de Salvador: Atakarejo, Hiperideal, Atacadão, Assaí Atacadista, RedeMix Supermercados, GBarbosa e mais 9 redes.","priceMultiplier":0.97,"supermarkets":{"db":{"id":"atakarejo","name":"Atakarejo","color":"#D32F2F","unit":"Atakarejo (Atacarejo)","lat":-12.9549,"lng":-38.4864,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atakarejo.svg"},"nova_era":{"id":"hiperideal","name":"Hiperideal","color":"#F57C00","unit":"Hiperideal (Premium)","lat":-12.9849,"lng":-38.4894,"tier":"medio","tipo":"premium","tierLabel":"Premium","logo":"web/assets/logos/hiperideal.svg"},"atacadao":{"id":"atacadao","name":"Atacadão","color":"#2E7D32","unit":"Atacadão (Atacarejo)","lat":-12.9219,"lng":-38.4644,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao.svg"},"assai":{"id":"assai","name":"Assaí Atacadista","color":"#1976D2","unit":"Assaí Atacadista (Atacarejo)","lat":-12.9419,"lng":-38.4464,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/assai.svg"},"baratao":{"id":"redemix","name":"RedeMix Supermercados","color":"#C2185B","unit":"RedeMix Supermercados (Supermercado)","lat":-12.9889,"lng":-38.4824,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/redemix.svg"},"carrefour":{"id":"gbarbosa","name":"GBarbosa","color":"#283593","unit":"GBarbosa (Hipermercado)","lat":-12.9669,"lng":-38.4944,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/gbarbosa.svg"},"mercadinho_bairro":{"id":"mix-mateus","name":"Mix Mateus","color":"#0D47A1","unit":"Mix Mateus (Atacarejo)","lat":-12.9989,"lng":-38.5394,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/mix-mateus.svg"},"sacolao_feira":{"id":"perini","name":"Perini Deli & Super","color":"#6A1B9A","unit":"Perini Deli & Super (Premium)","lat":-12.9519,"lng":-38.5164,"tier":"medio","tipo":"premium","tierLabel":"Premium","logo":"web/assets/logos/perini.svg"},"m9":{"id":"mercantil-rodrigues","name":"Mercantil Rodrigues","color":"#EF6C00","unit":"Mercantil Rodrigues (Atacarejo)","lat":-12.9769,"lng":-38.4664,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/mercantil-rodrigues.svg"},"m10":{"id":"bompreco-ba","name":"Hiper Bompreço","color":"#1565C0","unit":"Hiper Bompreço (Hipermercado)","lat":-12.9469,"lng":-38.5094,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/bompreco-ba.svg"},"m11":{"id":"todo-dia-ba","name":"TodoDia Proximidade","color":"#2E7D32","unit":"TodoDia Proximidade (Proximidade / Bairro)","lat":-12.9919,"lng":-38.4724,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/todo-dia-ba.svg"},"m12":{"id":"supermercado-cambui","name":"Supermercado Cambuí","color":"#00838F","unit":"Supermercado Cambuí (Supermercado)","lat":-12.9359,"lng":-38.5124,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-cambui.svg"},"m13":{"id":"mercadinho-pituba","name":"Mercadinho Pituba","color":"#00695C","unit":"Mercadinho Pituba (Proximidade / Bairro)","lat":-12.9809,"lng":-38.5134,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-pituba.svg"},"m14":{"id":"hortifruti-cesta-do-povo","name":"Hortifruti Salvador","color":"#558B2F","unit":"Hortifruti Salvador (Hortifruti & Feira)","lat":-12.9619,"lng":-38.4904,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/hortifruti-cesta-do-povo.svg"},"m15":{"id":"feira-de-sao-joaquim","name":"Feira de São Joaquim","color":"#33691E","unit":"Feira de São Joaquim (Hortifruti & Feira)","lat":-12.9729,"lng":-38.4874,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/feira-de-sao-joaquim.svg"}},"neighborhoods":[{"key":"adrianopolis","name":"Pituba / Itaigara","lat":-12.9669,"lng":-38.4944},{"key":"flores","name":"Barra / Graça","lat":-12.9939,"lng":-38.4971},{"key":"cidade_nova","name":"Rio Vermelho / Ondina","lat":-12.9372,"lng":-38.4746},{"key":"autaz_mirim","name":"Imbuí / Boca do Rio","lat":-12.9552,"lng":-38.4584},{"key":"betania","name":"Brotas / Cabula","lat":-12.9975,"lng":-38.4908},{"key":"centro","name":"Itapuã / Stella Maris","lat":-12.9777,"lng":-38.5016},{"key":"ponta_negra","name":"Caminho das Árvores","lat":-13.0065,"lng":-38.5421},{"key":"alvorada","name":"Liberdade / Calçada","lat":-12.9642,"lng":-38.5214},{"key":"coroado","name":"Cajazeiras / Pau da Lima","lat":-12.9867,"lng":-38.4764}],"canonicalKey":"BA-Salvador"},"sao_luis":{"id":"sao_luis","name":"São Luís - MA","shortName":"São Luís","region":"Nordeste","uf":"MA","ibgePrefix":"21","sefazName":"SEFAZ-MA","sefazDomain":"sefaz.ma.gov.br","heroBadge":"🇧🇷 MA-SaoLuis • Os 15 Maiores Supermercados de São Luís","heroTitle":"Economize nos Mercados de São Luís - MA","heroSubtitle":"Cotações em 15 redes de São Luís: Supermercado Mateus, Mix Mateus, Atacadão, Assaí Atacadista, Supermercados Maciel, Empório Fribal e mais 9 redes.","priceMultiplier":0.96,"supermarkets":{"db":{"id":"supermercado-mateus","name":"Supermercado Mateus","color":"#0D47A1","unit":"Supermercado Mateus (Hipermercado)","lat":-2.5079,"lng":-44.2916,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/supermercado-mateus.svg"},"nova_era":{"id":"mix-mateus","name":"Mix Mateus","color":"#0D47A1","unit":"Mix Mateus (Atacarejo)","lat":-2.5379,"lng":-44.2946,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/mix-mateus.svg"},"atacadao":{"id":"atacadao","name":"Atacadão","color":"#2E7D32","unit":"Atacadão (Atacarejo)","lat":-2.4749,"lng":-44.2696,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao.svg"},"assai":{"id":"assai","name":"Assaí Atacadista","color":"#1976D2","unit":"Assaí Atacadista (Atacarejo)","lat":-2.4949,"lng":-44.2516,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/assai.svg"},"baratao":{"id":"supermercados-maciel","name":"Supermercados Maciel","color":"#C2185B","unit":"Supermercados Maciel (Supermercado)","lat":-2.5419,"lng":-44.2876,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercados-maciel.svg"},"carrefour":{"id":"emporio-fribal","name":"Empório Fribal","color":"#D32F2F","unit":"Empório Fribal (Premium)","lat":-2.5199,"lng":-44.2996,"tier":"medio","tipo":"premium","tierLabel":"Premium","logo":"web/assets/logos/emporio-fribal.svg"},"mercadinho_bairro":{"id":"camino-supermercados","name":"Camino Supermercados","color":"#EF6C00","unit":"Camino Supermercados (Proximidade / Bairro)","lat":-2.5519,"lng":-44.3446,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/camino-supermercados.svg"},"sacolao_feira":{"id":"spazio-mateus","name":"Spazio Mateus","color":"#283593","unit":"Spazio Mateus (Premium)","lat":-2.5049,"lng":-44.3216,"tier":"medio","tipo":"premium","tierLabel":"Premium","logo":"web/assets/logos/spazio-mateus.svg"},"m9":{"id":"supermercado-bom-preco-ma","name":"Bom Preço São Luís","color":"#1565C0","unit":"Bom Preço São Luís (Supermercado)","lat":-2.5299,"lng":-44.2716,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-bom-preco-ma.svg"},"m10":{"id":"supermercado-silva-ma","name":"Supermercado Silva","color":"#00838F","unit":"Supermercado Silva (Supermercado)","lat":-2.4999,"lng":-44.3146,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-silva-ma.svg"},"m11":{"id":"todo-dia-ma","name":"Mercado TodoDia SLZ","color":"#2E7D32","unit":"Mercado TodoDia SLZ (Proximidade / Bairro)","lat":-2.5449,"lng":-44.2776,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/todo-dia-ma.svg"},"m12":{"id":"mercadinho-cohama","name":"Mercadinho Cohama","color":"#00695C","unit":"Mercadinho Cohama (Proximidade / Bairro)","lat":-2.4889,"lng":-44.3176,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-cohama.svg"},"m13":{"id":"mercadinho-renascenca","name":"Mercadinho Renascença","color":"#00796B","unit":"Mercadinho Renascença (Proximidade / Bairro)","lat":-2.5339,"lng":-44.3186,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-renascenca.svg"},"m14":{"id":"feira-da-cohab-slz","name":"Feira da Cohab","color":"#558B2F","unit":"Feira da Cohab (Hortifruti & Feira)","lat":-2.5149,"lng":-44.2956,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/feira-da-cohab-slz.svg"},"m15":{"id":"feira-da-praia-grande","name":"Feira da Praia Grande","color":"#33691E","unit":"Feira da Praia Grande (Hortifruti & Feira)","lat":-2.5259,"lng":-44.2926,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/feira-da-praia-grande.svg"}},"neighborhoods":[{"key":"adrianopolis","name":"Cohama / Vinhais","lat":-2.5199,"lng":-44.2996},{"key":"flores","name":"Renascença / Ponta d'Areia","lat":-2.5469,"lng":-44.3023},{"key":"cidade_nova","name":"Turu / Olho d'Água","lat":-2.4902,"lng":-44.2798},{"key":"autaz_mirim","name":"Calhau / Altos do Calhau","lat":-2.5082,"lng":-44.2636},{"key":"betania","name":"Cidade Operária / Maiobão","lat":-2.5505,"lng":-44.296},{"key":"centro","name":"Cohatrac / Cohab","lat":-2.5307,"lng":-44.3068},{"key":"ponta_negra","name":"Centro Histórico SLZ","lat":-2.5595,"lng":-44.3473},{"key":"alvorada","name":"Angelim / Bequimão","lat":-2.5172,"lng":-44.3266},{"key":"coroado","name":"Anil / João Paulo","lat":-2.5397,"lng":-44.2816}],"canonicalKey":"MA-SaoLuis"},"teresina":{"id":"teresina","name":"Teresina - PI","shortName":"Teresina","region":"Nordeste","uf":"PI","ibgePrefix":"22","sefazName":"SEFAZ-PI","sefazDomain":"sefaz.pi.gov.br","heroBadge":"🇧🇷 PI-Teresina • Os 15 Maiores Supermercados de Teresina","heroTitle":"Economize nos Mercados de Teresina - PI","heroSubtitle":"Cotações em 15 redes de Teresina: Carvalho Super, Carvalho Mercadão, Mix Mateus, Atacadão, Assaí Atacadista, Ferreira Supermercados e mais 9 redes.","priceMultiplier":0.95,"supermarkets":{"db":{"id":"carvalho-super","name":"Carvalho Super","color":"#D32F2F","unit":"Carvalho Super (Supermercado)","lat":-5.0664,"lng":-42.7867,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/carvalho-super.svg"},"nova_era":{"id":"carvalho-mercadao","name":"Carvalho Mercadão","color":"#B71C1C","unit":"Carvalho Mercadão (Atacarejo)","lat":-5.0964,"lng":-42.7897,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/carvalho-mercadao.svg"},"atacadao":{"id":"mix-mateus","name":"Mix Mateus","color":"#0D47A1","unit":"Mix Mateus (Atacarejo)","lat":-5.0334,"lng":-42.7647,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/mix-mateus.svg"},"assai":{"id":"atacadao","name":"Atacadão","color":"#2E7D32","unit":"Atacadão (Atacarejo)","lat":-5.0534,"lng":-42.7467,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao.svg"},"baratao":{"id":"assai","name":"Assaí Atacadista","color":"#1976D2","unit":"Assaí Atacadista (Atacarejo)","lat":-5.1004,"lng":-42.7827,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/assai.svg"},"carrefour":{"id":"ferreira-supermercados","name":"Ferreira Supermercados","color":"#C2185B","unit":"Ferreira Supermercados (Supermercado)","lat":-5.0784,"lng":-42.7947,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/ferreira-supermercados.svg"},"mercadinho_bairro":{"id":"r-carvalho","name":"Comercial R. Carvalho","color":"#283593","unit":"Comercial R. Carvalho (Supermercado)","lat":-5.1104,"lng":-42.8397,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/r-carvalho.svg"},"sacolao_feira":{"id":"pao-de-acucar","name":"Pão de Açúcar","color":"#1B5E20","unit":"Pão de Açúcar (Varejo)","lat":-5.0634,"lng":-42.8167,"tier":"medio","tipo":"varejo","tierLabel":"Varejo","logo":"web/assets/logos/pao-de-acucar.svg"},"m9":{"id":"supermercado-toureiro","name":"Supermercado Toureiro","color":"#EF6C00","unit":"Supermercado Toureiro (Supermercado)","lat":-5.0884,"lng":-42.7667,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-toureiro.svg"},"m10":{"id":"extra-teresina","name":"Mercado Extra","color":"#1565C0","unit":"Mercado Extra (Supermercado)","lat":-5.0584,"lng":-42.8097,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/extra-teresina.svg"},"m11":{"id":"supermercado-van-pi","name":"Supermercado União PI","color":"#00838F","unit":"Supermercado União PI (Supermercado)","lat":-5.1034,"lng":-42.7727,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-van-pi.svg"},"m12":{"id":"mercadinho-fatima-pi","name":"Mercadinho Fátima","color":"#00695C","unit":"Mercadinho Fátima (Proximidade / Bairro)","lat":-5.0474,"lng":-42.8127,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-fatima-pi.svg"},"m13":{"id":"mercadinho-dirceu","name":"Mercadinho do Dirceu","color":"#00796B","unit":"Mercadinho do Dirceu (Proximidade / Bairro)","lat":-5.0924,"lng":-42.8137,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-dirceu.svg"},"m14":{"id":"nova-ceasa-pi","name":"Nova Ceasa Teresina","color":"#558B2F","unit":"Nova Ceasa Teresina (Hortifruti & Feira)","lat":-5.0734,"lng":-42.7907,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/nova-ceasa-pi.svg"},"m15":{"id":"mercado-central-teresina","name":"Mercado Central de Teresina","color":"#33691E","unit":"Mercado Central de Teresina (Hortifruti & Feira)","lat":-5.0844,"lng":-42.7877,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/mercado-central-teresina.svg"}},"neighborhoods":[{"key":"adrianopolis","name":"Fátima / Jóquei","lat":-5.0784,"lng":-42.7947},{"key":"flores","name":"Ininga / Horto","lat":-5.1054,"lng":-42.7974},{"key":"cidade_nova","name":"Centro / Cabral","lat":-5.0487,"lng":-42.7749},{"key":"autaz_mirim","name":"Dirceu Arcoverde (Itararé)","lat":-5.0667,"lng":-42.7587},{"key":"betania","name":"Mocambinho / Primavera","lat":-5.109,"lng":-42.7911},{"key":"centro","name":"São Cristóvão / Noivos","lat":-5.0892,"lng":-42.8019},{"key":"ponta_negra","name":"Parque Piauí / Promorar","lat":-5.118,"lng":-42.8424},{"key":"alvorada","name":"Pirajá / Matinha","lat":-5.0757,"lng":-42.8217},{"key":"coroado","name":"Saci / Bela Vista","lat":-5.0982,"lng":-42.7767}],"canonicalKey":"PI-Teresina"},"natal":{"id":"natal","name":"Natal - RN","shortName":"Natal","region":"Nordeste","uf":"RN","ibgePrefix":"24","sefazName":"SEFAZ-RN","sefazDomain":"sefaz.rn.gov.br","heroBadge":"🇧🇷 RN-Natal • Os 15 Maiores Supermercados de Natal","heroTitle":"Economize nos Mercados de Natal - RN","heroSubtitle":"Cotações em 15 redes de Natal: Supermercados Nordestão, SuperFácil Atacado, Atacadão, Assaí Atacadista, Favorito Supermercados, RedeMais Supermercados e mais 9 redes.","priceMultiplier":0.96,"supermarkets":{"db":{"id":"nordestao","name":"Supermercados Nordestão","color":"#D32F2F","unit":"Supermercados Nordestão (Hipermercado)","lat":-5.7717,"lng":-35.1958,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/nordestao.svg"},"nova_era":{"id":"superfacil-atacado","name":"SuperFácil Atacado","color":"#F57C00","unit":"SuperFácil Atacado (Atacarejo)","lat":-5.8017,"lng":-35.1988,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/superfacil-atacado.svg"},"atacadao":{"id":"atacadao","name":"Atacadão","color":"#2E7D32","unit":"Atacadão (Atacarejo)","lat":-5.7387,"lng":-35.1738,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao.svg"},"assai":{"id":"assai","name":"Assaí Atacadista","color":"#1976D2","unit":"Assaí Atacadista (Atacarejo)","lat":-5.7587,"lng":-35.1558,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/assai.svg"},"baratao":{"id":"favorito-rn","name":"Favorito Supermercados","color":"#EF6C00","unit":"Favorito Supermercados (Supermercado)","lat":-5.8057,"lng":-35.1918,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/favorito-rn.svg"},"carrefour":{"id":"redemais-rn","name":"RedeMais Supermercados","color":"#C2185B","unit":"RedeMais Supermercados (Supermercado)","lat":-5.7837,"lng":-35.2038,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/redemais-rn.svg"},"mercadinho_bairro":{"id":"carrefour","name":"Carrefour","color":"#0D47A1","unit":"Carrefour (Hipermercado)","lat":-5.8157,"lng":-35.2488,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/carrefour.svg"},"sacolao_feira":{"id":"super-show-rn","name":"Super Show Supermercados","color":"#283593","unit":"Super Show Supermercados (Supermercado)","lat":-5.7687,"lng":-35.2258,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/super-show-rn.svg"},"m9":{"id":"mix-mateus","name":"Mix Mateus","color":"#0D47A1","unit":"Mix Mateus (Atacarejo)","lat":-5.7937,"lng":-35.1758,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/mix-mateus.svg"},"m10":{"id":"supermercado-queiroz","name":"Queiroz Atacadão","color":"#1565C0","unit":"Queiroz Atacadão (Atacarejo)","lat":-5.7637,"lng":-35.2188,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/supermercado-queiroz.svg"},"m11":{"id":"pao-de-acucar","name":"Pão de Açúcar","color":"#1B5E20","unit":"Pão de Açúcar (Varejo)","lat":-5.8087,"lng":-35.1818,"tier":"medio","tipo":"varejo","tierLabel":"Varejo","logo":"web/assets/logos/pao-de-acucar.svg"},"m12":{"id":"mar-vermelho-rn","name":"Mar Vermelho Supermercados","color":"#B71C1C","unit":"Mar Vermelho Supermercados (Supermercado)","lat":-5.7527,"lng":-35.2218,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/mar-vermelho-rn.svg"},"m13":{"id":"mercadinho-ponta-negra-rn","name":"Mercadinho Ponta Negra","color":"#00695C","unit":"Mercadinho Ponta Negra (Proximidade / Bairro)","lat":-5.7977,"lng":-35.2228,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-ponta-negra-rn.svg"},"m14":{"id":"hortifruti-lagoa-nova","name":"Sacolão Lagoa Nova","color":"#558B2F","unit":"Sacolão Lagoa Nova (Hortifruti & Feira)","lat":-5.7787,"lng":-35.1998,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/hortifruti-lagoa-nova.svg"},"m15":{"id":"feira-do-alecrim","name":"Feira do Alecrim","color":"#33691E","unit":"Feira do Alecrim (Hortifruti & Feira)","lat":-5.7897,"lng":-35.1968,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/feira-do-alecrim.svg"}},"neighborhoods":[{"key":"adrianopolis","name":"Ponta Negra / Capim Macio","lat":-5.7837,"lng":-35.2038},{"key":"flores","name":"Tirol / Petrópolis","lat":-5.8107,"lng":-35.2065},{"key":"cidade_nova","name":"Lagoa Nova / Candelária","lat":-5.754,"lng":-35.184},{"key":"autaz_mirim","name":"Alecrim / Barro Vermelho","lat":-5.772,"lng":-35.1678},{"key":"betania","name":"Nova Parnamirim / Neópolis","lat":-5.8143,"lng":-35.2002},{"key":"centro","name":"Cidade da Esperança","lat":-5.7945,"lng":-35.211},{"key":"ponta_negra","name":"Lagoa Azul / Pajuçara (Z. Norte)","lat":-5.8233,"lng":-35.2515},{"key":"alvorada","name":"Potengi / Igapó","lat":-5.781,"lng":-35.2308},{"key":"coroado","name":"Planalto / Pitimbu","lat":-5.8035,"lng":-35.1858}],"canonicalKey":"RN-Natal"},"joao_pessoa":{"id":"joao_pessoa","name":"João Pessoa - PB","shortName":"João Pessoa","region":"Nordeste","uf":"PB","ibgePrefix":"25","sefazName":"SEFAZ-PB","sefazDomain":"sefaz.pb.gov.br","heroBadge":"🇧🇷 PB-JoaoPessoa • Os 15 Maiores Supermercados de João Pessoa","heroTitle":"Economize nos Mercados de João Pessoa - PB","heroSubtitle":"Cotações em 15 redes de João Pessoa: Supermercado Manaíra, Supermercado Santiago, Mix Mateus, Atacadão, Assaí Atacadista, Supermercado Menor Preço e mais 9 redes.","priceMultiplier":0.95,"supermarkets":{"db":{"id":"supermercado-manaira","name":"Supermercado Manaíra","color":"#D32F2F","unit":"Supermercado Manaíra (Hipermercado)","lat":-7.0967,"lng":-34.8298,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/supermercado-manaira.svg"},"nova_era":{"id":"supermercado-santiago","name":"Supermercado Santiago","color":"#B71C1C","unit":"Supermercado Santiago (Supermercado)","lat":-7.1267,"lng":-34.8328,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-santiago.svg"},"atacadao":{"id":"mix-mateus","name":"Mix Mateus","color":"#0D47A1","unit":"Mix Mateus (Atacarejo)","lat":-7.0637,"lng":-34.8078,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/mix-mateus.svg"},"assai":{"id":"atacadao","name":"Atacadão","color":"#2E7D32","unit":"Atacadão (Atacarejo)","lat":-7.0837,"lng":-34.7898,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao.svg"},"baratao":{"id":"assai","name":"Assaí Atacadista","color":"#1976D2","unit":"Assaí Atacadista (Atacarejo)","lat":-7.1307,"lng":-34.8258,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/assai.svg"},"carrefour":{"id":"menor-preco-pb","name":"Supermercado Menor Preço","color":"#C2185B","unit":"Supermercado Menor Preço (Supermercado)","lat":-7.1087,"lng":-34.8378,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/menor-preco-pb.svg"},"mercadinho_bairro":{"id":"rede-bemais","name":"Rede Bemais","color":"#283593","unit":"Rede Bemais (Supermercado)","lat":-7.1407,"lng":-34.8828,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/rede-bemais.svg"},"sacolao_feira":{"id":"superbox-brasil","name":"SuperBox Brasil","color":"#EF6C00","unit":"SuperBox Brasil (Atacarejo)","lat":-7.0937,"lng":-34.8598,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/superbox-brasil.svg"},"m9":{"id":"do-dia-supermercados","name":"DoDia Supermercados","color":"#00838F","unit":"DoDia Supermercados (Supermercado)","lat":-7.1187,"lng":-34.8098,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/do-dia-supermercados.svg"},"m10":{"id":"latorre-supermercados","name":"LaTorre Supermercados","color":"#1565C0","unit":"LaTorre Supermercados (Supermercado)","lat":-7.0887,"lng":-34.8528,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/latorre-supermercados.svg"},"m11":{"id":"pao-de-acucar","name":"Pão de Açúcar","color":"#1B5E20","unit":"Pão de Açúcar (Varejo)","lat":-7.1337,"lng":-34.8158,"tier":"medio","tipo":"varejo","tierLabel":"Varejo","logo":"web/assets/logos/pao-de-acucar.svg"},"m12":{"id":"carrefour","name":"Carrefour","color":"#0D47A1","unit":"Carrefour (Hipermercado)","lat":-7.0777,"lng":-34.8558,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/carrefour.svg"},"m13":{"id":"mercadinho-tambau","name":"Mercadinho Tambaú","color":"#00695C","unit":"Mercadinho Tambaú (Proximidade / Bairro)","lat":-7.1227,"lng":-34.8568,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-tambau.svg"},"m14":{"id":"mercado-da-torre-jp","name":"Mercado Público da Torre","color":"#558B2F","unit":"Mercado Público da Torre (Hortifruti & Feira)","lat":-7.1037,"lng":-34.8338,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/mercado-da-torre-jp.svg"},"m15":{"id":"mercado-central-jp","name":"Mercado Central João Pessoa","color":"#33691E","unit":"Mercado Central João Pessoa (Hortifruti & Feira)","lat":-7.1147,"lng":-34.8308,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/mercado-central-jp.svg"}},"neighborhoods":[{"key":"adrianopolis","name":"Manaíra / Tambaú","lat":-7.1087,"lng":-34.8378},{"key":"flores","name":"Cabo Branco / Altiplano","lat":-7.1357,"lng":-34.8405},{"key":"cidade_nova","name":"Bessa / Jardim Oceania","lat":-7.079,"lng":-34.818},{"key":"autaz_mirim","name":"Bancários / Jardim Cidade Universitária","lat":-7.097,"lng":-34.8018},{"key":"betania","name":"Mangabeira / Valentina","lat":-7.1393,"lng":-34.8342},{"key":"centro","name":"Torre / Expedicionários","lat":-7.1195,"lng":-34.845},{"key":"ponta_negra","name":"Cristo Redentor / Geisel","lat":-7.1483,"lng":-34.8855},{"key":"alvorada","name":"Estados / Pedro Gondim","lat":-7.106,"lng":-34.8648},{"key":"coroado","name":"Centro JP","lat":-7.1285,"lng":-34.8198}],"canonicalKey":"PB-JoaoPessoa"},"maceio":{"id":"maceio","name":"Maceió - AL","shortName":"Maceió","region":"Nordeste","uf":"AL","ibgePrefix":"27","sefazName":"SEFAZ-AL","sefazDomain":"sefaz.al.gov.br","heroBadge":"🇧🇷 AL-Maceio • Os 15 Maiores Supermercados de Maceió","heroTitle":"Economize nos Mercados de Maceió - AL","heroSubtitle":"Cotações em 15 redes de Maceió: Palato Supermercados, Unicompra Supermercados, Mix Mateus, Atacadão, Assaí Atacadista, GBarbosa e mais 9 redes.","priceMultiplier":0.96,"supermarkets":{"db":{"id":"palato","name":"Palato Supermercados","color":"#D32F2F","unit":"Palato Supermercados (Premium)","lat":-9.643,"lng":-35.7201,"tier":"medio","tipo":"premium","tierLabel":"Premium","logo":"web/assets/logos/palato.svg"},"nova_era":{"id":"unicompra","name":"Unicompra Supermercados","color":"#C2185B","unit":"Unicompra Supermercados (Supermercado)","lat":-9.673,"lng":-35.7231,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/unicompra.svg"},"atacadao":{"id":"mix-mateus","name":"Mix Mateus","color":"#0D47A1","unit":"Mix Mateus (Atacarejo)","lat":-9.61,"lng":-35.6981,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/mix-mateus.svg"},"assai":{"id":"atacadao","name":"Atacadão","color":"#2E7D32","unit":"Atacadão (Atacarejo)","lat":-9.63,"lng":-35.6801,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao.svg"},"baratao":{"id":"assai","name":"Assaí Atacadista","color":"#1976D2","unit":"Assaí Atacadista (Atacarejo)","lat":-9.677,"lng":-35.7161,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/assai.svg"},"carrefour":{"id":"gbarbosa","name":"GBarbosa","color":"#283593","unit":"GBarbosa (Hipermercado)","lat":-9.655,"lng":-35.7281,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/gbarbosa.svg"},"mercadinho_bairro":{"id":"cesta-de-alimentos","name":"Cesta de Alimentos","color":"#EF6C00","unit":"Cesta de Alimentos (Supermercado)","lat":-9.687,"lng":-35.7731,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/cesta-de-alimentos.svg"},"sacolao_feira":{"id":"super-giro-al","name":"Super Giro","color":"#00838F","unit":"Super Giro (Supermercado)","lat":-9.64,"lng":-35.7501,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/super-giro-al.svg"},"m9":{"id":"sao-domingos-al","name":"Supermercado São Domingos","color":"#1565C0","unit":"Supermercado São Domingos (Supermercado)","lat":-9.665,"lng":-35.7001,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/sao-domingos-al.svg"},"m10":{"id":"pao-de-acucar","name":"Pão de Açúcar","color":"#1B5E20","unit":"Pão de Açúcar (Varejo)","lat":-9.635,"lng":-35.7431,"tier":"medio","tipo":"varejo","tierLabel":"Varejo","logo":"web/assets/logos/pao-de-acucar.svg"},"m11":{"id":"ideal-supermercados-al","name":"Ideal Supermercados","color":"#6A1B9A","unit":"Ideal Supermercados (Supermercado)","lat":-9.68,"lng":-35.7061,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/ideal-supermercados-al.svg"},"m12":{"id":"supermercado-lopes-al","name":"Supermercado Lopes AL","color":"#4E342E","unit":"Supermercado Lopes AL (Proximidade / Bairro)","lat":-9.624,"lng":-35.7461,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/supermercado-lopes-al.svg"},"m13":{"id":"mercadinho-jatiuca","name":"Mercadinho Jatiúca","color":"#00695C","unit":"Mercadinho Jatiúca (Proximidade / Bairro)","lat":-9.669,"lng":-35.7471,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-jatiuca.svg"},"m14":{"id":"sacolao-ponta-verde","name":"Hortifruti Ponta Verde","color":"#558B2F","unit":"Hortifruti Ponta Verde (Hortifruti & Feira)","lat":-9.65,"lng":-35.7241,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/sacolao-ponta-verde.svg"},"m15":{"id":"mercado-da-producao","name":"Mercado da Produção","color":"#33691E","unit":"Mercado da Produção (Hortifruti & Feira)","lat":-9.661,"lng":-35.7211,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/mercado-da-producao.svg"}},"neighborhoods":[{"key":"adrianopolis","name":"Ponta Verde / Pajuçara","lat":-9.655,"lng":-35.7281},{"key":"flores","name":"Jatiúca / Mangabeiras","lat":-9.682,"lng":-35.7308},{"key":"cidade_nova","name":"Farol / Pinheiro","lat":-9.6253,"lng":-35.7083},{"key":"autaz_mirim","name":"Serraria / Antares","lat":-9.6433,"lng":-35.6921},{"key":"betania","name":"Tabuleiro do Martins","lat":-9.6856,"lng":-35.7245},{"key":"centro","name":"Benedito Bentes","lat":-9.6658,"lng":-35.7353},{"key":"ponta_negra","name":"Poço / Jaraguá","lat":-9.6946,"lng":-35.7758},{"key":"alvorada","name":"Cruz das Almas / Jacintinho","lat":-9.6523,"lng":-35.7551},{"key":"coroado","name":"Gruta de Lourdes","lat":-9.6748,"lng":-35.7101}],"canonicalKey":"AL-Maceio"},"aracaju":{"id":"aracaju","name":"Aracaju - SE","shortName":"Aracaju","region":"Nordeste","uf":"SE","ibgePrefix":"28","sefazName":"SEFAZ-SE","sefazDomain":"sefaz.se.gov.br","heroBadge":"🇧🇷 SE-Aracaju • Os 15 Maiores Supermercados de Aracaju","heroTitle":"Economize nos Mercados de Aracaju - SE","heroSubtitle":"Cotações em 15 redes de Aracaju: GBarbosa, Mix Mateus, Atacadão, Assaí Atacadista, Supermercado Bombom, Massimo Supermercados e mais 9 redes.","priceMultiplier":0.96,"supermarkets":{"db":{"id":"gbarbosa","name":"GBarbosa","color":"#D32F2F","unit":"GBarbosa (Hipermercado)","lat":-10.9244,"lng":-37.0579,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/gbarbosa.svg"},"nova_era":{"id":"mix-mateus","name":"Mix Mateus","color":"#0D47A1","unit":"Mix Mateus (Atacarejo)","lat":-10.9544,"lng":-37.0609,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/mix-mateus.svg"},"atacadao":{"id":"atacadao","name":"Atacadão","color":"#2E7D32","unit":"Atacadão (Atacarejo)","lat":-10.8914,"lng":-37.0359,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao.svg"},"assai":{"id":"assai","name":"Assaí Atacadista","color":"#1976D2","unit":"Assaí Atacadista (Atacarejo)","lat":-10.9114,"lng":-37.0179,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/assai.svg"},"baratao":{"id":"supermercado-bombom","name":"Supermercado Bombom","color":"#C2185B","unit":"Supermercado Bombom (Supermercado)","lat":-10.9584,"lng":-37.0539,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-bombom.svg"},"carrefour":{"id":"massimo-supermercados","name":"Massimo Supermercados","color":"#283593","unit":"Massimo Supermercados (Premium)","lat":-10.9364,"lng":-37.0659,"tier":"medio","tipo":"premium","tierLabel":"Premium","logo":"web/assets/logos/massimo-supermercados.svg"},"mercadinho_bairro":{"id":"menor-preco-se","name":"Rede Menor Preço SE","color":"#EF6C00","unit":"Rede Menor Preço SE (Supermercado)","lat":-10.9684,"lng":-37.1109,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/menor-preco-se.svg"},"sacolao_feira":{"id":"pao-de-acucar","name":"Pão de Açúcar","color":"#1B5E20","unit":"Pão de Açúcar (Varejo)","lat":-10.9214,"lng":-37.0879,"tier":"medio","tipo":"varejo","tierLabel":"Varejo","logo":"web/assets/logos/pao-de-acucar.svg"},"m9":{"id":"mercantil-rodrigues","name":"Mercantil Rodrigues","color":"#1565C0","unit":"Mercantil Rodrigues (Atacarejo)","lat":-10.9464,"lng":-37.0379,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/mercantil-rodrigues.svg"},"m10":{"id":"supermercado-popular-se","name":"Supermercado Popular Aju","color":"#00838F","unit":"Supermercado Popular Aju (Supermercado)","lat":-10.9164,"lng":-37.0809,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-popular-se.svg"},"m11":{"id":"hiper-carnes-se","name":"Hiper Carnes Aracaju","color":"#B71C1C","unit":"Hiper Carnes Aracaju (Supermercado)","lat":-10.9614,"lng":-37.0439,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/hiper-carnes-se.svg"},"m12":{"id":"todo-dia-se","name":"TodoDia Aracaju","color":"#2E7D32","unit":"TodoDia Aracaju (Proximidade / Bairro)","lat":-10.9054,"lng":-37.0839,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/todo-dia-se.svg"},"m13":{"id":"mercadinho-atalaia","name":"Mercadinho Atalaia","color":"#00695C","unit":"Mercadinho Atalaia (Proximidade / Bairro)","lat":-10.9504,"lng":-37.0849,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-atalaia.svg"},"m14":{"id":"hortifruti-jardins-se","name":"Hortifruti Jardins","color":"#558B2F","unit":"Hortifruti Jardins (Hortifruti & Feira)","lat":-10.9314,"lng":-37.0619,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/hortifruti-jardins-se.svg"},"m15":{"id":"mercado-albano-franco","name":"Mercado Albano Franco","color":"#33691E","unit":"Mercado Albano Franco (Hortifruti & Feira)","lat":-10.9424,"lng":-37.0589,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/mercado-albano-franco.svg"}},"neighborhoods":[{"key":"adrianopolis","name":"Jardins / 13 de Julho","lat":-10.9364,"lng":-37.0659},{"key":"flores","name":"Atalaia / Coroa do Meio","lat":-10.9634,"lng":-37.0686},{"key":"cidade_nova","name":"Farolândia / Inácio Barbosa","lat":-10.9067,"lng":-37.0461},{"key":"autaz_mirim","name":"Luzia / Grageru","lat":-10.9247,"lng":-37.0299},{"key":"betania","name":"Centro / São José","lat":-10.967,"lng":-37.0623},{"key":"centro","name":"Siqueira Campos / Pereira Lobo","lat":-10.9472,"lng":-37.0731},{"key":"ponta_negra","name":"Jabotiana / Ponto Novo","lat":-10.976,"lng":-37.1136},{"key":"alvorada","name":"Santos Dumont / Bugio","lat":-10.9337,"lng":-37.0929},{"key":"coroado","name":"Aruana / Mosqueiro","lat":-10.9562,"lng":-37.0479}],"canonicalKey":"SE-Aracaju"},"brasilia":{"id":"brasilia","name":"Brasília - DF","shortName":"Brasília","region":"Centro-Oeste","uf":"DF","ibgePrefix":"53","sefazName":"SEFAZ-DF","sefazDomain":"sefaz.df.gov.br","heroBadge":"🇧🇷 DF-Brasilia • Os 15 Maiores Supermercados de Brasília","heroTitle":"Economize nos Mercados de Brasília - DF","heroSubtitle":"Cotações em 15 redes de Brasília: Super Adega Atacadista, Big Box Supermercados, Atacadão Dia a Dia, Atacadão, Assaí Atacadista, Carrefour e mais 9 redes.","priceMultiplier":0.99,"supermarkets":{"db":{"id":"super-adega","name":"Super Adega Atacadista","color":"#F57C00","unit":"Super Adega Atacadista (Atacarejo)","lat":-15.771,"lng":-47.8675,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/super-adega.svg"},"nova_era":{"id":"big-box","name":"Big Box Supermercados","color":"#D32F2F","unit":"Big Box Supermercados (Supermercado)","lat":-15.801,"lng":-47.8705,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/big-box.svg"},"atacadao":{"id":"atacadao-dia-a-dia","name":"Atacadão Dia a Dia","color":"#2E7D32","unit":"Atacadão Dia a Dia (Atacarejo)","lat":-15.738,"lng":-47.8455,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao-dia-a-dia.svg"},"assai":{"id":"atacadao","name":"Atacadão","color":"#2E7D32","unit":"Atacadão (Atacarejo)","lat":-15.758,"lng":-47.8275,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao.svg"},"baratao":{"id":"assai","name":"Assaí Atacadista","color":"#1976D2","unit":"Assaí Atacadista (Atacarejo)","lat":-15.805,"lng":-47.8635,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/assai.svg"},"carrefour":{"id":"carrefour","name":"Carrefour","color":"#0D47A1","unit":"Carrefour (Hipermercado)","lat":-15.783,"lng":-47.8755,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/carrefour.svg"},"mercadinho_bairro":{"id":"pao-de-acucar","name":"Pão de Açúcar","color":"#1B5E20","unit":"Pão de Açúcar (Varejo)","lat":-15.815,"lng":-47.9205,"tier":"medio","tipo":"varejo","tierLabel":"Varejo","logo":"web/assets/logos/pao-de-acucar.svg"},"sacolao_feira":{"id":"dona-de-casa","name":"Dona de Casa Supermercados","color":"#C2185B","unit":"Dona de Casa Supermercados (Supermercado)","lat":-15.768,"lng":-47.8975,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/dona-de-casa.svg"},"m9":{"id":"supermercado-veneza-df","name":"Supermercado Veneza DF","color":"#283593","unit":"Supermercado Veneza DF (Supermercado)","lat":-15.793,"lng":-47.8475,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-veneza-df.svg"},"m10":{"id":"vivendas-supermercados","name":"Supermercado Vivendas","color":"#00838F","unit":"Supermercado Vivendas (Supermercado)","lat":-15.763,"lng":-47.8905,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/vivendas-supermercados.svg"},"m11":{"id":"superbom-df","name":"Superbom Brasília","color":"#1565C0","unit":"Superbom Brasília (Supermercado)","lat":-15.808,"lng":-47.8535,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/superbom-df.svg"},"m12":{"id":"oba-hortifruti","name":"Oba Hortifruti","color":"#33691E","unit":"Oba Hortifruti (Hortifruti & Feira)","lat":-15.752,"lng":-47.8935,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/oba-hortifruti.svg"},"m13":{"id":"ultrafacil-box","name":"UltraBox Atacarejo","color":"#EF6C00","unit":"UltraBox Atacarejo (Atacarejo)","lat":-15.797,"lng":-47.8945,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/ultrafacil-box.svg"},"m14":{"id":"mercadinho-da-comercial","name":"Mercadinho da Comercial","color":"#00695C","unit":"Mercadinho da Comercial (Proximidade / Bairro)","lat":-15.778,"lng":-47.8715,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-da-comercial.svg"},"m15":{"id":"feira-do-guara-ceasa","name":"Feira do Guará & Ceasa DF","color":"#558B2F","unit":"Feira do Guará & Ceasa DF (Hortifruti & Feira)","lat":-15.789,"lng":-47.8685,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/feira-do-guara-ceasa.svg"}},"neighborhoods":[{"key":"adrianopolis","name":"Asa Sul / Sudoeste","lat":-15.783,"lng":-47.8755},{"key":"flores","name":"Asa Norte / Noroeste","lat":-15.81,"lng":-47.8782},{"key":"cidade_nova","name":"Águas Claras / Vicente Pires","lat":-15.7533,"lng":-47.8557},{"key":"autaz_mirim","name":"Taguatinga / Ceilândia","lat":-15.7713,"lng":-47.8395},{"key":"betania","name":"Guará I e II","lat":-15.8136,"lng":-47.8719},{"key":"centro","name":"Plano Piloto / Esplanada","lat":-15.7938,"lng":-47.8827},{"key":"ponta_negra","name":"Lago Sul / Jardim Botânico","lat":-15.8226,"lng":-47.9232},{"key":"alvorada","name":"Samambaia / Recanto","lat":-15.7803,"lng":-47.9025},{"key":"coroado","name":"Sobradinho / Planaltina","lat":-15.8028,"lng":-47.8575}],"canonicalKey":"DF-Brasilia"},"goiania":{"id":"goiania","name":"Goiânia - GO","shortName":"Goiânia","region":"Centro-Oeste","uf":"GO","ibgePrefix":"52","sefazName":"SEFAZ-GO","sefazDomain":"sefaz.go.gov.br","heroBadge":"🇧🇷 GO-Goiania • Os 15 Maiores Supermercados de Goiânia","heroTitle":"Economize nos Mercados de Goiânia - GO","heroSubtitle":"Cotações em 15 redes de Goiânia: Bretas Supermercados, Barão Supermercados, Atacadão, Assaí Atacadista, Tatico Supermercados, Carrefour e mais 9 redes.","priceMultiplier":0.96,"supermarkets":{"db":{"id":"bretas","name":"Bretas Supermercados","color":"#D32F2F","unit":"Bretas Supermercados (Hipermercado)","lat":-16.6641,"lng":-49.2496,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/bretas.svg"},"nova_era":{"id":"barao-supermercados","name":"Barão Supermercados","color":"#F57C00","unit":"Barão Supermercados (Supermercado)","lat":-16.6941,"lng":-49.2526,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/barao-supermercados.svg"},"atacadao":{"id":"atacadao","name":"Atacadão","color":"#2E7D32","unit":"Atacadão (Atacarejo)","lat":-16.6311,"lng":-49.2276,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao.svg"},"assai":{"id":"assai","name":"Assaí Atacadista","color":"#1976D2","unit":"Assaí Atacadista (Atacarejo)","lat":-16.6511,"lng":-49.2096,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/assai.svg"},"baratao":{"id":"tatico","name":"Tatico Supermercados","color":"#C2185B","unit":"Tatico Supermercados (Atacarejo)","lat":-16.6981,"lng":-49.2456,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/tatico.svg"},"carrefour":{"id":"carrefour","name":"Carrefour","color":"#0D47A1","unit":"Carrefour (Hipermercado)","lat":-16.6761,"lng":-49.2576,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/carrefour.svg"},"mercadinho_bairro":{"id":"pao-de-acucar","name":"Pão de Açúcar","color":"#1B5E20","unit":"Pão de Açúcar (Varejo)","lat":-16.7081,"lng":-49.3026,"tier":"medio","tipo":"varejo","tierLabel":"Varejo","logo":"web/assets/logos/pao-de-acucar.svg"},"sacolao_feira":{"id":"emporio-prime","name":"Empório Prime","color":"#4E342E","unit":"Empório Prime (Premium)","lat":-16.6611,"lng":-49.2796,"tier":"medio","tipo":"premium","tierLabel":"Premium","logo":"web/assets/logos/emporio-prime.svg"},"m9":{"id":"pro-brazilian","name":"Pró Brazilian","color":"#283593","unit":"Pró Brazilian (Supermercado)","lat":-16.6861,"lng":-49.2296,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/pro-brazilian.svg"},"m10":{"id":"atacadao-dia-a-dia","name":"Atacadão Dia a Dia GO","color":"#00838F","unit":"Atacadão Dia a Dia GO (Atacarejo)","lat":-16.6561,"lng":-49.2726,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao-dia-a-dia.svg"},"m11":{"id":"supermercado-store-go","name":"Store Supermercados","color":"#1565C0","unit":"Store Supermercados (Supermercado)","lat":-16.7011,"lng":-49.2356,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-store-go.svg"},"m12":{"id":"oba-hortifruti","name":"Oba Hortifruti","color":"#33691E","unit":"Oba Hortifruti (Hortifruti & Feira)","lat":-16.6451,"lng":-49.2756,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/oba-hortifruti.svg"},"m13":{"id":"supermercado-moreira","name":"Hiper Moreira","color":"#B71C1C","unit":"Hiper Moreira (Hipermercado)","lat":-16.6901,"lng":-49.2766,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/supermercado-moreira.svg"},"m14":{"id":"mercadinho-setor-bueno","name":"Mercadinho Setor Bueno","color":"#00695C","unit":"Mercadinho Setor Bueno (Proximidade / Bairro)","lat":-16.6711,"lng":-49.2536,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-setor-bueno.svg"},"m15":{"id":"feira-do-cepal-go","name":"Feira do Cepal & Cerrado","color":"#558B2F","unit":"Feira do Cepal & Cerrado (Hortifruti & Feira)","lat":-16.6821,"lng":-49.2506,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/feira-do-cepal-go.svg"}},"neighborhoods":[{"key":"adrianopolis","name":"Setor Bueno / Oeste","lat":-16.6761,"lng":-49.2576},{"key":"flores","name":"Setor Marista / Sul","lat":-16.7031,"lng":-49.2603},{"key":"cidade_nova","name":"Jardim Goiás / Flamboyant","lat":-16.6464,"lng":-49.2378},{"key":"autaz_mirim","name":"Jardim América / Nova Suíça","lat":-16.6644,"lng":-49.2216},{"key":"betania","name":"Setor Campinas / Central","lat":-16.7067,"lng":-49.254},{"key":"centro","name":"Setor Pedro Ludovico","lat":-16.6869,"lng":-49.2648},{"key":"ponta_negra","name":"Parque Amazônia","lat":-16.7157,"lng":-49.3053},{"key":"alvorada","name":"Jardim Guanabara / Norte","lat":-16.6734,"lng":-49.2846},{"key":"coroado","name":"Setor Universitário","lat":-16.6959,"lng":-49.2396}],"canonicalKey":"GO-Goiania"},"cuiaba":{"id":"cuiaba","name":"Cuiabá - MT","shortName":"Cuiabá","region":"Centro-Oeste","uf":"MT","ibgePrefix":"51","sefazName":"SEFAZ-MT","sefazDomain":"sefaz.mt.gov.br","heroBadge":"🇧🇷 MT-Cuiaba • Os 15 Maiores Supermercados de Cuiabá","heroTitle":"Economize nos Mercados de Cuiabá - MT","heroSubtitle":"Cotações em 15 redes de Cuiabá: Comper Supermercados, BigLar Supermercados, Fort Atacadista, Atacadão, Assaí Atacadista, Supermercados Machado e mais 9 redes.","priceMultiplier":0.98,"supermarkets":{"db":{"id":"comper","name":"Comper Supermercados","color":"#D32F2F","unit":"Comper Supermercados (Hipermercado)","lat":-15.5786,"lng":-56.0827,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/comper.svg"},"nova_era":{"id":"biglar","name":"BigLar Supermercados","color":"#F57C00","unit":"BigLar Supermercados (Premium)","lat":-15.6086,"lng":-56.0857,"tier":"medio","tipo":"premium","tierLabel":"Premium","logo":"web/assets/logos/biglar.svg"},"atacadao":{"id":"fort-atacadista","name":"Fort Atacadista","color":"#1565C0","unit":"Fort Atacadista (Atacarejo)","lat":-15.5456,"lng":-56.0607,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/fort-atacadista.svg"},"assai":{"id":"atacadao","name":"Atacadão","color":"#2E7D32","unit":"Atacadão (Atacarejo)","lat":-15.5656,"lng":-56.0427,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao.svg"},"baratao":{"id":"assai","name":"Assaí Atacadista","color":"#1976D2","unit":"Assaí Atacadista (Atacarejo)","lat":-15.6126,"lng":-56.0787,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/assai.svg"},"carrefour":{"id":"supermercados-machado","name":"Supermercados Machado","color":"#C2185B","unit":"Supermercados Machado (Supermercado)","lat":-15.5906,"lng":-56.0907,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercados-machado.svg"},"mercadinho_bairro":{"id":"america-supermercados","name":"América Supermercados","color":"#283593","unit":"América Supermercados (Supermercado)","lat":-15.6226,"lng":-56.1357,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/america-supermercados.svg"},"sacolao_feira":{"id":"tropical-supermercados-mt","name":"Tropical Supermercados","color":"#00838F","unit":"Tropical Supermercados (Supermercado)","lat":-15.5756,"lng":-56.1127,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/tropical-supermercados-mt.svg"},"m9":{"id":"supermercado-imperial-mt","name":"Supermercado Imperial","color":"#EF6C00","unit":"Supermercado Imperial (Supermercado)","lat":-15.6006,"lng":-56.0627,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-imperial-mt.svg"},"m10":{"id":"supermercado-alvorada-mt","name":"Supermercado Alvorada CBA","color":"#6A1B9A","unit":"Supermercado Alvorada CBA (Supermercado)","lat":-15.5706,"lng":-56.1057,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-alvorada-mt.svg"},"m11":{"id":"atacado-pantanal","name":"Pantanal Atacado","color":"#2E7D32","unit":"Pantanal Atacado (Atacarejo)","lat":-15.6156,"lng":-56.0687,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacado-pantanal.svg"},"m12":{"id":"minimercado-cpa","name":"Mercadinho do CPA","color":"#00796B","unit":"Mercadinho do CPA (Proximidade / Bairro)","lat":-15.5596,"lng":-56.1087,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/minimercado-cpa.svg"},"m13":{"id":"mercadinho-coxipo","name":"Mercadinho Coxipó","color":"#00695C","unit":"Mercadinho Coxipó (Proximidade / Bairro)","lat":-15.6046,"lng":-56.1097,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-coxipo.svg"},"m14":{"id":"hortifruti-goiabeiras","name":"Sacolão Goiabeiras","color":"#558B2F","unit":"Sacolão Goiabeiras (Hortifruti & Feira)","lat":-15.5856,"lng":-56.0867,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/hortifruti-goiabeiras.svg"},"m15":{"id":"mercado-do-porto-cba","name":"Mercado do Porto Cuiabá","color":"#33691E","unit":"Mercado do Porto Cuiabá (Hortifruti & Feira)","lat":-15.5966,"lng":-56.0837,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/mercado-do-porto-cba.svg"}},"neighborhoods":[{"key":"adrianopolis","name":"Goiabeiras / Duque de Caxias","lat":-15.5906,"lng":-56.0907},{"key":"flores","name":"Jardim das Américas / Boa Esperança","lat":-15.6176,"lng":-56.0934},{"key":"cidade_nova","name":"CPA I, II, III e IV","lat":-15.5609,"lng":-56.0709},{"key":"autaz_mirim","name":"Bosque da Saúde / Alvorada","lat":-15.5789,"lng":-56.0547},{"key":"betania","name":"Coxipó / Tijucal","lat":-15.6212,"lng":-56.0871},{"key":"centro","name":"Centro Norte / Araés","lat":-15.6014,"lng":-56.0979},{"key":"ponta_negra","name":"Porto / Dom Aquino","lat":-15.6302,"lng":-56.1384},{"key":"alvorada","name":"Pedra 90","lat":-15.5879,"lng":-56.1177},{"key":"coroado","name":"Santa Rosa / Quilombo","lat":-15.6104,"lng":-56.0727}],"canonicalKey":"MT-Cuiaba"},"campo_grande":{"id":"campo_grande","name":"Campo Grande - MS","shortName":"Campo Grande","region":"Centro-Oeste","uf":"MS","ibgePrefix":"50","sefazName":"SEFAZ-MS","sefazDomain":"sefaz.ms.gov.br","heroBadge":"🇧🇷 MS-CampoGrande • Os 15 Maiores Supermercados de Campo Grande","heroTitle":"Economize nos Mercados de Campo Grande - MS","heroSubtitle":"Cotações em 15 redes de Campo Grande: Comper Supermercados, Fort Atacadista, Atacadão, Assaí Atacadista, Carrefour, Mister Júnior e mais 9 redes.","priceMultiplier":0.96,"supermarkets":{"db":{"id":"comper","name":"Comper Supermercados","color":"#D32F2F","unit":"Comper Supermercados (Hipermercado)","lat":-20.4469,"lng":-54.6049,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/comper.svg"},"nova_era":{"id":"fort-atacadista","name":"Fort Atacadista","color":"#1565C0","unit":"Fort Atacadista (Atacarejo)","lat":-20.4769,"lng":-54.6079,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/fort-atacadista.svg"},"atacadao":{"id":"atacadao","name":"Atacadão","color":"#2E7D32","unit":"Atacadão (Atacarejo)","lat":-20.4139,"lng":-54.5829,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao.svg"},"assai":{"id":"assai","name":"Assaí Atacadista","color":"#1976D2","unit":"Assaí Atacadista (Atacarejo)","lat":-20.4339,"lng":-54.5649,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/assai.svg"},"baratao":{"id":"carrefour","name":"Carrefour","color":"#0D47A1","unit":"Carrefour (Hipermercado)","lat":-20.4809,"lng":-54.6009,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/carrefour.svg"},"carrefour":{"id":"mister-junior","name":"Mister Júnior","color":"#C2185B","unit":"Mister Júnior (Supermercado)","lat":-20.4589,"lng":-54.6129,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/mister-junior.svg"},"mercadinho_bairro":{"id":"supermercado-pires","name":"Supermercado Pires","color":"#283593","unit":"Supermercado Pires (Supermercado)","lat":-20.4909,"lng":-54.6579,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-pires.svg"},"sacolao_feira":{"id":"supermercado-legal-ms","name":"Supermercado Legal","color":"#EF6C00","unit":"Supermercado Legal (Supermercado)","lat":-20.4439,"lng":-54.6349,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-legal-ms.svg"},"m9":{"id":"supermercado-nunes-ms","name":"Supermercado Nunes","color":"#00838F","unit":"Supermercado Nunes (Supermercado)","lat":-20.4689,"lng":-54.5849,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-nunes-ms.svg"},"m10":{"id":"supermercado-estrela-ms","name":"Supermercado Estrela CG","color":"#6A1B9A","unit":"Supermercado Estrela CG (Supermercado)","lat":-20.4389,"lng":-54.6279,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-estrela-ms.svg"},"m11":{"id":"pao-de-acucar","name":"Pão de Açúcar","color":"#1B5E20","unit":"Pão de Açúcar (Varejo)","lat":-20.4839,"lng":-54.5909,"tier":"medio","tipo":"varejo","tierLabel":"Varejo","logo":"web/assets/logos/pao-de-acucar.svg"},"m12":{"id":"maxi-compras-ms","name":"Maxi Compras","color":"#B71C1C","unit":"Maxi Compras (Supermercado)","lat":-20.4279,"lng":-54.6309,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/maxi-compras-ms.svg"},"m13":{"id":"mercadinho-tiradentes-ms","name":"Mercadinho Tiradentes","color":"#00695C","unit":"Mercadinho Tiradentes (Proximidade / Bairro)","lat":-20.4729,"lng":-54.6319,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-tiradentes-ms.svg"},"m14":{"id":"hortifruti-estados-ms","name":"Sacolão Jardim dos Estados","color":"#558B2F","unit":"Sacolão Jardim dos Estados (Hortifruti & Feira)","lat":-20.4539,"lng":-54.6089,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/hortifruti-estados-ms.svg"},"m15":{"id":"mercadao-municipal-cg","name":"Mercadão Municipal CG","color":"#33691E","unit":"Mercadão Municipal CG (Hortifruti & Feira)","lat":-20.4649,"lng":-54.6059,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/mercadao-municipal-cg.svg"}},"neighborhoods":[{"key":"adrianopolis","name":"Jardim dos Estados / Santa Fé","lat":-20.4589,"lng":-54.6129},{"key":"flores","name":"Centro / Amambaí","lat":-20.4859,"lng":-54.6156},{"key":"cidade_nova","name":"Tiradentes / Rita Vieira","lat":-20.4292,"lng":-54.5931},{"key":"autaz_mirim","name":"Aero Rancho / Parati","lat":-20.4472,"lng":-54.5769},{"key":"betania","name":"Moreninhas / Universitário","lat":-20.4895,"lng":-54.6093},{"key":"centro","name":"Coronel Antonino / Monte Castelo","lat":-20.4697,"lng":-54.6201},{"key":"ponta_negra","name":"Carandá Bosque","lat":-20.4985,"lng":-54.6606},{"key":"alvorada","name":"Vila Planalto","lat":-20.4562,"lng":-54.6399},{"key":"coroado","name":"Nova Lima","lat":-20.4787,"lng":-54.5949}],"canonicalKey":"MS-CampoGrande"},"sao_paulo":{"id":"sao_paulo","name":"São Paulo - SP","shortName":"São Paulo","region":"Sudeste","uf":"SP","ibgePrefix":"35","sefazName":"SEFAZ-SP","sefazDomain":"sefaz.sp.gov.br","heroBadge":"🇧🇷 SP-SaoPaulo • Os 15 Maiores Supermercados de São Paulo","heroTitle":"Economize nos Mercados de São Paulo - SP","heroSubtitle":"Cotações em 15 redes de São Paulo: Pão de Açúcar, Carrefour, Atacadão, Assaí Atacadista, Sonda Supermercados, Mambo e mais 9 redes.","priceMultiplier":0.95,"supermarkets":{"db":{"id":"pao-de-acucar","name":"Pão de Açúcar","color":"#1B5E20","unit":"Pão de Açúcar (Varejo)","lat":-23.5277,"lng":-46.6181,"tier":"medio","tipo":"varejo","tierLabel":"Varejo","logo":"web/assets/logos/pao-de-acucar.svg"},"nova_era":{"id":"carrefour","name":"Carrefour","color":"#0D47A1","unit":"Carrefour (Hipermercado)","lat":-23.5577,"lng":-46.6211,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/carrefour.svg"},"atacadao":{"id":"atacadao","name":"Atacadão","color":"#2E7D32","unit":"Atacadão (Atacarejo)","lat":-23.4947,"lng":-46.5961,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao.svg"},"assai":{"id":"assai","name":"Assaí Atacadista","color":"#1976D2","unit":"Assaí Atacadista (Atacarejo)","lat":-23.5147,"lng":-46.5781,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/assai.svg"},"baratao":{"id":"sonda","name":"Sonda Supermercados","color":"#F57C00","unit":"Sonda Supermercados (Supermercado)","lat":-23.5617,"lng":-46.6141,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/sonda.svg"},"carrefour":{"id":"mambo","name":"Mambo","color":"#C2185B","unit":"Mambo (Premium)","lat":-23.5397,"lng":-46.6261,"tier":"medio","tipo":"premium","tierLabel":"Premium","logo":"web/assets/logos/mambo.svg"},"mercadinho_bairro":{"id":"st-marche","name":"St. Marche","color":"#4E342E","unit":"St. Marche (Premium)","lat":-23.5717,"lng":-46.6711,"tier":"medio","tipo":"premium","tierLabel":"Premium","logo":"web/assets/logos/st-marche.svg"},"sacolao_feira":{"id":"dia","name":"Dia","color":"#D32F2F","unit":"Dia (Proximidade / Bairro)","lat":-23.5247,"lng":-46.6481,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/dia.svg"},"m9":{"id":"nagumo","name":"Nagumo","color":"#1565C0","unit":"Nagumo (Supermercado)","lat":-23.5497,"lng":-46.5981,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/nagumo.svg"},"m10":{"id":"davo","name":"D'avó","color":"#E53935","unit":"D'avó (Supermercado)","lat":-23.5197,"lng":-46.6411,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/davo.svg"},"m11":{"id":"hirota","name":"Hirota Food","color":"#AD1457","unit":"Hirota Food (Supermercado)","lat":-23.5647,"lng":-46.6041,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/hirota.svg"},"m12":{"id":"pastorinho","name":"Pastorinho","color":"#00838F","unit":"Pastorinho (Supermercado)","lat":-23.5087,"lng":-46.6441,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/pastorinho.svg"},"m13":{"id":"lopes","name":"Lopes Supermercados","color":"#283593","unit":"Lopes Supermercados (Supermercado)","lat":-23.5537,"lng":-46.6451,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/lopes.svg"},"m14":{"id":"natural-da-terra","name":"Natural da Terra","color":"#33691E","unit":"Natural da Terra (Hortifruti & Feira)","lat":-23.5347,"lng":-46.6221,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/natural-da-terra.svg"},"m15":{"id":"akki-atacadista","name":"Akki Atacadista","color":"#EF6C00","unit":"Akki Atacadista (Atacarejo)","lat":-23.5457,"lng":-46.6191,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/akki-atacadista.svg"}},"neighborhoods":[{"key":"adrianopolis","name":"Vila Mariana / Moema","lat":-23.5397,"lng":-46.6261},{"key":"flores","name":"Pinheiros / Perdizes","lat":-23.5667,"lng":-46.6288},{"key":"cidade_nova","name":"Santana / Zona Norte","lat":-23.51,"lng":-46.6063},{"key":"autaz_mirim","name":"Tatuapé / Itaquera (Z. Leste)","lat":-23.528,"lng":-46.5901},{"key":"betania","name":"Santo Amaro / Jabaquara","lat":-23.5703,"lng":-46.6225},{"key":"centro","name":"Centro / Bela Vista","lat":-23.5505,"lng":-46.6333},{"key":"ponta_negra","name":"Butantã / Morumbi","lat":-23.5793,"lng":-46.6738},{"key":"alvorada","name":"Lapa / Barra Funda","lat":-23.537,"lng":-46.6531},{"key":"coroado","name":"Ipiranga / Mooca","lat":-23.5595,"lng":-46.6081}],"canonicalKey":"SP-SaoPaulo"},"rio_de_janeiro":{"id":"rio_de_janeiro","name":"Rio de Janeiro - RJ","shortName":"Rio de Janeiro","region":"Sudeste","uf":"RJ","ibgePrefix":"33","sefazName":"SEFAZ-RJ","sefazDomain":"sefaz.rj.gov.br","heroBadge":"🇧🇷 RJ-RioDeJaneiro • Os 15 Maiores Supermercados de Rio de Janeiro","heroTitle":"Economize nos Mercados de Rio de Janeiro - RJ","heroSubtitle":"Cotações em 15 redes de Rio de Janeiro: Supermercados Guanabara, Supermercados Mundial, Zona Sul, Prezunic, Assaí Atacadista, Atacadão e mais 9 redes.","priceMultiplier":0.96,"supermarkets":{"db":{"id":"guanabara","name":"Supermercados Guanabara","color":"#D32F2F","unit":"Supermercados Guanabara (Supermercado)","lat":-22.884,"lng":-43.1577,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/guanabara.svg"},"nova_era":{"id":"mundial","name":"Supermercados Mundial","color":"#F57C00","unit":"Supermercados Mundial (Supermercado)","lat":-22.914,"lng":-43.1607,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/mundial.svg"},"atacadao":{"id":"zona-sul","name":"Zona Sul","color":"#C62828","unit":"Zona Sul (Premium)","lat":-22.851,"lng":-43.1357,"tier":"medio","tipo":"premium","tierLabel":"Premium","logo":"web/assets/logos/zona-sul.svg"},"assai":{"id":"prezunic","name":"Prezunic","color":"#1565C0","unit":"Prezunic (Supermercado)","lat":-22.871,"lng":-43.1177,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/prezunic.svg"},"baratao":{"id":"assai","name":"Assaí Atacadista","color":"#1976D2","unit":"Assaí Atacadista (Atacarejo)","lat":-22.918,"lng":-43.1537,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/assai.svg"},"carrefour":{"id":"atacadao","name":"Atacadão","color":"#2E7D32","unit":"Atacadão (Atacarejo)","lat":-22.896,"lng":-43.1657,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao.svg"},"mercadinho_bairro":{"id":"carrefour","name":"Carrefour","color":"#0D47A1","unit":"Carrefour (Hipermercado)","lat":-22.928,"lng":-43.2107,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/carrefour.svg"},"sacolao_feira":{"id":"pao-de-acucar","name":"Pão de Açúcar","color":"#1B5E20","unit":"Pão de Açúcar (Varejo)","lat":-22.881,"lng":-43.1877,"tier":"medio","tipo":"varejo","tierLabel":"Varejo","logo":"web/assets/logos/pao-de-acucar.svg"},"m9":{"id":"redemais","name":"Rede Mais","color":"#C2185B","unit":"Rede Mais (Supermercado)","lat":-22.906,"lng":-43.1377,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/redemais.svg"},"m10":{"id":"princesa","name":"Supermercados Princesa","color":"#AD1457","unit":"Supermercados Princesa (Supermercado)","lat":-22.876,"lng":-43.1807,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/princesa.svg"},"m11":{"id":"costazul","name":"Costazul Multimercado","color":"#00838F","unit":"Costazul Multimercado (Atacarejo)","lat":-22.921,"lng":-43.1437,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/costazul.svg"},"m12":{"id":"inter-supermercados","name":"Inter Supermercados","color":"#2E7D32","unit":"Inter Supermercados (Supermercado)","lat":-22.865,"lng":-43.1837,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/inter-supermercados.svg"},"m13":{"id":"supermarket","name":"Rede Supermarket","color":"#283593","unit":"Rede Supermarket (Supermercado)","lat":-22.91,"lng":-43.1847,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermarket.svg"},"m14":{"id":"redetop","name":"Rede Top","color":"#EF6C00","unit":"Rede Top (Supermercado)","lat":-22.891,"lng":-43.1617,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/redetop.svg"},"m15":{"id":"megabox","name":"Megabox","color":"#B71C1C","unit":"Megabox (Atacarejo)","lat":-22.902,"lng":-43.1587,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/megabox.svg"}},"neighborhoods":[{"key":"adrianopolis","name":"Copacabana / Ipanema (Z. Sul)","lat":-22.896,"lng":-43.1657},{"key":"flores","name":"Botafogo / Flamengo","lat":-22.923,"lng":-43.1684},{"key":"cidade_nova","name":"Tijuca / Vila Isabel","lat":-22.8663,"lng":-43.1459},{"key":"autaz_mirim","name":"Barra da Tijuca / Recreio","lat":-22.8843,"lng":-43.1297},{"key":"betania","name":"Jacarepaguá / Freguesia","lat":-22.9266,"lng":-43.1621},{"key":"centro","name":"Méier / Engenho de Dentro","lat":-22.9068,"lng":-43.1729},{"key":"ponta_negra","name":"Madureira / Irajá","lat":-22.9356,"lng":-43.2134},{"key":"alvorada","name":"Campo Grande / Bangu (Z. Oeste)","lat":-22.8933,"lng":-43.1927},{"key":"coroado","name":"Centro / Lapa","lat":-22.9158,"lng":-43.1477}],"canonicalKey":"RJ-RioDeJaneiro"},"belo_horizonte":{"id":"belo_horizonte","name":"Belo Horizonte - MG","shortName":"Belo Horizonte","region":"Sudeste","uf":"MG","ibgePrefix":"31","sefazName":"SEFAZ-MG","sefazDomain":"sefaz.mg.gov.br","heroBadge":"🇧🇷 MG-BeloHorizonte • Os 15 Maiores Supermercados de Belo Horizonte","heroTitle":"Economize nos Mercados de Belo Horizonte - MG","heroSubtitle":"Cotações em 15 redes de Belo Horizonte: Supermercados BH, Verdemar, EPA Plus Supermercados, Mart Minas Atacado, Apoio Mineiro, Atacadão e mais 9 redes.","priceMultiplier":0.94,"supermarkets":{"db":{"id":"supermercados-bh","name":"Supermercados BH","color":"#D32F2F","unit":"Supermercados BH (Hipermercado)","lat":-19.8939,"lng":-43.9193,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/supermercados-bh.svg"},"nova_era":{"id":"verdemar","name":"Verdemar","color":"#1B5E20","unit":"Verdemar (Premium)","lat":-19.9239,"lng":-43.9223,"tier":"medio","tipo":"premium","tierLabel":"Premium","logo":"web/assets/logos/verdemar.svg"},"atacadao":{"id":"epa-plus","name":"EPA Plus Supermercados","color":"#C2185B","unit":"EPA Plus Supermercados (Supermercado)","lat":-19.8609,"lng":-43.8973,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/epa-plus.svg"},"assai":{"id":"mart-minas","name":"Mart Minas Atacado","color":"#F57C00","unit":"Mart Minas Atacado (Atacarejo)","lat":-19.8809,"lng":-43.8793,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/mart-minas.svg"},"baratao":{"id":"apoio-mineiro","name":"Apoio Mineiro","color":"#1565C0","unit":"Apoio Mineiro (Atacarejo)","lat":-19.9279,"lng":-43.9153,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/apoio-mineiro.svg"},"carrefour":{"id":"atacadao","name":"Atacadão","color":"#2E7D32","unit":"Atacadão (Atacarejo)","lat":-19.9059,"lng":-43.9273,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao.svg"},"mercadinho_bairro":{"id":"assai","name":"Assaí Atacadista","color":"#1976D2","unit":"Assaí Atacadista (Atacarejo)","lat":-19.9379,"lng":-43.9723,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/assai.svg"},"sacolao_feira":{"id":"super-nosso","name":"Super Nosso","color":"#B71C1C","unit":"Super Nosso (Premium)","lat":-19.8909,"lng":-43.9493,"tier":"medio","tipo":"premium","tierLabel":"Premium","logo":"web/assets/logos/super-nosso.svg"},"m9":{"id":"carrefour","name":"Carrefour","color":"#0D47A1","unit":"Carrefour (Hipermercado)","lat":-19.9159,"lng":-43.8993,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/carrefour.svg"},"m10":{"id":"villefort","name":"Villefort Atacarejo","color":"#283593","unit":"Villefort Atacarejo (Atacarejo)","lat":-19.8859,"lng":-43.9423,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/villefort.svg"},"m11":{"id":"supermercado-dia-mg","name":"Dia Proximidade BH","color":"#E53935","unit":"Dia Proximidade BH (Proximidade / Bairro)","lat":-19.9309,"lng":-43.9053,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/supermercado-dia-mg.svg"},"m12":{"id":"decisao-atacarejo","name":"Decisão Atacarejo","color":"#EF6C00","unit":"Decisão Atacarejo (Atacarejo)","lat":-19.8749,"lng":-43.9453,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/decisao-atacarejo.svg"},"m13":{"id":"mercadinho-savassi","name":"Mercearia & Mercadinho Savassi","color":"#00695C","unit":"Mercearia & Mercadinho Savassi (Proximidade / Bairro)","lat":-19.9199,"lng":-43.9463,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-savassi.svg"},"m14":{"id":"sacolao-abc-bh","name":"Sacolão ABC Hortifruti","color":"#558B2F","unit":"Sacolão ABC Hortifruti (Hortifruti & Feira)","lat":-19.9009,"lng":-43.9233,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/sacolao-abc-bh.svg"},"m15":{"id":"mercado-central-bh","name":"Mercado Central BH","color":"#33691E","unit":"Mercado Central BH (Hortifruti & Feira)","lat":-19.9119,"lng":-43.9203,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/mercado-central-bh.svg"}},"neighborhoods":[{"key":"adrianopolis","name":"Savassi / Lourdes","lat":-19.9059,"lng":-43.9273},{"key":"flores","name":"Centro / Santa Efigênia","lat":-19.9329,"lng":-43.93},{"key":"cidade_nova","name":"Pampulha / Ouro Preto","lat":-19.8762,"lng":-43.9075},{"key":"autaz_mirim","name":"Buritis / Estoril","lat":-19.8942,"lng":-43.8913},{"key":"betania","name":"Padre Eustáquio / Carlos Prates","lat":-19.9365,"lng":-43.9237},{"key":"centro","name":"Venda Nova","lat":-19.9167,"lng":-43.9345},{"key":"ponta_negra","name":"Barreiro","lat":-19.9455,"lng":-43.975},{"key":"alvorada","name":"Cidade Nova / União","lat":-19.9032,"lng":-43.9543},{"key":"coroado","name":"Sion / Anchieta","lat":-19.9257,"lng":-43.9093}],"canonicalKey":"MG-BeloHorizonte"},"vitoria":{"id":"vitoria","name":"Vitória - ES","shortName":"Vitória","region":"Sudeste","uf":"ES","ibgePrefix":"32","sefazName":"SEFAZ-ES","sefazDomain":"sefaz.es.gov.br","heroBadge":"🇧🇷 ES-Vitoria • Os 15 Maiores Supermercados de Vitória","heroTitle":"Economize nos Mercados de Vitória - ES","heroSubtitle":"Cotações em 15 redes de Vitória: Supermercados Perim, Extrabom Supermercados, Supermercados Carone, Atacadão, Assaí Atacadista, SempreTem Superatacado e mais 9 redes.","priceMultiplier":0.96,"supermarkets":{"db":{"id":"supermercados-perim","name":"Supermercados Perim","color":"#D32F2F","unit":"Supermercados Perim (Hipermercado)","lat":-20.2927,"lng":-40.2976,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/supermercados-perim.svg"},"nova_era":{"id":"extrabom","name":"Extrabom Supermercados","color":"#F57C00","unit":"Extrabom Supermercados (Supermercado)","lat":-20.3227,"lng":-40.3006,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/extrabom.svg"},"atacadao":{"id":"supermercados-carone","name":"Supermercados Carone","color":"#C2185B","unit":"Supermercados Carone (Premium)","lat":-20.2597,"lng":-40.2756,"tier":"medio","tipo":"premium","tierLabel":"Premium","logo":"web/assets/logos/supermercados-carone.svg"},"assai":{"id":"atacadao","name":"Atacadão","color":"#2E7D32","unit":"Atacadão (Atacarejo)","lat":-20.2797,"lng":-40.2576,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao.svg"},"baratao":{"id":"assai","name":"Assaí Atacadista","color":"#1976D2","unit":"Assaí Atacadista (Atacarejo)","lat":-20.3267,"lng":-40.2936,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/assai.svg"},"carrefour":{"id":"sempre-tem","name":"SempreTem Superatacado","color":"#1565C0","unit":"SempreTem Superatacado (Atacarejo)","lat":-20.3047,"lng":-40.3056,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/sempre-tem.svg"},"mercadinho_bairro":{"id":"supermercados-bh","name":"Supermercados BH (ES)","color":"#B71C1C","unit":"Supermercados BH (ES) (Hipermercado)","lat":-20.3367,"lng":-40.3506,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/supermercados-bh.svg"},"sacolao_feira":{"id":"sao-jose-es","name":"Supermercado São José","color":"#283593","unit":"Supermercado São José (Supermercado)","lat":-20.2897,"lng":-40.3276,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/sao-jose-es.svg"},"m9":{"id":"casagrande-es","name":"Supermercados Casagrande","color":"#00838F","unit":"Supermercados Casagrande (Supermercado)","lat":-20.3147,"lng":-40.2776,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/casagrande-es.svg"},"m10":{"id":"multishow-es","name":"Rede MultiShow","color":"#EF6C00","unit":"Rede MultiShow (Supermercado)","lat":-20.2847,"lng":-40.3206,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/multishow-es.svg"},"m11":{"id":"devens-supermercados","name":"Devens Supermercados","color":"#6A1B9A","unit":"Devens Supermercados (Supermercado)","lat":-20.3297,"lng":-40.2836,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/devens-supermercados.svg"},"m12":{"id":"extra-plus-es","name":"Extra Plus Gourmet","color":"#4E342E","unit":"Extra Plus Gourmet (Premium)","lat":-20.2737,"lng":-40.3236,"tier":"medio","tipo":"premium","tierLabel":"Premium","logo":"web/assets/logos/extra-plus-es.svg"},"m13":{"id":"mercadinho-camburi","name":"Mercadinho Jardim Camburi","color":"#00695C","unit":"Mercadinho Jardim Camburi (Proximidade / Bairro)","lat":-20.3187,"lng":-40.3246,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-camburi.svg"},"m14":{"id":"hortifruti-vitoria","name":"Hortifruti Praia do Canto","color":"#558B2F","unit":"Hortifruti Praia do Canto (Hortifruti & Feira)","lat":-20.2997,"lng":-40.3016,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/hortifruti-vitoria.svg"},"m15":{"id":"feira-livre-vitoria","name":"Feira Livre de Vitória","color":"#33691E","unit":"Feira Livre de Vitória (Hortifruti & Feira)","lat":-20.3107,"lng":-40.2986,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/feira-livre-vitoria.svg"}},"neighborhoods":[{"key":"adrianopolis","name":"Jardim Camburi","lat":-20.3047,"lng":-40.3056},{"key":"flores","name":"Praia do Canto / Enseada do Suá","lat":-20.3317,"lng":-40.3083},{"key":"cidade_nova","name":"Jardim da Penha / Mata da Praia","lat":-20.275,"lng":-40.2858},{"key":"autaz_mirim","name":"Bento Ferreira / Jucutuquara","lat":-20.293,"lng":-40.2696},{"key":"betania","name":"Centro de Vitória","lat":-20.3353,"lng":-40.302},{"key":"centro","name":"Santo Antônio / São Pedro","lat":-20.3155,"lng":-40.3128},{"key":"ponta_negra","name":"Maruípe / Goiabeiras","lat":-20.3443,"lng":-40.3533},{"key":"alvorada","name":"Praia da Costa (Vila Velha)","lat":-20.302,"lng":-40.3326},{"key":"coroado","name":"Laranjeiras (Serra)","lat":-20.3245,"lng":-40.2876}],"canonicalKey":"ES-Vitoria"},"curitiba":{"id":"curitiba","name":"Curitiba - PR","shortName":"Curitiba","region":"Sul","uf":"PR","ibgePrefix":"41","sefazName":"SEFAZ-PR","sefazDomain":"sefaz.pr.gov.br","heroBadge":"🇧🇷 PR-Curitiba • Os 15 Maiores Supermercados de Curitiba","heroTitle":"Economize nos Mercados de Curitiba - PR","heroSubtitle":"Cotações em 15 redes de Curitiba: Super Muffato, Supermercados Condor, Festval, Angeloni, Atacadão, Assaí Atacadista e mais 9 redes.","priceMultiplier":0.94,"supermarkets":{"db":{"id":"muffato","name":"Super Muffato","color":"#B71C1C","unit":"Super Muffato (Hipermercado)","lat":-25.4056,"lng":-49.2581,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/muffato.svg"},"nova_era":{"id":"condor","name":"Supermercados Condor","color":"#1976D2","unit":"Supermercados Condor (Hipermercado)","lat":-25.4356,"lng":-49.2611,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/condor.svg"},"atacadao":{"id":"festval","name":"Festval","color":"#4E342E","unit":"Festval (Premium)","lat":-25.3726,"lng":-49.2361,"tier":"medio","tipo":"premium","tierLabel":"Premium","logo":"web/assets/logos/festval.svg"},"assai":{"id":"angeloni","name":"Angeloni","color":"#D32F2F","unit":"Angeloni (Premium)","lat":-25.3926,"lng":-49.2181,"tier":"medio","tipo":"premium","tierLabel":"Premium","logo":"web/assets/logos/angeloni.svg"},"baratao":{"id":"atacadao","name":"Atacadão","color":"#2E7D32","unit":"Atacadão (Atacarejo)","lat":-25.4396,"lng":-49.2541,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao.svg"},"carrefour":{"id":"assai","name":"Assaí Atacadista","color":"#1976D2","unit":"Assaí Atacadista (Atacarejo)","lat":-25.4176,"lng":-49.2661,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/assai.svg"},"mercadinho_bairro":{"id":"jacomar","name":"Supermercados Jacomar","color":"#283593","unit":"Supermercados Jacomar (Supermercado)","lat":-25.4496,"lng":-49.3111,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/jacomar.svg"},"sacolao_feira":{"id":"max-atacadista","name":"Max Atacadista","color":"#F57C00","unit":"Max Atacadista (Atacarejo)","lat":-25.4026,"lng":-49.2881,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/max-atacadista.svg"},"m9":{"id":"carrefour","name":"Carrefour","color":"#0D47A1","unit":"Carrefour (Hipermercado)","lat":-25.4276,"lng":-49.2381,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/carrefour.svg"},"m10":{"id":"casa-fiesta","name":"Casa Fiesta Supermercados","color":"#C2185B","unit":"Casa Fiesta Supermercados (Supermercado)","lat":-25.3976,"lng":-49.2811,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/casa-fiesta.svg"},"m11":{"id":"supermercado-zamprogna","name":"Rede Rio Verde PR","color":"#2E7D32","unit":"Rede Rio Verde PR (Supermercado)","lat":-25.4426,"lng":-49.2441,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-zamprogna.svg"},"m12":{"id":"supermercado-kusma","name":"Kusma Supermercados","color":"#00838F","unit":"Kusma Supermercados (Supermercado)","lat":-25.3866,"lng":-49.2841,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-kusma.svg"},"m13":{"id":"mercadinho-batel","name":"Minimercado de Bairro CWB","color":"#00695C","unit":"Minimercado de Bairro CWB (Proximidade / Bairro)","lat":-25.4316,"lng":-49.2851,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-batel.svg"},"m14":{"id":"armazem-da-familia","name":"Armazém da Família Curitiba","color":"#1565C0","unit":"Armazém da Família Curitiba (Proximidade / Bairro)","lat":-25.4126,"lng":-49.2621,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/armazem-da-familia.svg"},"m15":{"id":"mercado-municipal-curitiba","name":"Mercado Municipal de Curitiba","color":"#33691E","unit":"Mercado Municipal de Curitiba (Hortifruti & Feira)","lat":-25.4236,"lng":-49.2591,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/mercado-municipal-curitiba.svg"}},"neighborhoods":[{"key":"adrianopolis","name":"Água Verde / Batel","lat":-25.4176,"lng":-49.2661},{"key":"flores","name":"Centro / Rebouças","lat":-25.4446,"lng":-49.2688},{"key":"cidade_nova","name":"Santa Felicidade / Mercês","lat":-25.3879,"lng":-49.2463},{"key":"autaz_mirim","name":"Cajuru / Uberaba","lat":-25.4059,"lng":-49.2301},{"key":"betania","name":"Portão / Novo Mundo","lat":-25.4482,"lng":-49.2625},{"key":"centro","name":"Centro Cívico / Cabral","lat":-25.4284,"lng":-49.2733},{"key":"ponta_negra","name":"Ecoville / Campo Comprido","lat":-25.4572,"lng":-49.3138},{"key":"alvorada","name":"Boa Vista / Bacacheri","lat":-25.4149,"lng":-49.2931},{"key":"coroado","name":"Boqueirão / Xaxim","lat":-25.4374,"lng":-49.2481}],"canonicalKey":"PR-Curitiba"},"porto_alegre":{"id":"porto_alegre","name":"Porto Alegre - RS","shortName":"Porto Alegre","region":"Sul","uf":"RS","ibgePrefix":"43","sefazName":"SEFAZ-RS","sefazDomain":"sefaz.rs.gov.br","heroBadge":"🇧🇷 RS-PortoAlegre • Os 15 Maiores Supermercados de Porto Alegre","heroTitle":"Economize nos Mercados de Porto Alegre - RS","heroSubtitle":"Cotações em 15 redes de Porto Alegre: Zaffari & Bourbon, Stok Center, Asun Supermercados, Atacadão, Assaí Atacadista, Carrefour e mais 9 redes.","priceMultiplier":0.95,"supermarkets":{"db":{"id":"zaffari","name":"Zaffari & Bourbon","color":"#D32F2F","unit":"Zaffari & Bourbon (Hipermercado)","lat":-30.0118,"lng":-51.2025,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/zaffari.svg"},"nova_era":{"id":"stok-center","name":"Stok Center","color":"#F57C00","unit":"Stok Center (Atacarejo)","lat":-30.0418,"lng":-51.2055,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/stok-center.svg"},"atacadao":{"id":"asun","name":"Asun Supermercados","color":"#C2185B","unit":"Asun Supermercados (Supermercado)","lat":-29.9788,"lng":-51.1805,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/asun.svg"},"assai":{"id":"atacadao","name":"Atacadão","color":"#2E7D32","unit":"Atacadão (Atacarejo)","lat":-29.9988,"lng":-51.1625,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao.svg"},"baratao":{"id":"assai","name":"Assaí Atacadista","color":"#1976D2","unit":"Assaí Atacadista (Atacarejo)","lat":-30.0458,"lng":-51.1985,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/assai.svg"},"carrefour":{"id":"carrefour","name":"Carrefour","color":"#0D47A1","unit":"Carrefour (Hipermercado)","lat":-30.0238,"lng":-51.2105,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/carrefour.svg"},"mercadinho_bairro":{"id":"rissul","name":"Supper Rissul","color":"#283593","unit":"Supper Rissul (Supermercado)","lat":-30.0558,"lng":-51.2555,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/rissul.svg"},"sacolao_feira":{"id":"muffato","name":"Max Atacadista / Sul","color":"#B71C1C","unit":"Max Atacadista / Sul (Atacarejo)","lat":-30.0088,"lng":-51.2325,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/muffato.svg"},"m9":{"id":"supermercado-guanabara-rs","name":"Guanabara RS","color":"#00838F","unit":"Guanabara RS (Supermercado)","lat":-30.0338,"lng":-51.1825,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-guanabara-rs.svg"},"m10":{"id":"super-kan","name":"Super Kan Porto Alegre","color":"#EF6C00","unit":"Super Kan Porto Alegre (Supermercado)","lat":-30.0038,"lng":-51.2255,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/super-kan.svg"},"m11":{"id":"gecepel","name":"Supermercado Gecepel","color":"#1565C0","unit":"Supermercado Gecepel (Supermercado)","lat":-30.0488,"lng":-51.1885,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/gecepel.svg"},"m12":{"id":"cestto-atacadista","name":"Cestto Atacadista (Zaffari)","color":"#AD1457","unit":"Cestto Atacadista (Zaffari) (Atacarejo)","lat":-29.9928,"lng":-51.2285,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/cestto-atacadista.svg"},"m13":{"id":"minimercado-moinhos","name":"Minimercado Moinhos de Vento","color":"#00695C","unit":"Minimercado Moinhos de Vento (Proximidade / Bairro)","lat":-30.0378,"lng":-51.2295,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/minimercado-moinhos.svg"},"m14":{"id":"hortifruti-cidade-baixa","name":"Sacolão Cidade Baixa","color":"#558B2F","unit":"Sacolão Cidade Baixa (Hortifruti & Feira)","lat":-30.0188,"lng":-51.2065,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/hortifruti-cidade-baixa.svg"},"m15":{"id":"mercado-publico-poa","name":"Mercado Público de Porto Alegre","color":"#33691E","unit":"Mercado Público de Porto Alegre (Hortifruti & Feira)","lat":-30.0298,"lng":-51.2035,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/mercado-publico-poa.svg"}},"neighborhoods":[{"key":"adrianopolis","name":"Moinhos de Vento / Bela Vista","lat":-30.0238,"lng":-51.2105},{"key":"flores","name":"Cidade Baixa / Bom Fim","lat":-30.0508,"lng":-51.2132},{"key":"cidade_nova","name":"Menino Deus / Praia de Belas","lat":-29.9941,"lng":-51.1907},{"key":"autaz_mirim","name":"Passo d'Areia / Higienópolis","lat":-30.0121,"lng":-51.1745},{"key":"betania","name":"Petrópolis / Jardim Botânico","lat":-30.0544,"lng":-51.2069},{"key":"centro","name":"Tristeza / Ipanema (Z. Sul)","lat":-30.0346,"lng":-51.2177},{"key":"ponta_negra","name":"Sarandi / Assis Brasil (Z. Norte)","lat":-30.0634,"lng":-51.2582},{"key":"alvorada","name":"Centro Histórico POA","lat":-30.0211,"lng":-51.2375},{"key":"coroado","name":"Restinga / Lomba do Pinheiro","lat":-30.0436,"lng":-51.1925}],"canonicalKey":"RS-PortoAlegre"},"florianopolis":{"id":"florianopolis","name":"Florianópolis - SC","shortName":"Florianópolis","region":"Sul","uf":"SC","ibgePrefix":"42","sefazName":"SEFAZ-SC","sefazDomain":"sefaz.sc.gov.br","heroBadge":"🇧🇷 SC-Florianopolis • Os 15 Maiores Supermercados de Florianópolis","heroTitle":"Economize nos Mercados de Florianópolis - SC","heroSubtitle":"Cotações em 15 redes de Florianópolis: Angeloni, Supermercados Imperatriz, Fort Atacadista, Bistek Supermercados, Giassi Supermercados, Hippo Supermercados e mais 9 redes.","priceMultiplier":0.96,"supermarkets":{"db":{"id":"angeloni","name":"Angeloni","color":"#D32F2F","unit":"Angeloni (Hipermercado)","lat":-27.5726,"lng":-48.5328,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/angeloni.svg"},"nova_era":{"id":"imperatriz","name":"Supermercados Imperatriz","color":"#C2185B","unit":"Supermercados Imperatriz (Supermercado)","lat":-27.6026,"lng":-48.5358,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/imperatriz.svg"},"atacadao":{"id":"fort-atacadista","name":"Fort Atacadista","color":"#1565C0","unit":"Fort Atacadista (Atacarejo)","lat":-27.5396,"lng":-48.5108,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/fort-atacadista.svg"},"assai":{"id":"bistek","name":"Bistek Supermercados","color":"#B71C1C","unit":"Bistek Supermercados (Supermercado)","lat":-27.5596,"lng":-48.4928,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/bistek.svg"},"baratao":{"id":"giassi","name":"Giassi Supermercados","color":"#283593","unit":"Giassi Supermercados (Hipermercado)","lat":-27.6066,"lng":-48.5288,"tier":"grande","tipo":"hiper","tierLabel":"Hipermercado","logo":"web/assets/logos/giassi.svg"},"carrefour":{"id":"hippo","name":"Hippo Supermercados","color":"#1B5E20","unit":"Hippo Supermercados (Premium)","lat":-27.5846,"lng":-48.5408,"tier":"medio","tipo":"premium","tierLabel":"Premium","logo":"web/assets/logos/hippo.svg"},"mercadinho_bairro":{"id":"atacadao","name":"Atacadão","color":"#2E7D32","unit":"Atacadão (Atacarejo)","lat":-27.6166,"lng":-48.5858,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/atacadao.svg"},"sacolao_feira":{"id":"assai","name":"Assaí Atacadista","color":"#1976D2","unit":"Assaí Atacadista (Atacarejo)","lat":-27.5696,"lng":-48.5628,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/assai.svg"},"m9":{"id":"komprao","name":"Komprão Koch Atacadista","color":"#F57C00","unit":"Komprão Koch Atacadista (Atacarejo)","lat":-27.5946,"lng":-48.5128,"tier":"grande","tipo":"atacarejo","tierLabel":"Atacarejo","logo":"web/assets/logos/komprao.svg"},"m10":{"id":"supermercado-rosa-sc","name":"Supermercado Rosa","color":"#00838F","unit":"Supermercado Rosa (Supermercado)","lat":-27.5646,"lng":-48.5558,"tier":"medio","tipo":"super","tierLabel":"Supermercado","logo":"web/assets/logos/supermercado-rosa-sc.svg"},"m11":{"id":"direto-do-campo","name":"Direto do Campo","color":"#33691E","unit":"Direto do Campo (Hortifruti & Feira)","lat":-27.6096,"lng":-48.5188,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/direto-do-campo.svg"},"m12":{"id":"sempre-perto-sc","name":"Sempre Perto Proximidade","color":"#00796B","unit":"Sempre Perto Proximidade (Proximidade / Bairro)","lat":-27.5536,"lng":-48.5588,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/sempre-perto-sc.svg"},"m13":{"id":"mercadinho-da-ilha","name":"Mercadinho Lagoa da Conceição","color":"#00695C","unit":"Mercadinho Lagoa da Conceição (Proximidade / Bairro)","lat":-27.5986,"lng":-48.5598,"tier":"pequeno","tipo":"proximidade","tierLabel":"Proximidade / Bairro","logo":"web/assets/logos/mercadinho-da-ilha.svg"},"m14":{"id":"sacolao-trindade-sc","name":"Hortifruti Trindade","color":"#558B2F","unit":"Hortifruti Trindade (Hortifruti & Feira)","lat":-27.5796,"lng":-48.5368,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/sacolao-trindade-sc.svg"},"m15":{"id":"mercado-publico-floripa","name":"Mercado Público de Florianópolis","color":"#33691E","unit":"Mercado Público de Florianópolis (Hortifruti & Feira)","lat":-27.5906,"lng":-48.5338,"tier":"pequeno","tipo":"hortifruti","tierLabel":"Hortifruti & Feira","logo":"web/assets/logos/mercado-publico-floripa.svg"}},"neighborhoods":[{"key":"adrianopolis","name":"Centro / Beira-Mar Norte","lat":-27.5846,"lng":-48.5408},{"key":"flores","name":"Trindade / Itacorubi","lat":-27.6116,"lng":-48.5435},{"key":"cidade_nova","name":"Campeche / Rio Tavares (Sul da Ilha)","lat":-27.5549,"lng":-48.521},{"key":"autaz_mirim","name":"Ingleses / Canasvieiras (Norte da Ilha)","lat":-27.5729,"lng":-48.5048},{"key":"betania","name":"Lagoa da Conceição","lat":-27.6152,"lng":-48.5372},{"key":"centro","name":"Estreito / Coqueiros (Continente)","lat":-27.5954,"lng":-48.548},{"key":"ponta_negra","name":"Córrego Grande / Santa Mônica","lat":-27.6242,"lng":-48.5885},{"key":"alvorada","name":"Capoeiras / Abraão","lat":-27.5819,"lng":-48.5678},{"key":"coroado","name":"Jurerê / Santo Antônio de Lisboa","lat":-27.6044,"lng":-48.5228}],"canonicalKey":"SC-Florianopolis"}};
  Object.values(CITIES_CONFIG).forEach(c => { if (c.canonicalKey) CITIES_CONFIG[c.canonicalKey] = c; });

  // ============================================================================
  // EXPANSÃO DO BANCO DE DADOS PARA +1.050 PRODUTOS REAIS DE SUPERMERCADO
  // ============================================================================
  const CATALOG_TEMPLATES = [
    // Cesta Básica & Mercearia
    { baseName: "Arroz Branco Tipo 1", cat: "Cesta Básica", icon: "🌾", imgType: "arroz", brands: ["Tio João", "Camil", "Urbano", "Kicaldo", "Prato Fino", "Namorado", "Emoções"], units: ["1kg", "2kg", "5kg"], basePrices: [5.49, 10.79, 24.50] },
    { baseName: "Arroz Parboilizado Selecionado", cat: "Cesta Básica", icon: "🌾", imgType: "arroz", brands: ["Tio João", "Camil", "Urbano", "Kicaldo", "Prato Fino"], units: ["1kg", "5kg"], basePrices: [5.69, 25.40] },
    { baseName: "Arroz Integral Grãos Nobres", cat: "Cesta Básica", icon: "🌾", imgType: "arroz", brands: ["Tio João", "Camil", "Urbano", "Taeq"], units: ["1kg"], basePrices: [7.89] },
    { baseName: "Feijão Carioca Tipo 1", cat: "Cesta Básica", icon: "🌾", imgType: "feijao", brands: ["Kicaldo", "Camil", "Turquesa", "Urbano", "Combrasil", "Pantera"], units: ["1kg", "2kg"], basePrices: [6.89, 13.49] },
    { baseName: "Feijão Preto Especial", cat: "Cesta Básica", icon: "🌾", imgType: "feijao", brands: ["Kicaldo", "Camil", "Urbano", "Turquesa", "Combrasil"], units: ["1kg"], basePrices: [7.29] },
    { baseName: "Feijão Fradinho / Praia", cat: "Cesta Básica", icon: "🌾", imgType: "feijao", brands: ["Kicaldo", "Camil", "Urbano", "Ouro do Amazonas"], units: ["500g", "1kg"], basePrices: [5.49, 9.89] },
    { baseName: "Farinha de Mandioca Crocante", cat: "Cesta Básica", icon: "🌾", imgType: "farinha", brands: ["Ouro do Amazonas", "Uarini Real", "Yoki", "Tio Jorge", "Dona Clara", "Biju Norte"], units: ["500g", "1kg"], basePrices: [6.49, 11.90], isRegional: true },
    { baseName: "Açúcar Cristal / Refinado", cat: "Cesta Básica", icon: "🍬", imgType: "acucar", brands: ["União", "Itamarati", "Caravelas", "Da Barra", "Cristal Norte", "Guarani"], units: ["1kg", "2kg", "5kg"], basePrices: [4.39, 8.59, 20.90] },
    { baseName: "Óleo Vegetal Puro", cat: "Cesta Básica", icon: "🫗", imgType: "oleo", brands: ["Soya", "Liza", "Concórdia", "Leve", "Vila Velha", "Salada"], units: ["900ml"], basePrices: [5.99] },
    { baseName: "Azeite de Oliva Extra Virgem", cat: "Cesta Básica", icon: "🫒", imgType: "oleo", brands: ["Gallo", "Andorinha", "Borges", "Carbonell", "Cocineros"], units: ["250ml", "500ml"], basePrices: [24.90, 42.90] },
    { baseName: "Macarrão Espaguete Semolina", cat: "Cesta Básica", icon: "🍝", imgType: "macarrao", brands: ["Mirella", "Vitarella", "Adria", "Dona Benta", "Renata", "Galo", "Barilla"], units: ["400g", "500g"], basePrices: [3.69, 4.49] },
    { baseName: "Macarrão Parafuso / Penne", cat: "Cesta Básica", icon: "🍝", imgType: "macarrao", brands: ["Mirella", "Vitarella", "Adria", "Dona Benta", "Renata", "Galo"], units: ["500g"], basePrices: [4.59] },
    { baseName: "Macarrão Instantâneo Lámen", cat: "Cesta Básica", icon: "🍜", imgType: "macarrao", brands: ["Nissin Miojo", "Maruchan", "Vitarella", "Renata", "Estrela"], units: ["85g"], basePrices: [2.29] },
    { baseName: "Farinha de Trigo Tradicional", cat: "Cesta Básica", icon: "🌾", imgType: "farinha", brands: ["Dona Benta", "Finna", "Rosa Branca", "Sol", "Anaconda"], units: ["1kg"], basePrices: [5.29] },
    { baseName: "Flocão de Milho para Cuscuz", cat: "Cesta Básica", icon: "🌽", imgType: "farinha", brands: ["Kimimo", "Vitamilho", "Maratá", "Sinhá", "Yoki", "Coringa"], units: ["500g"], basePrices: [2.49] },
    { baseName: "Molho de Tomate Tradicional", cat: "Cesta Básica", icon: "🍅", imgType: "tempero", brands: ["Pomarola", "Quero", "Fugini", "Heinz", "Elefante", "Predilecta"], units: ["300g", "340g"], basePrices: [2.19, 2.79] },
    { baseName: "Maionese Tradicional Cremosa", cat: "Cesta Básica", icon: "🥫", imgType: "tempero", brands: ["Hellmann's", "Heinz", "Quero", "Liza", "Arisco"], units: ["250g", "500g"], basePrices: [6.49, 10.90] },
    { baseName: "Ketchup Tradicional", cat: "Cesta Básica", icon: "🍅", imgType: "tempero", brands: ["Heinz", "Hellmann's", "Quero", "Hemmer", "Predilecta"], units: ["397g"], basePrices: [7.99] },
    { baseName: "Milho Verde & Ervilha em Conserva", cat: "Cesta Básica", icon: "🌽", imgType: "tempero", brands: ["Quero", "Predilecta", "Fugini", "Bonduelle", "Olé"], units: ["170g", "200g"], basePrices: [3.19, 3.69] },
    { baseName: "Sardinha e Atum em Lata", cat: "Cesta Básica", icon: "🐟", imgType: "peixe", brands: ["Gomes da Costa", "Coqueiro", "Pescador", "Palmeira", "Robinson Crusoe"], units: ["125g", "170g"], basePrices: [5.49, 8.90] },

    // Matinais & Laticínios
    { baseName: "Café Torrado e Moído Tradicional", cat: "Matinais & Laticínios", icon: "☕", imgType: "cafe", brands: ["Pilão", "3 Corações", "Santa Clara", "Kimimo", "Maratá", "Melitta", "Caboclo"], units: ["250g", "500g"], basePrices: [9.49, 18.50] },
    { baseName: "Café Solúvel Granulado", cat: "Matinais & Laticínios", icon: "☕", imgType: "cafe", brands: ["Nescafé", "3 Corações", "Santa Clara", "Iguaçu", "Melitta"], units: ["50g", "100g", "200g"], basePrices: [6.90, 12.90, 21.90] },
    { baseName: "Leite em Pó Integral Instantâneo", cat: "Matinais & Laticínios", icon: "🥛", imgType: "leite", brands: ["Ninho Nestlé", "Itambé", "Piracanjuba", "Italac", "Camponesa", "Elegê", "Glória"], units: ["380g", "400g", "750g", "800g"], basePrices: [15.49, 15.99, 27.90, 29.90] },
    { baseName: "Leite Longa Vida UHT Integral", cat: "Matinais & Laticínios", icon: "🥛", imgType: "leite", brands: ["Piracanjuba", "Italac", "Itambé", "Elegê", "Ninho", "Parmalat"], units: ["1L"], basePrices: [5.49] },
    { baseName: "Leite Condensado Integral", cat: "Matinais & Laticínios", icon: "🥫", imgType: "leite", brands: ["Moça Nestlé", "Piracanjuba", "Italac", "Itambé", "Triângulo"], units: ["395g"], basePrices: [5.99] },
    { baseName: "Creme de Leite Leve", cat: "Matinais & Laticínios", icon: "🥛", imgType: "leite", brands: ["Nestlé", "Piracanjuba", "Italac", "Itambé", "Elegê"], units: ["200g"], basePrices: [3.49] },
    { baseName: "Manteiga de Primeira Qualidade com Sal", cat: "Matinais & Laticínios", icon: "🧈", imgType: "manteiga", brands: ["Aviação", "Président", "Itambé", "Piracanjuba", "Elegê", "Vigor"], units: ["200g", "500g"], basePrices: [11.90, 25.90] },
    { baseName: "Margarina Cremosa com Sal", cat: "Matinais & Laticínios", icon: "🧈", imgType: "manteiga", brands: ["Qualy", "Delícia", "Doriana", "Claybom", "Primor", "Becel"], units: ["250g", "500g", "1kg"], basePrices: [4.29, 7.49, 13.90] },
    { baseName: "Queijo Mussarela / Prato Fatiado", cat: "Matinais & Laticínios", icon: "🧀", imgType: "manteiga", brands: ["Président", "Tirolez", "Itambé", "Piracanjuba", "Sadia", "Lacticínios AM"], units: ["150g", "300g", "kg"], basePrices: [8.90, 16.90, 44.90] },
    { baseName: "Requeijão Cremoso Tradicional", cat: "Matinais & Laticínios", icon: "🧀", imgType: "manteiga", brands: ["Vigor", "Catupiry", "Poços de Caldas", "Tirolez", "Itambé", "Nestlé"], units: ["200g"], basePrices: [7.89] },
    { baseName: "Iogurte Polpa de Frutas Bandeja", cat: "Matinais & Laticínios", icon: "🍓", imgType: "leite", brands: ["Danone", "Nestlé", "Vigor", "Itambé", "Batavo", "Activia"], units: ["540g", "850g"], basePrices: [6.99, 10.49] },
    { baseName: "Achocolatado em Pó Vitaminado", cat: "Matinais & Laticínios", icon: "🍫", imgType: "cafe", brands: ["Nescau", "Toddy", "Ovomaltine", "Três Corações", "Itambé"], units: ["370g", "400g", "730g"], basePrices: [7.90, 8.49, 14.90] },
    { baseName: "Biscoito Cream Cracker / Água e Sal", cat: "Matinais & Laticínios", icon: "🍪", imgType: "biscoito", brands: ["Vitarella", "Marilan", "Bauducco", "Richester", "Tostines", "Piraquê"], units: ["350g", "400g"], basePrices: [4.79, 5.29] },
    { baseName: "Biscoito Maisena / Maria Tradicional", cat: "Matinais & Laticínios", icon: "🍪", imgType: "biscoito", brands: ["Vitarella", "Marilan", "Piraquê", "Bauducco", "Tostines"], units: ["350g", "400g"], basePrices: [4.89, 5.49] },
    { baseName: "Biscoito Recheado Chocolate / Morango", cat: "Matinais & Laticínios", icon: "🍪", imgType: "biscoito", brands: ["Bono", "Negresco", "Oreo", "Passatempo", "Bauducco", "Richester", "Trakinas"], units: ["90g", "126g"], basePrices: [2.49, 2.99] },
    { baseName: "Pão de Forma Tradicional / Integral", cat: "Matinais & Laticínios", icon: "🍞", imgType: "pao", brands: ["Pullman", "Plus Vita", "Wickbold", "Visconti", "Bauducco", "Panificadora Manaus"], units: ["400g", "480g"], basePrices: [7.49, 9.29] },
    { baseName: "Aveia em Flocos Finos", cat: "Matinais & Laticínios", icon: "🌾", imgType: "farinha", brands: ["Quaker", "Nestlé", "Yoki", "Taeq", "Jasmine"], units: ["165g", "450g"], basePrices: [4.49, 9.90] },

    // Carnes & Peixes Regionais
    { baseName: "Pescado Amazônico Fresco / Postas", cat: "Carnes & Peixes Regionais", icon: "🐟", imgType: "peixe", brands: ["Pescados do Amazonas", "Feira da Manaus Moderna", "Panair Pescados", "Frigorífico Rio Negro", "Peixaria Solimões"], units: ["kg", "Bandeja 800g"], basePrices: [16.90, 14.50], isRegional: true },
    { baseName: "Filé de Pirarucu / Matrinxã / Jaraqui", cat: "Carnes & Peixes Regionais", icon: "🐟", imgType: "peixe", brands: ["Manejo Sustentável AM", "Pescados do Amazonas", "Rio Negro Premium", "Feira do Produtor"], units: ["kg", "500g"], basePrices: [29.90, 16.50], isRegional: true },
    { baseName: "Corte Bovino Selecionado Resfriado", cat: "Carnes & Peixes Regionais", icon: "🥩", imgType: "carne", brands: ["Friboi", "Montana", "Maturatta", "FrigoNorte", "Cortes Selecionados AM", "Seara Gourmet"], units: ["kg"], basePrices: [39.90] },
    { baseName: "Carne Moída / Acém / Patinho Bovino", cat: "Carnes & Peixes Regionais", icon: "🥩", imgType: "carne", brands: ["Friboi", "FrigoNorte", "Baratão Cortes", "Swift", "Sadia"], units: ["500g", "kg"], basePrices: [15.90, 29.90] },
    { baseName: "Frango Peito / Coxa e Sobrecoxa / Filé", cat: "Carnes & Peixes Regionais", icon: "🍗", imgType: "frango", brands: ["Sadia", "Perdigão", "Seara", "Aurora", "Avícola Manaus", "Copacol"], units: ["kg", "Bandeja 1kg"], basePrices: [13.90, 17.90] },
    { baseName: "Linguiça Calabresa / Toscana para Churrasco", cat: "Carnes & Peixes Regionais", icon: "🌭", imgType: "carne", brands: ["Sadia", "Perdigão", "Seara", "Aurora", "Frimesa"], units: ["500g", "kg"], basePrices: [12.90, 22.90] },
    { baseName: "Salsicha Hot Dog / Mortadela Defumada", cat: "Carnes & Peixes Regionais", icon: "🌭", imgType: "carne", brands: ["Sadia", "Perdigão", "Seara", "Aurora", "Ceratti"], units: ["500g", "kg"], basePrices: [7.49, 13.90] },
    { baseName: "Charque / Carne Seca Ponta de Agulha", cat: "Carnes & Peixes Regionais", icon: "🥩", imgType: "carne", brands: ["Paineira", "Friboi", "Vilheto", "Norte Charque", "Seara"], units: ["500g", "kg"], basePrices: [22.90, 43.90] },
    { baseName: "Ovos Brancos / Caipiras Grandes", cat: "Carnes & Peixes Regionais", icon: "🥚", imgType: "ovos", brands: ["Granja São Pedro AM", "Ovos Manaus", "Mantiqueira", "Granja Rio Negro"], units: ["12 un", "20 un", "30 un"], basePrices: [9.90, 15.90, 19.90] },

    // Produtos Regionais — Região Norte (AM, RR, PA, RO, AC, AP, TO)
    { baseName: "Polpa Regional Amazônica (Cupuaçu / Açaí Grosso / Bacuri / Taperebá)", cat: "Produtos Regionais", icon: "🟣", imgType: "hortifruti", brands: ["Amazônia Polpas", "Wakauã", "Sabor do Pará", "Norte Frutas", "Açaí do Ver-o-Peso"], units: ["500g", "1kg"], basePrices: [9.90, 17.90], isRegional: true, regionTag: "Norte" },
    { baseName: "Tucupi Temperado, Jambu & Goma de Tapioca do Norte", cat: "Produtos Regionais", icon: "🫙", imgType: "tempero", brands: ["Sabor de Manaus", "Feira do Ver-o-Peso", "Delícias do Norte", "Da Roça AM/PA", "Tapioquinha"], units: ["500g", "1L", "2L"], basePrices: [8.50, 9.90, 17.90], isRegional: true, regionTag: "Norte" },
    { baseName: "Castanha-do-Pará, Farinha de Bragança / Uarini & Paçoca de Carne RR", cat: "Produtos Regionais", icon: "🌰", imgType: "farinha", brands: ["Norte Castanhas", "Bragança Original", "Roraima Sabor", "Uarini Ouro", "Amazônia Viva"], units: ["250g", "500g", "1kg"], basePrices: [14.90, 24.90, 32.90], isRegional: true, regionTag: "Norte" },
    { baseName: "Bebidas Regionais do Norte (Baré / Tuchaua / Garoto / Cerpa)", cat: "Produtos Regionais", icon: "🥤", imgType: "bebida", brands: ["Baré", "Tuchaua", "Guaraná Garoto", "Tijuca", "Cerpa Export"], units: ["350ml", "1.5L", "2L"], basePrices: [3.29, 6.49, 7.89], isRegional: true, regionTag: "Norte" },

    // Produtos Regionais — Região Nordeste (CE, PE, BA, MA, PI, RN, PB, AL, SE)
    { baseName: "Queijo Coalho Nordestino & Queijo Manteiga do Sertão", cat: "Produtos Regionais", icon: "🧀", imgType: "manteiga", brands: ["Sertão Nobre", "Fazenda Cariri", "Laticínios Betânia", "Valedourado", "Natville", "isis"], units: ["400g", "500g", "kg"], basePrices: [16.90, 21.90, 39.90], isRegional: true, regionTag: "Nordeste" },
    { baseName: "Carne de Sol Nordestina, Manteiga da Terra & Bolo de Rolo", cat: "Produtos Regionais", icon: "🥩", imgType: "carne", brands: ["Sabor do Nordeste", "São Braz", " Casa dos Frios PE", "Sertão Forte", "Delícias do Ceará"], units: ["250ml", "500g", "kg"], basePrices: [14.90, 22.90, 42.90], isRegional: true, regionTag: "Nordeste" },
    { baseName: "Azeite de Dendê, Leite de Coco & Farinha de Cuscuz Nordestina", cat: "Produtos Regionais", icon: "🥥", imgType: "oleo", brands: ["Sococo", "Menina", "Opalma", "Vitamilho", "São Braz", "Coringa", "Maratá"], units: ["200ml", "500ml", "500g"], basePrices: [3.99, 8.90, 2.59], isRegional: true, regionTag: "Nordeste" },
    { baseName: "Bebidas do Nordeste (Cajuína São Geraldo / Guaraná Jesus / Frevo)", cat: "Produtos Regionais", icon: "🥤", imgType: "bebida", brands: ["São Geraldo CE", "Guaraná Jesus MA", "Frevo PE", "Cajuína Piauí", "Indaiá"], units: ["350ml", "1L", "2L"], basePrices: [3.49, 6.90, 8.49], isRegional: true, regionTag: "Nordeste" },

    // Produtos Regionais — Região Centro-Oeste (DF, GO, MT, MS)
    { baseName: "Pequi Goiano em Conserva, Guariroba & Pamonha do Cerrado", cat: "Produtos Regionais", icon: "🫙", imgType: "tempero", brands: ["Sabor do Cerrado", "Goianinho", "Olé Goiás", "Pantanal Viva", "Cristal GO"], units: ["300g", "500g", "800g"], basePrices: [11.90, 16.90, 24.90], isRegional: true, regionTag: "Centro-Oeste" },
    { baseName: "Erva-Mate para Tereré Sul-Mato-Grossense & Cuiabana", cat: "Produtos Regionais", icon: "🧉", imgType: "cafe", brands: ["Kurupí", "Campanário", "Tereré Pantanal", "uhde", "Ouro Verde MS"], units: ["500g", "1kg"], basePrices: [12.90, 22.90], isRegional: true, regionTag: "Centro-Oeste" },
    { baseName: "Pintado, Pacu do Pantanal & Linguiça Cuiabana com Queijo", cat: "Produtos Regionais", icon: "🐟", imgType: "peixe", brands: ["Pescados do Pantanal", "Frigorífico Cuiabá", "Sabores da Chapada", "Boi Verde MS"], units: ["500g", "kg"], basePrices: [19.90, 36.90], isRegional: true, regionTag: "Centro-Oeste" },

    // Produtos Regionais — Região Sudeste (SP, RJ, MG, ES)
    { baseName: "Queijo Minas Frescal / Canastra, Pão de Queijo & Doce de Leite MG", cat: "Produtos Regionais", icon: "🧀", imgType: "manteiga", brands: ["Forno de Minas", "Viçosa", "Aviação", "Verde Campo", "Porto Alegre MG", "Tirolez"], units: ["400g", "500g", "1kg"], basePrices: [13.90, 18.90, 34.90], isRegional: true, regionTag: "Sudeste" },
    { baseName: "Chá Mate Tostado, Biscoito de Polvilho & Mortadela Tradicional", cat: "Produtos Regionais", icon: "🧉", imgType: "biscoito", brands: ["Mate Leão", "Biscoito Globo", "Ceratti", "Piraquê", "Café Número Um ES"], units: ["200g", "250g", "1.5L"], basePrices: [5.49, 8.90, 6.90], isRegional: true, regionTag: "Sudeste" },

    // Produtos Regionais — Região Sul (PR, RS, SC)
    { baseName: "Erva-Mate para Chimarrão Tradicional & Moída Grossa", cat: "Produtos Regionais", icon: "🧉", imgType: "cafe", brands: ["Barão de Cotegipe", "Madrugada", "Rei Verde", "Ximango", "Baldo", "Laranjeiras"], units: ["500g", "1kg"], basePrices: [8.90, 15.90], isRegional: true, regionTag: "Sul" },
    { baseName: "Costela Gaúcha Janela, Linguiça Blumenau & Salame Colonial Sul", cat: "Produtos Regionais", icon: "🥩", imgType: "carne", brands: ["Olho Embutidos Blumenau", "Aurora Sul", "Frimesa PR", "Pamplona SC", "Dália RS"], units: ["400g", "kg"], basePrices: [18.90, 37.90], isRegional: true, regionTag: "Sul" },
    { baseName: "Pinhão Selecionado, Cuca Alemã & Bebidas do Sul (Fruki / Cini)", cat: "Produtos Regionais", icon: "🌰", imgType: "bebida", brands: ["Fruki RS", "Cini Gengibirra PR", "Água da Serra SC", "Eisenbahn", "Polar"], units: ["350ml", "500g", "2L"], basePrices: [3.49, 12.90, 7.49], isRegional: true, regionTag: "Sul" },

    // Hortifruti & Manaus
    { baseName: "Frutas Selecionadas (Banana Pacovã / Prata / Maçã / Mamão / Melancia)", cat: "Hortifruti & Manaus", icon: "🍌", imgType: "hortifruti", brands: ["Produtor Rural AM", "Horta Regional", "Ceasa Manaus", "Fazenda Solimões", "Seleção Verde"], units: ["kg", "Palma"], basePrices: [6.90, 8.90] },
    { baseName: "Legumes Frescos (Tomate / Batata / Cebola / Cenoura / Macaxeira)", cat: "Hortifruti & Manaus", icon: "🍅", imgType: "hortifruti", brands: ["Ceasa Manaus", "Produtor Rural AM", "Horta Iranduba", "Seleção da Feira"], units: ["kg"], basePrices: [6.49] },
    { baseName: "Cheiro-Verde / Alface / Couve / Pimentão / Limão Taiti", cat: "Hortifruti & Manaus", icon: "🥬", imgType: "hortifruti", brands: ["Horta Hidropônica AM", "Produtor Iranduba", "Feira Manaus"], units: ["Maço", "kg"], basePrices: [3.49, 5.90] },

    // Especiarias & Temperos
    { baseName: "Tempero Completo / Alho e Sal / Colorau / Cominho / Pimenta", cat: "Especiarias & Temperos", icon: "🌶️", imgType: "tempero", brands: ["Kitano", "Sazón", "Knorr", "Maggi", "Arisco", "Maratá", "Sabor Ami"], units: ["60g", "100g", "300g"], basePrices: [3.29, 4.90, 6.90] },
    { baseName: "Sal Refinado / Sal Grosso para Churrasco", cat: "Especiarias & Temperos", icon: "🧂", imgType: "tempero", brands: ["Cisne", "Lebre", "Marfim", "Branco", "Grill"], units: ["1kg"], basePrices: [2.49] },
    { baseName: "Vinagre de Álcool / Maçã & Molho Shoyu", cat: "Especiarias & Temperos", icon: "🍶", imgType: "tempero", brands: ["Castelo", "Minhoto", "Sakura", "Liza", "Kenko"], units: ["500ml", "750ml"], basePrices: [4.49, 5.29] },

    // Limpeza & Higiene da Casa
    { baseName: "Lava-Roupas em Pó / Líquido Concentrado", cat: "Limpeza & Higiene", icon: "🧺", imgType: "sabao_po", brands: ["Omo", "Brilhante", "Tixan Ypê", "Ace", "Ariel", "Surf", "Ala"], units: ["800g", "1.6kg", "2.2kg", "3L"], basePrices: [9.90, 18.90, 25.90, 29.90] },
    { baseName: "Detergente Lava-Louças Líquido", cat: "Limpeza & Higiene", icon: "🫧", imgType: "limpeza", brands: ["Ypê", "Limpol", "Minuano", "Brilux", "Odd"], units: ["500ml"], basePrices: [2.29] },
    { baseName: "Amaciante de Roupas Concentrado / Tradicional", cat: "Limpeza & Higiene", icon: "🌸", imgType: "limpeza", brands: ["Downy", "Comfort", "Ypê", "Fofo", "Baby Soft", "Mon Bijou"], units: ["500ml", "1.5L", "2L"], basePrices: [9.90, 18.90, 11.90] },
    { baseName: "Água Sanitária & Alvejante sem Cloro", cat: "Limpeza & Higiene", icon: "🧼", imgType: "limpeza", brands: ["Qboa", "Brilux", "Ypê", "Dragão", "Vanish"], units: ["1L", "2L", "5L"], basePrices: [3.29, 5.79, 13.90] },
    { baseName: "Desinfetante Perfumado & Multiuso", cat: "Limpeza & Higiene", icon: "✨", imgType: "limpeza", brands: ["Pinho Sol", "Veja", "Casa KM", "Kalipto", "Lysoform", "Uau", "Ajax"], units: ["500ml", "1L", "2L"], basePrices: [5.49, 8.90, 12.90] },
    { baseName: "Esponja Dupla Face & Lã de Aço", cat: "Limpeza & Higiene", icon: "🧽", imgType: "limpeza", brands: ["Scotch-Brite", "Bombril", "Assolan", "Bettanin", "Condor"], units: ["Pct 4un", "Pct 8un"], basePrices: [4.29, 3.19] },
    { baseName: "Saco para Lixo Reforçado", cat: "Limpeza & Higiene", icon: "🗑️", imgType: "limpeza", brands: ["Dover-Roll", "Bettanin", "Embalixo", "SuperPro"], units: ["30L", "50L", "100L"], basePrices: [7.90, 9.90, 12.90] },

    // Higiene & Drogaria
    { baseName: "Papel Higiênico Folha Dupla Neutro", cat: "Higiene & Drogaria", icon: "🧻", imgType: "higiene", brands: ["Neve", "Personal", "Sublime", "Mili", "Fofinho", "Cotton"], units: ["12 rolos", "16 rolos", "24 rolos"], basePrices: [15.90, 20.90, 29.90] },
    { baseName: "Sabonete Hidratante em Barra", cat: "Higiene & Drogaria", icon: "🧼", imgType: "higiene", brands: ["Dove", "Lux", "Nivea", "Palmolive", "Rexona", "Protex", "Phebo"], units: ["85g", "90g", "Kit 6un"], basePrices: [2.79, 3.99, 18.90] },
    { baseName: "Shampoo & Condicionador Tratamento", cat: "Higiene & Drogaria", icon: "🧴", imgType: "higiene", brands: ["Pantene", "Elseve", "Seda", "Clear", "Dove", "Tresemmé", "Head & Shoulders"], units: ["325ml", "400ml"], basePrices: [12.90, 16.90] },
    { baseName: "Creme Dental & Enxaguante Bucal", cat: "Higiene & Drogaria", icon: "🪥", imgType: "higiene", brands: ["Colgate", "Oral-B", "Sorriso", "Close-Up", "Sensodyne", "Listerine"], units: ["70g", "90g", "180g", "500ml"], basePrices: [3.99, 5.49, 8.90, 17.90] },
    { baseName: "Desodorante Aerosol Antitranspirante", cat: "Higiene & Drogaria", icon: "💨", imgType: "higiene", brands: ["Rexona", "Dove", "Nivea", "Above", "Monange", "Old Spice"], units: ["150ml", "250ml"], basePrices: [12.90, 16.90] },
    { baseName: "Absorvente Higiênico com Abas", cat: "Higiene & Drogaria", icon: "🌸", imgType: "higiene", brands: ["Sempre Livre", "Intimus", "Sym", "Mili"], units: ["Pct 8un", "Pct 16un", "Pct 32un"], basePrices: [5.49, 9.90, 17.90] },

    // Bebê & Infantil
    { baseName: "Fralda Descartável Infantil Mega", cat: "Bebê & Infantil", icon: "👶", imgType: "bebe", brands: ["Pampers", "Huggies", "Mamypoko", "Turma da Mônica", "Babysec", "Pom Pom"], units: ["Tam M", "Tam G", "Tam XG", "Tam XXG"], basePrices: [38.90, 42.90, 45.90, 48.90] },
    { baseName: "Lenço Umedecido & Sabonete Líquido Bebê", cat: "Bebê & Infantil", icon: "👶", imgType: "bebe", brands: ["Johnson's Baby", "Huggies", "Pampers", "Granado Bebê", "Mamypoko"], units: ["48 un", "96 un", "200ml"], basePrices: [8.90, 15.90, 16.90] },
    { baseName: "Composto Lácteo & Cereal Infantil", cat: "Bebê & Infantil", icon: "🍼", imgType: "bebe", brands: ["Ninho Fases", "Mucilon Nestlé", "Milnutri", "Nestogeno", "Nan Supreme"], units: ["400g", "800g"], basePrices: [18.90, 44.90] },

    // Pets & Animais
    { baseName: "Ração Seca Premium para Cães e Gatos", cat: "Pets & Animais", icon: "🐾", imgType: "pet", brands: ["Pedigree", "Whiskas", "Golden", "Dog Chow", "Cat Chow", "Friskies", "Champ"], units: ["1kg", "3kg", "10.1kg", "15kg"], basePrices: [16.90, 44.90, 109.90, 139.90] },
    { baseName: "Sachê Úmido / Petisco / Areia Higiênica Pet", cat: "Pets & Animais", icon: "🐶", imgType: "pet", brands: ["Pedigree", "Whiskas", "Pipicat", "Doguitos", "Dreamies", "Chalesco"], units: ["85g", "100g", "4kg"], basePrices: [2.99, 3.29, 16.90] },

    // Papelaria & Bazar
    { baseName: "Utilidades Domésticas, Papelaria & Descartáveis", cat: "Papelaria & Bazar", icon: "📚", imgType: "bazar", brands: ["Tramontina", "Chamex", "Faber-Castell", "Bic", "Wyda", "Copobras", "Duracell"], units: ["Unidade", "Pacote", "Kit"], basePrices: [8.90, 14.90, 24.90] }
  ];

  // Gerar os +1.000 produtos de forma determinística e incluir pequeno/médio/grande porte em todos
  (function expandCatalogTo1000Plus() {
    // 1. Adicionar cotações de Pequeno Porte (Mercadinho de Bairro e Feira/Sacolão) nos 66 produtos base
    PRODUCTS.forEach((p, idx) => {
      const vals = Object.values(p.prices).map(v => v.price);
      const minP = Math.min(...vals);
      const isFresh = (p.category || "").includes("Hortifruti") || (p.category || "").includes("Peixes") || Boolean(p.isRegional);
      if (!p.prices.mercadinho_bairro) {
        p.prices.mercadinho_bairro = {
          price: +(minP * (1.03 + (idx % 5) * 0.01)).toFixed(2),
          neighborhood: "A 400m no seu Bairro"
        };
      }
      if (!p.prices.sacolao_feira) {
        p.prices.sacolao_feira = { price: +(minP * (isFresh ? 0.94 : (1.01 + (idx % 4) * 0.01))).toFixed(2), neighborhood: "Feira / Hortifruti" };
      }
      const extraSlots = ["m9", "m10", "m11", "m12", "m13", "m14", "m15"];
      extraSlots.forEach((slot, sIdx) => {
        if (!p.prices[slot]) {
          p.prices[slot] = {
            price: +(minP * (0.97 + ((idx + sIdx * 3) % 11) * 0.01)).toFixed(2),
            neighborhood: "Unidade Local"
          };
        }
      });
    });

    const existingIds = new Set(PRODUCTS.map(p => p.id));
    let seq = 100;
    const storeNeighborhoods = {
      atacadao: "Atacarejo",
      nova_era: "Atacarejo",
      assai: "Atacarejo",
      db: "Hipermercado",
      baratao: "Rede Média Regional",
      carrefour: "Supermercado Médio",
      mercadinho_bairro: "A 400m no seu Bairro",
      sacolao_feira: "Feira / Sacolão Local",
      m9: "Unidade Local", m10: "Unidade Local", m11: "Unidade Local",
      m12: "Unidade Local", m13: "Unidade Premium", m14: "Unidade Local", m15: "Unidade Bairro"
    };

    for (const tpl of CATALOG_TEMPLATES) {
      for (let bIdx = 0; bIdx < tpl.brands.length; bIdx++) {
        const brand = tpl.brands[bIdx];
        for (let uIdx = 0; uIdx < tpl.units.length; uIdx++) {
          const unit = tpl.units[uIdx];
          const basePrice = tpl.basePrices[uIdx % tpl.basePrices.length];

          // Criar 5 variações por combinação para atingir +5.000 itens reais cobrindo todas as linhas de mercado
          const variants = ["Tradicional", "Seleção Especial", "Econômico", "Linha Família", "Atacado Leve+"];
          const variantMultipliers = [1.00, 1.06, 0.91, 0.95, 0.88];
          for (let vIdx = 0; vIdx < variants.length; vIdx++) {
            seq++;
            const id = `pm_prod_${seq}`;
            if (existingIds.has(id)) continue;

            const variantLabel = vIdx === 0 ? "" : ` ${variants[vIdx]}`;
            const name = `${tpl.baseName}${variantLabel} ${brand} ${unit}`;
            const ean = `789${String(100000000 + seq * 137).slice(0, 9)}${(seq % 10)}`;
            KNOWN_EANS[id] = ean;

            // Variação determinística de preço por marca, linha e mercado
            const brandFactor = (0.94 + ((bIdx * 7 + vIdx * 5) % 18) * 0.01) * variantMultipliers[vIdx];
            const refPrice = Math.max(1.49, +(basePrice * brandFactor).toFixed(2));
            const isFresh = tpl.cat.includes("Hortifruti") || tpl.cat.includes("Peixes") || Boolean(tpl.isRegional);

            const storeFactors = {
              atacadao: 0.95 + ((seq + 1) % 7) * 0.01,
              nova_era: 0.96 + ((seq + 3) % 7) * 0.01,
              assai: 0.96 + ((seq + 5) % 7) * 0.01,
              baratao: 0.98 + ((seq + 2) % 8) * 0.01,
              db: 1.03 + ((seq + 4) % 9) * 0.01,
              carrefour: 1.05 + ((seq + 6) % 9) * 0.01,
              mercadinho_bairro: 1.02 + ((seq + 2) % 6) * 0.01,
              sacolao_feira: isFresh ? (0.92 + (seq % 5) * 0.01) : (1.01 + (seq % 6) * 0.01),
              m9: 0.97 + ((seq + 1) % 8) * 0.01,
              m10: 0.98 + ((seq + 2) % 8) * 0.01,
              m11: 0.99 + ((seq + 3) % 8) * 0.01,
              m12: 0.97 + ((seq + 4) % 9) * 0.01,
              m13: 1.04 + ((seq + 5) % 8) * 0.01,
              m14: 0.98 + ((seq + 6) % 7) * 0.01,
              m15: 1.01 + ((seq + 7) % 6) * 0.01
            };

            const prices = {};
            for (const [sKey, sFactor] of Object.entries(storeFactors)) {
              prices[sKey] = {
                price: +(refPrice * sFactor).toFixed(2),
                neighborhood: storeNeighborhoods[sKey]
              };
            }

            PRODUCTS.push({
              id,
              name,
              brand,
              unit,
              category: tpl.cat,
              icon: tpl.icon,
              imgType: tpl.imgType,
              ean,
              isRegional: Boolean(tpl.isRegional),
              regionTag: tpl.regionTag || null,
              prices
            });
          }
        }
      }
    }
  })();

  const ManausCatalog = {
    SUPERMARKETS,
    CITIES_CONFIG,
    KNOWN_EANS,
    PRODUCTS,
    FLYERS,
    DIEESE_12_ITEMS,
    DEFAULT_CONTRIBUTIONS
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = ManausCatalog;
  }
  if (root) {
    root.ManausCatalog = ManausCatalog;
    root.SUPERMARKETS = SUPERMARKETS;
    root.CITIES_CONFIG = CITIES_CONFIG;
    root.KNOWN_EANS = KNOWN_EANS;
    root.PRODUCTS = PRODUCTS;
    root.FLYERS = FLYERS;
    root.DIEESE_12_ITEMS = DIEESE_12_ITEMS;
  }
})(typeof window !== "undefined" ? window : globalThis);
