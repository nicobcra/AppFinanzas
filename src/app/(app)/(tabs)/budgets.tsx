import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, RefreshControl, Platform } from 'react-native';
import { useTheme } from '../../../core/theme/ThemeProvider';
import { useBudgets, useSaveBudget } from '../../../features/budgets/hooks/useBudgets';
import { formatCurrency, formatPercentage } from '../../../core/utils/format';
import { Spacing, Typography, Layout } from '../../../core/constants/theme';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';

const budgetFormSchema = z.object({
  category: z.string().min(2, 'La categoría debe tener al menos 2 caracteres'),
  limit: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'El límite debe ser un número mayor a 0',
  }),
});

type BudgetFormData = z.infer<typeof budgetFormSchema>;

export default function BudgetsScreen() {
  const { colors, isDark } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const { data: budgets, isLoading, refetch, isRefetching } = useBudgets();
  const saveMutation = useSaveBudget();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      category: '',
      limit: '',
    },
  });

  const onSubmit = (data: BudgetFormData) => {
    saveMutation.mutate(
      {
        category: data.category,
        limit: Number(data.limit),
        period: 'MONTHLY',
      },
      {
        onSuccess: () => {
          setModalVisible(false);
          reset();
        },
      }
    );
  };

  if (isLoading && !budgets) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Lista de Presupuestos */}
      <FlatList
        data={budgets}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
        }
        renderItem={({ item }) => {
          const ratio = Math.min(item.spent / item.limit, 1);
          const percentage = (item.spent / item.limit) * 100;
          const isOverBudget = item.spent > item.limit;
          
          let progressBarColor = colors.primary;
          if (ratio > 0.8) progressBarColor = colors.warning;
          if (isOverBudget) progressBarColor = colors.danger;

          return (
            <View style={[styles.budgetCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.categoryTitle, { color: colors.text }]}>{item.category}</Text>
                <Text style={[styles.cardRatioText, { color: isOverBudget ? colors.danger : colors.textMuted }]}>
                  {formatCurrency(item.spent)} / {formatCurrency(item.limit)}
                </Text>
              </View>

              {/* Progress Bar */}
              <View style={[styles.progressTrack, { backgroundColor: colors.backgroundMuted }]}>
                <View style={[styles.progressBar, { width: `${ratio * 100}%`, backgroundColor: progressBarColor }]} />
              </View>

              <View style={styles.cardFooter}>
                <Text style={[styles.percentageText, { color: colors.textMuted }]}>
                  {formatPercentage(percentage)} consumido
                </Text>
                {isOverBudget && (
                  <View style={styles.alertContainer}>
                    <Ionicons name="alert-circle" size={14} color={colors.danger} />
                    <Text style={[styles.alertText, { color: colors.danger }]}>Límite excedido</Text>
                  </View>
                )}
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>No has configurado ningún presupuesto.</Text>
        }
        contentContainerStyle={styles.listContainer}
      />

      {/* Botón Flotante para configurar presupuesto */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="options-outline" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Modal del Formulario */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Configurar Presupuesto</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Input Categoría */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Categoría de Gasto</Text>
              <Controller
                control={control}
                name="category"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.backgroundMuted, color: colors.text, borderColor: colors.border }]}
                    placeholder="Alimentación, Entretenimiento, Transporte..."
                    placeholderTextColor={colors.textMuted}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.category && <Text style={styles.fieldError}>{errors.category.message}</Text>}
            </View>

            {/* Input Límite */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Límite mensual ($)</Text>
              <Controller
                control={control}
                name="limit"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.backgroundMuted, color: colors.text, borderColor: colors.border }]}
                    placeholder="0.00"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.limit && <Text style={styles.fieldError}>{errors.limit.message}</Text>}
            </View>

            {/* Botón Guardar */}
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: colors.primary }]}
              onPress={handleSubmit(onSubmit)}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.saveBtnText}>Establecer Presupuesto</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: Spacing.md,
    paddingBottom: 90, // espacio para el FAB
    gap: Spacing.md,
  },
  budgetCard: {
    padding: Spacing.md,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    ...Layout.shadow,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  categoryTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
  },
  cardRatioText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.semibold,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: Typography.fontSizes.xs,
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  alertText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
  },
  emptyText: {
    fontSize: Typography.fontSizes.sm,
    textAlign: 'center',
    padding: Spacing.xl,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.lg,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...Layout.shadow,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: Layout.borderRadius.lg,
    borderTopRightRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
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
  saveBtn: {
    height: 48,
    borderRadius: Layout.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
  },
});
