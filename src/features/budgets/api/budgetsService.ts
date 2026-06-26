import apiClient from '../../../core/api/client';
import { ApiResponse, Budget } from '../../../types';

/**
 * Servicio para consumir endpoints de presupuestos del servidor externo.
 */
export const budgetsService = {
  /**
   * Obtiene los presupuestos configurados por el usuario.
   */
  getBudgets: async (): Promise<ApiResponse<Budget[]>> => {
    // LLAMADA REAL A LA API:
    // const response = await apiClient.get<ApiResponse<Budget[]>>('/budgets');
    // return response.data;

    // MOCK LOCAL PARA DESARROLLO / PRUEBAS:
    await new Promise((resolve) => setTimeout(resolve, 800));
    const mockBudgets: Budget[] = [
      {
        id: 'b_1',
        userId: 'usr_1',
        category: 'Alimentación',
        limit: 500.00,
        spent: 85.50,
        period: 'MONTHLY',
      },
      {
        id: 'b_2',
        userId: 'usr_1',
        category: 'Entretenimiento',
        limit: 100.00,
        spent: 15.00,
        period: 'MONTHLY',
      },
      {
        id: 'b_3',
        userId: 'usr_1',
        category: 'Servicios',
        limit: 200.00,
        spent: 120.00,
        period: 'MONTHLY',
      },
    ];

    return {
      success: true,
      data: mockBudgets,
    };
  },

  saveBudget: async (budgetData: Omit<Budget, 'id' | 'userId' | 'spent'>): Promise<ApiResponse<Budget>> => {
    // LLAMADA REAL A LA API:
    // const response = await apiClient.post<ApiResponse<Budget>>('/budgets', budgetData);
    // return response.data;

    // MOCK LOCAL:
    await new Promise((resolve) => setTimeout(resolve, 600));
    const newBudget: Budget = {
      id: `b_${Math.random().toString(36).substr(2, 9)}`,
      ...budgetData,
      userId: 'usr_1',
      spent: 0,
    };

    return {
      success: true,
      data: newBudget,
      message: 'Presupuesto configurado con éxito',
    };
  },
};

export default budgetsService;
