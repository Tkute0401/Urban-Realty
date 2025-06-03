import { motion } from "framer-motion";
import { LightBulbIcon, SparklesIcon, UserGroupIcon, ChartBarIcon, ArrowPathIcon, PuzzlePieceIcon } from "@heroicons/react/24/outline";

const HowWeWork = () => {
  const processSteps = [
    {
      step: "01",
      title: "Discovery",
      icon: <LightBulbIcon className="w-8 h-8 text-[#78cadc]" />,
      description: "We begin by deeply understanding your unique needs, preferences, and goals through comprehensive consultations and advanced matching algorithms.",
      features: [
        "Needs assessment questionnaire",
        "Market orientation session",
        "Budget analysis"
      ]
    },
    {
      step: "02",
      title: "Curated Selection",
      icon: <SparklesIcon className="w-8 h-8 text-[#78cadc]" />,
      description: "Our proprietary technology filters thousands of listings to present only the most relevant options that match your criteria.",
      features: [
        "AI-powered property matching",
        "Neighborhood analysis",
        "Virtual tour pre-screening"
      ]
    },
    {
      step: "03",
      title: "Expert Guidance",
      icon: <UserGroupIcon className="w-8 h-8 text-[#78cadc]" />,
      description: "Your dedicated advisor provides insights, arranges viewings, and helps evaluate each property's potential.",
      features: [
        "Comparative market analysis",
        "Investment potential assessment",
        "Negotiation strategy development"
      ]
    },
    {
      step: "04",
      title: "Transaction Management",
      icon: <ChartBarIcon className="w-8 h-8 text-[#78cadc]" />,
      description: "We handle all paperwork, coordinate with lenders and attorneys, and ensure compliance at every step.",
      features: [
        "Document management system",
        "Milestone tracking",
        "Secure digital signatures"
      ]
    },
    {
      step: "05",
      title: "Closing & Beyond",
      icon: <ArrowPathIcon className="w-8 h-8 text-[#78cadc]" />,
      description: "Our relationship continues after closing with move-in support, home services, and long-term investment monitoring.",
      features: [
        "Closing day coordination",
        "Warranty management",
        "Home value tracking"
      ]
    }
  ];

  const differentiators = [
    {
      icon: <PuzzlePieceIcon className="w-8 h-8 text-[#78cadc]" />,
      title: "Integrated Technology",
      description: "Our proprietary platform connects every stage of your real estate journey for seamless coordination"
    },
    {
      icon: <UserGroupIcon className="w-8 h-8 text-[#78cadc]" />,
      title: "Dedicated Teams",
      description: "You get a cross-functional team including an agent, analyst, and transaction coordinator"
    },
    {
      icon: <ChartBarIcon className="w-8 h-8 text-[#78cadc]" />,
      title: "Data-Driven Insights",
      description: "We provide predictive analytics and market intelligence unavailable elsewhere"
    }
  ];

  return (
    <div className="bg-[#08171A] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/30 z-10" />
        <img 
          src="/how-we-work.jpg" 
          alt="How We Work" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 font-poppins">
            How We <span className="text-[#78cadc]">Work</span>
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto text-gray-300">
            A transparent look at our client-focused process that delivers exceptional results
          </p>
        </motion.div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-poppins">
            Our <span className="text-[#78cadc]">Process</span>
          </h2>
          <p className="text-gray-400 max-w-4xl mx-auto text-lg">
            Urban Realty 360 has reimagined the real estate experience with a streamlined, technology-enhanced approach 
            that removes friction while maintaining the human touch that makes all the difference.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="space-y-12 mb-20">
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col lg:flex-row gap-8 items-start"
            >
              <div className="lg:w-1/4">
                <div className="flex items-center">
                  <span className="text-4xl font-bold text-[#78cadc] mr-4">{step.step}</span>
                  <div className="bg-[#78cadc] p-3 rounded-lg">
                    {step.icon}
                  </div>
                </div>
              </div>
              <div className="lg:w-3/4 bg-[#0c2327] p-8 rounded-xl border border-[#78cadc]/20 hover:border-[#78cadc]/50 transition-all">
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-300 mb-6">{step.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {step.features.map((feature, i) => (
                    <div key={i} className="flex items-start">
                      <div className="w-1.5 h-1.5 mt-2 mr-2 bg-[#78cadc] rounded-full flex-shrink-0"></div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Differentiators */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-poppins">
              What Makes Us <span className="text-[#78cadc]">Different</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {differentiators.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#0c2327] p-8 rounded-xl border border-[#78cadc]/20 hover:border-[#78cadc]/50 transition-all"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#78cadc] to-[#8DD9E5] opacity-90"></div>
          <div className="relative z-10 p-8 sm:p-12 text-[#08171A] text-center">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6">
              Ready to Experience the Urban Realty 360 Difference?
            </h3>
            <p className="mb-8 max-w-2xl mx-auto">
              Whether you're buying, selling, or investing, our proven process delivers better results with less stress.
            </p>
            <button className="bg-[#08171A] hover:bg-[#0c2327] text-[#78cadc] font-bold py-3 px-8 rounded-lg transition-colors shadow-lg">
              Get Started Today
            </button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 px-4 sm:px-8 bg-[#0c2327]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-poppins">
              Proven <span className="text-[#78cadc]">Results</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our approach consistently outperforms traditional methods
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-[#08171A] p-6 rounded-xl text-center border border-[#78cadc]/20"
            >
              <div className="text-3xl font-bold text-[#78cadc] mb-2">32%</div>
              <div className="text-gray-300">Faster Transactions</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-[#08171A] p-6 rounded-xl text-center border border-[#78cadc]/20"
            >
              <div className="text-3xl font-bold text-[#78cadc] mb-2">98.7%</div>
              <div className="text-gray-300">Client Satisfaction</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-[#08171A] p-6 rounded-xl text-center border border-[#78cadc]/20"
            >
              <div className="text-3xl font-bold text-[#78cadc] mb-2">5.2%</div>
              <div className="text-gray-300">Higher Sale Prices</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-[#08171A] p-6 rounded-xl text-center border border-[#78cadc]/20"
            >
              <div className="text-3xl font-bold text-[#78cadc] mb-2">500+</div>
              <div className="text-gray-300">Five-Star Reviews</div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowWeWork;