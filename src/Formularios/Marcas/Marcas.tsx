import React, { useState, useEffect } from 'react'
import {API_BASE_URL} from "../../utils/ApiUrl.tsx";
import BarraBusqueda from "../../components/Busqueda/BarraBusqueda.tsx";
import Paginacion from "../../components/Paginacion/Paginacion.tsx";
import InputField from "../../components/ui/InputFile.tsx";
import Toast from "../../components/ui/Toast.tsx";

interface Marca {
  uuid: string;
  nombre: string;
}

const capitalizeText = (text: string): string => {
  return text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

// Componente para el formulario de registro de marca
const FormularioMarca: React.FC<{
  nombreMarca: string;
  setNombreMarca: (nombre: string) => void;
  agregarMarca: (e: React.FormEvent) => void;
  editando: string | null;
}> = ({ nombreMarca, setNombreMarca, agregarMarca, editando }) => (
  <div className="p-6 w-full">
    <h2 className="text-2xl font-bold mb-4 text-[#00632C]">
      {editando ? 'Editar Marca' : 'Registrar Marca'}
    </h2>
    <form onSubmit={agregarMarca} className="space-y-4">
      <InputField
          label="Nombre de la Marca"
          name="nombreMarca"
          type="text"
          value={nombreMarca}
          onChange={(e) => setNombreMarca(e.target.value)}
          placeholder="Ingresa el Nombre de la marca"
          required
      />
      <button 
        type="submit" 
        className="w-full bg-[#FFD700] hover:bg-[#00632C] text-[#333333] hover:text-white py-2 px-4 rounded-md transition-colors duration-300"
      >
        {editando ? 'Actualizar' : 'Agregar'} Marca
      </button>
    </form>
  </div>
)

// Componente para cada item de marca en la lista
const MarcaItem: React.FC<{
  marca: Marca;
  editarMarca: (uuid: string) => void;
  eliminarMarca: (uuid: string) => void;
}> = ({ marca, editarMarca, eliminarMarca }) => (
  <div className="p-4 flex justify-between items-center bg-white rounded-lg shadow">
    <span className="text-[#333333]">{capitalizeText(marca.nombre)}</span>
    <div className="space-x-2">
      <button 
        onClick={() => editarMarca(marca.uuid)}
        className="bg-[#00632C] hover:bg-[#004d22] text-white p-2 rounded-md transition-colors duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        <span className="sr-only">Editar marca</span>
      </button>
      <button 
        onClick={() => eliminarMarca(marca.uuid)}
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

// Componente principal
export default function RegistroMarcas() {
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [nombreMarca, setNombreMarca] = useState('')
  const [editando, setEditando] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [toastMessage, setToastMessage] = useState<{ message: string; color?: string } | null>(null)
  const [paginaActual, setPaginaActual] = useState(1)
  const itemsPorPagina = 8

  const handleBusqueda = (nuevaBusqueda: string) => {
    setBusqueda(nuevaBusqueda)
    setPaginaActual(1)
  }

  useEffect(() => {
    fetchMarcas()
  }, [])

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  const fetchMarcas = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/brand/`)
      if (!response.ok) {
        throw new Error('Failed to fetch brands')
      }
      const data = await response.json()
      setMarcas(data.data.map((marca: any) => ({
        uuid: marca.uuid,
        nombre: marca.name || ''
      })))
    } catch (error) {
      setToastMessage({ message: 'Error fetching brands'})
      console.error('Error fetching brands:', error)
    }
  }

  const agregarMarca = async (e: React.FormEvent) => {
    e.preventDefault()
    if (nombreMarca.trim()) {
      const nombreMinusculas = nombreMarca.toLowerCase();
      try {
        if (editando) {
          // Update existing brand
          const response = await fetch(`${API_BASE_URL}/api/brand/${editando}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: nombreMinusculas }),
          })
          if (!response.ok) {
            throw new Error('Failed to update brand')
          }
          const updatedBrand = await response.json()
          setMarcas(marcas.map(marca => 
            marca.uuid === editando ? { ...marca, nombre: updatedBrand.data.name } : marca
          ))
          setToastMessage({ message: 'Marca actualizada correctamente', color: 'bg-green-500' })
          setEditando(null)
        } else {
          // Create new brand
          const response = await fetch(`${API_BASE_URL}/api/brand/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: nombreMinusculas }),
          })
          if (!response.ok) {
            throw new Error('Failed to create brand')
          }
          const newBrand = await response.json()
          setMarcas([...marcas, { uuid: newBrand.data.uuid, nombre: newBrand.data.name || '' }])
        }
        setNombreMarca('')
        setToastMessage({ message: 'Marca agregada correctamente', color: 'bg-green-500' })
      } catch (error) {
        setToastMessage({ message: editando ? 'Error al actualizar la marca': 'Error al crear la marca' })
        console.error('Error adding/updating brand:', error)
      }
    }
  }

  const editarMarca = (uuid: string) => {
    const marca = marcas.find(m => m.uuid === uuid)
    if (marca) {
      setNombreMarca(capitalizeText(marca.nombre))
      setEditando(uuid)
    }
  }

  const eliminarMarca = async (uuid: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta marca?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/brand/${uuid}`, {
          method: 'DELETE',
        })
        if (!response.ok) {
          throw new Error('Failed to delete brand')
        }
        setMarcas(marcas.filter(marca => marca.uuid !== uuid))
      } catch (error) {
        setToastMessage({ message: 'Error al eliminar la marca' })
        console.error('Error deleting brand:', error)
      }
    }
  }

  const marcasFiltradas = marcas.filter(marca => 
    marca.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  const totalPaginas = Math.ceil(marcasFiltradas.length / itemsPorPagina)
  const indiceInicial = (paginaActual - 1) * itemsPorPagina
  const indiceFinal = indiceInicial + itemsPorPagina
  const marcasPaginadas = marcasFiltradas.slice(indiceInicial, indiceFinal)

  const cambiarPagina = (pagina: number) => {
    setPaginaActual(pagina)
  }

  useEffect(() => {
    setPaginaActual(1)
  }, [busqueda])

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#eeeeee]">
      {toastMessage && <Toast message={toastMessage.message} color={toastMessage.color} />}
      <div className="w-full lg:w-2/5 p-6 bg-white order-1 lg:order-none overflow-auto lg:overflow-visible">
        <div className="p-8">
          <FormularioMarca
            nombreMarca={nombreMarca}
            setNombreMarca={setNombreMarca}
            agregarMarca={agregarMarca}
            editando={editando}
          />
        </div>
      </div>
      <div className="w-full lg:w-3/5 p-6 overflow-auto max-h-[calc(100vh-24rem)] lg:max-h-screen order-2 lg:order-none">
        <h2 className="text-2xl font-bold mb-4 text-[#00632C]">Lista de Marcas</h2>
        <BarraBusqueda placeholder="Buscar Marcas" busqueda={busqueda} setBusqueda={handleBusqueda} />
        <div className="space-y-4">
          {marcasPaginadas.map(marca => (
            <MarcaItem
              key={marca.uuid}
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

