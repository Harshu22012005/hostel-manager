
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bell, Calendar, Clock, FileText, AlertTriangle, Info } from 'lucide-react';

const StudentDashboard = () => {
  const { outpassRequests, complaints, announcements, menuItems } = useData();
  const { user } = useAuth();
  const studentId = user?.id;
  
  // Filter data relevant to the current student
  const userOutpasses = outpassRequests.filter(request => request.studentId === studentId);
  const userComplaints = complaints.filter(complaint => complaint.studentId === studentId);
  
  // Get today's menu - Using 'long' instead of 'lowercase'
  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const today = weekdays[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]; // Convert Sunday (0) to 6, and others to 0-5
  const todayMenu = menuItems.find(item => item.day === today);
  
  // Sort announcements by date (newest first)
  const sortedAnnouncements = [...announcements].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Card className="w-full sm:w-2/3 animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle>Welcome back, {(user as any)?.name}</CardTitle>
            <CardDescription>
              Room: {(user as any)?.roomNumber} | Roll Number: {(user as any)?.rollNumber}
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-hostel-blue" />
              Latest Announcements
            </h3>
            
            {sortedAnnouncements.length > 0 ? (
              <div className="space-y-4">
                {sortedAnnouncements.slice(0, 3).map((announcement) => (
                  <Alert key={announcement.id} variant={announcement.category === 'important' ? 'destructive' : 'default'}>
                    <div className="flex items-center gap-2">
                      {announcement.category === 'important' ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : announcement.category === 'event' ? (
                        <Calendar className="h-4 w-4" />
                      ) : (
                        <Info className="h-4 w-4" />
                      )}
                      <AlertTitle>{announcement.title}</AlertTitle>
                    </div>
                    <AlertDescription className="mt-2">
                      {announcement.content}
                    </AlertDescription>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {new Date(announcement.date).toLocaleDateString()}
                    </div>
                  </Alert>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No announcements at the moment.</p>
            )}
          </CardContent>
        </Card>
        
        <div className="w-full sm:w-1/3 space-y-4">
          <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Clock className="h-5 w-5 mr-2 text-hostel-blue" />
                Outpass Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-100 p-2 rounded">
                  <div className="text-2xl font-bold">
                    {userOutpasses.filter(o => o.status === 'pending').length}
                  </div>
                  <div className="text-xs text-gray-500">Pending</div>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <div className="text-2xl font-bold text-green-600">
                    {userOutpasses.filter(o => o.status === 'approved').length}
                  </div>
                  <div className="text-xs text-gray-500">Approved</div>
                </div>
                <div className="bg-red-50 p-2 rounded">
                  <div className="text-2xl font-bold text-red-600">
                    {userOutpasses.filter(o => o.status === 'rejected').length}
                  </div>
                  <div className="text-xs text-gray-500">Rejected</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <FileText className="h-5 w-5 mr-2 text-hostel-blue" />
                Today's Menu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {todayMenu ? (
                <>
                  <div>
                    <Badge variant="outline" className="mb-1">Breakfast</Badge>
                    <p className="text-sm">{todayMenu.breakfast.join(', ')}</p>
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-1">Lunch</Badge>
                    <p className="text-sm">{todayMenu.lunch.join(', ')}</p>
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-1">Dinner</Badge>
                    <p className="text-sm">{todayMenu.dinner.join(', ')}</p>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">Menu not available.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <CardTitle className="text-lg">Recent Outpass Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {userOutpasses.length > 0 ? (
              <div className="space-y-4">
                {userOutpasses.slice(0, 3).map((outpass) => (
                  <div key={outpass.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{outpass.reason}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(outpass.fromDate).toLocaleDateString()} to {new Date(outpass.toDate).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge
                      variant={
                        outpass.status === 'approved' 
                          ? 'default' 
                          : outpass.status === 'rejected' 
                            ? 'destructive' 
                            : 'outline'
                      }
                    >
                      {outpass.status.charAt(0).toUpperCase() + outpass.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No outpass requests yet.</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle className="text-lg">Complaint Status</CardTitle>
          </CardHeader>
          <CardContent>
            {userComplaints.length > 0 ? (
              <div className="space-y-4">
                {userComplaints.slice(0, 3).map((complaint) => (
                  <div key={complaint.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{complaint.category.charAt(0).toUpperCase() + complaint.category.slice(1)}</div>
                      <div className="text-sm text-gray-500">{complaint.description.substring(0, 50)}{complaint.description.length > 50 ? '...' : ''}</div>
                    </div>
                    <Badge
                      variant={
                        complaint.status === 'resolved' 
                          ? 'default' 
                          : complaint.status === 'in-progress' 
                            ? 'outline' 
                            : 'secondary'
                      }
                    >
                      {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No complaints submitted yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const MessDashboard = () => {
  const { mealAttendance, announcements } = useData();
  const { user } = useAuth();
  
  // Calculate today's attendance
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = mealAttendance.filter(record => record.date === today);
  
  // Sort announcements by date (newest first)
  const sortedAnnouncements = [...announcements].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Card className="w-full sm:w-2/3 animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle>Welcome back, {(user as any)?.name}</CardTitle>
            <CardDescription>
              Designation: {(user as any)?.designation}
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-hostel-blue" />
              Latest Announcements
            </h3>
            
            {sortedAnnouncements.length > 0 ? (
              <div className="space-y-4">
                {sortedAnnouncements.slice(0, 3).map((announcement) => (
                  <Alert key={announcement.id} variant={announcement.category === 'important' ? 'destructive' : 'default'}>
                    <div className="flex items-center gap-2">
                      {announcement.category === 'important' ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : announcement.category === 'event' ? (
                        <Calendar className="h-4 w-4" />
                      ) : (
                        <Info className="h-4 w-4" />
                      )}
                      <AlertTitle>{announcement.title}</AlertTitle>
                    </div>
                    <AlertDescription className="mt-2">
                      {announcement.content}
                    </AlertDescription>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {new Date(announcement.date).toLocaleDateString()}
                    </div>
                  </Alert>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No announcements at the moment.</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="w-full sm:w-1/3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Today's Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Breakfast</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-green-50 p-2 rounded text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {todayAttendance.filter(record => record.breakfast).length}
                    </div>
                    <div className="text-xs text-gray-500">Present</div>
                  </div>
                  <div className="bg-red-50 p-2 rounded text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {todayAttendance.filter(record => !record.breakfast).length}
                    </div>
                    <div className="text-xs text-gray-500">Absent</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Lunch</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-green-50 p-2 rounded text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {todayAttendance.filter(record => record.lunch).length}
                    </div>
                    <div className="text-xs text-gray-500">Present</div>
                  </div>
                  <div className="bg-red-50 p-2 rounded text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {todayAttendance.filter(record => !record.lunch).length}
                    </div>
                    <div className="text-xs text-gray-500">Absent</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Dinner</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-green-50 p-2 rounded text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {todayAttendance.filter(record => record.dinner).length}
                    </div>
                    <div className="text-xs text-gray-500">Present</div>
                  </div>
                  <div className="bg-red-50 p-2 rounded text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {todayAttendance.filter(record => !record.dinner).length}
                    </div>
                    <div className="text-xs text-gray-500">Absent</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const OfficeDashboard = () => {
  const { outpassRequests, complaints, announcements } = useData();
  const { user } = useAuth();
  
  // Calculate pending items
  const pendingOutpasses = outpassRequests.filter(req => req.status === 'pending');
  const pendingComplaints = complaints.filter(comp => comp.status === 'pending');
  
  // Sort announcements by date (newest first)
  const sortedAnnouncements = [...announcements].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Card className="w-full sm:w-2/3 animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle>Welcome back, {(user as any)?.name}</CardTitle>
            <CardDescription>
              Designation: {(user as any)?.designation}
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-hostel-blue" />
              Latest Announcements
            </h3>
            
            {sortedAnnouncements.length > 0 ? (
              <div className="space-y-4">
                {sortedAnnouncements.slice(0, 3).map((announcement) => (
                  <Alert key={announcement.id} variant={announcement.category === 'important' ? 'destructive' : 'default'}>
                    <div className="flex items-center gap-2">
                      {announcement.category === 'important' ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : announcement.category === 'event' ? (
                        <Calendar className="h-4 w-4" />
                      ) : (
                        <Info className="h-4 w-4" />
                      )}
                      <AlertTitle>{announcement.title}</AlertTitle>
                    </div>
                    <AlertDescription className="mt-2">
                      {announcement.content}
                    </AlertDescription>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {new Date(announcement.date).toLocaleDateString()}
                    </div>
                  </Alert>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No announcements at the moment.</p>
            )}
          </CardContent>
        </Card>
        
        <div className="w-full sm:w-1/3 space-y-4">
          <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Clock className="h-5 w-5 mr-2 text-hostel-blue" />
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div className="font-medium">Outpass Requests</div>
                  <Badge variant="outline">{pendingOutpasses.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div className="font-medium">Complaints</div>
                  <Badge variant="outline">{pendingComplaints.length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="text-lg">Recent Outpass Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingOutpasses.length > 0 ? (
              <div className="space-y-4">
                {pendingOutpasses.slice(0, 5).map((outpass) => (
                  <div key={outpass.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{outpass.studentName}</div>
                      <div className="text-sm">{outpass.reason}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(outpass.fromDate).toLocaleDateString()} to {new Date(outpass.toDate).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No pending outpass requests.</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <CardTitle className="text-lg">Recent Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingComplaints.length > 0 ? (
              <div className="space-y-4">
                {pendingComplaints.slice(0, 5).map((complaint) => (
                  <div key={complaint.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{complaint.studentName} - {complaint.roomNumber}</div>
                      <div className="text-sm">{complaint.category.charAt(0).toUpperCase() + complaint.category.slice(1)}</div>
                      <div className="text-xs text-gray-500">{complaint.description.substring(0, 50)}{complaint.description.length > 50 ? '...' : ''}</div>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No pending complaints.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  let dashboardContent;
  
  if (role === 'student') {
    dashboardContent = <StudentDashboard />;
  } else if (role === 'mess') {
    dashboardContent = <MessDashboard />;
  } else if (role === 'office') {
    dashboardContent = <OfficeDashboard />;
  } else {
    dashboardContent = <div>Unknown role</div>;
  }
  
  return (
    <DashboardLayout>
      {dashboardContent}
    </DashboardLayout>
  );
};

export default Dashboard;
