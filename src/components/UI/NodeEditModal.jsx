// src/components/UI/NodeEditModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import '../../styles/scroll.css';
import { 
    DEVICE_TYPES, 
    getFieldsBySection, 
    VALIDATORS 
} from '../../config/deviceTypes';

// ─── Componente auxiliar: renderiza un campo individual ────────
const FormField = ({ field, value, error, onChange }) => {
    const baseInputClass = `text-sm w-full px-4 py-2 border border-slate-300 rounded-lg 
                            transition duration-300 ease-in-out focus:outline-blue-300 
                            hover:shadow-lg hover:border-blue-300 bg-white
                            ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}`;

    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === 'textarea' ? (
                <textarea
                    name={field.key}
                    value={value || ''}
                    onChange={onChange}
                    className={`${baseInputClass} resize-none`}
                    placeholder={field.placeholder}
                    rows={field.rows || 2}
                />
            ) : field.type === 'select' ? (
                <select
                    name={field.key}
                    value={value || ''}
                    onChange={onChange}
                    className={baseInputClass}
                >
                    <option value="">Seleccionar...</option>
                    {field.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            ) : (
                <input
                    type={field.type || 'text'}
                    name={field.key}
                    value={value || ''}
                    onChange={onChange}
                    className={baseInputClass}
                    placeholder={field.placeholder}
                />
            )}

            {error && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
};

// ─── Componente auxiliar: sección de formulario ────────────────
const FormSection = ({ section, formData, errors, onChange }) => {
    // Separa campos con colSpan=1 (para grid 2 cols) del resto
    const regularFields = section.fields.filter(f => !f.colSpan || f.colSpan !== 1);
    const halfFields = section.fields.filter(f => f.colSpan === 1);

    return (
        <div className={`space-y-3 p-3 rounded-xl ${section.bgClass}`}>
            <div className="flex items-center text-gray-700 uppercase tracking-wide border-b pb-1 gap-2">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" height="24" 
                    viewBox="0 0 24 24" fill="none" 
                    stroke="currentColor" strokeWidth="2" 
                    strokeLinecap="round" strokeLinejoin="round"
                    dangerouslySetInnerHTML={{ __html: section.iconSvg }}
                />
                <h4 className="text-sm font-bold">{section.label}</h4>
            </div>

            {/* Campos regulares (ancho completo) */}
            {regularFields.map(field => (
                <FormField
                    key={field.key}
                    field={field}
                    value={formData[field.key]}
                    error={errors[field.key]}
                    onChange={onChange}
                />
            ))}

            {/* Campos en grid de 2 columnas (colSpan=1) */}
            {halfFields.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                    {halfFields.map(field => (
                        <FormField
                            key={field.key}
                            field={field}
                            value={formData[field.key]}
                            error={errors[field.key]}
                            onChange={onChange}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Componente principal ──────────────────────────────────────
const NodeEditModal = ({ isOpen, onClose, nodeData, onSave, isNewNode = false }) => {
    const modalRef = useRef(null);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    // Obtiene la config del dispositivo y sus secciones
    const deviceConfig = DEVICE_TYPES[nodeData?.deviceType] || DEVICE_TYPES.switch;
    const sections = getFieldsBySection(nodeData?.deviceType);

    // Inicializa formData con TODOS los campos del dispositivo
    useEffect(() => {
        if (isOpen) {
            const allFields = Object.values(sections).flatMap(s => s.fields);
            const initialData = {};
            allFields.forEach(field => {
                initialData[field.key] = nodeData[field.key] || '';
            });
            initialData.status = nodeData.status || '';
            
            setFormData(initialData);
            setErrors({});
        }
    }, [isOpen, nodeData]);

    useEffect(() => {
        if (!isOpen || !modalRef.current) return;
        const handleWheel = (e) => e.stopPropagation();
        const modalElement = modalRef.current;
        modalElement.addEventListener('wheel', handleWheel, { passive: false });
        return () => modalElement.removeEventListener('wheel', handleWheel);
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Validación genérica desde metadata de los campos
    const validateForm = () => {
        const newErrors = {};
        const allFields = Object.values(sections).flatMap(s => s.fields);

        allFields.forEach(field => {
            const value = formData[field.key];
            const trimmedValue = typeof value === 'string' ? value.trim() : value;

            // Campo obligatorio
            if (field.required && (!trimmedValue || trimmedValue === '')) {
                newErrors[field.key] = `${field.label} es obligatorio`;
                return;
            }

            // Validación de patrón (solo si hay valor)
            if (trimmedValue && field.validator && VALIDATORS[field.validator]) {
                const validator = VALIDATORS[field.validator];
                if (!validator.pattern.test(trimmedValue)) {
                    newErrors[field.key] = validator.message;
                }
            }
        });

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            const firstErrorField = Object.keys(validationErrors)[0];
            const element = document.getElementsByName(firstErrorField)[0];
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.focus();
            }
            return;
        }

        onSave(formData);
    };

    if (!isOpen) return null;

    // Título dinámico según el tipo de dispositivo
    const titleAction = isNewNode ? 'Configurar Nuevo' : 'Editar';
    const modalTitle = `${titleAction} ${deviceConfig.label}`;

    return (
        <>
            <div 
                className="fixed inset-0 bg-black/50 z-100 backdrop-blur-sm"
                onClick={onClose}
            />

            <div 
                ref={modalRef}
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                           bg-white rounded-2xl shadow-2xl z-101 w-[450px] flex flex-col max-h-[90vh]"
            >
                {/* Header con color del dispositivo */}
                <div 
                    className="flex items-center justify-between p-4 border-b border-gray-200 bg-white z-10 rounded-t-2xl shrink-0"
                    style={{ borderTopColor: deviceConfig.color, borderTopWidth: '4px' }}
                >
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                            style={{ backgroundColor: deviceConfig.color }}
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="18" height="18" 
                                viewBox="0 0 24 24" fill="none" 
                                stroke="currentColor" strokeWidth="2" 
                                strokeLinecap="round" strokeLinejoin="round"
                                dangerouslySetInnerHTML={{ __html: deviceConfig.iconSvg }}
                            />
                        </div>
                        {modalTitle}
                    </h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-white hover:bg-red-600 transition-all duration-200 ease-in-out p-1 rounded-full cursor-pointer relative z-20"
                        type="button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className='transition-all duration-200 ease-in-out hover:rotate-90' width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto scrollbarrContainer px-4 py-2">
                        
                        {/* Advertencia para nodo nuevo */}
                        {isNewNode && (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 shrink-0 mt-0.5">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" y1="16" x2="12" y2="12"/>
                                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                                </svg>
                                <div className="text-sm text-blue-800">
                                    <strong>Completa los campos requeridos</strong> antes de agregar el {deviceConfig.label.toLowerCase()} a la red.
                                </div>
                            </div>
                        )}

                        {/* Renderizado DINÁMICO de secciones y campos */}
                        <div className="space-y-4">
                            {Object.values(sections).map(section => (
                                <FormSection
                                    key={section.id}
                                    section={section}
                                    formData={formData}
                                    errors={errors}
                                    onChange={handleChange}
                                />
                            ))}

                            {/* Leyenda de campos requeridos */}
                            <div className="text-xs text-gray-500 flex items-center gap-1 pb-2">
                                <span className="text-red-500">*</span>
                                Campos obligatorios
                            </div>
                        </div>
                    </div>

                    {/* Botones - fijos abajo */}
                    <div className="flex gap-2 px-4 py-3 bg-white border-t border-gray-200 rounded-b-2xl shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 
                                       text-gray-700 rounded-lg transition-colors font-medium"
                        >
                            Cerrar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 text-white rounded-lg transition-colors font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                            style={{ backgroundColor: deviceConfig.color }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default NodeEditModal;