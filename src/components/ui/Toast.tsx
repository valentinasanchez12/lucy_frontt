import type React from "react"

interface ToastProps {
    message: string,
    color?: string
}

const Toast: React.FC<ToastProps> = ({ message, color = 'bg-red-500' }) => {
    return <div className={`fixed bottom-4 right-4 ${color} text-white px-4 py-2 rounded-md shadow-lg`}>{message}</div>
}

export default Toast

