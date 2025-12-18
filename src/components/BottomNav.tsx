import { Home, Store, LogIn, LogOut, User as UserIcon, ScanEye, type LucideIcon } from "lucide-react";
import { NavLink } from "./NavLink";
import { useSupabase } from "@/contexts/SupabaseContext";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { useUser } from "@/contexts/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Type definitions
interface BaseNavItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

interface CustomNavItem extends Omit<BaseNavItem, 'icon'> {
  customContent: (isActive: boolean) => React.ReactNode;
}

type NavItem = BaseNavItem | CustomNavItem;

interface BottomNavProps {
  // Add any props if needed
}

const BottomNav: React.FC<BottomNavProps> = () => {
  const { user, signOut, loading } = useSupabase();
  const safeUser = user as User | null; // Explicitly type the user
  const navigate = useNavigate();

  // Navigation items for signed-out users
  const publicNavItems: NavItem[] = [
    { icon: Store, label: "Market", path: "/marketplace" },
    { icon: Home, label: "Home", path: "/home" },
    { icon: ScanEye, label: "Analyze", path: "/analyze" },
  ];

  // Navigation items for signed-in users
  const ProfileNavItem = ({ isActive }: { isActive: boolean }) => {
    const { profile } = useUser();
    return (
      <div className="flex flex-col items-center">
        <Avatar className={`h-6 w-6 ${isActive ? 'ring-2 ring-primary' : ''}`}>
          <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User'} />
          <AvatarFallback>
            {profile?.full_name 
              ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
              : <UserIcon className="h-4 w-4" />
            }
          </AvatarFallback>
        </Avatar>
        <span className="text-xs mt-1">Profile</span>
      </div>
    );
  };

  const privateNavItems: NavItem[] = [
    { icon: Store, label: "Market", path: "/marketplace" },
    { icon: Home, label: "Home", path: "/home" },
    { 
      label: "Profile", 
      path: "/profile",
      customContent: (isActive: boolean) => <ProfileNavItem isActive={isActive} />
    },
  ];

  const navItems: NavItem[] = safeUser ? privateNavItems : publicNavItems;

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error signing out:', errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around items-center h-16">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-full h-full flex flex-col items-center justify-center">
              <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-2 w-10 bg-gray-200 rounded mt-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800 z-50">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className="flex-1">
              {({ isActive }) => {
                // If custom content is provided, use it
                if ('customContent' in item) {
                  return (
                    <div className="flex justify-center">
                      {item.customContent(isActive)}
                    </div>
                  );
                }
                
                // Default navigation item
                return (
                  <div className="flex flex-col items-center justify-center p-2">
                    <item.icon className={`h-6 w-6 ${isActive ? 'text-primary' : 'text-gray-500'}`} />
                    <span className={`text-xs mt-1 ${isActive ? 'text-primary font-medium' : 'text-gray-500'}`}>
                      {item.label}
                    </span>
                  </div>
                );
              }}
            </NavLink>
          ))}
          
          {safeUser && (
            <button
              onClick={handleSignOut}
              className="flex flex-col items-center justify-center p-2 text-gray-500 hover:text-red-500 transition-colors flex-1"
              disabled={loading}
            >
              <LogOut className="h-6 w-6" />
              <span className="text-xs mt-1">Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
