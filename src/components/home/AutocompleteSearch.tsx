import React, { useState, useEffect, useRef } from 'react'

interface AutocompleteSearchProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onSearch: (query: string) => void;
}

const AutocompleteSearch: React.FC<AutocompleteSearchProps> = ({ searchQuery, setSearchQuery, onSearch }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedOption, setHighlightedOption] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);

    const suggestions = ['Marca', 'Categoría', 'Registro sanitario', 'Proveedor'];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
    };

    const handleInputClick = () => {
        setShowSuggestions(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (showSuggestions) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightedOption((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightedOption((prev) => (prev > 0 ? prev - 1 : prev));
            } else if (e.key === 'Enter' && highlightedOption !== -1) {
                e.preventDefault();
                handleSuggestionClick(suggestions[highlightedOption]);
            }
        } else if (e.key === 'Enter') {
            onSearch(searchQuery);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        const newQuery = `in: ${suggestion} `;
        console.log('Opción seleccionada:', suggestion);
        setSearchQuery(newQuery);
        setShowSuggestions(false);
        if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.setSelectionRange(newQuery.length, newQuery.length);
        }
    };

    return (
        <div className="relative w-full">
            <input
                ref={inputRef}
                type="text"
                className="w-full p-4 pr-12 text-sm border-2 border-[#80C68C] rounded-full shadow-sm focus:outline-none focus:border-[#00873D]"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={handleInputChange}
                onClick={handleInputClick}
                onKeyDown={handleKeyDown}
            />
            {showSuggestions && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={suggestion}
                            className={`px-4 py-2 cursor-pointer ${
                                index === highlightedOption ? 'bg-gray-100' : ''
                            } hover:bg-gray-100`}
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            <button onClick={() => handleSuggestionClick(suggestion)}>{suggestion}</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AutocompleteSearch;

