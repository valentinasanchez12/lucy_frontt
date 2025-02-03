import type React from "react"
import { useState, useEffect } from "react"
import { ShoppingCart, Tag, Users, FileText, Folder } from "lucide-react"
import {api} from "../Infrastructure/Api.tsx";
import Card from "../components/ui/Card.tsx";
import Toast from "../components/ui/Toast.tsx";


const Dashboard: React.FC = () => {
    const [amounts, setAmounts] = useState({
        products: 0,
        brands: 0,
        providers: 0,
        sanitaryRegistries: 0,
        categories: 0,
    })
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [products, brands, providers, sanitaryRegistries, categories] = await Promise.all([
                    api.getProductAmount(),
                    api.getBrandAmount(),
                    api.getProviderAmount(),
                    api.getSanitaryRegistryAmount(),
                    api.getCategoryAmount(),
                ])

                setAmounts({ products, brands, providers, sanitaryRegistries, categories })
            } catch (error) {
                console.error("Error fetching data:", error)
                setError("Hubo un error al cargar los datos. Por favor, intente de nuevo más tarde.")
                setTimeout(() => setError(null), 5000)
            }
        }

        fetchData()
    }, [])

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-[#00632C] mb-6">Panel de Control</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <Card title="Total Productos" value={amounts.products} icon={<ShoppingCart className="h-8 w-8" />} />
                <Card title="Total Marcas" value={amounts.brands} icon={<Tag className="h-8 w-8" />} />
                <Card title="Total Proveedores" value={amounts.providers} icon={<Users className="h-8 w-8" />} />
                <Card
                    title="Total Invimas"
                    value={amounts.sanitaryRegistries}
                    icon={<FileText className="h-8 w-8" />}
                />
                <Card title="Total Categorías" value={amounts.categories} icon={<Folder className="h-8 w-8" />} />
            </div>
            {error && <Toast message={error} />}
        </div>
    )
}

export default Dashboard

