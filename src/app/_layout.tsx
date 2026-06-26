import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from '../core/theme/ThemeProvider';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const queryClient = new QueryClient();

function InitialLayout() {
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    // segments[0] nos dice en qué grupo de rutas estamos
    const inAppGroup = segments[0] === '(app)';

    if (!isAuthenticated && inAppGroup) {
      // Redirigir a login si intenta ingresar a la app privada
      router.replace('/(auth)/login');
    } else if (isAuthenticated && !inAppGroup) {
      // Redirigir al dashboard si está logueado y en rutas públicas
      router.replace('/(app)/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
      <Stack.Screen name="(app)" options={{ animation: 'fade' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <InitialLayout />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
