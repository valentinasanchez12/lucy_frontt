import type React from "react"
import { useState } from "react"

interface Comment {
    uuid: string
    comment: string
    product_uuid: string
    created_at: string
    updated_at: string
    deleted_at: string | null
}

interface CommentSectionProps {
    comments: Comment[] | null | undefined
    productId: string
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments: initialComments, productId }) => {
    const [comments, setComments] = useState<Comment[]>(initialComments || [])
    const [newComment, setNewComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim()) return

        setIsSubmitting(true)
        setError(null)

        try {
            const response = await fetch("http://localhost:8080/api/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    product_uuid: productId,
                    comment: newComment,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to submit comment")
            }

            const result = await response.json()
            if (result.success && result.data) {
                setComments((prevComments) => [...prevComments, result.data])
                setNewComment("")
            } else {
                throw new Error("Invalid server response")
            }
        } catch (err) {
            setError("Error al enviar el comentario. Por favor, inténtelo de nuevo.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderComment = (comment: Comment) => {
        if (!comment || typeof comment.comment !== "string") {
            return null
        }
        return <p>{comment.comment.charAt(0).toUpperCase() + comment.comment.slice(1).toLowerCase()}</p>
    }

    if (!Array.isArray(comments)) {
        console.error("Comments data is not an array:", comments)
        return <p className="text-red-500">Error: Formato de comentarios inválido</p>
    }

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-2xl font-semibold text-[#00632C] mb-4">Comentarios del Producto</h2>
            {comments.length > 0 ? (
                <ul className="space-y-4 mb-4">
                    {comments.map((comment) => {
                        const renderedComment = renderComment(comment)
                        return (
                            renderedComment && (
                                <li key={comment.uuid} className="border-b pb-2">
                                    {renderedComment}
                                </li>
                            )
                        )
                    })}
                </ul>
            ) : (
                <p className="text-gray-500 mb-4">No hay comentarios disponibles.</p>
            )}
            <form onSubmit={handleSubmit} className="mt-4">
        <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe tu comentario aquí..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00632C]"
            rows={3}
        />
                {error && <p className="text-red-500 mt-2">{error}</p>}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 bg-[#00632C] text-white px-4 py-2 rounded-md hover:bg-[#004d22] transition-colors duration-300 disabled:opacity-50"
                >
                    {isSubmitting ? "Enviando..." : "Enviar Comentario"}
                </button>
            </form>
        </div>
    )
}

export default CommentSection

