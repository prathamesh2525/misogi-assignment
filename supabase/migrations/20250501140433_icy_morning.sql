/*
  # Initial Schema Setup for LoopList

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches Supabase auth.users
      - `name` (text)
      - `avatar_url` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `loops`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `title` (text)
      - `emoji` (text, nullable)
      - `frequency` (text) - daily, weekdays, custom, 3x-per-week
      - `custom_days` (integer[], nullable)
      - `start_date` (date)
      - `is_public` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `completions`
      - `id` (uuid, primary key)
      - `loop_id` (uuid, references loops)
      - `date` (date)
      - `completed` (boolean)
      - `created_at` (timestamptz)

    - `cheers`
      - `id` (uuid, primary key)
      - `loop_id` (uuid, references loops)
      - `user_id` (uuid, references users)
      - `reaction` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Public access policies for public loops
*/

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create loops table
CREATE TABLE loops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  emoji text,
  frequency text NOT NULL CHECK (frequency IN ('daily', 'weekdays', 'custom', '3x-per-week')),
  custom_days integer[],
  start_date date NOT NULL,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE loops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own loops"
  ON loops
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can read public loops"
  ON loops
  FOR SELECT
  TO authenticated
  USING (is_public = true);

-- Create completions table
CREATE TABLE completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_id uuid REFERENCES loops(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(loop_id, date)
);

ALTER TABLE completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own completions"
  ON completions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM loops
      WHERE loops.id = completions.loop_id
      AND loops.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM loops
      WHERE loops.id = completions.loop_id
      AND loops.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view completions of public loops"
  ON completions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM loops
      WHERE loops.id = completions.loop_id
      AND loops.is_public = true
    )
  );

-- Create cheers table
CREATE TABLE cheers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_id uuid REFERENCES loops(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  reaction text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(loop_id, user_id, reaction)
);

ALTER TABLE cheers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can add cheers to public loops"
  ON cheers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM loops
      WHERE loops.id = cheers.loop_id
      AND loops.is_public = true
    )
  );

CREATE POLICY "Users can delete own cheers"
  ON cheers
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view cheers"
  ON cheers
  FOR SELECT
  TO authenticated
  USING (true);

-- Create functions to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_loops_updated_at
  BEFORE UPDATE ON loops
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();