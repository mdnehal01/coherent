import React from 'react';
import { X, Calendar, AlertTriangle } from 'lucide-react';

interface ProjectFormModalProps {
  isOpen: boolean;
  isEdit: boolean;
  project: {
    name: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    dueDate: string;
    status: 'active' | 'completed' | 'paused';
    progress: number;
  };
  onClose: () => void;
  onSubmit: () => void;
  onChange: (project: {
    name: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    dueDate: string;
    status: 'active' | 'completed' | 'paused';
    progress: number;
  }) => void;
  isLoading?: boolean;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  isEdit,
  project,
  onClose,
  onSubmit,
  onChange,
  isLoading = false
}) => {
  if (!isOpen) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Project' : 'Create New Project'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              value={project.name}
              onChange={(e) => onChange({...project, name: e.target.value})}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter project name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={project.description}
              onChange={(e) => onChange({...project, description: e.target.value})}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              rows={3}
              placeholder="Describe your project"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={project.priority}
                onChange={(e) => onChange({...project, priority: e.target.value as any})}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <div className="flex items-center gap-1 mt-1">
                <AlertTriangle className={`w-4 h-4 ${getPriorityColor(project.priority)}`} />
                <span className={`text-xs ${getPriorityColor(project.priority)}`}>
                  {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)} Priority
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={project.status}
                onChange={(e) => onChange({...project, status: e.target.value as any})}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={project.dueDate ? project.dueDate.split('T')[0] : ''}
                  onChange={(e) => onChange({...project, dueDate: e.target.value ? new Date(e.target.value).toISOString() : ''})}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Progress ({project.progress}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={project.progress}
                onChange={(e) => onChange({...project, progress: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>0%</span>
                <span className="font-medium text-green-600 dark:text-green-400">{project.progress}%</span>
                <span>100%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    project.progress === 100 ? 'bg-green-500' : 
                    project.progress >= 75 ? 'bg-green-400' :
                    project.progress >= 50 ? 'bg-yellow-400' :
                    project.progress >= 25 ? 'bg-orange-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isLoading || !project.name.trim()}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            {isLoading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Project' : 'Create Project')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectFormModal;