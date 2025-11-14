-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier TEXT NOT NULL,
  tsr_number TEXT NOT NULL,
  response_due DATE NOT NULL,
  end_a TEXT NOT NULL,
  end_z TEXT NOT NULL,
  data_rate_required TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create timeline event type enum
CREATE TYPE timeline_event_type AS ENUM ('POST_CREATED', 'FIELD_CHANGED', 'COMMENT');

-- Create timeline_events table
CREATE TABLE timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  event_type timeline_event_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  
  -- For POST_CREATED and COMMENT
  body TEXT,
  
  -- For FIELD_CHANGED
  field_name TEXT,
  old_value TEXT,
  new_value TEXT,
  
  -- Constraints to ensure data integrity based on event type
  CONSTRAINT valid_post_created CHECK (
    event_type != 'POST_CREATED' OR body IS NOT NULL
  ),
  CONSTRAINT valid_field_changed CHECK (
    event_type != 'FIELD_CHANGED' OR (field_name IS NOT NULL AND old_value IS NOT NULL AND new_value IS NOT NULL)
  ),
  CONSTRAINT valid_comment CHECK (
    event_type != 'COMMENT' OR body IS NOT NULL
  )
);

-- Create indexes for performance optimization
CREATE INDEX idx_posts_updated_at ON posts(updated_at DESC);
CREATE INDEX idx_posts_response_due ON posts(response_due);
CREATE INDEX idx_timeline_events_post_id ON timeline_events(post_id, created_at DESC);
CREATE INDEX idx_timeline_events_created_at ON timeline_events(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for posts table
CREATE POLICY "Authenticated users can view all posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update all posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (true);

-- RLS Policies for timeline_events table
CREATE POLICY "Authenticated users can view all timeline events"
  ON timeline_events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create timeline events"
  ON timeline_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- RLS Policies for profiles table
CREATE POLICY "Authenticated users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Create a trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
