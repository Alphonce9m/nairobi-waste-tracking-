// COMPREHENSIVE DEBUG - Browser Console Script
console.log('🔍 NAIROBI WASTE TRACKING - COMPREHENSIVE DEBUG');
console.log('================================================\n');

// 1. Basic Environment Check
console.log('🌐 ENVIRONMENT CHECK:');
console.log('Current URL:', window.location.href);
console.log('Page Title:', document.title);
console.log('User Agent:', navigator.userAgent);
console.log('Screen Resolution:', screen.width + 'x' + screen.height);

// 2. React App Check
const root = document.getElementById('root');
console.log('\n🧩 REACT APP CHECK:');
if (root) {
  console.log('✅ Root element found');
  console.log('Root children:', root.children.length);
  console.log('Root content length:', root.innerHTML.length);
  
  if (root.innerHTML.length === 0) {
    console.log('❌ React app not rendered - root is empty');
  } else {
    console.log('✅ React app appears rendered');
  }
} else {
  console.log('❌ Root element not found');
}

// 3. Authentication Debug
console.log('\n🔐 AUTHENTICATION DEBUG:');
const currentUser = localStorage.getItem('nairobiWasteUser');
console.log('User in localStorage:', currentUser ? 'YES' : 'NO');

if (currentUser) {
  try {
    const parsed = JSON.parse(currentUser);
    console.log('✅ User data parsed successfully:');
    console.log('  - ID:', parsed.id);
    console.log('  - Name:', parsed.name);
    console.log('  - Email:', parsed.email);
    console.log('  - Role:', parsed.role);
    console.log('  - Phone:', parsed.phone);
  } catch (e) {
    console.log('❌ Error parsing user data:', e.message);
    console.log('Raw user data:', currentUser);
  }
} else {
  console.log('❌ No user data found in localStorage');
}

// 4. Navigation Debug
console.log('\n🧭 NAVIGATION DEBUG:');
const bottomNav = document.querySelector('nav.fixed.bottom-0');
if (bottomNav) {
  console.log('✅ Bottom navigation found');
  const navItems = bottomNav.querySelectorAll('a');
  console.log('Navigation items:', navItems.length);
  
  navItems.forEach((item, index) => {
    const label = item.querySelector('span');
    const href = item.getAttribute('href');
    if (label) {
      console.log(`  ${index + 1}. ${label.textContent} → ${href}`);
    }
  });
  
  // Check for profile button
  const profileBtn = bottomNav.querySelector('button');
  if (profileBtn) {
    console.log('✅ Profile button found (user should be signed in)');
  } else {
    console.log('❌ No profile button (user not signed in)');
  }
} else {
  console.log('❌ Bottom navigation not found');
}

// 5. Debug Badge Check
console.log('\n🔍 DEBUG BADGE CHECK:');
const debugBadge = document.querySelector('.fixed.top-4.left-4');
if (debugBadge) {
  console.log('✅ Debug badge found:', debugBadge.textContent);
} else {
  console.log('❌ Debug badge not found');
}

// 6. Component Loading Check
console.log('\n📄 COMPONENT LOADING CHECK:');
const expectedElements = [
  { selector: 'h1, h2', name: 'Headings' },
  { selector: 'button', name: 'Buttons' },
  { selector: 'input, textarea, select', name: 'Form elements' },
  { selector: '.card', name: 'Cards' },
  { selector: 'nav', name: 'Navigation' }
];

expectedElements.forEach(elem => {
  const elements = document.querySelectorAll(elem.selector);
  console.log(`✅ ${elem.name}: ${elements.length} found`);
});

// 7. Error Detection
console.log('\n❌ ERROR DETECTION:');
const pageContent = document.body.innerText.toLowerCase();
const errorKeywords = ['error', 'failed', 'cannot', 'undefined', 'null', 'exception'];
const foundErrors = [];

errorKeywords.forEach(keyword => {
  if (pageContent.includes(keyword)) {
    foundErrors.push(keyword);
  }
});

if (foundErrors.length > 0) {
  console.log('⚠️ Potential errors found:', foundErrors);
} else {
  console.log('✅ No obvious error keywords detected');
}

// 8. Performance Check
console.log('\n⚡ PERFORMANCE CHECK:');
const startTime = performance.now();
setTimeout(() => {
  const endTime = performance.now();
  console.log('Response time:', (endTime - startTime).toFixed(2), 'ms');
}, 100);

// 9. WhatsApp Service Check
console.log('\n📱 WHATSAPP SERVICE CHECK:');
// Check if whatsappService is available in window context
if (typeof window !== 'undefined') {
  console.log('✅ Window object available');
  // Check for any WhatsApp-related elements
  const whatsappElements = document.querySelectorAll('[href*="wa.me"], [href*="whatsapp"]');
  console.log('WhatsApp links found:', whatsappElements.length);
} else {
  console.log('❌ Window object not available');
}

// 10. Route Check
console.log('\n🛣️ ROUTE CHECK:');
const currentPath = window.location.pathname;
const knownRoutes = ['/', '/home', '/auth', '/marketplace', '/service-request', '/community', '/track-requests'];
const isKnownRoute = knownRoutes.includes(currentPath);
console.log('Current path:', currentPath);
console.log('Known route:', isKnownRoute ? 'YES' : 'NO');

// 11. Manual Fix Suggestions
console.log('\n🔧 MANUAL FIX SUGGESTIONS:');

if (!currentUser) {
  console.log('🔧 Suggestion: Set up test user');
  console.log('Run: localStorage.setItem("nairobiWasteUser", JSON.stringify({id:"test",name:"Test User",email:"test@test.com",role:"customer"}))');
}

if (!bottomNav) {
  console.log('🔧 Suggestion: Check if React app is mounting properly');
}

if (root && root.innerHTML.length === 0) {
  console.log('🔧 Suggestion: Force page reload');
  console.log('Run: location.reload()');
}

// 12. Final Status
console.log('\n🎯 FINAL DEBUG SUMMARY:');
console.log('========================');
const issues = [];

if (!root || root.innerHTML.length === 0) issues.push('React app not rendering');
if (!currentUser) issues.push('No authentication data');
if (!bottomNav) issues.push('Navigation not found');
if (!debugBadge) issues.push('Debug badge missing');

if (issues.length === 0) {
  console.log('✅ NO ISSUES DETECTED - Everything looks good!');
} else {
  console.log('⚠️ ISSUES FOUND:', issues.length);
  issues.forEach((issue, index) => {
    console.log(`  ${index + 1}. ${issue}`);
  });
}

console.log('\n🎉 DEBUG COMPLETE!');
console.log('📱 If issues persist, try the manual fixes suggested above');
