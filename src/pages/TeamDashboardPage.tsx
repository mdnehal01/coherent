import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Bell, 
  Video, 
  Activity, 
  FileText, 
  Users, 
  Clock, 
  Mail,
  ArrowLeft,
  Edit3,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

// Import components
import TeamOverview from '../components/team/TeamOverview';
import TeamProjects from '../components/team/TeamProjects';
import TeamMembers from '../components/team/TeamMembers';
import TeamActivity from '../components/team/TeamActivity';
import TeamInvitations from '../components/team/TeamInvitations';
import TeamModals from '../components/team/TeamModals';

interface Team {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  member_count?: number;
  project_count?: number;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastActive: string;
  joinedAt: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'paused';
  priority: 'high' | 'medium' | 'low';
  progress: number;
  dueDate: string;
  createdAt: string;
  members: string[];
  datasets: number;
  models: number;
  lastActivity: string;
  created_by?: string;
}

interface Activity {
  id: string;
  type: 'dataset_upload' | 'model_created' | 'project_created' | 'member_joined' | 'comment_added';
  user: string;
  description: string;
  timestamp: string;
  projectId?: string;
}

const TeamDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'members' | 'invitations' | 'activity'>('overview');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'paused'>('all');
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [editingTeamName, setEditingTeamName] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  // Get current user's role in the team
  const currentUserRole = teamMembers.find(member => member.id === user?.id)?.role;

  // Check if current user can manage members (admin or owner)
  const canManageMembers = currentUserRole === 'owner' || currentUserRole === 'admin';

  // Check if current user can edit team name (only owner)
  const canEditTeamName = currentUserRole === 'owner';

  useEffect(() => {
    if (user && teamId) {
      loadTeamData();
    }
  }, [user, teamId]);

  const loadTeamData = async () => {
    if (!teamId) return;

    try {
      setLoading(true);
      
      // Load team details
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();

      if (teamError) {
        console.error('Error loading team:', teamError);
        toast.error('Team not found');
        navigate('/team');
        return;
      }

      // Check if user is a member of this team
      const { data: membershipData, error: membershipError } = await supabase
        .from('team_members')
        .select('role')
        .eq('team_id', teamId)
        .eq('user_id', user?.id)
        .single();

      if (membershipError) {
        console.error('Error checking membership:', membershipError);
        toast.error('You are not a member of this team');
        navigate('/team');
        return;
      }

      setCurrentTeam(teamData);

      // Load team members
      const { data: membersData, error: membersError } = await supabase
        .from('team_members')
        .select(`
          id,
          role,
          joined_at,
          users!team_members_user_id_fkey (
            id,
            email
          )
        `)
        .eq('team_id', teamId);

      if (membersError) {
        console.error('Error loading team members:', membersError);
      } else {
        // Transform the data to match our interface
        const members: TeamMember[] = membersData?.map(member => ({
          id: member.users?.id || '',
          name: member.users?.email?.split('@')[0] || 'Unknown',
          email: member.users?.email || '',
          role: member.role,
          status: 'online', // Mock status
          lastActive: new Date().toISOString(),
          joinedAt: member.joined_at
        })) || [];
        
        setTeamMembers(members);
      }

      // Load projects from database
      await loadProjects();
      
      // Load mock data for activities
      loadMockActivities();
      
    } catch (error) {
      console.error('Error loading team data:', error);
      toast.error('Failed to load team data');
      navigate('/team');
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    if (!teamId) return;

    try {
      const { data: projectsData, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_members (
            user_id
          )
        `)
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading projects:', error);
        return;
      }

      const formattedProjects: Project[] = projectsData?.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description || '',
        status: project.status,
        priority: project.priority,
        progress: project.progress || 0,
        dueDate: project.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: project.created_at,
        members: project.project_members?.map((pm: any) => pm.user_id) || [],
        datasets: 0, // Mock data
        models: 0, // Mock data
        lastActivity: project.updated_at || project.created_at,
        created_by: project.created_by
      })) || [];

      setProjects(formattedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadMockActivities = () => {
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'model_created',
        user: 'Team Member',
        description: 'created a new ML model "Customer Churn Predictor"',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        projectId: '1'
      },
      {
        id: '2',
        type: 'dataset_upload',
        user: 'Team Member',
        description: 'uploaded dataset "Q4_sales_data.csv"',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        projectId: '2'
      }
    ];

    setActivities(mockActivities);
  };

  const createNotificationForAssignment = async (userId: string, projectName: string, teamName: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: userId,
            type: 'project_assignment',
            title: 'Project Assignment',
            message: `You have been assigned to project "${projectName}" in team "${teamName}"`,
            data: {
              project_name: projectName,
              team_name: teamName,
              team_id: teamId,
              assigned_by: user?.email?.split('@')[0] || 'Team Admin'
            }
          }
        ]);

      if (error) {
        console.error('Error creating notification:', error);
      }
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeam.name.trim()) {
      toast.error('Please enter a team name');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([
          {
            name: newTeam.name,
            description: newTeam.description,
            created_by: user?.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setNewTeam({ name: '', description: '' });
      setShowCreateTeamModal(false);
      toast.success('Team created successfully!');
      
      // Navigate to the new team
      navigate(`/team/${data.id}`);
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error('Failed to create team');
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    if (!currentTeam) {
      toast.error('No team selected');
      return;
    }

    // Check if current user has permission to invite this role
    if (inviteRole === 'admin' && currentUserRole !== 'owner') {
      toast.error('Only team owners can invite admins');
      return;
    }

    if (!canManageMembers) {
      toast.error('You do not have permission to invite members');
      return;
    }

    try {
      const { error } = await supabase
        .from('team_invitations')
        .insert([
          {
            team_id: currentTeam.id,
            email: inviteEmail,
            role: inviteRole,
            invited_by: user?.id
          }
        ]);

      if (error) throw error;

      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setShowInviteModal(false);
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Failed to send invitation');
    }
  };

  const handleCreateProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'lastActivity' | 'datasets' | 'models'>) => {
    if (!currentTeam) {
      toast.error('No team selected');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            name: projectData.name,
            description: projectData.description,
            team_id: currentTeam.id,
            status: projectData.status,
            priority: projectData.priority,
            progress: projectData.progress,
            due_date: projectData.dueDate || null,
            created_by: user?.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Reload projects
      await loadProjects();
      toast.success('Project created successfully!');
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    }
  };

  const handleUpdateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          name: updates.name,
          description: updates.description,
          status: updates.status,
          priority: updates.priority,
          progress: updates.progress,
          due_date: updates.dueDate
        })
        .eq('id', projectId);

      if (error) throw error;

      // Reload projects
      await loadProjects();
      toast.success('Project updated successfully!');
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      // Reload projects
      await loadProjects();
      toast.success('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleAssignMembers = async (projectId: string, memberIds: string[]) => {
    try {
      // Get current project details for notifications
      const project = projects.find(p => p.id === projectId);
      if (!project || !currentTeam) {
        toast.error('Project or team not found');
        return;
      }

      // Get current assignments to compare
      const { data: currentAssignments } = await supabase
        .from('project_members')
        .select('user_id')
        .eq('project_id', projectId);

      const currentMemberIds = currentAssignments?.map(a => a.user_id) || [];
      const newlyAssignedIds = memberIds.filter(id => !currentMemberIds.includes(id));

      // First, remove existing assignments
      await supabase
        .from('project_members')
        .delete()
        .eq('project_id', projectId);

      // Then add new assignments
      if (memberIds.length > 0) {
        const assignments = memberIds.map(memberId => ({
          project_id: projectId,
          user_id: memberId,
          assigned_by: user?.id
        }));

        const { error } = await supabase
          .from('project_members')
          .insert(assignments);

        if (error) throw error;

        // Create notifications for newly assigned members
        for (const memberId of newlyAssignedIds) {
          // Don't notify the person who is doing the assignment
          if (memberId !== user?.id) {
            await createNotificationForAssignment(memberId, project.name, currentTeam.name);
          }
        }

        if (newlyAssignedIds.length > 0) {
          toast.success(`${newlyAssignedIds.length} member(s) have been notified of their assignment`);
        }
      }

      // Reload projects
      await loadProjects();
      toast.success('Members assigned successfully!');
    } catch (error) {
      console.error('Error assigning members:', error);
      toast.error('Failed to assign members');
    }
  };

  const handleMembersUpdate = () => {
    // Reload team data when members are updated
    loadTeamData();
  };

  const startEditingTeamName = () => {
    if (!canEditTeamName) {
      toast.error('Only team owners can edit the team name');
      return;
    }
    setEditingTeamName(true);
    setNewTeamName(currentTeam?.name || '');
  };

  const cancelEditingTeamName = () => {
    setEditingTeamName(false);
    setNewTeamName('');
  };

  const saveTeamName = async () => {
    if (!newTeamName.trim()) {
      toast.error('Team name cannot be empty');
      return;
    }

    if (!currentTeam) {
      toast.error('No team selected');
      return;
    }

    try {
      const { error } = await supabase
        .from('teams')
        .update({ name: newTeamName.trim() })
        .eq('id', currentTeam.id);

      if (error) throw error;

      // Update local state
      const updatedTeam = { ...currentTeam, name: newTeamName.trim() };
      setCurrentTeam(updatedTeam);

      setEditingTeamName(false);
      setNewTeamName('');
      toast.success('Team name updated successfully');
    } catch (error) {
      console.error('Error updating team name:', error);
      toast.error('Failed to update team name');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Show error state if no team
  if (!currentTeam) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Team not found</h1>
          <button
            onClick={() => navigate('/team')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Teams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 mt-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/team')}
              className="flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium"
            >
              <ArrowLeft size={20} />
              Back to Teams
            </button>
            <div className="flex-1">
              {editingTeamName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="text-3xl font-bold bg-transparent border-b-2 border-green-500 text-gray-800 dark:text-white focus:outline-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        saveTeamName();
                      } else if (e.key === 'Escape') {
                        cancelEditingTeamName();
                      }
                    }}
                    autoFocus
                  />
                  <button
                    onClick={saveTeamName}
                    className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={cancelEditingTeamName}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{currentTeam?.name}</h1>
                  {canEditTeamName && (
                    <button
                      onClick={startEditingTeamName}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Edit team name"
                    >
                      <Edit3 size={20} />
                    </button>
                  )}
                </div>
              )}
              <p className="text-gray-600 dark:text-gray-400 mt-2">{currentTeam?.description || 'Team Collaboration'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCreateTeamModal(true)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              title="Create New Team"
            >
              <Plus size={20} />
            </button>
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Video size={20} />
              Start Meeting
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'projects', label: 'Projects', icon: FileText },
            { id: 'members', label: 'Members', icon: Users },
            ...(canManageMembers ? [{ id: 'invitations', label: 'Invitations', icon: Mail }] : []),
            { id: 'activity', label: 'Activity', icon: Clock }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <TeamOverview
            teamMembers={teamMembers}
            projects={projects}
            activities={activities}
            onCreateProject={() => {}} // Will be handled by the projects tab
            onInviteMember={() => canManageMembers ? setShowInviteModal(true) : toast.error('You do not have permission to invite members')}
          />
        )}
        
        {activeTab === 'projects' && (
          <TeamProjects
            projects={projects}
            teamMembers={teamMembers}
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            onSearchChange={setSearchTerm}
            onFilterChange={setFilterStatus}
            onCreateProject={handleCreateProject}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
            onAssignMembers={handleAssignMembers}
            currentUserRole={currentUserRole}
            currentUserId={user?.id}
            teamId={teamId}
          />
        )}
        
        {activeTab === 'members' && (
          <TeamMembers
            teamMembers={teamMembers}
            onInviteMember={() => canManageMembers ? setShowInviteModal(true) : toast.error('You do not have permission to invite members')}
            currentTeamId={currentTeam?.id}
            onMembersUpdate={handleMembersUpdate}
          />
        )}
        
        {activeTab === 'invitations' && canManageMembers && (
          <TeamInvitations
            currentTeamId={currentTeam?.id}
            currentUserRole={currentUserRole}
          />
        )}
        
        {activeTab === 'activity' && (
          <TeamActivity
            activities={activities}
            projects={projects}
          />
        )}

        {/* Modals */}
        <TeamModals
          showCreateTeamModal={showCreateTeamModal}
          showInviteModal={showInviteModal}
          showCreateProjectModal={false}
          newTeam={newTeam}
          inviteEmail={inviteEmail}
          inviteRole={inviteRole}
          newProject={{
            name: '',
            description: '',
            priority: 'medium',
            dueDate: ''
          }}
          teamMembers={teamMembers}
          onCreateTeam={handleCreateTeam}
          onInviteMember={handleInviteMember}
          onCreateProject={() => {}}
          onCloseCreateTeam={() => setShowCreateTeamModal(false)}
          onCloseInvite={() => setShowInviteModal(false)}
          onCloseCreateProject={() => {}}
          onNewTeamChange={setNewTeam}
          onInviteEmailChange={setInviteEmail}
          onInviteRoleChange={setInviteRole}
          onNewProjectChange={() => {}}
        />
      </div>
    </div>
  );
};

export default TeamDashboardPage;