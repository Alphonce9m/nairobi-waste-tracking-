
// localStorage test - run this in browser console
console.log('🔍 localStorage Debug:');

// Check if nairobiWasteUser exists
const user = localStorage.getItem('nairobiWasteUser');
console.log('User in localStorage:', user);

if (user) {
  const parsedUser = JSON.parse(user);
  console.log('Parsed user:', parsedUser);
  console.log('User email:', parsedUser.email);
  console.log('User name:', parsedUser.name);
} else {
  console.log('No user found in localStorage');
}

// Test setting a user
const testUser = {
  id: 'test-user',
  email: 'test@test.com',
  name: 'Test User',
  role: 'customer'
};

localStorage.setItem('nairobiWasteUser', JSON.stringify(testUser));
console.log('Test user set');

// Check again
const checkUser = localStorage.getItem('nairobiWasteUser');
console.log('Check user:', checkUser);

// Clean up
localStorage.removeItem('nairobiWasteUser');
console.log('Test user removed');
