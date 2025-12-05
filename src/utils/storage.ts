// Secure localStorage utilities with validation

export const secureStorage = {
  set: (key: string, value: any) => {
    try {
      if (typeof key !== 'string' || !key.trim()) {
        throw new Error('Invalid storage key');
      }
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  get: (key: string) => {
    try {
      if (typeof key !== 'string' || !key.trim()) {
        return null;
      }
      const item = localStorage.getItem(key);
      if (!item) return null;
      return JSON.parse(item);
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return null;
    }
  },

  remove: (key: string) => {
    try {
      if (typeof key !== 'string' || !key.trim()) {
        return;
      }
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },

  // Role-specific helpers with validation
  setRole: (role: 'buyer' | 'seller') => {
    if (role !== 'buyer' && role !== 'seller') {
      throw new Error('Invalid role');
    }
    secureStorage.set('nairobiWasteRole', role);
  },

  getRole: (): 'buyer' | 'seller' | null => {
    const role = secureStorage.get('nairobiWasteRole');
    if (role === 'buyer' || role === 'seller') {
      return role;
    }
    return null;
  },

  setMockUser: (email: string) => {
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email');
    }
    secureStorage.set('mockUser', { email, timestamp: Date.now() });
  },

  getMockUser: () => {
    const user = secureStorage.get('mockUser');
    if (user && user.email && user.timestamp) {
      // Optional: expire mock users after 24 hours
      const now = Date.now();
      const age = now - user.timestamp;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      if (age < maxAge) {
        return user;
      } else {
        secureStorage.remove('mockUser');
      }
    }
    return null;
  },
};
