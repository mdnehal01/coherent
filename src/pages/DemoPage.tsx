import React, { useState } from 'react';
import { Play, Pause, RotateCcw, ArrowRight, CheckCircle, BarChart3, Users, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DemoPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const demoSteps = [
    {
      title: "Upload Your Data",
      description: "Simply drag and drop your CSV or Excel files to get started",
      image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Analyze & Visualize",
      description: "Get instant insights with beautiful charts and statistics",
      image: "https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Train ML Models",
      description: "Create powerful machine learning models with just a few clicks",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Make Predictions",
      description: "Use your trained models to make accurate predictions",
      image: "https://images.pexels.com/photos/7947664/pexels-photo-7947664.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ];

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
      title: "Advanced Analytics",
      description: "Get deep insights into your data with comprehensive statistical analysis and beautiful visualizations."
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      title: "Machine Learning",
      description: "Build and deploy machine learning models without any coding knowledge required."
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Team Collaboration",
      description: "Share insights and models with your team for better decision making."
    }
  ];

  const handlePlayDemo = () => {
    setIsPlaying(true);
    // Simulate demo progression
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= demoSteps.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return 0;
        }
        return prev + 1;
      });
    }, 3000);
  };

  const handlePauseDemo = () => {
    setIsPlaying(false);
  };

  const handleResetDemo = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
              See Coherent in Action
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Watch how Coherent transforms your data into actionable insights with powerful analytics and machine learning
            </p>
            
            {/* Demo Video Placeholder */}
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
              <div className="aspect-video bg-gradient-to-br from-blue-600 to-indigo-700 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mb-6">
                      <img 
                        src={demoSteps[currentStep].image}
                        alt={demoSteps[currentStep].title}
                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {demoSteps[currentStep].title}
                    </h3>
                    <p className="text-blue-100 mb-6">
                      {demoSteps[currentStep].description}
                    </p>
                    
                    {/* Demo Controls */}
                    <div className="flex justify-center gap-4">
                      {!isPlaying ? (
                        <button
                          onClick={handlePlayDemo}
                          className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg transition-all flex items-center gap-2"
                        >
                          <Play size={20} />
                          Start Demo
                        </button>
                      ) : (
                        <button
                          onClick={handlePauseDemo}
                          className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg transition-all flex items-center gap-2"
                        >
                          <Pause size={20} />
                          Pause Demo
                        </button>
                      )}
                      <button
                        onClick={handleResetDemo}
                        className="bg-blue-500 text-white hover:bg-blue-600 font-semibold py-3 px-6 rounded-lg transition-all flex items-center gap-2"
                      >
                        <RotateCcw size={20} />
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Progress Indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex gap-2">
                    {demoSteps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentStep ? 'bg-white' : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                Try It Now
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg transition-all"
              >
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to turn data into insights</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Steps */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in just 4 simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {demoSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <img 
                    src={step.image}
                    alt={step.title}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Coherent?</h2>
            <p className="text-xl text-gray-600">Join thousands of teams who trust Coherent</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "No coding required - intuitive drag & drop interface",
              "Advanced machine learning made simple",
              "Real-time collaboration with your team",
              "Secure cloud storage for all your data",
              "Beautiful visualizations and reports",
              "24/7 customer support"
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Transform your data into actionable insights today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white text-blue-700 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              Start Free Trial
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-lg transition-all"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DemoPage;