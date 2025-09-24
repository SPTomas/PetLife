import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { crearMascota } from "../services/mascotasService";

export default function RegistrarMascota() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    raza: "",
    peso: "",
    altura: "",   // hoy no se guarda
    edad: "",
    cumpleDia: "",
    cumpleMes: "",
    foto: null,
  });
  const [preview, setPreview] = useState(null);
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault(); setOk(""); setErr("");
    try {
      const payload = {
        nombre: form.nombre,
        raza: form.raza || undefined,
        edadMeses: form.edad ? Number(form.edad) * 12 : undefined,
        pesoKg: form.peso ? Number(form.peso) : undefined,
        cumpleDia: form.cumpleDia ? Number(form.cumpleDia) : undefined,
        cumpleMes: form.cumpleMes ? Number(form.cumpleMes) : undefined,
        // photoPath: cuando integremos Storage
      };
      await crearMascota(payload);
      setOk("Mascota registrada");
      setTimeout(() => navigate("/menu"), 800);
    } catch (e) {
      setErr(e.response?.data?.error || "No se pudo registrar la mascota");
    }
  };

  const handleCancel = () => navigate("/menu");

  const meses = Array.from({ length: 12 }, (_, i) => i + 1);
  const dias = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="min-vh-100 d-flex align-items-start justify-content-center bg-light">
      <div className="bg-white w-100 shadow-sm mt-4 p-4"
           style={{ maxWidth: 420, borderRadius: 22, border: "2px solid #111" }}>
        {/* Header con logo */}
        <div className="text-center mb-3">
          <img src="/imagenes/LogoPetLife.png" alt="PetLife"
               style={{ width: 100, height: "auto", objectFit: "contain" }} />
          <h4 className="mt-2 mb-0 fw-semibold" style={{ color: "#2389c0" }}>
            Registrar Mascota
          </h4>
        </div>

        <form onSubmit={handleSubmit}>
          {ok && <div className="alert alert-success py-2">{ok}</div>}
          {err && <div className="alert alert-danger py-2">{err}</div>}

          {/* Imagen */}
          <div className="mb-3 text-center">
            {preview ? (
              <img src={preview} alt="Preview mascota"
                   style={{ width: 100, height: 100, borderRadius: 12, objectFit: "cover", border: "2px solid #ccc" }} />
            ) : (
              <div className="d-flex align-items-center justify-content-center"
                   style={{ width: 100, height: 100, borderRadius: 12, border: "2px dashed #bbb", margin: "0 auto", color: "#888", fontSize: 14 }}>
                Imagen
              </div>
            )}
            <input type="file" accept="image/*" className="form-control mt-2" onChange={handleImageChange} />
          </div>

          {/* Campos */}
          <div className="mb-2">
            <label className="form-label">Nombre *</label>
            <input type="text" className="form-control" name="nombre" value={form.nombre} onChange={handleChange} required />
          </div>

          <div className="mb-2">
            <label className="form-label">Raza</label>
            <input type="text" className="form-control" name="raza" value={form.raza} onChange={handleChange} />
          </div>

          <div className="mb-2">
            <label className="form-label">Peso (kg)</label>
            <input type="number" className="form-control" name="peso" value={form.peso} onChange={handleChange} min="0" step="0.1" />
          </div>

          <div className="mb-2">
            <label className="form-label">Edad (años)</label>
            <input type="number" className="form-control" name="edad" value={form.edad} onChange={handleChange} min="0" />
          </div>

          {/* Cumpleaños en una sola línea */}
          <div className="mb-3">
            <label className="form-label">Cumpleaños (día / mes)</label>
            <div className="d-flex align-items-center gap-2">
              <select className="form-select" name="cumpleDia" value={form.cumpleDia}
                      onChange={handleChange} style={{ maxWidth: "90px" }}>
                <option value="">Día</option>
                {dias.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <span>/</span>
              <select className="form-select" name="cumpleMes" value={form.cumpleMes}
                      onChange={handleChange} style={{ maxWidth: "110px" }}>
                <option value="">Mes</option>
                {meses.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-success w-50 me-2" style={{ borderRadius: 12 }}>
              OK
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
