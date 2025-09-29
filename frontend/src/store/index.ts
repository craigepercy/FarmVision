import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import dashboardSlice from './slices/dashboardSlice';
import cropSlice from './slices/cropSlice';
import cattleSlice from './slices/cattleSlice';
import staffSlice from './slices/staffSlice';
import financeSlice from './slices/financeSlice';
import machinerySlice from './slices/machinerySlice';
import analyticsSlice from './slices/analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    dashboard: dashboardSlice,
    crop: cropSlice,
    cattle: cattleSlice,
    staff: staffSlice,
    finance: financeSlice,
    machinery: machinerySlice,
    analytics: analyticsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
