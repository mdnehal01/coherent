import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Database, 
  Brain, 
  Calendar, 
  ArrowRight,
  Edit3,
  Trash2,
  Users,
  User,
  CheckCircle,
  Clock,
  Pause,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProjectFormModal from './ProjectFormModal';
import ProjectAssignmentModal from './ProjectAssignmentModal';

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

interface TeamProjectsProps {
  projects: Project[];
  teamMembers: TeamMember[];
  searchTerm: string;
  filterStatus: 'all' | 'active' | 'completed' | 'paused';
  onSearchChange: (value: string) => void;
  onFilterChange: (value: 'all' | 'active' | 'completed' | 'paused') => void;
  onCreateProject: (project: Omit<Project, 'id' | 'createdAt' | 'lastActivity' | 'datasets' | 'models'>) => void;
  onUpdateProject: (projectId: string, updates: Partial<Project>) => void;
  onDeleteProject: (projectId: string) => void;
  onAssignMembers: (projectId: string, memberIds: string[]) => void;
  currentUserRole?: 'owner' | 'admin' | 'member' | 'viewer';
  currentUserId?: string;
  teamId?: string;
}

const TeamProjects: React.FC<TeamProjectsProps> = ({
  projects,
  teamMembers,
  searchTerm,
  filterStatus,
  onSearchChange,
  onFilterChange,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  onAssignMembers,
  currentUserRole,
  currentUserId,
  teamId
}) => {
  const navigate = useNavigate();
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [assigningProject, setAssigningProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    dueDate: '',
    status: 'active' as 'active' | 'completed' | 'paused',
    progress: 0
  });

  // Check if current user can manage projects (admin or owner)
  const canManageProjects = currentUserRole === 'owner' || currentUserRole === 'admin';

  const resetForm = () => {
    setProjectForm({
      name: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      status: 'active',
      progress: 0
    });
  };

  const handleCreateProject = async () => {
    setIsLoading(true);
    try {
      await onCreateProject({
        name: projectForm.name,
        description: projectForm.description,
        priority: projectForm.priority,
        dueDate: projectForm.dueDate,
        status: projectForm.status,
        progress: projectForm.progress,
        members: [],
        created_by: currentUserId
      });
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      name: project.name,
      description: project.description,
      priority: project.priority,
      dueDate: project.dueDate,
      status: project.status,
      progress: project.progress
    });
    setShowEditModal(true);
    setShowActionsMenu(null);
  };

  const handleUpdateProject = async () => {
    if (!editingProject) return;
    
    setIsLoading(true);
    try {
      await onUpdateProject(editingProject.id, {
        name: projectForm.name,
        description: projectForm.description,
        priority: projectForm.priority,
        dueDate: projectForm.dueDate,
        status: projectForm.status,
        progress: projectForm.progress
      });
      setShowEditModal(false);
      setEditingProject(null);
      resetForm();
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = (project: Project) => {
    if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
      onDeleteProject(project.id);
    }
    setShowActionsMenu(null);
  };

  const handleAssignMembers = (project: Project) => {
    setAssigningProject(project);
    setShowAssignModal(true);
    setShowActionsMenu(null);
  };

  const handleAssignSubmit = async (memberIds: string[]) => {
    if (!assigningProject) return;
    
    setIsLoading(true);
    try {
      await onAssignMembers(assigningProject.id, memberIds);
      setShowAssignModal(false);
      setAssigningProject(null);
    } catch (error) {
      console.error('Error assigning members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProject = (project: Project) => {
    if (teamId) {
      navigate(`/team/${teamId}/project/${project.id}`);
    }
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
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-gray-500" />;
      case 'paused': return <Pause className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
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

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Team Projects</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {canManageProjects ? 'Manage and track your team projects' : 'View team projects and progress'}
          </p>
        </div>
        {canManageProjects && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} />
            New Project
          </button>
        )}
      </div>

      {/* Permission Notice */}
      {!canManageProjects && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              You have view-only access to projects. Contact an admin or owner to create or manage projects.
            </p>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <Database className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm || filterStatus !== 'all' ? 'No projects found' : 'No projects yet'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : canManageProjects 
                ? 'Create your first project to get started'
                : 'Projects will appear here once created by team admins'
            }
          </p>
          {canManageProjects && !searchTerm && filterStatus === 'all' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              Create First Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {project.description || 'No description provided'}
                    </p>
                  </div>
                  {canManageProjects && (
                    <div className="relative">
                      <button
                        onClick={() => setShowActionsMenu(showActionsMenu === project.id ? null : project.id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                      >
                        <MoreVertical size={20} />
                      </button>
                      
                      {showActionsMenu === project.id && (
                        <div className="absolute right-0 top-8 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-10 min-w-[160px]">
                          <button
                            onClick={() => handleAssignMembers(project)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2"
                          >
                            <Users size={16} />
                            Assign Members
                          </button>
                          <button
                            onClick={() => handleEditProject(project)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2"
                          >
                            <Edit3 size={16} />
                            Edit Project
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                          >
                            <Trash2 size={16} />
                            Delete Project
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                    {project.priority.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(project.status)}`}>
                    {getStatusIcon(project.status)}
                    {project.status.toUpperCase()}
                  </span>
                  {isOverdue(project.dueDate) && project.status === 'active' && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                      OVERDUE
                    </span>
                  )}
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
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
                
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Database size={16} />
                      {project.datasets}
                    </span>
                    <span className="flex items-center gap-1">
                      <Brain size={16} />
                      {project.models}
                    </span>
                  </div>
                  <span className={`flex items-center gap-1 ${isOverdue(project.dueDate) && project.status === 'active' ? 'text-red-600 dark:text-red-400' : ''}`}>
                    <Calendar size={16} />
                    {new Date(project.dueDate).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {project.members.slice(0, 3).map((memberId, index) => {
                      const member = teamMembers.find(m => m.id === memberId);
                      return (
                        <div
                          key={memberId}
                          className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-white dark:border-gray-800"
                          title={member?.name || 'Unknown Member'}
                        >
                          {member?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                      );
                    })}
                    {project.members.length > 3 && (
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white dark:border-gray-800">
                        +{project.members.length - 3}
                      </div>
                    )}
                    {project.members.length === 0 && (
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                        <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => handleViewProject(project)}
                    className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center gap-1 text-sm font-medium"
                  >
                    View <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Click outside to close menu */}
      {showActionsMenu && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setShowActionsMenu(null)}
        />
      )}

      {/* Modals */}
      <ProjectFormModal
        isOpen={showCreateModal}
        isEdit={false}
        project={projectForm}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        onSubmit={handleCreateProject}
        onChange={setProjectForm}
        isLoading={isLoading}
      />

      <ProjectFormModal
        isOpen={showEditModal}
        isEdit={true}
        project={projectForm}
        onClose={() => {
          setShowEditModal(false);
          setEditingProject(null);
          resetForm();
        }}
        onSubmit={handleUpdateProject}
        onChange={setProjectForm}
        isLoading={isLoading}
      />

      <ProjectAssignmentModal
        isOpen={showAssignModal}
        project={assigningProject}
        teamMembers={teamMembers}
        onClose={() => {
          setShowAssignModal(false);
          setAssigningProject(null);
        }}
        onAssign={handleAssignSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default TeamProjects;