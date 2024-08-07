import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../App.css';
import Navbar from '../components/navbar';

const Recetas = () => {
  const [recetas, setRecetas] = useState([
    {
      id: 1,
      nombre: 'Torta de manzana acaramelada',
      precio: 12300,
      volumen: 1.2,
      unidades: 5,
      ingredientes: [
        { nombre: 'Harina 0000', volumen: 0.5, precio: 2300 },
        { nombre: 'Azúcar', volumen: 0.2, precio: 1500 },
        { nombre: 'Mantequilla', volumen: 0.1, precio: 3000 },
      ],
    },
    {
      id: 2,
      nombre: 'Torta de chocolate',
      precio: 15000,
      volumen: 1.5,
      unidades: 3,
      ingredientes: [
        { nombre: 'Harina 0000', volumen: 0.6, precio: 2300 },
        { nombre: 'Cacao', volumen: 0.3, precio: 2000 },
        { nombre: 'Azúcar', volumen: 0.2, precio: 1500 },
      ],
    },
    {
      id: 3,
      nombre: 'Torta de vainilla',
      precio: 10000,
      volumen: 1.0,
      unidades: 4,
      ingredientes: [
        { nombre: 'Harina 0000', volumen: 0.4, precio: 2300 },
        { nombre: 'Vainilla', volumen: 0.1, precio: 1000 },
        { nombre: 'Azúcar', volumen: 0.2, precio: 1500 },
      ],
    },
  ]);

  const [seleccionada, setSeleccionada] = useState(null);


  const seleccionarReceta = (id) => {
    setSeleccionada(id);
  };
  useEffect(() => {
    cargarRecetas();
  }, []);
  const cargarRecetas = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://ec2-3-135-217-78.us-east-2.compute.amazonaws.com:8800/recetas');
      const recetasFormateadas = response.data.map(receta => ({
        id: receta.id,
        nombre: receta.nombre,
        precio: receta.costoTotal,
        volumen: receta.pesoTotal,
        unidades: receta.cantUnidades,
        ingredientes: receta.ingredientes
      }));
      setRecetas(recetasFormateadas);
      console.log(response.data)
      setError(null);
    } catch (error) {
      console.error("Error al obtener recetas:", error);
      setError('Hubo un error al cargar las recetas.');
    } finally {
      setLoading(false);
    }
  };

  const [busqueda, setBusqueda] = useState('');

  const handleBuscar = (e) => {
    setBusqueda(e.target.value.toLowerCase());
  };
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [ingredients, setIngredients] = useState([
    { nombre: 'Harina 0000', precio: 2300, unidad: 'kg' },
    { nombre: 'Azúcar', precio: 1500, unidad: 'kg' },
    { nombre: 'Mantequilla', precio: 3000, unidad: 'kg' },
    { nombre: 'Cacao', precio: 2000, unidad: 'kg' },
    { nombre: 'Vainilla', precio: 1000, unidad: 'lt' },
    { nombre: 'Leche', precio: 1200, unidad: 'lt' },
    { nombre: 'Polvo de hornear', precio: 1800, unidad: 'kg' },
    { nombre: 'Sal', precio: 800, unidad: 'kg' },
    { nombre: 'Aceite', precio: 2500, unidad: 'lt' }
  ]);
  const [ingredientesNuevaReceta, setIngredientesNuevaReceta] = useState([

  ]);
  const [searchIngredient, setSearchIngredient] = useState('');


  const [montoNuevaReceta, setMontoNuevaReceta] = useState(0);
  const [modoCreacion, setModoCreacion] = useState(false);
  const [volumenNuevaReceta, setVolumenNuevaReceta] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unidadesNuevaReceta, setUnidadesNuevaReceta] = useState(1);
  const [filteredIngredients, setFilteredIngredients] = useState(ingredients);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [cantSelectedIngredient, setCantSelectedIngredient] = useState(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const setNullData = () => {
    setInputValue('');
    setSelectedIngredient(null);
    setCantSelectedIngredient(null);
    setMontoNuevaReceta(0);
    setVolumenNuevaReceta(0);
    setUnidadesNuevaReceta(0);
    setIngredientesNuevaReceta([])
  }
  useEffect(() => {
    if (inputValue !== '') {
      const filtered = ingredients.filter(ingredient =>
        ingredient.nombre.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredIngredients(filtered);
    } else {
      setFilteredIngredients(ingredients);
    }
  }, [inputValue, ingredients]);

  useEffect(() => {
    async function fetchIngredients() {
      try {
        setLoading(true);
        const response = await axios.get('http://ec2-3-135-217-78.us-east-2.compute.amazonaws.com:8800/items');
        const formattedIngredients = response.data.map(item => ({
          nombre: item.Descripcion,
          precio: item.PrecioPorKiloLitro !== null ? parseFloat(item.PrecioPorKiloLitro.toFixed(2)) : 0,
          unidad: item.MedicionVolumen === 'lt' ? 'lt' : 'kg' // Suponer que es 'kg' si no se especifica
        }));
        setIngredients(formattedIngredients);
        setError(null);
      } catch (error) {
        console.error("Error al obtener ingredientes:", error);
        setError('Hubo un error al cargar los ingredientes.');
      } finally {
        setLoading(false);
      }
    }
  
    fetchIngredients();
  }, []);

  if (loading) return <div>Cargando ingredientes...</div>;
  if (error) return <div>{error}</div>;


  const handleSearchIngredient = (e) => {
    setSearchIngredient(e.target.value.toLowerCase());
  };
  function handleError(error) {
    if (error.response) {
      // El servidor respondió con un status code fuera del rango 2xx
      console.error("Error de respuesta:", error.response.data);
      console.error("Status:", error.response.status);
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error("Error de red:", error.request);
    } else {
      // Algo sucedió al configurar la petición que provocó un error
      console.error("Error:", error.message);
    }
  }

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
        if (selectedIngredient) {
          setInputValue(selectedIngredient.nombre);
        }
      }
    }, 100);
  };
  const handleInputChange = (e) => {
    console.log('Antes de actualizar inputValue:', cantSelectedIngredient);
    setInputValue(e.target.value);
    setSelectedIngredient(null);
    setCantSelectedIngredient(null); // Agregar esta línea
    console.log('Después de actualizar inputValue:', cantSelectedIngredient);

  };
  const handleModalBackgroundClick = (event) => {
    // Verificar si el clic ocurrió fuera del contenido del modal
    if (event.target === event.currentTarget) {
      setNullData();
      setModoCreacion(false)
    }
  };
  const handleSelect = (ingredient) => {
    setSelectedIngredient(ingredient);
    setInputValue(ingredient.nombre);
    setIsOpen(false);
    setCantSelectedIngredient(null); // Agregar esta línea

  };
  const handleAgregarIngrediente = (e) => {

    console.log('Antes de agregar ingrediente:', cantSelectedIngredient);
    if (!cantSelectedIngredient) return; // Agregar esta validación
     if (!selectedIngredient) return; // Agregar esta validación

    const ingredienteIndicado = selectedIngredient;
    const cantidadIndicada = parseFloat(cantSelectedIngredient); // Convertir a número
    if(selectedIngredient && cantidadIndicada){
      const unidadIngredienteIndicado = ingredients.find((ingrediente) => ingrediente.nombre === ingredienteIndicado.nombre).unidad;
      const precioCantIndicada = cantidadIndicada * ingredients.find((ingrediente) => ingrediente.nombre === ingredienteIndicado.nombre).precio;
      setIngredientesNuevaReceta(prevIngredientes => {
        const nuevosIngredientes = [...prevIngredientes, { nombre: ingredienteIndicado.nombre, cantidad: cantidadIndicada, unidad: unidadIngredienteIndicado, precio: precioCantIndicada}];
        const montoNuevaReceta = nuevosIngredientes.reduce((acc, ingrediente) => acc + ingrediente.precio, 0);
        const volumenNuevaReceta = nuevosIngredientes.reduce((acc, ingrediente) => acc + ingrediente.cantidad, 0);
        setMontoNuevaReceta(montoNuevaReceta);
        setVolumenNuevaReceta(volumenNuevaReceta);
        return nuevosIngredientes;
      });
    }
    console.log('Después de agregar ingrediente:', cantSelectedIngredient);
    setCantSelectedIngredient(null); // Agregar esta línea

  }

  const handleEliminarIngrediente = (index) => {
    setIngredientesNuevaReceta((prevIngredientes) => {
      const nuevosIngredientes = [...prevIngredientes];
      nuevosIngredientes.splice(index, 1);
      const montoNuevaReceta = nuevosIngredientes.reduce((acc, ingrediente) => acc + ingrediente.precio, 0);
      const volumenNuevaReceta = nuevosIngredientes.reduce((acc, ingrediente) => acc + ingrediente.cantidad, 0);
      setMontoNuevaReceta(montoNuevaReceta);
      setVolumenNuevaReceta(volumenNuevaReceta);
      return nuevosIngredientes;
    });
  };
  const handleGuardarReceta = async () => {
    const nombre = document.getElementById('nombre').value;
    const nuevaReceta = {
      nombre: nombre,
      costoTotal: montoNuevaReceta,
      pesoTotal: volumenNuevaReceta,
      cantUnidades: unidadesNuevaReceta,
      ingredientes: ingredientesNuevaReceta.map((ingrediente) => ({
        nombre: ingrediente.nombre,
        cantidadIndicada: ingrediente.cantidad,
        precioTotal: ingrediente.precio,
      })),
    };
    console.log(nuevaReceta)
  
    try {
      await axios.put('http://ec2-3-135-217-78.us-east-2.compute.amazonaws.com:8800/nuevaReceta', nuevaReceta);
      await cargarRecetas();
      setNullData();
      setModoCreacion(false);
    } catch (error) {
      console.error("Error al guardar la receta:", error);
    }
  };
  const handleEliminarReceta = async (id) => {
    try {
      await axios.delete(`http://ec2-3-135-217-78.us-east-2.compute.amazonaws.com:8800/recetas/${id}`);
      await cargarRecetas();
    } catch (error) {
      console.error("Error al eliminar la receta:", error);
    }
  };
  return (
    <div className="app">
      <Navbar />
      <div className="recetas">
        {modoCreacion ? (
      <div className="modalBackground" onClick={handleModalBackgroundClick}>
      <div className="modal">
        <h2>Nueva receta</h2>
        <input className="nombre" type="text" name="Nombre" id="nombre" placeholder='Nombre'/>
        <div className="ingredientes">
          <div className="agregarIngredientes">
            <h3>Agregar ingrediente:</h3>
            <div className="custom-select">
              <input 
                ref={inputRef}
                type="text" 
                placeholder="Buscar ingrediente..." 
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              {isOpen && (
                <div ref={dropdownRef} className="select-items">
                  {filteredIngredients.map((ingredient, index) => (
                    <div 
                      key={index} 
                      onMouseDown={() => handleSelect(ingredient)}
                      className={ingredient === selectedIngredient ? 'selected' : ''}
                    >
                      {ingredient.nombre}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <h3>Cantidad</h3>
            <input type="number" onChange={(e) => setCantSelectedIngredient(e.target.value)} /> <h3>{selectedIngredient ? selectedIngredient.unidad : 'Kg/Lt'}</h3>
            <button className="agregar" onClick={(e)=>handleAgregarIngrediente(e)}>{">"}</button>
          </div>
          <div className="ingredientesLista">
            {ingredientesNuevaReceta.map((ingrediente, index) => (
              <div>
                <h3 id={index} >{ingrediente.nombre} x <span>{ingrediente.cantidad}{ingrediente.unidad}</span> <span className='monto'>${ingrediente.precio}</span></h3>
                <button className="eliminar" onClick={() => handleEliminarIngrediente(index)}>
                Eliminar
              </button>
              </div>
            ))}
          </div>

        </div>
        <div className="detalles">
          <div>
            <h3 className="monto">${montoNuevaReceta}</h3>
            <h3 className="volumen">{volumenNuevaReceta}kg</h3>
            <h3 className="unidades"> Unidades: 
              <input
                type="number"
                value={unidadesNuevaReceta}
                onChange={(e) => setUnidadesNuevaReceta(e.target.value)}
                placeholder="Unidades"
              />
            </h3>
            </div>
            <button className="guardar" onClick={handleGuardarReceta}>Enviar {">"}</button>
          </div>
      </div>
    </div>
        ) : ""}

<div className="left">
  <h1>Armado de recetas</h1>
  <div className="listaItems">
    <div className="top">
      <input type="text" value={searchIngredient} onChange={handleSearchIngredient} placeholder="Buscar ingrediente" />
    </div>
    <div className="listado">
      {ingredients
        .filter((ingredient) => ingredient.nombre.toLowerCase().includes(searchIngredient))
        .map((ingredient, index) => (
          <div key={index} className="item">
            <h2>{ingredient.nombre}</h2>
            <h3>${ingredient.precio}/{ingredient.unidad}</h3>
          </div>
        ))}
    </div>
  </div>
</div>
        <div className="right">
          <div className="top">
            <input
              type="text"
              value={busqueda}
              onChange={handleBuscar}
              placeholder="Buscar receta"
            />
            <button onClick={(e)=>setModoCreacion(true)}>+</button>
          </div>
          <div className="listadoRecetas">
  {recetas
    .filter((receta) => receta.nombre.toLowerCase().includes(busqueda))
    .map((receta) => (
      <div
        key={receta.id}
        className={`receta ${seleccionada === receta.id ? 'seleccionado' : ''}`}
        onClick={() => seleccionarReceta(receta.id)}
      >
        {seleccionada === receta.id ? (
          <>
            <h2>{receta.nombre}</h2>
            <div className="ingredientes">
              <h2>Ingredientes:</h2>
              {receta.ingredientes.map((ingrediente) => (
                <h3 key={ingrediente.nombre}>
                  {ingrediente.nombre} x {ingrediente.volumen}Kg ${ingrediente.precio}
                </h3>
              ))}
            </div>
            <div className="detalles">
              <h2>Receta:</h2>
              <h3 className="monto">${receta.precio}</h3>
              <h3 className="volumen"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" /></svg>{receta.volumen}kg</h3>
              <h3 className="unidades"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>{receta.unidades}</h3>
            </div>
            <div className="detalles detallesUnidad">
              <h2>Unidad:</h2>
              <h3 className="monto">${receta.precio / receta.unidades}</h3>
              <h3 className="volumen"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" /></svg>{receta.volumen / receta.unidades}kg</h3>
            </div>
            <button className="eliminar" onClick={() => handleEliminarReceta(receta.id)}>
              Eliminar
            </button>
          </>
        ) : (
          <div>
            <h2>{receta.nombre}</h2>
            <div className="detalles">
              <h3 className="monto">${receta.precio}</h3>
              <h3 className="volumen"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" /></svg>{receta.volumen}kg</h3>
              <h3 className="unidades"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>{receta.unidades}</h3>
              

            </div>
          </div>
        )}
      </div>
    ))}
</div>
        </div>
        </div>
      </div>
    );
  };
  
  export default Recetas;