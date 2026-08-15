-- Remove user_id from teachers, subjects, classrooms, and user_time_slots
-- Make them global resources managed by admin

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own teachers" ON teachers;
DROP POLICY IF EXISTS "Users can insert their own teachers" ON teachers;
DROP POLICY IF EXISTS "Users can update their own teachers" ON teachers;
DROP POLICY IF EXISTS "Users can delete their own teachers" ON teachers;
DROP POLICY IF EXISTS "Admins have full access to teachers" ON teachers;

DROP POLICY IF EXISTS "Users can view their own classrooms" ON classrooms;
DROP POLICY IF EXISTS "Users can insert their own classrooms" ON classrooms;
DROP POLICY IF EXISTS "Users can update their own classrooms" ON classrooms;
DROP POLICY IF EXISTS "Users can delete their own classrooms" ON classrooms;
DROP POLICY IF EXISTS "Admins have full access to classrooms" ON classrooms;

DROP POLICY IF EXISTS "Users can view their own subjects" ON subjects;
DROP POLICY IF EXISTS "Users can insert their own subjects" ON subjects;
DROP POLICY IF EXISTS "Users can update their own subjects" ON subjects;
DROP POLICY IF EXISTS "Users can delete their own subjects" ON subjects;
DROP POLICY IF EXISTS "Admins have full access to subjects" ON subjects;

DROP POLICY IF EXISTS "Users can view their own time slots" ON user_time_slots;
DROP POLICY IF EXISTS "Users can insert their own time slots" ON user_time_slots;
DROP POLICY IF EXISTS "Users can update their own time slots" ON user_time_slots;
DROP POLICY IF EXISTS "Users can delete their own time slots" ON user_time_slots;
DROP POLICY IF EXISTS "Admins have full access to time slots" ON user_time_slots;

-- Drop unique constraints that include user_id
ALTER TABLE teachers DROP CONSTRAINT IF EXISTS teachers_user_id_name_key;
ALTER TABLE classrooms DROP CONSTRAINT IF EXISTS classrooms_user_id_name_key;
ALTER TABLE subjects DROP CONSTRAINT IF EXISTS subjects_user_id_name_key;
ALTER TABLE user_time_slots DROP CONSTRAINT IF EXISTS user_time_slots_user_id_time_slot_key;

-- Remove user_id columns and make resources global
ALTER TABLE teachers DROP COLUMN IF EXISTS user_id;
ALTER TABLE classrooms DROP COLUMN IF EXISTS user_id;
ALTER TABLE subjects DROP COLUMN IF EXISTS user_id;
ALTER TABLE user_time_slots DROP COLUMN IF EXISTS user_id;

-- Rename user_time_slots to time_slots
ALTER TABLE user_time_slots RENAME TO time_slots;

-- Add new unique constraints without user_id
ALTER TABLE teachers ADD CONSTRAINT teachers_name_key UNIQUE(name);
ALTER TABLE classrooms ADD CONSTRAINT classrooms_name_key UNIQUE(name);
ALTER TABLE subjects ADD CONSTRAINT subjects_name_key UNIQUE(name);
ALTER TABLE time_slots ADD CONSTRAINT time_slots_time_slot_key UNIQUE(time_slot);

-- Drop old indexes
DROP INDEX IF EXISTS idx_teachers_user_id;
DROP INDEX IF EXISTS idx_classrooms_user_id;
DROP INDEX IF EXISTS idx_subjects_user_id;
DROP INDEX IF EXISTS idx_user_time_slots_user_id;
DROP INDEX IF EXISTS idx_user_time_slots_sort_order;

-- Create new indexes
CREATE INDEX idx_teachers_name ON teachers(name);
CREATE INDEX idx_classrooms_name ON classrooms(name);
CREATE INDEX idx_subjects_name ON subjects(name);
CREATE INDEX idx_time_slots_sort_order ON time_slots(sort_order);

-- New policies: All users can read, only admins can write

-- Teachers policies
CREATE POLICY "Anyone can view teachers" ON teachers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can insert teachers" ON teachers
  FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can update teachers" ON teachers
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete teachers" ON teachers
  FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Classrooms policies
CREATE POLICY "Anyone can view classrooms" ON classrooms
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can insert classrooms" ON classrooms
  FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can update classrooms" ON classrooms
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete classrooms" ON classrooms
  FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Subjects policies
CREATE POLICY "Anyone can view subjects" ON subjects
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can insert subjects" ON subjects
  FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can update subjects" ON subjects
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete subjects" ON subjects
  FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Time slots policies
CREATE POLICY "Anyone can view time slots" ON time_slots
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can insert time slots" ON time_slots
  FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can update time slots" ON time_slots
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete time slots" ON time_slots
  FOR DELETE TO authenticated USING (is_admin(auth.uid()));