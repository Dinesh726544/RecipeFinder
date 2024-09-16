import { configureStore } from '@reduxjs/toolkit'

import authSlice from "../features/auth/authSlice.js"
import visibilitySlice from '../features/visibility/visibilitySlice.js';
import HistoryResultSlice from '../features/historyResult/HistoryResultSlice.js';

const store = configureStore({
  reducer: {
    auth : authSlice,
    visibility : visibilitySlice,
    HistoryResult : HistoryResultSlice
  },
})

export default store;