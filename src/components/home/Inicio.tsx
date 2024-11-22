import { useState } from "react"
import { useNavigate } from "react-router-dom"

interface Product {
    id: number
    name: string
    brand: string
    imageUrl: string
  }

const ChevronDown: React.FC = () => (
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4">
    <polyline points="6 9 12 15 18 9"></polyline>
</svg>
)

const SearchIcon: React.FC = () => (
<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
</svg>
)

export default function Inicio () {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const navigate = useNavigate()
    const navigate2 = useNavigate()

    const products: Product[] = [
        { id: 1, name: "GUANTE DE LATEX", brand: "PROTEX", imageUrl: "/guante_latex_protex.jpg" },
        { id: 2, name: "JERINGA DESECHABLE", brand: "ALFASAFE", imageUrl: "/jeringa_hipodermica_alfa.png" },
        { id: 3, name: "GUANTE ESTERIL", brand: "PROTEC CLINC", imageUrl: "/guante_esteril_alfa.png" },
        { id: 4, name: "PAÑAL ADULTO", brand: "TENA", imageUrl: "/panal_adulto_tena.png" },
    ]

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('Búsqueda realizada:', searchQuery)
        // Aquí iría la lógica de búsqueda
    
    
      }

      const handleClick = () => {
        navigate("/detalle")
       
      }

      const handleClick2 = () => {
   
        navigate2("/resultado")
      }


      

    return (
        <>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#00632C] mb-8">Bienvenido a Ceminsumos</h1>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-16">
            <div className="relative">
              <input
                type="text"
                className="w-full p-4 pr-12 text-sm border-2 border-[#80C68C] rounded-full shadow-sm focus:outline-none focus:border-[#00873D]"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
              onClick={handleClick2}
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
          <h2 className="text-2xl font-semibold text-[#00632C] mb-6">lista de productos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-[#00632C]">{product.name}</h3>
                  <p className="text-[#333333] mb-4">{product.brand}</p>
                  <button onClick={handleClick} className="w-full bg-[#FFD700] text-[#333333] py-2 px-4 rounded-md hover:bg-[#00873D] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-opacity-50">
                    Ver más
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
        </>
    )
}