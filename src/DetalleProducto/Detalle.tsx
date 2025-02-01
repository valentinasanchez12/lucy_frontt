import { useState, useEffect, Key} from "react"
import {useParams} from "react-router-dom"
import {FileText, Building2} from "lucide-react"
import CommentSection, {Comment} from "./CommentSection.tsx"
import CharacteristicsSection, {Characteristic} from "./CharacteristicsSection.tsx"
import ProviderModal from "./ProviderModal.tsx"
import SanitaryRegistrySection, {SanitaryRegistry} from "./SanitaryRegistrySection.tsx"
import ImageCarousel from "./ImageCarousel.tsx"
import {API_BASE_URL} from "../utils/ApiUrl.tsx";


interface ProductData {
  uuid: string;
  generic_name: string;
  description: string;
  commercial_name: string;
  brand: { name: string };
  composition: string;
  measurement: string;
  formulation: string;
  reference: string;
  use: string;
  sanitize_method: string;
  iva: boolean;
  images: string[];
  sanitary_registry: SanitaryRegistry | null;
  technical_sheets: { documents: string }[];
  providers: Provider[];
  comments: Comment[];
  characteristics: Characteristic[];
}

interface DocumentSectionProps {
  title: string;
  documents: { documents: string | undefined }[];
}

export default function DetalleProducto() {
  const [currentImage, setCurrentImage] = useState(0)
  const [productData, setProductData] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const {uuid} = useParams()

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/product/${uuid}`)
        if (!response.ok) {
          throw new Error("Failed to fetch product data")
        }
        const data = await response.json()
        setProductData(data.data)
        setLoading(false)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ocurrió un error desconocido.");
        }
        setLoading(false);
      }
    }

    fetchProductData()
  }, [uuid])

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>
  }

  if (!productData) {
    return <div className="text-center">No se encontró información del producto.</div>
  }

  return (
      <div className="min-h-screen bg-[#eeeeee] text-[#333333] p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <ImageCarousel images={productData.images} currentImage={currentImage} setCurrentImage={setCurrentImage}/>
            <ProductDetails product={productData}/>
          </div>

          <div className="p-6 space-y-6">
            <CharacteristicsSection characteristics={productData.characteristics}/>
            <SanitaryRegistrySection registry={productData.sanitary_registry}/>
            <DocumentSection title="Fichas Técnicas" documents={productData.technical_sheets}/>
            <ProviderSection providers={productData.providers || []}/>
            <CommentSection comments={productData.comments || []} productId={productData.uuid}/>
          </div>
          <div className="flex justify-center mt-8 mb-8">
            <a
                href={`/formularios/productos/editar/${productData.uuid}`}
                className="bg-[#00632C] text-white hover:bg-[#FFD700] hover:text-[#00632C] px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              Editar
            </a>
          </div>
        </div>
      </div>
  )
}


const ProductDetails = ({product}: { product: ProductData }) => {
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showFullComposition, setShowFullComposition] = useState(false);
  const [showFullUse, setShowFullUse] = useState(false);

  const truncatedDescription = product.description.split(" ").slice(0, 30).join(" ")
  const truncatedComposition = product.composition.split(" ").slice(0, 30).join(" ");
  const truncatedUse = product.use.split(" ").slice(0, 30).join(" ");

  return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[#00632C]">
          {product.generic_name
              .split(" ")
              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(" ")}
        </h1>
        <div className="space-y-2">
          <p>
            <strong className="text-[#00632C]">Nombre Comercial:</strong>{" "}
            {product.commercial_name
                .split(" ")
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" ")}
          </p>
          <p>
            <strong className="text-[#00632C]">Marca:</strong>{" "}
            {product.brand.name
                .split(" ")
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" ")}
          </p>
          <div>
            <p style={{ whiteSpace: "pre-line" }}>
              <strong className="text-[#00632C]">Descripción:</strong>{" "}
              {showFullDescription
                  ? product.description.charAt(0).toUpperCase() + product.description.slice(1).toLowerCase()
                  : truncatedDescription.charAt(0).toUpperCase() + truncatedDescription.slice(1).toLowerCase()}
            </p>
            {product.description.split(" ").length > 30 && (
                <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowFullDescription(!showFullDescription)
                    }}
                    className="mt-2 text-[#00632C] hover:text-[#FFD700] underline inline-block"
                >
                  {showFullDescription ? "Ver menos" : "Ver más"}
                </a>
            )}
          </div>
          <p style={{ whiteSpace: "pre-line" }}>
            <strong className="text-[#00632C]">Composición:</strong>{" "}
            {showFullComposition
                ? product.composition.charAt(0).toUpperCase() + product.composition.slice(1).toLowerCase()
                : truncatedComposition.charAt(0).toUpperCase() + truncatedComposition.slice(1).toLowerCase()}
          </p>
          {product.composition.split(" ").length > 30 && (
              <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowFullComposition(!showFullComposition);
                  }}
                  className="mt-2 text-[#00632C] hover:text-[#FFD700] underline inline-block"
              >
                {showFullComposition ? "Ver menos" : "Ver más"}
              </a>
          )}
          <p>
            <strong className="text-[#00632C]">Unidad de Medida:</strong>{" "}
            {product.measurement
                .split(" ")
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" ")}
          </p>
          <p>
            <strong className="text-[#00632C]">Presentación:</strong>{" "}
            {product.formulation
                .split(" ")
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" ")}
          </p>
          <p style={{ whiteSpace: "pre-line" }}>
            <strong className="text-[#00632C]">Referencia del Producto:</strong>{" "}
            {product.reference
                .split(" ")
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" ")}
          </p>
          <p style={{ whiteSpace: "pre-line" }}>
            <strong className="text-[#00632C]">Uso:</strong>{" "}
            {showFullUse
                ? product.use.charAt(0).toUpperCase() + product.use.slice(1).toLowerCase()
                : truncatedUse.charAt(0).toUpperCase() + truncatedUse.slice(1).toLowerCase()}
          </p>
          {product.use.split(" ").length > 30 && (
              <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowFullUse(!showFullUse);
                  }}
                  className="mt-2 text-[#00632C] hover:text-[#FFD700] underline inline-block"
              >
                {showFullUse ? "Ver menos" : "Ver más"}
              </a>
          )}
          <p>
            <strong className="text-[#00632C]">Método de Esterilizar:</strong>{" "}
            {product.sanitize_method
                .split(" ")
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" ")}
          </p>
          <p>
            <strong className="text-[#00632C]">IVA:</strong> {product.iva ? "Sí" : "No"}
          </p>
        </div>
      </div>
  )
}

interface Provider {
  uuid: string;
  nit: string;
  types_person: string;
  name: string;
  represent: string;
  phone: string;
  email: string;
}

const ProviderSection = ({providers}: { providers: Provider[] }) => {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)

  if (!providers || providers.length === 0) {
    return (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-[#00632C] mb-4">Proveedores</h2>
            <p className="text-gray-500">No hay proveedores disponibles.</p>
          </div>
        </div>
    )
  }

  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, (l) => l.toUpperCase())
  }



  return (
      <>
        <div className="bg-white rounded-lg shadow">
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-[#00632C] mb-4">Proveedores</h2>
            <ul className="space-y-4">
              {providers.map((provider, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-6 w-6 text-[#00632C]"/>
                      <div>
                        <p className="font-semibold">{capitalizeWords(provider.name)}</p>
                        <p className="text-sm">NIT: {provider.nit}</p>
                      </div>
                    </div>
                    <button
                        onClick={() => setSelectedProvider(provider)}
                        className="bg-[#FFD700] text-[#00632C] hover:bg-[#00632C] hover:text-[#FFD700] px-4 py-2 rounded"
                    >
                      Ver Detalle
                    </button>
                  </li>
              ))}
            </ul>
          </div>
        </div>
        {selectedProvider && <ProviderModal provider={selectedProvider} onClose={() => setSelectedProvider(null)}/>}
      </>
  )
}

const DocumentSection = ({title, documents}: DocumentSectionProps) => {
  return (
      <div className="bg-[#80C68C] rounded-lg shadow">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-[#00632C] mb-4">{title}</h2>
          {documents && documents.length > 0 ? (
              <ul className="space-y-2">
                {documents.map((doc: { documents: string | undefined }, index: Key | null | undefined) => (
                    <li key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="text-[#00632C]" />
                        <a
                            href={`${API_BASE_URL}${doc.documents}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#00632C] hover:text-[#FFD700]"
                        >
                          {`Documento ${Number(index ?? 0) + 1}`}
                        </a>
                      </div>
                    </li>
                ))}
              </ul>
          ) : (
              <p className="text-[#00632C]">No hay documentos disponibles.</p>
          )}
        </div>
      </div>
  )
}

