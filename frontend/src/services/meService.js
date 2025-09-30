// frontend/src/services/meService.js
import { api } from "../lib/api";

// Asegura que exista la fila en Neon (usa tu GET /api/me que hace upsert)
export async function getOrCreateMe() {
  const { data } = await api.get("/me");
  return data;
}

// Completa nombre/telefono si faltaban (no pisa datos ya existentes)
export async function bootstrapMe(payload /* { nombre?, telefono? } */) {
  const { data } = await api.post("/me", payload);
  return data;
}
