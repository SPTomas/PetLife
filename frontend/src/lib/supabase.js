import { createClient } from '@supabase/supabase-js';
import { v4 as uuid } from 'uuid';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function getAccessToken() {
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token || null;
}

export async function getUserId() {
  const { data } = await supabase.auth.getUser();
  return data?.user?.id || null;
}

/**
 * Sube una foto al bucket 'pets' dentro de una carpeta por usuario (uid/uuid.ext).
 * Devuelve { bucket, path, url, meta }.
 * - Si el bucket es PÚBLICO: url será pública directa.
 * - Si el bucket es PRIVADO: podés pedir una signed URL (ver helper abajo).
 */
export async function uploadPetPhoto(file) {
  if (!file) return null;
  const uid = await getUserId();
  if (!uid) throw new Error('No user');

  const bucket = 'pets';
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const key = `${uid}/${uuid()}.${ext}`;

  const { error } = await supabase
    .storage
    .from(bucket)
    .upload(key, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'image/jpeg'
    });

  if (error) throw error;

  // Meta básica (tamaño y formato); dimensiones quedan opcional
  const meta = {
    sizeBytes: file.size || null,
    format: ext
  };

  // Si el bucket es PÚBLICO:
  const { data: pub } = supabase.storage.from(bucket).getPublicUrl(key);
  const url = pub?.publicUrl || null;

  return { bucket, path: key, url, meta };
}

/** PRIVADO: pedir URL firmada (1h por defecto) */
// export async function signedUrlFromPath(path, seconds = 3600) {
//   if (!path) return null;
//   const { data, error } = await supabase.storage.from('pets').createSignedUrl(path, seconds);
//   if (error) throw error;
//   return data?.signedUrl || null;
// }
