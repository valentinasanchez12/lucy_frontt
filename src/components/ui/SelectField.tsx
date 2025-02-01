import type React from "react";
import Select from "react-select";

type Option = {
    value: string
    label: string
}

const customSelectStyles = {
    control: (provided: any) => ({
        ...provided,
        borderColor: "#80C68C",
        "&:hover": {
            borderColor: "#00873D",
        },
    }),
    option: (provided: any, state: { isSelected: any }) => ({
        ...provided,
        backgroundColor: state.isSelected ? "#00873D" : "white",
        color: state.isSelected ? "white" : "#333333",
        "&:hover": {
            backgroundColor: "#00632C",
            color: "white",
        },
    }),
    multiValue: (provided: any) => ({
        ...provided,
        backgroundColor: "#80C68C",
    }),
    multiValueLabel: (provided: any) => ({
        ...provided,
        color: "#333333",
    }),
    multiValueRemove: (provided: any) => ({
        ...provided,
        color: "#333333",
        "&:hover": {
            backgroundColor: "#00632C",
            color: "white",
        },
    }),
}

const SelectField: React.FC<{
    label: string
    name: string
    options: Option[]
    onChange: (option: any) => void
    placeholder: string
    value: string
    isMulti?: boolean
    required?: boolean
}> = ({ label, name, options, onChange, placeholder, value, isMulti = false, required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-[#00632C] mb-1">
            {label}
        </label>
        <Select
            options={options}
            placeholder={placeholder}
            styles={customSelectStyles}
            onChange={onChange}
            isMulti={isMulti}
            className="react-select-container"
            classNamePrefix="react-select"
            required={required}
            value={options.find((option) => option.value.toLowerCase() === value.toLowerCase())}
        />
    </div>
)

export default SelectField;