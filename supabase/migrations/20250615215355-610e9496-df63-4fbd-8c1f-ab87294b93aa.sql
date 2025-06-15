
-- Create table for storing habit nudges
CREATE TABLE public.habit_nudges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  habit_id UUID NOT NULL,
  text TEXT NOT NULL,
  missed_days INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.habit_nudges ENABLE ROW LEVEL SECURITY;

-- Policy: authenticated users can manage only their own nudges
CREATE POLICY "Users can manage own habit nudges"
  ON public.habit_nudges
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add trigger to automatically update updated_at timestamp if we add that column later
CREATE TRIGGER update_habit_nudges_updated_at
  BEFORE UPDATE ON public.habit_nudges
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
