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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40 z-10" />
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
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
            <ShieldCheckIcon className="w-10 h-10 mb-2 sm:mb-0 sm:mr-3" style={{ color: 'var(--color-primary)' }} />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-poppins" style={{ color: 'var(--color-text-primary)' }}>
              Privacy <span style={{ color: 'var(--color-primary)' }}>Policy</span>
            </h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4" style={{ color: 'var(--color-text-muted)' }}>
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
          <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>
            At SQUAREFOOT, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This policy outlines how we collect, use, and safeguard your data.
          </p>
          <div className="inline-flex items-center" style={{ color: 'var(--color-primary)' }}>
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
              className="p-8 rounded-xl border"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <div className="flex items-start mb-6">
                <div className="p-2 rounded-lg mr-4" style={{ backgroundColor: 'var(--color-primary)' }}>
                  <DocumentTextIcon className="w-5 h-5" style={{ color: 'var(--color-primary-contrast)' }} />
                </div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{section.title}</h2>
              </div>
              <div className="pl-14">
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="mb-4" style={{ color: 'var(--color-text-muted)' }}>
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
          className="mt-16 p-8 rounded-xl border"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Policy Updates</h2>
          <p className="mb-4" style={{ color: 'var(--color-text-muted)' }}>
            We may update this policy periodically to reflect changes in our practices or legal requirements. 
            Significant changes will be communicated through email or platform notifications.
          </p>
          <p style={{ color: 'var(--color-text-muted)' }}>
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
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Privacy Questions?</h3>
          <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>
            Contact our Data Protection Officer at <span style={{ color: 'var(--color-primary)' }}>privacy@urbanrealty360.com</span>
          </p>
          <button 
            className="font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-primary-contrast)'
            }}
          >
            Contact Privacy Team
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;