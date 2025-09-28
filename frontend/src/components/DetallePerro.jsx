import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { obtenerMascota } from "../services/mascotasService";

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
      .then((full) => { if (alive) setPet(prev => prev ? ({ ...prev, ...full }) : full); })
      .catch((e) => { if (alive) setErr(e?.response?.data?.error || e?.message || "No se pudo cargar la mascota"); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id]);

  const img = pet?.fotoUrl || pet?.photoPath || "/imagenes/pets/default.png";
  const nombre = pet?.nombre || "Mascota";

  // Campos opcionales
  const raza = pet?.raza ?? "—";
  const pesoKg = (pet?.pesoKg ?? pet?.peso) ?? "—";
  const alturaCm = pet?.alturaCm ?? "—";
  const edadMeses = pet?.edadMeses ?? "—";

  return (
    <div className="min-vh-100 d-flex align-items-start justify-content-center" style={{ background: "#f6fbff" }}>
      <div className="w-100 shadow-sm mt-4" style={{ maxWidth: 480, borderRadius: 24, border: "2px solid #0c4a6e", background: "#fff" }}>
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between px-3 pt-3 pb-2" style={{ borderBottom: "1px solid #d9eefc" }}>
          <button className="btn btn-light rounded-circle d-flex align-items-center justify-content-center border-0"
                  onClick={() => navigate(-1)} style={{ width: 44, height: 44 }} aria-label="Volver" title="Volver">
            <i className="bi bi-arrow-left-short fs-3" style={{ color: "#2389c0" }} />
          </button>
          <div className="text-center flex-grow-1">
            <img src="/imagenes/LogoPetLife.png" alt="PetLife" style={{ width: 110 }} />
          </div>
          <button className="btn btn-light rounded-circle d-flex align-items-center justify-content-center border-0"
                  onClick={() => navigate("/consultar-usuario")} style={{ width: 44, height: 44 }} aria-label="Perfil" title="Perfil">
            <i className="bi bi-person-fill fs-4" style={{ color: "#2389c0" }} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="px-3 py-3">
          {err && <div className="alert alert-danger">{err}</div>}

          <div className="d-flex gap-3 align-items-start">
            {/* Imagen grande */}
            <div className="flex-shrink-0">
              <img
                src={img}
                alt={nombre}
                style={{ width: 140, height: 140, objectFit: "cover", borderRadius: 18, border: "1px solid #e6e6e6", background: "#f8fafc" }}
                onError={(e) => { e.currentTarget.src = "/imagenes/pets/default.png"; }}
              />
            </div>

            {/* Datos */}
            <div className="flex-grow-1">
              <div className="mb-2"><strong>Raza:</strong> {raza}</div>
              <div className="mb-2"><strong>Peso:</strong> {pesoKg} {pesoKg !== "—" ? "kg" : ""}</div>
              <div className="mb-2"><strong>Altura:</strong> {alturaCm} {alturaCm !== "—" ? "cm" : ""}</div>
              <div className="mb-2"><strong>Edad:</strong> {edadMeses} {edadMeses !== "—" ? "meses" : ""}</div>

              {/* Botón/ícono de editar (placeholder) */}
              <button className="btn btn-outline-secondary btn-sm mt-1" title="Editar datos" onClick={() => alert("Acción de editar (pendiente)")}>
                <i className="bi bi-pencil-square me-1" /> Editar
              </button>
            </div>
          </div>

          {/* Nombre grande */}
          <div className="text-start mt-3">
            <h2 className="display-6 fw-bold mb-1" style={{ letterSpacing: "1px" }}>
              {loading ? "Cargando..." : nombre.toUpperCase()}
            </h2>
          </div>

          {/* Fila de iconos inferior como en el boceto */}
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
