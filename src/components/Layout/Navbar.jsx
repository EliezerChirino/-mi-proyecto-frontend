import React, { useState, useCallback } from 'react';
import { generateFlowDataForDB } from '../../utils/connectionUtils';
import Alert from '../UI/Alert';

const Navbar = ({ nodes = [], edges = [] }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [lastResponse, setLastResponse] = useState(null);
    const [alert, setAlert] = useState(null);
    
    const showAlert = useCallback((type, message, duration = 3000) => {
    setAlert({ type, message, duration });
    }, []);

    const closeAlert = useCallback(() => {
    setAlert(null);
    }, []);
    
    const handleShowNodes = () => {
        if (nodes.length === 0) {
            showAlert('info', 'No hay nodos creados para mostrar.');
            console.log('No hay nodos creados');
            return;
            
        }

        const flowData = generateFlowDataForDB(nodes, edges);
        
        console.log('\n📊 Nodos con conexiones:');
        flowData.nodes.forEach(node => {
            console.log(`\n${node.label}:`);
            console.log('  Entradas:', node.conectadoA.entradas);
            console.log('  Salidas:', node.conectadoA.salidas);
        });

        return flowData;
    };

    const handleSaveDevices = async () => {
        if (nodes.length === 0) {
            showAlert('warning', 'No hay nodos para guardar. Crea dispositivos antes de guardar.');
            return;
        }

        const ips = nodes.map(n => n.data.ip).filter(ip => ip && ip.trim() !== '');
        const duplicateIps = ips.filter((ip, index) => ips.indexOf(ip) !== index);
        
        if (duplicateIps.length > 0) {
            showAlert('error', `IPs duplicadas detectadas: ${[...new Set(duplicateIps)].join(', ')}. Asigna IPs únicas a cada dispositivo.`);
            return;
        }

        setIsLoading(true);

        try {
            // ============================================
            // PASO 1: GUARDAR/ACTUALIZAR DISPOSITIVOS
            // ============================================
            console.log('💾 Guardando dispositivos...');
            
            const flowData = generateFlowDataForDB(nodes, edges);
            
            const devicesToSave = flowData.nodes.map(node => {
                const originalNode = nodes.find(n => n.id === node.id);

                return {
                    id: node.id,
                    label: node.label,
                    tipo: node.tipo,
                    posicion: node.posicion,
                    data: {
                        ip: originalNode?.data.ip || '',
                        mac: originalNode?.data.mac || '',
                        gateway: originalNode?.data.gateway || '',
                        vlan: originalNode?.data.vlan || '',
                        puerto: originalNode?.data.puerto || '',
                        dns: originalNode?.data.dns || '',           // ✅ DNS INCLUIDO
                        ubicacion: originalNode?.data.ubicacion || '',
                        descripcion: originalNode?.data.descripcion || ''
                    },
                    conectadoA: {
                        entradas: node.conectadoA.entradas === 'Sin entradas' ? [] :
                            node.conectadoA.entradas.map(entrada => ({
                                desde: entrada.desdeId,
                                id: entrada.desdeId,
                                label: entrada.etiqueta || 'sin etiqueta'
                            })),
                        salidas: node.conectadoA.salidas === 'Sin salidas' ? [] :
                            node.conectadoA.salidas.map(salida => ({
                                hacia: salida.haciaId,
                                id: salida.haciaId,
                                label: salida.etiqueta || 'sin etiqueta'
                            }))
                    }
                };
            });

            const devicesPayload = { devices: devicesToSave };

            console.log('📤 Enviando dispositivos:', JSON.stringify(devicesPayload, null, 2));

            const deviceResponse = await fetch('http://localhost:8080/api/devices/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(devicesPayload)
            });

            if (!deviceResponse.ok) {
                const errorData = await deviceResponse.json().catch(() => ({}));
                showAlert('error', `Error al guardar dispositivos: ${errorData.detail || deviceResponse.statusText}`);
                throw new Error(
                    `Error al guardar dispositivos: ${errorData.detail || deviceResponse.statusText}`
                );
            }

            const deviceResult = await deviceResponse.json();
            console.log('✅ Dispositivos guardados:', deviceResult);

            // ============================================
            // PASO 2: SINCRONIZAR CONEXIONES
            // ============================================
            console.log('🔗 Sincronizando conexiones...');
            
            const connectionsPayload = {
                edges: edges.map(edge => ({
                    source: edge.source,
                    target: edge.target,
                    label: edge.label || '',
                    sourceHandle: edge.sourceHandle || '', 
                    targetHandle: edge.targetHandle || '', 
                }))
            };

            console.log('📤 Enviando conexiones:', connectionsPayload);

            const connectionsResponse = await fetch('http://localhost:8080/api/connections/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(connectionsPayload)
            });

            if (!connectionsResponse.ok) {
                const errorData = await connectionsResponse.json().catch(() => ({}));
                showAlert('error', `Error al sincronizar conexiones: ${errorData.detail || connectionsResponse.statusText}`);
                throw new Error(
                    `Error al sincronizar conexiones: ${errorData.detail || connectionsResponse.statusText}`
                );
            }

            const connectionsResult = await connectionsResponse.json();
            console.log('✅ Conexiones sincronizadas:', connectionsResult);

            // ============================================
            // MOSTRAR RESULTADO FINAL
            // ============================================
            setLastResponse({
                ...deviceResult,
                connections: connectionsResult.statistics
            });

            const stats = deviceResult.statistics || deviceResult;
            const connStats = connectionsResult.statistics || {};

            showAlert('success', `¡Red Guardada exitosamente!\n\n` +
                `DISPOSITIVOS:\n` +
                `   • Creados: ${stats.created || 0}\n` +
                `   • Actualizados: ${stats.updated || 0}\n` +
                `   • Total procesados: ${stats.total_received || devicesToSave.length}\n\n` +
                `CONEXIONES:\n` +
                `   • Creadas: ${connStats.connections_created || 0}\n` +
                `   • Eliminadas: ${connStats.connections_deleted || 0}\n` +
                `   • Total actual: ${connStats.total_in_db || edges.length}\n` +
                `${stats.errors > 0 ? `\n⚠️ Errores: ${stats.errors}` : ''}`);


        } catch (error) {
            console.error('❌ Error al guardar:', error);
            showAlert('error', `Error al guardar:\n\n${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
        <nav className="fixed left-0 right-0 w-full h-[60px] top-3 z-50">
            <div className="h-full px-6 flex items-center w-full justify-end gap-3">
                
                {/* Botón Ver Objetos */}
                <button
                    onClick={handleShowNodes}
                    className="backdrop-blur-md bg-blue-500/90 hover:bg-blue-600/90 text-white border border-blue-400/30 rounded-2xl shadow-custom px-4 py-2 transition-all flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="4 17 10 11 4 5"/>
                        <line x1="12" y1="19" x2="20" y2="19"/>
                    </svg>
                    Ver Objetos ({nodes.length})
                </button>

                {/* Botón Guardar Red */}
                <button
                    onClick={handleSaveDevices}
                    disabled={isLoading || nodes.length === 0}
                    className={`backdrop-blur-md border rounded-2xl shadow-custom px-4 py-2 transition-all flex items-center gap-2 ${
                        isLoading 
                            ? 'bg-gray-400/90 border-gray-300/30 text-white cursor-not-allowed'
                            : nodes.length === 0
                                ? 'bg-gray-300/90 border-gray-200/30 text-gray-500 cursor-not-allowed'
                                : 'bg-green-500/90 hover:bg-green-600/90 border-green-400/30 text-white'
                    }`}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="2" x2="12" y2="6"/>
                                <line x1="12" y1="18" x2="12" y2="22"/>
                                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                                <line x1="2" y1="12" x2="6" y2="12"/>
                                <line x1="18" y1="12" x2="22" y2="12"/>
                                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
                                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                            </svg>
                            Guardando...
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                                <polyline points="17 21 17 13 7 13 7 21"/>
                                <polyline points="7 3 7 8 15 8"/>
                            </svg>
                            Guardar Red ({nodes.length})
                        </>
                    )}
                </button>

                {/* Indicador de último guardado */}
                {lastResponse && (
                    <div className="backdrop-blur-md bg-green-500/90 border border-green-400/30 rounded-2xl shadow-custom px-3 py-2 text-white text-xs flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {lastResponse.statistics?.created || lastResponse.created} creados
                        {lastResponse.statistics?.connections_created > 0 && 
                            ` • ${lastResponse.statistics.connections_created} conexiones`
                        }
                    </div>
                )}

                {/* Usuario */}
                <div className="flex items-center gap-4 backdrop-blur-md bg-white/80 border border-white/20 max-w-[150px] rounded-2xl shadow-custom p-4">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                        <span>👤</span>
                        Usuario
                    </span>
                </div>
            </div>
        </nav>
        {alert && (
            <Alert
                type={alert.type}
                message={alert.message}
                duration={alert.duration}
                onClose={closeAlert}
            />
        )}
    </>
    );
};

export default Navbar;