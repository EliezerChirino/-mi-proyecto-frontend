import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import NodeDropdownMenu from '../UI/NodeDropdownMenu';
import NodeEditModal from '../UI/NodeEditModal';
import { DEVICE_TYPES, COMMON_FIELDS, getFieldsForDevice } from '../../config/deviceTypes';

const GenericDeviceNode = ({ data, id }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    
    const connectionNodeId = data.connectingNodeId || null;
    
    const isConnecting = connectionNodeId != null;
    const isSource = connectionNodeId === id;
    const isTarget = isConnecting && !isSource;

    // ⚡ Lee la configuración del tipo de dispositivo
    const deviceConfig = DEVICE_TYPES[data.deviceType] || DEVICE_TYPES.switch;
    const displayFields = deviceConfig.displayFields || { rows: [], badges: [] };
    
    // Helper para obtener el label de un campo (busca en COMMON_FIELDS + specificFields)
    const allFields = getFieldsForDevice(deviceConfig.id);
    const getFieldLabel = (key) => {
        const field = allFields.find(f => f.key === key);
        return field?.label || key;
    };

    const handleEdit = () => {
        setShowEditModal(true);
    };

    const handleSave = (updatedData) => {
        if (data.onUpdate) {
            data.onUpdate(id, updatedData);
        }
    };

    const handleDelete = () => {
        if (data.onDelete) {
            data.onDelete(id);
        }
    };

    const handleDoubleClick = (e) => {
        e.stopPropagation();
        setShowDropdown(true);
    };

    // Clases dinámicas para el borde según estado de conexión
    // En estado normal, el borde usa el color del dispositivo
    const normalBorderStyle = !isConnecting 
        ? { borderColor: deviceConfig.color } 
        : {};

    return (
        <>
            <div 
                className={`
                    relative bg-linear-to-br from-white to-gray-50 
                    rounded-xl shadow-lg border-[3px]
                    px-5 py-4 min-w-[200px]
                    transition-all duration-300
                    ${isSource ? 'border-slate-600 ring-4 ring-slate-200 scale-105' : ''}
                    ${isTarget ? 'border-green-500 ring-4 ring-green-200 scale-105' : ''}
                    ${!isConnecting ? 'hover:brightness-105' : ''}
                `}
                style={normalBorderStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onDoubleClick={handleDoubleClick}
            >
                {/* Botón de menú */}
                {isHovered && !isConnecting && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); 
                            setShowDropdown(!showDropdown);
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="absolute -top-3 -right-3 w-6 h-6 
                                    bg-gray-700 hover:bg-gray-800 
                                    text-white rounded-full shadow-lg
                                    flex items-center justify-center
                                    transition-all duration-200
                                    hover:scale-110 active:scale-95
                                    z-50 cursor-pointer"
                        title="Opciones"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="1"/>
                            <circle cx="12" cy="5" r="1"/>
                            <circle cx="12" cy="19" r="1"/>
                        </svg>
                    </button>
                )}

                {/* Dropdown Menu */}
                {showDropdown && (
                    <NodeDropdownMenu
                        nodeId={id}
                        nodeData={data}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onClose={() => setShowDropdown(false)}
                    />
                )}

                <div className="flex flex-col items-center gap-2 relative z-10">
                    
                    {/* 1. NOMBRE DEL DISPOSITIVO */}
                    <div className="font-bold text-gray-800 text-sm">
                        {data.label || deviceConfig.label}
                    </div>

                    {/* 2. ÍCONO DEL DISPOSITIVO (dinámico desde config) */}
                    <div 
                        className="w-auto h-[120px] px-6 flex items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${deviceConfig.color}15` }}
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="70" height="70" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke={deviceConfig.color}
                            strokeWidth="1.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            dangerouslySetInnerHTML={{ __html: deviceConfig.iconSvg }}
                        />
                    </div>

                    {/* 3. INFORMACIÓN (campos dinámicos desde displayFields.rows) */}
                    <div className="w-full space-y-1 text-xs">
                        {displayFields.rows.map(fieldKey => {
                            const value = data[fieldKey];
                            if (!value) return null;
                            
                            return (
                                <div 
                                    key={fieldKey} 
                                    className="flex items-center justify-between gap-2 bg-gray-100 px-2 py-1 rounded"
                                >
                                    <span className="text-gray-500 font-medium">
                                        {getFieldLabel(fieldKey)}:
                                    </span>
                                    <span className="text-gray-700 font-mono text-[10px]">
                                        {value}
                                    </span>
                                </div>
                            );
                        })}

                        {/* Badges en grid 2 columnas (displayFields.badges) */}
                        {displayFields.badges.length > 0 && 
                         displayFields.badges.some(key => data[key]) && (
                            <div className="grid grid-cols-2 gap-1">
                                {displayFields.badges.map((fieldKey, index) => {
                                    const value = data[fieldKey];
                                    if (!value) return null;
                                    
                                    // Alterna color: índice par = azul, impar = morado
                                    const colorClasses = index % 2 === 0
                                        ? 'bg-blue-100 text-blue-600 text-blue-800'
                                        : 'bg-purple-100 text-purple-600 text-purple-800';
                                    const [bg, labelColor, valueColor] = colorClasses.split(' ');
                                    
                                    return (
                                        <div 
                                            key={fieldKey} 
                                            className={`${bg} px-2 py-1 rounded text-center`}
                                        >
                                            <div className={`text-[10px] ${labelColor} font-medium`}>
                                                {getFieldLabel(fieldKey)}
                                            </div>
                                            <div className={`${valueColor} font-bold text-[10px]`}>
                                                {value}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* 4. STATUS */}
                    <div className="flex items-center gap-1.5 text-xs mt-1">
                        <div className={`w-2 h-2 rounded-full ${
                            data.status === 'activo' || !data.status
                                ? 'bg-green-500 animate-pulse' 
                                : data.status === 'inactivo'
                                ? 'bg-red-500'
                                : 'bg-yellow-500'
                        }`}></div>
                        <span className="text-gray-600 font-medium">
                            {data.status === 'activo' || !data.status ? 'Activo' : 
                                data.status === 'inactivo' ? 'Inactivo' : 
                                'Mantenimiento'}
                        </span>
                    </div>
                </div>

                {/* ========================================= */}
                {/* HANDLES - ARRIBA                         */}
                {/* ========================================= */}
                
                {/* SALIDA - top-out (DERECHA) */}
                {!isConnecting && (
                    <Handle 
                        type="source" 
                        position={Position.Top} 
                        id="top-out"
                        className={`
                            w-5 h-5 border-[3px] border-white rounded-full shadow-lg
                            bg-slate-600! ring-2 ring-slate-200
                            transition-all duration-200
                            ${isHovered ? 'opacity-100 scale-150!' : 'opacity-100 scale-110'} z-50 hover:scale-[1.8]!
                        `}
                        style={{ 
                            left: '55%',
                            transform: 'translateX(-50%) translateY(-4px)',
                        }} 
                    />
                )}
                
                {/* ENTRADA - top-in (IZQUIERDA) - SIEMPRE en DOM */}
                <Handle 
                    type="target" 
                    position={Position.Top} 
                    id="top-in"
                    className={`
                        w-6 h-6 border-4 border-white rounded-full shadow-xl
                        bg-green-500! ring-4 ring-green-300
                        transition-all duration-200
                        ${isTarget ? 'opacity-100 scale-[2]! animate-pulse z-60' : 'opacity-0 pointer-events-none scale-0 z-0'}
                    `}
                    style={{ 
                        left: '45%',
                        transform: 'translateX(-50%) translateY(-4px)',
                    }} 
                />

                {/* ========================================= */}
                {/* HANDLES - ABAJO                          */}
                {/* ========================================= */}
                
                {/* SALIDA - bottom-out (DERECHA) */}
                {!isConnecting && (
                    <Handle 
                        type="source" 
                        position={Position.Bottom} 
                        id="bottom-out"
                        className={`
                            w-5 h-5 border-[3px] border-white rounded-full shadow-lg
                            bg-slate-600! ring-2 ring-slate-200
                            transition-all duration-200
                            ${isHovered ? 'opacity-100 scale-150!' : 'opacity-100 scale-110'} z-50 hover:scale-[1.8]!
                        `}
                        style={{ 
                            left: '55%',
                            transform: 'translateX(-50%) translateY(4px)',
                        }} 
                    />
                )}
                
                {/* ENTRADA - bottom-in (IZQUIERDA) - SIEMPRE en DOM */}
                <Handle 
                    type="target" 
                    position={Position.Bottom} 
                    id="bottom-in"
                    className={`
                        w-6 h-6 border-4 border-white rounded-full shadow-xl
                        bg-green-500! ring-4 ring-green-300
                        transition-all duration-200
                        ${isTarget ? 'opacity-100 scale-[2]! animate-pulse z-60' : 'opacity-0 pointer-events-none scale-0 z-0'}
                    `}
                    style={{ 
                        left: '45%',
                        transform: 'translateX(-50%) translateY(4px)',
                    }} 
                />

                {/* ========================================= */}
                {/* HANDLES - IZQUIERDA                      */}
                {/* ========================================= */}
                
                {/* SALIDA - left-out (ABAJO) */}
                {!isConnecting && (
                    <Handle 
                        type="source" 
                        position={Position.Left} 
                        id="left-out"
                        className={`
                            w-5 h-5 border-[3px] border-white rounded-full shadow-lg
                            bg-slate-600! ring-2 ring-slate-200
                            transition-all duration-200
                            ${isHovered ? 'opacity-100 scale-150!' : 'opacity-100 scale-110'} z-50 hover:scale-[1.8]!
                        `}
                        style={{ 
                            top: '55%',
                            transform: 'translateY(-50%) translateX(-4px)',
                        }} 
                    />
                )}
                
                {/* ENTRADA - left-in (ARRIBA) - SIEMPRE en DOM */}
                <Handle 
                    type="target" 
                    position={Position.Left} 
                    id="left-in"
                    className={`
                        w-6 h-6 border-4 border-white rounded-full shadow-xl
                        bg-green-500! ring-4 ring-green-300
                        transition-all duration-200
                        ${isTarget ? 'opacity-100 scale-[2]! animate-pulse z-60' : 'opacity-0 pointer-events-none scale-0 z-0'}
                    `}
                    style={{ 
                        top: '45%',
                        transform: 'translateY(-50%) translateX(-4px)',
                    }} 
                />

                {/* ========================================= */}
                {/* HANDLES - DERECHA                        */}
                {/* ========================================= */}
                
                {/* SALIDA - right-out (ABAJO) */}
                {!isConnecting && (
                    <Handle 
                        type="source" 
                        position={Position.Right} 
                        id="right-out"
                        className={`
                            w-5 h-5 border-[3px] border-white rounded-full shadow-lg
                            bg-slate-600! ring-2 ring-slate-200
                            transition-all duration-200
                            ${isHovered ? 'opacity-100 scale-150!' : 'opacity-100 scale-110'} z-50 hover:scale-[1.8]!
                        `}
                        style={{ 
                            top: '55%',
                            transform: 'translateY(-50%) translateX(4px)',
                        }} 
                    />
                )}
                
                {/* ENTRADA - right-in (ARRIBA) - SIEMPRE en DOM */}
                <Handle 
                    type="target" 
                    position={Position.Right} 
                    id="right-in"
                    className={`
                        w-6 h-6 border-4 border-white rounded-full shadow-xl
                        bg-green-500! ring-4 ring-green-300
                        transition-all duration-200
                        ${isTarget ? 'opacity-100 scale-[2]! animate-pulse z-60' : 'opacity-0 pointer-events-none scale-0 z-0'}
                    `}
                    style={{ 
                        top: '45%',
                        transform: 'translateY(-50%) translateX(4px)',
                    }} 
                />
            </div>

            {/* Modal de edición */}
            <NodeEditModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                nodeData={data}
                onSave={handleSave}
            />
        </>
    );
};

export default GenericDeviceNode;