import React from 'react'

interface Provider {
    uuid: string;
    nit: string;
    types_person: string;
    name: string;
    represent: string;
    phone: string;
    email: string;
}

interface ProviderModalProps {
    provider: Provider;
    onClose: () => void;
}

const ProviderModal: React.FC<ProviderModalProps> = ({ provider, onClose }) => {
    const capitalizeWords = (str: string) => {
        return str.replace(/\b\w/g, l => l.toUpperCase());
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h2 className="text-2xl font-semibold text-[#00632C] mb-4">{capitalizeWords(provider.name)}</h2>
                <ul className="space-y-2">
                    <li><strong>NIT:</strong> {provider.nit}</li>
                    <li><strong>Tipo de Persona:</strong> {capitalizeWords(provider.types_person)}</li>
                    <li><strong>Representante:</strong> {capitalizeWords(provider.represent)}</li>
                    <li><strong>Teléfono:</strong> {provider.phone}</li>
                    <li><strong>Correo:</strong> {provider.email.toLowerCase()}</li>
                </ul>
                <button
                    onClick={onClose}
                    className="mt-6 bg-[#00632C] text-white hover:bg-[#FFD700] hover:text-[#00632C] px-4 py-2 rounded"
                >
                    Cerrar
                </button>
            </div>
        </div>
    )
}

export default ProviderModal

