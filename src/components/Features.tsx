import React from 'react';
import { CheckCircle, BarChart3, Users, MessageSquare, Calendar, Lock } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
<<<<<<< HEAD
    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
=======
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="text-green-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
>>>>>>> 97bfcc7 (Added the team functionality)
    </div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      title: "Task Management",
      description: "Create, assign, and track tasks with ease. Set deadlines and priorities to stay on top of your work.",
      icon: <CheckCircle size={28} />
    },
    {
      title: "Performance Analytics",
      description: "Get insights into team productivity and project progress with detailed analytics.",
      icon: <BarChart3 size={28} />
    },
    {
      title: "Team Collaboration",
      description: "Work together seamlessly with real-time collaboration tools and shared workspaces.",
      icon: <Users size={28} />
    },
    {
      title: "Communication Hub",
      description: "Keep all project-related discussions organized and accessible in one place.",
      icon: <MessageSquare size={28} />
    },
    {
      title: "Smart Scheduling",
      description: "Plan your work with intelligent scheduling suggestions based on workload and priorities.",
      icon: <Calendar size={28} />
    },
    {
      title: "Secure & Private",
      description: "Enterprise-grade security ensures your data remains protected and private.",
      icon: <Lock size={28} />
    }
  ];

  return (
<<<<<<< HEAD
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Modern Teams</h2>
          <p className="text-xl text-gray-600">Everything you need to bring clarity and efficiency to your workflow</p>
=======
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Powerful Features for Modern Teams</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Everything you need to bring clarity and efficiency to your workflow</p>
>>>>>>> 97bfcc7 (Added the team functionality)
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;