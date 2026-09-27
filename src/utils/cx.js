/**
 * Combina nombres de clase condicionalmente, ignorando los valores
 * falsy. Reemplaza el uso de Tailwind para armar className dinámicos.
 *
 * cx('fila', activo && 'fila--activa') // "fila fila--activa" o "fila"
 */
export function cx(...classes) {
    return classes.filter(Boolean).join(' ');
}
