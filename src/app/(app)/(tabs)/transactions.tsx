import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, RefreshControl, Platform } from 'react-native';
import { useTheme } from '../../../core/theme/ThemeProvider';
import { useTransactions, useCreateTransaction, useDeleteTransaction } from '../../../features/transactions/hooks/useTransactions';
import { formatCurrency, formatDate } from '../../../core/utils/format';
import { Spacing, Typography, Layout } from '../../../core/constants/theme';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';

const txFormSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'El monto debe ser un número mayor a 0',
  }),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(2, 'La categoría debe tener al menos 2 caracteres'),
  description: z.string().min(2, 'La descripción debe tener al menos 2 caracteres'),
});

type TxFormData = z.infer<typeof txFormSchema>;

export default function TransactionsScreen() {
  const { colors, isDark } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

  const { data: transactions, isLoading, refetch, isRefetching } = useTransactions();
  const createMutation = useCreateTransaction();
  const deleteMutation = useDeleteTransaction();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<TxFormData>({
    resolver: zodResolver(txFormSchema),
    defaultValues: {
      amount: '',
      type: 'EXPENSE',
      category: '',
      description: '',
    },
  });

  const onSubmit = (data: TxFormData) => {
    createMutation.mutate(
      {
        amount: Number(data.amount),
        type: data.type,
        category: data.category,
        description: data.description,
        date: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          setModalVisible(false);
          reset();
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  // Filtrar transacciones
  const filteredTransactions = transactions?.filter((tx) => {
    if (filterType === 'ALL') return true;
    return tx.type === filterType;
  }) || [];

  if (isLoading && !transactions) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Botones de Filtro */}
      <View style={styles.filterBar}>
        {(['ALL', 'INCOME', 'EXPENSE'] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterBtn,
              filterType === type && { backgroundColor: colors.primary },
              filterType !== type && { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }
            ]}
            onPress={() => setFilterType(type)}
          >
            <Text
              style={[
                styles.filterBtnText,
                { color: filterType === type ? '#FFFFFF' : colors.text }
              ]}
            >
              {type === 'ALL' ? 'Todos' : type === 'INCOME' ? 'Ingresos' : 'Gastos'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de Transacciones */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
        }
        renderItem={({ item }) => (
          <View style={[styles.txItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.txRowLeft}>
              <View style={[
                styles.txIconBg,
                { backgroundColor: item.type === 'INCOME' ? (isDark ? '#143C2E' : '#D1FAE5') : (isDark ? '#3B1E22' : '#FEE2E2') }
              ]}>
                <Ionicons
                  name={item.type === 'INCOME' ? 'arrow-down-outline' : 'arrow-up-outline'}
                  size={18}
                  color={item.type === 'INCOME' ? colors.success : colors.danger}
                />
              </View>
              <View>
                <Text style={[styles.txDesc, { color: colors.text }]}>{item.description}</Text>
                <Text style={[styles.txMeta, { color: colors.textMuted }]}>
                  {item.category} • {formatDate(item.date)}
                </Text>
              </View>
            </View>
            <View style={styles.txRowRight}>
              <Text style={[styles.txAmount, { color: item.type === 'INCOME' ? colors.success : colors.danger }]}>
                {item.type === 'INCOME' ? '+' : '-'}{formatCurrency(item.amount)}
              </Text>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>No se encontraron transacciones en esta categoría.</Text>
        }
        contentContainerStyle={styles.listContainer}
      />

      {/* Botón flotante para Agregar Transacción */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
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
              <Text style={[styles.modalTitle, { color: colors.text }]}>Nuevo Movimiento</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Selector de Tipo (Ingreso / Egreso) */}
            <Controller
              control={control}
              name="type"
              render={({ field: { onChange, value } }) => (
                <View style={styles.typeSelector}>
                  <TouchableOpacity
                    style={[
                      styles.typeSelectorBtn,
                      { borderColor: colors.border, borderWidth: 1 },
                      value === 'EXPENSE' && { backgroundColor: '#FEE2E2', borderColor: colors.danger }
                    ]}
                    onPress={() => onChange('EXPENSE')}
                  >
                    <Text style={[styles.typeBtnText, { color: value === 'EXPENSE' ? colors.danger : colors.text }]}>Gasto</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeSelectorBtn,
                      { borderColor: colors.border, borderWidth: 1 },
                      value === 'INCOME' && { backgroundColor: '#D1FAE5', borderColor: colors.success }
                    ]}
                    onPress={() => onChange('INCOME')}
                  >
                    <Text style={[styles.typeBtnText, { color: value === 'INCOME' ? colors.success : colors.text }]}>Ingreso</Text>
                  </TouchableOpacity>
                </View>
              )}
            />

            {/* Input Monto */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Monto ($)</Text>
              <Controller
                control={control}
                name="amount"
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
              {errors.amount && <Text style={styles.fieldError}>{errors.amount.message}</Text>}
            </View>

            {/* Input Categoría */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Categoría</Text>
              <Controller
                control={control}
                name="category"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.backgroundMuted, color: colors.text, borderColor: colors.border }]}
                    placeholder="Alimentación, Salario, Transporte..."
                    placeholderTextColor={colors.textMuted}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.category && <Text style={styles.fieldError}>{errors.category.message}</Text>}
            </View>

            {/* Input Descripción */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Descripción</Text>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.backgroundMuted, color: colors.text, borderColor: colors.border }]}
                    placeholder="Compras en supermercado, Pago de servicios..."
                    placeholderTextColor={colors.textMuted}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.description && <Text style={styles.fieldError}>{errors.description.message}</Text>}
            </View>

            {/* Botón Guardar */}
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: colors.primary }]}
              onPress={handleSubmit(onSubmit)}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.saveBtnText}>Guardar Movimiento</Text>
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
  filterBar: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Layout.borderRadius.round,
    alignItems: 'center',
  },
  filterBtnText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium,
  },
  listContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 90, // espacio para el FAB
    gap: Spacing.sm,
  },
  txItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    ...Layout.shadow,
  },
  txRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  txIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txDesc: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.semibold,
  },
  txMeta: {
    fontSize: Typography.fontSizes.xs,
  },
  txRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  txAmount: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
  },
  deleteBtn: {
    padding: Spacing.xs,
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
  typeSelector: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  typeSelectorBtn: {
    flex: 1,
    height: 40,
    borderRadius: Layout.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeBtnText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.semibold,
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
