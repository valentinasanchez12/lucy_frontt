import React from 'react'
import { FileText } from 'lucide-react'

export interface SanitaryRegistry {
    number_registry: string;
    url: string;
}

interface SanitaryRegistrySectionProps {
    registry: SanitaryRegistry | null;
}

const SanitaryRegistrySection: React.FC<SanitaryRegistrySectionProps> = ({ registry }) => {
    return (
        <div className="bg-[#80C68C] rounded-lg shadow">
            <div className="p-4">
                <h2 className="text-2xl font-semibold text-[#00632C] mb-4">Registro Sanitario</h2>
                {registry ? (
                    <div className="space-y-2">
                        <p className="text-[#00632C]">
                            Número de Registro: {registry.number_registry.toUpperCase()}
                        </p>
                        {registry.url && (
                            <p className="flex items-center">
                                <FileText className="w-6 h-6 mr-2 text-[#00632C]" />
                                <a
                                    href={registry.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#00632C] hover:text-[#FFD700]"
                                >
                                    Documento
                                </a>
                            </p>
                        )}
                    </div>
                ) : (
                    <p className="text-[#00632C]">No hay registro sanitario disponible.</p>
                )}
            </div>
        </div>
    )
}

export default SanitaryRegistrySection

