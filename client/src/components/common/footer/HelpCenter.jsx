import { useState } from "react";
import { motion } from "framer-motion";
import { LifebuoyIcon, DocumentTextIcon, PhoneIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const HelpCenter = () => {
  // State for role selection and user question
  const [selectedRole, setSelectedRole] = useState(null);
  const [userQuestion, setUserQuestion] = useState("");
  const [submittedQuestions, setSubmittedQuestions] = useState([]);

  // Support options
  const supportOptions = [
    {
      icon: <DocumentTextIcon className="w-8 h-8 text-[#78cadc]" />,
      title: "Knowledge Base",
      description: "Browse our comprehensive library of articles and guides",
      cta: "Explore Articles"
    },
    {
      icon: <ChatBubbleLeftRightIcon className="w-8 h-8 text-[#78cadc]" />,
      title: "Live Chat",
      description: "Instant messaging with our support team (24/7 availability)",
      cta: "Start Chat"
    },
    {
      icon: <PhoneIcon className="w-8 h-8 text-[#78cadc]" />,
      title: "Phone Support",
      description: "Speak directly with a real estate specialist",
      cta: "Call Now"
    }
  ];

  const support = [
    { path: "/contact", label: "Contact Support" }
  ];

  // Role options
  const roles = [
    { id: "buyer", label: "Buyer" },
    { id: "owner", label: "Owner" },
    { id: "agent", label: "Agent" }
  ];

  // FAQ data organized by role
  const faqs = {
    buyer: [
      {
        question: "How do I schedule a property viewing?",
        answer: "Click on the 'Schedule Visit' button on any property listing to see available time slots."
      },
      {
        question: "What financing options are available?",
        answer: "We partner with multiple lenders offering competitive mortgage rates."
      }
    ],
    owner: [
      {
        question: "How do I list my property?",
        answer: "Go to your dashboard and select 'Add Property' to begin the listing process."
      },
      {
        question: "What documents are required?",
        answer: "You'll need ownership documents, ID proof, and recent utility bills."
      }
    ],
    agent: [
      {
        question: "How do I register as an agent?",
        answer: "Submit your license details on our 'Agent Registration' page."
      },
      {
        question: "What tools are available?",
        answer: "Agents get access to CRM, lead management, and analytics tools."
      }
    ],
    common: [
      {
        question: "How do I create an account?",
        answer: "Click 'Register' at the top right corner to create your account."
      },
      {
        question: "Is there a mobile app?",
        answer: "Yes, our app is available on both iOS and Android platforms."
      }
    ]
  };

  // Combine common FAQs with role-specific FAQs
  const filteredFaqs = [
    ...faqs.common,
    ...(selectedRole ? faqs[selectedRole] : [])
  ];

  // Handle question submission
  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    if (userQuestion.trim()) {
      setSubmittedQuestions([...submittedQuestions, userQuestion]);
      setUserQuestion("");
      // Here you would typically send the question to your backend
    }
  };

  return (
    <div className="bg-[#08171A] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/30 z-10" />
        <img 
          src="/help-center.jpg" 
          alt="Help Center" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4"
        >
          <div className="flex items-center justify-center mb-4">
            <LifebuoyIcon className="w-10 h-10 text-[#78cadc] mr-3" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-poppins">
              Help <span className="text-[#78cadc]">Center</span>
            </h1>
          </div>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto text-gray-300 mb-8">
            Find answers, guides, and expert support for all your real estate needs
          </p>
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search help articles..."
              className="w-full bg-[#0c2327]/90 border border-[#78cadc]/30 rounded-full px-6 py-4 pr-14 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#78cadc]"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#78cadc] p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#08171A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Support Options */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {supportOptions.map((option, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-[#0c2327] p-8 rounded-xl border border-[#78cadc]/20 hover:border-[#78cadc]/50 transition-all"
            >
              <div className="mb-4">{option.icon}</div>
              <h3 className="text-xl font-bold mb-2">{option.title}</h3>
              <p className="text-gray-400 mb-6">{option.description}</p>
              <button className="text-[#78cadc] font-semibold hover:text-[#8DD9E5] transition-colors flex items-center">
                {option.cta}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Updated FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center font-poppins">
            Frequently Asked <span className="text-[#78cadc]">Questions</span>
          </h2>

          {/* Role Selection */}
          <div className="mb-8 bg-[#0c2327] p-6 rounded-xl border border-[#78cadc]/20">
            <h3 className="text-xl font-bold mb-4">Select your role to see relevant questions:</h3>
            <div className="flex flex-wrap gap-3">
              {roles.map((role) => (
                <motion.button
                  key={role.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedRole === role.id
                      ? 'bg-[#78cadc] text-[#08171A] border-[#78cadc]'
                      : 'bg-transparent border-[#78cadc]/50 text-[#78cadc] hover:bg-[#78cadc]/10'
                  }`}
                  onClick={() => setSelectedRole(selectedRole === role.id ? null : role.id)}
                >
                  {role.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* FAQ List */}
          <div className="space-y-4 mb-12">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#0c2327] rounded-xl overflow-hidden border border-[#78cadc]/20"
              >
                <details className="group">
                  <summary className="list-none p-6 cursor-pointer flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{faq.question}</h3>
                    <svg className="w-5 h-5 text-[#78cadc] transform group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 pt-2 text-gray-300">
                    {faq.answer}
                  </div>
                </details>
              </motion.div>
            ))}
          </div>

          {/* Ask Question Form */}
          <div className="bg-[#0c2327] p-6 rounded-xl border border-[#78cadc]/20">
            <h3 className="text-xl font-bold mb-4">Can't find what you're looking for?</h3>
            <form onSubmit={handleQuestionSubmit}>
              <div className="mb-4">
                <label htmlFor="userQuestion" className="block text-sm font-medium text-gray-300 mb-2">
                  Ask your question
                </label>
                <textarea
                  id="userQuestion"
                  rows="3"
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  className="w-full bg-[#08171A] border border-[#78cadc]/30 rounded-lg px-4 py-3 focus:border-[#78cadc] focus:ring-1 focus:ring-[#78cadc] outline-none transition-all"
                  placeholder="Type your question here..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-[#78cadc] hover:bg-[#8DD9E5] text-[#08171A] font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
                disabled={!userQuestion.trim()}
              >
                Submit Question
              </button>
            </form>

            {/* Submitted Questions (for demo purposes) */}
            {submittedQuestions.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">Your submitted questions:</h4>
                <ul className="space-y-2">
                  {submittedQuestions.map((question, index) => (
                    <li key={index} className="text-gray-300 border-l-2 border-[#78cadc] pl-3 py-1">
                      {question}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Additional Help */}
      <section className="py-16 px-4 sm:px-8 bg-[#0c2327]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 font-poppins">Still Need Help?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Our dedicated support team is available around the clock to assist you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {support.map((item, index) => (
              <Link key={index} to={item.path}>
                <button className="bg-[#78cadc] hover:bg-[#8DD9E5] text-[#08171A] font-bold py-3 px-8 rounded-lg transition-colors shadow-lg">
                  {item.label}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenter;