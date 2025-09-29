import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Field {
  id: string;
  name: string;
  acres: number;
  crop: string;
  status: 'planted' | 'growing' | 'ready' | 'harvested';
  healthScore: number;
  lastUpdated: string;
}

interface CropState {
  fields: Field[];
  selectedField: Field | null;
  loading: boolean;
}

const initialState: CropState = {
  fields: [
    {
      id: '1',
      name: 'North Field A',
      acres: 125,
      crop: 'Corn',
      status: 'growing',
      healthScore: 85,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'South Field B',
      acres: 200,
      crop: 'Soybeans',
      status: 'ready',
      healthScore: 92,
      lastUpdated: new Date().toISOString(),
    },
  ],
  selectedField: null,
  loading: false,
};

const cropSlice = createSlice({
  name: 'crop',
  initialState,
  reducers: {
    setFields: (state, action: PayloadAction<Field[]>) => {
      state.fields = action.payload;
    },
    selectField: (state, action: PayloadAction<Field>) => {
      state.selectedField = action.payload;
    },
    updateField: (state, action: PayloadAction<Field>) => {
      const index = state.fields.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.fields[index] = action.payload;
      }
    },
  },
});

export const { setFields, selectField, updateField } = cropSlice.actions;
export default cropSlice.reducer;
