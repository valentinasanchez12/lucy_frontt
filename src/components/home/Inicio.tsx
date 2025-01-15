import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AutocompleteSearch from "./AutocompleteSearch.tsx";

interface Brand {
    uuid: string;
    name: string;
}

interface Product {
    uuid: string;
    generic_name: string;
    image: string;
    brand: Brand;
}

interface ApiResponse {
    data: Product[];
    success: boolean;
    response: string;
}

const SearchIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
)

const capitalize = (str: string) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

const Home = () => {
    const navigate = useNavigate()
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [searchQuery, setSearchQuery] = useState<string>('')

    const handleClick = (uuid: string) => {
        navigate(`/detalle/${uuid}`)
    }

    const handleSearch = (query: string) => {
        const trimmedQuery = query.trim()
        if (trimmedQuery) {
            navigate(`/resultado?q=${encodeURIComponent(trimmedQuery)}`)
        }
    }

    useEffect(() => {
        const fetchRandomProducts = async () => {
            setIsLoading(true)
            try {
                const response = await fetch('http://localhost:8080/api/product/random')
                if (!response.ok) {
                    throw new Error('Failed to fetch products')
                }
                const data: ApiResponse = await response.json()
                if (data.success) {
                    setProducts(data.data)
                } else {
                    throw new Error(data.response)
                }
            } catch (error) {
                console.error('Error fetching products:', error)
                setProducts([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchRandomProducts()
    }, [])


    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-[#00632C] mb-8">Bienvenido a Ceminsumos</h1>
                <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchQuery); }} className="max-w-2xl mx-auto mb-16">
                    <div className="relative">
                        <AutocompleteSearch
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            onSearch={handleSearch}
                        />
                        <button
                            type="submit"
                            className="absolute top-0 right-0 p-4 text-sm font-semibold text-white bg-[#00873D] rounded-full hover:bg-[#00632C] focus:outline-none focus:ring-2 focus:ring-[#00873D] focus:ring-offset-2"
                        >
                            <SearchIcon />
                            <span className="sr-only">Buscar</span>
                        </button>
                    </div>
                </form>
            </div>

            <div className="mt-12">
                <h2 className="text-2xl font-semibold text-[#00632C] mb-6">Lista de productos</h2>
                {isLoading ? (
                    <p className="text-center text-lg text-gray-600">Cargando productos...</p>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div key={product.uuid} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <img
                                    src={product.image.startsWith('http') ? product.image : `http://localhost:8080/static/${product.image}`}
                                    alt={product.generic_name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg mb-2 text-[#00632C]">{capitalize(product.generic_name)}</h3>
                                    <p className="text-[#333333] mb-4">{capitalize(product.brand.name)}</p>
                                    <button
                                        onClick={() => handleClick(product.uuid)}
                                        className="w-full bg-[#FFD700] text-[#333333] py-2 px-4 rounded-md hover:bg-[#00873D] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-opacity-50"
                                    >
                                        Ver más
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-100 rounded-lg">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos disponibles</h3>
                        <p className="mt-1 text-sm text-gray-500">Lo sentimos, no tenemos productos para mostrar en este momento.</p>
                    </div>
                )}
            </div>
        </main>
    )
}

export default Home

