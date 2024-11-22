import React, { useState } from 'react'
import { SearchIcon, PencilIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

const Input = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-bold mb-2" htmlFor={props.id}>{label}</label>
    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" {...props} />
  </div>
)

const Select = ({ label, options, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-bold mb-2" htmlFor={props.id}>{label}</label>
    <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" {...props}>
      <option value="">Seleccione una opción</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
)

const Button = ({ children, className, ...props }) => (
  <button
    className={`bg-[#FFD700] hover:bg-[#80C68C] text-[#00632C] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${className}`}
    {...props}
  >
    {children}
  </button>
)

export default function RegistroSanitario() {
  const [marcas, setMarcas] = useState([])
  const [formData, setFormData] = useState({
    id: null,
    numero: '',
    fechaVencimiento: '',
    grupo: '',
    tipoRiesgo: '',
    estado: '',
    archivo: null
  })
  const [editando, setEditando] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 4

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, archivo: e.target.files[0] }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editando) {
      setMarcas(marcas.map(marca => 
        marca.id === formData.id ? { ...formData, archivo: formData.archivo ? formData.archivo.name : marca.archivo } : marca
      ))
      setEditando(false)
    } else {
      const nuevoId = marcas.length > 0 ? Math.max(...marcas.map(m => m.id)) + 1 : 1
      const nuevoRegistro = {
        ...formData,
        id: nuevoId,
        archivo: formData.archivo ? formData.archivo.name : null
      }
      setMarcas(prev => [...prev, nuevoRegistro])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      id: null,
      numero: '',
      fechaVencimiento: '',
      grupo: '',
      tipoRiesgo: '',
      estado: '',
      archivo: null
    })
  }

  const iniciarEdicion = (marca) => {
    setFormData(marca)
    setEditando(true)
  }

  const eliminarRegistro = (id) => {
    setMarcas(marcas.filter(marca => marca.id !== id))
  }

  const filteredMarcas = marcas.filter(marca =>
    marca.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    marca.grupo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    marca.estado.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredMarcas.length / itemsPerPage)
  const pageNumbers = Array.from({ length: Math.min(4, totalPages) }, (_, i) => i + 1)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredMarcas.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="flex h-screen bg-[#eeeeee]">
      {/* Formulario */}
      <div className="w-[35%] p-8 bg-white">
        <h2 className="text-2xl font-bold mb-6 text-[#00632C]">
          {editando ? 'Editar Registro Sanitario' : 'Nuevo Registro Sanitario'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Número del registro"
            id="numero"
            name="numero"
            value={formData.numero}
            onChange={handleInputChange}
            placeholder="Ingrese el número de registro"
          />
          <Input
            label="Fecha de vencimiento"
            id="fechaVencimiento"
            name="fechaVencimiento"
            type="date"
            value={formData.fechaVencimiento}
            onChange={handleInputChange}
          />
          <Select
            label="Grupo"
            id="grupo"
            name="grupo"
            value={formData.grupo}
            onChange={handleInputChange}
            options={[
              { value: "Medicamentos", label: "Medicamentos" },
              { value: "Cosmeticos", label: "Cosméticos" },
              { value: "Odontologicos", label: "Odontológicos" },
              { value: "Medico Quirurgicos", label: "Médico Quirúrgicos" },
              { value: "Aseo y Limpieza", label: "Aseo y Limpieza" },
              { value: "Reactivo Diagnostico", label: "Reactivo Diagnóstico" },
              { value: "Homeopaticos", label: "Homeopáticos" },
              { value: "Suplemento dietario", label: "Suplemento dietario" },
              { value: "Fitoterapeutico", label: "Fitoterapéutico" },
              { value: "Biologicos", label: "Biológicos" }
            ]}
          />
          <Input
            label="Tipo de riesgo"
            id="tipoRiesgo"
            name="tipoRiesgo"
            value={formData.tipoRiesgo}
            onChange={handleInputChange}
            placeholder="Ingrese el tipo de riesgo"
          />
          <Select
            label="Estado del registro"
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleInputChange}
            options={[
              { value: "Vigente", label: "Vigente" },
              { value: "Vencido", label: "Vencido" },
              { value: "Suspendido", label: "Suspendido" },
              { value: "Cancelado", label: "Cancelado" },
              { value: "En Trámite de Renovación", label: "En Trámite de Renovación" }
            ]}
          />
          <Input
            label="Cargue de archivo"
            id="archivo"
            name="archivo"
            type="file"
            onChange={handleFileChange}
          />
          <div className="w-full">
            <Button type="submit" className="w-full bg-[#FFD700] text-[#00632C] hover:bg-[#80C68C]">
              {editando ? 'Actualizar Registro' : 'Agregar Registro'}
            </Button>
          </div>
        </form>
      </div>

      {/* Lista de registros sanitarios */}
      <div className="w-[65%] p-8">
        <h2 className="text-2xl font-bold mb-6 text-[#00632C]">Lista de Registro Sanitario</h2>

        {/* Barra de búsqueda */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Buscar registro sanitario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2 rounded-full border-2 border-gray-300 focus:outline-none focus:border-[#00632C] transition-colors"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="space-y-4">
          {currentItems.map((marca) => (
            <div key={marca.id} className="bg-white p-4 rounded-lg shadow">
              <div className="space-y-2">
                <p className="font-bold text-[#00632C]">Número: {marca.numero}</p>
                <p className="text-[#333333]">Fecha de vencimiento: {marca.fechaVencimiento}</p>
                <p className="text-[#333333]">Grupo: {marca.grupo}</p>
                <p className="text-[#333333]">Tipo de riesgo: {marca.tipoRiesgo}</p>
                <p className="text-[#333333]">Estado: {marca.estado}</p>
                <div className="flex justify-between items-center mt-2">
                  {marca.archivo ? (
                    <a
                      href={`/archivos/${marca.archivo}`}
                      className="text-[#00632C] hover:underline inline-block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver archivo adjunto
                    </a>
                  ) : (
                    <span className="text-gray-400">Sin archivo adjunto</span>
                  )}
                  <div className="flex space-x-2">
                    <button onClick={() => iniciarEdicion(marca)} className="bg-[#00632C] hover:bg-[#00632C]/80 text-white p-2 rounded">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button onClick={() => eliminarRegistro(marca.id)} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-white border border-gray-300 text-gray-500 hover:bg-gray-100 px-4 py-2 rounded-md disabled:opacity-50"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-4 py-2 rounded-md ${currentPage === number ? 'bg-[#00632C] text-white' : 'bg-white border border-gray-300 text-gray-500 hover:bg-gray-100'}`}
            >
              {number}
            </button>
          ))}
          {totalPages > 4 && currentPage < totalPages - 2 && (
            <>
              <span>...</span>
              <button
                onClick={() => paginate(totalPages)}
                className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-[#00632C] text-white' : 'bg-white border border-gray-300 text-gray-500 hover:bg-gray-100'}`}
              >
                {totalPages}
              </button>
            </>
          )}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-white border border-gray-300 text-gray-500 hover:bg-gray-100 px-4 py-2 rounded-md disabled:opacity-50"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}