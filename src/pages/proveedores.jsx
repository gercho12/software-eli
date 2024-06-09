import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import Navbar from '../components/navbar';

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [seleccionadoProveedor, setSeleccionadoProveedor] = useState(null);
  const [proveedorEditado, setProveedorEditado] = useState(seleccionadoProveedor);
  const [nuevoProveedor, setNuevoProveedor] = useState({
    nombre: "",
    cuit: null,
    telefono: "",
    email: "",
    nota: "",
  });
  const [modoCreacion, setModoCreacion] = useState(false);
  const [modoEdicion, setModoEdicion] = useState([false, ""]);
  const [valorNota, setValorNota] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://ec2-3-144-126-122.us-east-2.compute.amazonaws.com:8800/proveedor');
        setProveedores(result.data);
        console.log(result)
      } catch (error) {
        console.log(error)
        
      }

    };

    fetchData();
  }, []);

  const handleProvedorClick = (datosProveedor) => {
    console.log(datosProveedor);
    setModoCreacion(false);
    setModoEdicion([false, ""]);
    setSeleccionadoProveedor({
      nombre: datosProveedor.nombre,
      cuit: datosProveedor.cuit,
      telefono: datosProveedor.telefono,
      email: datosProveedor.email,
      nota: datosProveedor.nota, // Inicializa nota como cadena vacía
    });
    setProveedorEditado({
      nombre: datosProveedor.nombre,
      cuit: datosProveedor.cuit,
      telefono: datosProveedor.telefono,
      email: datosProveedor.email,
      nota: datosProveedor.nota, // Inicializa nota como cadena vacía
    });
    setValorNota(datosProveedor.nota);
  };

  const creacionProveedor = () => {
    setModoCreacion(true);
    setModoEdicion([false, ""]);
    setValorNota("");

  };
  const enModoEdicion = (cuit) => {
    setModoEdicion([true, cuit]);
  };

  const handleGuardarEdicion = async () => {
    setModoEdicion([false, ""]);

    const datosActualizados = {
      nombre: proveedorEditado.nombre,
      cuit: proveedorEditado.cuit,
      telefono: proveedorEditado.telefono,
      email: proveedorEditado.email,
      nota: valorNota,
    };
    try {
      await axios.put(`http://ec2-3-144-126-122.us-east-2.compute.amazonaws.com:8800/proveedor/${seleccionadoProveedor.cuit}`, datosActualizados);
      // Update the proveedores state with the new data
      const result = await axios('http://ec2-3-144-126-122.us-east-2.compute.amazonaws.com:8800/proveedor');
      setProveedores(result.data);
      setSeleccionadoProveedor(datosActualizados)
    } catch (error) {
      console.log(error.response.data)
    }

  };

  const handleGuardarCreacion = async () => {
    const datosColocados = {
      nombre: nuevoProveedor.nombre,
      cuit: nuevoProveedor.cuit,
      telefono: nuevoProveedor.telefono,
      email: nuevoProveedor.email,
      nota: valorNota,
    };
    console.log(datosColocados);
  
    try {
      const response = await axios.post('http://ec2-3-144-126-122.us-east-2.compute.amazonaws.com:8800/proveedor/creacion', datosColocados);
      console.log(response.data); // Verifica la respuesta del servidor en la consola
      const result = await axios.get('http://ec2-3-144-126-122.us-east-2.compute.amazonaws.com:8800/proveedor');
      setProveedores(result.data);
    } catch (error) {
      console.log(error.response.data);
      // Manejar el error adecuadamente aquí
    }
  
    setModoCreacion(false);
    setNuevoProveedor({
      nombre: "",
      cuit: "",
      telefono: "",
      email: "",
      nota: "",
    });
  };
  
  const handleEliminar = async (cuitEliminar) => {
  
    try {
      const response = await axios.delete(`http://ec2-3-144-126-122.us-east-2.compute.amazonaws.com:8800/proveedor/eliminar/${cuitEliminar}`);
      console.log(response.data); // Verifica la respuesta del servidor en la consola
      const result = await axios.get('http://ec2-3-144-126-122.us-east-2.compute.amazonaws.com:8800/proveedor');
      setProveedores(result.data);
    } catch (error) {
      console.log(error.response.data);
      // Manejar el error adecuadamente aquí
    }
  
    setModoCreacion(false);
    setSeleccionadoProveedor(null)

  };
  


  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleGuardarEdicion();
      event.preventDefault(); // Previene la acción por defecto del Enter (salto de línea)
    }
  };

  return (
    <div className="app">
    <Navbar />
      <div className='proveedores'>
        <div className="left">
          <h1>Registro de proveedores</h1>
          <div className="listaProveedores">
            <div className="top">
              <input type="text" placeholder="Buscar"/>
              <button onClick={creacionProveedor}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#ffff" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                </svg>
                Agregar proveedor
              </button>
            </div>
            <div className="listado">
            {
  Array.isArray(proveedores) ? (
    proveedores.map(({ nombre, cuit, telefono, email, nota }) => {
      const datosProveedor = {  nombre, cuit, telefono, email, nota };
      return (
        <div className={`proveedor ${seleccionadoProveedor && seleccionadoProveedor.cuit === datosProveedor.cuit ? ('selected') :('')}`} onClick={() => handleProvedorClick(datosProveedor)}>
          <h2>{nombre}</h2>
          <h3>{cuit}</h3>
        </div>
      );
    })
  ) : (
    <div>proveedores is not an array</div>
  )
}
            </div>
          </div>
        </div>
        <div className="right">

          {/* <div className="botones">
            <button className="eleminar"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
              Eliminar
            </button>
            <button className="editar"  onClick={() => seleccionadoProveedor && enModoEdicion(seleccionadoProveedor.id)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
              Editar
            </button> 
            <button className="editar" onClick={() => seleccionadoProveedor && setModoEdicion([true, seleccionadoProveedor.id])}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
              Guadrdar
            </button>
          </div> */}

{modoCreacion? (
  <>
            <div className="botones">

            <button className="guardar" onClick={handleGuardarCreacion}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
              Cargar
            </button> 
        </div>
        <div className="dataProveedor">
          <h3 className='tituloData'>Edicion de proveedor</h3>
          <input 
            className='nombreProveedor' 
            onChange={(event) => setNuevoProveedor({...nuevoProveedor, nombre: event.target.value})} 
            onKeyDown={(event)=>handleKeyDown(event)}
          />
          <div className="informacionLegal informacion">
            <h2>Información legal</h2>
            <h3>CUIT: 
              <input 
                type='number' 
                onChange={(event) => setNuevoProveedor({...nuevoProveedor, cuit: event.target.value})} 
                onKeyDown={(event)=>handleKeyDown(event)}
              />
            </h3>
          </div>
          <div className="informacionContacto informacion">
            <h2>Información de contacto</h2>
            <h3>Teléfono: 
              <input 
                type='text' 
                onChange={(event) => setNuevoProveedor({...nuevoProveedor, telefono: event.target.value})} 
                onKeyDown={(event)=>handleKeyDown(event)}
              />
            </h3>
            <h3>Email: 
              <input 
                type='text' 
                onChange={(event) => setNuevoProveedor({...nuevoProveedor, email: event.target.value})} 
                onKeyDown={(event)=>handleKeyDown(event)}
              />
            </h3>
          </div>
        </div>
        <div className="notaProveedor">
            <h2>Nota del proveedor</h2>
            <textarea value={valorNota} onChange={e => setValorNota(e.target.value)}
            onKeyDown={(event)=>handleKeyDown(event)}name='nota'></textarea>
        </div>
      </>
  ) : (
    <>
      {seleccionadoProveedor? (
        modoEdicion[0]? (
          <>
          <div className="botones">
              <button className="eliminar" onClick={(e)=> setModoEdicion([false, ""])}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                Cancelar
              </button>
              <button className="guardar"  onClick={(e) => handleGuardarEdicion()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                Guardar
              </button> 
          </div>
          <div className="dataProveedor">
            <h3 className='tituloData'>Edicion de proveedor</h3>
            <input 
              className='nombreProveedor' 
              value={proveedorEditado.nombre} 
              onChange={(event) => setProveedorEditado({...proveedorEditado, nombre: event.target.value})} 
              onKeyDown={(event)=>handleKeyDown(event)}
            />
            <div className="informacionLegal informacion">
              <h2>Información legal</h2>
              <h3>CUIT: 
                <input 
                  type='text' 
                  value={proveedorEditado.cuit} 
                  onChange={(event) => setProveedorEditado({...proveedorEditado, cuit: event.target.value})} 
                  onKeyDown={(event)=>handleKeyDown(event)}
                />
              </h3>
            </div>
            <div className="informacionContacto informacion">
              <h2>Información de contacto</h2>
              <h3>Teléfono: 
                <input 
                  type='text' 
                  value={proveedorEditado.telefono} 
                  onChange={(event) => setProveedorEditado({...proveedorEditado, telefono: event.target.value})} 
                  onKeyDown={(event)=>handleKeyDown(event)}
                />
              </h3>
              <h3>Email: 
                <input 
                  type='text' 
                  value={proveedorEditado.email} 
                  onChange={(event) => setProveedorEditado({...proveedorEditado, email: event.target.value})} 
                  onKeyDown={(event)=>handleKeyDown(event)}
                />
              </h3>
            </div>
          </div>
          <div className="notaProveedor">
              <h2>Nota del proveedor</h2>
              <textarea value={valorNota} onChange={e => setValorNota(e.target.value)} onBlur={()=>handleGuardarEdicion()} 
              onKeyDown={(event)=>handleKeyDown(event)}name='nota'></textarea>
          </div>
        </>
        ) : (
          <>
          <div className="botones">
            <button className="eliminar" onClick={(e)=> handleEliminar(seleccionadoProveedor.cuit)}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>

              Eliminar
            </button>
            <button className="editar"  onClick={() => enModoEdicion(seleccionadoProveedor.cuit)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
              Editar
            </button> 
          </div>
          <div className="dataProveedor">
            <h3 className='tituloData'>Proveedor seleccionado</h3>
            <h2 className='nombreProveedor'>{seleccionadoProveedor.nombre}</h2>
            <div className="informacionLegal informacion">
              <h2>Información legal</h2>
              <h3>CUIT: <span>{seleccionadoProveedor.cuit}</span></h3>
            </div>
            <div className="informacionContacto informacion">
              <h2>Información de contacto</h2>
              <h3>Teléfono: <span>{seleccionadoProveedor.telefono}</span></h3>
              <h3>Email: <span>{seleccionadoProveedor.email}</span></h3>
            </div>
          </div>
          <div className="notaProveedor">
            <h2>Nota del proveedor</h2>
            <textarea value={valorNota} onChange={e => setValorNota(e.target.value)} onBlur={()=>handleGuardarEdicion()} name='nota'></textarea>
          </div>
        </>
        )
      ) : (
        <h2>Seleccione un proveedor</h2>
        // No provider selected code here
      )}
    </>
  )}


        </div>
      </div>
    </div>
  )
};

export default Proveedores