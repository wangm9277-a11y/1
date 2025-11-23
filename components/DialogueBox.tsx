import React, { useState, useEffect } from 'react';
import { PixelCard } from './PixelCard';

interface DialogueBoxProps {
  text: string;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 30); // Typing speed

    return () => clearInterval(timer);
  }, [text]);

  return (
    <div className="w-full max-w-4xl mx-auto mt-4">
      <PixelCard variant="dark">
        <div className="font-bold pixel-font-zh text-xl md:text-2xl leading-relaxed min-h-[100px] tracking-wide text-white">
          <div className="mb-2">
            <span className="bg-yellow-600 text-black px-2 py-1 text-base md:text-lg border-2 border-white shadow-[2px_2px_0_0_#fff] inline-block mr-2">
              ▶ 患者主诉
            </span>
          </div>
          <div className="drop-shadow-[0_2px_0_rgba(0,0,0,1)]">
            {displayedText}
            <span className="animate-pulse text-yellow-400 font-black ml-1">_</span>
          </div>
        </div>
      </PixelCard>
    </div>
  );
};