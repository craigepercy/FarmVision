import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { supabaseAuth } from '../../services/supabaseAuth';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'manager' | 'staff';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  supabaseUser: any;
  supabaseSession: any;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('authToken'),
  isAuthenticated: false,
  loading: false,
  supabaseUser: null,
  supabaseSession: null,
};

export const supabaseSignIn = createAsyncThunk(
  'auth/supabaseSignIn',
  async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await supabaseAuth.signIn(email, password);
    if (error) throw error;
    return data;
  }
);

export const supabaseSignUp = createAsyncThunk(
  'auth/supabaseSignUp',
  async ({ email, password, userData }: { email: string; password: string; userData: any }) => {
    const { data, error } = await supabaseAuth.signUp(email, password, userData);
    if (error) throw error;
    return data;
  }
);

export const supabaseSignOut = createAsyncThunk(
  'auth/supabaseSignOut',
  async () => {
    const { error } = await supabaseAuth.signOut();
    if (error) throw error;
  }
);

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async () => {
    const session = await supabaseAuth.getSession();
    const user = await supabaseAuth.getCurrentUser();
    return { session, user };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      localStorage.setItem('authToken', action.payload.token);
    },
    loginFailure: (state) => {
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.supabaseUser = null;
      state.supabaseSession = null;
      localStorage.removeItem('authToken');
    },
    setSupabaseAuth: (state, action: PayloadAction<{ user: any; session: any }>) => {
      state.supabaseUser = action.payload.user;
      state.supabaseSession = action.payload.session;
      state.isAuthenticated = !!action.payload.user;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(supabaseSignIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(supabaseSignIn.fulfilled, (state, action) => {
        state.loading = false;
        state.supabaseUser = action.payload.user;
        state.supabaseSession = action.payload.session;
        state.isAuthenticated = true;
      })
      .addCase(supabaseSignIn.rejected, (state) => {
        state.loading = false;
      })
      .addCase(supabaseSignUp.pending, (state) => {
        state.loading = true;
      })
      .addCase(supabaseSignUp.fulfilled, (state, action) => {
        state.loading = false;
        state.supabaseUser = action.payload.user;
        state.supabaseSession = action.payload.session;
      })
      .addCase(supabaseSignUp.rejected, (state) => {
        state.loading = false;
      })
      .addCase(supabaseSignOut.fulfilled, (state) => {
        state.supabaseUser = null;
        state.supabaseSession = null;
        state.isAuthenticated = false;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.supabaseUser = action.payload.user;
        state.supabaseSession = action.payload.session;
        state.isAuthenticated = !!action.payload.user;
      });
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, setSupabaseAuth } = authSlice.actions;
export default authSlice.reducer;
