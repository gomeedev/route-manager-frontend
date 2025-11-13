import React, { useState, useEffect } from 'react';

const AnimatedText = ({ text, delay = 1.6, className = "text-md text-gray-500 mt-2" }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);

    // Esperar el delay inicial antes de comenzar a escribir
    const initialTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex < text.length) {
            setDisplayedText((prev) => prev + text[prevIndex]);
            return prevIndex + 1;
          } else {
            clearInterval(interval);
            return prevIndex;
          }
        });
      }, 30); // 30ms entre cada carácter

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(initialTimer);
  }, [text, delay]);

  return (
    <p className={className}>
      <span className="inline-block relative">
        {displayedText}
        {currentIndex < text.length && (
          <span 
            className="inline-block w-0.5 h-4 bg-gray-400 dark:bg-gray-500 ml-0.5 align-middle"
            style={{
              animation: 'blink 1s step-end infinite'
            }}
          />
        )}
      </span>
      
      <style>{`
        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </p>
  );
};

export default AnimatedText;