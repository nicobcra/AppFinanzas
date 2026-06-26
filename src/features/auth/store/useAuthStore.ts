import { create } from 'zustand';
import { User } from '../../../types';
import secureStorage from '../../../core/storage/secureStore';
import { registerLogoutCallback } from '../../../core/api/client';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Acciones
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Registrar el callback de logout en el cliente de API para manejar 401s automáticamente
  registerLogoutCallback(() => {
    get().logout();
  });

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,

    login: async (user: User, token: string) => {
      set({ isLoading: true });
      try {
        await secureStorage.setItem('auth_token', token);
        await secureStorage.setItem('auth_user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true, isLoading: false });
      } catch (error) {
        console.error('Error al guardar credenciales de autenticación:', error);
        set({ isLoading: false });
      }
    },

    logout: async () => {
      set({ isLoading: true });
      try {
        await secureStorage.removeItem('auth_token');
        await secureStorage.removeItem('auth_user');
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      } catch (error) {
        console.error('Error al remover credenciales de autenticación:', error);
        set({ isLoading: false });
      }
    },

    updateUser: (updatedUserFields) => {
      const currentUser = get().user;
      if (currentUser) {
        const newUser = { ...currentUser, ...updatedUserFields };
        secureStorage.setItem('auth_user', JSON.stringify(newUser));
        set({ user: newUser });
      }
    },

    initializeAuth: async () => {
      set({ isLoading: true });
      try {
        const token = await secureStorage.getItem('auth_token');
        const userStr = await secureStorage.getItem('auth_user');
        
        if (token && userStr) {
          const user = JSON.parse(userStr) as User;
          set({ token, user, isAuthenticated: true, isLoading: false });
        } else {
          set({ token: null, user: null, isAuthenticated: false, isLoading: false });
        }
      } catch (error) {
        console.error('Error al inicializar sesión:', error);
        set({ token: null, user: null, isAuthenticated: false, isLoading: false });
      }
    },
  };
});
