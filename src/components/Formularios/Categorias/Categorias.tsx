'use client'

import React, { useState, useMemo } from 'react'

interface Categoria {
  id: number;
  nombre: string;
}

// Componente para el formulario de registro de categoría
const FormularioCategoria: React.FC<{
  nombreCategoria: string;
  setNombreCategoria: (nombre: string) => void;
  agregarCategoria: (e: React.FormEvent) => void;
  editando: number | null;
}> = ({ nombreCategoria, setNombreCategoria, agregarCategoria, editando }) => (
  <div className="p-6 w-full">
    <h2 className="text-2xl font-bold mb-4 text-[#00632C]">Registrar Categoría</h2>
    <form onSubmit={agregarCategoria} className="space-y-4">
      <input
        type="text"
        value={nombreCategoria}
        onChange={(e) => setNombreCategoria(e.target.value)}
        placeholder="Nombre de Categoría"
        className="w-full px-3 py-2 border border-[#80C68C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00632C]"
      />
      <button 
        type="submit" 
        className="w-full bg-[#FFD700] hover:bg-[#00632C] text-[#333333] hover:text-white py-2 px-4 rounded-md transition-colors duration-300"
      >
        {editando !== null ? 'Actualizar' : 'Agregar'} Categoría
      </button>
    </form>
  </div>
)

// Componente para la barra de búsqueda
const BarraBusqueda: React.FC<{
  busqueda: string;
  setBusqueda: (busqueda: string) => void;
}> = ({ busqueda, setBusqueda }) => (
  <div className="mb-4 relative">
    <input
      type="text"
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
      placeholder="Buscar categoría"
      className="w-full pl-10 pr-4 py-2 border border-[#80C68C] rounded-full focus:outline-none focus:ring-2 focus:ring-[#00632C]"
    />
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-[#00632C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  </div>
)

// Componente para cada item de categoría en la lista
const CategoriaItem: React.FC<{
  categoria: Categoria;
  editarCategoria: (id: number) => void;
  eliminarCategoria: (id: number) => void;
}> = ({ categoria, editarCategoria, eliminarCategoria }) => (
  <div className="p-4 flex justify-between items-center bg-white rounded-lg shadow">
    <span className="text-[#333333]">{categoria.nombre}</span>
    <div className="space-x-2">
      <button 
        onClick={() => editarCategoria(categoria.id)}
        className="bg-[#00632C] hover:bg-[#004d22] text-white p-2 rounded-md transition-colors duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        <span className="sr-only">Editar categoría</span>
      </button>
      <button 
        onClick={() => eliminarCategoria(categoria.id)}
        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-colors duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span className="sr-only">Eliminar categoría</span>
      </button>
    </div>
  </div>
)

// Componente para la paginación
const Paginacion: React.FC<{
  paginaActual: number;
  totalPaginas: number;
  cambiarPagina: (pagina: number) => void;
}> = ({ paginaActual, totalPaginas, cambiarPagina }) => (
  <div className="mt-4 flex justify-center items-center space-x-2">
    <button
      onClick={() => cambiarPagina(paginaActual - 1)}
      disabled={paginaActual === 1}
      className="bg-white hover:bg-[#80C68C] text-[#00632C] hover:text-[#00632C] border border-[#00632C] p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Página anterior"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    {[...Array(Math.min(4, totalPaginas))].map((_, index) => (
      <button
        key={index}
        onClick={() => cambiarPagina(index + 1)}
        className={`${
          paginaActual === index + 1
            ? 'bg-[#00632C] text-white'
            : 'bg-white text-[#00632C] hover:bg-[#80C68C] hover:text-[#00632C]'
        } border border-[#00632C] px-3 py-1 rounded-md`}
      >
        {index + 1}
      </button>
    ))}
    <button
      onClick={() => cambiarPagina(paginaActual + 1)}
      disabled={paginaActual === totalPaginas}
      className="bg-white hover:bg-[#80C68C] text-[#00632C] hover:text-[#00632C] border border-[#00632C] p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Página siguiente"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
)

// Componente principal
export default function RegistroCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [nombreCategoria, setNombreCategoria] = useState('')
  const [editando, setEditando] = useState<number | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [paginaActual, setPaginaActual] = useState(1)
  const itemsPorPagina = 7

  const agregarCategoria = (e: React.FormEvent) => {
    e.preventDefault()
    if (nombreCategoria.trim()) {
      if (editando !== null) {
        setCategorias(categorias.map(categoria => 
          categoria.id === editando ? { ...categoria, nombre: nombreCategoria } : categoria
        ))
        setEditando(null)
      } else {
        setCategorias([...categorias, { id: Date.now(), nombre: nombreCategoria }])
      }
      setNombreCategoria('')
    }
  }

  const editarCategoria = (id: number) => {
    const categoria = categorias.find(c => c.id === id)
    if (categoria) {
      setNombreCategoria(categoria.nombre)
      setEditando(id)
    }
  }

  const eliminarCategoria = (id: number) => {
    setCategorias(categorias.filter(categoria => categoria.id !== id))
  }

  const categoriasFiltradas = useMemo(() => {
    return categorias.filter(categoria => 
      categoria.nombre.toLowerCase().includes(busqueda.toLowerCase())
    )
  }, [categorias, busqueda])

  const totalPaginas = Math.ceil(categoriasFiltradas.length / itemsPorPagina)

  const categoriasPaginadas = useMemo(() => {
    const inicio = (paginaActual - 1) * itemsPorPagina
    const fin = inicio + itemsPorPagina
    return categoriasFiltradas.slice(inicio, fin)
  }, [categoriasFiltradas, paginaActual])

  const cambiarPagina = (pagina: number) => {
    setPaginaActual(pagina)
  }

  return (
    <div className="flex h-screen bg-[#eeeeee]">
      <div className="w-[30%] bg-white">
        <div className="p-8">
          <FormularioCategoria
            nombreCategoria={nombreCategoria}
            setNombreCategoria={setNombreCategoria}
            agregarCategoria={agregarCategoria}
            editando={editando}
          />
        </div>
      </div>
      <div className="w-[70%] p-8">
        <h2 className="text-2xl font-bold mb-4 text-[#00632C]">Lista de Categorías</h2>
        <BarraBusqueda busqueda={busqueda} setBusqueda={setBusqueda} />
        <div className="space-y-4">
          {categoriasPaginadas.map(categoria => (
            <CategoriaItem
              key={categoria.id}
              categoria={categoria}
              editarCategoria={editarCategoria}
              eliminarCategoria={eliminarCategoria}
            />
          ))}
        </div>
        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          cambiarPagina={cambiarPagina}
        />
      </div>
    </div>
  )
}