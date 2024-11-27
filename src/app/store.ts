import { configureStore } from '@reduxjs/toolkit';
import providerReducer from './slices/walletProvider';
import notificationReducer from './slices/notificationSlice';
import loaderReducer from './slices/loaderSlice';
import twitterReducer from './slices/twitterSlice';

export const store = configureStore({
  reducer: {
    provider: providerReducer,
    notification: notificationReducer,
    loader: loaderReducer,
    twitter: twitterReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Web3Provider gibi non-serializable değerler için
        ignoredActions: ['vesting/setProvider', 'vesting/setSigner'],
        ignoredPaths: ['provider.provider']
      }
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 