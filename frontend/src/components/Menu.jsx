// src/components/Menu.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Menu() {
  // Cuando integremos backend, este estado se llenará con las mascotas del usuario
  const [pets] = useState([]);
  const navigate = useNavigate();

  const handleAddPet = () => {
    navigate("/registrar-mascota");
  };

  const handleSelect = (pet) => {
    console.log("Abrir perfil de:", pet.nombre);
    // Ej: navigate(`/perros/${pet.id}`)
  };

  const handleProfile = () => {
    // 🔹 Ir a Consultar Usuario
    navigate("/consultar-usuario");
  };

  // Paleta de colores
  const colors = {
    bgTop: "linear-gradient(180deg, #E9F6FF 0%, #F7FBFF 100%)",
    brand: "#2389c0",
    ink: "#102A43",
    cardBorder: "#0c4a6e",
    halo: "#b6e0fe",
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-start justify-content-center"
      style={{ background: colors.bgTop }}
    >
      <div
        className="w-100 shadow-sm mt-4"
        style={{
          maxWidth: 420,
          borderRadius: 22,
          border: `2px solid ${colors.ink}`,
          background: "#fff",
        }}
      >
        {/* Header */}
        <div
          className="d-flex align-items-center justify-content-between px-3 pt-3 pb-2"
          style={{
            borderBottom: `1px solid ${colors.halo}`,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <button
            className="btn btn-light rounded-circle d-flex align-items-center justify-content-center border-0"
            onClick={handleProfile}
            style={{ width: 44, height: 44 }}
            aria-label="Perfil"
            title="Perfil"
          >
            <i className="bi bi-person-fill fs-4" style={{ color: colors.brand }} />
          </button>

          <div className="text-center flex-grow-1">
            <img
              src="/imagenes/LogoPetLife.png"
              alt="PetLife"
              style={{ width: 100, height: "auto", objectFit: "contain" }}
            />
          </div>

          <div style={{ width: 44 }} /> {/* Espaciador para balancear */}
        </div>

        {/* Lista de mascotas */}
        <div className="px-3 pb-3 pt-3">
          <ul className="list-unstyled m-0">
            {/* Render de mascotas (cuando integremos backend) */}
            {pets.map((pet) => (
              <li key={pet.id} className="mb-2">
                <button
                  className="w-100 d-flex align-items-center bg-white rounded-4 px-3 py-3"
                  style={{
                    border: `2px solid ${colors.cardBorder}`,
                    boxShadow: "0 2px 8px rgba(16,42,67,.06)",
                  }}
                  onClick={() => handleSelect(pet)}
                >
                  <img
                    src={pet.foto || "/imagenes/pets/default.png"}
                    alt={pet.nombre}
                    className="me-3"
                    style={{
                      width: 46,
                      height: 46,
                      objectFit: "cover",
                      borderRadius: 12,
                      border: "1px solid #e6e6e6",
                      background: "#f8fafc",
                    }}
                  />
                  <span className="fs-5 fw-semibold" style={{ color: colors.ink }}>
                    {pet.nombre}
                  </span>
                </button>
              </li>
            ))}

            {/* Añadir mascota (siempre visible) */}
            <li>
              <div
                className="w-100 d-flex align-items-center justify-content-between rounded-4 px-3 py-3"
                style={{
                  border: `2px solid ${colors.cardBorder}`,
                  background: "linear-gradient(180deg, #ffffff 0%, #f7fbff 100%)",
                }}
              >
                <div className="d-flex align-items-center">
                  <div
                    className="me-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 12,
                      border: `2px solid ${colors.halo}`,
                      background: "#fff",
                    }}
                  >
                    <i
                      className="bi bi-stars"
                      style={{ fontSize: 22, color: colors.brand }}
                    />
                  </div>
                  <span className="fs-5 fw-semibold" style={{ color: colors.ink }}>
                    AÑADIR MASCOTA
                  </span>
                </div>

                <button
                  className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                  onClick={handleAddPet}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    borderWidth: 2,
                    color: colors.brand,
                    borderColor: colors.brand,
                  }}
                  aria-label="Agregar mascota"
                  title="Agregar mascota"
                >
                  <i className="bi bi-plus-lg" />
                </button>
              </div>
            </li>
          </ul>

          {/* Espacio para no chocar con footer fijo si lo usás */}
          <div style={{ height: 12 }} />
        </div>
      </div>
    </div>
  );
}
