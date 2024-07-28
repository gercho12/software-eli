import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import Navbar from '../components/navbar';

const Recetas = () => {
    return(
<div className="app">
  <Navbar />
  <div className='recetas'>
    <div className="left">
      <h1>Armado de recetas</h1>
      <div className="listaItems">
        <div className="top">
          <input type="text" />
        </div>
        <div className="listado">
        <div className='item'>
          <h2>Harina 0000</h2>
          <h3>$2300/kg</h3>
        </div>
        </div>
      </div>
    </div>
    <div className="right">
        <div className="top">
            <input type="text" />
            <button></button>
        </div>
        <div className="listadoRecetas">
            <div className='receta'>
                <h2>torta de manzana acaramelada</h2>
                <div className="detalles">
                    <h3>$12300</h3>
                    <h3>1.2kg</h3>
                    <h3>5</h3>
                </div>
            </div>
            <div className='receta seleccionad'>
                <h2>torta de manzana acaramelada</h2>
                <div className="ingredientes">
                    <h2>ingredientes</h2>
                    <h3>Canela molida x 0.05Kg $330</h3>
                    <h3>HARINA 0000 x 0.300gr $711</h3>
                    <h3>MIEL JALEA REAL ARCOR x 0.100gr $1130</h3>
                </div>
                <div className="detalles">
                    <h3>$12300</h3>
                    <h3>1.2kg</h3>
                    <h3>5</h3>
                </div>
                <div className="detalles detallesUnidad">
                    <h3>$12300</h3>
                    <h3>1.2kg</h3>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
    )
};
export default Recetas