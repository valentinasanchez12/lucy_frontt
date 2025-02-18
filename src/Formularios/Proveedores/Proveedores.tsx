"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { API_BASE_URL } from "../../utils/ApiUrl.tsx"
import BarraBusqueda from "../../components/Busqueda/BarraBusqueda.tsx"
import Paginacion from "../../components/Paginacion/Paginacion.tsx"
import InputField from "../../components/ui/InputFile.tsx"
import SelectField from "../../components/ui/SelectField.tsx"
import Toast from "../../components/ui/Toast"

type Proveedor = {
  id: string
  empresa: string
  tipoPersona: string
  nit: string
  asesor: string
  telefono: string
  email: string
  marcas: Array<{ uuid: string; name: string }>
}

type ApiProveedor = {
  uuid: string
  name: string
  nit: string
  types_person: string
  represent: string
  phone: string
  email: string
  brands: Array<{
    uuid: string
    name: string
  }>
}

type Brand = {
  uuid: string
  name: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

const emptyFormData: Omit<Proveedor, "id"> = {
  empresa: "",
  tipoPersona: "",
  nit: "",
  asesor: "",
  telefono: "",
  email: "",
  marcas: [],
}

const capitalizeWords = (str: string) => {
  return str.replace(/\b\w|\b\w(?=\w)/g, (char, index) => {
    if (index === 0 || str[index - 1] === " ") {
      return char.toUpperCase()
    }
    return char.toLowerCase()
  })
}

export default function RegistroProveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [formData, setFormData] = useState<Omit<Proveedor, "id">>(emptyFormData)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [busqueda, setBusqueda] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)
  const [toastMessage, setToastMessage] = useState<{ message: string; color?: string } | null>(null)
  const itemsPorPagina = 4

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

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  const fetchProveedores = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/provider/`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log("API Response:", data)
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
        throw new Error(data.response || "Failed to fetch providers")
      }
    } catch (error) {
      console.error("Fetch error:", error)
      if (error instanceof Error) {
        setToastMessage({ message: `Error fetching providers: ${error.message}` })
      } else {
        setToastMessage({ message: "Unknown error fetching providers" })
      }
      console.error("Error details:", JSON.stringify(error, null, 2))
    }
  }

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/brand/`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log("Brands API Response:", data)
      if (data.success) {
        setBrands(data.data)
      } else {
        setToastMessage({ message: data.response || "Failed to fetch brands" })
      }
    } catch (error) {
      console.error("Fetch brands error:", error)
      if (error instanceof Error) {
        setToastMessage({ message: `Error fetching brands: ${error.message}` })
      } else {
        setToastMessage({ message: "Unknown error fetching brands" })
      }
      console.error("Error details:", JSON.stringify(error, null, 2))
    }
  }

  const handleBusqueda = (nuevaBusqueda: string) => {
    setBusqueda(nuevaBusqueda)
    setPaginaActual(1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string) => (option: any) => {
    setFormData((prev) => ({ ...prev, [name]: option.value }))
  }

  const handleMarcaSelect = (brand: Brand) => {
    if (!formData.marcas.some((m) => m.uuid === brand.uuid)) {
      setFormData((prev) => ({
        ...prev,
        marcas: [...prev.marcas, { uuid: brand.uuid, name: brand.name.toLowerCase() }],
      }))
    }
    setSearchTerm("")
  }

  const handleRemoveMarca = (uuid: string) => {
    setFormData((prev) => ({ ...prev, marcas: prev.marcas.filter((m) => m.uuid !== uuid) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newProvider = {
      name: formData.empresa.toLowerCase(),
      nit: formData.nit.toLowerCase(),
      types_person: formData.tipoPersona,
      represent: formData.asesor.toLowerCase(),
      phone: formData.telefono,
      email: formData.email.toLowerCase(),
      brands: formData.marcas.map((marca) => ({ uuid: marca.uuid, name: marca.name.toLowerCase() })),
    }

    try {
      const url = editingId ? `${API_BASE_URL}/api/provider/${editingId}` : `${API_BASE_URL}/api/provider/`
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProvider),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log("API Response:", data)
      if (data.success) {
        if (editingId) {
          setProveedores((prev) => prev.map((p) => (p.id === editingId ? { ...formData, id: editingId } : p)))
          setEditingId(null)
          setToastMessage({ message: "Proveedor actualizado correctamente", color: "bg-green-500" })
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
          setProveedores((prev) => [...prev, newProveedor])
          setToastMessage({ message: "Proveedor registrado correctamente", color: "bg-green-500" })
        }
        setFormData(emptyFormData)
      } else {
        setToastMessage({ message: data.response || "Failed to save provider" })
      }
    } catch (error) {
      console.error("Submit error:", error)
      if (error instanceof Error) {
        setToastMessage({ message: `Error saving provider: ${error.message}` })
      } else {
        setToastMessage({ message: "Unknown error saving provider" })
      }
      console.error("Error details:", JSON.stringify(error, null, 2))
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/provider/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log("API Response:", data)
      if (data.success) {
        setProveedores((prev) => prev.filter((proveedor) => proveedor.id !== id))
        setToastMessage({ message: "Proveedor eliminado correctamente", color: "bg-green-500" })
      } else {
        throw new Error(data.response || "Failed to delete provider")
      }
    } catch (error) {
      console.error("Delete error:", error)
      if (error instanceof Error) {
        setToastMessage({ message: `Error deleting provider: ${error.message}` })
      } else {
        setToastMessage({ message: "Unknown error deleting provider" })
      }
      console.error("Error details:", JSON.stringify(error, null, 2))
    }
  }

  const handleEdit = (proveedor: Proveedor) => {
    setFormData(proveedor)
    setEditingId(proveedor.id)
  }

  const proveedoresFiltrados = proveedores.filter(
      (proveedor) =>
          proveedor.empresa.toLowerCase().includes(busqueda.toLowerCase()) ||
          proveedor.asesor.toLowerCase().includes(busqueda.toLowerCase()) ||
          proveedor.email.toLowerCase().includes(busqueda.toLowerCase()) ||
          proveedor.nit.toLowerCase().includes(busqueda.toLowerCase()) ||
          proveedor.telefono.toLowerCase().includes(busqueda.toLowerCase()) ||
          proveedor.tipoPersona.toLowerCase().includes(busqueda.toLowerCase()) ||
          proveedor.marcas.some((marca) => marca.name.toLowerCase().includes(busqueda.toLowerCase())),
  )

  const totalPaginas = Math.ceil(proveedoresFiltrados.length / itemsPorPagina)
  const indiceInicial = (paginaActual - 1) * itemsPorPagina
  const indiceFinal = indiceInicial + itemsPorPagina
  const proveedoresPaginados = proveedoresFiltrados.slice(indiceInicial, indiceFinal)

  const cambiarPagina = (pagina: number) => {
    setPaginaActual(pagina)
  }

  const filteredBrands = brands.filter(
      (brand) =>
          brand.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !formData.marcas.some((m) => m.uuid === brand.uuid),
  )

  useEffect(() => {
    setPaginaActual(1)
  }, [busqueda]) //This line was already correct. No changes needed.

  return (
      <div className="flex flex-col lg:flex-row min-h-screen bg-[#eeeeee]">
        {toastMessage && <Toast message={toastMessage.message} color={toastMessage.color} />}
        <div className="w-full lg:w-2/5 p-6 bg-white order-1 lg:order-none overflow-auto lg:overflow-visible">
          <h2 className="text-2xl font-bold mb-4 text-[#00632C]">
            {editingId !== null ? "Editar Proveedor" : "Registro de Proveedores"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <InputField
                  label="Nombre de la empresa"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleInputChange}
                  placeholder="Nombre de la empresa"
                  required
              />
            </div>
            <div>
              <SelectField
                  label="Tipo de persona"
                  placeholder="Seleccione un tipo"
                  name="tipoPersona"
                  value={formData.tipoPersona}
                  onChange={handleSelectChange("tipoPersona")}
                  options={[
                    { value: "Persona Natural", label: "Persona Natural" },
                    { value: "Persona Jurídica", label: "Persona Jurídica" },
                  ]}
                  required
              />
            </div>
            <div>
              <InputField
                  label="NIT"
                  name="nit"
                  value={formData.nit}
                  onChange={handleInputChange}
                  placeholder="NIT"
                  required
              />
            </div>
            <div>
              <InputField
                  label="Nombre del asesor comercial"
                  name="asesor"
                  value={formData.asesor}
                  onChange={handleInputChange}
                  placeholder="Nombre del asesor comercial"
                  required
              />
            </div>
            <div>
              <InputField
                  label="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="Teléfono"
                  required
              />
            </div>
            <div>
              <InputField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  required
              />
            </div>
            <div className="relative" ref={dropdownRef}>
              <InputField
                  label="Marcas"
                  name="marcas"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsDropdownOpen(true)}
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
                  <span
                      key={marca.uuid}
                      className="bg-[#80C68C] text-[#00632C] px-2 py-1 rounded-full text-sm flex items-center"
                  >
                {capitalizeWords(marca.name)}
                    <button type="button" onClick={() => handleRemoveMarca(marca.uuid)} className="ml-2 focus:outline-none">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                  >
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
              {editingId !== null ? "Actualizar Proveedor" : "Registrar Proveedor"}
            </button>
          </form>
        </div>
        <div className="w-full lg:w-3/5 p-6 overflow-auto max-h-[calc(100vh-24rem)] lg:max-h-screen order-2 lg:order-none">
          <h2 className="text-2xl font-bold mb-4 text-[#00632C]">Lista de Proveedores</h2>
          <BarraBusqueda placeholder="Buscar provedores" busqueda={busqueda} setBusqueda={handleBusqueda} />
          <div className="space-y-4">
            {proveedoresPaginados.map((proveedor) => (
                <div key={proveedor.id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between">
                    <div className="space-y-2 flex-grow">
                      <h3 className="text-2xl font-bold text-[#00632C]">{capitalizeWords(proveedor.empresa)}</h3>
                      <p className="text-[#333333]">
                        <strong>Tipo de persona:</strong> {proveedor.tipoPersona}
                      </p>
                      <p className="text-[#333333]">
                        <strong>NIT:</strong> {proveedor.nit.toUpperCase()}
                      </p>
                      <p className="text-[#333333]">
                        <strong>Asesor comercial:</strong> {capitalizeWords(proveedor.asesor)}
                      </p>
                      <p className="text-[#333333]">
                        <strong>Teléfono:</strong> {proveedor.telefono}
                      </p>
                      <p className="text-[#333333]">
                        <strong>Email:</strong> {proveedor.email}
                      </p>
                      <p className="text-[#333333]">
                        <strong>Marcas:</strong> {proveedor.marcas.map((marca) => capitalizeWords(marca.name)).join(", ")}
                      </p>
                    </div>
                    <div className="flex flex-col justify-end space-y-2 ml-4">
                      <button
                          className="bg-[#00632C] text-white p-2 rounded-md hover:bg-[#00632C]/80 transition duration-300"
                          onClick={() => handleEdit(proveedor)}
                      >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                          <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                          className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-300"
                          onClick={() => handleDelete(proveedor.id)}
                      >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                          <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
            ))}
          </div>
          <Paginacion paginaActual={paginaActual} totalPaginas={totalPaginas} cambiarPagina={cambiarPagina} />
        </div>
      </div>
  )
}

