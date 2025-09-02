import React, { ReactNode } from 'react';

interface AlertProps {
    children: ReactNode;
    variant?: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    closable?: boolean;
    onClose?: () => void;
    className?: string;
}

const Alert: React.FC<AlertProps> = ({
    children,
    variant = 'info',
    title,
    closable = false,
    onClose,
    className = '',
}) => {
    const variantClasses = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
    };

    const iconVariants = {
        success: <CheckCircleIcon className="h-5 w-5 text-green-400" />,
        error: <XCircleIcon className="h-5 w-5 text-red-400" />,
        warning: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />,
        info: <InformationCircleIcon className="h-5 w-5 text-blue-400" />,
    };

    return (
        <div className={`border border-l-4 p-4 rounded-md ${variantClasses[variant]} ${className}`}>
            <div className="flex">
                <div className="flex-shrink-0">
                    {iconVariants[variant]}
                </div>
                <div className="ml-3 flex-1">
                    {title && (
                        <h3 className="text-sm font-medium mb-1">
                            {title}
                        </h3>
                    )}
                    <div className="text-sm">
                        {children}
                    </div>
                </div>
                {closable && onClose && (
                    <div className="ml-auto pl-3">
                        <div className="-mx-1.5 -my-1.5">
                            <button
                                onClick={onClose}
                                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${variant === 'success' ? 'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600' :
                                    variant === 'error' ? 'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600' :
                                        variant === 'warning' ? 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600' :
                                            'bg-blue-50 text-blue-500 hover:bg-blue-100 focus:ring-blue-600'
                                    }`}
                                aria-label="Cerrar alerta"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const XCircleIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
);

const ExclamationTriangleIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const InformationCircleIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);

const XMarkIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export default Alert;