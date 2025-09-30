import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  farm?: string;
  status?: string;
}

interface FinanceState {
  transactions: Transaction[];
  monthlyRevenue: number;
  monthlyExpenses: number;
  vatAmount: number;
  mtdRevenue: number;
  mtdExpenses: number;
  ytdRevenue: number;
  ytdExpenses: number;
  aiRecommendations: string[];
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
  mtdRevenue: 45000,
  mtdExpenses: 32000,
  ytdRevenue: 1250000,
  ytdExpenses: 850000,
  aiRecommendations: [
    'Consider selling excess grain inventory before month-end to optimize VAT position',
    'Schedule equipment purchases in Q4 to maximize VAT input credits',
    'Current VAT liability can be reduced by R12,500 through strategic timing of sales'
  ],
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
    updateMTDYTD: (state, action: PayloadAction<{ mtdRevenue: number; mtdExpenses: number; ytdRevenue: number; ytdExpenses: number }>) => {
      state.mtdRevenue = action.payload.mtdRevenue;
      state.mtdExpenses = action.payload.mtdExpenses;
      state.ytdRevenue = action.payload.ytdRevenue;
      state.ytdExpenses = action.payload.ytdExpenses;
    },
    updateAIRecommendations: (state, action: PayloadAction<string[]>) => {
      state.aiRecommendations = action.payload;
    },
  },
});

export const { setTransactions, addTransaction, updateFinancials, updateMTDYTD, updateAIRecommendations } = financeSlice.actions;
export default financeSlice.reducer;
