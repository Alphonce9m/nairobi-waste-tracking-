import { Home, BookOpen, Users, BarChart3, Recycle, Store, LogIn, LogOut, Truck, User, Settings } from "lucide-react";
import { NavLink } from "./NavLink";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const BottomNavSimple = () => {
  const navigate = useNavigate();

  // Simple navigation items - always the same, no auth restrictions
  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: Truck, label: "Request", path: "/service-request" },
    { icon: Store, label: "Market", path: "/marketplace" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: BarChart3, label: "Track", path: "/track-requests" },
  ];

  const handleSignOut = () => {
    localStorage.removeItem('nairobiWasteUser');
    navigate('/auth');
  };

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
      </div>
    </nav>
  );
};

export default BottomNavSimple;
