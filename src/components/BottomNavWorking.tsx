import { Home, BookOpen, Users, BarChart3, Recycle, Store, LogIn, LogOut, Truck, User, Settings } from "lucide-react";
import { NavLink } from "./NavLink";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BottomNavWorking = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check authentication status on mount and when localStorage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const savedUser = localStorage.getItem('nairobiWasteUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    };

    checkAuthStatus();

    // Listen for storage changes (in case user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for localStorage changes (fallback)
    const interval = setInterval(checkAuthStatus, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []); // Add empty dependency array

  const handleSignOut = () => {
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
  );
};

export default BottomNavWorking;
