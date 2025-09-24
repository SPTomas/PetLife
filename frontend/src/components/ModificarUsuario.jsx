import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function ModificarUsuario() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ nombre: "", email: "", telefono: "" });
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.get("/me")
      .then(r => setForm({
        nombre: r.data.nombre || "",
        email: r.data.email || "",
        telefono: r.data.telefono || ""
      }))
      .catch(e => setErr(e.response?.data?.error || "No se pudo cargar el perfil"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmSave(true);
  };

  const confirmSave = async () => {
    setShowConfirmSave(false);
    setSaving(true);
    setErr("");
    try {
      await api.put("/me", { nombre: form.nombre, telefono: form.telefono });
      setSaved(true);
      setTimeout(() => navigate("/consultar-usuario"), 1200);
    } catch (e) {
      setErr(e.response?.data?.error || "No se pudo actualizar");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!saving) navigate("/consultar-usuario");
  };

  const confirmDelete = async () => {
    try {
      await api.delete("/me");
      navigate("/login");
    } catch (e) {
      alert(e.response?.data?.error || "No se pudo eliminar la cuenta");
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-start justify-content-center bg-light">
      <div
        className="bg-white w-100 shadow-sm mt-4 p-4 position-relative"
        style={{ maxWidth: 420, borderRadius: 22, border: "2px solid #111" }}
      >
        <h4 className="fw-semibold mb-3" style={{ color: "#2389c0" }}>
          Editar Usuario
        </h4>

        {err && <div className="alert alert-danger py-2">{err}</div>}
        {saved && (
          <div className="alert alert-success py-2" role="alert">
            Datos actualizados con éxito. Redirigiendo…
          </div>
        )}

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
              disabled={saving}
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
              disabled
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Teléfono</label>
            <input
              type="text"
              className="form-control"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              disabled={saving}
            />
          </div>

          <div className="d-flex justify-content-between">
            <button
              type="submit"
              className="btn btn-success w-50 me-2"
              style={{ borderRadius: 12 }}
              disabled={saving}
            >
              Guardar
            </button>
            <button
              type="button"
              className="btn btn-danger w-50 ms-2"
              style={{ borderRadius: 12 }}
              onClick={handleCancel}
              disabled={saving}
            >
              Cancelar
            </button>
          </div>
        </form>

        {/* Sección peligrosa: Eliminar cuenta */}
        <div className="mt-4">
          <button
            className="btn btn-outline-danger w-100"
            style={{ borderRadius: 12, borderWidth: 2 }}
            onClick={() => setShowConfirmDelete(true)}
            disabled={saving}
          >
            Eliminar cuenta
          </button>
        </div>

        {/* Modal confirmar guardado */}
        {showConfirmSave && (
          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: "rgba(0,0,0,0.5)", borderRadius: 22 }}
          >
            <div className="bg-white p-4 shadow rounded" style={{ maxWidth: 300 }}>
              <h6 className="fw-semibold mb-3 text-center">
                ¿Estás seguro de modificar tus datos?
              </h6>
              <div className="d-flex justify-content-between">
                <button className="btn btn-success w-50 me-2" onClick={confirmSave}>
                  Aceptar
                </button>
                <button className="btn btn-secondary w-50 ms-2" onClick={() => setShowConfirmSave(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal confirmar eliminación */}
        {showConfirmDelete && (
          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: "rgba(0,0,0,0.5)", borderRadius: 22 }}
          >
            <div className="bg-white p-4 shadow rounded" style={{ maxWidth: 300 }}>
              <h6 className="fw-semibold mb-3 text-center">
                ¿Estás seguro de querer eliminar tu cuenta?
                <br />
                <small className="text-danger">Perderás todos los datos de tus perros.</small>
              </h6>
              <div className="d-flex justify-content-between">
                <button className="btn btn-danger w-50 me-2" onClick={confirmDelete}>
                  Aceptar
                </button>
                <button className="btn btn-secondary w-50 ms-2" onClick={() => setShowConfirmDelete(false)}>
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
