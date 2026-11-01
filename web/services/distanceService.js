/**
 * PreçoManaus — Serviço de Distâncias Urbanas e Coordenadas de Bairros de Manaus (Haversine + Combustível)
 * Compatível com Browser (window) e Node.js (CommonJS).
 */
(function (root) {
  const DistanceService = {
    neighborhoods: {
      adrianopolis: { name: "Adrianópolis", zone: "Centro-Sul", lat: -3.1095, lng: -60.0163 },
      flores: { name: "Flores / Pq 10", zone: "Centro-Sul", lat: -3.0765, lng: -60.0182 },
      vieiralves: { name: "Vieiralves / N. Sra. Graças", zone: "Centro-Sul", lat: -3.1120, lng: -60.0210 },
      aleixo: { name: "Aleixo", zone: "Centro-Sul", lat: -3.0970, lng: -60.0030 },
      chapada: { name: "Chapada", zone: "Centro-Sul", lat: -3.0980, lng: -60.0310 },
      cidade_nova: { name: "Cidade Nova", zone: "Norte", lat: -3.0389, lng: -59.9794 },
      nova_cidade: { name: "Nova Cidade", zone: "Norte", lat: -3.0030, lng: -59.9920 },
      monte_oliveiras: { name: "Monte das Oliveiras", zone: "Norte", lat: -3.0110, lng: -60.0050 },
      autaz_mirim: { name: "São José / Z. Leste", zone: "Leste", lat: -3.0754, lng: -59.9392 },
      coroado: { name: "Coroado", zone: "Leste", lat: -3.0950, lng: -59.9850 },
      jorge_teixeira: { name: "Jorge Teixeira", zone: "Leste", lat: -3.0480, lng: -59.9310 },
      armando_mendes: { name: "Armando Mendes", zone: "Leste", lat: -3.0950, lng: -59.9400 },
      betania: { name: "Betânia / Distrito", zone: "Sul", lat: -3.1415, lng: -60.0028 },
      centro: { name: "Centro Histórico", zone: "Sul", lat: -3.1317, lng: -60.0242 },
      praca_14: { name: "Praça 14 / Cachoeirinha", zone: "Sul", lat: -3.1260, lng: -60.0100 },
      japiim: { name: "Japiim", zone: "Sul", lat: -3.1180, lng: -59.9910 },
      ponta_negra: { name: "Ponta Negra", zone: "Oeste", lat: -3.0560, lng: -60.1030 },
      compensa: { name: "Compensa", zone: "Oeste", lat: -3.1070, lng: -60.0570 },
      taruma: { name: "Tarumã", zone: "Oeste", lat: -3.0080, lng: -60.0750 },
      alvorada: { name: "Alvorada", zone: "Centro-Oeste", lat: -3.0850, lng: -60.0450 },
      dom_pedro: { name: "Dom Pedro / Planalto", zone: "Centro-Oeste", lat: -3.0830, lng: -60.0460 }
    },

    supermarkets: {
      db: { name: "Hiper DB Paraíba", lat: -3.1110, lng: -60.0150 },
      nova_era: { name: "Nova Era Torquato", lat: -3.0620, lng: -60.0270 },
      atacadao: { name: "Atacadão Camapuã", lat: -3.0350, lng: -59.9720 },
      assai: { name: "Assaí Autaz Mirim", lat: -3.0730, lng: -59.9410 },
      baratao: { name: "Baratão Betânia", lat: -3.1400, lng: -60.0050 },
      carrefour: { name: "Carrefour Adrianópolis", lat: -3.1070, lng: -60.0190 },
      mercadinho_bairro: { name: "Mercadinho do Bairro", lat: -3.1060, lng: -60.0130 },
      sacolao_feira: { name: "Sacolão & Feira Local", lat: -3.1080, lng: -60.0140 }
    },

    haversineDistanceKm(lat1, lon1, lat2, lon2) {
      const R = 6371;
      const toRad = deg => (deg * Math.PI) / 180;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },

    calculateDistanceKm(lat1, lon1, lat2, lon2) {
      const straight = this.haversineDistanceKm(lat1, lon1, lat2, lon2);
      return parseFloat((straight * 1.35).toFixed(1));
    },

    getNeighborhoodToStoreKm(neighborhoodKey, storeKey) {
      // Mercadinho de esquina e feira do próprio bairro ficam sempre pertinho da residência do usuário
      if (storeKey === "mercadinho_bairro") return 0.4;
      if (storeKey === "sacolao_feira") return 0.8;
      const n = this.neighborhoods[neighborhoodKey] || this.neighborhoods.adrianopolis;
      const s = this.supermarkets[storeKey];
      if (!s) return 5.0;
      return this.calculateDistanceKm(n.lat, n.lng, s.lat, s.lng);
    },

    getStoreToStoreKm(storeKey1, storeKey2) {
      if (storeKey1 === storeKey2) return 0;
      if (storeKey1 === "mercadinho_bairro" || storeKey2 === "mercadinho_bairro") return 1.2;
      if (storeKey1 === "sacolao_feira" || storeKey2 === "sacolao_feira") return 1.5;
      const s1 = this.supermarkets[storeKey1];
      const s2 = this.supermarkets[storeKey2];
      if (!s1 || !s2) return 5.0;
      return this.calculateDistanceKm(s1.lat, s1.lng, s2.lat, s2.lng);
    },

    calculateFuelCost(km, ratePerKm = 1.50) {
      // Até 0.9km ida e volta (~400m de distância), dá para ir a pé sem gastar combustível!
      if (km <= 0.9) return 0.0;
      return parseFloat((km * ratePerKm).toFixed(2));
    },

    findClosestNeighborhood(userLat, userLng) {
      let closestKey = "adrianopolis";
      let minDistance = Infinity;

      for (const [key, neigh] of Object.entries(this.neighborhoods)) {
        const d = this.haversineDistanceKm(userLat, userLng, neigh.lat, neigh.lng);
        if (d < minDistance) {
          minDistance = d;
          closestKey = key;
        }
      }

      const MANAUS_CENTER = { lat: -3.1317, lng: -60.0242 };
      const distFromManausCenter = this.haversineDistanceKm(userLat, userLng, MANAUS_CENTER.lat, MANAUS_CENTER.lng);

      return {
        key: closestKey,
        neighborhood: this.neighborhoods[closestKey],
        distanceKm: parseFloat(minDistance.toFixed(2)),
        distFromManausCenter: parseFloat(distFromManausCenter.toFixed(1)),
        isOutOfManaus: distFromManausCenter > 40
      };
    }
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = DistanceService;
  }
  if (root) {
    root.DistanceService = DistanceService;
  }
})(typeof window !== "undefined" ? window : globalThis);
