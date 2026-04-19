import React, { useEffect } from 'react';
import '../../styles/Animaciones.css'

const Alert = ({ type = 'info', message, onClose, duration = 3000 }) => {
    // Auto-cerrar después de X segundos
    useEffect(() => {
        if (duration && onClose) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    // Configuración de estilos según el tipo
    const alertStyles = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-500',
            text: 'text-green-800',
            icon: '✓',
            iconBg: 'bg-green-500'
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-500',
            text: 'text-red-800',
            icon: '✕',
            iconBg: 'bg-red-500'
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-500',
            text: 'text-yellow-800',
            icon: '⚠',
            iconBg: 'bg-yellow-500'
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-500',
            text: 'text-blue-800',
            icon: 'ℹ',
            iconBg: 'bg-blue-500'
        }
    };

    const style = alertStyles[type] || alertStyles.info;

    return (
        <div className={`fixed top-24 right-6 z-100 min-w-[320px] max-w-md 
                        ${style.bg} ${style.border} border-l-4 rounded-lg shadow-lg
                        animate-slide-in`}>
            <div className="flex items-start p-4 gap-3">
                {/* Icono */}
                <div className={`${style.iconBg} text-white rounded-full w-6 h-6 
                                flex items-center justify-center shrink-0 text-sm font-bold`}>
                    {style.icon}
                </div>

                {/* Mensaje */}
                <div className={`flex-1 ${style.text}`}>
                    <p className="font-medium text-sm leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Botón cerrar */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className={`${style.text} hover:opacity-70 transition-opacity shrink-0`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                )}
            </div>

            {/* Barra de progreso (opcional) */}
            {duration && (
                <div className="h-1 bg-gray-200 rounded-b-lg overflow-hidden">
                    <div 
                        className={`h-full ${style.iconBg} animate-progress`}
                        style={{ animationDuration: `${duration}ms` }}
                    />
                </div>
            )}
        </div>
    );
};

export default Alert;