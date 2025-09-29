import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import Footer from "./components/Footer.jsx";
import Login from "./components/Login.jsx";
import Menu from "./components/Menu.jsx";
import MenuPerro from "./components/MenuPerro.jsx";
import DetallePerro from "./components/DetallePerro.jsx";
import ModificarPerro from "./components/ModificarPerro.jsx"; // ⬅️ NUEVO
import RegistrarMascota from "./components/RegistrarMascota.jsx";
import RegistrarUsuario from "./components/RegistrarUsuario.jsx";
import ConsultarUsuario from "./components/ConsultarUsuario.jsx";
import ModificarUsuario from "./components/ModificarUsuario.jsx";

import "./App.css";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Menú general y menús por perro */}
          <Route path="/menu" element={<Menu />} />
          <Route path="/perro/:id" element={<MenuPerro />} />
          <Route path="/perro/:id/menu" element={<MenuPerro />} /> {/* alias opcional */}

          {/* Detalle y edición de perro */}
          <Route path="/perro/:id/detalle" element={<DetallePerro />} />
          <Route path="/perro/:id/editar" element={<ModificarPerro />} /> {/* ⬅️ NUEVA */}

          {/* Usuarios */}
          <Route path="/registrar-usuario" element={<RegistrarUsuario />} />
          <Route path="/consultar-usuario" element={<ConsultarUsuario />} />
          <Route path="/modificar-usuario" element={<ModificarUsuario />} />

          {/* Mascotas */}
          <Route path="/registrar-mascota" element={<RegistrarMascota />} />

          {/* 404 */}
          <Route path="*" element={<div className="p-4">404 - No encontrado</div>} />
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </>
  );
}
