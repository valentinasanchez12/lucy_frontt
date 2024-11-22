import React, { useState } from 'react'
import ChevronDown from './ChevronDown'

const DropdownMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative group">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="hover:bg-[#00632C] px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
      >
        Formularios
        <ChevronDown />
      </button>
      {isOpen && (
        <div className="absolute z-10 left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <a href="/formularios/marcas" className="block px-4 py-2 text-sm text-[#333333] hover:bg-[#80C68C]">Marcas</a>
            <a href="/formularios/proveedores" className="block px-4 py-2 text-sm text-[#333333] hover:bg-[#80C68C]">Proveedores</a>
            <a href="/formularios/categorias" className="block px-4 py-2 text-sm text-[#333333] hover:bg-[#80C68C]">Categorías</a>
            <a href="/formularios/registros-sanitarios" className="block px-4 py-2 text-sm text-[#333333] hover:bg-[#80C68C]">Registro Sanitario</a>
            <a href="/formularios/productos" className="block px-4 py-2 text-sm text-[#333333] hover:bg-[#80C68C]">Productos</a>
          </div>
        </div>
      )}
    </div>
  )
}

export default DropdownMenu