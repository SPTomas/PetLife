// mascotasService.js
import { api } from "../lib/api";

// 👉 NUEVO: normalizador
function normalizarMascota(raw = {}) {
  // nombre / sexo
  const nombre = raw.nombre ?? raw.name ?? "";
  const sexoRaw = raw.sexo ?? raw.gender ?? raw.sex ?? "";
  const sexo = (typeof sexoRaw === "string" ? sexoRaw.toLowerCase() : "").replace(/\s+/g, "");

  // tamaño (muchas variantes posibles)
  const tamRaw = raw.tamano ?? raw.tamaño ?? raw.tamanio ?? raw.size ?? "";
  const tamano = (typeof tamRaw === "string" ? tamRaw.toLowerCase() : "").replace("pequeno","pequeño");

  // peso
  const pesoKg = raw.pesoKg ?? raw.peso ?? raw.weight ?? null;

  // edad / cumple
  const edadMeses = raw.edadMeses ?? raw.edad_en_meses ?? null;
  const cumpleDia = raw.cumpleDia ?? raw.cumple_dia ?? null;
  const cumpleMes = raw.cumpleMes ?? raw.cumple_mes ?? null;
  const nacimiento = raw.nacimiento ?? raw.fechaNacimiento ?? null;

  // raza
  const raza = raw.raza ?? raw.breed ?? "";

  // foto
  const fotoUrl =
    raw.fotoUrl ?? raw._fotoUrl ?? raw.photoUrl ?? raw.photoPath ?? raw.foto_path ?? null;

  return {
    id: raw.id ?? raw.uuid ?? null,
    nombre,
    sexo,
    tamano,
    raza,
    pesoKg,
    edadMeses,
    cumpleDia,
    cumpleMes,
    nacimiento,
    fotoUrl,
    // por si necesitás los campos crudos:
    _raw: raw,
  };
}

export async function listarMascotas() {
  const { data } = await api.get("/me/mascotas");
  return Array.isArray(data) ? data.map(normalizarMascota) : [];
}

export async function obtenerMascota(id) {
  const { data } = await api.get(`/me/mascotas/${id}`);
  // 👇 log temporal para ver exactamente qué vuelve
  console.log("🐶 GET /me/mascotas/:id →", data);
  return normalizarMascota(data);
}

export async function crearMascota(payload) {
  const { data } = await api.post("/me/mascotas", payload);
  return data;
}

export async function actualizarMascota(id, payload) {
  const { data } = await api.put(`/me/mascotas/${id}`, payload);
  return data;
}

export async function eliminarMascota(id) {
  await api.delete(`/me/mascotas/${id}`);
}
