// src/context/ToastContext.jsx
// Almacén único de notificaciones. Cualquier componente dentro de <ToastProvider>
// puede lanzar un toast con: const { notify } = useToast();
import React, { createContext, useContext, useState, useCallback, useRef, useMemo } from 'react';

// Duración por tipo en ms. 0 = fijo, solo se cierra a mano.
const DURATIONS = { success: 4000, error: 0, warning: 8000, info: 5000 };
const MAX_TOASTS = 4;

const ToastContext = createContext(null);

function formatTime(date) {
    return String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const nextId = useRef(1);

    const dismiss = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const notify = useCallback(({ type = 'info', title, message = '', data = '', action = null }) => {
        // Un toast con acción queda fijo hasta que el usuario responda
        const duration = action ? 0 : (DURATIONS[type] ?? DURATIONS.info);

        setToasts(prev => {
            const duplicate = prev.find(t => t.type === type && t.title === title && t.message === message);
            if (duplicate) {
                // Mismo aviso repetido: no se apila; "version" reinicia su barra de tiempo
                return prev.map(t => t.id === duplicate.id
                    ? { ...t, version: t.version + 1, time: formatTime(new Date()) }
                    : t);
            }
            const toast = {
                id: nextId.current++,
                version: 0,
                type, title, message, data, action, duration,
                time: formatTime(new Date()),
            };
            return [toast, ...prev].slice(0, MAX_TOASTS);
        });
    }, []);

    const value = useMemo(() => ({ toasts, notify, dismiss }), [toasts, notify, dismiss]);

    return (
        <ToastContext.Provider value={value}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast debe usarse dentro de <ToastProvider>');
    return context;
}