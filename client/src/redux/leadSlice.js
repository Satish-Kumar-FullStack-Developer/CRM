import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  leads: [],
  selectedLead: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
};

const leadSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    fetchLeadsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchLeadsSuccess: (state, action) => {
      state.isLoading = false;
      state.leads = action.payload.leads;
      state.pagination = action.payload.pagination;
    },
    fetchLeadsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    selectLead: (state, action) => {
      state.selectedLead = action.payload;
    },
    addLead: (state, action) => {
      state.leads.unshift(action.payload);
    },
    updateLeadInList: (state, action) => {
      const index = state.leads.findIndex((l) => l._id === action.payload._id);
      if (index !== -1) {
        state.leads[index] = action.payload;
      }
    },
    removeLead: (state, action) => {
      state.leads = state.leads.filter((l) => l._id !== action.payload);
    },
  },
});

export const {
  fetchLeadsStart,
  fetchLeadsSuccess,
  fetchLeadsFailure,
  selectLead,
  addLead,
  updateLeadInList,
  removeLead,
} = leadSlice.actions;
export default leadSlice.reducer;
