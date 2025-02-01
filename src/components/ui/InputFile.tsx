import type React from "react";

const InputField: React.FC<{
    label: string
    name: string
    value: string | number
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onFocus?: () => void
    placeholder: string
    required?: boolean
    type?: string
    accept?: string
}> = ({ label, name, value, onChange, onFocus, placeholder, required = false, type = "text", accept }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-[#00632C] mb-1">
            {label}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            placeholder={placeholder}
            className="w-full p-2 border border-[#80C68C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00873D]"
            required={required}
            {...(accept ? { accept } : {})}
        />
    </div>
)

export default InputField;