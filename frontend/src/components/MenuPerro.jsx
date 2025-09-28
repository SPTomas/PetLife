import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { obtenerMascota } from "../services/mascotasService";

export default function MenuPerro() {
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
  const displayName = pet?.nombre || "Mascota";

  const goDetalle = () => {
    navigate(`/perro/${id}/detalle`, { state: { petPreview: pet } });
  };

  return (
    <div className="min-vh-100 d-flex align-items-start justify-content-center" style={{ background: "#e8f6ef" }}>
      <div className="w-100 shadow-sm mt-4" style={{ maxWidth: 420, borderRadius: 22, border: "2px solid #0c4a6e", background: "#fff" }}>
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between px-3 pt-3 pb-2" style={{ borderBottom: "1px solid #d9eefc" }}>
          <button className="btn btn-light rounded-circle d-flex align-items-center justify-content-center border-0"
                  onClick={() => navigate("/consultar-usuario")} style={{ width: 44, height: 44 }} aria-label="Perfil" title="Perfil">
            <i className="bi bi-person-fill fs-4" style={{ color: "#2389c0" }} />
          </button>

          <div className="text-center flex-grow-1">
            <img src="/imagenes/LogoPetLife.png" alt="PetLife" style={{ width: 90 }} />
          </div>

          {/* IMAGEN - clickeable */}
          <img
            src={img}
            alt={displayName}
            role="button"
            onClick={goDetalle}
            style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }}
            onError={(e) => { e.currentTarget.src = "/imagenes/pets/default.png"; }}
            title="Ver detalle"
          />
        </div>

        {/* Nombre (clickeable) */}
        <div className="px-3 pt-2 text-end">
          <h5 className="fw-semibold mb-0">
            <button onClick={goDetalle} className="btn btn-link p-0 text-decoration-none" title="Ver detalle">
              {loading ? "Cargando..." : displayName}
            </button>
          </h5>
        </div>

        {err && <div className="alert alert-danger mx-3 mt-3 mb-0">{err}</div>}

        {/* Panel central (placeholder) */}
        <div className="m-3 d-flex align-items-center justify-content-center"
             style={{ height: 260, borderRadius: 18, background: "#d2f1fb" }}>
          {loading ? (
            <span className="text-muted">Cargando datos...</span>
          ) : (
            <div className="text-center">
              <div className="mb-1"><strong>Raza:</strong> {pet?.raza ?? "—"}</div>
              <div className="mb-1"><strong>Sexo:</strong> {pet?.sexo ?? "—"}</div>
              <div className="mb-1"><strong>Edad (meses):</strong> {pet?.edadMeses ?? "—"}</div>
              <div className="mb-1"><strong>Peso (kg):</strong> {pet?.pesoKg ?? "—"}</div>
            </div>
          )}
        </div>

        {/* Footer con tabs (igual que antes) */}
        <div className="d-flex gap-2 px-3 pb-3">
          <button className="btn btn-light flex-fill pet-tab" title="Comida">
            <i className="bi bi-basket-fill fs-4" />
            <small>Comida</small>
          </button>
          <button className="btn btn-light flex-fill pet-tab" title="Vacunas">
            <i className="bi bi-bandaid fs-4" />
            <small>Vacunas</small>
          </button>
          <button className="btn btn-light flex-fill pet-tab" title="Inicio" onClick={() => navigate("/menu")}>
            <i className="bi bi-house-fill fs-4" />
            <small>Inicio</small>
          </button>
          <button className="btn btn-light flex-fill pet-tab" title="Notas">
            <i className="bi bi-file-earmark-text-fill fs-4" />
            <small>Notas</small>
          </button>
          <button className="btn btn-light flex-fill pet-tab" title="Veterinarias">
            <i className="bi bi-heart-pulse-fill fs-4" />
            <small>Veterinarias</small>
          </button>
        </div>
      </div>
    </div>
  );
}
