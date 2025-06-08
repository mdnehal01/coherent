import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Successfully logged in!');
<<<<<<< HEAD
=======
        onClose();
>>>>>>> 97bfcc7 (Added the team functionality)
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
<<<<<<< HEAD
        toast.success('Registration successful! You can now log in.');
      }
      onClose();
    } catch (error) {
=======
        
        // Show confirmation email notification
        toast.success(
          'Registration successful! Please check your email for a confirmation link to complete your account setup.',
          {
            duration: 6000,
            style: {
              maxWidth: '500px',
            },
          }
        );
        
        // Don't close modal immediately for signup, let user know to check email
        setEmail('');
        setPassword('');
        setIsLogin(true); // Switch to login mode
      }
    } catch (error: any) {
>>>>>>> 97bfcc7 (Added the team functionality)
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
<<<<<<< HEAD
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
=======
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
>>>>>>> 97bfcc7 (Added the team functionality)
        >
          <X size={24} />
        </button>
        
<<<<<<< HEAD
        <h2 className="text-2xl font-bold mb-6">
=======
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
>>>>>>> 97bfcc7 (Added the team functionality)
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
<<<<<<< HEAD
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
=======
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
>>>>>>> 97bfcc7 (Added the team functionality)
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
<<<<<<< HEAD
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
=======
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
>>>>>>> 97bfcc7 (Added the team functionality)
              required
            />
          </div>
          
          <div>
<<<<<<< HEAD
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
=======
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
>>>>>>> 97bfcc7 (Added the team functionality)
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
<<<<<<< HEAD
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
=======
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
              minLength={6}
            />
            {!isLogin && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Password must be at least 6 characters long
              </p>
            )}
>>>>>>> 97bfcc7 (Added the team functionality)
          </div>
          
          <button
            type="submit"
            disabled={loading}
<<<<<<< HEAD
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
=======
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
>>>>>>> 97bfcc7 (Added the team functionality)
          >
            {loading ? 'Loading...' : isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
<<<<<<< HEAD
            className="text-blue-600 hover:text-blue-800 text-sm"
=======
            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-sm"
>>>>>>> 97bfcc7 (Added the team functionality)
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
          </button>
        </div>
<<<<<<< HEAD
=======
        
        {!isLogin && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>Note:</strong> After signing up, you'll receive a confirmation email. 
              Please check your inbox and click the confirmation link to activate your account.
            </p>
          </div>
        )}
>>>>>>> 97bfcc7 (Added the team functionality)
      </div>
    </div>
  );
};

export default AuthModal;