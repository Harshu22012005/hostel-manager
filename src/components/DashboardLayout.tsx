
import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Calendar, 
  MessageSquare, 
  Clock, 
  Users, 
  Bell, 
  Settings, 
  Menu, 
  X, 
  LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { logout, role } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  // Role-specific navigation items
  const getNavItems = (role: UserRole) => {
    if (role === 'student') {
      return [
        { icon: Home, label: 'Dashboard', path: '/dashboard' },
        { icon: Clock, label: 'Outpass', path: '/outpass' },
        { icon: FileText, label: 'Mess Menu', path: '/menu' },
        { icon: Calendar, label: 'Schedule', path: '/schedule' },
        { icon: MessageSquare, label: 'Complaints', path: '/complaints' },
      ];
    } else if (role === 'mess') {
      return [
        { icon: Home, label: 'Dashboard', path: '/dashboard' },
        { icon: Users, label: 'Attendance', path: '/attendance' },
        { icon: FileText, label: 'Menu Manager', path: '/menu-manager' },
        { icon: Bell, label: 'Notifications', path: '/notifications' },
      ];
    } else {
      return [
        { icon: Home, label: 'Dashboard', path: '/dashboard' },
        { icon: Clock, label: 'Outpass Requests', path: '/outpass-requests' },
        { icon: Users, label: 'Students', path: '/students' },
        { icon: MessageSquare, label: 'Complaints', path: '/complaints' },
        { icon: Bell, label: 'Announcements', path: '/announcements' },
      ];
    }
  };

  const navItems = getNavItems(role || 'student');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 z-40 p-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="bg-white"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0`}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-center border-b border-gray-200">
            <h1 className="text-xl font-bold text-hostel-blue">Hostel Manager</h1>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.path}
                  className="group flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-700 hover:bg-hostel-lightGray hover:text-hostel-blue transition duration-150 ease-in-out"
                >
                  <item.icon className="h-5 w-5 mr-3 text-gray-500 group-hover:text-hostel-blue" />
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
};
