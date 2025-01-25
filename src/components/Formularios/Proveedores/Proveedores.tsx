import React, { useState, useRef, useEffect } from 'react'
import {API_BASE_URL} from "../../../utils/ApiUrl.tsx";

type Proveedor = {
  id: string;
  empresa: string;
  tipoPersona: string;
  nit: string;
  asesor: string;
  telefono: string;
  email: string;
  marcas: Array<{ uuid: string; name: string }>;
}

type ApiProveedor = {
  uuid: string;
  name: string;
  nit: string;
  types_person: string;
  represent: string;
  phone: string;
  email: string;
  brands: Array<{
    uuid: string;
    name: string;
  }>;
}

type Brand = {
  uuid: string;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

const emptyFormData: Omit<Proveedor, 'id'> = {
  empresa: '',
  tipoPersona: '',
  nit: '',
  asesor: '',
  telefono: '',
  email: '',
  marcas: [],
}

const capitalizeWords = (str: string) => {
  return str.replace(/\b\w|\b\w(?=\w)/g, (char, index) => {
    if (index === 0 || str[index - 1] === ' ') {
      return char.toUpperCase();
    }
    return char.toLowerCase();
  });
};

export default function RegistroProveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [formData, setFormData] = useState<Omit<Proveedor, 'id'>>(emptyFormData)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [searchTermProveedores, setSearchTermProveedores] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [errors, setErrors] = useState<string[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const proveedoresPorPagina = 4

  useEffect(() => {
    fetchProveedores()
    fetchBrands()
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchProveedores = async () => {
    try {
      setErrors([])
      const response = await fetch(`${API_BASE_URL}/api/provider/`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('API Response:', data)
      if (data.success) {
        const formattedProveedores: Proveedor[] = data.data.map((apiProveedor: ApiProveedor) => ({
          id: apiProveedor.uuid,
          empresa: apiProveedor.name,
          tipoPersona: apiProveedor.types_person,
          nit: apiProveedor.nit,
          asesor: apiProveedor.represent,
          telefono: apiProveedor.phone,
          email: apiProveedor.email,
          marcas: apiProveedor.brands,
        }))
        setProveedores(formattedProveedores)
      } else {
        throw new Error(data.response || 'Failed to fetch providers')
      }
    } catch (error) {
      console.error('Fetch error:', error)
      if (error instanceof Error) {
        setErrors(prev => [...prev, `Error fetching providers: ${error.message}`])
      } else {
        setErrors(prev => [...prev, 'Unknown error fetching providers'])
      }
      console.error('Error details:', JSON.stringify(error, null, 2))
    }
  }

  const fetchBrands = async () => {
    try {
      setErrors([])
      const response = await fetch(`${API_BASE_URL}/api/brand/`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Brands API Response:', data)
      if (data.success) {
        setBrands(data.data)
      } else {
        throw new Error(data.response || 'Failed to fetch brands')
      }
    } catch (error) {
      console.error('Fetch brands error:', error)
      if (error instanceof Error) {
        setErrors(prev => [...prev, `Error fetching brands: ${error.message}`])
      } else {
        setErrors(prev => [...prev, 'Unknown error fetching brands'])
      }
      console.error('Error details:', JSON.stringify(error, null, 2))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleMarcaSelect = (brand: Brand) => {
    if (!formData.marcas.some(m => m.uuid === brand.uuid)) {
      setFormData(prev => ({ ...prev, marcas: [...prev.marcas, { uuid: brand.uuid, name: brand.name.toLowerCase() }] }))
    }
    setSearchTerm('')
  }

  const handleRemoveMarca = (uuid: string) => {
    setFormData(prev => ({ ...prev, marcas: prev.marcas.filter(m => m.uuid !== uuid) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])
    const newProvider = {
      name: formData.empresa.toLowerCase(),
      nit: formData.nit.toLowerCase(),
      types_person: formData.tipoPersona,
      represent: formData.asesor.toLowerCase(),
      phone: formData.telefono,
      email: formData.email.toLowerCase(),
      brands: formData.marcas.map(marca => ({ uuid: marca.uuid, name: marca.name.toLowerCase() })),
    }

    try {
      const url = editingId
          ? `${API_BASE_URL}/api/provider/${editingId}`
          : `${API_BASE_URL}/api/provider/`
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProvider),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('API Response:', data)
      if (data.success) {
        if (editingId) {
          setProveedores(prev => prev.map(p => p.id === editingId ? { ...formData, id: editingId } : p))
          setEditingId(null)
        } else {
          const newProveedor: Proveedor = {
            id: data.data.uuid,
            empresa: data.data.name,
            tipoPersona: data.data.types_person,
            nit: data.data.nit,
            asesor: data.data.represent,
            telefono: data.data.phone,
            email: data.data.email,
            marcas: data.data.brands,
          }
          setProveedores(prev => [...prev, newProveedor])
        }
        setFormData(emptyFormData)
      } else {
        throw new Error(data.response || 'Failed to save provider')
      }
    } catch (error) {
      console.error('Submit error:', error)
      if (error instanceof Error) {
        setErrors(prev => [...prev, `Error saving provider: ${error.message}`])
      } else {
        setErrors(prev => [...prev, 'Unknown error saving provider'])
      }
      console.error('Error details:', JSON.stringify(error, null, 2))
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setErrors([])
      const response = await fetch(`${API_BASE_URL}/api/provider/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('API Response:', data)
      if (data.success) {
        setProveedores(prev => prev.filter(proveedor => proveedor.id !== id))
      } else {
        throw new Error(data.response || 'Failed to delete provider')
      }
    } catch (error) {
      console.error('Delete error:', error)
      if (error instanceof Error) {
        setErrors(prev => [...prev, `Error deleting provider: ${error.message}`])
      } else {
        setErrors(prev => [...prev, 'Unknown error deleting provider'])
      }
      console.error('Error details:', JSON.stringify(error, null, 2))
    }
  }

  const handleEdit = (proveedor: Proveedor) => {
    setFormData(proveedor)
    setEditingId(proveedor.id)
  }

  const filteredProveedores = proveedores.filter(proveedor =>
      proveedor.empresa.toLowerCase().includes(searchTermProveedores.toLowerCase()) ||
      proveedor.asesor.toLowerCase().includes(searchTermProveedores.toLowerCase()) ||
      proveedor.email.toLowerCase().includes(searchTermProveedores.toLowerCase())
  )

  const indexOfLastProveedor = currentPage * proveedoresPorPagina
  const indexOfFirstProveedor = indexOfLastProveedor - proveedoresPorPagina
  const currentProveedores = filteredProveedores.slice(indexOfFirstProveedor, indexOfLastProveedor)

  const totalPages = Math.ceil(filteredProveedores.length / proveedoresPorPagina)

  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  const filteredBrands = brands.filter(brand =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) && !formData.marcas.some(m => m.uuid === brand.uuid)
  )

  const removeError = (index: number) => {
    setErrors(prev => prev.filter((_, i) => i !== index))
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTermProveedores])

  return (
      <div className="flex h-screen bg-[#eeeeee]">
        <div className="w-2/5 p-6 bg-white">
          <h2 className="text-2xl font-bold mb-4 text-[#00632C]">
            {editingId !== null ? 'Editar Proveedor' : 'Registro de Proveedores'}
          </h2>
          {errors.length > 0 && (
              <div className="mb-4">
                {errors.map((error, index) => (
                    <div key={index} className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-2" role="alert">
                      <strong className="font-bold">Error:</strong>
                      <span className="block sm:inline"> {error}</span>
                      <button
                          className="absolute top-0 bottom-0 right-0 px-4 py-3"
                          onClick={() => removeError(index)}
                      >
                        <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <title>Cerrar</title>
                          <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                        </svg>
                      </button>
                    </div>
                ))}
              </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="empresa" className="block text-sm font-bold text-[#333333]">Nombre de la empresa</label>
              <input
                  id="empresa"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleInputChange}
                  className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#00632C] focus:ring focus:ring-[#00632C] focus:ring-opacity-50 text-lg py-2"
                  required
              />
            </div>
            <div>
              <label htmlFor="tipoPersona" className="block text-sm font-bold text-[#333333]">Tipo de persona</label>
              <select
                  id="tipoPersona"
                  name="tipoPersona"
                  value={formData.tipoPersona}
                  onChange={handleInputChange}
                  className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#00632C] focus:ring focus:ring-[#00632C] focus:ring-opacity-50 text-lg py-2"
                  required
              >
                <option value="">Seleccione un tipo</option>
                <option value="Persona Natural">Persona Natural</option>
                <option value="Persona Jurídica">Persona Jurídica</option>
              </select>
            </div>
            <div>
              <label htmlFor="nit" className="block text-sm font-bold text-[#333333]">NIT</label>
              <input
                  id="nit"
                  name="nit"
                  value={formData.nit}
                  onChange={handleInputChange}
                  className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#00632C] focus:ring focus:ring-[#00632C] focus:ring-opacity-50 text-lg py-2"
                  required
              />
            </div>
            <div>
              <label htmlFor="asesor" className="block text-sm font-bold text-[#333333]">Nombre de la asesora comercial</label>
              <input
                  id="asesor"
                  name="asesor"
                  value={formData.asesor}
                  onChange={handleInputChange}
                  className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#00632C] focus:ring focus:ring-[#00632C] focus:ring-opacity-50 text-lg py-2"
                  required
              />
            </div>
            <div>
              <label htmlFor="telefono" className="block text-sm font-bold text-[#333333]">Teléfono</label>
              <input
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#00632C] focus:ring focus:ring-[#00632C] focus:ring-opacity-50 text-lg py-2"
                  required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-[#333333]">Email</label>
              <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#00632C] focus:ring focus:ring-[#00632C] focus:ring-opacity-50 text-lg py-2"
                  required
              />
            </div>
            <div className="relative" ref={dropdownRef}>
              <label htmlFor="marcas" className="block text-sm font-bold text-[#333333]">Marcas</label>
              <input
                  id="marcas"
                  name="marcas"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsDropdownOpen(true)}
                  className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#00632C] focus:ring focus:ring-[#00632C] focus:ring-opacity-50 text-lg py-2"
                  placeholder="Buscar marcas..."
              />
              {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredBrands.map((brand) => (
                        <div
                            key={brand.uuid}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleMarcaSelect(brand)}
                        >
                          {capitalizeWords(brand.name)}
                        </div>
                    ))}
                  </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.marcas.map((marca) => (
                  <span key={marca.uuid} className="bg-[#80C68C] text-[#00632C] px-2 py-1 rounded-full text-sm flex items-center">
                {capitalizeWords(marca.name)}
                    <button
                        type="button"
                        onClick={() => handleRemoveMarca(marca.uuid)}
                        className="ml-2 focus:outline-none"
                    >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
              ))}
            </div>
            <button
                type="submit"
                className="w-full bg-[#FFD700] text-[#00632C] hover:bg-[#00632C] hover:text-white py-2 px-4 rounded-md transition duration-300"
            >
              {editingId !== null ? 'Actualizar Proveedor' : 'Registrar Proveedor'}
            </button>
          </form>
        </div>
        <div className="w-3/5 p-6 overflow-auto max-h-screen">
          <h2 className="text-2xl font-bold mb-4 text-[#00632C]">Lista de Proveedores</h2>
          <div className="relative mb-4">
            <input
                type="text"
                placeholder="Buscar proveedores..."
                value={searchTermProveedores}
                onChange={(e) => setSearchTermProveedores(e.target.value)}
                className="pl-4 pr-10 py-2 w-full border border-gray-300 rounded-full bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#00632C] focus:border-[#00632C]"
            />
            {searchTermProveedores ? (
                <button
                    onClick={() => setSearchTermProveedores('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            )}
          </div>
          <div className="space-y-4">
            {currentProveedores.map(proveedor => (
                <div key={proveedor.id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between">
                    <div className="space-y-2 flex-grow">
                      <h3 className="text-2xl font-bold text-[#00632C]">{capitalizeWords(proveedor.empresa)}</h3>
                      <p className="text-[#333333]"><strong>Tipo de persona:</strong> {proveedor.tipoPersona}</p>
                      <p className="text-[#333333]"><strong>NIT:</strong> {proveedor.nit.toUpperCase()}</p>
                      <p className="text-[#333333]"><strong>Asesor comercial:</strong> {capitalizeWords(proveedor.asesor)}</p>
                      <p className="text-[#333333]"><strong>Teléfono:</strong> {proveedor.telefono}</p>
                      <p className="text-[#333333]"><strong>Email:</strong> {proveedor.email}</p>
                      <p className="text-[#333333]"><strong>Marcas:</strong> {proveedor.marcas.map(marca => capitalizeWords(marca.name)).join(', ')}</p>
                    </div>
                    <div className="flex flex-col justify-end space-y-2 ml-4">
                      <button
                          className="bg-[#00632C] text-white p-2 rounded-md hover:bg-[#00632C]/80 transition duration-300"
                          onClick={() => handleEdit(proveedor)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button
                          className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-300"
                          onClick={() => handleDelete(proveedor.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-md bg-white text-[#00632C] border border-[#00632C] hover:bg-[#00632C] hover:text-white transition-colors ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {pageNumbers.map(number => (
                <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={`px-3 py-2 rounded-md ${
                        currentPage === number ? 'bg-[#00632C] text-white' : 'bg-white text-[#00632C] border border-[#00632C]'
                    }`}
                >
                  {number}
                </button>
            ))}
            <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-md bg-white text-[#00632C] border border-[#00632C] hover:bg-[#00632C] hover:text-white transition-colors ${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
  )
}

