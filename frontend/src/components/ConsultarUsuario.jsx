// src/components/ConsultarUsuario.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ConsultarUsuario() {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  // Mock (luego vendrá del backend)
  const usuario = {
    nombre: "Martín",
    email: "martin@example.com",
    telefono: "351-1234567",
  };

  const confirmLogout = () => {
    // TODO: limpiar session/token si corresponde
    navigate("/login");
  };

  return (
    <div className="min-vh-100 d-flex align-items-start justify-content-center bg-light">
      <div
        className="bg-white w-100 shadow-sm mt-4 p-4 position-relative"
        style={{ maxWidth: 420, borderRadius: 22, border: "2px solid #111" }}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4 className="fw-semibold" style={{ color: "#2389c0" }}>
            Mi Cuenta
          </h4>
          <button className="btn btn-outline-dark btn-sm" onClick={() => navigate("/menu")}>
            Volver
          </button>
        </div>

        {/* Datos */}
        <div className="mb-3">
          <strong>Nombre:</strong>
          <p>{usuario.nombre}</p>
        </div>
        <div className="mb-3">
          <strong>Email:</strong>
          <p>{usuario.email}</p>
        </div>
        <div className="mb-3">
          <strong>Teléfono:</strong>
          <p>{usuario.telefono}</p>
        </div>

        <div className="text-center mt-4">
          <button
            className="btn btn-primary w-100 mb-2"
            style={{ borderRadius: 12 }}
            onClick={() => navigate("/modificar-usuario")}
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
