
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Search, Coffee, Utensils, Moon, CheckCircle, XCircle, MessagesSquare } from 'lucide-react';

const AttendancePage = () => {
  const { isAuthenticated, role } = useAuth();
  const { mealAttendance, updateMealAttendance, outpassRequests } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');
  const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState(false);
  const [studentsToNotify, setStudentsToNotify] = useState<string[]>([]);
  
  useEffect(() => {
    if (!isAuthenticated || role !== 'mess') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, role, navigate]);
  
  // Get all students from outpass requests (in a real app, this would come from a students table)
  const allStudents = outpassRequests.reduce((students, request) => {
    if (!students.some(s => s.id === request.studentId)) {
      students.push({
        id: request.studentId,
        name: request.studentName,
        roomNumber: request.roomNumber
      });
    }
    return students;
  }, [] as { id: string; name: string; roomNumber: string }[]);
  
  // Filter students based on search query
  const filteredStudents = allStudents.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get attendance for the selected meal and date
  const getAttendanceStatus = (studentId: string) => {
    const record = mealAttendance.find(
      a => a.studentId === studentId && a.date === date
    );
    
    if (record) {
      return record[selectedMeal];
    }
    
    return false;
  };
  
  const handleAttendanceToggle = (studentId: string, attended: boolean) => {
    updateMealAttendance(studentId, date, selectedMeal, attended);
  };
  
  const handleSendNotifications = () => {
    if (studentsToNotify.length === 0) {
      toast({
        title: "No students selected",
        description: "Please select at least one student to notify",
        variant: "destructive",
      });
      return;
    }
    
    // In a real application, this would connect to an API to send notifications
    toast({
      title: "Notifications Sent",
      description: `Notifications sent to parents of ${studentsToNotify.length} students`,
    });
    
    setIsNotifyDialogOpen(false);
    setStudentsToNotify([]);
  };
  
  const absentStudents = filteredStudents.filter(
    student => !getAttendanceStatus(student.id)
  );
  
  const getMealIcon = () => {
    switch (selectedMeal) {
      case 'breakfast':
        return <Coffee className="h-5 w-5 text-amber-500" />;
      case 'lunch':
        return <Utensils className="h-5 w-5 text-green-500" />;
      case 'dinner':
        return <Moon className="h-5 w-5 text-blue-500" />;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Meal Attendance</h1>
        <p className="text-gray-500">Track and manage student attendance for meals</p>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Meal</Label>
              <div className="flex">
                <Button 
                  variant={selectedMeal === 'breakfast' ? 'default' : 'outline'} 
                  className="flex-1 rounded-r-none"
                  onClick={() => setSelectedMeal('breakfast')}
                >
                  <Coffee className="h-4 w-4 mr-2" />
                  Breakfast
                </Button>
                <Button 
                  variant={selectedMeal === 'lunch' ? 'default' : 'outline'} 
                  className="flex-1 rounded-none border-x-0"
                  onClick={() => setSelectedMeal('lunch')}
                >
                  <Utensils className="h-4 w-4 mr-2" />
                  Lunch
                </Button>
                <Button 
                  variant={selectedMeal === 'dinner' ? 'default' : 'outline'} 
                  className="flex-1 rounded-l-none"
                  onClick={() => setSelectedMeal('dinner')}
                >
                  <Moon className="h-4 w-4 mr-2" />
                  Dinner
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="search">Search Students</Label>
              <div className="relative">
                <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
                <Input 
                  id="search" 
                  placeholder="Search by name or room number" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">Total Students</p>
            <h3 className="text-3xl font-bold text-gray-800">{filteredStudents.length}</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">Present</p>
            <h3 className="text-3xl font-bold text-green-600">
              {filteredStudents.filter(student => getAttendanceStatus(student.id)).length}
            </h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">Absent</p>
            <h3 className="text-3xl font-bold text-red-600">
              {filteredStudents.filter(student => !getAttendanceStatus(student.id)).length}
            </h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-center">
            <Button 
              variant="outline" 
              onClick={() => {
                setStudentsToNotify(absentStudents.map(student => student.id));
                setIsNotifyDialogOpen(true);
              }}
              disabled={absentStudents.length === 0}
              className="w-full"
            >
              <MessagesSquare className="h-4 w-4 mr-2" />
              Notify Parents
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center">
            {getMealIcon()}
            <CardTitle className="ml-2">
              {selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)} Attendance
            </CardTitle>
          </div>
          <CardDescription>
            Mark students as present or absent for {selectedMeal} on {new Date(date).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div 
                  key={student.id} 
                  className="flex items-center justify-between p-3 rounded hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-gray-500">Room: {student.roomNumber}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={getAttendanceStatus(student.id) ? 'default' : 'destructive'}
                    >
                      {getAttendanceStatus(student.id) ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {getAttendanceStatus(student.id) ? 'Present' : 'Absent'}
                    </Badge>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={getAttendanceStatus(student.id)} 
                        onCheckedChange={(checked) => handleAttendanceToggle(student.id, checked)}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground py-4">No students found matching your search.</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Notify Parents Dialog */}
      <Dialog open={isNotifyDialogOpen} onOpenChange={setIsNotifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notify Parents</DialogTitle>
            <DialogDescription>
              Send notifications to parents of absent students
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p className="font-medium">
              {studentsToNotify.length} student{studentsToNotify.length !== 1 ? 's' : ''} will be notified:
            </p>
            
            <div className="max-h-40 overflow-y-auto space-y-2">
              {absentStudents.map((student) => (
                <div key={student.id} className="flex items-center">
                  <XCircle className="h-4 w-4 text-red-500 mr-2" />
                  <span>{student.name} - Room {student.roomNumber}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <p className="text-sm text-blue-800">
                Parents will be notified that their child was absent for {selectedMeal} on {new Date(date).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsNotifyDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendNotifications}
            >
              <MessagesSquare className="h-4 w-4 mr-2" />
              Send Notifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AttendancePage;
