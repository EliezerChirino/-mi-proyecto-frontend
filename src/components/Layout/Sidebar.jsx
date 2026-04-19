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
                        onDragStart={(e) => onDragStart(e, 'switch', { 
                            categoria: 'switch',
                            descripcion: 'switch de red',
                            color: '#3B82F6',
                            ip: '',
                            status: '',
                            vlan: '',           
                            mac: '',            
                            gateway: '',        
                            puerto: '',         
                            deviceType: 'switch',
                            icon: '🔵'
                        })}
                        onClick={() => handleAddNodeClick('switch', {  
                            categoria: 'switch',
                            descripcion: 'switch de red',
                            color: '#3B82F6',
                            ip: '',
                            status: '',
                            vlan: '',           
                            mac: '',            
                            gateway: '',        
                            puerto: '',         
                            deviceType: 'switch',
                            icon: '🔵'
                        })}
                        className="flex items-center justify-center text-[#333] gap-2 p-2 hover:text-white bg-blue-50 hover:bg-blue-500 rounded-2xl cursor-pointer transition-all duration-200"
                    >
                        {isOpen ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ethernet-port-icon lucide-ethernet-port">
                                <path d="m15 20 3-3h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2l3 3z"/>
                                <path d="M6 8v1"/>
                                <path d="M10 8v1"/>
                                <path d="M14 8v1"/>
                                <path d="M18 8v1"/>
                                </svg>
                                Agregar switch
                            </>
                            ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ethernet-port-icon lucide-ethernet-port">
                                <path d="m15 20 3-3h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2l3 3z"/>
                                <path d="M6 8v1"/>
                                <path d="M10 8v1"/>
                                <path d="M14 8v1"/>
                                <path d="M18 8v1"/>
                            </svg>
                            )}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;