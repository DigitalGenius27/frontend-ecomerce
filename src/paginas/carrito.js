import React, {useEffect, useRef, useState, createContext, useContext} from 'react';
import { BsCart2 } from 'react-icons/bs';
import { FaSearch, FaCheck, FaRegHeart, FaRegTrashAlt, FaHeart, FaUser } from 'react-icons/fa';
import { FaLocationDot } from "react-icons/fa6";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineAddCard } from 'react-icons/md';
import '../App.css'
import '../carrito.css'
import PaypalButton from './PaypalButton.js';
import { Link, useLocation } from "react-router-dom";


export const CartContext = createContext();

export function CartProvider({ children }) {
  const [checked, setChecked] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCatgory] = useState("Inicio");

  useEffect(() => {
    fetch("http://localhost:5000/productos")
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error("❌ Error al obtener productos:", error));
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === "Inicio" || item.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleChecked = (itemId) => {
    if (checked.includes(itemId)) {
      setChecked(checked.filter((id) => id !== itemId));
    } else {
      setChecked([...checked, itemId]);
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setChecked([]);
      setSelectAll(false);
    } else {
      const allIds = filteredItems.filter((item) => item.cart).map(item => item.id);
      setChecked(allIds);
      setSelectAll(true);
    }
  };

  const deleteAll = async () => {
    try {
      for (const id of checked) {
        const response = await fetch(`http://localhost:5000/productos/cart/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        });
        const cart = await response.json();
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, cart: cart.data } : item
          )
        );
      }
    } catch (error) {
      console.error("error al eliminar productos:", error);
    }
    setChecked([]);
    setSelectAll(false);
  };

  const handleQuantityChange = (id, amount) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + amount),
    }));
  };

  const toggleFavorito = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/productos/favorito/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, favorito: data.favorito } : item
        )
      );
    } catch (error) {
      console.error("Error al actualizar favorito:", error);
    }
  };

  const toggleCart = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/productos/cart/${id}`, {
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

  const subtotales = filteredItems.filter((item) => item.cart).reduce((acc, item) => ({
    ...acc,
    [item.id]: item.precio * quantities[item.id] || item.precio
  }), {});

  const total = Object.values(subtotales).reduce((acc, val) => acc + val, 0);

  // Puedes agregar aquí el ref y scroll si lo necesitas global
  const carouselRef = useRef(null);

  return (
    <CartContext.Provider value={{
      checked, setChecked,
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
      carouselRef
    }}>
      {children}
    </CartContext.Provider>
  );
}
        


function Cart() {

    const {
    checked, setChecked,
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
    carouselRef
  } = useContext(CartContext);

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

 
    return(
        <div>
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
            {/* body cart */}
            <div style={{marginTop: "30px"}}>
                <h3>CART</h3>
                <div className="cotenedor-checkbox-izquierda" styles={{ dispay: "flex", alignItem: "center"}}>
                    <input type="checkbox" className="input-izquierda" style={{ marginBottom: '26px', marginTop: "6px"}} checked={selectAll} onChange={toggleSelectAll}/>
                    <label style={{marginBottom: "18px"}}> LOREM </label>

                    {checked.length > 0 && (
    <button className="boton-eliminar-todo" onClick={deleteAll}>
      Eliminar {checked.length} seleccionado(s)
    </button>
  )}
                </div>
                <div className="body-cart">
                    {/* mitad izquierda articulos cart */}
                    <div className="mitad-izquierda-cart" style={{overflow: "scroll"}}>
                        <div>
                            {filteredItems.filter((item) => item.cart).map
                            ((item) =>(
                            <div key={item.id} className="contenedor-cart">
                                <input type="checkbox" className="input-cart" checked={checked.includes(item.id)} onChange={() => toggleChecked(item.id)}/>
                                <img src={item.imagen} alt={item.nombre} className="imagen-cart"/>
                                <div>
                                    <div style={{ marginLeft: "16px"}}>
                                        <div className="info-cart">
                                            <h5>{item.nombre}</h5>
                                            <h4 style={{color: "#8C62A0"}}>{item.precio}</h4>
                                            <h4 style={{color: "gray"}}><del>{item.rebaja}</del></h4>
                                            <div style={{ height: "22px", width: "70px", border: "1px solid #000", display: "flex", marginTop: "5px", borderRadius: "30px", justifyContent: "space-between"}}>
                                            <button className="boton-menos" onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                                            <p style={{ fontsize: "18px", margin: "0px" }}>{quantities[item.id] || 1}</p>
                                            <button className="boton-mas" onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="descripcion-cart">{item.descripcion}</p>
                                        </div>
                                    </div>
                                    <div style={{ marginLeft: "16px", display: "flex"}}>
                                        <div className="contenedor-iconos" style={{ width: "25px", height: "25px", borderRadius: "8px"}}>
                                            <FaHeart className="corazon-cart" style={{ fontSize: "18px", cursor: "pointer", color: item.favorito ? 'rgb(140, 98, 160)' : 'rgb(170, 170, 170)'}} onClick={() => toggleFavorito(item.id)}/>
                                        </div>
                                        <div className="contenedor-iconos" style={{ width: "25px", height: "25px", borderRadius: "8px", marginLeft: "16px"}}>
                                            <FaRegTrashAlt className="trash" style={{ fontSize: "18px", cursor: "pointer"}} onClick={() => toggleCart(item.id)}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                    {/* mitad derecha factura cart */}
                    <div className="mitad-derecha-cart">
                            <div className="contenedor-informacion-derecho" style={{overflow: "scroll"}}>
                            {filteredItems.filter((item) => item.cart).map((item) => (
                            <div key={item.id}>
                                <div style={{display: "flex", padding: "5px", justifyContent: "space-between"}} >
                                    <p>
                                        <b>
                                            {item.nombre}
                                        </b>
                                    </p>
                                    <p>
                                        <b>
                                            {quantities[item.id] || 1}
                                        </b>
                                    </p>
                                    <p style={{color: "#8C62A0"}}>
                                        <b>
                                            {subtotales[item.id]}$
                                        </b>
                                    </p>
                                </div>
                            </div>
                            ))}
                                <div style={{display: "flex", padding: "5px", justifyContent: "space-between"}}>
                                    <p style={{fontSize: "22px"}}><b>LOREM:</b></p>
                                    <p style={{color: "#8C62A0", fontSize: "22px"}}><b>{total}$</b></p>
                                </div>
                            </div>
                            <Link to={`/pasarela`} style={{ textDecoration: "none", color: "inherit", width: "100%", marginLeft: "-32px" }}>
                              <button className="boton-mitad-derecha"><b>CHECKOUT</b></button>
                            </Link>
                    </div>
                </div>
                    {/* articulos recomendados */}
                <div className="contenedor-articulos-recomedados">
                <div style={{ width: '5%', display: "flex", justifyContent: "center", height: "281px", alignItems: "center"}}>
                    <MdKeyboardArrowLeft className="flechas"   onClick={moveLeft}/>
                </div>
                    <div className='contenedor-de-articulos' ref={carouselRef}>
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
                           <FaHeart className="corazon-activado-recomendado" style={{zIndex: "5",position: 'absolute', top:"10px", right: "10px" }} onClick={(e) => {e.preventDefault(); e.stopPropagation(); toggleFavorito(item.id)}}/>  
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
                    <div style={{ width: '5%', display: "flex", justifyContent: "center", height: "281px", alignItems: "center"}}>
                        <MdKeyboardArrowRight className="flechas" style={{alignItems: "center"}}  onClick={moveRight}/>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default Cart;

function Pasarela() {

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

      const location = useLocation();
      const productoId = location.state?.productoId;

      const productosAMostrar = productoId
        ? filteredItems.filter(item => item.id === productoId)
        : filteredItems.filter(item => item.cart);

      const totalPasarela = productoId
      ? (productosAMostrar[0]?.precio || 0)
      : total;


    return(
        <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="contenedor-pasarela" style={{ width: "60%"}}>
            <div style={{ width: "100%", height: "100px", marginBottom: "70px"}}>
                <Link to={`/`} style={{ textDecoration: "none", color: "inherit" }}>
                  <h1 style={{color: "#8C62A0", marginBottom: "10px"}}>MARKET</h1>
                </Link>
                <p style={{fontSize: "13px", color: "#8C62A0"}}>LOREM IPSUM</p>
                <p style={{fontSize: "25px", fontWeight: "bold"}}>LOREM IPSUM</p>
            </div>
            <div>
                <div style={{width: "100%", height: "300px", backgroundColor: "rgb(233, 233, 233)", borderRadius: "20px", paddingTop: "20px", paddingLeft: "20px", marginBottom:"15px"}}>
                    <h2 style={{margin: "0px"}}>LOREM IPSUM DOLOR</h2>
                    <div style={{display: "flex"}}>
                    {productosAMostrar.map((item) =>(
                    <div>
                      <p styles={{fontWeight: "bold", color: "rgb(131, 131, 131)"}}>{item.nombre}</p>
                      <img style={{ borderRadius: "20px", height: "100px", width: "100px"}} src={item.imagen}/>
                      <p styles={{fontWeight: "bold", color: "rgb(131, 131, 131)"}}>{item.precio}$</p>
                      <p styles={{fontWieght: "bold"}}>{item.descripcion}</p>
                    </div>
                      ))}
                      </div>
                </div>
                <div className="info-envio" style={{width: "102%", height: "300px", backgroundColor: "rgb(233, 233, 233)", borderRadius: "20px", paddingTop: "20px",  marginBottom:"15px"}}>
                    <p style={{fontSize: "30px", fontWeight: "bold", marginLeft: "15px", marginTop: "15px"}}>LOREM IPSUM DOLOR</p>
                    <div style={{display: "flex", marginLeft: "15px"}}>
                        {/*aqui va un icono de ubicacion */}
                        <FaLocationDot style={{fontSize: "30px"}}/>
                        <div>
                        <p style={{fontWeight: "bold", marginTop: "0px", marginBottom: "0px"}}>Lorem ipsum dolor sit</p>
                        <p style={{color: "#8c8c8c", fontSize: "10px", marginTop: "0px"}}>Lorem ipsum dolor sit</p>
                        <p style={{fontWeight: "bold", marginTop: "60px"}}>Lorem ipsum dolor sit amet, consectetur adipiscing</p>
                        </div>
                    </div>
                    <div className="contenedor-usuario-pasarela" style={{display: "flex", width: "100%", marginTop: "20px", justifyContent: "space-between", alignItems: "center"}}>
                        {/*aqui va un icono de usuario */}
                        <div >
                        <FaUser style={{fontSize: "30px",  marginLeft: "15px", marginTop: "15px"}}/>
                        </div>
                        <div>
                            <p style={{fontWeight: "bold"}}>Lorem ipsum dolor sit amet, consectetur adipiscing</p>
                        </div>
                        <div>
                        <MdKeyboardArrowRight style={{fontSize: "25px", marginTop: "15px", marginRight: "15px"}}/>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <div style={{width: "35%", marginTop: "200px"}}>
                <div className="contenedor-botones-pasarela" style={{display:"flex", width: "100%", marginLeft: '20px'}}>
                    <button className="boton-pasarela-derecha" style={{background: "#8C62A0", color: "#FFF", border: 'none'}}>LOREM</button>
                    <button className="boton-pasarela-derecha" style={{background: "rgb(233,233,233)", color: "000", border: 'none'}}>LOREM</button>
                </div>
                <div style={{width: "100%", minHeight: "400px", background: "rgb(233,233,233)", padding: "20px", borderRadius: "20px"}}>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <p style={{fontWeight: "bold"}}>LOREM IPSUM</p>
                        <p style={{fontWeight: "bold", color: "rgb(187, 187, 187)", fontSize: "10px"}}>amet, consectetur</p>
                    </div>
{(productoId || filteredItems.filter(items => items.cart).length < 2) ?
                    (<div style={{display: "flex", justifyContent: "space-between"}}>
                      {/* si el articulo en carrito es solo uno se muestra con detalles */}
                        <div>
                            <p style={{fontWeight: "bold", color: "rgb(187, 187, 187)", fontSize: "18px"}}>LOREM IPSUM</p>
                            <p style={{fontWeight: "bold", color: "rgb(187, 187, 187)", fontSize: "18px"}}>Lorem</p>
                            <p style={{fontWeight: "bold", color: "rgb(187, 187, 187)", fontSize: "18px"}}>LOREM</p>
                            <p style={{fontWeight: "bold", fontSize: "18px"}}>LOREM</p>
                        </div>
                        {productosAMostrar.map((item) =>(
                        <div style={{overflow: "hidden"}}>
                            <p style={{fontWeight: "bold", fontSize: "18px"}}>{item.precio}</p>
                            <p style={{fontWeight: "bold", fontSize: "18px"}}> </p>
                            <p style={{fontWeight: "bold", color: "#8c62a0", fontSize: "18px"}}>-</p>
                            <p style={{fontWeight: "bold", color: "#8c62a0", fontSize: "18px"}}>{item.nombre}</p>
                            <p style={{fontWeight: "bold", fontSize: "18px"}}>{item.descripcion}</p>
                        </div>))}
                    </div>)
:
                  (
                    <div style={{overflowY: "scroll", height: "260px"}}>
                      {filteredItems.filter((item) => item.cart).map
                            ((item) =>(<div>
                      {/* si el articulo en carrito es mas de uno se muestra simplificado */}
                        <div style={{display: "flex"}}>  
                            <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
                              {/* articulo nombre */}
                              <p style={{fontWeight: "bold" }}>{item.nombre}</p>
                              {/* subtotal */}
                              <p style={{fontWeight: "bold"}}>{subtotales[item.id]}$</p>
                            </div>
                          </div>
                      </div>))}
                    </div>)
}
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                      <p style={{fontSize: "20px", fontWeight: "bold"}}>TOTAL:</p>
                      <p style={{fontSize: "20px", color: "#8C62A0", fontWeight: "bold"}}>{totalPasarela}$</p>
                    </div>
                    <div style={{ width: "100%"}}>
                        <PaypalButton amount={totalPasarela} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export {Pasarela};