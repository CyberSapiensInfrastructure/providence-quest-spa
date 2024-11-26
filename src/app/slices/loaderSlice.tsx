import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
  name: "loader",
  initialState: {
    open: false,
  },
  reducers: {
    showLoader: (state) => {
      state.open = true;
    },
    hideLoader: (state) => {
      state.open = false;
    },
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions;

export default loaderSlice.reducer;
