
interface NoResultsMessageProps {
    searchQuery: string;
}

export default function NoResultsMessage({ searchQuery }: NoResultsMessageProps) {
    return (
        <div className="flex flex-col items-center justify-center h-64">
            <svg className="w-24 h-24 text-[#00873D] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-[#00632C] mb-2">No se encontraron resultados</h2>
            <p className="text-[#333333] text-center">
                No se encontraron resultados para tu búsqueda: "{searchQuery}". <br />
                ¡Intenta con otro término!
            </p>
        </div>
    )
}

