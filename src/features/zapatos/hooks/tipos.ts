// Estado común de los hooks que cargan datos: cargando, vacío y error.
export interface EstadoDatos<T> {
  datos: T | null;
  cargando: boolean;
  // Mensaje listo para mostrar cuando la carga falló; null si no hubo error.
  error: string | null;
  reintentar: () => void;
}