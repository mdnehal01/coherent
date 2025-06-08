import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Crown, 
  UserCheck, 
  Building2, 
  ArrowRight,
  Calendar,
  User
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Team {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  user_role?: 'owner' | 'admin' | 'member' | 'viewer';
  member_count?: number;
}

const TeamSelectionPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ownedTeams, setOwnedTeams] = useState<Team[]>([]);
  const [joinedTeams, setJoinedTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (user) {
      loadTeams();
    }
  }, [user]);

  const loadTeams = async () => {
    try {
      setLoading(true);
      
      // Load teams where user is a member with their role
      const { data: teamMemberships, error: membershipsError } = await supabase
        .from('team_members')
        .select(`
          team_id,
          role,
          teams (
            id,
            name,
            description,
            created_by,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user?.id);

      if (membershipsError) {
        console.error('Error loading team memberships:', membershipsError);
        toast.error('Failed to load teams');
        return;
      }

      const allTeams = teamMemberships?.map(membership => ({
        ...membership.teams,
        user_role: membership.role
      })).filter(Boolean) || [];

      // Get member counts for each team
      const teamIds = allTeams.map(team => team.id);
      if (teamIds.length > 0) {
        const { data: memberCounts } = await supabase
          .from('team_members')
          .select('team_id')
          .in('team_id', teamIds);

        // Count members per team
        const counts = memberCounts?.reduce((acc, member) => {
          acc[member.team_id] = (acc[member.team_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

        // Add member counts to teams
        allTeams.forEach(team => {
          team.member_count = counts[team.id] || 0;
        });
      }

      // Separate owned teams from joined teams
      const owned = allTeams.filter(team => team.created_by === user?.id);
      const joined = allTeams.filter(team => team.created_by !== user?.id);

      setOwnedTeams(owned);
      setJoinedTeams(joined);
      
    } catch (error) {
      console.error('Error loading teams:', error);
      toast.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeam.name.trim()) {
      toast.error('Please enter a team name');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([
          {
            name: newTeam.name,
            description: newTeam.description,
            created_by: user?.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success('Team created successfully!');
      setNewTeam({ name: '', description: '' });
      setShowCreateModal(false);
      
      // Navigate to the new team
      navigate(`/team/${data.id}`);
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error('Failed to create team');
    }
  };

  const handleTeamSelect = (team: Team) => {
    navigate(`/team/${team.id}`);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-4 h-4 text-yellow-500" />;
      default: return <UserCheck className="w-4 h-4 text-green-500" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      owner: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      admin: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      member: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
      viewer: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[role as keyof typeof colors] || colors.member}`}>
        {role?.charAt(0).toUpperCase() + role?.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 mt-4">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Your Teams</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Choose a team to collaborate on data projects and analytics
          </p>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all flex items-center gap-2 mx-auto"
          >
            <Plus size={20} />
            Create New Team
          </button>
        </div>

        {/* Teams Grid */}
        <div className="max-w-6xl mx-auto">
          {/* My Teams Section */}
          {ownedTeams.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Crown className="w-6 h-6 text-yellow-500" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Teams</h2>
                <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full text-sm font-medium">
                  {ownedTeams.length} team{ownedTeams.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ownedTeams.map((team) => (
                  <div
                    key={team.id}
                    onClick={() => handleTeamSelect(team)}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-yellow-200 dark:hover:border-yellow-800 group"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                          <Crown className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        {getRoleBadge(team.user_role || 'owner')}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                        {team.name}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {team.description || 'No description provided'}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{team.member_count || 0} member{(team.member_count || 0) !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Created {new Date(team.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Open Team</span>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Teams I'm Part Of Section */}
          {joinedTeams.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <UserCheck className="w-6 h-6 text-green-500" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Teams I'm Part Of</h2>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                  {joinedTeams.length} team{joinedTeams.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {joinedTeams.map((team) => (
                  <div
                    key={team.id}
                    onClick={() => handleTeamSelect(team)}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-200 dark:hover:border-green-800 group"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          {getRoleIcon(team.user_role || 'member')}
                        </div>
                        {getRoleBadge(team.user_role || 'member')}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {team.name}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {team.description || 'No description provided'}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{team.member_count || 0} member{(team.member_count || 0) !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {new Date(team.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Open Team</span>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Teams State */}
          {ownedTeams.length === 0 && joinedTeams.length === 0 && (
            <div className="text-center py-16">
              <Building2 className="mx-auto text-gray-400 mb-6" size={64} />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No teams yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Create your first team to start collaborating with colleagues on data projects and analytics.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all flex items-center gap-2 mx-auto"
              >
                <Plus size={20} />
                Create Your First Team
              </button>
            </div>
          )}
        </div>

        {/* Create Team Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Create New Team</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter team name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newTeam.description}
                    onChange={(e) => setNewTeam({...newTeam, description: e.target.value})}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows={3}
                    placeholder="Describe your team's purpose"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTeam}
                  disabled={!newTeam.name.trim()}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg"
                >
                  Create Team
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamSelectionPage;