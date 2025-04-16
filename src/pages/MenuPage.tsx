
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Utensils, Coffee, Clock } from 'lucide-react';

const MenuPage = () => {
  const { isAuthenticated, role } = useAuth();
  const { menuItems } = useData();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated || role !== 'student') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, role, navigate]);
  
  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  // Fixed the date issue - using array index instead of toLocaleDateString
  const today = weekdays[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]; // Convert Sunday (0) to 6, and others to 0-5
  
  const formatDayName = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };
  
  const renderMealDetails = (meal: string[], category: string, icon: JSX.Element) => (
    <div className="mt-4">
      <div className="flex items-center mb-2">
        {icon}
        <h3 className="text-lg font-medium ml-2">{category}</h3>
      </div>
      <Card>
        <CardContent className="p-4">
          <ul className="list-disc list-inside pl-2 space-y-1">
            {meal.map((item, idx) => (
              <li key={idx} className="text-gray-700">{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Mess Menu</h1>
        <p className="text-gray-500">Weekly meal schedule for the hostel mess</p>
      </div>
      
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardContent className="p-4 flex items-center">
          <Clock className="h-5 w-5 text-hostel-blue mr-3" />
          <div>
            <p className="font-medium">Today's Menu ({formatDayName(today)})</p>
            <p className="text-sm text-gray-600 mt-1">
              Breakfast: {menuItems.find(i => i.day === today)?.breakfast.join(', ')}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue={today}>
        <TabsList className="mb-4">
          {weekdays.map((day) => (
            <TabsTrigger key={day} value={day}>
              {formatDayName(day)}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {weekdays.map((day) => {
          const dayMenu = menuItems.find(i => i.day === day);
          
          return (
            <TabsContent key={day} value={day} className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Utensils className="h-5 w-5 mr-2 text-hostel-blue" />
                    {formatDayName(day)} Menu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dayMenu ? (
                    <div className="space-y-6">
                      {renderMealDetails(
                        dayMenu.breakfast, 
                        'Breakfast', 
                        <Coffee className="h-5 w-5 text-amber-500" />
                      )}
                      
                      <Separator />
                      
                      {renderMealDetails(
                        dayMenu.lunch, 
                        'Lunch', 
                        <Utensils className="h-5 w-5 text-green-500" />
                      )}
                      
                      <Separator />
                      
                      {renderMealDetails(
                        dayMenu.dinner, 
                        'Dinner', 
                        <Utensils className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Menu not available for this day.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </DashboardLayout>
  );
};

export default MenuPage;
