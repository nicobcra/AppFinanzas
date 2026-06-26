import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useTheme } from '../../../core/theme/ThemeProvider';
import { useAuthStore } from '../../../features/auth/store/useAuthStore';
import { Spacing, Typography, Layout } from '../../../core/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { colors, themeMode, setThemeMode, isDark } = useTheme();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  const toggleTheme = () => {
    setThemeMode(isDark ? 'light' : 'dark');
  };

  const getThemeLabel = () => {
    if (themeMode === 'system') return 'Sistema';
    return themeMode === 'dark' ? 'Modo Oscuro' : 'Modo Claro';
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.scrollContent}>
      {/* Sección del Perfil de Usuario */}
      <View style={[styles.profileHeaderCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.avatarBg, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
        </View>
        <Text style={[styles.userName, { color: colors.text }]}>{user?.name || 'Usuario Demo'}</Text>
        <Text style={[styles.userEmail, { color: colors.textMuted }]}>{user?.email || 'usuario@ejemplo.com'}</Text>
      </View>

      {/* Configuración de Preferencias */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Ajustes y Preferencias</Text>

      <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {/* Toggle Modo Oscuro */}
        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Ionicons name="moon-outline" size={22} color={colors.text} style={styles.settingIcon} />
            <View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Modo Oscuro</Text>
              <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>Tema actual: {getThemeLabel()}</Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={isDark ? colors.primary : '#F4F3F4'}
          />
        </View>

        {/* Selector de Moneda (Informativo) */}
        <View style={[styles.settingRow, { borderTopWidth: 1, borderTopColor: colors.border }]}>
          <View style={styles.settingLabelContainer}>
            <Ionicons name="cash-outline" size={22} color={colors.text} style={styles.settingIcon} />
            <View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Moneda Principal</Text>
              <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>Dólar Estadounidense (USD)</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </View>

        {/* Seguridad e Integraciones */}
        <View style={[styles.settingRow, { borderTopWidth: 1, borderTopColor: colors.border }]}>
          <View style={styles.settingLabelContainer}>
            <Ionicons name="lock-closed-outline" size={22} color={colors.text} style={styles.settingIcon} />
            <View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Servidor de Datos Externo</Text>
              <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>Estado: Conectado (API Mocks)</Text>
            </View>
          </View>
          <View style={[styles.statusIndicator, { backgroundColor: colors.successLight + '20' }]}>
            <Text style={[styles.statusText, { color: colors.success }]}>Activo</Text>
          </View>
        </View>
      </View>

      {/* Botón de Salida */}
      <TouchableOpacity
        style={[styles.logoutBtn, { backgroundColor: isDark ? '#3B1E22' : '#FEE2E2', borderColor: colors.danger }]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color={colors.danger} style={{ marginRight: Spacing.sm }} />
        <Text style={[styles.logoutBtnText, { color: colors.danger }]}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  profileHeaderCard: {
    padding: Spacing.lg,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    ...Layout.shadow,
  },
  avatarBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
  },
  userName: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: Typography.fontSizes.sm,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  settingsCard: {
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
    ...Layout.shadow,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: Spacing.md,
  },
  settingTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.semibold,
  },
  settingSubtitle: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
  },
  statusIndicator: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Layout.borderRadius.xs,
  },
  statusText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
  },
  logoutBtn: {
    height: 48,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  logoutBtnText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
  },
});
