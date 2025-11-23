import { createSlice } from '@reduxjs/toolkit';
import leadService from '../services/leadService';

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
    addLeadLocal: (state, action) => {
      state.leads.unshift(action.payload);
    },
    updateLeadInList: (state, action) => {
      const index = state.leads.findIndex((l) => l._id === action.payload._id);
      if (index !== -1) {
        state.leads[index] = action.payload;
      }
    },
    removeLeadLocal: (state, action) => {
      state.leads = state.leads.filter((l) => l._id !== action.payload);
    },
  },
});

// Async Thunk Actions
export const fetchLeads = (params = {}) => async (dispatch) => {
  dispatch(leadSlice.actions.fetchLeadsStart());
  try {
    const response = await leadService.getLeads(params);
    dispatch(leadSlice.actions.fetchLeadsSuccess(response.data));
  } catch (error) {
    dispatch(leadSlice.actions.fetchLeadsFailure(error.response?.data?.message || 'Failed to fetch leads'));
  }
};

export const createLead = (leadData) => async (dispatch) => {
  dispatch(leadSlice.actions.fetchLeadsStart());
  try {
    const response = await leadService.createLead(leadData);
    dispatch(leadSlice.actions.addLeadLocal(response.data.data));
    return response.data.data;
  } catch (error) {
    dispatch(leadSlice.actions.fetchLeadsFailure(error.response?.data?.message || 'Failed to create lead'));
    throw error;
  }
};

export const updateLead = (id, leadData) => async (dispatch) => {
  dispatch(leadSlice.actions.fetchLeadsStart());
  try {
    const response = await leadService.updateLead(id, leadData);
    dispatch(leadSlice.actions.updateLeadInList(response.data.data));
    return response.data.data;
  } catch (error) {
    dispatch(leadSlice.actions.fetchLeadsFailure(error.response?.data?.message || 'Failed to update lead'));
    throw error;
  }
};

export const deleteLead = (id) => async (dispatch) => {
  dispatch(leadSlice.actions.fetchLeadsStart());
  try {
    await leadService.deleteLead(id);
    dispatch(leadSlice.actions.removeLeadLocal(id));
  } catch (error) {
    dispatch(leadSlice.actions.fetchLeadsFailure(error.response?.data?.message || 'Failed to delete lead'));
    throw error;
  }
};

export const {
  fetchLeadsStart,
  fetchLeadsSuccess,
  fetchLeadsFailure,
  selectLead,
  addLeadLocal,
  updateLeadInList,
  removeLeadLocal,
} = leadSlice.actions;
export default leadSlice.reducer;
