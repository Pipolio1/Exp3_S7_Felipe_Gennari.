/* ============================================================
   Gaming House — Punto de entrada React (Semana 7)
   Actividad: Construyendo componentes funcionales en React
   para un eCommerce interactivo.
   Autor: Felipe Gennari — PFY2201 Desarrollo Frontend I
   ============================================================ */

import React from 'react';
import ReactDOM from 'react-dom/client';

// Bootstrap 5: estilos y bundle JS (necesario para la navbar colapsable,
// el menú desplegable de categorías y el carrusel de ofertas).
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Tema gamer propio (personalización sobre Bootstrap).
import './index.css';

import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
