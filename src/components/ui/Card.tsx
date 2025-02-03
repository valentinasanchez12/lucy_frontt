import type React from "react"

interface CardProps {
    title: string
    value: number
    icon: React.ReactNode
}

const Card: React.FC<CardProps> = ({ title, value, icon }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center transition-all duration-300 hover:bg-[#80C68C] group">
            <div className="text-[#00632C] mb-4 group-hover:text-white">{icon}</div>
            <h2 className="text-xl font-semibold text-[#00632C] mb-2 group-hover:text-white">{title}</h2>
            <p className="text-3xl font-bold text-[#333333] group-hover:text-white">{value.toLocaleString()}</p>
        </div>
    )
}

export default Card
