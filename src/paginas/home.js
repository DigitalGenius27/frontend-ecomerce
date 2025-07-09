import React, { useEffect, useRef, useState } from 'react';
import { FaSearch, FaCheck, FaRegHeart, FaRegTrashAlt, FaHeart, FaUser } from 'react-icons/fa';
import { BsCart2 } from 'react-icons/bs';
import { Link } from "react-router-dom";
import "../App.css"; // Ajusta para apuntar al archivo CSS desde home.js

const categorias = ['Inicio', 'Electrónica', 'Ropa', 'Hogar', 'Contacto'];

function Home() {
  const [items, setItems] = useState([]);
  
      useEffect(() => {
          fetch("https://backend-ecomerce-vl7n.onrender.com/productos")
              .then(response => response.json())
              .then(data => {
                  console.log("🛒 Productos recibidos en React:", data);  // Ver en consola del navegador
                  setItems(data);
              })
              .catch(error => console.error("❌ Error al obtener productos:", error));
      }, []);
  
      const toggleFavorito = async (id) => {
          try {
              const response = await fetch(`https://backend-ecomerce-vl7n.onrender.com/productos/favorito/${id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
              });
      
              const data = await response.json();
      
              // Actualizar el estado en el frontend para reflejar el cambio
              setItems((prevItems) =>
                  prevItems.map((item) =>
                      item.id === id ? { ...item, favorito: data.favorito } : item
                  )
              );
          } catch (error) {
              console.error("Error al actualizar favorito:", error);
          }
      };
  
      const [searchTerm, setSearchTerm] = useState("")
      const [selectedCategory, setSelectedCatgory] = useState("Inicio")
      
      const filteredItems = items.filter((item) => {
  
          const matchesSearch =
          item.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
  
          const matchesCategory = !
          selectedCategory || selectedCategory === "Inicio" || item.categoria === selectedCategory
  
          return matchesSearch && matchesCategory;
  
      });

  const [activo, setActivo] = useState("false");
    

  const trackRef = useRef(null); // Referencia al contenedor del carrusel
  const totalBanners = 3; // Cambia esto si añades más banners
  let currentIndex = 0;


  useEffect(() => {
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % totalBanners; // Ciclo infinito entre banners
      if (trackRef.current) {
        const bannerWidth = trackRef.current.clientWidth; // Ancho del contenedor
        trackRef.current.style.transform = `translateX(-${currentIndex * bannerWidth}px)`;
      }
    }, 10000); // Cambia cada 10 segundos

    // Limpieza del intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, []);

  const toggleCart = async (id) => {
    try {
      const response = await fetch(`https://backend-ecomerce-vl7n.onrender.com/productos/cart/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, cart: data.cart } : item
        )
      );
    } catch (error) {
      console.error("error al actualizar cart:", error);
    }
  };

  return (
    <div>
      {/* header */}
      <div className="header">
                        <Link to={`/`} style={{ textDecoration: "none", color: "inherit" }}>
                          <h1>Market</h1>
                        </Link>
                          <div className='search-container'>
                              <input type="Text" className="buscador" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='   search' style={{fontSize: "20px"}}/>
                              <button className="button-search-bar"><FaSearch style={{size: "50px", color: "#FFF"}} /></button>
                          </div>
                          {/* favoritos */}
                          <Link to={`/favoritos`} style={{ textDecoration: "none", color: "inherit" }}>
                          <div style={{position: "relative"}}>
                              <FaRegHeart style={{ fontSize: '30px', color: 'black' }} />
                              <div style={{ width: "20px", height: "20px", borderRadius:" 50%", backgroundColor: "#8662A0", position: "absolute", top:"-20px", right:"-20px", color: "#fff", display:"flex", alignItems: "center", justifyContent: "center"}}>{items.filter(item => item.favorito).length}</div>
                          </div>
                          </Link>
                          {/* carrito */}
                          <Link to={`/carrito`} style={{ textDecoration: "none", color: "inherit" }}>
                          <div style={{position: "relative"}}>
                              <BsCart2 style={{ fontSize: '35px', color: 'black' }}/>
                              <div style={{ width: "20px", height: "20px", borderRadius:" 50%", backgroundColor: "#8662A0", position: "absolute", top:"-15px", right:"-15px", color: "#fff", display:"flex", alignItems: "center", justifyContent: "center"}}>{items.filter(item => item.cart).length}</div>
                          </div>
                          </Link>
                          {/* perfil */}
                          <div>
                              <div className="main-foto-perfil-continer" style={{width: "30px", height: "30px", background: "blue", borderRadius: "50%"}}> 
                                  <img className="main-foto-perfil" src="/fotos perfiles/foto perfil main.jpg" alt="Foto de perfil" />
                              </div>
                          </div>
                      </div>
      {/* banners */}
      <div className="banners-container" style={{ position: "relative", overflow: "hidden", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", width: "100%", maxWidth: "1620px", borderRadius: "50px", margin: "auto"}}>
        <div ref={trackRef} style={{ display: "flex", transition: "transform 0.5s ease-in-out" }}>
          {/* banner 1 */}
          <div className="container-banner-1">
            <div className="circulito-decorativo-1"></div>
            <div className="texto-banner-container">
              <h2>Lorem ipsum</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint    occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
            </div>
            <div className="img-banner-container">
              <img className="foto-banner-1" src="/fotos banner/foto banner 1.WEBP" alt="foto banner 1" />
            </div>
          </div>
          {/* banner 2 */}
          <div className="container-banner-2">
            <div className="circulito-decorativo-2"></div>
            <div className="texto-banner-container">
              <h2>Lorem ipsum</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint    occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
            </div>
            <div className="img-banner-container">
              <img className="foto-banner-2" src="/fotos banner/foto banner 2.WEBP" alt="foto banner 2" />
            </div>
          </div>
          {/* banner 3 */}
          <div className="container-banner-3">
            <div className="circulito-decorativo-3"></div>
            <div className="texto-banner-container">
              <h2>Lorem ipsum</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint    occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
            </div>
            <div className="img-banner-container">
              <img className="foto-banner-3" src="/fotos banner/foto banner 3.WEBP" alt="foto banner 3" />
            </div>
          </div>
        </div>
      </div>

      {/* catalogo */}
      <div>
        <div>
          <div>
            <h3 style={{ fontSize: "30px"}}>Lorem ipsum</h3>
          </div>
          {/* lista categorias */}
          <div>
            <nav>
              <ul style={{ display: "flex" }}>
                {categorias.map((categoria, index) => (
                  <li key={index} className = {selectedCategory === categoria ? "selected-category" : ""} style={{ padding: "10px", paddingLeft: "15px", paddingRight: "15px", marginRight: '20px', cursor: 'pointer', backgroundColor: "#D9D9D9", borderRadius: "20px", listStyleType: "none", color: "#808080" , marginTop: "10px", fontSize: "20px" }} onClick={() => setSelectedCatgory(categoria)}>
                    {categoria}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        {/* scroll */}
        <div>
          {/* tarjeta producto */}
          <div className="tarjeta-producto">
            {filteredItems.map((item) => (
              <Link
              to={`/articulo/${item.id}`}
              key={item.id}
              style={{ textDecoration: "none", color: "inherit" }}
              >
              <div className="container-product-card" key={item.id}>
                <div style={{display: "flex", position:"relative"}}>
                  <img 
                    src={item.imagen} 
                    alt={item.nombre}  
                    className={item.clase}
                    style={{ zIndex: "2"}}
                  />
                  { item.favorito ? 
                    <FaHeart className="corazon-activado-recomendado" style={{zIndex: "5",position: 'absolute', top:"10px", right: "10px", fontSize: "50px" }} onClick={(e) =>{e.preventDefault(); e.stopPropagation(); toggleFavorito(item.id)}}/>  
                    :
                    <FaRegHeart className="corazon-desactivado-recomendado" style={{zIndex: "5",position: 'absolute', top:"10px", right: "10px", fontSize: "50px" }} onClick={(e) =>{e.preventDefault(); e.stopPropagation(); toggleFavorito(item.id)}}/>
                  }
                </div>
                <div>
                  <div className="info-producto-container">
                    <h4 className="precio-product">{item.precio}$</h4>
                    <h5 className="nombre-product">{item.nombre}</h5>
                    <p className="descripcion-product">{item.descripcion}...</p>
                    <button className="button-producto" onClick={(e) => {e.preventDefault(); e.stopPropagation(); toggleCart(item.id)}}>BUY</button>
                  </div>
                </div>
              </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
