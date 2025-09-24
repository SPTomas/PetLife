import { useState } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import Footer from './components/Footer.jsx';
import Login from './components/Login.jsx';

import './App.css'


function App() {

  return (
    <>
      <BrowserRouter>
        

        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<div className="p-4">404 - No encontrado</div>}/>

        </Routes>

        {/* <Footer></Footer> */}
      </BrowserRouter>

    </> 
  )
}

export default App
