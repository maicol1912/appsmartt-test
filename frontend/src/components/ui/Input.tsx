import React, { InputHTMLAttributes, forwardRef, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
    showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            fullWidth = false,
            showPasswordToggle = false,
            type = 'text',
            className = '',
            id,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false);
        const [internalType, setInternalType] = useState(type);

        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

        const handlePasswordToggle = () => {
            setShowPassword(!showPassword);
            setInternalType(showPassword ? 'password' : 'text');
        };

        const baseInputClasses = 'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-colors';

        const inputClasses = [
            baseInputClasses,
            error
                ? 'ring-red-300 focus:ring-red-600'
                : 'ring-gray-300 focus:ring-blue-600',
            leftIcon ? 'pl-10' : 'pl-3',
            (rightIcon || showPasswordToggle) ? 'pr-10' : 'pr-3',
            props.disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : '',
            className,
        ].join(' ');

        return (
            <div className={fullWidth ? 'w-full' : ''}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                    >
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-400 text-sm">{leftIcon}</span>
                        </div>
                    )}


                    <input
                        ref={ref}
                        id={inputId}
                        type={showPasswordToggle && type === 'password' ? internalType : type}
                        className={inputClasses}
                        {...props}
                    />

                    {(rightIcon || showPasswordToggle) && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {showPasswordToggle && type === 'password' ? (
                                <button
                                    type="button"
                                    onClick={handlePasswordToggle}
                                    className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
                                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                >
                                    {showPassword ? (
                                        <EyeOffIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            ) : (
                                rightIcon && <span className="text-gray-400 text-sm">{rightIcon}</span>
                            )}
                        </div>
                    )}
                </div>

                {error && (
                    <p className="mt-2 text-sm text-red-600" role="alert">
                        {error}
                    </p>
                )}

                {!error && helperText && (
                    <p className="mt-2 text-sm text-gray-500">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

const EyeIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeOffIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
    </svg>
);

export default Input;