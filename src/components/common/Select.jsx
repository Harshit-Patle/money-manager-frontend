const Select = ({
    label,
    error,
    options = [],
    className = '',
    required = false,
    placeholder = 'Select...',
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    {label}
                    {required && <span className="text-danger-500 ml-1">*</span>}
                </label>
            )}
            <select
                className={`w-full px-3 py-2 border border-neutral-300 rounded-lg text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${error ? 'border-danger-500 focus:ring-danger-500' : ''
                    } ${className}`}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => {
                    // Handle both string and object formats
                    const value = typeof option === 'string' ? option : option.value;
                    const displayLabel = typeof option === 'string' ? option : option.label;
                    return (
                        <option key={value} value={value}>
                            {displayLabel}
                        </option>
                    );
                })}
            </select>
            {error && (
                <p className="mt-1.5 text-sm text-danger-600">{error}</p>
            )}
        </div>
    );
};

export default Select;