import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmail } from "../services/authService";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  // Colores de marca
  const BRAND = "#2389C0";
  const BRAND_DARK = "#0b6fa4";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await signInWithEmail(form.email.trim(), form.password);
      navigate("/menu");
    } catch (e) {
      setErr(e?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => navigate("/registrar-usuario");
  const handleForgot = (e) => {
    e.preventDefault();
    navigate("/recuperar-password");
  };

  return (
    // Fondo blanco (como Loginvisual)
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "#fff" }}>
      <div
        className="bg-white p-4"
        style={{
          width: 340,
          borderRadius: "22px",
          border: "none",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
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
              autoComplete="email"
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
              autoComplete="current-password"
            />
          </div>

          {/* Iniciar sesión (primario marca) */}
          <button
            type="submit"
            className="btn w-100 mb-2"
            disabled={loading}
            style={{
              borderRadius: 12,
              backgroundColor: BRAND,
              border: `2px solid ${BRAND}`,
              color: "#fff",
            }}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>

          {/* Registrar (outline marca) */}
          <button
            type="button"
            className="btn w-100"
            onClick={handleRegister}
            style={{
              borderRadius: 12,
              backgroundColor: "#fff",
              border: `2px solid ${BRAND}`,
              color: BRAND,
            }}
          >
            Registrar
          </button>

          {/* Link "Olvidé mi contraseña" (azul) */}
          <div className="text-center mb-2">
            <a
              href="#"
              onClick={handleForgot}
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
