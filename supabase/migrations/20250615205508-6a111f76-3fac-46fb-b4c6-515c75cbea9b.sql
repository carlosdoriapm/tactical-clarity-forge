
-- Create "purposes" table to store each user's purpose statement and streak score
CREATE TABLE public.purposes (
  user_id UUID PRIMARY KEY,
  purpose_statement TEXT NOT NULL,
  streak_score INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now())
);

-- Enable Row Level Security
ALTER TABLE public.purposes ENABLE ROW LEVEL SECURITY;

-- Policy: authenticated users can manage only their row
CREATE POLICY "Users can manage own purpose row"
  ON public.purposes
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
