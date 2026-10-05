import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import NodeDropdownMenu from '../UI/NodeDropdownMenu';
import { DEVICE_TYPES, getCategoryCode } from '../../config/deviceTypes';
import { cx } from '../../utils/cx';
import { normalizeStatus, getStatusInfo } from '../../utils/status';
import './GenericDeviceNode.css';

// Los 8 handles. Los IDs NO se tocan: las conexiones guardadas en la BD los referencian.
// "left"/"top" separa el handle de salida (55%) del de entrada (45%).
const HANDLES = [
    { id: 'top-out',    type: 'source', position: Position.Top,    style: { left: '55%' } },
    { id: 'top-in',     type: 'target', position: Position.Top,    style: { left: '45%' } },
    { id: 'bottom-out', type: 'source', position: Position.Bottom, style: { left: '55%' } },
    { id: 'bottom-in',  type: 'target', position: Position.Bottom, style: { left: '45%' } },
    { id: 'left-out',   type: 'source', position: Position.Left,   style: { top: '55%' } },
    { id: 'left-in',    type: 'target', position: Position.Left,   style: { top: '45%' } },
    { id: 'right-out',  type: 'source', position: Position.Right,  style: { top: '55%' } },
    { id: 'right-in',   type: 'target', position: Position.Right,  style: { top: '45%' } },
];


function describirVerificacion(status, data) {
    if (status !== 'online' || data.latencyMs == null) return '—';
    const metodo = (data.checkMethod || '').replace('tcp:', 'tcp ').toUpperCase();
    return `${metodo} · ${Math.round(data.latencyMs)} ms`;
}

const GenericDeviceNode = ({ data, id, selected }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);


    const connectionNodeId = data.connectingNodeId || null;
    const isConnecting = connectionNodeId != null;
    const isSource = connectionNodeId === id;
    const isTarget = isConnecting && !isSource;

    const deviceConfig = DEVICE_TYPES[data.deviceType] || DEVICE_TYPES.switch;
    const status = normalizeStatus(data.status);
    const statusInfo = getStatusInfo(status);
    const kindText = `${getCategoryCode(deviceConfig.categoria)} · ${deviceConfig.label}`;

    function handleEdit() {
        if (data.onEdit) data.onEdit(id);
    }
    function handleDelete() {
        if (data.onDelete) data.onDelete(id);
    }

    function handleDoubleClick(e) {
        e.stopPropagation();
        handleEdit();
    }

    return (
        <>
            <div
                className={cx(
                    'device-node',
                    `device-node--${status}`,
                    selected && 'device-node--selected',
                    isSource && 'device-node--source',
                    data.isDraft && 'device-node--draft'
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onDoubleClick={handleDoubleClick}
            >
            <div
                    key={data.pulse ? `card-${data.pulse.id}` : 'card'}
                    className={cx(
                        'device-node__card',
                        data.pulse && `device-node__card--shake-${data.pulse.side}`
                    )}
                >
                    <div className="device-node__header">
                        <div className="device-node__icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18" height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="square"
                                strokeLinejoin="miter"
                                dangerouslySetInnerHTML={{ __html: deviceConfig.iconSvg }}
                            />
                        </div>
                        <div className="device-node__titles">
                            <span className="device-node__kind">{kindText}</span>
                            <span className="device-node__name">{data.label || deviceConfig.label}</span>
                        </div>
                    </div>

                    <div className="device-node__status">
                        <span className="device-node__status-label">
                            <span aria-hidden="true">{statusInfo.glyph}</span>
                            {statusInfo.label}
                        </span>
                        <span className="device-node__latency">
                            {describirVerificacion(status, data)}
                        </span>
                    </div>

                    <div className="device-node__data">
                        <span className="device-node__data-key">IP</span>
                        <span className="device-node__data-value">{data.ip || '—'}</span>
                        <span className="device-node__data-key">MAC</span>
                        <span className="device-node__data-value">{data.mac || '—'}</span>
                    </div>
                </div>

                {/* Destello al recibir una conexión. key = nuevo id → la animación se repite */}
                {data.pulse && (
                    <span
                        key={`pulse-${data.pulse.id}`}
                        className={cx('device-node__pulse', `device-node__pulse--${data.pulse.side}`)}
                        aria-hidden="true"
                    >
                        <svg className="device-node__pulse-trail">
                            <rect className="device-node__pulse-cw" x="0" y="0" width="100%" height="100%" rx="4" pathLength="100" />
                            <rect className="device-node__pulse-ccw" x="0" y="0" width="100%" height="100%" rx="4" pathLength="100" />                        </svg>
                    </span>
                )}

                {/* Esquinas de visor: solo seleccionado */}
                {selected && !isConnecting && (
                    <>
                        <span className="device-node__corner device-node__corner--tl" />
                        <span className="device-node__corner device-node__corner--tr" />
                        <span className="device-node__corner device-node__corner--bl" />
                        <span className="device-node__corner device-node__corner--br" />
                    </>
                )}

                {/* Botón de menú */}
                {isHovered && !isConnecting && (
                    <button
                        className="device-node__menu"
                        title="Opciones"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowDropdown(!showDropdown);
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="5" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="12" cy="19" r="2" />
                        </svg>
                    </button>
                )}

                {showDropdown && (
                    <NodeDropdownMenu
                        nodeId={id}
                        nodeData={data}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onClose={() => setShowDropdown(false)}
                    />
                )}

                {/* Handles: los -out solo cuando no hay conexión en curso; los -in siempre en el DOM */}
                {HANDLES.map(handle => {
                    const isOut = handle.type === 'source';
                    if (isOut && isConnecting) return null;

                    return (
                        <Handle
                            key={handle.id}
                            id={handle.id}
                            type={handle.type}
                            position={handle.position}
                            style={handle.style}
                            className={cx(
                                'device-node__handle',
                                isOut ? 'device-node__handle--out' : 'device-node__handle--in',
                                !isOut && isTarget && 'device-node__handle--target'
                            )}
                        />
                    );
                })}
            </div>

        </>
    );
};

export default GenericDeviceNode;