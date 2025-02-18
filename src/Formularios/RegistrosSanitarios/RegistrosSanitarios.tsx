import React, { useState, useEffect } from 'react'
import {PencilIcon, TrashIcon, X} from 'lucide-react'
import {API_BASE_URL} from "../../utils/ApiUrl.tsx";
import BarraBusqueda from "../../components/Busqueda/BarraBusqueda.tsx";
import Paginacion from "../../components/Paginacion/Paginacion.tsx";
import InputField from "../../components/ui/InputFile.tsx";
import SelectField from "../../components/ui/SelectField.tsx";
import Toast from "../../components/ui/Toast.tsx";

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
  const [busqueda, setBusqueda] = useState('')
  const [paginaActual, setPaginaActual] = useState(1)
  const itemsPorPagina = 3
  const [showFileInput, setShowFileInput] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<{ message: string; color?: string } | null>(null)

  const handleBusqueda = (nuevaBusqueda: string) => {
    setBusqueda(nuevaBusqueda)
    setPaginaActual(1)
  }

  useEffect(() => {
    fetchRegistrosSanitarios()
      .then(setRegistros)
      .catch(err => {
        console.error('Error fetching registros:', err);
        setToastMessage({ message: 'Error al cargar los registros sanitarios. Por favor, intente de nuevo más tarde.' });
      });
  }, [])

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string) => (option: any) => {
    setFormData((prev) => ({ ...prev, [name]: option.value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        alert('Solo se permiten archivos PDF.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({
          ...prev,
          file_name: file.name,
          file_content: base64String.split(',')[1],  // Remove data:application/pdf;base64, from the string
        }));
        setShowFileInput(false);  // Oculta el campo de carga una vez que se selecciona un archivo
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteFile = () => {
    setFormData(prev => ({
      ...prev,
      file_name: '',
      file_content: '',
    }));
    setShowFileInput(true);  // Muestra nuevamente el campo de carga de archivos
  };

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
        setToastMessage({ message: 'Registro actualizado correctamente', color:"bg-green-500" })
      } else {
        const newRegistro = await createRegistroSanitario(lowercaseFormData)
        setRegistros([...registros, newRegistro])
        setToastMessage({ message: 'Registro creado correctamente', color:"bg-green-500" })
      }
      resetForm()
    } catch (error) {
      console.error('Error al guardar el registro:', error)
      if (error instanceof Error) {
        setToastMessage({ message: `Error al guardar el registro. ${error.message}` })
      } else {
        setToastMessage({ message: "Error desconocida. Por favor ponerse en contacto con el administrador" })
      }
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
    });
    setShowFileInput(true);
  }

  const iniciarEdicion = (registro: RegistroSanitario) => {
    setFormData({
      number_registry: registro.number_registry,
      expiration_date: registro.expiration_date,
      cluster: registro.cluster,
      status: registro.status,
      type_risk: registro.type_risk,
      file_name: registro.url,
      file_content: '',
    })
    setEditando(registro.uuid)
    setShowFileInput(false)
  }

  const eliminarRegistro = async (uuid: string) => {
    try {
      await deleteRegistroSanitario(uuid)
      setRegistros(registros.filter(registro => registro.uuid !== uuid))
    } catch (error) {
      console.error('Error al eliminar el registro:', error)
      setToastMessage({ message: 'Error al eliminar el registro. Por favor, intente de nuevo.' })
    }
  }

  const registrosFiltrados = registros.filter(registro =>
    registro.number_registry.toLowerCase().includes(busqueda.toLowerCase()) ||
    registro.cluster.toLowerCase().includes(busqueda.toLowerCase()) ||
    registro.status.toLowerCase().includes(busqueda.toLowerCase())
  )

  const totalPaginas = Math.ceil(registrosFiltrados.length / itemsPorPagina)
  const indiceInicial = (paginaActual - 1) * itemsPorPagina
  const indiceFinal = indiceInicial + itemsPorPagina
  const registrosPaginadas = registrosFiltrados.slice(indiceInicial, indiceFinal)

  const cambiarPagina = (pagina: number) => {
    setPaginaActual(pagina)
  }
  useEffect(() => {
    setPaginaActual(1)
  }, [busqueda])

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#eeeeee]">
      {toastMessage && <Toast message={toastMessage.message} color={toastMessage.color} />}
      {/* Formulario */}
      <div className="w-full lg:w-2/5 p-6 bg-white order-1 lg:order-none overflow-auto lg:overflow-visible">
        <h2 className="text-2xl font-bold mb-6 text-[#00632C]">
          {editando ? 'Editar Registro Sanitario' : 'Nuevo Registro Sanitario'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Número del registro"
            name="number_registry"
            value={formData.number_registry}
            onChange={handleInputChange}
            placeholder="Ingrese el número de registro"
            required
          />
          <InputField
              placeholder="Ingrese la fecha de vencimiento"
              label="Fecha de vencimiento"
              name="expiration_date"
              type="date"
              value={formData.expiration_date}
              onChange={handleInputChange}
              required
          />
          <SelectField
              label="Grupo"
              name="cluster"
              value={formData.cluster}
              onChange={handleSelectChange("cluster")}
              placeholder="Seleccione un grupo"
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
              required
          />
          <InputField
            label="Tipo de riesgo"
            name="type_risk"
            value={formData.type_risk}
            onChange={handleInputChange}
            placeholder="Ingrese el tipo de riesgo"
            required
          />
          <SelectField
              placeholder="Seleccione un estado"
              label="Estado del registro"
              name="status"
              value={formData.status}
              onChange={handleSelectChange("status")}
              options={[
                { value: "No requiere", label: "No requiere" },
                { value: "Vigente", label: "Vigente" },
                { value: "Vencido", label: "Vencido" },
                { value: "Suspendido", label: "Suspendido" },
                { value: "Cancelado", label: "Cancelado" },
                { value: "En Trámite de Renovación", label: "En Trámite de Renovación" }
              ]}
              required
          />
          <div>
            {formData.file_name && !showFileInput ? (
                <div className="flex items-center space-x-2 mb-2">
                  <label className="block text-sm font-medium text-[#00632C] mb-1">
                    {"Archivo: \n"}
                  </label>
                  <a
                      href={`${API_BASE_URL}${formData.file_name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {"Ver archivo"}
                  </a>
                  <button
                      type="button"
                      onClick={handleDeleteFile}
                      className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
            ) : (
                showFileInput && (
                    <InputField
                        value=""
                        label="Cargar archivo"
                        placeholder="Seleccione un archivo PDF"
                        name="file"
                        type="file"
                        onChange={handleFileChange}
                        required={!editando}
                        accept="application/pdf"
                    />
                )
            )}
          </div>
          <div className="w-full">
            <Button type="submit" className="w-full bg-[#FFD700] text-[#00632C] hover:bg-[#80C68C]">
              {editando ? 'Actualizar Registro' : 'Agregar Registro'}
            </Button>
          </div>
        </form>
      </div>

      {/* Lista de registros sanitarios */}
      <div className="w-full lg:w-3/5 p-6 overflow-auto max-h-[calc(100vh-24rem)] lg:max-h-screen order-2 lg:order-none">
        <h2 className="text-2xl font-bold mb-6 text-[#00632C]">Lista de Registro Sanitario</h2>
        <BarraBusqueda placeholder="Buscar Registro Sanitario" busqueda={busqueda} setBusqueda={handleBusqueda} />
        <div className="space-y-4">
          {registrosPaginadas.length > 0 ? (
              registrosPaginadas.map((registro) => (
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
                        {"Ver Archivo"}
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
          ) : (
              <div className="text-center text-gray-500">No hay registros sanitarios disponibles.</div>
          )}
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

