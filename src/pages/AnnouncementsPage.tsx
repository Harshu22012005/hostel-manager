
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Bell, Calendar, Info, AlertTriangle, PlusCircle, Edit, Trash2 } from 'lucide-react';

const AnnouncementsPage = () => {
  const { isAuthenticated, role } = useAuth();
  const { announcements, addAnnouncement } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'general' | 'important' | 'event'>('general');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sendNotification, setSendNotification] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>(null);
  
  useEffect(() => {
    if (!isAuthenticated || (role !== 'mess' && role !== 'office')) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, role, navigate]);
  
  // Sort announcements by date (newest first)
  const sortedAnnouncements = [...announcements].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const handleAddAnnouncement = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }
    
    addAnnouncement({
      title,
      content,
      category,
    });
    
    // Reset form
    setTitle('');
    setContent('');
    setCategory('general');
    setSendNotification(false);
    setIsDialogOpen(false);
    
    if (sendNotification) {
      toast({
        title: "Notifications Sent",
        description: "Students have been notified about the new announcement",
      });
    }
  };
  
  const handleDeleteAnnouncement = (id: string) => {
    setSelectedAnnouncementId(id);
    setIsConfirmDialogOpen(true);
  };
  
  const confirmDelete = () => {
    // In a real app, this would connect to an API to delete the announcement
    toast({
      title: "Not Implemented",
      description: "This feature would delete the announcement in a real application",
      variant: "destructive",
    });
    setIsConfirmDialogOpen(false);
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'important':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'important':
        return <Badge variant="destructive">Important</Badge>;
      case 'event':
        return <Badge variant="default" className="bg-green-500">Event</Badge>;
      default:
        return <Badge variant="secondary">General</Badge>;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Announcements</h1>
        <p className="text-gray-500">Create and manage hostel announcements</p>
      </div>
      
      <div className="flex justify-end mb-6">
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Announcement
        </Button>
      </div>
      
      <div className="space-y-4">
        {sortedAnnouncements.length > 0 ? (
          sortedAnnouncements.map((announcement) => (
            <Card key={announcement.id} className="animate-fade-in">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-2">
                    {getCategoryIcon(announcement.category)}
                    <div>
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      <CardDescription>
                        Posted on {new Date(announcement.date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getCategoryBadge(announcement.category)}
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500"
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                <p className="text-gray-700 whitespace-pre-line">{announcement.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500 text-center">No announcements yet</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsDialogOpen(true)}
              >
                Create First Announcement
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Add Announcement Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Announcement</DialogTitle>
            <DialogDescription>
              Add a new announcement for the hostel. This will be visible to all students.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                placeholder="Announcement title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={category} 
                onValueChange={(value: any) => setCategory(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="important">Important</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea 
                id="content" 
                placeholder="Announcement details" 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                rows={5}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="notification" 
                checked={sendNotification} 
                onCheckedChange={setSendNotification}
              />
              <Label htmlFor="notification">Send notification to students</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddAnnouncement}>Publish Announcement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirm Delete Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this announcement? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AnnouncementsPage;
