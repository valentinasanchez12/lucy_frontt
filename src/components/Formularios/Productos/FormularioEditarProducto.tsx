import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { QueryClient, QueryClientProvider, useQuery } from "react-query"
import Select from "react-select"
import { useDropzone } from "react-dropzone"
import { X, Plus } from "lucide-react"
import { useParams } from "react-router-dom"

// Create a client
const queryClient = new QueryClient()

// Types
type Producto = {
    uuid?: string
    nombreGenerico: string
    nombreComercial: string
    descripcion: string
    unidadMedida: string
    presentacion: string
    composicion: string
    referencia: string
    uso: string
    metodoEsterilizar: string
    marca: string
    categoria: string
    registroSanitario: string
    estado: boolean
    iva: boolean
    characteristics: Characteristic[]
    images: string[]
    technicalSheets: TechnicalSheet[]
    providers: Provider[]
}

type Characteristic = {
    uuid: string
    characteristic: string
    description: string
}

type TechnicalSheet = {
    uuid: string
    documents: string
}

type Provider = {
    uuid: string
    nit: string
    types_person: string
    name: string
    represent: string
    phone: string
    email: string
}

type Option = {
    value: string
    label: string
}

type TechnicalSheetData = {
    file: File | null
    url: string | null
    isDeleted: boolean
}

// Components
const InputField: React.FC<{
    label: string
    name: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    placeholder: string
    isTextarea?: boolean
}> = ({ label, name, value, onChange, placeholder, isTextarea = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-[#00632C] mb-1">
            {label}
        </label>
        {isTextarea ? (
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={4}
                className="w-full p-2 border border-[#80C68C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00873D]"
            />
        ) : (
            <input
                type="text"
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full p-2 border border-[#80C68C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00873D]"
            />
        )}
    </div>
)

const SelectField: React.FC<{
    label: string
    name: string
    options: Option[]
    onChange: (option: any) => void
    placeholder: string
    value: string
    isMulti?: boolean
}> = ({ label, name, options, onChange, placeholder, value, isMulti = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-[#00632C] mb-1">
            {label}
        </label>
        <Select
            options={options}
            placeholder={placeholder}
            styles={customSelectStyles}
            onChange={onChange}
            isMulti={isMulti}
            className="react-select-container"
            classNamePrefix="react-select"
            value={options.find((option) => option.value === value)}
        />
    </div>
)

const ImageDropzone: React.FC<{
    onDrop: (acceptedFiles: File[]) => void
    imagenes: File[]
    existingImages: string[]
    onDeleteExisting: (index: number) => void
    onDeleteNew: (index: number) => void
}> = ({ onDrop, imagenes, existingImages, onDeleteExisting, onDeleteNew }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: true,
    })

    return (
        <div>
            <label className="block text-sm font-medium text-[#00632C] mb-1">Imágenes del Producto</label>
            <div
                {...getRootProps()}
                className={`p-6 mt-1 border-2 border-dashed rounded-md ${
                    isDragActive ? "border-[#00873D] bg-[#e6f4ea]" : "border-[#80C68C]"
                }`}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-center text-[#00632C]">Suelta las imágenes aquí...</p>
                ) : (
                    <p className="text-center text-[#00632C]">
                        Arrastra y suelta imágenes aquí, o haz clic para seleccionar archivos
                    </p>
                )}
            </div>
            {imagenes.length > 0 && (
                <div className="mt-4">
                    <p className="text-sm font-medium text-[#00632C] mb-2">Nuevas imágenes:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imagenes.map((file, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={URL.createObjectURL(file) || "/placeholder.svg"}
                                    alt={`New image ${index + 1}`}
                                    className="w-full h-auto rounded-md"
                                />
                                <button
                                    type="button"
                                    onClick={() => onDeleteNew(index)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1"
                                    aria-label={`Delete new image ${index + 1}`}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {existingImages.length > 0 && (
                <div className="mt-4">
                    <p className="text-sm font-medium text-[#00632C] mb-2">Imágenes existentes:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {existingImages.map((url, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={url || "/placeholder.svg"}
                                    alt={`Existing image ${index + 1}`}
                                    className="w-full h-auto rounded-md"
                                />
                                <button
                                    type="button"
                                    onClick={() => onDeleteExisting(index)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1"
                                    aria-label={`Delete image ${index + 1}`}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

const Switch: React.FC<{
    checked: boolean
    onChange: (checked: boolean) => void
    label: string
}> = ({ checked, onChange, label }) => (
    <label className="flex items-center cursor-pointer">
        <div className="relative">
            <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <div
                className={`block w-14 h-8 rounded-full transition-colors duration-200 ease-in-out ${
                    checked ? "bg-[#00873D]" : "bg-gray-600"
                }`}
            ></div>
            <div
                className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out ${
                    checked ? "transform translate-x-6" : ""
                }`}
            ></div>
        </div>
        <div className="ml-3 text-sm font-medium text-[#00632C]">{label}</div>
    </label>
)

const ErrorMessage: React.FC<{ message: string; onDismiss: () => void }> = ({ message, onDismiss }) => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <span className="block sm:inline">{message}</span>
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={onDismiss}>
      <X className="h-6 w-6 text-red-500" />
    </span>
    </div>
)

// Styles for selects
const customSelectStyles = {
    control: (provided: any) => ({
        ...provided,
        borderColor: "#80C68C",
        "&:hover": {
            borderColor: "#00873D",
        },
    }),
    option: (provided: any, state: { isSelected: any }) => ({
        ...provided,
        backgroundColor: state.isSelected ? "#00873D" : "white",
        color: state.isSelected ? "white" : "#333333",
        "&:hover": {
            backgroundColor: "#00632C",
            color: "white",
        },
    }),
    multiValue: (provided: any) => ({
        ...provided,
        backgroundColor: "#80C68C",
    }),
    multiValueLabel: (provided: any) => ({
        ...provided,
        color: "#333333",
    }),
    multiValueRemove: (provided: any) => ({
        ...provided,
        color: "#333333",
        "&:hover": {
            backgroundColor: "#00632C",
            color: "white",
        },
    }),
}

const capitalizeWords = (str: string) => {
    return str.replace(/\b\p{L}[\p{L}'-]*\b/gu, (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
}

// Functions to fetch data from API
const fetchMarcas = async (): Promise<Option[]> => {
    const response = await fetch("http://localhost:8080/api/brand")
    if (!response.ok) {
        throw new Error("Error fetching brands")
    }
    const result = await response.json()

    if (result && typeof result === "object" && Array.isArray(result.data)) {
        return result.data.map((brand: any) => ({
            value: brand.uuid || "",
            label: capitalizeWords(brand.name || ""),
        }))
    }

    console.error("Unexpected data format for brands:", result)
    return []
}

const fetchCategorias = async (): Promise<Option[]> => {
    const response = await fetch("http://localhost:8080/api/category")
    if (!response.ok) {
        throw new Error("Error fetching categories")
    }
    const result = await response.json()

    if (result && typeof result === "object" && Array.isArray(result.data)) {
        return result.data.map((category: any) => ({
            value: category.uuid || "",
            label: capitalizeWords(category.name || ""),
        }))
    }

    console.error("Unexpected data format for categories:", result)
    return []
}

const fetchRegistrosSanitarios = async (): Promise<Option[]> => {
    const response = await fetch("http://localhost:8080/api/sanitary-registry")
    if (!response.ok) {
        throw new Error("Error fetching sanitary registries")
    }
    const result = await response.json()

    if (result && typeof result === "object" && Array.isArray(result.data)) {
        return result.data.map((registry: any) => ({
            value: registry.uuid || "",
            label: (registry.number_registry || "").toUpperCase(),
        }))
    }

    console.error("Unexpected data format for sanitary registries:", result)
    return []
}

// Function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            if (typeof reader.result === "string") {
                // Remove the Data-URL declaration
                const base64String = reader.result.split(",")[1]
                resolve(base64String)
            } else {
                reject(new Error("Failed to read file as base64."))
            }
        }
        reader.onerror = (error) => reject(error)
        reader.readAsDataURL(file)
    })
}

// Function to fetch product data
const fetchProductData = async (uuid: string): Promise<Producto> => {
    const response = await fetch(`http://localhost:8080/api/product/${uuid}`)
    if (!response.ok) {
        throw new Error("Error fetching product data")
    }
    const result = await response.json()
    const data = result.data

    return {
        uuid: data.uuid,
        nombreGenerico: data.generic_name,
        nombreComercial: data.commercial_name,
        descripcion: data.description,
        unidadMedida: data.measurement,
        presentacion: data.formulation,
        composicion: data.composition,
        referencia: data.reference,
        uso: data.use,
        metodoEsterilizar: data.sanitize_method,
        marca: data.brand.uuid,
        categoria: data.category.uuid,
        registroSanitario: data.sanitary_registry.uuid,
        estado: data.status === "True",
        iva: data.iva || false,
        characteristics: data.characteristics.map((char: any) => ({
            uuid: char.uuid,
            characteristic: char.characteristic,
            description: char.description,
        })),
        images: data.images,
        technicalSheets: data.technical_sheets,
        providers: data.providers,
    }
}

// Main component
const FormularioEditarProductoInterno: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>()
    const [producto, setProducto] = useState<Producto>({
        nombreGenerico: "",
        nombreComercial: "",
        descripcion: "",
        unidadMedida: "",
        presentacion: "",
        composicion: "",
        referencia: "",
        uso: "",
        metodoEsterilizar: "",
        marca: "",
        categoria: "",
        registroSanitario: "",
        estado: true,
        iva: false,
        characteristics: [],
        images: [],
        technicalSheets: [],
        providers: [],
    })

    const [newImageFiles, setNewImageFiles] = useState<File[]>([])
    const [technicalSheetData, setTechnicalSheetData] = useState<TechnicalSheetData>({
        file: null,
        url: null,
        isDeleted: false,
    })

    const [marcasError, setMarcasError] = useState<string | null>(null)
    const [categoriasError, setCategoriasError] = useState<string | null>(null)
    const [registrosSanitariosError, setRegistrosSanitariosError] = useState<string | null>(null)

    const { data: marcas = [], error: marcasQueryError } = useQuery("marcas", fetchMarcas, {
        onError: (error: any) => setMarcasError(`Error al cargar las marcas: ${error.message}`),
    })
    const { data: categorias = [], error: categoriasQueryError } = useQuery("categorias", fetchCategorias, {
        onError: (error: any) => setCategoriasError(`Error al cargar las categorías: ${error.message}`),
    })
    const { data: registrosSanitarios = [], error: registrosSanitariosQueryError } = useQuery(
        "registrosSanitarios",
        fetchRegistrosSanitarios,
        {
            onError: (error: any) =>
                setRegistrosSanitariosError(`Error al cargar los registros sanitarios: ${error.message}`),
        },
    )

    useEffect(() => {
        if (uuid) {
            fetchProductData(uuid)
                .then((data) => {
                    setProducto(data)
                    setNewImageFiles([])
                    // Set the technical sheet
                    if (data.technicalSheets.length > 0) {
                        setTechnicalSheetData({
                            file: null,
                            url: data.technicalSheets[0].documents,
                            isDeleted: false,
                        })
                    }
                })
                .catch((error) => {
                    console.error("Error fetching product data:", error)
                })
        }
    }, [uuid])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setProducto((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string) => (option: any) => {
        setProducto((prev) => ({ ...prev, [name]: option.value }))
    }

    const onDropImages = useCallback((acceptedFiles: File[]) => {
        setNewImageFiles((prevFiles) => [...prevFiles, ...acceptedFiles])
    }, [])

    const handleTechnicalSheetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setTechnicalSheetData({
                file: e.target.files[0],
                url: null,
                isDeleted: false,
            })
        }
    }

    const handleDeleteTechnicalSheet = () => {
        setTechnicalSheetData({
            file: null,
            url: null,
            isDeleted: true,
        })
    }

    const handleCharacteristicChange = (index: number, field: "name" | "description", value: string) => {
        const updatedCharacteristics = [...producto.characteristics]
        updatedCharacteristics[index] = {
            ...updatedCharacteristics[index],
            [field === "name" ? "characteristic" : field]: value,
        }
        setProducto((prev) => ({ ...prev, characteristics: updatedCharacteristics }))
    }

    const addCharacteristic = () => {
        setProducto((prev) => ({
            ...prev,
            characteristics: [...prev.characteristics, { uuid: Date.now().toString(), characteristic: "", description: "" }],
        }))
    }

    const removeCharacteristic = (index: number) => {
        setProducto((prev) => ({
            ...prev,
            characteristics: prev.characteristics.filter((_, i) => i !== index),
        }))
    }

    const validateFiles = (files: File[], allowedTypes: string[]): boolean => {
        return files.every((file) => allowedTypes.includes(file.type))
    }

    const handleDeleteExistingImage = (index: number) => {
        setProducto((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }))
    }

    const handleDeleteNewImage = (index: number) => {
        setNewImageFiles((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Prepare data for submission
        const keyMapping: { [key: string]: string } = {
            nombreGenerico: "generic_name",
            nombreComercial: "commercial_name",
            descripcion: "description",
            unidadMedida: "measurement",
            presentacion: "formulation",
            composicion: "composition",
            referencia: "reference",
            uso: "use",
            metodoEsterilizar: "sanitize_method",
            marca: "brand",
            categoria: "category",
            registroSanitario: "sanitary_register",
            estado: "status",
        }

        const lowercaseValue = (value: any): any => {
            if (typeof value === "string") {
                return value.toLowerCase()
            } else if (Array.isArray(value)) {
                return value.map(lowercaseValue)
            } else if (typeof value === "object" && value !== null) {
                return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, lowercaseValue(v)]))
            }
            return value
        }

        const mappedProducto = Object.entries(producto).reduce(
            (acc, [key, value]) => {
                const newKey = keyMapping[key] || key
                acc[newKey] = lowercaseValue(value)
                return acc
            },
            {} as { [key: string]: any },
        )

        const productData = {
            ...mappedProducto,
            iva: producto.iva,
            images: await Promise.all([
                ...producto.images.map(async (url) => ({
                    file_name: url.split("/").pop() || "",
                    file_content: url,
                })),
                ...newImageFiles.map(async (file) => ({
                    file_name: file.name,
                    file_content: await fileToBase64(file),
                })),
            ]),
            technical_sheet: technicalSheetData.isDeleted
                ? null
                : technicalSheetData.file
                    ? {
                        file_name: technicalSheetData.file.name,
                        file_content: await fileToBase64(technicalSheetData.file),
                    }
                    : technicalSheetData.url
                        ? {
                            file_name: technicalSheetData.url.split("/").pop() || "",
                            file_content: technicalSheetData.url,
                        }
                        : null,
        }

        try {
            const url = `http://localhost:8080/api/product/${uuid}`
            const method = "PUT"

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.response || "Error updating product")
            }

            console.log("Product updated successfully:", result)
            alert("Producto actualizado exitosamente")
            // Redirect to product list page
            window.location.href = "/"
        } catch (error) {
            console.error("Error updating product:", error)
            alert(`Error al actualizar el producto: ${error.message}`)
        }
    }

    return (
        <div className="min-h-screen bg-[#eeeeee] text-[#333333] p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6 text-[#00632C]">Editar Producto</h1>

                {marcasError && <ErrorMessage message={marcasError} onDismiss={() => setMarcasError(null)} />}
                {categoriasError && <ErrorMessage message={categoriasError} onDismiss={() => setCategoriasError(null)} />}
                {registrosSanitariosError && (
                    <ErrorMessage message={registrosSanitariosError} onDismiss={() => setRegistrosSanitariosError(null)} />
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            label="Nombre Genérico"
                            name="nombreGenerico"
                            value={producto.nombreGenerico}
                            onChange={handleInputChange}
                            placeholder="Ingrese el nombre genérico"
                        />
                        <InputField
                            label="Nombre Comercial"
                            name="nombreComercial"
                            value={producto.nombreComercial}
                            onChange={handleInputChange}
                            placeholder="Ingrese el nombre comercial"
                        />
                    </div>

                    <InputField
                        label="Descripción"
                        name="descripcion"
                        value={producto.descripcion}
                        onChange={handleInputChange}
                        placeholder="Ingrese la descripción del producto"
                        isTextarea
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            label="Unidad de Medida"
                            name="unidadMedida"
                            value={producto.unidadMedida}
                            onChange={handleInputChange}
                            placeholder="Ej: kg, litros, unidades"
                        />
                        <InputField
                            label="Presentación"
                            name="presentacion"
                            value={producto.presentacion}
                            onChange={handleInputChange}
                            placeholder="Ej: Caja de 10 unidades"
                        />
                    </div>

                    <InputField
                        label="Composición"
                        name="composicion"
                        value={producto.composicion}
                        onChange={handleInputChange}
                        placeholder="Ingrese la composición del producto"
                        isTextarea
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            label="Referencia del Producto"
                            name="referencia"
                            value={producto.referencia}
                            onChange={handleInputChange}
                            placeholder="Ingrese la referencia"
                        />
                        <InputField
                            label="Uso"
                            name="uso"
                            value={producto.uso}
                            onChange={handleInputChange}
                            placeholder="Ingrese el uso del producto"
                        />
                    </div>

                    <InputField
                        label="Método de Esterilizar"
                        name="metodoEsterilizar"
                        value={producto.metodoEsterilizar}
                        onChange={handleInputChange}
                        placeholder="Ingrese el método de esterilización"
                    />

                    <ImageDropzone
                        onDrop={onDropImages}
                        imagenes={newImageFiles}
                        existingImages={producto.images}
                        onDeleteExisting={handleDeleteExistingImage}
                        onDeleteNew={handleDeleteNewImage}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SelectField
                            label="Marca"
                            name="marca"
                            options={marcas}
                            onChange={handleSelectChange("marca")}
                            placeholder="Seleccione una marca"
                            value={producto.marca}
                        />
                        <SelectField
                            label="Categoría"
                            name="categoria"
                            options={categorias}
                            onChange={handleSelectChange("categoria")}
                            placeholder="Seleccione una categoría"
                            value={producto.categoria}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="technicalSheet" className="block text-sm font-medium text-[#00632C] mb-1">
                                Ficha Técnica
                            </label>
                            {technicalSheetData.url && !technicalSheetData.isDeleted ? (
                                <div className="flex items-center space-x-2 mb-2">
                                    <a
                                        href={technicalSheetData.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                        Ver ficha técnica actual
                                    </a>
                                    <button
                                        type="button"
                                        onClick={handleDeleteTechnicalSheet}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : technicalSheetData.file ? (
                                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-green-600">
                    Nueva ficha técnica seleccionada: {technicalSheetData.file.name}
                  </span>
                                    <button
                                        type="button"
                                        onClick={() => setTechnicalSheetData({ file: null, url: null, isDeleted: false })}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <input
                                    type="file"
                                    id="technicalSheet"
                                    onChange={handleTechnicalSheetChange}
                                    accept=".pdf,image/*"
                                    className="w-full p-2 border border-[#80C68C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00873D]"
                                />
                            )}
                        </div>
                        <SelectField
                            label="Registro Sanitario"
                            name="registroSanitario"
                            options={registrosSanitarios}
                            onChange={handleSelectChange("registroSanitario")}
                            placeholder="Seleccione un registro sanitario"
                            value={producto.registroSanitario}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <Switch
                            checked={producto.estado}
                            onChange={(checked) => setProducto((prev) => ({ ...prev, estado: checked }))}
                            label={`Estado (${producto.estado ? "Activo" : "Inactivo"})`}
                        />
                        <Switch
                            checked={producto.iva}
                            onChange={(checked) => setProducto((prev) => ({ ...prev, iva: checked }))}
                            label={`IVA (${producto.iva ? "Aplicado" : "No Aplicado"})`}
                        />
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-[#00632C]">Características</h2>
                        {producto.characteristics.map((characteristic, index) => (
                            <div key={characteristic.uuid} className="flex space-x-4 items-start">
                                <div className="flex-1">
                                    <InputField
                                        label="Nombre de la Característica"
                                        name={`characteristic-name-${index}`}
                                        value={characteristic.characteristic}
                                        onChange={(e) => handleCharacteristicChange(index, "name", e.target.value)}
                                        placeholder="Ej: Color, Tamaño, Material"
                                    />
                                </div>
                                <div className="flex-1">
                                    <InputField
                                        label="Descripción de la Característica"
                                        name={`characteristic-description-${index}`}
                                        value={characteristic.description}
                                        onChange={(e) => handleCharacteristicChange(index, "description", e.target.value)}
                                        placeholder="Describa la característica"
                                    />
                                </div>
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removeCharacteristic(index)}
                                        className="mt-7 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addCharacteristic}
                            className="flex items-center space-x-2 text-[#00632C] hover:text-[#00873D] transition-colors duration-200"
                        >
                            <Plus className="h-5 w-5" />
                            <span>Agregar Característica</span>
                        </button>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[#FFD700] text-[#333333] rounded-full hover:bg-[#00632C] hover:text-white transition-colors duration-200"
                        >
                            Actualizar Producto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// Wrap the component with QueryClientProvider
const FormularioEditarProducto: React.FC = () => (
    <QueryClientProvider client={queryClient}>
        <FormularioEditarProductoInterno />
    </QueryClientProvider>
)

export default FormularioEditarProducto

