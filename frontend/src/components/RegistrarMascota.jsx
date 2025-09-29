import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { crearMascota } from "../services/mascotasService";
import RAZAS from "../data/razas_perros.json"; // ES (incluye "Sin raza definida")

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

export default function RegistrarMascota() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    nombre: "",
    sexo: "",         // obligatorio
    tamaño: "",
    raza: "",
    peso: "",
    foto: null,
    nacDia: "",
    nacMes: "",
    nacAnio: "",
  });

  const [preview, setPreview] = useState(null);
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  const meses = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const dias  = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);
  const anioActual = new Date().getFullYear();
  const anios = useMemo(() => Array.from({ length: 31 }, (_, i) => anioActual - i), [anioActual]);

  const [showRazas, setShowRazas] = useState(false);
  const razaWrapRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (razaWrapRef.current && !razaWrapRef.current.contains(e.target)) {
        setShowRazas(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const razasFiltradas = useMemo(() => {
    const q = (form.raza || "").toLowerCase().trim();
    if (!q) return RAZAS;
    return RAZAS.filter((r) => r.toLowerCase().includes(q));
  }, [form.raza]);

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

  // Edad estimada (solo años para mostrar)
  const edadPreview = useMemo(() => {
    if (!form.nacDia || !form.nacMes || !form.nacAnio) return "";
    const dt = validarFechaYCrear(Number(form.nacDia), Number(form.nacMes), Number(form.nacAnio));
    if (!dt) return "Fecha inválida";
    if (dt > new Date()) return "La fecha no puede ser futura";
    const mesesTot = edadEnMesesDesde(dt);
    const años = Math.floor(mesesTot / 12);
    return `${años} año(s)`;
  }, [form.nacDia, form.nacMes, form.nacAnio]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOk(""); setErr("");

    if (!form.nombre.trim()) return setErr("El nombre es obligatorio.");
    if (!form.sexo) return setErr("Seleccioná el sexo (macho o hembra).");

    let edadMeses, cumpleDia, cumpleMes;
    if (form.nacDia || form.nacMes || form.nacAnio) {
      if (!form.nacDia || !form.nacMes || !form.nacAnio) {
        return setErr("Completá día, mes y año (o dejá todo en blanco).");
      }
      const dt = validarFechaYCrear(+form.nacDia, +form.nacMes, +form.nacAnio);
      if (!dt) return setErr("La fecha de nacimiento no es válida.");
      if (dt > new Date()) return setErr("La fecha de nacimiento no puede ser futura.");
      edadMeses = edadEnMesesDesde(dt);
      cumpleDia = dt.getDate();
      cumpleMes = dt.getMonth() + 1;
    }

    try {
      const payload = {
        nombre: form.nombre.trim(),
        sexo: form.sexo,
        tamaño: form.tamaño || undefined,
        raza: form.raza || undefined,
        pesoKg: form.peso ? Number(form.peso) : undefined,
        edadMeses,
        cumpleDia,
        cumpleMes,
      };
      await crearMascota(payload);
      setOk("Mascota registrada");
      setTimeout(() => navigate("/menu"), 800);
    } catch (e) {
      setErr(e?.response?.data?.error || "No se pudo registrar la mascota");
    }
  };

  const handleCancel = () => navigate("/menu");

  return (
    <div className="min-vh-100 d-flex align-items-start justify-content-center bg-light">
      <div className="bg-white w-100 shadow-sm mt-4 p-4"
           style={{ maxWidth: 520, borderRadius: 22, border: "2px solid #111" }}>
        {/* Header */}
        <div className="text-center mb-3">
          <img src="/imagenes/LogoPetLife.png" alt="PetLife"
               style={{ width: 120, height: "auto", objectFit: "contain" }} />
        </div>

        <form onSubmit={handleSubmit}>
          {ok && <div className="alert alert-success py-2">{ok}</div>}
          {err && <div className="alert alert-danger py-2">{err}</div>}

          {/* GRID: Izquierda (Imagen + Nombre) | Derecha (resto) */}
          <div className="row g-3">
            {/* Columna izquierda */}
            <div className="col-12 col-md-5">
              {/* Zona de imagen clickeable */}
              <div className="mb-2 text-center">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={openFilePicker}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openFilePicker()}
                  title="Subir imagen"
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
                      <img
                        src={preview}
                        alt="Imagen de la mascota"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <span
                        style={{
                          position: "absolute", bottom: 6, right: 6,
                          background: "rgba(0,0,0,0.55)", color: "#fff",
                          padding: "2px 6px", borderRadius: 8, fontSize: 12
                        }}
                      >
                        Cambiar foto
                      </span>
                    </>
                  ) : (
                    <span style={{ color: "#888", fontSize: 14 }}>IMAGEN</span>
                  )}
                </div>

                {/* input de archivo oculto */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="d-none"
                  onChange={handleImageChange}
                />
              </div>

              {/* Nombre */}
              <div className="mb-2">
                <label className="form-label">Nombre *</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Columna derecha */}
            <div className="col-12 col-md-7">
              {/* Fila: Sexo y Tamaño */}
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

              {/* Raza (buscador con dropdown) */}
              <div className="mt-2" ref={razaWrapRef}>
                <label className="form-label">Raza</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder='Buscar raza… (p. ej., "Sin raza definida")'
                  value={form.raza}
                  onChange={(e) => setForm((f) => ({ ...f, raza: e.target.value }))}
                  onFocus={() => setShowRazas(true)}
                  onClick={() => setShowRazas(true)}
                  onKeyDown={(e) => { if (e.key === "Escape") setShowRazas(false); }}
                />
                {showRazas && (
                  <div
                    className="mt-2 border rounded"
                    style={{ maxHeight: 220, overflowY: "auto", boxShadow: "0 6px 18px rgba(0,0,0,0.08)" }}
                  >
                    <div className="px-2 py-1 text-muted small">— Buscar / Seleccionar raza —</div>
                    <select
                      className="form-select border-0"
                      size={7}
                      value={razasFiltradas.includes(form.raza) ? form.raza : ""}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, raza: e.target.value }));
                        setShowRazas(false);
                      }}
                    >
                      <option value=""></option>
                      {razasFiltradas.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="form-text">
                  Tip: si tu perrito no tiene raza definida, elegí <strong>Sin raza definida</strong>.
                </div>
              </div>

              {/* Peso */}
              <div className="mt-2">
                <label className="form-label">Peso (kg)</label>
                <input
                  type="number"
                  className="form-control"
                  name="peso"
                  value={form.peso}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                />
              </div>

              {/* Fecha de nacimiento (estimado) */}
              <div className="mt-2">
                <label className="form-label">Fecha de nacimiento (estimado)</label>
                <div className="d-flex align-items-center gap-2">
                  <select className="form-select" name="nacDia" value={form.nacDia} onChange={handleChange} style={{ maxWidth: 90 }}>
                    <option value="">Día</option>
                    {dias.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <span>/</span>
                  <select className="form-select" name="nacMes" value={form.nacMes} onChange={handleChange} style={{ maxWidth: 110 }}>
                    <option value="">Mes</option>
                    {meses.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <span>/</span>
                  <select className="form-select" name="nacAnio" value={form.nacAnio} onChange={handleChange} style={{ maxWidth: 120 }}>
                    <option value="">Año</option>
                    {anios.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                {edadPreview && (
                  <div className="form-text mt-1">
                    Edad estimada: <strong>{edadPreview}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="d-flex justify-content-between gap-3 mt-3">
            <button type="submit" className="btn btn-success w-50" style={{ borderRadius: 12 }}>
              OK
            </button>
            <button type="button" className="btn btn-danger w-50" style={{ borderRadius: 12 }} onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
