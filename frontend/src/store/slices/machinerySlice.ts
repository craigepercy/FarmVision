import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: 'In-Use' | 'Available' | 'Unavailable';
  assignedTo: string | null;
  location: { lat: number; lng: number; name: string };
  lastMaintenance: string;
  nextMaintenance: string;
  hoursUsed: number;
  aiRecommendation?: string;
}

interface MachineryState {
  equipment: Equipment[];
  selectedEquipment: Equipment | null;
  loading: boolean;
}

const initialState: MachineryState = {
  equipment: [
    {
      id: '1',
      name: 'John Deere 8320R',
      type: 'Tractor',
      status: 'Available',
      assignedTo: null,
      location: { lat: -25.7479, lng: 28.2293, name: 'North Field A' },
      lastMaintenance: new Date().toISOString(),
      nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      hoursUsed: 1250,
      aiRecommendation: 'Deploy to South Field B for optimal harvest timing based on crop maturity analysis',
    },
    {
      id: '2',
      name: 'Case IH Combine',
      type: 'Harvester',
      status: 'In-Use',
      assignedTo: '1',
      location: { lat: -25.7679, lng: 28.2493, name: 'South Field B' },
      lastMaintenance: new Date().toISOString(),
      nextMaintenance: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      hoursUsed: 850,
      aiRecommendation: 'Continue current operation. Schedule maintenance after completing South Field B harvest',
    },
  ],
  selectedEquipment: null,
  loading: false,
};

const machinerySlice = createSlice({
  name: 'machinery',
  initialState,
  reducers: {
    setEquipment: (state, action: PayloadAction<Equipment[]>) => {
      state.equipment = action.payload;
    },
    selectEquipment: (state, action: PayloadAction<Equipment>) => {
      state.selectedEquipment = action.payload;
    },
    updateEquipment: (state, action: PayloadAction<Equipment>) => {
      const index = state.equipment.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.equipment[index] = action.payload;
      }
    },
    updateEquipmentStatus: (state, action: PayloadAction<{ id: string; status: 'In-Use' | 'Available' | 'Unavailable' }>) => {
      const index = state.equipment.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.equipment[index].status = action.payload.status;
      }
    },
    updateEquipmentLocation: (state, action: PayloadAction<{ id: string; location: { lat: number; lng: number; name: string } }>) => {
      const index = state.equipment.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.equipment[index].location = action.payload.location;
      }
    },
  },
});

export const { setEquipment, selectEquipment, updateEquipment, updateEquipmentStatus, updateEquipmentLocation } = machinerySlice.actions;
export default machinerySlice.reducer;
