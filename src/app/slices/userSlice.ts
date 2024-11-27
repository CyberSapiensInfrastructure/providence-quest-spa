import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  walletAddress: string | null;
  completedQuests: string[];
  twitterUsername: string | null;
  telegramUsername: string | null;
  discordUsername: string | null;
}

const initialState: UserState = {
  walletAddress: null,
  completedQuests: [],
  twitterUsername: null,
  telegramUsername: null,
  discordUsername: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setWalletAddress: (state, action: PayloadAction<string>) => {
      state.walletAddress = action.payload;
    },
    completeQuest: (state, action: PayloadAction<string>) => {
      if (!state.completedQuests.includes(action.payload)) {
        state.completedQuests.push(action.payload);
      }
    },
    setTwitterUsername: (state, action: PayloadAction<string>) => {
      state.twitterUsername = action.payload;
    },
    // ... diğer reducer'lar
  }
});

export const { setWalletAddress, completeQuest, setTwitterUsername } = userSlice.actions;
export default userSlice.reducer; 