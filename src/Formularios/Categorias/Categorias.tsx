'use client'

import React, { useState, useMemo, useEffect, useCallback } from 'react'
import {API_BASE_URL} from "../../utils/ApiUrl.tsx";
import BarraBusqueda from "../../components/Busqueda/BarraBusqueda.tsx";
import Paginacion from "../../components/Paginacion/Paginacion.tsx";
import InputField from "../../components/ui/InputFile.tsx";

interface Categoria {
  uuid: string;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

const capitalizeText = (text: string): string => {
  return text.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

const FormularioCategoria: React.FC<{
  nombreCategoria: string;
  setNombreCategoria: (nombre: string) => void;
  agregarCategoria: (e: React.FormEvent) => void;
  editando: string | null;
  isLoading: boolean;
}> = ({ nombreCategoria, setNombreCategoria, agregarCategoria, editando, isLoading }) => (
  <div className="p-6 w-full">
    <h2 className="text-2xl font-bold mb-4 text-[#00632C]">
      {editando ? 'Editar' : 'Registrar'} Categoría
    </h2>
    <form onSubmit={agregarCategoria} className="space-y-4">
      <InputField
          label="Nombre de Categoría"
          name="nombreCategoria"
          type="text"
          value={nombreCategoria}
          onChange={(e) => setNombreCategoria(e.target.value)}
          placeholder="Nombre de Categoría"
          required
      />
      <button 
        type="submit" 
        className="w-full bg-[#FFD700] hover:bg-[#00632C] text-[#333333] hover:text-white py-2 px-4 rounded-md transition-colors duration-300 disabled:opacity-50"
        disabled={isLoading}
      >
        {editando ? 'Actualizar' : 'Agregar'} Categoría
      </button>
    </form>
  </div>
)

const CategoriaItem: React.FC<{
  categoria: Categoria;
  editarCategoria: (uuid: string) => void;
  eliminarCategoria: (uuid: string) => void;
}> = ({ categoria, editarCategoria, eliminarCategoria }) => (
  <div className="p-4 flex justify-between items-center bg-white rounded-lg shadow">
    <span className="text-[#333333]">{capitalizeText(categoria.name)}</span>
    <div className="space-x-2">
      <button 
        onClick={() => editarCategoria(categoria.uuid)}
        className="bg-[#00632C] hover:bg-[#004d22] text-white p-2 rounded-md transition-colors duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        <span className="sr-only">Editar categoría</span>
      </button>
      <button 
        onClick={() => eliminarCategoria(categoria.uuid)}
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

export default function RegistroCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [nombreCategoria, setNombreCategoria] = useState('')
  const [editando, setEditando] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [paginaActual, setPaginaActual] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const itemsPorPagina = 7

  const fetchCategorias = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/category/`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const responseData = await response.json()
      if (!responseData.success || !Array.isArray(responseData.data)) {
        throw new Error('La respuesta del servidor no tiene el formato esperado')
      }
      setCategorias(responseData.data)
    } catch (err) {
      console.error('Error detallado:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar las categorías')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategorias()
  }, [fetchCategorias])

  const agregarCategoria = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (nombreCategoria.trim()) {
      setIsLoading(true)
      setError(null)
      try {
        let response;
        let newCategory: Categoria;
        const nombreEnMinusculas = nombreCategoria.toLowerCase();
        if (editando) {
          response = await fetch(`${API_BASE_URL}/api/category/${editando}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: nombreEnMinusculas }),
          })
          if (!response.ok) throw new Error('Error al actualizar la categoría')
          const data = await response.json()
          newCategory = data.data
          setCategorias(prevCategorias => 
            prevCategorias.map(cat => cat.uuid === editando ? newCategory : cat)
          )
        } else {
          response = await fetch(`${API_BASE_URL}/api/category/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: nombreEnMinusculas }),
          })
          if (!response.ok) throw new Error('Error al agregar la categoría')
          const data = await response.json()
          newCategory = data.data
          setCategorias(prevCategorias => [...prevCategorias, newCategory])
        }

        setNombreCategoria('')
        setEditando(null)
      } catch (err) {
        setError(editando ? 'Error al actualizar la categoría' : 'Error al agregar la categoría')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
  }, [nombreCategoria, editando])

  const editarCategoria = useCallback((uuid: string) => {
    const categoria = categorias.find(c => c.uuid === uuid)
    if (categoria) {
      setNombreCategoria(categoria.name)
      setEditando(uuid)
    }
  }, [categorias])

  const eliminarCategoria = useCallback(async (uuid: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/category/${uuid}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Error al eliminar la categoría')
      }

      setCategorias(prevCategorias => prevCategorias.filter(categoria => categoria.uuid !== uuid))
    } catch (err) {
      setError('Error al eliminar la categoría')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const categoriasFiltradas = useMemo(() => {
    if (!Array.isArray(categorias)) {
      console.error('categorias no es un array:', categorias)
      return []
    }
    return categorias.filter(categoria => 
      categoria && categoria.name && typeof categoria.name === 'string' &&
      categoria.name.toLowerCase().includes(busqueda.toLowerCase())
    )
  }, [categorias, busqueda])

  const totalPaginas = Math.max(1, Math.ceil(categoriasFiltradas.length / itemsPorPagina))

  const categoriasPaginadas = useMemo(() => {
    const inicio = (paginaActual - 1) * itemsPorPagina
    const fin = inicio + itemsPorPagina
    return categoriasFiltradas.slice(inicio, fin)
  }, [categoriasFiltradas, paginaActual])

  const cambiarPagina = useCallback((pagina: number) => {
    setPaginaActual(pagina)
  }, [])

  useEffect(() => {
    setPaginaActual(1)
  }, [busqueda])

  return (
    <div className="flex h-screen bg-[#eeeeee]">
      <div className="w-[30%] bg-white">
        <div className="p-8">
          <FormularioCategoria
            nombreCategoria={nombreCategoria}
            setNombreCategoria={setNombreCategoria}
            agregarCategoria={agregarCategoria}
            editando={editando}
            isLoading={isLoading}
          />
        </div>
      </div>
      <div className="w-[70%] p-8">
        <h2 className="text-2xl font-bold mb-4 text-[#00632C]">Lista de Categorías</h2>
        <BarraBusqueda placeholder="Buscar categoría" busqueda={busqueda} setBusqueda={setBusqueda} />
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="space-y-4">
          {categoriasPaginadas.map(categoria => (
            <CategoriaItem
              key={categoria.uuid}
              categoria={categoria}
              editarCategoria={editarCategoria}
              eliminarCategoria={eliminarCategoria}
            />
          ))}
        </div>
        {categoriasFiltradas.length > 0 ? (
          <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            cambiarPagina={cambiarPagina}
          />
        ) : (
          <p className="text-center mt-4 text-gray-500">No se encontraron categorías</p>
        )}
      </div>
    </div>
  )
}

