import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import ProductCard from "./ProductCard"
import LoadingSpinner from "../ui/LoadingSpinner"
import ErrorAlert from "../ui/ErrorAlert"
import NoResultsMessage from "../ui/NoResultsMessage"

interface Brand {
  uuid: string
  name: string
}

interface Product {
  uuid: string
  generic_name: string
  commercial_name: string
  description: string
  image: string
  brand: Brand
}

interface ApiResponse {
  data: Product[]
  success: boolean
  response: string
}

export default function ResultadosBusqueda() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const searchQuery = searchParams.get("q") || ""
  const [inputValue, setInputValue] = useState(searchQuery)

  const fetchProducts = useCallback(async (query: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://localhost:8080/api/product/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }
      const result: ApiResponse = await response.json()
      if (result.success && Array.isArray(result.data)) {
        setProducts(result.data)
      } else {
        throw new Error(result.response || "Unexpected response format")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (searchQuery) {
      fetchProducts(searchQuery)
    } else {
      setLoading(false)
    }
  }, [searchQuery, fetchProducts])

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const newSearchQuery = inputValue.trim()
    if (newSearchQuery) {
      setSearchParams({ q: newSearchQuery })
      navigate(`/resultado?q=${encodeURIComponent(newSearchQuery)}`)
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  return (
      <div className="min-h-screen bg-[#eeeeee] text-[#333333] p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-[#00632C]">Resultados de Búsqueda</h1>

          <form onSubmit={handleSearch} className="relative mb-8">
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Buscar productos..."
                className="w-full p-3 pr-12 rounded-full border-2 border-[#80C68C] focus:outline-none focus:border-[#00873D]"
                aria-label="Buscar productos"
            />
            <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#00873D] text-white rounded-full p-2 hover:bg-[#00632C] transition-colors duration-200"
                aria-label="Realizar búsqueda"
            >
              <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>

          {error && <ErrorAlert message={error} />}

          {loading ? (
              <LoadingSpinner />
          ) : products.length === 0 ? (
              <NoResultsMessage searchQuery={searchQuery} />
          ) : (
              <div className="space-y-4 mb-8">
                {products.map((product) => (
                    <ProductCard key={product.uuid} product={product} />
                ))}
              </div>
          )}
        </div>
      </div>
  )
}

