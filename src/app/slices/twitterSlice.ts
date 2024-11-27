import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { twitterService } from '../../services/twitterService';

interface TwitterState {
  hasLikedTargetTweet: boolean;
  loading: boolean;
  error: string | null;
  accessToken: string | null;
}

const initialState: TwitterState = {
  hasLikedTargetTweet: false,
  loading: false,
  error: null,
  accessToken: null
};

export const startTwitterAuth = createAsyncThunk(
  'twitter/startAuth',
  async () => {
    const authUrl = await twitterService.startAuth();
    window.open(authUrl, '_blank', 'width=600,height=600');
    return true;
  }
);

export const checkTwitterLike = createAsyncThunk(
  'twitter/checkLike',
  async ({ username, accessToken }: { username: string; accessToken: string }) => {
    const hasLiked = await twitterService.checkLike(username, accessToken);
    return hasLiked;
  }
);

const twitterSlice = createSlice({
  name: 'twitter',
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setLikeStatus: (state, action) => {
      state.hasLikedTargetTweet = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(startTwitterAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startTwitterAuth.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(startTwitterAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to start Twitter auth';
      })
      .addCase(checkTwitterLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkTwitterLike.fulfilled, (state, action) => {
        state.loading = false;
        state.hasLikedTargetTweet = action.payload;
      })
      .addCase(checkTwitterLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to check Twitter like';
      });
  }
});

export const { setAccessToken, setLikeStatus } = twitterSlice.actions;
export default twitterSlice.reducer; 