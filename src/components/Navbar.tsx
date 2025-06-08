import React, { useState, useEffect } from 'react';
import { Menu, X, Layers } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
<<<<<<< HEAD
import AuthModal from './AuthModal';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
=======
import { useTheme } from '../contexts/ThemeContext';
import AuthModal from './AuthModal';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import { supabase } from '../lib/supabase';
>>>>>>> 97bfcc7 (Added the team functionality)

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
<<<<<<< HEAD
=======
  const { isDark } = useTheme();
>>>>>>> 97bfcc7 (Added the team functionality)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

<<<<<<< HEAD
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

=======
>>>>>>> 97bfcc7 (Added the team functionality)
  const isHomePage = location.pathname === '/';

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
<<<<<<< HEAD
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
=======
        isScrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg py-3' 
          : 'bg-transparent py-5'
>>>>>>> 97bfcc7 (Added the team functionality)
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
<<<<<<< HEAD
            <Layers className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
=======
            <Layers className="h-8 w-8 text-green-600" />
            <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
>>>>>>> 97bfcc7 (Added the team functionality)
              Coherent
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {isHomePage ? (
              <>
<<<<<<< HEAD
                <a href="#features\" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Features
                </a>
                <a href="#testimonials" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Testimonials
                </a>
                <a href="#pricing" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Pricing
                </a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
=======
                <a href="#features\" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">
                  Features
                </a>
                <a href="#testimonials" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">
                  Testimonials
                </a>
                <a href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">
                  Pricing
                </a>
                <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">
>>>>>>> 97bfcc7 (Added the team functionality)
                  Contact
                </a>
              </>
            ) : (
              <>
<<<<<<< HEAD
                <Link to="/features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Features
                </Link>
                <Link to="/demo" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Demo
                </Link>
                <Link to="/pricing" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Pricing
                </Link>
                <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Contact
                </Link>
=======
                <Link to="/features" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">
                  Features
                </Link>
                <Link to="/demo" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">
                  Demo
                </Link>
                <Link to="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">
                  Pricing
                </Link>
                <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">
                  Contact
                </Link>
                {user && (
                  <Link to="/team" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">
                    Team
                  </Link>
                )}
>>>>>>> 97bfcc7 (Added the team functionality)
              </>
            )}
          </nav>

<<<<<<< HEAD
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all hover:shadow-lg"
                >
                  Log Out
                </button>
=======
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {/* Notification Dropdown */}
                <NotificationDropdown />
                
                {/* Profile Dropdown */}
                <ProfileDropdown />
>>>>>>> 97bfcc7 (Added the team functionality)
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
<<<<<<< HEAD
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all hover:shadow-lg"
=======
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-all hover:shadow-lg"
>>>>>>> 97bfcc7 (Added the team functionality)
              >
                Log In
              </button>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <button
<<<<<<< HEAD
            className="md:hidden text-gray-700 hover:text-blue-600"
=======
            className="md:hidden text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
>>>>>>> 97bfcc7 (Added the team functionality)
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
<<<<<<< HEAD
          <div className="md:hidden bg-white absolute left-0 right-0 top-full shadow-md">
            <div className="flex flex-col space-y-4 p-4">
              {isHomePage ? (
                <>
                  <a href="#features\" className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors">
                    Features
                  </a>
                  <a href="#testimonials" className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors">
                    Testimonials
                  </a>
                  <a href="#pricing" className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors">
                    Pricing
                  </a>
                  <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors">
=======
          <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md absolute left-0 right-0 top-full shadow-xl border-t dark:border-gray-700">
            <div className="flex flex-col space-y-4 p-4">
              {isHomePage ? (
                <>
                  <a href="#features\" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium py-2 transition-colors">
                    Features
                  </a>
                  <a href="#testimonials" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium py-2 transition-colors">
                    Testimonials
                  </a>
                  <a href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium py-2 transition-colors">
                    Pricing
                  </a>
                  <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium py-2 transition-colors">
>>>>>>> 97bfcc7 (Added the team functionality)
                    Contact
                  </a>
                </>
              ) : (
                <>
<<<<<<< HEAD
                  <Link to="/features" className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors">
                    Features
                  </Link>
                  <Link to="/demo" className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors">
                    Demo
                  </Link>
                  <Link to="/pricing" className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors">
                    Pricing
                  </Link>
                  <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors">
                    Contact
                  </Link>
                </>
              )}
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-blue-600 hover:text-blue-800 font-medium py-2 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg w-full transition-all"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg w-full transition-all"
=======
                  <Link to="/features" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium py-2 transition-colors">
                    Features
                  </Link>
                  <Link to="/demo" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium py-2 transition-colors">
                    Demo
                  </Link>
                  <Link to="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium py-2 transition-colors">
                    Pricing
                  </Link>
                  <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium py-2 transition-colors">
                    Contact
                  </Link>
                  {user && (
                    <Link to="/team" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium py-2 transition-colors">
                      Team
                    </Link>
                  )}
                </>
              )}

              {user ? (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-medium">
                      {user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user?.email?.split('@')[0]}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  
                  <Link
                    to="/dashboard"
                    className="block text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium py-2 transition-colors"
                  >
                    Dashboard
                  </Link>
                  
                  <button
                    onClick={async () => {
                      try {
                        await supabase.auth.signOut();
                        setIsMenuOpen(false);
                      } catch (error) {
                        console.error('Error logging out:', error);
                      }
                    }}
                    className="w-full text-left text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium py-2 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg w-full transition-all"
>>>>>>> 97bfcc7 (Added the team functionality)
                >
                  Log In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};

export default Navbar;