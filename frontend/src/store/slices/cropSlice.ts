import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Field {
  id: string;
  name: string;
  location: { lat: number; lng: number; address: string };
  hectares: number;
  plantedHectares: number;
  crop: string;
  varietal: string;
  status: 'planted' | 'growing' | 'ready' | 'harvested';
  healthScore: number;
  soilHealth: { ph: number; nitrogen: number; phosphorus: number; potassium: number };
  cropInputs: { fertilizer: string; pesticides: string; irrigation: number };
  historicYields: Array<{ year: number; yield: number; grade: string }>;
  lastUpdated: string;
  photos?: Array<{
    id: string;
    fieldId: string;
    filename: string;
    url: string;
    thumbnail: string;
    uploadDate: string;
    analysis: {
      cropHealth: number;
      pestDetection: string;
      waterStress: string;
      growthHeight: string;
      recommendations: string[];
    };
  }>;
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
      location: { lat: -25.7479, lng: 28.2293, address: 'Pretoria North, Gauteng' },
      hectares: 50.6,
      plantedHectares: 48.2,
      crop: 'Corn',
      varietal: 'Yellow Dent',
      status: 'growing',
      healthScore: 85,
      soilHealth: { ph: 6.8, nitrogen: 45, phosphorus: 32, potassium: 28 },
      cropInputs: { fertilizer: 'NPK 15-15-15', pesticides: 'Atrazine', irrigation: 450 },
      historicYields: [
        { year: 2023, yield: 8.2, grade: 'A' },
        { year: 2022, yield: 7.8, grade: 'A' },
        { year: 2021, yield: 7.5, grade: 'B+' }
      ],
      lastUpdated: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'South Field B',
      location: { lat: -25.7679, lng: 28.2493, address: 'Pretoria South, Gauteng' },
      hectares: 81.0,
      plantedHectares: 78.5,
      crop: 'Soybeans',
      varietal: 'Roundup Ready',
      status: 'ready',
      healthScore: 92,
      soilHealth: { ph: 7.2, nitrogen: 38, phosphorus: 28, potassium: 35 },
      cropInputs: { fertilizer: 'DAP 18-46-0', pesticides: 'Glyphosate', irrigation: 380 },
      historicYields: [
        { year: 2023, yield: 3.2, grade: 'A+' },
        { year: 2022, yield: 2.9, grade: 'A' },
        { year: 2021, yield: 3.1, grade: 'A' }
      ],
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
    addField: (state, action: PayloadAction<Field>) => {
      state.fields.push(action.payload);
    },
    deleteField: (state, action: PayloadAction<string>) => {
      state.fields = state.fields.filter(f => f.id !== action.payload);
    },
  },
});

export const { setFields, selectField, updateField, addField, deleteField } = cropSlice.actions;
export default cropSlice.reducer;
