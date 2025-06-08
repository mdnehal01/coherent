/*
  # Create Projects System

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `description` (text, optional)
      - `team_id` (uuid, references teams)
      - `status` (text: active, completed, paused)
      - `priority` (text: high, medium, low)
      - `progress` (integer, 0-100)
      - `due_date` (timestamp)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `project_members`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `user_id` (uuid, references auth.users)
      - `assigned_by` (uuid, references auth.users)
      - `assigned_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for project management
    - Add policies for member assignment

  3. Functions & Triggers
    - Update timestamp triggers
*/

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  due_date timestamptz,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Project members table
CREATE TABLE IF NOT EXISTS project_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_team_id ON projects(team_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON project_members(user_id);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Team members can view projects" ON projects
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.team_id = projects.team_id 
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Team owners and admins can create projects" ON projects
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.team_id = projects.team_id 
      AND team_members.user_id = auth.uid()
      AND team_members.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Team owners and admins can update projects" ON projects
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.team_id = projects.team_id 
      AND team_members.user_id = auth.uid()
      AND team_members.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Team owners and admins can delete projects" ON projects
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.team_id = projects.team_id 
      AND team_members.user_id = auth.uid()
      AND team_members.role IN ('owner', 'admin')
    )
  );

-- Project members policies
CREATE POLICY "Team members can view project assignments" ON project_members
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN team_members tm ON tm.team_id = p.team_id
      WHERE p.id = project_members.project_id
      AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Team owners and admins can assign members" ON project_members
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN team_members tm ON tm.team_id = p.team_id
      WHERE p.id = project_members.project_id
      AND tm.user_id = auth.uid()
      AND tm.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Team owners and admins can remove assignments" ON project_members
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN team_members tm ON tm.team_id = p.team_id
      WHERE p.id = project_members.project_id
      AND tm.user_id = auth.uid()
      AND tm.role IN ('owner', 'admin')
    )
  );

-- Function to update updated_at timestamp for projects
CREATE OR REPLACE FUNCTION update_project_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update projects updated_at
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_project_updated_at();