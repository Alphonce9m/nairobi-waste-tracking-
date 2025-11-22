import { Home, BookOpen, Users, BarChart3, Recycle, Store, LogIn, LogOut, Truck } from "lucide-react";
import { NavLink } from "./NavLink";
import { useSupabase } from "@/contexts/SupabaseContext";
import { Button } from "@/components/ui/button";

const BottomNav = () => {
  const { user, signOut } = useSupabase();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Users, label: "Groups", path: "/groups" },
    { icon: Store, label: "Market", path: "/marketplace" },
    { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Community", path: "/community" },
  ];

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
        <div className="flex flex-col items-center justify-center gap-1 px-4 py-2">
          {user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="h-8 w-8 p-0"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          ) : (
            <NavLink
              to="/auth"
              className="flex flex-col items-center justify-center gap-1"
              activeClassName="text-primary bg-primary/10"
            >
              {({ isActive }) => (
                <>
                  <LogIn className={`h-5 w-5 transition-transform ${
                    isActive ? "scale-110" : ""
                  }`} />
                  <span className="text-xs font-medium">Sign In</span>
                </>
              )}
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
