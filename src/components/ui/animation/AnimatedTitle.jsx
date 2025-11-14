import React, { useState, useEffect } from 'react';

const AnimatedTitle = ({ text = "Bienvenido/a...", delay = 0.1 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [charStates, setCharStates] = useState([]);

  useEffect(() => {
    // Inicializar estados de caracteres
    setCharStates(text.split('').map(() => false));
    
    // Activar animación después del delay
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Activar cada carácter con un pequeño delay
      text.split('').forEach((_, index) => {
        setTimeout(() => {
          setCharStates(prev => {
            const newStates = [...prev];
            newStates[index] = true;
            return newStates;
          });
        }, index * 25); // 25ms entre cada carácter
      });
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [text, delay]);

  return (
    <p className="text-3xl font-bold text-gray-800 dark:text-white overflow-hidden">
      <span className="inline-block">
        {text.split('').map((char, index) => (
          <span
            key={index}
            className="inline-block relative"
            style={{
              opacity: charStates[index] ? 1 : 0,
              transform: charStates[index] ? 'translateY(0) scale(1)' : 'translateY(15px) scale(0.8)',
              filter: charStates[index] ? 'blur(0px)' : 'blur(4px)',
              transition: `all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.025}s`,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
            {charStates[index] && (
              <span
                className="absolute inset-0 opacity-0"
                style={{
                  animation: `glow 0.8s ease-out ${index * 0.05}s`,
                }}
              />
            )}
          </span>
        ))}
      </span>
      
      <style>{`
        @keyframes glow {
          0% {
            opacity: 0.6;
            filter: blur(5px) brightness(1.8);
          }
          100% {
            opacity: 0;
            filter: blur(10px) brightness(1);
          }
        }
      `}</style>
    </p>
  );
};

export default AnimatedTitle;