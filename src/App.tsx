import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Inicio from './components/home/Inicio'
import ResultadosBusqueda from './components/resultado-busqueda/Resultados-Busqueda'
import DetalleProducto from './components/DetalleProducto/Detalle'
import RegistroMarcas from './components/Formularios/Marcas/Marcas'
import RegistroProveedores from './components/Formularios/Proveedores/Proveedores'
import RegistroCategorias from './components/Formularios/Categorias/Categorias'
import RegistroSanitario from './components/Formularios/RegistrosSanitarios/RegistrosSanitarios'
import FormularioProducto from './components/Formularios/Productos/FormularioProducto'


const App: React.FC = () => {
  

  return (
    <div className="min-h-screen bg-[#eeeeee]">
      <Navbar />
      <Routes>
        <Route path='/' element={<Inicio/>}/>
        <Route path='/resultado' element={<ResultadosBusqueda/>}/>
        <Route path='/detalle' element={<DetalleProducto/>}/>
        <Route path='/formularios/marcas' element={<RegistroMarcas/>}/>
        <Route path='/formularios/proveedores' element={<RegistroProveedores/>}/>
        <Route path='/formularios/categorias' element={<RegistroCategorias/>}/>
        <Route path='/formularios/registros-sanitarios' element={<RegistroSanitario/>}/>
        <Route path='/formularios/productos' element={<FormularioProducto/>}/>
      </Routes>
    </div>
  )
}

export default App