// visibilitySlice.js
import { createSlice } from '@reduxjs/toolkit';

const visibilitySlice = createSlice({
  name: 'visibility',
  initialState: {
    isHistoryVisible: false,
  },
  reducers: {
    toggleHistoryVisibility: (state) => {
      state.isHistoryVisible = !state.isHistoryVisible;
    },
  },
});

export const { toggleHistoryVisibility } = visibilitySlice.actions;

export default visibilitySlice.reducer;
