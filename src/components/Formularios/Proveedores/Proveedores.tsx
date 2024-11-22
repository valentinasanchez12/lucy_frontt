import React, { useState, useRef, useEffect } from 'react'

type Proveedor = {
  id: number;
  empresa: string;
  tipoPersona: string;
  nit: string;
  asesor: string;
  telefono: string;
  email: string;
  marcas: string[];
}

const marcasDisponibles = [
  "Marca 1", "Marca 2", "Marca 3", "Marca 4", "Marca 5",
  "Otra Marca 1", "Otra Marca 2", "Otra Marca 3", "Otra Marca 4", "Otra Marca 5",
]

const emptyFormData: Omit<Proveedor, 'id'> = {
  empresa: '',
  tipoPersona: '',
  nit: '',
  asesor: '',
  telefono: '',
  email: '',
  marcas: [],
}

export default function RegistroProveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [formData, setFormData] = useState<Omit<Proveedor, 'id'>>(emptyFormData)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [searchTermProveedores, setSearchTermProveedores] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const proveedoresPorPagina = 4

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleMarcaSelect = (marca: string) => {
    if (!formData.marcas.includes(marca)) {
      setFormData(prev => ({ ...prev, marcas: [...prev.marcas, marca] }))
    }
    setSearchTerm('')
  }

  const handleRemoveMarca = (marca: string) => {
    setFormData(prev => ({ ...prev, marcas: prev.marcas.filter(m => m !== marca) }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId !== null) {
      setProveedores(prev => prev.map(p => p.id === editingId ? { ...formData, id: editingId } : p))
      setEditingId(null)
    } else {
      setProveedores(prev => [...prev, { id: Date.now(), ...formData }])
    }
    setFormData(emptyFormData)
  }

  const handleDelete = (id: number) => {
    setProveedores(prev => prev.filter(proveedor => proveedor.id !== id))
  }

  const handleEdit = (proveedor: Proveedor) => {
    setFormData(proveedor)
    setEditingId(proveedor.id)
  }

  const filteredMarcas = marcasDisponibles.filter(marca =>
    marca.toLowerCase().includes(searchTerm.toLowerCase()) && !formData.marcas.includes(marca)
  )

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
  let startPage = Math.max(1, currentPage - 1)
  let endPage = Math.min(totalPages, startPage + 3)

  if (endPage - startPage < 3) {
    startPage = Math.max(1, endPage - 3)
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="flex h-screen bg-[#eeeeee]">
      <div className="w-2/5 p-6 bg-white">
        <h2 className="text-2xl font-bold mb-4 text-[#00632C]">
          {editingId !== null ? 'Editar Proveedor' : 'Registro de Proveedores'}
        </h2>
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
              <option value="natural">Persona Natural</option>
              <option value="juridica">Persona Jurídica</option>
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
            {isDropdownOpen && filteredMarcas.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredMarcas.map((marca) => (
                  <div
                    key={marca}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleMarcaSelect(marca)}
                  >
                    {marca}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.marcas.map((marca) => (
              <span key={marca} className="bg-[#80C68C] text-[#00632C] px-2 py-1 rounded-full text-sm flex items-center">
                {marca}
                <button
                  type="button"
                  onClick={() => handleRemoveMarca(marca)}
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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="space-y-4">
          {currentProveedores.map(proveedor => (
            <div key={proveedor.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between">
                <div className="space-y-2 flex-grow">
                  <h3 className="text-2xl font-bold text-[#00632C]">{proveedor.empresa}</h3>
                  <p className="text-[#333333]"><strong>Tipo de persona:</strong> {proveedor.tipoPersona === 'natural' ? 'Persona Natural' : 'Persona Jurídica'}</p>
                  <p className="text-[#333333]"><strong>NIT:</strong> {proveedor.nit}</p>
                  <p className="text-[#333333]"><strong>Asesor comercial:</strong> {proveedor.asesor}</p>
                  <p className="text-[#333333]"><strong>Teléfono:</strong> {proveedor.telefono}</p>
                  <p className="text-[#333333]"><strong>Email:</strong> {proveedor.email}</p>
                  <p className="text-[#333333]"><strong>Marcas:</strong> {proveedor.marcas.join(', ')}</p>
                </div>
                <div className="flex flex-col justify-end space-y-2 ml-4">
                  <button
                    className="bg-[#00632C] text-white p-2 rounded-md hover:bg-[#00632C]/80 transition duration-300"
                    onClick={() => handleEdit(proveedor)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-300"
                    onClick={() => handleDelete(proveedor.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
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