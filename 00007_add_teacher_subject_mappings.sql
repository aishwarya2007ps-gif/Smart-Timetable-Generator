CREATE TABLE IF NOT EXISTS teacher_subject_mappings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, teacher_id, subject_id)
);

-- RLS
ALTER TABLE teacher_subject_mappings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view mappings" ON teacher_subject_mappings
FOR SELECT TO authenticated, anon
USING (true);

CREATE POLICY "Users can manage their own mappings" ON teacher_subject_mappings
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
