import { useNavigate } from 'react-router-dom'

interface Brand {
    uuid: string;
    name: string;
}

interface Product {
    uuid: string;
    generic_name: string;
    commercial_name: string;
    description: string;
    image: string;
    brand: Brand;
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const navigate = useNavigate()

    const truncateText = (text: string, wordLimit: number) => {
        const words = text.split(' ')
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...'
        }
        return text
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 relative">
            <div className="flex items-start mb-4">
                <img
                    src={product.image}
                    alt={product.commercial_name}
                    className="w-20 h-20 rounded-md mr-4 object-cover"
                />
                <div>
                    <h2 className="text-lg font-semibold text-[#00632C] mb-2">{product.commercial_name}</h2>
                    <p className="text-[#333333] mb-2">{truncateText(product.description, 10)}</p>
                    <p className="text-[#00873D] font-bold">{product.brand.name}</p>
                </div>
            </div>
            <button
                className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-[#FFD700] text-[#333333] hover:bg-[#00632C] hover:text-white transition-colors duration-200"
                onClick={() => navigate(`/detalle/${product.uuid}`)}
            >
                Detalle
            </button>
        </div>
    )
}

