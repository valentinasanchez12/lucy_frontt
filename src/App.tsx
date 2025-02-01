import React from 'react'
import Navbar from './Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Inicio from './home/Inicio'
import ResultadosBusqueda from './resultado-busqueda/ResultadosBusqueda.tsx'
import DetalleProducto from './DetalleProducto/Detalle'
import RegistroMarcas from './Formularios/Marcas/Marcas'
import RegistroProveedores from './Formularios/Proveedores/Proveedores'
import RegistroCategorias from './Formularios/Categorias/Categorias'
import RegistroSanitario from './Formularios/RegistrosSanitarios/RegistrosSanitarios'
import FormularioProducto from './Formularios/Productos/FormularioProducto'
import FormularioEditarProducto from "./Formularios/Productos/FormularioEditarProducto.tsx";
import ErrorBoundary from './components/ErrorBoundary';


const App: React.FC = () => {
  

  return (
    <div className="min-h-screen bg-[#eeeeee]">
      <Navbar />
        <ErrorBoundary>
              <Routes>
                <Route path='/' element={<Inicio/>}/>
                <Route path='/resultado' element={<ResultadosBusqueda/>}/>
                <Route path='/detalle/:uuid' element={<DetalleProducto/>}/>
                <Route path='/formularios/marcas' element={<RegistroMarcas/>}/>
                <Route path='/formularios/proveedores' element={<RegistroProveedores/>}/>
                <Route path='/formularios/categorias' element={<RegistroCategorias/>}/>
                <Route path='/formularios/registros-sanitarios' element={<RegistroSanitario/>}/>
                <Route path='/formularios/productos' element={<FormularioProducto/>}/>
                <Route path='/formularios/productos/editar/:uuid' element={<FormularioEditarProducto/>}/>
              </Routes>
        </ErrorBoundary>
    </div>
  )
}

export default App