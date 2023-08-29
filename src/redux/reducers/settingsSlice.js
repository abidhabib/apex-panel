// settingsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    fees: 0,
    coinPrice: 0,
    title: '',
    selectedImage: null, // Add selectedImage property
    // ... other state properties
  },
  reducers: {
    updateSettings: (state, action) => {
      state.fees = action.payload.fees;
      state.coinPrice = action.payload.coinPrice;
      state.title = action.payload.title;
      // ... update other state properties
    },
    updateSelectedImage: (state, action) => {
      state.selectedImage = action.payload;
    },
    // ... other reducer actions
  },
});

export const { updateSettings, updateSelectedImage } = settingsSlice.actions;
export default settingsSlice.reducer;