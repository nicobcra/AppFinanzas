import { useQuery } from '@tanstack/react-query';
import analyticsService from '../api/analyticsService';

/**
 * Hook para obtener el resumen agregativo de finanzas (ingresos, egresos, balance).
 */
export const useAnalyticsSummary = () => {
  return useQuery({
    queryKey: ['analytics-summary'],
    queryFn: async () => {
      const response = await analyticsService.getSummary();
      if (!response.success) {
        throw new Error(response.message || 'Error al obtener resumen de analíticas');
      }
      return response.data;
    },
  });
};

/**
 * Hook para obtener la distribución de gastos por categoría.
 */
export const useCategoryBreakdown = () => {
  return useQuery({
    queryKey: ['analytics-categories'],
    queryFn: async () => {
      const response = await analyticsService.getCategoryBreakdown();
      if (!response.success) {
        throw new Error(response.message || 'Error al obtener distribución por categorías');
      }
      return response.data;
    },
  });
};
