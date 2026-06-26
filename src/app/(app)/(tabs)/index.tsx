import React from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../../../core/theme/ThemeProvider';
import { useAnalyticsSummary, useCategoryBreakdown } from '../../../features/analytics/hooks/useAnalytics';
import { useTransactions } from '../../../features/transactions/hooks/useTransactions';
import { formatCurrency, formatPercentage } from '../../../core/utils/format';
import { Spacing, Typography, Layout } from '../../../core/constants/theme';
import { useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const { colors, isDark } = useTheme();
  const queryClient = useQueryClient();

  const { data: summary, isLoading: summaryLoading, isRefetching: summaryRefetching } = useAnalyticsSummary();
  const { data: breakdown, isLoading: breakdownLoading } = useCategoryBreakdown();
  const { data: transactions, isLoading: txLoading } = useTransactions();

  const handleRefresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['analytics-summary'] }),
      queryClient.invalidateQueries({ queryKey: ['analytics-categories'] }),
      queryClient.invalidateQueries({ queryKey: ['transactions'] }),
    ]);
  };

  const isLoading = summaryLoading || breakdownLoading || txLoading;
  const isRefreshing = summaryRefetching;

  if (isLoading && !summary) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Filtrar los últimos 3 movimientos
  const recentTransactions = transactions?.slice(0, 3) || [];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
      }
    >
      {/* Balance Card Principal */}
      <View style={[styles.balanceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.balanceLabel, { color: colors.textMuted }]}>Balance Neto Total</Text>
        <Text style={[styles.balanceAmount, { color: colors.text }]}>
          {formatCurrency(summary?.netBalance || 0)}
        </Text>
        <View style={styles.savingsRateContainer}>
          <Ionicons name="trending-up" size={16} color={colors.success} style={{ marginRight: 4 }} />
          <Text style={[styles.savingsRateText, { color: colors.textMuted }]}>
            Tasa de Ahorro: <Text style={[styles.boldText, { color: colors.success }]}>{formatPercentage(summary?.savingsRate || 0)}</Text>
          </Text>
        </View>
      </View>

      {/* Tarjetas de Ingreso y Gasto */}
      <View style={styles.row}>
        {/* Ingresos */}
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border, flex: 1, marginRight: Spacing.sm }]}>
          <View style={styles.statHeader}>
            <View style={[styles.iconContainer, { backgroundColor: isDark ? '#143C2E' : '#D1FAE5' }]}>
              <Ionicons name="arrow-down" size={20} color={colors.success} />
            </View>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Ingresos</Text>
          </View>
          <Text style={[styles.statAmount, { color: colors.success }]}>
            {formatCurrency(summary?.totalIncome || 0)}
          </Text>
        </View>

        {/* Egresos */}
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border, flex: 1, marginLeft: Spacing.sm }]}>
          <View style={styles.statHeader}>
            <View style={[styles.iconContainer, { backgroundColor: isDark ? '#3B1E22' : '#FEE2E2' }]}>
              <Ionicons name="arrow-up" size={20} color={colors.danger} />
            </View>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Gastos</Text>
          </View>
          <Text style={[styles.statAmount, { color: colors.danger }]}>
            {formatCurrency(summary?.totalExpense || 0)}
          </Text>
        </View>
      </View>

      {/* Distribución de Categorías */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Distribución de Gastos</Text>
      </View>
      <View style={[styles.breakdownCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {breakdown && breakdown.length > 0 ? (
          breakdown.map((item, index) => (
            <View key={item.category} style={[styles.breakdownRow, index > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}>
              <View style={styles.breakdownInfo}>
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                <Text style={[styles.categoryName, { color: colors.text }]}>{item.category}</Text>
              </View>
              <View style={styles.breakdownValues}>
                <Text style={[styles.categoryAmount, { color: colors.text }]}>{formatCurrency(item.amount)}</Text>
                <Text style={[styles.categoryPercentage, { color: colors.textMuted }]}>{formatPercentage(item.percentage)}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>Sin gastos registrados en el periodo.</Text>
        )}
      </View>

      {/* Últimos Movimientos */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Últimos Movimientos</Text>
      </View>
      <View style={[styles.transactionsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {recentTransactions.length > 0 ? (
          recentTransactions.map((tx, index) => (
            <View key={tx.id} style={[styles.txRow, index > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}>
              <View style={styles.txInfo}>
                <View style={[
                  styles.txIconBg,
                  { backgroundColor: tx.type === 'INCOME' ? (isDark ? '#143C2E' : '#D1FAE5') : (isDark ? '#3B1E22' : '#FEE2E2') }
                ]}>
                  <Ionicons
                    name={tx.type === 'INCOME' ? 'arrow-down-outline' : 'arrow-up-outline'}
                    size={18}
                    color={tx.type === 'INCOME' ? colors.success : colors.danger}
                  />
                </View>
                <View>
                  <Text style={[styles.txDesc, { color: colors.text }]}>{tx.description}</Text>
                  <Text style={[styles.txCategory, { color: colors.textMuted }]}>{tx.category}</Text>
                </View>
              </View>
              <Text style={[styles.txAmount, { color: tx.type === 'INCOME' ? colors.success : colors.danger }]}>
                {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
              </Text>
            </View>
          ))
        ) : (
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>No se encontraron transacciones recientes.</Text>
        )}
      </View>
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
    paddingBottom: Spacing.xl,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    padding: Spacing.lg,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    ...Layout.shadow,
  },
  balanceLabel: {
    fontSize: Typography.fontSizes.xs,
    textTransform: 'uppercase',
    fontWeight: Typography.fontWeights.semibold,
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  balanceAmount: {
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.bold,
    marginBottom: Spacing.sm,
  },
  savingsRateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savingsRateText: {
    fontSize: Typography.fontSizes.sm,
  },
  boldText: {
    fontWeight: Typography.fontWeights.bold,
  },
  row: {
    flexDirection: 'row',
  },
  statCard: {
    padding: Spacing.md,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    ...Layout.shadow,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  statLabel: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.medium,
  },
  statAmount: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
  },
  sectionHeader: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
  },
  breakdownCard: {
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
    ...Layout.shadow,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  breakdownInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.sm,
  },
  categoryName: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium,
  },
  breakdownValues: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.semibold,
  },
  categoryPercentage: {
    fontSize: Typography.fontSizes.xs,
  },
  transactionsCard: {
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
    ...Layout.shadow,
  },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  txInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
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
  txCategory: {
    fontSize: Typography.fontSizes.xs,
  },
  txAmount: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
  },
  emptyText: {
    fontSize: Typography.fontSizes.sm,
    textAlign: 'center',
    padding: Spacing.lg,
  },
});
