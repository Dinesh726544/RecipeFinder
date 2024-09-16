// HistoryResultSlice.js
import { createSlice } from '@reduxjs/toolkit';

const HistoryResultSlice = createSlice({
  name: 'HistoryResult',
  initialState: {
    HistoryResult: null,
  },
  reducers: {
    getHistoryResult: (state) => {
      state.HistoryResult = action.payload;
    },
  },
});

export const { getHistoryResult } = HistoryResultSlice.actions;

export default HistoryResultSlice.reducer;
