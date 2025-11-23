import { createSlice } from '@reduxjs/toolkit';
import taskService from '../services/taskService';

const initialState = {
  tasks: [],
  selectedTask: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    fetchTasksStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchTasksSuccess: (state, action) => {
      state.isLoading = false;
      state.tasks = action.payload.tasks;
      state.pagination = action.payload.pagination;
    },
    fetchTasksFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    selectTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    addTaskLocal: (state, action) => {
      state.tasks.unshift(action.payload);
    },
    updateTaskInList: (state, action) => {
      const index = state.tasks.findIndex((t) => t._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    removeTaskLocal: (state, action) => {
      state.tasks = state.tasks.filter((t) => t._id !== action.payload);
    },
  },
});

// Async Thunk Actions
export const fetchTasks = (params = {}) => async (dispatch) => {
  dispatch(taskSlice.actions.fetchTasksStart());
  try {
    const response = await taskService.getTasks(params);
    dispatch(taskSlice.actions.fetchTasksSuccess(response.data));
  } catch (error) {
    dispatch(taskSlice.actions.fetchTasksFailure(error.response?.data?.message || 'Failed to fetch tasks'));
  }
};

export const createTask = (taskData) => async (dispatch) => {
  dispatch(taskSlice.actions.fetchTasksStart());
  try {
    const response = await taskService.createTask(taskData);
    dispatch(taskSlice.actions.addTaskLocal(response.data.data));
    return response.data.data;
  } catch (error) {
    dispatch(taskSlice.actions.fetchTasksFailure(error.response?.data?.message || 'Failed to create task'));
    throw error;
  }
};

export const updateTask = (id, taskData) => async (dispatch) => {
  dispatch(taskSlice.actions.fetchTasksStart());
  try {
    const response = await taskService.updateTask(id, taskData);
    dispatch(taskSlice.actions.updateTaskInList(response.data.data));
    return response.data.data;
  } catch (error) {
    dispatch(taskSlice.actions.fetchTasksFailure(error.response?.data?.message || 'Failed to update task'));
    throw error;
  }
};

export const completeTask = (id) => async (dispatch) => {
  dispatch(taskSlice.actions.fetchTasksStart());
  try {
    const response = await taskService.completeTask(id);
    dispatch(taskSlice.actions.updateTaskInList(response.data.data));
    return response.data.data;
  } catch (error) {
    dispatch(taskSlice.actions.fetchTasksFailure(error.response?.data?.message || 'Failed to complete task'));
    throw error;
  }
};

export const deleteTask = (id) => async (dispatch) => {
  dispatch(taskSlice.actions.fetchTasksStart());
  try {
    await taskService.deleteTask(id);
    dispatch(taskSlice.actions.removeTaskLocal(id));
  } catch (error) {
    dispatch(taskSlice.actions.fetchTasksFailure(error.response?.data?.message || 'Failed to delete task'));
    throw error;
  }
};

export const {
  fetchTasksStart,
  fetchTasksSuccess,
  fetchTasksFailure,
  selectTask,
  addTaskLocal,
  updateTaskInList,
  removeTaskLocal,
} = taskSlice.actions;
export default taskSlice.reducer;
