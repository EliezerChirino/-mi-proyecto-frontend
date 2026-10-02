// src/components/Layout/Sidebar.jsx
import React, { useState } from 'react';
import Corimon_logo from '../../assets/Corimon_logo.png';
import { cx } from '../../utils/cx';
import {
    getDevicesByCategory,
    getInitialDataForDevice
} from '../../config/deviceTypes';
import './Sidebar.css';

// ─── Ícono de dispositivo: trazo cuadrado, sin relleno (identidad Admin Red) ───
const DeviceIcon = ({ svgPath, size = 16 }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size} height={size}
        viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"
        dangerouslySetInnerHTML={{ __html: svgPath }}
    />
);

// ─── Asa de arrastre (6 puntos) ───
const DragHandle = () => (
    <svg width="8" height="14" viewBox="0 0 8 14" fill="currentColor">
        <rect x="0" y="1" width="2" height="2" />
        <rect x="5" y="1" width="2" height="2" />
        <rect x="0" y="6" width="2" height="2" />
        <rect x="5" y="6" width="2" height="2" />
        <rect x="0" y="11" width="2" height="2" />
        <rect x="5" y="11" width="2" height="2" />
    </svg>
);

// ─── Fila de dispositivo, expandida o compacta ───
const DeviceRow = ({ device, isSidebarOpen, onDragStart, onClick }) => {
    const initialData = getInitialDataForDevice(device.id);

    if (!isSidebarOpen) {
        return (
            <div
                className="sidebar__item sidebar__item--compact"
                draggable
                onDragStart={(e) => onDragStart(e, device.nodeType, initialData)}
                onClick={() => onClick(device.nodeType, initialData)}
                title={device.label}
            >
                <DeviceIcon svgPath={device.iconSvg} size={18} />
            </div>
        );
    }

    return (
        <div
            className="sidebar__item"
            draggable
            onDragStart={(e) => onDragStart(e, device.nodeType, initialData)}
            onClick={() => onClick(device.nodeType, initialData)}
            title="Arrastrar al lienzo"
        >
            <span className="sidebar__item-handle"><DragHandle /></span>
            <span className="sidebar__item-icon">
                <DeviceIcon svgPath={device.iconSvg} />
            </span>
            <span className="sidebar__item-label">{device.label}</span>
        </div>
    );
};

// ─── Sección colapsable por categoría ───
const CategorySection = ({ code, title, devices, isOpen, isSidebarOpen, onToggle, onDragStart, onClick }) => {
    if (!isSidebarOpen) {
        return (
            <div className="sidebar__group-items">
                <span className="sidebar__group-code">{code}</span>
                {devices.map(device => (
                    <DeviceRow
                        key={device.id}
                        device={device}
                        isSidebarOpen={false}
                        onDragStart={onDragStart}
                        onClick={onClick}
                    />
                ))}
            </div>
        );
    }

    return (
        <div>
            <button type="button" className="sidebar__group-header" onClick={onToggle}>
                <span className="sidebar__group-code">{code}</span>
                <span className="sidebar__group-name">{title}</span>
                <svg
                    className={cx('sidebar__group-chevron', !isOpen && 'sidebar__group-chevron--closed')}
                    width="12" height="12" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>
            {isOpen && (
                <div className="sidebar__group-items">
                    {devices.map(device => (
                        <DeviceRow
                            key={device.id}
                            device={device}
                            isSidebarOpen
                            onDragStart={onDragStart}
                            onClick={onClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Componente principal: Sidebar ───
const Sidebar = ({ isOpen, onToggle, onAddNode }) => {
    const categoriesData = getDevicesByCategory();
    const [expandedCategories, setExpandedCategories] = useState(
        Object.keys(categoriesData).reduce((acc, catId) => {
            acc[catId] = true;
            return acc;
        }, {})
    );

    const toggleCategory = (catId) => {
        setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
    };

    const onDragStart = (event, nodeType, extraData) => {
        const dragData = JSON.stringify({ nodeType, extraData });
        event.dataTransfer.setData('application/reactflow', dragData);
        event.dataTransfer.effectAllowed = 'move';
    };

   const handleAddNodeClick = (nodeType, extraData) => {
        onAddNode(nodeType, null, extraData);
    };

    return (
        <aside className={cx('sidebar', isOpen ? 'sidebar--expanded' : 'sidebar--collapsed')}>
            <div className="sidebar__header">
                <img src={Corimon_logo} alt="Logo de Corimon" className="sidebar__logo" />
                {isOpen && (
                    <div className="sidebar__brand">
                        <span className="sidebar__brand-name">Admin Red</span>
                        <span className="sidebar__brand-sub">Corimon, C.A.</span>
                    </div>
                )}
                <button
                    type="button"
                    onClick={onToggle}
                    className="sidebar__toggle"
                    title={isOpen ? 'Colapsar' : 'Expandir'}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
                        <path d={isOpen ? 'M4 4v16 M15 6l-6 6 6 6' : 'M20 4v16 M9 6l6 6-6 6'} />
                    </svg>
                </button>
            </div>

                {isOpen && (
                    <div className="sidebar__search">
                        <div className="sidebar__search-box">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" style={{ color: 'var(--color-text-3)', flex: 'none' }}>
                                <path d="M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13z M15.5 15.5L20 20" />
                            </svg>
                            <span className="sidebar__search-input" style={{ color: 'var(--color-text-3)' }}>Buscar dispositivo</span>
                        </div>
                    </div>
                )}

                <div className="sidebar__groups">
                    {Object.entries(categoriesData).map(([catId, catData]) => (
                        <CategorySection
                            key={catId}
                            code={catData.code}
                            title={catData.label}
                            devices={catData.devices}
                            isOpen={expandedCategories[catId]}
                            isSidebarOpen={isOpen}
                            onToggle={() => toggleCategory(catId)}
                            onDragStart={onDragStart}
                            onClick={handleAddNodeClick}
                        />
                    ))}
                </div>

            {isOpen && (
                <div className="sidebar__footer">
                    Arrastra al lienzo o haz clic para agregar
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
