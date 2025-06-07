import React from 'react';
import { 
  CheckCircle, 
  BarChart3, 
  Users, 
  MessageSquare, 
  Calendar, 
  Lock,
  Brain,
  Cloud,
  Zap,
  Shield,
  Globe,
  Smartphone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();

  const mainFeatures = [
    {
      title: "Advanced Analytics",
      description: "Transform your raw data into meaningful insights with powerful statistical analysis and beautiful visualizations.",
      icon: <BarChart3 size={32} />,
      color: "blue",
      benefits: [
        "Interactive charts and graphs",
        "Statistical analysis tools",
        "Custom dashboard creation",
        "Real-time data updates"
      ]
    },
    {
      title: "Machine Learning",
      description: "Build and deploy machine learning models without any coding knowledge. Train models with just a few clicks.",
      icon: <Brain size={32} />,
      color: "purple",
      benefits: [
        "No-code ML model creation",
        "Automated feature selection",
        "Model performance tracking",
        "One-click predictions"
      ]
    },
    {
      title: "Team Collaboration",
      description: "Work together seamlessly with real-time collaboration tools and shared workspaces for better decision making.",
      icon: <Users size={32} />,
      color: "green",
      benefits: [
        "Real-time collaboration",
        "Shared workspaces",
        "Team permissions",
        "Activity tracking"
      ]
    },
    {
      title: "Cloud Storage",
      description: "Secure cloud storage ensures your data is always available and never lost, with automatic backups.",
      icon: <Cloud size={32} />,
      color: "indigo",
      benefits: [
        "Automatic cloud backup",
        "Cross-device sync",
        "Version history",
        "Unlimited storage"
      ]
    },
    {
      title: "Smart Automation",
      description: "Automate repetitive tasks and workflows with intelligent scheduling and smart suggestions.",
      icon: <Zap size={32} />,
      color: "yellow",
      benefits: [
        "Workflow automation",
        "Smart scheduling",
        "Automated reports",
        "Intelligent suggestions"
      ]
    },
    {
      title: "Enterprise Security",
      description: "Enterprise-grade security ensures your data remains protected with advanced encryption and compliance.",
      icon: <Shield size={32} />,
      color: "red",
      benefits: [
        "End-to-end encryption",
        "SOC 2 compliance",
        "Role-based access",
        "Audit logs"
      ]
    }
  ];

  const additionalFeatures = [
    {
      icon: <MessageSquare size={24} />,
      title: "Communication Hub",
      description: "Keep all project-related discussions organized and accessible in one place."
    },
    {
      icon: <Calendar size={24} />,
      title: "Smart Scheduling",
      description: "Plan your work with intelligent scheduling suggestions based on workload and priorities."
    },
    {
      icon: <Globe size={24} />,
      title: "Global Access",
      description: "Access your data and insights from anywhere in the world with our global infrastructure."
    },
    {
      icon: <Smartphone size={24} />,
      title: "Mobile Ready",
      description: "Full mobile support ensures you can work on the go with our responsive design."
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-500 to-blue-600 text-blue-600 bg-blue-50",
      purple: "from-purple-500 to-purple-600 text-purple-600 bg-purple-50",
      green: "from-green-500 to-green-600 text-green-600 bg-green-50",
      indigo: "from-indigo-500 to-indigo-600 text-indigo-600 bg-indigo-50",
      yellow: "from-yellow-500 to-yellow-600 text-yellow-600 bg-yellow-50",
      red: "from-red-500 to-red-600 text-red-600 bg-red-50"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
              Powerful Features for Modern Teams
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Everything you need to transform your data into actionable insights and drive better business decisions
            </p>
            <button
              onClick={() => navigate('/demo')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all"
            >
              See Features in Action
            </button>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Features</h2>
            <p className="text-xl text-gray-600">Comprehensive tools to handle all your data needs</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {mainFeatures.map((feature, index) => {
              const colorClasses = getColorClasses(feature.color);
              const [gradientClass, textClass, bgClass] = colorClasses.split(' ');
              
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className={`bg-gradient-to-r ${gradientClass} p-6`}>
                    <div className="text-white mb-4">{feature.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-white/90">{feature.description}</p>
                  </div>
                  <div className="p-6">
                    <h4 className="font-semibold mb-4 text-gray-800">Key Benefits:</h4>
                    <ul className="space-y-3">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center gap-3">
                          <CheckCircle className={`w-5 h-5 ${textClass}`} />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Additional Features</h2>
            <p className="text-xl text-gray-600">Even more tools to enhance your workflow</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-md transition-all">
                <div className="text-blue-600 mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Coherent?</h2>
            <p className="text-xl text-gray-600">See how we compare to traditional solutions</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Feature</th>
                    <th className="px-6 py-4 text-center font-semibold text-blue-600">Coherent</th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-500">Traditional Tools</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    ["No-Code ML", "✓", "✗"],
                    ["Real-time Collaboration", "✓", "Limited"],
                    ["Cloud Storage", "✓", "Extra Cost"],
                    ["Advanced Analytics", "✓", "Basic"],
                    ["Mobile Support", "✓", "Limited"],
                    ["24/7 Support", "✓", "Business Hours"],
                    ["Setup Time", "Minutes", "Weeks"],
                    ["Learning Curve", "Minimal", "Steep"]
                  ].map(([feature, coherent, traditional], index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{feature}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={coherent === "✓" ? "text-green-600 font-bold" : "text-blue-600 font-medium"}>
                          {coherent}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-500">{traditional}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience These Features?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Start your free trial today and see how Coherent can transform your data workflow
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white text-blue-700 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-lg transition-all"
            >
              View Pricing
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;