import React from 'react';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-12 h-12">
        {/* Puntos que forman el círculo */}
        <div className="absolute inset-0 animate-spin">
          {[...Array(8)].map((_, i) => {
            const angle = (i * 360) / 8;
            return (
              <span
                key={i}
                className="absolute w-2 h-2 bg-brand-700 dark:bg-brand-500 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${angle}deg) translateY(-20px) translateX(-50%)`,
                  transformOrigin: 'center',
                }}
              ></span>
            );
          })}
        </div>
      </div>
    </div>
  );
};


export default Loading