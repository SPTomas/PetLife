import { supabase, signedUrlFromPath } from "../lib/supabase";

// Retorna una URL para <img src=...>
// - Si hay fotoUrl guardada (público), úsala.
// - Si no hay fotoUrl pero hay fotoPath (privado), pide una signed URL.
// - Si no hay nada, devuelve null.
export async function getPetImageUrl(pet) {
  if (pet?.fotoUrl) return pet.fotoUrl;
  if (pet?.fotoPath) {
    // bucket privado: pedimos una signed URL de 1 hora
    return await signedUrlFromPath(pet.fotoPath, 3600);
  }
  return null;
}
