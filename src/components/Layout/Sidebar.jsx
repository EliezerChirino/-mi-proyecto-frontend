import React from 'react';
import Corimon_logo from '../../assets/Corimon_logo.png';

const Sidebar = ({ isOpen, onToggle, onAddNode }) => {
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
            <button 
                onClick={onToggle} 
                className="fixed top-[29%] z-20 bg-white p-2 rounded-full shadow-md transform -translate-y-1/2 cursor-pointer"
                style={{ 
                    left: isOpen ? '240px' : '110px', 
                    transition: 'left 0.3s ease-in-out' 
                }}>
                
                {isOpen ? 
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left-icon lucide-chevron-left">
                        <path d="m15 18-6-6 6-6"/>
                    </svg> 
                : 
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right-icon lucide-lucide-chevron-right">
                        <path d="m9 18 6-6-6-6"/>
                    </svg>
                }
            </button>

            <aside 
                className={`fixed bg-[#ffff] text-white z-10 transition-all duration-300 ease-in-out h-full shadow-custom
                            ${isOpen ? 'w-64 p-4' : 'w-32 p-3 overflow-hidden'}`}>
                
                {/* Logo */}
                <div className="flex items-center gap-6 mb-6">
                    <div id="logo" className="flex-col w-full rounded-[26px] items-center cursor-pointer">
                        <div className={`flex gap-2 text-[#333] ${isOpen ? 'justify-start' : 'justify-center'}`}>
                            <div className="w-[68px] shrink-0">
                                <img 
                                    src={Corimon_logo} 
                                    alt="Logo de Corimon" 
                                    className="w-full h-auto object-contain" 
                                />
                            </div>
                            <div className={`flex descripcion items-end`}>
                                <h3 className={`font-semibold text-[16px] ${isOpen ? 'block' : 'hidden'}`}>
                                    Corimon, C.A.
                                </h3>
                            </div>
                        </div>
                        <hr className="border-t border-blue-950 crm w-full my-1" />
                        <h4 className={`text-[#333] descripcion tracking-[2px] text-[13px]
                            ${isOpen ? 'block' : 'hidden'}`}>
                            y sus empresas filiales
                        </h4>
                    </div>
                </div>

                {/* Sección de Nodos */}
                <div className="space-y-3">
                    <h3 className={`text-[#333] font-semibold text-sm mb-3 ${isOpen ? 'block' : 'hidden'}`}>
                        Agregar Nodos
                    </h3>

                    {/* Botón: Agregar Router */}
                    <div
                        draggable
                        onDragStart={(e) => onDragStart(e, 'router', {  // ← CAMBIAR AQUÍ
                            categoria: 'Router',
                            descripcion: 'Router de red',
                            color: '#3B82F6',
                            ip: '',
                            status: '',
                            deviceType: 'router',
                            icon: '🔵'
                        })}
                        onClick={() => handleAddNodeClick('router', {  // ← Y AQUÍ
                            categoria: 'Router',
                            descripcion: 'Router de red',
                            color: '#3B82F6',
                            ip: '',
                            status: '',
                            deviceType: 'router',
                            icon: '🔵'
                        })}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg cursor-move text-center transition-colors"
                    >
                        {isOpen ? '🔵 Agregar Router' : '🔵'}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;