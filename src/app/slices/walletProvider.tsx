import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";

interface VestingState {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  isConnected: boolean;
  address: string | null;
  progressData: {
    name: string;
    symbol: string;
  };
  results: any[];
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: VestingState = {
  provider: null,
  signer: null,
  isConnected: false,
  address: null,
  progressData: {
    name: "",
    symbol: "",
  },
  results: [],
  status: "idle",
  error: null,
};

const vestingSlice = createSlice({
  name: "vesting",
  initialState,
  reducers: {
    setProvider: (
      state,
      action: PayloadAction<ethers.providers.Web3Provider | null>
    ) => {
      state.provider = action.payload;
    },
    setSigner: (state, action: PayloadAction<ethers.Signer | null>) => {
      state.signer = action.payload;
    },
    resetProvider: (state) => {
      state.provider = null;
      state.signer = null;
    },
    setConnectionStatus: (
      state,
      action: PayloadAction<{ isConnected: boolean; address: string | null }>
    ) => {
      state.isConnected = action.payload.isConnected;
      state.address = action.payload.address;
    },
    setProgressData: (
      state,
      action: PayloadAction<{ name: string; symbol: string }>
    ) => {
      state.progressData = action.payload;
    },
  },
});

export const {
  setProvider,
  setSigner,
  setConnectionStatus,
  setProgressData,
  resetProvider,
} = vestingSlice.actions;

export default vestingSlice.reducer;
