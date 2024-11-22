import React, { useState } from 'react'
import { FileText, ChevronLeft, ChevronRight, Building2, ImageIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Simulamos un array de imágenes para el producto
const productImages = [
  'https://tenacol.vtexassets.com/arquivos/ids/156651-1200-auto?v=638508612352700000&width=1200&height=auto&aspect=true',
  'https://tenacol.vtexassets.com/arquivos/ids/156657-1200-auto?v=638508613981270000&width=1200&height=auto&aspect=true',
  'https://tenacol.vtexassets.com/arquivos/ids/156652-1200-auto?v=638508612468770000&width=1200&height=auto&aspect=true',
  'https://ceminsumosas.com/wp-content/uploads/2024/02/SLIP-ULTRA-XL-600x421.png',
  'https://ceminsumosas.com/wp-content/uploads/2024/02/SLIP-ULTRA-S-1-600x455.png',
]

const ImageCarousel = ({ images, currentImage, setCurrentImage }) => {
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-200 rounded-lg">
        <ImageIcon className="w-16 h-16 text-gray-400" />
        <p className="ml-2 text-gray-500">No hay imágenes disponibles</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square">
        <img
          src={images[currentImage]}
          alt={`Imagen del producto ${currentImage + 1}`}
          className="rounded-lg object-cover w-full h-full"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = 'https://via.placeholder.com/800x800?text=Imagen+no+disponible'
          }}
        />
        <button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-200 hover:bg-[#FFD700] bg-white bg-opacity-50"
          onClick={prevImage}
        >
          <ChevronLeft className="h-8 w-8 text-[#00632C]" />
          <span className="sr-only">Imagen anterior</span>
        </button>
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-200 hover:bg-[#FFD700] bg-white bg-opacity-50"
          onClick={nextImage}
        >
          <ChevronRight className="h-8 w-8 text-[#00632C]" />
          <span className="sr-only">Siguiente imagen</span>
        </button>
      </div>
      <div className="grid grid-cols-5 gap-2 mt-4">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`flex-shrink-0 ${currentImage === index ? 'ring-2 ring-[#00632C]' : ''}`}
          >
            <img
              src={img}
              alt={`Miniatura ${index + 1}`}
              className="rounded-md object-cover w-full h-auto aspect-square"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = 'https://via.placeholder.com/100x100?text=No+disponible'
              }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

const ProductDetails = ({ fullDescription }) => {
  const [showFullDescription, setShowFullDescription] = useState(false)
  const truncatedDescription = fullDescription.split(' ').slice(0, 100).join(' ')

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#00632C]">PAÑAL ADULTO</h1>
      <div className="space-y-2">
        <p><strong className="text-[#00632C]">Nombre Comercial:</strong> PAÑAL TENA SLIP ULTRA</p>
        <p><strong className="text-[#00632C]">Marca:</strong> tena</p>
        <div>
          <p><strong className="text-[#00632C]">Descripción:</strong> {showFullDescription ? fullDescription : truncatedDescription}</p>
          {fullDescription.split(' ').length > 100 && (
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
        <p><strong className="text-[#00632C]">Composición:</strong> TENASORB</p>
        <p><strong className="text-[#00632C]">Unidad de Medida:</strong> unidad</p>
        <p><strong className="text-[#00632C]">Presentación:</strong> paquete x 30</p>
        <p><strong className="text-[#00632C]">Referencia del Producto:</strong> 11111111</p>
        <p><strong className="text-[#00632C]">Uso:</strong> Descripción del uso recomendado del producto</p>
        <p><strong className="text-[#00632C]">Método de Esterilizar:</strong> producto no esteril</p>
      </div>
    </div>
  )
}

const DocumentSection = ({ title, documents }) => (
  <div className="bg-[#80C68C] rounded-lg shadow">
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-[#00632C] mb-4">{title}</h2>
      <ul className="space-y-2">
        {documents.map((doc, index) => (
          <li key={index} className="flex items-center space-x-2">
            <FileText className="text-[#00632C]" />
            <a href="#" className="text-[#00632C] hover:text-[#FFD700]">{doc}</a>
          </li>
        ))}
      </ul>
    </div>
  </div>
)

const ProviderSection = function({ providers }){
  const navigate = useNavigate()
  const handleClick = () => {
    navigate("/formularios/proveedores")
  
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
                <p className="font-semibold">{provider.name}</p>
                <p className="text-sm">Asesora: {provider.advisor}</p>
              </div>
            </div>
            <button onClick={handleClick} className="bg-[#FFD700] text-[#00632C] hover:bg-[#00632C] hover:text-[#FFD700] px-4 py-2 rounded">
              Ver Detalle
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
    </>
  )

} 

export default function DetalleProducto() {
  const [currentImage, setCurrentImage] = useState(0)
 
  const fullDescription = "Pañal para hombres y mujeres. Es el absorbente más completo y con mejor desempeño para el manejo de la incontinencia fuerte a severa, para personas con poca o ninguna capacidad de movimiento y dependientes de un cuidador. Con alta y avanzada tecnología TENASORB que gelatiniza los líquidos y ayuda a neutralizar el olor de la orina, manteniendo la piel más seca y sana. Cubierta exterior suave, Sistema de cintas Cintas pega - despega, más anchas para un mejor ajuste, Indicador de humedad cuando la línea pasa de amarillo a azul Barreras laterales que evitan escapes de orina, Suave elástico posterior que se ajusta cómodamente al cuerpo, Zona de Ultrabsorbencia ofrece rapidez de absorción, Doble capa de pulpa blanca que absorbe rápidamente los líquidos, Gel superabsorbente TENASORB que gelatiniza los líquidos"

  const registroSanitario = ["Documento 1.pdf"]
  const fichasTecnicas = ["Ficha Técnica 1.pdf"]
  const providers = [
    { name: "Grupo Familia SA", advisor: "July Peña" },
    
  ]

  

  return (
    <div className="min-h-screen bg-[#eeeeee] text-[#333333] p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6 p-6">
          <ImageCarousel 
            images={productImages} 
            currentImage={currentImage} 
            setCurrentImage={setCurrentImage} 
          />
          <ProductDetails fullDescription={fullDescription} />
        </div>

        <div className="p-6 space-y-6">
          <DocumentSection title="Registro Sanitario" documents={registroSanitario} />
          <DocumentSection title="Fichas Técnicas" documents={fichasTecnicas} />
          <ProviderSection providers={providers} />
        </div>
        <div className="flex justify-center mt-8 mb-8">
          <a href='/formularios/productos' className="bg-[#00632C] text-white hover:bg-[#FFD700] hover:text-[#00632C] px-6 py-3 rounded-lg font-semibold transition-colors duration-300">
            Editar
          </a>
        </div>
      </div>
    </div>
  )
}