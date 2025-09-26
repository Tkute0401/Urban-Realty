"use client";

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ComingSoonPopup = ({ isOpen, onClose }) => {

  // Disable scrolling when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Handle closing popup and redirecting to previous page
  const handleClose = () => {
    onClose(); // Call the original onClose function
    
    // Use browser's back functionality
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback: redirect to home page if no history
      window.location.href = '/';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] overflow-y-auto"
        >
          {/* Blurred background overlay */}
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-md"
            onClick={handleClose} // Updated to use handleClose
          />
          
          {/* Creative coming soon card */}
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative transform overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-bg-dark)] to-[#0c2327] p-8 text-left shadow-xl border border-[var(--color-primary)]/30"
            >
              {/* Close button */}
              <button
                onClick={handleClose} // Updated to use handleClose
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              
              {/* Creative content */}
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#78cadc]/10 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-8 w-8 text-[var(--color-primary)]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Exciting Things Are Coming!
                </h3>
                <div className="mt-2">
                  <p className="text-sm sm:text-base text-white/80 mb-6">
                    We&apos;re working hard to bring you this amazing feature. 
                    Stay tuned for updates - it&apos;ll be worth the wait!
                  </p>
                </div>
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleClose} // Updated to use handleClose
                    className="inline-flex items-center rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-bg-dark)] hover:bg-[var(--color-primary-hover)] transition-colors"
                  >
                    Got it!
                  </button>
                </div>
                <div className="mt-8 pt-4 border-t border-[#78cadc]/20">
                  <p className="text-xs text-[var(--color-primary)]/70">
                    Want early access? Contact us at info@urbanrealty360.com
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ComingSoonPopup;