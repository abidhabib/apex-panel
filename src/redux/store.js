import settingsReducer from './reducers/settingsSlice';
import { configureStore, combineReducers } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
    settings: settingsReducer,
    // Add more reducers here if needed
  });
const store = configureStore({
    reducer: rootReducer,
});

export default store;