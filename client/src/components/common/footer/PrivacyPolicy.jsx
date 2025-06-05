import { motion } from "framer-motion";
import { ShieldCheckIcon, LockClosedIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";

const PrivacyPolicy = () => {

  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  const sections = [
    {
      title: "Information We Collect",
      content: [
        "We collect personal information you provide when creating an account, searching for properties, or contacting agents. This may include:",
        "- Contact details (name, email, phone)",
        "- Property preferences and search criteria",
        "- Financial information for pre-approval processes",
        "- Communication history with our team"
      ]
    },
    {
      title: "How We Use Your Information",
      content: [
        "Your data helps us:",
        "- Personalize your property recommendations",
        "- Connect you with qualified real estate professionals",
        "- Improve our services and platform functionality",
        "- Comply with legal obligations",
        "- Prevent fraud and ensure security"
      ]
    },
    {
      title: "Data Sharing & Disclosure",
      content: [
        "We may share information with:",
        "- Licensed real estate agents/brokers to facilitate transactions",
        "- Service providers assisting with operations (under strict confidentiality)",
        "- Legal authorities when required by law",
        "- Business partners during mergers/acquisitions"
      ]
    },
    {
      title: "Your Privacy Rights",
      content: [
        "You have the right to:",
        "- Access and review your personal data",
        "- Request corrections to inaccurate information",
        "- Delete your account and associated data",
        "- Opt-out of marketing communications",
        "- Restrict certain data processing activities"
      ]
    }
  ];

  return (
    <div className="bg-[#08171A] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/30 z-10" />
        <img 
          src="/privacy-policy-2.jpg" 
          alt="Privacy Policy" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4"
        >
          <div className="flex items-center justify-center mb-4">
            <ShieldCheckIcon className="w-10 h-10 text-[#78cadc] mr-3" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-poppins">
              Privacy <span className="text-[#78cadc]">Policy</span>
            </h1>
          </div>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto text-gray-300">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>
      </section>

      {/* Policy Content */}
      <section className="py-16 px-4 sm:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <p className="text-gray-400 mb-6">
            At Urban Realty 360, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This policy outlines how we collect, use, and safeguard your data.
          </p>
          <div className="inline-flex items-center text-[#78cadc]">
            <LockClosedIcon className="w-5 h-5 mr-2" />
            <span>Your information is protected with 256-bit SSL encryption</span>
          </div>
        </motion.div>

        <div className="space-y-12">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#0c2327] p-8 rounded-xl border border-[#78cadc]/20"
            >
              <div className="flex items-start mb-6">
                <div className="bg-[#78cadc] p-2 rounded-lg mr-4">
                  <DocumentTextIcon className="w-5 h-5 text-[#08171A]" />
                </div>
                <h2 className="text-2xl font-bold">{section.title}</h2>
              </div>
              <div className="pl-14">
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-gray-300 mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Policy Updates */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 bg-[#0c2327] p-8 rounded-xl border border-[#78cadc]/20"
        >
          <h2 className="text-2xl font-bold mb-4">Policy Updates</h2>
          <p className="text-gray-300 mb-4">
            We may update this policy periodically to reflect changes in our practices or legal requirements. 
            Significant changes will be communicated through email or platform notifications.
          </p>
          <p className="text-gray-300">
            By continuing to use our services after updates take effect, you acknowledge and agree to the revised policy.
          </p>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <h3 className="text-xl font-bold mb-2">Privacy Questions?</h3>
          <p className="text-gray-400 mb-6">
            Contact our Data Protection Officer at <span className="text-[#78cadc]">privacy@urbanrealty360.com</span>
          </p>
          <button className="bg-[#78cadc] hover:bg-[#8DD9E5] text-[#08171A] font-bold py-3 px-8 rounded-lg transition-colors shadow-lg">
            Contact Privacy Team
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;