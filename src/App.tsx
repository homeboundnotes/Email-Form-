import React, { useState, useEffect } from 'react';
import EmailForm from './components/EmailForm';

function App() {
  const [isGlowing, setIsGlowing] = useState(false);
  const [showGlow, setShowGlow] = useState(false);

  const handleIconClick = () => {
    if (!isGlowing) {
      setIsGlowing(true);
      setShowGlow(true);
      
      // Play connection sound if available
      const audio = new Audio('/connect-sound.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore audio errors (file might not exist or autoplay blocked)
      });
      
      // Remove glow after animation completes
      setTimeout(() => {
        setShowGlow(false);
        setIsGlowing(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      {/* Background glow effect */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${
        showGlow ? 'opacity-30' : 'opacity-0'
      }`}>
        <div className="glow-effect absolute inset-0" />
      </div>
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        {/* Logo/Icon */}
        <div 
          onClick={handleIconClick}
          className={`mb-12 p-3 rounded-full border cursor-pointer transition-all duration-1500 ${
            showGlow 
              ? 'icon-glow border-amber-400 bg-white' 
              : 'border-gray-300 bg-white hover:border-gray-400'
          }`} 
          style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
        >
          <div className={`w-8 h-8 rounded-full border transition-all duration-1500 ${
            showGlow ? 'border-amber-500' : 'border-gray-400'
          }`} style={{ 
            transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }} />
        </div>

        {/* Main heading */}
        <h1 className="text-3xl md:text-4xl font-light mb-6 text-center text-gray-900">
          Homebound
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg font-light mb-3 text-center max-w-2xl text-gray-600">
          Something thoughtful is coming.
        </p>

        {/* Expected launch date */}
        <p className="text-sm font-light mb-12 text-center text-gray-500">
          Expected launch: Spring 2025
        </p>

        {/* Email form */}
        <EmailForm isGlowing={isGlowing} />

        {/* Contact */}
        <div className="mt-16 text-center">
          <p className="text-xs mb-2 text-gray-500">
            Questions? Reach out to us
          </p>
          <a 
            href="mailto:reachhomebound@gmail.com" 
            className="text-xs font-medium text-gray-700 hover:text-gray-900 hover:underline transition-colors"
          >
            reachhomebound@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;