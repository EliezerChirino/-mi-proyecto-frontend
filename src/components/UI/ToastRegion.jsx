// src/components/UI/ToastRegion.jsx
// Dibuja la pila de toasts. Vive dentro del lienzo (esquina superior derecha).
import React from 'react';
import { useToast } from '../../context/ToastContext';
import { cx } from '../../utils/cx';
import './ToastRegion.css';

const LABELS = { success: 'Éxito', error: 'Error', warning: 'Advertencia', info: 'Info' };

// Glifo + texto + color: el tipo nunca depende solo del color
function ToastGlyph({ type }) {
    if (type === 'success') {
        return <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="currentColor" /></svg>;
    }
    if (type === 'error') {
        return <svg width="8" height="8" viewBox="0 0 8 8"><rect width="8" height="8" fill="currentColor" /></svg>;
    }
    if (type === 'warning') {
        return <svg width="9" height="8" viewBox="0 0 9 8"><path d="M4.5 0L9 8H0z" fill="currentColor" /></svg>;
    }
    return (
        <svg width="8" height="8" viewBox="0 0 8 8">
            <path d="M4 .5L7.5 4 4 7.5 .5 4z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    );
}

function Toast({ toast, onDismiss }) {
    function handleAction() {
        toast.action.onClick();
        onDismiss(toast.id);
    }

    return (
        <div role={toast.type === 'error' ? 'alert' : 'status'} className={cx('toast', `toast--${toast.type}`)}>
            <div className="toast__glyph">
                <ToastGlyph type={toast.type} />
            </div>

            <div className="toast__content">
                <div className="toast__meta">
                    <span>{LABELS[toast.type] || LABELS.info}</span>
                    <span className="toast__time">{toast.time}</span>
                </div>
                <div className="toast__title">{toast.title}</div>
                {toast.message && <div className="toast__message">{toast.message}</div>}
                {toast.data && <div className="toast__data">{toast.data}</div>}
                {toast.action && (
                    <div className="toast__actions">
                        <button type="button" className="toast__action" onClick={handleAction}>
                            {toast.action.label}
                        </button>
                    </div>
                )}
            </div>

            <button type="button" className="toast__close" aria-label="Cerrar" title="Cerrar" onClick={() => onDismiss(toast.id)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
                    <path d="M6 6l12 12M18 6L6 18" />
                </svg>
            </button>

            {/* La barra ES el reloj: al terminar su animación, el toast se cierra.
                key={version} la reinicia si llega el mismo aviso otra vez. */}
            {toast.duration > 0 && (
                <div
                    key={toast.version}
                    className="toast__progress"
                    style={{ animationDuration: `${toast.duration}ms` }}
                    onAnimationEnd={() => onDismiss(toast.id)}
                />
            )}
        </div>
    );
}

const ToastRegion = () => {
    const { toasts, dismiss } = useToast();

    return (
        <div className="toast-region">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
            ))}
        </div>
    );
};

export default ToastRegion;