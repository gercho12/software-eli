import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../App.css';
import Navbar from  '../components/navbar';

const Dashboard = () => {
  return (
    <div className="app">
      <Navbar />

      <div className='dashboard'>

          <div className="top">

            <h1>Analisis de transacciones</h1>

            <div className="botones">
              <select className="selector selectorIntervalo">
                  <option>Anual</option>
                  <option selected>Mensual</option>
                  <option>Semanal</option>  
              </select>
              <button className="reiniciar">
                {/* svg */}
               Reiniciar
              </button>
              <button className="descargar">
                {/* svg */}
                descargar
              </button>
            </div>

          </div>
          <div className="grid">
            <div className="left">
              <div className="top">
                
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

              <div className="bottom"></div>
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

export default Dashboard