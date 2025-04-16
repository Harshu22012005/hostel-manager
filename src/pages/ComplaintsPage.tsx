
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Wrench, Info, AlertTriangle, CheckCircle, Clock, Activity, Eye } from 'lucide-react';

// Student View for Submitting and Viewing Complaints
const StudentComplaints = () => {
  const { user } = useAuth();
  const { complaints, addComplaint } = useData();
  const [category, setCategory] = useState<'maintenance' | 'mess' | 'other'>('maintenance');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      addComplaint({
        studentId: user?.id || '',
        studentName: (user as any)?.name || '',
        roomNumber: (user as any)?.roomNumber || '',
        category,
        description,
      });
      
      // Reset form
      setDescription('');
      setCategory('maintenance');
      setIsSubmitting(false);
    }, 1000);
  };
  
  // Filter complaints for the current student
  const userComplaints = complaints.filter(complaint => complaint.studentId === user?.id);
  
  // Sort by date (newest first)
  const sortedComplaints = [...userComplaints].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Group by status
  const pendingComplaints = sortedComplaints.filter(c => c.status === 'pending');
  const inProgressComplaints = sortedComplaints.filter(c => c.status === 'in-progress');
  const resolvedComplaints = sortedComplaints.filter(c => c.status === 'resolved');
  
  const getComplaintDetails = (id: string) => {
    return complaints.find(c => c.id === id);
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'maintenance':
        return <Wrench className="h-4 w-4 mr-2" />;
      case 'mess':
        return <Info className="h-4 w-4 mr-2" />;
      default:
        return <AlertTriangle className="h-4 w-4 mr-2" />;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'in-progress':
        return <Activity className="h-3 w-3 mr-1" />;
      default:
        return <Clock className="h-3 w-3 mr-1" />;
    }
  };
  
  const renderComplaintsList = (complaints: typeof sortedComplaints) => {
    if (complaints.length === 0) {
      return <p className="text-muted-foreground py-4">No complaints found.</p>;
    }
    
    return (
      <div className="space-y-4">
        {complaints.map((complaint) => (
          <Card key={complaint.id} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
                <div>
                  <div className="flex items-center">
                    {getCategoryIcon(complaint.category)}
                    <h3 className="font-medium">
                      {complaint.category.charAt(0).toUpperCase() + complaint.category.slice(1)} Issue
                    </h3>
                  </div>
                  <p className="text-sm mt-1">{complaint.description.substring(0, 100)}{complaint.description.length > 100 ? '...' : ''}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Submitted on {new Date(complaint.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 sm:mt-0">
                  <Badge
                    variant={
                      complaint.status === 'resolved' 
                        ? 'default' 
                        : complaint.status === 'in-progress' 
                          ? 'secondary' 
                          : 'outline'
                    }
                  >
                    {getStatusIcon(complaint.status)}
                    {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                  </Badge>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setSelectedComplaint(complaint.id);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Submit Complaint</CardTitle>
              <CardDescription>
                Report an issue related to hostel or mess
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={category}
                    onValueChange={(value) => setCategory(value as 'maintenance' | 'mess' | 'other')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="mess">Mess</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Please describe the issue in detail" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    rows={5}
                    required 
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>My Complaints</CardTitle>
              <CardDescription>
                Track the status of your submitted complaints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded text-center">
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-xl font-bold text-amber-500">{pendingComplaints.length}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded text-center">
                  <p className="text-sm text-gray-500">In Progress</p>
                  <p className="text-xl font-bold text-blue-500">{inProgressComplaints.length}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded text-center">
                  <p className="text-sm text-gray-500">Resolved</p>
                  <p className="text-xl font-bold text-green-600">{resolvedComplaints.length}</p>
                </div>
              </div>
              
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="animate-fade-in">
                  {renderComplaintsList(sortedComplaints)}
                </TabsContent>
                
                <TabsContent value="pending" className="animate-fade-in">
                  {renderComplaintsList(pendingComplaints)}
                </TabsContent>
                
                <TabsContent value="in-progress" className="animate-fade-in">
                  {renderComplaintsList(inProgressComplaints)}
                </TabsContent>
                
                <TabsContent value="resolved" className="animate-fade-in">
                  {renderComplaintsList(resolvedComplaints)}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Complaint Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          {selectedComplaint && (
            <>
              <DialogHeader>
                <DialogTitle>Complaint Details</DialogTitle>
                <DialogDescription>
                  Review the details of your complaint
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <div className="flex items-center mt-1">
                    {getCategoryIcon(getComplaintDetails(selectedComplaint)?.category || '')}
                    <p className="font-medium">
                      {getComplaintDetails(selectedComplaint)?.category.charAt(0).toUpperCase() + 
                        (getComplaintDetails(selectedComplaint)?.category.slice(1) || '')}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="font-medium mt-1">{getComplaintDetails(selectedComplaint)?.description}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge
                    variant={
                      getComplaintDetails(selectedComplaint)?.status === 'resolved' 
                        ? 'default' 
                        : getComplaintDetails(selectedComplaint)?.status === 'in-progress' 
                          ? 'secondary' 
                          : 'outline'
                    }
                    className="mt-1"
                  >
                    {getStatusIcon(getComplaintDetails(selectedComplaint)?.status || '')}
                    {(getComplaintDetails(selectedComplaint)?.status || '').charAt(0).toUpperCase() + 
                      (getComplaintDetails(selectedComplaint)?.status || '').slice(1)}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Submitted On</p>
                  <p className="font-medium mt-1">
                    {new Date(getComplaintDetails(selectedComplaint)?.createdAt || '').toLocaleDateString()}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Office View for Managing Complaints
const OfficeComplaints = () => {
  const { complaints, updateComplaint } = useData();
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Sort by date (newest first)
  const sortedComplaints = [...complaints].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Group by status
  const pendingComplaints = sortedComplaints.filter(c => c.status === 'pending');
  const inProgressComplaints = sortedComplaints.filter(c => c.status === 'in-progress');
  const resolvedComplaints = sortedComplaints.filter(c => c.status === 'resolved');
  
  const getComplaintDetails = (id: string) => {
    return complaints.find(c => c.id === id);
  };
  
  const handleUpdateStatus = (id: string, status: 'pending' | 'in-progress' | 'resolved') => {
    updateComplaint(id, status);
    setIsDialogOpen(false);
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'maintenance':
        return <Wrench className="h-4 w-4 mr-2" />;
      case 'mess':
        return <Info className="h-4 w-4 mr-2" />;
      default:
        return <AlertTriangle className="h-4 w-4 mr-2" />;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'in-progress':
        return <Activity className="h-3 w-3 mr-1" />;
      default:
        return <Clock className="h-3 w-3 mr-1" />;
    }
  };
  
  const renderComplaintsList = (complaints: typeof sortedComplaints) => {
    if (complaints.length === 0) {
      return <p className="text-muted-foreground py-4">No complaints found.</p>;
    }
    
    return (
      <div className="space-y-4">
        {complaints.map((complaint) => (
          <Card key={complaint.id} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
                <div>
                  <div className="flex items-center">
                    {getCategoryIcon(complaint.category)}
                    <h3 className="font-medium">
                      {complaint.category.charAt(0).toUpperCase() + complaint.category.slice(1)} Issue
                    </h3>
                  </div>
                  <div className="flex items-center mt-1 mb-1">
                    <p className="text-sm font-medium">{complaint.studentName}</p>
                    <span className="mx-2 text-gray-400">•</span>
                    <p className="text-sm text-gray-500">Room: {complaint.roomNumber}</p>
                  </div>
                  <p className="text-sm">{complaint.description.substring(0, 100)}{complaint.description.length > 100 ? '...' : ''}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Submitted on {new Date(complaint.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 sm:mt-0">
                  <Badge
                    variant={
                      complaint.status === 'resolved' 
                        ? 'default' 
                        : complaint.status === 'in-progress' 
                          ? 'secondary' 
                          : 'outline'
                    }
                  >
                    {getStatusIcon(complaint.status)}
                    {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                  </Badge>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setSelectedComplaint(complaint.id);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">Pending</p>
            <h3 className="text-3xl font-bold text-amber-500">{pendingComplaints.length}</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">In Progress</p>
            <h3 className="text-3xl font-bold text-blue-500">{inProgressComplaints.length}</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">Resolved</p>
            <h3 className="text-3xl font-bold text-green-600">{resolvedComplaints.length}</h3>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Complaints</CardTitle>
          <CardDescription>
            Review and update the status of student complaints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="animate-fade-in">
              {renderComplaintsList(pendingComplaints)}
            </TabsContent>
            
            <TabsContent value="in-progress" className="animate-fade-in">
              {renderComplaintsList(inProgressComplaints)}
            </TabsContent>
            
            <TabsContent value="resolved" className="animate-fade-in">
              {renderComplaintsList(resolvedComplaints)}
            </TabsContent>
            
            <TabsContent value="all" className="animate-fade-in">
              {renderComplaintsList(sortedComplaints)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Complaint Management Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          {selectedComplaint && (
            <>
              <DialogHeader>
                <DialogTitle>Manage Complaint</DialogTitle>
                <DialogDescription>
                  Review and update the status of this complaint
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Student Name</p>
                    <p className="font-medium">{getComplaintDetails(selectedComplaint)?.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Room Number</p>
                    <p className="font-medium">{getComplaintDetails(selectedComplaint)?.roomNumber}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <div className="flex items-center mt-1">
                    {getCategoryIcon(getComplaintDetails(selectedComplaint)?.category || '')}
                    <p className="font-medium">
                      {getComplaintDetails(selectedComplaint)?.category.charAt(0).toUpperCase() + 
                        (getComplaintDetails(selectedComplaint)?.category.slice(1) || '')}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="font-medium mt-1">{getComplaintDetails(selectedComplaint)?.description}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Current Status</p>
                  <Badge
                    variant={
                      getComplaintDetails(selectedComplaint)?.status === 'resolved' 
                        ? 'default' 
                        : getComplaintDetails(selectedComplaint)?.status === 'in-progress' 
                          ? 'secondary' 
                          : 'outline'
                    }
                    className="mt-1"
                  >
                    {getStatusIcon(getComplaintDetails(selectedComplaint)?.status || '')}
                    {(getComplaintDetails(selectedComplaint)?.status || '').charAt(0).toUpperCase() + 
                      (getComplaintDetails(selectedComplaint)?.status || '').slice(1)}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Submitted On</p>
                  <p className="font-medium mt-1">
                    {new Date(getComplaintDetails(selectedComplaint)?.createdAt || '').toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <div className="w-full space-y-2">
                  <p className="text-sm font-medium">Update Status</p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleUpdateStatus(selectedComplaint, 'pending')}
                      disabled={getComplaintDetails(selectedComplaint)?.status === 'pending'}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Pending
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="flex-1"
                      onClick={() => handleUpdateStatus(selectedComplaint, 'in-progress')}
                      disabled={getComplaintDetails(selectedComplaint)?.status === 'in-progress'}
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      In Progress
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={() => handleUpdateStatus(selectedComplaint, 'resolved')}
                      disabled={getComplaintDetails(selectedComplaint)?.status === 'resolved'}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Resolved
                    </Button>
                  </div>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ComplaintsPage = () => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Complaints Management</h1>
        <p className="text-gray-500">
          {role === 'student' 
            ? 'Submit and track your complaints' 
            : 'Manage and resolve student complaints'}
        </p>
      </div>
      
      {role === 'student' ? <StudentComplaints /> : <OfficeComplaints />}
    </DashboardLayout>
  );
};

export default ComplaintsPage;
