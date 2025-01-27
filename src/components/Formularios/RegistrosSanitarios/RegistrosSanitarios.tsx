import React, { useState, useEffect } from 'react'
import { SearchIcon, PencilIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react'
import {API_BASE_URL} from "../../../utils/ApiUrl.tsx";

// Definición de tipos
interface RegistroSanitario {
  uuid: string;
  url: string;
  number_registry: string;
  expiration_date: string;
  cluster: string;
  status: string;
  type_risk: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface RegistroSanitarioInput {
  number_registry: string;
  expiration_date: string;
  cluster: string;
  status: string;
  type_risk: string;
  file_name: string;
  file_content: string;
}

// Componentes de UI
const Input: React.FC<{
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>> = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-bold mb-2" htmlFor={props.id}>{label}</label>
    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" {...props} />
  </div>
)

const Select = ({
                  label,
                  options,
                  ...props
                }: {
  label: string;
  options: { value: string; label: string }[];
  [key: string]: any;
}) => (
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

const Button: React.FC <{
  className?: string;
  children: React.ReactNode;
  [key: string]: any; // Para props adicionales
}> = ({ children, className, ...props }) => (
  <button
    className={`bg-[#FFD700] hover:bg-[#80C68C] text-[#00632C] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${className}`}
    {...props}
  >
    {children}
  </button>
)

// Funciones de API
const API_URL = `${API_BASE_URL}/api/sanitary-registry/`;

async function fetchRegistrosSanitarios(): Promise<RegistroSanitario[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Error al obtener los registros sanitarios');
  }
  const data = await response.json();
  if (!data.success || !Array.isArray(data.data)) {
    throw new Error('La respuesta del servidor no es válida');
  }
  return data.data;
}

async function createRegistroSanitario(registro: RegistroSanitarioInput): Promise<RegistroSanitario> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registro),
  });
  if (!response.ok) {
    throw new Error('Error al crear el registro sanitario');
  }
  const data = await response.json();
  if (!data.success || !data.data) {
    throw new Error('La respuesta del servidor no es válida');
  }
  return data.data;
}

async function updateRegistroSanitario(uuid: string, registro: Partial<RegistroSanitarioInput>): Promise<RegistroSanitario> {
  const response = await fetch(`${API_URL}${uuid}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registro),
  });
  if (!response.ok) {
    throw new Error('Error al actualizar el registro sanitario');
  }
  const data = await response.json();
  if (!data.success || !data.data) {
    throw new Error('La respuesta del servidor no es válida');
  }
  return data.data;
}

async function deleteRegistroSanitario(uuid: string): Promise<void> {
  const response = await fetch(`${API_URL}${uuid}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error al eliminar el registro sanitario');
  }
  const data = await response.json();
  if (!data.success) {
    throw new Error('Error al eliminar el registro sanitario');
  }
}

// Componente principal
export default function RegistroSanitarioComponent() {
  const [registros, setRegistros] = useState<RegistroSanitario[]>([])
  const [formData, setFormData] = useState<RegistroSanitarioInput>({
    number_registry: '',
    expiration_date: '',
    cluster: '',
    status: '',
    type_risk: '',
    file_name: '',
    file_content: '',
  })
  const [editando, setEditando] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const itemsPerPage = 3

  useEffect(() => {
    fetchRegistrosSanitarios()
      .then(setRegistros)
      .catch(err => {
        console.error('Error fetching registros:', err);
        setError('Error al cargar los registros sanitarios. Por favor, intente de nuevo más tarde.');
      });
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({
          ...prev,
          file_name: file.name,
          file_content: base64String.split(',')[1] // Remove data:application/pdf;base64, from the string
        }));
      };
      reader.readAsDataURL(file);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const lowercaseFormData = {
      ...formData,
      number_registry: formData.number_registry.toLowerCase(),
      cluster: formData.cluster.toLowerCase(),
      status: formData.status.toLowerCase(),
      type_risk: formData.type_risk.toLowerCase(),
    }
    try {
      if (editando) {
        const updatedRegistro = await updateRegistroSanitario(editando, lowercaseFormData)
        setRegistros(registros.map(r => r.uuid === editando ? updatedRegistro : r))
        setEditando(null)
      } else {
        const newRegistro = await createRegistroSanitario(lowercaseFormData)
        setRegistros([...registros, newRegistro])
      }
      resetForm()
    } catch (error) {
      console.error('Error al guardar el registro:', error)
      setError('Error al guardar el registro. Por favor, intente de nuevo.')
    }
  }

  const resetForm = () => {
    setFormData({
      number_registry: '',
      expiration_date: '',
      cluster: '',
      status: '',
      type_risk: '',
      file_name: '',
      file_content: '',
    })
  }

  const iniciarEdicion = (registro: RegistroSanitario) => {
    setFormData({
      number_registry: registro.number_registry,
      expiration_date: registro.expiration_date,
      cluster: registro.cluster,
      status: registro.status,
      type_risk: registro.type_risk,
      file_name: registro.url ? registro.url.split('/').pop() || '' : '',
      file_content: '',
    })
    setEditando(registro.uuid)
  }

  const eliminarRegistro = async (uuid: string) => {
    try {
      await deleteRegistroSanitario(uuid)
      setRegistros(registros.filter(registro => registro.uuid !== uuid))
    } catch (error) {
      console.error('Error al eliminar el registro:', error)
      setError('Error al eliminar el registro. Por favor, intente de nuevo.')
    }
  }

  const filteredRegistros = registros.filter(registro =>
    registro.number_registry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registro.cluster.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registro.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredRegistros.length / itemsPerPage)
  const pageNumbers = Array.from({ length: Math.min(4, totalPages) }, (_, i) => i + 1)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredRegistros.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

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
            id="number_registry"
            name="number_registry"
            value={formData.number_registry}
            onChange={handleInputChange}
            placeholder="Ingrese el número de registro"
          />
          <Input
            label="Fecha de vencimiento"
            id="expiration_date"
            name="expiration_date"
            type="date"
            value={formData.expiration_date}
            onChange={handleInputChange}
          />
          <Select
            label="Grupo"
            id="cluster"
            name="cluster"
            value={formData.cluster}
            onChange={handleInputChange}
            options={[
              { value: "No requiere", label: "No requiere" },
              { value: "Medicamentos", label: "Medicamentos" },
              { value: "Cosmeticos", label: "Cosméticos" },
              { value: "Odontologicos", label: "Odontológicos" },
              { value: "Medico Quirurgicos", label: "Médico Quirúrgicos" },
              { value: "Aseo y Limpieza", label: "Aseo y Limpieza" },
              { value: "Reactivo Diagnostico", label: "Reactivo Diagnóstico" },
              { value: "Homeopaticos", label: "Homeopáticos" },
              { value: "Suplemento dietario", label: "Suplemento dietario" },
              { value: "Fitoterapéutico", label: "Fitoterapéutico" },
              { value: "Biológicos", label: "Biológicos" }
            ]}
          />
          <Input
            label="Tipo de riesgo"
            id="type_risk"
            name="type_risk"
            value={formData.type_risk}
            onChange={handleInputChange}
            placeholder="Ingrese el tipo de riesgo"
          />
          <Select
            label="Estado del registro"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            options={[
              { value: "No requiere", label: "No requiere" },
              { value: "Vigente", label: "Vigente" },
              { value: "Vencido", label: "Vencido" },
              { value: "Suspendido", label: "Suspendido" },
              { value: "Cancelado", label: "Cancelado" },
              { value: "En Trámite de Renovación", label: "En Trámite de Renovación" }
            ]}
          />
          <Input
            label="Cargar archivo"
            id="file"
            name="file"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
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
          <div 
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            onClick={() => setSearchTerm('')}
          >
            {searchTerm ? (
              <XIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <SearchIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>

        <div className="space-y-4">
          {error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : (
            currentItems.map((registro) => (
              <div key={registro.uuid} className="bg-white p-4 rounded-lg shadow">
                <div className="space-y-2">
                  <p className="font-bold text-[#00632C]">Número de registro: {registro.number_registry.toUpperCase()}</p>
                  <p className="text-[#333333]">Fecha de vencimiento: {registro.expiration_date}</p>
                  <p className="text-[#333333]">Grupo: {registro.cluster.toUpperCase()}</p>
                  <p className="text-[#333333]">Tipo de riesgo: {registro.type_risk.toUpperCase()}</p>
                  <p className="text-[#333333]">Estado: {registro.status.toUpperCase()}</p>
                  <div className="flex justify-between items-center mt-2">
                    {registro.url ? (
                      <a
                        href={`${API_BASE_URL}${registro.url}`}
                        className="text-[#00632C] hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {registro.url.split('/').pop()}
                      </a>
                    ) : (
                      <span className="text-gray-400">Sin archivo adjunto</span>
                    )}
                    <div className="flex space-x-2">
                      <button onClick={() => iniciarEdicion(registro)} className="bg-[#00632C] hover:bg-[#00632C]/80 text-white p-2 rounded">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button onClick={() => eliminarRegistro(registro.uuid)} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Paginación */}
        {!error && (
          <div className="mt-4 flex justify-center items-center space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-white hover:bg-[#80C68C] text-[#00632C] hover:text-[#00632C] border border-[#00632C] p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Página anterior"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`${
                  currentPage === number
                    ? 'bg-[#00632C] text-white'
                    : 'bg-white text-[#00632C] hover:bg-[#80C68C] hover:text-[#00632C]'
                } border border-[#00632C] px-3 py-1 rounded-md`}
              >
                {number}
              </button>
            ))}
            {totalPages > 4 && currentPage < totalPages - 2 && (
              <>
                <span>...</span>
                <button
                  onClick={() => paginate(totalPages)}
                  className={`${
                    currentPage === totalPages
                      ? 'bg-[#00632C] text-white'
                      : 'bg-white text-[#00632C] hover:bg-[#80C68C] hover:text-[#00632C]'
                  } border border-[#00632C] px-3 py-1 rounded-md`}
                >
                  {totalPages}
                </button>
              </>
            )}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-white hover:bg-[#80C68C] text-[#00632C] hover:text-[#00632C] border border-[#00632C] p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Página siguiente"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

