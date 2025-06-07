import React, { useState } from 'react';
import { Check, X, ArrowRight, Star, Users, Zap, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PricingPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      description: "Perfect for individuals and small teams getting started",
      monthlyPrice: 9,
      annualPrice: 7,
      icon: <Users className="w-8 h-8" />,
      color: "blue",
      features: [
        "Up to 5 team members",
        "Basic data analytics",
        "10 datasets",
        "1GB cloud storage",
        "Email support",
        "Basic visualizations",
        "CSV/Excel import"
      ],
      limitations: [
        "No machine learning",
        "Limited integrations",
        "Basic support only"
      ]
    },
    {
      name: "Professional",
      description: "Ideal for growing teams and businesses",
      monthlyPrice: 29,
      annualPrice: 24,
      icon: <Zap className="w-8 h-8" />,
      color: "purple",
      popular: true,
      features: [
        "Up to 20 team members",
        "Advanced analytics",
        "Unlimited datasets",
        "20GB cloud storage",
        "Priority support",
        "Machine learning models",
        "Custom visualizations",
        "API access",
        "Team collaboration",
        "Advanced integrations"
      ],
      limitations: []
    },
    {
      name: "Enterprise",
      description: "For large organizations with advanced needs",
      monthlyPrice: 99,
      annualPrice: 79,
      icon: <Shield className="w-8 h-8" />,
      color: "green",
      features: [
        "Unlimited team members",
        "All Professional features",
        "Unlimited storage",
        "24/7 premium support",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced security",
        "SSO integration",
        "Custom deployment",
        "SLA guarantee",
        "Training & onboarding"
      ],
      limitations: []
    }
  ];

  const faqs = [
    {
      question: "Can I change my plan at any time?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate the billing."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes, we offer a 14-day free trial for all plans. No credit card required to get started."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise customers."
    },
    {
      question: "Can I cancel my subscription?",
      answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
    },
    {
      question: "Do you offer discounts for nonprofits?",
      answer: "Yes, we offer special pricing for nonprofits and educational institutions. Contact our sales team for details."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade security with end-to-end encryption and are SOC 2 compliant."
    }
  ];

  const getColorClasses = (color: string, popular = false) => {
    if (popular) {
      return {
        border: "border-purple-500",
        bg: "bg-purple-50",
        text: "text-purple-600",
        button: "bg-purple-600 hover:bg-purple-700 text-white"
      };
    }
    
    const colors = {
      blue: {
        border: "border-gray-200",
        bg: "bg-blue-50",
        text: "text-blue-600",
        button: "bg-blue-600 hover:bg-blue-700 text-white"
      },
      purple: {
        border: "border-gray-200",
        bg: "bg-purple-50",
        text: "text-purple-600",
        button: "bg-purple-600 hover:bg-purple-700 text-white"
      },
      green: {
        border: "border-gray-200",
        bg: "bg-green-50",
        text: "text-green-600",
        button: "bg-green-600 hover:bg-green-700 text-white"
      }
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
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Choose the plan that fits your team's needs. Start free, scale as you grow.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`font-medium ${!isAnnual ? 'text-blue-600' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  isAnnual ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    isAnnual ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`font-medium ${isAnnual ? 'text-blue-600' : 'text-gray-500'}`}>
                Annual
              </span>
              {isAnnual && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                  Save 20%
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
              const colorClasses = getColorClasses(plan.color, plan.popular);
              const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
              
              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    plan.popular ? 'border-2 border-purple-500 scale-105' : 'border border-gray-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="bg-purple-500 text-white text-center py-2 text-sm font-medium">
                      <Star className="inline w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  )}
                  
                  <div className="p-8">
                    <div className={`${colorClasses.bg} w-16 h-16 rounded-lg flex items-center justify-center mb-4`}>
                      <div className={colorClasses.text}>{plan.icon}</div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold">${price}</span>
                      <span className="text-gray-500">/month</span>
                      {isAnnual && (
                        <div className="text-sm text-green-600 font-medium">
                          ${plan.monthlyPrice * 12 - price * 12} saved annually
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => navigate('/dashboard')}
                      className={`w-full py-3 px-4 rounded-lg font-medium mb-8 transition-all ${colorClasses.button}`}
                    >
                      {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                    </button>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">What's included:</h4>
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                      
                      {plan.limitations.length > 0 && (
                        <>
                          <h4 className="font-semibold text-gray-800 mt-6">Limitations:</h4>
                          {plan.limitations.map((limitation, limitIndex) => (
                            <div key={limitIndex} className="flex items-start gap-3">
                              <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-500">{limitation}</span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Compare Plans</h2>
            <p className="text-xl text-gray-600">See what's included in each plan</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Features</th>
                    <th className="px-6 py-4 text-center font-semibold">Starter</th>
                    <th className="px-6 py-4 text-center font-semibold text-purple-600">Professional</th>
                    <th className="px-6 py-4 text-center font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    ["Team Members", "5", "20", "Unlimited"],
                    ["Datasets", "10", "Unlimited", "Unlimited"],
                    ["Storage", "1GB", "20GB", "Unlimited"],
                    ["Machine Learning", "✗", "✓", "✓"],
                    ["API Access", "✗", "✓", "✓"],
                    ["Priority Support", "✗", "✓", "✓"],
                    ["Custom Integrations", "✗", "✗", "✓"],
                    ["SSO", "✗", "✗", "✓"],
                    ["SLA", "✗", "✗", "✓"]
                  ].map(([feature, starter, professional, enterprise], index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{feature}</td>
                      <td className="px-6 py-4 text-center">
                        {starter === "✓" ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : starter === "✗" ? (
                          <X className="w-5 h-5 text-red-400 mx-auto" />
                        ) : (
                          <span className="text-gray-600">{starter}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {professional === "✓" ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : professional === "✗" ? (
                          <X className="w-5 h-5 text-red-400 mx-auto" />
                        ) : (
                          <span className="text-purple-600 font-medium">{professional}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {enterprise === "✓" ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : enterprise === "✗" ? (
                          <X className="w-5 h-5 text-red-400 mx-auto" />
                        ) : (
                          <span className="text-green-600 font-medium">{enterprise}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about our pricing</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="font-semibold mb-3 text-gray-800">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of teams who trust Coherent to transform their data into insights
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
          <p className="mt-6 text-sm opacity-80">No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;