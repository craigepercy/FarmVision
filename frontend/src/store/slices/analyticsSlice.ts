import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AnalyticsData {
  productionTrends: Array<{ month: string; value: number }>;
  profitability: Array<{ category: string; profit: number }>;
  weatherData: Array<{ date: string; temperature: number; rainfall: number }>;
}

interface AnalyticsState {
  data: AnalyticsData;
  selectedScenario: string | null;
  loading: boolean;
}

const initialState: AnalyticsState = {
  data: {
    productionTrends: [
      { month: 'Jan', value: 85000 },
      { month: 'Feb', value: 92000 },
      { month: 'Mar', value: 78000 },
      { month: 'Apr', value: 105000 },
      { month: 'May', value: 125000 },
      { month: 'Jun', value: 135000 },
    ],
    profitability: [
      { category: 'Livestock', profit: 45000 },
      { category: 'Crops', profit: 65000 },
      { category: 'Equipment', profit: -15000 },
    ],
    weatherData: [
      { date: '2024-01', temperature: 45, rainfall: 2.5 },
      { date: '2024-02', temperature: 52, rainfall: 3.1 },
      { date: '2024-03', temperature: 61, rainfall: 1.8 },
    ],
  },
  selectedScenario: null,
  loading: false,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setAnalyticsData: (state, action: PayloadAction<AnalyticsData>) => {
      state.data = action.payload;
    },
    selectScenario: (state, action: PayloadAction<string>) => {
      state.selectedScenario = action.payload;
    },
  },
});

export const { setAnalyticsData, selectScenario } = analyticsSlice.actions;
export default analyticsSlice.reducer;
