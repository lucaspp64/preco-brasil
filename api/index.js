/**
 * Entrypoint Serverless para Vercel (api/index.js)
 * Redireciona todas as chamadas /api/* para o handler unificado do servidor PreçoBrasil.
 */
const { handleRequest } = require("../server/index.js");

module.exports = async (req, res) => {
  return handleRequest(req, res);
};
