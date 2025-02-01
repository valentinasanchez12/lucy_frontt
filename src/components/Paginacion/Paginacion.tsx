import React from "react";

const Paginacion: React.FC<{
    paginaActual: number;
    totalPaginas: number;
    cambiarPagina: (pagina: number) => void;
}> = ({ paginaActual, totalPaginas, cambiarPagina }) => {
    const maxNumerosVisibles = 5; // Número máximo de botones a mostrar
    let inicio = Math.max(paginaActual - Math.floor(maxNumerosVisibles / 2), 1);
    let fin = inicio + maxNumerosVisibles - 1;

    if (fin > totalPaginas) {
        fin = totalPaginas;
        inicio = Math.max(fin - maxNumerosVisibles + 1, 1);
    }

    const generarNumerosPaginacion = () => {
        const numeros = [];
        for (let i = inicio; i <= fin; i++) {
            numeros.push(i);
        }
        return numeros;
    };

    return (
        <div className="mt-4 flex justify-center items-center space-x-2">
            <button
                onClick={() => cambiarPagina(1)}
                disabled={paginaActual === 1}
                className="bg-white hover:bg-[#80C68C] text-[#00632C] hover:text-[#00632C] border border-[#00632C] p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Primera página"
            >
                {"<<"}
            </button>

            <button
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
                className="bg-white hover:bg-[#80C68C] text-[#00632C] hover:text-[#00632C] border border-[#00632C] p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Página anterior"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {generarNumerosPaginacion().map((pagina) => (
                <button
                    key={pagina}
                    onClick={() => cambiarPagina(pagina)}
                    className={`${
                        paginaActual === pagina
                            ? "bg-[#00632C] text-white"
                            : "bg-white text-[#00632C] hover:bg-[#80C68C] hover:text-[#00632C]"
                    } border border-[#00632C] px-3 py-1 rounded-md`}
                >
                    {pagina}
                </button>
            ))}

            <button
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className="bg-white hover:bg-[#80C68C] text-[#00632C] hover:text-[#00632C] border border-[#00632C] p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Página siguiente"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            <button
                onClick={() => cambiarPagina(totalPaginas)}
                disabled={paginaActual === totalPaginas}
                className="bg-white hover:bg-[#80C68C] text-[#00632C] hover:text-[#00632C] border border-[#00632C] p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Última página"
            >
                {">>"}
            </button>
        </div>
    );
};

export default Paginacion;