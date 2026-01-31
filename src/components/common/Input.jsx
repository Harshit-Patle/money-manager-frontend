const Input = ({
    label,
    error,
    type = 'text',
    className = '',
    required = false,
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
            <input
                type={type}
                className={`w-full px-3 py-2 border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${error ? 'border-danger-500 focus:ring-danger-500' : ''
                    } ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1.5 text-sm text-danger-600">{error}</p>
            )}
        </div>
    );
};

export default Input;