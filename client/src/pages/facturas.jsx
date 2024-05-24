import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import Navbar from '../components/navbar';

const Facturas = () => {
  const [facturaSeleccionada, setFacturaSeleccionada] = useState("");
  const [itemsSeleccionados, setItemsSeleccionados] = useState("");
  const [facturas, setFacturas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("masReciente");
  const [loading, setLoading] = useState(false);
  const [modoSubir, setModoSubir] = useState(false);
  const [modoCreacion, setModoCreacion] = useState(true);
  const [impuestosAgregados, setImpuestosAgregados] = useState([]);
  const [tipoFactura, setTipoFactura] = useState("");
  const [importeTotalFactura, setImporteTotalFactura] = useState(null);
  const [importeSubTotalFactura, setImporteSubTotalFactura] = useState(null);
  const [facturaData, setFacturaData] = useState({});




  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      return; // No se seleccionó ningún archivo, salir de la función
    }
    
    setLoading(true); // Solo se establece en true si se seleccionó un archivo    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('invoice', file);

      try {
        const response = await axios.post('http://localhost:8800/process-invoice', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          console.log('Success:', response.data);
        } else {
          console.error('Error:', response.statusText);
          alert('Error uploading file: ' + response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error uploading file: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };


  // const Facturelejida = () => {
  //   const { id } = useParams();
  
  //   useEffect(() => {
  //     // Función que se debe ejecutar con el parámetro id
  //     const fetchFactura = async (id) => {
  //       // Lógica para obtener la factura con el id proporcionado
  //       console.log(`Fetching factura con ID: ${id}`);
  //       // Aquí podrías hacer una llamada a una API para obtener los datos de la factura
  //     };
  
  //     fetchFactura(id);
  //   }, [id]);
  // }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://localhost:8800/facturas');
        if (!Array.isArray(result.data) || result.data.length === 0) {
          setFacturas(null);
        } else {
          const facturasConDiferencia = result.data.map(factura => {
            const fechaVencimiento = new Date(factura.fechaVencimiento);
            const fechaActual = new Date();
            const diferenciaMilisegundos = fechaVencimiento - fechaActual;
            const diferenciaDias = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

            // Agrega la propiedad "diferenciaDias" al objeto de la factura
            return { ...factura, diferenciaDias };
          });

          setFacturas(facturasConDiferencia);
          console.log(facturasConDiferencia)
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const guardarEstadoAbonado = async (id, estadoAbonadoAntiguo, event) => {
    event.stopPropagation();
    console.log(estadoAbonadoAntiguo);
    const estadoAbonado = estadoAbonadoAntiguo === 0 ? 1 : 0;
    console.log(estadoAbonado);
    try {
      await axios.put(`http://localhost:8800/actualizarFactura/${id}/${estadoAbonado}`);
      try {
        const result = await axios.get('http://localhost:8800/facturas');
        if (!Array.isArray(result.data) || result.data.length === 0) {
          setFacturas(null);
        } else {
          const facturasConDiferencia = result.data.map(factura => {
            const fechaVencimiento = new Date(factura.fechaVencimiento);
            const fechaActual = new Date();
            const diferenciaMilisegundos = fechaVencimiento - fechaActual;
            const diferenciaDias = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

            // Agrega la propiedad "diferenciaDias" al objeto de la factura
            return { ...factura, diferenciaDias };
          });

          setFacturas(facturasConDiferencia);
          console.log(facturasConDiferencia)
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error.response.data);
    }
  }

  const seleccionFactura = async (id) => {
    console.log(id)
    try {
      const result = await axios.get(`http://localhost:8800/items/${id}`);
      if (!Array.isArray(result.data) || result.data.length === 0) {
        setItemsSeleccionados(null);
      } else {
        setItemsSeleccionados(result.data);
      }
    } catch (error) {
      console.log(error)
    }
    console.log(itemsSeleccionados)

    facturaSeleccionada == id ? setFacturaSeleccionada("") : setFacturaSeleccionada(id)
  }

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
  }

  const handleOrden = (e) => {
    setOrden(e.target.value);
  }

  const facturasFiltradas = facturas.filter(factura => {
    const valores = Object.values(factura).join(" ").toLowerCase();
    return valores.includes(busqueda.toLowerCase());
  });

  const ordenarFacturas = (facturas) => {
    switch (orden) {
      case "masReciente":
        return facturas.sort((a, b) => new Date(b.fechaEmision) - new Date(a.fechaEmision));
      case "cercanoVencimiento":
        return facturas.sort((a, b) => {
          if (a.estadoAbonado === 0 && b.estadoAbonado === 0) {
            return new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento);
          } else if (a.estadoAbonado === 0 && b.estadoAbonado !== 0) {
            return -1;
          } else if (a.estadoAbonado !== 0 && b.estadoAbonado === 0) {
            return 1;
          } else {
            return 0;
          }
        });
      case "mayorImporte":
        return facturas.sort((a, b) => b.costoTotal - a.costoTotal);
      default:
        return facturas;
    }
  }

  const facturasOrdenadas = ordenarFacturas(facturasFiltradas);
  const handleModalBackgroundClick = (event) => {
    // Verificar si el estado loading es positivo
    if (loading) {
      return; // No hacer nada si loading es true
    }
  
    // Verificar si el clic ocurrió fuera del contenido del modal
    if (event.target === event.currentTarget) {
      setModoSubir(false);
      setModoCreacion(false);
    }
  };


  const agregarImpuesto = () => {
    setImpuestosAgregados(prevImpuestos => [...prevImpuestos, { nombreImpuesto: "", tasa: 0, monto: 0 }]);
  };

  const handleTipoFacturaClick = (tipo) => {
    if (tipoFactura === tipo) {
      setTipoFactura("");
    } else {
      setTipoFactura(tipo);
    }
  };

  const handleEnviar = () => {
    setFacturaData({
      tipoFactura,
      impuestosAgregados,
      // Add other factura data here
    });
    // Send the factura data to the server or perform any other action
    console.log(facturaData);
  };


  // const calcularMontoImpuesto = (index) => {
  //   const tasa = parseFloat(impuestosAgregados[index].tasa);
  //   const monto = (tasa / 100) * importeSubTotalFactura;
  //   setImpuestosAgregados(prevImpuestos =>
  //     prevImpuestos.map((imp, i) =>
  //       i === index ? { ...imp, monto: monto.toFixed(2) } : imp
  //     )
  //   );
  // };

  return (
    <div className="app">
      <Navbar />
      {modoSubir ? (
        <div className="modalBackground modalCargarArchivo" onClick={handleModalBackgroundClick}>
        <div className="modal modalCargarArchivo">
           {loading ? (
            <div className='cargando'>
            <span class="loader"></span>
            </div>
           ):("")}

          <h2>Cargar factura <span>con IA</span></h2>
          
          <label className="filelabel" htmlFor="FileInput">
            <span className="title">Elejir archivo</span>
            <h3 className="subtitle">Elije una imagen o un PDF para cargar factura automáticamente</h3>
            <input
              className="FileUpload1"
              id="FileInput"
              name="booking_attachment"
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
            />
          </label>
          <button>Cargar manualmente</button>
        </div>
      </div>
      ):("")}

    {modoCreacion ? (
        <div className="modalBackground modalCargarDatos" onClick={handleModalBackgroundClick}>
        <div className="modal modalCargarDatos">
           {loading ? (
            <div className='cargando'>
            <span class="loader"></span>
            </div>
           ):("")}

          <h2 className='tituloModal'>Cargar factura <span>con IA</span></h2>
         <div className='seccionesDatos'>  
           <div className="detallesFactura seccionDatos">
              <h2>Detalles factura</h2>
              <div className="datos">
                    <div className="dato tipoFactura">
                    <h3>Tipo de factura</h3>
                    <div className="tiposFactura">
                      <div className={tipoFactura === "A"? "tipo A seleccionado" : "tipo A"} onClick={() => handleTipoFacturaClick("A")}> A</div>
                      <div className={tipoFactura === "B"? "tipo B seleccionado" : "tipo B"} onClick={() => handleTipoFacturaClick("B")}> B</div>
                      <div className={tipoFactura === "C"? "tipo C seleccionado" : "tipo C"} onClick={() => handleTipoFacturaClick("C")}> C</div>
                      <div className={tipoFactura === "M"? "tipo M seleccionado" : "tipo M"} onClick={() => handleTipoFacturaClick("M")}> M</div>
                      <div className={tipoFactura === "N"? "tipo N seleccionado" : "tipo N"} onClick={() => handleTipoFacturaClick("N")}> N</div>
                    </div>
                  </div>
                  <div className="dato codigoFactura">
                    <h3>Codigo de factura</h3>
                    <input type="text" />
                  </div>

                  <div className="dato fechaEmision">
                    <h3>Fecha de emision</h3>
                    <input type="date" />
                  </div>
                  <div className="dato fechaVencimiento">
                    <h3>Fecha de vencimiento</h3>
                    <input type="date" />
                  </div>
                  <div className="dato detallesProveedor">
                    <h3>Detalles del proveedor</h3>
                    <input type="text" placeholder='Nombre del proveedor'/>
                    <input type="text" placeholder='CUIT del proveedor'/>
                  </div>
              </div>
           </div>
           <div className="impuestosFactura seccionDatos">
              <h2>Impuestos y retenciones</h2>
              <div className="datos">
                  <div className="dato impuesto">
                    <h3>IVA correspondiente</h3>
                    <div className="inputTasa">
                      <input type="number" />
                      <span>%</span>
                      <span className="obtenerValor"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" /></svg></span>
                    </div>
                    <input type="number" placeholder='Monto' />
                  </div>
                  <div className="dato impuesto">
                    <h3>IIBB correspondiente</h3>
                    <div className="inputTasa">
                      <input type="number" />
                      <span>%</span>
                      <span className="obtenerValor"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" /></svg></span>
                    </div>
                    <input type="number" placeholder='Monto' />
                  </div>
                  <div className="dato impuesto">
                    <h3>Percepcion de IVA</h3>
                    <div className="inputTasa">
                      <input type="number" />
                      <span>%</span>
                      <span className="obtenerValor"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" /></svg></span>
                    </div>
                    <input type="number" placeholder='Monto' />
                  </div>
                  <div className="dato impuesto">
                    <h3>Percepcion de IIBB</h3>
                    <div className="inputTasa">
                      <input type="number" />
                      <span>%</span>
                      <span className="obtenerValor"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" /></svg></span>
                    </div>
                    <input type="number" placeholder='Monto' />
                  </div>
                  {impuestosAgregados.map((impuesto, index) => (
                  <div className="dato impuestoAgregado" key={index}>
                    <input className='nombreImpuesto' type="text" placeholder='Nombre del impuesto' value={impuesto.nombreImpuesto} onChange={e => setImpuestosAgregados(prevImpuestos => prevImpuestos.map((imp, i) => i === index? {...imp, nombreImpuesto: e.target.value } : imp))} />
                    <div className="inputTasa">
                      <input type="number" value={impuesto.tasa} onChange={e => setImpuestosAgregados(prevImpuestos => prevImpuestos.map((imp, i) => i === index? {...imp, tasa: e.target.value } : imp))} />
                      <span>%</span>
                    </div>
                    <input type="number" placeholder='Monto' value={impuesto.monto} onChange={e => setImpuestosAgregados(prevImpuestos => prevImpuestos.map((imp, i) => i === index? {...imp, monto: e.target.value } : imp))} />
                  </div>
                  ))}
                  <div className="agregarImpuesto" onClick={agregarImpuesto}>
                      +
                  </div>
              </div>
           </div>

           </div>
        </div>
      </div>
      ):("")}
      

      <div className='facturas'>

        <h1>Registro de facturas</h1>
        <div className="bottom">
          <div className="top">
            <input type="text" name="buscador" value={busqueda} onChange={handleBusqueda} />
            <select className="selector selectorOrden" value={orden} onChange={handleOrden}>
              <option value="masReciente">Mas reciente</option>
              <option value="cercanoVencimiento">Cercano a vencer</option>
              <option value="mayorImporte">Mayor importe</option>
            </select>
            <button onClick={()=> setModoSubir(true)}><p className='texto' >📄 Cargar factura</p> <p className='mas'>+</p></button>
          </div>

          <div className="listaFacturas">
            {facturasOrdenadas.map(({ id, tipoFactura, numeroFactura, fechaEmision, fechaVencimiento, proveedorEmisor, costoTotal, iva, estadoAbonado, diferenciaDias, items }) => {
              const datos = { id, tipoFactura, numeroFactura, fechaEmision, fechaVencimiento, proveedorEmisor, costoTotal, iva, estadoAbonado, diferenciaDias }
              const fechaEmisionCorrecta = fechaEmision.slice(0, 10);
              const fechaVencimientoCorrecta = fechaVencimiento.slice(0, 10);

              return (
                <div className="factura" key={id}>
                  <div className={facturaSeleccionada == id ? "topFactura selected" : "topFactura"}>
                    <h2 onClick={() => seleccionFactura(id)}>Factura {numeroFactura}</h2>
                    {facturaSeleccionada == id ? (
                      <div className="data" onClick={() => seleccionFactura(id)}>
                        <h3 className="dato">Tipo de factura: <span>{tipoFactura}</span></h3>
                        <h3 className="dato">Proveedor: <span>{proveedorEmisor}</span></h3>
                        <h3 className="dato">Costo total: <span>${costoTotal}</span></h3>
                        <h3 className="dato">IVA: <span>${iva}</span></h3>
                        <h3 className="dato">Emision: <span>{fechaEmisionCorrecta}</span></h3>
                        <h3 className="dato">Vencimiento: <span>{fechaVencimientoCorrecta}</span></h3>
                        <h3 className="dato datoAbonado" onClick={(e) => guardarEstadoAbonado(id, estadoAbonado, e)}>Estado: <span className={estadoAbonado == 0 ? "" : "abonado"}>{estadoAbonado == 0 ? "No abonado" : "Abonado"}</span></h3>

                      </div>
                      ) : (
                    <div className="data" onClick={() => seleccionFactura(id)}>
                        <h3 className="dato">Tipo de factura: <span>{tipoFactura}</span></h3>
                        <h3 className="dato">Proveedor: <span>{proveedorEmisor}</span></h3>
                        <h3 className="dato">Costo total: <span>${costoTotal}</span></h3>
                        <h3 className="dato">IVA: <span>${iva}</span></h3>
                        <h3 className="dato vencimiento">Vencimiento: <span className={diferenciaDias < 10 && estadoAbonado == 0 ? "cercano" : ""}>{diferenciaDias} dias</span></h3>
                    </div>
                    )}
                    {facturaSeleccionada == id ? (
                      <div className="buttons">
                        <>
                          <button>🚮</button>
                          <button>🖋️</button>
                        </>
                      </div>
                    ) : (
                  <div onClick={(e) => guardarEstadoAbonado(id, estadoAbonado, e)} className={estadoAbonado == 0 ? "estadoAbonado" : "estadoAbonado abonado"}></div>
                  )}
                </div>
                <div className={facturaSeleccionada == id ? "facturaItems selected" : "facturaItems"}>
                  < h2>Items:</h2>
                  {itemsSeleccionados ? (itemsSeleccionados.map(({ id, id_factura, Codigo, Descripcion, VolumenUnidad, UnidadesBulto, PrecioBulto, Bultos, Bonificacion, Importe }) => {
                  return (
                  <div className="item" key={id}>
                  <h3 className="dato">Codigo: <span>{Codigo}</span></h3>
                  <h3 className="dato">Descripcion: <span>{Descripcion}</span></h3>
                  <h3 className="dato">Volumen unidad: <span>{VolumenUnidad}</span></h3>
                  <h3 className="dato">Unidades bulto: <span>{UnidadesBulto}</span></h3>
                  <h3 className="dato">Precio bulto: <span>${PrecioBulto} </span></h3>
                  <h3 className="dato">Bultos: <span>{Bultos} </span></h3>
                  <h3 className="dato">Bonificacion: <span>{Bonificacion}% </span></h3>
                  <h3 className="dato">Importe: <span>${Importe} </span></h3>
                </div>
        );
        })) : ("")}
                </div>
             </div>
           );
           })}
        </div>
        </div>
        </div>
        </div>
        );
        }

export default Facturas;
