
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Bell, AlertTriangle, Calendar, Info, Trash2, MessageSquare } from 'lucide-react';

const AnnouncementsPage = () => {
  const { isAuthenticated, role } = useAuth();
  const { announcements, addAnnouncement } = useData();
  const navigate = useNavigate();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'general' | 'important' | 'event'>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated || role !== 'office') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, role, navigate]);
  
  // Sort announcements by date (newest first)
  const sortedAnnouncements = [...announcements].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      addAnnouncement({
        title,
        content,
        category,
      });
      
      // Reset form
      setTitle('');
      setContent('');
      setCategory('general');
      setIsSubmitting(false);
      setShowCreateDialog(false);
    }, 1000);
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
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'important':
        return 'bg-red-50 border-red-200';
      case 'event':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };
  
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'important':
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Important
          </Badge>
        );
      case 'event':
        return (
          <Badge variant="default" className="bg-green-500">
            <Calendar className="h-3 w-3 mr-1" />
            Event
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Info className="h-3 w-3 mr-1" />
            General
          </Badge>
        );
    }
  };
  
  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Announcements</h1>
          <p className="text-gray-500">Create and manage hostel announcements</p>
        </div>
        
        <Button onClick={() => setShowCreateDialog(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Announcement
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-hostel-blue" />
            Recent Announcements
          </CardTitle>
          <CardDescription>
            All announcements will be visible to students and hostel staff
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedAnnouncements.length > 0 ? (
              sortedAnnouncements.map((announcement) => (
                <Alert key={announcement.id} className={`${getCategoryColor(announcement.category)} border`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(announcement.category)}
                      <AlertTitle>{announcement.title}</AlertTitle>
                    </div>
                    {getCategoryBadge(announcement.category)}
                  </div>
                  <AlertDescription className="mt-2">
                    {announcement.content}
                  </AlertDescription>
                  <div className="mt-2 text-sm text-gray-500 flex items-center justify-between">
                    <span>Posted on {new Date(announcement.date).toLocaleDateString()}</span>
                    <Button variant="ghost" size="sm" className="h-7 text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Alert>
              ))
            ) : (
              <p className="text-muted-foreground py-4">No announcements yet. Create your first announcement.</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Create Announcement Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Announcement</DialogTitle>
            <DialogDescription>
              Create a new announcement for students and hostel staff
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                placeholder="Enter announcement title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as 'general' | 'important' | 'event')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">
                    <div className="flex items-center">
                      <Info className="h-4 w-4 mr-2 text-blue-500" />
                      General
                    </div>
                  </SelectItem>
                  <SelectItem value="important">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                      Important
                    </div>
                  </SelectItem>
                  <SelectItem value="event">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-green-500" />
                      Event
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea 
                id="content" 
                placeholder="Enter announcement content" 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                rows={5}
                required 
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Announcement'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AnnouncementsPage;
