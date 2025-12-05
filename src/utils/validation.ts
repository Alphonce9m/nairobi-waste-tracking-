// Input validation and sanitization utilities

export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .slice(0, 1000); // Limit length
};

export const validateEmail = (email: string): boolean => {
  const sanitized = sanitizeInput(email);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized);
};

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const sanitized = sanitizeInput(password);
  const errors: string[] = [];
  
  if (sanitized.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  
  if (sanitized.length > 100) {
    errors.push('Password must be less than 100 characters');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export const validateRole = (role: string): role is 'buyer' | 'seller' => {
  return role === 'buyer' || role === 'seller';
};

export const validateLocation = (location: string): boolean => {
  const sanitized = sanitizeInput(location);
  return sanitized.length >= 3 && sanitized.length <= 200;
};

export const validateWasteType = (type: string): boolean => {
  const validTypes = ['plastic', 'organic', 'electronic', 'hazardous', 'mixed'];
  return validTypes.includes(sanitizeInput(type));
};

export const validateQuantity = (quantity: string): number | null => {
  const sanitized = sanitizeInput(quantity);
  const num = parseFloat(sanitized);
  return (num > 0 && num <= 10000) ? num : null;
};

export const validatePrice = (price: string): number | null => {
  const sanitized = sanitizeInput(price);
  const num = parseFloat(sanitized);
  return (num >= 0 && num <= 100000) ? num : null;
};

export const validatePhone = (phone: string): boolean => {
  const sanitized = sanitizeInput(phone);
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return sanitized.length >= 10 && sanitized.length <= 20 && phoneRegex.test(sanitized);
};
