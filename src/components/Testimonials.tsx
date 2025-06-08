import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  rating: number;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, author, role, rating }) => {
  return (
<<<<<<< HEAD
    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
=======
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
>>>>>>> 97bfcc7 (Added the team functionality)
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
<<<<<<< HEAD
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
      <p className="text-gray-700 mb-6 italic">"{quote}"</p>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-gray-500 text-sm">{role}</p>
=======
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
          />
        ))}
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-6 italic">"{quote}"</p>
      <div>
        <p className="font-semibold text-gray-900 dark:text-white">{author}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{role}</p>
>>>>>>> 97bfcc7 (Added the team functionality)
      </div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "Coherent transformed how our team collaborates. We've seen a 40% increase in productivity since implementing it.",
      author: "Sarah Johnson",
      role: "Product Manager at TechCorp",
      rating: 5
    },
    {
      quote: "The intuitive interface and powerful features make Coherent our go-to tool for project management. It's simply outstanding.",
      author: "Michael Chen",
      role: "CTO at StartupX",
      rating: 5
    },
    {
      quote: "After trying countless productivity tools, Coherent is the only one that truly delivered on its promises. Worth every penny.",
      author: "Emily Rodriguez",
      role: "Team Lead at Design Studio",
      rating: 4
    }
  ];

  return (
<<<<<<< HEAD
    <section id="testimonials" className="py-20 bg-blue-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-600">Join thousands of satisfied teams using Coherent every day</p>
=======
    <section id="testimonials" className="py-20 bg-green-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">What Our Users Say</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Join thousands of satisfied teams using Coherent every day</p>
>>>>>>> 97bfcc7 (Added the team functionality)
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial 
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;