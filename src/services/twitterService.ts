import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

export const twitterService = {
  async startAuth(): Promise<string> {
    try {
      console.log('Starting Twitter auth...');
      const response = await axios.get(`${API_BASE}/twitter/auth`);
      console.log('Auth URL received:', response.data);
      return response.data.authUrl;
    } catch (error) {
      console.error('Error starting auth:', error);
      throw error;
    }
  },

  async checkLike(username: string, accessToken: string): Promise<boolean> {
    try {
      console.log('Checking like for:', username);
      const response = await axios.post(`${API_BASE}/check-twitter-like`, {
        username,
        accessToken
      });
      console.log('Like check response:', response.data);
      return response.data.hasLiked;
    } catch (error) {
      console.error('Error checking like:', error);
      throw error;
    }
  }
}; 