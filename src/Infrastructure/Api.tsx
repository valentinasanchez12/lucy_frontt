import {API_BASE_URL} from "../utils/ApiUrl.tsx";

interface ApiResponse {
    data: number
    success: boolean
    response: string
}

export async function fetchApi(endpoint: string): Promise<number> {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`)
        if (!response.ok) {
            throw new Error("Network response was not ok")
        }
        const data: ApiResponse = await response.json()
        return data.data
    } catch (error) {
        console.error(`Error fetching ${endpoint} amount:`, error)
        throw error
    }
}

export const api = {
    getProductAmount: () => fetchApi("/api/product/amount"),
    getBrandAmount: () => fetchApi("/api/brand/amount"),
    getProviderAmount: () => fetchApi("/api/provider/amount"),
    getCategoryAmount: () => fetchApi("/api/category/amount"),
    getSanitaryRegistryAmount: () => fetchApi("/api/sanitary-registry/amount"),
}
