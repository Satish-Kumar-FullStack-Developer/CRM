import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import leadReducer from './leadSlice';
import dealReducer from './dealSlice';
import taskReducer from './taskSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadReducer,
    deals: dealReducer,
    tasks: taskReducer,
  },
});

export default store;
