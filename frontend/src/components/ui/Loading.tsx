import React from 'react';

interface LoadingProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    text?: string;
    className?: string;
    showText?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
    size = 'md',
    text = 'Cargando...',
    className = '',
    showText = true
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
    };

    return (
        <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
            <div
                className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}
                role="status"
                aria-label="Cargando"
            />
            {showText && (
                <p className={`text-gray-600 ${textSizeClasses[size]}`}>
                    {text}
                </p>
            )}
        </div>
    );
};

interface ButtonLoadingProps {
    size?: 'sm' | 'md';
    className?: string;
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({
    size = 'sm',
    className = ''
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
    };

    return (
        <div
            className={`${sizeClasses[size]} border-2 border-white border-t-transparent rounded-full animate-spin ${className}`}
            role="status"
            aria-label="Cargando"
        />
    );
};

export const FullPageLoading: React.FC<{ text?: string }> = ({
    text = 'Cargando aplicación...'
}) => {
    return (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
            <div className="text-center">
                <Loading size="xl" text={text} />
            </div>
        </div>
    );
};


interface OverlayLoadingProps {
    isVisible: boolean;
    text?: string;
    className?: string;
}

export const OverlayLoading: React.FC<OverlayLoadingProps> = ({
    isVisible,
    text = 'Procesando...',
    className = ''
}) => {
    if (!isVisible) return null;

    return (
        <div className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 ${className}`}>
            <div className="bg-white rounded-lg p-6 shadow-lg">
                <Loading size="lg" text={text} />
            </div>
        </div>
    );
};

export default Loading;