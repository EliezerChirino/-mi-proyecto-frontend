// src/config/deviceTypes.js

/**
 * ═══════════════════════════════════════════════════════════════
 * CONFIGURACIÓN CENTRAL DE TIPOS DE DISPOSITIVOS
 * ═══════════════════════════════════════════════════════════════
 * 
 * Fuente ÚNICA de verdad para:
 *   - Sidebar (qué botones mostrar y en qué categoría)
 *   - Canvas (color e ícono de cada nodo)
 *   - Modal de edición (qué campos mostrar y cómo validarlos)
 * 
 * Para agregar un dispositivo nuevo:
 *   1. Agrega un objeto en DEVICE_TYPES con un id único
 *   2. Define su categoría, color e ícono
 *   3. Define sus specificFields (campos propios de ese tipo)
 *   4. Listo - aparece solo en Sidebar, Modal y Canvas
 */


// ═══════════════════════════════════════════════════════════════
//  CATEGORÍAS (grupos colapsables del Sidebar)
// ═══════════════════════════════════════════════════════════════
export const CATEGORIES = {
    RED:         { id: 'red',         label: 'Red',         order: 1 },
    ENDPOINTS:   { id: 'endpoints',   label: 'Endpoints',   order: 2 },
    SEGURIDAD:   { id: 'seguridad',   label: 'Seguridad',   order: 3 },
    PERIFERICOS: { id: 'perifericos', label: 'Periféricos', order: 4 },
    SERVICIOS:   { id: 'servicios',   label: 'Servicios',   order: 5 },
};


// ═══════════════════════════════════════════════════════════════
//  SECCIONES del Modal (grupos visuales dentro del formulario)
// ═══════════════════════════════════════════════════════════════
export const SECTIONS = {
    BASICA: {
        id: 'basica',
        label: 'Información Básica',
        bgClass: 'bg-blue-50',
        order: 1,
        iconSvg: `<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>`
    },
    RED: {
        id: 'red',
        label: 'Configuración de Red',
        bgClass: 'bg-slate-50',
        order: 2,
        iconSvg: `<path d="M6 9a6 6 0 1 0 12 0a6 6 0 0 0 -12 0"/><path d="M12 3c1.333 .333 2 2.333 2 6s-.667 5.667 -2 6"/><path d="M12 3c-1.333 .333 -2 2.333 -2 6s.667 5.667 2 6"/><path d="M6 9h12"/><path d="M3 20h7"/><path d="M14 20h7"/><path d="M10 20a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"/><path d="M12 15v3"/>`
    },
    ADICIONAL: {
        id: 'adicional',
        label: 'Información Adicional',
        bgClass: '',
        order: 3,
        iconSvg: `<path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/><path d="M11 14h1v4h1"/><path d="M12 11h.01"/>`
    },
};


// ═══════════════════════════════════════════════════════════════
//  VALIDADORES (patrones regex reutilizables)
// ═══════════════════════════════════════════════════════════════
export const VALIDATORS = {
    ip: {
        pattern: /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/,
        message: 'Formato de IP inválido'
    },
    mac: {
        pattern: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
        message: 'Formato de MAC inválido (AA:BB:CC:DD:EE:FF)'
    },
    url: {
        pattern: /^https?:\/\/.+/,
        message: 'Debe comenzar con http:// o https://'
    }
};


// ═══════════════════════════════════════════════════════════════
//  CAMPOS COMUNES (aplican a TODOS los dispositivos)
// ═══════════════════════════════════════════════════════════════
/**
 * Estructura de un campo:
 *   - key:         nombre en formData (ej: 'ip')
 *   - label:       texto visible en el <label>
 *   - type:        'text' | 'textarea' | 'select' | 'number'
 *   - section:     'basica' | 'red' | 'adicional'
 *   - required:    true/false
 *   - validator:   'ip' | 'mac' | 'url' (opcional)
 *   - placeholder: texto placeholder del input
 *   - colSpan:     1 para media columna en grid, undefined para ancho completo
 *   - options:     array de strings (solo para type: 'select')
 *   - rows:        número de filas (solo para type: 'textarea')
 */
export const COMMON_FIELDS = [
    // ─── Sección BÁSICA ───
    {
        key: 'label',
        label: 'Nombre',
        type: 'text',
        section: 'basica',
        required: true,
        placeholder: 'ej: Switch Principal'
    },
    {
        key: 'descripcion',
        label: 'Descripción',
        type: 'textarea',
        section: 'basica',
        required: false,
        placeholder: 'ej: Switch principal del piso 2',
        rows: 2
    },

    // ─── Sección RED ───
    {
        key: 'ip',
        label: 'Dirección IP',
        type: 'text',
        section: 'red',
        required: true,
        validator: 'ip',
        placeholder: 'ej: 192.168.1.1'
    },
    {
        key: 'mac',
        label: 'Dirección MAC',
        type: 'text',
        section: 'red',
        required: false,
        validator: 'mac',
        placeholder: 'AA:BB:CC:DD:EE:FF',
        colSpan: 1
    },

    // ─── Sección ADICIONAL ───
    {
        key: 'ubicacion',
        label: 'Ubicación',
        type: 'text',
        section: 'adicional',
        required: false,
        placeholder: 'ej: Sala de servidores'
    },
];


// ═══════════════════════════════════════════════════════════════
//  DEVICE TYPES (definición de cada tipo de dispositivo)
// ═══════════════════════════════════════════════════════════════
export const DEVICE_TYPES = {

    // ─────────────────────────────────────────────────────────
    //  SWITCH (Red)
    // ─────────────────────────────────────────────────────────
    switch: {
        id: 'switch',
        label: 'Switch',
        categoria: CATEGORIES.RED.id,
        nodeType: 'switch',
        color: '#3B82F6',
        bgLight: 'bg-blue-50',
        bgHover: 'hover:bg-blue-500',
        iconSvg: `<path d="m15 20 3-3h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2l3 3z"/><path d="M6 8v1"/><path d="M10 8v1"/><path d="M14 8v1"/><path d="M18 8v1"/>`,
        displayFields: {
            rows: ['ip', 'gateway', 'mac', 'dns'],      
            badges: ['vlan', 'puerto']                   
        },
        specificFields: [
            {
                key: 'gateway',
                label: 'Gateway',
                type: 'text',
                section: 'red',
                required: true,
                validator: 'ip',
                placeholder: 'ej: 192.168.1.254'
            },
            {
                key: 'vlan',
                label: 'VLAN',
                type: 'text',
                section: 'red',
                required: true,
                placeholder: 'ej: 100',
                colSpan: 1
            },
            {
                key: 'puerto',
                label: 'Puerto',
                type: 'text',
                section: 'red',
                required: false,
                placeholder: 'ej: GigabitEthernet0/1'
            },
            {
                key: 'dns',
                label: 'DNS',
                type: 'text',
                section: 'red',
                required: false,
                placeholder: 'ej: 8.8.8.8'
            },
        ],
    },

    // ─────────────────────────────────────────────────────────
    //  ROUTER (Red)
    // ─────────────────────────────────────────────────────────
    router: {
        id: 'router',
        label: 'Router',
        categoria: CATEGORIES.RED.id,
        nodeType: 'router',
        color: '#8B5CF6',
        bgLight: 'bg-purple-50',
        bgHover: 'hover:bg-purple-500',
        iconSvg: `<rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6.01 18H6M10.01 18H10M15 10V6a3 3 0 0 0-3-3V3a3 3 0 0 0-3 3v4"/><path d="M18 10V6a6 6 0 0 0-12 0v4"/>`,
        displayFields: {
            rows: ['ip', 'gateway', 'wan_ip', 'mac'],
            badges: ['protocolo_ruteo']
        },
        specificFields: [
            {
                key: 'gateway',
                label: 'Gateway',
                type: 'text',
                section: 'red',
                required: true,
                validator: 'ip',
                placeholder: 'ej: 192.168.1.254'
            },
            {
                key: 'wan_ip',
                label: 'IP WAN',
                type: 'text',
                section: 'red',
                required: false,
                validator: 'ip',
                placeholder: 'ej: 200.44.1.10'
            },
            {
                key: 'protocolo_ruteo',
                label: 'Protocolo de ruteo',
                type: 'select',
                section: 'red',
                required: false,
                options: ['Estático', 'OSPF', 'BGP', 'RIP', 'EIGRP']
            },
        ],
    },

    // ─────────────────────────────────────────────────────────
    //  PC (Endpoints)
    // ─────────────────────────────────────────────────────────
    pc: {
        id: 'pc',
        label: 'PC',
        categoria: CATEGORIES.ENDPOINTS.id,
        nodeType: 'pc',
        color: '#10B981',
        bgLight: 'bg-emerald-50',
        bgHover: 'hover:bg-emerald-500',
        iconSvg: `<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>`,
        displayFields: {
            rows: ['ip', 'mac', 'usuario'],
            badges: ['sistema_operativo']
        },
        specificFields: [
            {
                key: 'gateway',
                label: 'Gateway',
                type: 'text',
                section: 'red',
                required: false,
                validator: 'ip',
                placeholder: 'ej: 192.168.1.254'
            },
            {
                key: 'sistema_operativo',
                label: 'Sistema Operativo',
                type: 'select',
                section: 'adicional',
                required: false,
                options: ['Windows 11', 'Windows 10', 'Ubuntu', 'macOS', 'Otro']
            },
            {
                key: 'usuario',
                label: 'Usuario asignado',
                type: 'text',
                section: 'adicional',
                required: false,
                placeholder: 'ej: juan.perez'
            },
        ],
    },

    // ─────────────────────────────────────────────────────────
    //  SERVIDOR (Endpoints)
    // ─────────────────────────────────────────────────────────
    servidor: {
        id: 'servidor',
        label: 'Servidor',
        categoria: CATEGORIES.ENDPOINTS.id,
        nodeType: 'servidor',
        color: '#F59E0B',
        bgLight: 'bg-amber-50',
        bgHover: 'hover:bg-amber-500',
        iconSvg: `<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>`,
        displayFields: {
            rows: ['ip', 'gateway', 'mac'],
            badges: ['rol', 'sistema_operativo']
        },
        specificFields: [
            {
                key: 'gateway',
                label: 'Gateway',
                type: 'text',
                section: 'red',
                required: false,
                validator: 'ip'
            },
            {
                key: 'sistema_operativo',
                label: 'SO del servidor',
                type: 'select',
                section: 'adicional',
                required: false,
                options: ['Windows Server 2022', 'Windows Server 2019', 'Ubuntu Server', 'CentOS', 'Debian', 'Otro']
            },
            {
                key: 'rol',
                label: 'Rol',
                type: 'select',
                section: 'adicional',
                required: false,
                options: ['Web', 'Base de Datos', 'Archivos', 'DNS', 'DHCP', 'Active Directory', 'Correo', 'Otro']
            },
        ],
    },

    // ─────────────────────────────────────────────────────────
    //  CÁMARA IP (Seguridad)
    // ─────────────────────────────────────────────────────────
    camara_ip: {
        id: 'camara_ip',
        label: 'Cámara IP',
        categoria: CATEGORIES.SEGURIDAD.id,
        nodeType: 'camara_ip',
        color: '#EF4444',
        bgLight: 'bg-red-50',
        bgHover: 'hover:bg-red-500',
        iconSvg: `<path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>`,
        displayFields: {
            rows: ['ip', 'modelo'],
            badges: ['resolucion']
        },
        specificFields: [
            {
                key: 'resolucion',
                label: 'Resolución',
                type: 'select',
                section: 'adicional',
                required: false,
                options: ['720p', '1080p', '2K', '4K']
            },
            {
                key: 'modelo',
                label: 'Modelo',
                type: 'text',
                section: 'adicional',
                required: false,
                placeholder: 'ej: Hikvision DS-2CD2043'
            },
        ],
    },

    // ─────────────────────────────────────────────────────────
    //  FIREWALL (Seguridad)
    // ─────────────────────────────────────────────────────────
    firewall: {
        id: 'firewall',
        label: 'Firewall',
        categoria: CATEGORIES.SEGURIDAD.id,
        nodeType: 'firewall',
        color: '#DC2626',
        bgLight: 'bg-red-100',
        bgHover: 'hover:bg-red-600',
        iconSvg: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
        displayFields: {
            rows: ['ip', 'gateway', 'modelo'],
            badges: []
        },
        specificFields: [
            {
                key: 'gateway',
                label: 'Gateway',
                type: 'text',
                section: 'red',
                required: true,
                validator: 'ip'
            },
            {
                key: 'modelo',
                label: 'Modelo/Marca',
                type: 'text',
                section: 'adicional',
                required: false,
                placeholder: 'ej: Fortigate 60F'
            },
        ],
    },

    // ─────────────────────────────────────────────────────────
    //  TELÉFONO IP (Periféricos)
    // ─────────────────────────────────────────────────────────
    telefono_ip: {
        id: 'telefono_ip',
        label: 'Teléfono IP',
        categoria: CATEGORIES.PERIFERICOS.id,
        nodeType: 'telefono_ip',
        color: '#06B6D4',
        bgLight: 'bg-cyan-50',
        bgHover: 'hover:bg-cyan-500',
        iconSvg: `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>`,
        displayFields: {
            rows: ['ip', 'modelo'],
            badges: ['extension']
        },
        specificFields: [
            {
                key: 'extension',
                label: 'Extensión',
                type: 'text',
                section: 'adicional',
                required: false,
                placeholder: 'ej: 1234',
                colSpan: 1
            },
            {
                key: 'modelo',
                label: 'Modelo',
                type: 'text',
                section: 'adicional',
                required: false,
                placeholder: 'ej: Cisco 7940',
                colSpan: 1
            },
        ],
    },

    // ─────────────────────────────────────────────────────────
    //  NAS (Servicios)
    // ─────────────────────────────────────────────────────────
    nas: {
        id: 'nas',
        label: 'NAS',
        categoria: CATEGORIES.SERVICIOS.id,
        nodeType: 'nas',
        color: '#EC4899',
        bgLight: 'bg-pink-50',
        bgHover: 'hover:bg-pink-500',
        iconSvg: `<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>`,
        displayFields: {
            rows: ['ip'],
            badges: ['capacidad', 'raid']
        },
        specificFields: [
            {
                key: 'capacidad',
                label: 'Capacidad total',
                type: 'text',
                section: 'adicional',
                required: false,
                placeholder: 'ej: 4 TB',
                colSpan: 1
            },
            {
                key: 'raid',
                label: 'Configuración RAID',
                type: 'select',
                section: 'adicional',
                required: false,
                options: ['RAID 0', 'RAID 1', 'RAID 5', 'RAID 6', 'RAID 10', 'JBOD'],
                colSpan: 1
            },
        ],
    },

    // ─────────────────────────────────────────────────────────
    //  APP WEB (Servicios)
    // ─────────────────────────────────────────────────────────
    app_web: {
        id: 'app_web',
        label: 'App Web',
        categoria: CATEGORIES.SERVICIOS.id,
        nodeType: 'app_web',
        color: '#6366F1',
        bgLight: 'bg-indigo-50',
        bgHover: 'hover:bg-indigo-500',
        iconSvg: `<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`,
        displayFields: {
            rows: ['url', 'stack'],
            badges: ['puerto']
        },
        specificFields: [
            {
                key: 'url',
                label: 'URL',
                type: 'text',
                section: 'red',
                required: false,
                validator: 'url',
                placeholder: 'https://app.corimon.com'
            },
            {
                key: 'puerto',
                label: 'Puerto',
                type: 'text',
                section: 'red',
                required: false,
                placeholder: 'ej: 443',
                colSpan: 1
            },
            {
                key: 'stack',
                label: 'Stack tecnológico',
                type: 'text',
                section: 'adicional',
                required: false,
                placeholder: 'ej: Flask + MySQL'
            },
        ],
    },
};


// ═══════════════════════════════════════════════════════════════
//  HELPERS (funciones que leen la config)
// ═══════════════════════════════════════════════════════════════

/**
 * Devuelve los dispositivos agrupados por categoría.
 * Lo usa el Sidebar para renderizar las secciones colapsables.
 * 
 * @returns {Object} { red: { label, devices: [] }, endpoints: {...}, ... }
 */
export const getDevicesByCategory = () => {
    const grouped = {};

    // Inicializa el objeto respetando el orden de CATEGORIES
    Object.values(CATEGORIES)
        .sort((a, b) => a.order - b.order)
        .forEach(cat => {
            grouped[cat.id] = {
                label: cat.label,
                devices: []
            };
        });

    // Distribuye cada dispositivo en su categoría
    Object.values(DEVICE_TYPES).forEach(device => {
        if (grouped[device.categoria]) {
            grouped[device.categoria].devices.push(device);
        }
    });

    return grouped;
};

/**
 * Devuelve TODOS los campos (comunes + específicos) de un dispositivo.
 * 
 * @param {string} deviceId - id del dispositivo (ej: 'switch', 'router')
 * @returns {Array} array de field objects
 */
export const getFieldsForDevice = (deviceId) => {
    const device = DEVICE_TYPES[deviceId];
    if (!device) return COMMON_FIELDS;
    return [...COMMON_FIELDS, ...(device.specificFields || [])];
};

/**
 * Devuelve los campos agrupados por sección visual del modal.
 * Respeta el orden definido en SECTIONS.
 * Lo usa NodeEditModal para renderizar secciones + campos dinámicamente.
 * 
 * @param {string} deviceId - id del dispositivo
 * @returns {Object} { basica: { label, bgClass, iconSvg, fields: [] }, red: {...}, ... }
 */
export const getFieldsBySection = (deviceId) => {
    const allFields = getFieldsForDevice(deviceId);
    const sectionsOrdered = Object.values(SECTIONS).sort((a, b) => a.order - b.order);
    const grouped = {};

    sectionsOrdered.forEach(section => {
        const fieldsInSection = allFields.filter(f => f.section === section.id);
        if (fieldsInSection.length > 0) {
            grouped[section.id] = {
                ...section,
                fields: fieldsInSection
            };
        }
    });

    return grouped;
};

/**
 * Devuelve los datos iniciales (vacíos) para crear un nodo de este tipo.
 * Lo usa el Sidebar al hacer drag o click en un botón.
 * 
 * @param {string} deviceId - id del dispositivo
 * @returns {Object} data object con todos los campos inicializados en ''
 */
export const getInitialDataForDevice = (deviceId) => {
    const device = DEVICE_TYPES[deviceId];
    if (!device) return {};

    const allFields = getFieldsForDevice(deviceId);
    const data = {
        deviceType: device.id,
        categoria: device.id,
        color: device.color,
        status: '',
    };

    allFields.forEach(field => {
        data[field.key] = '';
    });

    return data;
};