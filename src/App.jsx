import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  Background,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css';

import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import GenericDeviceNode from './components/Nodes/GenericDeviceNode';
import { DEVICE_TYPES } from './config/deviceTypes';
import { normalizeStatus } from './utils/status';
import ToastRegion from './components/UI/ToastRegion';
import { ToastProvider, useToast } from './context/ToastContext';
import DevicePanel from './components/UI/DevicePanel';
import { cx } from './utils/cx';

const nodeTypes = Object.values(DEVICE_TYPES).reduce((acc, device) => {
    acc[device.nodeType] = GenericDeviceNode;
    return acc;
}, {});


const NODE_WIDTH = 220;
const NODE_HEIGHT = 134;

const initialNodes = [];
const initialEdges = [];

function getMiniMapNodeColor(node) {
    return `var(--color-st-${normalizeStatus(node.data?.status)})`;
}
function App() {
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const nodeIdRef = useRef(1);

  const [connectingNodeId, setConnectingNodeId] = useState(null);
  const [isLoadingDevices, setIsLoadingDevices] = useState(true);
  const [panel, setPanel] = useState(null);

  const { notify } = useToast();

  // Adaptador: las llamadas viejas showAlert(tipo, mensaje) siguen funcionando
  const showAlert = useCallback((type, message) => {
    notify({ type, title: message });
  }, [notify]);

  // ════════════════════════════════════════════════════════════
  //  CARGAR DISPOSITIVOS DESDE BD AL INICIAR
  // ════════════════════════════════════════════════════════════
  useEffect(() => {
    const loadDevicesFromDB = async () => {
      try {

        
        // Obtener dispositivos
        const devicesResponse = await fetch('http://localhost:8080/api/devices');
        if (!devicesResponse.ok) {
          throw new Error('Error al cargar dispositivos');
        }
        const devices = await devicesResponse.json();
        
        // Obtener conexiones
        const connectionsResponse = await fetch('http://localhost:8080/api/connections');
        if (!connectionsResponse.ok) {
          throw new Error('Error al cargar conexiones');
        }
        const connections = await connectionsResponse.json();
        
        console.log(' Dispositivos recibidos:', devices);
        console.log(' Conexiones recibidas:', connections);

        // Transformar dispositivos a nodos de React Flow
        const loadedNodes = devices.map((device, ) => {
          // Construir posición desde position_x y position_y
          const position = {
            x: device.position_x || 100,
            y: device.position_y || 100
          };
          
          console.log(`📍 ${device.nombre_dispositivo} → x: ${position.x}, y: ${position.y}`);
          
          return {
            id: device.node_id,
            type: device.tipo || '',
            position: position,
            data: {
              deviceType: device.tipo,
              label: device.nombre_dispositivo,
              ip: device.ip,
              mac: device.mac,
              gateway: device.gateway,
              vlan: device.vlan,
              puerto: device.puerto,
              dns: device.dns,
              descripcion: device.descripcion,
              ubicacion: device.ubicacion,
              status: device.status_summary?.status || 'unknown',
              categoria: device.categoria,
              createdAt: device.created_at,
              onUpdate: updateNodeData,
              onDelete: deleteNode,
              onEdit: openEditPanel,
            }
          };
        });

        // Transformar conexiones a edges de React Flow
        const loadedEdges = connections.map((conn, index) => ({
            id: `edge-${conn.id || index}`,
            source: conn.source.node_id,
            target: conn.target.node_id,
            sourceHandle: conn.source_handle || null,  
            targetHandle: conn.target_handle || null,  
            label: conn.connection_label || '',
            animated: false,
            markerEnd: { type: MarkerType.ArrowClosed },
            type: 'default',
        }));

        // Actualizar estado
        setNodes(loadedNodes);
        setEdges(loadedEdges);

        // Actualizar contador de nodos
        if (devices.length > 0) {
          const maxNodeNumber = Math.max(
            ...devices.map(d => {
              const match = d.node_id.match(/\d+$/);
              return match ? parseInt(match[0]) : 0;
            })
          );
          nodeIdRef.current = maxNodeNumber + 1;
        }

        notify({
          type: 'success',
          title: 'Red cargada',
          message: `${devices.length} dispositivos y ${connections.length} conexiones.`,
        });
        
      } catch (error) {
        console.error('❌ Error al cargar dispositivos:', error);
        notify({
          type: 'error',
          title: 'No se pudo cargar la red',
          message: `${error.message}. Verifica que el backend esté corriendo.`,
        });
      } finally {
        setIsLoadingDevices(false);
      }
    };

    loadDevicesFromDB();
  }, []); // Solo se ejecuta al montar el componente

  const updateNodeData = useCallback((nodeId, updatedData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updatedData,
            },
          };
        }
        return node;
      })
    );
    showAlert('success', `Nodo actualizado correctamente`, 2000);
  }, [setNodes, showAlert]);

  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => {
      const nodeToDelete = nds.find(n => n.id === nodeId);
      if (nodeToDelete) {
        showAlert('info', `${nodeToDelete.data.label} eliminado`, 2000);
      }
      return nds.filter((node) => node.id !== nodeId);
    });
    
    setEdges((eds) => eds.filter((edge) => 
      edge.source !== nodeId && edge.target !== nodeId
    ));
  }, [setNodes, setEdges, showAlert]);

  const openEditPanel = useCallback((nodeId) => {
    setPanel({ nodeId, isNew: false });
  }, []);

  const onConnectStart = useCallback((event, { nodeId }) => {
    console.log(' Conexión iniciada desde:', nodeId);
    setConnectingNodeId(nodeId);
  }, []);

  const onConnectEnd = useCallback(() => {
    console.log(' Conexión terminada');
    setTimeout(() => {
      setConnectingNodeId(() => {
        console.log(' Limpiando estado por onConnectEnd');
        return null;
      });
    }, 150);
  }, []);

  const isValidConnection = useCallback((connection) => {
    const sourceNode = nodes.find(n => n.id === connection.source);
    const targetNode = nodes.find(n => n.id === connection.target);

    if (!sourceNode || !targetNode) {
      showAlert('error', 'Error: Nodo no encontrado');
      return false;
    }

    if (connection.source === connection.target) {
      showAlert('warning', 'No puedes conectar un nodo consigo mismo');
      return false;
    }

    const sourceHandleId = connection.sourceHandle;
    if (sourceHandleId && sourceHandleId.includes('-in')) {
      showAlert('error', 'Error: Debes conectar desde un handle de SALIDA hacia un handle de ENTRADA');
      return false;
    }

    return true;
  }, [nodes, showAlert]);

const onConnect = useCallback(
    (params) => {
      // log de depuración detallado
      console.log(' PARAMS COMPLETOS:', {
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
        sourceHandleType: params.sourceHandle?.includes('-in') ? 'ENTRADA' : 'SALIDA',
        targetHandleType: params.targetHandle?.includes('-in') ? 'ENTRADA' : 'SALIDA'
      });
      
      console.log(' onConnect ejecutado:', params);
      
      if (!isValidConnection(params)) {
        console.log(' Conexión inválida, limpiando estado inmediatamente');
        setConnectingNodeId(null);
        return;
      }

      setEdges((eds) => addEdge({ 
        ...params, 
        animated: false,
        markerEnd: { type: MarkerType.ArrowClosed }
      }, eds));

      showAlert('success', 'Conexión creada exitosamente');
      
      setTimeout(() => {
        console.log('Limpiando estado después de conexión exitosa');
        setConnectingNodeId(null);
      }, 100);
    },
    [setEdges, isValidConnection, showAlert]
);

function getViewportCenter() {
    const rect = reactFlowWrapper.current.getBoundingClientRect();
    const center = screenToFlowPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    const offset = (nodeIdRef.current % 5) * 24;
    return {
      x: center.x - NODE_WIDTH / 2 + offset,
      y: center.y - NODE_HEIGHT / 2 + offset,
    };
  }
  const addNode = useCallback((type, position, extraData = {}) => {
    const nodeId = `node_${nodeIdRef.current}`;
    const deviceConfig = DEVICE_TYPES[extraData.deviceType];
    const finalPosition = position || getViewportCenter();

    const newNode = {
      id: nodeId,
      type: type || 'default',
      position: finalPosition,
      selected: true,
      data: { 
        label: `${deviceConfig ? deviceConfig.label : 'Dispositivo'} ${nodeIdRef.current}`,
        createdAt: new Date().toLocaleString(),
        isDraft: true,
        connectingNodeId: connectingNodeId,
        onUpdate: updateNodeData,
        onDelete: deleteNode,
        onEdit: openEditPanel,
      },
    };

    nodeIdRef.current++;
    setNodes((nds) => [...nds, newNode]);
    
    setPanel({ nodeId, isNew: true });
  }, [setNodes, connectingNodeId, updateNodeData, deleteNode, openEditPanel]);

  const handlePanelSave = useCallback((formData) => {
    if (!panel) return;
    updateNodeData(panel.nodeId, { ...formData, isDraft: false });
    setPanel(null);
  }, [panel, updateNodeData]);

  // Cancelar un nodo nuevo lo borra; cancelar una edición solo cierra
  const handlePanelCancel = useCallback(() => {
    if (panel?.isNew) deleteNode(panel.nodeId);
    setPanel(null);
  }, [panel, deleteNode]);

  React.useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          connectingNodeId: connectingNodeId,
          onUpdate: updateNodeData,
          onDelete: deleteNode,
          onEdit: openEditPanel,
        },
      }))
    );
  }, [connectingNodeId]);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const rawData = event.dataTransfer.getData('application/reactflow');
      if (!rawData) return;

      let nodeType, extraData;
      try {
        const parsed = JSON.parse(rawData);
        nodeType = parsed.nodeType;
        extraData = parsed.extraData;
      } catch {
        nodeType = rawData;
        extraData = {};
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(nodeType, position, extraData);
    },
    [screenToFlowPosition, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleExport = () => {
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flow-export.json';
    a.click();
    showAlert('success', '✓ Flow exportado como JSON', 2000);
  };

  const handleClear = () => {
    if (confirm('¿Seguro que quieres limpiar todo?')) {
      setNodes([]);
      setEdges([]);
      showAlert('info', 'Canvas limpiado', 2000);
    }
  };

  //  Indicador de carga
  if (isLoadingDevices) {
    return (
      <div className="app-loading">
        <svg className="app-loading__spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
          <path d="M12 3a9 9 0 1 0 9 9" />
        </svg>
        <span>Cargando red…</span>
      </div>
    );
  }

  const panelNode = panel ? nodes.find(n => n.id === panel.nodeId) : null;
  const takenIps = panelNode
    ? nodes.filter(n => n.id !== panelNode.id && n.data.ip).map(n => n.data.ip.trim())
    : [];

  return (
    
    <div className="app-shell">

      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onAddNode={addNode}
      />

      <div className="app-shell__main">
        <Navbar
          nodes={nodes}
          edges={edges}
          onExport={handleExport}
          onClear={handleClear}
        />

        <div
          ref={reactFlowWrapper}
          className={cx('app-shell__canvas', panelNode && 'app-shell__canvas--with-panel')}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onConnectStart={onConnectStart}
            onConnectEnd={onConnectEnd}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            isValidConnection={isValidConnection}
            fitView
            style={{ background: 'var(--color-bg-0)' }}
            connectionMode="loose"
          >
            <Background
              color="var(--canvas-dot-color)"
              gap={16}
              variant="dots"
            />
            <Controls showInteractive={false} />
            <MiniMap nodeColor={getMiniMapNodeColor} pannable zoomable />
          </ReactFlow>

          {panelNode && (
            <DevicePanel
              key={panelNode.id}
              node={panelNode}
              isNew={panel.isNew}
              takenIps={takenIps}
              onSave={handlePanelSave}
              onCancel={handlePanelCancel}
            />
          )}

          <ToastRegion />
        </div>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <ReactFlowProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ReactFlowProvider>
  );
}