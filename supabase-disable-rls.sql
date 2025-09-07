-- Temporarily disable RLS on users table for development
-- This allows us to create users without authentication issues

-- Disable RLS on users table
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows all operations for now
-- (This is for development only - in production you'd want proper RLS)
DROP POLICY IF EXISTS "Allow all operations" ON users;
CREATE POLICY "Allow all operations" ON users
  FOR ALL USING (true) WITH CHECK (true);

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
