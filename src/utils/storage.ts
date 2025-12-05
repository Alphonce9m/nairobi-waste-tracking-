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
    return role === 'buyer' || role === 'seller' ? role : null;
  },
};
