import type React from "react";

const TextareaField: React.FC<{
    label: string
    name: string
    value: string | number
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    placeholder: string
    required?: boolean
}> = ({ label, name, value, onChange, placeholder, required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-[#00632C] mb-1">
            {label}
        </label>
        <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={5}
            className="w-full p-2 border border-[#80C68C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00873D]"
            required={required}
        />
    </div>
)

export default TextareaField;