// import { motion } from "framer-motion";
// import { ScaleIcon, DocumentTextIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

// const TermsConditions = () => {
//   const sections = [
//     {
//       title: "Acceptance of Terms",
//       content: [
//         "By accessing or using Urban Realty 360's services, you agree to be bound by these Terms. If you disagree with any part, you may not access our services.",
//         "We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance."
//       ]
//     },
//     {
//       title: "User Responsibilities",
//       content: [
//         "You agree to:",
//         "- Provide accurate and current information",
//         "- Maintain the security of your account credentials",
//         "- Use services only for lawful purposes",
//         "- Not engage in fraudulent, misleading, or harmful activities",
//         "- Comply with all applicable real estate laws and regulations"
//       ]
//     },
//     {
//       title: "Property Listings",
//       content: [
//         "All property information is provided by third parties. While we verify data, we cannot guarantee its accuracy.",
//         "Urban Realty 360 is not responsible for:",
//         "- Misrepresented property conditions",
//         "- Changes made after publication",
//         "- Transactions between buyers and sellers",
//         "- Agent-client relationships"
//       ]
//     },
//     {
//       title: "Intellectual Property",
//       content: [
//         "All platform content (logos, text, graphics, interfaces) is owned by Urban Realty 360 and protected by copyright.",
//         "You may not:",
//         "- Reproduce, modify, or distribute our content",
//         "- Use our branding without written permission",
//         "- Reverse engineer or copy platform features"
//       ]
//     },
//     {
//       title: "Limitation of Liability",
//       content: [
//         "Urban Realty 360 shall not be liable for:",
//         "- Any direct/indirect damages from service use",
//         "- Errors or interruptions in service",
//         "- Unauthorized access to user data",
//         "- Third-party actions or content",
//         "Our total liability is limited to fees paid for services."
//       ]
//     }
//   ];

//   return (
//     <div className="bg-[#08171A] text-white min-h-screen">
//       {/* Hero Section */}
//       <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/30 z-10" />
//         <img 
//           src="/terms-con-2.jpg" 
//           alt="Terms & Conditions" 
//           className="absolute inset-0 w-full h-full object-cover"
//         />
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="relative z-20 text-center px-4"
//         >
//           <div className="flex items-center justify-center mb-4">
//             <ScaleIcon className="w-10 h-10 text-[#78cadc] mr-3" />
//             <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-poppins">
//               Terms & <span className="text-[#78cadc]">Conditions</span>
//             </h1>
//           </div>
//           <p className="text-lg sm:text-xl max-w-2xl mx-auto text-gray-300">
//             Effective: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
//           </p>
//         </motion.div>
//       </section>

//       {/* Terms Content */}
//       <section className="py-16 px-4 sm:px-8 max-w-5xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           transition={{ duration: 0.8 }}
//           className="mb-12 text-center"
//         >
//           <p className="text-gray-400">
//             These Terms govern your use of Urban Realty 360's platform and services. 
//             Please read them carefully before accessing our resources or engaging with our professionals.
//           </p>
//         </motion.div>

//         <div className="space-y-12">
//           {sections.map((section, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//               viewport={{ once: true }}
//               className="bg-[#0c2327] p-8 rounded-xl border border-[#78cadc]/20"
//             >
//               <div className="flex items-start mb-6">
//                 <div className="bg-[#78cadc] p-2 rounded-lg mr-4">
//                   <ClipboardDocumentCheckIcon className="w-5 h-5 text-[#08171A]" />
//                 </div>
//                 <h2 className="text-2xl font-bold">{section.title}</h2>
//               </div>
//               <div className="pl-14">
//                 {section.content.map((paragraph, pIndex) => (
//                   <p key={pIndex} className="text-gray-300 mb-4">
//                     {paragraph}
//                   </p>
//                 ))}
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Governing Law */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           transition={{ duration: 0.8, delay: 0.4 }}
//           className="mt-16 bg-[#0c2327] p-8 rounded-xl border border-[#78cadc]/20"
//         >
//           <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
//           <p className="text-gray-300">
//             These Terms shall be governed by the laws of the State of Delaware, without regard to conflict of law principles. 
//             Any disputes shall be resolved in the courts of Wilmington, Delaware.
//           </p>
//         </motion.div>

//         {/* Acceptance */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           transition={{ duration: 0.8, delay: 0.6 }}
//           className="mt-12 text-center"
//         >
//           <div className="inline-flex items-center text-gray-400 mb-6">
//             <DocumentTextIcon className="w-5 h-5 mr-2 text-[#78cadc]" />
//             <span>By using our services, you acknowledge reading and agreeing to these Terms</span>
//           </div>
//         </motion.div>
//       </section>
//     </div>
//   );
// };

// export default TermsConditions;

import { motion } from "framer-motion";
import { 
  ScaleIcon, 
  DocumentTextIcon, 
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
  UserIcon,
  HomeIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  LockClosedIcon
} from "@heroicons/react/24/outline";
import { useEffect } from "react";

const TermsConditions = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const sections = [
    {
      title: "Acceptance of Terms",
      icon: <ShieldCheckIcon className="w-5 h-5 text-[#08171A]" />,
      content: [
        "By accessing or using Urban Realty 360's services, you agree to be bound by these Terms and Conditions. If you do not agree with any part, you must not use our services.",
        "We reserve the right to modify these terms at any time. Your continued use after changes constitutes acceptance of the modified terms."
      ]
    },
    {
      title: "Eligibility & User Responsibilities",
      icon: <UserIcon className="w-5 h-5 text-[#08171A]" />,
      content: [
        "Services are available only to persons who can form legally binding contracts under applicable law.",
        "You agree to:",
        "- Provide accurate and current information in all forms",
        "- Maintain confidentiality of your account credentials",
        "- Use services only for lawful purposes related to real estate",
        "- Not engage in fraudulent, misleading, or harmful activities",
        "- Comply with all applicable real estate laws and regulations",
        "- Not use our platform for unauthorized commercial purposes"
      ]
    },
    {
      title: "Property Listings & Content",
      icon: <HomeIcon className="w-5 h-5 text-[#08171A]" />,
      content: [
        "All property information is provided by third parties. While we verify data, we cannot guarantee its accuracy or completeness.",
        "Urban Realty 360 is not responsible for:",
        "- Misrepresented property conditions or details",
        "- Changes made to listings after publication",
        "- Transactions between buyers and sellers",
        "- Agent-client relationships or agreements",
        "- Any false information provided by users",
        "Listings must not contain:",
        "- Discriminatory language",
        "- False or misleading information",
        "- Duplicate postings for the same property"
      ]
    },
    {
      title: "Intellectual Property Rights",
      icon: <DocumentTextIcon className="w-5 h-5 text-[#08171A]" />,
      content: [
        "All platform content (logos, text, graphics, interfaces, software) is owned by Urban Realty 360 and protected by copyright and trademark laws.",
        "You may not:",
        "- Reproduce, modify, or distribute our content without permission",
        "- Use our branding or trademarks without written consent",
        "- Reverse engineer, decompile, or disassemble any platform components",
        "- Create derivative works based on our platform",
        "You retain ownership of content you post, but grant us a worldwide license to use, display, and distribute it."
      ]
    },
    {
      title: "Payments & Refunds",
      icon: <CreditCardIcon className="w-5 h-5 text-[#08171A]" />,
      content: [
        "Premium services may require payment of fees as described on our pricing page.",
        "All fees are non-refundable except as required by law or at our discretion.",
        "You are responsible for all taxes associated with your use of our services.",
        "We may change our fee structure with 30 days notice to existing subscribers."
      ]
    },
    {
      title: "Privacy & Data Protection",
      icon: <LockClosedIcon className="w-5 h-5 text-[#08171A]" />,
      content: [
        "Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use your information.",
        "We implement security measures to protect your data, but cannot guarantee absolute security.",
        "You consent to receiving communications from us electronically, including promotional offers."
      ]
    },
    {
      title: "Limitation of Liability",
      icon: <ScaleIcon className="w-5 h-5 text-[#08171A]" />,
      content: [
        "Urban Realty 360 shall not be liable for:",
        "- Any direct, indirect, incidental, or consequential damages",
        "- Errors, interruptions, or delays in service",
        "- Unauthorized access to or alteration of your data",
        "- Third-party actions, content, or services",
        "- Property disputes or transaction outcomes",
        "Our total liability is limited to fees you paid for services in the past 12 months."
      ]
    },
    {
      title: "Termination & Suspension",
      icon: <ClipboardDocumentCheckIcon className="w-5 h-5 text-[#08171A]" />,
      content: [
        "We may suspend or terminate your account at any time for violations of these Terms.",
        "You may terminate your account by contacting customer support.",
        "Upon termination:",
        "- Your right to use our services immediately ceases",
        "- We may retain your data as needed for legal compliance",
        "- Any outstanding payments remain due"
      ]
    }
  ];

  return (
    <div className="bg-[#08171A] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/20 z-10" />
        <img 
          src="/terms-con-2.jpg" 
          alt="Terms & Conditions" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4"
        >
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="bg-[#78cadc] p-3 rounded-full mb-4">
              <ScaleIcon className="w-10 h-10 text-[#08171A]" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-poppins">
              Terms & <span className="text-[#78cadc]">Conditions</span>
            </h1>
          </div>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto text-gray-300">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>
      </section>

      {/* Terms Content */}
      <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <p className="text-gray-400 max-w-4xl mx-auto text-lg leading-relaxed">
            These Terms of Service govern your use of Urban Realty 360's website, mobile applications, 
            and related services. By accessing our platform, you agree to comply with these terms, 
            our Privacy Policy, and all applicable laws and regulations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#0c2327] p-8 rounded-xl border border-[#78cadc]/20 hover:border-[#78cadc]/50 transition-all"
            >
              <div className="flex items-start mb-6">
                <div className="bg-[#78cadc] p-2 rounded-lg mr-4">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold">{section.title}</h2>
              </div>
              <div className="pl-14 space-y-4">
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-gray-300">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Legal Sections */}
        <div className="mt-16 space-y-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-[#0c2327] p-8 rounded-xl border border-[#78cadc]/20"
          >
            <h2 className="text-2xl font-bold mb-6">Governing Law & Dispute Resolution</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, 
                without regard to its conflict of law provisions.
              </p>
              <p>
                Any disputes arising under these Terms shall be resolved through binding arbitration in Wilmington, Delaware, 
                in accordance with the rules of the American Arbitration Association. The arbitrator's award shall be final and binding.
              </p>
              <p>
                Notwithstanding the above, we may seek injunctive relief in any court of competent jurisdiction to protect 
                our intellectual property rights or prevent unauthorized use of our services.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-[#0c2327] p-8 rounded-xl border border-[#78cadc]/20"
          >
            <h2 className="text-2xl font-bold mb-6">General Provisions</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                These Terms constitute the entire agreement between you and Urban Realty 360 regarding our services, 
                superseding any prior agreements.
              </p>
              <p>
                If any provision of these Terms is found invalid or unenforceable, the remaining provisions will remain in full effect.
              </p>
              <p>
                Our failure to enforce any right or provision will not be considered a waiver of those rights.
              </p>
              <p>
                You may not assign or transfer these Terms without our prior written consent. We may assign our rights 
                without restriction.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Acceptance */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center justify-center bg-[#0c2327] px-6 py-4 rounded-xl border border-[#78cadc]/20">
            <DocumentTextIcon className="w-6 h-6 mr-3 text-[#78cadc]" />
            <span className="text-gray-300">
              By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </span>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default TermsConditions;