-- Add section column to timetable_entries
ALTER TABLE public.timetable_entries
ADD COLUMN section text NOT NULL DEFAULT 'A';

-- Update unique constraint to include section
ALTER TABLE public.timetable_entries
DROP CONSTRAINT IF EXISTS timetable_entries_user_id_day_time_slot_key;

ALTER TABLE public.timetable_entries
ADD CONSTRAINT timetable_entries_user_id_section_day_time_slot_key 
UNIQUE(user_id, section, day, time_slot);

-- Create table for teachers/faculty
CREATE TABLE public.teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  department text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Create table for classrooms
CREATE TABLE public.classrooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  capacity integer,
  type text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Create table for subjects
CREATE TABLE public.subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text,
  department text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Add foreign keys to timetable_entries
ALTER TABLE public.timetable_entries
ADD COLUMN classroom_id uuid REFERENCES public.classrooms(id) ON DELETE SET NULL,
ADD COLUMN subject_id uuid REFERENCES public.subjects(id) ON DELETE CASCADE;

-- Enable RLS on new tables
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Policies for teachers
CREATE POLICY "Users can view their own teachers" ON teachers
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own teachers" ON teachers
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own teachers" ON teachers
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own teachers" ON teachers
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins have full access to teachers" ON teachers
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Policies for classrooms
CREATE POLICY "Users can view their own classrooms" ON classrooms
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own classrooms" ON classrooms
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own classrooms" ON classrooms
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own classrooms" ON classrooms
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins have full access to classrooms" ON classrooms
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Policies for subjects
CREATE POLICY "Users can view their own subjects" ON subjects
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subjects" ON subjects
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subjects" ON subjects
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subjects" ON subjects
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins have full access to subjects" ON subjects
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Create indexes for better performance
CREATE INDEX idx_teachers_user_id ON teachers(user_id);
CREATE INDEX idx_classrooms_user_id ON classrooms(user_id);
CREATE INDEX idx_subjects_user_id ON subjects(user_id);
CREATE INDEX idx_timetable_entries_section ON timetable_entries(user_id, section);