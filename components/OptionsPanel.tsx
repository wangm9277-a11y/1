import React, { useMemo } from 'react';
import { TcmCase } from '../types';

interface OptionsPanelProps {
  tcmCase: TcmCase;
  onSelect: (selected: string) => void;
  disabled: boolean;
}

export const OptionsPanel: React.FC<OptionsPanelProps> = ({ tcmCase, onSelect, disabled }) => {
  // Randomize options
  const shuffledOptions = useMemo(() => {
    const all = [...tcmCase.wrongOptions, tcmCase.correctDiagnosis];
    return all.sort(() => Math.random() - 0.5);
  }, [tcmCase]);

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {shuffledOptions.map((option, idx) => (
        <button
          key={idx}
          disabled={disabled}
          onClick={() => onSelect(option)}
          className={`
            pixel-border p-4 text-left transition-all relative group
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 hover:bg-amber-100 active:translate-y-1 active:shadow-none cursor-pointer bg-white'}
            shadow-[4px_4px_0_0_rgba(0,0,0,1)]
          `}
        >
          <div className="flex items-center">
             <span className="bg-gray-800 text-white w-8 h-8 flex items-center justify-center font-bold mr-3 pixel-border text-sm">
               {String.fromCharCode(65 + idx)}
             </span>
             <span className="text-lg font-bold text-gray-900 pixel-font-zh">{option}</span>
          </div>
          
          {!disabled && (
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-600 pointer-events-none"></div>
          )}
        </button>
      ))}
    </div>
  );
};
