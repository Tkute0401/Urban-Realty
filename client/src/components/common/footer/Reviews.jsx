import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { StarIcon, ChatBubbleLeftRightIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const Reviews = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const testimonials = [
    {
      id: 1,
      name: 'Rahul Sharma',
      role: 'Property Buyer',
      rating: 5,
      content: 'Urban Realty 360 made my home buying experience seamless. Their team was knowledgeable and helped me find exactly what I was looking for within my budget. The entire process was transparent and stress-free!',
      image: '/m-01.png'
    },
    {
      id: 2,
      name: 'Priya Patel',
      role: 'Property Seller',
      rating: 5,
      content: 'Sold my apartment in record time and at a great price! The marketing strategy was excellent, and I received multiple offers within days of listing. Highly recommend their professional services.',
      image: '/fm-01.png'
    },
    {
      id: 3,
      name: 'Vikram Mehta',
      role: 'Investor',
      rating: 4,
      content: 'As an investor, I appreciate their market insights and property recommendations. They helped me build a profitable portfolio with great rental yields. Their after-sales support is exceptional.',
      image: '/m-02.png'
    },
    {
      id: 4,
      name: 'Ananya Gupta',
      role: 'NRI Client',
      rating: 5,
      content: 'Being overseas, I was worried about purchasing property in India. Urban Realty 360 handled everything remotely with regular video updates. Their digital documentation process was incredibly convenient.',
      image: '/fm-02.png'
    },
    {
      id: 5,
      name: 'Aditya Joshi',
      role: 'First-time Buyer',
      rating: 5,
      content: 'The team patiently guided me through every step as a first-time buyer. They explained all the legal aspects and even helped me get the best home loan rates. Truly a customer-first approach!',
      image: '/m-03.png'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <StarIcon 
        key={i} 
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
      />
    ));
  };

  return (
    <div className="bg-[#08171A] text-white min-h-screen">
      {/* Testimonials Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-2 sm:px-4"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
            <ChatBubbleLeftRightIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#78cadc] sm:mr-3 mb-3 sm:mb-0" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-poppins">
              Client <span className="text-[#78cadc]">Testimonials</span>
            </h1>
          </div>
          <p className="text-gray-400 max-w-3xl mx-auto text-sm sm:text-base md:text-lg px-2">
            We measure our success by the satisfaction of our clients. Here's what some of them have to say about working with us.
          </p>
          <br/><br/>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative h-[450px] sm:h-[350px] md:h-[300px] lg:h-[250px] overflow-hidden">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, x: direction * 100 }}
              animate={{ 
                opacity: index === currentIndex ? 1 : 0,
                x: index === currentIndex ? 0 : (index < currentIndex ? -100 : 100),
                scale: index === currentIndex ? 1 : 0.9
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className={`absolute inset-0 flex flex-col md:flex-row items-center gap-6 p-4 sm:p-6 md:p-8 bg-[#0c2327] rounded-xl border border-[#78cadc]/20 ${index === currentIndex ? 'z-10' : 'z-0'}`}
            >
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#78cadc]/30 mt-2">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#78cadc]/10" />
                </div>
              </div>
              <div className="w-full md:w-2/3 text-center md:text-left">
                <div className="flex justify-center md:justify-start mb-3 sm:mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-gray-300 italic text-sm sm:text-base md:text-lg mb-4 sm:mb-6">
                  "{testimonial.content}"
                </p>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">{testimonial.name}</h3>
                  <p className="text-[#78cadc] text-sm sm:text-base">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center mt-6 sm:mt-8 gap-3 sm:gap-4">
          <button 
            onClick={prevTestimonial}
            className="p-2 sm:p-3 rounded-full bg-[#0c2327] border border-[#78cadc]/30 hover:bg-[#78cadc]/10 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#78cadc]" />
          </button>
          <div className="flex items-center gap-1 sm:gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-[#78cadc]' : 'bg-[#78cadc]/30'}`}
              />
            ))}
          </div>
          <button 
            onClick={nextTestimonial}
            className="p-2 sm:p-3 rounded-full bg-[#0c2327] border border-[#78cadc]/30 hover:bg-[#78cadc]/10 transition-colors"
          >
            <ArrowRightIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#78cadc]" />
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#0c2327]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-[#08171A] p-4 sm:p-6 rounded-xl text-center border border-[#78cadc]/20"
            >
              <div className="text-2xl sm:text-3xl font-bold text-[#78cadc] mb-1 sm:mb-2">500+</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-300">Five-Star Reviews</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-[#08171A] p-4 sm:p-6 rounded-xl text-center border border-[#78cadc]/20"
            >
              <div className="text-2xl sm:text-3xl font-bold text-[#78cadc] mb-1 sm:mb-2">98%</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-300">Client Satisfaction</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-[#08171A] p-4 sm:p-6 rounded-xl text-center border border-[#78cadc]/20"
            >
              <div className="text-2xl sm:text-3xl font-bold text-[#78cadc] mb-1 sm:mb-2">10K+</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-300">Happy Clients</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-[#08171A] p-4 sm:p-6 rounded-xl text-center border border-[#78cadc]/20"
            >
              <div className="text-2xl sm:text-3xl font-bold text-[#78cadc] mb-1 sm:mb-2">24/7</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-300">Support Available</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-[#0c2327] p-6 sm:p-8 md:p-12 rounded-xl border border-[#78cadc]/20 text-center"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
            Ready to Share Your Experience?
          </h2>
          <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base max-w-2xl mx-auto">
            We'd love to hear about your journey with Urban Realty 360. Your feedback helps us improve and serve you better.
          </p>
          <button className="bg-[#78cadc] hover:bg-[#8DD9E5] text-[#08171A] font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-lg transition-colors shadow-lg text-sm sm:text-base">
            Write a Review
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default Reviews;