import React from 'react';
import { useAuth } from '../../hooks/useAuth';

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

interface TeamModalsProps {
  showCreateTeamModal: boolean;
  showInviteModal: boolean;
  showCreateProjectModal: boolean;
  newTeam: { name: string; description: string };
  inviteEmail: string;
  inviteRole: 'admin' | 'member' | 'viewer';
  newProject: {
    name: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    dueDate: string;
  };
  teamMembers?: TeamMember[];
  onCreateTeam: () => void;
  onInviteMember: () => void;
  onCreateProject: () => void;
  onCloseCreateTeam: () => void;
  onCloseInvite: () => void;
  onCloseCreateProject: () => void;
  onNewTeamChange: (team: { name: string; description: string }) => void;
  onInviteEmailChange: (email: string) => void;
  onInviteRoleChange: (role: 'admin' | 'member' | 'viewer') => void;
  onNewProjectChange: (project: {
    name: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    dueDate: string;
  }) => void;
}

const TeamModals: React.FC<TeamModalsProps> = ({
  showCreateTeamModal,
  showInviteModal,
  showCreateProjectModal,
  newTeam,
  inviteEmail,
  inviteRole,
  newProject,
  teamMembers = [],
  onCreateTeam,
  onInviteMember,
  onCreateProject,
  onCloseCreateTeam,
  onCloseInvite,
  onCloseCreateProject,
  onNewTeamChange,
  onInviteEmailChange,
  onInviteRoleChange,
  onNewProjectChange
}) => {
  const { user } = useAuth();

  // Get current user's role in the team
  const currentUserRole = teamMembers.find(member => member.id === user?.id)?.role;

  // Check if current user can invite admins (only owner)
  const canInviteAdmin = currentUserRole === 'owner';

  // Get available roles for invitation based on current user's permissions
  const getAvailableInviteRoles = () => {
    if (currentUserRole === 'owner') {
      return [
        { value: 'viewer', label: 'Viewer - Can view projects and data' },
        { value: 'member', label: 'Member - Can edit and contribute' },
        { value: 'admin', label: 'Admin - Can manage team and settings' }
      ];
    } else if (currentUserRole === 'admin') {
      return [
        { value: 'viewer', label: 'Viewer - Can view projects and data' },
        { value: 'member', label: 'Member - Can edit and contribute' }
      ];
    }
    return [
      { value: 'viewer', label: 'Viewer - Can view projects and data' },
      { value: 'member', label: 'Member - Can edit and contribute' }
    ];
  };

  return (
    <>
      {/* Create Team Modal */}
      {showCreateTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Create New Team</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={newTeam.name}
                  onChange={(e) => onNewTeamChange({...newTeam, name: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter team name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newTeam.description}
                  onChange={(e) => onNewTeamChange({...newTeam, description: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                  placeholder="Describe your team's purpose"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={onCloseCreateTeam}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={onCreateTeam}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Create Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Invite Team Member</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => onInviteEmailChange(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="colleague@company.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => onInviteRoleChange(e.target.value as any)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {getAvailableInviteRoles().map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                
                {!canInviteAdmin && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    Note: Only team owners can invite admins
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={onCloseInvite}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={onInviteMember}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Create New Project</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => onNewProjectChange({...newProject, name: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter project name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => onNewProjectChange({...newProject, description: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                  placeholder="Describe your project"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newProject.priority}
                    onChange={(e) => onNewProjectChange({...newProject, priority: e.target.value as any})}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newProject.dueDate ? newProject.dueDate.split('T')[0] : ''}
                    onChange={(e) => onNewProjectChange({...newProject, dueDate: e.target.value ? new Date(e.target.value).toISOString() : ''})}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={onCloseCreateProject}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={onCreateProject}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeamModals;