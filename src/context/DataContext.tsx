import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { OutpassRequest, Complaint, MenuItem, Announcement, MealAttendance } from '../types';
import { useToast } from '@/components/ui/use-toast';

// Mock data with Maharashtrian names
const initialOutpassRequests: OutpassRequest[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Harshad Patil',
    roomNumber: 'A-101',
    reason: 'Family function',
    fromDate: '2025-04-20',
    toDate: '2025-04-22',
    status: 'pending',
    createdAt: '2025-04-15T10:30:00Z',
  },
  {
    id: '2',
    studentId: '3',
    studentName: 'Diya Kulkarni',
    roomNumber: 'B-205',
    reason: 'Medical appointment',
    fromDate: '2025-04-18',
    toDate: '2025-04-19',
    status: 'approved',
    createdAt: '2025-04-14T08:15:00Z',
  },
  {
    id: '3',
    studentId: '5',
    studentName: 'Aditya Deshmukh',
    roomNumber: 'C-310',
    reason: 'Interview',
    fromDate: '2025-04-21',
    toDate: '2025-04-21',
    status: 'rejected',
    createdAt: '2025-04-13T14:45:00Z',
  },
  {
    id: '4',
    studentId: '7',
    studentName: 'Pavan Joshi',
    roomNumber: 'A-205',
    reason: 'Family emergency',
    fromDate: '2025-04-22',
    toDate: '2025-04-24',
    status: 'pending',
    createdAt: '2025-04-16T09:15:00Z',
  },
  {
    id: '5',
    studentId: '9',
    studentName: 'Akshay Wagh',
    roomNumber: 'D-110',
    reason: 'Sports competition',
    fromDate: '2025-04-25',
    toDate: '2025-04-28',
    status: 'pending',
    createdAt: '2025-04-16T11:45:00Z',
  },
];

const initialComplaints: Complaint[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Harshad Patil',
    roomNumber: 'A-101',
    category: 'maintenance',
    description: 'Leaking tap in bathroom',
    status: 'pending',
    createdAt: '2025-04-14T09:20:00Z',
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Mukesh Shinde',
    roomNumber: 'A-102',
    category: 'mess',
    description: 'Food quality has degraded in the last week',
    status: 'in-progress',
    createdAt: '2025-04-13T11:45:00Z',
  },
  {
    id: '3',
    studentId: '4',
    studentName: 'Priya Gaikwad',
    roomNumber: 'B-210',
    category: 'other',
    description: 'Excessive noise from neighboring room',
    status: 'resolved',
    createdAt: '2025-04-10T16:30:00Z',
  },
  {
    id: '4',
    studentId: '6',
    studentName: 'Tejas Jadhav',
    roomNumber: 'B-215',
    category: 'maintenance',
    description: 'Broken window in the room',
    status: 'pending',
    createdAt: '2025-04-15T14:20:00Z',
  },
  {
    id: '5',
    studentId: '8',
    studentName: 'Swati Bhosale',
    roomNumber: 'C-120',
    category: 'mess',
    description: 'Need more vegetarian options in dinner',
    status: 'in-progress',
    createdAt: '2025-04-16T10:30:00Z',
  },
];

const initialMenuItems: MenuItem[] = [
  {
    day: 'monday',
    breakfast: ['Bread & Butter', 'Boiled Eggs', 'Tea/Coffee'],
    lunch: ['Rice', 'Dal', 'Mixed Vegetables', 'Curd'],
    dinner: ['Chapati', 'Paneer Curry', 'Salad', 'Fruit Custard'],
  },
  {
    day: 'tuesday',
    breakfast: ['Idli & Sambar', 'Fruit Bowl', 'Tea/Coffee'],
    lunch: ['Jeera Rice', 'Rajma', 'Aloo Gobi', 'Papad'],
    dinner: ['Paratha', 'Chana Masala', 'Raita', 'Ice Cream'],
  },
  {
    day: 'wednesday',
    breakfast: ['Upma', 'Boiled Eggs', 'Tea/Coffee'],
    lunch: ['Pulao', 'Dal Tadka', 'Bhindi Fry', 'Curd'],
    dinner: ['Chapati', 'Egg Curry', 'Salad', 'Kheer'],
  },
  {
    day: 'thursday',
    breakfast: ['Poha', 'Bananas', 'Tea/Coffee'],
    lunch: ['Rice', 'Sambar', 'Cabbage Poriyal', 'Papad'],
    dinner: ['Chapati', 'Mixed Veg Curry', 'Raita', 'Fruit'],
  },
  {
    day: 'friday',
    breakfast: ['Aloo Paratha', 'Curd', 'Tea/Coffee'],
    lunch: ['Veg Biryani', 'Soya Curry', 'Boondi Raita', 'Pickle'],
    dinner: ['Chapati', 'Mutter Paneer', 'Salad', 'Gulab Jamun'],
  },
  {
    day: 'saturday',
    breakfast: ['Chole Bhature', 'Fruit Bowl', 'Tea/Coffee'],
    lunch: ['Rice', 'Dal Fry', 'Aloo Mutter', 'Curd'],
    dinner: ['Poori', 'Malai Kofta', 'Salad', 'Sewai'],
  },
  {
    day: 'sunday',
    breakfast: ['Dosa', 'Coconut Chutney', 'Tea/Coffee'],
    lunch: ['Veg Pulao', 'Kadhai Paneer', 'Boondi Raita', 'Papad'],
    dinner: ['Butter Naan', 'Butter Chicken/Paneer', 'Salad', 'Ice Cream'],
  },
];

const initialAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Water Supply Interruption',
    content: 'There will be a scheduled water supply interruption on April 20th from 10 AM to 2 PM due to maintenance work.',
    date: '2025-04-15',
    category: 'important',
  },
  {
    id: '2',
    title: 'Cultural Night Event',
    content: 'Join us for the annual cultural night event in the hostel courtyard on April 25th at 6 PM. All students are encouraged to participate.',
    date: '2025-04-16',
    category: 'event',
  },
  {
    id: '3',
    title: 'New Gym Equipment',
    content: 'We have installed new gym equipment in the hostel gymnasium. The gym will be closed on April 18th for installation.',
    date: '2025-04-14',
    category: 'general',
  },
  {
    id: '4',
    title: 'Ganesh Festival Celebration',
    content: 'We will be celebrating Ganesh Festival in the hostel from September 10th. All students are invited to participate in the decoration and puja ceremonies.',
    date: '2025-04-16',
    category: 'event',
  },
  {
    id: '5',
    title: 'Academic Achievement Awards',
    content: 'Congratulations to Harshad Patil, Diya Kulkarni, and Aditya Deshmukh for their outstanding academic performance. Awards ceremony on April 30th.',
    date: '2025-04-17',
    category: 'general',
  },
];

const initialMealAttendance: MealAttendance[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Harshad Patil',
    date: '2025-04-16',
    breakfast: true,
    lunch: true,
    dinner: false,
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Mukesh Shinde',
    date: '2025-04-16',
    breakfast: true,
    lunch: false,
    dinner: true,
  },
  {
    id: '3',
    studentId: '3',
    studentName: 'Diya Kulkarni',
    date: '2025-04-16',
    breakfast: false,
    lunch: true,
    dinner: true,
  },
  {
    id: '4',
    studentId: '4',
    studentName: 'Priya Gaikwad',
    date: '2025-04-16',
    breakfast: true,
    lunch: true,
    dinner: true,
  },
  {
    id: '5',
    studentId: '5',
    studentName: 'Aditya Deshmukh',
    date: '2025-04-16',
    breakfast: false,
    lunch: false,
    dinner: true,
  },
  {
    id: '6',
    studentId: '6',
    studentName: 'Tejas Jadhav',
    date: '2025-04-16',
    breakfast: true,
    lunch: true,
    dinner: false,
  },
  {
    id: '7',
    studentId: '7',
    studentName: 'Pavan Joshi',
    date: '2025-04-16',
    breakfast: true,
    lunch: false,
    dinner: false,
  },
  {
    id: '8',
    studentId: '8',
    studentName: 'Swati Bhosale',
    date: '2025-04-16',
    breakfast: false,
    lunch: true,
    dinner: true,
  },
  {
    id: '9',
    studentId: '9',
    studentName: 'Akshay Wagh',
    date: '2025-04-16',
    breakfast: true,
    lunch: true,
    dinner: true,
  },
];

interface DataContextType {
  outpassRequests: OutpassRequest[];
  complaints: Complaint[];
  menuItems: MenuItem[];
  announcements: Announcement[];
  mealAttendance: MealAttendance[];
  addOutpassRequest: (request: Omit<OutpassRequest, 'id' | 'status' | 'createdAt'>) => void;
  updateOutpassRequest: (id: string, status: 'approved' | 'rejected') => void;
  addComplaint: (complaint: Omit<Complaint, 'id' | 'status' | 'createdAt'>) => void;
  updateComplaint: (id: string, status: 'pending' | 'in-progress' | 'resolved') => void;
  updateMenuItems: (day: MenuItem['day'], meal: 'breakfast' | 'lunch' | 'dinner', items: string[]) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  updateMealAttendance: (studentId: string, date: string, meal: 'breakfast' | 'lunch' | 'dinner', attended: boolean) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [outpassRequests, setOutpassRequests] = useState<OutpassRequest[]>(initialOutpassRequests);
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [mealAttendance, setMealAttendance] = useState<MealAttendance[]>(initialMealAttendance);
  const { toast } = useToast();

  useEffect(() => {
    const storedOutpass = localStorage.getItem('hostelOutpassRequests');
    const storedComplaints = localStorage.getItem('hostelComplaints');
    const storedMenuItems = localStorage.getItem('hostelMenuItems');
    const storedAnnouncements = localStorage.getItem('hostelAnnouncements');
    const storedMealAttendance = localStorage.getItem('hostelMealAttendance');
    
    if (storedOutpass) setOutpassRequests(JSON.parse(storedOutpass));
    if (storedComplaints) setComplaints(JSON.parse(storedComplaints));
    if (storedMenuItems) setMenuItems(JSON.parse(storedMenuItems));
    if (storedAnnouncements) setAnnouncements(JSON.parse(storedAnnouncements));
    if (storedMealAttendance) setMealAttendance(JSON.parse(storedMealAttendance));
  }, []);

  useEffect(() => {
    localStorage.setItem('hostelOutpassRequests', JSON.stringify(outpassRequests));
  }, [outpassRequests]);

  useEffect(() => {
    localStorage.setItem('hostelComplaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('hostelMenuItems', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('hostelAnnouncements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('hostelMealAttendance', JSON.stringify(mealAttendance));
  }, [mealAttendance]);

  const addOutpassRequest = (request: Omit<OutpassRequest, 'id' | 'status' | 'createdAt'>) => {
    const newRequest: OutpassRequest = {
      ...request,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    setOutpassRequests(prev => [...prev, newRequest]);
    
    toast({
      title: "Outpass Request Submitted",
      description: "Your outpass request has been submitted successfully.",
    });
  };

  const updateOutpassRequest = (id: string, status: 'approved' | 'rejected') => {
    setOutpassRequests(prev => 
      prev.map(request => 
        request.id === id ? { ...request, status } : request
      )
    );
    
    toast({
      title: `Outpass Request ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      description: `The outpass request has been ${status}.`,
    });
  };

  const addComplaint = (complaint: Omit<Complaint, 'id' | 'status' | 'createdAt'>) => {
    const newComplaint: Complaint = {
      ...complaint,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    setComplaints(prev => [...prev, newComplaint]);
    
    toast({
      title: "Complaint Submitted",
      description: "Your complaint has been submitted successfully.",
    });
  };

  const updateComplaint = (id: string, status: 'pending' | 'in-progress' | 'resolved') => {
    setComplaints(prev => 
      prev.map(complaint => 
        complaint.id === id ? { ...complaint, status } : complaint
      )
    );
    
    toast({
      title: "Complaint Updated",
      description: `The complaint status has been updated to ${status}.`,
    });
  };

  const updateMenuItems = (day: MenuItem['day'], meal: 'breakfast' | 'lunch' | 'dinner', items: string[]) => {
    setMenuItems(prev => 
      prev.map(item => 
        item.day === day ? { ...item, [meal]: items } : item
      )
    );
    
    toast({
      title: "Menu Updated",
      description: `The ${meal} menu for ${day} has been updated.`,
    });
  };

  const addAnnouncement = (announcement: Omit<Announcement, 'id' | 'date'>) => {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
    };
    
    setAnnouncements(prev => [...prev, newAnnouncement]);
    
    toast({
      title: "Announcement Added",
      description: "Your announcement has been added successfully.",
    });
  };

  const updateMealAttendance = (studentId: string, date: string, meal: 'breakfast' | 'lunch' | 'dinner', attended: boolean) => {
    const existingRecord = mealAttendance.find(
      record => record.studentId === studentId && record.date === date
    );
    
    if (existingRecord) {
      setMealAttendance(prev => 
        prev.map(record => 
          record.studentId === studentId && record.date === date
            ? { ...record, [meal]: attended }
            : record
        )
      );
    } else {
      const student = outpassRequests.find(request => request.studentId === studentId);
      const studentName = student?.studentName || 'Unknown Student';
      
      const newRecord: MealAttendance = {
        id: Date.now().toString(),
        studentId,
        studentName,
        date,
        breakfast: meal === 'breakfast' ? attended : false,
        lunch: meal === 'lunch' ? attended : false,
        dinner: meal === 'dinner' ? attended : false,
      };
      
      setMealAttendance(prev => [...prev, newRecord]);
    }
    
    toast({
      title: "Meal Attendance Updated",
      description: `${meal} attendance has been marked.`,
    });
  };

  return (
    <DataContext.Provider
      value={{
        outpassRequests,
        complaints,
        menuItems,
        announcements,
        mealAttendance,
        addOutpassRequest,
        updateOutpassRequest,
        addComplaint,
        updateComplaint,
        updateMenuItems,
        addAnnouncement,
        updateMealAttendance,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
