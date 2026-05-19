// src/components/Layout/Sidebar.jsx
import React, { useState } from 'react';
import Corimon_logo from '../../assets/Corimon_logo.png';
import { 
    getDevicesByCategory, 
    getInitialDataForDevice 
} from '../../config/deviceTypes';


const DeviceIcon = ({ svgPath, className = "" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="22" height="22" 
        viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className={className}
        dangerouslySetInnerHTML={{ __html: svgPath }}
    />
);

// ─── Componente interno: botón individual de dispositivo ───────
const DeviceButton = ({ device, isOpen, onDragStart, onClick }) => {
    const initialData = getInitialDataForDevice(device.id);
    
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, device.nodeType, initialData)}
            onClick={() => onClick(device.nodeType, initialData)}
            className={`flex items-center text-[#333] gap-2 p-2 
                       hover:text-white ${device.bgLight} ${device.bgHover}
                       rounded-xl cursor-pointer transition-all duration-200
                       ${isOpen ? 'justify-start px-3' : 'justify-center'}`}
            title={!isOpen ? device.label : ''}
        >
            <DeviceIcon svgPath={device.iconSvg} />
            {isOpen && <span className="text-sm font-medium">{device.label}</span>}
        </div>
    );
};

// ─── Componente interno: sección colapsable por categoría ──────
const CategorySection = ({ title, devices, isOpen, isSidebarOpen, onToggle, onDragStart, onClick }) => {
    return (
        <div className="mb-3">
            {isSidebarOpen && (
                <button
                    onClick={onToggle}
                    className="w-full flex items-center justify-between px-1 py-1.5 
                              text-[#333] hover:text-blue-600 transition-colors group"
                >
                    <span className="text-xs font-bold uppercase tracking-wider">
                        {title}
                    </span>
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" height="16" 
                        viewBox="0 0 24 24" fill="none" 
                        stroke="currentColor" strokeWidth="2.5" 
                        strokeLinecap="round" strokeLinejoin="round"
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    >
                        <polyline points="6 9 12 15 18 9"/>
                    </svg>
                </button>
            )}
            
            <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out
                           ${isOpen || !isSidebarOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="space-y-1.5 mt-1">
                    {devices.map(device => (
                        <DeviceButton
                            key={device.id}
                            device={device}
                            isOpen={isSidebarOpen}
                            onDragStart={onDragStart}
                            onClick={onClick}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

// ─── Componente principal: Sidebar ─────────────────────────────
const Sidebar = ({ isOpen, onToggle, onAddNode }) => {
    // Estado de qué categorías están expandidas (todas por defecto)
    const categoriesData = getDevicesByCategory();
    const [expandedCategories, setExpandedCategories] = useState(
        Object.keys(categoriesData).reduce((acc, catId) => {
            acc[catId] = true;
            return acc;
        }, {})
    );

    const toggleCategory = (catId) => {
        setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
    };

    const onDragStart = (event, nodeType, extraData) => {
        const dragData = JSON.stringify({ nodeType, extraData });
        event.dataTransfer.setData('application/reactflow', dragData);
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleAddNodeClick = (nodeType, extraData) => {
        const randomPosition = {
            x: Math.random() * 400,
            y: Math.random() * 400,
        };
        onAddNode(nodeType, randomPosition, extraData);
    };

    return (
        <>
            {/* Botón toggle sidebar */}
            <button 
                onClick={onToggle} 
                className="fixed top-[29%] z-20 bg-white p-2 rounded-full shadow-md transform -translate-y-1/2 cursor-pointer"
                style={{ 
                    left: isOpen ? '240px' : '110px', 
                    transition: 'left 0.3s ease-in-out' 
                }}
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6"/>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6"/>
                    </svg>
                )}
            </button>

            <aside 
                className={`fixed bg-white text-white z-10 transition-all duration-300 ease-in-out h-full shadow-custom
                           overflow-y-auto
                           ${isOpen ? 'w-64 p-4' : 'w-32 p-3'}`}
            >
                {/* Logo */}
                <div className="flex items-center gap-6 mb-6">
                    <div id="logo" className="flex-col w-full rounded-[26px] items-center cursor-pointer">
                        <div className={`flex gap-2 text-[#333] ${isOpen ? 'justify-start' : 'justify-center'}`}>
                            <div className="w-[68px] shrink-0">
                                <img src={Corimon_logo} alt="Logo de Corimon" className="w-full h-auto object-contain" />
                            </div>
                            <div className="flex descripcion items-end">
                                <h3 className={`font-semibold text-[16px] ${isOpen ? 'block' : 'hidden'}`}>
                                    Corimon, C.A.
                                </h3>
                            </div>
                        </div>
                        <hr className="border-t border-blue-950 crm w-full my-1" />
                        <h4 className={`text-[#333] descripcion tracking-[2px] text-[13px] ${isOpen ? 'block' : 'hidden'}`}>
                            y sus empresas filiales
                        </h4>
                    </div>
                </div>

                {/* Título de sección */}
                {isOpen && (
                    <div className="mb-4 pb-2 border-b border-gray-200">
                        <h3 className="text-[#333] font-semibold text-sm">
                            Agregar Nodos
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Arrastra o haz clic
                        </p>
                    </div>
                )}

                {/* Categorías dinámicas */}
                <div className="space-y-2 pb-20">
                    {Object.entries(categoriesData).map(([catId, catData]) => (
                        <CategorySection
                            key={catId}
                            title={catData.label}
                            devices={catData.devices}
                            isOpen={expandedCategories[catId]}
                            isSidebarOpen={isOpen}
                            onToggle={() => toggleCategory(catId)}
                            onDragStart={onDragStart}
                            onClick={handleAddNodeClick}
                        />
                    ))}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;