import React, { useState, useEffect } from 'react';
import { Menu, X, Layers } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import AuthModal from './AuthModal';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const isHomePage = location.pathname === '/';

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Layers className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Coherent
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {isHomePage ? (
              <>
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
                  Contact
                </a>
              </>
            ) : (
              <>
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
              </>
            )}
          </nav>

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
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all hover:shadow-lg"
              >
                Log In
              </button>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <button
            className="md:hidden text-gray-700 hover:text-blue-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
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
                    Contact
                  </a>
                </>
              ) : (
                <>
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