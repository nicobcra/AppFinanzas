import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { AppConfig } from '../constants/theme';
import secureStorage from '../storage/secureStore';

/**
 * Cliente de Axios centralizado para conectar con el servidor de datos externo.
 * Maneja automáticamente los tokens JWT mediante interceptores.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: AppConfig.apiBaseUrl,
  timeout: AppConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor para agregar token a las solicitudes salientes
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await secureStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error al recuperar el token de autorización:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores comunes globalmente (ej. 401 Unauthorized)
let logoutCallback: (() => void) | null = null;

export const registerLogoutCallback = (cb: () => void) => {
  logoutCallback = cb;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 (No autorizado) y no es una solicitud de reintento
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn('Sesión expirada o token no válido. Cerrando sesión...');
      
      if (logoutCallback) {
        logoutCallback();
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
