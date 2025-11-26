
// Manual Authentication Test - run in browser console
console.log('🧪 Manual Auth Test:');

// Step 1: Clear any existing auth
localStorage.removeItem('nairobiWasteUser');
console.log('1. Cleared existing auth');

// Step 2: Manually set auth state
const mockUser = {
  id: 'demo-user-1',
  email: 'demo@nairobwaste.com',
  name: 'Demo User',
  businessName: 'Demo Waste Collection',
  phone: '+254723065707',
  role: 'customer'
};

localStorage.setItem('nairobiWasteUser', JSON.stringify(mockUser));
console.log('2. Set mock user in localStorage');

// Step 3: Verify user is set
const verifyUser = localStorage.getItem('nairobiWasteUser');
console.log('3. Verification - User in localStorage:', verifyUser ? 'YES' : 'NO');

// Step 4: Trigger page reload to test navigation
console.log('4. Now refresh the page to test navigation update');
console.log('   Or click the Refresh button in debug panel');

// Step 5: Check navigation should show Track instead of Sign In
console.log('5. Expected navigation: Home | Request | Market | Community | Track');
