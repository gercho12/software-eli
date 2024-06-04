import {BrowserRouter, Routes, Route} from "react-router-dom"
import Dashboard from "./pages/dashboard";
import Proveedores from "./pages/proveedores";
import Facturas from "./pages/facturas";
import Navbar from  './components/navbar';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/navbar" element={<Navbar/>} />
        <Route path="/proveedores" element={<Proveedores/>} />
        <Route path="/facturas" element={<Facturas/>} /> 
      </Routes>
    </BrowserRouter>
  );
} 

export default App;
