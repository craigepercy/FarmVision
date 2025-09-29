import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: 'available' | 'in-use' | 'maintenance';
  assignedTo: string | null;
  lastMaintenance: string;
  nextMaintenance: string;
  hoursUsed: number;
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
      status: 'available',
      assignedTo: null,
      lastMaintenance: new Date().toISOString(),
      nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      hoursUsed: 1250,
    },
    {
      id: '2',
      name: 'Case IH Combine',
      type: 'Harvester',
      status: 'in-use',
      assignedTo: '1',
      lastMaintenance: new Date().toISOString(),
      nextMaintenance: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      hoursUsed: 850,
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
  },
});

export const { setEquipment, selectEquipment, updateEquipment } = machinerySlice.actions;
export default machinerySlice.reducer;
