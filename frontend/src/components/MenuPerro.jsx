import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { obtenerMascota } from "../services/mascotasService";

function daysUntilBirthday(cumpleDia, cumpleMes) {
  if (!cumpleDia || !cumpleMes) return null;
  const now = new Date();
  const year = now.getFullYear();
  const today = new Date(year, now.getMonth(), now.getDate());
  const thisYearBday = new Date(year, cumpleMes - 1, cumpleDia);
  const nextBday = thisYearBday < today ? new Date(year + 1, cumpleMes - 1, cumpleDia) : thisYearBday;
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = Math.ceil((nextBday - now) / msPerDay);
  return diff >= 0 ? diff : 0;
}

export default function MenuPerro() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const preview = useMemo(() => state?.petPreview ?? null, [state]);
  const [pet, setPet] = useState(preview);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(!preview);

  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const profileBtnRef = useRef(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    let alive = true;
    setErr("");
    obtenerMascota(id)
      .then((full) => { if (alive) setPet(prev => prev ? ({ ...prev, ...full }) : full); })
      .catch((e) => { if (alive) setErr(e?.response?.data?.error || e?.message || "No se pudo cargar la mascota"); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id]);

  useEffect(() => {
    function onDocClick(e) {
      if (!openProfileMenu) return;
      const btn = profileBtnRef.current;
      const menu = profileMenuRef.current;
      if (btn && btn.contains(e.target)) return;
      if (menu && menu.contains(e.target)) return;
      setOpenProfileMenu(false);
    }
    function onKey(e) { if (e.key === "Escape") setOpenProfileMenu(false); }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openProfileMenu]);

  const img = pet?.fotoUrl || pet?.photoPath || "/imagenes/pets/default.png";
  const displayName = pet?.nombre || "Mascota";

  const goDetalle = () =>
    navigate(`/perro/${id}/detalle`, { state: { petPreview: pet } });

  const openPerfil = () => setOpenProfileMenu(v => !v);
  const goPerfilUsuario = () => { setOpenProfileMenu(false); navigate("/consultar-usuario"); };
  const goMisMascotas = () => { setOpenProfileMenu(false); navigate("/menu"); };

  // Notificaciones
  const days = daysUntilBirthday(pet?.cumpleDia, pet?.cumpleMes);
  const hasBirthday = days !== null;
  const bg = hasBirthday ? (days === 0 ? "#e7fbe7" : days <= 7 ? "#f0fff4" : "#e8f6ff") : "#fff9e6";
  const border = hasBirthday ? (days === 0 ? "#2e7d32" : days <= 7 ? "#4caf50" : "#2389c0") : "#f0c36d";

  return (
    <div className="min-vh-100 d-flex align-items-start justify-content-center" style={{ background: "#e8f6ef" }}>
      <div className="w-100 shadow-sm mt-4" style={{ maxWidth: 420, borderRadius: 22, border: "2px solid #0c4a6e", background: "#fff", position: "relative" }}>
        {/* Header */}
        <div className="d-flex align-items-start justify-content-between px-3 pt-3 pb-2" style={{ borderBottom: "1px solid #d9eefc", position: "relative" }}>
          {/* Botón perfil con dropdown */}
          <button
            ref={profileBtnRef}
            className="btn btn-light rounded-circle d-flex align-items-center justify-content-center border-0 position-relative"
            onClick={openPerfil}
            aria-expanded={openProfileMenu}
            aria-haspopup="menu"
            style={{ width: 44, height: 44 }}
            title="Perfil"
          >
            <i className="bi bi-person-fill fs-4" style={{ color: "#2389c0" }} />
          </button>

          {/* Logo */}
          <div className="text-center pt-1" style={{ flex: 1 }}>
            <img src="/imagenes/LogoPetLife.png" alt="PetLife" style={{ width: 90 }} />
          </div>

          {/* Foto + Nombre (juntos) */}
          <div className="d-flex flex-column align-items-center" style={{ minWidth: 84 }}>
            <img
              src={img}
              alt={displayName}
              role="button"
              onClick={goDetalle}
              style={{
                width: 72,
                height: 72,
                borderRadius: 12,
                objectFit: "cover",
                border: "2px solid #d9eefc",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
              onError={(e) => { e.currentTarget.src = "/imagenes/pets/default.png"; }}
              title="Ver detalle"
            />
            <button
              onClick={goDetalle}
              className="btn btn-link p-0 mt-1 text-decoration-none text-nowrap"
              style={{ lineHeight: 1, fontWeight: 600 }}
              title="Ver detalle"
            >
              {loading ? "Cargando..." : displayName}
            </button>
          </div>

          {/* Menu desplegable */}
          {openProfileMenu && (
            <div
              ref={profileMenuRef}
              role="menu"
              className="shadow-sm"
              style={{
                position: "absolute",
                top: 60,
                left: 12,
                minWidth: 220,
                background: "#ffffff",
                border: "1px solid #e7eef6",
                borderRadius: 12,
                padding: 8,
                zIndex: 10
              }}
            >
              <button className="btn w-100 d-flex align-items-center gap-2" style={{ justifyContent: "flex-start", background: "transparent" }} onClick={goPerfilUsuario} role="menuitem">
                <i className="bi bi-person-vcard" />
                <span>Mi perfil</span>
              </button>
              <hr className="my-2" />
              <button className="btn w-100 d-flex align-items-center gap-2" style={{ justifyContent: "flex-start", background: "transparent" }} onClick={goMisMascotas} role="menuitem">
                <i className="bi bi-collection" />
                <span>Mis mascotas</span>
              </button>
            </div>
          )}
        </div>

        {err && <div className="alert alert-danger mx-3 mt-3 mb-0">{err}</div>}

        {/* Panel central: NOTIFICACIONES */}
        <div className="m-3" style={{ borderRadius: 18, background: bg, border: `1.5px solid ${border}`, padding: 16 }}>
          {loading ? (
            <div className="text-muted text-center">Cargando notificaciones…</div>
          ) : hasBirthday ? (
            days === 0 ? (
              <div className="d-flex align-items-start gap-3">
                <i className="bi bi-balloon-heart-fill fs-3" />
                <div>
                  <div className="fw-bold">¡Hoy {displayName} cumple años! 🥳</div>
                  <div>¡Dale un mimo extra y guardá la fecha en tus notas!</div>
                </div>
              </div>
            ) : (
              <div className="d-flex align-items-start gap-3">
                <i className="bi bi-calendar-event fs-3" />
                <div>
                  <div className="fw-bold">Faltan {days} día{days === 1 ? "" : "s"} para el cumple de {displayName} 🎂</div>
                  <div>Podés agendarlo o preparar una sorpresita.</div>
                </div>
              </div>
            )
          ) : (
            <div className="d-flex align-items-start gap-3">
              <i className="bi bi-exclamation-triangle fs-3" />
              <div>
                <div className="fw-bold">Cumpleaños sin configurar</div>
                <div>Agregá día y mes de nacimiento para recibir recordatorios.</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer (tabs) */}
        <div className="d-flex gap-2 px-3 pb-3">
          <button className="btn btn-light flex-fill pet-tab" title="Comida">
            <i className="bi bi-basket-fill fs-4" />
            <small>Comida</small>
          </button>
          <button className="btn btn-light flex-fill pet-tab" title="Vacunas">
            <i className="bi bi-bandaid fs-4" />
            <small>Vacunas</small>
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
