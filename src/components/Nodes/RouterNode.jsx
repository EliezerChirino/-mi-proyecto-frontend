import React from 'react';
import { Handle, Position } from '@xyflow/react';

const RouterNode = ({ data }) => {
    return (
        <div className="bg-white rounded-lg shadow-md border-2 border-blue-400 px-6 py-3 min-w-[150px]">
            <div className="text-center font-medium text-gray-700">
                {data.label}
            </div>
            
            {/* ARRIBA */}
            <Handle
                type="source"
                position={Position.Top}
                id="top-out"  // ← CAMBIO: ID diferente
                className="w-3 h-3 !bg-blue-500"
            />
            <Handle
                type="target"
                position={Position.Top}
                id="top-in"   // ← CAMBIO: ID diferente
                className="w-3 h-3 !bg-blue-500"
                style={{ left: '50%' }}
            />
            
            {/* ABAJO */}
            <Handle
                type="source"
                position={Position.Bottom}
                id="bottom-out"  // ← CAMBIO: ID diferente
                className="w-3 h-3 !bg-blue-500"
            />
            <Handle
                type="target"
                position={Position.Bottom}
                id="bottom-in"   // ← CAMBIO: ID diferente
                className="w-3 h-3 !bg-blue-500"
                style={{ left: '50%' }}
            />
            
            {/* IZQUIERDA */}
            <Handle
                type="source"
                position={Position.Left}
                id="left-out"  // ← CAMBIO: ID diferente
                className="w-3 h-3 !bg-blue-500"
            />
            <Handle
                type="target"
                position={Position.Left}
                id="left-in"   // ← CAMBIO: ID diferente
                className="w-3 h-3 !bg-blue-500"
                style={{ top: '50%' }}
            />
            
            {/* DERECHA */}
            <Handle
                type="source"
                position={Position.Right}
                id="right-out"  // ← CAMBIO: ID diferente
                className="w-3 h-3 !bg-blue-500"
            />
            <Handle
                type="target"
                position={Position.Right}
                id="right-in"   // ← CAMBIO: ID diferente
                className="w-3 h-3 !bg-blue-500"
                style={{ top: '50%' }}
            />
        </div>
    );
};

export default RouterNode;