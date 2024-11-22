import React, { useState, useMemo } from 'react'

interface Marca {
  id: number;
  nombre: string;
}

// Componente para el formulario de registro de marca
const FormularioMarca: React.FC<{
  nombreMarca: string;
  setNombreMarca: (nombre: string) => void;
  agregarMarca: (e: React.FormEvent) => void;
  editando: number | null;
}> = ({ nombreMarca, setNombreMarca, agregarMarca, editando }) => (
  <div className="p-6 w-full">
    <h2 className="text-2xl font-bold mb-4 text-[#00632C]">Registrar Marca</h2>
    <form onSubmit={agregarMarca} className="space-y-4">
      <input
        type="text"
        value={nombreMarca}
        onChange={(e) => setNombreMarca(e.target.value)}
        placeholder="Nombre de Marca"
        className="w-full px-3 py-2 border border-[#80C68C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00632C]"
      />
      <button 
        type="submit" 
        className="w-full bg-[#FFD700] hover:bg-[#00632C] text-[#333333] hover:text-white py-2 px-4 rounded-md transition-colors duration-300"
      >
        {editando !== null ? 'Actualizar' : 'Agregar'} Marca
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
      placeholder="Buscar marca"
      className="w-full pl-10 pr-4 py-2 border border-[#80C68C] rounded-full focus:outline-none focus:ring-2 focus:ring-[#00632C]"
    />
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-[#00632C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  </div>
)

// Componente para cada item de marca en la lista
const MarcaItem: React.FC<{
  marca: Marca;
  editarMarca: (id: number) => void;
  eliminarMarca: (id: number) => void;
}> = ({ marca, editarMarca, eliminarMarca }) => (
  <div className="p-4 flex justify-between items-center bg-white rounded-lg shadow">
    <span className="text-[#333333]">{marca.nombre}</span>
    <div className="space-x-2">
      <button 
        onClick={() => editarMarca(marca.id)}
        className="bg-[#00632C] hover:bg-[#004d22] text-white p-2 rounded-md transition-colors duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        <span className="sr-only">Editar marca</span>
      </button>
      <button 
        onClick={() => eliminarMarca(marca.id)}
        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-colors duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span className="sr-only">Eliminar marca</span>
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
export default function RegistroMarcas() {
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [nombreMarca, setNombreMarca] = useState('')
  const [editando, setEditando] = useState<number | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [paginaActual, setPaginaActual] = useState(1)
  const itemsPorPagina = 7

  const agregarMarca = (e: React.FormEvent) => {
    e.preventDefault()
    if (nombreMarca.trim()) {
      if (editando !== null) {
        setMarcas(marcas.map(marca => 
          marca.id === editando ? { ...marca, nombre: nombreMarca } : marca
        ))
        setEditando(null)
      } else {
        setMarcas([...marcas, { id: Date.now(), nombre: nombreMarca }])
      }
      setNombreMarca('')
    }
  }

  const editarMarca = (id: number) => {
    const marca = marcas.find(m => m.id === id)
    if (marca) {
      setNombreMarca(marca.nombre)
      setEditando(id)
    }
  }

  const eliminarMarca = (id: number) => {
    setMarcas(marcas.filter(marca => marca.id !== id))
  }

  const marcasFiltradas = useMemo(() => {
    return marcas.filter(marca => 
      marca.nombre.toLowerCase().includes(busqueda.toLowerCase())
    )
  }, [marcas, busqueda])

  const totalPaginas = Math.ceil(marcasFiltradas.length / itemsPorPagina)

  const marcasPaginadas = useMemo(() => {
    const inicio = (paginaActual - 1) * itemsPorPagina
    const fin = inicio + itemsPorPagina
    return marcasFiltradas.slice(inicio, fin)
  }, [marcasFiltradas, paginaActual])

  const cambiarPagina = (pagina: number) => {
    setPaginaActual(pagina)
  }

  return (
    <div className="flex h-screen bg-[#eeeeee]">
      <div className="w-[30%] bg-white">
        <div className="p-8">
          <FormularioMarca
            nombreMarca={nombreMarca}
            setNombreMarca={setNombreMarca}
            agregarMarca={agregarMarca}
            editando={editando}
          />
        </div>
      </div>
      <div className="w-[70%] p-8">
        <h2 className="text-2xl font-bold mb-4 text-[#00632C]">Lista de Marcas</h2>
        <BarraBusqueda busqueda={busqueda} setBusqueda={setBusqueda} />
        <div className="space-y-4">
          {marcasPaginadas.map(marca => (
            <MarcaItem
              key={marca.id}
              marca={marca}
              editarMarca={editarMarca}
              eliminarMarca={eliminarMarca}
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