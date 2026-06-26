import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '../../../core/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

/**
 * Layout de navegación por pestañas (Tabs) principal de la aplicación.
 * Define las cuatro pestañas principales con estilos coherentes y modo oscuro/claro.
 */
export default function TabLayout() {
  const { colors, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
        },
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          color: colors.text,
          fontWeight: '700',
          fontSize: 20,
        },
        headerTitleAlign: 'left',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Resumen',
          headerTitle: 'Dashboard Financiero',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'wallet' : 'wallet-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Movimientos',
          headerTitle: 'Mis Transacciones',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'list-circle' : 'list-circle-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="budgets"
        options={{
          title: 'Presupuestos',
          headerTitle: 'Presupuestos Mensuales',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'pie-chart' : 'pie-chart-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          headerTitle: 'Mi Perfil',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
