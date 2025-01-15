import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FileText, Building2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CommentSection from './CommentSection'
import CharacteristicsSection from './CharacteristicsSection'
import ProviderModal from './ProviderModal'
import SanitaryRegistrySection from './SanitaryRegistrySection'
import ImageCarousel from './ImageCarousel'

export default function DetalleProducto() {
  const [currentImage, setCurrentImage] = useState(0)
  const [productData, setProductData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { uuid } = useParams()

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/product/${uuid}`)
        if (!response.ok) {
          throw new Error('Failed to fetch product data')
        }
        const data = await response.json()
        setProductData(data.data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
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
            <ImageCarousel
                images={productData.images}
                currentImage={currentImage}
                setCurrentImage={setCurrentImage}
            />
            <ProductDetails product={productData} />
          </div>

          <div className="p-6 space-y-6">
            <SanitaryRegistrySection registry={productData.sanitary_registry} />
            <DocumentSection title="Fichas Técnicas" documents={productData.technical_sheets} />
            <ProviderSection providers={productData.providers} />
            <CharacteristicsSection characteristics={productData.characteristics} />
            <CommentSection comments={productData.comments} />
          </div>
          <div className="flex justify-center mt-8 mb-8">
            <a href={`/formularios/productos/${productData.uuid}`} className="bg-[#00632C] text-white hover:bg-[#FFD700] hover:text-[#00632C] px-6 py-3 rounded-lg font-semibold transition-colors duration-300">
              Editar
            </a>
          </div>
        </div>
      </div>
  )
}

const ProductDetails = ({ product }) => {
  const [showFullDescription, setShowFullDescription] = useState(false)
  const truncatedDescription = product.description.split(' ').slice(0, 100).join(' ')

  return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[#00632C]">{product.generic_name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</h1>
        <div className="space-y-2">
          <p><strong className="text-[#00632C]">Nombre Comercial:</strong> {product.commercial_name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</p>
          <p><strong className="text-[#00632C]">Marca:</strong> {product.brand.name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</p>
          <div>
            <p><strong className="text-[#00632C]">Descripción:</strong> {showFullDescription
                ? product.description.charAt(0).toUpperCase() + product.description.slice(1).toLowerCase()
                : (truncatedDescription.charAt(0).toUpperCase() + truncatedDescription.slice(1).toLowerCase())}</p>
            {product.description.split(' ').length > 100 && (
                <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowFullDescription(!showFullDescription);
                    }}
                    className="mt-2 text-[#00632C] hover:text-[#FFD700] underline inline-block"
                >
                  {showFullDescription ? 'Ver menos' : 'Ver más'}
                </a>
            )}
          </div>
          <p><strong className="text-[#00632C]">Composición:</strong> {product.composition.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</p>
          <p><strong className="text-[#00632C]">Unidad de Medida:</strong> {product.measurement.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</p>
          <p><strong className="text-[#00632C]">Presentación:</strong> {product.formulation.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</p>
          <p><strong className="text-[#00632C]">Referencia del Producto:</strong> {product.reference.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</p>
          <p><strong className="text-[#00632C]">Uso:</strong> {product.use.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</p>
          <p><strong className="text-[#00632C]">Método de Esterilizar:</strong> {product.sanitize_method.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</p>
        </div>
      </div>
  )
}

const ProviderSection = function({ providers }) {
  const [selectedProvider, setSelectedProvider] = useState(null)

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, l => l.toUpperCase());
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
                      <Building2 className="h-6 w-6 text-[#00632C]" />
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
        {selectedProvider && (
            <ProviderModal
                provider={selectedProvider}
                onClose={() => setSelectedProvider(null)}
            />
        )}
      </>
  )
}

const DocumentSection = ({title, documents}) => {
  return (
      <div className="bg-[#80C68C] rounded-lg shadow">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-[#00632C] mb-4">{title}</h2>
          {documents && documents.length > 0 ? (
              <ul className="space-y-2">
                {documents.map((doc, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="text-[#00632C]" />
                        <a
                            href={doc.documents}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#00632C] hover:text-[#FFD700]"
                        >
                          {`Documento ${index + 1}`}
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

