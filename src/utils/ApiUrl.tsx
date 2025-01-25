// Detectar la URL base según el entorno
export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL !== ''
        ? import.meta.env.VITE_API_BASE_URL
        : `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;