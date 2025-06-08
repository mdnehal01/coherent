import React from 'react';
import { Check } from 'lucide-react';

interface PricingTierProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

const PricingTier: React.FC<PricingTierProps> = ({ 
  title, 
  price, 
  description, 
  features, 
  isPopular = false 
}) => {
  return (
<<<<<<< HEAD
    <div className={`bg-white rounded-2xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl ${
      isPopular ? 'border-2 border-blue-500 scale-105 z-10' : ''
    }`}>
      {isPopular && (
        <div className="bg-blue-500 text-white text-center py-1 text-sm font-medium">
=======
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl ${
      isPopular ? 'border-2 border-green-500 scale-105 z-10' : ''
    }`}>
      {isPopular && (
        <div className="bg-green-500 text-white text-center py-1 text-sm font-medium">
>>>>>>> 97bfcc7 (Added the team functionality)
          Most Popular
        </div>
      )}
      <div className="p-8">
<<<<<<< HEAD
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        <div className="mb-6">
          <span className="text-4xl font-bold">{price}</span>
          {price !== 'Custom' && <span className="text-gray-500">/month</span>}
        </div>
        <button className={`w-full py-2 px-4 rounded-lg font-medium mb-8 transition-colors ${
          isPopular 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
=======
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
        <div className="mb-6">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">{price}</span>
          {price !== 'Custom' && <span className="text-gray-500 dark:text-gray-400">/month</span>}
        </div>
        <button className={`w-full py-2 px-4 rounded-lg font-medium mb-8 transition-colors ${
          isPopular 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
>>>>>>> 97bfcc7 (Added the team functionality)
        }`}>
          Get Started
        </button>
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <Check size={18} className="text-green-500 mr-2" />
<<<<<<< HEAD
              <span className="text-gray-700">{feature}</span>
=======
              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
>>>>>>> 97bfcc7 (Added the team functionality)
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Pricing: React.FC = () => {
  return (
<<<<<<< HEAD
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600">Choose the plan that fits your team's needs</p>
=======
    <section id="pricing" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Choose the plan that fits your team's needs</p>
>>>>>>> 97bfcc7 (Added the team functionality)
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingTier
            title="Starter"
            price="$9"
            description="Perfect for individuals and small teams"
            features={[
              "Up to 5 team members",
              "Basic task management",
              "10 projects",
              "1GB storage",
              "Email support"
            ]}
          />
          <PricingTier
            title="Professional"
            price="$29"
            description="Ideal for growing teams and companies"
            features={[
              "Up to 20 team members",
              "Advanced task management",
              "Unlimited projects",
              "20GB storage",
              "Priority support",
              "Advanced analytics",
              "Custom workflows"
            ]}
            isPopular={true}
          />
          <PricingTier
            title="Enterprise"
            price="Custom"
            description="For large organizations with specific needs"
            features={[
              "Unlimited team members",
              "All Professional features",
              "Unlimited storage",
              "24/7 premium support",
              "Dedicated account manager",
              "Custom integrations",
              "Advanced security features"
            ]}
          />
        </div>
        
        <div className="mt-12 text-center">
<<<<<<< HEAD
          <p className="text-gray-600 mb-4">Not sure which plan is right for you?</p>
          <button className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
=======
          <p className="text-gray-600 dark:text-gray-300 mb-4">Not sure which plan is right for you?</p>
          <button className="text-green-600 dark:text-green-400 font-semibold hover:text-green-800 dark:hover:text-green-300 transition-colors">
>>>>>>> 97bfcc7 (Added the team functionality)
            Contact our sales team
          </button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;