// Host de la API, configurado por variable de entorno (sin el prefijo /api).
// El frontend nunca tiene datos quemados: todo viene de esta API.
export const API_HOST = process.env.NEXT_PUBLIC_API_HOST ?? "http://localhost:3000";

export const API_BASE_URL = `${API_HOST}/api`;