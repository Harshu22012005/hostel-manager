
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Clock, CheckCircle, XCircle } from 'lucide-react';

const OutpassRequest = () => {
  const { user } = useAuth();
  const { addOutpassRequest } = useData();
  const [reason, setReason] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      addOutpassRequest({
        studentId: user?.id || '',
        studentName: (user as any)?.name || '',
        roomNumber: (user as any)?.roomNumber || '',
        reason,
        fromDate,
        toDate,
      });
      
      // Reset form
      setReason('');
      setFromDate('');
      setToDate('');
      setIsSubmitting(false);
    }, 1000);
  };
  
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Outpass</CardTitle>
        <CardDescription>
          Submit a new outpass request for approval
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Leave</Label>
            <Textarea 
              id="reason" 
              placeholder="Please provide a detailed reason for your leave" 
              value={reason} 
              onChange={(e) => setReason(e.target.value)} 
              required 
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromDate">From Date</Label>
              <Input 
                id="fromDate" 
                type="date" 
                min={today}
                value={fromDate} 
                onChange={(e) => setFromDate(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="toDate">To Date</Label>
              <Input 
                id="toDate" 
                type="date" 
                min={fromDate || today}
                value={toDate} 
                onChange={(e) => setToDate(e.target.value)} 
                required 
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const OutpassHistory = () => {
  const { user } = useAuth();
  const { outpassRequests } = useData();
  const studentId = user?.id;
  
  // Filter outpasses for the current student
  const userOutpasses = outpassRequests.filter(request => request.studentId === studentId);
  
  // Sort by date (newest first)
  const sortedOutpasses = [...userOutpasses].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Group by status
  const pendingOutpasses = sortedOutpasses.filter(o => o.status === 'pending');
  const approvedOutpasses = sortedOutpasses.filter(o => o.status === 'approved');
  const rejectedOutpasses = sortedOutpasses.filter(o => o.status === 'rejected');
  
  const renderOutpassList = (outpasses: typeof sortedOutpasses) => {
    if (outpasses.length === 0) {
      return <p className="text-muted-foreground py-4">No outpass requests found.</p>;
    }
    
    return (
      <div className="space-y-4">
        {outpasses.map((outpass) => (
          <Card key={outpass.id}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between gap-2">
                <div>
                  <h3 className="font-medium">{outpass.reason}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(outpass.fromDate).toLocaleDateString()} to {new Date(outpass.toDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Requested on {new Date(outpass.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-start">
                  <Badge
                    variant={
                      outpass.status === 'approved' 
                        ? 'default' 
                        : outpass.status === 'rejected' 
                          ? 'destructive' 
                          : 'outline'
                    }
                    className="ml-auto"
                  >
                    {outpass.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {outpass.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                    {outpass.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                    {outpass.status.charAt(0).toUpperCase() + outpass.status.slice(1)}
                  </Badge>
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
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">Pending</p>
            <h3 className="text-3xl font-bold text-amber-500">{pendingOutpasses.length}</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">Approved</p>
            <h3 className="text-3xl font-bold text-green-600">{approvedOutpasses.length}</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">Rejected</p>
            <h3 className="text-3xl font-bold text-red-600">{rejectedOutpasses.length}</h3>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          {renderOutpassList(sortedOutpasses)}
        </TabsContent>
        
        <TabsContent value="pending" className="mt-4">
          {renderOutpassList(pendingOutpasses)}
        </TabsContent>
        
        <TabsContent value="approved" className="mt-4">
          {renderOutpassList(approvedOutpasses)}
        </TabsContent>
        
        <TabsContent value="rejected" className="mt-4">
          {renderOutpassList(rejectedOutpasses)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const OutpassPage = () => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated || role !== 'student') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, role, navigate]);
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Outpass Management</h1>
        <p className="text-gray-500">Request and track your outpass applications</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <OutpassRequest />
        </div>
        
        <div className="md:col-span-2">
          <OutpassHistory />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OutpassPage;
