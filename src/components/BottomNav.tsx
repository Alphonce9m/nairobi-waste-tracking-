import { Home, BookOpen, Users, BarChart3, Recycle } from "lucide-react";
import { NavLink } from "./NavLink";

const BottomNav = () => {
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Recycle, label: "Groups", path: "/groups" },
    { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
    { icon: BookOpen, label: "Learn", path: "/learn" },
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
      </div>
    </nav>
  );
};

export default BottomNav;
