import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/api';

export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (params.page) query.append('page', params.page);
      if (params.limit) query.append('limit', params.limit);
      if (params.search) query.append('search', params.search);
      if (params.condition) query.append('condition', params.condition);
      if (params.doctorId) query.append('doctorId', params.doctorId);
      if (params.status) query.append('status', params.status);
      if (params.startDate) query.append('startDate', params.startDate);
      if (params.endDate) query.append('endDate', params.endDate);
      if (params.sortBy) query.append('sortBy', params.sortBy);
      if (params.sortOrder) query.append('sortOrder', params.sortOrder);

      const res = await api.get(`/patients?${query.toString()}`);
      return res;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch patients');
    }
  }
);

export const createPatient = createAsyncThunk(
  'patients/createPatient',
  async (patientData, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.post('/patients', patientData);
      dispatch(fetchPatients());
      return res;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create patient');
    }
  }
);

export const updatePatient = createAsyncThunk(
  'patients/updatePatient',
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.put(`/patients/${id}`, data);
      dispatch(fetchPatients());
      return res;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update patient');
    }
  }
);

export const deletePatient = createAsyncThunk(
  'patients/deletePatient',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.delete(`/patients/${id}`);
      dispatch(fetchPatients());
      return res;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete patient');
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
    condition: '',
    doctorId: '',
    status: '',
    startDate: '',
    endDate: '',
  },
  loading: false,
  error: null,
};

const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setPatientFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetPatientFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.data || [];
        state.pagination = action.payload?.pagination || state.pagination;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch patients';
      });
  },
});

export const { setPatientFilters, resetPatientFilters } = patientSlice.actions;
export default patientSlice.reducer;
