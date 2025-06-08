import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  BarChart3, 
  FileText, 
  Database, 
  Brain, 
  Activity, 
  Settings, 
  Edit3, 
  Trash2, 
  UserPlus, 
  CheckCircle, 
  Clock, 
  Pause, 
  AlertTriangle,
  TrendingUp,
  Target,
  Upload,
  Play,
  MessageSquare,
  Bell
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { useNavigate, useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import toast from 'react-hot-toast';

interface Team {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
  updated_at: string;
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

interface ProjectActivity {
  id: string;
  type: 'dataset_upload' | 'model_created' | 'member_assigned' | 'progress_update' | 'comment_added';
  user: string;
  description: string;
  timestamp: string;
  data?: any;
}

const ProjectDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { teamId, projectId } = useParams<{ teamId: string; projectId: string }>();
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [projectMembers, setProjectMembers] = useState<TeamMember[]>([]);
  const [activities, setActivities] = useState<ProjectActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'members' | 'files' | 'activity'>('overview');

  // Mock data for charts
  const progressData = [
    { date: '2024-01-01', progress: 0 },
    { date: '2024-01-15', progress: 15 },
    { date: '2024-02-01', progress: 30 },
    { date: '2024-02-15', progress: 45 },
    { date: '2024-03-01', progress: 60 },
    { date: '2024-03-15', progress: 75 },
  ];

  const taskDistribution = [
    { name: 'Completed', value: 12, color: '#22c55e' },
    { name: 'In Progress', value: 8, color: '#f59e0b' },
    { name: 'Pending', value: 5, color: '#ef4444' },
  ];

  const memberContributions = [
    { name: 'Alice', tasks: 8, datasets: 3, models: 2 },
    { name: 'Bob', tasks: 6, datasets: 2, models: 1 },
    { name: 'Charlie', tasks: 4, datasets: 1, models: 1 },
  ];

  useEffect(() => {
    if (user && teamId && projectId) {
      loadProjectData();
    }
  }, [user, teamId, projectId]);

  const loadProjectData = async () => {
    if (!teamId || !projectId) return;

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

      setCurrentTeam(teamData);

      // Load project details
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select(`
          *,
          project_members (
            user_id
          )
        `)
        .eq('id', projectId)
        .eq('team_id', teamId)
        .single();

      if (projectError) {
        console.error('Error loading project:', projectError);
        toast.error('Project not found');
        navigate(`/team/${teamId}`);
        return;
      }

      // Check if user has access to this project (team member)
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

      const formattedProject: Project = {
        id: projectData.id,
        name: projectData.name,
        description: projectData.description || '',
        status: projectData.status,
        priority: projectData.priority,
        progress: projectData.progress || 0,
        dueDate: projectData.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: projectData.created_at,
        members: projectData.project_members?.map((pm: any) => pm.user_id) || [],
        datasets: 0, // Mock data
        models: 0, // Mock data
        lastActivity: projectData.updated_at || projectData.created_at,
        created_by: projectData.created_by
      };

      setCurrentProject(formattedProject);

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

        // Filter project members
        const projectMembersList = members.filter(member => 
          formattedProject.members.includes(member.id)
        );
        setProjectMembers(projectMembersList);
      }

      // Load mock activities
      loadMockActivities();

    } catch (error) {
      console.error('Error loading project data:', error);
      toast.error('Failed to load project data');
      navigate(`/team/${teamId}`);
    } finally {
      setLoading(false);
    }
  };

  const loadMockActivities = () => {
    const mockActivities: ProjectActivity[] = [
      {
        id: '1',
        type: 'dataset_upload',
        user: 'Alice Johnson',
        description: 'uploaded customer_data.csv',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        type: 'model_created',
        user: 'Bob Smith',
        description: 'created ML model "Customer Segmentation"',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        type: 'progress_update',
        user: 'Charlie Brown',
        description: 'updated project progress to 75%',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        type: 'member_assigned',
        user: 'Team Admin',
        description: 'assigned David Wilson to the project',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '5',
        type: 'comment_added',
        user: 'Alice Johnson',
        description: 'added a comment: "Great progress on the data preprocessing!"',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      }
    ];

    setActivities(mockActivities);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-gray-500" />;
      case 'paused': return <Pause className="w-5 h-5 text-yellow-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'completed': return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
      case 'paused': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'dataset_upload': return <Database className="w-4 h-4 text-green-500" />;
      case 'model_created': return <Brain className="w-4 h-4 text-purple-500" />;
      case 'member_assigned': return <UserPlus className="w-4 h-4 text-blue-500" />;
      case 'progress_update': return <TrendingUp className="w-4 h-4 text-yellow-500" />;
      case 'comment_added': return <MessageSquare className="w-4 h-4 text-gray-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!currentProject || !currentTeam) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Project not found</h1>
          <button
            onClick={() => navigate(`/team/${teamId}`)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Team
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
              onClick={() => navigate(`/team/${teamId}`)}
              className="flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium"
            >
              <ArrowLeft size={20} />
              Back to {currentTeam.name}
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{currentProject.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{currentProject.description || 'Project Dashboard'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Settings size={20} />
              Project Settings
            </button>
          </div>
        </div>

        {/* Project Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Status</h3>
              {getStatusIcon(currentProject.status)}
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentProject.status)}`}>
                {currentProject.status.charAt(0).toUpperCase() + currentProject.status.slice(1)}
              </span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Progress</h3>
              <Target className="text-green-500" size={24} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentProject.progress}%</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  currentProject.progress === 100 ? 'bg-green-500' : 
                  currentProject.progress >= 75 ? 'bg-green-400' :
                  currentProject.progress >= 50 ? 'bg-yellow-400' :
                  currentProject.progress >= 25 ? 'bg-orange-400' : 'bg-red-400'
                }`}
                style={{ width: `${currentProject.progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Team Members</h3>
              <Users className="text-blue-500" size={24} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{projectMembers.length}</p>
            <div className="flex -space-x-2 mt-2">
              {projectMembers.slice(0, 4).map((member, index) => (
                <div
                  key={member.id}
                  className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-white dark:border-gray-800"
                  title={member.name}
                >
                  {member.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {projectMembers.length > 4 && (
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white dark:border-gray-800">
                  +{projectMembers.length - 4}
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Due Date</h3>
              <Calendar className={`${isOverdue(currentProject.dueDate) && currentProject.status === 'active' ? 'text-red-500' : 'text-gray-500'}`} size={24} />
            </div>
            <p className={`text-lg font-bold ${isOverdue(currentProject.dueDate) && currentProject.status === 'active' ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
              {new Date(currentProject.dueDate).toLocaleDateString()}
            </p>
            {isOverdue(currentProject.dueDate) && currentProject.status === 'active' && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                <AlertTriangle size={14} />
                Overdue
              </p>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: FileText },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'members', label: 'Members', icon: Users },
            { id: 'files', label: 'Files & Data', icon: Database },
            { id: 'activity', label: 'Activity', icon: Activity }
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
          <div className="space-y-8">
            {/* Project Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Project Details</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(currentProject.priority)}`}>
                    {currentProject.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Description</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {currentProject.description || 'No description provided for this project.'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Created:</span>
                      <span className="text-gray-900 dark:text-white">{new Date(currentProject.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Due Date:</span>
                      <span className={`${isOverdue(currentProject.dueDate) && currentProject.status === 'active' ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                        {new Date(currentProject.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Last Activity:</span>
                      <span className="text-gray-900 dark:text-white">{formatTimeAgo(currentProject.lastActivity)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Datasets</h3>
                  <Database className="text-green-500" size={24} />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{currentProject.datasets}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Files uploaded</p>
                <button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                  <Upload size={16} />
                  Upload Data
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">ML Models</h3>
                  <Brain className="text-purple-500" size={24} />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{currentProject.models}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Models trained</p>
                <button className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                  <Play size={16} />
                  Train Model
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tasks</h3>
                  <CheckCircle className="text-blue-500" size={24} />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">12/25</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tasks completed</p>
                <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '48%' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Progress Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Progress Over Time</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="progress" stroke="#16a34a" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Task Distribution */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Task Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {taskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Member Contributions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Member Contributions</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={memberContributions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="tasks" fill="#16a34a" name="Tasks" />
                      <Bar dataKey="datasets" fill="#3b82f6" name="Datasets" />
                      <Bar dataKey="models" fill="#8b5cf6" name="Models" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Project Members</h3>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <UserPlus size={20} />
                Assign Members
              </button>
            </div>
            
            <div className="space-y-4">
              {projectMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-medium">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{member.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </span>
                    <div className={`w-3 h-3 rounded-full ${
                      member.status === 'online' ? 'bg-green-500' :
                      member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Files & Datasets</h3>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Upload size={20} />
                Upload Files
              </button>
            </div>
            
            <div className="text-center py-12">
              <Database className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No files uploaded yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Upload your datasets and files to start working on this project
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
                Upload Your First File
              </button>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Project Activity</h3>
            
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-medium">{activity.user}</span> {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDashboardPage;