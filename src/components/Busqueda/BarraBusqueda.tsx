// Componente para la barra de búsqueda
const BarraBusqueda: React.FC<{
    busqueda: string;
    placeholder: string;
    setBusqueda: (busqueda: string) => void;
}> = ({ busqueda, placeholder, setBusqueda }) => {
    const handleReset = () => {
        setBusqueda('');
    };
    return (
        <div className="mb-4 relative">
            <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2 border border-[#80C68C] rounded-full focus:outline-none focus:ring-2 focus:ring-[#00632C]"
            />
            {busqueda ? (
                <button
                    onClick={handleReset}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#00632C] hover:text-[#004d22]"
                    aria-label="Limpiar búsqueda"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-[#00632C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            )}
        </div>
    );
};
export default BarraBusqueda;