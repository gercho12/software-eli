import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../App.css';
import Navbar from  '../components/navbar';





const Dashboard = () => {
  return (
    <div className="app">
      <Navbar />

      <div className='dashboard'>

          <div className="tituloprinc">

            <h1>Analisis de transacciones</h1>

            <div className="botones">
              <select className="selector selectorIntervalo">
                  <option>Anual</option>
                  <option selected>Mensual</option>
                  <option>Semanal</option>  
              </select>
              <button className="reiniciar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Reiniciar
              </button>
              <button className="descargar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25" />
                </svg>
                descargar
              </button>
            </div>

          </div>
          <div className="grid">
            <div className="left">
              <div className="targetas">
                
                <div className="egresos targeta">
                  <div className="linkerInner">
                    <div className="linker">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>

                    </div>
                  </div>
                  <h3 className="titulo">Egreso total</h3>
                  <div className="abajo">
                    <h2 className="numero">$12.441</h2>
                    <h3 className="subtitulo">Mes pasado <span className='procentaje'>-%12</span></h3>
                  </div>
                </div>

                <div className="ingresos targeta">
                  <div div className="linkerInner">
                    <div className="linker">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="#ffff" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                    </div>
                  </div>
                  <h3 className="titulo">Ingreso total</h3>
                  <div className="abajo">
                    <h2 className="numero">$19.441</h2>
                    <h3 className="subtitulo">Mes pasado <span className='procentaje'>+%15</span></h3>
                  </div>
                  </div>
                </div>

              <div className="bottom">
                <h3><span className='gananciaTotal'>$205.540</span>  Ganancia</h3>
                <div className="grafico">
                  <UnidadIntervalo porcentajeEgresos="50%" porcentajeIngresos="70%" intervalo="12/4"/>
                  <UnidadIntervalo porcentajeEgresos="50%" porcentajeIngresos="70%" intervalo="12/4"/>
                  <UnidadIntervalo porcentajeEgresos="50%" porcentajeIngresos="70%" intervalo="12/4"/>
                  <UnidadIntervalo porcentajeEgresos="50%" porcentajeIngresos="70%" intervalo="12/4"/>
                  <UnidadIntervalo porcentajeEgresos="50%" porcentajeIngresos="70%" intervalo="12/4"/>
                  <UnidadIntervalo porcentajeEgresos="50%" porcentajeIngresos="70%" intervalo="12/4"/>
                  <UnidadIntervalo porcentajeEgresos="50%" porcentajeIngresos="70%" intervalo="12/4"/>
                  <UnidadIntervalo porcentajeEgresos="50%" porcentajeIngresos="70%" intervalo="12/4"/>
                  <UnidadIntervalo porcentajeEgresos="50%" porcentajeIngresos="70%" intervalo="12/4"/>
                  <UnidadIntervalo porcentajeEgresos="50%" porcentajeIngresos="70%" intervalo="12/4"/>
                  <UnidadIntervalo porcentajeEgresos="50%" porcentajeIngresos="70%" intervalo="12/4"/>
                  <UnidadIntervalo porcentajeEgresos="50%" porcentajeIngresos="70%" intervalo="12/4"/>
                  <UnidadIntervalo porcentajeEgresos="50%" porcentajeIngresos="70%" intervalo="12/4"/>
                  <UnidadIntervalo porcentajeEgresos="50%" porcentajeIngresos="70%" intervalo="12/4"/>
                  <UnidadIntervalo porcentajeEgresos="50%" porcentajeIngresos="70%" intervalo="12/4"/>
                  <UnidadIntervalo porcentajeEgresos="50%" porcentajeIngresos="70%" intervalo="12/4"/>
                </div>
              </div>
            </div>
            <div className="right">
              <h2>asdasd</h2>
              <h2>asdasd</h2>
              <h2>asdasd</h2>
              <h2>asdasd</h2>
              <h2>asdasd</h2>
              <h2>asdasda</h2>
            </div>
          </div>
      </div>
    </div>

  )
}
function UnidadIntervalo({ porcentajeEgresos, porcentajeIngresos, intervalo }){
  return (
    <div className="intervaloUnidad">
    <div className="velas">
      <div className="vela velaEgresos" style={{height:porcentajeEgresos}}></div>
      <div className="vela velaIngresos" style={{height:porcentajeIngresos}}></div>
    </div>
    <h2>{intervalo}</h2>
  </div>
  );
}
export default Dashboard