import React from 'react';
import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

/**
 * Layout de seguridad del flujo autenticado.
 * Si el usuario no está logueado, redirige de inmediato a login.
 */
export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B0F19',
  },
});
