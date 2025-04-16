import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const StudentsPage = () => {
  const { isAuthenticated, role } = useAuth();
  const { outpassRequests, complaints } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated || role !== 'office') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, role, navigate]);
  
  const extractedStudents = outpassRequests.reduce((students, request) => {
    if (!students.some(s => s.id === request.studentId)) {
      students.push({
        id: request.studentId,
        name: request.studentName,
        roomNumber: request.roomNumber,
        rollNumber: `R${Math.floor(Math.random() * 9000) + 1000}`,
        email: `${request.studentName.toLowerCase().replace(/\s+/g, '.')}@student.edu`,
        phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        guardianName: "Parent/Guardian",
        guardianPhone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        joinDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      });
    }
    return students;
  }, [] as any[]);
  
  const filteredStudents = extractedStudents.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleViewStudent = (student: any) => {
    setSelectedStudent(student);
    setIsEditMode(false);
    setIsDialogOpen(true);
  };
  
  const handleEditStudent = (student: any) => {
    setSelectedStudent(student);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };
  
  const handleDeleteStudent = (studentId: string) => {
    toast({
      title: "Not Implemented",
      description: "This feature would delete the student in a real application.",
      variant: "destructive",
    });
  };
  
  const handleSaveStudent = () => {
    toast({
      title: "Changes Saved",
      description: "Student information has been updated successfully.",
    });
    setIsDialogOpen(false);
  };
  
  const handleParentNotification = (student: any) => {
    toast({
      title: "Notification Sent",
      description: `A notification has been sent to ${student.guardianName} regarding ${student.name}.`,
    });
  };
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Student Management</h1>
        <p className="text-gray-500">View and manage student information</p>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search students..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="pl-9 w-full"
              />
            </div>
            
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Student
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-4">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <Card key={student.id} className="animate-fade-in hover:shadow-md transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-lg">{student.name}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 mt-1 gap-0 sm:gap-4">
                      <p>Room: {student.roomNumber}</p>
                      <p>Roll: {student.rollNumber}</p>
                      <p>Joined: {new Date(student.joinDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                    <Button variant="outline" size="sm" onClick={() => handleViewStudent(student)}>View</Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditStudent(student)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-200 text-red-500 hover:bg-red-50"
                      onClick={() => handleDeleteStudent(student.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">No students found matching your search criteria.</p>
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Student Information' : 'Student Details'}</DialogTitle>
            <DialogDescription>
              {isEditMode ? 'Update the student information below.' : 'View the complete student information.'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={selectedStudent.name} 
                    readOnly={!isEditMode} 
                    className={!isEditMode ? "bg-gray-50" : ""}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="room">Room Number</Label>
                    <Input 
                      id="room" 
                      value={selectedStudent.roomNumber} 
                      readOnly={!isEditMode}
                      className={!isEditMode ? "bg-gray-50" : ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="roll">Roll Number</Label>
                    <Input 
                      id="roll" 
                      value={selectedStudent.rollNumber} 
                      readOnly={!isEditMode}
                      className={!isEditMode ? "bg-gray-50" : ""}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex">
                    <Input 
                      id="email" 
                      value={selectedStudent.email} 
                      readOnly={!isEditMode}
                      className={cn("rounded-r-none", !isEditMode && "bg-gray-50")}
                    />
                    {!isEditMode && (
                      <Button variant="outline" className="rounded-l-none">
                        <Mail className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="flex">
                    <Input 
                      id="phone" 
                      value={selectedStudent.phone} 
                      readOnly={!isEditMode}
                      className={cn("rounded-r-none", !isEditMode && "bg-gray-50")}
                    />
                    {!isEditMode && (
                      <Button variant="outline" className="rounded-l-none">
                        <Phone className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="guardian">Guardian Name</Label>
                  <Input 
                    id="guardian" 
                    value={selectedStudent.guardianName} 
                    readOnly={!isEditMode}
                    className={!isEditMode ? "bg-gray-50" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="guardianPhone">Guardian Phone</Label>
                  <div className="flex">
                    <Input 
                      id="guardianPhone" 
                      value={selectedStudent.guardianPhone} 
                      readOnly={!isEditMode}
                      className={cn("rounded-r-none", !isEditMode && "bg-gray-50")}
                    />
                    {!isEditMode && (
                      <Button variant="outline" className="rounded-l-none" onClick={() => handleParentNotification(selectedStudent)}>
                        Notify
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            {isEditMode ? (
              <>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveStudent}>Save Changes</Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default StudentsPage;
