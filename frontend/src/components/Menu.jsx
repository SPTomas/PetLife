import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarMascotas } from "../services/mascotasService";
import { supabase } from "../lib/supabase";
export default function Menu() {
  const [pets, setPets] = useState([]);
  const [err, setErr] = useState("");
  const navigate = useNavigate();


  supabase.auth.getSession().then(({ data }) => {
  console.log("SESSION:", data);
});

  const handleAddPet = () => navigate("/registrar-mascota");
  const handleSelect = (pet) => console.log("Abrir perfil de:", pet.nombre);
  const handleProfile = () => navigate("/consultar-usuario");

  useEffect(() => {
    listarMascotas()
      .then(setPets)
      .catch(e => setErr(e.response?.data?.error || "No se pudieron cargar tus mascotas"));
  }, []);

  const colors = {
    bgTop: "linear-gradient(180deg, #E9F6FF 0%, #F7FBFF 100%)",
    brand: "#2389c0",
    ink: "#102A43",
    cardBorder: "#0c4a6e",
    halo: "#b6e0fe",
  };

  return (
    <div className="min-vh-100 d-flex align-items-start justify-content-center" style={{ background: colors.bgTop }}>
      <div className="w-100 shadow-sm mt-4" style={{ maxWidth: 420, borderRadius: 22, border: `2px solid ${colors.ink}`, background: "#fff" }}>
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between px-3 pt-3 pb-2"
             style={{ borderBottom: `1px solid ${colors.halo}`, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
          <button className="btn btn-light rounded-circle d-flex align-items-center justify-content-center border-0"
                  onClick={handleProfile} style={{ width: 44, height: 44 }} aria-label="Perfil" title="Perfil">
            <i className="bi bi-person-fill fs-4" style={{ color: colors.brand }} />
          </button>
          <div className="text-center flex-grow-1">
            <img src="/imagenes/LogoPetLife.png" alt="PetLife" style={{ width: 100, height: "auto", objectFit: "contain" }} />
          </div>
          <div style={{ width: 44 }} />
        </div>

        {/* Lista */}
        <div className="px-3 pb-3 pt-3">
          {err && <div className="alert alert-danger">{err}</div>}
          <ul className="list-unstyled m-0">
            {pets.map((pet) => (
              <li key={pet.id} className="mb-2">
                <button
                  className="w-100 d-flex align-items-center bg-white rounded-4 px-3 py-3"
                  style={{ border: `2px solid ${colors.cardBorder}`, boxShadow: "0 2px 8px rgba(16,42,67,.06)" }}
                  onClick={() => handleSelect(pet)}
                >
                  <img
                    src={"/imagenes/pets/default.png"}
                    alt={pet.nombre}
                    className="me-3"
                    style={{ width: 46, height: 46, objectFit: "cover", borderRadius: 12, border: "1px solid #e6e6e6", background: "#f8fafc" }}
                  />
                  <span className="fs-5 fw-semibold" style={{ color: colors.ink }}>
                    {pet.nombre}{pet.raza ? ` (${pet.raza})` : ""}
                  </span>
                </button>
              </li>
            ))}

            {/* Añadir mascota */}
            <li>
              <div className="w-100 d-flex align-items-center justify-content-between rounded-4 px-3 py-3"
                   style={{ border: `2px solid ${colors.cardBorder}`, background: "linear-gradient(180deg, #ffffff 0%, #f7fbff 100%)" }}>
                <div className="d-flex align-items-center">
                  <div className="me-3 d-flex align-items-center justify-content-center"
                       style={{ width: 46, height: 46, borderRadius: 12, border: `2px solid ${colors.halo}`, background: "#fff" }}>
                    <i className="bi bi-stars" style={{ fontSize: 22, color: colors.brand }} />
                  </div>
                  <span className="fs-5 fw-semibold" style={{ color: colors.ink }}>AÑADIR MASCOTA</span>
                </div>

                <button className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                        onClick={handleAddPet}
                        style={{ width: 44, height: 44, borderRadius: 12, borderWidth: 2, color: colors.brand, borderColor: colors.brand }}
                        aria-label="Agregar mascota" title="Agregar mascota">
                  <i className="bi bi-plus-lg" />
                </button>
              </div>
            </li>
          </ul>
          <div style={{ height: 12 }} />
        </div>
      </div>
    </div>
  );
}
