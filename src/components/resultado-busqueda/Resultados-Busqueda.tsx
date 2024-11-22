import React, { useState } from 'react';

type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  marca: string;
  imagenUrl: string;
};

const ResultadosBusqueda: React.FC = () => {
  const productosEjemplo: Producto[] = [
    {
      id: 1,
      nombre: "JERINGA DESECHABLE",
      descripcion: "La jeringa es un dispositivo que se utiliza para extraer líquidos o administrar soluciones o medicamentos al paciente por algunas de las vías de administración.",
      marca: "ALFASAFE",
      imagenUrl: "/jeringa_hipodermica_alfa.png"
    },
    {
      id: 2,
      nombre: "GUANTE ESTERIL",
      descripcion: "Elaborados en látex natural, esterilizados con rayos gamma, pre-entalcados, dedos rectos y manga con orillo, sensibles al tacto, forma anatómica para un ajuste natural. - Elaborados en látex natural. AQL 1.5. - Con superficie micro-rugosa. - Esterilizados con rayos gamma. - Preentalcados. - Dedos rectos y manga con orillo..",
      marca: "ALFASAFE",
      imagenUrl: "/guante_esteril_alfa.png"
    },
    {
      id: 3,
      nombre: "GUANTES DE LATEX",
      descripcion: "Guantes ambidiestros, lisos, puño enrollado reforzado, biodegradables, desechables, dedos nivelados (rectos) de color o natural. .",
      marca: "PROTEX",
      imagenUrl: "/guante_latex_protex.jpg"
    },
    {
      id: 4,
      nombre: "PAÑAL ADULTO",
      descripcion: "Pañal para hombres y mujeres. Es el absorbente más completo y con mejor desempeño para el manejo de la incontinencia fuerte a severa, para personas con poca o ninguna capacidad de movimiento y dependientes de un cuidador. Con alta y avanzada tecnología TENASORB que gelatiniza los líquidos y ayuda a neutralizar el olor de la orina, manteniendo la piel más seca y sana..",
      marca: "TENA",
      imagenUrl: "/panal_adulto_tena.png"
    }
    
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const productosPorPagina = 10;
  const totalPages = Math.ceil(productosEjemplo.length / productosPorPagina);

  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  const indexOfLastProduct = currentPage * productosPorPagina;
  const indexOfFirstProduct = indexOfLastProduct - productosPorPagina;
  const currentProducts = productosEjemplo.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 4;
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`px-3 py-2 mx-1 rounded-full ${
            currentPage === i
              ? 'bg-[#00873D] text-white'
              : 'bg-white text-[#00873D] hover:bg-[#00632C] hover:text-white'
          } transition-colors duration-200`}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="min-h-screen bg-[#eeeeee] text-[#333333] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-[#00632C]">Resultados de Búsqueda</h1>
        
        <div className="relative mb-8">
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            className="w-full p-3 pr-12 rounded-full border-2 border-[#80C68C] focus:outline-none focus:border-[#00873D]"
          />
          <button 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#00873D] text-white rounded-full p-2 hover:bg-[#00632C] transition-colors duration-200"
            aria-label="Buscar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 mb-8">
          {currentProducts.map((producto) => (
            <div key={producto.id} className="bg-white rounded-lg shadow-md p-6 relative">
              <div className="flex items-start mb-4">
                <img
                  src={producto.imagenUrl}
                  alt={producto.nombre}
                  className="w-20 h-20 rounded-md mr-4"
                />
                <div>
                  <h2 className="text-lg font-semibold text-[#00632C] mb-2">{producto.nombre}</h2>
                  <p className="text-[#333333] mb-2">{truncateText(producto.descripcion, 10)}</p>
                  <p className="text-[#00873D] font-bold">{producto.marca}</p>
                </div>
              </div>
              <button 
                className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-[#FFD700] text-[#333333] hover:bg-[#00632C] hover:text-white transition-colors duration-200"
              >
                Detalle
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center">
          <button
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-full ${
              currentPage === 1
                ? 'bg-white text-[#00873D] opacity-50 cursor-not-allowed'
                : 'bg-white text-[#00873D] hover:bg-[#00632C] hover:text-white'
            } transition-colors duration-200 mr-2`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {renderPaginationButtons()}
          <button
            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-full ${
              currentPage === totalPages
                ? 'bg-white text-[#00873D] opacity-50 cursor-not-allowed'
                : 'bg-white text-[#00873D] hover:bg-[#00632C] hover:text-white'
            } transition-colors duration-200 ml-2`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultadosBusqueda;