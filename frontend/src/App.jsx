import { useState } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import Footer from './components/Footer.jsx';
import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
        <Footer></Footer>
      </BrowserRouter>

    </> 
  )
}

export default App
