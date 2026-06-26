import apiClient from '../../../core/api/client';
import { ApiResponse } from '../../../types';

interface SummaryData {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  savingsRate: number; // Porcentaje
}

interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

/**
 * Servicio para consumir reportes financieros agregados del servidor externo.
 */
export const analyticsService = {
  /**
   * Obtiene el resumen general de ingresos y gastos del usuario.
   */
  getSummary: async (): Promise<ApiResponse<SummaryData>> => {
    // LLAMADA REAL A LA API:
    // const response = await apiClient.get<ApiResponse<SummaryData>>('/analytics/summary');
    // return response.data;

    // MOCK LOCAL PARA DESARROLLO / PRUEBAS:
    await new Promise((resolve) => setTimeout(resolve, 900));
    return {
      success: true,
      data: {
        totalIncome: 2500.00,
        totalExpense: 220.50,
        netBalance: 2279.50,
        savingsRate: 91.18, // (2279.50 / 2500) * 100
      },
    };
  },

  /**
   * Obtiene la distribución de gastos por categoría para gráficos.
   */
  getCategoryBreakdown: async (): Promise<ApiResponse<CategoryBreakdown[]>> => {
    // LLAMADA REAL A LA API:
    // const response = await apiClient.get<ApiResponse<CategoryBreakdown[]>>('/analytics/category-breakdown');
    // return response.data;

    // MOCK LOCAL PARA DESARROLLO / PRUEBAS:
    await new Promise((resolve) => setTimeout(resolve, 700));
    return {
      success: true,
      data: [
        { category: 'Servicios', amount: 120.00, percentage: 54.4, color: '#3B82F6' },
        { category: 'Alimentación', amount: 85.50, percentage: 38.8, color: '#10B981' },
        { category: 'Entretenimiento', amount: 15.00, percentage: 6.8, color: '#EF4444' },
      ],
    };
  },
};

export default analyticsService;
