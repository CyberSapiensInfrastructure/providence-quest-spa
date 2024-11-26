import { configureStore } from "@reduxjs/toolkit";
import walletProvider from "./slices/walletProvider";
import notificationSlice from "./slices/notificationSlice";
import loaderSlice from "./slices/loaderSlice";

export const store = configureStore({
  reducer: {
    provider: walletProvider,
    notification: notificationSlice,
    loader: loaderSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
