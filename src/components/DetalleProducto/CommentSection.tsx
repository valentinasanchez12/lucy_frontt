import React from 'react'

interface Comment {
    uuid: string;
    comment: string;
}

interface CommentSectionProps {
    comments: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments }) => {
    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-2xl font-semibold text-[#00632C] mb-4">Comentarios del Producto</h2>
            {comments.length > 0 ? (
                <ul className="space-y-4">
                    {comments.map((comment) => (
                        <li key={comment.uuid} className="border-b pb-2">
                            <p>{comment.comment.charAt(0).toUpperCase() + comment.comment.slice(1).toLowerCase()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No hay comentarios disponibles.</p>
            )}
        </div>
    )
}

export default CommentSection

