import React from 'react'
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react'

interface ImageCarouselProps {
    images: string[];
    currentImage: number;
    setCurrentImage: (index: number) => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, currentImage, setCurrentImage }) => {
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
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://via.placeholder.com/800x800?text=Imagen+no+disponible'
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
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = 'https://via.placeholder.com/100x100?text=No+disponible'
                            }}
                        />
                    </button>
                ))}
            </div>
        </div>
    )
}

export default ImageCarousel

