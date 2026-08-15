-- Create table for user custom time slots
CREATE TABLE public.user_time_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  time_slot text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, time_slot)
);

-- Enable RLS
ALTER TABLE public.user_time_slots ENABLE ROW LEVEL SECURITY;

-- Policies for user_time_slots
CREATE POLICY "Users can view their own time slots" ON user_time_slots
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own time slots" ON user_time_slots
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own time slots" ON user_time_slots
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own time slots" ON user_time_slots
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins have full access to time slots" ON user_time_slots
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Create index for better performance
CREATE INDEX idx_user_time_slots_user_id ON user_time_slots(user_id);
CREATE INDEX idx_user_time_slots_sort_order ON user_time_slots(user_id, sort_order);