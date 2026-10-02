// src/components/UI/NodeDropdownMenu.jsx
// Menú flotante del nodo: Editar / Eliminar (con confirmación dentro del menú).
import React, { useRef, useEffect, useState } from 'react';
import './NodeDropdownMenu.css';

const NodeDropdownMenu = ({ nodeId, nodeData, onEdit, onDelete, onClose }) => {
    const menuRef = useRef(null);
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    // Cierra al hacer clic fuera o al presionar Esc
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) onClose();
        }
        function handleEscape(event) {
            if (event.key === 'Escape') onClose();
        }
        document.addEventListener('mousedown', handleClickOutside, true);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside, true);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    function handleEdit() {
        onEdit();
        onClose();
    }

    function handleDelete() {
        onDelete(nodeId);
        onClose();
    }

    return (
        <div
            ref={menuRef}
            className="node-menu nodrag"
            role="menu"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
        >
            <button type="button" role="menuitem" className="node-menu__item" onClick={handleEdit}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square">
                    <path d="M4 20h4L19 9l-4-4L4 16z M13 7l4 4" />
                </svg>
                Editar
            </button>

            <div className="node-menu__divider" />

            {confirmingDelete ? (
                <div className="node-menu__confirm">
                    <span>¿Eliminar {nodeData.label}?</span>
                    <button type="button" className="node-menu__confirm-btn" onClick={handleDelete} autoFocus>
                        Sí
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    role="menuitem"
                    className="node-menu__item node-menu__item--danger"
                    onClick={() => setConfirmingDelete(true)}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square">
                        <path d="M4 7h16 M9 7V4h6v3 M6 7l1 13h10l1-13 M10 11v6 M14 11v6" />
                    </svg>
                    Eliminar
                </button>
            )}
        </div>
    );
};

export default NodeDropdownMenu;