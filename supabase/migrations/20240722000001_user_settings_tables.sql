-- Create user settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT TRUE,
  project_reminders BOOLEAN DEFAULT TRUE,
  payment_alerts BOOLEAN DEFAULT TRUE,
  weekly_reports BOOLEAN DEFAULT FALSE,
  theme VARCHAR(20) DEFAULT 'light',
  currency VARCHAR(10) DEFAULT 'usd',
  date_format VARCHAR(20) DEFAULT 'dd/mm/yyyy',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row-level security
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own settings
DROP POLICY IF EXISTS "Users can read their own settings" ON user_settings;
CREATE POLICY "Users can read their own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to update their own settings
DROP POLICY IF EXISTS "Users can update their own settings" ON user_settings;
CREATE POLICY "Users can update their own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own settings
DROP POLICY IF EXISTS "Users can insert their own settings" ON user_settings;
CREATE POLICY "Users can insert their own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Enable realtime for user_settings
alter publication supabase_realtime add table user_settings;

-- Create a trigger to automatically create user settings when a new user is created
CREATE OR REPLACE FUNCTION create_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_settings();
