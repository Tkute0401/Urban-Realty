import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HomeModernIcon, SwatchIcon, ArrowsPointingOutIcon, PaintBrushIcon, LightBulbIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const InteriorDesign = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeTab, setActiveTab] = useState('architect');
  const [showForm, setShowForm] = useState(false);

  const architectServices = [
    {
      icon: <BuildingOfficeIcon className="w-8 h-8 text-[#78cadc]" />,
      title: "Custom Home Design",
      description: "Tailored architectural solutions that reflect your lifestyle and preferences"
    },
    {
      icon: <ArrowsPointingOutIcon className="w-8 h-8 text-[#78cadc]" />,
      title: "Space Planning",
      description: "Optimized layouts for maximum functionality and flow"
    },
    {
      icon: <LightBulbIcon className="w-8 h-8 text-[#78cadc]" />,
      title: "3D Visualization",
      description: "Photorealistic renderings to visualize your future space"
    },
    {
      icon: <SwatchIcon className="w-8 h-8 text-[#78cadc]" />,
      title: "Construction Drawings",
      description: "Detailed technical drawings for builders and contractors"
    }
  ];

  const interiorServices = [
    {
      icon: <PaintBrushIcon className="w-8 h-8 text-[#78cadc]" />,
      title: "Residential Interiors",
      description: "Complete home interiors that reflect your personality"
    },
    {
      icon: <HomeModernIcon className="w-8 h-8 text-[#78cadc]" />,
      title: "Space Styling",
      description: "Furniture selection and decor placement for harmonious spaces"
    },
    {
      icon: <SwatchIcon className="w-8 h-8 text-[#78cadc]" />,
      title: "Material Selection",
      description: "Curated choices of finishes, colors, and textures"
    },
    {
      icon: <LightBulbIcon className="w-8 h-8 text-[#78cadc]" />,
      title: "Lighting Design",
      description: "Custom lighting plans to enhance ambiance and functionality"
    }
  ];

  const projects = [
    {
      id: 1,
      title: "Modern Villa Project",
      type: "Architecture",
      image: "/project1.jpg",
      features: ["3800 sqft", "5 Bedrooms", "Open Concept"]
    },
    {
      id: 2,
      title: "Urban Apartment",
      type: "Interior Design",
      image: "/project2.jpg",
      features: ["1200 sqft", "Contemporary Style", "Smart Home"]
    },
    {
      id: 3,
      title: "Heritage Restoration",
      type: "Architecture",
      image: "/project3.jpg",
      features: ["Historical Preservation", "Modern Amenities", "5000 sqft"]
    },
    {
      id: 4,
      title: "Luxury Penthouse",
      type: "Interior Design",
      image: "/project4.jpg",
      features: ["360° Views", "Premium Finishes", "Custom Furniture"]
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Consultation",
      description: "Understand your vision, requirements, and budget"
    },
    {
      step: "02",
      title: "Concept Development",
      description: "Create initial sketches and mood boards"
    },
    {
      step: "03",
      title: "Design Refinement",
      description: "Develop detailed plans and 3D visualizations"
    },
    {
      step: "04",
      title: "Implementation",
      description: "Oversee execution with trusted contractors"
    }
  ];

  const handleJoinTeam = () => {
    setShowForm(true);
  };

  return (
    <div className="bg-[#08171A] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/30 z-10" />
        <img 
          src="/interior-design.png" 
          alt="Architecture & Interior Design" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4"
        >
          <div className="flex items-center justify-center mb-4">
            <HomeModernIcon className="w-10 h-10 text-[#78cadc] mr-3" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-poppins">
              Design <span className="text-[#78cadc]">Studio</span>
            </h1>
          </div>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto text-gray-300">
            Transforming spaces with innovative architecture and bespoke interior design
          </p>
          <button 
            onClick={handleJoinTeam}
            className="mt-8 border-2 border-[#78cadc] text-[#78cadc]  hover:bg-[#78cadc] hover:text-[#08171A] font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Join Our Design Team
          </button>
        </motion.div>
      </section>

      {/* Services Tabs */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex justify-center mb-12">
          <div className="bg-[#0c2327] p-1 rounded-lg border border-[#78cadc]/20">
            <button
              onClick={() => setActiveTab('architect')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${activeTab === 'architect' ? 'bg-[#78cadc] text-[#08171A]' : 'text-gray-300 hover:text-[#78cadc]'}`}
            >
              Architecture Services
            </button>
            <button
              onClick={() => setActiveTab('interior')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${activeTab === 'interior' ? 'bg-[#78cadc] text-[#08171A]' : 'text-gray-300 hover:text-[#78cadc]'}`}
            >
              Interior Design
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {(activeTab === 'architect' ? architectServices : interiorServices).map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#0c2327] p-8 rounded-xl border border-[#78cadc]/20 hover:border-[#78cadc]/50 transition-all h-full"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-gray-400">{service.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Design Process */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold mb-12 text-center font-poppins">
            Our Design <span className="text-[#78cadc]">Process</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#0c2327] p-6 rounded-xl border border-[#78cadc]/20 text-center"
              >
                <div className="bg-[#78cadc] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-[#08171A] font-bold">
                  {step.step}
                </div>
                <h4 className="text-lg font-bold mb-2">{step.title}</h4>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold mb-12 text-center font-poppins">
            Featured <span className="text-[#78cadc]">Projects</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-xl h-96"
              >
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-[#78cadc] text-sm font-medium">{project.type}</span>
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.features.map((feature, i) => (
                      <span key={i} className="bg-[#78cadc]/10 text-[#78cadc] px-3 py-1 rounded-full text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-[#0c2327] p-8 sm:p-12 rounded-xl border border-[#78cadc]/20 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold mb-6">
            Ready to Transform Your Space?
          </h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Schedule a consultation with our design team to begin your project
          </p>
          <button className="bg-[#78cadc] hover:bg-[#8DD9E5] text-[#08171A] font-bold py-3 px-8 rounded-lg transition-colors shadow-lg">
            Book Consultation
          </button>
        </div>
      </section>

      {/* Designer Application Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0c2327] rounded-xl p-8 max-w-md w-full border border-[#78cadc]/50 mt-5"
          >
            <h3 className="text-2xl font-bold mb-6">Designer Application</h3>
            <p className="text-gray-400 mb-6">
              Please fill out this form to join our team of professional designers.
            </p>
            <div className="space-y-4 mb-6">
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full bg-[#08171A] border border-[#78cadc]/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#78cadc]" 
              />
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full bg-[#08171A] border border-[#78cadc]/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#78cadc]" 
              />
              <input 
                type="text" 
                placeholder="Years of Experience" 
                className="w-full bg-[#08171A] border border-[#78cadc]/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#78cadc]" 
              />
              <select className="w-full bg-[#08171A] border border-[#78cadc]/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#78cadc]">
                <option value="">Select Design Specialty</option>
                <option value="residential">Residential Design</option>
                <option value="commercial">Commercial Design</option>
                <option value="hospitality">Hospitality Design</option>
                <option value="other">Other</option>
              </select>
              <textarea 
                placeholder="Portfolio Link or Description of Your Work" 
                className="w-full bg-[#08171A] border border-[#78cadc]/30 rounded-lg px-4 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-[#78cadc]"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-[#78cadc] text-[#78cadc] rounded-lg hover:bg-[#78cadc]/10"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // Handle form submission
                  setShowForm(false);
                }}
                className="px-4 py-2 bg-[#78cadc] text-[#08171A] rounded-lg hover:bg-[#8DD9E5]"
              >
                Submit Application
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default InteriorDesign;