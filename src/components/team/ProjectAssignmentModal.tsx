import React, { useState } from 'react';
import { X, Users, Search, Check, User } from 'lucide-react';

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

interface ProjectAssignmentModalProps {
  isOpen: boolean;
  project: Project | null;
  teamMembers: TeamMember[];
  onClose: () => void;
  onAssign: (memberIds: string[]) => void;
  isLoading?: boolean;
}

const ProjectAssignmentModal: React.FC<ProjectAssignmentModalProps> = ({
  isOpen,
  project,
  teamMembers,
  onClose,
  onAssign,
  isLoading = false
}) => {
  const [selectedMembers, setSelectedMembers] = useState<string[]>(project?.members || []);
  const [searchTerm, setSearchTerm] = useState('');

  const handleMemberToggle = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const handleAssign = () => {
    onAssign(selectedMembers);
  };

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'admin': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'member': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'viewer': return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Assign Team Members</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Project: {project.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Selected Members Summary */}
        {selectedMembers.length > 0 && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
              Selected Members ({selectedMembers.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedMembers.map(memberId => {
                const member = teamMembers.find(m => m.id === memberId);
                return member ? (
                  <span
                    key={memberId}
                    className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {member.name}
                    <button
                      onClick={() => handleMemberToggle(memberId)}
                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Members List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto text-gray-400 mb-4\" size={48} />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No members found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? 'Try adjusting your search criteria' : 'No team members available'}
              </p>
            </div>
          ) : (
            filteredMembers.map((member) => (
              <div
                key={member.id}
                onClick={() => handleMemberToggle(member.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedMembers.includes(member.id)
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
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
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </span>
                    {selectedMembers.includes(member.id) && (
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                </div>
              </div>
            ))
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
            onClick={handleAssign}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            {isLoading ? 'Assigning...' : `Assign ${selectedMembers.length} Member${selectedMembers.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectAssignmentModal;