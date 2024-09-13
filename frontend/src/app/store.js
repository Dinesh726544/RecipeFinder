import { configureStore } from '@reduxjs/toolkit'

import authSlice from "../features/auth/authSlice.js"
import visibilitySlice from '../features/visibility/visibilitySlice.js';

const store = configureStore({
  reducer: {
    auth : authSlice,
    visibility : visibilitySlice
  },
})

export default store;