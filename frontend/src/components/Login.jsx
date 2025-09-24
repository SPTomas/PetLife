import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submit:", form);
    navigate("/menu");
  };

  const handleRegister = () => {
    navigate("/registrar-usuario");
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div
        className="bg-white p-4 shadow-sm"
        style={{ width: 340, borderRadius: "22px", border: "2px solid #111" }}
      >
        {/* Logo */}
        <div className="text-center mb-3">
          <img
            src="/imagenes/LogoPetLife.png"
            alt="PetLife"
            style={{ width: 100, height: "auto", objectFit: "contain" }}
          />
          <h3 className="mt-2 mb-0 fw-semibold" style={{ color: "#2389c0ff" }}>
            PetLife
          </h3>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
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

          {/* Iniciar sesión */}
          <button
            type="submit"
            className="btn btn-dark w-100 mb-2"
            style={{ borderRadius: 12 }}
          >
            Iniciar sesión
          </button>

          {/* Registrar */}
          <button
            type="button"
            className="btn btn-outline-dark w-100"
            style={{ borderWidth: 2, borderRadius: 12 }}
            onClick={handleRegister}
          >
            Registrar
          </button>

          {/* Link "Olvidé mi contraseña" */}
          <div className="text-center mb-3">
            <a
              href="#"
              style={{ color: "#0b6fa4", textDecoration: "none", fontSize: 14 }}
            >
              Olvidé mi contraseña
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
