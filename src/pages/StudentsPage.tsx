
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
import { Search, Plus, Edit, Trash2, Mail, Phone, User, Book, Calendar, MapPin } from 'lucide-react';
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
  const [students, setStudents] = useState<any[]>([]);
  
  useEffect(() => {
    if (!isAuthenticated || role !== 'office') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, role, navigate]);
  
  useEffect(() => {
    // Extract unique students from outpass requests
    const extractedStudents = outpassRequests.reduce((students, request) => {
      if (!students.some(s => s.id === request.studentId)) {
        students.push({
          id: request.studentId,
          name: request.studentName,
          roomNumber: request.roomNumber,
          rollNumber: `B${Math.floor(Math.random() * 9000) + 1000}`,
          email: `${request.studentName.toLowerCase().replace(/\s+/g, '.')}@student.edu`,
          phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          guardianName: "Parent/Guardian",
          guardianPhone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          joinDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
          branch: ["Computer Science", "Mechanical", "Electrical", "Civil", "Electronics"][Math.floor(Math.random() * 5)],
          year: ["First Year", "Second Year", "Third Year", "Fourth Year"][Math.floor(Math.random() * 4)],
        });
      }
      return students;
    }, [] as any[]);
    
    setStudents(extractedStudents);
  }, [outpassRequests]);
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (student.branch && student.branch.toLowerCase().includes(searchQuery.toLowerCase()))
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
      title: "Student Removed",
      description: "The student has been successfully removed from the system.",
    });
    setStudents(prev => prev.filter(student => student.id !== studentId));
  };
  
  const handleSaveStudent = () => {
    toast({
      title: "Changes Saved",
      description: "Student information has been updated successfully.",
    });
    setStudents(prev => 
      prev.map(student => 
        student.id === selectedStudent.id ? selectedStudent : student
      )
    );
    setIsDialogOpen(false);
  };
  
  const handleParentNotification = (student: any) => {
    toast({
      title: "Notification Sent",
      description: `A notification has been sent to ${student.guardianName} regarding ${student.name}.`,
    });
  };
  
  const handleAddStudent = () => {
    toast({
      title: "Feature Coming Soon",
      description: "The ability to add new students will be available in the next update.",
    });
  };
  
  return (
    <DashboardLayout>
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold mb-2">Student Management</h1>
        <p className="text-gray-500">View and manage student information</p>
      </div>
      
      <Card className="mb-6 animate-scale-in">
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
            
            <Button onClick={handleAddStudent} className="hover-scale">
              <Plus className="h-4 w-4 mr-2" />
              Add New Student
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-4">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student, index) => (
            <Card 
              key={student.id} 
              className="hover-scale card-shadow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex h-12 w-12 rounded-full bg-primary/10 items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{student.name}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 mt-1 gap-0 sm:gap-4">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <p>Room: {student.roomNumber}</p>
                        </div>
                        <div className="flex items-center">
                          <Book className="h-3 w-3 mr-1" />
                          <p>Roll: {student.rollNumber}</p>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <p>Joined: {new Date(student.joinDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{student.branch}</Badge>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{student.year}</Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                    <Button variant="outline" size="sm" onClick={() => handleViewStudent(student)} className="hover-scale">View</Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditStudent(student)} className="hover-scale">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-200 text-red-500 hover:bg-red-50 hover-scale"
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
          <p className="text-center text-gray-500 py-8 animate-fade-in">No students found matching your search criteria.</p>
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md animate-scale-in">
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
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={selectedStudent.name} 
                    onChange={(e) => setSelectedStudent({...selectedStudent, name: e.target.value})}
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
                      onChange={(e) => setSelectedStudent({...selectedStudent, roomNumber: e.target.value})}
                      readOnly={!isEditMode}
                      className={!isEditMode ? "bg-gray-50" : ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="roll">Roll Number</Label>
                    <Input 
                      id="roll" 
                      value={selectedStudent.rollNumber}
                      onChange={(e) => setSelectedStudent({...selectedStudent, rollNumber: e.target.value})}
                      readOnly={!isEditMode}
                      className={!isEditMode ? "bg-gray-50" : ""}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Input 
                      id="branch" 
                      value={selectedStudent.branch}
                      onChange={(e) => setSelectedStudent({...selectedStudent, branch: e.target.value})}
                      readOnly={!isEditMode}
                      className={!isEditMode ? "bg-gray-50" : ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input 
                      id="year" 
                      value={selectedStudent.year}
                      onChange={(e) => setSelectedStudent({...selectedStudent, year: e.target.value})}
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
                      onChange={(e) => setSelectedStudent({...selectedStudent, email: e.target.value})}
                      readOnly={!isEditMode}
                      className={cn("rounded-r-none", !isEditMode && "bg-gray-50")}
                    />
                    {!isEditMode && (
                      <Button variant="outline" className="rounded-l-none hover-scale">
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
                      onChange={(e) => setSelectedStudent({...selectedStudent, phone: e.target.value})}
                      readOnly={!isEditMode}
                      className={cn("rounded-r-none", !isEditMode && "bg-gray-50")}
                    />
                    {!isEditMode && (
                      <Button variant="outline" className="rounded-l-none hover-scale">
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
                    onChange={(e) => setSelectedStudent({...selectedStudent, guardianName: e.target.value})}
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
                      onChange={(e) => setSelectedStudent({...selectedStudent, guardianPhone: e.target.value})}
                      readOnly={!isEditMode}
                      className={cn("rounded-r-none", !isEditMode && "bg-gray-50")}
                    />
                    {!isEditMode && (
                      <Button variant="outline" className="rounded-l-none hover-scale" onClick={() => handleParentNotification(selectedStudent)}>
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
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="hover-scale">Cancel</Button>
                <Button onClick={handleSaveStudent} className="hover-scale">Save Changes</Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="hover-scale">Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default StudentsPage;
