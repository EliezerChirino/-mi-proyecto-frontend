import React, { useRef, useEffect } from 'react';

const NodeDropdownMenu = ({ 
    nodeId, 
    nodeData, 
    onEdit, 
    onDelete, 
    onClose 
}) => {
    const menuRef = useRef(null);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside, true);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside, true);
        };
    }, [onClose]);

    const handleDelete = () => {
        if (window.confirm(`¿Eliminar ${nodeData.label}?`)) {
            onDelete(nodeId);
            onClose();
        }
    };

    const handleEdit = () => {
        onEdit();
        onClose();
    };

    return (
        <div
            ref={menuRef}
            className="absolute top-full right-0 mt-2 
                        bg-white rounded-lg shadow-2xl border border-gray-200
                        min-w-[200px] py-1 z-60
                        overflow-hidden"
            style={{
                animation: 'slideDown 0.15s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()} 
        >
            {/* Editar */}
            <button
                onClick={handleEdit}
                className="w-full px-4 py-2.5 text-left text-sm 
                        hover:bg-blue-50 transition-colors
                        flex items-center gap-3 text-gray-700"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                <span className="font-medium">Editar</span>
            </button>

            {/* Separador */}
            <div className="h-px bg-gray-200 my-1"></div>

            {/* Eliminar */}
            <button
                onClick={handleDelete}
                className="w-full px-4 py-2.5 text-left text-sm 
                        hover:bg-red-50 transition-colors
                        flex items-center gap-3 text-red-600"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
                <span className="font-medium">Eliminar</span>
            </button>
        </div>
    );
};

if (typeof document !== 'undefined' && !document.querySelector('#dropdown-animations')) {
    const style = document.createElement('style');
    style.id = 'dropdown-animations';
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

export default NodeDropdownMenu;