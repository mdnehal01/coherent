import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Settings, 
  Bell, 
  HelpCircle, 
  LogOut, 
  ChevronDown,
  Edit3,
  Shield,
  CreditCard,
  Moon,
  Sun,
  Globe
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProfileDropdown: React.FC = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      setIsOpen(false);
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  const getUserDisplayName = () => {
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const menuItems = [
    {
      icon: <User size={16} />,
      label: 'Profile Settings',
      action: () => {
        setIsOpen(false);
        toast.info('Profile settings coming soon!');
      }
    },
    {
      icon: <Settings size={16} />,
      label: 'Account Settings',
      action: () => {
        setIsOpen(false);
        toast.info('Account settings coming soon!');
      }
    },
    {
      icon: <Bell size={16} />,
      label: 'Notification Preferences',
      action: () => {
        setIsOpen(false);
        toast.info('Notification preferences coming soon!');
      }
    },
    {
      icon: <Shield size={16} />,
      label: 'Privacy & Security',
      action: () => {
        setIsOpen(false);
        toast.info('Privacy settings coming soon!');
      }
    },
    {
      icon: <CreditCard size={16} />,
      label: 'Billing & Subscription',
      action: () => {
        setIsOpen(false);
        toast.info('Billing settings coming soon!');
      }
    },
    {
      icon: isDark ? <Sun size={16} /> : <Moon size={16} />,
      label: isDark ? 'Light Mode' : 'Dark Mode',
      action: () => {
        toggleTheme();
        setIsOpen(false);
      }
    },
    {
      icon: <Globe size={16} />,
      label: 'Language & Region',
      action: () => {
        setIsOpen(false);
        toast.info('Language settings coming soon!');
      }
    },
    {
      icon: <HelpCircle size={16} />,
      label: 'Help & Support',
      action: () => {
        setIsOpen(false);
        toast.info('Help center coming soon!');
      }
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
          {getUserInitials()}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {getUserDisplayName()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user?.email}
          </p>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
          {/* User Info Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {getUserInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {getUserDisplayName()}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    Online
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  toast.info('Edit profile coming soon!');
                }}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
                title="Edit Profile"
              >
                <Edit3 size={16} />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Dashboard</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Analytics</p>
                </div>
              </Link>
              
              <Link
                to="/team"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Team</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Collaborate</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="text-gray-500 dark:text-gray-400">
                  {item.icon}
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* Logout Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-lg"
            >
              <div className="text-red-500">
                <LogOut size={16} />
              </div>
              <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                Sign Out
              </span>
            </button>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Coherent v2.0</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    toast.info('Privacy policy coming soon!');
                  }}
                  className="hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Privacy
                </button>
                <span>•</span>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    toast.info('Terms of service coming soon!');
                  }}
                  className="hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Terms
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;