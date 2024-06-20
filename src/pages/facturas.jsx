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
  const [modoCreacion, setModoCreacion] = useState(false);
  const [numeroFactura, setNumeroFactura] = useState(null);
  const [tipoFactura, setTipoFactura] = useState(null);
  const [fechaEmision, setFechaEmision] = useState(null);
  const [fechaVencimiento, setFechaVencimiento] = useState(null);
  const [emisorNombre, setEmisorNombre] = useState(null);
  const [emisorCUIT, setEmisorCUIT] = useState(null);
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [ivaMonto, setIvaMonto] = useState(0);
  const [percepcionIVAMonto, setPercepcionIVAMonto] = useState(0);
  const [percepcionIBBMonto, setPercepcionIBBMonto] = useState(0);
  const [IBBMonto, setIBBMonto] = useState(0);
  const [otrosImpuestos, setOtrosImpuestos] = useState([]);
  const [impuestosAgregados, setImpuestosAgregados] = useState([]);
  const [facturaData, setFacturaData] = useState({});
  const [total, setTotal] = useState(0);
  const [totalVencimiento, setTotalVencimiento] = useState(0);
  const [facturaObtenida, setFacturaObtenida] = useState([])


  const handleAddItem = () => {
    setItems([...items, { codigo: null, descripcion: null, volumenUnidad: null, medicionVolumen:null, cantUnidadesBulto: null, precioBulto: null, precioUnidad: null, cantBultosItem: null, importeItem: null }]);
  };
  const handleImpuestoChange = (e, index, key) => {
    const value = e.target.value;
    setImpuestosAgregados(otrosImpuestos.map((impuesto, i) => (i === index? {...impuesto, [key]: value } : impuesto)));
  };
const handleItemChange = (e, index, key) => {
  const value = e.target.value;
  setItems(items.map((item, i) => (i === index? {...item, [key]: value } : item)));
};

const formatDate = (dateString) => {
  // Dividir la cadena de fecha en partes (día, mes y año)
  const parts = dateString.split('-');
  
  // Crear un nuevo objeto de fecha con el orden correcto (año, mes, día)
  const formattedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  
  // Verificar si el objeto de fecha es válido
  if (isNaN(formattedDate.getTime())) {
    // Si la fecha no es válida, devuelve la cadena original
    return dateString;
  } else {
    // Si la fecha es válida, devuelve la fecha formateada en formato ISO
    return formattedDate.toISOString().split('T')[0];
  }
};

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
      const response = await axios.post('http://ec2-3-135-217-78.us-east-2.compute.amazonaws.com:8800/process-invoice', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('Success:', response.data);
        setFacturaObtenida(response.data);
        const handleFacturaObtenida = (facturaObtenida) => {
          setNumeroFactura(facturaObtenida.codigoFactura || null);
          setTipoFactura(facturaObtenida.tipoFactura || null);
          // Convertir las fechas de texto a objetos de fecha JavaScript
          const fechaEmisionDate = facturaObtenida.fechaEmision ? formatDate(facturaObtenida.fechaEmision) : null;
          const fechaVencimientoDate = facturaObtenida.fechaVencimiento ? formatDate(facturaObtenida.fechaVencimiento) : null;

          setFechaEmision(fechaEmisionDate);
          setFechaVencimiento(fechaVencimientoDate);
        
          // Emisor
          if (facturaObtenida.emisor) {
            setEmisorNombre(facturaObtenida.emisor.nombre || null);
            setEmisorCUIT(facturaObtenida.emisor.CUIT || null);
          } else {
            setEmisorNombre(null);
            setEmisorCUIT(null);
          }
          
          setItems(facturaObtenida.items || []);
          setSubtotal(facturaObtenida.subtotal || null);
        
          // Impuestos
          if (facturaObtenida.impuestos) {
            const impuestos = facturaObtenida.impuestos;
        
            if (impuestos.IVA && impuestos.IVA.monto !== undefined) {
              setIvaMonto(impuestos.IVA.monto);
            }
            if (impuestos.percepcionIVA && impuestos.percepcionIVA.monto !== undefined) {
              setPercepcionIVAMonto(impuestos.percepcionIVA.monto);
            }
            if (impuestos.percepcionIIBB && impuestos.percepcionIIBB.monto !== undefined) {
              setPercepcionIBBMonto(impuestos.percepcionIIBB.monto);
            }
            if (impuestos.IIBB && impuestos.IIBB.monto !== undefined) {
              setIBBMonto(impuestos.IIBB.monto);
            }
            if (impuestos.otrosImpuestos) {
              setOtrosImpuestos(impuestos.otrosImpuestos);
            }
          }
        
          setTotal(facturaObtenida.total || null);
          setTotalVencimiento(facturaObtenida.totalTrasVencimiento || null);
        };
        
        handleFacturaObtenida(response.data);
        setModoSubir(false)
        setModoCreacion(true)

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

const guardarDatosFactura = async () => {
  setModoCreacion(false)
    const dataFactura = {
      codigoFactura: numeroFactura,
      tipoFactura: tipoFactura,
      fechaEmision: fechaEmision,
      fechaVencimiento: fechaVencimiento,
      emisor: {
        nombre: emisorNombre,
        CUIT: emisorCUIT,
      },
      subtotal: subtotal,
      impuestos: {
        IVAMonto: ivaMonto,
        percepcionIVAMonto: percepcionIVAMonto,
        percepcionIIBBMonto: percepcionIBBMonto,
        IIBBMonto: IBBMonto,
        otrosImpuestos: otrosImpuestos.map(impuesto => `${impuesto.nombreImpuesto},${impuesto.monto}`).join(';'),
      },
      total: total,
      totalTrasVencimiento: totalVencimiento,
    }

    try {
      const responseFactura = await axios.put('http://ec2-3-135-217-78.us-east-2.compute.amazonaws.com:8800/cargarFactura', dataFactura);
      console.log(responseFactura)
        const dataItems = items.map((item, index) => {
          return {
            facturaId: responseFactura.data.facturaId,
            codigo: item.codigo,
            descripcion: item.descripcion,
            volumenUnidad: item.volumenUnidad,
            medicionVolumen: item.medicionVolumen,
            cantUnidadesBulto: item.cantUnidadesBulto,
            precioBulto: item.precioBulto,
            cantBultosItem: item.precioUnidad,
            bonificacion: item.cantBultosItem/100,
            importeItem: item.importeItem,
          };
        });
        try {
          const responseItems = await axios.put('http://ec2-3-135-217-78.us-east-2.compute.amazonaws.com:8800/cargarItems', dataItems);
          try {
            const result = await axios.get('http://ec2-3-135-217-78.us-east-2.compute.amazonaws.com:8800/facturas');
            if (!Array.isArray(result.data) || result.data.length === 0) {
              setFacturas(null);
            } else {
              const facturasConDiferencia = result.data.map(factura => {
                let fechaVencimiento = null;
                if (factura.fechaVencimiento) {
                  const fechaVencimientoString = factura.fechaVencimiento.trim();
                  if (fechaVencimientoString) {
                    fechaVencimiento = new Date(fechaVencimientoString);
                    if (isNaN(fechaVencimiento.getTime())) {
                      fechaVencimiento = null;
                    }
                  }
                }
            
                const fechaActual = new Date();
            
                let diferenciaDias = null;
                if (fechaVencimiento && fechaActual) {
                  const diferenciaMilisegundos = fechaVencimiento - fechaActual;
                  diferenciaDias = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
                }
            
                // Agrega la propiedad "diferenciaDias" al objeto de la factura
                return {...factura, diferenciaDias };
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
    } catch (error) {
      console.log(error.response.data);
      // Manejar el error adecuadamente aquí
    }
}


  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://ec2-3-135-217-78.us-east-2.compute.amazonaws.com:8800/facturas');
        if (!Array.isArray(result.data) || result.data.length === 0) {
          setFacturas(null);
        } else {
          const facturasConDiferencia = result.data.map(factura => {
            let fechaVencimiento = null;
            if (factura.fechaVencimiento) {
              const fechaVencimientoString = factura.fechaVencimiento.trim();
              if (fechaVencimientoString) {
                fechaVencimiento = new Date(fechaVencimientoString);
                if (isNaN(fechaVencimiento.getTime())) {
                  fechaVencimiento = null;
                }
              }
            }
        
            const fechaActual = new Date();
        
            let diferenciaDias = null;
            if (fechaVencimiento && fechaActual) {
              const diferenciaMilisegundos = fechaVencimiento - fechaActual;
              diferenciaDias = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
            }
        
            // Agrega la propiedad "diferenciaDias" al objeto de la factura
            return {...factura, diferenciaDias };
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
      await axios.put(`http://ec2-3-135-217-78.us-east-2.compute.amazonaws.com:8800/actualizarFactura/${id}/${estadoAbonado}`);
      try {
        const result = await axios.get('http://ec2-3-135-217-78.us-east-2.compute.amazonaws.com:8800/facturas');
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
      const result = await axios.get(`http://ec2-3-135-217-78.us-east-2.compute.amazonaws.com:8800/items/${id}`);
      if (!Array.isArray(result.data) || result.data.length === 0) {
        setItemsSeleccionados(null);
      } else {
        setItemsSeleccionados(result.data);
      }
    } catch (error) {
      console.log(error)
    }
    console.log(itemsSeleccionados)

    facturaSeleccionada === id ? setFacturaSeleccionada("") : setFacturaSeleccionada(id)
  }

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
  }

  const handleOrden = (e) => {
    setOrden(e.target.value);
  }
  const facturasFiltradas = facturas? facturas.filter(factura => {
    const valores = Object.values(factura).join(" ").toLowerCase();
    return valores.includes(busqueda.toLowerCase());
  }) : [];

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
  const setNullData = () => {
    setModoSubir(false);
    setModoCreacion(false);
    setNumeroFactura(null);
    setTipoFactura(null);
    setFechaEmision(null);
    setFechaVencimiento(null);
    setEmisorNombre(null);
    setEmisorCUIT(null);
    setItems([]);
    setSubtotal(0);
    setIvaMonto(0);
    setPercepcionIVAMonto(0);
    setPercepcionIBBMonto(0);
    setIBBMonto(0);
    setOtrosImpuestos([]);
    setTotal(0);
    setTotalVencimiento(0);
  }
  const facturasOrdenadas = ordenarFacturas(facturasFiltradas);
  const handleModalBackgroundClick = (event) => {
    // Verificar si el estado loading es positivo
    if (loading) {
      return; // No hacer nada si loading es true
    }
  
    // Verificar si el clic ocurrió fuera del contenido del modal
    if (event.target === event.currentTarget) {
      setNullData();
    }
  };


  const agregarImpuesto = () => {
    setOtrosImpuestos(prevImpuestos => [...prevImpuestos, { nombreImpuesto: "", monto: 0 }]);
  };

  const handleTipoFacturaClick = (tipo) => {
    if (tipoFactura === tipo) {
      setTipoFactura("");
    } else {
      setTipoFactura(tipo);
    }
    console.log(facturaData);
  };


  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i!== index));
  };
  const cargarManual = () => {
    setModoSubir(false)
    setModoCreacion(true)
  };

  const handleDeleteFactura = async (id) => {
    try {
      await axios.delete(`http://ec2-3-135-217-78.us-east-2.compute.amazonaws.com:8800/facturasDelete/${id}`);
      try {
        const result = await axios.get('http://ec2-3-135-217-78.us-east-2.compute.amazonaws.com:8800/facturas');
        if (!Array.isArray(result.data) || result.data.length === 0) {
          setFacturas(null);
        } else {
          const facturasConDiferencia = result.data.map(factura => {
            let fechaVencimiento = null;
            if (factura.fechaVencimiento) {
              const fechaVencimientoString = factura.fechaVencimiento.trim();
              if (fechaVencimientoString) {
                fechaVencimiento = new Date(fechaVencimientoString);
                if (isNaN(fechaVencimiento.getTime())) {
                  fechaVencimiento = null;
                }
              }
            }
        
            const fechaActual = new Date();
        
            let diferenciaDias = null;
            if (fechaVencimiento) {
              const diferenciaMilisegundos = fechaVencimiento - fechaActual;
              diferenciaDias = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
            }
        
            // Agrega la propiedad "diferenciaDias" al objeto de la factura
            return {...factura, diferenciaDias };
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
    
  };
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
          <button onClick={(e)=>cargarManual()}>Cargar manualmente</button>
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

          <h2 className='tituloModal'>Cargar factura <span>con IA</span> </h2>
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
                    <input type="text" value={numeroFactura} onChange={(e) => setNumeroFactura(e.target.value)} />
                  </div>
                  <div className="dato fechaEmision">
                    <h3>Fecha de emision</h3>
                    <input type="date" value={fechaEmision || ''} onChange={(e) => setFechaEmision(e.target.value)} />
                  </div>
                  <div className="dato fechaVencimiento">
                    <h3>Fecha de vencimiento</h3>
                    <input type="date" value={fechaVencimiento || ''} onChange={(e) => setFechaVencimiento(e.target.value)} />
                  </div>
                  <div className="dato detallesProveedor">
                    <h3>Detalles del proveedor</h3>
                    <input type="text" placeholder='Nombre del proveedor' value={emisorNombre} onChange={(e) => setEmisorNombre(e.target.value)} />
                    <input type="number" placeholder='CUIT del proveedor' value={emisorCUIT} onChange={(e) => setEmisorCUIT(e.target.value)} />
                  </div>
              </div>
           </div>
           <div className="impuestosFactura seccionDatos">
              <h2>Impuestos y retenciones</h2>
              <div className="datos">
                  <div className="dato impuesto">
                    <h3>IVA correspondiente</h3>
                    {/* <div className="inputTasa">
                      <input type="number" />
                      <span>%</span>
                      <div className="obtenerValor" >⬇️</div>
                    </div> */}
                    <input type="number" placeholder="Monto" value={ivaMonto} onChange={(e) => setIvaMonto(e.target.value)} />
                  </div>
                  <div className="dato impuesto">
                    <h3>IIBB correspondiente</h3>

                    <input type="number" placeholder="Monto" value={IBBMonto} onChange={(e) => setIBBMonto(e.target.value)} />
                  </div>
                  <div className="dato impuesto">
                    <h3>Percepcion de IVA</h3>

                    <input type="number" placeholder="Monto" value={percepcionIVAMonto} onChange={(e) => setPercepcionIVAMonto(e.target.value)} />
                  </div>
                  <div className="dato impuesto">
                    <h3>Percepcion de IIBB</h3>

                    <input type="number" placeholder="Monto" value={percepcionIBBMonto} onChange={(e) => setPercepcionIBBMonto(e.target.value)} />
                  </div>
                  {otrosImpuestos ? (otrosImpuestos.map((impuesto, index) => (
                    <div className="dato impuesto" key={index}>
                      <input type="text" placeholder="nombre" value={impuesto.nombre} onChange={(e) => handleImpuestoChange(e, index, "nombre")} />
                      <input type="number" placeholder="monto" value={impuesto.monto} onChange={(e) => handleImpuestoChange(e, index, "monto")} />
                    </div>
                  ))):("")}
                  <div className="agregarImpuesto" onClick={agregarImpuesto}>
                      +
                  </div>
              </div>
           </div>
          <div className="montosFactura seccionDatos">
                  <h2>Montos de la factura</h2>
                  <div className="datos">
                    <div className="dato monto">
                      <h3>Sub-Total</h3>
                      <input type="text" placeholder="Monto" value={subtotal} onChange={(e) => setSubtotal(e.target.value)} />
                    </div>
                    <div className="dato monto">
                      <h3>Total</h3>
                      <input type="text" placeholder="Monto" value={total} onChange={(e) => setTotal(e.target.value)} />
                    </div>
                    <div className="dato monto">
                      <h3>Total tras vencimiento</h3>
                      <input type="number" placeholder='Monto' value={totalVencimiento} onChange={(e) => setTotalVencimiento(e.target.value)}/>
                    </div>
                  </div>
          </div>
          <div className="itemsFactura seccionDatos">
            <h2>Items de la factura</h2>
            <button onClick={handleAddItem}>Agregar Item</button>
            <div className="datos">
            {items.map((item, index) => (
              <div className="dato item" key={index}>
                <div className="cerrar" onClick={() => handleRemoveItem(index)}><h2>X</h2></div>
                <h3>Codigo</h3>
                <input type="text" value={item.codigo} onChange={(e) => handleItemChange(e, index, "codigo")} />
                <h3>Descripcion</h3>
                <input type="text" value={item.descripcion} onChange={(e) => handleItemChange(e, index, "descripcion")} />
                <h3>Volumen Unidad</h3>
                <div className="volumenUnidad">
                  <input type="number" value={item.volumenUnidad } onChange={(e) => handleItemChange(e, index, "volumenUnidad")} />
                  <select value={item.medicionVolumen} onChange={(e) => handleItemChange(e, index, "medicionVolumen")} > <option value="Litros">L</option> <option value="Kilogramos">Kg</option></select>
                </div>
                <h3>Cantidad de Unidades por Bulto</h3>
                <input type="number" value={item.cantUnidadesBulto} onChange={(e) => handleItemChange(e, index, "cantUnidadesBulto")} />
                <h3>Precio del Bulto</h3>
                <input type="number" value={item.precioBulto} onChange={(e) => handleItemChange(e, index, "precioBulto")} />
                <h3>Precio por Unidad</h3>
                <input type="number" value={item.precioUnidad} onChange={(e) => handleItemChange(e, index, "precioUnidad")} />
                <h3>Cantidad de Bultos</h3>
                <input type="number" value={item.cantBultosItem} onChange={(e) => handleItemChange(e, index, "cantBultosItem")} />
                <h3>Bonificacion</h3>
                <div className="inputTasa">
                        <input type="number" placeholder="tasa" defaultValue={item.bonificacion * 100} onChange={(e) => handleItemChange(e, index, "bonificacion")} />
                        <span>%</span>
                        <span className="obtenerValor"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" /></svg></span>
                    </div>
                <h3>Importe del Item</h3>
                <input type="number" value={item.importeItem} onChange={(e) => handleItemChange(e, index, "importeItem")} />
              </div>
            ))}
            </div>
          </div>
           </div>
           <div className='botonesFactura'>
            <button className="cancelar" onClick={(e)=>handleModalBackgroundClick(e)}>Cancelar</button>
            <button className="enviar" onClick={()=>guardarDatosFactura()}>Enviar →</button>
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
  {facturasOrdenadas.length > 0 ? (
    facturasOrdenadas.map(({ id, tipoFactura, numeroFactura, fechaEmision, fechaVencimiento, proveedorEmisor, costoTotal, IVAMonto, percepcionIBBMonto, IIBBMonto, percepcionIVAMonto, estadoAbonado, otrosImpuestos, diferenciaDias, items }) => {
      const datos = { id, tipoFactura, numeroFactura, fechaEmision, fechaVencimiento, proveedorEmisor, costoTotal, IVAMonto, percepcionIBBMonto, IIBBMonto, percepcionIVAMonto, estadoAbonado, otrosImpuestos, diferenciaDias }
      const fechaEmisionCorrecta = fechaEmision ? new Date(fechaEmision).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }) : null;
      const fechaVencimientoCorrecta = fechaVencimiento ? new Date(fechaVencimiento).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }) : null;
      return (
        <div className="factura" key={id}>
          <div className={facturaSeleccionada === id ? "topFactura selected" : "topFactura"}>
            <h2 onClick={() => seleccionFactura(id)}>#{numeroFactura}</h2>
            {facturaSeleccionada === id ? (
              <div className="data" onClick={() => seleccionFactura(id)}>
                <div className="seccionesDatos">
                  <div className="seccionDatos detallesFactura">
                    <h2 className='tituloSeccionDatos'>Detalles factura</h2>
                    <div className="datos">
                      <h3 className="dato">Tipo de factura: <span>{tipoFactura}</span></h3>
                      <h3 className="dato">Costo total: <span>${costoTotal}</span></h3>
                      <h3 className="dato">Emision: <span>{fechaEmisionCorrecta}</span></h3>
                      <h3 className="dato">Vencimiento: <span>{fechaVencimientoCorrecta}</span></h3>
                      <h3 className="dato">Proveedor: <span>{proveedorEmisor}</span></h3>
                      
                      <h3 className="dato datoAbonado" onClick={(e) => guardarEstadoAbonado(id, estadoAbonado, e)}>Estado: <span className={estadoAbonado === 0 ? "" : "abonado"}>{estadoAbonado === 0 ? "No abonado" : "Abonado"}</span></h3>

                    </div>
                  </div>
                  <div className="seccionDatos impuestosFactura">
                    <h2 className='tituloSeccionDatos'>Impuestos y retenciones</h2>
                    <div className="datos">
                      <h3 className="dato">IVA: <span>${IVAMonto}</span></h3>
                      <h3 className="dato">Percepcion de IVA: <span>${percepcionIVAMonto}</span></h3>
                      <h3 className="dato">Ingresos Brutos: <span>${IIBBMonto}</span></h3>
                      <h3 className="dato">Percepcion de ingresos brutos: <span>${percepcionIBBMonto}</span></h3>
                      { otrosImpuestos ?(
                        otrosImpuestos.split(';').filter(impuesto => impuesto!== '').map((impuesto, index) => {
                          const [nombreImpuesto, montoImpuesto] = impuesto.split(',');
                          return (
                            <h3 key={index} className="dato">
                              {nombreImpuesto}: <span>${montoImpuesto}</span>
                            </h3>
                          );
                        })) : ""
                      }

                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="data" onClick={() => seleccionFactura(id)}>
                <h3 className="dato">Tipo de factura: <span>{tipoFactura}</span></h3>
                <h3 className="dato">Proveedor: <span>{proveedorEmisor}</span></h3>
                <h3 className="dato">Costo total: <span>${costoTotal}</span></h3>
                <h3 className="dato vencimiento">Vencimiento: <span className={diferenciaDias ? (diferenciaDias < 10 && estadoAbonado === 0 ? "cercano" : "") : ("")}>{diferenciaDias ? (diferenciaDias) : ("")} dias</span></h3>
              </div>
            )}
            {facturaSeleccionada === id ? (
              <div className="buttons">
                  <button onClick={() => handleDeleteFactura(id)} ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg></button>
              </div>
            ) : (
              <div onClick={(e) => guardarEstadoAbonado(id, estadoAbonado, e)} className={estadoAbonado === 0 ? "estadoAbonado" : "estadoAbonado abonado"}></div>
            )}
          </div>
          <div className={facturaSeleccionada === id? "facturaItems selected" : "facturaItems"}>
            <h2>Items:</h2>
            {itemsSeleccionados && itemsSeleccionados.length > 0? (
              itemsSeleccionados.map(({ id, id_factura, Codigo, Descripcion, VolumenUnidad, MedicionVolumen, UnidadesBulto, PrecioBulto, precioUnidad, Bultos, Bonificacion, Importe }) => {
                return (
                  <div className="item" key={id}>
                    {Codigo && <h3 className="dato">Codigo: <span>{Codigo}</span></h3>}
                    {Descripcion && <h3 className="dato">Descripcion: <span>{Descripcion}</span></h3>}
                    {VolumenUnidad && MedicionVolumen && <h3 className="dato">Volumen unidad: <span>{VolumenUnidad + " " + MedicionVolumen}</span></h3>}
                    {Bultos && <h3 className="dato">Bultos: <span>{Bultos} </span></h3>}
                    {UnidadesBulto && <h3 className="dato">Unidades bulto: <span>{UnidadesBulto}</span></h3>}
                    {PrecioBulto && <h3 className="dato">Precio bulto: <span>${PrecioBulto} </span></h3>}
                    {(Bonificacion || Bonificacion !== 0) && <h3 className="dato">Bonificacion: <span>{Bonificacion*100}% </span></h3>}
                    {Importe && <h3 className="dato">Importe: <span>${Importe} </span></h3>}
                  </div>
                );
              })
            ) : ("")}
          </div>
        </div>
      );
    })
  ) : (
    <div>No hay facturas disponibles.</div>
  )}
</div>

        </div>
        </div>
        </div>
        );
        }

export default Facturas;
