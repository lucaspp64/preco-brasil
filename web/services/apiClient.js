/**
 * PreçoManaus — Cliente de API Unificado (com Fallback Offline automático)
 * Conecta o Web/PWA ao servidor Node.js (/api/...) para SEFAZ-AM NFC-e, Gemini Vision e Comunidade.
 */
(function (root) {
  const PrecoManausApi = {
    baseUrl: "",

    async fetchCatalog() {
      try {
        const res = await fetch(`${this.baseUrl}/api/catalog`, { signal: AbortSignal.timeout(3500) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (_) {
        return null;
      }
    },

    async parseNfce(urlOrKey, storeKey = "db") {
      try {
        const res = await fetch(`${this.baseUrl}/api/nfce/parse`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urlOrKey, storeKey }),
          signal: AbortSignal.timeout(8000)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        return { ok: false, error: err.message };
      }
    },

    async scanLabelWithAi(imageBase64, hintText = "") {
      try {
        const res = await fetch(`${this.baseUrl}/api/ai/scan-label`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64, hintText }),
          signal: AbortSignal.timeout(12000)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        return { ok: false, error: err.message };
      }
    },

    async submitContribution(payload) {
      try {
        const res = await fetch(`${this.baseUrl}/api/community/contribute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(5000)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        return { ok: false, error: err.message };
      }
    }
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = PrecoManausApi;
  }
  if (root) {
    root.PrecoManausApi = PrecoManausApi;
  }
})(typeof window !== "undefined" ? window : globalThis);
