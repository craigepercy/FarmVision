import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CattleLabel = 
  | 'Calf (M)' | 'Calf (F)'
  | 'Weaner (M)' | 'Weaner (F)'
  | 'Yearling (M)' | 'Yearling (F)'
  | 'Bull calf' | 'Steer' | 'Bull'
  | 'Heifer' | 'First-calf Heifer' | 'Cow'
  | 'Replacement Heifer' | 'Bred Heifer'
  | 'Open Cow/Heifer' | 'Pregnant/Bred Cow/Heifer'
  | 'Lactating Cow' | 'Dry Cow' | 'Cull Cow/Bull';

interface Cattle {
  id: string;
  tagNumber: string;
  breed: string;
  label: CattleLabel;
  age: number;
  weight: number;
  healthStatus: 'healthy' | 'sick' | 'treatment';
  campId: string;
  lastCheckup: string;
  selected?: boolean;
}

interface CattleCamp {
  id: string;
  name: string;
  location: { lat: number; lng: number; address: string };
  capacity: number;
  currentCount: number;
}

interface CattleState {
  cattle: Cattle[];
  camps: CattleCamp[];
  selectedCattle: Cattle[];
  selectedCamp: string | null;
  loading: boolean;
}

const initialState: CattleState = {
  cattle: [
    {
      id: '1',
      tagNumber: 'C001',
      breed: 'Angus',
      label: 'Cow',
      age: 24,
      weight: 650,
      healthStatus: 'healthy',
      campId: 'camp1',
      lastCheckup: new Date().toISOString(),
    },
    {
      id: '2',
      tagNumber: 'C002',
      breed: 'Hereford',
      label: 'Bull',
      age: 18,
      weight: 580,
      healthStatus: 'healthy',
      campId: 'camp1',
      lastCheckup: new Date().toISOString(),
    },
    {
      id: '3',
      tagNumber: 'C003',
      breed: 'Brahman',
      label: 'Heifer',
      age: 12,
      weight: 420,
      healthStatus: 'healthy',
      campId: 'camp2',
      lastCheckup: new Date().toISOString(),
    },
  ],
  camps: [
    {
      id: 'camp1',
      name: 'North Pasture',
      location: { lat: -25.7479, lng: 28.2293, address: 'Pretoria North, Gauteng' },
      capacity: 100,
      currentCount: 2,
    },
    {
      id: 'camp2',
      name: 'South Pasture',
      location: { lat: -25.7679, lng: 28.2493, address: 'Pretoria South, Gauteng' },
      capacity: 150,
      currentCount: 1,
    },
  ],
  selectedCattle: [],
  selectedCamp: null,
  loading: false,
};

const cattleSlice = createSlice({
  name: 'cattle',
  initialState,
  reducers: {
    setCattle: (state, action: PayloadAction<Cattle[]>) => {
      state.cattle = action.payload;
    },
    selectCattle: (state, action: PayloadAction<string>) => {
      const cattle = state.cattle.find(c => c.id === action.payload);
      if (cattle) {
        cattle.selected = !cattle.selected;
        if (cattle.selected) {
          state.selectedCattle.push(cattle);
        } else {
          state.selectedCattle = state.selectedCattle.filter(c => c.id !== cattle.id);
        }
      }
    },
    selectAllCattle: (state, action: PayloadAction<boolean>) => {
      state.cattle.forEach(cattle => {
        cattle.selected = action.payload;
      });
      state.selectedCattle = action.payload ? [...state.cattle] : [];
    },
    updateCattle: (state, action: PayloadAction<Cattle>) => {
      const index = state.cattle.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.cattle[index] = action.payload;
      }
    },
    addCattle: (state, action: PayloadAction<Cattle>) => {
      state.cattle.push(action.payload);
      const camp = state.camps.find(c => c.id === action.payload.campId);
      if (camp) {
        camp.currentCount += 1;
      }
    },
    moveCattle: (state, action: PayloadAction<{ cattleIds: string[]; targetCampId: string }>) => {
      const { cattleIds, targetCampId } = action.payload;
      
      cattleIds.forEach(cattleId => {
        const cattle = state.cattle.find(c => c.id === cattleId);
        if (cattle) {
          const oldCamp = state.camps.find(c => c.id === cattle.campId);
          const newCamp = state.camps.find(c => c.id === targetCampId);
          
          if (oldCamp && newCamp) {
            oldCamp.currentCount -= 1;
            newCamp.currentCount += 1;
            cattle.campId = targetCampId;
            cattle.selected = false;
          }
        }
      });
      
      state.selectedCattle = [];
    },
    addCamp: (state, action: PayloadAction<CattleCamp>) => {
      state.camps.push(action.payload);
    },
    updateCamp: (state, action: PayloadAction<CattleCamp>) => {
      const index = state.camps.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.camps[index] = action.payload;
      }
    },
    deleteCamp: (state, action: PayloadAction<string>) => {
      const camp = state.camps.find(c => c.id === action.payload);
      if (camp && camp.currentCount === 0) {
        state.camps = state.camps.filter(c => c.id !== action.payload);
      }
    },
    setSelectedCamp: (state, action: PayloadAction<string | null>) => {
      state.selectedCamp = action.payload;
    },
  },
});

export const { 
  setCattle, 
  selectCattle, 
  selectAllCattle,
  updateCattle, 
  addCattle,
  moveCattle,
  addCamp,
  updateCamp,
  deleteCamp,
  setSelectedCamp
} = cattleSlice.actions;
export default cattleSlice.reducer;
