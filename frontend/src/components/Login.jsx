import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // Colores de marca
  const BRAND = "#2389C0";   // azul PetLife
  const BRAND_DARK = "#0b6fa4";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login submit:", form);
    navigate("/menu");
  };

  const handleRegister = () => {
    navigate("/registrar-usuario");
  };

  return (
    // Fondo blanco (sin gris)
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "#fff" }}>
      <div
        className="bg-white p-4"
        style={{
          width: 340,
          borderRadius: "22px",
          border: "none",                 // sin borde feo
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)", // sombra suave
        }}
      >
        {/* Logo */}
        <div className="text-center mb-3">
          <img
            src="/imagenes/LogoPetLife.png"
            alt="PetLife"
            style={{ width: 100, height: "auto", objectFit: "contain" }}
          />
          <h3 className="mt-2 mb-0 fw-semibold" style={{ color: BRAND }}>
            PetLife
          </h3>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {err && <div className="alert alert-danger py-2">{err}</div>}

          <div className="mb-2">
            <small className="text-muted d-block">Usuario:</small>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="blue@gmail.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <small className="text-muted d-block">Contraseña:</small>
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="*****"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Iniciar sesión (primario marca) */}
          <button
            type="submit"
            className="btn w-100 mb-2"
            style={{
              borderRadius: 12,
              backgroundColor: BRAND,
              border: `2px solid ${BRAND}`,
              color: "#fff",
            }}
          >
            Iniciar sesión
          </button>

          {/* Registrar (outline marca) */}
          <button
            type="button"
            className="btn w-100"
            style={{
              borderRadius: 12,
              backgroundColor: "#fff",
              border: `2px solid ${BRAND}`,
              color: BRAND,
            }}
            onClick={handleRegister}
          >
            Registrar
          </button>

          {/* Link "Olvidé mi contraseña" */}
          <div className="text-center mb-1 mt-2">
            <a
              href="#"
              style={{ color: BRAND_DARK, textDecoration: "none", fontSize: 14 }}
            >
              Olvidé mi contraseña
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
