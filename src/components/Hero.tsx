<<<<<<< HEAD
import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
              Bring clarity to your work
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
=======
import React, { useState } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleGetStartedClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
              Bring clarity to your work
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
>>>>>>> 97bfcc7 (Added the team functionality)
              Coherent helps teams align priorities, streamline workflows, and achieve goals with unprecedented clarity.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
<<<<<<< HEAD
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                Get Started
=======
                onClick={handleGetStartedClick}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                {user ? 'Go to Dashboard' : 'Get Started Free'}
>>>>>>> 97bfcc7 (Added the team functionality)
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button 
                onClick={() => navigate('/demo')}
<<<<<<< HEAD
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg transition-all flex items-center justify-center"
=======
                className="border-2 border-yellow-600 text-yellow-600 dark:text-yellow-400 dark:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 font-semibold py-3 px-8 rounded-lg transition-all flex items-center justify-center"
>>>>>>> 97bfcc7 (Added the team functionality)
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </button>
            </div>
          </div>
          <div className="md:w-1/2 relative">
<<<<<<< HEAD
            <div className="relative z-10 rounded-2xl shadow-2xl overflow-hidden bg-white">
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-600 to-indigo-700 relative">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white text-xl font-semibold">App Dashboard Preview</p>
=======
            <div className="relative z-10 rounded-2xl shadow-2xl overflow-hidden bg-white dark:bg-gray-800">
              <div className="aspect-[4/3] bg-gradient-to-br from-green-600 to-yellow-600 relative">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white text-xl font-semibold">Analytics Dashboard Preview</p>
>>>>>>> 97bfcc7 (Added the team functionality)
                </div>
              </div>
            </div>
            <div className="absolute top-1/3 -right-4 w-20 h-20 bg-yellow-400 rounded-full opacity-70 blur-xl"></div>
<<<<<<< HEAD
            <div className="absolute bottom-1/3 -left-4 w-32 h-32 bg-blue-400 rounded-full opacity-70 blur-xl"></div>
          </div>
        </div>
        <div className="mt-20 text-center">
          <p className="text-gray-500 uppercase tracking-wider text-sm mb-6">Trusted by industry leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {['Company A', 'Company B', 'Company C', 'Company D'].map((company, index) => (
=======
            <div className="absolute bottom-1/3 -left-4 w-32 h-32 bg-green-400 rounded-full opacity-70 blur-xl"></div>
          </div>
        </div>
        <div className="mt-20 text-center">
          <p className="text-gray-500 dark:text-gray-400 uppercase tracking-wider text-sm mb-6">Trusted by industry leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {['The Adecco Group', 'LHH', 'Akkodis', 'QAPA'].map((company, index) => (
>>>>>>> 97bfcc7 (Added the team functionality)
              <div key={index} className="text-gray-400 font-semibold text-xl">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
<<<<<<< HEAD
=======
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
>>>>>>> 97bfcc7 (Added the team functionality)
    </section>
  );
};

export default Hero;