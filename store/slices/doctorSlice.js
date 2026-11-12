import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/api';

export const fetchDoctors = createAsyncThunk(
  'doctors/fetchDoctors',
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (params.page) query.append('page', params.page);
      if (params.limit) query.append('limit', params.limit);
      if (params.search) query.append('search', params.search);
      if (params.specialization) query.append('specialization', params.specialization);
      if (params.startDate) query.append('startDate', params.startDate);
      if (params.endDate) query.append('endDate', params.endDate);
      if (params.sortBy) query.append('sortBy', params.sortBy);
      if (params.sortOrder) query.append('sortOrder', params.sortOrder);

      const res = await api.get(`/doctors?${query.toString()}`);
      return res;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch doctors');
    }
  }
);

export const createDoctor = createAsyncThunk(
  'doctors/createDoctor',
  async (doctorData, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.post('/doctors', doctorData);
      dispatch(fetchDoctors());
      return res;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create doctor');
    }
  }
);

export const updateDoctor = createAsyncThunk(
  'doctors/updateDoctor',
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.put(`/doctors/${id}`, data);
      dispatch(fetchDoctors());
      return res;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update doctor');
    }
  }
);

export const deleteDoctor = createAsyncThunk(
  'doctors/deleteDoctor',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.delete(`/doctors/${id}`);
      dispatch(fetchDoctors());
      return res;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete doctor');
    }
  }
);

const initialState = {
  items: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  },
  filters: {
    search: '',
    specialization: '',
    startDate: '',
    endDate: '',
  },
  loading: false,
  error: null,
};

const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    setDoctorFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetDoctorFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.data || [];
        state.pagination = action.payload?.pagination || state.pagination;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch doctors';
      });
  },
});

export const { setDoctorFilters, resetDoctorFilters } = doctorSlice.actions;
export default doctorSlice.reducer;
