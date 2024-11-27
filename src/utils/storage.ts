const STORAGE_KEY = 'providence_user_data';

export const saveUserData = (walletAddress: string, data: any) => {
  const storage = localStorage.getItem(STORAGE_KEY);
  const users = storage ? JSON.parse(storage) : {};
  
  users[walletAddress] = {
    ...users[walletAddress],
    ...data,
    lastUpdated: new Date().toISOString()
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const getUserData = (walletAddress: string) => {
  const storage = localStorage.getItem(STORAGE_KEY);
  if (!storage) return null;
  
  const users = JSON.parse(storage);
  return users[walletAddress] || null;
}; 