import React, { useState } from 'react';
import { Mail, MapPin, Phone, Clock, Send, CheckCircle } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            We've received your message and will get back to you within 24 hours.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: '',
                email: '',
                company: '',
                subject: '',
                message: '',
                inquiryType: 'general'
              });
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Have questions about Coherent? We're here to help you succeed with your data analytics journey.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
                    Inquiry Type
                  </label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="sales">Sales</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="demo">Request Demo</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="What's this about?"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                    placeholder="Tell us how we can help you..."
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Address</h4>
                      <p className="text-gray-600">123 Innovation Drive<br />San Francisco, CA 94103<br />United States</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Phone</h4>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                      <p className="text-sm text-gray-500">Mon-Fri, 9AM-6PM PST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Email</h4>
                      <p className="text-gray-600">info@coherentapp.com</p>
                      <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-blue-600" />
                  Office Hours
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Monday - Friday:</span>
                    <span className="text-gray-600">9:00 AM - 6:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Saturday:</span>
                    <span className="text-gray-600">10:00 AM - 4:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Sunday:</span>
                    <span className="text-gray-600">Closed</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Need Immediate Help?</h4>
                  <p className="text-blue-700 text-sm">
                    For urgent technical issues, our support team is available 24/7 for Professional and Enterprise customers.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                <p className="mb-6 opacity-90">
                  Don't wait! Start your free trial today and see how Coherent can transform your data workflow.
                </p>
                <button className="bg-white text-blue-700 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-all">
                  Start Free Trial
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Quick answers to common questions</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  question: "How quickly can I get started?",
                  answer: "You can start using Coherent immediately with our free trial. No setup required - just upload your data and begin analyzing."
                },
                {
                  question: "Do you offer training?",
                  answer: "Yes! We provide comprehensive onboarding, training materials, and dedicated support to help you get the most out of Coherent."
                },
                {
                  question: "What file formats do you support?",
                  answer: "We support CSV, Excel (.xlsx, .xls), and many other common data formats. More formats are added regularly."
                },
                {
                  question: "Is my data secure?",
                  answer: "Absolutely. We use enterprise-grade security with end-to-end encryption, SOC 2 compliance, and regular security audits."
                },
                {
                  question: "Can I integrate with other tools?",
                  answer: "Yes, Coherent offers APIs and integrations with popular tools like Slack, Microsoft Teams, and many database systems."
                },
                {
                  question: "What support do you provide?",
                  answer: "We offer email support for all users, priority support for Professional plans, and 24/7 dedicated support for Enterprise customers."
                }
              ].map((faq, index) => (
                <div key={index} className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all">
                  <h3 className="font-semibold mb-3 text-gray-800">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;