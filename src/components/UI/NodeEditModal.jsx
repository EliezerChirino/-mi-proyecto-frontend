import React, { useState, useEffect, useRef } from 'react';
import '../../styles/scroll.css'

const NodeEditModal = ({ isOpen, onClose, nodeData, onSave, isNewNode = false }) => {
    
    const modalRef = useRef(null);
    
    const [formData, setFormData] = useState({
        label: nodeData.label || '',
        ip: nodeData.ip || '',
        vlan: nodeData.vlan || '',
        mac: nodeData.mac || '',
        gateway: nodeData.gateway || '',
        puerto: nodeData.puerto || '',
        dns: nodeData.dns || '',
        descripcion: nodeData.descripcion || '',
        ubicacion: nodeData.ubicacion || '',
        status: nodeData.status || '',
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                label: nodeData.label || '',
                ip: nodeData.ip || '',
                vlan: nodeData.vlan || '',
                mac: nodeData.mac || '',
                gateway: nodeData.gateway || '',
                puerto: nodeData.puerto || '',
                dns: nodeData.dns || '',
                descripcion: nodeData.descripcion || '',
                ubicacion: nodeData.ubicacion || '',
                status: nodeData.status || '',
            });
            setErrors({});
        }
    }, [isOpen, nodeData]);

    useEffect(() => {
        if (!isOpen || !modalRef.current) return;

        const handleWheel = (e) => {
            e.stopPropagation();
        };

        const modalElement = modalRef.current;
        
        modalElement.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            modalElement.removeEventListener('wheel', handleWheel);
        };
    }, [isOpen]);

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.label || formData.label.trim() === '') {
            newErrors.label = 'El nombre es obligatorio';
        }

        if (!formData.ip || formData.ip.trim() === '') {
            newErrors.ip = 'La dirección IP es obligatoria';
        } else {
            const ipPattern = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
            if (!ipPattern.test(formData.ip)) {
                newErrors.ip = 'Formato de IP inválido';
            }
        }

        if (!formData.gateway || formData.gateway.trim() === '') {
            newErrors.gateway = 'El gateway es obligatorio';
        } else {
            const ipPattern = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
            if (!ipPattern.test(formData.gateway)) {
                newErrors.gateway = 'Formato de gateway inválido';
            }
        }

        if (!formData.vlan || formData.vlan.trim() === '') {
            newErrors.vlan = 'La VLAN es obligatoria';
        }

        if (formData.mac && formData.mac.trim() !== '') {
            const macPattern = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
            if (!macPattern.test(formData.mac)) {
                newErrors.mac = 'Formato de MAC inválido (AA:BB:CC:DD:EE:FF)';
            }
        }

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

        //console.log(' Validación exitosa, guardando:', formData);
        
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay oscuro */}
            <div 
                className="fixed inset-0 bg-black/50 z-100   backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div 
                ref={modalRef} 
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                            bg-white rounded-2xl shadow-2xl z-101 w-[450px] flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white z-10 rounded-t-2xl shrink-0">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        {isNewNode ? 'Configurar Nuevo Switch' : 'Editar Switch'}
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
                    
                    {/* Contenedor scrolleable - CRECE y hace scroll */}
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
                                    <strong>Completa los campos requeridos</strong> antes de agregar el switch a la red.
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* INFORMACIÓN BÁSICA */}
                            <div className="space-y-3 bg-blue-50 p-3 rounded-xl">
                                <div className='flex items-center text-gray-700 uppercase tracking-wide border-b pb-1 gap-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="M12 16v-4"/>
                                        <path d="M12 8h.01"/>
                                    </svg>
                                    <h4 className="text-sm font-bold">
                                        Información Básica
                                    </h4>
                                </div>
                                
                                {/* Nombre - REQUERIDO */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Nombre del Switch <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="label"
                                        value={formData.label}
                                        onChange={handleChange}
                                        className={`text-sm w-full px-4 py-2 border border-slate-300 rounded-lg transition duration-300 ease-in-out focus:outline-blue-300 hover:shadow-lg hover:border-blue-300 bg-white
                                                    ${errors.label ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        placeholder="ej: Switch Principal"
                                    />
                                    {errors.label && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10"/>
                                                <line x1="12" y1="8" x2="12" y2="12"/>
                                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                                            </svg>
                                            {errors.label}
                                        </p>
                                    )}
                                </div>

                                {/* Descripción */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Descripción
                                    </label>
                                    <textarea
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleChange}
                                        className="text-sm w-full px-4 py-2 border border-slate-300 rounded-lg transition duration-300 ease-in-out focus:outline-blue-300 hover:shadow-lg hover:border-blue-300 bg-white resize-none"
                                        placeholder="ej: Switch principal del piso 2"
                                        rows="2"
                                    />
                                </div>
                            </div>

                            {/* CONFIGURACIÓN DE RED */}
                            <div className="space-y-3 rounded-3xl bg-slate-50 p-3">
                                <div className='flex items-center text-sm font-bold text-gray-700 uppercase tracking-wide border-b pb-1 gap-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 9a6 6 0 1 0 12 0a6 6 0 0 0 -12 0" />
                                        <path d="M12 3c1.333 .333 2 2.333 2 6s-.667 5.667 -2 6" />
                                        <path d="M12 3c-1.333 .333 -2 2.333 -2 6s.667 5.667 2 6" />
                                        <path d="M6 9h12" />
                                        <path d="M3 20h7" />
                                        <path d="M14 20h7" />
                                        <path d="M10 20a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                                        <path d="M12 15v3" />
                                    </svg>
                                    <h4>Configuración de Red</h4>
                                </div>

                                {/* IP - REQUERIDO */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Dirección IP <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="ip"
                                        value={formData.ip}
                                        onChange={handleChange}
                                        className={`text-sm w-full px-4 py-2 border border-slate-300 rounded-lg transition duration-300 ease-in-out focus:outline-blue-300 hover:shadow-lg hover:border-blue-300 bg-white
                                                    ${errors.ip ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        placeholder="ej: 192.168.1.1"
                                    />
                                    {errors.ip && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10"/>
                                                <line x1="12" y1="8" x2="12" y2="12"/>
                                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                                            </svg>
                                            {errors.ip}
                                        </p>
                                    )}
                                </div>

                                {/* Gateway - REQUERIDO */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Gateway <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="gateway"
                                        value={formData.gateway}
                                        onChange={handleChange}
                                        className={`text-sm w-full px-4 py-2 border border-slate-300 rounded-lg transition duration-300 ease-in-out focus:outline-blue-300 hover:shadow-lg hover:border-blue-300 bg-white
                                                ${errors.gateway ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        placeholder="ej: 192.168.1.254"
                                    />
                                    {errors.gateway && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10"/>
                                                <line x1="12" y1="8" x2="12" y2="12"/>
                                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                                            </svg>
                                            {errors.gateway}
                                        </p>
                                    )}
                                </div>

                                {/* Grid de 2 columnas para MAC y VLAN */}
                                <div className="grid grid-cols-2 gap-3">
                                    {/* MAC - OPCIONAL */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                                            Dirección MAC
                                        </label>
                                        <input
                                            type="text"
                                            name="mac"
                                            value={formData.mac}
                                            onChange={handleChange}
                                            className={`text-sm w-full px-4 py-2 border border-slate-300 rounded-lg transition duration-300 ease-in-out focus:outline-blue-300 hover:shadow-lg hover:border-blue-300 bg-white
                                                    ${errors.mac ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            placeholder="AA:BB:CC:DD:EE:FF"
                                        />
                                        {errors.mac && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10"/>
                                                    <line x1="12" y1="8" x2="12" y2="12"/>
                                                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                                                </svg>
                                                {errors.mac}
                                            </p>
                                        )}
                                    </div>

                                    {/* VLAN - REQUERIDO */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                                            VLAN <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="vlan"
                                            value={formData.vlan}
                                            onChange={handleChange}
                                            className={`text-sm w-full px-4 py-2 border border-slate-300 rounded-lg transition duration-300 ease-in-out focus:outline-blue-300 hover:shadow-lg hover:border-blue-300 bg-white
                                                    ${errors.vlan ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            placeholder="ej: 100"
                                        />
                                        {errors.vlan && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10"/>
                                                    <line x1="12" y1="8" x2="12" y2="12"/>
                                                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                                                </svg>
                                                {errors.vlan}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Puerto - OPCIONAL */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Puerto
                                    </label>
                                    <input
                                        type="text"
                                        name="puerto"
                                        value={formData.puerto}
                                        onChange={handleChange}
                                        className="text-sm w-full px-4 py-2 border border-slate-300 rounded-lg transition duration-300 ease-in-out focus:outline-blue-300 hover:shadow-lg hover:border-blue-300 bg-white"
                                        placeholder="ej: GigabitEthernet0/1"
                                    />
                                </div>

                                {/* DNS - OPCIONAL */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        DNS
                                    </label>
                                    <input
                                        type="text"
                                        name="dns"
                                        value={formData.dns}
                                        onChange={handleChange}
                                        className="text-sm w-full px-4 py-2 border border-slate-300 rounded-lg transition duration-300 ease-in-out focus:outline-blue-300 hover:shadow-lg hover:border-blue-300 bg-white"
                                        placeholder="ej: 8.8.8.8"
                                    />
                                </div>
                            </div>

                            {/* INFORMACIÓN ADICIONAL */}
                            <div className="space-y-3 p-3 rounded-3xl">
                                <div className='flex items-center text-sm font-bold text-gray-700 uppercase tracking-wide border-b pb-1 gap-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                        <path d="M11 14h1v4h1" />
                                        <path d="M12 11h.01" />
                                    </svg>
                                    <h4>Información Adicional</h4>
                                </div>
                                {/* Ubicación */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Ubicación
                                    </label>
                                    <input
                                        type="text"
                                        name="ubicacion"
                                        value={formData.ubicacion}
                                        onChange={handleChange}
                                        className="text-sm w-full px-4 py-2 border border-slate-300 rounded-lg transition duration-300 ease-in-out focus:outline-blue-300 hover:shadow-lg hover:border-blue-300 bg-white"
                                        placeholder="ej: Sala de servidores"
                                    />
                                </div>
                            </div>

                            {/* Leyenda de campos requeridos */}
                            <div className="text-xs text-gray-500 flex items-center gap-1 pb-2">
                                <span className="text-red-500">*</span>
                                Campos obligatorios
                            </div>
                        </div>
                    </div>

                    {/* Botones - FUERA del scroll, siempre visible */}
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
                            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 
                                    text-white rounded-lg transition-colors font-medium
                                    shadow-md hover:shadow-lg flex items-center justify-center gap-2"
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