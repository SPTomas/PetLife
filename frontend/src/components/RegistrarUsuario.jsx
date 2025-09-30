// frontend/src/components/RegistrarUsuario.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpWithEmail } from "../services/authService";

export default function RegistrarUsuario() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setOk("");

    if (form.password !== form.confirmPassword) {
      setErr("Las contraseñas no coinciden");
      return;
    }

    try {
      await signUpWithEmail(
        form.nombre.trim() || null,
        form.email.trim(),
        form.password
      );
      // Si tu proyecto tiene confirmación de email, el usuario deberá confirmar
      // y luego hacer login. En el primer login se creará/completará el perfil en Neon.
      setOk("Usuario registrado. Iniciá sesión.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (e) {
      setErr(e.message || "Error al registrar");
    }
  };

  const handleCancel = () => navigate("/login");

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div
        className="bg-white p-4 shadow-sm"
        style={{ width: 360, borderRadius: 22, border: "2px solid #111" }}
      >
        <div className="text-center mb-3">
          <img src="/imagenes/LogoPetLife.png" alt="PetLife"
               style={{ width: 100, height: "auto", objectFit: "contain" }} />
          <h3 className="mt-2 mb-0 fw-semibold" style={{ color: "#2389c0" }}>
            Registrar Usuario
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          {ok && <div className="alert alert-success py-2">{ok}</div>}
          {err && <div className="alert alert-danger py-2">{err}</div>}

          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="(opcional)"
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
              minLength={5}
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
              minLength={5}
            />
          </div>

          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-success w-50 me-2" style={{ borderRadius: 12 }}>
              Registrar
            </button>
            <button type="button" className="btn btn-danger w-50 ms-2" style={{ borderRadius: 12 }} onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
