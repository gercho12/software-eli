import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import axios from 'axios';


function Dashboard() {
  const [intervaloSelector, setIntervaloSelector] = useState('mensual');
  const [intervalos, setIntervalos] = useState([]);
  const [facturasNoa, setFacturasNoa] = useState([]);
  const [seleccionadoIntervalo, setSeleccionadoIntervalo] = useState(null);
  const [maximaGanancia, setMaximaGanancia] = useState(0);
  const [egresoSeleccionado, setEgresoSeleccionado] = useState(0);
  const [ingresoSeleccionado, setIngresoSeleccionado] = useState(0);
  const [egresoAnterior, setEgresoAnterior] = useState(0);
  const [ingresoAnterior, setIngresoAnterior] = useState(0);

  // const handleIntervaloClick = (intervalo, egresos, ingresos) => {
  //   setSeleccionadoIntervalo(intervalo);
  //   // Aquí puedes agregar cualquier lógica adicional que necesites al seleccionar un intervalo
  // };


  const fetchData = async () => {
    try {
      const response = await axios.get(`http://ec2-3-144-126-122.us-east-2.compute.amazonaws.com:8800/intervalos?intervalo=${intervaloSelector}`);
      setIntervalos(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };
  useEffect(() => {

    fetchData();
    
    const facturasNoa = [
      { id: 344, costo: 99399999, dias: 0},
      { id: 344, costo: 9999999, dias: 14},
      { id: 344, costo: 9999999, dias: 14},
      { id: 344, costo: 9999999, dias: 14},
    ];
    setFacturasNoa(facturasNoa);
    calcularMaximaGanancia(intervalos);
    const ultimoIntervalo = intervalos[(intervalos.length - 1)];
    console.log(ultimoIntervalo)
    setSeleccionadoIntervalo(ultimoIntervalo.intervalo);
    setEgresoSeleccionado(ultimoIntervalo.egresos);
    setIngresoSeleccionado(ultimoIntervalo.ingresos);
    // Establecer el intervalo anterior
    const intervaloAnterior = intervalos[(intervalos.length - 2)];
    if (intervaloAnterior) {
      setEgresoAnterior(intervaloAnterior.egresos);
      setIngresoAnterior(intervaloAnterior.ingresos);
    }

  }, [intervaloSelector]);





  // Calcular la máxima ganancia
  const calcularMaximaGanancia = (datos) => {
    let maxima = 0;
    datos.forEach(intervalo => {
      const ganancia = intervalo.egresos + intervalo.ingresos;
      if (ganancia > maxima) {
        maxima = ganancia;
      }
    });
    setMaximaGanancia(maxima);
  };

  // Manejar clic en el intervalo
  const handleIntervaloClick = (intervalo, egresos, ingresos) => {
    setSeleccionadoIntervalo(intervalo);
    setEgresoSeleccionado(egresos);
    setIngresoSeleccionado(ingresos);
    // Establecer el intervalo anterior
    const indexIntervalo = intervalos.findIndex(item => item.intervalo === intervalo);
    if (indexIntervalo > 0) {
      const intervaloAnterior = intervalos[indexIntervalo - 1];
      setEgresoAnterior(intervaloAnterior.egresos);
      setIngresoAnterior(intervaloAnterior.ingresos);
    } else {
      // Si no hay intervalo anterior, establecerlos en 0
      setEgresoAnterior(0);
      setIngresoAnterior(0);
    }
  };

  // Calcular la ganancia total
  const calcularGananciaTotal = () => {
    return egresoSeleccionado + ingresoSeleccionado;
  };

  return (
    <div className="app">
      <Navbar />

      <div className='dashboard'>
        <div className="tituloprinc">
          <h1>Analisis de transacciones</h1>
          <div className="botones">
          <select
            className="selector selectorIntervalo"
            value={intervaloSelector}
            onChange={(e) => setIntervaloSelector(e.target.value)}
            >
            <option value="anual">Anual</option>
            <option value="mensual">Mensual</option>
            <option value="semanal">Semanal</option>
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
                  <div className="linker">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </div>
                </div>
                <h3 className="titulo">Egreso total</h3>
                <div className="abajo">
                  <h2 className="numero">${egresoSeleccionado}</h2>
                  <h3 className="subtitulo">Mes pasado <span className='procentaje'>{calcularPorcentaje(egresoSeleccionado, egresoAnterior)}%</span></h3>
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
                <h3 className="titulo">Ingreso total</h3>
                <div className="abajo">
                  <h2 className="numero">${ingresoSeleccionado}</h2>
                  <h3 className="subtitulo">Mes pasado <span className='procentaje'>{calcularPorcentaje(ingresoSeleccionado, ingresoAnterior)}%</span></h3>
                </div>
              </div>
            </div>
            <div className="bottom">
              <h3>
                <span className='gananciaTotal'>${calcularGananciaTotal()}</span> Ganancia
              </h3>
              <div className="grafico">
                {intervalos.map(({ intervalo, egresos, ingresos }) => {
                  const seleccionado = seleccionadoIntervalo === intervalo;
                  const ganancia = egresos + ingresos;
                  const porcentajeEgresos = (egresos / ganancia) * 100;
                  const porcentajeIngresos = (ingresos / ganancia) * 100;
                  const porcentajeGanancia = (ganancia / maximaGanancia) * 100;
                  return (
                    <UnidadIntervalo
                      key={intervalo}
                      intervalo={intervalo}
                      porcentajeEgresos={`${porcentajeEgresos}%`}
                      porcentajeIngresos={`${porcentajeIngresos}%`}
                      porcentajeGanancia={`${porcentajeGanancia}%`}
                      seleccionado={seleccionado}
                      handleIntervaloClick={() => handleIntervaloClick(intervalo, egresos, ingresos)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div className="right">
                <h2 className='tituloRight'>Facturas no abonadas <span className="cantFacturasNoa">6</span></h2>
                <div className="facturasNoa">
                  {facturasNoa.map(({id, costo, dias}) => {
                    return(
                      <div className="facturaNoa">
                      <div className="abonado boton">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      </div>
                      <h3>#{id}</h3>
                      <h2>{costo} </h2>
                      <h2>{dias >= 2 ? (dias+" dias") : dias === 1 ? (dias+" dia") : ("vencido")} </h2>
                      <div className="masInfo boton">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>
                      </div>
                    </div>
                    );
                  })}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function UnidadIntervalo({ porcentajeEgresos, porcentajeIngresos, porcentajeGanancia, intervalo, seleccionado, handleIntervaloClick }) {
  const estado = seleccionado ? "seleccionado" : "";

  return (
    <div className="intervaloUnidad" onClick={handleIntervaloClick}>
      <div className="velas">
        <div className={'velaGanancia ' + estado} style={{ height: porcentajeGanancia }}>
          <div className="vela velaEgresos" style={{ height: porcentajeEgresos }}></div>
          <div className="vela velaIngresos" style={{ height: porcentajeIngresos }}></div>
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
