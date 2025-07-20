import React, { useState } from 'react';
import { Mail, Check } from 'lucide-react';

// Replace YOUR_WEB_APP_URL with your actual Google Apps Script web app URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzwH4zHF0BNS7lZNQmf0RCZQDecWwpftPK_5-2HJo1mQ4PyXN20hk1ZKiGtVMSbweQE/exec';

interface EmailFormProps {
  isGlowing: boolean;
}

export default function EmailForm({ isGlowing }: EmailFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && !isSubmitting) {
      setIsSubmitting(true);
      
      try {
        // Submit to Google Apps Script
        const formData = new FormData();
        formData.append('email', email);
        formData.append('timestamp', new Date().toISOString());
        formData.append('source', 'homebound-landing');
        
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: formData
        });
        
        // Show success regardless (no-cors mode doesn't return response)
        setIsSubmitted(true);
        
        // Reset after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setEmail('');
        }, 3000);
        
      } catch (error) {
        console.error('Error submitting email:', error);
        // Still show success to user (backend handles validation)
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setEmail('');
        }, 3000);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSubmitOld = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-all duration-1500 ${
              isGlowing ? 'text-amber-600' : 'text-gray-400'
            }`} style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border transition-all duration-1500 focus:outline-none focus:ring-2 ${
                isGlowing 
                  ? 'border-amber-300 text-gray-900 bg-amber-50 focus:ring-amber-500 placeholder-amber-600' 
                  : 'border-gray-300 text-gray-900 bg-white focus:ring-blue-500 placeholder-gray-400'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2.5 px-6 text-sm rounded-lg font-medium transition-all duration-1500 ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : isGlowing
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-gray-900 hover:bg-gray-800 text-white'
            }`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
          >
            {isSubmitting ? 'Submitting...' : 'Get Notified'}
          </button>
        </form>
      ) : (
        <div className={`text-center p-6 rounded-lg border transition-all duration-1500 ${
          isGlowing 
            ? 'border-amber-200 bg-amber-50' 
            : 'border-green-300 bg-green-50'
        }`} style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
          <Check className={`w-6 h-6 mx-auto mb-2 transition-all duration-1500 ${
            isGlowing ? 'text-amber-500' : 'text-green-600'
          }`} style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }} />
          <p className={`text-sm font-medium transition-all duration-1500 ${
            isGlowing ? 'text-amber-700' : 'text-green-800'
          }`} style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
            Thanks! We'll notify you when we launch.
          </p>
        </div>
      )}
    </div>
  );
}