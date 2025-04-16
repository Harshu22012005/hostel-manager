
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

const OutpassRequests = () => {
  const { isAuthenticated, role } = useAuth();
  const { outpassRequests, updateOutpassRequest } = useData();
  const navigate = useNavigate();
  const [selectedOutpass, setSelectedOutpass] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated || role !== 'office') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, role, navigate]);
  
  // Sort by date (newest first)
  const sortedOutpasses = [...outpassRequests].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Group by status
  const pendingOutpasses = sortedOutpasses.filter(o => o.status === 'pending');
  const approvedOutpasses = sortedOutpasses.filter(o => o.status === 'approved');
  const rejectedOutpasses = sortedOutpasses.filter(o => o.status === 'rejected');
  
  const handleApproval = (id: string, status: 'approved' | 'rejected') => {
    updateOutpassRequest(id, status);
    setIsDialogOpen(false);
  };
  
  const getOutpassDetails = (id: string) => {
    return outpassRequests.find(o => o.id === id);
  };
  
  const renderOutpassList = (outpasses: typeof sortedOutpasses) => {
    if (outpasses.length === 0) {
      return <p className="text-muted-foreground py-4">No outpass requests found.</p>;
    }
    
    return (
      <div className="space-y-4">
        {outpasses.map((outpass) => (
          <Card key={outpass.id} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium">{outpass.studentName}</h3>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-sm text-gray-500">Room: {outpass.roomNumber}</span>
                  </div>
                  <p className="text-sm mt-1">{outpass.reason}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(outpass.fromDate).toLocaleDateString()} to {new Date(outpass.toDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Requested on {new Date(outpass.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 sm:mt-0">
                  <Badge
                    variant={
                      outpass.status === 'approved' 
                        ? 'default' 
                        : outpass.status === 'rejected' 
                          ? 'destructive' 
                          : 'outline'
                    }
                  >
                    {outpass.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {outpass.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                    {outpass.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                    {outpass.status.charAt(0).toUpperCase() + outpass.status.slice(1)}
                  </Badge>
                  
                  {outpass.status === 'pending' ? (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          setSelectedOutpass(outpass.id);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Review
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        setSelectedOutpass(outpass.id);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Outpass Requests</h1>
        <p className="text-gray-500">Review and manage student outpass requests</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
      
      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="animate-fade-in">
          {renderOutpassList(pendingOutpasses)}
        </TabsContent>
        
        <TabsContent value="approved" className="animate-fade-in">
          {renderOutpassList(approvedOutpasses)}
        </TabsContent>
        
        <TabsContent value="rejected" className="animate-fade-in">
          {renderOutpassList(rejectedOutpasses)}
        </TabsContent>
        
        <TabsContent value="all" className="animate-fade-in">
          {renderOutpassList(sortedOutpasses)}
        </TabsContent>
      </Tabs>
      
      {/* Outpass Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          {selectedOutpass && (
            <>
              <DialogHeader>
                <DialogTitle>Outpass Request Details</DialogTitle>
                <DialogDescription>
                  Review the details of this outpass request
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Student Name</p>
                    <p className="font-medium">{getOutpassDetails(selectedOutpass)?.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Room Number</p>
                    <p className="font-medium">{getOutpassDetails(selectedOutpass)?.roomNumber}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Reason for Leave</p>
                  <p className="font-medium">{getOutpassDetails(selectedOutpass)?.reason}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">From Date</p>
                    <p className="font-medium">{new Date(getOutpassDetails(selectedOutpass)?.fromDate || '').toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">To Date</p>
                    <p className="font-medium">{new Date(getOutpassDetails(selectedOutpass)?.toDate || '').toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge
                    variant={
                      getOutpassDetails(selectedOutpass)?.status === 'approved' 
                        ? 'default' 
                        : getOutpassDetails(selectedOutpass)?.status === 'rejected' 
                          ? 'destructive' 
                          : 'outline'
                    }
                    className="mt-1"
                  >
                    {(getOutpassDetails(selectedOutpass)?.status || '').charAt(0).toUpperCase() + (getOutpassDetails(selectedOutpass)?.status || '').slice(1)}
                  </Badge>
                </div>
              </div>
              
              {getOutpassDetails(selectedOutpass)?.status === 'pending' && (
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => handleApproval(selectedOutpass, 'rejected')}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button 
                    onClick={() => handleApproval(selectedOutpass, 'approved')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default OutpassRequests;
