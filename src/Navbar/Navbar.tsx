import React, { useState } from 'react';
import Logo from './Logo.tsx';
import NavLinks from './NavLinks.tsx';
import { Menu, X } from 'lucide-react'; // Usamos íconos de hamburguesa y cerrar

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false); // Estado del menú

    return (
        <nav className="bg-[#00873D] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Logo />

                    {/* Menú hamburguesa (visible solo en móviles) */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-md text-white hover:bg-[#00632C] focus:outline-none focus:ring-2 focus:ring-white"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>

                    {/* Links visibles en escritorio */}
                    <div className="hidden md:block">
                        <NavLinks />
                    </div>
                </div>
            </div>

            {/* Menú desplegable en móviles */}
            {isOpen && (
                <div className="md:hidden bg-[#00873D] px-4 pb-4">
                    <NavLinks />
                </div>
            )}
        </nav>
    );
};

export default Navbar;