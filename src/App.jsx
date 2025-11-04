import { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider, // ← Cambiar a ReactFlowProvider
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

import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import RouterNode from './components/nodes/RouterNode';
const nodeTypes = {
  router: RouterNode,
};

const initialNodes = [];
const initialEdges = [];

function App() {
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const nodeIdRef = useRef(1);


  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ 
      ...params, 
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed }
    }, eds)),
    [setEdges]
  );

  const addNode = useCallback((type, position, extraData = {}) => {
    const newNode = {
      id: `node_${nodeIdRef.current}`,
      type: type || 'default',
      position,
      data: { 
        label: extraData.deviceType === 'router' 
          ? `Router ${nodeIdRef.current}` 
          : `Node ${nodeIdRef.current}`,
        ...extraData,
        createdAt: new Date().toLocaleString(),
      },
    };

    nodeIdRef.current++;
    setNodes((nds) => [...nds, newNode]);
    console.log('Nodo agregado:', newNode);
  }, [setNodes]);

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

  const handleSave = () => {
    console.log('Guardando flow...', { nodes, edges });
    alert('Flow guardado! (Ver consola)');
  };

  const handleExport = () => {
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flow-export.json';
    a.click();
    alert('Flow exportado como JSON!');
  };

  const handleClear = () => {
    if (confirm('¿Seguro que quieres limpiar todo?')) {
      setNodes([]);
      setEdges([]);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div 
        ref={reactFlowWrapper}
        className="absolute inset-0 w-full h-full"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          className='!bg-[#eeeeee]'
          connectionMode="loose"
        >
          <Background 
            color="#333" 
            gap={16}
            variant="dots"
          />
          <Controls 
            className="bg-white shadow-lg rounded-lg border border-gray-200"
          />
          <MiniMap 
            className="bg-white shadow-lg rounded-lg border border-gray-200"
            nodeColor="#6366f1"
            maskColor="rgba(0,0,0,0.1)"
          />
        </ReactFlow>
      </div>

      <Navbar 
        nodes={nodes}
        edges={edges}
        onSave={handleSave}
        onExport={handleExport}
        onClear={handleClear}
        className="px-2.5 relative z-50"
      />

      <Sidebar 
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onAddNode={addNode}
        className="relative z-40"
      />
    </div>
  );
}


export default function AppWrapper() {
  return (
    <ReactFlowProvider>  {/* ← Usa ReactFlowProvider en lugar de ReactFlow */}
      <App />
    </ReactFlowProvider>
  );
}