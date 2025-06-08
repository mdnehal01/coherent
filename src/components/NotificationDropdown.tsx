import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, X, Users, Clock, CheckCircle, XCircle, FileText, UserPlus, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data: any;
  read: boolean;
  created_at: string;
}

interface TeamInvitation {
  id: string;
  team_id: string;
  team_name: string;
  inviter_name: string;
  role: string;
  token: string;
  expires_at: string;
}

const NotificationDropdown: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadNotifications();
      // Set up real-time subscription for notifications
      const subscription = supabase
        .channel('notifications')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          }, 
          () => {
            loadNotifications();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    if (!user) return;

    try {
      // Load notifications
      const { data: notificationsData, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (notificationsError) throw notificationsError;

      // Load team invitations for the user's email - simple query without foreign key joins
      const { data: invitationsData, error: invitationsError } = await supabase
        .from('team_invitations')
        .select(`
          id,
          team_id,
          role,
          token,
          expires_at,
          created_at,
          teams (
            name
          )
        `)
        .eq('email', user.email)
        .is('accepted_at', null)
        .gt('expires_at', new Date().toISOString());

      if (invitationsError) {
        console.error('Error loading invitations:', invitationsError);
        // Continue without invitations if there's an error
      }

      // Convert team invitations to notifications
      const invitationNotifications: Notification[] = invitationsData?.map(invitation => ({
        id: `invitation_${invitation.id}`,
        type: 'team_invitation',
        title: 'Team Invitation',
        message: `You've been invited to join ${invitation.teams?.name || 'a team'}`,
        data: {
          invitation_id: invitation.id,
          team_id: invitation.team_id,
          team_name: invitation.teams?.name || 'Unknown Team',
          inviter_name: 'Team Admin', // Generic name since we can't fetch the actual inviter
          role: invitation.role,
          token: invitation.token,
          expires_at: invitation.expires_at
        },
        read: false,
        created_at: invitation.created_at
      })) || [];

      // Combine and sort all notifications
      const allNotifications = [
        ...(notificationsData || []),
        ...invitationNotifications
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setNotifications(allNotifications);
      setUnreadCount(allNotifications.filter(n => !n.read).length);

    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Failed to load notifications');
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (notificationId.startsWith('invitation_')) return; // Don't mark invitations as read

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleInvitationAction = async (action: 'accept' | 'decline', invitation: TeamInvitation) => {
    setLoading(true);
    try {
      if (action === 'accept') {
        // Add user to team
        const { error: memberError } = await supabase
          .from('team_members')
          .insert([
            {
              team_id: invitation.team_id,
              user_id: user?.id,
              role: invitation.role,
              invited_by: null // We don't have the inviter's user_id in the invitation
            }
          ]);

        if (memberError) throw memberError;

        // Mark invitation as accepted
        const { error: inviteError } = await supabase
          .from('team_invitations')
          .update({ accepted_at: new Date().toISOString() })
          .eq('id', invitation.id);

        if (inviteError) throw inviteError;

        toast.success(`Successfully joined ${invitation.team_name}!`);
      } else {
        // Mark invitation as declined (we can add a declined_at column later)
        // For now, we'll just delete the invitation
        const { error } = await supabase
          .from('team_invitations')
          .delete()
          .eq('id', invitation.id);

        if (error) throw error;

        toast.success('Invitation declined');
      }

      // Remove the notification from the list
      setNotifications(prev => 
        prev.filter(n => n.id !== `invitation_${invitation.id}`)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));

    } catch (error) {
      console.error('Error handling invitation:', error);
      toast.error('Failed to process invitation');
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user?.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'team_invitation':
        return <Users className="w-5 h-5 text-green-500" />;
      case 'project_assignment':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'member_joined':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'comment_added':
        return <MessageSquare className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="mx-auto text-gray-400 mb-4\" size={48} />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No notifications
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  You're all caught up!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      !notification.read ? 'bg-green-50 dark:bg-green-900/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            
                            {notification.type === 'project_assignment' && notification.data && (
                              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <p className="text-xs text-blue-800 dark:text-blue-200">
                                  <strong>Project:</strong> {notification.data.project_name}
                                </p>
                                <p className="text-xs text-blue-800 dark:text-blue-200">
                                  <strong>Team:</strong> {notification.data.team_name}
                                </p>
                                <p className="text-xs text-blue-800 dark:text-blue-200">
                                  <strong>Assigned by:</strong> {notification.data.assigned_by}
                                </p>
                              </div>
                            )}
                            
                            {notification.type === 'team_invitation' && (
                              <div className="mt-3 flex gap-2">
                                <button
                                  onClick={() => handleInvitationAction('accept', {
                                    id: notification.data.invitation_id,
                                    team_id: notification.data.team_id,
                                    team_name: notification.data.team_name,
                                    inviter_name: notification.data.inviter_name,
                                    role: notification.data.role,
                                    token: notification.data.token,
                                    expires_at: notification.data.expires_at
                                  })}
                                  disabled={loading}
                                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-xs px-3 py-1 rounded-md transition-colors"
                                >
                                  <CheckCircle size={14} />
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleInvitationAction('decline', {
                                    id: notification.data.invitation_id,
                                    team_id: notification.data.team_id,
                                    team_name: notification.data.team_name,
                                    inviter_name: notification.data.inviter_name,
                                    role: notification.data.role,
                                    token: notification.data.token,
                                    expires_at: notification.data.expires_at
                                  })}
                                  disabled={loading}
                                  className="flex items-center gap-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white text-xs px-3 py-1 rounded-md transition-colors"
                                >
                                  <XCircle size={14} />
                                  Decline
                                </button>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 ml-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTimeAgo(notification.created_at)}
                            </span>
                            {!notification.read && notification.type !== 'team_invitation' && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                                title="Mark as read"
                              >
                                <Check size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;