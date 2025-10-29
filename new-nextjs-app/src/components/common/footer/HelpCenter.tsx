"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LifebuoyIcon, DocumentTextIcon, PhoneIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import Link from 'next/link';
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FieldIndicator from '@/components/ui/FieldIndicator';

const HelpCenter = () => {

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);
  
  // State for role selection and user question
  const [selectedRole, setSelectedRole] = useState(null);
  const [submittedQuestions, setSubmittedQuestions] = useState([]);

  const schema = z.object({
    userQuestion: z.string().min(5, "Please enter at least 5 characters"),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { userQuestion: "" }
  });

  // Support options
  const supportOptions = [
    {
      icon: <DocumentTextIcon className="w-8 h-8 text-[var(--color-primary)]" />,
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
  const handleQuestionSubmit = async (data) => {
    try {
      setSubmittedQuestions([...submittedQuestions, data.userQuestion]);
      await new Promise((r) => setTimeout(r, 300));
      reset();
    } catch (_) {
      // Global error handling via toast boundary
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40 z-10" />
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
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
            <LifebuoyIcon className="w-10 h-10 mb-2 sm:mb-0 sm:mr-3" style={{ color: '#F76B1C' }} />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-poppins text-white">
              Help <span style={{ color: '#F76B1C' }}>Center</span>
            </h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 px-4 text-gray-200">
            Find answers, guides, and expert support for all your real estate needs
          </p>
          <div className="relative max-w-xl mx-auto px-4">
            <input
              type="text"
              placeholder="Search help articles..."
              className="w-full rounded-full px-6 py-4 pr-14 focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-primary)',
                color: 'var(--color-text-primary)'
              }}
            />
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-primary-contrast)' }}>
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
              className="p-8 rounded-xl border transition-all"
              style={{ 
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)'
              }}
            >
              <div className="mb-4">{option.icon}</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>{option.title}</h3>
              <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>{option.description}</p>
              <button 
                className="font-semibold transition-colors flex items-center"
                style={{ color: 'var(--color-primary)' }}
              >
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
          <h2 className="text-3xl font-bold mb-8 text-center font-poppins" style={{ color: 'var(--color-text-primary)' }}>
            Frequently Asked <span style={{ color: 'var(--color-primary)' }}>Questions</span>
          </h2>

          {/* Role Selection */}
          <div className="mb-8 p-6 rounded-xl border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Select your role to see relevant questions:</h3>
            <div className="flex flex-wrap gap-3">
              {roles.map((role) => (
                <motion.button
                  key={role.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg border transition-colors"
                  style={{
                    backgroundColor: selectedRole === role.id ? 'var(--color-primary)' : 'transparent',
                    color: selectedRole === role.id ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                    borderColor: 'var(--color-primary)'
                  }}
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
                className="rounded-xl overflow-hidden border"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              >
                <details className="group">
                  <summary className="list-none p-6 cursor-pointer flex justify-between items-center">
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>{faq.question}</h3>
                    <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-primary)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 pt-2" style={{ color: 'var(--color-text-muted)' }}>
                    {faq.answer}
                  </div>
                </details>
              </motion.div>
            ))}
          </div>

          {/* Ask Question Form */}
          <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Can&apos;t find what you&apos;re looking for?</h3>
            <form onSubmit={handleSubmit(handleQuestionSubmit)}>
              <div className="mb-4">
                <FieldIndicator required helperText="Describe your question or issue in detail" />
                <label htmlFor="userQuestion" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>
                  Ask your question
                </label>
                <textarea
                  id="userQuestion"
                  rows={3}
                  {...register("userQuestion")}
                  className="w-full rounded-lg px-4 py-3 focus:outline-none transition-all"
                  style={{
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)'
                  }}
                  placeholder="Type your question here..."
                ></textarea>
                {errors.userQuestion && (
                  <p className="text-sm mt-2" role="alert" style={{ color: 'var(--color-error)' }}>{errors.userQuestion.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="font-bold py-3 px-8 rounded-lg transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-contrast)'
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Question"}
              </button>
            </form>

            {/* Submitted Questions (for demo purposes) */}
            {submittedQuestions.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Your submitted questions:</h4>
                <ul className="space-y-2">
                  {submittedQuestions.map((question, index) => (
                    <li key={index} className="border-l-2 pl-3 py-1" style={{ color: 'var(--color-text-muted)', borderLeftColor: 'var(--color-primary)' }}>
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
      <section className="py-16 px-4 sm:px-8" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 font-poppins" style={{ color: 'var(--color-text-primary)' }}>Still Need Help?</h2>
          <p className="mb-8 max-w-2xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>
            Our dedicated support team is available around the clock to assist you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {support.map((item, index) => (
              <Link key={index} href={item.path}>
                <button 
                  className="font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-primary-contrast)'
                  }}
                >
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