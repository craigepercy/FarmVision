import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardStats {
  totalAcres: number;
  totalLivestock: number;
  monthlyRevenue: number;
  activeAlerts: number;
}

interface DashboardState {
  stats: DashboardStats;
  notifications: Array<{
    id: string;
    message: string;
    type: 'info' | 'warning' | 'error';
    timestamp: string;
  }>;
  loading: boolean;
}

const initialState: DashboardState = {
  stats: {
    totalAcres: 1250,
    totalLivestock: 485,
    monthlyRevenue: 125000,
    activeAlerts: 3,
  },
  notifications: [
    {
      id: '1',
      message: 'Cattle vaccination due in Field A',
      type: 'warning',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      message: 'Harvest completed for Corn Field B',
      type: 'info',
      timestamp: new Date().toISOString(),
    },
  ],
  loading: false,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateStats: (state, action: PayloadAction<Partial<DashboardStats>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
  },
});

export const { updateStats, addNotification, removeNotification } = dashboardSlice.actions;
export default dashboardSlice.reducer;
