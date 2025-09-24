import { useState } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import Footer from './components/Footer.jsx';
import Login from './components/Login.jsx';
import Menu from "./components/Menu.jsx";
import RegistrarMascota from "./components/RegistrarMascota.jsx";
import RegistrarUsuario from "./components/RegistrarUsuario.jsx";
import ConsultarUsuario from "./components/ConsultarUsuario.jsx";
import ModificarUsuario from "./components/ModificarUsuario.jsx";

import './App.css'


function App() {

  return (
    <>
      <BrowserRouter>
        

        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<div className="p-4">404 - No encontrado</div>}/>
          <Route path="/menu" element={<Menu />} />
          <Route path="/registrar-mascota" element={<RegistrarMascota />} />
          <Route path="/registrar-usuario" element={<RegistrarUsuario />} />
          <Route path="/consultar-usuario" element={<ConsultarUsuario />} />
          <Route path="/modificar-usuario" element={<ModificarUsuario />} />
          
        </Routes>

        {/* <Footer></Footer> */}
      </BrowserRouter>

    </> 
  )
}

export default App
