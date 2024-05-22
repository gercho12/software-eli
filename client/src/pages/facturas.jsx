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

  return (
    <div className="app">
      <Navbar />
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
            <button><p className='texto'>📄 Cargar factura</p> <p className='mas'>+</p></button>
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
