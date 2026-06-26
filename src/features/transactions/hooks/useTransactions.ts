import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import transactionsService from '../api/transactionsService';
import { Transaction } from '../../../types';

/**
 * Hook para consultar el listado de transacciones con soporte de caché de React Query.
 */
export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await transactionsService.getTransactions();
      if (!response.success) {
        throw new Error(response.message || 'Error al obtener transacciones');
      }
      return response.data;
    },
  });
};

/**
 * Hook para crear una transacción con invalidación de caché automática.
 */
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTx: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) =>
      transactionsService.createTransaction(newTx),
    onSuccess: (response) => {
      if (response.success) {
        // Invalidar caché para forzar recarga en segundo plano
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        queryClient.invalidateQueries({ queryKey: ['analytics-summary'] });
        queryClient.invalidateQueries({ queryKey: ['analytics-categories'] });
      }
    },
  });
};

/**
 * Hook para eliminar una transacción.
 */
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionsService.deleteTransaction(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        queryClient.invalidateQueries({ queryKey: ['analytics-summary'] });
        queryClient.invalidateQueries({ queryKey: ['analytics-categories'] });
      }
    },
  });
};
