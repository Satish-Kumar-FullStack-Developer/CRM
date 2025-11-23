import { createSlice } from '@reduxjs/toolkit';

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
    setPipeline: (state, action) => {
      state.pipeline = action.payload;
    },
    selectDeal: (state, action) => {
      state.selectedDeal = action.payload;
    },
    addDeal: (state, action) => {
      state.deals.unshift(action.payload);
    },
    updateDealInList: (state, action) => {
      const index = state.deals.findIndex((d) => d._id === action.payload._id);
      if (index !== -1) {
        state.deals[index] = action.payload;
      }
    },
    removeDeal: (state, action) => {
      state.deals = state.deals.filter((d) => d._id !== action.payload);
    },
  },
});

export const {
  fetchDealsStart,
  fetchDealsSuccess,
  fetchDealsFailure,
  setPipeline,
  selectDeal,
  addDeal,
  updateDealInList,
  removeDeal,
} = dealSlice.actions;
export default dealSlice.reducer;
