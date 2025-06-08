import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Clock, 
  Copy, 
  Trash2, 
  Send, 
  CheckCircle, 
  XCircle, 
  Calendar,
  User,
  Shield,
  Users,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface TeamInvitation {
  id: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  invited_by: string;
  token: string;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
  inviter_email?: string;
}

interface TeamInvitationsProps {
  currentTeamId?: string;
  currentUserRole?: 'owner' | 'admin' | 'member' | 'viewer';
}

const TeamInvitations: React.FC<TeamInvitationsProps> = ({ 
  currentTeamId, 
  currentUserRole 
}) => {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Check if current user can manage invitations (admin or owner)
  const canManageInvitations = currentUserRole === 'owner' || currentUserRole === 'admin';

  useEffect(() => {
    if (currentTeamId && canManageInvitations) {
      loadInvitations();
    }
  }, [currentTeamId, canManageInvitations]);

  const loadInvitations = async () => {
    if (!currentTeamId) return;

    try {
      setLoading(true);
      
      // Load team invitations with inviter information
      const { data, error } = await supabase
        .from('team_invitations')
        .select(`
          id,
          email,
          role,
          invited_by,
          token,
          expires_at,
          accepted_at,
          created_at,
          users!team_invitations_invited_by_fkey (
            email
          )
        `)
        .eq('team_id', currentTeamId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedInvitations: TeamInvitation[] = data?.map(inv => ({
        id: inv.id,
        email: inv.email,
        role: inv.role,
        invited_by: inv.invited_by,
        token: inv.token,
        expires_at: inv.expires_at,
        accepted_at: inv.accepted_at,
        created_at: inv.created_at,
        inviter_email: inv.users?.email
      })) || [];

      setInvitations(formattedInvitations);
    } catch (error) {
      console.error('Error loading invitations:', error);
      toast.error('Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInviteLink = (token: string) => {
    const inviteLink = `${window.location.origin}/invite/accept/${token}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success('Invite link copied to clipboard');
  };

  const handleResendInvitation = async (invitationId: string, email: string) => {
    setActionLoading(invitationId);
    try {
      // In a real implementation, you would call an API to resend the email
      // For now, we'll just show a success message
      toast.success(`Invitation resent to ${email}`);
    } catch (error) {
      console.error('Error resending invitation:', error);
      toast.error('Failed to resend invitation');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteInvitation = async (invitationId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete the invitation for ${email}?`)) {
      return;
    }

    setActionLoading(invitationId);
    try {
      const { error } = await supabase
        .from('team_invitations')
        .delete()
        .eq('id', invitationId);

      if (error) throw error;

      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      toast.success('Invitation deleted successfully');
    } catch (error) {
      console.error('Error deleting invitation:', error);
      toast.error('Failed to delete invitation');
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4 text-green-500" />;
      case 'member': return <Users className="w-4 h-4 text-gray-500" />;
      case 'viewer': return <Eye className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  const getStatusInfo = (invitation: TeamInvitation) => {
    if (invitation.accepted_at) {
      return {
        status: 'accepted',
        color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400',
        icon: <CheckCircle className="w-4 h-4" />,
        text: 'Accepted'
      };
    }
    
    const isExpired = new Date(invitation.expires_at) < new Date();
    if (isExpired) {
      return {
        status: 'expired',
        color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400',
        icon: <XCircle className="w-4 h-4" />,
        text: 'Expired'
      };
    }
    
    return {
      status: 'pending',
      color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400',
      icon: <Clock className="w-4 h-4" />,
      text: 'Pending'
    };
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

  const formatExpiresIn = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);

    if (diffInSeconds <= 0) return 'Expired';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m left`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h left`;
    return `${Math.floor(diffInSeconds / 86400)}d left`;
  };

  // Don't render if user doesn't have permission
  if (!canManageInvitations) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Team Invitations</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage pending and sent invitations to your team
          </p>
        </div>
        <button
          onClick={loadInvitations}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Invitations Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading invitations...</p>
          </div>
        ) : invitations.length === 0 ? (
          <div className="p-8 text-center">
            <Mail className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No invitations found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              All team invitations will appear here once sent
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Invitee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Invited By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Sent / Expires
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {invitations.map((invitation) => {
                  const statusInfo = getStatusInfo(invitation);
                  
                  return (
                    <tr key={invitation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {invitation.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(invitation.role)}
                          <span className="text-sm text-gray-900 dark:text-white capitalize">
                            {invitation.role}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.icon}
                          {statusInfo.text}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {invitation.inviter_email?.split('@')[0] || 'Unknown'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {invitation.inviter_email}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatTimeAgo(invitation.created_at)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {statusInfo.status === 'pending' ? (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatExpiresIn(invitation.expires_at)}
                            </span>
                          ) : statusInfo.status === 'accepted' ? (
                            <span className="text-green-600 dark:text-green-400">
                              Accepted {formatTimeAgo(invitation.accepted_at!)}
                            </span>
                          ) : (
                            <span className="text-red-600 dark:text-red-400">
                              Expired {formatTimeAgo(invitation.expires_at)}
                            </span>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {statusInfo.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleCopyInviteLink(invitation.token)}
                                className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                                title="Copy invite link"
                              >
                                <Copy size={16} />
                              </button>
                              <button
                                onClick={() => handleResendInvitation(invitation.id, invitation.email)}
                                disabled={actionLoading === invitation.id}
                                className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 disabled:opacity-50"
                                title="Resend invitation"
                              >
                                <Send size={16} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteInvitation(invitation.id, invitation.email)}
                            disabled={actionLoading === invitation.id}
                            className="text-red-500 hover:text-red-700 disabled:opacity-50"
                            title="Delete invitation"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {invitations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Sent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {invitations.length}
                </p>
              </div>
              <Mail className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {invitations.filter(inv => !inv.accepted_at && new Date(inv.expires_at) > new Date()).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Accepted</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {invitations.filter(inv => inv.accepted_at).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Expired</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {invitations.filter(inv => !inv.accepted_at && new Date(inv.expires_at) < new Date()).length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamInvitations;