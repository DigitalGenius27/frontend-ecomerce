import React from "react";
import Favs from "./paginas/favorito.js";
import Home from "./paginas/home.js"
import Cart from "./paginas/carrito.js"
import { Pasarela } from "./paginas/carrito.js"
import { CartProvider } from "./paginas/carrito.js";
import Detalles from "./paginas/articulo.js"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/favoritos" element={<Favs />} />
          <Route path="/pasarela" element={<Pasarela />} />
          <Route path="/articulo/:id" element={<Detalles />} />
        </Routes>
      </Router>
      </CartProvider>
    </div>
  );
}

export default App;

