import apiClient from '../../../core/api/client';
import { ApiResponse, Transaction } from '../../../types';

/**
 * Servicio para consumir endpoints de transacciones (ingresos/gastos) del servidor externo.
 */
export const transactionsService = {
  /**
   * Obtiene la lista de transacciones del usuario logueado.
   */
  getTransactions: async (): Promise<ApiResponse<Transaction[]>> => {
    // LLAMADA REAL A LA API:
    // const response = await apiClient.get<ApiResponse<Transaction[]>>('/transactions');
    // return response.data;

    // MOCK LOCAL PARA DESARROLLO / PRUEBAS:
    await new Promise((resolve) => setTimeout(resolve, 800)); // Latencia
    const mockTransactions: Transaction[] = [
      {
        id: 't_1',
        userId: 'usr_1',
        amount: 2500.00,
        type: 'INCOME',
        category: 'Salario',
        description: 'Pago de nómina quincenal',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // hace 2 días
        createdAt: new Date().toISOString(),
      },
      {
        id: 't_2',
        userId: 'usr_1',
        amount: 85.50,
        type: 'EXPENSE',
        category: 'Alimentación',
        description: 'Compras en supermercado',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // hace 1 día
        createdAt: new Date().toISOString(),
      },
      {
        id: 't_3',
        userId: 'usr_1',
        amount: 15.00,
        type: 'EXPENSE',
        category: 'Entretenimiento',
        description: 'Suscripción mensual streaming',
        date: new Date().toISOString(), // hoy
        createdAt: new Date().toISOString(),
      },
      {
        id: 't_4',
        userId: 'usr_1',
        amount: 120.00,
        type: 'EXPENSE',
        category: 'Servicios',
        description: 'Recarga de internet móvil',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      },
    ];

    return {
      success: true,
      data: mockTransactions,
    };
  },

  /**
   * Registra una nueva transacción en el servidor.
   */
  createTransaction: async (transactionData: Omit<Transaction, 'id' | 'userId' | 'createdAt'>): Promise<ApiResponse<Transaction>> => {
    // LLAMADA REAL A LA API:
    // const response = await apiClient.post<ApiResponse<Transaction>>('/transactions', transactionData);
    // return response.data;

    // MOCK LOCAL:
    await new Promise((resolve) => setTimeout(resolve, 600));
    const newTransaction: Transaction = {
      id: `t_${Math.random().toString(36).substr(2, 9)}`,
      userId: 'usr_1',
      ...transactionData,
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: newTransaction,
      message: 'Transacción registrada con éxito',
    };
  },

  /**
   * Elimina una transacción en el servidor.
   */
  deleteTransaction: async (id: string): Promise<ApiResponse<{ id: string }>> => {
    // LLAMADA REAL A LA API:
    // const response = await apiClient.delete<ApiResponse<{ id: string }>>(`/transactions/${id}`);
    // return response.data;

    // MOCK LOCAL:
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      data: { id },
      message: 'Transacción eliminada con éxito',
    };
  },
};

export default transactionsService;
