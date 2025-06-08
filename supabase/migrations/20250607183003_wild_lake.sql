/*
  # Teams System Migration

  1. New Tables
    - `teams`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `description` (text, optional)
      - `created_by` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `team_members`
      - `id` (uuid, primary key)
      - `team_id` (uuid, foreign key to teams)
      - `user_id` (uuid, foreign key to auth.users)
      - `role` (text, enum: owner, admin, member, viewer)
      - `joined_at` (timestamp)
      - `invited_by` (uuid, foreign key to auth.users)
    
    - `team_invitations`
      - `id` (uuid, primary key)
      - `team_id` (uuid, foreign key to teams)
      - `email` (text, required)
      - `role` (text, enum: admin, member, viewer)
      - `invited_by` (uuid, foreign key to auth.users)
      - `token` (text, unique)
      - `expires_at` (timestamp)
      - `accepted_at` (timestamp)
      - `created_at` (timestamp)

  2. Triggers & Functions
    - Auto-add team creator as owner
    - Update timestamp on team changes

  3. Indexes
    - Performance indexes for common queries
*/

-- ====================
-- 1. TABLES
-- ====================

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  joined_at timestamptz DEFAULT now(),
  invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE(team_id, user_id)
);

-- Team invitations table
CREATE TABLE IF NOT EXISTS team_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
  invited_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at timestamptz DEFAULT (now() + interval '7 days'),
  accepted_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- ====================
-- 2. INDEXES
-- ====================

-- Team members indexes
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);

-- Team invitations indexes
CREATE INDEX IF NOT EXISTS idx_team_invitations_email ON team_invitations(email);
CREATE INDEX IF NOT EXISTS idx_team_invitations_token ON team_invitations(token);
CREATE INDEX IF NOT EXISTS idx_team_invitations_team_id ON team_invitations(team_id);

-- Teams indexes
CREATE INDEX IF NOT EXISTS idx_teams_created_by ON teams(created_by);
CREATE INDEX IF NOT EXISTS idx_teams_created_at ON teams(created_at DESC);

-- ====================
-- 3. FUNCTIONS
-- ====================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically add team creator as owner
CREATE OR REPLACE FUNCTION add_team_creator_as_owner()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO team_members (team_id, user_id, role, invited_by)
  VALUES (NEW.id, NEW.created_by, 'owner', NEW.created_by);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ====================
-- 4. TRIGGERS
-- ====================

-- Trigger to update teams updated_at
DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to add team creator as owner
DROP TRIGGER IF EXISTS trigger_add_team_creator_as_owner ON teams;
CREATE TRIGGER trigger_add_team_creator_as_owner
  AFTER INSERT ON teams
  FOR EACH ROW
  EXECUTE FUNCTION add_team_creator_as_owner();