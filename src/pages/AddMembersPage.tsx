import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  UserPlus, 
  Mail, 
  Send, 
  CheckCircle, 
  Clock, 
  X,
  Copy,
  Users,
  Crown,
  Shield,
  Eye,
  Plus,
  Trash2
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface TeamInvitation {
  id: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  status: 'pending' | 'accepted' | 'expired';
  sentAt: string;
  token: string;
}

const AddMembersPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member');
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [teamId, setTeamId] = useState<string>('');
  const [teamName, setTeamName] = useState<string>('');

  useEffect(() => {
    // Get team info from navigation state
    if (location.state?.teamId) {
      setTeamId(location.state.teamId);
      setTeamName(location.state.teamName || 'Your Team');
      loadInvitations(location.state.teamId);
    } else {
      // Redirect back if no team info
      navigate('/team');
    }
  }, [location.state, navigate]);

  const loadInvitations = async (teamId: string) => {
    try {
      const { data, error } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedInvitations: TeamInvitation[] = data?.map(inv => ({
        id: inv.id,
        email: inv.email,
        role: inv.role,
        status: inv.accepted_at ? 'accepted' : 
                new Date(inv.expires_at) < new Date() ? 'expired' : 'pending',
        sentAt: inv.created_at,
        token: inv.token
      })) || [];

      setInvitations(formattedInvitations);
    } catch (error) {
      console.error('Error loading invitations:', error);
      toast.error('Failed to load invitations');
    }
  };

  const sendInvitationEmail = async (email: string, teamName: string, inviterName: string, inviteToken: string, teamId: string) => {
    try {
      // Call the edge function to send email
      const { data, error } = await supabase.functions.invoke('send-invitation-email', {
        body: {
          email,
          teamName,
          inviterName,
          inviteToken,
          teamId
        }
      });

      if (error) {
        console.error('Error calling email function:', error);
        // Don't throw error, just log it since email is optional
        return false;
      }

      console.log('Email sent successfully:', data);
      return true;
    } catch (error) {
      console.error('Error sending invitation email:', error);
      return false;
    }
  };

  const handleSendInvitation = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    if (!teamId) {
      toast.error('Team not found');
      return;
    }

    // Check if email is already invited
    if (invitations.some(inv => inv.email === inviteEmail && inv.status === 'pending')) {
      toast.error('This email has already been invited');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('team_invitations')
        .insert([
          {
            team_id: teamId,
            email: inviteEmail,
            role: inviteRole,
            invited_by: user?.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      const newInvitation: TeamInvitation = {
        id: data.id,
        email: data.email,
        role: data.role,
        status: 'pending',
        sentAt: data.created_at,
        token: data.token
      };

      setInvitations(prev => [newInvitation, ...prev]);

      // Send invitation email
      const inviterName = user?.email?.split('@')[0] || 'Team Admin';
      await sendInvitationEmail(inviteEmail, teamName, inviterName, data.token, teamId);

      setInviteEmail('');
      toast.success(`Invitation sent to ${inviteEmail}`);
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInviteLink = (token: string) => {
    const inviteLink = `${window.location.origin}/invite/${token}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success('Invite link copied to clipboard');
  };

  const handleDeleteInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('team_invitations')
        .delete()
        .eq('id', invitationId);

      if (error) throw error;

      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      toast.success('Invitation deleted');
    } catch (error) {
      console.error('Error deleting invitation:', error);
      toast.error('Failed to delete invitation');
    }
  };

  const handleFinishSetup = () => {
    navigate('/team');
    toast.success('Team setup completed! Welcome to your team.');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4 text-green-500" />;
      case 'member': return <Users className="w-4 h-4 text-gray-500" />;
      case 'viewer': return <Eye className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'accepted': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'expired': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'expired': return <X className="w-4 h-4" />;
      default: return null;
    }
  };

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
              Back to Team
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Add Team Members</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Invite colleagues to join "{teamName}"</p>
            </div>
          </div>
          <button
            onClick={handleFinishSetup}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Finish Setup
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Invite Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <UserPlus className="text-green-600 dark:text-green-400" size={24} />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Invite New Member</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="colleague@company.com"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendInvitation()}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="viewer">Viewer - Can view projects and data</option>
                  <option value="member">Member - Can edit and contribute</option>
                  <option value="admin">Admin - Can manage team and settings</option>
                </select>
              </div>

              <button
                onClick={handleSendInvitation}
                disabled={loading || !inviteEmail.trim()}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Invitation
                  </>
                )}
              </button>
            </div>

            {/* Role Descriptions */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Role Permissions:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300"><strong>Admin:</strong> Full access, can manage team and invite members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300"><strong>Member:</strong> Can create projects, upload data, and train models</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300"><strong>Viewer:</strong> Read-only access to projects and data</span>
                </div>
              </div>
            </div>
          </div>

          {/* Invitations List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Sent Invitations</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {invitations.length} invitation{invitations.length !== 1 ? 's' : ''}
              </span>
            </div>

            {invitations.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No invitations sent yet</h3>
                <p className="text-gray-500 dark:text-gray-400">Start by inviting your first team member</p>
              </div>
            ) : (
              <div className="space-y-4">
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">{invitation.email}</span>
                          <div className="flex items-center gap-1">
                            {getRoleIcon(invitation.role)}
                            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{invitation.role}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invitation.status)}`}>
                            {getStatusIcon(invitation.status)}
                            {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Sent {new Date(invitation.sentAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {invitation.status === 'pending' && (
                          <button
                            onClick={() => handleCopyInviteLink(invitation.token)}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title="Copy invite link"
                          >
                            <Copy size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteInvitation(invitation.id)}
                          className="p-2 text-red-400 hover:text-red-600"
                          title="Delete invitation"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
          <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3">💡 Tips for Team Setup</h3>
          <ul className="space-y-2 text-green-700 dark:text-green-200 text-sm">
            <li>• Start by inviting key team members who will be actively working on data projects</li>
            <li>• Use the Admin role sparingly - only for people who need to manage the team</li>
            <li>• You can always change member roles later from the team settings</li>
            <li>• Invited members will receive an email with instructions to join your team</li>
            <li>• Invite links expire after 7 days for security</li>
            <li>• If someone doesn't have an account yet, they'll be guided through signup after clicking the invite link</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddMembersPage;