import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from '../../core/theme/ThemeProvider';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import authService from '../../features/auth/api/authService';
import { Spacing, Typography, Layout } from '../../core/constants/theme';

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Ingresa un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { login: storeLogin } = useAuthStore();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setApiError(null);
    setIsSubmitting(true);
    try {
      const response = await authService.register(data.name, data.email, data.password);
      if (response.success && response.data) {
        await storeLogin(response.data.user, response.data.token);
      } else {
        setApiError(response.message || 'Error desconocido al registrarse');
      }
    } catch (error: any) {
      setApiError(error.message || 'Error al procesar el registro');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Crear Cuenta</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Regístrate y comienza a tomar el control de tu dinero.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {apiError && (
            <View style={[styles.errorBox, { backgroundColor: isDark ? '#3B1E22' : '#FEE2E2' }]}>
              <Text style={[styles.errorText, { color: '#EF4444' }]}>{apiError}</Text>
            </View>
          )}

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.textMuted }]}>Nombre completo</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.backgroundMuted,
                      color: colors.text,
                      borderColor: errors.name ? '#EF4444' : colors.border,
                    },
                  ]}
                  placeholder="Nicolas Becerra"
                  placeholderTextColor={colors.textMuted}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCorrect={false}
                />
              )}
            />
            {errors.name && <Text style={styles.fieldError}>{errors.name.message}</Text>}
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.textMuted }]}>Correo electrónico</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.backgroundMuted,
                      color: colors.text,
                      borderColor: errors.email ? '#EF4444' : colors.border,
                    },
                  ]}
                  placeholder="ejemplo@correo.com"
                  placeholderTextColor={colors.textMuted}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              )}
            />
            {errors.email && <Text style={styles.fieldError}>{errors.email.message}</Text>}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.textMuted }]}>Contraseña</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.backgroundMuted,
                      color: colors.text,
                      borderColor: errors.password ? '#EF4444' : colors.border,
                    },
                  ]}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={colors.textMuted}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              )}
            />
            {errors.password && <Text style={styles.fieldError}>{errors.password.message}</Text>}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.buttonText}>Registrarse</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={{ color: colors.textMuted }}>¿Ya tienes una cuenta?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={[styles.link, { color: colors.primary }]}> Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.fontSizes.sm,
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    ...Layout.shadow,
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.medium,
    marginBottom: Spacing.xs,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: Layout.borderRadius.sm,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.fontSizes.md,
  },
  fieldError: {
    color: '#EF4444',
    fontSize: Typography.fontSizes.xs,
    marginTop: Spacing.xs,
  },
  button: {
    height: 48,
    borderRadius: Layout.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
  },
  errorBox: {
    padding: Spacing.md,
    borderRadius: Layout.borderRadius.sm,
    marginBottom: Spacing.md,
  },
  errorText: {
    fontSize: Typography.fontSizes.sm,
    textAlign: 'center',
    fontWeight: Typography.fontWeights.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  link: {
    fontWeight: Typography.fontWeights.semibold,
  },
});
