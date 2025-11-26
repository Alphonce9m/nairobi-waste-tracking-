import { Home, BookOpen, Users, BarChart3, Recycle, Store, LogIn, LogOut, Truck, User, Settings } from "lucide-react";
import { NavLink } from "./NavLink";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BottomNavDebug = () => {
  const [user, setUser] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const savedUser = localStorage.getItem('nairobiWasteUser');
      console.log('Checking auth status:', savedUser);
      
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        console.log('User found:', parsedUser);
        setUser(parsedUser);
        setDebugInfo({
          hasUser: true,
          userEmail: parsedUser.email,
          userName: parsedUser.name,
        });
      } else {
        console.log('No user found in localStorage');
        setUser(null);
        setDebugInfo({
          hasUser: false,
          localStorageKeys: Object.keys(localStorage),
        });
      }
    };

    checkAuthStatus();

    // Listen for storage changes (in case user logs in/out in another tab)
    const handleStorageChange = () => {
      console.log('Storage changed, checking auth status...');
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSignOut = () => {
    console.log('Signing out...');
    localStorage.removeItem('nairobiWasteUser');
    setUser(null);
    navigate('/auth');
  };

  // Navigation items for signed-out users
  const publicNavItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: Truck, label: "Request", path: "/service-request" },
    { icon: Store, label: "Market", path: "/marketplace" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: LogIn, label: "Sign In", path: "/auth" },
  ];

  // Navigation items for signed-in users
  const privateNavItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: Truck, label: "Request", path: "/service-request" },
    { icon: Store, label: "Market", path: "/marketplace" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: BarChart3, label: "Track", path: "/track-requests" },
  ];

  const navItems = user ? privateNavItems : publicNavItems;

  return (
    <>
      {/* Debug Panel */}
      <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 text-xs">
        <h4 className="font-bold mb-2">🔍 Debug Info:</h4>
        <div className="space-y-1">
          <p><strong>User Status:</strong> {user ? '✅ Signed In' : '❌ Not Signed In'}</p>
          <p><strong>Has User:</strong> {debugInfo.hasUser ? 'Yes' : 'No'}</p>
          {debugInfo.userEmail && <p><strong>Email:</strong> {debugInfo.userEmail}</p>}
          {debugInfo.userName && <p><strong>Name:</strong> {debugInfo.userName}</p>}
          <p><strong>Nav Items:</strong> {navItems.length}</p>
          <p><strong>Last Item:</strong> {navItems[navItems.length - 1]?.label}</p>
        </div>
        <Button 
          onClick={() => {
            console.log('Manual refresh...');
            const savedUser = localStorage.getItem('nairobiWasteUser');
            if (savedUser) {
              setUser(JSON.parse(savedUser));
            } else {
              setUser(null);
            }
          }}
          size="sm"
          className="mt-2"
        >
          🔄 Refresh
        </Button>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 pb-safe">
        <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-[60px]"
              activeClassName="text-primary bg-primary/10"
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`h-5 w-5 transition-transform ${
                      isActive ? "scale-110" : ""
                    }`}
                  />
                  <span className="text-xs font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
          
          {/* Show user menu or sign-in button */}
          {user ? (
            <div className="flex flex-col items-center justify-center gap-1 px-4 py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
              <span className="text-xs font-medium">Profile</span>
            </div>
          ) : null}
        </div>
      </nav>
    </>
  );
};

export default BottomNavDebug;
