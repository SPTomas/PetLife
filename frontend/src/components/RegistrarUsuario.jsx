import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegistrarUsuario() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    console.log("Registrar usuario:", form);
    // TODO: mandar datos al backend
    navigate("/login"); // vuelve al login luego de registrarse
  };

  const handleCancel = () => {
    navigate("/login");
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div
        className="bg-white p-4 shadow-sm"
        style={{ width: 360, borderRadius: 22, border: "2px solid #111" }}
      >
        {/* Logo */}
        <div className="text-center mb-3">
          <img
            src="/imagenes/LogoPetLife.png"
            alt="PetLife"
            style={{ width: 100, height: "auto", objectFit: "contain" }}
          />
          <h3 className="mt-2 mb-0 fw-semibold" style={{ color: "#2389c0" }}>
            Registrar Usuario
          </h3>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirmar contraseña</label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="d-flex justify-content-between">
            <button
              type="submit"
              className="btn btn-success w-50 me-2"
              style={{ borderRadius: 12 }}
            >
              Registrar
            </button>
            <button
              type="button"
              className="btn btn-danger w-50 ms-2"
              style={{ borderRadius: 12 }}
              onClick={handleCancel}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
