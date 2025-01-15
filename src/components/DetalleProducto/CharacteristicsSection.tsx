import React from 'react'

interface Characteristic {
    uuid: string;
    characteristic: string;
    description: string;
}

interface CharacteristicsSectionProps {
    characteristics: Characteristic[];
}

const CharacteristicsSection: React.FC<CharacteristicsSectionProps> = ({ characteristics }) => {
    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-2xl font-semibold text-[#00632C] mb-4">Características del Producto</h2>
            {characteristics.length > 0 ? (
                <ul className="space-y-4">
                    {characteristics.map((char) => (
                        <li key={char.uuid} className="border-b pb-2">
                            <h3 className="font-semibold">{char.characteristic.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</h3>
                            <p>{char.description.charAt(0).toUpperCase() + char.description.slice(1).toLowerCase()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No hay características disponibles.</p>
            )}
        </div>
    )
}

export default CharacteristicsSection

