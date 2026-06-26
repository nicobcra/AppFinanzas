import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';
import { Layout, Spacing, Typography } from '../../core/constants/theme';
import { useTheme } from '../../core/theme/ThemeProvider';
import authService from '../../features/auth/api/authService';
import { useAuthStore } from '../../features/auth/store/useAuthStore';

const loginSchema = z.object({
  email: z.string().email('Ingresa un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { login: storeLogin } = useAuthStore();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null);
    setIsSubmitting(true);
    try {
      const response = await authService.login(data.email, data.password);
      if (response.success && response.data) {
        await storeLogin(response.data.user, response.data.token);
      } else {
        setApiError(response.message || 'Error desconocido al iniciar sesión');
      }
    } catch (error: any) {
      setApiError(error.message || 'Error en las credenciales de acceso');
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
          <Text style={[styles.title, { color: colors.text }]}>Finanzas Premium</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Gestiona tus ingresos, gastos y metas en un solo lugar de forma segura.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Iniciar Sesión</Text>

          {apiError && (
            <View style={[styles.errorBox, { backgroundColor: isDark ? '#3B1E22' : '#FEE2E2' }]}>
              <Text style={[styles.errorText, { color: '#EF4444' }]}>{apiError}</Text>
            </View>
          )}


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
                  placeholder="******"
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
              <Text style={styles.buttonText}>Ingresar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.hintContainer}>
            <Text style={[styles.hintText, { color: colors.textMuted }]}>
              Credenciales demo: <Text style={styles.boldText}>user@example.com</Text> / <Text style={styles.boldText}>password123</Text>
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={{ color: colors.textMuted }}>¿No tienes una cuenta?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={[styles.link, { color: colors.primary }]}> Regístrate aquí</Text>
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
  cardTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.semibold,
    marginBottom: Spacing.md,
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
  hintContainer: {
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  hintText: {
    fontSize: Typography.fontSizes.xs,
    textAlign: 'center',
  },
  boldText: {
    fontWeight: Typography.fontWeights.bold,
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
