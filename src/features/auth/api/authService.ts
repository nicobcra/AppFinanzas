import apiClient from '../../../core/api/client';
import { ApiResponse, User } from '../../../types';

interface AuthResponseData {
  user: User;
  token: string;
}

/**
 * Servicio para consumir endpoints de autenticación en el servidor externo.
 * Permite cambiar fácilmente entre mocks locales y llamadas reales al servidor.
 */
export const authService = {
  /**
   * Envía las credenciales al servidor externo para iniciar sesión.
   */
  login: async (email: string, password: string): Promise<ApiResponse<AuthResponseData>> => {
    // LLAMADA REAL A LA API (Comentar si se desea usar Mock):
    // const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', { email, password });
    // return response.data;

    // MOCK LOCAL PARA DESARROLLO / PRUEBAS:
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula latencia
    if (email === 'user@example.com' && password === 'password123') {
      return {
        success: true,
        data: {
          token: 'mock-jwt-token-xyz-12345',
          user: {
            id: 'usr_1',
            name: 'Nicolas Becerra',
            email: 'user@example.com',
            createdAt: new Date().toISOString(),
          },
        },
        message: 'Inicio de sesión exitoso',
      };
    }
    throw new Error('Credenciales inválidas. Usa user@example.com y password123');
  },

  /**
   * Crea una nueva cuenta de usuario en el servidor externo.
   */
  register: async (name: string, email: string, password: string): Promise<ApiResponse<AuthResponseData>> => {
    // LLAMADA REAL A LA API:
    // const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/register', { name, email, password });
    // return response.data;

    // MOCK LOCAL:
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return {
      success: true,
      data: {
        token: 'mock-jwt-token-new-user',
        user: {
          id: `usr_${Math.random().toString(36).substr(2, 9)}`,
          name,
          email,
          createdAt: new Date().toISOString(),
        },
      },
      message: 'Registro de cuenta exitoso',
    };
  },

  /**
   * Obtiene la información actualizada del perfil del usuario logueado.
   */
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/profile');
    return response.data;
  },
};

export default authService;
