import { motion } from "framer-motion";
import { BuildingOfficeIcon, UserGroupIcon, TrophyIcon, ChartBarIcon } from "@heroicons/react/24/outline";

const AboutUs = () => {
  const stats = [
    { value: "10K+", label: "Properties Listed", icon: <BuildingOfficeIcon className="w-8 h-8" /> },
    { value: "5K+", label: "Happy Clients", icon: <UserGroupIcon className="w-8 h-8" /> },
    { value: "15+", label: "Industry Awards", icon: <TrophyIcon className="w-8 h-8" /> },
    { value: "98%", label: "Satisfaction Rate", icon: <ChartBarIcon className="w-8 h-8" /> },
  ];

  const team = [
    { name: "Alex Johnson", role: "CEO & Founder", image: "/team1.jpg" },
    { name: "Sarah Williams", role: "Head of Sales", image: "/team2.jpg" },
    { name: "Michael Chen", role: "Lead Architect", image: "/team3.jpg" },
    { name: "Emma Rodriguez", role: "Marketing Director", image: "/team4.jpg" },
  ];

  return (
    <div className="bg-[#08171A] text-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img src="/about-hero.jpg" alt="Urban Realty Team" className="absolute inset-0 w-full h-full object-cover" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 font-poppins">
            Redefining <span className="text-[#78cadc]">Real Estate</span>
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto text-gray-300">
            Urban Realty 360 combines cutting-edge technology with unparalleled market expertise to transform your property journey.
          </p>
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-poppins">
              Our <span className="text-[#78cadc]">Story</span>
            </h2>
            <p className="text-gray-300 mb-4">
              Founded in 2015, Urban Realty 360 began as a boutique real estate firm with a vision to revolutionize property transactions through transparency and innovation.
            </p>
            <p className="text-gray-300 mb-6">
              Today, we're a market leader with a national presence, recognized for our client-first approach and data-driven solutions that simplify buying, selling, and renting properties.
            </p>
            <div className="relative">
              <div className="absolute -left-4 -top-4 w-24 h-24 border-t-2 border-l-2 border-[#78cadc]" />
              <div className="absolute -right-4 -bottom-4 w-24 h-24 border-b-2 border-r-2 border-[#78cadc]" />
              <img src="/office.jpg" alt="Our Office" className="relative z-10 rounded-lg w-full h-auto" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:w-1/2 grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <div key={index} className="bg-[#0c2327] p-6 rounded-xl border border-[#78cadc]/20 hover:border-[#78cadc]/50 transition-all">
                <div className="text-[#78cadc] mb-3">{stat.icon}</div>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 sm:py-24 bg-[#0c2327] px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-poppins">
              Meet Our <span className="text-[#78cadc]">Leadership</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The brilliant minds behind Urban Realty 360's success, combining decades of experience with fresh perspectives.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-xl mb-4 h-64">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-bold">{member.name}</h3>
                    <p className="text-[#78cadc] text-sm">{member.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-poppins">
            Our Core <span className="text-[#78cadc]">Values</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            The principles that guide every decision we make and every interaction we have.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-[#0c2327] p-8 rounded-xl border border-[#78cadc]/20 hover:border-[#78cadc]/50 transition-all"
          >
            <div className="text-[#78cadc] text-4xl mb-4">01</div>
            <h3 className="text-xl font-bold mb-3">Client-Centric Approach</h3>
            <p className="text-gray-400">
              We prioritize your needs above all else, offering personalized solutions tailored to your unique property goals.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-[#0c2327] p-8 rounded-xl border border-[#78cadc]/20 hover:border-[#78cadc]/50 transition-all"
          >
            <div className="text-[#78cadc] text-4xl mb-4">02</div>
            <h3 className="text-xl font-bold mb-3">Market Intelligence</h3>
            <p className="text-gray-400">
              Our proprietary analytics provide insights that give you a competitive edge in today's dynamic real estate market.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-[#0c2327] p-8 rounded-xl border border-[#78cadc]/20 hover:border-[#78cadc]/50 transition-all"
          >
            <div className="text-[#78cadc] text-4xl mb-4">03</div>
            <h3 className="text-xl font-bold mb-3">Ethical Practices</h3>
            <p className="text-gray-400">
              Transparency and integrity form the foundation of every transaction, ensuring trust at every step of your journey.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;