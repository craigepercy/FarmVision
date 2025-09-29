import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

interface FinanceState {
  transactions: Transaction[];
  monthlyRevenue: number;
  monthlyExpenses: number;
  vatAmount: number;
  loading: boolean;
}

const initialState: FinanceState = {
  transactions: [
    {
      id: '1',
      date: new Date().toISOString(),
      description: 'Cattle Sale - Lot #123',
      amount: 15000,
      type: 'income',
      category: 'Livestock',
    },
    {
      id: '2',
      date: new Date().toISOString(),
      description: 'Feed Purchase',
      amount: 3500,
      type: 'expense',
      category: 'Feed',
    },
  ],
  monthlyRevenue: 125000,
  monthlyExpenses: 85000,
  vatAmount: 8500,
  loading: false,
};

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
    },
    updateFinancials: (state, action: PayloadAction<{ revenue: number; expenses: number; vat: number }>) => {
      state.monthlyRevenue = action.payload.revenue;
      state.monthlyExpenses = action.payload.expenses;
      state.vatAmount = action.payload.vat;
    },
  },
});

export const { setTransactions, addTransaction, updateFinancials } = financeSlice.actions;
export default financeSlice.reducer;
