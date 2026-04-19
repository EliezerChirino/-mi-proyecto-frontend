export const HANDLE_POSITIONS = {
    'top-in': 'Arriba (Entrada)',
    'top-out': 'Arriba (Salida)',
    'bottom-in': 'Abajo (Entrada)',
    'bottom-out': 'Abajo (Salida)',
    'left-in': 'Izquierda (Entrada)',
    'left-out': 'Izquierda (Salida)',
    'right-in': 'Derecha (Entrada)',
    'right-out': 'Derecha (Salida)',
};


export const HANDLE_POSITIONS_WITH_ICONS = {
    'top-in': '⬇️ Arriba',
    'top-out': '⬆️ Arriba',
    'bottom-in': '⬆️ Abajo',
    'bottom-out': '⬇️ Abajo',
    'left-in': '➡️ Izquierda',
    'left-out': '⬅️ Izquierda',
    'right-in': '⬅️ Derecha',
    'right-out': '➡️ Derecha',
};


export const extractConnectionsInfo = (nodes, edges) => {
    return nodes.map((node) => {

        const conexionesSalientes = edges.filter(edge => edge.source === node.id);

        const conexionesEntrantes = edges.filter(edge => edge.target === node.id);

        // Procesar SALIDAS (conexiones que salen de este nodo)
        const salidas = conexionesSalientes.map(edge => {
            const targetNode = nodes.find(n => n.id === edge.target);
            return {
            edgeId: edge.id,
            hacia: targetNode?.data?.label || 'Desconocido',
            haciaId: edge.target,
            saleDesde: {
                handleId: edge.sourceHandle || 'unknown',
                posicion: HANDLE_POSITIONS[edge.sourceHandle] || edge.sourceHandle,
                posicionCorta: HANDLE_POSITIONS_WITH_ICONS[edge.sourceHandle] || edge.sourceHandle,
            },
            // Información del punto de ENTRADA (nodo destino)
            llegaA: {
                handleId: edge.targetHandle || 'unknown',
                posicion: HANDLE_POSITIONS[edge.targetHandle] || edge.targetHandle,
                posicionCorta: HANDLE_POSITIONS_WITH_ICONS[edge.targetHandle] || edge.targetHandle,
            },
            etiqueta: edge.label || 'sin etiqueta',
            animada: edge.animated || false,
            };
        });

        // Procesar ENTRADAS (conexiones que llegan a este nodo)
        const entradas = conexionesEntrantes.map(edge => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            return {
            edgeId: edge.id,
            desde: sourceNode?.data?.label || 'Desconocido',
            desdeId: edge.source,
            // Información del punto de SALIDA (nodo origen)
            saleDesde: {
                handleId: edge.sourceHandle || 'unknown',
                posicion: HANDLE_POSITIONS[edge.sourceHandle] || edge.sourceHandle,
                posicionCorta: HANDLE_POSITIONS_WITH_ICONS[edge.sourceHandle] || edge.sourceHandle,
            },
            // Información del punto de ENTRADA (este nodo)
            llegaA: {
                handleId: edge.targetHandle || 'unknown',
                posicion: HANDLE_POSITIONS[edge.targetHandle] || edge.targetHandle,
                posicionCorta: HANDLE_POSITIONS_WITH_ICONS[edge.targetHandle] || edge.targetHandle,
            },
            etiqueta: edge.label || 'sin etiqueta',
            animada: edge.animated || false,
            };
        });

        return {
            id: node.id,
            tipo: node.type || 'default',
            label: node.data?.label || 'Sin nombre',
            categoria: node.data?.categoria || 'sin categoría',
            descripcion: node.data?.descripcion || '',
            ip: node.data?.ip || '',
            status: node.data?.status || '',
            posicion: {
                x: Math.round(node.position.x),
                y: Math.round(node.position.y),
            },
            conectadoA: {
                entradas: entradas.length > 0 ? entradas : 'Sin entradas',
                salidas: salidas.length > 0 ? salidas : 'Sin salidas',
                totalEntradas: entradas.length,
                totalSalidas: salidas.length,
                totalConexiones: entradas.length + salidas.length,
            },
            createdAt: node.data?.createdAt || new Date().toISOString(),
            };
        });
    };


        export const getConnectionSummary = (nodeConnectionInfo) => {
        const { conectadoA, label, categoria, ip, status } = nodeConnectionInfo;

        let summary = `╔═══════════════════════════════════════╗\n`;
        summary += `║  ${label.toUpperCase().padEnd(36)} ║\n`;
        summary += `╚═══════════════════════════════════════╝\n\n`;

        // Info básica
        summary += `📦 Categoría: ${categoria}\n`;
        if (ip) summary += `🌐 IP: ${ip}\n`;
        if (status) summary += `🔘 Estado: ${status}\n`;
        summary += `\n`;

        // Entradas
        summary += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        if (Array.isArray(conectadoA.entradas) && conectadoA.entradas.length > 0) {
        summary += `📥 ENTRADAS (${conectadoA.entradas.length}):\n\n`;
        conectadoA.entradas.forEach((entrada, index) => {
        summary += `  ${index + 1}. Desde: "${entrada.desde}"\n`;
        summary += `     ├─ Sale de: ${entrada.saleDesde.posicion}\n`;
        summary += `     └─ Llega a: ${entrada.llegaA.posicion}\n\n`;
        });
        } else {
        summary += `📥 ENTRADAS: Sin entradas\n\n`;
        }

        // Salidas
        summary += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        if (Array.isArray(conectadoA.salidas) && conectadoA.salidas.length > 0) {
        summary += `📤 SALIDAS (${conectadoA.salidas.length}):\n\n`;
        conectadoA.salidas.forEach((salida, index) => {
        summary += `  ${index + 1}. Hacia: "${salida.hacia}"\n`;
        summary += `     ├─ Sale de: ${salida.saleDesde.posicion}\n`;
        summary += `     └─ Llega a: ${salida.llegaA.posicion}\n\n`;
        });
        } else {
        summary += `📤 SALIDAS: Sin salidas\n`;
        }

        summary += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        summary += `📊 TOTAL CONEXIONES: ${conectadoA.totalConexiones}\n`;

        return summary;
        };


export const generateFlowDataForDB = (nodes, edges) => {
  const connectionsInfo = extractConnectionsInfo(nodes, edges);
  
  return {
    metadata: {
        version: '1.0',
        timestamp: new Date().toISOString(),
        totalNodes: nodes.length,
        totalConnections: edges.length,
        appVersion: '1.0.0',
        },
    nodes: connectionsInfo,
    // Guardar edges en formato limpio para reconstruir el flow
    edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        label: edge.label,
        animated: edge.animated || false,
        type: edge.type,
        style: edge.style,
        })),
    };
};

export default {
    extractConnectionsInfo,
    getConnectionSummary,
    generateFlowDataForDB,
    HANDLE_POSITIONS,
    HANDLE_POSITIONS_WITH_ICONS,
};