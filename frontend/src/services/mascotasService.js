import { api } from '../lib/api';

export async function listarMascotas() {
  const { data } = await api.get('/me/mascotas'); // alias /me/dogs
  return data; // [ { id, nombre, raza?, photoPath?, ... } ]
}

export async function obtenerMascota(id) {
  // Devuelve el detalle completo de una mascota
  const { data } = await api.get(`/me/mascotas/${id}`);
  return data; // { id, nombre, raza?, sexo?, edadMeses?, pesoKg?, photoPath?, ... }
}

export async function crearMascota(payload) {
  // payload: { nombre, raza?, sexo?, edadMeses?, pesoKg?, fechaCumple?, photoPath? }
  const { data } = await api.post('/me/mascotas', payload);
  return data;
}

export async function actualizarMascota(id, payload) {
  const { data } = await api.put(`/me/mascotas/${id}`, payload);
  return data;
}

export async function eliminarMascota(id) {
  await api.delete(`/me/mascotas/${id}`);
}
