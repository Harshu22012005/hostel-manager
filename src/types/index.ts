
export type UserRole = 'student' | 'mess' | 'office';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Student extends User {
  role: 'student';
  roomNumber: string;
  rollNumber: string;
  parentContact: string;
}

export interface MessAuthority extends User {
  role: 'mess';
  designation: string;
}

export interface HostelOffice extends User {
  role: 'office';
  designation: string;
}

export interface OutpassRequest {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  reason: string;
  fromDate: string;
  toDate: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  category: 'maintenance' | 'mess' | 'other';
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: string;
}

export interface MenuItem {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  breakfast: string[];
  lunch: string[];
  dinner: string[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'general' | 'important' | 'event';
}

export interface MealAttendance {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}
