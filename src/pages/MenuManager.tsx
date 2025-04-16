
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Utensils, Coffee, PlusCircle, Save, XCircle } from 'lucide-react';

const MenuManager = () => {
  const { isAuthenticated, role } = useAuth();
  const { menuItems, updateMenuItems } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isAuthenticated || role !== 'mess') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, role, navigate]);
  
  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const [selectedDay, setSelectedDay] = useState('monday');
  
  // Menu state for editing
  const [editMode, setEditMode] = useState(false);
  const [breakfast, setBreakfast] = useState<string[]>([]);
  const [lunch, setLunch] = useState<string[]>([]);
  const [dinner, setDinner] = useState<string[]>([]);
  
  // Input state for adding new items
  const [newBreakfastItem, setNewBreakfastItem] = useState('');
  const [newLunchItem, setNewLunchItem] = useState('');
  const [newDinnerItem, setNewDinnerItem] = useState('');
  
  // Load menu data when selected day changes
  useEffect(() => {
    const dayMenu = menuItems.find(item => item.day === selectedDay);
    if (dayMenu) {
      setBreakfast([...dayMenu.breakfast]);
      setLunch([...dayMenu.lunch]);
      setDinner([...dayMenu.dinner]);
    }
  }, [selectedDay, menuItems]);
  
  const formatDayName = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };
  
  const handleAddItem = (meal: 'breakfast' | 'lunch' | 'dinner', item: string) => {
    if (!item.trim()) return;
    
    if (meal === 'breakfast') {
      setBreakfast([...breakfast, item]);
      setNewBreakfastItem('');
    } else if (meal === 'lunch') {
      setLunch([...lunch, item]);
      setNewLunchItem('');
    } else {
      setDinner([...dinner, item]);
      setNewDinnerItem('');
    }
  };
  
  const handleRemoveItem = (meal: 'breakfast' | 'lunch' | 'dinner', index: number) => {
    if (meal === 'breakfast') {
      setBreakfast(breakfast.filter((_, i) => i !== index));
    } else if (meal === 'lunch') {
      setLunch(lunch.filter((_, i) => i !== index));
    } else {
      setDinner(dinner.filter((_, i) => i !== index));
    }
  };
  
  const handleSaveMenu = () => {
    if (breakfast.length === 0 || lunch.length === 0 || dinner.length === 0) {
      toast({
        title: "Validation Error",
        description: "All meals must have at least one item",
        variant: "destructive",
      });
      return;
    }
    
    updateMenuItems(selectedDay as any, 'breakfast', breakfast);
    updateMenuItems(selectedDay as any, 'lunch', lunch);
    updateMenuItems(selectedDay as any, 'dinner', dinner);
    
    setEditMode(false);
    
    toast({
      title: "Menu Updated",
      description: `The menu for ${formatDayName(selectedDay)} has been updated`,
    });
  };
  
  const renderMealItems = (
    meal: string[], 
    setMeal: (items: string[]) => void, 
    newItem: string, 
    setNewItem: (value: string) => void, 
    mealType: 'breakfast' | 'lunch' | 'dinner',
    icon: JSX.Element,
    label: string
  ) => (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          {icon}
          <h3 className="text-lg font-medium ml-2">{label}</h3>
        </div>
      </div>
      
      {editMode ? (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Input 
              placeholder={`Add ${label.toLowerCase()} item...`} 
              value={newItem} 
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddItem(mealType, newItem);
                }
              }}
            />
            <Button 
              size="sm" 
              onClick={() => handleAddItem(mealType, newItem)}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {meal.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>{item}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveItem(mealType, index)}
                >
                  <XCircle className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-4">
            <ul className="list-disc list-inside pl-2 space-y-1">
              {meal.map((item, idx) => (
                <li key={idx} className="text-gray-700">{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Menu Manager</h1>
        <p className="text-gray-500">Update and manage the weekly meal schedule</p>
      </div>
      
      <Tabs 
        value={selectedDay} 
        onValueChange={(value) => {
          if (editMode) {
            const confirm = window.confirm("You have unsaved changes. Are you sure you want to switch days?");
            if (!confirm) return;
          }
          setSelectedDay(value);
          setEditMode(false);
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            {weekdays.map((day) => (
              <TabsTrigger key={day} value={day}>
                {formatDayName(day)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="space-x-2">
            {editMode ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const dayMenu = menuItems.find(item => item.day === selectedDay);
                    if (dayMenu) {
                      setBreakfast([...dayMenu.breakfast]);
                      setLunch([...dayMenu.lunch]);
                      setDinner([...dayMenu.dinner]);
                    }
                    setEditMode(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveMenu}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditMode(true)}>
                Edit Menu
              </Button>
            )}
          </div>
        </div>
        
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
                  {selectedDay === day && (
                    <div className="space-y-6">
                      {renderMealItems(
                        breakfast,
                        setBreakfast,
                        newBreakfastItem,
                        setNewBreakfastItem,
                        'breakfast',
                        <Coffee className="h-5 w-5 text-amber-500" />,
                        'Breakfast'
                      )}
                      
                      {renderMealItems(
                        lunch,
                        setLunch,
                        newLunchItem,
                        setNewLunchItem,
                        'lunch',
                        <Utensils className="h-5 w-5 text-green-500" />,
                        'Lunch'
                      )}
                      
                      {renderMealItems(
                        dinner,
                        setDinner,
                        newDinnerItem,
                        setNewDinnerItem,
                        'dinner',
                        <Utensils className="h-5 w-5 text-blue-500" />,
                        'Dinner'
                      )}
                    </div>
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

export default MenuManager;
