import React from 'react';
import { ArrowRight } from 'lucide-react';

const CTASection: React.FC = () => {
  return (
<<<<<<< HEAD
    <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
=======
    <section className="py-20 bg-gradient-to-r from-green-600 to-yellow-600 text-white">
>>>>>>> 97bfcc7 (Added the team functionality)
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to bring clarity to your work?</h2>
        <p className="text-xl opacity-90 mb-10 max-w-3xl mx-auto">
          Join thousands of teams who have transformed their workflow with Coherent.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
<<<<<<< HEAD
          <button className="bg-white text-blue-700 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center mx-auto sm:mx-0">
=======
          <button className="bg-white text-green-700 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center mx-auto sm:mx-0">
>>>>>>> 97bfcc7 (Added the team functionality)
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          <button className="border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-lg transition-all mx-auto sm:mx-0">
            Schedule a Demo
          </button>
        </div>
        <p className="mt-6 text-sm opacity-80">No credit card required. 14-day free trial.</p>
      </div>
    </section>
  );
};

export default CTASection;