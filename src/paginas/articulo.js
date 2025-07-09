import React, {useEffect, useRef, useState, createContext, useContext} from "react";
import { useParams } from 'react-router-dom';
import { FaRegBuilding, FaStar, FaTruckMoving } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { BsCart2 } from 'react-icons/bs';
import {CartProvider, CartContext} from './carrito.js';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineAddCard } from 'react-icons/md';
import { FaSearch, FaCheck, FaRegHeart, FaRegTrashAlt, FaHeart, FaUser } from 'react-icons/fa';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import "../detalles.css";

function calcularPromedioCalificaciones(reviews) {
    if (!Array.isArray(reviews) || reviews.length === 0) return 0;
    const suma = reviews.reduce((acc, r) => acc + (parseFloat(r.calificacion) || 0), 0);
    return (suma / reviews.length).toFixed(1); // 1 decimal
}


export default function Detalles() {
    const navigate = useNavigate();
    
    const irAPasarela = () => {
        navigate("/pasarela", {state: { productoId: producto.id } });
    };

    const [ review, setReview ] = useState([]);

    useEffect(() => {
        fetch("https://backend-ecomerce-vl7n.onrender.com/reviews")
            .then(response => response.json())
            .then(data => {
                console.log("📝 Reseñas recibidas en React:", data);  // Ver en consola del navegador
                setReview(Array.isArray(data) ? data : []); // Asegurarse de que data sea un array
            })
            .catch(error => console.error("❌ Error al obtener reseñas:", error));
    }, []);

    

    const {checked, setChecked,
          selectAll, setSelectAll,
          items, setItems,
          quantities, setQuantities,
          searchTerm, setSearchTerm,
          selectedCategory, setSelectedCatgory,
          filteredItems,
          toggleChecked,
          toggleSelectAll,
          deleteAll,
          handleQuantityChange,
          toggleFavorito,
          toggleCart,
          subtotales,
          total,
          carouselRef} = useContext(CartContext);

        const moveLeft = () => {
            if (carouselRef.current) {
                carouselRef.current.scrollLeft -= 800;
            }
        };

        const moveRight = () => {
            if (carouselRef.current) {
                carouselRef.current.scrollLeft += 800;
            }
        };

        
    const { id } = useParams();
     // Filtrar los artículos por el ID del artículo actual
    const producto = filteredItems.find(item => item.id === parseInt(id));
    if (!producto){
        return <div>producto no encontrado</div>; // Manejo de carga
    }

    const promedio = calcularPromedioCalificaciones(review);

    return(
        <div>
            {/* navbar */}
            <section>
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
            </section>
            <div>
                {/* detalles */}
                <section style={{display: "flex", width: "100%", justifyContent: "space-between"}}>
                    {/* imagenes */}
                    <div style={{display: "flex", flexDirection: "column", height: "300px"}}>
                        <img style={{height: "100px", width: "100px", borderRadius: "25px"}} src={producto.imagen} alt={producto.nombre} />
                    </div>
                    {/* imagen ampliada */}
                    <div>
                        <img style={{height: "300px", width: "300px", borderRadius: "75px"}} src={producto.imagen} alt={producto.nombre}/>
                    </div>
                    {/* informacion */}
                    <div>
                        {/* titulo */}
                        <div>
                            <p style={{fontWeight: "bold"}}>
                                {producto.nombre}
                            </p>
                        </div>
                        {/* calificacion */}
                        <div style={{display: "flex", alignItems: "center"}}>
                            {/* aqui va una estrellita */}
                            <FaStar style={{ color: "yellow"}} />
                            <p>
                                {promedio} {/* aqui va la calificacion en numeros */}
                            </p>
                        </div>
                        {/* opciones raras. no se ni para que sirven */}
                        <div>
                            <button style={{width: "50px", height: "20px", borderRadius: "5px", border: "none", marginRight: "10px"}}>a</button>
                            <button style={{width: "50px", height: "20px", borderRadius: "5px", border: "none", marginRight: "10px"}}>b</button>
                            <button style={{width: "50px", height: "20px", borderRadius: "5px", border: "none"}}>c</button>
                        </div>
                        {/* descrpcion */}
                        <div>
                            <p style={{fontWeight: "bold"}}>DESCRIPCION</p>
                            <p>
                                {producto.descripcion || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                            </p>    
                        </div> 
                    </div>
                    {/* envio */}
                    <div style={{ width: "300px", background:"rgb(236, 236, 236)", borderRadius: "25px", padding: "20px" }}>
                        <p style={{fontSize: "23px", color: "#8C62A0", margin: "0px"}}>{producto.precio}$</p>
                        <p style={{fontSize: "12px", color: "gray", marginTop: "5px"}}>lorem ipsum</p>
                        <button style={{width: "100%", height: "50px", borderRadius: "15px", fontSize: "20px", background: "#FFF", border: "none", marginBottom: "8px"}}>LOREM</button>
                        <div style={{display: "flex", width: "100%", justifyContent: "space-between"}}>
                            <button className="boton-a-pasarela-detalles" onClick={irAPasarela} style={{width: "68%", height: "50px", fontSize: "18px", borderRadius: "15px", border: 'none'}}>LOREM</button>
                            <div style={{width: "30%", height: "50px", borderRadius: "15px", border: "1px solid #8C62A0", display: "flex", justifyContent: "center", alignItems: "center"}}>

                                { producto.favorito ? 
                                <FaHeart className="favorito-detalles-activado" style={{ fontSize: "40px" }} onClick={() => toggleFavorito(producto.id)}/>  
                                :
                                <FaRegHeart className="favorito-detalles-desactivado" style={{ fontSize: "40px" }} onClick={() => toggleFavorito(producto.id)}/>
                                }
                                
                            </div>
                        </div>
                        <div style={{display: 'flex', alignItems: "center"}}>
                            {/* aqui va el icono de una casa */}
                            <FaRegBuilding style={{fontSize: "19px", marginBottom: "0px"}} />
                            <p style={{fontWeight: "bold", marginRight: "5px"}}>NOW</p>
                            {/* aqui va un icono de estrella */}
                            <FaStar style={{fontSize: "19px", color: "yellow", marginBottom: "0px"}}/>
                            <p>
                                {promedio} {/* aqui va la calificacion en numeros */}
                            </p>
                        </div>
                        <div style={{display: "flex", alignItems: "center"}}>
                            {/* aqui va el icono de un vehiculo */}
                            <FaTruckMoving style={{fontSize: "19px", marginTop: "0px"}}/>
                            <p style={{fontWeight: "bold"}}>lorem ipsum dolor sit amet</p>
                        </div>
                    </div>
                </section>
                {/* recomendados */}
                <section style={{width: "100%", marginTop: "20px"}}>
                    <p style={{fontSize: "30px", fontWeight: "bold"}}>LOREM IPSUM</p>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginTop: "20px"}}>
                        {/* flecha izquierda */}
                        <div>
                            <MdKeyboardArrowLeft onClick={moveLeft} style={{fontSize: "50px", cursor: "pointer"}} />
                        </div>
                        {/* contenido */}
                        <div style={{width: "100%"}}>
                            <div style={{display: "flex", overflowX: "scroll", width: "100%"}} ref={carouselRef}>
                                {/* aqui van los articulos recomendados */}
                                <div style={{width: "200px", marginRight: "10px", display: "flex"}}>
                                    {filteredItems.filter((item) => !item.cart).slice(0, 16).map((item) =>(
                                        <Link to={`/articulo/${item.id}`} key={item.id} style={{ textDecoration: "none", color: "inherit" }}>
                                        <div className="articulos-recomendados">
                                            <div style={{position: "relative"}}>
                                                <img 
                                                src={item.imagen} 
                                                alt={item.nombre}                                          
                                                className="imagen-recomendados"
                                                style={{ zIndex: "2"}}
                                                />
                                                { item.favorito ? 
                                                <FaHeart className="corazon-activado-recomendado" style={{zIndex: "5",position: 'absolute', top:"10px", right: "10px" }} onClick={(e) => {e.preventDefault(); e.stopPropagation();toggleFavorito(item.id)}}/>  
                                                               :
                                                <FaRegHeart className="corazon-desactivado-recomendado" style={{zIndex: "5",position: 'absolute', top:"10px", right: "10px" }} onClick={(e) => {e.preventDefault(); e.stopPropagation(); toggleFavorito(item.id)}}/>
                                                }
                                            </div>
                                            <div>
                                                <div>
                                                    <h4 className="precio-recomendados">{item.precio}$</h4>
                                                    <h5 className="titulo-recomendados">{item.nombre}</h5>
                                                    <p className="descripcion-recomendados">{item.descripcion}</p>
                                                    <button className="boton-recomendados" onClick={(e) => {e.preventDefault(); e.stopPropagation(); toggleCart(item.id)}}>BUY</button>
                                                </div>
                                            </div>
                                        </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* flecha derecha */}
                        <div>
                            <MdKeyboardArrowRight onClick={moveRight} style={{fontSize: "50px", cursor: "pointer"}} />
                        </div>
                    </div>
                </section>
                {/* comentarios */}
                <section style={{width: "100%", marginTop: "30px"}}>
                    {/* opciones de navegacion */}
                    <div style={{display: "flex"}}>
                        <p style={{fontSize: "25px", fontWeight: "bold", marginRight: "30px"}}>Comentar</p>
                        <p style={{fontSize: "25px", fontWeight: "bold"}}>Calificaciones</p>
                    </div>
                    <div>
                        {/* contenedor formulario para comentario */}
                    </div>

                    
                    {/* calificacion */}
                    <div style={{display: "flex", alignItems: "center", marginTop: "30px"}}>
                        {/* aqui va calificacion con estrelitas y numeros xddddd */}
                        <p style={{fontWeight: "bold", fontSize: "23px"}}>5.0</p>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <FaStar style={{fontSize: "30px", color: "yellow", marginBottom: "0px"}}/>
                            <FaStar style={{fontSize: "30px", color: "yellow", marginBottom: "0px"}}/>
                            <FaStar style={{fontSize: "30px", color: "yellow", marginBottom: "0px"}}/>
                            <FaStar style={{fontSize: "30px", color: "yellow", marginBottom: "0px"}}/>
                            <FaStar style={{fontSize: "30px", color: "yellow", marginBottom: "0px"}}/>
                        </div>
                    </div>
                    <div>
                        <div>
                        {/*comentarios */}
                            {Array.isArray(review) && review.map((review) => (
                                <div key={review.id}>
                                    <div>
                                        <div style={{display: "flex", alignItems: "center", marginTop: "20px"}}>
                                            <div>
                                            {/* foto de perfil */}
                                                <img style={{ borderRadius: "50%", width: "50px", height: "50px" }} src={review.foto} />
                                            </div>
                                            <div>
                                                <div>
                                                    <div>
                                                        {/* aqui va la calificacion en estrellas */}
                                                        {Array.from({ length: 5 }, (_, index) => (
                                                        <FaStar
                                                        key={index}
                                                        style={{
                                                            fontSize: "30px",
                                                            color: index < review.calificacion ? "yellow" : "gray",
                                                            marginBottom: "0px"
                                                        }}
                                                        />
                                                        ))}
                                                    </div>
                                                    <div>
                                                        <p style={{fontWeight: "bold", fontSize: "20px", margin: "0px"}}>
                                                            {/* aqui van los creditos de la foto de perfil xdd */}
                                                            {review.usuario}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <p style={{fontSize: "20px"}}>
                                                {/* aqui va el comentario */}
                                                {review.comentarios}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
