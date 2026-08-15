-- Add teacher_name column to timetable_entries
ALTER TABLE public.timetable_entries
ADD COLUMN teacher_name text NOT NULL DEFAULT '';

-- Update the constraint to allow teacher_name
COMMENT ON COLUMN public.timetable_entries.teacher_name IS 'Name of the teacher for this subject';