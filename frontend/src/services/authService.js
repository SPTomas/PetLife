// frontend/src/services/authService.js
import { supabase } from '../lib/supabase';
import { bootstrapMe, getOrCreateMe } from './meService';

// REGISTRO con nombre (se guarda en user_metadata y, si hay sesión, se sincroniza a Neon)
export async function signUpWithEmail(nombre, email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nombre: nombre || null } }, // opcional, queda en Supabase
  });
  if (error) throw error;

  // Si NO usás confirmación de email, Supabase devuelve session acá.
  // Sembramos el perfil en Neon con el nombre:
  if (data?.session) {
    await bootstrapMe({ nombre: nombre || undefined });
  }

  return data?.user ?? null;
}

// LOGIN: asegura fila en Neon y, si hay nombre en user_metadata, lo completa
export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  // 1) Asegura que exista el usuario en Neon (upsert)
  await getOrCreateMe();

  // 2) Si en Supabase quedó guardado el "nombre" del registro, lo pasamos a Neon
  const { data: userData } = await supabase.auth.getUser();
  const nombre = userData?.user?.user_metadata?.nombre;
  if (nombre) {
    await bootstrapMe({ nombre });
  }

  return data?.user ?? null;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
