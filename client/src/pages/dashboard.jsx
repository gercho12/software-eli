import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import axios from 'axios';


function Dashboard() {
  const [anos, setAnos] = useState([]);
  const [añoSeleccionado, setAñoSeleccionado] = useState(2024);
  const [intervalos, setIntervalos] = useState([]);
  const [facturasNoa, setFacturasNoa] = useState([]);
  const [seleccionadoIntervalo, setSeleccionadoIntervalo] = useState(null);
  const [maximoEgreso, setMaximoEgreso] = useState(0);
  const [egresoSeleccionado, setEgresoSeleccionado] = useState(0);
  const [IvaSeleccionado, setIvaSeleccionado] = useState(0);
  const [egresoAnterior, setEgresoAnterior] = useState(0);
  const [ivaAnterior, setIvaAnterior] = useState(0);
  const [porcentajeIva, setPorcentajeIva] = useState(0);
  const [porcentajeEgresos, setPorcentajeEgresos] = useState(0);

  // const handleIntervaloClick = (intervalo, egresos, ingresos) => {
  //   setSeleccionadoIntervalo(intervalo);
  //   // Aquí puedes agregar cualquier lógica adicional que necesites al seleccionar un intervalo
  // };
  useEffect(() => {
    const fetchFacturasNoa = async () => {
      try {
        const response = await axios.get('http://localhost:8800/facturasNoAbonadas');
        if (!Array.isArray(response.data) || response.data.length === 0) {
          setFacturasNoa(null);
        } else {
          const facturasConDiferencia = response.data.map(factura => {
            const fechaVencimiento = new Date(factura.fechaVencimiento);
            const fechaActual = new Date();
            const diferenciaMilisegundos = fechaVencimiento - fechaActual;
            const diferenciaDias = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
  
            // Agrega la propiedad "diferenciaDias" al objeto de la factura
            return { ...factura, diferenciaDias };
          });
  
          setFacturasNoa(facturasConDiferencia);
          
          console.log(facturasConDiferencia)

        }
      } catch (error) {
        console.error('Error al obtener los años:', error);
      }
    };
  
    fetchFacturasNoa();
  }, []);

  console.log(facturasNoa);

  useEffect(() => {
    const fetchAños = async () => {
      try {
        const response = await axios.get('http://localhost:8800/anos');
        setAnos(response.data);
      } catch (error) {
        console.error('Error al obtener los años:', error);
      }
    };

    fetchAños();
  }, []);


  useEffect(() => {
    const fetchIntervalos = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/facturas/${añoSeleccionado}`);
        const facturas = response.data;
        if (facturas.length > 0) {
          // setSeleccionadoIntervalo(facturas[facturas.length - 1].mes);
          // setEgresoSeleccionado(facturas[facturas.length - 1].egresos);
          // setIvaSeleccionado(facturas[facturas.length - 1].ivaTotal);
          handleIntervaloClick(facturas[facturas.length - 1].mes, facturas[facturas.length - 1].egresos, facturas[facturas.length - 1].ivaTotal)

        }
        setIntervalos(facturas);
        calcularMaximoEgreso(facturas)
        
      } catch (error) {
        console.error('Error al obtener las facturas:', error);
      }
    };
    fetchIntervalos();
  }, [añoSeleccionado]);



  const obtenerNombreMes = (numeroMes) => {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return meses[numeroMes - 1];
  };

  // Manejar clic en el intervalo
  const handleIntervaloClick = (mes, egresos, ivaTotal) => {
    setSeleccionadoIntervalo(mes);
    setEgresoSeleccionado(egresos);
    setIvaSeleccionado(ivaTotal);
  
    // Find the index of the current interval
    const currentIndex = intervalos.findIndex(interval => interval.mes === mes);
  
    // Get the previous interval's expense and IVA
    if (currentIndex > 0) {
      const previousInterval = intervalos[currentIndex - 1];
      setEgresoAnterior(previousInterval.egresos);
      setIvaAnterior(previousInterval.ivaTotal);
      console.log(egresos, ivaTotal)
      setPorcentajeEgresos(calcularPorcentaje(egresos, previousInterval.egresos))
      setPorcentajeIva(calcularPorcentaje(ivaTotal, previousInterval.ivaTotal))
    }else{
      console.log(currentIndex)
    }
 
    console.log(egresoSeleccionado, egresoAnterior)
  };
  // Calcular la ganancia total
  const calcularGananciaTotal = () => {
    return egresoSeleccionado +IvaSeleccionado;
  };

    // Calcular la máxima ganancia
    const calcularMaximoEgreso = (datos) => {
      let maxima = 0;
      datos.forEach(intervalo => {
        const egresos = intervalo.egresos;
        if (egresos > maxima) {
          maxima = egresos;
        }
      });
      setMaximoEgreso(maxima);
    };
    const guardarEstadoAbonado = async (id, estadoAbonadoAntiguo, event) => {
      event.stopPropagation();
      console.log(estadoAbonadoAntiguo);
      const estadoAbonado = estadoAbonadoAntiguo === 0 ? 1 : 0;
      console.log(estadoAbonado);
      try {
        await axios.put(`http://localhost:8800/actualizarFactura/${id}/${estadoAbonado}`);
        try {
          const response = await axios.get('http://localhost:8800/facturasNoAbonadas');
          if (!Array.isArray(response.data) || response.data.length === 0) {
            setFacturasNoa(null);
          } else {
            const facturasConDiferencia = response.data.map(factura => {
              const fechaVencimiento = new Date(factura.fechaVencimiento);
              const fechaActual = new Date();
              const diferenciaMilisegundos = fechaVencimiento - fechaActual;
              const diferenciaDias = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
    
              // Agrega la propiedad "diferenciaDias" al objeto de la factura
              return { ...factura, diferenciaDias };
            });
    
            setFacturasNoa(facturasConDiferencia);
            
            console.log(facturasConDiferencia)
  
          }
        } catch (error) {
          console.error('Error al obtener los años:', error);
        }
      } catch (error) {
        console.log(error.response.data);
      }
    }
  return (
    <div className="app">
      <Navbar />

      <div className='dashboard'>
        <div className="tituloprinc">
          <h1>Analisis de transacciones</h1>
          <div className="botones">
          <select
            className="selector selectorIntervalo"
            value={añoSeleccionado}
            onChange={(e) => setAñoSeleccionado(parseInt(e.target.value))}
            >
        {anos.map(ano => (
          <option key={ano} value={ano}>{ano}</option>
        ))}
          </select>

            <button className="reiniciar">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Refrescar
            </button>
            <button className="descargar">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25" />
              </svg>
              Descargar
            </button>
          </div>
        </div>
        <div className="grid">
          <div className="left">
            <div className="targetas">
              <div className="egresos targeta">
                <div className="linkerInner">
                  <a className="linker" href='/facturas'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </a>
                </div>
                <h3 className="titulo">Egreso total</h3>
                <div className="abajo">
                  <h2 className="numero">${egresoSeleccionado}</h2>
                  <h3 className="subtitulo">Mes pasado <span className='procentaje' id='porcentajeEgreso'>{porcentajeEgresos}%</span></h3>
                </div>
              </div>
              <div className="ingresos targeta">
                <div className="linkerInner">
                  <div className="linker">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="#ffff" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </div>
                </div>
                <h3 className="titulo">IVA cobrado</h3>
                <div className="abajo">
                  <h2 className="numero">${IvaSeleccionado}</h2>
                  <h3 className="subtitulo">Mes pasado <span className='procentaje' id='porcentajeIva'>{porcentajeIva}%</span></h3>
                </div>
              </div>
            </div>
            <div className="bottom">
              <h3>
                {/* <span className='gananciaTotal'>${calcularGananciaTotal()}</span> Ganancia */}
              </h3>
              <div className="grafico">
                {intervalos.map(({ mes, egresos, ivaTotal }) => {
                  const seleccionado = seleccionadoIntervalo === mes;
                  const porcentajeEgreso = (egresos / maximoEgreso) * 100;
                  console.log(porcentajeEgreso);

                  return (
                    <UnidadIntervalo
                      key={mes}
                      intervalo={obtenerNombreMes(mes)}
                      porcentajeEgresos={porcentajeEgreso}
                      seleccionado={seleccionado}
                      handleIntervaloClick={() => handleIntervaloClick(mes, egresos, ivaTotal)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div className="right">
            {/* {console.log(facturasNoa.length)} */}
                <h2 className='tituloRight'>Facturas no abonadas <span className="cantFacturasNoa">{!facturasNoa ? "0" : facturasNoa.length}</span></h2>
                <div className="facturasNoa">
                  {facturasNoa ?
                   (facturasNoa.map(({id, numeroFactura, costoTotal, diferenciaDias}) => {
                    return(
                      <div className="facturaNoa">
                      <div className="abonado boton" onClick={(e)=> guardarEstadoAbonado(id, 0, e)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      </div>
                      <h3 className='ellipsis'>#{numeroFactura}</h3>
                      <h2 >{costoTotal} </h2>
                      <h2>{diferenciaDias >= 2 ? (diferenciaDias+" dias") : diferenciaDias === 1 ? (diferenciaDias+" dia") : ("vencido")} </h2>
                      <div className="masInfo boton">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>
                      </div>
                    </div>
                    );
                  }))
                  : ("todas las facturas fueron abonadas")
                  }
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function UnidadIntervalo({ porcentajeEgresos, intervalo, seleccionado, handleIntervaloClick }) {
  const estado = seleccionado ? "seleccionado" : "";

  return (
    <div className="intervaloUnidad" onClick={handleIntervaloClick}>
      <div className="velas">
        <div className={'velaGanancia ' + estado} style={{ height: porcentajeEgresos+"%"}}>
        </div>
      </div>
      <h2>{intervalo}</h2>
    </div>
  );
}

function calcularPorcentaje(valorActual, valorAnterior) {
  if (valorAnterior === 0) return 0;
  const porcentaje = Math.round(((valorActual - valorAnterior) / valorAnterior) * 100);
  return porcentaje > 0 ? `+${porcentaje}` : porcentaje;
}




export default Dashboard;
