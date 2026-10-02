import React, { useState, useCallback } from 'react';
import { generateFlowDataForDB } from '../../utils/connectionUtils';
import './Navbar.css';
import { useToast } from '../../context/ToastContext';

const Navbar = ({ nodes = [], edges = [] }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [lastResponse, setLastResponse] = useState(null);

    const { notify } = useToast();

    const showAlert = useCallback((type, message) => {
        notify({ type, title: message });
    }, [notify]);
    
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
        if (nodes.some(n => n.data.isDraft)) {
            notify({
                type: 'warning',
                title: 'Hay un dispositivo sin confirmar',
                message: 'Termina de configurarlo en el panel o cancélalo antes de guardar.',
            });
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

            notify({
                type: stats.errors > 0 ? 'warning' : 'success',
                title: stats.errors > 0 ? 'Red guardada con errores' : 'Red guardada',
                message: `${stats.total_received || devicesToSave.length} dispositivos · ${connStats.total_in_db ?? edges.length} enlaces.`,
                data: `+${stats.created || 0} nuevos · ${stats.updated || 0} actualizados · ${connStats.connections_deleted || 0} enlaces eliminados`,
            });


        } catch (error) {

            notify({
                type: 'error',
                title: 'No se pudo guardar la red',
                message: `${error.message}. Los cambios siguen en el mapa.`,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
        <nav className="navbar">
            {/* Pestaña activa: Mapa */}
            <div className="navbar__tab navbar__tab--active">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square">
                    <path d="M5 5h4v4H5z M15 5h4v4h-4z M10 15h4v4h-4z M7 9v3h10V9 M12 12v3" />
                </svg>
                Mapa
            </div>

            {/* Botón Ver Objetos (inventario) */}
            <button type="button" onClick={handleShowNodes} className="navbar__tab">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square">
                    <path d="M4 6h16 M4 12h16 M4 18h16" />
                </svg>
                Ver dispositivos
                <span className="navbar__count">{nodes.length}</span>
            </button>

            <div className="navbar__spacer" />

            {/* Estado sin guardar / último resultado */}
            {lastResponse && (
                <div className="navbar__summary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {lastResponse.statistics?.created || lastResponse.created} creados
                    {lastResponse.statistics?.connections_created > 0 &&
                        ` · ${lastResponse.statistics.connections_created} conexiones`
                    }
                </div>
            )}

            {/* Botón Guardar Red */}
            <button
                type="button"
                onClick={handleSaveDevices}
                disabled={isLoading || nodes.length === 0}
                className="navbar__save"
            >
                {isLoading ? (
                    <>
                        <svg className="navbar__save-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
                            <path d="M12 3a9 9 0 1 0 9 9" />
                        </svg>
                        Guardando...
                    </>
                ) : (
                    <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
                            <path d="M4 4h13l3 3v13H4z M8 4v5h7V4 M8 14h8v6H8z" />
                        </svg>
                        Guardar red ({nodes.length})
                    </>
                )}
            </button>

            <div className="navbar__divider" />

            {/* Usuario */}
            <div className="navbar__user">
                <span className="navbar__user-avatar">TI</span>
                <span className="navbar__user-name">Usuario</span>
            </div>
        </nav>
    </>
    );
};

export default Navbar;