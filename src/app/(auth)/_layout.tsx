import { Stack } from 'expo-router';
import React from 'react';

/**
 * Layout del flujo de autenticación (Login, Registro, Recuperación de contraseña).
 */
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
