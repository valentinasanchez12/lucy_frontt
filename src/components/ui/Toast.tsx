import type React from "react"

interface ToastProps {
    message: string
}

const Toast: React.FC<ToastProps> = ({ message }) => {
    return <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg">{message}</div>
}

export default Toast

