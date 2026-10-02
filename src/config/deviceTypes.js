// src/config/deviceTypes.js

/**

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
    RED:         { id: 'red',         label: 'Red',         code: 'NET', order: 1 },
    ENDPOINTS:   { id: 'endpoints',   label: 'Endpoints',   code: 'END', order: 2 },
    SEGURIDAD:   { id: 'seguridad',   label: 'Seguridad',   code: 'SEC', order: 3 },
    PERIFERICOS: { id: 'perifericos', label: 'Periféricos', code: 'PER', order: 4 },
    SERVICIOS:   { id: 'servicios',   label: 'Servicios',   code: 'SVC', order: 5 },
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
        iconSvg: `<path d="M3 8h18v8H3z"/><path d="M6.5 11v2M9.5 11v2M12.5 11v2M15.5 11v2M18.5 12h.01"/>`,
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
                required: false,
                validator: 'ip',
                placeholder: 'ej: 192.168.1.254'
            },
            {
                key: 'vlan',
                label: 'VLAN',
                type: 'text',
                section: 'red',
                required: false,
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
        iconSvg: `<path d="M3 13h18v6H3z"/><path d="M7 13L5.5 6M17 13l1.5-7M7 16h.01M10 16h.01M14 16h4"/>`,
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
                required: false,
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
    //  PUNTO DE ACCESO (Red)
    // ─────────────────────────────────────────────────────────
    ap: {
        id: 'ap',
        label: 'Punto de acceso',
        categoria: CATEGORIES.RED.id,
        nodeType: 'ap',
        color: '#0EA5E9',
        bgLight: 'bg-sky-50',
        bgHover: 'hover:bg-sky-500',
        iconSvg: `<path d="M12 13v6M8 19h8M8.5 9.5a5 5 0 0 1 7 0M5.5 6.5a9 9 0 0 1 13 0M12 13h.01"/>`,
        displayFields: {
            rows: ['ip', 'mac'],
            badges: ['ssid', 'canal']
        },
        specificFields: [
            {
                key: 'ssid',
                label: 'SSID',
                type: 'text',
                section: 'red',
                required: false,
                placeholder: 'ej: Corimon-Staff',
                colSpan: 1
            },
            {
                key: 'canal',
                label: 'Canal',
                type: 'text',
                section: 'red',
                required: false,
                placeholder: 'ej: 36 (5GHz)',
                colSpan: 1
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
        iconSvg: `<path d="M3 4h18v12H3z"/><path d="M8 20h8M12 16v4"/>`,
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
    //  LAPTOP (Endpoints)
    // ─────────────────────────────────────────────────────────
    laptop: {
        id: 'laptop',
        label: 'Laptop',
        categoria: CATEGORIES.ENDPOINTS.id,
        nodeType: 'laptop',
        color: '#22C55E',
        bgLight: 'bg-green-50',
        bgHover: 'hover:bg-green-500',
        iconSvg: `<path d="M5 5h14v10H5z"/><path d="M2 19h20l-2-4H4z"/>`,
        displayFields: {
            rows: ['ip', 'mac', 'usuario'],
            badges: ['sistema_operativo']
        },
        specificFields: [
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
        iconSvg: `<path d="M3 4h18v7H3z"/><path d="M3 13h18v7H3z"/><path d="M6.5 7.5h.01M6.5 16.5h.01M10 7.5h8M10 16.5h8"/>`,
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
    camara: {
        id: 'camara',
        label: 'Cámara IP',
        categoria: CATEGORIES.SEGURIDAD.id,
        nodeType: 'camara',
        color: '#EF4444',
        bgLight: 'bg-red-50',
        bgHover: 'hover:bg-red-500',
        iconSvg: `<path d="M3 7h13v8H3z"/><path d="M16 10l5-2v6l-5-2M7 15l-2 5M6.5 11h.01"/>`,
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
        iconSvg: `<path d="M3 5h18v14H3z"/><path d="M3 9.7h18M3 14.3h18M9 5v4.7M15 9.7v4.6M9 14.3V19"/>`,
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
                required: false,
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
    telefono: {
        id: 'telefono',
        label: 'Teléfono IP',
        categoria: CATEGORIES.PERIFERICOS.id,
        nodeType: 'telefono',
        color: '#06B6D4',
        bgLight: 'bg-cyan-50',
        bgHover: 'hover:bg-cyan-500',
        iconSvg: `<path d="M6 3h12v18H6z"/><path d="M9 6h6v4H9zM9 13h.01M12 13h.01M15 13h.01M9 16h.01M12 16h.01M15 16h.01"/>`,
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
    //  IMPRESORA (Periféricos)
    // ─────────────────────────────────────────────────────────
    impresora: {
        id: 'impresora',
        label: 'Impresora',
        categoria: CATEGORIES.PERIFERICOS.id,
        nodeType: 'impresora',
        color: '#F97316',
        bgLight: 'bg-orange-50',
        bgHover: 'hover:bg-orange-500',
        iconSvg: `<path d="M7 3h10v5H7z"/><path d="M3 8h18v9H3z"/><path d="M7 14h10v7H7z"/><path d="M17 11h.01"/>`,
        displayFields: {
            rows: ['ip'],
            badges: ['modelo']
        },
        specificFields: [
            {
                key: 'modelo',
                label: 'Modelo',
                type: 'text',
                section: 'adicional',
                required: false,
                placeholder: 'ej: HP LaserJet M404'
            },
        ],
    },

    // ─────────────────────────────────────────────────────────
    //  APP WEB (Servicios)
    // ─────────────────────────────────────────────────────────
    web: {
        id: 'web',
        label: 'App Web',
        categoria: CATEGORIES.SERVICIOS.id,
        nodeType: 'web',
        color: '#6366F1',
        bgLight: 'bg-indigo-50',
        bgHover: 'hover:bg-indigo-500',
        iconSvg: `<path d="M3 4h18v16H3z"/><path d="M3 8h18M6 6h.01M8.5 6h.01M9 12l-2 2 2 2M15 12l2 2-2 2M13 11l-2 6"/>`,
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
 */
export const getDevicesByCategory = () => {
    const grouped = {};

    // Inicializa el objeto respetando el orden de CATEGORIES
    Object.values(CATEGORIES)
        .sort((a, b) => a.order - b.order)
        .forEach(cat => {
            grouped[cat.id] = {
                label: cat.label,
                code: cat.code,
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

export const getCategoryCode = (categoriaId) => {
    const category = Object.values(CATEGORIES).find(c => c.id === categoriaId);
    return category ? category.code : '';
};
/**
 * Devuelve TODOS los campos (comunes + específicos) de un dispositivo.
 */
export const getFieldsForDevice = (deviceId) => {
    const device = DEVICE_TYPES[deviceId];
    if (!device) return COMMON_FIELDS;
    return [...COMMON_FIELDS, ...(device.specificFields || [])];
};

/**
 * Devuelve los campos agrupados por sección visual del modal.
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