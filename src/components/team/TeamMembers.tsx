import React, { useState } from 'react';
import { 
  UserPlus, 
  Crown, 
  Shield, 
  Users, 
  Eye, 
  MessageSquare, 
  Mail, 
  MoreVertical,
  Edit3,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

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

interface TeamMembersProps {
  teamMembers: TeamMember[];
  onInviteMember: () => void;
  currentTeamId?: string;
  onMembersUpdate?: () => void;
}

const TeamMembers: React.FC<TeamMembersProps> = ({ 
  teamMembers, 
  onInviteMember, 
  currentTeamId,
  onMembersUpdate 
}) => {
  const { user } = useAuth();
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<'admin' | 'member' | 'viewer'>('member');
  const [loading, setLoading] = useState(false);

  // Get current user's role in the team
  const currentUserRole = teamMembers.find(member => member.id === user?.id)?.role;

  // Check if current user can manage members (admin or owner)
  const canManageMembers = currentUserRole === 'owner' || currentUserRole === 'admin';

  // Check if current user can invite admins (only owner)
  const canInviteAdmin = currentUserRole === 'owner';

  // Check if current user can edit a specific member
  const canEditMember = (memberRole: string) => {
    if (currentUserRole === 'owner') return true;
    if (currentUserRole === 'admin' && memberRole !== 'owner' && memberRole !== 'admin') return true;
    return false;
  };

  // Check if current user can delete a specific member
  const canDeleteMember = (memberRole: string, memberId: string) => {
    if (memberId === user?.id) return false; // Can't delete yourself
    if (currentUserRole === 'owner' && memberRole !== 'owner') return true;
    if (currentUserRole === 'admin' && memberRole !== 'owner' && memberRole !== 'admin') return true;
    return false;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'admin': return <Shield className="w-4 h-4 text-green-500" />;
      case 'member': return <Users className="w-4 h-4 text-gray-500" />;
      case 'viewer': return <Eye className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const handleEditRole = async (memberId: string) => {
    if (!currentTeamId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ role: newRole })
        .eq('team_id', currentTeamId)
        .eq('user_id', memberId);

      if (error) throw error;

      toast.success('Member role updated successfully');
      setEditingMember(null);
      if (onMembersUpdate) onMembersUpdate();
    } catch (error) {
      console.error('Error updating member role:', error);
      toast.error('Failed to update member role');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (memberId: string, memberName: string) => {
    if (!currentTeamId) return;

    if (!confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', currentTeamId)
        .eq('user_id', memberId);

      if (error) throw error;

      toast.success(`${memberName} has been removed from the team`);
      if (onMembersUpdate) onMembersUpdate();
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Failed to remove member');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (memberId: string, currentRole: string) => {
    setEditingMember(memberId);
    setNewRole(currentRole as 'admin' | 'member' | 'viewer');
  };

  const cancelEditing = () => {
    setEditingMember(null);
    setNewRole('member');
  };

  // Filter available roles based on current user's permissions
  const getAvailableRoles = () => {
    if (currentUserRole === 'owner') {
      return [
        { value: 'admin', label: 'Admin - Can manage team and settings' },
        { value: 'member', label: 'Member - Can edit and contribute' },
        { value: 'viewer', label: 'Viewer - Can view projects and data' }
      ];
    } else if (currentUserRole === 'admin') {
      return [
        { value: 'member', label: 'Member - Can edit and contribute' },
        { value: 'viewer', label: 'Viewer - Can view projects and data' }
      ];
    }
    return [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Team Members</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {canManageMembers ? 'Manage your team members and their roles' : 'View team members'}
          </p>
        </div>
        {canManageMembers && (
          <button
            onClick={onInviteMember}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <UserPlus size={20} />
            Invite Member
          </button>
        )}
      </div>

      {/* Permission Notice */}
      {!canManageMembers && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              You have view-only access to team members. Contact an admin or owner to manage members.
            </p>
          </div>
        </div>
      )}

      {/* Members List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-medium">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member.status)} rounded-full border-2 border-white dark:border-gray-800`}></div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {member.name}
                          {member.id === user?.id && (
                            <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingMember === member.id ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value as any)}
                          className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          disabled={loading}
                        >
                          {getAvailableRoles().map(role => (
                            <option key={role.value} value={role.value}>
                              {role.value.charAt(0).toUpperCase() + role.value.slice(1)}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleEditRole(member.id)}
                          disabled={loading}
                          className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 disabled:opacity-50"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={cancelEditing}
                          disabled={loading}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {getRoleIcon(member.role)}
                        <span className="text-sm text-gray-900 dark:text-white capitalize">{member.role}</span>
                        {canEditMember(member.role) && (
                          <button
                            onClick={() => startEditing(member.id, member.role)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2"
                            title="Edit role"
                          >
                            <Edit3 size={14} />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      member.status === 'online' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                      member.status === 'away' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                        title="Send message"
                      >
                        <MessageSquare size={16} />
                      </button>
                      <button 
                        className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                        title="Send email"
                      >
                        <Mail size={16} />
                      </button>
                      {canDeleteMember(member.role, member.id) && (
                        <button
                          onClick={() => handleDeleteMember(member.id, member.name)}
                          disabled={loading}
                          className="text-red-500 hover:text-red-700 disabled:opacity-50"
                          title="Remove from team"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permissions Info */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Role Permissions:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-yellow-500" />
              <span className="font-medium text-gray-900 dark:text-white">Owner:</span>
              <span className="text-gray-600 dark:text-gray-400">Full control, can manage all members and roles</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="font-medium text-gray-900 dark:text-white">Admin:</span>
              <span className="text-gray-600 dark:text-gray-400">Can manage members and viewers, cannot invite admins</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-900 dark:text-white">Member:</span>
              <span className="text-gray-600 dark:text-gray-400">Can create projects, upload data, and train models</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">Viewer:</span>
              <span className="text-gray-600 dark:text-gray-400">Read-only access to projects and data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;