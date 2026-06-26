import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import budgetsService from '../api/budgetsService';
import { Budget } from '../../../types';

/**
 * Hook para obtener los presupuestos configurados del usuario.
 */
export const useBudgets = () => {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const response = await budgetsService.getBudgets();
      if (!response.success) {
        throw new Error(response.message || 'Error al obtener presupuestos');
      }
      return response.data;
    },
  });
};

export const useSaveBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (budgetData: Omit<Budget, 'id' | 'userId' | 'spent'>) =>
      budgetsService.saveBudget(budgetData),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['budgets'] });
      }
    },
  });
};
