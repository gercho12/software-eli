import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import Navbar from '../components/navbar';

const Facturas = () => {
  const [facturaSeleccionada, setFacturaSeleccionada] = useState("")
  const [facturas, setFacturas] = useState([])

    useEffect(() => {
      const fetchData = async () => {
        try {
          const result = await axios.get('http://localhost:8800/facturas');
          setFacturas(result.data);
          console.log(result.data)
        } catch (error) {
          console.log(error)
          
        }
  
      };
  
      fetchData();
    }, []);
  return (
    <div className="app">
    <Navbar />
    <div className='facturas'>
      <h1>Registro de facturas</h1>
      <div className="bottom">
        <div className="top">
          <input type="text" name="" id="" />
        <select
            className="selector selectorOrden"
            // value={intervaloSelector}
            // onChange={(e) => setIntervaloSelector(e.target.value)}
            >
            <option value="masReciente">Mas reciente</option>
            <option value="cercanoVencimiento">Cercano a vencer</option>
            <option value="mayorImporte">Mayor importe</option>
        </select>
        <button>📄 Cargar factura</button>
        </div>

        <div className="listaFacturas">
        {facturas.map(({ id, tipoFactura, fechaEmision, fechaVencimiento, proveedorEmisor, diasRestantes, costoTotal, iva, estadoAbonado }) => {
          const fechaEmisionCorrecta = fechaEmision.slice(0, 10);
          const fechaVencimientoCorrecta = fechaVencimiento.slice(0, 10);

          return(
          <div className="factura" >
          <div className={facturaSeleccionada == id ? "topFactura selected" : "topFactura"} >
            <h2 onClick={()=> facturaSeleccionada == id ? setFacturaSeleccionada("") : setFacturaSeleccionada(id)}>Factura {proveedorEmisor}</h2>
            {facturaSeleccionada == id ? (

            <div className="data" onClick={()=> facturaSeleccionada == id ? setFacturaSeleccionada("") : setFacturaSeleccionada(id)}>
              <h3 className="dato">Tipo de factura: <span>{tipoFactura}</span></h3>
              <h3 className="dato">Proveedor: <span>{proveedorEmisor}</span></h3>
              <h3 className="dato">Costo total: <span>${costoTotal}</span></h3>
              <h3 className="dato">IVA: <span>${iva}</span></h3>
              <h3 className="dato">Emision: <span>{fechaEmisionCorrecta}</span></h3>
              <h3 className="dato">Vencimiento: <span>{fechaVencimientoCorrecta}</span></h3>
              <h3 className="dato datoAbonado">Estado: <span className={estadoAbonado == 0 ? "" : "abonado"}>{estadoAbonado == 0 ? "No abonado" : "Abonado"}</span></h3>
            </div>
            ) : (
              
            <div className="data" onClick={()=> facturaSeleccionada == id ? setFacturaSeleccionada("") : setFacturaSeleccionada(id)}>
              <h3 className="dato">Tipo de factura: <span>{tipoFactura}</span></h3>
              <h3 className="dato">Proveedor: <span>{proveedorEmisor}</span></h3>
              <h3 className="dato">Costo total: <span>${costoTotal}</span></h3>
              <h3 className="dato">IVA: <span>${iva}</span></h3>
              <h3 className="dato vencimiento">Vencimiento: <span className={diasRestantes < 10 && estadoAbonado == 0 ? "cercano" : ""}>{diasRestantes} dias</span></h3>
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
                <div className={estadoAbonado == 0 ? "estadoAbonado" : "estadoAbonado abonado"}></div>
              )}
          </div>
          <div className="facturaData">
            <div className="dataVisible">

            </div>
          </div>
        </div>
        )}
      )}

        </div>
      </div>


    </div>
    </div>
  )
}

export default Facturas