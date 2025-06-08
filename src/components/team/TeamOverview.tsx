import React from 'react';
import { 
  Users, 
  FileText, 
  Database, 
  Brain, 
  Activity, 
  Plus, 
  UserPlus, 
  Video 
} from 'lucide-react';

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
}

interface Activity {
  id: string;
  type: 'dataset_upload' | 'model_created' | 'project_created' | 'member_joined' | 'comment_added';
  user: string;
  description: string;
  timestamp: string;
  projectId?: string;
}

interface TeamOverviewProps {
  teamMembers: TeamMember[];
  projects: Project[];
  activities: Activity[];
  onCreateProject: () => void;
  onInviteMember: () => void;
}

const TeamOverview: React.FC<TeamOverviewProps> = ({
  teamMembers,
  projects,
  activities,
  onCreateProject,
  onInviteMember
}) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'dataset_upload': return <Database className="w-4 h-4 text-green-500" />;
      case 'model_created': return <Brain className="w-4 h-4 text-yellow-500" />;
      case 'project_created': return <FileText className="w-4 h-4 text-green-500" />;
      case 'member_joined': return <UserPlus className="w-4 h-4 text-green-500" />;
      case 'comment_added': return <Activity className="w-4 h-4 text-green-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Team Members</h3>
            <Users className="text-green-500" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{teamMembers.length}</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            {teamMembers.filter(m => m.status === 'online').length} online
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Projects</h3>
            <FileText className="text-yellow-500" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {projects.filter(p => p.status === 'active').length}
          </p>
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
            {projects.filter(p => p.status === 'completed').length} completed
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Datasets</h3>
            <Database className="text-green-500" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {projects.reduce((sum, p) => sum + p.datasets, 0)}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">Across all projects</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">ML Models</h3>
            <Brain className="text-yellow-500" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {projects.reduce((sum, p) => sum + p.models, 0)}
          </p>
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">Trained models</p>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
            <Activity className="text-gray-400" size={20} />
          </div>
          <div className="space-y-4">
            {activities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    <span className="font-medium">{activity.user}</span> {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium">
            View all activity
          </button>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <button
              onClick={onCreateProject}
              className="w-full flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
            >
              <Plus className="text-green-600 dark:text-green-400" size={20} />
              <div className="text-left">
                <p className="font-medium text-green-800 dark:text-green-300">Create New Project</p>
                <p className="text-sm text-green-600 dark:text-green-400">Start a new collaboration</p>
              </div>
            </button>
            
            <button
              onClick={onInviteMember}
              className="w-full flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition-colors"
            >
              <UserPlus className="text-yellow-600 dark:text-yellow-400" size={20} />
              <div className="text-left">
                <p className="font-medium text-yellow-800 dark:text-yellow-300">Invite Team Member</p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">Add someone to your team</p>
              </div>
            </button>
            
            <button className="w-full flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors">
              <Video className="text-green-600 dark:text-green-400" size={20} />
              <div className="text-left">
                <p className="font-medium text-green-800 dark:text-green-300">Start Video Call</p>
                <p className="text-sm text-green-600 dark:text-green-400">Meet with your team</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamOverview;