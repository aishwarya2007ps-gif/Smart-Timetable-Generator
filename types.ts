// Database types matching Supabase schema

export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  username: string;
  role: UserRole;
  created_at: string;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface TimetableEntry {
  id: string;
  user_id: string;
  subject: string;
  teacher_name: string;
  section: string;
  day: DayOfWeek;
  time_slot: string;
  classroom_id?: string | null;
  subject_id?: string | null;
  created_at: string;
}

export interface TimetableEntryInput {
  subject: string;
  teacher_name: string;
  section: string;
  day: DayOfWeek;
  time_slot: string;
  classroom_id?: string | null;
  subject_id?: string | null;
}

export interface UserTimeSlot {
  id: string;
  time_slot: string;
  sort_order: number;
  is_break: boolean;
  created_at: string;
}

export interface UserTimeSlotInput {
  time_slot: string;
  sort_order: number;
  is_break?: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  email?: string | null;
  department?: string | null;
  created_at: string;
}

export interface Classroom {
  id: string;
  name: string;
  capacity?: number | null;
  type?: string | null;
  created_at: string;
}

export interface Subject {
  id: string;
  name: string;
  code?: string | null;
  department?: string | null;
  created_at: string;
}

export interface TeacherSubjectMapping {
  id: string;
  user_id: string;
  teacher_id: string;
  subject_id: string;
  weekly_hours: number;
  created_at: string;
  teachers?: { name: string };
  subjects?: { name: string };
}

export const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'] as const;
export type Section = typeof SECTIONS[number];

// Time slots for the timetable (9 slots from 8 AM to 5 PM)
export const TIME_SLOTS = [
  '8:00 AM - 9:00 AM',
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 1:00 PM',
  '1:00 PM - 2:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
];

export const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
