// src/hooks/useMonitorSocket.js
import { useEffect, useRef, useState } from 'react';

const WS_URL = 'ws://localhost:8080/ws';   // pasará a .env en el paso de robustez
const RECONEXION_MIN_MS = 1000;
const RECONEXION_MAX_MS = 15000;

export function useMonitorSocket(onStatusUpdate) {
    const [conectado, setConectado] = useState(false);

    // Guardamos el callback en un ref: así usamos siempre la versión más
    // reciente sin cerrar y reabrir el WebSocket cada vez que cambia.
    const callbackRef = useRef(onStatusUpdate);
    useEffect(() => {
        callbackRef.current = onStatusUpdate;
    }, [onStatusUpdate]);

    useEffect(() => {
        let socket = null;
        let intentos = 0;
        let temporizador = null;
        let desmontado = false;

        function conectar() {
            socket = new WebSocket(WS_URL);

            socket.onopen = () => {
                intentos = 0;
                setConectado(true);
            };

            socket.onmessage = (evento) => {
                let mensaje;
                try {
                    mensaje = JSON.parse(evento.data);
                } catch {
                    return;
                }
                if (mensaje.type === 'status_update') {
                    callbackRef.current(mensaje.data);
                }
            };

            socket.onclose = () => {
                setConectado(false);
                if (desmontado) return;
                // Espera creciente: 1 s, 2 s, 4 s, 8 s… hasta 15 s
                const espera = Math.min(RECONEXION_MAX_MS, RECONEXION_MIN_MS * 2 ** intentos);
                intentos += 1;
                temporizador = setTimeout(conectar, espera);
            };

            socket.onerror = () => {
                socket.close();   // onclose se encarga de reintentar
            };
        }

        conectar();

        return () => {
            desmontado = true;
            clearTimeout(temporizador);
            if (socket) socket.close();
        };
    }, []);

    return conectado;
}