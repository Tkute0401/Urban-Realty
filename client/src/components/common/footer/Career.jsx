import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BriefcaseIcon, BuildingOfficeIcon, RocketLaunchIcon, UserGroupIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";

const Career = () => {

  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  const jobOpenings = [
    {
      title: "Real Estate Agent",
      type: "Full-time",
      location: "Multiple Locations",
      department: "Sales",
      description: "Help clients buy, sell, and rent properties while building your own business with our support."
    },
    {
      title: "Property Marketing Specialist",
      type: "Full-time",
      location: "New York, NY",
      department: "Marketing",
      description: "Create compelling marketing campaigns for premium properties and developments."
    },
    {
      title: "Data Analyst",
      type: "Full-time",
      location: "Remote",
      department: "Technology",
      description: "Transform real estate data into actionable insights for our agents and clients."
    },
    {
      title: "Customer Success Manager",
      type: "Full-time",
      location: "Chicago, IL",
      department: "Operations",
      description: "Ensure exceptional client experiences throughout their real estate journey."
    }
  ];

  const perks = [
    {
      icon: <RocketLaunchIcon className="w-8 h-8 text-[#78cadc]" />,
      title: "Growth Opportunities",
      description: "Clear career paths with mentorship and training programs"
    },
    {
      icon: <BuildingOfficeIcon className="w-8 h-8 text-[#78cadc]" />,
      title: "Modern Workspaces",
      description: "Beautiful offices designed for collaboration and creativity"
    },
    {
      icon: <UserGroupIcon className="w-8 h-8 text-[#78cadc]" />,
      title: "Diverse Team",
      description: "Work with talented professionals from various backgrounds"
    }
  ];

  return (
    <div className="bg-[#08171A] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30 z-10" />
        <img 
          src="/career.jpg" 
          alt="Urban Realty 360 Team" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 font-poppins">
            Build Your <span className="text-[#78cadc]">Career</span> With Us
          </h1>
          <p className="text-xl sm:text-2xl max-w-3xl mx-auto text-gray-300 mb-10">
            Join a team that's redefining real estate through innovation, integrity, and exceptional service.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#78cadc] hover:bg-[#8DD9E5] text-[#08171A] font-bold py-4 px-8 rounded-lg transition-colors shadow-lg flex items-center justify-center"
            >
              Search Jobs <ArrowRightIcon className="w-5 h-5 ml-2" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-[#78cadc] text-[#78cadc] hover:bg-[#78cadc]/10 font-bold py-4 px-8 rounded-lg transition-colors flex items-center justify-center"
            >
              Join Talent Network <ArrowRightIcon className="w-5 h-5 ml-2" />
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Culture Section */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-poppins">
            Our <span className="text-[#78cadc]">Culture</span>
          </h2>
          <p className="text-gray-400 max-w-4xl mx-auto text-lg">
            At Urban Realty 360, we foster an environment where creativity meets professionalism. 
            Our team thrives on collaboration, innovation, and a shared passion for transforming real estate experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {perks.map((perk, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#0c2327] p-8 rounded-xl border border-[#78cadc]/20 hover:border-[#78cadc]/50 transition-all"
            >
              <div className="mb-4">{perk.icon}</div>
              <h3 className="text-xl font-bold mb-3">{perk.title}</h3>
              <p className="text-gray-400">{perk.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="relative">
          <div className="absolute -inset-4 border-2 border-[#78cadc]/30 rounded-2xl"></div>
          <div className="relative bg-[#0c2327] p-8 sm:p-12 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('/team-pattern.png')] opacity-10"></div>
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold mb-6">
                We're Building the Future of <span className="text-[#78cadc]">Real Estate</span>
              </h3>
              <p className="text-gray-400 mb-8 max-w-3xl">
                Our team combines industry veterans with fresh perspectives to create a dynamic workplace where 
                everyone's voice matters. We invest in our people through continuous learning and leadership development.
              </p>
              <button className="bg-transparent border-2 border-[#78cadc] text-[#78cadc] hover:bg-[#78cadc]/10 font-bold py-3 px-8 rounded-lg transition-colors">
                Learn About Our Values
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section className="py-16 px-4 sm:px-8 bg-[#0c2327]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-poppins">
              Current <span className="text-[#78cadc]">Openings</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore opportunities to join our growing team across various departments.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {jobOpenings.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#08171A] rounded-xl overflow-hidden border border-[#78cadc]/20 hover:border-[#78cadc]/50 transition-all"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{job.title}</h3>
                    <span className="bg-[#78cadc]/20 text-[#78cadc] text-sm px-3 py-1 rounded-full">
                      {job.type}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm mb-4">
                    <BriefcaseIcon className="w-4 h-4 mr-2" />
                    {job.department} • {job.location}
                  </div>
                  <p className="text-gray-300 mb-6">{job.description}</p>
                  <button className="text-[#78cadc] hover:text-[#8DD9E5] font-medium flex items-center transition-colors">
                    View Details <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <button className="bg-[#78cadc] hover:bg-[#8DD9E5] text-[#08171A] font-bold py-3 px-8 rounded-lg transition-colors shadow-lg inline-flex items-center">
              View All Openings <ArrowRightIcon className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-[#78cadc] to-[#8DD9E5] rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[#08171A]">
            Ready to Start Your Journey With Us?
          </h2>
          <p className="text-[#08171A]/90 mb-8 max-w-2xl mx-auto">
            Whether you're an experienced professional or just starting your career, we have opportunities to grow with our team.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#08171A] text-[#78cadc] font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
            >
              Search Jobs
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-[#08171A] text-[#08171A] hover:bg-[#08171A]/10 font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Join Talent Network
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Career;