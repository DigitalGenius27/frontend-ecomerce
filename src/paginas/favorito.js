import React, { useEffect, useRef, useState } from 'react';
import { BsCart2 } from 'react-icons/bs';
import { FaSearch, FaCheck, FaRegHeart, FaHeart } from 'react-icons/fa';
import "../App.css";
import styles from "../favorito.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


function Favs() {

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

    return(
        <div>
            {/* container */}
            <div>
                {/* header */}
                <div>
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
                </div>
                {/* body favorite */}
                <div>
                    <h2>LOREM IPSUM</h2>
                    <div style={{display: "flex"}}>
                        {/* barra izquierda */}
                        <div style={{width: "162px", height: "420px", backgroundColor:"none", borderRadius:"25px", border: "1px solid gray"}}>
                            <div className={styles['contenedor-botones-izquierda']}>
                                <button className={styles['boton-barra-izquierda-1']}>Lorem</button>
                                <button className={styles['boton-barra-izquierda-2']}>Lorem</button>
                            </div>
                            <p style={{marginLeft: "8px"}}><b>lorem ipsum</b></p>
                            <p style={{marginLeft: "8px"}}>lorem ipsum</p>
                            <form style={{marginLeft: "8px"}}>
                                <label className={styles['label-input-1']}><input className={styles['input']}type='checkbox'></input><span className={styles['custom-checkbox']}><FaCheck className={styles['checkbox-icon']}></FaCheck></span>lorem</label>
                                <label className={styles['label-input-2']}><input className={styles['input']} type='checkbox' ></input><span className={styles['custom-checkbox']}><FaCheck className={styles['checkbox-icon']}></FaCheck></span>lorem</label>
                            </form>
                        </div>
                        {/* body derecho */}
                        <div>
                            {/* catalogo */}
                            <div>
                                <div className={styles['tarjeta-producto']}>
                                {filteredItems.filter((item) => item.favorito).map((item) => (
                                    <Link
                                    to={`/articulo/${item.id}`}
                                    key={item.id}
                                    style={{ textDecoration: "none", color: "inherit" }}
                                    >
                                        <div className={styles['container-product-card']} key={item.id}>
                                            <div style={{display: "flex", position:"relative"}}>
                                                <img 
                                                src={item.imagen} 
                                                alt={item.nombre}  
                                                className={styles[item.clase]}
                                                style={{ zIndex: "2"}}
                                                />
                                                <FaHeart className={styles['corazon-favorito-producto']} style={{ fontSize: '30px', zIndex: "5",position: 'absolute', top:"15px", right: "15px"}} onClick={(e) => {e.preventDefault(); e.stopPropagation(); toggleFavorito(item.id)}}/>
                                            </div>
                                            <div>
                                                <div className={styles['info-producto-container']}>
                                                    <h4 className={styles['precio-producto']}>{item.precio}$</h4>
                                                    <h5 className={styles['nombre-producto']}>{item.nombre}</h5>
                                                    <p className={styles['descripcion-producto']}>{item.descripcion}...</p>
                                                    <button className={styles['button-producto']} onClick={(e) => {e.preventDefault(); e.stopPropagation(); toggleCart(item.id)}}>BUY</button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                 ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Favs;
