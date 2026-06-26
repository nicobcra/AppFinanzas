import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as RNUseColorScheme } from 'react-native';
import { Palette } from '../constants/theme';
import secureStorage from '../storage/secureStore';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: 'light' | 'dark';
  themeMode: ThemeMode;
  colors: typeof Palette.light & {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    success: string;
    successLight: string;
    danger: string;
    dangerLight: string;
    warning: string;
    info: string;
  };
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app_theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = RNUseColorScheme() === 'light' ? 'light' : 'dark';
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>(systemColorScheme);

  useEffect(() => {
    // Cargar la preferencia del tema almacenada
    const loadSavedTheme = async () => {
      try {
        const savedMode = await secureStorage.getItem(THEME_STORAGE_KEY);
        if (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system') {
          setThemeModeState(savedMode);
        }
      } catch (error) {
        console.warn('No se pudo cargar el tema guardado:', error);
      }
    };
    loadSavedTheme();
  }, []);

  useEffect(() => {
    // Actualizar el tema activo en base al modo seleccionado y el sistema
    if (themeMode === 'system') {
      setActiveTheme(systemColorScheme);
    } else {
      setActiveTheme(themeMode);
    }
  }, [themeMode, systemColorScheme]);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await secureStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.warn('No se pudo guardar la preferencia de tema:', error);
    }
  };

  const colors = activeTheme === 'dark' ? Palette.dark : Palette.light;
  // Mapeamos los colores comunes para compatibilidad si hiciera falta
  const themeColors = {
    ...colors,
    primary: Palette.primary,
    primaryLight: Palette.primaryLight,
    primaryDark: Palette.primaryDark,
    success: Palette.success,
    successLight: Palette.successLight,
    danger: Palette.danger,
    dangerLight: Palette.dangerLight,
    warning: Palette.warning,
    info: Palette.info,
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: activeTheme,
        themeMode,
        colors: themeColors,
        isDark: activeTheme === 'dark',
        setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  }
  return context;
};
