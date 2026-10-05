# DESIGN.md — Admin Red

> Guía de diseño visual y de interfaz de **Admin Red** (proyecto_admin de red), herramienta interna de TI de Corimon, C.A. y sus empresas filiales.
> Este documento es la fuente de verdad para cualquier persona o IA que diseñe o programe interfaz en este proyecto. Si algo del código contradice este documento, gana este documento (y se corrige el código), salvo que esté marcado como **[Pendiente]**.

---

## 0. Cómo usar este documento (instrucciones para otra IA)

1. Lee las secciones 1 a 3 antes de proponer cualquier cambio visual.
2. No introduzcas colores, fuentes, radios ni sombras que no estén en la sección 4 a 7. Si crees que hace falta uno nuevo, propónlo explícitamente y explica por qué.
3. **No uses Tailwind.** Todo el estilo se escribe en CSS plano con las variables de `src/styles/tokens.css` (sección 11).
4. Respeta las 4 reglas de color de la sección 4.2: son lo más importante del sistema.
5. Al mostrar cambios de código, indica **archivo**, **qué buscar** y **qué poner**, con una explicación corta de cada cambio. El desarrollador aplica los cambios a mano para ir aprendiendo.
6. Cuando algo esté marcado **[Pendiente]** o **[Propuesta]**, no lo des por implementado.

---

## 1. Contexto del producto

**Qué es:** un mapa visual e interactivo de la red de la empresa (topología). El usuario arrastra dispositivos a un lienzo infinito, los conecta con líneas y cada dispositivo muestra su estado de conexión, verificado por SNMP o ping desde el backend.

**Quién lo usa:** el equipo de TI de Corimon (uso técnico, diario, a menudo con la pantalla abierta durante horas). No es una landing de marketing ni una app para clientes.

**Qué debe transmitir:** control, claridad y confiabilidad. Referencia mental: pantalla de sala de control (NOC), no plantilla SaaS.

**Stack:**

| Capa | Tecnología |
|---|---|
| Frontend | React 19, Vite 6, `@xyflow/react` (React Flow) 12 |
| Estilos | CSS plano + variables CSS (Tailwind eliminado) |
| Backend | FastAPI + SQLAlchemy + PostgreSQL + Alembic; SNMP (pysnmp) e ICMP; WebSocket `/ws` |
| Convención de clases | BEM (`bloque__elemento--modificador`) + helper `cx()` |

**Repos:** `mi-proyecto-backend` y `-mi-proyecto-frontend` (el nombre del segundo empieza con guion).

---

## 2. Principios de diseño

1. **Sala de control, no SaaS.** Interfaz oscura, plana, densa de información pero legible. Sin gradientes decorativos, sin sombras suaves, sin esquinas muy redondeadas.
2. **El color comunica, no decora.** Cada color tiene un único rol (marca, interacción o estado). Las categorías de dispositivo NO tienen color.
3. **Un estado nunca depende solo del color.** Siempre color + forma + texto (accesible para daltonismo, capturas en gris y proyector).
4. **Profundidad por borde, no por sombra.** Los niveles se separan por luminosidad y un borde de 1 px. La sombra existe solo en elementos flotantes.
5. **Datos técnicos en monoespaciada.** IP, MAC, puertos, latencia y códigos se alinean solos.
6. **Un solo lenguaje de iconos.** Trazo recto, sin relleno, dibujado de frente (como se ve el equipo en el rack).
7. **El lienzo es el protagonista.** El marco (sidebar, barra superior) es discreto y no compite con el mapa.

---

## 3. Layout general

```
┌───────────┬───────────────────────────────────────────────┐
│           │  Barra superior (56 px)                       │
│  Sidebar  ├───────────────────────────────────────────────┤
│ 264 / 56  │                                               │
│   px      │   Lienzo (React Flow) — ocupa el resto        │
│           │                                               │
└───────────┴───────────────────────────────────────────────┘
```

- Contenedor `.app-shell`: `display: flex`, `100vw × 100vh`, `overflow: hidden`.
- **Sidebar** a la izquierda: ancho **264 px** expandida, **56 px** compacta. Ocupa espacio real (no flota sobre el lienzo).
- Columna principal `.app-shell__main`: barra superior de **56 px** + lienzo (`flex: 1`).
- El lienzo tiene `position: relative` para que Controles y MiniMap de React Flow se posicionen dentro de él.
- Pantalla objetivo: escritorio (≥ 1280 px). Móvil no es prioridad. [Propuesta: ancho mínimo 1100 px para la barra superior.]

---

## 4. Color

### 4.1 Paleta (fuente de verdad: OKLCH; hex aproximado entre paréntesis)

**Neutros grafito** (tinte cálido, matiz 40°):

| Token | OKLCH | Hex aprox. | Uso |
|---|---|---|---|
| `--color-bg-0` | `oklch(0.165 0.004 40)` | `#100e0d` | Lienzo, fondo de inputs |
| `--color-bg-1` | `oklch(0.195 0.005 40)` | `#171413` | Sidebar, barra superior |
| `--color-bg-2` | `oklch(0.235 0.006 40)` | `#211d1c` | Nodo, tarjeta, celda de icono |
| `--color-bg-3` | `oklch(0.27 0.007 40)` | `#2a2524` | Hover, elementos flotantes |
| `--color-line` | `oklch(0.31 0.007 40)` | `#342f2e` | Borde base |
| `--color-line-2` | `oklch(0.40 0.008 40)` | `#4c4644` | Borde fuerte, borde en hover |
| `--color-text-1` | `oklch(0.95 0.005 80)` | `#f0eeeb` | Texto principal (hueso) |
| `--color-text-2` | `oklch(0.76 0.006 60)` | `#b4b0ad` | Texto secundario |
| `--color-text-3` | `oklch(0.62 0.008 50)` | `#8a8582` | Etiquetas, texto terciario |

**Marca:**

| Token | OKLCH | Hex aprox. |
|---|---|---|
| `--color-brand` | `oklch(0.56 0.20 30)` | `#d02e1e` |
| `--color-brand-deep` | `oklch(0.40 0.15 25)` | `#861118` |

**Interacción:**

| Token | OKLCH | Hex aprox. |
|---|---|---|
| `--color-steel` | `oklch(0.76 0.09 230)` | `#71bcdf` |

**Estado:**

| Token | OKLCH | Hex aprox. | Glifo | Etiqueta |
|---|---|---|---|---|
| `--color-st-online` | `oklch(0.80 0.16 150)` | `#66da85` | ● círculo lleno | EN LÍNEA |
| `--color-st-offline` | `oklch(0.70 0.19 10)` | `#fc6183` | ■ cuadrado lleno | FUERA DE LÍNEA |
| `--color-st-maint` | `oklch(0.84 0.14 85)` | `#f4c352` | ▲ triángulo | MANTENIMIENTO |
| `--color-st-unknown` | `oklch(0.66 0.01 50)` | `#98918d` | ○ círculo con aro | DESCONOCIDO |

Tintes de fondo para la franja de estado (alfa sobre el fondo de la tarjeta):
`--color-st-offline-tint: oklch(0.7 0.19 10 / 0.12)` y `--color-st-maint-tint: oklch(0.84 0.14 85 / 0.09)`.

### 4.2 Las tres funciones del color y sus reglas

El rojo de Corimon es el color de marca, y el rojo también es el color natural de "caído". Para que nunca se confundan, el color se divide en **tres roles que no se mezclan**:

| Rol | Color | Dónde vive |
|---|---|---|
| **Identidad** | Rojo Corimon (`brand`, `brand-deep`) | Solo el marco de la app: logo, pestaña activa (barra de 2 px) |
| **Interacción** | Acero (`steel`) | Selección, foco, conexión en curso, enlace seleccionado. Es el único tono frío. Nunca comunica estado |
| **Estado** | Verde / rosa-rojo / ámbar / gris | Estado de un equipo, siempre con glifo y texto |

**Reglas (obligatorias):**

- **R1.** El rojo de marca **no entra al lienzo**. Ningún nodo, enlace ni botón de acción lo usa.
- **R2.** El rojo de marca aparece como masa plana o trazo de 2 px, nunca como punto pequeño. Los puntos pequeños son siempre estados.
- **R3.** Todo estado combina color + forma + texto: ● en línea, ■ fuera de línea, ▲ mantenimiento, ○ desconocido.
- **R4.** La acción principal (**Guardar red**) es hueso (`text-1`) sobre grafito, nunca roja. Así "rojo" nunca significa "haz clic aquí".

Además: **las categorías de dispositivo no tienen color.** Se distinguen por icono y por un código de tres letras (NET, END, SEC, PER, SVC).

---

## 5. Tipografía

Se cargan desde Google Fonts en `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&family=JetBrains+Mono:wght@400;500;600&display=swap">
```

| Familia | Variable | Uso |
|---|---|---|
| **Archivo** (variable, eje de ancho `wdth`) | `--font-sans` | Interfaz: títulos, nombres, textos |
| **JetBrains Mono** | `--font-mono` | Datos técnicos: IP, MAC, puertos, latencia, códigos y etiquetas de estado |

**Escala:**

| Rol | Especificación | Ejemplo |
|---|---|---|
| display | Archivo 700 · 44/1 · ancho 88% · tracking −0.02em | Admin Red |
| title | Archivo 700 · 22/1.2 · ancho 90% | Sede Principal · Guacara |
| node-name | Archivo 600 · 13.5 · ancho 95% | SW-CORE-01 |
| body | Archivo 400 · 13/1.55 | Arrastra al lienzo o haz clic para agregar |
| label | Archivo 600 · 11 · +8% · MAYÚSCULAS | ENDPOINTS |
| data | Mono 400 · 11.5 | 10.10.0.2 · 3C:52:82:1A:9F:04 |
| status | Mono 600 · 10.5 · +6% · MAYÚSCULAS | FUERA DE LÍNEA |
| micro | Mono 9.5 · +8% · MAYÚSCULAS | NET · Switch |

Ancho variable: se usa `font-stretch` (88–100%) en nombres de equipo para que quepan sin perder legibilidad.

---

## 6. Forma, bordes y profundidad

**Radios** (nada por encima de 4 px):

| Token | Valor | Uso |
|---|---|---|
| `--radius-xs` | 2 px | chips, teclas (`kbd`), contadores |
| `--radius-sm` | 3 px | botones, inputs, celdas de icono |
| `--radius-md` | 4 px | nodos, tarjetas, paneles |

**Profundidad por borde:**

- Nivel 0 (lienzo): `bg-0`.
- Nivel 1 (marco): `bg-1` + borde `line`.
- Nivel 2 (tarjetas, nodos): `bg-2` + borde `line` (hover: `line-2`).
- Nivel 3 (flotantes: menús, tooltips): `bg-3` + borde `line-2` + `--shadow-float: 0 8px 24px oklch(0 0 0 / 0.45)`.
- **La sombra solo existe en el nivel 3.**

**Bordes:** siempre 1 px, excepto selección/foco/pestaña activa (ver componentes).

**Nota de implementación:** el diseño original usa un borde intermedio `oklch(0.34 0.007 40)` para hover de filas y bordes de nodo en reposo. Hoy se aproxima con `--color-line-2`. [Propuesta: añadir token `--color-line-hover: oklch(0.34 0.007 40)` si se quiere fidelidad exacta.]

---

## 7. Lienzo y enlaces

- Fondo `bg-0` con retícula de puntos cada **16 px**: `radial-gradient(circle, oklch(0.3 0.006 40) 1px, transparent 1.3px)`. En React Flow: `<Background variant="dots" gap={16} />` con color `--canvas-dot-color`.
- **Enlaces** (trazado ortogonal):

| Estado del enlace | Estilo |
|---|---|
| Activo | Gris sólido `oklch(0.5 0.008 50)`, 1.5 px |
| Caído | Rojo de estado `st-offline`, 1.5 px, **discontinuo** `4 3`. Etiqueta "SIN ENLACE" |
| Seleccionado | Acero, 2 px |

- **Etiquetas de enlace** (velocidad, puerto): chip mono 9.5 px, fondo `bg-1`, borde `line-2`, radio 2. Ejemplos: `WAN 1G`, `10G · ge-0/1`, `1G PoE`.
- **Handles** (puntos de conexión): cuadrados de 8×8 px, radio 1, fondo `bg-0`, borde 1.5 px `line-2`. Encendidos (conexión en curso o nodo seleccionado): borde y fondo acero. Destinos válidos durante una conexión: crecen a 10×10.

---

## 8. Iconografía

- Juego propio sobre retícula de **24 px**. Trazo **1.5**, `stroke-linecap="square"`, `stroke-linejoin="miter"`, **sin relleno**.
- Los equipos se dibujan de frente. Los LEDs son cuadrados de 1.5 px (puntos `h.01`).
- Color del icono: `currentColor` (normalmente `text-1`).
- Tamaños: 16 px en filas de sidebar, 18 px en nodo y sidebar compacto, 14–15 px en barra superior.

**Datos de los iconos** (atributo `d` de `<path>`; en `deviceTypes.js` están como `iconSvg`):

```
switch    M3 8h18v8H3z M6.5 11v2 M9.5 11v2 M12.5 11v2 M15.5 11v2 M18.5 12h.01
router    M3 13h18v6H3z M7 13L5.5 6 M17 13l1.5-7 M7 16h.01 M10 16h.01 M14 16h4
ap        M12 13v6 M8 19h8 M8.5 9.5a5 5 0 0 1 7 0 M5.5 6.5a9 9 0 0 1 13 0 M12 13h.01
pc        M3 4h18v12H3z M8 20h8 M12 16v4
laptop    M5 5h14v10H5z M2 19h20l-2-4H4z
telefono  M6 3h12v18H6z M9 6h6v4H9z M9 13h.01 M12 13h.01 M15 13h.01 M9 16h.01 M12 16h.01 M15 16h.01
firewall  M3 5h18v14H3z M3 9.7h18 M3 14.3h18 M9 5v4.7 M15 9.7v4.6 M9 14.3V19
camara    M3 7h13v8H3z M16 10l5-2v6l-5-2 M7 15l-2 5 M6.5 11h.01
impresora M7 3h10v5H7z M3 8h18v9H3z M7 14h10v7H7z M17 11h.01
nas       M6 3h12v18H6z M9 7h6 M9 10h6 M9 13h6 M12 17.5h.01
servidor  M3 4h18v7H3z M3 13h18v7H3z M6.5 7.5h.01 M6.5 16.5h.01 M10 7.5h8 M10 16.5h8
web       M3 4h18v16H3z M3 8h18 M6 6h.01 M8.5 6h.01 M9 12l-2 2 2 2 M15 12l2 2-2 2 M13 11l-2 6
```

**Iconos de interfaz** (misma regla, trazo 1.6–1.8): colapsar sidebar `M4 4v16 M15 6l-6 6 6 6`; expandir `M20 4v16 M9 6l6 6-6 6`; buscar `M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13z M15.5 15.5L20 20`; guardar `M4 4h13l3 3v13H4z M8 4v5h7V4 M8 14h8v6H8z`; mapa `M5 5h4v4H5z M15 5h4v4h-4z M10 15h4v4h-4z M7 9v3h10V9 M12 12v3`; lista `M4 6h16 M4 12h16 M4 18h16`; chevron `M6 9l6 6 6-6`.

**Asa de arrastre** (6 puntos, SVG 8×14): seis cuadrados de 2×2 en dos columnas (x=0 y x=5) y tres filas (y=1, 6, 11).

---

## 9. Taxonomía de dispositivos

Fuente de verdad en el código: `src/config/deviceTypes.js`.

| Categoría | Código | Dispositivos (`id`) |
|---|---|---|
| Red | **NET** | `switch`, `router`, `ap` (Punto de acceso) |
| Endpoints | **END** | `pc`, `laptop`, `servidor` |
| Seguridad | **SEC** | `camara` (Cámara IP), `firewall` |
| Periféricos | **PER** | `telefono` (Teléfono IP), `impresora` |
| Servicios | **SVC** | `nas`, `web` (App web) |

> Nota: el diseño original de Claude Design agrupaba `telefono` en END, `nas` en PER y `servidor` en SVC. El código actual conserva la agrupación previa del proyecto (arriba). **[Pendiente de decidir]** si se alinean con el diseño original; si se cambia, actualizar `categoria` en `deviceTypes.js` y este documento.

IDs renombrados respecto a versiones anteriores: `camara_ip → camara`, `telefono_ip → telefono`, `app_web → web`. Dispositivos guardados antes con los IDs viejos perderán su icono hasta que se editen.

Los campos de formulario de cada tipo (`specificFields`) y los datos que muestra el nodo (`displayFields`) también viven en `deviceTypes.js`. Para añadir un tipo nuevo: agregar su entrada ahí y su icono aquí (sección 8).

---

## 10. Componentes

### 10.1 Nodo de dispositivo `[Hecho]`

Archivos: `components/Nodes/GenericDeviceNode.jsx`, `GenericDeviceNode.css`, `utils/status.js`.

**Dimensiones:** 220 × 134 px. Tarjeta: fondo `bg-2`, borde 1 px `line` (hover/reposo; con selección, ver abajo), radio 4, `overflow: hidden`, columna flex.

**Anatomía (de arriba abajo):**

1. **Cabecera** (padding 10/12/8): celda de icono 32×32 (borde `line`, fondo `bg-1`, radio 3, icono 18 px) + dos líneas: tipo en mono 9.5 px MAYÚSCULAS `text-3` (`NET · Switch`, formato `CÓDIGO · Tipo`) y nombre en Archivo 600 13.5 px `text-1` con elipsis.
2. **Franja de estado** (padding 5/12, borde arriba y abajo `line`): a la izquierda glifo (8 px) + etiqueta mono 10.5 px 600 MAYÚSCULAS en color de estado; a la derecha latencia en mono 10.5 px `text-3` (`2 ms`, `—`, `sin SNMP`). Fondo: `oklch(0.205 0.005 40)` normal; tinte de estado en fuera de línea y mantenimiento.
3. **Datos** (grid `30px 1fr`, gap vertical 3, padding 6/12, mono): `IP` y `MAC` con clave en `text-3` 10 px y valor 11.5 px. En fuera de línea y desconocido el valor baja de contraste (`oklch(0.66 0.008 50)`) pero sigue legible para diagnóstico.

**Estados del nodo:**

| Estado | Cómo se ve |
|---|---|
| Reposo | Borde `line` |
| Seleccionado | Borde acero, halo `0 0 0 3px steel/0.14`, y **esquinas de visor** (4 ángulos de 10×10, trazo 2 px acero, a −7 px del borde). Se ven aunque el nodo esté sobre un enlace |
| Conectando (origen) | Contorno discontinuo acero (1 px dashed, radio 6, a −5 px) y su handle encendido |
| Destino válido | Los 4 handles crecen a 10 px y se encienden en acero |
| Fuera de línea | Franja teñida rosa-rojo, datos con menos contraste |
| Mantenimiento | Franja teñida ámbar |
| Desconocido | Glifo de aro gris, latencia `sin SNMP` |
| Borrador | Nodo recién creado sin confirmar en el panel: borde discontinuo. Deja de serlo al pulsar "Agregar al mapa" (`data.isDraft`) |

**Handles:** se conservan los IDs existentes (`top-out`, `top-in`, `bottom-out`, …, `right-in`) porque las conexiones guardadas en base de datos los referencian. Los `-out` son visibles; los `-in` solo aparecen cuando hay una conexión en curso.

**Estructura DOM:** `.device-node` (relativo, sin recorte) contiene `.device-node__card` (con `overflow: hidden`) y, como hermanos, el botón de menú, las esquinas de visor y los handles, para que no se recorten.

**Mapeo de estado backend → UI:** se normaliza en un único lugar, `utils/status.js` (`normalizeStatus`). Valores de la UI: `online | offline | maint | unknown` (coinciden con los tokens `--color-st-*` y con el backend). Entradas aceptadas: `online`/`activo` → `online`; `offline`/`inactivo` → `offline`; `maint`/`mantenimiento` → `maint`; cualquier otra cosa (incluido vacío) → `unknown`. Etiquetas: En línea ●, Fuera de línea ■, Mantenimiento ▲, Desconocido ○. **Mantenimiento** no existe aún en el backend (sería un estado manual) **[Pendiente]**.

**Texto a la derecha de la franja** `[Hecho]`: método con el que respondió y latencia, en mono `text-3`: `ICMP · 8 ms`, `SNMP · 3 ms`, `TCP 445 · 4 ms`. En fuera de línea o desconocido: `—`. Datos: `data.checkMethod` y `data.latencyMs` (vienen de `status_summary` al cargar y del WebSocket en vivo).

**Interacción:** doble clic abre el panel de edición (10.5); el botón ⋮ (aparece al pasar el cursor) abre el menú (10.7).

**Destello al recibir una conexión** `[Hecho]`: al crear un enlace, el nodo destino recibe `data.pulse = { id, side }` (`side` sale del handle: `left-in` → `left`). El nodo dibuja `<span key={pulse.id} class="device-node__pulse device-node__pulse--<side>">` con un `<rect>` SVG (`pathLength="100"`, `stroke-dasharray: 18 82`) cuya luz en **acero** recorre el borde ~42 unidades en sentido horario desde el lado de entrada (0,7 s) y se apaga, más un resplandor que se desvanece (0,9 s). Cambiar `key` reinicia la animación: sin timers. `pulse` no se envía al backend. Con `prefers-reduced-motion` solo queda el resplandor. [Propuesta, segunda fase: "resorte" en la línea de conexión al acercarse a un handle válido, con `connectionLineComponent`.]

### 10.2 Sidebar de dispositivos `[Hecho]`

Archivos: `Sidebar.jsx`, `Sidebar.css`.

- **Expandida (264 px):** cabecera de 56 px (logo, "Admin Red", subtítulo "CORIMON, C.A." mono 9.5, botón de colapsar 28×28). Buscador (32 px alto, borde `line`, fondo `bg-0`, atajo `/`) [el buscador es solo visual por ahora **[Pendiente de cablear]**]. Lista de grupos: cabecera de grupo de 30 px (código mono + nombre en MAYÚSCULAS + chevron); filas de 34 px con asa de 6 puntos, celda de icono 26×26 y etiqueta. Pie con la ayuda "Arrastra al lienzo o haz clic para agregar".
- **Compacta (56 px):** logo, botón de expandir, y por grupo el código (mono 8.5) como separador y los iconos de 18 px en celdas de 38×36. El nombre aparece en `title` (tooltip).
- Cada fila es **arrastrable** y **clicable**. El clic llama a `onAddNode(tipo, null, datos)` y App lo coloca en el **centro de la vista actual** (`getViewportCenter`), con un desplazamiento en escalera de 24 px para no apilar nodos. Arrastrar lo coloca donde se suelta. Nombre por defecto: `<Tipo> <n>` ("PC 4").
- Hover de fila: fondo `bg-3`, borde `line-2`.
- **Estado recordado** `[Hecho]`: abierta/compacta se guarda en `localStorage` (`adminRed.sidebarOpen`) y se restaura al recargar. Lectura con `useState(readSidebarOpen)` (inicialización perezosa) y escritura en un `useEffect`, ambas en `try/catch` (modo privado).

### 10.3 Barra superior `[Hecho, parcial]`

Archivos: `Navbar.jsx`, `Navbar.css`. Altura 56 px, fondo `bg-1`, borde inferior `line`.

- **Izquierda:** pestañas **Mapa** (activa: texto `text-1` 600 y barra de 2 px en `brand` en el borde inferior **[Pendiente: la barra roja aún no está en el CSS]**) y **Ver dispositivos** (con contador mono en chip).
- **Derecha:** resumen del último guardado, botón **Guardar red** (hueso sobre grafito, 32 px alto, radio 3; deshabilitado: `bg-3` + `text-3`), separador y chip de usuario (avatar 28×28 con iniciales).
- **Indicador de monitor** `[Hecho]`: `● EN VIVO` (verde de estado) cuando el WebSocket está conectado; `○ SIN CONEXIÓN` (`text-3`) mientras reintenta. Mono 10.5 600 MAYÚSCULAS.
- **Cambios sin guardar** `[Hecho]`: `● MAPA EDITADO` en ámbar (`st-maint`) con una segunda línea `Recuerda guardar · Ctrl + S` (9.5 px, `text-3`, sin mayúsculas), y halo ámbar de 2 px en el botón Guardar. Tras guardar se reemplaza por `GUARDADO HH:MM` en `text-3`. Cuentan como cambio: confirmar o editar un equipo en el panel, eliminarlo, soltar un nodo movido, crear o borrar enlaces. No cuentan: seleccionar, actualizaciones de estado del monitor, cancelar un nodo nuevo. Con cambios pendientes el navegador pide confirmación al cerrar o recargar (`beforeunload`). **Ctrl + S** guarda.
- **[Propuesta, de la maqueta original, sin implementar]:** selector de red por sede o filial ("Sede Principal · Guacara"); resumen de conteos por estado con los mismos glifos del nodo (`42 ● · 3 ■ · 1 ▲ · 2 ○`) y hora del último sondeo (`SNMP · hace 30 s`); indicador "Cambios sin guardar"; atajo `Ctrl S` en el botón guardar.

### 10.4 Controles de zoom y MiniMap `[Hecho]`

Se estilizan con las variables CSS de React Flow 12 (`--xy-controls-*`, `--xy-minimap-*`) asignadas a tokens en `App.css`, bajo `.app-shell__canvas .react-flow`. **No** pasar `className`, `maskColor` ni `bgColor` como props: las props tienen prioridad sobre el CSS.

Controles: abajo a la izquierda, botones 32×30 (más, menos, ajustar; sin candado: `showInteractive={false}`), fondo `bg-1`, borde `line-2`, radio 3. [Propuesta: lectura de zoom en mono 9.5 px.] MiniMap: fondo `bg-1`, máscara `bg-0` al 70 %, recuadro de vista en acero, `pannable` y `zoomable`; cada nodo se pinta con el color de su **estado** (`getMiniMapNodeColor` → `var(--color-st-<estado>)`). Con el panel lateral abierto el MiniMap se desplaza a su izquierda.

**Enlaces:** `animated: false` (línea sólida). La animación punteada queda reservada para un futuro significado (p. ej., "enlace con actividad").

### 10.5 Panel de configuración de dispositivo `[Hecho]`

Archivos: `components/UI/DevicePanel.jsx`, `DevicePanel.css`. Reemplaza al antiguo `NodeEditModal` (eliminado). Un solo formulario sirve para **crear** y **editar**.

**Flujo:** clic o arrastre desde el sidebar → el nodo aparece seleccionado y en estado borrador → se abre el panel. Enter = "Agregar al mapa" / "Guardar cambios"; Esc o "Cancelar" = cerrar (si el nodo es nuevo, se borra). Doble clic en un nodo existente abre el panel en modo edición.

**Arquitectura:** App guarda `panel = { nodeId, isNew } | null`. El nodo solo avisa con `data.onEdit(id)`. El panel se monta con `key={node.id}` para reiniciar su estado al cambiar de nodo (sin `useEffect` de sincronización).

**Visual:** absoluto dentro del lienzo, a 12 px de arriba, derecha y abajo; 340 px de ancho; `bg-1`, borde `line-2`, radio 4, `shadow-float`; **sin fondo oscuro** (el lienzo sigue visible y usable). Cabecera: celda de icono 32×32 + `CÓDIGO · Tipo` (mono 9.5) + título ("Nuevo dispositivo" o el nombre). Pie: "Cancelar" (fantasma, borde `line-2`) y botón principal hueso sobre grafito con `↵`.

**Campos:**
- **Esenciales arriba**, siempre visibles: los marcados `required: true` en `deviceTypes.js`. Hoy solo **Nombre** e **IP** (el backend los exige; `ip` es `unique`).
- **"Más detalles · opcional"** plegable con el resto. Se abre solo si el nodo ya tiene datos opcionales o si hay un error dentro.
- Grid de 2 columnas; `colSpan: 1` ocupa media fila.
- Etiqueta Archivo 600 11 px MAYÚSCULAS `text-2`; obligatorio con `*` en rojo de estado. Input mono 12.5 px, fondo `bg-0`, borde `line` (hover `line-2`, foco acero + halo 3 px).
- Al abrir, foco en Nombre (seleccionado si es nuevo, para reemplazarlo).

**Validación:** al salir del campo (blur) y al enviar; nunca mientras se escribe. Reglas: obligatorio, formato (`VALIDATORS` de `deviceTypes.js`) e **IP duplicada** respecto a los demás nodos del mapa. Error: borde y texto mono 10.5 en `--color-st-offline`. Al enviar con errores se enfoca el primero.

[Propuesta: alerta en línea (ver 10.6) dentro del panel para avisos no ligados a un campo, p. ej. "El equipo no responde a SNMP".]

### 10.6 Notificaciones (toasts) `[Hecho]`

Archivos: `context/ToastContext.jsx` (estado y API), `components/UI/ToastRegion.jsx` + `ToastRegion.css` (dibujo). Reemplaza al antiguo `Alert` (eliminado).

**API:** cualquier componente dentro de `<ToastProvider>` usa
```js
const { notify } = useToast();
notify({ type, title, message?, data?, action? });
// type: 'success' | 'error' | 'warning' | 'info'
// data: línea mono para IP, MAC, cifras  ·  action: { label, onClick }
```
Hay un adaptador `showAlert(tipo, mensaje)` en App y Navbar para las llamadas antiguas; el código nuevo debe usar `notify` con título corto + mensaje.

**Tipos:**

| Tipo | Glifo | Color | Duración | `role` |
|---|---|---|---|---|
| Éxito | ● círculo | `st-online` | 4 s | status |
| Error | ■ cuadrado | `st-offline` | fijo (cierre manual) | alert |
| Advertencia | ▲ triángulo | `st-maint` | 8 s; fijo si lleva acción | status |
| Info | ◇ rombo de contorno | `steel` | 5 s | status |

**Anatomía:** grid `14px 1fr 24px`, padding 12/10/14/14, `bg-3`, borde `line-2`, radio 4, `shadow-float`. Fila meta: TIPO (mono 10.5 600 MAYÚSCULAS, en su color) + hora `HH:MM` (`text-3`). Título Archivo 600 13.5 `text-1`. Mensaje 13/1.55 `text-2` (respeta saltos de línea). `data` en mono 11.5 `text-1`. Acción opcional: botón hueso sobre grafito de 28 px. Botón cerrar 24×24. Barra de tiempo de 2 px en el color del tipo, abajo.

**Comportamiento:**
- Pila de **máximo 4**, la más nueva arriba, en la esquina superior derecha del lienzo (a 12 px). Con el panel lateral abierto se corre a su izquierda.
- **La animación CSS de la barra es el temporizador**: al terminar (`onAnimationEnd`) el toast se cierra; al pasar el cursor se pausa (`animation-play-state: paused`). Sin `setInterval`.
- **Deduplicación:** un aviso idéntico (mismo tipo, título y mensaje) no se apila; reinicia su barra (`version`) y su hora.
- Entrada: aparece con un desplazamiento de 6 px (180 ms); se desactiva con `prefers-reduced-motion`.

**Redacción:** título corto que diga qué pasó ("Red guardada", "No se pudo guardar la red"); mensaje con la consecuencia o el siguiente paso; cifras e identificadores en `data`. Sin emojis ni signos de exclamación.

**Alerta en línea** `[Propuesta, diseñada, sin implementar]`: para dentro de paneles y formularios. Fila con padding 8/12, borde `line`, radio 4, fondo con el color del tipo al 8–12 %; a la izquierda glifo + TIPO en mono, a la derecha el texto 13 px `text-1`.

**Notificaciones del monitor** `[Hecho]`: llegan por WebSocket (`status_update`) solo cuando un equipo **cambia** de estado (el backend compara con el estado previo). Si `previous_status` es nulo (equipo visto por primera vez) se actualiza el nodo sin toast.
- Pasa a fuera de línea → **error** (fijo): "`<nombre>` fuera de línea" · "No respondió a SNMP, ping ni puertos TCP." · `data`: IP.
- Vuelve a en línea → **éxito**: "`<nombre>` en línea" · "El equipo volvió a responder." · `data`: IP · latencia.
- Confirmar un equipo nuevo en el panel → **advertencia**: "`<nombre>` agregado sin guardar" · "Guarda la red (Ctrl + S) para empezar a monitorearlo."

[Propuesta: latencia alta (advertencia), resumen de sondeo con conteos `42 ● · 3 ■ · 1 ▲ · 2 ○` (info).]

### 10.7 Menú del nodo `[Hecho]`

Archivos: `components/UI/NodeDropdownMenu.jsx`, `NodeDropdownMenu.css`. Se abre con el botón ⋮ del nodo; se cierra al hacer clic fuera o con Esc.

Flotante nivel 3 (`bg-3`, borde `line-2`, radio 4, `shadow-float`), 180 px de ancho, debajo del nodo alineado a la derecha. Filas de 30 px con icono de 14 px y texto 13 px; hover `bg-2`. Opciones: **Editar** (abre el panel 10.5) y **Eliminar** (en rojo de estado). Eliminar pide **confirmación dentro del propio menú** (la fila cambia a "¿Eliminar? · Sí"), sin `window.confirm`. [Propuesta: "Verificar ahora" y "Ver historial" cuando exista el monitoreo.]

### 10.8 Color de grupo del nodo `[Aprobado · Pendiente: requiere backend]`

Permite al usuario pintar nodos para agruparlos visualmente (p. ej. Planta, Oficinas, Almacén). **Variante elegida: B, cabecera teñida.**

**Regla:** el color de grupo vive **solo en la cabecera** del nodo. **Nunca** toca el borde, la franja de estado, los datos, los enlaces ni el MiniMap: esos significan estado o interacción (regla R2). La franja de estado debe seguir dominando visualmente aunque la cabecera esté teñida.

**Cómo se pinta (variante B):**
- `.device-node__header`: fondo `color-mix(in oklab, var(--g) 11%, transparent)`.
- `.device-node__icon`: trazo del icono en `var(--g)`, borde `color-mix(in oklab, var(--g) 35%, transparent)`.
- El nombre y el código `CÓDIGO · Tipo` no cambian de color.
- Implementación: modificador `.device-node--group` + `style="--g: var(--group-<clave>)"`, o una clase por color.

**Paleta** (tokens a crear en `tokens.css`; misma luminosidad y croma bajo para que se lean como etiqueta y no como alarma; los estados usan croma 0.14–0.19):

| Clave | Token | OKLCH |
|---|---|---|
| `indigo` | `--group-indigo` | `oklch(0.72 0.09 270)` |
| `lavanda` | `--group-lavanda` | `oklch(0.72 0.09 310)` |
| `terracota` | `--group-terracota` | `oklch(0.72 0.09 45)` |
| `oliva` | `--group-oliva` | `oklch(0.72 0.09 120)` |
| `salvia` | `--group-salvia` | `oklch(0.72 0.09 190)` |
| `piedra` | `--group-piedra` | `oklch(0.72 0.012 60)` (neutro) |

Descartados: **ciruela** (345; con la cabecera teñida se confunde con el tinte de "fuera de línea"), **arena** (choca con el ámbar de mantenimiento, 85), **pizarra/celeste** (choca con el acero de interacción, 230).

**Datos:** columna `color_grupo VARCHAR(20) NULL` en `devices` que guarda la **clave** (`'lavanda'`), nunca el hex: si un tono se ajusta, todos los nodos cambian sin migrar datos. Requiere migración de Alembic, schema Pydantic, `bulk` y carga en `App.jsx`.

**Selector:** en el panel lateral (10.5), dentro de "Más detalles": fila de 6 muestras de 20×20 (radio 2) + "Sin color"; la elegida con borde acero de 2 px. Cada muestra con `title` y `aria-label` con su nombre.

[Propuesta futura: nombrar los grupos ("Lavanda = Oficinas") con una leyenda en la barra superior y filtrar el mapa por grupo.]

---

## 11. Implementación en CSS

### 11.1 Estructura de archivos

```
src/
  styles/tokens.css        ← variables y base global (importado en index.jsx)
  components/<Grupo>/
    Componente.jsx
    Componente.css         ← CSS del componente, importado en su .jsx
  utils/cx.js              ← helper de clases condicionales
  utils/status.js          ← normalización de estados (online|offline|maint|unknown)
  context/ToastContext.jsx ← estado global de notificaciones (useToast)
  config/deviceTypes.js    ← datos de tipos de dispositivo, campos y validadores
  App.jsx / App.css        ← estructura general (.app-shell)
```

Regla: **lo global en `styles/`, lo específico junto a su componente.**

### 11.2 Convenciones

- Nombres **BEM**: `.sidebar` (bloque), `.sidebar__item` (elemento), `.sidebar--collapsed` (modificador).
- Todo color, fuente, radio y sombra sale de una variable (`var(--color-bg-1)`). **Sin valores sueltos** salvo los pocos de las secciones 6 y 7 que aún no tienen token.
- Los modificadores de estado se aplican con `cx()`:

```js
import { cx } from '../../utils/cx';
<aside className={cx('sidebar', isOpen ? 'sidebar--expanded' : 'sidebar--collapsed')}>
```

- Sin `!important`. Sin estilos en línea salvo valores calculados en tiempo de ejecución (posición de handles, colores dinámicos).
- Íconos como SVG en línea con `stroke="currentColor"`, `strokeWidth="1.5"`, `strokeLinecap="square"`, `strokeLinejoin="miter"`.

### 11.3 `tokens.css` (resumen)

```css
:root {
  --font-sans: 'Archivo', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  --color-bg-0: oklch(0.165 0.004 40);  --color-bg-1: oklch(0.195 0.005 40);
  --color-bg-2: oklch(0.235 0.006 40);  --color-bg-3: oklch(0.27 0.007 40);
  --color-line: oklch(0.31 0.007 40);   --color-line-2: oklch(0.4 0.008 40);
  --color-text-1: oklch(0.95 0.005 80); --color-text-2: oklch(0.76 0.006 60);
  --color-text-3: oklch(0.62 0.008 50);

  --color-brand: oklch(0.56 0.2 30);    --color-brand-deep: oklch(0.4 0.15 25);
  --color-steel: oklch(0.76 0.09 230);

  --color-st-online: oklch(0.8 0.16 150);
  --color-st-offline: oklch(0.7 0.19 10);
  --color-st-offline-tint: oklch(0.7 0.19 10 / 0.12);
  --color-st-maint: oklch(0.84 0.14 85);
  --color-st-maint-tint: oklch(0.84 0.14 85 / 0.09);
  --color-st-unknown: oklch(0.66 0.01 50);

  --radius-xs: 2px; --radius-sm: 3px; --radius-md: 4px;
  --shadow-float: 0 8px 24px oklch(0 0 0 / 0.45);
  --canvas-dot-color: oklch(0.3 0.006 40);
  --canvas-dot-size: 16px;
}
```

Ajustes de React Flow en el mismo archivo: puntos del fondo, `.react-flow__edge-path` (gris 1.5 px), arista seleccionada (acero 2 px) y `.react-flow__handle` (8×8, radio 1).

### 11.4 Navegadores

`oklch()` y `clip-path` requieren un navegador moderno (Chrome/Edge 111+, Firefox 113+, Safari 15.4+). La app es de uso interno, así que se asume Chrome o Edge actualizados.

---

## 12. Accesibilidad

- **Estado:** nunca solo color (R3).
- **Contraste:** texto principal `text-1` sobre `bg-0/1/2` supera 7:1. `text-3` se reserva para etiquetas secundarias, no para información crítica.
- **Teclado:** el buscador se enfoca con `/`; `Ctrl S` guarda **[Pendiente]**. Todo botón es un `<button type="button">` real con `title` o `aria-label` si solo tiene icono.
- **Foco visible:** borde o halo acero en cualquier control enfocado **[Pendiente de revisar en todos los componentes]**.
- **Movimiento:** transiciones cortas (≤ 200 ms). Sin animaciones decorativas; el pulso de "en línea" que existía antes se elimina. [Propuesta: respetar `prefers-reduced-motion`.]

---

## 13. Qué NO hacer

- No usar colores por categoría de dispositivo (azul para switch, morado para router…).
- No usar el rojo de marca dentro del lienzo, en botones de acción ni como punto de estado.
- No usar gradientes, `backdrop-blur`, glassmorphism ni sombras suaves en elementos fijos.
- No usar radios mayores a 4 px (nada de `rounded-xl` ni píldoras).
- No usar emojis como iconos (el chip de usuario con 👤 del diseño anterior se reemplazó por iniciales).
- No mezclar iconos de otra librería (Lucide, Heroicons…) con el juego propio.
- No usar Tailwind ni clases de utilidad. No añadir librerías de UI sin discutirlo.
- No cambiar los IDs de handles de React Flow (rompe las conexiones guardadas).

---

## 14. Estado de la migración y hoja de ruta

| Pieza | Estado |
|---|---|
| Tokens (`tokens.css`) y fuentes | Hecho |
| Layout general (`.app-shell`) | Hecho |
| Sidebar | Hecho (buscador sin cablear) |
| Barra superior | Hecho (faltan barra roja de pestaña activa y extras de la sección 10.3) |
| `deviceTypes.js` (iconos, códigos, IDs, tipos nuevos) | Hecho |
| Nodo de dispositivo (color por estado, estado borrador) | Hecho |
| Panel de configuración (reemplaza el modal) | Hecho |
| Controles, MiniMap y enlaces sólidos | Hecho |
| Notificaciones (toasts) | Hecho |
| Menú del nodo y pantalla de carga | Hecho |
| Quitar Tailwind y archivos sin uso | Hecho |
| Monitoreo en vivo: cascada SNMP → ICMP → TCP asíncrona cada 30 s, WebSocket con reconexión, nodos y toasts en vivo | Hecho |
| Indicador EN VIVO, cambios sin guardar, Ctrl + S | Hecho |
| ARP como cuarto método (leer estado Reachable/Stale; solo misma subred) | Pendiente |
| Robustez: URL del API en `.env`, CORS configurable, `requirements.txt` limpio, `logging` | **Siguiente** |
| Barra roja de pestaña activa, buscador del sidebar | Pendiente |
| Alerta en línea, conteos por estado en la barra superior | Pendiente |
| Destello al conectar, sidebar recordada | Hecho |
| Color de grupo (variante B) | Aprobado; se hace con el backend |

**Funcionalidades visuales que el diseño anticipa** (por orden de valor): estado en vivo por WebSocket (`/ws`) con actualización de glifos sin recargar; resumen de conteos por estado en la barra superior; vista "Ver dispositivos" como inventario en tabla; selector de red por sede o filial; buscador de dispositivos; notificaciones automáticas de cambio de estado.

---

## 15. Glosario

| Término | Significado |
|---|---|
| NOC | Network Operations Center; pantalla de monitoreo de red |
| Nodo | Dispositivo dibujado en el lienzo |
| Handle | Punto de conexión de un nodo (donde se engancha un enlace) |
| Enlace (edge) | Línea que une dos nodos |
| Franja de estado | Fila del nodo con glifo, etiqueta y latencia |
| Glifo | Forma pequeña que acompaña a cada estado (● ■ ▲ ○) |
| Marco | Sidebar + barra superior (todo lo que no es el lienzo) |