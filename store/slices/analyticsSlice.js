import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/api';

export const fetchAnalytics = createAsyncThunk(
  'analytics/fetchAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/analytics/dashboard');
      return res?.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch analytics');
    }
  }
);

const initialState = {
  data: {
    kpi: {
      totalDoctors: 0,
      totalPatients: 0,
      activePatients: 0,
      avgPatientsPerDoctor: 0,
    },
    patientsPerDoctor: [],
    dateBasedStats: [],
    conditionStats: [],
    specializationStats: [],
    recentPatients: [],
  },
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload || initialState.data;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch analytics';
      });
  },
});

export default analyticsSlice.reducer;
