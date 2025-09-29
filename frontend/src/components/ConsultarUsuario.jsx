// frontend/src/components/ConsultarUsuario.jsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../lib/api";
import { signOut } from "../services/authService";

export default function ConsultarUsuario() {
  const navigate = useNavigate();
  const location = useLocation();

  // Detecta a dónde volver:
  // - Si el que navegó acá envió un "state.from", volvemos ahí.
  // - Si hay historial previo, usamos navigate(-1).
  // - Si no hay nada de lo anterior, caemos a "/menu".
  const fallback = useMemo(() => {
    // Permite pasar un string o un objeto { pathname, search, ... }
    const from = location.state?.from ?? location.state?.returnTo ?? null;
    return from || "/menu";
  }, [location.state]);

  const handleBack = () => {
    // Si el caller nos mandó "forceFallback", usamos fallback directo
    if (location.state?.forceFallback) {
      navigate(fallback, { replace: false });
      return;
    }
    // Si hay historial suficiente, volvemos una página
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Si entraron directo (sin historial), vamos al fallback
      navigate(fallback, { replace: false });
    }
  };

  const [showLogout, setShowLogout] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    api
      .get("/me")
      .then((r) => { if (alive) setUsuario(r.data); })
      .catch((e) => setErr(e.response?.data?.error || "No se pudo cargar el perfil"));
    return () => { alive = false; };
  }, []);

  const confirmLogout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-vh-100 d-flex align-items-start justify-content-center bg-light">
      <div
        className="bg-white w-100 shadow-sm mt-4 p-4 position-relative"
        style={{ maxWidth: 420, borderRadius: 22, border: "2px solid #111" }}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4 className="fw-semibold" style={{ color: "#2389c0" }}>Mi Cuenta</h4>
          <button className="btn btn-outline-dark btn-sm" onClick={handleBack}>
            Volver
          </button>
        </div>

        {err && <div className="alert alert-danger">{err}</div>}
        {!usuario && !err && <div>Cargando...</div>}

        {usuario && (
          <>
            <div className="mb-3">
              <strong>Nombre:</strong>
              <p className="mb-0">{usuario.nombre || "-"}</p>
            </div>
            <div className="mb-3">
              <strong>Email:</strong>
              <p className="mb-0">{usuario.email}</p>
            </div>
            <div className="mb-3">
              <strong>Teléfono:</strong>
              <p className="mb-0">{usuario.telefono || "-"}</p>
            </div>

            <div className="text-center mt-4">
              <button
                className="btn btn-primary w-100 mb-2"
                style={{ borderRadius: 12 }}
                onClick={() => navigate("/modificar-usuario", { state: { from: location.pathname } })}
              >
                Editar datos
              </button>
              <button
                className="btn btn-warning w-100"
                style={{ borderRadius: 12 }}
                onClick={() => setShowLogout(true)}
              >
                Cerrar sesión
              </button>
            </div>
          </>
        )}

        {/* Modal cerrar sesión */}
        {showLogout && (
          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: "rgba(0,0,0,0.5)", borderRadius: 22 }}
          >
            <div className="bg-white p-4 shadow rounded" style={{ maxWidth: 300 }}>
              <h6 className="fw-semibold mb-3 text-center">
                ¿Seguro que querés cerrar sesión?
              </h6>
              <div className="d-flex justify-content-between">
                <button className="btn btn-warning w-50 me-2" onClick={confirmLogout}>
                  Aceptar
                </button>
                <button className="btn btn-secondary w-50 ms-2" onClick={() => setShowLogout(false)}>
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
