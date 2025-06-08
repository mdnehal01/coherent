import React from 'react';
import { Activity, Database, Brain, FileText, UserPlus, MessageSquare } from 'lucide-react';

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

interface TeamActivityProps {
  activities: Activity[];
  projects: Project[];
}

const TeamActivity: React.FC<TeamActivityProps> = ({ activities, projects }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'dataset_upload': return <Database className="w-4 h-4 text-green-500" />;
      case 'model_created': return <Brain className="w-4 h-4 text-yellow-500" />;
      case 'project_created': return <FileText className="w-4 h-4 text-green-500" />;
      case 'member_joined': return <UserPlus className="w-4 h-4 text-green-500" />;
      case 'comment_added': return <MessageSquare className="w-4 h-4 text-green-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Team Activity</h3>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white">
                  <span className="font-medium">{activity.user}</span> {activity.description}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                  {activity.projectId && (
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">
                      {projects.find(p => p.id === activity.projectId)?.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamActivity;