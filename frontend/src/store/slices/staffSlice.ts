import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  assignedTasks: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

interface StaffState {
  staff: Staff[];
  tasks: Task[];
  selectedStaff: Staff | null;
  loading: boolean;
}

const initialState: StaffState = {
  staff: [
    {
      id: '1',
      name: 'John Smith',
      role: 'Farm Manager',
      email: 'john@farmvision.com',
      phone: '555-0123',
      status: 'active',
      assignedTasks: 5,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'Livestock Specialist',
      email: 'sarah@farmvision.com',
      phone: '555-0124',
      status: 'active',
      assignedTasks: 3,
    },
  ],
  tasks: [
    {
      id: '1',
      title: 'Cattle Health Check',
      description: 'Weekly health inspection of cattle in Pasture A',
      assignedTo: '2',
      status: 'pending',
      priority: 'high',
      dueDate: new Date().toISOString(),
    },
  ],
  selectedStaff: null,
  loading: false,
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setStaff: (state, action: PayloadAction<Staff[]>) => {
      state.staff = action.payload;
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    selectStaff: (state, action: PayloadAction<Staff>) => {
      state.selectedStaff = action.payload;
    },
  },
});

export const { setStaff, setTasks, selectStaff } = staffSlice.actions;
export default staffSlice.reducer;
