import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { obtenerMascota } from "../services/mascotasService";

// Helpers
function edadAnhosDesdeMeses(m) {
  if (m == null || isNaN(m)) return null;
  return Math.max(0, Math.floor(Number(m) / 12));
}
function edadAnhosDesdeFecha(fechaISO) {
  if (!fechaISO) return null;
  const f = new Date(fechaISO);
  if (isNaN(f.getTime())) return null;
  const hoy = new Date();
  let anhos = hoy.getFullYear() - f.getFullYear();
  const antesCumple = (hoy.getMonth() < f.getMonth()) ||
                      (hoy.getMonth() === f.getMonth() && hoy.getDate() < f.getDate());
  if (antesCumple) anhos -= 1;
  return Math.max(0, anhos);
}

export default function DetallePerro() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const preview = useMemo(() => state?.petPreview ?? null, [state]);
  const [pet, setPet] = useState(preview);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(!preview);

  useEffect(() => {
    let alive = true;
    setErr("");
    obtenerMascota(id)
      .then((full) => {
        if (!alive) return;
        setPet((prev) => (prev ? { ...prev, ...full } : full));
      })
      .catch((e) => {
        if (!alive) return;
        setErr(e?.response?.data?.error || e?.message || "No se pudo cargar la mascota");
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id]);

  const img = pet?.fotoUrl || pet?.photoPath || "/imagenes/pets/default.png";
  const nombre = pet?.nombre || "Mascota";

  // Derivaciones y fallbacks
  const sexo = pet?.sexo ?? "—";
  const tamaño = pet?.tamaño ?? "—";
  const raza = pet?.raza ?? "—";
  const pesoKg = (pet?.pesoKg ?? pet?.peso) ?? "—";

  // Edad (años) a partir de edadMeses o fechaNacimiento si existiera
  const edadAnios =
    edadAnhosDesdeMeses(pet?.edadMeses) ??
    edadAnhosDesdeFecha(pet?.fechaNacimiento || pet?.nacimiento);

  const cumpleDia = pet?.cumpleDia;
  const cumpleMes = pet?.cumpleMes;
  const cumpleStr = (cumpleDia && cumpleMes) ? `${String(cumpleDia).padStart(2, "0")}/${String(cumpleMes).padStart(2, "0")}` : null;

  const colors = {
    border: "#0c4a6e",
    brand: "#2389c0",
    halo: "#d9eefc",
    ink: "#102A43",
  };

  return (
    <div className="min-vh-100 d-flex align-items-start justify-content-center" style={{ background: "#f6fbff" }}>
      <div className="w-100 shadow-sm mt-4" style={{ maxWidth: 520, borderRadius: 24, border: `2px solid ${colors.border}`, background: "#fff" }}>
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between px-3 pt-3 pb-2" style={{ borderBottom: `1px solid ${colors.halo}` }}>
          <button className="btn btn-light rounded-circle d-flex align-items-center justify-content-center border-0"
                  onClick={() => navigate(-1)} style={{ width: 44, height: 44 }} aria-label="Volver" title="Volver">
            <i className="bi bi-arrow-left-short fs-3" style={{ color: colors.brand }} />
          </button>
          <div className="text-center flex-grow-1">
            <img src="/imagenes/LogoPetLife.png" alt="PetLife" style={{ width: 110 }} />
          </div>
          <button className="btn btn-light rounded-circle d-flex align-items-center justify-content-center border-0"
                  onClick={() => navigate("/consultar-usuario")} style={{ width: 44, height: 44 }} aria-label="Perfil" title="Perfil">
            <i className="bi bi-person-fill fs-4" style={{ color: colors.brand }} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="px-3 py-3">
          {err && <div className="alert alert-danger">{err}</div>}

          {/* Layout similar al registro: imagen a la izquierda, datos a la derecha */}
          <div className="row g-3 align-items-start">
            {/* Imagen */}
            <div className="col-12 col-md-5 d-flex justify-content-center">
              <img
                src={img}
                alt={nombre}
                style={{ width: 160, height: 160, objectFit: "cover", borderRadius: 18, border: "1px solid #e6e6e6", background: "#f8fafc" }}
                onError={(e) => { e.currentTarget.src = "/imagenes/pets/default.png"; }}
              />
            </div>

            {/* Datos */}
            <div className="col-12 col-md-7">
              <div className="mb-2"><strong>Sexo:</strong> {sexo}</div>
              <div className="mb-2"><strong>Tamaño:</strong> {tamaño}</div>
              <div className="mb-2"><strong>Raza:</strong> {raza}</div>
              <div className="mb-2"><strong>Peso:</strong> {pesoKg} {pesoKg !== "—" ? "kg" : ""}</div>
              <div className="mb-2"><strong>Edad:</strong> {edadAnios == null ? "—" : `${edadAnios} año(s)`}</div>
              {cumpleStr && <div className="mb-2"><strong>Cumpleaños:</strong> {cumpleStr}</div>}

              {/* Botón/ícono de editar (placeholder) */}
              <button
                className="btn btn-outline-secondary btn-sm mt-1"
                title="Editar datos"
                onClick={() => alert("Acción de editar (pendiente)")}
              >
                <i className="bi bi-pencil-square me-1" /> Editar
              </button>
            </div>
          </div>

          {/* Nombre */}
          <div className="text-start mt-3">
            <h2 className="display-6 fw-bold mb-1" style={{ letterSpacing: "1px", color: colors.ink }}>
              {loading ? "Cargando..." : nombre.toUpperCase()}
            </h2>
          </div>

          {/* Accesos rápidos (igual que antes) */}
          <div className="d-flex justify-content-between align-items-center gap-2 mt-3">
            <button className="btn btn-light flex-fill" title="Comida"><i className="bi bi-basket-fill fs-4 d-block" /><small>Comida</small></button>
            <button className="btn btn-light flex-fill" title="Vacunas"><i className="bi bi-bandaid fs-4 d-block" /><small>Vacunas</small></button>
            <button className="btn btn-light flex-fill" title="Inicio" onClick={() => navigate("/menu")}><i className="bi bi-house-fill fs-4 d-block" /><small>Inicio</small></button>
            <button className="btn btn-light flex-fill" title="Notas"><i className="bi bi-file-earmark-text-fill fs-4 d-block" /><small>Notas</small></button>
            <button className="btn btn-light flex-fill" title="Veterinarias"><i className="bi bi-heart-pulse-fill fs-4 d-block" /><small>Veterinarias</small></button>
          </div>
        </div>
      </div>
    </div>
  );
}
