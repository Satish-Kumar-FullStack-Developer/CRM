import { createSlice } from '@reduxjs/toolkit';
import dealService from '../services/dealService';

const initialState = {
  deals: [],
  selectedDeal: null,
  isLoading: false,
  error: null,
  pipeline: {},
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
};

const dealSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    fetchDealsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchDealsSuccess: (state, action) => {
      state.isLoading = false;
      state.deals = action.payload.deals;
      state.pagination = action.payload.pagination;
    },
    fetchDealsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearLoading: (state) => {
      state.isLoading = false;
    },
    setPipeline: (state, action) => {
      state.pipeline = action.payload;
    },
    selectDeal: (state, action) => {
      state.selectedDeal = action.payload;
    },
    addDealLocal: (state, action) => {
      state.deals.unshift(action.payload);
    },
    updateDealInList: (state, action) => {
      const index = state.deals.findIndex((d) => d._id === action.payload._id);
      if (index !== -1) {
        state.deals[index] = action.payload;
      }
    },
    removeDealLocal: (state, action) => {
      state.deals = state.deals.filter((d) => d._id !== action.payload);
    },
  },
});

// Async Thunk Actions
export const fetchDeals = (params = {}) => async (dispatch) => {
  dispatch(dealSlice.actions.fetchDealsStart());
  try {
    const response = await dealService.getDeals(params);
    dispatch(dealSlice.actions.fetchDealsSuccess(response.data));
  } catch (error) {
    dispatch(dealSlice.actions.fetchDealsFailure(error.response?.data?.message || 'Failed to fetch deals'));
  }
};

export const fetchPipelineSummary = () => async (dispatch) => {
  try {
    const response = await dealService.getPipelineSummary();
    dispatch(dealSlice.actions.setPipeline(response.data.data));
  } catch (error) {
    console.error('Failed to fetch pipeline summary:', error);
  }
};

export const createDeal = (dealData) => async (dispatch) => {
  dispatch(dealSlice.actions.fetchDealsStart());
  try {
    const response = await dealService.createDeal(dealData);
    dispatch(dealSlice.actions.addDealLocal(response.data.data));
    dispatch(dealSlice.actions.clearLoading());
    return response.data.data;
  } catch (error) {
    dispatch(dealSlice.actions.fetchDealsFailure(error.response?.data?.message || 'Failed to create deal'));
    throw error;
  }
};

export const updateDeal = (id, dealData) => async (dispatch) => {
  dispatch(dealSlice.actions.fetchDealsStart());
  try {
    const response = await dealService.updateDeal(id, dealData);
    dispatch(dealSlice.actions.updateDealInList(response.data.data));
    dispatch(dealSlice.actions.clearLoading());
    return response.data.data;
  } catch (error) {
    dispatch(dealSlice.actions.fetchDealsFailure(error.response?.data?.message || 'Failed to update deal'));
    throw error;
  }
};

export const deleteDeal = (id) => async (dispatch) => {
  dispatch(dealSlice.actions.fetchDealsStart());
  try {
    await dealService.deleteDeal(id);
    dispatch(dealSlice.actions.removeDealLocal(id));
    dispatch(dealSlice.actions.clearLoading());
  } catch (error) {
    dispatch(dealSlice.actions.fetchDealsFailure(error.response?.data?.message || 'Failed to delete deal'));
    throw error;
  }
};

export const {
  fetchDealsStart,
  fetchDealsSuccess,
  fetchDealsFailure,
  clearLoading,
  setPipeline,
  selectDeal,
  addDealLocal,
  updateDealInList,
  removeDealLocal,
} = dealSlice.actions;
export default dealSlice.reducer;
