import { motion } from "framer-motion";
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ThemeContext } from '@/contexts/ThemeProvider';
import { createThemeColors } from '@/lib/theme/colors';

const ContactUs = () => {
  const { theme } = useContext(ThemeContext);
  const colors = createThemeColors(theme as 'light' | 'dark');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);
  
  const schema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Enter a valid email"),
    subject: z.string().min(2, "Subject is required"),
    message: z.string().min(10, "Message must be at least 10 characters"),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", subject: "", message: "" }
  });

  const onSubmit = async (data) => {
    try {
      // Placeholder: integrate API hook when backend endpoint is ready
      await new Promise((r) => setTimeout(r, 600));
      reset();
    } catch (_) {
      // Intentionally swallow for now; standardized error toasts handled globally
    }
  };

  return (
    <section 
      className="min-h-screen"
      style={{ 
        backgroundColor: colors.bg.primary, 
        color: colors.text.primary 
      }}
    >
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
              Get In <span style={{ color: colors.primary.main }}>Touch</span>
            </h1>
            <p 
              className="max-w-2xl mx-auto text-lg"
              style={{ color: colors.text.secondary }}
            >
              We&apos;re here to help you with all your real estate needs. Reach out to our team for personalized assistance.
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
          className="p-8 rounded-xl border transition-all hover:border-opacity-50"
          style={{ 
            backgroundColor: colors.bg.secondary,
            borderColor: `${colors.primary.main}33`
          }}
        >
          <div 
            className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: colors.primary.main }}
          >
            <PhoneIcon className="w-6 h-6" style={{ color: colors.primary.contrast }} />
          </div>
          <h3 className="font-poppins text-xl font-bold mb-3" style={{ color: colors.text.primary }}>Phone</h3>
          <p className="mb-2" style={{ color: colors.text.muted }}>Main Office</p>
          <p className="text-lg" style={{ color: colors.text.primary }}>+91 9689772874</p>
          <p className="mt-4 mb-2" style={{ color: colors.text.muted }}>Sales Department</p>
          <p className="text-lg" style={{ color: colors.text.primary }}>+91 9689772863</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -10 }}
          className="p-8 rounded-xl border transition-all hover:border-opacity-50"
          style={{ 
            backgroundColor: colors.bg.secondary,
            borderColor: `${colors.primary.main}33`
          }}
        >
          <div 
            className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: colors.primary.main }}
          >
            <EnvelopeIcon className="w-6 h-6" style={{ color: colors.primary.contrast }} />
          </div>
          <h3 className="font-poppins text-xl font-bold mb-3" style={{ color: colors.text.primary }}>Email</h3>
          <p className="mb-2" style={{ color: colors.text.muted }}>General Inquiries</p>
          <p className="text-lg" style={{ color: colors.text.primary }}>info@urbanrealty360.com</p>
          <p className="mt-4 mb-2" style={{ color: colors.text.muted }}>Support</p>
          <p className="text-lg" style={{ color: colors.text.primary }}>support@urbanrealty360.com</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -10 }}
          className="p-8 rounded-xl border transition-all hover:border-opacity-50"
          style={{ 
            backgroundColor: colors.bg.secondary,
            borderColor: `${colors.primary.main}33`
          }}
        >
          <div 
            className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: colors.primary.main }}
          >
            <MapPinIcon className="w-6 h-6" style={{ color: colors.primary.contrast }} />
          </div>
          <h3 className="font-poppins text-xl font-bold mb-3" style={{ color: colors.text.primary }}>Office</h3>
          <p className="text-lg mb-6" style={{ color: colors.text.primary }}>Anupama Apt., Pandit Colony, <br/>
          Gangapur Road,<br/>
          Nashik, Maharashtra 422002, IN</p>
          <h3 className="font-poppins text-xl font-bold mb-3 flex items-center gap-2" style={{ color: colors.text.primary }}>
            <ClockIcon className="w-5 h-5" /> Hours
          </h3>
          <p style={{ color: colors.text.muted }}>Monday - Friday: 9am - 6pm</p>
          <p style={{ color: colors.text.muted }}>Saturday: 10am - 4pm</p>
        </motion.div>
      </div>

      {/* Contact Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="p-8 sm:p-12 rounded-xl border"
          style={{ 
            backgroundColor: colors.bg.secondary,
            borderColor: `${colors.primary.main}33`
          }}
        >
          <h2 className="font-poppins text-3xl font-bold mb-2" style={{ color: colors.text.primary }}>Send Us a Message</h2>
          <p className="mb-8" style={{ color: colors.text.muted }}>We typically respond within 24 hours</p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text.secondary }}
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                {...register("name")}
                className="w-full rounded-lg px-4 py-3 focus:outline-none transition-all"
                style={{ 
                  backgroundColor: colors.bg.primary,
                  borderColor: `${colors.primary.main}50`,
                  color: colors.text.primary
                }}
                placeholder="Your name"
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p 
                  className="text-sm mt-2" 
                  role="alert"
                  style={{ color: colors.semantic.error }}
                >
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text.secondary }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className="w-full rounded-lg px-4 py-3 focus:outline-none transition-all"
                style={{ 
                  backgroundColor: colors.bg.primary,
                  borderColor: `${colors.primary.main}50`,
                  color: colors.text.primary
                }}
                placeholder="your.email@example.com"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p 
                  className="text-sm mt-2" 
                  role="alert"
                  style={{ color: colors.semantic.error }}
                >
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                {...register("subject")}
                className="w-full bg-[color:var(--color-surface)] border border-[color:var(--color-primary)]/30 rounded-lg px-4 py-3 focus:border-[color:var(--color-primary)] focus:ring-1 focus:ring-[color:var(--color-primary)] outline-none transition-all"
                placeholder="How can we help?"
                aria-invalid={!!errors.subject}
              />
              {errors.subject && (
                <p className="text-red-400 text-sm mt-2" role="alert">{errors.subject.message}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <textarea
                id="message"
                rows={5}
                {...register("message")}
                className="w-full bg-[color:var(--color-surface)] border border-[color:var(--color-primary)]/30 rounded-lg px-4 py-3 focus:border-[color:var(--color-primary)] focus:ring-1 focus:ring-[color:var(--color-primary)] outline-none transition-all"
                placeholder="Your message here..."
                aria-invalid={!!errors.message}
              ></textarea>
              {errors.message && (
                <p className="text-red-400 text-sm mt-2" role="alert">{errors.message.message}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="font-bold py-3 px-8 rounded-lg transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: colors.primary.main,
                  color: colors.primary.contrast
                }}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Map */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <h2 
          className="font-poppins text-3xl font-bold mb-12 text-center"
          style={{ color: colors.text.primary }}
        >
          Our Location
        </h2>
        <div 
          className="h-96 w-full rounded-xl overflow-hidden border"
          style={{ 
            backgroundColor: colors.bg.secondary,
            borderColor: `${colors.primary.main}33`
          }}
        >
          {/* Replace with your actual map component or iframe */}
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ color: colors.text.muted }}
          >
            <p>Map integration would go here</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;