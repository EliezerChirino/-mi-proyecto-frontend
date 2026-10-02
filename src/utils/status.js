// Un solo lugar donde se normaliza el estado que llega del backend o del modal.
const STATUS_INFO = {
    online:  { label: 'En línea',       glyph: '●' },
    offline: { label: 'Fuera de línea', glyph: '■' },
    maint:   { label: 'Mantenimiento',  glyph: '▲' },
    unknown: { label: 'Desconocido',    glyph: '○' },
};

export function normalizeStatus(raw) {
    switch (raw) {
        case 'online':
        case 'activo':
            return 'online';
        case 'offline':
        case 'inactivo':
            return 'offline';
        case 'maint':
        case 'mantenimiento':
            return 'maint';
        default:
            return 'unknown';
    }
}

export function getStatusInfo(status) {
    return STATUS_INFO[status] || STATUS_INFO.unknown;
}