import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Cattle {
  id: string;
  rfidTag: string;
  breed: string;
  age: number;
  weight: number;
  healthStatus: 'healthy' | 'sick' | 'treatment';
  location: string;
  lastCheckup: string;
}

interface CattleState {
  herd: Cattle[];
  selectedCattle: Cattle | null;
  totalCount: number;
  loading: boolean;
}

const initialState: CattleState = {
  herd: [
    {
      id: '1',
      rfidTag: 'RF001234',
      breed: 'Angus',
      age: 3,
      weight: 1200,
      healthStatus: 'healthy',
      location: 'Pasture A',
      lastCheckup: new Date().toISOString(),
    },
    {
      id: '2',
      rfidTag: 'RF001235',
      breed: 'Holstein',
      age: 2,
      weight: 1100,
      healthStatus: 'treatment',
      location: 'Barn 1',
      lastCheckup: new Date().toISOString(),
    },
  ],
  selectedCattle: null,
  totalCount: 485,
  loading: false,
};

const cattleSlice = createSlice({
  name: 'cattle',
  initialState,
  reducers: {
    setHerd: (state, action: PayloadAction<Cattle[]>) => {
      state.herd = action.payload;
    },
    selectCattle: (state, action: PayloadAction<Cattle>) => {
      state.selectedCattle = action.payload;
    },
    updateCattle: (state, action: PayloadAction<Cattle>) => {
      const index = state.herd.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.herd[index] = action.payload;
      }
    },
  },
});

export const { setHerd, selectCattle, updateCattle } = cattleSlice.actions;
export default cattleSlice.reducer;
