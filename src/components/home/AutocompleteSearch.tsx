import type React from "react"

interface SearchProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
    onSearch: (query: string) => void
}

const Search: React.FC<SearchProps> = ({ searchQuery, setSearchQuery, onSearch }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSearch(searchQuery)
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSearch(searchQuery)
    }

    return (
        <form onSubmit={handleSubmit} className="relative w-full">
            <input
                type="text"
                className="w-full p-4 pr-12 text-sm border-2 border-[#80C68C] rounded-full shadow-sm focus:outline-none focus:border-[#00873D]"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
            <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-[#00873D] text-white rounded-full hover:bg-[#00632C] focus:outline-none focus:ring-2 focus:ring-[#00873D] focus:ring-opacity-50"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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
    )
}

export default Search

