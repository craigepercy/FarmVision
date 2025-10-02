import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardStats {
  totalHectares: number;
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
    read?: boolean;
  }>;
  loading: boolean;
}

const initialState: DashboardState = {
  stats: {
    totalHectares: 506,
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
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
  },
});

export const { updateStats, addNotification, removeNotification, markNotificationAsRead } = dashboardSlice.actions;
export default dashboardSlice.reducer;
