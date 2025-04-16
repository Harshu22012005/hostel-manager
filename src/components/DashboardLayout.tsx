
import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X, Home, FileText, Utensils, Calendar, MessageSquare, Clock, Bell, Users, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface DashboardLayoutProps {
  children: ReactNode;
}

const Navigation = ({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean; setIsCollapsed: (value: boolean) => void }) => {
  const { role, logout } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
  };

  const studentLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/outpass', label: 'Outpass', icon: FileText },
    { href: '/menu', label: 'Mess Menu', icon: Utensils },
    { href: '/complaints', label: 'Complaints', icon: MessageSquare },
  ];

  const messLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/menu-manager', label: 'Menu Manager', icon: Utensils },
    { href: '/attendance', label: 'Attendance', icon: Clock },
    { href: '/announcements', label: 'Announcements', icon: Bell },
  ];

  const officeLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/outpass-requests', label: 'Outpass Requests', icon: FileText },
    { href: '/students', label: 'Students', icon: Users },
    { href: '/complaints', label: 'Complaints', icon: MessageSquare },
    { href: '/announcements', label: 'Announcements', icon: Bell },
  ];

  const links = role === 'student' ? studentLinks : role === 'mess' ? messLinks : officeLinks;

  return (
    <div className={cn(
      "flex flex-col border-r h-screen bg-white transition-all duration-300 relative",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && (
          <h2 className="text-xl font-bold text-hostel-blue">Hostel MS</h2>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>
      
      <Separator />
      
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link 
                to={link.href}
                className={cn(
                  "flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors",
                  location.pathname === link.href && "bg-blue-50 text-hostel-blue font-medium",
                  isCollapsed ? "justify-center" : "justify-start"
                )}
              >
                <link.icon className={cn("h-5 w-5", location.pathname === link.href && "text-hostel-blue")} />
                {!isCollapsed && <span className="ml-3">{link.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4">
        <Button 
          variant="outline" 
          className={cn("w-full", isCollapsed && "p-2")}
          onClick={handleLogout}
        >
          {isCollapsed ? (
            <Settings className="h-5 w-5" />
          ) : (
            "Logout"
          )}
        </Button>
      </div>
    </div>
  );
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();
  
  // Auto-collapse the sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <main className={cn(
        "flex-1 p-4 md:p-6 transition-all duration-300 overflow-x-hidden",
        isCollapsed ? "ml-16" : "ml-0 md:ml-64"
      )}>
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
