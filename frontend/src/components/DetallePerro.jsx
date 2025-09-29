// frontend/src/components/DetallePerro.jsx
import { useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { obtenerMascota } from "../services/mascotasService";

function pad2(n) { return String(n).padStart(2, "0"); }

function dateFromParts(dia, mes, anio) {
  if (!dia || !mes || !anio) return null;
  const d = new Date(Number(anio), Number(mes) - 1, Number(dia));
  if (isNaN(d.getTime())) return null;
  if (d.getFullYear() !== Number(anio) || d.getMonth() !== Number(mes) - 1 || d.getDate() !== Number(dia)) return null;
  return d;
}

function formatearFechaNacimiento(pet) {
  const iso = pet?.nacimiento || pet?.fechaNacimiento;
  if (iso) {
    const d = new Date(iso);
    if (!isNaN(d.getTime())) {
      return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
    }
  }
  const dia = pet?.cumpleDia;
  const mes = pet?.cumpleMes;
  const anio = pet?.nacAnio ?? pet?.anioNacimiento ?? pet?.birthYear ?? null;
  if (dia && mes) return `${pad2(dia)}/${pad2(mes)}/${anio ? anio : "—"}`;
  return "—";
}

// Edad solo en años (hacia abajo)
function calcularEdadAnhos(pet) {
  const iso = pet?.nacimiento || pet?.fechaNacimiento;
  let nacimientoDate = null;
  if (iso) {
    const d = new Date(iso);
    if (!isNaN(d.getTime())) nacimientoDate = d;
  }
  if (!nacimientoDate) {
    nacimientoDate = dateFromParts(pet?.cumpleDia, pet?.cumpleMes, pet?.nacAnio);
  }
  if (nacimientoDate) {
    const hoy = new Date();
    let anhos = hoy.getFullYear() - nacimientoDate.getFullYear();
    const antesCumple = (hoy.getMonth() < nacimientoDate.getMonth()) ||
                        (hoy.getMonth() === nacimientoDate.getMonth() && hoy.getDate() < nacimientoDate.getDate());
    if (antesCumple) anhos -= 1;
    return Math.max(0, anhos).toString();
  }
  if ((pet?.edadMeses ?? null) != null) {
    return String(Math.floor(Number(pet.edadMeses) / 12));
  }
  return "—";
}

export default function DetallePerro() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const preview = useMemo(() => state?.petPreview ?? null, [state]);
  const [pet, setPet] = useState(preview);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(!preview);

  // Dropdown Perfil
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const profileBtnRef = useRef(null);
  const profileMenuRef = useRef(null);
  useEffect(() => {
    function onDocClick(e) {
      if (!openProfileMenu) return;
      const btn = profileBtnRef.current, menu = profileMenuRef.current;
      if (btn?.contains(e.target) || menu?.contains(e.target)) return;
      setOpenProfileMenu(false);
    }
    function onKey(e){ if(e.key==="Escape") setOpenProfileMenu(false); }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openProfileMenu]);

  useEffect(() => {
    let alive = true;
    setErr("");
    obtenerMascota(id)
      .then((full) => { if (alive) setPet(prev => prev ? ({ ...prev, ...full }) : full); })
      .catch((e) => { if (alive) setErr(e?.response?.data?.error || e?.message || "No se pudo cargar la mascota"); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id]);

  const img = pet?._fotoUrl || pet?.fotoUrl || pet?.photoPath || "/imagenes/pets/default.png";
  const nombre = pet?.nombre || "Mascota";
  const sexo = pet?.sexo ?? "—";
  const tamaño = (pet?.tamaño ?? pet?.tamano) ?? "—";
  const raza = pet?.raza ?? "—";
  const pesoKg = (pet?.pesoKg ?? pet?.peso) ?? "—";
  const fechaNacStr = formatearFechaNacimiento(pet);
  const edadAnhos = calcularEdadAnhos(pet);

  const colors = { border:"#0c4a6e", brand:"#2389c0", halo:"#d9eefc", ink:"#102A43" };

  const goPerfilUsuario = () => { setOpenProfileMenu(false); navigate("/consultar-usuario"); };
  const goMisMascotas   = () => { setOpenProfileMenu(false); navigate("/menu"); };
  const goInicioPerro   = () => { navigate(`/perro/${id}`, { state: { petPreview: pet } }); };

  return (
    <div className="min-vh-100 d-flex align-items-start justify-content-center" style={{ background: "#f6fbff" }}>
      <div className="w-100 shadow-sm mt-4" style={{ maxWidth: 520, borderRadius: 24, border: `2px solid ${colors.border}`, background: "#fff", position:"relative" }}>
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between px-3 pt-3 pb-2" style={{ borderBottom: `1px solid ${colors.halo}`, position:"relative" }}>
          {/* Dropdown de perfil */}
          <button
            ref={profileBtnRef}
            className="btn btn-light rounded-circle d-flex align-items-center justify-content-center border-0"
            onClick={() => setOpenProfileMenu(v=>!v)}
            aria-expanded={openProfileMenu}
            aria-haspopup="menu"
            style={{ width: 44, height: 44 }}
            title="Perfil"
          >
            <i className="bi bi-person-fill fs-4" style={{ color: colors.brand }} />
          </button>

          {openProfileMenu && (
            <div
              ref={profileMenuRef}
              role="menu"
              className="shadow-sm"
              style={{
                position: "absolute", top: 60, left: 12, minWidth: 220,
                background: "#fff", border: "1px solid #e7eef6",
                borderRadius: 12, padding: 8, zIndex: 10
              }}
            >
              <button className="btn w-100 d-flex align-items-center gap-2" style={{ justifyContent:"flex-start", background:"transparent" }} onClick={goPerfilUsuario} role="menuitem">
                <i className="bi bi-person-vcard" /><span>Mi perfil</span>
              </button>
              <hr className="my-2" />
              <button className="btn w-100 d-flex align-items-center gap-2" style={{ justifyContent:"flex-start", background:"transparent" }} onClick={goMisMascotas} role="menuitem">
                <i className="bi bi-collection" /><span>Mis mascotas</span>
              </button>
            </div>
          )}

          <div className="text-center flex-grow-1">
            <img src="/imagenes/LogoPetLife.png" alt="PetLife" style={{ width: 110 }} />
          </div>

          {/* Placeholder simétrico */}
          <div style={{ width: 44, height: 44 }} />
        </div>

        {/* Cuerpo */}
        <div className="px-3 py-3">
          {err && <div className="alert alert-danger">{err}</div>}

          <div className="row g-3 align-items-start">
            {/* Col izquierda: imagen + nombre debajo */}
            <div className="col-12 col-md-5 d-flex flex-column align-items-center">
              <img
                src={img}
                alt={nombre}
                style={{ width: 160, height: 160, objectFit: "cover", borderRadius: 18, border: "1px solid #e6e6e6", background: "#f8fafc" }}
                onError={(e) => { e.currentTarget.src = "/imagenes/pets/default.png"; }}
              />
              <h2 className="fw-bold mt-2 mb-0 text-center" style={{ letterSpacing: "0.5px", color: colors.ink }}>
                {loading ? "Cargando..." : nombre}
              </h2>
            </div>

            {/* Col derecha: info alineada a la izquierda */}
            <div className="col-12 col-md-7">
              <div className="mb-2"><strong>Edad:</strong> {edadAnhos === "—" ? "—" : `${edadAnhos} año(s)`}</div>
              <div className="mb-2"><strong>Sexo:</strong> {sexo}</div>
              <div className="mb-2"><strong>Tamaño:</strong> {tamaño}</div>
              <div className="mb-2"><strong>Raza:</strong> {raza}</div>
              <div className="mb-2"><strong>Peso:</strong> {pesoKg} {pesoKg !== "—" ? "kg" : ""}</div>
              <div className="mb-2"><strong>Fecha de nacimiento:</strong> {fechaNacStr}</div>

              <button
                className="btn btn-outline-secondary btn-sm mt-1"
                title="Editar datos"
                onClick={() => navigate(`/perro/${id}/editar`, { state: { petPreview: pet } })}
              >
                <i className="bi bi-pencil-square me-1" /> Editar
              </button>
            </div>
          </div>

          {/* Footer con “Inicio” igual estilo */}
          <div className="d-flex justify-content-between align-items-center gap-2 mt-3">
            <button className="btn btn-light flex-fill" title="Comida">
              <i className="bi bi-basket-fill fs-4 d-block" />
              <small className="fw-semibold">Comida</small>
            </button>

            <button className="btn btn-light flex-fill" title="Vacunas">
              <i className="bi bi-bandaid fs-4 d-block" />
              <small className="fw-semibold">Vacunas</small>
            </button>

            <button
              className="btn btn-light flex-fill text-dark"
              title="Inicio"
              onClick={goInicioPerro}
            >
              <i className="bi bi-house-fill fs-4 d-block" style={{ color: "inherit" }} />
              <small className="fw-semibold">Inicio</small>
            </button>

            <button className="btn btn-light flex-fill" title="Notas">
              <i className="bi bi-file-earmark-text-fill fs-4 d-block" />
              <small className="fw-semibold">Notas</small>
            </button>

            <button className="btn btn-light flex-fill" title="Veterinarias">
              <i className="bi bi-heart-pulse-fill fs-4 d-block" />
              <small className="fw-semibold">Veterinarias</small>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
