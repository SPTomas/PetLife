import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegistrarMascota() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    raza: "",
    peso: "",
    altura: "",
    edad: "",
    fechaCumple: "",
    foto: null,
  });
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((f) => ({ ...f, foto: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registrar mascota:", form);
    // TODO: enviar datos + imagen al backend
    navigate("/menu");
  };

  const handleCancel = () => {
    navigate("/menu");
  };

  return (
    <div className="min-vh-100 d-flex align-items-start justify-content-center bg-light">
      <div
        className="bg-white w-100 shadow-sm mt-4 p-4"
        style={{
          maxWidth: 420,
          borderRadius: 22,
          border: "2px solid #111",
        }}
      >
        {/* Header con logo */}
        <div className="text-center mb-3">
          <img
            src="/imagenes/LogoPetLife.png"
            alt="PetLife"
            style={{ width: 100, height: "auto", objectFit: "contain" }}
          />
          <h4 className="mt-2 mb-0 fw-semibold" style={{ color: "#2389c0" }}>
            Registrar Mascota
          </h4>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Subida de imagen */}
          <div className="mb-3 text-center">
            {preview ? (
              <img
                src={preview}
                alt="Preview mascota"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 12,
                  objectFit: "cover",
                  border: "2px solid #ccc",
                }}
              />
            ) : (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 12,
                  border: "2px dashed #bbb",
                  margin: "0 auto",
                  color: "#888",
                  fontSize: 14,
                }}
              >
                Imagen
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="form-control mt-2"
              onChange={handleImageChange}
            />
          </div>

          {/* Campos */}
          <div className="mb-2">
            <label className="form-label">Nombre:</label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Raza:</label>
            <input
              type="text"
              className="form-control"
              name="raza"
              value={form.raza}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Peso (kg):</label>
            <input
              type="number"
              className="form-control"
              name="peso"
              value={form.peso}
              onChange={handleChange}
              min="0"
              step="0.1"
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Altura (cm):</label>
            <input
              type="number"
              className="form-control"
              name="altura"
              value={form.altura}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Edad (años):</label>
            <input
              type="number"
              className="form-control"
              name="edad"
              value={form.edad}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Fecha nacimiento:</label>
            <input
              type="date"
              className="form-control"
              name="fechaCumple"
              value={form.fechaCumple}
              onChange={handleChange}
            />
          </div>

          {/* Botones */}
          <div className="d-flex justify-content-between">
            <button
              type="submit"
              className="btn btn-success w-50 me-2"
              style={{ borderRadius: 12 }}
            >
              OK
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
