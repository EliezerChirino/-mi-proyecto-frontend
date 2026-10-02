// src/components/UI/DevicePanel.jsx
// Panel lateral no bloqueante para crear o editar un dispositivo.
import React, { useState, useRef, useEffect } from 'react';
import {
    DEVICE_TYPES,
    VALIDATORS,
    getFieldsForDevice,
    getCategoryCode
} from '../../config/deviceTypes';
import { cx } from '../../utils/cx';
import './DevicePanel.css';

// ─── Funciones auxiliares ───

function buildInitialData(fields, data) {
    const initial = {};
    fields.forEach(field => {
        initial[field.key] = data[field.key] || '';
    });
    return initial;
}

function hasOptionalData(fields, data) {
    return fields.some(field => !field.required && data[field.key]);
}

// Devuelve el mensaje de error de un campo, o null si está bien
function validateField(field, rawValue, takenIps) {
    const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;

    if (field.required && !value) return `${field.label} es obligatorio`;
    if (!value) return null;

    const validator = VALIDATORS[field.validator];
    if (validator && !validator.pattern.test(value)) return validator.message;

    if (field.key === 'ip' && takenIps.includes(value)) {
        return 'Esta IP ya la usa otro dispositivo del mapa';
    }
    return null;
}

function trimAll(data) {
    const clean = {};
    Object.keys(data).forEach(key => {
        clean[key] = typeof data[key] === 'string' ? data[key].trim() : data[key];
    });
    return clean;
}

// ─── Un campo del formulario ───

function PanelField({ field, value, error, inputRef, onChange, onBlur }) {
    const id = `device-field-${field.key}`;
    const controlProps = {
        id,
        name: field.key,
        value: value || '',
        onChange,
        onBlur,
        ref: inputRef,
        className: cx('device-panel__input', error && 'device-panel__input--error'),
        'aria-invalid': error ? true : undefined,
    };

    let control;
    if (field.type === 'textarea') {
        control = <textarea {...controlProps} rows={field.rows || 2} placeholder={field.placeholder} />;
    } else if (field.type === 'select') {
        control = (
            <select {...controlProps}>
                <option value="">Seleccionar…</option>
                {field.options?.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        );
    } else {
        control = (
            <input
                {...controlProps}
                type={field.type || 'text'}
                placeholder={field.placeholder}
                autoComplete="off"
                spellCheck={false}
            />
        );
    }

    return (
        <div className={cx('device-panel__field', field.colSpan === 1 && 'device-panel__field--half')}>
            <label htmlFor={id} className="device-panel__label">
                {field.label}
                {field.required && <span className="device-panel__required">*</span>}
            </label>
            {control}
            {error && <p className="device-panel__error">{error}</p>}
        </div>
    );
}

// ─── Panel ───

const DevicePanel = ({ node, isNew, takenIps, onSave, onCancel }) => {
    const deviceConfig = DEVICE_TYPES[node.data.deviceType] || DEVICE_TYPES.switch;
    const fields = getFieldsForDevice(deviceConfig.id);
    const essentialFields = fields.filter(field => field.required);
    const optionalFields = fields.filter(field => !field.required);

    // El estado se inicializa una sola vez: App le pone key={node.id},
    // así que al cambiar de nodo el panel se monta de nuevo.
    const [formData, setFormData] = useState(() => buildInitialData(fields, node.data));
    const [errors, setErrors] = useState({});
    const [showDetails, setShowDetails] = useState(() => hasOptionalData(fields, node.data));
    const inputRefs = useRef({});

    // Al abrir: foco en Nombre; si es nuevo, el texto queda seleccionado para reemplazarlo
    useEffect(() => {
        const nameInput = inputRefs.current.label;
        if (!nameInput) return;
        nameInput.focus();
        if (isNew) nameInput.select();
    }, [isNew]);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    }

    // Valida al salir del campo, no mientras se escribe
    function handleBlur(e) {
        const field = fields.find(f => f.key === e.target.name);
        if (!field) return;
        const error = validateField(field, e.target.value, takenIps);
        setErrors(prev => ({ ...prev, [field.key]: error }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        const newErrors = {};
        fields.forEach(field => {
            const error = validateField(field, formData[field.key], takenIps);
            if (error) newErrors[field.key] = error;
        });
        setErrors(newErrors);

        const firstErrorKey = Object.keys(newErrors)[0];
        if (firstErrorKey) {
            // Si el error está en "Más detalles", se despliega para que se vea
            if (!essentialFields.some(f => f.key === firstErrorKey)) setShowDetails(true);
            setTimeout(() => inputRefs.current[firstErrorKey]?.focus(), 0);
            return;
        }

        onSave(trimAll(formData));
    }

    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            e.stopPropagation();
            onCancel();
        }
    }

    function renderField(field) {
        return (
            <PanelField
                key={field.key}
                field={field}
                value={formData[field.key]}
                error={errors[field.key]}
                inputRef={el => { inputRefs.current[field.key] = el; }}
                onChange={handleChange}
                onBlur={handleBlur}
            />
        );
    }

    return (
        <aside className="device-panel" onKeyDown={handleKeyDown} aria-label="Configuración del dispositivo">
            <header className="device-panel__header">
                <div className="device-panel__icon">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18" height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                        dangerouslySetInnerHTML={{ __html: deviceConfig.iconSvg }}
                    />
                </div>
                <div className="device-panel__titles">
                    <span className="device-panel__kind">
                        {getCategoryCode(deviceConfig.categoria)} · {deviceConfig.label}
                    </span>
                    <h2 className="device-panel__title">
                        {isNew ? 'Nuevo dispositivo' : (node.data.label || deviceConfig.label)}
                    </h2>
                </div>
                <button type="button" className="device-panel__close" onClick={onCancel} title="Cerrar (Esc)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                        <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                </button>
            </header>

            <form className="device-panel__form" onSubmit={handleSubmit} noValidate>
                <div className="device-panel__body">
                    <div className="device-panel__grid">
                        {essentialFields.map(renderField)}
                    </div>

                    {optionalFields.length > 0 && (
                        <div className="device-panel__details">
                            <button
                                type="button"
                                className="device-panel__details-toggle"
                                onClick={() => setShowDetails(!showDetails)}
                                aria-expanded={showDetails}
                            >
                                <svg
                                    className={cx('device-panel__chevron', showDetails && 'device-panel__chevron--open')}
                                    xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"
                                >
                                    <path d="M9 6l6 6-6 6" />
                                </svg>
                                Más detalles
                                <span className="device-panel__optional">opcional</span>
                            </button>

                            {showDetails && (
                                <div className="device-panel__grid">
                                    {optionalFields.map(renderField)}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <footer className="device-panel__footer">
                    <button type="button" className="device-panel__btn device-panel__btn--ghost" onClick={onCancel}>
                        Cancelar
                    </button>
                    <button type="submit" className="device-panel__btn device-panel__btn--primary">
                        {isNew ? 'Agregar al mapa' : 'Guardar cambios'}
                        <kbd className="device-panel__kbd">↵</kbd>
                    </button>
                </footer>
            </form>
        </aside>
    );
};

export default DevicePanel;