import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  assignedTasks: number;
  assignedFarms?: string[];
  employeeNumber?: string;
  dateOfBirth?: string;
  idNumber?: string;
  certifications?: string[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdDate: string;
  requiresProof: boolean;
  farm?: string;
  category?: 'general' | 'crops' | 'cattle' | 'maintenance';
  completionProof?: {
    filename: string;
    uploadDate: string;
  } | null;
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
      createdDate: new Date().toISOString(),
      requiresProof: true,
      completionProof: null,
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
    addStaff: (state, action: PayloadAction<Staff>) => {
      state.staff.push(action.payload);
    },
    updateStaff: (state, action: PayloadAction<Staff>) => {
      const index = state.staff.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.staff[index] = action.payload;
      }
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
      const staff = state.staff.find(s => s.id === action.payload.assignedTo);
      if (staff) {
        staff.assignedTasks += 1;
      }
    },
    completeTask: (state, action: PayloadAction<{ taskId: string; proof: any }>) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        task.status = 'completed';
        task.completionProof = action.payload.proof;
        const staff = state.staff.find(s => s.id === task.assignedTo);
        if (staff) {
          staff.assignedTasks = Math.max(0, staff.assignedTasks - 1);
        }
      }
    },
  },
});

export const { setStaff, setTasks, selectStaff, addStaff, updateStaff, addTask, completeTask } = staffSlice.actions;
export default staffSlice.reducer;
