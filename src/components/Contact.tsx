import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact: React.FC = () => {
  return (
<<<<<<< HEAD
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
          <p className="text-xl text-gray-600">Have questions? We'd love to hear from you.</p>
=======
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Get in Touch</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Have questions? We'd love to hear from you.</p>
>>>>>>> 97bfcc7 (Added the team functionality)
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
<<<<<<< HEAD
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
=======
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
>>>>>>> 97bfcc7 (Added the team functionality)
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
<<<<<<< HEAD
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
=======
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
>>>>>>> 97bfcc7 (Added the team functionality)
                    placeholder="Your name"
                  />
                </div>
                <div>
<<<<<<< HEAD
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
=======
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
>>>>>>> 97bfcc7 (Added the team functionality)
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
<<<<<<< HEAD
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
=======
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
>>>>>>> 97bfcc7 (Added the team functionality)
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div>
<<<<<<< HEAD
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
=======
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
>>>>>>> 97bfcc7 (Added the team functionality)
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
<<<<<<< HEAD
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
=======
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
>>>>>>> 97bfcc7 (Added the team functionality)
                  placeholder="What's this about?"
                />
              </div>
              
              <div>
<<<<<<< HEAD
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
=======
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
>>>>>>> 97bfcc7 (Added the team functionality)
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
<<<<<<< HEAD
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
=======
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
>>>>>>> 97bfcc7 (Added the team functionality)
                  placeholder="Tell us what you need..."
                ></textarea>
              </div>
              
              <button
                type="submit"
<<<<<<< HEAD
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all w-full md:w-auto"
=======
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all w-full md:w-auto"
>>>>>>> 97bfcc7 (Added the team functionality)
              >
                Send Message
              </button>
            </form>
          </div>
          
<<<<<<< HEAD
          <div className="lg:w-1/2 bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-blue-600 mt-1 mr-4" />
                <div>
                  <h4 className="font-semibold mb-1">Address</h4>
                  <p className="text-gray-600">123 Innovation Drive, San Francisco, CA 94103, USA</p>
=======
          <div className="lg:w-1/2 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-green-600 mt-1 mr-4" />
                <div>
                  <h4 className="font-semibold mb-1 text-gray-900 dark:text-white">Address</h4>
                  <p className="text-gray-600 dark:text-gray-300">123 Innovation Drive, San Francisco, CA 94103, USA</p>
>>>>>>> 97bfcc7 (Added the team functionality)
                </div>
              </div>
              
              <div className="flex items-start">
<<<<<<< HEAD
                <Phone className="w-6 h-6 text-blue-600 mt-1 mr-4" />
                <div>
                  <h4 className="font-semibold mb-1">Phone</h4>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
=======
                <Phone className="w-6 h-6 text-green-600 mt-1 mr-4" />
                <div>
                  <h4 className="font-semibold mb-1 text-gray-900 dark:text-white">Phone</h4>
                  <p className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
>>>>>>> 97bfcc7 (Added the team functionality)
                </div>
              </div>
              
              <div className="flex items-start">
<<<<<<< HEAD
                <Mail className="w-6 h-6 text-blue-600 mt-1 mr-4" />
                <div>
                  <h4 className="font-semibold mb-1">Email</h4>
                  <p className="text-gray-600">info@coherentapp.com</p>
=======
                <Mail className="w-6 h-6 text-green-600 mt-1 mr-4" />
                <div>
                  <h4 className="font-semibold mb-1 text-gray-900 dark:text-white">Email</h4>
                  <p className="text-gray-600 dark:text-gray-300">info@coherentapp.com</p>
>>>>>>> 97bfcc7 (Added the team functionality)
                </div>
              </div>
            </div>
            
            <div className="mt-8">
<<<<<<< HEAD
              <h4 className="font-semibold mb-4">Office Hours</h4>
              <table className="w-full text-gray-600">
=======
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Office Hours</h4>
              <table className="w-full text-gray-600 dark:text-gray-300">
>>>>>>> 97bfcc7 (Added the team functionality)
                <tbody>
                  <tr>
                    <td className="py-1">Monday - Friday:</td>
                    <td className="py-1">9:00 AM - 6:00 PM</td>
                  </tr>
                  <tr>
                    <td className="py-1">Saturday:</td>
                    <td className="py-1">10:00 AM - 4:00 PM</td>
                  </tr>
                  <tr>
                    <td className="py-1">Sunday:</td>
                    <td className="py-1">Closed</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;