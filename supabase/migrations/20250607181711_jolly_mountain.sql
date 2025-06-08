-- /*
--   # Create Teams System

--   1. New Tables
--     - `teams`
--       - `id` (uuid, primary key)
--       - `name` (text)
--       - `description` (text, optional)
--       - `created_by` (uuid, references auth.users)
--       - `created_at` (timestamp)
--       - `updated_at` (timestamp)
    
--     - `team_members`
--       - `id` (uuid, primary key)
--       - `team_id` (uuid, references teams)
--       - `user_id` (uuid, references auth.users)
--       - `role` (text: owner, admin, member, viewer)
--       - `joined_at` (timestamp)
--       - `invited_by` (uuid, references auth.users)
    
--     - `team_invitations`
--       - `id` (uuid, primary key)
--       - `team_id` (uuid, references teams)
--       - `email` (text)
--       - `role` (text: admin, member, viewer)
--       - `invited_by` (uuid, references auth.users)
--       - `token` (text, unique)
--       - `expires_at` (timestamp)
--       - `accepted_at` (timestamp, optional)
--       - `created_at` (timestamp)

--   2. Security
--     - Enable RLS on all tables
--     - Add policies for team management
--     - Add policies for member management
--     - Add policies for invitation management

--   3. Functions & Triggers
--     - Auto-add team creator as owner
--     - Update timestamp triggers
-- */

-- -- Teams table
-- CREATE TABLE IF NOT EXISTS teams (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   name text NOT NULL,
--   description text,
--   created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
--   created_at timestamptz DEFAULT now(),
--   updated_at timestamptz DEFAULT now()
-- );

-- -- Team members table
-- CREATE TABLE IF NOT EXISTS team_members (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
--   user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
--   role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
--   joined_at timestamptz DEFAULT now(),
--   invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
--   UNIQUE(team_id, user_id)
-- );

-- -- Team invitations table
-- CREATE TABLE IF NOT EXISTS team_invitations (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
--   email text NOT NULL,
--   role text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
--   invited_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
--   token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
--   expires_at timestamptz DEFAULT (now() + interval '7 days'),
--   accepted_at timestamptz,
--   created_at timestamptz DEFAULT now()
-- );

-- -- Create indexes for better performance
-- CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
-- CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
-- CREATE INDEX IF NOT EXISTS idx_team_invitations_email ON team_invitations(email);
-- CREATE INDEX IF NOT EXISTS idx_team_invitations_token ON team_invitations(token);

-- -- Enable Row Level Security
-- ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;

-- -- Teams policies
-- CREATE POLICY "Users can create teams" ON teams
--   FOR INSERT TO authenticated
--   WITH CHECK (auth.uid() = created_by);

-- CREATE POLICY "Team creators can update their teams" ON teams
--   FOR UPDATE TO authenticated
--   USING (auth.uid() = created_by);

-- CREATE POLICY "Team creators can delete their teams" ON teams
--   FOR DELETE TO authenticated
--   USING (auth.uid() = created_by);

-- CREATE POLICY "Users can view teams they are members of" ON teams
--   FOR SELECT TO authenticated
--   USING (
--     EXISTS (
--       SELECT 1 FROM team_members 
--       WHERE team_members.team_id = teams.id 
--       AND team_members.user_id = auth.uid()
--     )
--   );

-- -- Team members policies
-- CREATE POLICY "Users can view their own team memberships" ON team_members
--   FOR SELECT TO authenticated
--   USING (auth.uid() = user_id);

-- CREATE POLICY "Users can insert their own team memberships" ON team_members
--   FOR INSERT TO authenticated
--   WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Team owners and admins can manage team members" ON team_members
--   FOR ALL TO authenticated
--   USING (
--     EXISTS (
--       SELECT 1 FROM team_members tm
--       WHERE tm.team_id = team_members.team_id
--       AND tm.user_id = auth.uid()
--       AND tm.role IN ('owner', 'admin')
--     )
--   )
--   WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM team_members tm
--       WHERE tm.team_id = team_members.team_id
--       AND tm.user_id = auth.uid()
--       AND tm.role IN ('owner', 'admin')
--     )
--   );

-- -- Team invitations policies
-- CREATE POLICY "Users can view invitations for teams they can manage" ON team_invitations
--   FOR SELECT TO authenticated
--   USING (
--     EXISTS (
--       SELECT 1 FROM team_members
--       WHERE team_members.team_id = team_invitations.team_id
--       AND team_members.user_id = auth.uid()
--       AND team_members.role IN ('owner', 'admin')
--     )
--   );

-- CREATE POLICY "Team admins can create invitations" ON team_invitations
--   FOR INSERT TO authenticated
--   WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM team_members
--       WHERE team_members.team_id = team_invitations.team_id
--       AND team_members.user_id = auth.uid()
--       AND team_members.role IN ('owner', 'admin')
--     )
--   );

-- CREATE POLICY "Team admins can update invitations" ON team_invitations
--   FOR UPDATE TO authenticated
--   USING (
--     EXISTS (
--       SELECT 1 FROM team_members
--       WHERE team_members.team_id = team_invitations.team_id
--       AND team_members.user_id = auth.uid()
--       AND team_members.role IN ('owner', 'admin')
--     )
--   );

-- -- Function to automatically add team creator as owner
-- CREATE OR REPLACE FUNCTION add_team_creator_as_owner()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   INSERT INTO team_members (team_id, user_id, role, invited_by)
--   VALUES (NEW.id, NEW.created_by, 'owner', NEW.created_by);
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Trigger to add team creator as owner
-- DROP TRIGGER IF EXISTS trigger_add_team_creator_as_owner ON teams;
-- CREATE TRIGGER trigger_add_team_creator_as_owner
--   AFTER INSERT ON teams
--   FOR EACH ROW
--   EXECUTE FUNCTION add_team_creator_as_owner();

-- -- Function to update updated_at timestamp
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   NEW.updated_at = now();
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Trigger to update teams updated_at
-- DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;
-- CREATE TRIGGER update_teams_updated_at
--   BEFORE UPDATE ON teams
--   FOR EACH ROW
--   EXECUTE FUNCTION update_updated_at_column();



-- ====================
-- 1. TABLES
-- ====================

-- Teams
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Team Members
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  joined_at timestamptz DEFAULT now(),
  invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE(team_id, user_id)
);

-- Team Invitations
CREATE TABLE IF NOT EXISTS team_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'member', 'viewer')),
  invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- ====================
-- 2. ENABLE RLS
-- ====================
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;

-- ====================
-- 3. POLICIES
-- ====================

-- Drop existing
DROP POLICY IF EXISTS "view teams created by user" ON teams;
DROP POLICY IF EXISTS "view team membership" ON team_members;
DROP POLICY IF EXISTS "manage team membership if creator" ON team_members;
DROP POLICY IF EXISTS "create teams" ON teams;

-- Teams: view if created or member
CREATE POLICY "Users can view their own teams"
  ON teams
  FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can view teams they are members of"
  ON teams
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = teams.id
        AND team_members.user_id = auth.uid()
    )
  );

-- Teams: creator can update/delete
CREATE POLICY "Team creators can update"
  ON teams
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Team creators can delete"
  ON teams
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Teams: any authenticated user can create
CREATE POLICY "Users can create teams"
  ON teams
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Team Members: user can view/insert own
CREATE POLICY "Users can view their team memberships"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own membership"
  ON team_members
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Team Members: allow creator to manage
CREATE POLICY "Team creators can manage members"
  ON team_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = team_members.team_id
        AND teams.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = team_members.team_id
        AND teams.created_by = auth.uid()
    )
  );

-- Team Invitations
CREATE POLICY "Creator can manage invitations"
  ON team_invitations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = team_invitations.team_id
        AND teams.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = team_invitations.team_id
        AND teams.created_by = auth.uid()
    )
  );

-- ====================
-- 4. TRIGGERS: updated_at
-- ====================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_team_updated_at ON teams;
CREATE TRIGGER set_team_updated_at
BEFORE UPDATE ON teams
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ====================
-- 5. FUNCTION: Auto Add Creator as Owner
-- ====================
CREATE OR REPLACE FUNCTION add_team_creator_as_owner()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO team_members (team_id, user_id, role, invited_by)
  VALUES (NEW.id, NEW.created_by, 'owner', NEW.created_by);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS add_creator_as_owner ON teams;
CREATE TRIGGER add_creator_as_owner
AFTER INSERT ON teams
FOR EACH ROW EXECUTE FUNCTION add_team_creator_as_owner();
