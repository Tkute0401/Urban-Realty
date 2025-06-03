import { motion } from "framer-motion";
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";

const ContactUs = () => {
  return (
    <section className="bg-[#08171A] min-h-screen text-white">
      {/* Header Section */}
      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center px-4"
          >
            <h1 className="font-poppins text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              Get In <span className="text-[#78cadc]">Touch</span>
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              We're here to help you with all your real estate needs. Reach out to our team for personalized assistance.
            </p>
          </motion.div>
        </div>
        <img 
          src="/contact-us.jpg" 
          alt="Contact Us" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contact Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          whileHover={{ y: -10 }}
          className="bg-[#0c2327] p-8 rounded-xl border border-[#78cadc]/20 hover:border-[#78cadc]/50 transition-all"
        >
          <div className="bg-[#78cadc] w-14 h-14 rounded-full flex items-center justify-center mb-6">
            <PhoneIcon className="w-6 h-6 text-[#08171A]" />
          </div>
          <h3 className="font-poppins text-xl font-bold mb-3">Phone</h3>
          <p className="text-gray-400 mb-2">Main Office</p>
          <p className="text-lg">+91 9689772874</p>
          <p className="text-gray-400 mt-4 mb-2">Sales Department</p>
          <p className="text-lg">+91 9689772863</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -10 }}
          className="bg-[#0c2327] p-8 rounded-xl border border-[#78cadc]/20 hover:border-[#78cadc]/50 transition-all"
        >
          <div className="bg-[#78cadc] w-14 h-14 rounded-full flex items-center justify-center mb-6">
            <EnvelopeIcon className="w-6 h-6 text-[#08171A]" />
          </div>
          <h3 className="font-poppins text-xl font-bold mb-3">Email</h3>
          <p className="text-gray-400 mb-2">General Inquiries</p>
          <p className="text-lg">info@urbanrealty360.com</p>
          <p className="text-gray-400 mt-4 mb-2">Support</p>
          <p className="text-lg">support@urbanrealty360.com</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -10 }}
          className="bg-[#0c2327] p-8 rounded-xl border border-[#78cadc]/20 hover:border-[#78cadc]/50 transition-all"
        >
          <div className="bg-[#78cadc] w-14 h-14 rounded-full flex items-center justify-center mb-6">
            <MapPinIcon className="w-6 h-6 text-[#08171A]" />
          </div>
          <h3 className="font-poppins text-xl font-bold mb-3">Office</h3>
          <p className="text-lg mb-6">Anupama Apt., Pandit Colony, <br/>
          Gangapur Road,<br/>
          Nashik, Maharashtra 422002, IN</p>
          <h3 className="font-poppins text-xl font-bold mb-3 flex items-center gap-2">
            <ClockIcon className="w-5 h-5" /> Hours
          </h3>
          <p className="text-gray-400">Monday - Friday: 9am - 6pm</p>
          <p className="text-gray-400">Saturday: 10am - 4pm</p>
        </motion.div>
      </div>

      {/* Contact Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-[#0c2327] p-8 sm:p-12 rounded-xl border border-[#78cadc]/20"
        >
          <h2 className="font-poppins text-3xl font-bold mb-2">Send Us a Message</h2>
          <p className="text-gray-400 mb-8">We typically respond within 24 hours</p>
          
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                className="w-full bg-[#08171A] border border-[#78cadc]/30 rounded-lg px-4 py-3 focus:border-[#78cadc] focus:ring-1 focus:ring-[#78cadc] outline-none transition-all"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                id="email"
                className="w-full bg-[#08171A] border border-[#78cadc]/30 rounded-lg px-4 py-3 focus:border-[#78cadc] focus:ring-1 focus:ring-[#78cadc] outline-none transition-all"
                placeholder="your.email@example.com"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                className="w-full bg-[#08171A] border border-[#78cadc]/30 rounded-lg px-4 py-3 focus:border-[#78cadc] focus:ring-1 focus:ring-[#78cadc] outline-none transition-all"
                placeholder="How can we help?"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <textarea
                id="message"
                rows="5"
                className="w-full bg-[#08171A] border border-[#78cadc]/30 rounded-lg px-4 py-3 focus:border-[#78cadc] focus:ring-1 focus:ring-[#78cadc] outline-none transition-all"
                placeholder="Your message here..."
              ></textarea>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-[#78cadc] hover:bg-[#8DD9E5] text-[#08171A] font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
              >
                Send Message
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Map */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <h2 className="font-poppins text-3xl font-bold mb-12 text-center">Our Location</h2>
        <div className="h-96 w-full bg-[#0c2327] rounded-xl overflow-hidden border border-[#78cadc]/20">
          {/* Replace with your actual map component or iframe */}
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <p>Map integration would go here</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;