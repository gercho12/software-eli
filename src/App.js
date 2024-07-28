import {BrowserRouter, Routes, Route} from "react-router-dom"
import Dashboard from "./pages/dashboard";
import Proveedores from "./pages/proveedores";
import Facturas from "./pages/facturas";
import Recetas from "./pages/recetas";
import Navbar from  './components/navbar';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/navbar" element={<Navbar/>} />
        <Route path="/proveedores" element={<Proveedores/>} />
        <Route path="/registroFacturas" element={<Facturas/>} /> 
        <Route path="/recetas" element={<Recetas/>} /> 
      </Routes>
    </BrowserRouter>
  );
} 

export default App;
