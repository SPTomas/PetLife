// frontend/src/components/ModificarPerro.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { obtenerMascota, actualizarMascota, eliminarMascota } from "../services/mascotasService";
import { uploadPetPhoto } from "../lib/supabase";
import RAZAS from "../data/razas_perros.json";

// === Helpers fecha ===
function edadEnMesesDesde(fecha) {
  const hoy = new Date();
  let meses = (hoy.getFullYear() - fecha.getFullYear()) * 12 + (hoy.getMonth() - fecha.getMonth());
  if (hoy.getDate() < fecha.getDate()) meses -= 1;
  return Math.max(0, meses);
}
function validarFechaYCrear(d, m, y) {
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== Number(y) || dt.getMonth() !== Number(m) - 1 || dt.getDate() !== Number(d)) return null;
  return dt;
}
async function getImageSize(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { resolve({ width: img.naturalWidth, height: img.naturalHeight }); URL.revokeObjectURL(url); };
    img.onerror = reject;
    img.src = url;
  });
}

// Construye un preview para pasar a DetallePerro al volver
function formToPetPreview(form) {
  return {
    nombre: form.nombre?.trim() || "Mascota",
    sexo: form.sexo || "",
    tamano: form.tamaño || "",
    raza: form.raza || "",
    pesoKg: form.peso ? Number(form.peso) : undefined,
    cumpleDia: form.nacDia ? Number(form.nacDia) : undefined,
    cumpleMes: form.nacMes ? Number(form.nacMes) : undefined,
    fotoUrl: form.foto ? null : (form.fotoActualUrl || null),
  };
}

// === Normaliza cualquier shape del back/preview a forma del form ===
function toFormShape(p = {}) {
  try {
    const tam = p.tamano ?? p.tamaño ?? p.tamanio ?? p.size ?? "";
    const peso = p.pesoKg ?? p.peso ?? p.weight ?? "";
    const fotoUrl = p.fotoUrl || p._fotoUrl || p.photoUrl || p.photoPath || "";

    const nacDia  = p.cumpleDia ? String(p.cumpleDia) : "";
    const nacMes  = p.cumpleMes ? String(p.cumpleMes) : "";
    const nacAnio = p.nacimiento?.slice?.(0, 4) || p.fechaNacimiento?.slice?.(0, 4) || "";

    return {
      nombre: p.nombre ?? "",
      sexo: (p.sexo ?? "").toString().toLowerCase(),
      tamaño: tam?.toString() ?? "",
      raza: p.raza ?? "",
      peso: (peso !== "" && peso != null) ? String(peso) : "",
      nacDia, nacMes, nacAnio,
      fotoActualUrl: fotoUrl,
      _previewImg: fotoUrl || null,
    };
  } catch (e) {
    console.error("toFormShape error:", e, p);
    return {
      nombre: "", sexo: "", tamaño: "", raza: "", peso: "",
      nacDia: "", nacMes: "", nacAnio: "", fotoActualUrl: "", _previewImg: null
    };
  }
}

// === Campos a comparar para detectar cambios ===
const FIELDS_FOR_DIRTY = ["nombre", "sexo", "tamaño", "raza", "peso", "nacDia", "nacMes", "nacAnio"];

export default function ModificarPerro() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const previewFromState = useMemo(() => state?.petPreview ?? null, [state]);

  // UI refs
  const fileInputRef = useRef(null);
  const razaWrapRef   = useRef(null);
  const fetchedOnce   = useRef(false);

  // Menú razas + confirms
  const [showRazas, setShowRazas] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);          // confirmar guardar
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false); // confirmar eliminar

  // Form controlado
  const [form, setForm] = useState({
    nombre: "", sexo: "", tamaño: "", raza: "", peso: "",
    nacDia: "", nacMes: "", nacAnio: "",
    foto: null, fotoActualUrl: ""
  });
  const [preview, setPreview] = useState(null);

  // Estados
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  // Snapshot inicial para dirty-check
  const initialFormRef = useRef({ ...form });

  // Cerrar listado razas al click afuera
  useEffect(() => {
    const onClick = (e) => { if (razaWrapRef.current && !razaWrapRef.current.contains(e.target)) setShowRazas(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Precarga inmediata desde state.petPreview si existe
  useEffect(() => {
    try {
      if (previewFromState) {
        const f = toFormShape(previewFromState);
        const merged = { ...form, ...f, foto: null };
        setForm(merged);
        setPreview(f._previewImg);
        initialFormRef.current = { ...merged }; // snapshot desde preview
      }
    } catch (e) {
      console.error("precarga preview error:", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewFromState]);

  // Fetch al backend (no rompe si falla)
  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    let alive = true;
    (async () => {
      try {
        setErr("");
        const full = await obtenerMascota(id);
        if (!alive || !full) return;

        const f = toFormShape(full);
        const merged = { ...initialFormRef.current, ...f, foto: null };
        setForm(merged);
        if (f._previewImg) setPreview(f._previewImg);

        if (!previewFromState) initialFormRef.current = { ...merged };
      } catch (e) {
        const msg = e?.response?.data?.error || e.message || "No se pudo cargar la mascota";
        if (!previewFromState) setErr(msg);
        console.warn("obtenerMascota falló:", msg);
      }
    })();

    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Catálogos
  const meses = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const dias  = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);
  const anioActual = new Date().getFullYear();
  const anios = useMemo(() => Array.from({ length: 31 }, (_, i) => anioActual - i), [anioActual]);

  const razasFiltradas = useMemo(() => {
    try {
      const q = (form.raza || "").toLowerCase().trim();
      if (!q) return RAZAS;
      return RAZAS.filter((r) => r.toLowerCase().includes(q));
    } catch {
      return RAZAS;
    }
  }, [form.raza]);

  // === Dirty check robusto ===
  const isDirty = useMemo(() => {
    const initial = initialFormRef.current || {};
    if (form.foto) return true; // si hay foto nueva, ya es dirty
    for (const k of FIELDS_FOR_DIRTY) {
      const a = (form?.[k] ?? "").toString();
      const b = (initial?.[k] ?? "").toString();
      if (a !== b) return true;
    }
    return false;
  }, [form]);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };
  const openFilePicker = () => fileInputRef.current?.click();
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((f) => ({ ...f, foto: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  // Volver a Detalle llevando preview para render inmediato
  const handleCancel = () => {
    const petPreview = formToPetPreview(form);
    navigate(`/perro/${id}/detalle`, { state: { petPreview } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading || !isDirty) return; // no abre modal si no hay cambios
    setErr("");
    setConfirmOpen(true);
  };

  // Guardado real
  const doSave = async () => {
    try {
      setLoading(true);
      setOk(""); setErr("");

      if (!form.nombre.trim()) { setErr("El nombre es obligatorio."); setLoading(false); return; }
      if (!form.sexo) { setErr("Seleccioná el sexo (macho o hembra)."); setLoading(false); return; }

      let edadMeses, cumpleDia, cumpleMes;
      if (form.nacDia || form.nacMes || form.nacAnio) {
        if (!form.nacDia || !form.nacMes || !form.nacAnio) { setErr("Completá día, mes y año (o dejá todo en blanco)."); setLoading(false); return; }
        const dt = validarFechaYCrear(+form.nacDia, +form.nacMes, +form.nacAnio);
        if (!dt) { setErr("La fecha de nacimiento no es válida."); setLoading(false); return; }
        if (dt > new Date()) { setErr("La fecha de nacimiento no puede ser futura."); setLoading(false); return; }
        edadMeses = edadEnMesesDesde(dt);
        cumpleDia = dt.getDate();
        cumpleMes = dt.getMonth() + 1;
      }

      // Subir nueva foto si se eligió
      let fotoBucket, fotoPath, fotoUrl, fotoSizeBytes, fotoWidth, fotoHeight, fotoFormat;
      if (form.foto) {
        const dims = await getImageSize(form.foto).catch(() => null);
        const up = await uploadPetPhoto(form.foto);
        fotoBucket    = up.bucket;
        fotoPath      = up.path;
        fotoUrl       = up.url;
        fotoSizeBytes = up.meta?.sizeBytes ?? null;
        fotoFormat    = up.meta?.format ?? null;
        fotoWidth     = dims?.width ?? null;
        fotoHeight    = dims?.height ?? null;
      }

      const payload = {
        nombre: form.nombre.trim(),
        sexo: form.sexo,
        tamano: form.tamaño || undefined,   // back sin ñ
        raza: form.raza || undefined,
        pesoKg: form.peso ? Number(form.peso) : undefined,
        edadMeses,
        cumpleDia,
        cumpleMes,
        ...(fotoUrl ? { fotoBucket, fotoPath, fotoUrl, fotoSizeBytes, fotoWidth, fotoHeight, fotoFormat } : {})
      };

      await actualizarMascota(id, payload);
      setOk("Mascota actualizada");
      setConfirmOpen(false);

      // volvemos a Detalle con preview para render inmediato
      const petPreview = formToPetPreview(form);
      setTimeout(() => navigate(`/perro/${id}/detalle`, { state: { petPreview } }), 600);
    } catch (e) {
      setErr(e?.response?.data?.error || e.message || "No se pudo actualizar la mascota");
    } finally {
      setLoading(false);
    }
  };

  // === ELIMINAR ===
  const handleDeleteClick = () => {
    setErr("");
    setOk("");
    setConfirmDeleteOpen(true);
  };

  const doDelete = async () => {
    try {
      setDeleting(true);
      setErr("");
      await eliminarMascota(id);
      setOk(`Se eliminó a ${form.nombre || "la mascota"}.`);
      setConfirmDeleteOpen(false);
      // Volvemos al menú principal
      setTimeout(() => navigate("/menu", { replace: true }), 600);
    } catch (e) {
      setErr(e?.response?.data?.error || e.message || "No se pudo eliminar la mascota");
    } finally {
      setDeleting(false);
    }
  };

  const edadPreview = useMemo(() => {
    if (!form.nacDia || !form.nacMes || !form.nacAnio) return "";
    const dt = validarFechaYCrear(+form.nacDia, +form.nacMes, +form.nacAnio);
    if (!dt) return "Fecha inválida";
    if (dt > new Date()) return "La fecha no puede ser futura";
    const mesesTot = edadEnMesesDesde(dt);
    const años = Math.floor(mesesTot / 12);
    return `${años} año(s)`;
  }, [form.nacDia, form.nacMes, form.nacAnio]);

  // Botón Guardar: deshabilitado si no hay cambios
  const saveDisabled = loading || !isDirty;
  const saveClass = `btn w-100 w-md-50 ${saveDisabled ? "btn-secondary opacity-75" : "btn-success"}`;
  const saveStyle = { borderRadius: 12, cursor: saveDisabled ? "not-allowed" : "pointer" };

  return (
    <div className="min-vh-100 d-flex align-items-start justify-content-center bg-light">
      <div className="bg-white w-100 shadow-sm mt-4 p-4"
           style={{ maxWidth: 520, borderRadius: 22, border: "2px solid #111", position: "relative" }}>
        {/* Header */}
        <div className="text-center mb-3">
          <img src="/imagenes/LogoPetLife.png" alt="PetLife" style={{ width: 120, height: "auto", objectFit: "contain" }} />
        </div>

        <form onSubmit={handleSubmit}>
          {ok && <div className="alert alert-success py-2">{ok}</div>}
          {err && <div className="alert alert-danger py-2">{err}</div>}

          <div className="row g-3">
            {/* Izquierda: imagen + nombre */}
            <div className="col-12 col-md-5">
              <div className="mb-2 text-center">
                <div
                  role="button" tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileInputRef.current?.click()}
                  title="Cambiar imagen"
                  style={{
                    width: 160, height: 160, borderRadius: 16,
                    border: preview ? "2px solid #ccc" : "2px dashed #bbb",
                    background: "#fff", margin: "0 auto",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", position: "relative", overflow: "hidden",
                  }}
                >
                  {preview ? (
                    <>
                      <img src={preview} alt="Imagen de la mascota" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <span style={{ position: "absolute", bottom: 6, right: 6, background: "rgba(0,0,0,0.55)", color: "#fff", padding: "2px 6px", borderRadius: 8, fontSize: 12 }}>
                        Cambiar foto
                      </span>
                    </>
                  ) : (
                    <span style={{ color: "#888", fontSize: 14 }}>IMAGEN</span>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="d-none" onChange={handleImageChange} />
              </div>

              <div className="mb-2">
                <label className="form-label">Nombre *</label>
                <input type="text" className="form-control" name="nombre" value={form.nombre} onChange={handleChange} required />
              </div>
            </div>

            {/* Derecha: resto */}
            <div className="col-12 col-md-7">
              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label">Sexo *</label>
                  <select className="form-select" name="sexo" value={form.sexo} onChange={handleChange} required>
                    <option value="">Seleccionar</option>
                    <option value="macho">Macho</option>
                    <option value="hembra">Hembra</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label">Tamaño</label>
                  <select className="form-select" name="tamaño" value={form.tamaño} onChange={handleChange}>
                    <option value="">Seleccionar</option>
                    <option value="pequeño">Pequeño</option>
                    <option value="mediano">Mediano</option>
                    <option value="grande">Grande</option>
                  </select>
                </div>
              </div>

              <div className="mt-2" ref={razaWrapRef}>
                <label className="form-label">Raza</label>
                <input
                  type="text" className="form-control" placeholder='Buscar raza… (p. ej., "Sin raza definida")'
                  value={form.raza}
                  onChange={(e) => setForm((f) => ({ ...f, raza: e.target.value }))}
                  onFocus={() => setShowRazas(true)} onClick={() => setShowRazas(true)}
                  onKeyDown={(e) => { if (e.key === "Escape") setShowRazas(false); }}
                />
                {showRazas && (
                  <div className="mt-2 border rounded" style={{ maxHeight: 220, overflowY: "auto", boxShadow: "0 6px 18px rgba(0,0,0,0.08)" }}>
                    <div className="px-2 py-1 text-muted small">— Buscar / Seleccionar raza —</div>
                    <select
                      className="form-select border-0" size={7}
                      value={RAZAS.includes(form.raza) ? form.raza : ""}
                      onChange={(e) => { setForm((f) => ({ ...f, raza: e.target.value })); setShowRazas(false); }}
                    >
                      <option value=""></option>
                      {RAZAS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <div className="mt-2">
                <label className="form-label">Peso (kg)</label>
                <input type="number" className="form-control" name="peso" value={form.peso} onChange={handleChange} min="0" step="0.1" />
              </div>

              <div className="mt-2">
                <label className="form-label">Fecha de nacimiento (estimado)</label>
                <div className="d-flex align-items-center gap-2">
                  <select className="form-select" name="nacDia" value={form.nacDia} onChange={handleChange} style={{ maxWidth: 90 }}>
                    <option value="">Día</option>{dias.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <span>/</span>
                  <select className="form-select" name="nacMes" value={form.nacMes} onChange={handleChange} style={{ maxWidth: 110 }}>
                    <option value="">Mes</option>{meses.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <span>/</span>
                  <select className="form-select" name="nacAnio" value={form.nacAnio} onChange={handleChange} style={{ maxWidth: 120 }}>
                    <option value="">Año</option>{anios.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                {edadPreview && <div className="form-text mt-1">Edad estimada: <strong>{edadPreview}</strong></div>}
              </div>
            </div>
          </div>

          {/* Botonera */}
          <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mt-4">
            <button
              type="submit"
              className={saveClass}
              style={saveStyle}
              disabled={saveDisabled}
              title={saveDisabled ? "No hay cambios para guardar" : "Guardar cambios"}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>

            {/* NUEVO: Eliminar mascota */}
            <button
              type="button"
              className="btn btn-outline-danger w-100 w-md-50"
              style={{ borderRadius: 12 }}
              onClick={handleDeleteClick}
              disabled={loading || deleting}
              title={`Eliminar ${form.nombre || "la mascota"}`}
            >
              {deleting ? "Eliminando..." : "Eliminar mascota"}
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary w-100 w-md-50"
              style={{ borderRadius: 12 }}
              onClick={handleCancel}
              disabled={loading || deleting}
              title="Volver sin guardar"
            >
              Cancelar
            </button>
          </div>
        </form>

        {/* Confirmación — GUARDAR */}
        {confirmOpen && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)", zIndex: 1050 }}
            onClick={() => setConfirmOpen(false)}
          >
            <div
              role="dialog" aria-modal="true"
              className="bg-white shadow rounded-4"
              style={{ width: "min(92%, 380px)", padding: "18px 18px 14px" }}
              onClick={(e) => e.stopPropagation()}
              tabIndex={-1}
              onKeyDown={(e) => {
                if (e.key === "Escape") setConfirmOpen(false);
                if (e.key === "Enter") !loading && doSave();
              }}
            >
              <h5 className="text-center fw-bold mb-2" style={{ letterSpacing: 0.2 }}>
                ¿Estás seguro de modificar
                <br />
                tus datos?
              </h5>
              <p className="text-center text-muted mb-3" style={{ fontSize: 14 }}>
                Se actualizarán los datos de <strong>{form.nombre || "la mascota"}</strong>.
              </p>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-success flex-fill fw-semibold rounded-3 py-2"
                  onClick={doSave}
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Aceptar"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary flex-fill fw-semibold rounded-3 py-2"
                  onClick={() => setConfirmOpen(false)}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmación — ELIMINAR */}
        {confirmDeleteOpen && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)", zIndex: 1050 }}
            onClick={() => setConfirmDeleteOpen(false)}
          >
            <div
              role="dialog" aria-modal="true"
              className="bg-white shadow rounded-4"
              style={{ width: "min(92%, 380px)", padding: "18px 18px 14px" }}
              onClick={(e) => e.stopPropagation()}
              tabIndex={-1}
              onKeyDown={(e) => {
                if (e.key === "Escape") setConfirmDeleteOpen(false);
                if (e.key === "Enter") !deleting && doDelete();
              }}
            >
              <h5 className="text-center fw-bold mb-2" style={{ letterSpacing: 0.2, color: "#b91c1c" }}>
                ¿Estás seguro de eliminar a
                <br />
                {form.nombre || "la mascota"}?
              </h5>
              <p className="text-center text-muted mb-3" style={{ fontSize: 14 }}>
                Se perderán sus datos <strong>permanentemente</strong>.
              </p>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-danger flex-fill fw-semibold rounded-3 py-2"
                  onClick={doDelete}
                  disabled={deleting}
                >
                  {deleting ? "Eliminando..." : "Aceptar"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary flex-fill fw-semibold rounded-3 py-2"
                  onClick={() => setConfirmDeleteOpen(false)}
                  disabled={deleting}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

