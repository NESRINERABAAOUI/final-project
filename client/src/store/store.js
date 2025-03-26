import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage
import authReducer from "./authSlice"; // Import your auth slice

// Persist configuration
const persistConfig = {
  key: "auth", // Persist only 'auth' slice
  storage,
  whitelist: ["token", "refreshToken", "user"], // Only persist necessary fields
};

// Create a persisted reducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// Configure the store
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer, // Use the persisted reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"], // Ignore redux-persist warnings
      },
    }),
});

// Create a persistor
export const persistor = persistStore(store);
