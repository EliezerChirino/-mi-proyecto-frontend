import React from 'react';

const Navbar = ({ nodes = [], edges = [] }) => {
    
    // Función para crear lista de objetos con info de nodos
    const handleShowNodes = () => {

        
        if (nodes.length === 0) {
            console.log('⚠️ No hay nodos creados');
            return;
        }

        // Crear array de objetos
        const nodesList = nodes.map((node) => {
            // Buscar conexiones de entrada
            const inputs = edges
                .filter(edge => edge.target === node.id)  // ✅ ESTO ESTÁ BIEN
                .map(edge => {
                    const sourceNode = nodes.find(n => n.id === edge.source);
                    return {
                        desde: sourceNode?.data?.label || 'Unknown',
                        id: edge.source,
                        label: edge.label || 'sin etiqueta'
                    };
                });

            // Buscar conexiones de salida
            const outputs = edges
                .filter(edge => edge.source === node.id)  // ✅ ESTO ESTÁ BIEN
                .map(edge => {
                    const targetNode = nodes.find(n => n.id === edge.target);
                    return {
                        hacia: targetNode?.data?.label || 'Unknown',
                        id: edge.target,
                        label: edge.label || 'sin etiqueta'
                    };
                });

            // Extraer toda la data del nodo (label + extraData)
            const { label, ...extraData } = node.data;

            // Crear objeto del nodo
            return {
                id: node.id,
                tipo: node.type,
                label: label,
                data: extraData, // ¡AQUÍ ESTÁ LA DATA EXTRA!
                conectadoA: {
                    entradas: inputs.length > 0 ? inputs : 'Sin entradas',
                    salidas: outputs.length > 0 ? outputs : 'Sin salidas'
                },
                posicion: {
                    x: Math.round(node.position.x),
                    y: Math.round(node.position.y)
                }
            };
        });

        // Mostrar la lista completa
        console.log('Lista completa de nodos:');
        console.log(nodesList);

        return nodesList;
    };

    return (
        <nav className="fixed left-0 right-0 w-full h-[60px] top-3 z-50">
            <div className="h-full px-6 flex items-center w-full justify-end">
                {/* Botón para ver nodos en consola */}
                <button
                    onClick={handleShowNodes}
                    className="backdrop-blur-md bg-blue-500/90 hover:bg-blue-600/90 text-white border border-blue-400/30 rounded-2xl shadow-custom px-4 py-2 mr-3 transition-all flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="4 17 10 11 4 5"/>
                        <line x1="12" y1="19" x2="20" y2="19"/>
                    </svg>
                    Ver Objetos ({nodes.length})
                </button>

                {/* Usuario y configuración */}
                <div className="flex items-center gap-4 backdrop-blur-md bg-white/80 border border-white/20 max-w-[150px] rounded-2xl shadow-custom p-4">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                        <span>👤</span>
                        Usuario
                    </span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;